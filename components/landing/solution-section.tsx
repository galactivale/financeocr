import { Shield, Eye, FileText, CheckCircle } from "lucide-react"

export function SolutionSection() {
  return (
    <section id="compliance" className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Your Professional Liability Shield
          </h2>
          <p className="text-lg text-gray-600">
            Three pillars of protection that transform compliance anxiety into confident professional practice.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Systematic Monitoring */}
          <div className="bg-gray-50 rounded-xl p-8">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Systematic Monitoring</h3>
            <p className="text-gray-600 mb-6">
              Continuous surveillance of all 50 states plus DC for threshold changes, new regulations, and compliance requirements that affect your clients.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Real-time regulatory updates
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Automated threshold tracking
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Multi-jurisdiction compliance
              </li>
            </ul>
          </div>

          {/* Expert-Validated Intelligence */}
          <div className="bg-gray-50 rounded-xl p-8">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Expert-Validated Intelligence</h3>
            <p className="text-gray-600 mb-6">
              Every alert is reviewed by licensed CPAs and tax attorneys before reaching your desk, ensuring accuracy and professional relevance.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                CPA-reviewed analysis
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Legal precedent research
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Professional recommendations
              </li>
            </ul>
          </div>

          {/* Court-Ready Audit Trails */}
          <div className="bg-gray-50 rounded-xl p-8">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Court-Ready Audit Trails</h3>
            <p className="text-gray-600 mb-6">
              Comprehensive documentation of every decision, with timestamps, regulatory citations, and professional reasoning that stands up in court.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Timestamped decisions
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Regulatory citations
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Defensible documentation
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}