import { Button } from "@/components/ui/button"
import { Check, DollarSign, Shield, Users } from "lucide-react"

export function PricingSection() {
  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Speak with a Compliance Strategist
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            An Investment in Your Firm&apos;s Future
          </p>
          <p className="text-gray-600">
            Professional liability protection for a fraction of the cost of a single malpractice claim or regulatory penalty.
          </p>
        </div>

        {/* Cost Comparison */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-red-600 mb-2">$35,000</div>
            <div className="text-sm text-gray-600">Average penalty per nexus violation</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-2">$125,000</div>
            <div className="text-sm text-gray-600">Average malpractice claim settlement</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">Priceless</div>
            <div className="text-sm text-gray-600">Your professional reputation and license</div>
          </div>
        </div>

        <div className="text-center mb-12">
          <p className="text-lg text-gray-600">
            FinanceOCR: Systematic protection for a fraction of the cost.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Professional Shield */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Most Popular</h3>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Professional Shield</h4>
              <p className="text-gray-600">For growing CPA firms</p>
            </div>

            <div className="text-center mb-8">
              <div className="text-4xl font-bold text-gray-900 mb-2">$2,497</div>
              <div className="text-gray-600">/month</div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 mr-3" />
                Up to 100 clients monitored
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 mr-3" />
                All 50 states + DC coverage
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 mr-3" />
                Real-time regulatory alerts
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 mr-3" />
                Court-ready audit trails
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 mr-3" />
                CPA-reviewed intelligence
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 mr-3" />
                Professional liability documentation
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 mr-3" />
                Email & phone support
              </li>
            </ul>

            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <h5 className="font-medium text-green-900 mb-2">ROI Analysis</h5>
              <div className="text-sm text-green-700">
                <div>Annual cost: $29,964</div>
                <div>vs. Single penalty: $35,000+</div>
                <div className="font-medium">Pays for itself with first prevention</div>
              </div>
            </div>

            <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-lg">
              Protect Your Firm
            </Button>
          </div>

          {/* Enterprise Shield */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise</h3>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Enterprise Shield</h4>
              <p className="text-gray-600">For established firms</p>
            </div>

            <div className="text-center mb-8">
              <div className="text-4xl font-bold text-gray-900 mb-2">$4,997</div>
              <div className="text-gray-600">/month</div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 mr-3" />
                Unlimited clients monitored
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 mr-3" />
                All Professional Shield features
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 mr-3" />
                Dedicated compliance strategist
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 mr-3" />
                Custom regulatory research
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 mr-3" />
                Priority legal consultation
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 mr-3" />
                White-label client reports
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 mr-3" />
                24/7 emergency support
              </li>
            </ul>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h5 className="font-medium text-blue-900 mb-2">Enterprise Value</h5>
              <div className="text-sm text-blue-700">
                <div>Annual cost: $59,964</div>
                <div>vs. Major malpractice claim: $125,000+</div>
                <div className="font-medium">Comprehensive liability protection</div>
              </div>
            </div>

            <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-lg">
              Speak with a Compliance Strategist
            </Button>
          </div>
        </div>

        {/* Cost Comparison Table */}
        <div className="max-w-4xl mx-auto mt-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Why This Investment Makes Sense</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <h4 className="text-lg font-semibold text-red-900 mb-4">Traditional Approach Costs</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-red-700">Junior staff time (20 hrs/month)</span>
                  <span className="font-medium text-red-900">$2,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-700">Senior review time (5 hrs/month)</span>
                  <span className="font-medium text-red-900">$1,250</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-700">Research subscriptions</span>
                  <span className="font-medium text-red-900">$500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-700">Missed threshold risk</span>
                  <span className="font-medium text-red-900">$35,000+</span>
                </div>
                <div className="border-t border-red-300 pt-2 mt-4">
                  <div className="flex justify-between font-semibold">
                    <span className="text-red-900">Total Monthly Risk</span>
                    <span className="text-red-900">$38,750+</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <h4 className="text-lg font-semibold text-green-900 mb-4">FinanceOCR Protection</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-700">Professional Shield</span>
                  <span className="font-medium text-green-900">$2,497</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Staff time saved</span>
                  <span className="font-medium text-green-900">$3,250</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Risk elimination</span>
                  <span className="font-medium text-green-900">Priceless</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Peace of mind</span>
                  <span className="font-medium text-green-900">Priceless</span>
                </div>
                <div className="border-t border-green-300 pt-2 mt-4">
                  <div className="flex justify-between font-semibold">
                    <span className="text-green-900">Net Monthly Savings</span>
                    <span className="text-green-900">$753+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Protect Your Professional Future?
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            Join 500+ CPA firms who sleep better knowing their compliance liability is professionally managed and documented.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-8 py-3 rounded-lg text-lg">
              Schedule a Liability Assessment
            </Button>
            <Button variant="outline" className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium px-8 py-3 rounded-lg text-lg">
              Request Your Exposure Report
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}