import { Shield, CheckCircle, AlertTriangle, DollarSign, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PricingSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            An Investment in Your Firm's Future
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            Professional liability protection for a fraction of the cost of a single malpractice claim or regulatory
            penalty.
          </p>
        </div>

        {/* Risk Context */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-8">
            <h2 className="font-serif text-2xl font-semibold text-center text-foreground mb-8">
              The Cost of Compliance Failure
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
                <div className="text-3xl font-bold text-destructive mb-2">$35,000</div>
                <p className="text-sm text-muted-foreground">Average penalty per nexus violation</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-destructive" />
                </div>
                <div className="text-3xl font-bold text-destructive mb-2">$125,000</div>
                <p className="text-sm text-muted-foreground">Average malpractice claim settlement</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="h-8 w-8 text-destructive" />
                </div>
                <div className="text-3xl font-bold text-destructive mb-2">Priceless</div>
                <p className="text-sm text-muted-foreground">Your professional reputation and license</p>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-muted-foreground font-medium">
                FinanceOCR: Systematic protection for a fraction of the cost.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Professional Shield */}
            <Card className="border-primary/30 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              </div>
              <CardHeader className="text-center pt-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-serif text-2xl">Professional Shield</CardTitle>
                <p className="text-muted-foreground">For growing CPA firms</p>
                <div className="mt-4">
                  <div className="text-4xl font-bold text-foreground">$2,497</div>
                  <div className="text-muted-foreground">/month</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Up to 100 clients monitored</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">All 50 states + DC coverage</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Real-time regulatory alerts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Court-ready audit trails</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">CPA-reviewed intelligence</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Professional liability documentation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Email & phone support</span>
                  </div>
                </div>

                <div className="bg-accent/10 p-4 rounded-lg">
                  <div className="text-sm font-medium text-accent-foreground mb-2">ROI Analysis</div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Annual cost: $29,964</div>
                    <div>vs. Single penalty: $35,000+</div>
                    <div className="font-medium text-accent">Pays for itself with first prevention</div>
                  </div>
                </div>

                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3">
                  Protect Your Firm
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Shield */}
            <Card className="border-border/50">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="font-serif text-2xl">Enterprise Shield</CardTitle>
                <p className="text-muted-foreground">For established firms</p>
                <div className="mt-4">
                  <div className="text-4xl font-bold text-foreground">$4,997</div>
                  <div className="text-muted-foreground">/month</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Unlimited clients monitored</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">All Professional Shield features</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Dedicated compliance strategist</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Custom regulatory research</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Priority legal consultation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">White-label client reports</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">24/7 emergency support</span>
                  </div>
                </div>

                <div className="bg-accent/10 p-4 rounded-lg">
                  <div className="text-sm font-medium text-accent-foreground mb-2">Enterprise Value</div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Annual cost: $59,964</div>
                    <div>vs. Major malpractice claim: $125,000+</div>
                    <div className="font-medium text-accent">Comprehensive liability protection</div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full font-semibold py-3 bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Speak with a Compliance Strategist
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-card border border-border/50 rounded-lg p-8">
            <h3 className="font-serif text-2xl font-semibold text-center text-foreground mb-8">
              Why This Investment Makes Sense
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium text-foreground mb-3">Traditional Approach Costs</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Junior staff time (20 hrs/month)</span>
                    <span>$2,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Senior review time (5 hrs/month)</span>
                    <span>$1,250</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Research subscriptions</span>
                    <span>$500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Missed threshold risk</span>
                    <span>$35,000+</span>
                  </div>
                  <div className="border-t border-border/30 pt-2 flex justify-between font-medium text-foreground">
                    <span>Total Monthly Risk</span>
                    <span>$38,750+</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-3">FinanceOCR Protection</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Professional Shield</span>
                    <span>$2,497</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Staff time saved</span>
                    <span>$3,250</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Risk elimination</span>
                    <span>Priceless</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Peace of mind</span>
                    <span>Priceless</span>
                  </div>
                  <div className="border-t border-border/30 pt-2 flex justify-between font-medium text-primary">
                    <span>Net Monthly Savings</span>
                    <span>$753+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
            Ready to Protect Your Professional Future?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join 500+ CPA firms who sleep better knowing their compliance liability is professionally managed and
            documented.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-4">
              Schedule a Liability Assessment
            </Button>
            <Button size="lg" variant="outline" className="font-medium px-8 py-4 bg-transparent">
              Request Your Exposure Report
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

