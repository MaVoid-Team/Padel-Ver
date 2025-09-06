import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Court } from "@/lib/models/Court"

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const db = await getDatabase()
    const courts = await db.collection<Court>("courts").find({ isActive: true }).toArray()

    return NextResponse.json(courts)
  } catch (error) {
    console.error("Error fetching courts:", error)
    return NextResponse.json({ error: "Failed to fetch courts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const db = await getDatabase()

    const court: Omit<Court, "_id"> = {
      name: body.name,
      description: body.description || "",
      isActive: true,
      openTime: body.openTime || "08:00",
      closeTime: body.closeTime || "22:00",
      pricePerHour: body.pricePerHour || 50,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("courts").insertOne(court)

    return NextResponse.json({ _id: result.insertedId, ...court })
  } catch (error) {
    console.error("Error creating court:", error)
    return NextResponse.json({ error: "Failed to create court" }, { status: 500 })
  }
}
