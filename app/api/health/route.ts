import { NextResponse } from "next/server"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const mongoConfigured = Boolean(process.env.MONGODB_URI)
  return NextResponse.json({ mongoConfigured })
}
