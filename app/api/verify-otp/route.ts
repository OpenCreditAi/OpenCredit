import { type NextRequest, NextResponse } from "next/server"

// In a real application, you would store OTPs in a database with expiration times
// For this demo, we'll use a simple in-memory store
const otpStore: Record<string, { otp: string; expires: number }> = {}

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, otp } = await request.json()

    // Validate input
    if (!phoneNumber || !otp) {
      return NextResponse.json({ error: "Phone number and OTP are required" }, { status: 400 })
    }

    // Check if OTP exists and is valid
    const storedData = otpStore[phoneNumber]

    if (!storedData) {
      return NextResponse.json({ error: "No OTP found for this phone number" }, { status: 400 })
    }

    // Check if OTP has expired
    if (Date.now() > storedData.expires) {
      delete otpStore[phoneNumber]
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 })
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }

    // OTP is valid, clean up
    delete otpStore[phoneNumber]

    return NextResponse.json({ success: true, verified: true })
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to verify OTP" },
      { status: 500 },
    )
  }
}

// Helper function to store an OTP (would be called from the send-sms route in a real app)
export function storeOTP(phoneNumber: string, otp: string, expiresInMinutes = 10) {
  otpStore[phoneNumber] = {
    otp,
    expires: Date.now() + expiresInMinutes * 60 * 1000,
  }
}

