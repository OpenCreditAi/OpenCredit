"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function VerifyPhone() {
  const router = useRouter()
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSending, setIsSending] = useState(true) // Start with sending state
  const [countdown, setCountdown] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Simulate getting the phone number from the previous page
  // In a real app, this would come from a context, URL parameter, or server session
  const [phoneNumber, setPhoneNumber] = useState("050-1234567")

  // Handle countdown for resending code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Send verification code automatically when the page loads
  useEffect(() => {
    handleSendCode()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSendCode = async () => {
    setError(null)
    setIsSending(true)

    try {
      // In a real app, this would call your API to send the verification code
      // For now, we'll simulate the API call
      setTimeout(() => {
        setIsSending(false)
        setCountdown(60) // 60 seconds countdown for resending
        setSuccess("קוד אימות נשלח למספר הטלפון שלך")

        // In a real app, this would be sent via SMS
        console.log("Verification code: 123456")
      }, 1500)
    } catch (error) {
      setError("שגיאה בשליחת קוד האימות. אנא נסה שנית")
      setIsSending(false)
    }
  }

  const handleVerifyCode = async () => {
    // Validate verification code
    if (verificationCode.length !== 6) {
      setError("קוד האימות חייב להיות באורך 6 ספרות")
      return
    }

    setError(null)
    setIsVerifying(true)

    try {
      // In a real app, this would call your API to verify the code
      // For now, we'll simulate the API call
      setTimeout(() => {
        setIsVerifying(false)

        // For demo purposes, accept "123456" as valid code
        if (verificationCode === "123456") {
          setSuccess("מספר הטלפון אומת בהצלחה")

          // Redirect to dashboard after successful verification
          setTimeout(() => {
            // Determine if the user is a borrower or financier based on ID
            // This is just a mock implementation
            const isBorrower = Math.random() > 0.5

            if (isBorrower) {
              router.push("/borrower/dashboard")
            } else {
              router.push("/financier/dashboard")
            }
          }, 1500)
        } else {
          setError("קוד האימות שגוי. אנא נסה שנית")
        }
      }, 1500)
    } catch (error) {
      setError("שגיאה באימות הקוד. אנא נסה שנית")
      setIsVerifying(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-purple-800">אימות מספר טלפון</CardTitle>
          <CardDescription>אנא הזן את קוד האימות שנשלח למספר {phoneNumber}</CardDescription>
        </CardHeader>
        <CardContent>
          {success && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600 ml-2" />
              <AlertDescription className="text-green-600">{success}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mb-4 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600 ml-2" />
              <AlertDescription className="text-red-600">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {isSending ? (
              <div className="flex flex-col items-center justify-center py-4">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-2" />
                <p className="text-sm text-gray-600">שולח קוד אימות...</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="verification-code">קוד אימות</Label>
                <div className="flex items-center">
                  <Input
                    id="verification-code"
                    type="text"
                    placeholder="XXXXXX"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="ml-2"
                    maxLength={6}
                    disabled={isVerifying}
                  />
                  <Button onClick={handleVerifyCode} disabled={isVerifying || verificationCode.length !== 6}>
                    {isVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "אמת"}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">הזן את קוד האימות בן 6 הספרות שנשלח למספר הטלפון שלך</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          {!isSending && (
            <div className="w-full text-center">
              {countdown > 0 ? (
                <p className="text-sm text-gray-500">ניתן לשלוח קוד חדש בעוד {countdown} שניות</p>
              ) : (
                <Button
                  variant="link"
                  onClick={handleSendCode}
                  disabled={isSending}
                  className="text-purple-600 hover:text-purple-800"
                >
                  שלח קוד חדש
                </Button>
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

