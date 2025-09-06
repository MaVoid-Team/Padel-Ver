import { NextResponse } from "next/server"
import { sendEmail, generateBookingConfirmationEmail } from "@/lib/email"

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, booking } = body

    let emailHtml = ""
    let subject = ""

    switch (type) {
      case "booking_confirmation":
        subject = `Booking Confirmed - ${booking.courtName} on ${booking.date}`
        emailHtml = generateBookingConfirmationEmail(booking)
        break
      case "booking_reminder":
        subject = `Reminder: Your padel session is tomorrow`
        emailHtml = generateBookingConfirmationEmail(booking)
        break
      default:
        return NextResponse.json({ error: "Invalid notification type" }, { status: 400 })
    }

    const result = await sendEmail({
      to: booking.playerEmail,
      subject,
      html: emailHtml,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error sending notification:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
