import { Navigation } from "../../components/navigation"
import { PlatformSection } from "@/components/landing/platform-section"

export default function PlatformPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <PlatformSection />
      </div>
    </main>
  )
}
