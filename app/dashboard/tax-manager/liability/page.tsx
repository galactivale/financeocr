"use client";
import React, { useState } from "react";
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
  Textarea,
  Tabs,
  Tab,
  Progress
} from "@nextui-org/react";

// Data structures
interface ProfessionalDecision {
  id: string;
  client: string;
  decision: string;
  exposure: string;
  dueDate: string;
  status: 'draft' | 'peer-review' | 'legal-review' | 'complete';
  priority: 'high' | 'standard';
  documentation: {
    statutoryCitation: boolean;
    professionalReasoning: boolean;
    clientImpact: boolean;
    peerReview: boolean;
    legalReview: boolean;
  };
}

interface ComplianceStandard {
  id: string;
  standard: string;
  description: string;
  status: 'compliant' | 'non-compliant' | 'pending';
  lastReview: string;
}

interface RiskFactor {
  category: string;
  level: 'low' | 'medium' | 'high';
  description: string;
  mitigation: string;
  status: 'resolved' | 'monitoring' | 'action-required';
}

// Sample data
const pendingDecisions: ProfessionalDecision[] = [
  {
    id: "1",
    client: "TechCorp",
    decision: "CA Registration Decision",
    exposure: "$45,000",
    dueDate: "Today",
    status: "peer-review",
    priority: "high",
    documentation: {
      statutoryCitation: true,
      professionalReasoning: true,
      clientImpact: true,
      peerReview: false,
      legalReview: false
    }
  },
  {
    id: "2",
    client: "RetailChain LLC",
    decision: "NY Monitoring Decision",
    exposure: "$12,000",
    dueDate: "Dec 5",
    status: "draft",
    priority: "standard",
    documentation: {
      statutoryCitation: true,
      professionalReasoning: true,
      clientImpact: true,
      peerReview: false,
      legalReview: false
    }
  },
  {
    id: "3",
    client: "ManufacturingCo",
    decision: "TX Compliance Strategy",
    exposure: "$8,500",
    dueDate: "Dec 8",
    status: "draft",
    priority: "standard",
    documentation: {
      statutoryCitation: true,
      professionalReasoning: false,
      clientImpact: true,
      peerReview: false,
      legalReview: false
    }
  }
];

const complianceStandards: ComplianceStandard[] = [
  {
    id: "1",
    standard: "SSTS No. 1: Tax Return Positions",
    description: "Tax return positions and professional standards",
    status: "compliant",
    lastReview: "Nov 2024"
  },
  {
    id: "2",
    standard: "SSTS No. 3: Certain Procedural Aspects",
    description: "Procedural aspects of tax practice",
    status: "compliant",
    lastReview: "Nov 2024"
  },
  {
    id: "3",
    standard: "SSTS No. 4: Use of Estimates",
    description: "Use of estimates in tax returns",
    status: "compliant",
    lastReview: "Nov 2024"
  },
  {
    id: "4",
    standard: "SSTS No. 7: Form & Content of Advice",
    description: "Form and content of tax advice",
    status: "compliant",
    lastReview: "Nov 2024"
  },
  {
    id: "5",
    standard: "SSTS No. 8: Form & Content of Written",
    description: "Form and content of written advice",
    status: "compliant",
    lastReview: "Nov 2024"
  }
];

const riskFactors: RiskFactor[] = [
  {
    category: "Documentation Gaps",
    level: "low",
    description: "Missing peer reviews: 2 decisions",
    mitigation: "Complete peer reviews by Dec 5",
    status: "action-required"
  },
  {
    category: "Client Communication",
    level: "low",
    description: "1 pending client response",
    mitigation: "Follow up on TechCorp communication",
    status: "action-required"
  },
  {
    category: "High-Exposure Clients",
    level: "low",
    description: "3 high-exposure clients (well documented)",
    mitigation: "Continue current documentation standards",
    status: "monitoring"
  },
  {
    category: "Regulatory Changes",
    level: "low",
    description: "5 regulatory changes (proactively managed)",
    mitigation: "Maintain proactive monitoring",
    status: "monitoring"
  }
];

