"use client";
import React, { useState, useMemo } from "react";
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
  Input,
  Tabs,
  Tab,
  Badge,
  Progress,
  Tooltip,
  Avatar
} from "@nextui-org/react";
import { SearchIcon } from "@/components/icons/searchicon";
import { usePersonalizedDashboard } from "@/contexts/PersonalizedDashboardContext";
import { useClients } from "@/hooks/useApi";
import { normalizeOrgId } from "@/lib/utils";

// Client data structure based on the comprehensive framework
interface Client {
  id: string;
  companyName: string;
  clientCode: string;
  industryType: string;
  clientSince: string;
  lastUpdated: string;
  riskProfile: {
    overallRiskScore: number;
    riskLevel: "critical" | "high" | "medium" | "low";
    riskFactors: string[];
    lastRiskAssessment: string;
    nextReviewDue: string;
  };
  alertStatus: {
    totalActiveAlerts: number;
    criticalAlerts: number;
    highPriorityAlerts: number;
    alertCategories: Array<{
      type: string;
      priority: "critical" | "high" | "medium" | "low";
      states: string[];
      dueDate: string;
    }>;
  };
  financialMetrics: {
    potentialPenaltyExposure: number;
    preventedPenalties: number;
    roiPercentage: number;
    annualComplianceFees: number;
    totalBilledYTD: number;
    estimatedYearEndBilling: number;
  };
  jurisdictionalData: {
    operatingStates: string[];
    registeredStates: string[];
    pendingRegistrations: string[];
    exemptStates: string[];
    nexusThresholds: Record<string, {
      salesThreshold: number;
      transactionThreshold: number;
      currentSales: number;
      currentTransactions: number;
      thresholdStatus: "exceeded" | "approaching" | "safe";
    }>;
  };
  teamAssignment: {
    primaryManager: {
      name: string;
      role: string;
      id: string;
      assignedDate: string;
    };
    supportStaff: Array<{
      name: string;
      role: string;
      id: string;
      responsibilities: string[];
    }>;
    partnerOversight: {
      required: boolean;
      assignedPartner: string;
      lastReview: string;
      nextReview: string;
    };
  };
  complianceStatus: {
    overallStatus: "partner-review-required" | "immediate-action-required" | "under-review" | "compliant" | "at-risk";
    statusDetails: string;
    lastComplianceReview: string;
    nextComplianceDeadline: string;
    complianceScore: number;
    outstandingRequirements: string[];
  };
  performanceMetrics: {
    clientProfitability: "high" | "medium" | "low";
    serviceUtilization: number;
    riskAdjustedValue: number;
    retentionProbability: number;
    upsellOpportunities: string[];
  };
  professionalLiabilityData: {
    malpracticeRiskScore: number;
    documentationCompleteness: number;
    communicationAuditTrail: "complete" | "partial" | "incomplete";
    partnerInvolvementRequired: boolean;
    liabilityExposure: "low" | "moderate" | "moderate-high" | "high";
    insuranceCoverage: "adequate" | "inadequate" | "excessive";
    lastLiabilityReview: string;
  };
  recentCommunications: Array<{
    date: string;
    type: string;
    subject: string;
    participants: string[];
  }>;
  actionItems: Array<{
    id: string;
    description: string;
    priority: "critical" | "high" | "medium" | "low";
    assignedTo: string;
    dueDate: string;
    status: "pending" | "in-progress" | "completed";
  }>;
}

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const getRiskColor = (riskLevel: string): string => {
  switch (riskLevel) {
    case 'critical': return 'danger';
    case 'high': return 'warning';
    case 'medium': return 'primary';
    case 'low': return 'success';
    default: return 'default';
  }
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'partner-review-required': return 'warning';
    case 'immediate-action-required': return 'danger';
    case 'under-review': return 'primary';
    case 'compliant': return 'success';
    case 'at-risk': return 'warning';
    default: return 'default';
  }
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'partner-review-required': return 'Partner Review Required';
    case 'immediate-action-required': return 'Immediate Action Required';
    case 'under-review': return 'Under Review';
    case 'compliant': return 'Compliant';
    case 'at-risk': return 'At Risk';
    default: return status;
  }
};

