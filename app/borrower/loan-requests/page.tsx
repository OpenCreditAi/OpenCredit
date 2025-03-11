"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for the loan requests
const mockLoans = [
  {
    id: "1001",
    projectName: "בניין מגורים פלורנטין, תל אביב",
    projectType: "מגורים",
    location: "פלורנטין, תל אביב",
    amount: "5,000,000 ₪",
    daysLeft: 25,
    status: "בטיפול",
    progress: 30,
    statusColor: "green",
  },
  {
    id: "1002",
    projectName: "בניין מסחרי גילה, ירושלים",
    projectType: "מסחר",
    location: "גילה, ירושלים",
    amount: "10,000,000 ₪",
    daysLeft: 60,
    status: "בהמתנה",
    progress: 70,
    statusColor: "yellow",
  },
  {
    id: "1003",
    projectName: "משרדים רמת שאול, חיפה",
    projectType: "מסחר",
    location: "רמת שאול, חיפה",
    amount: "3,500,000 ₪",
    daysLeft: 10,
    status: "הלוואה פעילה",
    progress: 95,
    statusColor: "blue",
  },
  {
    id: "1004",
    projectName: "בנייה עצמאית רמות, באר שבע",
    projectType: "בנייה עצמית",
    location: "רמות, באר שבע",
    amount: "1,500,000 ₪",
    daysLeft: 0,
    status: "הושלם",
    progress: 100,
    statusColor: "green-700",
  },
]

export default function LoanRequests() {
  const [viewType, setViewType] = useState<"table" | "cards">("table")

  const toggleView = () => {
    setViewType(viewType === "table" ? "cards" : "table")
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-800">בקשות הלוואה</h1>
        <Link href="/borrower/new-request">
          <Button>בקשה חדשה</Button>
        </Link>
      </div>

      {/* View Toggle Button */}
      <div className="mb-4 flex justify-end">
        <Button variant="outline" onClick={toggleView}>
          {viewType === "table" ? "הצג ככרטיסיות" : "הצג כטבלה"}
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="all">כל הבקשות</TabsTrigger>
          <TabsTrigger value="active">בקשות פעילות</TabsTrigger>
          <TabsTrigger value="completed">בקשות שהושלמו</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {viewType === "table" ? (
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
              <table className="min-w-full leading-normal">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      סטטוס
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      התקדמות
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      שם פרויקט
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      סוג פרויקט
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      מיקום
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      סכום הלוואה
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      זמן שנותר
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      פעולות
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockLoans.map((loan) => (
                    <tr key={loan.id}>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-right text-sm">
                        <span
                          className={`relative inline-block px-3 py-1 font-semibold text-${loan.statusColor}-900 leading-tight`}
                        >
                          <span
                            aria-hidden
                            className={`absolute inset-0 bg-${loan.statusColor}-200 opacity-50 rounded-full`}
                          ></span>
                          <span className="relative">{loan.status}</span>
                        </span>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-right text-sm">
                        <div className="progress-bar">
                          <div className="progress-bar-fill" style={{ width: `${loan.progress}%` }}></div>
                        </div>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-right text-sm">
                        {loan.projectName}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-right text-sm">
                        {loan.projectType}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-right text-sm">
                        {loan.location}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-right text-sm">{loan.amount}</td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-right text-sm">
                        {loan.daysLeft} ימים
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-right text-sm">
                        <Link href={`/borrower/loan-requests/${loan.id}`}>
                          <Button variant="outline" size="sm">
                            צפה בפרטים
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockLoans.map((loan) => (
                <Card key={loan.id}>
                  <CardContent className="p-6">
                    <p className="mb-2">
                      <strong>סטטוס:</strong>
                      <span
                        className={`relative inline-block px-3 py-1 font-semibold text-${loan.statusColor}-900 leading-tight ml-2`}
                      >
                        <span
                          aria-hidden
                          className={`absolute inset-0 bg-${loan.statusColor}-200 opacity-50 rounded-full`}
                        ></span>
                        <span className="relative">{loan.status}</span>
                      </span>
                    </p>
                    <p className="mb-2">
                      <strong>התקדמות:</strong>
                      <div className="progress-bar mt-1">
                        <div className="progress-bar-fill" style={{ width: `${loan.progress}%` }}></div>
                      </div>
                    </p>
                    <p className="mb-2">
                      <strong>שם פרויקט:</strong> {loan.projectName}
                    </p>
                    <p className="mb-2">
                      <strong>סוג פרויקט:</strong> {loan.projectType}
                    </p>
                    <p className="mb-2">
                      <strong>מיקום:</strong> {loan.location}
                    </p>
                    <p className="mb-2">
                      <strong>סכום הלוואה:</strong> {loan.amount}
                    </p>
                    <p className="mb-4">
                      <strong>זמן שנותר:</strong> {loan.daysLeft} ימים
                    </p>
                    <Link href={`/borrower/loan-requests/${loan.id}`}>
                      <Button className="w-full">צפה בפרטים</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active">
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <p className="text-gray-600">מציג בקשות פעילות בלבד</p>
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <p className="text-gray-600">מציג בקשות שהושלמו בלבד</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

