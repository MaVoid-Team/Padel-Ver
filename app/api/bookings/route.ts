import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Booking, BookingRequest } from "@/lib/models/Booking"
import { ObjectId } from "mongodb"

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body: BookingRequest = await request.json()
    const db = await getDatabase()

    // Validate required fields
    if (!body.courtId || !body.date || !body.time || !body.playerName || !body.playerEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if slot is still available
    const existingBooking = await db.collection<Booking>("bookings").findOne({
      courtId: body.courtId,
      date: body.date,
      time: body.time,
      status: "confirmed",
    })

    if (existingBooking) {
      return NextResponse.json({ error: "Time slot is no longer available" }, { status: 409 })
    }

    // Get court details for pricing
    const court = await db.collection("courts").findOne({ _id: new ObjectId(body.courtId) })
    if (!court) {
      return NextResponse.json({ error: "Court not found" }, { status: 404 })
    }

    const duration = body.duration || 90
    const totalPrice = (court.pricePerHour * duration) / 60

    const booking: Omit<Booking, "_id"> = {
      courtId: body.courtId,
      courtName: court.name,
      date: body.date,
      time: body.time,
      duration,
      playerName: body.playerName,
      playerEmail: body.playerEmail,
      playerPhone: body.playerPhone,
      totalPrice,
      status: "confirmed",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("bookings").insertOne(booking)

    return NextResponse.json({ _id: result.insertedId, ...booking })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    const db = await getDatabase()
    const query = email ? { playerEmail: email } : {}

    const bookings = await db.collection<Booking>("bookings").find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}
