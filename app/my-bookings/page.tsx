import { Navigation } from "@/components/navigation"
import { MyBookings } from "@/components/my-bookings"

export default function MyBookingsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        <MyBookings />
      </div>
    </main>
  )
}
