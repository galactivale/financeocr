import { Button } from "@/components/ui/button"
import { ArrowRight, Laptop, Users, MessageSquare, Mic } from "lucide-react"

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 lg:py-24 bg-white">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left side - Laptop with dashboard */}
        <div className="flex-1">
          <div className="relative">
            {/* Laptop mockup */}
            <div className="relative w-full max-w-lg mx-auto">
              {/* Laptop screen */}
              <div className="bg-gray-800 rounded-t-lg p-2">
                <div className="bg-white rounded-lg overflow-hidden">
                  {/* Dashboard content */}
                  <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">Compliance Dashboard</h3>
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">12%</div>
                        <div className="text-xs text-gray-500">Efficiency</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">18%</div>
                        <div className="text-xs text-gray-500">Cost Saved</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">22%</div>
                        <div className="text-xs text-gray-500">Time Saved</div>
                      </div>
                    </div>

                    {/* Chart area */}
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-gray-700">Compliance Trends</div>
                      <div className="flex items-end space-x-2 h-20">
                        <div className="bg-green-400 w-6 h-12 rounded-t"></div>
                        <div className="bg-purple-400 w-6 h-16 rounded-t"></div>
                        <div className="bg-blue-400 w-6 h-8 rounded-t"></div>
                        <div className="bg-orange-400 w-6 h-14 rounded-t"></div>
                        <div className="bg-green-400 w-6 h-18 rounded-t"></div>
                        <div className="bg-purple-400 w-6 h-10 rounded-t"></div>
                      </div>
                    </div>

                    {/* Bottom metrics */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="font-medium text-gray-700">Active Alerts</div>
                        <div className="text-2xl font-bold text-orange-600">3</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="font-medium text-gray-700">Compliance Score</div>
                        <div className="text-2xl font-bold text-green-600">98%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Laptop base */}
              <div className="bg-gray-300 h-4 rounded-b-lg"></div>
            </div>

            {/* CTA Button */}
            <div className="mt-8 text-center">
              <Button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-6 py-3 rounded-lg">
                Demo our dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right side - Features list */}
        <div className="flex-1 space-y-8">
          {/* Main headline */}
          <div className="space-y-4">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-black leading-tight">
              Leverage the power of AI in{" "}
              <span className="flex items-center gap-2">
                <span className="flex -space-x-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gray-800 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-bold">+</span>
                  </div>
                </span>
              </span>
              <br />
              compliance management
            </h2>
          </div>

          {/* Features list */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-gray-600">01</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-black mb-2">AI Revolution</h3>
                <p className="text-gray-600">Access compliance securely with Blockchain, ensuring document authenticity.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-gray-600">02</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-black mb-2">AI Chatbot COMPLY</h3>
                <p className="text-gray-600">Boost compliance with AI Chatbot COMPLY on popular messaging platforms.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-gray-600">03</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-black mb-2">AI Assistance</h3>
                <p className="text-gray-600">Interact efficiently with our system using voice commands.</p>
              </div>
            </div>
          </div>

          {/* Benefits text */}
          <p className="text-gray-600 text-lg">
            Explore a multitude of benefits meticulously tailored to meet the unique needs of CPA firms.
          </p>

          {/* Green highlight box */}
          <div className="accent-green rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-white mb-2">40%</div>
            <div className="text-white text-lg">COMPLY AI Chatbot slashes response times.</div>
          </div>
        </div>
      </div>
    </section>
  )
}
