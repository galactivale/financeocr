import { Navigation } from "@/components/landing/navigation"
import { HeroSection } from "@/components/landing/hero-section"
import { ProblemSection } from "@/components/landing/problem-section"
import { SolutionSection } from "@/components/landing/solution-section"
import { TrustedSection } from "@/components/landing/trusted-section"
import { BeforeAfterSection } from "@/components/landing/before-after-section"
import { ProcessSection } from "@/components/landing/process-section"
import { DashboardDemoSection } from "@/components/landing/dashboard-demo-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { PartnerLogos } from "@/components/landing/partner-logos"
import { Footer } from "@/components/landing/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <TrustedSection />
      <BeforeAfterSection />
      <ProcessSection />
      <DashboardDemoSection />
      <PricingSection />
      <PartnerLogos />
      <Footer />
    </main>
  )
}

