import { Navigation } from "@/components/landing/navigation"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { Footer } from "@/components/landing/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen landing-page">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </main>
  )
}

