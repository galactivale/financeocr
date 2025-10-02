import { Navigation } from "@/components/navigation"
import { AuthoritySection } from "@/components/authority-section"

export default function AuthorityPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <AuthoritySection />
      </div>
    </main>
  )
}
