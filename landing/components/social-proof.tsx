export function SocialProof() {
  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-8">
            Trusted by Leading CPA Firms
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
          <div className="bg-card p-6 rounded-lg border border-border/30 w-full text-center">
            <div className="font-serif text-lg font-semibold text-foreground">Baker Tilly</div>
            <div className="text-xs text-muted-foreground mt-1">Advisory Services</div>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border/30 w-full text-center">
            <div className="font-serif text-lg font-semibold text-foreground">CliftonLarsonAllen</div>
            <div className="text-xs text-muted-foreground mt-1">Tax & Advisory</div>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border/30 w-full text-center">
            <div className="font-serif text-lg font-semibold text-foreground">Grant Thornton</div>
            <div className="text-xs text-muted-foreground mt-1">Risk Advisory</div>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border/30 w-full text-center">
            <div className="font-serif text-lg font-semibold text-foreground">Moss Adams</div>
            <div className="text-xs text-muted-foreground mt-1">Compliance</div>
          </div>
        </div>
      </div>
    </section>
  )
}
