"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatWidget } from "@/components/chat-widget"
import { Send, Paperclip } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ApplicationDetails({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [offerAmount, setOfferAmount] = useState<number | ''>('')
  const [interestRate, setInterestRate] = useState<number | ''>('')
  const [offerTerms, setOfferTerms] = useState<string>('')
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Enhanced messages state with more detailed structure
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "שלום, אני מעוניין לקבל מידע נוסף על הפרויקט שלך.",
      sender: "financier",
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      text: "בוודאי, אשמח לענות על כל שאלה. במה אוכל לעזור?",
      sender: "borrower",
      timestamp: new Date(Date.now() - 3500000),
    },
    {
      id: "3",
      text: "האם יש מסמכים נוספים שאפשר להעלות?",
      sender: "financier",
      timestamp: new Date(Date.now() - 3400000),
    },
    {
      id: "4",
      text: "כן, יש לנו מסמך נוסף, אנחנו נעלה אותו בקרוב.",
      sender: "borrower",
      timestamp: new Date(Date.now() - 3300000),
    },
    {
      id: "5",
      text: "תודה רבה",
      sender: "financier",
      timestamp: new Date(Date.now() - 3200000),
    },
  ])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Mock data for the loan request
  const loanRequest = {
    id: params.id,
    companyName: 'חברת בנייה יוקרתית בע"מ',
    projectType: "מגורים",
    loanAmount: "5,000,000 ₪",
    location: "פלורנטין, תל אביב",
    daysLeft: 25,
    status: "בטיפול",
    documents: [
      { name: "נסח טאבו עדכני", status: "uploaded" },
      { name: "תקנון הבית המשותף", status: "uploaded" },
      { name: 'הסכם התמ"א המקורי', status: "uploaded" },
      { name: "רשימת הפרויקטים של היזם", status: "uploaded" },
      { name: "תעודת התאגדות של החברה היזמית", status: "uploaded" },
      { name: 'תוספות להסכם התמ"א', status: "uploaded" },
      { name: "סטטוס סרבנים - פרטיהם, פירוט תביעות ופירוט פסקי דין", status: "uploaded" },
      { name: "היתר בניה, לרבות בקשה לקבלת היתר ותיקונים לו", status: "uploaded" },
      { name: "סטטוס התנגדויות", status: "missing" },
      { name: 'דו"ח אפס', status: "missing" },
      { name: "אישור ניהול חשבון", status: "missing" },
    ],
    messages: [
      { sender: false, text: "האם יש מסמכים נוספים שאפשר להעלות ?" },
      { sender: true, text: "כן, יש לנו מסמך נוסף, אנחנו נעלה אותו בקרוב." },
      { sender: false, text: "תודה רבה" },
    ],
    borrowerName: "ישראל ישראלי",
    borrowerId: "12345",
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (message.trim()) {
      // Add the new message to the chat
      const newMessage = {
        id: Date.now().toString(),
        text: message,
        sender: "financier",
        timestamp: new Date(),
      }

      setMessages([...messages, newMessage])
      setMessage("")

      // Simulate a response (in a real app, this would be handled by the server)
      setTimeout(() => {
        const response = {
          id: (Date.now() + 1).toString(),
          text: "תודה על ההודעה. אני אבדוק את זה ואחזור אליך בהקדם.",
          sender: "borrower",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, response])
      }, 1000)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })
  }

  const requestMoreDocuments = () => {
    alert("נשלחה בקשה למסמכים נוספים מהלווה.")
  }

  const makeAnOffer = () => {
    alert("נשלחה הצעת הלוואה ודרישה לחתימה על מסמכים.")
    const offerDetails = `
      סכום המימון המוצע: ${offerAmount ? offerAmount : "לא הוזן"}
      ריבית מוצעת: ${interestRate ? interestRate : "לא הוזן"}
      תנאים נוספים: ${offerTerms || "לא הוזן"}
    `;
    alert(`נשלחה הצעת הלוואה עם הפרטים הבאים:\n\n${offerDetails}`);
  }

  const handleOfferAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOfferAmount(e.target.value ? parseFloat(e.target.value) : '')
  }

  const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInterestRate(e.target.value ? parseFloat(e.target.value) : '')
  }

  const handleOfferTermsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOfferTerms(e.target.value)
  }
  
  // Initial chat messages
  const initialMessages = [
    {
      id: "1",
      text: "שלום, אני מעוניין לקבל מידע נוסף על הפרויקט שלך.",
      sender: "user" as const,
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      text: "בוודאי, אשמח לענות על כל שאלה. במה אוכל לעזור?",
      sender: "borrower" as const,
      timestamp: new Date(Date.now() - 3500000),
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-purple-800 text-center">פרטי בקשה #{params.id}</h1>

      <Tabs defaultValue="details" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="details">פרטי בקשה</TabsTrigger>
          <TabsTrigger value="documents">מסמכים</TabsTrigger>
          <TabsTrigger value="communication">תקשורת</TabsTrigger>
          <TabsTrigger value="chat">צ'אט</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Application Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">פרטי הבקשה</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong>שם חברה:</strong> {loanRequest.companyName}
                  </p>
                  <p className="text-gray-700">
                    <strong>סוג פרויקט:</strong> {loanRequest.projectType}
                  </p>
                  <p className="text-gray-700">
                    <strong>סכום הלוואה:</strong> {loanRequest.loanAmount}
                  </p>
                  <p className="text-gray-700">
                    <strong>מיקום:</strong> {loanRequest.location}
                  </p>
                  <p className="text-gray-700">
                    <strong>זמן שנותר:</strong> ימים {loanRequest.daysLeft}
                  </p>
                  <p className="text-gray-700">
                    <strong>סטטוס:</strong>
                    <span className="relative inline-block px-2 py-1 font-semibold text-green-900 leading-tight text-xs ml-1">
                      <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                      <span className="relative">{loanRequest.status}</span>
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Borrower Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">פרטי לווה</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong>שם:</strong> {loanRequest.borrowerName}
                  </p>
                  <p className="text-gray-700">
                    <strong>תפקיד:</strong> מנכ"ל
                  </p>
                  <p className="text-gray-700">
                    <strong>טלפון:</strong> 050-1234567
                  </p>
                  <p className="text-gray-700">
                    <strong>דוא"ל:</strong> israel@example.com
                  </p>
                  <p className="text-gray-700">
                    <strong>ניסיון קודם:</strong> 10 פרויקטים דומים
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">מסמכים שהועלו</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loanRequest.documents.map((doc, index) => (
                  <div key={index} className="flex justify-between items-center p-2 border-b">
                    <div>
                      <h3 className="font-semibold text-gray-700">{doc.name}</h3>
                      <span className={`text-xs ${doc.status === "uploaded" ? "text-green-600" : "text-red-600"}`}>
                        {doc.status === "uploaded" ? "הועלה" : "חסר"}
                      </span>
                    </div>
                    {doc.status === "uploaded" ? (
                      <Button variant="outline" size="sm">
                        הצג מסמך
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="text-red-600">
                        דרוש מסמך
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">הודעות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="chat-container mb-4">
                {messages.slice(0, 5).map((msg, index) => (
                  <div key={index} className={`chat-message ${msg.sender === "borrower" ? "receiver" : "sender"}`}>
                    {msg.text}
                  </div>
                ))}
              </div>
              <div className="flex">
                <Input
                  type="text"
                  placeholder="הקלד הודעה..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="ml-2 mr-0" // Swap margin for RTL
                />
                <Button onClick={handleSendMessage}>שלח</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 ml-3">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt={loanRequest.borrowerName} />
                  <AvatarFallback className="bg-purple-100 text-purple-800">
                    {loanRequest.borrowerName.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl text-gray-800">{loanRequest.borrowerName}</CardTitle>
                  <p className="text-sm text-gray-500">{loanRequest.companyName}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "financier" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.sender === "financier" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <div className="text-sm">{msg.text}</div>
                      <div
                        className={`text-xs mt-1 ${msg.sender === "financier" ? "text-purple-200" : "text-gray-500"}`}
                      >
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2 rtl:space-x-reverse">
                <Button type="button" variant="ghost" size="icon" className="rounded-full">
                  <Paperclip className="h-5 w-5" />
                  <span className="sr-only">צרף קובץ</span>
                </Button>
                <Input
                  type="text"
                  placeholder="הקלד הודעה..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon" className="rounded-full bg-purple-600">
                  <Send className="h-5 w-5" />
                  <span className="sr-only">שלח</span>
                </Button>
              </form>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Offer Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">הגש הצעת מימון</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="offerAmount">
                סכום המימון המוצע:
              </label>
              <Input id="offerAmount" type="number" value={offerAmount} onChange={handleOfferAmountChange} placeholder="הכנס סכום" className="mb-4" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="interestRate">
                ריבית מוצעת (%):
              </label>
              <Input id="interestRate" type="number" value={interestRate} onChange={handleInterestRateChange} step="0.1" placeholder="הכנס אחוז ריבית" className="mb-4" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="offerTerms">
              תנאים נוספים:
            </label>
            <Textarea id="offerTerms" value={offerTerms} {handleOfferTermsChange} placeholder="פרט תנאים נוספים להצעה" rows={4} />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          className="bg-yellow-400 hover:bg-yellow-600 text-white"
          onClick={requestMoreDocuments}
        >
          בקש מסמכים נוספים
        </Button>

        <Button className="bg-green-500 hover:bg-green-700 text-white" onClick={makeAnOffer}>
          שלח הצעה
        </Button>

        <Button variant="outline" onClick={() => router.push("/financier/marketplace")}>
          חזור לרשימה
        </Button>
      </div>

      {/* Chat Widget (floating) */}
      <ChatWidget
        borrowerName={loanRequest.borrowerName}
        borrowerId={loanRequest.borrowerId}
        initialMessages={initialMessages}
      />
    </div>
  )
}

