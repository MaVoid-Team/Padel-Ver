"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, CreditCard, User, Mail, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Court } from "@/lib/models/Court"
import type { BookingRequest } from "@/lib/models/Booking"

interface TimeSlot {
  time: string
  duration: number
  isAvailable: boolean
}

interface BookingModalProps {
  court: Court
  date: Date
  timeSlot: TimeSlot
  onClose: () => void
  onSuccess: () => void
}

export function BookingModal({ court, date, timeSlot, onClose, onSuccess }: BookingModalProps) {
  const [formData, setFormData] = useState({
    playerName: "",
    playerEmail: "",
    playerPhone: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const totalPrice = (court.pricePerHour * timeSlot.duration) / 60

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const bookingData: BookingRequest = {
        courtId: court._id!,
        date: date.toISOString().split("T")[0],
        time: timeSlot.time,
        duration: timeSlot.duration,
        playerName: formData.playerName,
        playerEmail: formData.playerEmail,
        playerPhone: formData.playerPhone,
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create booking")
      }

      const booking = await response.json()

      try {
        await fetch("/api/notifications/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "booking_confirmation",
            booking: {
              playerName: formData.playerName,
              playerEmail: formData.playerEmail,
              courtName: court.name,
              date: date.toISOString().split("T")[0],
              time: timeSlot.time,
              duration: timeSlot.duration,
              totalPrice,
            },
          }),
        })
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError)
        // Don't fail the booking if email fails
      }

      toast({
        title: "Booking Confirmed!",
        description: `Your court is reserved for ${date.toLocaleDateString()} at ${timeSlot.time}. Check your email for confirmation details.`,
      })

      onSuccess()
    } catch (error) {
      console.error("Booking error:", error)
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Complete Your Booking</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Summary */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="font-medium">{formatDate(date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-medium">
                  {timeSlot.time} ({timeSlot.duration} minutes)
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="w-4 h-4 text-primary" />
                <span className="font-medium">{court.name}</span>
              </div>
              <div className="pt-2 border-t border-primary/20">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Price:</span>
                  <span className="text-xl font-bold text-primary">${totalPrice}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="playerName" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name *
              </Label>
              <Input
                id="playerName"
                type="text"
                required
                value={formData.playerName}
                onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="playerEmail" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address *
              </Label>
              <Input
                id="playerEmail"
                type="email"
                required
                value={formData.playerEmail}
                onChange={(e) => setFormData({ ...formData, playerEmail: e.target.value })}
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="playerPhone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number (Optional)
              </Label>
              <Input
                id="playerPhone"
                type="tel"
                value={formData.playerPhone}
                onChange={(e) => setFormData({ ...formData, playerPhone: e.target.value })}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-transparent"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90" disabled={loading}>
                {loading ? "Booking..." : `Book for $${totalPrice}`}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
