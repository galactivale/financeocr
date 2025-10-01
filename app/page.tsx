"use client";
import React, { useState } from "react";
import { Button, Card, CardBody, CardHeader, Chip, Badge } from "@nextui-org/react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRouter } from "next/navigation";
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
  ChevronRight,
  Menu,
  X,
  ArrowUpRight,
  Sparkles,
  Globe,
  Database,
  Settings,
  Monitor,
  Brain,
  Gauge,
  Layers,
  Workflow,
  BookOpen,
  Calculator,
  Building2,
  Handshake,
  Scale,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  FileCheck,
  Clock3,
  Target as TargetIcon,
  Zap as ZapIcon,
  Lock as LockIcon,
  Eye as EyeIcon,
  ChevronRight as ChevronRightIcon,
  Menu as MenuIcon,
  X as XIcon,
  ArrowUpRight as ArrowUpRightIcon,
  Sparkles as SparklesIcon,
  Globe as GlobeIcon,
  Database as DatabaseIcon,
  Settings as SettingsIcon,
  Monitor as MonitorIcon
} from "lucide-react";

export default function LandingPage() {
  const [selectedPlan, setSelectedPlan] = useState("professional");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 w-full bg-black/20 backdrop-blur-xl border-b border-white/10 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">SifaDocs</span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <motion.a 
                href="#features" 
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium relative group"
                whileHover={{ y: -1 }}
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
              </motion.a>
              <motion.a 
                href="#about" 
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium relative group"
                whileHover={{ y: -1 }}
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
              </motion.a>
              <motion.a 
                href="#contact" 
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium relative group"
                whileHover={{ y: -1 }}
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
              </motion.a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="ghost"
                  className="text-gray-300 hover:text-white px-6 py-2 font-medium border border-white/20 hover:border-white/40 transition-all duration-200"
                  onClick={() => router.push('/dashboard/managing-partner')}
                >
                  View Dashboard
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/25"
                >
                  Get Started
                </Button>
              </motion.div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10 py-4"
            >
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-300 hover:text-white font-medium">Features</a>
                <a href="#about" className="text-gray-300 hover:text-white font-medium">About</a>
                <a href="#contact" className="text-gray-300 hover:text-white font-medium">Contact</a>
                <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
                  <Button variant="ghost" className="text-gray-300 hover:text-white justify-start" onClick={() => router.push('/dashboard/managing-partner')}>View Dashboard</Button>
                  <Button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">Get Started</Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Text Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-10"
            >
              {/* Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 rounded-full text-sm font-medium text-blue-200"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Next-Generation CPA Platform
              </motion.div>

              {/* Main Heading */}
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight"
              >
                <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                  Professional
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Liability Shield
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xl text-gray-300 leading-relaxed max-w-2xl"
              >
                Transform compliance anxiety into confident practice with AI-powered regulatory intelligence, 
                real-time monitoring, and court-ready documentation that protects your professional future.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-6"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-10 py-4 text-lg rounded-2xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-2xl shadow-blue-500/25"
                    endContent={<ArrowRight className="w-5 h-5" />}
                  >
                    Start Free Trial
                  </Button>
                </motion.div>
                <motion.div 
                  className="flex items-center text-gray-300 cursor-pointer group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mr-4 group-hover:bg-white/20 transition-all duration-200 border border-white/20">
                    <Play className="w-6 h-6 ml-1 text-white" />
                  </div>
                  <div>
                    <span className="text-lg font-semibold block">Watch Demo</span>
                    <span className="text-sm text-gray-400">See how it works</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="flex flex-wrap items-center gap-8 pt-8"
              >
                <div className="flex items-center text-sm text-gray-300">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mr-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  SOC 2 Compliant
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                    <Award className="w-5 h-5 text-blue-400" />
                  </div>
                  AICPA Endorsed
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">
                    <Shield className="w-5 h-5 text-purple-400" />
                  </div>
                  Risk Mitigation
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Hero Visual */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative">
                {/* Main Dashboard Preview */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="relative z-10"
                >
                  <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="text-gray-400 text-sm">SifaDocs Dashboard</div>
                      </div>
                      <div className="space-y-4">
                        <div className="h-4 bg-blue-500/30 rounded w-3/4"></div>
                        <div className="h-4 bg-green-500/30 rounded w-1/2"></div>
                        <div className="h-4 bg-purple-500/30 rounded w-2/3"></div>
                        <div className="h-4 bg-orange-500/30 rounded w-1/3"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="absolute -top-6 -right-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-4 shadow-xl border border-white/20"
                >
                  <div className="text-white text-sm font-semibold">Real-time</div>
                  <div className="text-blue-200 text-xs">Monitoring</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.0 }}
                  className="absolute -bottom-6 -left-6 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-4 shadow-xl border border-white/20"
                >
                  <div className="text-white text-sm font-semibold">Audit Ready</div>
                  <div className="text-green-200 text-xs">Documentation</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="absolute top-1/2 -left-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-4 shadow-xl border border-white/20"
                >
                  <div className="text-white text-sm font-semibold">AI-Powered</div>
                  <div className="text-purple-200 text-xs">Intelligence</div>
                </motion.div>

                {/* Background Glow */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.3, scale: 1 }}
                  transition={{ duration: 1.2, delay: 0.4 }}
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl -z-10"
                ></motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section id="features" className="py-32 px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/20 to-transparent"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center px-6 py-3 bg-green-500/20 backdrop-blur-xl border border-green-500/30 rounded-full text-sm font-medium text-green-300 mb-8">
              <Shield className="w-4 h-4 mr-2" />
              Key Features
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
              Professional Protection Made Simple
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Two essential pillars that transform compliance anxiety into confident professional practice.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
            >
              <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-8 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 h-full">
                <CardBody className="flex flex-col h-full text-center">
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="w-24 h-24 bg-blue-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-blue-500/30 transition-colors duration-300"
                  >
                    <BarChart3 className="w-12 h-12 text-blue-400" />
                  </motion.div>
                  <h3 className="text-3xl font-bold mb-6 text-white">Real-Time Monitoring</h3>
                  <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                    Continuous surveillance of all 50 states plus DC for threshold changes, new regulations, 
                    and compliance requirements that affect your clients.
                  </p>
                  <div className="space-y-4 text-gray-300">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                      <span className="text-lg">Automated threshold tracking</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                      <span className="text-lg">Multi-jurisdiction compliance</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
            >
              <Card className="bg-gradient-to-br from-green-900/20 to-green-800/10 backdrop-blur-xl border border-green-500/30 rounded-3xl p-8 shadow-2xl hover:shadow-green-500/20 transition-all duration-300 h-full">
                <CardBody className="flex flex-col h-full text-center">
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="w-24 h-24 bg-green-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-green-500/30 transition-colors duration-300"
                  >
                    <Shield className="w-12 h-12 text-green-400" />
                  </motion.div>
                  <h3 className="text-3xl font-bold mb-6 text-white">Court-Ready Documentation</h3>
                  <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                    Comprehensive documentation of every decision, with timestamps, regulatory citations, 
                    and professional reasoning that stands up in court.
                  </p>
                  <div className="space-y-4 text-gray-300">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                      <span className="text-lg">Timestamped decisions</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                      <span className="text-lg">Defensible documentation</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted by Leading CPA Firms */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8 text-gray-300">Trusted by Leading CPA Firms</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-xl font-semibold text-blue-400">Baker Tilly</div>
            <div className="text-xl font-semibold text-green-400">CliftonLarsonAllen</div>
            <div className="text-xl font-semibold text-purple-400">Grant Thornton</div>
            <div className="text-xl font-semibold text-orange-400">Moss Adams</div>
          </div>
        </div>
      </section>

      {/* Simple Comparison */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            From Chaos to Clarity
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Transform compliance uncertainty into court-ready documentation with SifaDocs.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-red-900/20 border-red-500/30 p-6">
              <CardBody className="text-center">
                <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-red-400 mb-4">Before</h3>
                <p className="text-gray-300">
                  Spreadsheets, unclear data sources, and no documentation of decision processes.
                </p>
              </CardBody>
            </Card>
            
            <Card className="bg-green-900/20 border-green-500/30 p-6">
              <CardBody className="text-center">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-400 mb-4">After</h3>
                <p className="text-gray-300">
                  Professional documentation with timestamps, regulatory citations, and court-ready audit trails.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/30 to-transparent"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join 500+ CPA firms who trust SifaDocs for their compliance protection.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-12 py-4 text-lg rounded-2xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-2xl shadow-blue-500/25"
                endContent={<ArrowRight className="w-5 h-5" />}
              >
                Start Free Trial
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 py-20 px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-1">
              <motion.div 
                className="flex items-center mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">SifaDocs</span>
              </motion.div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                Professional liability protection for CPA firms through AI-powered regulatory intelligence and court-ready documentation.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center hover:bg-blue-500/30 transition-colors duration-200 cursor-pointer">
                  <Globe className="w-4 h-4 text-blue-400" />
                </div>
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center hover:bg-green-500/30 transition-colors duration-200 cursor-pointer">
                  <Mail className="w-4 h-4 text-green-400" />
                </div>
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center hover:bg-purple-500/30 transition-colors duration-200 cursor-pointer">
                  <Phone className="w-4 h-4 text-purple-400" />
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-white text-lg">Product</h3>
              <ul className="space-y-4 text-sm text-gray-300">
                <li><a href="#features" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  Features
                </a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  Demo
                </a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  API Documentation
                </a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  Security
                </a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-white text-lg">Resources</h3>
              <ul className="space-y-4 text-sm text-gray-300">
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  Case Studies
                </a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  Regulatory Analysis
                </a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  Support Center
                </a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  Compliance Guide
                </a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-white text-lg">Contact</h3>
              <ul className="space-y-4 text-sm text-gray-300">
                <li className="flex items-center group">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-500/30 transition-colors duration-200">
                    <Phone className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium">(555) 123-4567</div>
                    <div className="text-xs text-gray-400">Mon-Fri 9AM-6PM EST</div>
                  </div>
                </li>
                <li className="flex items-center group">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-500/30 transition-colors duration-200">
                    <Mail className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium">support@sifadocs.com</div>
                    <div className="text-xs text-gray-400">24/7 Support</div>
                  </div>
                </li>
                <li className="flex items-center group">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-purple-500/30 transition-colors duration-200">
                    <MapPin className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium">New York, NY</div>
                    <div className="text-xs text-gray-400">Headquarters</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-400 mb-4 md:mb-0">
                <p>&copy; 2024 SifaDocs. All rights reserved.</p>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  SOC 2 Compliant
                </div>
                <div className="flex items-center">
                  <Award className="w-4 h-4 text-blue-400 mr-2" />
                  AICPA Endorsed
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-purple-400 mr-2" />
                  HIPAA Ready
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
