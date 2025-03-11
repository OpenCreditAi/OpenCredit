"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

// Mock data for the marketplace
const mockLoans = [
  {
    id: "1001",
    companyName: 'חברת בנייה יוקרתית בע"מ',
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
    companyName: 'יזמות נדל"ן בע"מ',
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
    companyName: 'בניית משרדים בע"מ',
    projectType: "מסחר",
    location: "רמת שאול, חיפה",
    amount: "3,500,000 ₪",
    daysLeft: 10,
    status: "הוצע",
    progress: 95,
    statusColor: "blue",
  },
  {
    id: "1004",
    companyName: 'חברת בניה עצמית בע"מ',
    projectType: "בנייה עצמית",
    location: "רמות, באר שבע",
    amount: "1,500,000 ₪",
    daysLeft: 0,
    status: "נדחה",
    progress: 100,
    statusColor: "red",
  },
]

export default function Marketplace() {
  const router = useRouter()
  const [viewType, setViewType] = useState<"table" | "cards">("table")
  const [maxAmount, setMaxAmount] = useState<number>(10000000)
  const [filters, setFilters] = useState({
    projectType: "",
    location: "",
    status: "",
    company: "",
  })

  const toggleView = () => {
    setViewType(viewType === "table" ? "cards" : "table")
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSliderChange = (value: number[]) => {
    setMaxAmount(value[0])
  }

  const openApplicationDetails = (id: string) => {
    router.push(`/financier/application-details/${id}`)
  }

  return (
    <div>
      <nav className="bg-white shadow-md py-4 mb-8">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-800">חיפוש בקשות הלוואות</h1>
          <div className="space-x-4 rtl:space-x-reverse">
            <Button variant="default" className="bg-purple-700 hover:bg-purple-900 text-yellow-200">
              כל הבקשות
            </Button>
            <Button variant="ghost" className="text-gray-600 hover:text-purple-800 font-semibold">
              בקשות בתהליך
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto py-8 px-4 flex flex-wrap">
        {/* Left Filter Side */}
        <div className="w-full md:w-1/4 px-2 mb-4">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">סנן לפי</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="projectType">סוג פרויקט:</Label>
                  <Select
                    value={filters.projectType}
                    onValueChange={(value) => handleSelectChange("projectType", value)}
                  >
                    <SelectTrigger id="projectType" className="mt-1">
                      <SelectValue placeholder="בחר סוג פרויקט" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="projectType">בחר סוג פרויקט</SelectItem>
                      <SelectItem value="מגורים">מגורים</SelectItem>
                      <SelectItem value="מסחר">מסחר</SelectItem>
                      <SelectItem value="בנייה עצמית">בנייה עצמית</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">מיקום הפרויקט:</Label>
                  <Input
                    id="location"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="הכנס מיקום"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="maxAmount">מחיר מקסימלי: {maxAmount.toLocaleString()} ₪</Label>
                  <Slider
                    id="maxAmount"
                    defaultValue={[maxAmount]}
                    max={20000000}
                    step={250000}
                    onValueChange={handleSliderChange}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="status">סטטוס:</Label>
                  <Select value={filters.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger id="status" className="mt-1">
                      <SelectValue placeholder="בחר סטטוס" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="status">בחר סטטוס</SelectItem>
                      <SelectItem value="בטיפול">בטיפול</SelectItem>
                      <SelectItem value="בהמתנה">בהמתנה</SelectItem>
                      <SelectItem value="הוצע">הוצע</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="company">חברה מבצעת:</Label>
                  <Input
                    id="company"
                    name="company"
                    value={filters.company}
                    onChange={handleFilterChange}
                    placeholder="הכנס שם חברה"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Content Side */}
        <div className="w-full md:w-3/4 px-2 mb-4">
          {/* View Toggle Button */}
          <div className="mb-4 flex justify-end">
            <Button onClick={toggleView}>{viewType === "table" ? "הצג ככרטיסיות" : "הצג כטבלה"}</Button>
          </div>

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
                      שם חברה
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
                  </tr>
                </thead>
                <tbody>
                  {mockLoans.map((loan) => (
                    <tr
                      key={loan.id}
                      onClick={() => openApplicationDetails(loan.id)}
                      className="cursor-pointer hover:bg-gray-50"
                    >
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
                        {loan.companyName}
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockLoans.map((loan) => (
                <Card
                  key={loan.id}
                  className="cursor-pointer hover:shadow-lg"
                  onClick={() => openApplicationDetails(loan.id)}
                >
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
                      <strong>שם חברה:</strong> {loan.companyName}
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
                    <Button className="w-full">הצג פרטים</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

