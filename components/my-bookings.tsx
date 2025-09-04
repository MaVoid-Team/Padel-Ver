"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar, Clock, Mail, User, Phone, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Booking } from "@/lib/models/Booking"

export function MyBookings() {
  const [email, setEmail] = useState("")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [showLookup, setShowLookup] = useState(true)
  const { toast } = useToast()

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    try {
      const response = await fetch(`/api/bookings?email=${encodeURIComponent(email)}`)
      const data = await response.json()

      if (response.ok) {
        setBookings(data)
        setShowLookup(false)
      } else {
        toast({
          title: "No bookings found",
          description: "No bookings found for this email address",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "cancelled" }),
      })

      if (response.ok) {
        setBookings(
          bookings.map((booking) => (booking._id === bookingId ? { ...booking, status: "cancelled" } : booking)),
        )
        toast({
          title: "Booking Cancelled",
          description: "Your booking has been cancelled successfully",
        })
      } else {
        throw new Error("Failed to cancel booking")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel booking",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "cancelled":
        return "destructive"
      case "completed":
        return "secondary"
      default:
        return "outline"
    }
  }

  if (showLookup) {
    return (
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Find Your Bookings</CardTitle>
              <p className="text-muted-foreground">Enter your email to view and manage your reservations</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLookup} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="w-4 h-4 text-primary" />
                    Email Address
                  </div>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                  {loading ? "Searching..." : "Find My Bookings"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Bookings</h1>
            <p className="text-muted-foreground">Manage your court reservations</p>
          </div>
          <Button variant="outline" onClick={() => setShowLookup(true)}>
            <Mail className="w-4 h-4 mr-2" />
            Different Email
          </Button>
        </div>

        {bookings.length > 0 ? (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card key={booking._id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold">{booking.courtName}</h3>
                        <Badge variant={getStatusColor(booking.status)}>{booking.status}</Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{formatDate(booking.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>
                            {booking.time} ({booking.duration} minutes)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" />
                          <span>{booking.playerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          <span>{booking.playerEmail}</span>
                        </div>
                        {booking.playerPhone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-primary" />
                            <span>{booking.playerPhone}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold">Total: ${booking.totalPrice}</span>
                          <div className="text-sm text-muted-foreground">
                            Booked on {new Date(booking.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {booking.status === "confirmed" && (
                      <div className="ml-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive bg-transparent"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Cancel
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Cancel Booking</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p>Are you sure you want to cancel this booking?</p>
                              <div className="p-4 bg-muted rounded-lg">
                                <div className="font-medium">{booking.courtName}</div>
                                <div className="text-sm text-muted-foreground">
                                  {formatDate(booking.date)} at {booking.time}
                                </div>
                              </div>
                              <div className="flex gap-3">
                                <Button variant="outline" className="flex-1 bg-transparent">
                                  Keep Booking
                                </Button>
                                <Button
                                  variant="destructive"
                                  className="flex-1"
                                  onClick={() => handleCancelBooking(booking._id!)}
                                >
                                  Cancel Booking
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
              <p className="text-muted-foreground">You don't have any bookings yet. Book a court to get started!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}
