import { AlertTriangle, Shield, FileText, Clock, CheckCircle, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PlatformSection() {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Your Compliance Command Center
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            Transform regulatory chaos into organized intelligence with real-time risk assessment and audit-ready
            documentation.
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-card border border-border/50 rounded-lg p-6 shadow-lg">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/30">
              <div>
                <h3 className="font-serif text-xl font-semibold text-foreground">Liability Dashboard</h3>
                <p className="text-sm text-muted-foreground">Real-time compliance monitoring for 247 active clients</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                Live monitoring active
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    Estimated Exposure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">$847,500</div>
                  <p className="text-xs text-muted-foreground mt-1">Across 23 high-risk clients</p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Audit Trails
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">142</div>
                  <p className="text-xs text-muted-foreground mt-1">Your Growing Shield</p>
                </CardContent>
              </Card>

              <Card className="border-accent/20 bg-accent/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Protected Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">$12.4M</div>
                  <p className="text-xs text-muted-foreground mt-1">Client revenue under protection</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Alerts */}
            <div className="space-y-4">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Priority Alerts Requiring Action
              </h4>

              <div className="space-y-3">
                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-destructive rounded-full"></div>
                        <span className="font-medium text-foreground">TechCorp Solutions - California Nexus</span>
                        <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">HIGH RISK</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Sales exceeded $500K threshold by $127,847. Registration required within 30 days to avoid
                        penalties.
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Detected: 2 hours ago</span>
                        <span>Regulation: CA Rev. & Tax Code §6051</span>
                        <span>Potential Penalty: $35,000+</span>
                      </div>
                    </div>
                    <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground ml-4">
                      <Eye className="h-3 w-3 mr-1" />
                      Review
                    </Button>
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="font-medium text-foreground">Global Manufacturing Inc - Texas Update</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">MEDIUM</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Texas threshold increased to $500K effective Jan 1. Client currently at $487K - monitoring
                        required.
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Detected: 1 day ago</span>
                        <span>Regulation: TX Tax Code §151.107</span>
                        <span>Action: Monitor Q4 sales</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="ml-4 bg-transparent">
                      <FileText className="h-3 w-3 mr-1" />
                      Document
                    </Button>
                  </div>
                </div>

                <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <span className="font-medium text-foreground">RetailPlus Corp - Florida Compliance</span>
                        <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">RESOLVED</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Successfully registered in Florida. Audit trail #4721 created with full documentation.
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Completed: 3 days ago</span>
                        <span>CPA: Sarah Chen</span>
                        <span>Audit Trail: #4721</span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="ml-4">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      View Trail
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-3">Risk Quantification</h3>
            <p className="text-muted-foreground leading-relaxed">
              See your exact financial exposure across all clients and jurisdictions in real-time.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-3">Instant Alerts</h3>
            <p className="text-muted-foreground leading-relaxed">
              Get notified the moment any client approaches or exceeds compliance thresholds.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-3">One-Click Documentation</h3>
            <p className="text-muted-foreground leading-relaxed">
              Generate court-ready audit trails with regulatory citations and professional reasoning.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-4 mr-4"
          >
            Request Platform Demo
          </Button>
          <Button size="lg" variant="outline" className="font-medium px-8 py-4 bg-transparent">
            View Sample Dashboard
          </Button>
        </div>
      </div>
    </section>
  )
}
