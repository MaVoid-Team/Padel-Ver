// Script to seed initial courts data
import { MongoClient } from "mongodb"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const client = new MongoClient(uri)

async function seedCourts() {
  try {
    await client.connect()
    const db = client.db("padel_club")

    // Clear existing courts
    await db.collection("courts").deleteMany({})

    // Insert sample courts
    const courts = [
      {
        name: "Court 1 - Premium",
        description: "Our flagship court with premium glass walls and LED lighting",
        isActive: true,
        openTime: "08:00",
        closeTime: "22:00",
        pricePerHour: 60,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Court 2 - Standard",
        description: "Standard court perfect for casual games",
        isActive: true,
        openTime: "08:00",
        closeTime: "22:00",
        pricePerHour: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Court 3 - Training",
        description: "Ideal for training sessions and lessons",
        isActive: true,
        openTime: "09:00",
        closeTime: "21:00",
        pricePerHour: 45,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    const result = await db.collection("courts").insertMany(courts)
    console.log(`Inserted ${result.insertedCount} courts`)
  } catch (error) {
    console.error("Error seeding courts:", error)
  } finally {
    await client.close()
  }
}

seedCourts()
