import { Shield, Eye, FileText, ArrowRight } from "lucide-react"

export function ProcessSection() {
  const steps = [
    {
      number: "1",
      title: "Continuous Monitoring",
      description: "Our system monitors all 50 states plus DC for regulatory changes, threshold updates, and new compliance requirements that could affect your clients.",
      icon: Shield
    },
    {
      number: "2", 
      title: "Expert Validation",
      description: "Licensed CPAs and tax attorneys review every alert, ensuring accuracy and providing professional context before it reaches your desk.",
      icon: Eye
    },
    {
      number: "3",
      title: "Decision Documentation", 
      description: "Every decision is automatically documented with timestamps, regulatory citations, and your professional reasoning—creating an unbreakable audit trail.",
      icon: FileText
    }
  ]

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Your Protection Process
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <Icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex items-center justify-center mt-6">
                      <ArrowRight className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
