"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Clock, MapPin, Star } from "lucide-react"
import { BookingModal } from "@/components/booking-modal"
import type { Court } from "@/lib/models/Court"

interface TimeSlot {
  time: string
  duration: number
  isAvailable: boolean
}

export function CourtBooking() {
  const [courts, setCourts] = useState<Court[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourts()
  }, [])

  useEffect(() => {
    if (selectedCourt && selectedDate) {
      fetchAvailability()
    }
  }, [selectedCourt, selectedDate])

  const fetchCourts = async () => {
    try {
      const response = await fetch("/api/courts")
      const data = await response.json()
      setCourts(data)
      if (data.length > 0) {
        setSelectedCourt(data[0])
      }
    } catch (error) {
      console.error("Error fetching courts:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailability = async () => {
    if (!selectedCourt || !selectedDate) return

    try {
      const dateStr = selectedDate.toISOString().split("T")[0]
      const response = await fetch(`/api/courts/${selectedCourt._id}/availability?date=${dateStr}`)
      const data = await response.json()
      setAvailableSlots(data)
    } catch (error) {
      console.error("Error fetching availability:", error)
    }
  }

  const handleBookSlot = (slot: TimeSlot) => {
    setSelectedSlot(slot)
    setShowBookingModal(true)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <section id="court-booking" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-8 bg-muted rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-muted rounded w-96 mx-auto animate-pulse" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="court-booking" className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Choose Your Court & Time</h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Select from our premium courts and find the perfect time slot for your game
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Court Selection */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Available Courts</h3>
              <div className="grid gap-4">
                {courts.map((court) => (
                  <Card
                    key={court._id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedCourt?._id === court._id ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedCourt(court)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-xl font-semibold">{court.name}</h4>
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              ${court.pricePerHour}/hour
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{court.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                {court.openTime} - {court.closeTime}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span>4.8 rating</span>
                            </div>
                          </div>
                        </div>
                        <div
                          className="w-24 h-16 bg-cover bg-center rounded-lg ml-4"
                          style={{
                            backgroundImage: "url('/padel-court-aerial-view-with-glass-walls.jpg')",
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            {selectedCourt && (
              <div>
                <h3 className="text-2xl font-semibold mb-4">Available Times for {formatDate(selectedDate)}</h3>
                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        variant="outline"
                        className="h-16 flex flex-col items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors bg-transparent"
                        onClick={() => handleBookSlot(slot)}
                      >
                        <span className="font-semibold">{slot.time}</span>
                        <span className="text-xs opacity-75">{slot.duration} min</span>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">No available slots for this date</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Calendar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border-0"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedCourt && selectedSlot && (
        <BookingModal
          court={selectedCourt}
          date={selectedDate}
          timeSlot={selectedSlot}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            setShowBookingModal(false)
            fetchAvailability() // Refresh availability
          }}
        />
      )}
    </section>
  )
}
