"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignIn() {
  const router = useRouter()
  const [idNumber, setIdNumber] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, this would authenticate with the server
    // For now, we'll simulate a successful login and redirect

    // Determine if the user is a borrower or financier based on ID
    // This is just a mock implementation
    const isBorrower = Number.parseInt(idNumber) % 2 === 0

    if (isBorrower) {
      router.push("/borrower/dashboard")
    } else {
      router.push("/financier/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-purple-800">התחברות</CardTitle>
          <CardDescription>התחבר לחשבון OpenCredit שלך</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="id-number">תעודת זהות</Label>
                <Input
                  id="id-number"
                  type="text"
                  placeholder="הכנס תעודת זהות"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone-number">מספר טלפון</Label>
                <Input
                  id="phone-number"
                  type="tel"
                  placeholder="הכנס מספר טלפון"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                התחבר
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            אין לך חשבון?{" "}
            <Link href="/auth/sign-up" className="text-purple-600 hover:underline">
              הירשם עכשיו
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

