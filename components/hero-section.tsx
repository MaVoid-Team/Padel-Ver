"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users } from "lucide-react"

export function HeroSection() {
  const scrollToBooking = () => {
    document.getElementById("court-booking")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/professional-padel-court-with-glass-walls-and-led-.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
          Book Your Perfect
          <span className="text-primary block mt-2">Padel Court</span>
        </h1>

        <p className="text-xl md:text-2xl mb-8 text-gray-200 text-pretty max-w-2xl mx-auto">
          Experience the thrill of padel on our premium courts. Book instantly, play immediately.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <div className="flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5 text-primary" />
            <span>Instant Booking</span>
          </div>
          <div className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-primary" />
            <span>90-Min Sessions</span>
          </div>
          <div className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5 text-primary" />
            <span>Up to 4 Players</span>
          </div>
        </div>

        <Button
          size="lg"
          className="text-xl px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={scrollToBooking}
        >
          Book Now - No Login Required
        </Button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
