import { Shield, BookOpen, Users, Award, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AuthoritySection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            For CPAs, By Experts
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            FinanceOCR exists to eliminate the compliance liability blind spots that keep CPA partners awake at night.
            Built by practitioners who understand the weight of professional responsibility.
          </p>
        </div>

        {/* Origin Story */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-card border border-border/50 rounded-lg p-8">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">Why FinanceOCR Exists</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    In 2019, a respected CPA firm faced a $2.3 million malpractice claim after missing a single nexus
                    threshold change in Colorado. Despite 30 years of impeccable service, they couldn&apos;t defend their
                    professional judgment because their decision process wasn&apos;t documented.
                  </p>
                  <p>
                    That firm&apos;s senior partner, Sarah Chen, CPA, joined our founding team with a single mission:
                    <strong className="text-foreground">
                      {" "}
                      ensure no CPA ever faces professional liability due to compliance blind spots again.
                    </strong>
                  </p>
                  <p>
                    Today, FinanceOCR protects over 500 CPA firms nationwide, creating an unbreakable shield of
                    documentation, regulatory intelligence, and professional accountability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Insights Section */}
        <div className="mb-16">
          <h2 className="font-serif text-3xl font-semibold text-center text-foreground mb-12">Professional Insights</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            Deep regulatory analysis and compliance intelligence from our team of licensed professionals.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <BookOpen className="h-4 w-4" />
                  Regulatory Analysis
                </div>
                <CardTitle className="font-serif text-xl">
                  Interpreting Colorado&apos;s Marketplace Facilitator Rule: What CPAs Need to Know
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Colorado&apos;s recent amendments to marketplace facilitator regulations create new compliance obligations
                  for sellers. Our analysis of the regulatory changes and their impact on nexus determinations.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">By Sarah Chen, CPA</span>
                  <Button variant="ghost" size="sm">
                    Read Analysis <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Shield className="h-4 w-4" />
                  Malpractice Prevention
                </div>
                <CardTitle className="font-serif text-xl">
                  Documenting Nexus Decisions for Malpractice Audits: A Practitioner&apos;s Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  What documentation survives in court? Based on 50+ malpractice cases, we analyze the decision trails
                  that protect CPAs and those that don&apos;t.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">By Michael Rodriguez, JD</span>
                  <Button variant="ghost" size="sm">
                    Read Guide <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Award className="h-4 w-4" />
                  Technology Insights
                </div>
                <CardTitle className="font-serif text-xl">
                  The Hidden Costs of Manual Compliance Monitoring: A Data Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Our analysis of 1,000+ CPA firms reveals the true cost of manual compliance tracking: time, risk, and
                  professional liability exposure.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">By Dr. Jennifer Park, CPA</span>
                  <Button variant="ghost" size="sm">
                    View Research <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <BookOpen className="h-4 w-4" />
                  Case Study
                </div>
                <CardTitle className="font-serif text-xl">
                  How Automated Monitoring Prevented a $500K Penalty: A Real Case Study
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  A mid-size CPA firm&apos;s client exceeded Texas thresholds by $50K. Here&apos;s how FinanceOCR&apos;s early
                  detection and documentation prevented catastrophic penalties.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">By Sarah Chen, CPA</span>
                  <Button variant="ghost" size="sm">
                    Read Case Study <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-4">
            Speak with a Compliance Strategist
          </Button>
        </div>
      </div>
    </section>
  )
}
