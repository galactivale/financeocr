"use client";
import React, { useState } from "react";
import { Button, Card, CardBody, CardHeader, Chip, Badge } from "@nextui-org/react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  TrendingUp, 
  Clock, 
  FileText, 
  BarChart3,
  Star,
  ArrowRight,
  Play,
  Download,
  Phone,
  Mail,
  MapPin,
  Award,
  Target,
  Zap,
  Lock,
  Eye,
  ChevronRight
} from "lucide-react";

export default function LandingPage() {
  const [selectedPlan, setSelectedPlan] = useState("professional");
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-black/80 backdrop-blur-xl border-b border-gray-700/30 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                <div className="absolute inset-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg blur-sm opacity-50"></div>
              </div>
              <span className="text-xl font-semibold text-white">
                <span className="font-normal">Finance</span><span className="font-bold">OCR</span>
              </span>
            </motion.div>

            {/* Navigation Links - Centered */}
            <div className="hidden lg:flex items-center space-x-8">
              <motion.a 
                href="#features" 
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                whileHover={{ y: -1 }}
              >
                Features
              </motion.a>
              <motion.a 
                href="#about" 
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                whileHover={{ y: -1 }}
              >
                About
              </motion.a>
              <motion.a 
                href="#portfolio" 
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                whileHover={{ y: -1 }}
              >
                Portfolio
              </motion.a>
              <motion.a 
                href="#pricing" 
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                whileHover={{ y: -1 }}
              >
                Pricing
              </motion.a>
              <motion.div className="relative">
                <motion.a 
                  href="#pages" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center font-medium"
                  whileHover={{ y: -1 }}
                >
                  Pages
                  <ChevronRight className="w-4 h-4 ml-1 rotate-90" />
                </motion.a>
              </motion.div>
            </div>

            {/* Action Buttons and Icons */}
            <div className="flex items-center space-x-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-lg"
                >
                  Sign In
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  className="bg-gray-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200 border border-gray-700"
                >
                  Sign Up
                </Button>
              </motion.div>
              <motion.button
                className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </motion.button>
              <motion.button
                className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Tagline Chip */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="inline-flex items-center px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700/50"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-300">CPA Compliance Platform</span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-5xl lg:text-6xl font-bold text-white leading-tight"
              >
                Professional Liability
                <span className="block text-blue-400">Protection Platform</span>
              </motion.h1>

              {/* Description */}
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg text-gray-300 leading-relaxed max-w-lg"
              >
                Handcrafted compliance monitoring for your CPA firm. Comes with real-time regulatory intelligence, 
                audit-ready documentation and everything you need to protect your professional license.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    className="bg-blue-600 text-white px-8 py-4 text-lg rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                    endContent={<ArrowRight className="w-5 h-5" />}
                  >
                    Get Started →
                  </Button>
                </motion.div>
                <motion.div 
                  className="flex items-center text-white cursor-pointer group"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mr-4 group-hover:bg-gray-700 transition-colors duration-200">
                    <Play className="w-5 h-5 ml-1" />
                  </div>
                  <span className="text-lg font-medium">How it Works</span>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right Column - Image */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative">
                {/* Main Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="relative z-10"
                >
                  <img 
                    src="/lander.png" 
                    alt="FinanceOCR Dashboard Preview" 
                    className="w-full h-auto rounded-2xl shadow-2xl"
                  />
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="absolute -top-4 -right-4 bg-blue-600 rounded-2xl p-4 shadow-xl"
                >
                  <div className="text-white text-sm font-semibold">Real-time</div>
                  <div className="text-blue-200 text-xs">Monitoring</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.0 }}
                  className="absolute -bottom-4 -left-4 bg-green-600 rounded-2xl p-4 shadow-xl"
                >
                  <div className="text-white text-sm font-semibold">Audit Ready</div>
                  <div className="text-green-200 text-xs">Documentation</div>
                </motion.div>

                {/* Background Glow */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.3, scale: 1 }}
                  transition={{ duration: 1.2, delay: 0.4 }}
                  className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-3xl -z-10"
                ></motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The 3 AM Worry Section */}
      <section className="py-32 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8 text-white">The 3 AM Worry Every Partner Knows</h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              The fear that keeps successful CPA partners awake at night isn't about losing clients—it's about 
              the compliance blind spots that could destroy everything they've built.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-gray-700/50"
            >
              <div className="text-center">
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-6 text-white">Missed Thresholds</h3>
                <p className="text-gray-300 leading-relaxed">
                  A single overlooked nexus threshold can trigger penalties exceeding $35,000 per violation, 
                  plus interest and potential criminal liability.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-gray-700/50"
            >
              <div className="text-center">
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <FileText className="w-16 h-16 text-orange-500 mx-auto mb-6" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-6 text-white">Malpractice Exposure</h3>
                <p className="text-gray-300 leading-relaxed">
                  Without documented decision trails, your professional judgment becomes indefensible in court. 
                  Average settlements exceed $125,000.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-gray-700/50"
            >
              <div className="text-center">
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Users className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-6 text-white">Reputational Damage</h3>
                <p className="text-gray-300 leading-relaxed">
                  State board sanctions and public disciplinary actions can destroy decades of reputation 
                  building and client trust in a single announcement.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Your Professional Liability Shield */}
      <section id="features" className="py-32 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8 text-white">Your Professional Liability Shield</h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Three pillars of protection that transform compliance anxiety into confident professional practice.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-gray-700/50"
            >
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <BarChart3 className="w-16 h-16 text-blue-600 mb-6" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-6 text-white">Systematic Monitoring</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Continuous surveillance of all 50 states plus DC for threshold changes, new regulations, 
                and compliance requirements that affect your clients.
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Real-time regulatory updates
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Automated threshold tracking
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Multi-jurisdiction compliance
                </li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-gray-700/50"
            >
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <CheckCircle className="w-16 h-16 text-green-600 mb-6" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-6 text-white">Expert-Validated Intelligence</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Every alert is reviewed by licensed CPAs and tax attorneys before reaching your desk, 
                ensuring accuracy and professional relevance.
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  CPA-reviewed analysis
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Legal precedent research
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Professional recommendations
                </li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-gray-700/50"
            >
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Shield className="w-16 h-16 text-purple-600 mb-6" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-6 text-white">Court-Ready Audit Trails</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Comprehensive documentation of every decision, with timestamps, regulatory citations, 
                and professional reasoning that stands up in court.
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Timestamped decisions
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Regulatory citations
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Defensible documentation
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted by Leading CPA Firms */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Trusted by Leading CPA Firms</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-2">Baker Tilly</div>
              <div className="text-gray-400">Advisory Services</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-2">CliftonLarsonAllen</div>
              <div className="text-gray-400">Tax & Advisory</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-2">Grant Thornton</div>
              <div className="text-gray-400">Risk Advisory</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400 mb-2">Moss Adams</div>
              <div className="text-gray-400">Compliance</div>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After Comparison */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">From Ambiguity to Defensible Clarity</h2>
            <p className="text-xl text-gray-400">
              See how FinanceOCR transforms compliance uncertainty into court-ready documentation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-red-900/20 border-red-500/30">
              <CardHeader>
                <h3 className="text-xl font-bold text-red-400">BEFORE - Compliance Chaos</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="bg-gray-800 p-4 rounded">
                    <div className="text-sm text-gray-400">client_spreadsheet_final_v3.xlsx</div>
                    <div className="text-lg font-bold">CA Sales: $525,000???</div>
                    <div className="text-sm">Threshold: $500,000</div>
                    <div className="text-xs text-gray-400">Last updated: 3 months ago</div>
                    <div className="text-xs text-red-400">Source: "I think this is right" - Junior Staff</div>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• No documentation of decision process</li>
                    <li>• Unclear data sources and methodology</li>
                    <li>• No regulatory citations or justification</li>
                    <li>• Indefensible in audit or malpractice claim</li>
                  </ul>
                </div>
              </CardBody>
            </Card>
            
            <Card className="bg-green-900/20 border-green-500/30">
              <CardHeader>
                <h3 className="text-xl font-bold text-green-400">AFTER - Professional Protection</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="bg-gray-800 p-4 rounded">
                    <div className="text-sm text-gray-400">FinanceOCR Audit Trail #4721</div>
                    <div className="text-lg font-bold">California Nexus Analysis</div>
                    <div className="text-sm">$525,847 | Threshold: $500,000</div>
                    <div className="text-sm text-green-400">Excess Amount: $25,847</div>
                    <div className="text-xs text-gray-400">Analysis Date: 9/27/2025</div>
                    <div className="text-xs text-blue-400">CPA Decision: Registration Required</div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded text-sm">
                    <div className="text-gray-400 mb-2">Professional Reasoning:</div>
                    <div className="text-gray-300">
                      "Based on verified sales data and current CA threshold requirements, client exceeds 
                      nexus threshold by $25,847. Registration recommended within 30 days to avoid penalties."
                    </div>
                    <div className="text-xs text-blue-400 mt-2">— Sarah Chen, CPA (License #12345)</div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8 text-white">An Investment in Your Firm's Future</h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Professional liability protection for a fraction of the cost of a single malpractice claim.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-gray-700/50 relative"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Chip className="bg-blue-600 text-white px-4 py-1">Most Popular</Chip>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-4 text-white">Professional Shield</h3>
                <p className="text-gray-300 mb-6">For growing CPA firms</p>
                <div className="text-5xl font-bold text-blue-600 mb-2">$2,497<span className="text-2xl text-gray-400">/month</span></div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-4" />
                  <span className="text-gray-700">Up to 100 clients monitored</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-4" />
                  <span className="text-gray-700">All 50 states + DC coverage</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-4" />
                  <span className="text-gray-700">Real-time regulatory alerts</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-4" />
                  <span className="text-gray-700">Court-ready audit trails</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-4" />
                  <span className="text-gray-700">CPA-reviewed intelligence</span>
                </li>
              </ul>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  className="w-full bg-blue-600 text-white py-4 text-lg rounded-full font-medium hover:bg-blue-700 transition-colors duration-200"
                  size="lg"
                >
                  Protect Your Firm
                </Button>
              </motion.div>
              <div className="text-center mt-6 text-sm text-gray-400">
                <div>Annual cost: $29,964</div>
                <div>vs. Single penalty: $35,000+</div>
                <div className="text-green-600 font-semibold">Pays for itself with first prevention</div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-gray-700/50"
            >
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-4 text-white">Enterprise Shield</h3>
                <p className="text-gray-300 mb-6">For established firms</p>
                <div className="text-5xl font-bold text-purple-600 mb-2">$4,997<span className="text-2xl text-gray-400">/month</span></div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-4" />
                  <span className="text-gray-700">Unlimited clients monitored</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-4" />
                  <span className="text-gray-700">All Professional Shield features</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-4" />
                  <span className="text-gray-700">Dedicated compliance strategist</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-4" />
                  <span className="text-gray-700">Custom regulatory research</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-4" />
                  <span className="text-gray-700">24/7 emergency support</span>
                </li>
              </ul>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  className="w-full bg-purple-600 text-white py-4 text-lg rounded-full font-medium hover:bg-purple-700 transition-colors duration-200"
                  size="lg"
                >
                  Speak with a Compliance Strategist
                </Button>
              </motion.div>
              <div className="text-center mt-6 text-sm text-gray-400">
                <div>Annual cost: $59,964</div>
                <div>vs. Major malpractice claim: $125,000+</div>
                <div className="text-green-600 font-semibold">Comprehensive liability protection</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8 text-white">Ready to Protect Your Professional Future?</h2>
            <p className="text-xl text-gray-300 mb-16 max-w-3xl mx-auto leading-relaxed">
              Join 500+ CPA firms who sleep better knowing their compliance liability is professionally managed and documented.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  className="bg-blue-600 text-white px-8 py-4 text-lg rounded-full font-medium hover:bg-blue-700 transition-colors duration-200"
                  endContent={<ArrowRight className="w-5 h-5" />}
                >
                  Schedule a Liability Assessment
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  variant="bordered"
                  className="border-2 border-gray-600 text-gray-300 px-8 py-4 text-lg rounded-full font-medium hover:bg-gray-800 transition-colors duration-200"
                  endContent={<Download className="w-5 h-5" />}
                >
                  Request Your Exposure Report
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <motion.div 
                className="flex items-center mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <Shield className="w-8 h-8 text-blue-600 mr-3" />
                <span className="text-xl font-semibold text-white">FinanceOCR</span>
              </motion.div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Professional liability protection for CPA firms through regulatory intelligence and audit-ready documentation.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-white">Product</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li><a href="#features" className="hover:text-blue-400 transition-colors duration-200">Features</a></li>
                <li><a href="#pricing" className="hover:text-blue-400 transition-colors duration-200">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200">Demo</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-white">Resources</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200">Case Studies</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200">Regulatory Analysis</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-white">Contact</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-3" />
                  (555) 123-4567
                </li>
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-3" />
                  support@financeocr.com
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 FinanceOCR. All rights reserved. SOC 2 Compliant | AICPA Endorsed</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
