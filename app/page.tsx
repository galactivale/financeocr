import { Navigation } from "@/components/landing/navigation"
import { HeroSection } from "@/components/landing/hero-section"
import { ProblemSection } from "@/components/landing/problem-section"
import { SolutionSection } from "@/components/landing/solution-section"
import { SocialProof } from "@/components/landing/social-proof"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { PlatformSection } from "@/components/landing/platform-section"
import { AuthoritySection } from "@/components/landing/authority-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { Footer } from "@/components/landing/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen landing-page" style={{ backgroundColor: '#F8F8F5' }}>
      <Navigation />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <SocialProof />
      <HowItWorksSection />
      <PlatformSection />
      <AuthoritySection />
      <PricingSection />
      <Footer />
    </main>
  )
}

