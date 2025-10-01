"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
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
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@nextui-org/react";
import { 
  Users, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  RefreshCw, 
  Plus, 
  ChevronRight,
  Building2,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  Calendar,
  MessageSquare,
  FileText,
  Phone,
  Mail,
  Eye,
  Edit,
  Trash2,
  Download,
  Share
} from "lucide-react";
import { useClients } from "@/hooks/useApi";

// Client data structure
interface Client {
  id: string;
  slug: string;
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

// Fallback client data for testing when API is not available
const fallbackClients: Client[] = [
  {
    id: "techcorp-saas",
    slug: "techcorp-saas",
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
    slug: "retailmax-stores",
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
    slug: "manufacturing-plus",
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
    slug: "services-corp",
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [riskFilter, setRiskFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { isOpen: isModalOpen, onOpen: onModalOpen, onOpenChange: onModalOpenChange } = useDisclosure();

  // API integration
  const { 
    data: clientsData, 
    loading: clientsLoading, 
    error: clientsError, 
    refetch: refetchClients 
  } = useClients({
    limit: 50,
    search: searchQuery || undefined,
    riskLevel: riskFilter !== 'all' ? riskFilter : undefined
  });

  // Process clients data with fallback
  const clients = useMemo(() => {
    if (clientsLoading) return [];
    if (clientsError || !clientsData?.clients) {
      return fallbackClients;
    }
    return clientsData.clients as unknown as Client[];
  }, [clientsData, clientsLoading, clientsError]);

  // Filter clients based on search and risk filter (client-side filtering for fallback data)
  const filteredClients = useMemo(() => {
    if (clientsData?.clients) {
      // API already handles filtering, return as-is
      return clients;
    }
    // Client-side filtering for fallback data
    return clients.filter((client) => {
      const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           client.industry.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRisk = riskFilter === 'all' || client.riskLevel === riskFilter;
      return matchesSearch && matchesRisk;
    });
  }, [clients, searchQuery, riskFilter, clientsData]);

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    onModalOpen();
  };

  const handleViewDetails = (client: Client) => {
    router.push(`/dashboard/tax-manager/clients/${client.slug}`);
  };

  // Calculate portfolio stats
  const portfolioStats = {
    totalClients: clients.length,
    highRisk: clients.filter((c) => c.riskLevel === 'critical' || c.riskLevel === 'high').length,
    criticalAlerts: clients.reduce((sum, c) => sum + c.activeAlerts, 0),
    totalExposure: clients.reduce((sum, c) => sum + c.penaltyExposure, 0)
  };

  // Auto-refresh functionality
  useEffect(() => {
    const interval = setInterval(() => {
      refetchClients();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [refetchClients]);

  return (
    <div className="min-h-screen bg-black">
      {/* Apple-style Header */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-white tracking-tight">Client Portfolio</h1>
                <p className="text-gray-400 text-sm">Professional nexus compliance oversight</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/25"
                startContent={<Plus className="w-4 h-4" />}
              >
                Add Client
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Apple-style Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Clients</p>
                  <p className="text-3xl font-bold text-white mt-1">{portfolioStats.totalClients}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">High Risk</p>
                  <p className="text-3xl font-bold text-orange-500 mt-1">{portfolioStats.highRisk}</p>
                </div>
                <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Active Alerts</p>
                  <p className="text-3xl font-bold text-red-500 mt-1">{portfolioStats.criticalAlerts}</p>
                </div>
                <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Exposure</p>
                  <p className="text-3xl font-bold text-white mt-1">{formatCurrency(portfolioStats.totalExposure)}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Apple-style Search and Controls */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl mb-8">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search clients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant={viewMode === "grid" ? "solid" : "ghost"}
                    className={viewMode === "grid" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/10"}
                    startContent={<Grid3X3 className="w-4 h-4" />}
                    onPress={() => setViewMode("grid")}
                  >
                    Grid
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === "list" ? "solid" : "ghost"}
                    className={viewMode === "list" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/10"}
                    startContent={<List className="w-4 h-4" />}
                    onPress={() => setViewMode("list")}
                  >
                    List
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant={riskFilter === "all" ? "solid" : "ghost"}
                    className={riskFilter === "all" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/10"}
                    onPress={() => setRiskFilter("all")}
                  >
                    All
                  </Button>
                  <Button
                    size="sm"
                    variant={riskFilter === "critical" ? "solid" : "ghost"}
                    className={riskFilter === "critical" ? "bg-red-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/10"}
                    onPress={() => setRiskFilter("critical")}
                  >
                    Critical
                  </Button>
                  <Button
                    size="sm"
                    variant={riskFilter === "high" ? "solid" : "ghost"}
                    className={riskFilter === "high" ? "bg-orange-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/10"}
                    onPress={() => setRiskFilter("high")}
                  >
                    High
                  </Button>
                  <Button
                    size="sm"
                    variant={riskFilter === "warning" ? "solid" : "ghost"}
                    className={riskFilter === "warning" ? "bg-yellow-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/10"}
                    onPress={() => setRiskFilter("warning")}
                  >
                    Warning
                  </Button>
                  <Button
                    size="sm"
                    variant={riskFilter === "low" ? "solid" : "ghost"}
                    className={riskFilter === "low" ? "bg-green-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/10"}
                    onPress={() => setRiskFilter("low")}
                  >
                    Low
                  </Button>
                </div>
                
                <Button
                  size="sm"
                  className="bg-white/5 text-gray-300 hover:bg-white/10 rounded-xl"
                  startContent={<RefreshCw className="w-4 h-4" />}
                  onPress={refetchClients}
                  isLoading={clientsLoading}
                >
                  Refresh
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
        {/* Apple-style Alerts Display */}
        {clientsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white text-lg font-medium">Loading clients...</p>
            </div>
          </div>
        ) : clientsError ? (
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
            <CardBody className="p-12 text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h4 className="text-white text-lg font-semibold mb-2">Error Loading Clients</h4>
              <p className="text-gray-400 text-sm mb-4">Using fallback data for demonstration</p>
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                onPress={refetchClients}
              >
                Try Again
              </Button>
            </CardBody>
          </Card>
        ) : filteredClients.length === 0 ? (
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
            <CardBody className="p-12 text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-white text-lg font-semibold mb-2">No Clients Found</h4>
              <p className="text-gray-400 text-sm">Try adjusting your search or filter criteria</p>
            </CardBody>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <Card
                key={client.id}
                className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                isPressable
                onPress={() => handleClientSelect(client)}
              >
                <CardBody className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${
                        client.riskLevel === 'critical' ? 'bg-red-500/20' :
                        client.riskLevel === 'high' ? 'bg-orange-500/20' :
                        client.riskLevel === 'warning' ? 'bg-yellow-500/20' :
                        'bg-green-500/20'
                      } rounded-2xl flex items-center justify-center`}>
                        <Building2 className={`w-5 h-5 ${
                          client.riskLevel === 'critical' ? 'text-red-400' :
                          client.riskLevel === 'high' ? 'text-orange-400' :
                          client.riskLevel === 'warning' ? 'text-yellow-400' :
                          'text-green-400'
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm">{client.name}</h3>
                        <p className="text-gray-400 text-xs">{client.industry}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      client.riskLevel === 'critical' ? 'bg-red-500/20 text-red-400' :
                      client.riskLevel === 'high' ? 'bg-orange-500/20 text-orange-400' :
                      client.riskLevel === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {client.riskLevel.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-white font-medium text-sm">{formatCurrency(client.revenue)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span className="text-white font-medium text-sm">{formatCurrency(client.penaltyExposure)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 text-sm">{client.states.length} states</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 text-sm">{client.activeAlerts} alerts</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 text-sm">Last: {client.lastReview}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
            <CardBody className="p-0">
              <div className="divide-y divide-white/10">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className="p-6 hover:bg-white/5 transition-colors duration-200 cursor-pointer group"
                    onClick={() => handleClientSelect(client)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className={`w-12 h-12 ${
                          client.riskLevel === 'critical' ? 'bg-red-500/20' :
                          client.riskLevel === 'high' ? 'bg-orange-500/20' :
                          client.riskLevel === 'warning' ? 'bg-yellow-500/20' :
                          'bg-green-500/20'
                        } rounded-2xl flex items-center justify-center`}>
                          <Building2 className={`w-6 h-6 ${
                            client.riskLevel === 'critical' ? 'text-red-400' :
                            client.riskLevel === 'high' ? 'text-orange-400' :
                            client.riskLevel === 'warning' ? 'text-yellow-400' :
                            'text-green-400'
                          }`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="text-white font-semibold text-base">{client.name}</h3>
                            <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${
                              client.riskLevel === 'critical' ? 'bg-red-500/20 text-red-400' :
                              client.riskLevel === 'high' ? 'bg-orange-500/20 text-orange-400' :
                              client.riskLevel === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {client.riskLevel.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm mb-2">{client.industry}</p>
                          
                          <div className="flex items-center space-x-6 text-xs text-gray-400">
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-3 h-3" />
                              <span>{formatCurrency(client.revenue)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <AlertTriangle className="w-3 h-3" />
                              <span>{formatCurrency(client.penaltyExposure)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{client.states.length} states</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{client.activeAlerts} alerts</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="text-gray-300 text-sm">Last: {client.lastReview}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                            onPress={() => handleViewDetails(client)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Apple-style Modal for Client Details */}
      <Modal
        isOpen={isModalOpen}
        onOpenChange={onModalOpenChange}
        size="5xl"
        classNames={{
          base: "bg-black/95 backdrop-blur-xl border-white/10",
          header: "border-b border-white/10",
          body: "py-6",
          footer: "border-t border-white/10"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-semibold">Client Details</h3>
                    <p className="text-gray-400 text-sm">Comprehensive nexus profile and compliance status</p>
                  </div>
                </div>
              </ModalHeader>

              <ModalBody>
                {selectedClient ? (
                  <div className="space-y-6">
                    {/* Client Overview Card */}
                    <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
                      <CardBody className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-white text-xl font-bold tracking-tight">{selectedClient.name}</h4>
                            <p className="text-gray-400 text-sm font-medium mt-1">{selectedClient.industry} • {formatCurrency(selectedClient.revenue)} annual revenue</p>
                          </div>
                          <div className={`px-3 py-1 rounded-lg text-xs font-medium ${
                            selectedClient.riskLevel === 'critical' ? 'bg-red-500/20 text-red-400' :
                            selectedClient.riskLevel === 'high' ? 'bg-orange-500/20 text-orange-400' :
                            selectedClient.riskLevel === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {selectedClient.riskLevel.toUpperCase()} RISK
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400 font-medium">Penalty Exposure:</span>
                            <span className="text-white font-bold">{formatCurrency(selectedClient.penaltyExposure)}</span>
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
                      </CardBody>
                    </Card>

                    {/* Multi-State Status */}
                    <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
                      <CardBody className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                          <h4 className="text-white text-lg font-semibold tracking-tight">Multi-State Status</h4>
                        </div>
                        <div className="space-y-3">
                          {selectedClient.states.map((state, index) => (
                            <div key={index} className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                              <div>
                                <span className="text-white font-semibold">{state.code}: {formatCurrency(state.revenue)}</span>
                                <span className="text-gray-400 text-sm ml-2">of {formatCurrency(state.threshold)} ({state.percentage}%)</span>
                                {state.transactions && (
                                  <span className="text-gray-400 text-sm ml-2">• {state.transactions} transactions</span>
                                )}
                              </div>
                              <div className={`px-3 py-1 rounded-lg text-xs font-medium ${
                                state.status === 'critical' ? 'bg-red-500/20 text-red-400' :
                                state.status === 'warning' ? 'bg-orange-500/20 text-orange-400' :
                                state.status === 'monitoring' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-green-500/20 text-green-400'
                              }`}>
                                {state.status.toUpperCase()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardBody>
                    </Card>

                    {/* Professional Decisions History */}
                    <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
                      <CardBody className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                          <h4 className="text-white text-lg font-semibold tracking-tight">Professional Decisions History</h4>
                        </div>
                        <div className="space-y-4">
                          {selectedClient.decisions.map((decision, index) => (
                            <div key={index} className="border-l-4 border-l-blue-500 pl-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-white font-semibold">{decision.type}: {decision.outcome}</p>
                                  <p className="text-gray-400 text-sm mt-1">{decision.rationale}</p>
                                  <p className="text-gray-500 text-xs mt-1">Manager: {decision.manager}</p>
                                </div>
                                <span className="text-gray-500 text-xs">{formatDate(decision.date)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardBody>
                    </Card>

                    {/* Performance Metrics */}
                    <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
                      <CardBody className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                          <h4 className="text-white text-lg font-semibold tracking-tight">Performance Metrics</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400 font-medium">Response Time:</span>
                            <span className="text-white">{selectedClient.performance.responseTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400 font-medium">Satisfaction:</span>
                            <span className="text-white">{selectedClient.performance.satisfaction}/5.0</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400 font-medium">Compliance Rate:</span>
                            <span className="text-white">{selectedClient.performance.complianceRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400 font-medium">Penalty Prevention:</span>
                            <span className="text-white">{formatCurrency(selectedClient.performance.penaltyPrevention)}</span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <h4 className="text-white text-lg font-semibold mb-2">Select a Client</h4>
                      <p className="text-gray-400 text-sm">Choose a client to view detailed information</p>
                    </div>
                  </div>
                )}
              </ModalBody>

              <ModalFooter>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                      onPress={onClose}
                    >
                      Close
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                      startContent={<MessageSquare className="w-4 h-4" />}
                    >
                      Contact Client
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/25"
                      startContent={<FileText className="w-4 h-4" />}
                    >
                      View Details
                    </Button>
                    <Button
                      className="bg-white/5 text-gray-300 hover:bg-white/10 rounded-xl"
                      startContent={<Phone className="w-4 h-4" />}
                    >
                      Schedule Call
                    </Button>
                  </div>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
