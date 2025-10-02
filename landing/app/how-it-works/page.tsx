import { Navigation } from "@/components/navigation"
import { HowItWorksSection } from "@/components/how-it-works-section"

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <HowItWorksSection />
      </div>
    </main>
  )
}
