import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Booking } from "@/lib/models/Booking"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    const db = await getDatabase()

    if (email) {
      // Get specific user profile with their bookings
      const userBookings = await db
        .collection<Booking>("bookings")
        .find({ playerEmail: email })
        .sort({ createdAt: -1 })
        .toArray()

      if (userBookings.length === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      const userProfile = {
        email: userBookings[0].playerEmail,
        name: userBookings[0].playerName,
        phone: userBookings[0].playerPhone,
        totalBookings: userBookings.length,
        totalSpent: userBookings.reduce((sum, booking) => sum + booking.totalPrice, 0),
        bookings: userBookings,
        joinDate: userBookings[userBookings.length - 1].createdAt,
        lastBooking: userBookings[0].createdAt,
      }

      return NextResponse.json(userProfile)
    } else {
      // Get all users aggregated from bookings
      const pipeline = [
        {
          $group: {
            _id: "$playerEmail",
            name: { $first: "$playerName" },
            phone: { $first: "$playerPhone" },
            totalBookings: { $sum: 1 },
            totalSpent: { $sum: "$totalPrice" },
            firstBooking: { $min: "$createdAt" },
            lastBooking: { $max: "$createdAt" },
          },
        },
        {
          $project: {
            email: "$_id",
            name: 1,
            phone: 1,
            totalBookings: 1,
            totalSpent: 1,
            joinDate: "$firstBooking",
            lastBooking: 1,
            _id: 0,
          },
        },
        { $sort: { totalSpent: -1 } },
      ]

      const users = await db.collection("bookings").aggregate(pipeline).toArray()

      return NextResponse.json(users)
    }
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
