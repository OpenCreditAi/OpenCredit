"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

export default function SignUp() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get("role") || ""

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    idNumber: "",
    phoneNumber: "",
    address: "",
    userType: defaultRole,
    idPhoto: null,
    captcha: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      userType: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        idPhoto: e.target.files ? e.target.files[0] : null,
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, this would register with the server
    // For now, we'll simulate a successful registration and redirect

    if (formData.userType === "entrepreneur" || formData.userType === "borrower") {
      router.push("/borrower/dashboard")
    } else if (formData.userType === "credit-provider" || formData.userType === "financier") {
      router.push("/financier/dashboard")
    } else {
      // Default fallback
      router.push("/auth/sign-in")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-purple-800">הרשמה</CardTitle>
          <CardDescription>צור חשבון חדש ב-OpenCredit</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full-name">שם מלא</Label>
                <Input
                  id="full-name"
                  name="fullName"
                  type="text"
                  placeholder="הכנס שם מלא"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">דוא"ל</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="הכנס כתובת דואל"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="id-number">תעודת זהות</Label>
                <Input
                  id="id-number"
                  name="idNumber"
                  type="text"
                  placeholder="הכנס תעודת זהות"
                  value={formData.idNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone-number">מספר טלפון</Label>
                <Input
                  id="phone-number"
                  name="phoneNumber"
                  type="tel"
                  placeholder="הכנס מספר טלפון"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">כתובת מגורים</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="הכנס כתובת מגורים"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-type">סוג משתמש</Label>
                <Select value={formData.userType} onValueChange={handleSelectChange}>
                  <SelectTrigger id="user-type">
                    <SelectValue placeholder="בחר סוג משתמש" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrepreneur">יזם</SelectItem>
                    <SelectItem value="credit-provider">נותן אשראי</SelectItem>
                    <SelectItem value="lawyer-notary">עו"ד/נוטריון</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="id-photo">תמונה של תעודת זהות</Label>
                <Input id="id-photo" name="idPhoto" type="file" accept="image/*" onChange={handleFileChange} required />
              </div>

              <div className="md:col-span-2 flex items-center space-x-2 rtl:space-x-reverse">
                <Checkbox
                  id="captcha"
                  name="captcha"
                  checked={formData.captcha}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, captcha: checked as boolean }))}
                  required
                />
                <Label htmlFor="captcha">אני לא רובוט</Label>
              </div>
            </div>

            <Button type="submit" className="w-full mt-6">
              הרשמה
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            כבר יש לך חשבון?{" "}
            <Link href="/auth/sign-in" className="text-purple-600 hover:underline">
              התחבר כאן
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

