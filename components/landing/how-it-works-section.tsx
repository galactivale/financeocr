import { ArrowRight, AlertCircle, CheckCircle, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            From Ambiguity to Defensible Clarity
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            See how FinanceOCR transforms compliance uncertainty into court-ready documentation that protects your
            professional reputation.
          </p>
        </div>

        {/* Before/After Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-20">
          {/* BEFORE */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-semibold text-foreground">BEFORE</h3>
                <p className="text-muted-foreground">Compliance Chaos</p>
              </div>
            </div>

            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-6">
              <div className="bg-card p-4 rounded border border-border/50 mb-4">
                <div className="font-mono text-sm text-muted-foreground mb-2">client_spreadsheet_final_v3.xlsx</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>CA Sales</span>
                    <span className="text-destructive font-semibold">$525,000???</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Threshold</span>
                    <span>$500,000</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Last updated: 3 months ago
                    <br />
                    Source: &quot;I think this is right&quot; - Junior Staff
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">No documentation of decision process</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Unclear data sources and methodology</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">No regulatory citations or justification</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Indefensible in audit or malpractice claim</span>
                </div>
              </div>
            </div>
          </div>

          {/* AFTER */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-semibold text-foreground">AFTER</h3>
                <p className="text-muted-foreground">Professional Protection</p>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <div className="bg-card p-4 rounded border border-border/50 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-mono text-sm text-muted-foreground">FinanceOCR Audit Trail #4721</div>
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">California Nexus Analysis</span>
                    <span className="text-primary font-semibold">$525,847</span>
                  </div>

                  <div className="bg-muted/50 p-3 rounded text-xs space-y-2">
                    <div className="flex justify-between">
                      <span>Threshold (CA Rev. & Tax Code §6051)</span>
                      <span>$500,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Excess Amount</span>
                      <span className="text-primary font-medium">$25,847</span>
                    </div>
                    <div className="text-muted-foreground">
                      Analysis Date: {new Date().toLocaleDateString()}
                      <br />
                      CPA Decision: Registration Required
                    </div>
                  </div>

                  <div className="bg-accent/10 p-3 rounded">
                    <div className="text-xs font-medium text-accent-foreground mb-1">Professional Reasoning</div>
                    <div className="text-xs text-muted-foreground">
                      &quot;Based on verified sales data and current CA threshold requirements, client exceeds nexus
                      threshold by $25,847. Registration recommended within 30 days to avoid penalties.&quot;
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">— Sarah Chen, CPA (License #12345)</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Complete audit trail with timestamps</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Regulatory citations and legal precedents</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Licensed CPA professional judgment documented</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Court-ready documentation for malpractice defense</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="max-w-4xl mx-auto">
          <h3 className="font-serif text-2xl font-semibold text-center text-foreground mb-12">
            Your Protection Process
          </h3>

          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-serif text-xl font-semibold text-foreground mb-2">Continuous Monitoring</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Our system monitors all 50 states plus DC for regulatory changes, threshold updates, and new
                  compliance requirements that could affect your clients.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-serif text-xl font-semibold text-foreground mb-2">Expert Validation</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Licensed CPAs and tax attorneys review every alert, ensuring accuracy and providing professional
                  context before it reaches your desk.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-serif text-xl font-semibold text-foreground mb-2">Decision Documentation</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Every decision is automatically documented with timestamps, regulatory citations, and your
                  professional reasoning—creating an unbreakable audit trail.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-4">
              See Your Protection in Action
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

