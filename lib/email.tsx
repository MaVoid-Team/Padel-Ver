interface EmailData {
  to: string
  subject: string
  html: string
}

export async function sendEmail(data: EmailData) {
  // In a real implementation, you would use a service like:
  // - Resend
  // - SendGrid
  // - Nodemailer with SMTP
  // - AWS SES

  console.log("📧 Email would be sent:", {
    to: data.to,
    subject: data.subject,
    preview: data.html.substring(0, 100) + "...",
  })

  // Simulate email sending delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return { success: true, messageId: `msg_${Date.now()}` }
}

export function generateBookingConfirmationEmail(booking: {
  playerName: string
  courtName: string
  date: string
  time: string
  duration: number
  totalPrice: number
}) {
  const formattedDate = new Date(booking.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Confirmation - PadelClub</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0891b2; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .total { font-size: 18px; font-weight: bold; color: #0891b2; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎾 Booking Confirmed!</h1>
          <p>Your padel court is reserved and ready</p>
        </div>
        
        <div class="content">
          <h2>Hi ${booking.playerName}!</h2>
          <p>Great news! Your court booking has been confirmed. Here are your reservation details:</p>
          
          <div class="booking-details">
            <div class="detail-row">
              <span><strong>Court:</strong></span>
              <span>${booking.courtName}</span>
            </div>
            <div class="detail-row">
              <span><strong>Date:</strong></span>
              <span>${formattedDate}</span>
            </div>
            <div class="detail-row">
              <span><strong>Time:</strong></span>
              <span>${booking.time} (${booking.duration} minutes)</span>
            </div>
            <div class="detail-row total">
              <span>Total Paid:</span>
              <span>$${booking.totalPrice}</span>
            </div>
          </div>
          
          <h3>What to bring:</h3>
          <ul>
            <li>Padel rackets (or rent them at the club)</li>
            <li>Comfortable sports clothing</li>
            <li>Non-marking sports shoes</li>
            <li>Water bottle</li>
          </ul>
          
          <h3>Important reminders:</h3>
          <ul>
            <li>Please arrive 10 minutes before your session</li>
            <li>Courts are available exactly at your booked time</li>
            <li>Cancellations must be made at least 2 hours in advance</li>
          </ul>
          
          <div class="footer">
            <p>Questions? Contact us at info@padelclub.com or call (555) 123-4567</p>
            <p>PadelClub - Where Champions Play</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

export function generateBookingReminderEmail(booking: {
  playerName: string
  courtName: string
  date: string
  time: string
}) {
  const formattedDate = new Date(booking.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Reminder - PadelClub</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ec4899; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .reminder-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ec4899; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏰ Game Time Reminder</h1>
          <p>Your padel session is tomorrow!</p>
        </div>
        
        <div class="content">
          <h2>Hi ${booking.playerName}!</h2>
          <p>Just a friendly reminder that you have a padel court booked for tomorrow.</p>
          
          <div class="reminder-box">
            <h3>Your Booking Details:</h3>
            <p><strong>Court:</strong> ${booking.courtName}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${booking.time}</p>
          </div>
          
          <p>We're excited to see you on the court! Remember to arrive 10 minutes early to get settled.</p>
          
          <div class="footer">
            <p>See you tomorrow! 🎾</p>
            <p>PadelClub Team</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}
