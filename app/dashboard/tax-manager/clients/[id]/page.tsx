"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Badge } from "@nextui-org/badge";
import { Progress } from "@nextui-org/progress";
import { 
  ArrowLeft,
  Calendar,
  FileText,
  Phone,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Building,
  MapPin,
  Flag,
  MessageSquare,
  Send,
  Eye,
  Edit,
  Archive,
  BarChart3,
  PieChart,
  Target,
  Shield,
  BookOpen,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Plus,
  Filter,
  Search
} from "lucide-react";
import { useRouter } from "next/navigation";

// Mock data for client details
const clientData = {
  id: "techcorp-saas",
  name: "TechCorp SaaS",
  avatar: "T",
  industry: "Technology SaaS",
  revenue: 2100000,
  founded: 2019,
  employees: 24,
  riskLevel: "critical",
  penaltyExposure: 85000,
  activeAlerts: 3,
  nextReview: "2024-12-03",
  states: [
    {
      code: "CA",
      name: "California",
      revenue: 525000,
      threshold: 500000,
      percentage: 105,
      status: "critical",
      daysSinceThreshold: 15,
      penaltyRange: { min: 25000, max: 45000 },
      transactions: null,
      transactionThreshold: null,
      projectedCrossover: null
    },
    {
      code: "NY",
      name: "New York",
      revenue: 89500,
      threshold: 500000,
      percentage: 18,
      status: "warning",
      daysSinceThreshold: null,
      penaltyRange: null,
      transactions: 95,
      transactionThreshold: 100,
      projectedCrossover: "Q1 2025"
    },
    {
      code: "TX",
      name: "Texas",
      revenue: 67200,
      threshold: 500000,
      percentage: 13,
      status: "monitoring",
      daysSinceThreshold: null,
      penaltyRange: null,
      transactions: null,
      transactionThreshold: null,
      projectedCrossover: null
    }
  ],
  alerts: [
    {
      id: 1,
      type: "critical",
      title: "California Registration Required",
      description: "Revenue threshold exceeded by $25,000",
      financialImpact: "$25,000 - $45,000",
      statute: "Cal. Rev. & Tax Code § 23101",
      deadline: "2024-12-15",
      assignedTo: "Jane Doe",
      status: "In Review",
      createdAt: "2024-11-13"
    },
    {
      id: 2,
      type: "warning",
      title: "New York Transaction Threshold",
      description: "Approaching 100 transaction threshold",
      financialImpact: "Potential registration requirement",
      statute: "N.Y. Tax Law § 1101(b)(8)",
      deadline: null,
      assignedTo: "Jane Doe",
      status: "Monitoring",
      createdAt: "2024-11-20"
    },
    {
      id: 3,
      type: "info",
      title: "Texas Monitoring Update",
      description: "Routine quarterly review scheduled",
      financialImpact: "No immediate impact",
      statute: "Tex. Tax Code Ann. § 151.107",
      deadline: "2024-12-31",
      assignedTo: "Jane Doe",
      status: "Scheduled",
      createdAt: "2024-11-25"
    }
  ],
  decisions: [
    {
      id: 1,
      date: "2024-11-13",
      type: "Threshold Analysis",
      outcome: "Registration Required",
      manager: "Jane Doe, CPA",
      rationale: "California economic nexus threshold exceeded by $25,000 in Q4 2024",
      documentation: "Complete",
      clientCommunication: "Pending",
      followUp: "Schedule client consultation"
    },
    {
      id: 2,
      date: "2024-10-15",
      type: "Monitoring Review",
      outcome: "Continue Monitoring",
      manager: "Jane Doe, CPA",
      rationale: "All jurisdictions within acceptable parameters",
      documentation: "Complete",
      clientCommunication: "Complete",
      followUp: "Next review scheduled"
    }
  ],
  communications: [
    {
      id: 1,
      type: "email",
      subject: "California Nexus Update",
      participants: ["Jane Doe", "TechCorp CFO"],
      date: "2024-11-28",
      duration: null,
      status: "Sent",
      followUp: "Awaiting response"
    },
    {
      id: 2,
      type: "call",
      subject: "Q4 Review Discussion",
      participants: ["Jane Doe", "TechCorp CEO"],
      date: "2024-11-25",
      duration: "45 minutes",
      status: "Completed",
      followUp: "Action items documented"
    }
  ],
  dataProcessing: {
    currentQueue: [
      { file: "Q4_Sales_Data.xlsx", status: "Processing", quality: 95 },
      { file: "Customer_List.csv", status: "Validated", quality: 98 },
      { file: "Transaction_Log.json", status: "Pending", quality: null }
    ],
    qualityTrend: [
      { month: "Aug", score: 92 },
      { month: "Sep", score: 94 },
      { month: "Oct", score: 96 },
      { month: "Nov", score: 95 }
    ]
  },
  performance: {
    responseTime: "2.3 hours",
    satisfaction: 4.8,
    complianceRate: 96,
    penaltyPrevention: 125000,
    timeSpent: "18.5 hours"
  }
};

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [expandedState, setExpandedState] = useState<string | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<number | null>(null);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "critical": return "danger";
      case "warning": return "warning";
      case "monitoring": return "primary";
      default: return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "danger";
      case "warning": return "warning";
      case "info": return "primary";
      default: return "default";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-black p-6">
      {/* Header Navigation */}
      <div className="mb-6">
        <Button
          variant="ghost"
          className="text-gray-400 hover:text-white mb-4"
          startContent={<ArrowLeft className="w-4 h-4" />}
          onClick={() => router.back()}
        >
          Back to Clients
        </Button>
      </div>

      {/* Client Identity Section */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
              <span className="text-3xl font-semibold text-blue-400">{clientData.avatar}</span>
            </div>
            <div>
              <h1 className="text-4xl font-semibold text-white mb-2 tracking-tight">{clientData.name}</h1>
              <div className="flex items-center space-x-6 text-gray-400">
                <span className="flex items-center space-x-2">
                  <Building className="w-4 h-4" />
                  <span>{clientData.industry}</span>
                </span>
                <span className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Annual Revenue: {formatCurrency(clientData.revenue)}</span>
                </span>
                <span className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Founded: {clientData.founded}</span>
                </span>
                <span className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Employees: {clientData.employees}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Chip
              color={getRiskColor(clientData.riskLevel)}
              size="lg"
              className="text-sm font-medium"
            >
              {clientData.riskLevel.toUpperCase()} RISK
            </Chip>
          </div>
        </div>

        {/* Risk Status Banner */}
        <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-medium text-red-400 mb-2">
                CRITICAL RISK - {formatCurrency(clientData.penaltyExposure)} Penalty Exposure
              </h2>
              <div className="flex items-center space-x-6 text-red-300">
                <span>{clientData.activeAlerts} Active Alerts</span>
                <span>CA Registration Required</span>
                <span>Next Review: {formatDate(clientData.nextReview)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            className="bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30"
            startContent={<Calendar className="w-4 h-4" />}
          >
            Schedule Consultation
          </Button>
          <Button
            className="bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30"
            startContent={<FileText className="w-4 h-4" />}
          >
            Generate Advisory
          </Button>
          <Button
            className="bg-purple-500/20 border-purple-500/30 text-purple-400 hover:bg-purple-500/30"
            startContent={<Edit className="w-4 h-4" />}
          >
            Document Decision
          </Button>
          <Button
            className="bg-orange-500/20 border-orange-500/30 text-orange-400 hover:bg-orange-500/30"
            startContent={<Phone className="w-4 h-4" />}
          >
            Contact Client
          </Button>
          <Button
            variant="flat"
            className="bg-white/10 text-gray-300 hover:bg-white/20"
            startContent={<Download className="w-4 h-4" />}
          >
            Export Records
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Multi-State Nexus Dashboard */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Multi-State Nexus Dashboard</h2>
              </div>
              <Button
                size="sm"
                variant="flat"
                className="bg-white/10 text-gray-300 hover:bg-white/20"
                startContent={<Filter className="w-3 h-3" />}
              >
                Filter States
              </Button>
            </div>

            {/* Interactive State Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {clientData.states.map((state) => (
                <div
                  key={state.code}
                  className={`bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer ${
                    expandedState === state.code ? 'ring-2 ring-blue-500/50' : ''
                  }`}
                  onClick={() => setExpandedState(expandedState === state.code ? null : state.code)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                        <Flag className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm tracking-tight">{state.name}</h3>
                        <p className="text-gray-400 text-xs">{state.code}</p>
                      </div>
                    </div>
                    <Chip
                      color={getStatusColor(state.status)}
                      size="sm"
                      className="text-xs"
                    >
                      {state.status === "critical" ? "REGISTRATION REQUIRED" :
                       state.status === "warning" ? "APPROACHING THRESHOLD" :
                       "MONITORING"}
                    </Chip>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Revenue</span>
                        <span className="text-white">{formatCurrency(state.revenue)} of {formatCurrency(state.threshold)}</span>
                      </div>
                      <Progress
                        value={state.percentage}
                        className="mb-2"
                        color={state.percentage >= 100 ? "danger" : state.percentage >= 80 ? "warning" : "primary"}
                      />
                      <p className="text-xs text-gray-400">{state.percentage}% of threshold</p>
                    </div>

                    {state.transactions && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Transactions</span>
                          <span className="text-white">{state.transactions} of {state.transactionThreshold}</span>
                        </div>
                        <Progress
                          value={(state.transactions / state.transactionThreshold) * 100}
                          className="mb-2"
                          color="warning"
                        />
                      </div>
                    )}

                    {state.daysSinceThreshold && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                        <p className="text-red-300 text-xs">
                          Days since threshold crossed: {state.daysSinceThreshold} days
                        </p>
                        <p className="text-red-200 text-xs">
                          Estimated penalty: {formatCurrency(state.penaltyRange.min)} - {formatCurrency(state.penaltyRange.max)}
                        </p>
                      </div>
                    )}

                    {state.projectedCrossover && (
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2">
                        <p className="text-yellow-300 text-xs">
                          Projected crossover: {state.projectedCrossover}
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-2 pt-2">
                      <Button
                        size="sm"
                        variant="flat"
                        className="bg-white/10 text-gray-300 hover:bg-white/20 text-xs"
                      >
                        {state.status === "critical" ? "Register Client" : 
                         state.status === "warning" ? "Monitor Closely" : "Track Progress"}
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        className="bg-white/10 text-gray-300 hover:bg-white/20 text-xs"
                      >
                        Document Decision
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alert Management Section */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-6 bg-red-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Active Alerts</h2>
              </div>
              <Badge content={clientData.alerts.length} color="danger" size="sm">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </Badge>
            </div>

            <div className="space-y-4">
              {clientData.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        alert.type === "critical" ? "bg-red-500/20" :
                        alert.type === "warning" ? "bg-yellow-500/20" : "bg-blue-500/20"
                      }`}>
                        {alert.type === "critical" ? <AlertTriangle className="w-4 h-4 text-red-400" /> :
                         alert.type === "warning" ? <Clock className="w-4 h-4 text-yellow-400" /> :
                         <CheckCircle className="w-4 h-4 text-blue-400" />}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm tracking-tight">{alert.title}</h3>
                        <p className="text-gray-400 text-sm">{alert.description}</p>
                      </div>
                    </div>
                    <Chip
                      color={getStatusColor(alert.status)}
                      size="sm"
                      className="text-xs"
                    >
                      {alert.status}
                    </Chip>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-gray-400 text-xs">Financial Impact</p>
                      <p className="text-white text-sm font-medium">{alert.financialImpact}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Statute</p>
                      <p className="text-blue-300 text-sm font-mono">{alert.statute}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Assigned To</p>
                      <p className="text-white text-sm">{alert.assignedTo}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Created</p>
                      <p className="text-white text-sm">{formatDate(alert.createdAt)}</p>
                    </div>
                  </div>

                  {alert.deadline && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-3">
                      <p className="text-yellow-300 text-sm">
                        Deadline: {formatDate(alert.deadline)}
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30"
                    >
                      Document Decision
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      className="bg-white/10 text-gray-300 hover:bg-white/20"
                    >
                      Client Advisory
                    </Button>
                    {alert.type === "critical" && (
                      <Button
                        size="sm"
                        variant="flat"
                        className="bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      >
                        Escalate to Partner
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Quick Actions & Analytics */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Performance Analytics */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Performance Analytics</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Response Time</span>
                  <span className="text-white text-sm font-semibold">{clientData.performance.responseTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Client Satisfaction</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white text-sm font-semibold">{clientData.performance.satisfaction}/5</span>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < Math.floor(clientData.performance.satisfaction) ? 'bg-yellow-400' : 'bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Compliance Rate</span>
                  <span className="text-white text-sm font-semibold">{clientData.performance.complianceRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Penalty Prevention</span>
                  <span className="text-green-400 text-sm font-semibold">{formatCurrency(clientData.performance.penaltyPrevention)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Time Spent</span>
                  <span className="text-white text-sm font-semibold">{clientData.performance.timeSpent}</span>
                </div>
              </div>
            </div>

            {/* Data Processing Status */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Data Processing</h2>
              </div>
              <div className="space-y-3">
                {clientData.dataProcessing.currentQueue.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white text-sm font-semibold">{item.file}</p>
                      <p className="text-gray-400 text-xs">{item.status}</p>
                    </div>
                    {item.quality && (
                      <Chip
                        color={item.quality >= 95 ? "success" : item.quality >= 90 ? "warning" : "danger"}
                        size="sm"
                        className="text-xs"
                      >
                        {item.quality}%
                      </Chip>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Quick Actions</h2>
              </div>
              <div className="space-y-3">
                <Button
                  fullWidth
                  variant="flat"
                  className="bg-white/10 text-gray-300 hover:bg-white/20 justify-start"
                  startContent={<MessageSquare className="w-4 h-4" />}
                >
                  Send Status Update
                </Button>
                <Button
                  fullWidth
                  variant="flat"
                  className="bg-white/10 text-gray-300 hover:bg-white/20 justify-start"
                  startContent={<Calendar className="w-4 h-4" />}
                >
                  Schedule Advisory Call
                </Button>
                <Button
                  fullWidth
                  variant="flat"
                  className="bg-white/10 text-gray-300 hover:bg-white/20 justify-start"
                  startContent={<FileText className="w-4 h-4" />}
                >
                  Generate Compliance Letter
                </Button>
                <Button
                  fullWidth
                  variant="flat"
                  className="bg-white/10 text-gray-300 hover:bg-white/20 justify-start"
                  startContent={<Download className="w-4 h-4" />}
                >
                  Request Additional Data
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
