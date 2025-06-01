'use client'

import type React from 'react'

import { getLoan } from '@/app/api/loans/getLoan'
import { Loan } from '@/app/api/loans/types'
import { DocumentItem } from '@/components/document-item'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import axios from 'axios'
import { Paperclip, Send } from 'lucide-react'
import { use, useEffect, useRef, useState } from 'react'

export default function LoanRequestDetails({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const [message, setMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [financiers, setFinanciers] = useState<any[]>([])
  const API_BASE_URL = 'http://127.0.0.1:5000' // Change if needed

  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'שלום, אני מעוניין לקבל מידע נוסף על הפרויקט שלך.',
      sender: 'financier',
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: '2',
      text: 'בוודאי, אשמח לענות על כל שאלה. במה אוכל לעזור?',
      sender: 'borrower',
      timestamp: new Date(Date.now() - 3500000),
    },
    {
      id: '3',
      text: 'האם יש מסמכים נוספים שאפשר להעלות?',
      sender: 'financier',
      timestamp: new Date(Date.now() - 3400000),
    },
    {
      id: '4',
      text: 'כן, יש לנו מסמך נוסף, אנחנו נעלה אותו בקרוב.',
      sender: 'borrower',
      timestamp: new Date(Date.now() - 3300000),
    },
    {
      id: '5',
      text: 'תודה רבה',
      sender: 'financier',
      timestamp: new Date(Date.now() - 3200000),
    },
  ])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const [loanRequest, setLoanRequest] = useState<Loan>()
  const [documents, setDocuments] = useState([
    {
      englishName: 'tabo_document',
      name: 'נסח טאבו עדכני',
      status: 'missing',
    },
    {
      englishName: 'united_home_document',
      name: 'תקנון הבית המשותף',
      status: 'missing',
    },
    {
      englishName: 'original_tama_document',
      name: 'הסכם התמ"א המקורי',
      status: 'missing',
    },
    {
      englishName: 'project_list_document',
      name: 'רשימת הפרויקטים של היזם',
      status: 'missing',
    },
    {
      englishName: 'company_crt_document',
      name: 'תעודת התאגדות של החברה היזמית',
      status: 'missing',
    },
    {
      englishName: 'tama_addons_document',
      name: 'תוספות להסכם התמ"א',
      status: 'missing',
    },
    {
      englishName: 'reject_status_document',
      name: 'סטטוס סרבנים - פרטיהם, פירוט תביעות ופירוט פסקי דין',
      status: 'missing',
    },
    {
      englishName: 'building_permit',
      name: 'היתר בניה, לרבות בקשה לקבלת היתר ותיקונים לו',
      status: 'missing',
    },
    {
      englishName: 'objection_status',
      name: 'סטטוס התנגדויות',
      status: 'missing',
    },
    { englishName: 'zero_document', name: 'דו"ח אפס', status: 'missing' },
    {
      englishName: 'bank_account_confirm_document',
      name: 'אישור ניהול חשבון',
      status: 'missing',
    },
  ])

  const fetchLoan = async () => setLoanRequest(await getLoan(id))

  useEffect(() => {
    fetchLoan()
  }, [])

  useEffect(() => {
    if (loanRequest) {
      const updatedDocuments = documents.map((doc) => ({
        ...doc,
        status: loanRequest.file_names.includes(doc.englishName)
          ? 'uploaded'
          : 'missing',
      }))
      setDocuments(updatedDocuments)
    }
  }, [loanRequest])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: message,
        sender: 'borrower',
        timestamp: new Date(),
      }

      setMessages([...messages, newMessage])
      setMessage('')

      setTimeout(() => {
        const response = {
          id: (Date.now() + 1).toString(),
          text: 'תודה על המידע. האם יש לך שאלות נוספות לגבי ההצעה שלנו?',
          sender: 'financier',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, response])
      }, 1000)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getOffers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/offer/get/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      if (response.status === 200) {
        const data = response.data
        console.log("data: ",data)

        const selectedFinanciers = data.map((offer_data: any) => ({
          name: offer_data.organization_name,
          statusColor: mapStatusColor(offer_data.status), // Original status from the API
          status: mapStatus(offer_data.status), // Assuming mapStatus is a function based on the interest_rate
          intrestRate: offer_data.interest_rate,
          percentage: ((offer_data.offer_amount / loanRequest?.amount!) * 100).toFixed(2),
          repaymentPeriod: offer_data.repayment_period,
          amount: offer_data.offer_amount,
          id: offer_data.id
          
        }))
        console.log("selectedFinanciers: ", selectedFinanciers)
        console.log("loanRequest: ", loanRequest)
        
        setFinanciers(selectedFinanciers)
      }
    } catch (error) {
      // Handle errors (e.g., network issues or server errors)
    }
  }

  useEffect(() => {
    if (loanRequest) {
      getOffers()
    }
  }, [loanRequest])

  const mapStatus = (status: string) => {
    switch (status) {
      case 'PENDING_FINANCIER':
        return 'ממתין למממן' //  Pending Financier
      case 'PENDING_BORROWER':
        return 'ממתין לך' // Pending Borrower
      case 'EXPIRED':
        return 'פג תוקף' // Expired
      case 'ACCEPTED':
        return 'התקבל' // Accepted
      case 'REJECTED':
        return 'נדחה' // Rejected
      default:
        return 'לא זמין' // Default if status is not recognized
    }
  }

  const mapStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING_FINANCIER':
        return 'yellow' //  Pending Financier
      case 'PENDING_BORROWER':
        return 'yellow' // Pending Borrower
      case 'EXPIRED':
        return 'red' // Expired
      case 'ACCEPTED':
        return 'green' // Accepted
      case 'REJECTED':
        return 'red' // Rejected
      default:
        return 'red' // Default if status is not recognized
    }
  }

  const approveOffer = async (id: string) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/offer/accept/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      )
      if (response.status === 200) {
        const updatedFinanciers = financiers.map((financier) =>
          financier.id === id
            ? { ...financier, status: 'התקבל' } // Update status of the specific financier
            : financier
        )

        setFinanciers(updatedFinanciers)
      }
    } catch (error) {
      // Handle errors (e.g., network issues or server errors)
      alert('failed to approve')
    }
  }

  const rejectOffer = async (id: string) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/offer/reject/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      )
      if (response.status === 200) {
        const updatedFinanciers = financiers.map((financier) =>
          financier.id === id
            ? { ...financier, status: 'נדחה' } // Update status of the specific financier
            : financier
        )

        setFinanciers(updatedFinanciers)
      }
    } catch (error) {
      // Handle errors (e.g., network issues or server errors)
      alert('failed to reject')
    }
  }
  const handleViewDocument = (docName: string) => {
    console.log(`Viewing document: ${docName}`)
    // Here you would implement the document viewing logic
    alert(`מציג מסמך: ${docName}`)
  }

  const handleReplaceDocument = (docName: string) => {
    // This is handled inside the DocumentItem component
    console.log(`Document replaced: ${docName}`)
    try {
      fetchLoan() // Refresh loan data after replacement
      console.log('Loan data refreshed after document replacement')
    } catch (error) {
      console.error('Failed to refresh loan data:', error)
    }
  }

  const handleAddDocument = (docName: string) => {
    console.log(`Document added: ${docName}`)
    
    try {
      fetchLoan() // Refresh loan data after replacement
      console.log('Loan data refreshed after document addition')
    } catch (error) {
      console.error('Failed to refresh loan data:', error)
    }  }

  if (!loanRequest) {
    return 'Loading...'
  }

  return (
    <div>
      <h1 className='text-3xl font-bold mb-4 text-purple-800 text-center'>
        פרטי בקשה
      </h1>

      <Tabs defaultValue='details' className='mb-6'>
        <TabsList className='mb-4'>
          <TabsTrigger value='details'>פרטי בקשה</TabsTrigger>
          <TabsTrigger value='documents'>מסמכים</TabsTrigger>
          <TabsTrigger value='financiers'>מממנים</TabsTrigger>
          <TabsTrigger value='chat'>צ'אט</TabsTrigger>
        </TabsList>

        <TabsContent value='details'>
          <div className='flex flex-wrap -mx-2'>
            {/* Application Details */}
            <div className='w-full md:w-1/2 px-2 mb-4'>
              <Card className='mb-4'>
                <CardHeader>
                  <CardTitle className='text-xl text-gray-800'>
                    פרטי הבקשה
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                    <div>
                      <p className='text-gray-700 mb-1 text-sm'>
                        <strong>שם חברה:</strong> {loanRequest.companyName}
                      </p>
                      <p className='text-gray-700 mb-1 text-sm'>
                        <strong>סוג פרויקט:</strong> {loanRequest.projectType}
                      </p>
                      <p className='text-gray-700 mb-1 text-sm'>
                        <strong>סכום הלוואה:</strong> {loanRequest.amount}
                      </p>
                    </div>
                    <div>
                      <p className='text-gray-700 mb-1 text-sm'>
                        <strong>מיקום:</strong> {loanRequest.location}
                      </p>
                      <p className='text-gray-700 mb-1 text-sm'>
                        <strong>זמן שעבר: </strong>
                        {`${loanRequest.daysPassed} ימים`}
                      </p>
                      <p className='text-gray-700 mb-1 text-sm' dir='rtl'>
                        <strong>סטטוס:</strong>
                        <span className={`relative inline-block px-2 py-1 font-semibold text-${loanRequest.statusColor}-900 leading-tight text-xs ml-1`}>
                          <span
                            aria-hidden
                            className={`absolute inset-0 bg-${loanRequest.statusColor}-200 opacity-50 rounded-full`}></span>
                          <span className='relative'>{loanRequest.status}</span>
                        </span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Bar Section */}
              <Card>
                <CardHeader>
                  <CardTitle className='text-xl text-gray-800'>
                    התקדמות
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='relative pt-1'>
                    {/* Progress Bar with Labels */}
                    <div className='flex mb-4'>
                      <div className='w-1/6 text-center'>מעבדים את המסמכים</div>
                      <div className='w-1/6 text-center'>אוספים לך הצעות</div>
                      <div className='w-1/6 text-center'>בחירת הלוואה</div>
                      <div className='w-1/6 text-center'>מחכים לחתימות</div>
                      <div className='w-1/6 text-center'>הכסף בדרך אצלך</div>
                      <div className='w-1/6 text-center'>הכסף אצלך</div>
                    </div>

                    {/* Progress bar */}
                    <div className='w-full bg-gray-200 rounded-full h-2.5 mb-4'>
                      <div
                        className='bg-purple-600 h-2.5 rounded-full'
                        style={{ width: `${loanRequest.progress}%` }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className='w-full md:w-1/2 px-2 mb-4'>
              {/* Financier Acceptance Section */}
              <Card className='mb-4'>
                <CardHeader>
                  <CardTitle className='text-xl text-gray-800'>
                    הצעות מימון
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {financiers.map((financier, index) => (
                    <div key={index} className='text-sm mb-4'>
                      <h3 className='font-semibold text-gray-700 mb-1'>
                        {financier.name}
                      </h3>
                      <p className='text-gray-700 mb-1'  dir="rtl">
                        <strong>סטטוס:</strong>
                        <span
                          className={`relative inline-block px-2 py-1 font-semibold leading-tight text-xs ml-1 text-${
                            financier.statusColor}-900`}>
                          <span
                            aria-hidden
                            className={`absolute inset-0 bg-${financier.statusColor}-200 opacity-50 rounded-full`}></span>
                          <span className='relative'>{financier.status}</span>
                        </span>
                      </p>
                      <p className='text-gray-700 mb-1'>
                        <strong>אחוז מההלוואה:</strong> {financier.percentage}%
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value='documents'>
          <Card>
            <CardHeader>
              <CardTitle className='text-xl text-gray-800'>
                מסמכים שהועלו
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {documents.map((doc, index) => (
                  <DocumentItem
                    key={index}
                    name={doc.name}
                    status={doc.status as 'uploaded' | 'missing'}
                    userType='borrower'
                    loanId={id}
                    englishName={doc.englishName}
                    onView={() => handleViewDocument(doc.name)}
                    onReplace={() => handleReplaceDocument(doc.name)}
                    onAdd={() => handleAddDocument(doc.name)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='financiers'>
          <Card>
            <CardHeader>
              <CardTitle className='text-xl text-gray-800'>
                פרטי מממנים
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                {financiers.map((financier, index) => (
                  <div key={index} className='border-b pb-4 last:border-0'>
                    <div className='flex items-center mb-2'>
                      <Avatar className='h-10 w-10 ml-3'>
                        <AvatarImage
                          src='/placeholder.svg?height=40&width=40'
                          alt={financier.name}
                        />
                        <AvatarFallback className='bg-purple-100 text-purple-800'>
                          {financier.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className='font-semibold text-gray-800'>
                          {financier.name}
                        </h3>
                        <p className='text-sm text-gray-500'>מממן מורשה</p>
                      </div>
                      <span
                        className={`mr-auto relative inline-block px-2 py-1 font-semibold leading-tight text-xs text-${
                          financier.statusColor
                        }-900`}>
                        <span
                          aria-hidden
                          className={`absolute inset-0 bg-${
                            financier.statusColor
                          }-200 opacity-50 rounded-full`}></span>
                        <span className='relative'>{financier.status}</span>
                      </span>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                      <div>
                        <p className='text-sm text-gray-700'>
                          <strong>אחוז מימון:</strong> {financier.percentage}%
                        </p>
                        <p className='text-sm text-gray-700'>
                          <strong>סכום מימון:</strong>{' '}
                          {financier.amount.toLocaleString()}₪{' '}
                        </p>
                      </div>
                      <div>
                        <p className='text-sm text-gray-700'>
                          <strong>ריבית מוצעת:</strong> {financier.intrestRate}%
                        </p>
                        <p className='text-sm text-gray-700'>
                          <strong>תקופת החזר:</strong>{' '}
                          {financier.repaymentPeriod} חודשים
                        </p>
                      </div>
                    </div>
                    {financier.status === 'ממתין לך' && (
                      <div className='mt-4 flex space-x-2 space-x-reverse'>
                        <Button
                          variant='default'
                          size='sm'
                          onClick={() => approveOffer(financier.id)}>
                          קבל הצעה
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => rejectOffer(financier.id)}>
                          דחה הצעה
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='chat'>
          <Card className='h-[600px] flex flex-col'>
            <CardHeader className='border-b p-2' dir='rtl'>
              <div className='flex items-center'>
                <Avatar className='ml-3 mr-1'>
                  <AvatarImage
                    src='/financier.png?height=40&width=40'
                    alt='מממן 1'
                  />
                  <AvatarFallback className='bg-purple-100 text-purple-800'>
                    מ1
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className='text-xl text-gray-800'>
                    מממן 1
                  </CardTitle>
                  <p className='text-sm text-gray-500'>מממן מורשה</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className='flex-1 overflow-y-auto p-4'>
              <div className='space-y-4'>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === 'borrower'
                        ? 'justify-end'
                        : 'justify-start'
                    }`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.sender === 'borrower'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                      <div className='text-sm' dir='rtl'>
                        {msg.text}
                      </div>
                      <div
                        className={`text-xs mt-1 ${
                          msg.sender === 'borrower'
                            ? 'text-purple-200'
                            : 'text-gray-500'
                        }`}>
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            <div className='p-4 border-t'>
              <form
                onSubmit={handleSendMessage}
                className='flex items-center space-x-2 space-x-reverse'>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='rounded-full mr-2'>
                  <Paperclip className='h-5 w-5' />
                  <span className='sr-only'>צרף קובץ</span>
                </Button>
                <Input
                  type='text'
                  dir='rtl'
                  placeholder='הקלד הודעה...'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className='flex-1'
                />
                <Button
                  type='submit'
                  size='icon'
                  className='rounded-full bg-purple-600 pt-0.5 pr-0.5'>
                  <Send className='h-5 w-5' />
                  <span className='sr-only'>שלח</span>
                </Button>
              </form>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
