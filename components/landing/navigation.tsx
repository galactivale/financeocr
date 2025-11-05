"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, BarChart3 } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  return (
    <nav className="bg-white sticky top-0 z-50 w-full">
      <div className="container mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">FinanceOCR</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
              Pricing
            </a>
            <a href="#compliance" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
              Compliance
            </a>
            <a href="#support" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
              Support
            </a>
            <Button asChild className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-4 py-2 rounded-lg text-sm">
              <a href="https://cal.com/emmanuel-kyumba-dr5icf/15min" target="_blank" rel="noopener noreferrer">
                View Demo
              </a>
            </Button>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5 text-gray-900" /> : <Menu className="h-5 w-5 text-gray-900" />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <a
                href="#pricing"
                onClick={handleLinkClick}
                className="block px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
              >
                Pricing
              </a>
              <a
                href="#compliance"
                onClick={handleLinkClick}
                className="block px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
              >
                Compliance
              </a>
              <a
                href="#support"
                onClick={handleLinkClick}
                className="block px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
              >
                Support
              </a>
              <div className="px-3 py-2">
                <Button asChild className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm">
                  <a href="https://cal.com/emmanuel-kyumba-dr5icf/15min" target="_blank" rel="noopener noreferrer">
                    View Demo
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}


