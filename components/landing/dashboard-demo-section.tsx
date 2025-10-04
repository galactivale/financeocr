import { Button } from "@/components/ui/button"
import { AlertTriangle, TrendingUp, Shield, Eye, FileText } from "lucide-react"

export function DashboardDemoSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            See Your Protection in Action
          </h2>
          <p className="text-lg text-gray-600">
            Your Compliance Command Center
          </p>
          <p className="text-gray-600">
            Transform regulatory chaos into organized intelligence with real-time risk assessment and audit-ready documentation.
          </p>
        </div>

        {/* Dashboard Demo */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Metrics */}
            <div className="space-y-6">
              {/* Liability Dashboard */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Liability Dashboard</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Real-time compliance monitoring for</span>
                    <span className="text-sm font-medium text-gray-900">247 active clients</span>
                  </div>
                  <div className="flex items-center text-green-600 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Live monitoring active</span>
                  </div>
                </div>
              </div>

              {/* Estimated Exposure */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estimated Exposure</h3>
                <div className="text-3xl font-bold text-red-600 mb-2">$847,500</div>
                <div className="text-sm text-gray-600">Across 23 high-risk clients</div>
              </div>

              {/* Audit Trails */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Trails</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">142</div>
                <div className="text-sm text-gray-600">Your Growing Shield</div>
              </div>

              {/* Protected Revenue */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Protected Revenue</h3>
                <div className="text-3xl font-bold text-green-600 mb-2">$12.4M</div>
                <div className="text-sm text-gray-600">Client revenue under protection</div>
              </div>
            </div>

            {/* Right Column - Alerts */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Priority Alerts Requiring Action</h3>
                
                <div className="space-y-4">
                  {/* High Risk Alert */}
                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">TechCorp Solutions - California Nexus</h4>
                        <div className="flex items-center mt-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                          <span className="text-sm font-medium text-red-600">HIGH RISK</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Sales exceeded $500K threshold by $127,847. Registration required within 30 days to avoid penalties.
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Detected: 2 hours ago</span>
                      <span>Regulation: CA Rev. & Tax Code §6051</span>
                      <span>Potential Penalty: $35,000+</span>
                    </div>
                    <Button size="sm" className="mt-3 bg-red-600 hover:bg-red-700 text-white">
                      Review
                    </Button>
                  </div>

                  {/* Medium Risk Alert */}
                  <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">Global Manufacturing Inc - Texas Update</h4>
                        <div className="flex items-center mt-1">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                          <span className="text-sm font-medium text-orange-600">MEDIUM</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Texas threshold increased to $500K effective Jan 1. Client currently at $487K - monitoring required.
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Detected: 1 day ago</span>
                      <span>Regulation: TX Tax Code §151.107</span>
                      <span>Action: Monitor Q4 sales</span>
                    </div>
                    <Button size="sm" variant="outline" className="mt-3 border-orange-300 text-orange-700 hover:bg-orange-50">
                      Document
                    </Button>
                  </div>

                  {/* Resolved Alert */}
                  <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">RetailPlus Corp - Florida Compliance</h4>
                        <div className="flex items-center mt-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm font-medium text-green-600">RESOLVED</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Successfully registered in Florida. Audit trail #4721 created with full documentation.
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Completed: 3 days ago</span>
                      <span>CPA: Sarah Chen</span>
                      <span>Audit Trail: #4721</span>
                    </div>
                    <Button size="sm" variant="outline" className="mt-3 border-green-300 text-green-700 hover:bg-green-50">
                      View Trail
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Risk Quantification</h3>
            <p className="text-gray-600">See your exact financial exposure across all clients and jurisdictions in real-time.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Alerts</h3>
            <p className="text-gray-600">Get notified the moment any client approaches or exceeds compliance thresholds.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">One-Click Documentation</h3>
            <p className="text-gray-600">Generate court-ready audit trails with regulatory citations and professional reasoning.</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-8 py-3 rounded-lg text-lg">
              Request Platform Demo
            </Button>
            <Button variant="outline" className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium px-8 py-3 rounded-lg text-lg">
              View Sample Dashboard
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
