'use client'

import type React from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function NewLoanRequest() {
  const API_BASE_URL = 'http://127.0.0.1:5000' // Change if needed
  const router = useRouter()
  const [loanData, setLoanData] = useState({
    projectName: '',
    projectAddress: '',
    projectType: '',
    loanAmount: '',
    comments: '',
  })

  const [documents, setDocuments] = useState({
    tabo_document: null,
    united_home_document: null,
    original_tama_document: null,
    project_list_document: null,
    company_crt_document: null,
    tama_addons_document: null,
    reject_status_document: null,
    building_permit: null,
    objection_status: null,
    zero_document: null,
    bank_account_confirm_document: null,
    additionalDocs: null,
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setLoanData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target
    if (files) {
      setDocuments((prev) => ({
        ...prev,
        [name]: files[0],
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Step 1: Create the loan
      const loanResponse = await fetch(`${API_BASE_URL}/loans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          project_name: loanData.projectName,
          project_type: loanData.projectType,
          address: loanData.projectAddress,
          amount: loanData.loanAmount,
        }),
      })

      if (!loanResponse.ok) {
        throw new Error('Failed to create loan')
      }

      const loanResult = await loanResponse.json()
      const loanId = loanResult.id // Get the loan ID from the response

      // Step 2: Upload files if any are selected
      const hasFiles = Object.values(documents).some((file) => file !== null)
      console.log('has files ' + hasFiles)
      console.log('loan id ' + loanId)

      if (hasFiles && loanId) {
        const formData = new FormData()
        formData.append('loan_id', loanId)

        // Filter out null files and append them to formData
        // Filter out null files and rename them using the key names
        Object.entries(documents).forEach(([key, file]) => {
          if (file) {
            const fileExtension = file.name.split('.').pop() // Get original file extension
            const newFileName = `${key}.${fileExtension}` // Rename file using key name
            const renamedFile = new File([file], newFileName, {
              type: file.type,
            })

            formData.append('files', renamedFile)
          }
        })
        const fileResponse = await fetch(`${API_BASE_URL}/file/upload_files`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: formData,
        })

        if (!fileResponse.ok) {
          console.error('Error uploading files:', await fileResponse.json())
        }
      }

      // Step 3: Redirect to loan requests page
      router.push('/borrower/dashboard')
    } catch (error) {
      console.error('Error submitting loan request:', error)
      // Here you could show an error message to the user
    }
  }

  return (
    <div>
      <h1 className='text-4xl font-bold mb-8 text-purple-800 text-center'>
        בקשת הלוואה
      </h1>
      <p className='mb-8 text-lg text-gray-700 text-center'>
        אנא מלאו את המידע הבא כדי להגיש בקשה להלוואה:
      </p>

      <Card>
        <CardContent className='p-8'>
          <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
              <div>
                <Label htmlFor='projectName'>שם הפרויקט:</Label>
                <Input
                  id='projectName'
                  name='projectName'
                  value={loanData.projectName}
                  onChange={handleInputChange}
                  placeholder='הכנס שם פרויקט'
                  required
                  className='mt-1'
                />
              </div>

              <div>
                <Label htmlFor='projectAddress'>כתובת הפרויקט:</Label>
                <Input
                  id='projectAddress'
                  name='projectAddress'
                  value={loanData.projectAddress}
                  onChange={handleInputChange}
                  placeholder='הכנס כתובת הפרויקט'
                  required
                  className='mt-1'
                />
              </div>

              <div>
                <Label htmlFor='projectType'>סוג הפרויקט:</Label>
                <Select
                  value={loanData.projectType}
                  onValueChange={(value) =>
                    setLoanData((prev) => ({
                      ...prev,
                      projectType: value,
                    }))
                  }>
                  <SelectTrigger id='projectType' className='mt-1'>
                    <SelectValue placeholder='בחר סוג פרויקט' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='projectType'>בחר סוג פרויקט</SelectItem>
                    <SelectItem value='מגורים'>מגורים</SelectItem>
                    <SelectItem value='מסחר'>מסחר</SelectItem>
                    <SelectItem value='בנייה עצמית'>בנייה עצמית</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor='loanAmount'>סכום ההלוואה:</Label>
                <Input
                  id='loanAmount'
                  name='loanAmount'
                  type='number'
                  value={loanData.loanAmount}
                  onChange={handleInputChange}
                  placeholder='הכנס סכום הלוואה מבוקש'
                  required
                  className='mt-1'
                />
              </div>
            </div>

            <div className='mb-6 bg-purple-50 rounded-lg p-6'>
              <h3 className='text-xl font-semibold text-purple-800 mb-4'>
                העלאת מסמכים
              </h3>
              <p className='text-gray-700 mb-6'>אנא העלה את המסמכים הבאים:</p>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div>
                  <Label htmlFor='tabo_document'>נסח טאבו עדכני:</Label>
                  <div className='input-file-container mt-1'>
                    <label htmlFor='tabo_document'>
                      {documents.tabo_document
                        ? documents.tabo_document.name
                        : 'בחר קובץ'}
                    </label>
                    <Input
                      id='tabo_document'
                      name='tabo_document'
                      type='file'
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor='united_home_document'>
                    תקנון הבית המשותף:
                  </Label>
                  <div className='input-file-container mt-1'>
                    <label htmlFor='united_home_document'>
                      {documents.united_home_document
                        ? documents.united_home_document.name
                        : 'בחר קובץ'}
                    </label>
                    <Input
                      id='united_home_document'
                      name='united_home_document'
                      type='file'
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor='original_tama_document'>
                    הסכם התמ"א המקורי:
                  </Label>
                  <div className='input-file-container mt-1'>
                    <label htmlFor='original_tama_document'>
                      {documents.original_tama_document
                        ? documents.original_tama_document.name
                        : 'בחר קובץ'}
                    </label>
                    <Input
                      id='original_tama_document'
                      name='original_tama_document'
                      type='file'
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor='project_list_document'>
                    רשימת הפרויקטים של היזם:
                  </Label>
                  <div className='input-file-container mt-1'>
                    <label htmlFor='project_list_document'>
                      {documents.project_list_document
                        ? documents.project_list_document.name
                        : 'בחר קובץ'}
                    </label>
                    <Input
                      id='project_list_document'
                      name='project_list_document'
                      type='file'
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor='company_crt_document'>
                    תעודת התאגדות של החברה היזמית:
                  </Label>
                  <div className='input-file-container mt-1'>
                    <label htmlFor='company_crt_document'>
                      {documents.company_crt_document
                        ? documents.company_crt_document.name
                        : 'בחר קובץ'}
                    </label>
                    <Input
                      id='company_crt_document'
                      name='company_crt_document'
                      type='file'
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor='tama_addons_document'>
                    תוספות להסכם התמ"א:
                  </Label>
                  <div className='input-file-container mt-1'>
                    <label htmlFor='tama_addons_document'>
                      {documents.tama_addons_document
                        ? documents.tama_addons_document.name
                        : 'בחר קובץ'}
                    </label>
                    <Input
                      id='tama_addons_document'
                      name='tama_addons_document'
                      type='file'
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor='reject_status_document'>
                    סטטוס סרבנים - פרטיהם, פירוט תביעות ופירוט פסקי דין:
                  </Label>
                  <div className='input-file-container mt-1'>
                    <label htmlFor='reject_status_document'>
                      {documents.reject_status_document
                        ? documents.reject_status_document.name
                        : 'בחר קובץ'}
                    </label>
                    <Input
                      id='reject_status_document'
                      name='reject_status_document'
                      type='file'
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor='building_permit'>
                    היתר בניה, לרבות בקשה לקבלת היתר ותיקונים לו:
                  </Label>
                  <div className='input-file-container mt-1'>
                    <label htmlFor='building_permit'>
                      {documents.building_permit
                        ? documents.building_permit.name
                        : 'בחר קובץ'}
                    </label>
                    <Input
                      id='building_permit'
                      name='building_permit'
                      type='file'
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor='objection_status'>סטטוס התנגדויות:</Label>
                  <div className='input-file-container mt-1'>
                    <label htmlFor='objection_status'>
                      {documents.objection_status
                        ? documents.objection_status.name
                        : 'בחר קובץ'}
                    </label>
                    <Input
                      id='objection_status'
                      name='objection_status'
                      type='file'
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor='zero_document'>דו"ח אפס:</Label>
                  <div className='input-file-container mt-1'>
                    <label htmlFor='zero_document'>
                      {documents.zero_document
                        ? documents.zero_document.name
                        : 'בחר קובץ'}
                    </label>
                    <Input
                      id='zero_document'
                      name='zero_document'
                      type='file'
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor='bank_account_confirm_document'>
                    אישור ניהול חשבון:
                  </Label>
                  <div className='input-file-container mt-1'>
                    <label htmlFor='bank_account_confirm_document'>
                      {documents.bank_account_confirm_document
                        ? documents.bank_account_confirm_document.name
                        : 'בחר קובץ'}
                    </label>
                    <Input
                      id='bank_account_confirm_document'
                      name='bank_account_confirm_document'
                      type='file'
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='mb-6'>
              <Label htmlFor='comments'>הערות:</Label>
              <Textarea
                id='comments'
                name='comments'
                value={loanData.comments}
                onChange={handleInputChange}
                placeholder='הוסף הערות לבקשת ההלוואה'
                rows={4}
                className='mt-1'
              />
            </div>

            <div className='mb-6'>
              <h3 className='text-xl font-semibold text-purple-800 mb-4'>
                מסמכים נוספים
              </h3>
              <p className='text-gray-700 mb-6'>העלה מסמכים נוספים אם יש:</p>

              <div>
                <Label htmlFor='additionalDocs'>
                  בחר מסמכים נוספים להעלאה:
                </Label>
                <div className='input-file-container mt-1'>
                  <label htmlFor='additionalDocs'>
                    {documents.additionalDocs ? 'נבחרו קבצים' : 'בחר קבצים'}
                  </label>
                  <Input
                    id='additionalDocs'
                    name='additionalDocs'
                    type='file'
                    multiple
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>

            <div className='flex justify-center mt-8'>
              <Button type='submit' size='lg'>
                הגש בקשה
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
