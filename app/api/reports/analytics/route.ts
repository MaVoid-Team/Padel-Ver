
import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Booking } from "@/lib/models/Booking"

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "30" // days
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - Number.parseInt(period))

    const db = await getDatabase()

    // Get bookings for the period
    const bookings = await db
      .collection<Booking>("bookings")
      .find({
        createdAt: { $gte: startDate },
        status: { $in: ["confirmed", "completed"] },
      })
      .toArray()

    // Revenue by day
    const revenueByDay = bookings.reduce(
      (acc, booking) => {
        const date = booking.date
        acc[date] = (acc[date] || 0) + booking.totalPrice
        return acc
      },
      {} as Record<string, number>,
    )

    // Bookings by hour
    const bookingsByHour = bookings.reduce(
      (acc, booking) => {
        const hour = Number.parseInt(booking.time.split(":")[0])
        acc[hour] = (acc[hour] || 0) + 1
        return acc
      },
      {} as Record<number, number>,
    )

    // Court utilization
    const courtUtilization = bookings.reduce(
      (acc, booking) => {
        acc[booking.courtName] = (acc[booking.courtName] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Top customers
    const customerStats = bookings.reduce(
      (acc, booking) => {
        const email = booking.playerEmail
        if (!acc[email]) {
          acc[email] = {
            name: booking.playerName,
            email,
            bookings: 0,
            totalSpent: 0,
          }
        }
        acc[email].bookings += 1
        acc[email].totalSpent += booking.totalPrice
        return acc
      },
      {} as Record<string, any>,
    )

    const topCustomers = Object.values(customerStats)
      .sort((a: any, b: any) => b.totalSpent - a.totalSpent)
      .slice(0, 10)

    // Calculate metrics
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0)
    const averageBookingValue = totalRevenue / bookings.length || 0
    const uniqueCustomers = new Set(bookings.map((b) => b.playerEmail)).size
    const repeatCustomerRate = ((bookings.length - uniqueCustomers) / bookings.length) * 100 || 0

    const analytics = {
      period: Number.parseInt(period),
      totalBookings: bookings.length,
      totalRevenue,
      averageBookingValue: Math.round(averageBookingValue * 100) / 100,
      uniqueCustomers,
      repeatCustomerRate: Math.round(repeatCustomerRate * 100) / 100,
      revenueByDay: Object.entries(revenueByDay).map(([date, revenue]) => ({
        date,
        revenue,
      })),
      bookingsByHour: Object.entries(bookingsByHour).map(([hour, count]) => ({
        hour: Number.parseInt(hour),
        bookings: count,
      })),
      courtUtilization: Object.entries(courtUtilization).map(([court, bookings]) => ({
        court,
        bookings,
      })),
      topCustomers,
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Error generating analytics:", error)
    return NextResponse.json({ error: "Failed to generate analytics" }, { status: 500 })
  }
}
