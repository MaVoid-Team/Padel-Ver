export interface Booking {
  _id?: string
  courtId: string
  courtName: string
  date: string // "2024-01-15"
  time: string // "14:00"
  duration: number // minutes (default 90)
  playerName: string
  playerEmail: string
  playerPhone?: string
  totalPrice: number
  status: "confirmed" | "cancelled" | "completed"
  createdAt: Date
  updatedAt: Date
}

export interface BookingRequest {
  courtId: string
  date: string
  time: string
  duration?: number
  playerName: string
  playerEmail: string
  playerPhone?: string
}
