import { Navigation } from "../../components/navigation"
import { PricingSection } from "@/components/landing/pricing-section"

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <PricingSection />
      </div>
    </main>
  )
}