const decisionTemplate = {
  sections: [
    {
      title: "SITUATION ANALYSIS",
      items: [
        "Client background and current status",
        "Regulatory requirements and thresholds",
        "Financial impact and penalty exposure"
      ]
    },
    {
      title: "PROFESSIONAL RESEARCH",
      items: [
        "Statutory citations and legal authority",
        "Regulatory guidance and interpretations",
        "Precedent analysis from similar situations"
      ]
    },
    {
      title: "PROFESSIONAL REASONING",
      items: [
        "Analysis of facts against legal requirements",
        "Professional judgment and expert opinion",
        "Risk assessment and mitigation considerations"
      ]
    },
    {
      title: "RECOMMENDATION & RATIONALE",
      items: [
        "Specific action recommendations",
        "Timeline and implementation steps",
        "Professional opinion supporting decision"
      ]
    },
    {
      title: "CLIENT COMMUNICATION & FOLLOW-UP",
      items: [
        "Client advisory and consultation notes",
        "Written communication and acknowledgment",
        "Follow-up plan and monitoring schedule"
      ]
    }
  ]
};

export default function TaxManagerLiability() {
  const [selectedDecision, setSelectedDecision] = useState(pendingDecisions[0]);
  const [documentationScore, setDocumentationScore] = useState(98);
  const [riskScore, setRiskScore] = useState(85);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'success';
      case 'non-compliant': return 'danger';
      case 'pending': return 'warning';
      case 'draft': return 'warning';
      case 'peer-review': return 'primary';
      case 'legal-review': return 'secondary';
      case 'complete': return 'success';
      case 'resolved': return 'success';
      case 'monitoring': return 'primary';
      case 'action-required': return 'danger';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'standard': return 'primary';
      default: return 'default';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-6 relative">
        <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
          
          {/* Main Content */}
          <div className="mt-6 gap-6 flex flex-col w-full">
            {/* Liability Protection Dashboard Header */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-1 h-8 bg-red-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Professional Liability Shield</h2>
              </div>
              
              {/* Minimal KPI Stats */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-white font-semibold text-sm tracking-tight">Jane Doe, Tax Manager CPA</h3>
                      <p className="text-gray-400 text-xs font-medium">Legal Protection Hub</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs font-medium">Protected</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{documentationScore}%</div>
                      <div className="text-gray-400 text-xs font-medium">Documentation Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-500">YES</div>
                      <div className="text-gray-400 text-xs font-medium">Audit Ready</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-500">LOW</div>
                      <div className="text-gray-400 text-xs font-medium">Malpractice Risk</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button 
                      color="primary" 
                      variant="solid"
                      className="bg-red-500 text-white shadow-lg shadow-red-500/25 hover:bg-red-600 transition-all duration-200"
                    >
                      Decision Audit Trail
                    </Button>
                    <Button 
                      color="default" 
                      variant="bordered"
                      className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                    >
                      Standards Compliance
                    </Button>
                    <Button 
                      color="default" 
                      variant="bordered"
                      className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                    >
                      Documentation Review
                    </Button>
                    <Button 
                      color="default" 
                      variant="bordered"
                      className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                    >
                      Legal Archive
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Liability Protection Components */}
            <Tabs aria-label="Liability Protection" className="w-full">
              <Tab key="audit-trail" title="Decision Audit Trail">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mt-4">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h4 className="text-lg font-semibold text-white">Professional Decision Documentation Center</h4>
                  </div>
                  
                  <div className="space-y-6">
                    {/* High Exposure Decisions */}
                    <div>
                      <h5 className="font-semibold text-white mb-4">DECISIONS REQUIRING DOCUMENTATION ({pendingDecisions.length} Pending)</h5>
                      
                      {pendingDecisions.map((decision) => (
                        <div key={decision.id} className="bg-white/5 rounded-lg border border-white/10 p-4 mb-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <Chip
                                size="sm"
                                color={decision.priority === 'high' ? 'danger' : 'primary'}
                                variant="flat"
                                className={decision.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}
                              >
                                {decision.priority === 'high' ? 'HIGH EXPOSURE - PARTNER REVIEW REQUIRED' : 'STANDARD DECISION'}
                              </Chip>
                            </div>
                            <Chip
                              size="sm"
                              color={getStatusColor(decision.status)}
                              variant="flat"
                              className={decision.status === 'peer-review' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}
                            >
                              {decision.status}
                            </Chip>
                          </div>
                          
                          <div className="mb-3">
                            <h6 className="font-medium text-white">{decision.client} {decision.decision}</h6>
                            <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                              <span>Exposure: {decision.exposure}</span>
                              <span>Decision Due: {decision.dueDate}</span>
                              <span>Status: {decision.status === 'peer-review' ? 'Draft prepared, awaiting peer review' : 'In progress'}</span>
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                              Professional Standard: AICPA SSTS compliance required
                            </div>
                          </div>

                          <div className="mb-4">
                            <h6 className="font-medium text-white mb-2">Documentation Requirements:</h6>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center space-x-2">
                                <span className={decision.documentation.statutoryCitation ? 'text-green-400' : 'text-gray-400'}>
                                  {decision.documentation.statutoryCitation ? '☑' : '☐'}
                                </span>
                                <span className="text-gray-300">Statutory citation (Cal. Rev. & Tax Code § 23101)</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={decision.documentation.professionalReasoning ? 'text-green-400' : 'text-gray-400'}>
                                  {decision.documentation.professionalReasoning ? '☑' : '☐'}
                                </span>
                                <span className="text-gray-300">Professional reasoning documented</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={decision.documentation.clientImpact ? 'text-green-400' : 'text-gray-400'}>
                                  {decision.documentation.clientImpact ? '☑' : '☐'}
                                </span>
                                <span className="text-gray-300">Client impact analysis completed</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={decision.documentation.peerReview ? 'text-green-400' : 'text-gray-400'}>
                                  {decision.documentation.peerReview ? '☑' : '☐'}
                                </span>
                                <span className="text-gray-300">Peer review (required for &gt;$25K exposure)</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={decision.documentation.legalReview ? 'text-green-400' : 'text-gray-400'}>
                                  {decision.documentation.legalReview ? '☑' : '☐'}
                                </span>
                                <span className="text-gray-300">Professional liability review</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              color="primary" 
                              variant="solid"
                              className="bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                            >
                              Complete Documentation
                            </Button>
                            <Button 
                              size="sm" 
                              color="default" 
                              variant="bordered"
                              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                            >
                              Request Peer Review
                            </Button>
                            <Button 
                              size="sm" 
                              color="default" 
                              variant="bordered"
                              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                            >
                              Legal Review
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-white/10">
                      <Button 
                        color="primary" 
                        variant="solid"
                        className="bg-blue-500 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-600 transition-all duration-200"
                      >
                        Process All
                      </Button>
                      <Button 
                        color="default" 
                        variant="bordered"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                      >
                        Use Templates
                      </Button>
                      <Button 
                        color="default" 
                        variant="bordered"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                      >
                        Bulk Documentation
                      </Button>
                    </div>
                  </div>
                </div>
              </Tab>

              <Tab key="compliance" title="Standards Compliance">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mt-4">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                    <h4 className="text-lg font-semibold text-white">Professional Standards Compliance Dashboard</h4>
                  </div>
                  
                  <div className="space-y-6">
                    {/* AICPA Standards Compliance */}
                    <div>
                      <h5 className="font-semibold text-white mb-4">AICPA STANDARDS COMPLIANCE</h5>
                      <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                        <h6 className="font-medium text-white mb-3">Statement on Standards for Tax Services (SSTS)</h6>
                        <div className="space-y-2">
                          {complianceStandards.map((standard) => (
                            <div key={standard.id} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="text-green-400">✓</span>
                                <span className="text-gray-300 text-sm">{standard.standard}</span>
                              </div>
                              <Chip
                                size="sm"
                                color={getStatusColor(standard.status)}
                                variant="flat"
                                className="bg-green-500/20 text-green-400"
                              >
                                Compliant
                              </Chip>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* State CPA Board Requirements */}
                    <div>
                      <h5 className="font-semibold text-white mb-4">STATE CPA BOARD REQUIREMENTS</h5>
                      <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                          <div>Professional License: Valid through Dec 2025</div>
                          <div>Continuing Education: 32/40 hours completed</div>
                          <div>Professional Competence: Nexus specialization documented</div>
                          <div>Client Documentation: 100% compliance rate</div>
                        </div>
                      </div>
                    </div>

                    {/* Quality Assurance Metrics */}
                    <div>
                      <h5 className="font-semibold text-white mb-4">QUALITY ASSURANCE METRICS</h5>
                      <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300 text-sm">Decision Documentation</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={98} className="w-24" classNames={{ track: "bg-white/10", indicator: "bg-green-500" }} />
                              <span className="text-white text-sm">98% (target: 100%)</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300 text-sm">Peer Review Completion</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={94} className="w-24" classNames={{ track: "bg-white/10", indicator: "bg-blue-500" }} />
                              <span className="text-white text-sm">94% (target: 95%)</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300 text-sm">Professional Reasoning</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={100} className="w-24" classNames={{ track: "bg-white/10", indicator: "bg-green-500" }} />
                              <span className="text-white text-sm">100% documented</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300 text-sm">Client Communication</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={96} className="w-24" classNames={{ track: "bg-white/10", indicator: "bg-orange-500" }} />
                              <span className="text-white text-sm">96% documented</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-white/10">
                      <Button 
                        color="primary" 
                        variant="solid"
                        className="bg-green-500 text-white shadow-lg shadow-green-500/25 hover:bg-green-600 transition-all duration-200"
                      >
                        Standards Review
                      </Button>
                      <Button 
                        color="default" 
                        variant="bordered"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                      >
                        Gap Analysis
                      </Button>
                      <Button 
                        color="default" 
                        variant="bordered"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                      >
                        Improvement Plan
                      </Button>
                    </div>
                  </div>
                </div>
              </Tab>

              <Tab key="documentation" title="Court-Ready Documentation">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mt-4">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                    <h4 className="text-lg font-semibold text-white">Legal Defensibility Documentation</h4>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Malpractice Defense Readiness */}
                    <div>
                      <h5 className="font-semibold text-white mb-4">MALPRACTICE DEFENSE READINESS</h5>
                      <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Documentation Completeness</span>
                            <span className="text-green-400 font-medium">98% (Excellent)</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Professional Standards Met</span>
                            <span className="text-green-400 font-medium">100% (Compliant)</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Audit Trail Integrity</span>
                            <span className="text-green-400 font-medium">VERIFIED</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Statutory Citations</span>
                            <span className="text-green-400 font-medium">CURRENT</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Professional Reasoning</span>
                            <span className="text-green-400 font-medium">DOCUMENTED</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Evidence Package Components */}
                    <div>
                      <h5 className="font-semibold text-white mb-4">EVIDENCE PACKAGE COMPONENTS</h5>
                      <div className="space-y-4">
                        <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                          <h6 className="font-medium text-white mb-2">Decision Chronology</h6>
                          <div className="space-y-1 text-sm text-gray-300">
                            <div>├─ 156 professional decisions documented YTD</div>
                            <div>├─ Average documentation time: 18 minutes</div>
                            <div>├─ 100% include statutory citations</div>
                            <div>└─ 94% received peer review</div>
                          </div>
                        </div>
                        
                        <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                          <h6 className="font-medium text-white mb-2">Professional Competence Evidence</h6>
                          <div className="space-y-1 text-sm text-gray-300">
                            <div>├─ Continuing education: Tax nexus specialization</div>
                            <div>├─ Professional licenses: Current and valid</div>
                            <div>├─ Industry expertise: Technology nexus compliance</div>
                            <div>└─ Client results: $1.2M penalties prevented</div>
                          </div>
                        </div>
                        
                        <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                          <h6 className="font-medium text-white mb-2">Client Communication Records</h6>
                          <div className="space-y-1 text-sm text-gray-300">
                            <div>├─ Advisory consultations: 89% documented</div>
                            <div>├─ Client acknowledgments: Signed and archived</div>
                            <div>├─ Professional opinions: Written and delivered</div>
                            <div>└─ Follow-up compliance: Tracked and verified</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-white/10">
                      <Button 
                        color="primary" 
                        variant="solid"
                        className="bg-purple-500 text-white shadow-lg shadow-purple-500/25 hover:bg-purple-600 transition-all duration-200"
                      >
                        Generate Defense Package
                      </Button>
                      <Button 
                        color="default" 
                        variant="bordered"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                      >
                        Legal Review
                      </Button>
                      <Button 
                        color="default" 
                        variant="bordered"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                      >
                        Archive System
                      </Button>
                    </div>
                  </div>
                </div>
              </Tab>

              <Tab key="risk-assessment" title="Risk Assessment">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mt-4">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                    <h4 className="text-lg font-semibold text-white">Professional Liability Risk Analysis</h4>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Current Risk Assessment */}
                    <div>
                      <h5 className="font-semibold text-white mb-4">CURRENT RISK ASSESSMENT</h5>
                      <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="text-white font-medium">Overall Risk Level: LOW</div>
                            <div className="text-gray-400 text-sm">Risk Score: {riskScore}/100 (Excellent)</div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-500">{riskScore}</div>
                            <div className="text-gray-400 text-xs">Risk Score</div>
                          </div>
                        </div>
                        <Progress 
                          value={riskScore} 
                          className="w-full" 
                          classNames={{ track: "bg-white/10", indicator: "bg-green-500" }} 
                        />
                      </div>
                    </div>

                    {/* Risk Factors Analysis */}
                    <div>
                      <h5 className="font-semibold text-white mb-4">RISK FACTORS ANALYSIS</h5>
                      <div className="space-y-3">
                        {riskFactors.map((factor, index) => (
                          <div key={index} className="bg-white/5 rounded-lg border border-white/10 p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <Chip
                                  size="sm"
                                  color={getRiskLevelColor(factor.level)}
                                  variant="flat"
                                  className={factor.level === 'low' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}
                                >
                                  {factor.level.toUpperCase()}
                                </Chip>
                                <span className="font-medium text-white">{factor.category}</span>
                              </div>
                              <Chip
                                size="sm"
                                color={getStatusColor(factor.status)}
                                variant="flat"
                                className={factor.status === 'action-required' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}
                              >
                                {factor.status}
                              </Chip>
                            </div>
                            <div className="text-sm text-gray-300 mb-1">{factor.description}</div>
                            <div className="text-sm text-gray-400">Mitigation: {factor.mitigation}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mitigation Strategies */}
                    <div>
                      <h5 className="font-semibold text-white mb-4">MITIGATION STRATEGIES</h5>
                      <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                        <div className="space-y-4">
                          <div>
                            <h6 className="font-medium text-white mb-2">Immediate Actions:</h6>
                            <div className="space-y-1 text-sm text-gray-300">
                              <div>• Complete 2 pending peer reviews by Dec 5</div>
                              <div>• Follow up on TechCorp client communication</div>
                              <div>• Archive Q4 professional decisions</div>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-medium text-white mb-2">Preventive Measures:</h6>
                            <div className="space-y-1 text-sm text-gray-300">
                              <div>• Monthly documentation audit</div>
                              <div>• Peer review partnership with Tax Manager B</div>
                              <div>• Professional development: Advanced nexus course</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-white/10">
                      <Button 
                        color="primary" 
                        variant="solid"
                        className="bg-orange-500 text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600 transition-all duration-200"
                      >
                        Risk Mitigation Plan
                      </Button>
                      <Button 
                        color="default" 
                        variant="bordered"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                      >
                        Documentation Audit
                      </Button>
                      <Button 
                        color="default" 
                        variant="bordered"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                      >
                        Prevention Strategy
                      </Button>
                    </div>
                  </div>
                </div>
              </Tab>

              <Tab key="templates" title="Decision Templates">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mt-4">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-1 h-6 bg-cyan-500 rounded-full"></div>
                    <h4 className="text-lg font-semibold text-white">Professional Decision Framework</h4>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Decision Documentation Templates */}
                    <div>
                      <h5 className="font-semibold text-white mb-4">DECISION DOCUMENTATION TEMPLATES</h5>
                      <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                        <h6 className="font-medium text-white mb-3">Standard Decision Format:</h6>
                        <div className="space-y-4">
                          {decisionTemplate.sections.map((section, index) => (
                            <div key={index} className="bg-white/5 rounded-lg border border-white/10 p-3">
                              <h6 className="font-medium text-white mb-2">{index + 1}. {section.title}</h6>
                              <div className="space-y-1">
                                {section.items.map((item, itemIndex) => (
                                  <div key={itemIndex} className="text-sm text-gray-300">• {item}</div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-white/10">
                      <Button 
                        color="primary" 
                        variant="solid"
                        className="bg-cyan-500 text-white shadow-lg shadow-cyan-500/25 hover:bg-cyan-600 transition-all duration-200"
                      >
                        Use Template
                      </Button>
                      <Button 
                        color="default" 
                        variant="bordered"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                      >
                        Customize
                      </Button>
                      <Button 
                        color="default" 
                        variant="bordered"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                      >
                        Quality Check
                      </Button>
                      <Button 
                        color="default" 
                        variant="bordered"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                      >
                        Archive
                      </Button>
                    </div>
                  </div>
                </div>
              </Tab>

              <Tab key="insurance" title="Insurance & Legal">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mt-4">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-1 h-6 bg-yellow-500 rounded-full"></div>
                    <h4 className="text-lg font-semibold text-white">Malpractice Insurance & Legal Coordination</h4>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Professional Liability Insurance */}
                    <div>
                      <h5 className="font-semibold text-white mb-4">PROFESSIONAL LIABILITY INSURANCE</h5>
                      <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Policy Status</span>
                            <span className="text-green-400 font-medium">ACTIVE</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Coverage Limits</span>
                            <span className="text-white font-medium">$2M per claim / $5M aggregate</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Policy Period</span>
                            <span className="text-white font-medium">Jan 1, 2024 - Jan 1, 2025</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Premium Status</span>
                            <span className="text-green-400 font-medium">PAID</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Deductible</span>
                            <span className="text-white font-medium">$10,000</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Claims History & Prevention */}
                    <div>
                      <h5 className="font-semibold text-white mb-4">CLAIMS HISTORY & PREVENTION</h5>
                      <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Claims Filed</span>
                            <span className="text-green-400 font-medium">0 (Last 5 years)</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Risk Assessment</span>
                            <span className="text-green-400 font-medium">LOW RISK</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Prevention Score</span>
                            <span className="text-green-400 font-medium">95/100 (Excellent documentation)</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Last Insurance Review</span>
                            <span className="text-white font-medium">June 2024</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Legal Counsel Coordination */}
                    <div>
                      <h5 className="font-semibold text-white mb-4">LEGAL COUNSEL COORDINATION</h5>
                      <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                        <div className="space-y-2 text-sm text-gray-300">
                          <div><span className="font-medium text-white">Primary Legal Counsel:</span> Wilson & Associates</div>
                          <div><span className="font-medium text-white">Nexus Specialty Attorney:</span> Sarah Wilson, Esq.</div>
                          <div><span className="font-medium text-white">Last Consultation:</span> Oct 2024 (Multi-state registration issue)</div>
                          <div><span className="font-medium text-white">Legal Review Requests:</span> 2 YTD (both resolved favorably)</div>
                        </div>
                      </div>
                    </div>

                    {/* Quality Assurance Program */}
                    <div>
                      <h5 className="font-semibold text-white mb-4">QUALITY ASSURANCE PROGRAM</h5>
                      <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                        <div className="space-y-2 text-sm text-gray-300">
                          <div>Monthly Documentation Review: SCHEDULED</div>
                          <div>Peer Review Partnership: Active with Tax Manager B</div>
                          <div>Professional Development: 8 hours nexus-specific training</div>
                          <div>Client Satisfaction Monitoring: 96% satisfaction rate</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-white/10">
                      <Button 
                        color="primary" 
                        variant="solid"
                        className="bg-yellow-500 text-white shadow-lg shadow-yellow-500/25 hover:bg-yellow-600 transition-all duration-200"
                      >
                        Insurance Review
                      </Button>
                      <Button 
                        color="default" 
                        variant="bordered"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                      >
                        Legal Consultation
                      </Button>
                      <Button 
                        color="default" 
                        variant="bordered"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                      >
                        Risk Assessment
                      </Button>
                    </div>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
