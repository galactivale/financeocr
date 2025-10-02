import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { ProblemSection } from "@/components/problem-section"
import { SolutionSection } from "@/components/solution-section"
import { SocialProof } from "@/components/social-proof"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { PlatformSection } from "@/components/platform-section"
import { AuthoritySection } from "@/components/authority-section"
import { PricingSection } from "@/components/pricing-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
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