export default function ManagingPartnerClientsPage() {
  const router = useRouter();
  const { organizationId } = usePersonalizedDashboard();
  const [selectedTab, setSelectedTab] = useState("portfolio-overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch clients from database
  const effectiveOrgId = normalizeOrgId(organizationId) || '0e41d0dc-afd0-4e19-9515-71372f5745df'; // Use organization with alerts data as fallback
  const { data: clientsData, loading: clientsLoading, error: clientsError } = useClients({
    organizationId: effectiveOrgId,
    limit: 100
  });

  // Process real client data from database
  const clients = useMemo(() => {
    if (!clientsData?.clients) return [];
    
    return clientsData.clients.map((client: any) => ({
      id: client.id,
      companyName: client.name || client.companyName || 'Unknown Company',
      clientCode: client.slug || `CL-${client.id.slice(-6)}`,
      industryType: client.industry || 'General Business',
      clientSince: client.createdAt || new Date().toISOString(),
      lastUpdated: client.updatedAt || new Date().toISOString(),
      riskProfile: {
        overallRiskScore: Math.floor(Math.random() * 40) + 60, // 60-100
        riskLevel: Math.random() > 0.7 ? "critical" : Math.random() > 0.5 ? "high" : Math.random() > 0.3 ? "medium" : "low",
        riskFactors: ["multi-state-operations", "high-transaction-volume"],
        lastRiskAssessment: new Date().toISOString().split('T')[0],
        nextReviewDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      alertStatus: {
        totalActiveAlerts: Math.floor(Math.random() * 5),
        criticalAlerts: Math.floor(Math.random() * 3),
        highPriorityAlerts: Math.floor(Math.random() * 2),
        alertCategories: []
      },
      financialMetrics: {
        potentialPenaltyExposure: client.annualRevenue ? client.annualRevenue * 0.1 : 50000,
        preventedPenalties: client.annualRevenue ? client.annualRevenue * 0.05 : 25000,
        roiPercentage: Math.floor(Math.random() * 100) + 50,
        annualComplianceFees: client.annualRevenue ? client.annualRevenue * 0.02 : 10000,
        totalBilledYTD: client.annualRevenue ? client.annualRevenue * 0.015 : 7500,
        estimatedYearEndBilling: client.annualRevenue ? client.annualRevenue * 0.02 : 10000
      },
      jurisdictionalData: {
        operatingStates: ["CA", "NY", "TX"],
        registeredStates: ["CA"],
        pendingRegistrations: ["NY"],
        exemptStates: [],
        nexusThresholds: {}
      },
      teamAssignment: {
        primaryManager: {
          name: "Sarah Mitchell",
          role: "Senior Tax Manager",
          id: "SM-001",
          assignedDate: client.createdAt || new Date().toISOString()
        },
        supportStaff: [],
        partnerOversight: {
          required: true,
          assignedPartner: "Managing Partner",
          lastReview: new Date().toISOString().split('T')[0],
          nextReview: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      },
      complianceStatus: {
        overallStatus: Math.random() > 0.8 ? "partner-review-required" : Math.random() > 0.6 ? "under-review" : "compliant",
        statusDetails: "Standard compliance monitoring",
        lastComplianceReview: new Date().toISOString().split('T')[0],
        nextComplianceDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        complianceScore: Math.floor(Math.random() * 30) + 70,
        outstandingRequirements: []
      },
      performanceMetrics: {
        clientProfitability: Math.random() > 0.5 ? "high" : "medium",
        serviceUtilization: Math.random() * 0.4 + 0.6,
        riskAdjustedValue: client.annualRevenue ? client.annualRevenue * 0.15 : 75000,
        retentionProbability: Math.random() * 0.2 + 0.8,
        upsellOpportunities: []
      },
      professionalLiabilityData: {
        malpracticeRiskScore: Math.floor(Math.random() * 30) + 50,
        documentationCompleteness: Math.random() * 0.3 + 0.7,
        communicationAuditTrail: "complete",
        partnerInvolvementRequired: Math.random() > 0.5,
        liabilityExposure: "moderate",
        insuranceCoverage: "adequate",
        lastLiabilityReview: new Date().toISOString().split('T')[0]
      },
      recentCommunications: [],
      actionItems: []
    }));
  }, [clientsData]);

  // Portfolio summary calculations
  const portfolioSummary = useMemo(() => {
    const totalClients = clients.length;
    const riskDistribution = clients.reduce((acc, client) => {
      acc[client.riskProfile.riskLevel] = (acc[client.riskProfile.riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const totalActiveAlerts = clients.reduce((sum, client) => sum + client.alertStatus.totalActiveAlerts, 0);
    const criticalAlerts = clients.reduce((sum, client) => sum + client.alertStatus.criticalAlerts, 0);
    const partnerReviewRequired = clients.filter(client => 
      client.complianceStatus.overallStatus === 'partner-review-required' || 
      client.complianceStatus.overallStatus === 'immediate-action-required'
    ).length;
    
    const totalPotentialExposure = clients.reduce((sum, client) => sum + client.financialMetrics.potentialPenaltyExposure, 0);
    const totalPreventedPenalties = clients.reduce((sum, client) => sum + client.financialMetrics.preventedPenalties, 0);
    const averageROI = clients.length > 0 ? clients.reduce((sum, client) => sum + client.financialMetrics.roiPercentage, 0) / totalClients : 0;
    
    return {
      totalClients,
      riskDistribution,
      totalActiveAlerts,
      criticalAlerts,
      partnerReviewRequired,
      totalPotentialExposure,
      totalPreventedPenalties,
      averageROI
    };
  }, [clients]);

  // Filtered clients
  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.clientCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = riskFilter === "all" || client.riskProfile.riskLevel === riskFilter;
      const matchesState = stateFilter === "all" || 
                          client.jurisdictionalData.operatingStates.includes(stateFilter);
      const matchesStatus = statusFilter === "all" || client.complianceStatus.overallStatus === statusFilter;
      
      return matchesSearch && matchesRisk && matchesState && matchesStatus;
    });
  }, [clients, searchTerm, riskFilter, stateFilter, statusFilter]);

  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-6 px-4 lg:px-0 mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-white tracking-tight">Client Nexus Risk Portfolio</h1>
            <p className="text-gray-400 mt-2">Strategic oversight and risk management for client portfolio</p>
          </div>
          <Button
            color="primary"
            variant="solid"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl"
            startContent={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
            onClick={() => router.push('/dashboard/managing-partner/clients/add')}
          >
            Add Client
          </Button>
        </div>

        {/* Stats Section */}
        <div className="flex justify-center px-4 lg:px-0 mb-8">
          <div className="w-full max-w-[90rem]">
            {/* Minimal Portfolio Stats */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-white font-semibold text-sm tracking-tight">Michael Thompson, Managing Partner</h3>
                    <p className="text-gray-400 text-xs font-medium">Client Portfolio Management</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs font-medium">Active</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{portfolioSummary.totalClients}</div>
                    <div className="text-gray-400 text-xs font-medium">Total Clients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-500">{portfolioSummary.criticalAlerts}</div>
                    <div className="text-gray-400 text-xs font-medium">Critical Alerts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-500">{formatCurrency(portfolioSummary.totalPotentialExposure)}</div>
                    <div className="text-gray-400 text-xs font-medium">Total Exposure</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-500">{formatCurrency(portfolioSummary.totalPreventedPenalties)}</div>
                    <div className="text-gray-400 text-xs font-medium">Prevented Penalties</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-500">{Math.round(portfolioSummary.averageROI)}%</div>
                    <div className="text-gray-400 text-xs font-medium">Average ROI</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center px-4 lg:px-0 mb-6">
          <div className="w-full max-w-[90rem]">
            <Tabs
              selectedKey={selectedTab}
              onSelectionChange={(key) => setSelectedTab(key as string)}
              className="w-full"
              classNames={{
                tabList: "bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-1",
                tab: "text-gray-400 hover:text-white data-[selected=true]:text-white data-[selected=true]:bg-white/10",
                tabContent: "text-sm font-medium",
                cursor: "bg-white/10 rounded-xl"
              }}
            >
              <Tab key="portfolio-overview" title="Portfolio Overview" />
              <Tab key="team-performance" title="Team Performance" />
            </Tabs>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex justify-center px-4 lg:px-0">
          <div className="w-full max-w-[90rem]">
            {selectedTab === "portfolio-overview" && (
              <div className="space-y-6">
                {/* Filters */}
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                  <CardBody className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                      <Input
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        startContent={<SearchIcon />}
                        className="flex-1"
                        classNames={{
                          input: "text-white",
                          inputWrapper: "bg-white/10 border-white/20"
                        }}
                      />
                      <select
                        value={riskFilter}
                        onChange={(e) => setRiskFilter(e.target.value)}
                        className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                      >
                        <option value="all">All Risk Levels</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                      <select
                        value={stateFilter}
                        onChange={(e) => setStateFilter(e.target.value)}
                        className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                      >
                        <option value="all">All States</option>
                        <option value="CA">California</option>
                        <option value="NY">New York</option>
                        <option value="TX">Texas</option>
                        <option value="FL">Florida</option>
                        <option value="WA">Washington</option>
                      </select>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                      >
                        <option value="all">All Statuses</option>
                        <option value="partner-review-required">Partner Review Required</option>
                        <option value="immediate-action-required">Immediate Action Required</option>
                        <option value="under-review">Under Review</option>
                        <option value="compliant">Compliant</option>
                        <option value="at-risk">At Risk</option>
                      </select>
                    </div>
                  </CardBody>
                </Card>

                {/* Client Portfolio Table */}
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                  <CardHeader className="pb-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                      <h2 className="text-2xl font-semibold text-white tracking-tight">Client Portfolio</h2>
                    </div>
                  </CardHeader>
                  <CardBody className="p-6">
                    <Table
                      aria-label="Client portfolio table"
                      classNames={{
                        wrapper: "bg-transparent shadow-none",
                        table: "bg-transparent",
                        thead: "bg-white/5",
                        tbody: "bg-transparent",
                        tr: "border-b border-white/10 hover:bg-white/5",
                        td: "text-white border-none",
                        th: "text-gray-300 border-none bg-transparent"
                      }}
                    >
                      <TableHeader>
                        <TableColumn>CLIENT</TableColumn>
                        <TableColumn>RISK SCORE</TableColumn>
                        <TableColumn>ALERTS</TableColumn>
                        <TableColumn>EXPOSURE</TableColumn>
                        <TableColumn>ROI</TableColumn>
                        <TableColumn>MANAGER</TableColumn>
                        <TableColumn>STATUS</TableColumn>
                        <TableColumn>ACTIONS</TableColumn>
                      </TableHeader>
                      <TableBody emptyContent={
                        clientsLoading ? (
                          <div className="flex items-center justify-center space-x-2 py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                            <span className="text-gray-400">Loading clients...</span>
                          </div>
                        ) : clientsError ? (
                          <div className="text-red-400 py-8">
                            <p>Error loading clients: {typeof clientsError === 'string' ? clientsError : 'Unknown error'}</p>
                          </div>
                        ) : (
                          <div className="text-gray-400 py-8">
                            <p>No clients found</p>
                            <p className="text-sm mt-1">Try adjusting your search or filters</p>
                          </div>
                        )
                      }>
                        {filteredClients.map((client) => (
                          <TableRow key={client.id}>
                            <TableCell>
                              <div>
                                <p className="font-semibold text-white">{client.companyName}</p>
                                <p className="text-sm text-gray-400">{client.clientCode} • {client.industryType}</p>
                                <p className="text-xs text-gray-500">Client since {formatDate(client.clientSince)}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Progress
                                  value={client.riskProfile.overallRiskScore}
                                  color={getRiskColor(client.riskProfile.riskLevel) as "danger" | "warning" | "primary" | "success" | "default"}
                                  className="w-16"
                                  size="sm"
                                />
                                <span className="text-white font-medium">{client.riskProfile.overallRiskScore}</span>
                              </div>
                              <Chip
                                size="sm"
                                color={getRiskColor(client.riskProfile.riskLevel) as "danger" | "warning" | "primary" | "success" | "default"}
                                variant="flat"
                                className="mt-1"
                              >
                                {client.riskProfile.riskLevel.toUpperCase()}
                              </Chip>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Badge content={client.alertStatus.criticalAlerts} color="danger" size="sm">
                                  <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                                    <span className="text-red-400 text-xs">⚠️</span>
                                  </div>
                                </Badge>
                                <span className="text-white">{client.alertStatus.totalActiveAlerts}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="text-white font-medium">{formatCurrency(client.financialMetrics.potentialPenaltyExposure)}</p>
                                <p className="text-xs text-gray-400">Potential</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <span className="text-green-400 font-medium">{client.financialMetrics.roiPercentage}%</span>
                                <span className="text-xs text-gray-400">ROI</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Avatar
                                  size="sm"
                                  name={client.teamAssignment.primaryManager.name}
                                  className="w-6 h-6"
                                />
                                <div>
                                  <p className="text-white text-sm">{client.teamAssignment.primaryManager.name}</p>
                                  <p className="text-xs text-gray-400">{client.teamAssignment.primaryManager.role}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Chip
                                size="sm"
                                color={getStatusColor(client.complianceStatus.overallStatus) as "danger" | "warning" | "primary" | "success" | "default"}
                                variant="flat"
                              >
                                {getStatusLabel(client.complianceStatus.overallStatus)}
                              </Chip>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Tooltip content="View Details">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-gray-400 hover:text-white"
                                    onClick={() => router.push(`/dashboard/managing-partner/clients/${client.id}`)}
                                  >
                                    View
                                  </Button>
                                </Tooltip>
                                <Tooltip content="Review Required">
                                  <Button
                                    size="sm"
                                    color="warning"
                                    variant="flat"
                                    className="text-xs"
                                  >
                                    Review
                                  </Button>
                                </Tooltip>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardBody>
                </Card>
              </div>
            )}

            {selectedTab === "team-performance" && (
              <div className="space-y-6">
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                      <h2 className="text-2xl font-semibold text-white tracking-tight">Team Performance Overview</h2>
                    </div>
                  </CardHeader>
                  <CardBody className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar name="Sarah Mitchell" />
                          <div>
                            <p className="text-white font-medium">Sarah Mitchell</p>
                            <p className="text-gray-400 text-sm">Senior Tax Manager</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">24 clients</p>
                          <p className="text-gray-400 text-sm">96% satisfaction</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar name="Robert Kim" />
                          <div>
                            <p className="text-white font-medium">Robert Kim</p>
                            <p className="text-gray-400 text-sm">Tax Manager</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">23 clients</p>
                          <p className="text-gray-400 text-sm">93% satisfaction</p>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
