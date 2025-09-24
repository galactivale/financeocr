"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Input } from "@nextui-org/input";
import { Badge } from "@nextui-org/badge";
import { 
  Shield,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Calendar,
  User,
  Building,
  Scale,
  Lock,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  BarChart3,
  TrendingUp,
  Award,
  BookOpen,
  MessageSquare,
  Phone,
  Mail,
  Archive,
  RefreshCw
} from "lucide-react";

// Mock data for audit trail
const auditTrailData = {
  overallStatus: {
    documentationComplete: 100,
    courtReady: true,
    lastReview: "2024-11-28",
    totalDecisions: 156,
    highExposureDecisions: 12,
    peerReviewed: 94,
    professionalStandards: 100
  },
  recentDecisions: [
    {
      id: "NEX-2024-1201-003",
      date: "2024-12-01",
      time: "14:32:18.247Z",
      client: "TechCorp SaaS Solutions, LLC",
      decisionType: "Mandatory Registration",
      exposureLevel: 45000,
      status: "high",
      taxManager: "Jane Doe, CPA",
      license: "CA-12345",
      legalStatus: "COURT-READY",
      integrityHash: "a7f4c9d2e8b1f5a6d3c7b9e4f2a5d8c1",
      professionalReasoning: "Based on verified financial data showing TechCorp's California sales of $315,000 within a total annual revenue of $525,000, the company has established economic nexus under California Revenue and Taxation Code Section 23101.",
      statutoryCitations: [
        "California Revenue and Taxation Code Section 23101",
        "California Code of Regulations, Title 18, Section 1684",
        "California Assembly Bill 234 (marketplace provisions)"
      ],
      peerReview: {
        completed: true,
        reviewer: "Tax Manager B (CPA License #CA-67890)",
        date: "2024-12-01T16:45:00Z",
        outcome: "APPROVED",
        comments: "Statutory analysis accurate, timeline appropriate"
      },
      managingPartnerApproval: {
        required: true,
        approved: true,
        approver: "Managing Partner Smith, CPA",
        date: "2024-12-01T17:30:00Z",
        comments: "Proceed with registration recommendation"
      },
      clientCommunication: {
        consultationDate: "2024-12-01T15:00:00Z",
        duration: "45 minutes",
        participants: ["John Smith (CFO)", "Jane Doe (Tax Manager)"],
        advisoryLetterSent: "2024-12-01T18:00:00Z",
        clientAcknowledgment: "Client understands nexus obligation and accepts recommendation for immediate California registration."
      },
      implementation: {
        registrationFiled: "2024-12-02",
        cdtfaConfirmation: "2024-12-03",
        taxCollectionActive: "2024-12-05"
      }
    },
    {
      id: "NEX-2024-1128-001",
      date: "2024-11-28",
      time: "09:15:42.156Z",
      client: "RetailChain LLC",
      decisionType: "Threshold Monitoring",
      exposureLevel: 15000,
      status: "medium",
      taxManager: "Jane Doe, CPA",
      license: "CA-12345",
      legalStatus: "COURT-READY",
      integrityHash: "b8e5d1f3c9a7b2e6d4c8f1a5b9e3d7c2",
      professionalReasoning: "Client approaching New York economic nexus threshold with current revenue of $89,500 against $500,000 threshold. Proactive monitoring recommended to ensure timely compliance.",
      statutoryCitations: [
        "New York Tax Law Section 1101(b)(8)",
        "New York State Department of Taxation and Finance TSB-M-18(3)S"
      ],
      peerReview: {
        completed: true,
        reviewer: "Tax Manager C (CPA License #NY-45678)",
        date: "2024-11-28T11:30:00Z",
        outcome: "APPROVED",
        comments: "Monitoring approach appropriate for current exposure level"
      },
      managingPartnerApproval: {
        required: false,
        approved: false,
        approver: null,
        date: null,
        comments: null
      },
      clientCommunication: {
        consultationDate: "2024-11-28T10:00:00Z",
        duration: "30 minutes",
        participants: ["Sarah Johnson (VP Finance)", "Jane Doe (Tax Manager)"],
        advisoryLetterSent: "2024-11-28T14:00:00Z",
        clientAcknowledgment: "Client agrees to monthly monitoring and will provide updated revenue data."
      },
      implementation: {
        registrationFiled: null,
        cdtfaConfirmation: null,
        taxCollectionActive: null
      }
    },
    {
      id: "NEX-2024-1125-002",
      date: "2024-11-25",
      time: "16:22:33.891Z",
      client: "ManufacturingCo Inc",
      decisionType: "Multi-State Analysis",
      exposureLevel: 75000,
      status: "high",
      taxManager: "Jane Doe, CPA",
      license: "CA-12345",
      legalStatus: "COURT-READY",
      integrityHash: "c9f6e2d4a8b1c5e7d3f9a2b6e4d8c1f5",
      professionalReasoning: "Comprehensive analysis of multi-state nexus requirements for manufacturing client with operations in 8 states. Texas and Florida nexus established, monitoring required for 6 additional states.",
      statutoryCitations: [
        "Texas Tax Code Section 151.107",
        "Florida Statutes Section 212.0596",
        "Wayfair v. South Dakota, 138 S. Ct. 2080 (2018)"
      ],
      peerReview: {
        completed: true,
        reviewer: "Tax Manager B (CPA License #CA-67890)",
        date: "2024-11-25T18:00:00Z",
        outcome: "APPROVED",
        comments: "Comprehensive analysis, appropriate risk assessment"
      },
      managingPartnerApproval: {
        required: true,
        approved: true,
        approver: "Managing Partner Smith, CPA",
        date: "2024-11-25T19:15:00Z",
        comments: "Proceed with multi-state registration plan"
      },
      clientCommunication: {
        consultationDate: "2024-11-25T15:30:00Z",
        duration: "60 minutes",
        participants: ["Mike Chen (CEO)", "John Smith (CFO)", "Jane Doe (Tax Manager)"],
        advisoryLetterSent: "2024-11-25T20:00:00Z",
        clientAcknowledgment: "Client approves multi-state registration strategy and implementation timeline."
      },
      implementation: {
        registrationFiled: "2024-11-26",
        cdtfaConfirmation: "2024-11-27",
        taxCollectionActive: "2024-12-01"
      }
    }
  ]
};

