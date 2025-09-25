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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Badge,
  Progress,
  Tooltip,
  Avatar,
  Divider,
  Accordion,
  AccordionItem
} from "@nextui-org/react";
import { SearchIcon } from "@/components/icons/searchicon";

// Professional liability audit trail data structure
interface AuditTrailDecision {
  id: string;
  decisionDate: string;
  clientId: string;
  clientName: string;
  decisionType: "nexus-threshold-analysis" | "registration-strategy" | "compliance-assessment" | "penalty-mitigation" | "voluntary-disclosure";
  riskLevel: "critical" | "high" | "medium" | "low";
  financialExposure: number;
  professionalStandards: {
    sstsCompliance: boolean;
    peerReviewCompleted: boolean;
    clientCommunicationDocumented: boolean;
    implementationVerified: boolean;
  };
  decisionSummary: string;
  professionalReasoning: string;
  statutoryReferences: string[];
  peerReviewDetails: {
    reviewerName: string;
    reviewerLicense: string;
    reviewDate: string;
    approvalStatus: "approved" | "conditional" | "requires-modification";
    reviewComments: string;
  };
  clientCommunication: {
    communicationDate: string;
    communicationType: "written-advisory" | "phone-consultation" | "in-person-meeting";
    participants: string[];
    summary: string;
    clientResponse: string;
  };
  implementationTracking: {
    implementationDate: string;
    complianceStatus: "compliant" | "in-progress" | "non-compliant";
    verificationMethod: string;
    outcomeDocumentation: string;
  };
  digitalAuthentication: {
    cpaSignature: string;
    timestamp: string;
    hashValue: string;
    integrityVerified: boolean;
  };
  legalDefensibility: {
    courtReady: boolean;
    malpracticeDefense: boolean;
    regulatoryExamination: boolean;
    professionalLiability: boolean;
  };
  businessImpact: {
    clientRetention: boolean;
    revenueImpact: number;
    riskMitigation: number;
    professionalReputation: "enhanced" | "maintained" | "at-risk";
  };
}

