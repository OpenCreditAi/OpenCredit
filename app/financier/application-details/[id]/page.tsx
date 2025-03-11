"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ApplicationDetails({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [message, setMessage] = useState("")

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
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, this would send the message to the server
      // For now, we'll just clear the input
      setMessage("")
    }
  }

  const requestMoreDocuments = () => {
    alert("נשלחה בקשה למסמכים נוספים מהלווה.")
  }

  const makeAnOffer = () => {
    alert("נשלחה הצעת הלוואה ודרישה לחתימה על מסמכים.")
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-purple-800 text-center">פרטי בקשה #{params.id}</h1>

      <Tabs defaultValue="details" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="details">פרטי בקשה</TabsTrigger>
          <TabsTrigger value="documents">מסמכים</TabsTrigger>
          <TabsTrigger value="communication">תקשורת</TabsTrigger>
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
                    <strong>זמן שנותר:</strong> {loanRequest.daysLeft} ימים
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
                    <strong>שם:</strong> ישראל ישראלי
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
                {loanRequest.messages.map((msg, index) => (
                  <div key={index} className={`chat-message ${msg.sender ? "receiver" : "sender"}`}>
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
                  className="mr-2"
                />
                <Button onClick={handleSendMessage}>שלח</Button>
              </div>
            </CardContent>
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
              <Input id="offerAmount" type="number" placeholder="הכנס סכום" className="mb-4" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="interestRate">
                ריבית מוצעת (%):
              </label>
              <Input id="interestRate" type="number" step="0.1" placeholder="הכנס אחוז ריבית" className="mb-4" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="offerTerms">
              תנאים נוספים:
            </label>
            <Textarea id="offerTerms" placeholder="פרט תנאים נוספים להצעה" rows={4} />
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
    </div>
  )
}

