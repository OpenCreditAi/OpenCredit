"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import axios from "axios"
import { decodeToken } from "../../../utils/auth";


export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const API_BASE_URL = "http://127.0.0.1:5000" // Change if needed

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("") // Clear previous errors
    setIsLoading(true)

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signin`, {
        email,
        password,
      })

      console.log("User signed in:", response.data)
      const data = decodeToken(response.data.access_token)
      // Save token & role in localStorage
      localStorage.setItem("access_token", response.data.access_token)
      const userRole = data.role
      localStorage.setItem("user_role", userRole) // Save role

      if (userRole == "borrower") {
        router.push("/borrower/dashboard")
      } else if (userRole == "financier") {
        router.push("/financier/dashboard")
      } else {
        console.log("unable to sign in")
      }
    } catch (error) {
      console.error("Signin error:", error.response?.data?.error || error.message)
      // Set the error message to display to the user
      setError(error.response?.data?.error || "שגיאת התחברות: אימייל או סיסמה שגויים")
    } finally {
      setIsLoading(false)
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
              {error && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">אימייל</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="הכנס את האימייל שלך"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">סיסמה</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="הכנס את הסיסמה שלך"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end">
                <Link href="/auth/forgot-password" className="text-sm text-purple-600 hover:underline">
                  שכחת סיסמה?
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "מתחבר..." : "התחבר"}
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

