import { type NextRequest, NextResponse } from "next/server"
import twilio from "twilio"
import { storeOTP } from "../verify-otp/route"

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER

// Only initialize the client if credentials are available
const client = accountSid && authToken ? twilio(accountSid, authToken) : null

export async function POST(request: NextRequest) {
  try {
    // Check if Twilio is configured
    if (!client || !twilioPhoneNumber) {
      console.log("SMS service not configured, using mock mode")
      // For development without Twilio, we'll just store the OTP without sending SMS
      const { phoneNumber } = await request.json()

      if (!phoneNumber) {
        return NextResponse.json({ error: "Phone number is required" }, { status: 400 })
      }

      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString()

      // Store the OTP
      storeOTP(phoneNumber, otp)

      console.log(`MOCK SMS: Your verification code is: ${otp}`)
      return NextResponse.json({
        success: true,
        mockMode: true,
        message: "OTP generated in mock mode (check server logs)",
        // Only expose OTP in development for testing
        ...(process.env.NODE_ENV === "development" && { otp }),
      })
    }

    // Parse request body
    const { phoneNumber } = await request.json()

    // Validate input
    if (!phoneNumber) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 })
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Store the OTP
    storeOTP(phoneNumber, otp)

    // Format phone number for international use if it doesn't already have a country code
    const formattedPhoneNumber = phoneNumber.startsWith("+")
      ? phoneNumber
      : `+972${phoneNumber.startsWith("0") ? phoneNumber.substring(1) : phoneNumber}`

    // Send SMS via Twilio
    const message = await client.messages.create({
      body: `Your OpenCredit verification code is: ${otp}`,
      from: twilioPhoneNumber,
      to: formattedPhoneNumber,
    })

    return NextResponse.json({ success: true, sid: message.sid })
  } catch (error) {
    console.error("Error sending SMS:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to send SMS" }, { status: 500 })
  }
}