export default function AuditTrailPage() {
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedDecision, setExpandedDecision] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "high": return "danger";
      case "medium": return "warning";
      case "low": return "success";
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

  const formatDateTime = (dateString: string, timeString: string) => {
    const date = new Date(`${dateString}T${timeString}`);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  return (
    <div className="min-h-screen bg-black p-6">
      {/* Main Content */}
      <div className="mt-6 gap-6 flex flex-col w-full">
        {/* Professional Audit Trail Overview */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-1 h-8 bg-green-500 rounded-full"></div>
            <h2 className="text-2xl font-semibold text-white tracking-tight">Professional Audit Trail</h2>
          </div>
          
          {/* Legal Protection Status */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="text-white font-semibold text-sm tracking-tight">Jane Doe, Tax Manager</h3>
                  <p className="text-gray-400 text-xs font-medium">Professional Liability Documentation Center</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs font-medium">Legal Protection Active</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">{auditTrailData.overallStatus.documentationComplete}%</div>
                  <div className="text-gray-400 text-xs font-medium">Documentation Complete</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">COURT-READY</div>
                  <div className="text-gray-400 text-xs font-medium">Legal Status</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{auditTrailData.overallStatus.totalDecisions}</div>
                  <div className="text-gray-400 text-xs font-medium">Total Decisions</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400">{formatDate(auditTrailData.overallStatus.lastReview)}</div>
                  <div className="text-gray-400 text-xs font-medium">Last Review</div>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Warning */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <p className="text-yellow-300 text-sm font-medium">
                CRITICAL: This audit trail may be used in legal proceedings
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <Button
                size="sm"
                className={`${filterStatus === "all" ? "bg-blue-500/20 border-blue-500/30 text-blue-400" : "bg-white/10 border-white/20 text-gray-300 hover:bg-white/20"}`}
                onClick={() => setFilterStatus("all")}
              >
                All Decisions
              </Button>
              <Button
                size="sm"
                className={`${filterStatus === "high" ? "bg-red-500/20 border-red-500/30 text-red-400" : "bg-white/10 border-white/20 text-gray-300 hover:bg-white/20"}`}
                onClick={() => setFilterStatus("high")}
              >
                High Exposure
              </Button>
              <Button
                size="sm"
                className={`${filterStatus === "medium" ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-400" : "bg-white/10 border-white/20 text-gray-300 hover:bg-white/20"}`}
                onClick={() => setFilterStatus("medium")}
              >
                Medium Exposure
              </Button>
              <Button
                size="sm"
                className={`${filterStatus === "peer-reviewed" ? "bg-green-500/20 border-green-500/30 text-green-400" : "bg-white/10 border-white/20 text-gray-300 hover:bg-white/20"}`}
                onClick={() => setFilterStatus("peer-reviewed")}
              >
                Peer Reviewed
              </Button>
            </div>
            
            <div className="flex items-center space-x-3">
              <Input
                placeholder="Search decisions, reasoning, citations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startContent={<Search className="w-4 h-4 text-gray-400" />}
                className="w-64"
                classNames={{
                  input: "text-white",
                  inputWrapper: "bg-white/10 border-white/20 hover:border-white/30 focus:border-white/40"
                }}
              />
              <Button
                size="sm"
                className="bg-slate-500/20 border-slate-500/30 text-slate-400 hover:bg-slate-500/30"
                startContent={<Download className="w-4 h-4" />}
              >
                Export Legal Package
              </Button>
              <Button
                size="sm"
                className="bg-slate-500/20 border-slate-500/30 text-slate-400 hover:bg-slate-500/30"
                startContent={<RefreshCw className="w-4 h-4" />}
              >
                Verify Integrity
              </Button>
            </div>
          </div>
        </div>

        {/* Professional Decision Chronology */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-1 h-6 bg-green-500 rounded-full"></div>
            <h2 className="text-2xl font-semibold text-white tracking-tight">Professional Decision Chronology</h2>
          </div>

        <div className="space-y-3">
          {auditTrailData.recentDecisions.map((decision) => (
            <div
              key={decision.id}
              className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    decision.status === "high" ? "bg-red-500" :
                    decision.status === "medium" ? "bg-yellow-500" : "bg-green-500"
                  }`}></div>
                  <div>
                    <h3 className="text-white font-medium text-sm">{decision.client}</h3>
                    <p className="text-gray-400 text-xs">{decision.decisionType}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-white">{formatCurrency(decision.exposureLevel)}</div>
                    <div className="text-gray-400 text-xs">Exposure</div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <CheckCircle className="w-3 h-3 text-green-400" />
                    </div>
                    <span className="text-green-400 text-xs font-medium">Verified</span>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="light"
                    className="text-gray-400 hover:text-white min-w-0 p-2"
                    onClick={() => setExpandedDecision(expandedDecision === decision.id ? null : decision.id)}
                  >
                    {expandedDecision === decision.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </Button>
                </div>
              </div>


              {/* Expanded Decision Details */}
              {expandedDecision === decision.id && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Professional Reasoning */}
                    <div>
                      <h4 className="text-white font-semibold text-sm mb-3">Professional Reasoning</h4>
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-gray-300 text-sm">{decision.professionalReasoning}</p>
                      </div>
                    </div>

                    {/* Statutory Citations */}
                    <div>
                      <h4 className="text-white font-semibold text-sm mb-3">Statutory Citations</h4>
                      <div className="bg-white/5 rounded-lg p-4">
                        <ul className="space-y-2">
                          {decision.statutoryCitations.map((citation, index) => (
                            <li key={index} className="text-gray-300 text-sm">• {citation}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Peer Review */}
                    <div>
                      <h4 className="text-white font-semibold text-sm mb-3">Peer Review</h4>
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Reviewer:</span>
                            <span className="text-white">{decision.peerReview.reviewer}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Date:</span>
                            <span className="text-white">{formatDate(decision.peerReview.date)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Outcome:</span>
                            <Chip color="success" size="sm" className="text-xs">{decision.peerReview.outcome}</Chip>
                          </div>
                          <div className="mt-2">
                            <span className="text-gray-400 text-xs">Comments:</span>
                            <p className="text-gray-300 text-xs mt-1">{decision.peerReview.comments}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Client Communication */}
                    <div>
                      <h4 className="text-white font-semibold text-sm mb-3">Client Communication</h4>
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Consultation:</span>
                            <span className="text-white">{formatDate(decision.clientCommunication.consultationDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Duration:</span>
                            <span className="text-white">{decision.clientCommunication.duration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Advisory Sent:</span>
                            <span className="text-white">{formatDate(decision.clientCommunication.advisoryLetterSent)}</span>
                          </div>
                          <div className="mt-2">
                            <span className="text-gray-400 text-xs">Acknowledgment:</span>
                            <p className="text-gray-300 text-xs mt-1">{decision.clientCommunication.clientAcknowledgment}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Integrity Verification */}
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h4 className="text-white font-semibold text-sm mb-3">Record Integrity</h4>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-xs">Integrity Hash:</p>
                          <p className="text-white text-sm font-mono">{decision.integrityHash}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-green-400 text-sm font-semibold">VERIFIED</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  );
}
