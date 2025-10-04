import { Button } from "@/components/ui/button"
import { ArrowRight, Plus, TrendingUp, Target, DollarSign, BarChart3 } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50"></div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 px-8 md:px-16 lg:px-24">
          {/* Main Headline */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            AI-Driven compliance teams with human-level precision
          </h1>
          
          {/* Sub-headline */}
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Empower your CPA firm with AI-driven compliance teams that execute tasks with human-level precision, efficiency, and reliability.
          </p>
        </div>

        {/* Central Chat Interface */}
        <div className="relative max-w-2xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            {/* Chat Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">New chat</h3>
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                <Plus className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Example Questions */}
            <div className="space-y-3 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                Provide a detailed summary of my client's latest tax compliance status including key metrics.
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                What are the key performance trends for my firm's compliance this quarter?
              </div>
            </div>

            {/* Input Field */}
            <div className="relative">
              <input
                type="text"
                placeholder="Ask or search for anything"
                className="w-full px-4 py-3 pr-12 border-2 border-pink-200 rounded-lg focus:border-pink-400 focus:outline-none transition-colors"
              />
              <ArrowRight className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-500" />
            </div>
          </div>
        </div>

        {/* Floating Data Cards */}
        <div className="relative max-w-6xl mx-auto">
          {/* Sales Figures Card - Top Right */}
          <div className="absolute top-0 right-0 w-56 bg-white rounded-2xl shadow-xl p-5 border border-gray-100 floating-card hover:rotate-0 transition-transform duration-300">
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-900">Compliance Metrics</h4>
              <div className="flex items-end justify-between">
                <div className="flex flex-col">
                  <div className="text-4xl font-bold text-gray-900 leading-none">$468,682</div>
                  <div className="text-sm text-gray-500">Audit Revenue</div>
                </div>
                <div className="flex items-end space-x-1 h-12">
                  {[4, 6, 3, 8, 5, 7, 4].map((height, i) => (
                    <div key={i} className={`bg-gradient-to-t from-orange-500 to-orange-300 w-2 rounded-t-sm`} style={{ height: `${height * 4}px` }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Average Total Sales Card - Right */}
          <div className="absolute top-32 right-16 w-56 bg-white rounded-2xl shadow-xl p-5 border border-gray-100 floating-card hover:rotate-0 transition-transform duration-300">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900">Average Compliance Rate</h4>
              <div className="relative w-16 h-16 mx-auto">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-purple-500"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray="88, 100"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-900">88%</span>
                </div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-sm text-green-600 font-semibold">Target Reached</div>
                <div className="text-xs text-gray-500">$427,166 / $257,275</div>
              </div>
            </div>
          </div>

          {/* Compliance Card - Bottom Left */}
          <div className="absolute bottom-0 left-0 w-56 bg-white rounded-2xl shadow-xl p-5 border border-gray-100 floating-card hover:rotate-0 transition-transform duration-300">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-900">Compliance</h4>
                <div className="flex items-center text-green-600 text-xs font-semibold bg-green-50 px-2 py-1 rounded-full">
                  +6.9%↑
                </div>
              </div>
              
              {/* Main Value with Chart */}
              <div className="flex items-end justify-between">
                <div className="flex flex-col">
                  <div className="text-4xl font-bold text-gray-900 leading-none">$785,421</div>
                  <div className="text-sm text-gray-500">Previous year ($213,400)</div>
                </div>
                <div className="flex items-end space-x-1 h-12">
                  {[3, 5, 4, 7, 6, 8, 5].map((height, i) => (
                    <div key={i} className={`bg-gradient-to-t from-blue-500 to-blue-300 w-2 rounded-t-sm`} style={{ height: `${height * 4}px` }}></div>
                  ))}
                </div>
              </div>
              
              {/* Trend */}
              <div className="flex items-center text-blue-600 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>Positive trend</span>
              </div>
            </div>
          </div>

          {/* Percentage Cards - Mid Left */}
          <div className="absolute top-20 left-0 space-y-3">
            {/* Best Deals Card */}
            <div className="w-44 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 floating-card hover:rotate-0 transition-transform duration-300">
              <div className="space-y-3">
                <div className="relative w-10 h-10 mx-auto">
                  <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-orange-500"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="48, 100"
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-900">48%</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">The best deals for this year</div>
                </div>
              </div>
            </div>

            {/* Hit Rate Card */}
            <div className="w-44 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 floating-card hover:rotate-0 transition-transform duration-300">
              <div className="space-y-3">
                <div className="relative w-10 h-10 mx-auto">
                  <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-purple-500"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="68, 100"
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-900">68%</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">In this year's hit rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="text-center mt-20">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg">
              Try for free
            </Button>
            <Button variant="outline" className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium px-8 py-3 rounded-lg">
              Request a Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}