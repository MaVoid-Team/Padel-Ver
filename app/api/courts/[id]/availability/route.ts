import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Booking } from "@/lib/models/Booking"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")

    if (!date) {
      return NextResponse.json({ error: "Date parameter is required" }, { status: 400 })
    }

    const db = await getDatabase()

    // Get existing bookings for this court and date
    const existingBookings = await db
      .collection<Booking>("bookings")
      .find({
        courtId: params.id,
        date: date,
        status: { $in: ["confirmed"] },
      })
      .toArray()

    // Generate available time slots (8:00 AM to 10:00 PM, 90-minute slots)
    const availableSlots = []
    const startHour = 8
    const endHour = 22
    const slotDuration = 90 // minutes

    for (let hour = startHour; hour < endHour; hour += 1.5) {
      const time = `${Math.floor(hour).toString().padStart(2, "0")}:${hour % 1 === 0.5 ? "30" : "00"}`

      // Check if this slot conflicts with existing bookings
      const isBooked = existingBookings.some((booking) => {
        const bookingStart = booking.time
        const bookingEnd = addMinutesToTime(booking.time, booking.duration)
        const slotEnd = addMinutesToTime(time, slotDuration)

        return timeOverlaps(time, slotEnd, bookingStart, bookingEnd)
      })

      if (!isBooked) {
        availableSlots.push({
          time,
          duration: slotDuration,
          isAvailable: true,
        })
      }
    }

    return NextResponse.json(availableSlots)
  } catch (error) {
    console.error("Error fetching availability:", error)
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 })
  }
}

function addMinutesToTime(time: string, minutes: number): string {
  const [hours, mins] = time.split(":").map(Number)
  const totalMinutes = hours * 60 + mins + minutes
  const newHours = Math.floor(totalMinutes / 60)
  const newMins = totalMinutes % 60
  return `${newHours.toString().padStart(2, "0")}:${newMins.toString().padStart(2, "0")}`
}

function timeOverlaps(start1: string, end1: string, start2: string, end2: string): boolean {
  return start1 < end2 && start2 < end1
}