// Sample audit trail data
const sampleDecisions: AuditTrailDecision[] = [
  {
    id: "AT-2024-001",
    decisionDate: "2024-09-25T14:30:00Z",
    clientId: "TC-001",
    clientName: "TechCorp Solutions LLC",
    decisionType: "nexus-threshold-analysis",
    riskLevel: "critical",
    financialExposure: 284000,
    professionalStandards: {
      sstsCompliance: true,
      peerReviewCompleted: true,
      clientCommunicationDocumented: true,
      implementationVerified: true
    },
    decisionSummary: "Determined California economic nexus threshold exceeded requiring immediate sales tax registration. Recommended voluntary disclosure program participation to minimize penalty exposure.",
    professionalReasoning: "Based on SSTS No. 1 analysis, client's $750,000 California sales and 1,250 transactions clearly exceed both the $500,000 sales threshold and 200 transaction threshold established under California Revenue and Taxation Code Section 6203. Client's SaaS business model creates taxable nexus under California's economic nexus provisions.",
    statutoryReferences: [
      "California Revenue and Taxation Code Section 6203",
      "SSTS No. 1 - Tax Return Positions",
      "AICPA Professional Standards Section 1.400.001"
    ],
    peerReviewDetails: {
      reviewerName: "Sarah Mitchell, CPA",
      reviewerLicense: "CA-12345",
      reviewDate: "2024-09-25T16:00:00Z",
      approvalStatus: "approved",
      reviewComments: "Thorough analysis with appropriate statutory references. Recommendation aligns with current California nexus guidance."
    },
    clientCommunication: {
      communicationDate: "2024-09-26T10:00:00Z",
      communicationType: "written-advisory",
      participants: ["Jane Doe, CPA", "Client CFO", "Client Controller"],
      summary: "Delivered written nexus analysis report with registration recommendations and penalty mitigation strategy.",
      clientResponse: "Client approved immediate California registration and voluntary disclosure program participation."
    },
    implementationTracking: {
      implementationDate: "2024-09-27T09:00:00Z",
      complianceStatus: "in-progress",
      verificationMethod: "California CDTFA online registration confirmation",
      outcomeDocumentation: "Registration application submitted with confirmation number CA-REG-2024-001234"
    },
    digitalAuthentication: {
      cpaSignature: "Jane Doe, CPA - CA-67890",
      timestamp: "2024-09-25T14:30:00Z",
      hashValue: "SHA-256: a1b2c3d4e5f6...",
      integrityVerified: true
    },
    legalDefensibility: {
      courtReady: true,
      malpracticeDefense: true,
      regulatoryExamination: true,
      professionalLiability: true
    },
    businessImpact: {
      clientRetention: true,
      revenueImpact: 45000,
      riskMitigation: 284000,
      professionalReputation: "enhanced"
    }
  },
  {
    id: "AT-2024-002",
    decisionDate: "2024-09-20T11:15:00Z",
    clientId: "RC-002",
    clientName: "RetailChain LLC",
    decisionType: "registration-strategy",
    riskLevel: "high",
    financialExposure: 125000,
    professionalStandards: {
      sstsCompliance: true,
      peerReviewCompleted: true,
      clientCommunicationDocumented: true,
      implementationVerified: true
    },
    decisionSummary: "Developed multi-state registration strategy for New York and Texas operations. Recommended phased approach to minimize compliance burden while meeting regulatory requirements.",
    professionalReasoning: "Client's e-commerce operations exceed New York's $500,000 sales threshold and approach Texas's $500,000 threshold. SSTS No. 7 requires consideration of all applicable state nexus standards. Phased registration approach balances compliance requirements with operational efficiency.",
    statutoryReferences: [
      "New York Tax Law Section 1101(b)(8)",
      "Texas Tax Code Section 151.107",
      "SSTS No. 7 - Form and Content of Advice to Clients"
    ],
    peerReviewDetails: {
      reviewerName: "Robert Kim, CPA",
      reviewerLicense: "TX-54321",
      reviewDate: "2024-09-20T15:30:00Z",
      approvalStatus: "approved",
      reviewComments: "Sound multi-state strategy with appropriate risk assessment. Phased approach is practical and defensible."
    },
    clientCommunication: {
      communicationDate: "2024-09-21T14:00:00Z",
      communicationType: "in-person-meeting",
      participants: ["Robert Kim, CPA", "Client CEO", "Client CFO"],
      summary: "Presented comprehensive multi-state registration strategy with timeline and cost analysis.",
      clientResponse: "Client approved strategy and authorized immediate New York registration with Texas registration planned for Q1 2025."
    },
    implementationTracking: {
      implementationDate: "2024-09-22T08:00:00Z",
      complianceStatus: "compliant",
      verificationMethod: "New York DTF registration confirmation",
      outcomeDocumentation: "New York registration completed with certificate number NY-REG-2024-567890"
    },
    digitalAuthentication: {
      cpaSignature: "Robert Kim, CPA - TX-54321",
      timestamp: "2024-09-20T11:15:00Z",
      hashValue: "SHA-256: f6e5d4c3b2a1...",
      integrityVerified: true
    },
    legalDefensibility: {
      courtReady: true,
      malpracticeDefense: true,
      regulatoryExamination: true,
      professionalLiability: true
    },
    businessImpact: {
      clientRetention: true,
      revenueImpact: 32000,
      riskMitigation: 125000,
      professionalReputation: "maintained"
    }
  }
];

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
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

const getDecisionTypeLabel = (type: string): string => {
  switch (type) {
    case 'nexus-threshold-analysis': return 'Nexus Threshold Analysis';
    case 'registration-strategy': return 'Registration Strategy';
    case 'compliance-assessment': return 'Compliance Assessment';
    case 'penalty-mitigation': return 'Penalty Mitigation';
    case 'voluntary-disclosure': return 'Voluntary Disclosure';
    default: return type;
  }
};

export default function TaxManagerAuditTrailPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [decisionTypeFilter, setDecisionTypeFilter] = useState("all");
  const [selectedDecision, setSelectedDecision] = useState<AuditTrailDecision | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Filtered decisions
  const filteredDecisions = useMemo(() => {
    return sampleDecisions.filter(decision => {
      const matchesSearch = decision.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           decision.decisionSummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           decision.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = riskFilter === "all" || decision.riskLevel === riskFilter;
      const matchesType = decisionTypeFilter === "all" || decision.decisionType === decisionTypeFilter;
      
      return matchesSearch && matchesRisk && matchesType;
    });
  }, [searchTerm, riskFilter, decisionTypeFilter]);

  // Audit trail summary
  const auditSummary = useMemo(() => {
    const totalDecisions = sampleDecisions.length;
    const courtReadyDecisions = sampleDecisions.filter(d => d.legalDefensibility.courtReady).length;
    const totalExposure = sampleDecisions.reduce((sum, d) => sum + d.financialExposure, 0);
    const totalRiskMitigation = sampleDecisions.reduce((sum, d) => sum + d.businessImpact.riskMitigation, 0);
    
    return {
      totalDecisions,
      courtReadyDecisions,
      totalExposure,
      totalRiskMitigation,
      courtReadyPercentage: Math.round((courtReadyDecisions / totalDecisions) * 100)
    };
  }, []);

  const handleDecisionClick = (decision: AuditTrailDecision) => {
    setSelectedDecision(decision);
    onOpen();
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-6">
        {/* Legal Protection Header */}
        <div className="flex items-center justify-between pt-6 px-4 lg:px-0 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">⚖️</span>
              </div>
              <h1 className="text-3xl font-semibold text-white tracking-tight">Professional Liability Audit Trail</h1>
            </div>
            <p className="text-gray-400">Court-ready decision documentation and legal evidence creation</p>
            <div className="flex items-center space-x-4 mt-3">
              <Chip color="success" variant="flat" size="sm">
                <span className="flex items-center space-x-1">
                  <span>✓</span>
                  <span>COURT-READY</span>
                </span>
              </Chip>
              <Chip color="primary" variant="flat" size="sm">
                <span className="flex items-center space-x-1">
                  <span>🔒</span>
                  <span>DIGITALLY AUTHENTICATED</span>
                </span>
              </Chip>
              <Chip color="warning" variant="flat" size="sm">
                <span className="flex items-center space-x-1">
                  <span>📋</span>
                  <span>AICPA COMPLIANT</span>
                </span>
              </Chip>
            </div>
          </div>
        </div>

        {/* Professional Standards Summary */}
        <div className="flex justify-center px-4 lg:px-0 mb-8">
          <div className="w-full max-w-[90rem]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Decisions</p>
                      <p className="text-2xl font-semibold text-white">{auditSummary.totalDecisions}</p>
                    </div>
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-blue-400 text-sm">📊</span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Court-Ready</p>
                      <p className="text-2xl font-semibold text-green-400">{auditSummary.courtReadyDecisions}</p>
                      <p className="text-xs text-gray-400">{auditSummary.courtReadyPercentage}% complete</p>
                    </div>
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-green-400 text-sm">⚖️</span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Exposure</p>
                      <p className="text-2xl font-semibold text-orange-400">{formatCurrency(auditSummary.totalExposure)}</p>
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
                      <p className="text-gray-400 text-sm">Risk Mitigated</p>
                      <p className="text-2xl font-semibold text-green-400">{formatCurrency(auditSummary.totalRiskMitigation)}</p>
                    </div>
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-green-400 text-sm">🛡️</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex justify-center px-4 lg:px-0 mb-6">
          <div className="w-full max-w-[90rem]">
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
              <CardBody className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <Input
                    placeholder="Search decisions, clients, or statutory references..."
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
                    value={decisionTypeFilter}
                    onChange={(e) => setDecisionTypeFilter(e.target.value)}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="all">All Decision Types</option>
                    <option value="nexus-threshold-analysis">Nexus Threshold Analysis</option>
                    <option value="registration-strategy">Registration Strategy</option>
                    <option value="compliance-assessment">Compliance Assessment</option>
                    <option value="penalty-mitigation">Penalty Mitigation</option>
                    <option value="voluntary-disclosure">Voluntary Disclosure</option>
                  </select>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Decision Timeline */}
        <div className="flex justify-center px-4 lg:px-0">
          <div className="w-full max-w-[90rem]">
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
              <CardHeader className="pb-0">
                <div className="flex items-center space-x-3">
                  <div className="w-1 h-8 bg-red-500 rounded-full"></div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">Professional Decision Timeline</h2>
                </div>
              </CardHeader>
              <CardBody className="p-6">
                <Table
                  aria-label="Audit trail decisions table"
                  classNames={{
                    wrapper: "bg-transparent shadow-none",
                    table: "bg-transparent",
                    thead: "bg-white/5",
                    tbody: "bg-transparent",
                    tr: "border-b border-white/10 hover:bg-white/5 cursor-pointer",
                    td: "text-white border-none",
                    th: "text-gray-300 border-none bg-transparent"
                  }}
                >
                  <TableHeader>
                    <TableColumn>DECISION</TableColumn>
                    <TableColumn>CLIENT</TableColumn>
                    <TableColumn>RISK LEVEL</TableColumn>
                    <TableColumn>EXPOSURE</TableColumn>
                    <TableColumn>PROFESSIONAL STANDARDS</TableColumn>
                    <TableColumn>LEGAL STATUS</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {filteredDecisions.map((decision) => (
                      <TableRow key={decision.id} onClick={() => handleDecisionClick(decision)}>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-white">{getDecisionTypeLabel(decision.decisionType)}</p>
                            <p className="text-sm text-gray-400">{decision.id}</p>
                            <p className="text-xs text-gray-500">{formatDateTime(decision.decisionDate)}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-white font-medium">{decision.clientName}</p>
                            <p className="text-sm text-gray-400">{decision.clientId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="sm"
                            color={getRiskColor(decision.riskLevel)}
                            variant="flat"
                          >
                            {decision.riskLevel.toUpperCase()}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-white font-medium">{formatCurrency(decision.financialExposure)}</p>
                            <p className="text-xs text-gray-400">Potential</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className={`w-2 h-2 rounded-full ${decision.professionalStandards.sstsCompliance ? 'bg-green-500' : 'bg-red-500'}`}></span>
                              <span className="text-xs text-gray-400">SSTS</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`w-2 h-2 rounded-full ${decision.professionalStandards.peerReviewCompleted ? 'bg-green-500' : 'bg-red-500'}`}></span>
                              <span className="text-xs text-gray-400">Peer Review</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`w-2 h-2 rounded-full ${decision.professionalStandards.clientCommunicationDocumented ? 'bg-green-500' : 'bg-red-500'}`}></span>
                              <span className="text-xs text-gray-400">Communication</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            <Chip
                              size="sm"
                              color={decision.legalDefensibility.courtReady ? "success" : "warning"}
                              variant="flat"
                            >
                              {decision.legalDefensibility.courtReady ? "COURT-READY" : "IN PROGRESS"}
                            </Chip>
                            <div className="flex items-center space-x-2">
                              <span className={`w-2 h-2 rounded-full ${decision.digitalAuthentication.integrityVerified ? 'bg-green-500' : 'bg-red-500'}`}></span>
                              <span className="text-xs text-gray-400">Authenticated</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Tooltip content="View Complete Record">
                              <Button
                                size="sm"
                                color="primary"
                                variant="flat"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDecisionClick(decision);
                                }}
                              >
                                View
                              </Button>
                            </Tooltip>
                            <Tooltip content="Export Legal Package">
                              <Button
                                size="sm"
                                color="success"
                                variant="flat"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Export
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
        </div>

        {/* Decision Detail Modal */}
        <Modal 
          isOpen={isOpen} 
          onClose={onClose}
          size="5xl"
          scrollBehavior="inside"
          classNames={{
            base: "bg-black/95 backdrop-blur-xl",
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
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">⚖️</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Complete Decision Record</h3>
                      <p className="text-sm text-gray-400">{selectedDecision?.id} • {selectedDecision?.clientName}</p>
                    </div>
                  </div>
                </ModalHeader>
                <ModalBody>
                  {selectedDecision && (
                    <div className="space-y-6">
                      {/* Legal Defensibility Header */}
                      <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-lg font-semibold text-white">Legal Defensibility Status</h4>
                            <p className="text-sm text-gray-400">Court-ready documentation verification</p>
                          </div>
                          <div className="flex space-x-2">
                            <Chip color="success" variant="flat">
                              <span className="flex items-center space-x-1">
                                <span>✓</span>
                                <span>COURT-READY</span>
                              </span>
                            </Chip>
                            <Chip color="primary" variant="flat">
                              <span className="flex items-center space-x-1">
                                <span>🔒</span>
                                <span>AUTHENTICATED</span>
                              </span>
                            </Chip>
                          </div>
                        </div>
                      </div>

                      {/* Decision Summary */}
                      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                        <CardHeader>
                          <h4 className="text-lg font-semibold text-white">Decision Summary</h4>
                        </CardHeader>
                        <CardBody>
                          <p className="text-gray-300">{selectedDecision.decisionSummary}</p>
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-gray-400">Decision Type</p>
                              <p className="text-white font-medium">{getDecisionTypeLabel(selectedDecision.decisionType)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Risk Level</p>
                              <Chip size="sm" color={getRiskColor(selectedDecision.riskLevel)} variant="flat">
                                {selectedDecision.riskLevel.toUpperCase()}
                              </Chip>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Financial Exposure</p>
                              <p className="text-white font-medium">{formatCurrency(selectedDecision.financialExposure)}</p>
                            </div>
                          </div>
                        </CardBody>
                      </Card>

                      {/* Professional Reasoning */}
                      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                        <CardHeader>
                          <h4 className="text-lg font-semibold text-white">Professional Reasoning</h4>
                        </CardHeader>
                        <CardBody>
                          <p className="text-gray-300 mb-4">{selectedDecision.professionalReasoning}</p>
                          <div>
                            <p className="text-sm text-gray-400 mb-2">Statutory References:</p>
                            <ul className="space-y-1">
                              {selectedDecision.statutoryReferences.map((ref, index) => (
                                <li key={index} className="text-sm text-blue-400">• {ref}</li>
                              ))}
                            </ul>
                          </div>
                        </CardBody>
                      </Card>

                      {/* Professional Standards Compliance */}
                      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                        <CardHeader>
                          <h4 className="text-lg font-semibold text-white">Professional Standards Compliance</h4>
                        </CardHeader>
                        <CardBody>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">SSTS Compliance</span>
                                <Chip size="sm" color={selectedDecision.professionalStandards.sstsCompliance ? "success" : "danger"} variant="flat">
                                  {selectedDecision.professionalStandards.sstsCompliance ? "COMPLIANT" : "NON-COMPLIANT"}
                                </Chip>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">Peer Review</span>
                                <Chip size="sm" color={selectedDecision.professionalStandards.peerReviewCompleted ? "success" : "danger"} variant="flat">
                                  {selectedDecision.professionalStandards.peerReviewCompleted ? "COMPLETED" : "PENDING"}
                                </Chip>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">Client Communication</span>
                                <Chip size="sm" color={selectedDecision.professionalStandards.clientCommunicationDocumented ? "success" : "danger"} variant="flat">
                                  {selectedDecision.professionalStandards.clientCommunicationDocumented ? "DOCUMENTED" : "MISSING"}
                                </Chip>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">Implementation</span>
                                <Chip size="sm" color={selectedDecision.professionalStandards.implementationVerified ? "success" : "danger"} variant="flat">
                                  {selectedDecision.professionalStandards.implementationVerified ? "VERIFIED" : "PENDING"}
                                </Chip>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>

                      {/* Peer Review Details */}
                      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                        <CardHeader>
                          <h4 className="text-lg font-semibold text-white">Peer Review Details</h4>
                        </CardHeader>
                        <CardBody>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-400">Reviewer</p>
                              <p className="text-white font-medium">{selectedDecision.peerReviewDetails.reviewerName}</p>
                              <p className="text-xs text-gray-500">License: {selectedDecision.peerReviewDetails.reviewerLicense}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Review Date</p>
                              <p className="text-white font-medium">{formatDateTime(selectedDecision.peerReviewDetails.reviewDate)}</p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <p className="text-sm text-gray-400">Approval Status</p>
                            <Chip 
                              size="sm" 
                              color={selectedDecision.peerReviewDetails.approvalStatus === "approved" ? "success" : "warning"} 
                              variant="flat"
                            >
                              {selectedDecision.peerReviewDetails.approvalStatus.toUpperCase()}
                            </Chip>
                          </div>
                          <div className="mt-4">
                            <p className="text-sm text-gray-400">Review Comments</p>
                            <p className="text-gray-300">{selectedDecision.peerReviewDetails.reviewComments}</p>
                          </div>
                        </CardBody>
                      </Card>

                      {/* Digital Authentication */}
                      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                        <CardHeader>
                          <h4 className="text-lg font-semibold text-white">Digital Authentication</h4>
                        </CardHeader>
                        <CardBody>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-400">CPA Signature</p>
                              <p className="text-white font-medium">{selectedDecision.digitalAuthentication.cpaSignature}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Timestamp</p>
                              <p className="text-white font-medium">{formatDateTime(selectedDecision.digitalAuthentication.timestamp)}</p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <p className="text-sm text-gray-400">Integrity Hash</p>
                            <p className="text-xs text-gray-500 font-mono bg-white/5 p-2 rounded">{selectedDecision.digitalAuthentication.hashValue}</p>
                          </div>
                          <div className="mt-4 flex items-center space-x-2">
                            <span className={`w-2 h-2 rounded-full ${selectedDecision.digitalAuthentication.integrityVerified ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span className="text-sm text-gray-400">
                              {selectedDecision.digitalAuthentication.integrityVerified ? "Integrity Verified" : "Integrity Check Failed"}
                            </span>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Export Legal Package
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
