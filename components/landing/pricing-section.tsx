"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useState } from "react"

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section id="pricing" className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            FinanceOCR Enterprise Nexus Platform
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Professional liability protection for CPA firms managing multi-state compliance
          </p>
        </div>

        {/* Pricing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <div className="flex">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  !isYearly
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  isYearly
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise Nexus Platform</h3>
              <p className="text-gray-600 mb-6">Monitor all your multi-state clients</p>
              
              <div className="mb-4">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {isYearly ? '$35,000' : '$3,500'}
                </div>
                <div className="text-gray-600">
                  {isYearly ? '/year' : '/month'}
                </div>
                {isYearly && (
                  <div className="text-sm text-green-600 font-medium mt-2">
                    Save $7,000 annually
                  </div>
                )}
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-gray-700">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span>All 50 states + DC coverage</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Real-time nexus alerts</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Court-ready audit trails</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Immutable compliance records</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Professional liability protection</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Quarterly business reviews</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Email & phone support</span>
              </div>
            </div>

            {/* CTA Button */}
            <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-lg text-lg">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}