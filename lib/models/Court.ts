export interface Court {
  _id?: string
  name: string
  description?: string
  isActive: boolean
  openTime: string // "08:00"
  closeTime: string // "22:00"
  pricePerHour: number
  createdAt: Date
  updatedAt: Date
}

export interface TimeSlot {
  courtId: string
  date: string // "2024-01-15"
  time: string // "14:00"
  duration: number // minutes
  isAvailable: boolean
}
