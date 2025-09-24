"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  Button, 
  Chip, 
  Textarea,
  Input
} from "@nextui-org/react";

// Client data structure
interface Client {
  id: string;
  name: string;
  avatar: string;
  industry: string;
  revenue: number;
  founded: number;
  employees: number;
  riskLevel: 'critical' | 'high' | 'warning' | 'low';
  penaltyExposure: number;
  assignedSince: string;
  lastReview: string;
  nextReview: string;
  activeAlerts: number;
  states: {
    code: string;
    name: string;
    revenue: number;
    threshold: number;
    percentage: number;
    status: 'critical' | 'warning' | 'monitoring' | 'compliant';
    daysSinceThreshold?: number;
    penaltyRange?: { min: number; max: number };
    transactions?: number;
    transactionThreshold?: number;
    projectedCrossover?: string;
  }[];
  decisions: {
    id: number;
    date: string;
    type: string;
    outcome: string;
    manager: string;
    rationale: string;
    documentation: string;
    clientCommunication: string;
    followUp: string;
  }[];
  communications: {
    id: number;
    type: string;
    subject: string;
    participants: string[];
    date: string;
    duration?: string;
    status: string;
    followUp: string;
  }[];
  performance: {
    responseTime: string;
    satisfaction: number;
    complianceRate: number;
    penaltyPrevention: number;
    timeSpent: string;
  };
}

