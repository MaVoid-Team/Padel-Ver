"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Clock, User, MapPin } from "lucide-react"
import type { Booking } from "@/lib/models/Booking"
import type { Court } from "@/lib/models/Court"

interface BookingsCalendarProps {
  bookings: Booking[]
  courts: Court[]
}

export function BookingsCalendar({ bookings, courts }: BookingsCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const getBookingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return bookings.filter((booking) => booking.date === dateStr)
  }

  const selectedDateBookings = getBookingsForDate(selectedDate)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Calendar View
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border-0"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bookings for {formatDate(selectedDate)}</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateBookings.length > 0 ? (
            <div className="space-y-4">
              {selectedDateBookings
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((booking) => (
                  <div key={booking._id} className="p-4 bg-muted/50 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="font-medium">{booking.time}</span>
                      </div>
                      <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>{booking.status}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>{booking.playerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{booking.courtName}</span>
                    </div>
                    <div className="text-sm font-medium text-primary">${booking.totalPrice}</div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No bookings for this date</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
