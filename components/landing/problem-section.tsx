import { AlertTriangle, Clock, DollarSign } from "lucide-react"

export function ProblemSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            The 3 AM Worry Every Partner Knows
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            The fear that keeps successful CPA partners awake at night isn't about losing clients—it's about the
            compliance blind spots that could destroy everything they've built.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card p-8 rounded-lg border border-border/50 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-4">Missed Thresholds</h3>
            <p className="text-muted-foreground leading-relaxed">
              A single overlooked nexus threshold can trigger penalties exceeding $35,000 per violation, plus interest
              and potential criminal liability.
            </p>
          </div>

          <div className="bg-card p-8 rounded-lg border border-border/50 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-4">Malpractice Exposure</h3>
            <p className="text-muted-foreground leading-relaxed">
              Without documented decision trails, your professional judgment becomes indefensible in court. Average
              settlements exceed $125,000.
            </p>
          </div>

          <div className="bg-card p-8 rounded-lg border border-border/50 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <DollarSign className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-4">Reputational Damage</h3>
            <p className="text-muted-foreground leading-relaxed">
              State board sanctions and public disciplinary actions can destroy decades of reputation building and
              client trust in a single announcement.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

