import { X, Check, AlertTriangle, FileText } from "lucide-react"

export function BeforeAfterSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            From Ambiguity to Defensible Clarity
          </h2>
          <p className="text-lg text-gray-600">
            See how FinanceOCR transforms compliance uncertainty into court-ready documentation that protects your professional reputation.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* BEFORE */}
          <div className="bg-red-50 rounded-xl p-8 border border-red-200">
            <div className="flex items-center mb-6">
              <X className="w-6 h-6 text-red-600 mr-3" />
              <h3 className="text-xl font-semibold text-red-900">BEFORE</h3>
            </div>
            <h4 className="text-lg font-medium text-red-800 mb-4">Compliance Chaos</h4>
            
            <div className="bg-white rounded-lg p-6 mb-6 border border-red-200">
              <div className="text-sm text-gray-500 mb-2">client_spreadsheet_final_v3.xlsx</div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">CA Sales</span>
                  <span className="text-gray-500">$525,000???</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Threshold</span>
                  <span className="text-gray-500">$500,000</span>
                </div>
                <div className="text-xs text-gray-500">Last updated: 3 months ago</div>
                <div className="text-xs text-gray-500">Source: &quot;I think this is right&quot; - Junior Staff</div>
              </div>
            </div>

            <ul className="space-y-2 text-sm text-red-700">
              <li className="flex items-start">
                <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                No documentation of decision process
              </li>
              <li className="flex items-start">
                <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                Unclear data sources and methodology
              </li>
              <li className="flex items-start">
                <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                No regulatory citations or justification
              </li>
              <li className="flex items-start">
                <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                Indefensible in audit or malpractice claim
              </li>
            </ul>
          </div>

          {/* AFTER */}
          <div className="bg-green-50 rounded-xl p-8 border border-green-200">
            <div className="flex items-center mb-6">
              <Check className="w-6 h-6 text-green-600 mr-3" />
              <h3 className="text-xl font-semibold text-green-900">AFTER</h3>
            </div>
            <h4 className="text-lg font-medium text-green-800 mb-4">Professional Protection</h4>
            
            <div className="bg-white rounded-lg p-6 mb-6 border border-green-200">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-500">FinanceOCR Audit Trail #4721</div>
                <div className="flex items-center text-green-600 text-sm">
                  <Check className="w-4 h-4 mr-1" />
                  Verified
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-900">California Nexus Analysis</div>
                <div className="flex justify-between">
                  <span className="text-gray-700">$525,847</span>
                  <span className="text-gray-500">Threshold (CA Rev. & Tax Code §6051)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">$500,000</span>
                  <span className="text-gray-500">Excess Amount</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">$25,847</span>
                  <span className="text-gray-500">Analysis Date: 10/4/2025</span>
                </div>
                <div className="text-sm font-medium text-gray-900">CPA Decision: Registration Required</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 mb-6 border border-green-200">
              <div className="text-sm font-medium text-gray-900 mb-2">Professional Reasoning</div>
              <p className="text-sm text-gray-600 mb-3">
                &quot;Based on verified sales data and current CA threshold requirements, client exceeds nexus threshold by $25,847. Registration recommended within 30 days to avoid penalties.&quot;
              </p>
              <div className="text-xs text-gray-500">— Sarah Chen, CPA (License #12345)</div>
            </div>

            <ul className="space-y-2 text-sm text-green-700">
              <li className="flex items-start">
                <Check className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                Complete audit trail with timestamps
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                Regulatory citations and legal precedents
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                Licensed CPA professional judgment documented
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                Court-ready documentation for malpractice defense
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
