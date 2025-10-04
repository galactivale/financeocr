"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Shield } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white/95 backdrop-blur sticky top-0 z-50 w-full border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-black" />
            <span className="font-serif text-xl font-bold text-black">FinanceOCR</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#platform" className="text-gray-600 hover:text-black transition-colors">
              Platform
            </a>
            <a href="#features" className="text-gray-600 hover:text-black transition-colors">
              Features
            </a>
            <Button className="bg-black hover:bg-gray-800 text-white font-medium px-6 py-2 rounded-lg">
              View Demo
            </Button>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5 text-black" /> : <Menu className="h-5 w-5 text-black" />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <a
                href="#platform"
                className="block px-3 py-2 text-black hover:text-gray-600 transition-colors"
              >
                Platform
              </a>
              <a
                href="#features"
                className="block px-3 py-2 text-black hover:text-gray-600 transition-colors"
              >
                Features
              </a>
              <div className="px-3 py-2">
                <Button className="w-full bg-black hover:bg-gray-800 text-white font-medium">
                  View Demo
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