// Sample client data
const clients: Client[] = [
  {
    id: "techcorp-saas",
    name: "TechCorp SaaS",
    avatar: "T",
    industry: "Technology SaaS",
    revenue: 2100000,
    founded: 2019,
    employees: 24,
    riskLevel: "critical",
    penaltyExposure: 85000,
    assignedSince: "Jan 2024",
    lastReview: "Nov 15, 2024",
    nextReview: "Dec 15, 2024",
    activeAlerts: 3,
    states: [
      { 
        code: "CA", 
        name: "California", 
        revenue: 525000, 
        threshold: 500000, 
        percentage: 105, 
        status: "critical",
        daysSinceThreshold: 15,
        penaltyRange: { min: 25000, max: 45000 }
      },
      { 
        code: "NY", 
        name: "New York", 
        revenue: 89500, 
        threshold: 500000, 
        percentage: 18, 
        status: "warning",
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
        status: "monitoring" 
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
      }
    ],
    communications: [
      {
        id: 1,
        type: "email",
        subject: "California Nexus Update",
        participants: ["Jane Doe", "TechCorp CFO"],
        date: "2024-11-28",
        status: "Sent",
        followUp: "Awaiting response"
      }
    ],
    performance: {
      responseTime: "2.3 hours",
      satisfaction: 4.8,
      complianceRate: 96,
      penaltyPrevention: 125000,
      timeSpent: "18.5 hours"
    }
  },
  {
    id: "retailchain-llc",
    name: "RetailChain LLC",
    avatar: "R",
    industry: "E-commerce",
    revenue: 1800000,
    founded: 2018,
    employees: 45,
    riskLevel: "warning",
    penaltyExposure: 42000,
    assignedSince: "Mar 2024",
    lastReview: "Nov 1, 2024",
    nextReview: "Dec 1, 2024",
    activeAlerts: 2,
    states: [
      { 
        code: "NY", 
        name: "New York", 
        revenue: 485000, 
        threshold: 500000, 
        percentage: 97, 
        status: "warning",
        transactions: 95,
        transactionThreshold: 100,
        projectedCrossover: "Q4 2024"
      },
      { 
        code: "TX", 
        name: "Texas", 
        revenue: 220000, 
        threshold: 500000, 
        percentage: 44, 
        status: "monitoring" 
      },
      { 
        code: "CA", 
        name: "California", 
        revenue: 180000, 
        threshold: 500000, 
        percentage: 36, 
        status: "monitoring" 
      }
    ],
    decisions: [
      {
        id: 1,
        date: "2024-11-01",
        type: "Threshold Advisory",
        outcome: "Monitor Q4 Closely",
        manager: "Jane Doe, CPA",
        rationale: "Approaching both revenue and transaction thresholds in New York",
        documentation: "Complete",
        clientCommunication: "Complete",
        followUp: "Next review scheduled"
      }
    ],
    communications: [
      {
        id: 1,
        type: "call",
        subject: "NY Threshold Discussion",
        participants: ["Jane Doe", "RetailChain CEO"],
        date: "2024-11-25",
        duration: "30 minutes",
        status: "Completed",
        followUp: "Action items documented"
      }
    ],
    performance: {
      responseTime: "1.8 hours",
      satisfaction: 4.6,
      complianceRate: 94,
      penaltyPrevention: 78000,
      timeSpent: "12.3 hours"
    }
  },
  {
    id: "manufacturingco",
    name: "ManufacturingCo",
    avatar: "M",
    industry: "Manufacturing",
    revenue: 3200000,
    founded: 2015,
    employees: 120,
    riskLevel: "high",
    penaltyExposure: 65000,
    assignedSince: "Feb 2024",
    lastReview: "Oct 15, 2024",
    nextReview: "Jan 15, 2025",
    activeAlerts: 1,
    states: [
      { 
        code: "TX", 
        name: "Texas", 
        revenue: 465000, 
        threshold: 500000, 
        percentage: 93, 
        status: "warning",
        projectedCrossover: "Q1 2025"
      },
      { 
        code: "CA", 
        name: "California", 
        revenue: 320000, 
        threshold: 500000, 
        percentage: 64, 
        status: "monitoring" 
      },
      { 
        code: "IL", 
        name: "Illinois", 
        revenue: 280000, 
        threshold: 500000, 
        percentage: 56, 
        status: "monitoring" 
      }
    ],
    decisions: [
      {
        id: 1,
        date: "2024-10-15",
        type: "Threshold Monitoring",
        outcome: "Prepare for Registration",
        manager: "Jane Doe, CPA",
        rationale: "At 93% of Texas threshold. Track Q1 2025 projections",
        documentation: "Complete",
        clientCommunication: "Complete",
        followUp: "Next review scheduled"
      }
    ],
    communications: [
      {
        id: 1,
        type: "meeting",
        subject: "Q4 Review Meeting",
        participants: ["Jane Doe", "ManufacturingCo CFO"],
        date: "2024-10-20",
        duration: "60 minutes",
        status: "Completed",
        followUp: "Action items documented"
      }
    ],
    performance: {
      responseTime: "3.1 hours",
      satisfaction: 4.7,
      complianceRate: 92,
      penaltyPrevention: 95000,
      timeSpent: "22.1 hours"
    }
  },
  {
    id: "servicescorp",
    name: "ServicesCorp",
    avatar: "S",
    industry: "Professional Services",
    revenue: 950000,
    founded: 2020,
    employees: 12,
    riskLevel: "low",
    penaltyExposure: 15000,
    assignedSince: "Jun 2024",
    lastReview: "Nov 10, 2024",
    nextReview: "Feb 10, 2025",
    activeAlerts: 0,
    states: [
      { 
        code: "WA", 
        name: "Washington", 
        revenue: 320000, 
        threshold: 500000, 
        percentage: 64, 
        status: "monitoring" 
      },
      { 
        code: "OR", 
        name: "Oregon", 
        revenue: 180000, 
        threshold: 500000, 
        percentage: 36, 
        status: "monitoring" 
      }
    ],
    decisions: [
      {
        id: 1,
        date: "2024-11-10",
        type: "B&O Tax Review",
        outcome: "Monitor Business Activities",
        manager: "Jane Doe, CPA",
        rationale: "Review specific activities and prepare compliance plan",
        documentation: "Complete",
        clientCommunication: "Complete",
        followUp: "Next review scheduled"
      }
    ],
    communications: [
      {
        id: 1,
        type: "email",
        subject: "B&O Tax Requirements",
        participants: ["Jane Doe", "ServicesCorp Owner"],
        date: "2024-11-12",
        status: "Sent",
        followUp: "Awaiting response"
      }
    ],
    performance: {
      responseTime: "1.2 hours",
      satisfaction: 4.9,
      complianceRate: 98,
      penaltyPrevention: 25000,
      timeSpent: "8.7 hours"
    }
  }
];

// Utility functions
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

// Risk level colors
const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'critical': return 'danger';
    case 'high': return 'warning';
    case 'warning': return 'secondary';
    case 'low': return 'success';
    default: return 'default';
  }
};

