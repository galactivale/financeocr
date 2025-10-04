import { AlertTriangle, DollarSign, Shield, Users } from "lucide-react"

export function ProblemSection() {
  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            The 3 AM Worry Every Partner Knows
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            The fear that keeps successful CPA partners awake at night isn't about losing clients—it's about the compliance blind spots that could destroy everything they've built.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Missed Thresholds */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Missed Thresholds</h3>
              <p className="text-gray-600 mb-4">
                A single overlooked nexus threshold can trigger penalties exceeding $35,000 per violation, plus interest and potential criminal liability.
              </p>
              <div className="text-2xl font-bold text-red-600">$35,000+</div>
              <div className="text-sm text-gray-500">per violation</div>
            </div>

            {/* Malpractice Exposure */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Malpractice Exposure</h3>
              <p className="text-gray-600 mb-4">
                Without documented decision trails, your professional judgment becomes indefensible in court. Average settlements exceed $125,000.
              </p>
              <div className="text-2xl font-bold text-orange-600">$125,000+</div>
              <div className="text-sm text-gray-500">average settlement</div>
            </div>

            {/* Reputational Damage */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Reputational Damage</h3>
              <p className="text-gray-600 mb-4">
                State board sanctions and public disciplinary actions can destroy decades of reputation building and client trust in a single announcement.
              </p>
              <div className="text-2xl font-bold text-purple-600">Priceless</div>
              <div className="text-sm text-gray-500">reputation at risk</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}