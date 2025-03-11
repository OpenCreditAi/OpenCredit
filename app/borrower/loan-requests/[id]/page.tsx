"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoanRequestDetails({ params }: { params: { id: string } }) {
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
    financiers: [
      { name: "מממן 1", status: "התקבל", percentage: 50 },
      { name: "מממן 2", status: "בהמתנה", percentage: 25 },
      { name: "מממן 3", status: "נדחה", percentage: 0 },
    ],
    messages: [
      { sender: true, text: "האם יש מסמכים נוספים שאפשר להעלות ?" },
      { sender: false, text: "כן, יש לנו מסמך נוסף, אנחנו נעלה אותו בקרוב." },
      { sender: true, text: "תודה רבה" },
    ],
    progress: 66.66,
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, this would send the message to the server
      // For now, we'll just clear the input
      setMessage("")
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-purple-800 text-center">פרטי בקשה</h1>

      <div className="flex flex-wrap -mx-2">
        {/* Left Column */}
        <div className="w-full md:w-1/2 px-2 mb-4">
          {/* Application Details */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">פרטי הבקשה</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <p className="text-gray-700 mb-1 text-sm">
                    <strong>שם חברה:</strong> {loanRequest.companyName}
                  </p>
                  <p className="text-gray-700 mb-1 text-sm">
                    <strong>סוג פרויקט:</strong> {loanRequest.projectType}
                  </p>
                  <p className="text-gray-700 mb-1 text-sm">
                    <strong>סכום הלוואה:</strong> {loanRequest.loanAmount}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700 mb-1 text-sm">
                    <strong>מיקום:</strong> {loanRequest.location}
                  </p>
                  <p className="text-gray-700 mb-1 text-sm">
                    <strong>זמן שנותר:</strong> {loanRequest.daysLeft} ימים
                  </p>
                  <p className="text-gray-700 mb-1 text-sm">
                    <strong>סטטוס:</strong>
                    <span className="relative inline-block px-2 py-1 font-semibold text-green-900 leading-tight text-xs ml-1">
                      <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                      <span className="relative">{loanRequest.status}</span>
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chat Section */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">הודעות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="chat-container">
                {loanRequest.messages.map((msg, index) => (
                  <div key={index} className={`chat-message ${msg.sender ? "sender" : "receiver"}`}>
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
        </div>

        {/* Right Column */}
        <div className="w-full md:w-1/2 px-2 mb-4">
          {/* Documents Section */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">מסמכים שהועלו</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {loanRequest.documents.map((doc, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-700 mb-1">{doc.name}</h3>
                    {doc.status === "uploaded" ? (
                      <Link href="#" className="text-blue-600 hover:underline">
                        הצג מסמך
                      </Link>
                    ) : (
                      <Link href="#" className="text-blue-600 hover:underline">
                        הוסף מסמך
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Financier Acceptance Section */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">הצעות מימון</CardTitle>
            </CardHeader>
            <CardContent>
              {loanRequest.financiers.map((financier, index) => (
                <div key={index} className="text-sm mb-4">
                  <h3 className="font-semibold text-gray-700 mb-1">{financier.name}</h3>
                  <p className="text-gray-700 mb-1">
                    <strong>סטטוס:</strong>
                    <span
                      className={`relative inline-block px-2 py-1 font-semibold leading-tight text-xs ml-1 ${
                        financier.status === "התקבל"
                          ? "text-green-900"
                          : financier.status === "בהמתנה"
                            ? "text-yellow-900"
                            : "text-red-900"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`absolute inset-0 ${
                          financier.status === "התקבל"
                            ? "bg-green-200"
                            : financier.status === "בהמתנה"
                              ? "bg-yellow-200"
                              : "bg-red-200"
                        } opacity-50 rounded-full`}
                      ></span>
                      <span className="relative">{financier.status}</span>
                    </span>
                  </p>
                  <p className="text-gray-700 mb-1">
                    <strong>אחוז מההלוואה:</strong> {financier.percentage}%
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Progress Bar Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">התקדמות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative pt-1">
            {/* Progress Bar with Labels */}
            <div className="flex mb-4">
              <div className="w-1/6 text-center">מעבדים את המסמכים</div>
              <div className="w-1/6 text-center">אוספים לך הצעות</div>
              <div className="w-1/6 text-center">בחירת הלוואה</div>
              <div className="w-1/6 text-center">מחכים לחתימות</div>
              <div className="w-1/6 text-center">הכסף בדרך אצלך</div>
              <div className="w-1/6 text-center">הכסף אצלך</div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${loanRequest.progress}%` }}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

