import { Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white py-12 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-black" />
            <span className="font-serif text-lg font-bold text-black">FinanceOCR</span>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-8 text-sm text-gray-600">
            <a href="#platform" className="hover:text-black transition-colors">
              Platform
            </a>
            <a href="#features" className="hover:text-black transition-colors">
              Features
            </a>
            <a href="#" className="hover:text-black transition-colors">
              About
            </a>
            <a href="#" className="hover:text-black transition-colors">
              Contact
            </a>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-500">
            &copy; 2025 FinanceOCR. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

