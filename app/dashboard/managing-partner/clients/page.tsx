"use client";
import React, { useState, useMemo } from "react";
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
import { SearchIcon } from "@/components/icons";

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
  const [selectedTab, setSelectedTab] = useState("portfolio-overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Sample data - will be replaced with comprehensive data
  const sampleClients: Client[] = [
    {
      id: "TC-001",
      companyName: "TechCorp Solutions LLC",
      clientCode: "TC-2024-001",
      industryType: "Technology/SaaS",
      clientSince: "2023-03-15",
      lastUpdated: "2025-09-25T10:30:00Z",
      riskProfile: {
        overallRiskScore: 92,
        riskLevel: "critical",
        riskFactors: ["multi-state-operations", "high-transaction-volume", "recent-expansion", "complex-product-mix"],
        lastRiskAssessment: "2025-09-20",
        nextReviewDue: "2025-10-15"
      },
      alertStatus: {
        totalActiveAlerts: 5,
        criticalAlerts: 3,
        highPriorityAlerts: 2,
        alertCategories: [
          {
            type: "nexus-threshold-exceeded",
            priority: "critical",
            states: ["CA", "NY"],
            dueDate: "2025-09-28"
          }
        ]
      },
      financialMetrics: {
        potentialPenaltyExposure: 284000,
        preventedPenalties: 156000,
        roiPercentage: 156,
        annualComplianceFees: 45000,
        totalBilledYTD: 32500,
        estimatedYearEndBilling: 45000
      },
      jurisdictionalData: {
        operatingStates: ["CA", "NY", "TX", "FL", "WA"],
        registeredStates: ["CA", "NY", "TX"],
        pendingRegistrations: ["FL"],
        exemptStates: ["WA"],
        nexusThresholds: {
          "CA": {
            salesThreshold: 500000,
            transactionThreshold: 200,
            currentSales: 750000,
            currentTransactions: 1250,
            thresholdStatus: "exceeded"
          }
        }
      },
      teamAssignment: {
        primaryManager: {
          name: "Sarah Mitchell",
          role: "Senior Tax Manager",
          id: "SM-001",
          assignedDate: "2023-03-15"
        },
        supportStaff: [],
        partnerOversight: {
          required: true,
          assignedPartner: "Managing Partner",
          lastReview: "2025-09-15",
          nextReview: "2025-10-01"
        }
      },
      complianceStatus: {
        overallStatus: "partner-review-required",
        statusDetails: "Multiple nexus thresholds exceeded requiring registration decisions",
        lastComplianceReview: "2025-09-20",
        nextComplianceDeadline: "2025-09-30",
        complianceScore: 65,
        outstandingRequirements: ["CA sales tax registration", "NY nexus analysis update"]
      },
      performanceMetrics: {
        clientProfitability: "high",
        serviceUtilization: 0.85,
        riskAdjustedValue: 142000,
        retentionProbability: 0.92,
        upsellOpportunities: ["voluntary-disclosure-services"]
      },
      professionalLiabilityData: {
        malpracticeRiskScore: 78,
        documentationCompleteness: 0.94,
        communicationAuditTrail: "complete",
        partnerInvolvementRequired: true,
        liabilityExposure: "moderate-high",
        insuranceCoverage: "adequate",
        lastLiabilityReview: "2025-09-10"
      },
      recentCommunications: [
        {
          date: "2025-09-23",
          type: "partner-consultation",
          subject: "CA nexus threshold exceeded - registration strategy",
          participants: ["Managing Partner", "Sarah Mitchell", "Client CFO"]
        }
      ],
      actionItems: [
        {
          id: "AI-001",
          description: "Partner approval required for CA registration strategy",
          priority: "critical",
          assignedTo: "Managing Partner",
          dueDate: "2025-09-28",
          status: "pending"
        }
      ]
    }
  ];

  // Portfolio summary calculations
  const portfolioSummary = useMemo(() => {
    const totalClients = sampleClients.length;
    const riskDistribution = sampleClients.reduce((acc, client) => {
      acc[client.riskProfile.riskLevel] = (acc[client.riskProfile.riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const totalActiveAlerts = sampleClients.reduce((sum, client) => sum + client.alertStatus.totalActiveAlerts, 0);
    const criticalAlerts = sampleClients.reduce((sum, client) => sum + client.alertStatus.criticalAlerts, 0);
    const partnerReviewRequired = sampleClients.filter(client => 
      client.complianceStatus.overallStatus === 'partner-review-required' || 
      client.complianceStatus.overallStatus === 'immediate-action-required'
    ).length;
    
    const totalPotentialExposure = sampleClients.reduce((sum, client) => sum + client.financialMetrics.potentialPenaltyExposure, 0);
    const totalPreventedPenalties = sampleClients.reduce((sum, client) => sum + client.financialMetrics.preventedPenalties, 0);
    const averageROI = sampleClients.reduce((sum, client) => sum + client.financialMetrics.roiPercentage, 0) / totalClients;
    
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
  }, []);

  // Filtered clients
  const filteredClients = useMemo(() => {
    return sampleClients.filter(client => {
      const matchesSearch = client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.clientCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = riskFilter === "all" || client.riskProfile.riskLevel === riskFilter;
      const matchesState = stateFilter === "all" || 
                          client.jurisdictionalData.operatingStates.includes(stateFilter);
      const matchesStatus = statusFilter === "all" || client.complianceStatus.overallStatus === statusFilter;
      
      return matchesSearch && matchesRisk && matchesState && matchesStatus;
    });
  }, [searchTerm, riskFilter, stateFilter, statusFilter]);

  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-6 px-4 lg:px-0 mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-white tracking-tight">Client Nexus Risk Portfolio</h1>
            <p className="text-gray-400 mt-2">Strategic oversight and risk management for client portfolio</p>
          </div>
        </div>

        {/* Executive Summary Section */}
        <div className="flex justify-center px-4 lg:px-0 mb-8">
          <div className="w-full max-w-[90rem]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Clients</p>
                      <p className="text-2xl font-semibold text-white">{portfolioSummary.totalClients}</p>
                    </div>
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-blue-400 text-sm">👥</span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Critical Alerts</p>
                      <p className="text-2xl font-semibold text-red-400">{portfolioSummary.criticalAlerts}</p>
                    </div>
                    <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-red-400 text-sm">⚠️</span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Exposure</p>
                      <p className="text-2xl font-semibold text-orange-400">{formatCurrency(portfolioSummary.totalPotentialExposure)}</p>
                    </div>
                    <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-orange-400 text-sm">💰</span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Prevented Penalties</p>
                      <p className="text-2xl font-semibold text-green-400">{formatCurrency(portfolioSummary.totalPreventedPenalties)}</p>
                    </div>
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-green-400 text-sm">🛡️</span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Average ROI</p>
                      <p className="text-2xl font-semibold text-purple-400">{Math.round(portfolioSummary.averageROI)}%</p>
                    </div>
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-purple-400 text-sm">📈</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
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
              <Tab key="risk-analysis" title="Risk Analysis" />
              <Tab key="revenue-impact" title="Revenue Impact" />
              <Tab key="team-performance" title="Team Performance" />
              <Tab key="compliance-dashboard" title="Compliance Dashboard" />
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
                      <TableBody>
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
                                  color={getRiskColor(client.riskProfile.riskLevel)}
                                  className="w-16"
                                  size="sm"
                                />
                                <span className="text-white font-medium">{client.riskProfile.overallRiskScore}</span>
                              </div>
                              <Chip
                                size="sm"
                                color={getRiskColor(client.riskProfile.riskLevel)}
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
                                color={getStatusColor(client.complianceStatus.overallStatus)}
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

            {selectedTab === "risk-analysis" && (
              <div className="space-y-6">
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-1 h-8 bg-orange-500 rounded-full"></div>
                      <h2 className="text-2xl font-semibold text-white tracking-tight">Portfolio Risk Analysis</h2>
                    </div>
                  </CardHeader>
                  <CardBody className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Risk Distribution</h3>
                        <div className="space-y-3">
                          {Object.entries(portfolioSummary.riskDistribution).map(([level, count]) => (
                            <div key={level} className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${
                                  level === 'critical' ? 'bg-red-500' :
                                  level === 'high' ? 'bg-orange-500' :
                                  level === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                }`}></div>
                                <span className="text-white capitalize">{level}</span>
                              </div>
                              <span className="text-white font-medium">{count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Risk Trends</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Escalations This Quarter</span>
                            <span className="text-red-400 font-medium">5 clients</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Risk Mitigations</span>
                            <span className="text-green-400 font-medium">8 clients</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">New High-Risk Clients</span>
                            <span className="text-orange-400 font-medium">3 clients</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

            {selectedTab === "revenue-impact" && (
              <div className="space-y-6">
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-1 h-8 bg-green-500 rounded-full"></div>
                      <h2 className="text-2xl font-semibold text-white tracking-tight">Revenue Impact Analysis</h2>
                    </div>
                  </CardHeader>
                  <CardBody className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-green-400">{formatCurrency(portfolioSummary.totalPreventedPenalties)}</p>
                        <p className="text-gray-400">Total Value Created</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-blue-400">{Math.round(portfolioSummary.averageROI)}%</p>
                        <p className="text-gray-400">Average ROI</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-purple-400">{portfolioSummary.totalClients}</p>
                        <p className="text-gray-400">Active Clients</p>
                      </div>
                    </div>
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

            {selectedTab === "compliance-dashboard" && (
              <div className="space-y-6">
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
                      <h2 className="text-2xl font-semibold text-white tracking-tight">Compliance Dashboard</h2>
                    </div>
                  </CardHeader>
                  <CardBody className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Compliance Status</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Fully Compliant</span>
                            <span className="text-green-400 font-medium">42 clients</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Requires Attention</span>
                            <span className="text-orange-400 font-medium">5 clients</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Average Score</span>
                            <span className="text-blue-400 font-medium">87%</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Upcoming Deadlines</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">This Week</span>
                            <span className="text-red-400 font-medium">3 deadlines</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Next Week</span>
                            <span className="text-orange-400 font-medium">5 deadlines</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">This Month</span>
                            <span className="text-yellow-400 font-medium">12 deadlines</span>
                          </div>
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
