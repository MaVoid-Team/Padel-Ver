import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { CourtBooking } from "@/components/court-booking"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        <HeroSection />
        <CourtBooking />
      </div>
    </main>
  )
}