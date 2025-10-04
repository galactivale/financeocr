"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Shield } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-black backdrop-blur  sticky top-0 z-50 w-full border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-white" />
            <span className="font-serif text-xl font-bold text-white">FinanceOCR</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#platform" className="text-white hover:text-gray-600 transition-colors">
              Platform
            </a>
            <a href="#how-it-works" className="text-white hover:text-gray-600 transition-colors">
              How It Works
            </a>
            <a href="#authority" className="text-white hover:text-gray-600 transition-colors">
              Authority
            </a>
            <a href="#pricing" className="text-white hover:text-gray-600 transition-colors">
              Investment
            </a>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium">
              Schedule a Liability Assessment
            </Button>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border/40">
              <a
                href="#platform"
                className="block px-3 py-2 text-black hover:text-gray-600 transition-colors"
              >
                Platform
              </a>
              <a
                href="#how-it-works"
                className="block px-3 py-2 text-black hover:text-gray-600 transition-colors"
              >
                How It Works
              </a>
              <a
                href="#authority"
                className="block px-3 py-2 text-black hover:text-gray-600 transition-colors"
              >
                Authority
              </a>
              <a
                href="#pricing"
                className="block px-3 py-2 text-black hover:text-gray-600 transition-colors"
              >
                Investment
              </a>
              <div className="px-3 py-2">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium">
                  Schedule a Liability Assessment
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

