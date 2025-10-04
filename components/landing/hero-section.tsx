import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative bg-gray-50 py-16 lg:py-24">
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(0,0,0,0.1) 1px, transparent 1px),
            radial-gradient(circle at 80% 80%, rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(45deg, transparent 40%, rgba(0,0,0,0.05) 50%, transparent 60%),
            linear-gradient(-45deg, transparent 40%, rgba(0,0,0,0.05) 50%, transparent 60%)
          `,
          backgroundSize: '50px 50px, 50px 50px, 100px 100px, 100px 100px'
        }}></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Beta Label */}
          <div className="inline-flex items-center text-sm text-gray-600 mb-6">
            <span>FinanceOCR 1.0 Public Beta</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
          
          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Protect Your License.<br />
            Your Professional Liability <span className="text-orange-500">Shield</span><br />
            Against Compliance Penalties.
          </h1>
          
          {/* Sub-headline */}
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            FinanceOCR provides CPA firms with regulatory intelligence and audit-ready documentation to eliminate blind spots, justify every professional judgment, and secure your firm's future.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-8 py-3 rounded-lg text-lg">
              Schedule a Liability Assessment
            </Button>
            <Button variant="outline" className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium px-8 py-3 rounded-lg text-lg">
              Request Your Exposure Report
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 mt-12 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>SOC 2 Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>AICPA Endorsed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Risk Mitigation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}