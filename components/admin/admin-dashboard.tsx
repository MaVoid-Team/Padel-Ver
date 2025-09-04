"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Users, DollarSign, Clock, Plus, Settings, BarChart3 } from "lucide-react"
import { BookingsCalendar } from "@/components/admin/bookings-calendar"
import { CourtManagement } from "@/components/admin/court-management"
import { UserManagement } from "@/components/admin/user-management"
import { ReportsSection } from "@/components/admin/reports-section"
import { AdvancedReports } from "@/components/admin/advanced-reports"
import type { Booking } from "@/lib/models/Booking"
import type { Court } from "@/lib/models/Court"

interface DashboardStats {
  totalBookings: number
  totalRevenue: number
  activeUsers: number
  averageBookingDuration: number
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalRevenue: 0,
    activeUsers: 0,
    averageBookingDuration: 0,
  })
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [courts, setCourts] = useState<Court[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch bookings
      const bookingsResponse = await fetch("/api/bookings")
      const bookings: Booking[] = await bookingsResponse.json()

      // Fetch courts
      const courtsResponse = await fetch("/api/courts")
      const courtsData: Court[] = await courtsResponse.json()

      // Calculate stats
      const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0)
      const uniqueUsers = new Set(bookings.map((booking) => booking.playerEmail)).size
      const avgDuration =
        bookings.length > 0 ? bookings.reduce((sum, booking) => sum + booking.duration, 0) / bookings.length : 0

      setStats({
        totalBookings: bookings.length,
        totalRevenue,
        activeUsers: uniqueUsers,
        averageBookingDuration: Math.round(avgDuration),
      })

      setRecentBookings(bookings.slice(0, 5))
      setCourts(courtsData)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 bg-muted rounded w-64 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your padel club operations</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Quick Actions
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">All time bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${stats.totalRevenue}</div>
              <p className="text-xs text-muted-foreground">Total earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">Unique players</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.averageBookingDuration}min</div>
              <p className="text-xs text-muted-foreground">Average duration</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="courts" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Courts
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <BookingsCalendar bookings={recentBookings} courts={courts} />
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div key={booking._id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{booking.playerName}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.courtName} - {booking.date} at {booking.time}
                          </p>
                        </div>
                        <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="courts">
            <CourtManagement courts={courts} onUpdate={fetchDashboardData} />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement bookings={recentBookings} />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsSection bookings={recentBookings} stats={stats} />
          </TabsContent>

          <TabsContent value="analytics">
            <AdvancedReports />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
