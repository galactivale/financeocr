import { Button } from "@/components/ui/button"
import { Shield, AlertTriangle, CheckCircle } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-background to-muted/20 py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Announcement Banner */}
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-8">
            <CheckCircle className="h-4 w-4" />
            Trusted by 500+ CPA firms nationwide
          </div>

          {/* Hero Headline */}
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance">
            Protect Your License.
            <span className="text-primary block">Your Professional Liability Shield</span>
            <span className="text-muted-foreground text-3xl md:text-4xl lg:text-5xl block mt-2">
              Against Compliance Penalties.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed text-pretty">
            FinanceOCR provides CPA firms with regulatory intelligence and audit-ready documentation to eliminate blind
            spots, justify every professional judgment, and secure your firm's future.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-4 text-lg"
            >
              Schedule a Liability Assessment
            </Button>
            <Button variant="outline" size="lg" className="font-medium px-8 py-4 text-lg bg-transparent">
              Request Your Exposure Report
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-medium">SOC 2 Compliant</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <CheckCircle className="h-6 w-6 text-primary" />
              <span className="font-medium">AICPA Endorsed</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <AlertTriangle className="h-6 w-6 text-primary" />
              <span className="font-medium">Risk Mitigation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

