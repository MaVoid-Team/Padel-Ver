import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { CourtBooking } from "@/components/court-booking"

export default function HomePage() {
  const bannerPresent = !process.env.MONGODB_URI

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      {/* <div className={bannerPresent ? "pt-20" : "pt-16" } > */}
      <div>
        <HeroSection />
        <CourtBooking />
      </div>
    </main>
  )
}