// Status colors
const getStatusColor = (status: string) => {
  switch (status) {
    case 'critical': return 'danger';
    case 'warning': return 'warning';
    case 'monitoring': return 'primary';
    case 'compliant': return 'success';
    default: return 'default';
  }
};

export default function TaxManagerClients() {
  const router = useRouter();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [riskFilter, setRiskFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);

  // Filter clients based on search and risk filter
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'all' || client.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const handleClientSelect = (client: Client) => {
    router.push(`/dashboard/tax-manager/clients/${client.id}`);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedClient(null);
  };

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        if (isPanelOpen) {
          handleClosePanel();
        }
      }
    };

    if (isPanelOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPanelOpen]);

  // Calculate portfolio stats
  const portfolioStats = {
    totalClients: clients.length,
    highRisk: clients.filter(c => c.riskLevel === 'critical' || c.riskLevel === 'high').length,
    criticalAlerts: clients.reduce((sum, c) => sum + c.activeAlerts, 0),
    totalExposure: clients.reduce((sum, c) => sum + parseInt(c.totalExposure.replace('$', '').replace('K', '')), 0)
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-6 relative">
        <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
          
          {/* Main Content */}
          <div className="mt-6 gap-6 flex flex-col w-full">
            {/* Client Portfolio Overview */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Client Portfolio</h2>
              </div>
              
              {/* Minimal Portfolio Stats */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-white font-semibold text-sm tracking-tight">Jane Doe, Tax Manager</h3>
                      <p className="text-gray-400 text-xs font-medium">Professional Nexus Compliance Oversight</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs font-medium">Active</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{portfolioStats.totalClients}</div>
                      <div className="text-gray-400 text-xs font-medium">Assigned Clients</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-500">{portfolioStats.highRisk}</div>
                      <div className="text-gray-400 text-xs font-medium">High Risk</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-500">{portfolioStats.criticalAlerts}</div>
                      <div className="text-gray-400 text-xs font-medium">Critical Alerts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">${portfolioStats.totalExposure}K</div>
                      <div className="text-gray-400 text-xs font-medium">Total Exposure</div>
                    </div>
                  </div>
                </div>
              </div>

            {/* Controls */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    onPress={() => setViewMode('grid')}
                  >
                    Grid View
                  </Button>
                  <Button
                    size="sm"
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    onPress={() => setViewMode('list')}
                  >
                    List View
                  </Button>
                </div>
                
                <div className="flex gap-3 items-center">
                  <div className="relative">
                    <Input
                      placeholder="Search clients..."
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                      size="sm"
                      className="w-64 bg-white/5 border-white/10 text-white placeholder-gray-400"
                      classNames={{
                        input: "text-white",
                        inputWrapper: "bg-white/5 border-white/10 hover:border-white/20 focus-within:border-blue-500/50"
                      }}
                    />
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        riskFilter === "all" 
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setRiskFilter("all")}
                    >
                      All
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        riskFilter === "critical" 
                          ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setRiskFilter("critical")}
                    >
                      Critical
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        riskFilter === "high" 
                          ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setRiskFilter("high")}
                    >
                      High
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        riskFilter === "warning" 
                          ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setRiskFilter("warning")}
                    >
                      Warning
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        riskFilter === "low" 
                          ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setRiskFilter("low")}
                    >
                      Low
                    </Button>
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all duration-200 shadow-lg shadow-blue-500/25"
                  >
                    Add Client
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Client Cards/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredClients.map((client) => (
                <div 
                  key={client.id} 
                  className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20 cursor-pointer"
                  onClick={() => handleClientSelect(client)}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${
                        client.riskLevel === 'critical' ? 'bg-red-500/10' :
                        client.riskLevel === 'high' ? 'bg-orange-500/10' :
                        client.riskLevel === 'warning' ? 'bg-yellow-500/10' :
                        'bg-green-500/10'
                      } rounded-xl flex items-center justify-center`}>
                        <svg className={`w-5 h-5 ${
                          client.riskLevel === 'critical' ? 'text-red-500' :
                          client.riskLevel === 'high' ? 'text-orange-500' :
                          client.riskLevel === 'warning' ? 'text-yellow-500' :
                          'text-green-500'
                        }`} fill="currentColor" viewBox="0 0 20 20">
                          {client.riskLevel === 'critical' ? (
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          ) : client.riskLevel === 'high' ? (
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          ) : client.riskLevel === 'warning' ? (
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          )}
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-lg tracking-tight">{client.name}</h4>
                        <p className="text-gray-400 text-sm font-medium">{client.industry} • {formatCurrency(client.revenue)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 ${
                        client.riskLevel === 'critical' ? 'bg-red-500' :
                        client.riskLevel === 'high' ? 'bg-orange-500' :
                        client.riskLevel === 'warning' ? 'bg-yellow-500' :
                        'bg-green-500'
                      } rounded-full mb-2`}>
                        <span className="text-white text-xs font-semibold">{client.riskLevel.toUpperCase()}</span>
                      </div>
                      <p className="text-white text-sm font-semibold">{formatCurrency(client.penaltyExposure)} Risk</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    {/* State Status */}
                    <div className="space-y-2">
                      {client.states.slice(0, 2).map((state, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-white text-sm font-medium">{state.code}: {formatCurrency(state.revenue)}</span>
                          </div>
                          <div className={`px-2 py-1 ${
                            state.status === 'critical' ? 'bg-red-500/20 text-red-400' :
                            state.status === 'warning' ? 'bg-orange-500/20 text-orange-400' :
                            state.status === 'monitoring' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-green-500/20 text-green-400'
                          } rounded-lg`}>
                            <span className="text-xs font-medium">{state.status}</span>
                          </div>
                        </div>
                      ))}
                      {client.states.length > 2 && (
                        <p className="text-gray-400 text-xs font-medium">+{client.states.length - 2} more states</p>
                      )}
                    </div>

                    {/* Alerts and Review */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                        <span className="text-white text-sm font-medium">{client.activeAlerts} alerts</span>
                      </div>
                      <span className="text-gray-400 text-xs font-medium">Last: {client.lastReview}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg font-medium transition-all duration-200"
                      >
                        Review Alerts
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 bg-white/10 text-white hover:bg-white/20 border border-white/20 rounded-lg font-medium transition-all duration-200"
                        onClick={() => handleClientSelect(client)}
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <Table aria-label="Client List" className="text-white">
                <TableHeader>
                  <TableColumn className="text-white font-semibold">CLIENT</TableColumn>
                  <TableColumn className="text-white font-semibold">INDUSTRY</TableColumn>
                  <TableColumn className="text-white font-semibold">REVENUE</TableColumn>
                  <TableColumn className="text-white font-semibold">RISK LEVEL</TableColumn>
                  <TableColumn className="text-white font-semibold">EXPOSURE</TableColumn>
                  <TableColumn className="text-white font-semibold">ALERTS</TableColumn>
                  <TableColumn className="text-white font-semibold">LAST REVIEW</TableColumn>
                  <TableColumn className="text-white font-semibold">ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow 
                      key={client.id}
                      className="cursor-pointer hover:bg-white/5 transition-colors duration-200"
                      onClick={() => handleClientSelect(client)}
                    >
                      <TableCell>
                        <div className="text-white font-semibold">{client.name}</div>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-300">{client.industry}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-white font-medium">{formatCurrency(client.revenue)}</span>
                      </TableCell>
                      <TableCell>
                        <div className={`px-2 py-1 ${
                          client.riskLevel === 'critical' ? 'bg-red-500' :
                          client.riskLevel === 'high' ? 'bg-orange-500' :
                          client.riskLevel === 'warning' ? 'bg-yellow-500' :
                          'bg-green-500'
                        } rounded-full`}>
                          <span className="text-white text-xs font-semibold">{client.riskLevel.toUpperCase()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-white font-semibold">{formatCurrency(client.penaltyExposure)}</span>
                      </TableCell>
                      <TableCell>
                        <div className={`px-2 py-1 ${
                          client.activeAlerts > 0 ? 'bg-red-500' : 'bg-gray-500'
                        } rounded-full`}>
                          <span className="text-white text-xs font-semibold">{client.activeAlerts}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-300">{client.lastReview}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg font-medium transition-all duration-200"
                          >
                            Review
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-white/10 text-white hover:bg-white/20 border border-white/20 rounded-lg font-medium transition-all duration-200"
                            onClick={() => handleClientSelect(client)}
                          >
                            Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Client Detail Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-full w-1/2 bg-black/95 backdrop-blur-xl border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Panel Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              <h3 className="text-white text-lg font-semibold tracking-tight">Client Nexus Profile</h3>
            </div>
            <Button
              isIconOnly
              size="sm"
              onPress={handleClosePanel}
              className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {selectedClient ? (
              <div className="space-y-6">
                {/* Client Overview */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                  <div className="flex justify-between items-start w-full mb-4">
                    <div>
                      <h4 className="text-white text-xl font-bold tracking-tight">{selectedClient.name} - Complete Nexus Profile</h4>
                      <p className="text-gray-400 text-sm font-medium mt-1">Industry: {selectedClient.industry} | Revenue: {selectedClient.revenue} annual</p>
                    </div>
                    <div className={`px-3 py-1 ${
                      selectedClient.riskLevel === 'critical' ? 'bg-red-500' :
                      selectedClient.riskLevel === 'high' ? 'bg-orange-500' :
                      selectedClient.riskLevel === 'warning' ? 'bg-yellow-500' :
                      'bg-green-500'
                    } rounded-full`}>
                      <span className="text-white text-xs font-semibold">{selectedClient.riskLevel.toUpperCase()} RISK</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Total Exposure:</span>
                      <span className="text-white font-bold">{selectedClient.totalExposure}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Assigned Since:</span>
                      <span className="text-white">{selectedClient.assignedSince}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Last Review:</span>
                      <span className="text-white">{selectedClient.lastReview}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Next Review:</span>
                      <span className="text-white">{selectedClient.nextReview}</span>
                    </div>
                  </div>
                </div>

                {/* Multi-State Status */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                    <h4 className="text-white text-lg font-semibold tracking-tight">Multi-State Status</h4>
                  </div>
                  <div className="space-y-3">
                    {selectedClient.states.map((state, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                        <div>
                          <span className="text-white font-semibold">{state.state}: {state.amount}</span>
                          <span className="text-gray-400 text-sm ml-2">of {state.threshold}</span>
                          {state.transactions && (
                            <span className="text-gray-400 text-sm ml-2">+ {state.transactions} transactions</span>
                          )}
                        </div>
                        <div className={`px-3 py-1 ${
                          state.status === 'exceeded' ? 'bg-red-500' :
                          state.status === 'approaching' ? 'bg-orange-500' :
                          state.status === 'monitoring' ? 'bg-blue-500' :
                          'bg-green-500'
                        } rounded-full`}>
                          <span className="text-white text-xs font-semibold">{state.status.toUpperCase()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Professional Decisions History */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                    <h4 className="text-white text-lg font-semibold tracking-tight">Professional Decisions History</h4>
                  </div>
                  <div className="space-y-4">
                    {selectedClient.decisions.map((decision, index) => (
                      <div key={index} className="border-l-4 border-l-blue-500 pl-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white font-semibold">{decision.decision}</p>
                            <p className="text-gray-400 text-sm mt-1">{decision.reasoning}</p>
                          </div>
                          <span className="text-gray-500 text-xs">{decision.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current Action Items */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                    <h4 className="text-white text-lg font-semibold tracking-tight">Current Action Items</h4>
                  </div>
                  <div className="space-y-3">
                    {selectedClient.actionItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                        <div>
                          <p className="text-white font-medium">{item.task}</p>
                          <p className="text-gray-400 text-sm">Due: {item.dueDate}</p>
                        </div>
                        <div className={`px-3 py-1 ${
                          item.status === 'completed' ? 'bg-green-500' : 
                          item.status === 'in-progress' ? 'bg-orange-500' : 
                          'bg-gray-500'
                        } rounded-full`}>
                          <span className="text-white text-xs font-semibold">{item.status.replace('-', ' ').toUpperCase()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-blue-500/25">
                    Document Decision
                  </Button>
                  <Button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 border border-white/20">
                    Schedule Client Call
                  </Button>
                  <Button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 border border-white/20">
                    View Alerts
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h4 className="text-white text-lg font-semibold mb-2">
                    Select a Client
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Choose a client from the portfolio to view detailed nexus profile
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop overlay when panel is open */}
      {isPanelOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={handleClosePanel}
        />
      )}
    </div>
  );
}
