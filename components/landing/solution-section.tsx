import { Shield, Search, FileCheck } from "lucide-react"

export function SolutionSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Your Professional Liability Shield
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            Three pillars of protection that transform compliance anxiety into confident professional practice.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-card p-8 rounded-lg border border-border/50">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">Systematic Monitoring</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Continuous surveillance of all 50 states plus DC for threshold changes, new regulations, and compliance
              requirements that affect your clients.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                Real-time regulatory updates
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                Automated threshold tracking
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                Multi-jurisdiction compliance
              </li>
            </ul>
          </div>

          <div className="bg-card p-8 rounded-lg border border-border/50">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">Expert-Validated Intelligence</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Every alert is reviewed by licensed CPAs and tax attorneys before reaching your desk, ensuring accuracy
              and professional relevance.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                CPA-reviewed analysis
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                Legal precedent research
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                Professional recommendations
              </li>
            </ul>
          </div>

          <div className="bg-card p-8 rounded-lg border border-border/50">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <FileCheck className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">Court-Ready Audit Trails</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Comprehensive documentation of every decision, with timestamps, regulatory citations, and professional
              reasoning that stands up in court.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                Timestamped decisions
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                Regulatory citations
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                Defensible documentation
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

