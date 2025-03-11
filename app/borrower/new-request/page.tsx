"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

export default function NewLoanRequest() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    projectName: "",
    loanAmount: "",
    loanTerm: "",
    comments: "",
  })

  const [documents, setDocuments] = useState({
    document1: null,
    document2: null,
    document3: null,
    document4: null,
    document5: null,
    document6: null,
    document7: null,
    document8: null,
    document9: null,
    document10: null,
    document11: null,
    additionalDocs: null,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, this would submit the form data to the server
    // For now, we'll simulate a successful submission and redirect

    router.push("/borrower/loan-requests")
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-purple-800 text-center">בקשת הלוואה</h1>
      <p className="mb-8 text-lg text-gray-700 text-center">אנא מלאו את המידע הבא כדי להגיש בקשה להלוואה:</p>

      <Card>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <Label htmlFor="projectName">שם הפרויקט:</Label>
                <Input
                  id="projectName"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  placeholder="הכנס שם פרויקט"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="loanAmount">סכום ההלוואה:</Label>
                <Input
                  id="loanAmount"
                  name="loanAmount"
                  type="number"
                  value={formData.loanAmount}
                  onChange={handleInputChange}
                  placeholder="הכנס סכום הלוואה מבוקש"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="loanTerm">משך החזר ההלוואה:</Label>
                <Input
                  id="loanTerm"
                  name="loanTerm"
                  value={formData.loanTerm}
                  onChange={handleInputChange}
                  placeholder="הכנס משך החזר הלוואה"
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div className="mb-6 bg-purple-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-800 mb-4">העלאת מסמכים</h3>
              <p className="text-gray-700 mb-6">אנא העלה את המסמכים הבאים:</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="document1">נסח טאבו עדכני:</Label>
                  <div className="input-file-container mt-1">
                    <label htmlFor="document1">{documents.document1 ? documents.document1.name : "בחר קובץ"}</label>
                    <Input id="document1" name="document1" type="file" onChange={handleFileChange} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="document2">תקנון הבית המשותף:</Label>
                  <div className="input-file-container mt-1">
                    <label htmlFor="document2">{documents.document2 ? documents.document2.name : "בחר קובץ"}</label>
                    <Input id="document2" name="document2" type="file" onChange={handleFileChange} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="document3">הסכם התמ"א המקורי:</Label>
                  <div className="input-file-container mt-1">
                    <label htmlFor="document3">{documents.document3 ? documents.document3.name : "בחר קובץ"}</label>
                    <Input id="document3" name="document3" type="file" onChange={handleFileChange} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="document4">רשימת הפרויקטים של היזם:</Label>
                  <div className="input-file-container mt-1">
                    <label htmlFor="document4">{documents.document4 ? documents.document4.name : "בחר קובץ"}</label>
                    <Input id="document4" name="document4" type="file" onChange={handleFileChange} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="document5">תעודת התאגדות של החברה היזמית:</Label>
                  <div className="input-file-container mt-1">
                    <label htmlFor="document5">{documents.document5 ? documents.document5.name : "בחר קובץ"}</label>
                    <Input id="document5" name="document5" type="file" onChange={handleFileChange} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="document6">תוספות להסכם התמ"א:</Label>
                  <div className="input-file-container mt-1">
                    <label htmlFor="document6">{documents.document6 ? documents.document6.name : "בחר קובץ"}</label>
                    <Input id="document6" name="document6" type="file" onChange={handleFileChange} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="document7">סטטוס סרבנים - פרטיהם, פירוט תביעות ופירוט פסקי דין:</Label>
                  <div className="input-file-container mt-1">
                    <label htmlFor="document7">{documents.document7 ? documents.document7.name : "בחר קובץ"}</label>
                    <Input id="document7" name="document7" type="file" onChange={handleFileChange} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="document8">היתר בניה, לרבות בקשה לקבלת היתר ותיקונים לו:</Label>
                  <div className="input-file-container mt-1">
                    <label htmlFor="document8">{documents.document8 ? documents.document8.name : "בחר קובץ"}</label>
                    <Input id="document8" name="document8" type="file" onChange={handleFileChange} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="document9">סטטוס התנגדויות:</Label>
                  <div className="input-file-container mt-1">
                    <label htmlFor="document9">{documents.document9 ? documents.document9.name : "בחר קובץ"}</label>
                    <Input id="document9" name="document9" type="file" onChange={handleFileChange} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="document10">דו"ח אפס:</Label>
                  <div className="input-file-container mt-1">
                    <label htmlFor="document10">{documents.document10 ? documents.document10.name : "בחר קובץ"}</label>
                    <Input id="document10" name="document10" type="file" onChange={handleFileChange} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="document11">אישור ניהול חשבון:</Label>
                  <div className="input-file-container mt-1">
                    <label htmlFor="document11">{documents.document11 ? documents.document11.name : "בחר קובץ"}</label>
                    <Input id="document11" name="document11" type="file" onChange={handleFileChange} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <Label htmlFor="comments">הערות:</Label>
              <Textarea
                id="comments"
                name="comments"
                value={formData.comments}
                onChange={handleInputChange}
                placeholder="הוסף הערות לבקשת ההלוואה"
                rows={4}
                className="mt-1"
              />
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-purple-800 mb-4">מסמכים נוספים</h3>
              <p className="text-gray-700 mb-6">העלה מסמכים נוספים אם יש:</p>

              <div>
                <Label htmlFor="additionalDocs">בחר מסמכים נוספים להעלאה:</Label>
                <div className="input-file-container mt-1">
                  <label htmlFor="additionalDocs">{documents.additionalDocs ? "נבחרו קבצים" : "בחר קבצים"}</label>
                  <Input id="additionalDocs" name="additionalDocs" type="file" multiple onChange={handleFileChange} />
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <Button type="submit" size="lg">
                הגש בקשה
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

