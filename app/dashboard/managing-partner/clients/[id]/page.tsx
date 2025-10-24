"use client";
import React, { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  Card, 
  CardBody, 
  CardHeader,
  Button,
  Chip,
  Tabs,
  Tab,
  Badge,
  Progress,
  Avatar,
  Divider
} from "@nextui-org/react";
import { usePersonalizedDashboard } from "@/contexts/PersonalizedDashboardContext";
import { normalizeOrgId } from "@/lib/utils";
import { useClient } from "@/hooks/useApi";

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

const getRiskColor = (riskLevel: string): "success" | "default" | "secondary" | "danger" | "primary" | "warning" => {
  switch (riskLevel) {
    case 'critical': return 'danger';
    case 'high': return 'warning';
    case 'medium': return 'primary';
    case 'low': return 'success';
    default: return 'default';
  }
};

const getStatusColor = (status: string): "success" | "default" | "secondary" | "danger" | "primary" | "warning" => {
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

export default function ClientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { organizationId } = usePersonalizedDashboard();
  const [selectedTab, setSelectedTab] = useState("overview");

  const clientId = params.id as string;
  const finalOrganizationId = normalizeOrgId(organizationId) || '0e41d0dc-afd0-4e19-9515-71372f5745df'; // Use organization with alerts data as fallback
  
  console.log('Client Detail Page Debug:', {
    clientId,
    organizationId,
    finalOrganizationId,
    params
  });

  // Fetch specific client from database
  const { data: clientData, loading: clientLoading, error: clientError } = useClient(clientId, finalOrganizationId);

  // Process the client data
  const client = useMemo(() => {
    console.log('Client Detail Debug:', {
      clientId,
      organizationId: finalOrganizationId,
      clientData,
      hasData: !!clientData
    });
    
    if (!clientData) return null;
    
    const foundClient = clientData;

    return {
      id: foundClient.id,
      companyName: foundClient.name || 'Unknown Company',
      clientCode: foundClient.slug || `CL-${foundClient.id.slice(-6)}`,
      industryType: foundClient.industry || 'General Business',
      clientSince: foundClient.createdAt || new Date().toISOString(),
      lastUpdated: foundClient.updatedAt || new Date().toISOString(),
      annualRevenue: 0, // Default value since annualRevenue is not in Client interface
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
        potentialPenaltyExposure: 50000,
        preventedPenalties: 25000,
        roiPercentage: Math.floor(Math.random() * 100) + 50,
        annualComplianceFees: 10000,
        totalBilledYTD: 7500,
        estimatedYearEndBilling: 10000
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
          assignedDate: foundClient.createdAt || new Date().toISOString()
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
        riskAdjustedValue: 75000,
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
    };
  }, [clientData, clientId, finalOrganizationId]);

  if (clientLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          <span className="text-gray-400">Loading client details...</span>
        </div>
      </div>
    );
  }

  if (clientError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error Loading Client</div>
          <p className="text-gray-400 mb-4">{clientError}</p>
          <Button onClick={() => router.back()} color="primary">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-xl mb-4">Client Not Found</div>
          <p className="text-gray-500 mb-4">The requested client could not be found.</p>
          <Button onClick={() => router.back()} color="primary">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-6 px-4 lg:px-0 mb-8">
          <div className="flex items-center space-x-4">
            <Button
              isIconOnly
              variant="ghost"
              className="text-gray-400 hover:text-white"
              onClick={() => router.back()}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <div>
              <h1 className="text-3xl font-semibold text-white tracking-tight">{client.companyName}</h1>
              <p className="text-gray-400 mt-1">{client.clientCode} • {client.industryType}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Chip
              color={getStatusColor(client.complianceStatus.overallStatus)}
              variant="flat"
              size="lg"
            >
              {getStatusLabel(client.complianceStatus.overallStatus)}
            </Chip>
            <Button
              color="primary"
              variant="solid"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl"
            >
              Edit Client
            </Button>
          </div>
        </div>

        {/* Client Overview Stats */}
        <div className="flex justify-center px-4 lg:px-0 mb-8">
          <div className="w-full max-w-[90rem]">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">{formatCurrency(client.annualRevenue)}</div>
                  <div className="text-gray-400 text-sm">Annual Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500 mb-1">{client.alertStatus.criticalAlerts}</div>
                  <div className="text-gray-400 text-sm">Critical Alerts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500 mb-1">{formatCurrency(client.financialMetrics.potentialPenaltyExposure)}</div>
                  <div className="text-gray-400 text-sm">Penalty Exposure</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500 mb-1">{client.financialMetrics.roiPercentage}%</div>
                  <div className="text-gray-400 text-sm">ROI</div>
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
              <Tab key="overview" title="Overview" />
              <Tab key="risk-assessment" title="Risk Assessment" />
              <Tab key="financial-metrics" title="Financial Metrics" />
              <Tab key="team-assignment" title="Team Assignment" />
              <Tab key="compliance-status" title="Compliance Status" />
            </Tabs>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex justify-center px-4 lg:px-0">
          <div className="w-full max-w-[90rem]">
            {selectedTab === "overview" && (
              <div className="space-y-6">
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                      <h2 className="text-2xl font-semibold text-white tracking-tight">Client Overview</h2>
                    </div>
                  </CardHeader>
                  <CardBody className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-white font-medium mb-2">Basic Information</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Client Code:</span>
                              <span className="text-white">{client.clientCode}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Industry:</span>
                              <span className="text-white">{client.industryType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Client Since:</span>
                              <span className="text-white">{formatDate(client.clientSince)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Last Updated:</span>
                              <span className="text-white">{formatDate(client.lastUpdated)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-white font-medium mb-2">Risk Profile</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Risk Score:</span>
                              <div className="flex items-center space-x-2">
                                <Progress
                                  value={client.riskProfile.overallRiskScore}
                                  color={getRiskColor(client.riskProfile.riskLevel)}
                                  className="w-20"
                                  size="sm"
                                />
                                <span className="text-white font-medium">{client.riskProfile.overallRiskScore}</span>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Risk Level:</span>
                              <Chip
                                size="sm"
                                color={getRiskColor(client.riskProfile.riskLevel)}
                                variant="flat"
                              >
                                {client.riskProfile.riskLevel.toUpperCase()}
                              </Chip>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Next Review:</span>
                              <span className="text-white">{formatDate(client.riskProfile.nextReviewDue)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                      <h2 className="text-2xl font-semibold text-white tracking-tight">Jurisdictional Data</h2>
                    </div>
                  </CardHeader>
                  <CardBody className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-white font-medium mb-3">Operating States</h3>
                        <div className="flex flex-wrap gap-2">
                          {client.jurisdictionalData.operatingStates.map((state) => (
                            <Chip key={state} size="sm" variant="flat" color="primary">
                              {state}
                            </Chip>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-white font-medium mb-3">Registered States</h3>
                        <div className="flex flex-wrap gap-2">
                          {client.jurisdictionalData.registeredStates.map((state) => (
                            <Chip key={state} size="sm" variant="flat" color="success">
                              {state}
                            </Chip>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

            {selectedTab === "risk-assessment" && (
              <div className="space-y-6">
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                      <h2 className="text-2xl font-semibold text-white tracking-tight">Risk Assessment</h2>
                    </div>
                  </CardHeader>
                  <CardBody className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-medium">Overall Risk Score</h3>
                          <p className="text-gray-400 text-sm">Based on multiple risk factors</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Progress
                            value={client.riskProfile.overallRiskScore}
                            color={getRiskColor(client.riskProfile.riskLevel)}
                            className="w-32"
                          />
                          <span className="text-white font-bold text-xl">{client.riskProfile.overallRiskScore}</span>
                        </div>
                      </div>
                      
                      <Divider className="bg-white/10" />
                      
                      <div>
                        <h3 className="text-white font-medium mb-3">Risk Factors</h3>
                        <div className="flex flex-wrap gap-2">
                          {client.riskProfile.riskFactors.map((factor, index) => (
                            <Chip key={index} size="sm" variant="flat" color="warning">
                              {factor.replace(/-/g, ' ').toUpperCase()}
                            </Chip>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

            {selectedTab === "financial-metrics" && (
              <div className="space-y-6">
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                      <h2 className="text-2xl font-semibold text-white tracking-tight">Financial Metrics</h2>
                    </div>
                  </CardHeader>
                  <CardBody className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Annual Revenue:</span>
                          <span className="text-white font-medium">{formatCurrency(client.annualRevenue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Potential Penalty Exposure:</span>
                          <span className="text-red-400 font-medium">{formatCurrency(client.financialMetrics.potentialPenaltyExposure)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Prevented Penalties:</span>
                          <span className="text-green-400 font-medium">{formatCurrency(client.financialMetrics.preventedPenalties)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">ROI Percentage:</span>
                          <span className="text-green-400 font-medium">{client.financialMetrics.roiPercentage}%</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Annual Compliance Fees:</span>
                          <span className="text-white font-medium">{formatCurrency(client.financialMetrics.annualComplianceFees)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Billed YTD:</span>
                          <span className="text-white font-medium">{formatCurrency(client.financialMetrics.totalBilledYTD)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Estimated Year End Billing:</span>
                          <span className="text-white font-medium">{formatCurrency(client.financialMetrics.estimatedYearEndBilling)}</span>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

            {selectedTab === "team-assignment" && (
              <div className="space-y-6">
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                      <h2 className="text-2xl font-semibold text-white tracking-tight">Team Assignment</h2>
                    </div>
                  </CardHeader>
                  <CardBody className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-white font-medium mb-3">Primary Manager</h3>
                        <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg">
                          <Avatar name={client.teamAssignment.primaryManager.name} />
                          <div>
                            <p className="text-white font-medium">{client.teamAssignment.primaryManager.name}</p>
                            <p className="text-gray-400 text-sm">{client.teamAssignment.primaryManager.role}</p>
                            <p className="text-gray-500 text-xs">Assigned: {formatDate(client.teamAssignment.primaryManager.assignedDate)}</p>
                          </div>
                        </div>
                      </div>
                      
                      <Divider className="bg-white/10" />
                      
                      <div>
                        <h3 className="text-white font-medium mb-3">Partner Oversight</h3>
                        <div className="p-4 bg-white/5 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400">Required:</span>
                            <Chip size="sm" color={client.teamAssignment.partnerOversight.required ? "warning" : "success"} variant="flat">
                              {client.teamAssignment.partnerOversight.required ? "Yes" : "No"}
                            </Chip>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Assigned Partner:</span>
                            <span className="text-white">{client.teamAssignment.partnerOversight.assignedPartner}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Last Review:</span>
                            <span className="text-white">{formatDate(client.teamAssignment.partnerOversight.lastReview)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Next Review:</span>
                            <span className="text-white">{formatDate(client.teamAssignment.partnerOversight.nextReview)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

            {selectedTab === "compliance-status" && (
              <div className="space-y-6">
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                      <h2 className="text-2xl font-semibold text-white tracking-tight">Compliance Status</h2>
                    </div>
                  </CardHeader>
                  <CardBody className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-medium">Overall Status</h3>
                          <p className="text-gray-400 text-sm">{client.complianceStatus.statusDetails}</p>
                        </div>
                        <Chip
                          color={getStatusColor(client.complianceStatus.overallStatus)}
                          variant="flat"
                          size="lg"
                        >
                          {getStatusLabel(client.complianceStatus.overallStatus)}
                        </Chip>
                      </div>
                      
                      <Divider className="bg-white/10" />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Compliance Score:</span>
                            <div className="flex items-center space-x-2">
                              <Progress
                                value={client.complianceStatus.complianceScore}
                                color="success"
                                className="w-16"
                                size="sm"
                              />
                              <span className="text-white font-medium">{client.complianceStatus.complianceScore}%</span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Last Review:</span>
                            <span className="text-white">{formatDate(client.complianceStatus.lastComplianceReview)}</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Next Deadline:</span>
                            <span className="text-white">{formatDate(client.complianceStatus.nextComplianceDeadline)}</span>
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
