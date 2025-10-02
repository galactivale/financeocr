"use client";

import React, { useState, useMemo } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Chip } from "@nextui-org/chip";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Badge } from "@nextui-org/badge";
import { SearchIcon } from "@/components/icons/searchicon";
import { BellIcon } from "@/components/icons/regulatory/bell-icon";
import { DocumentTextIcon } from "@/components/icons/regulatory/document-text-icon";
import { ExclamationTriangleIcon } from "@/components/icons/regulatory/exclamation-triangle-icon";
import { CheckCircleIcon } from "@/components/icons/regulatory/check-circle-icon";
import { ClockIcon } from "@/components/icons/regulatory/clock-icon";
import { UsersIcon } from "@/components/icons/regulatory/users-icon";
import { BookOpenIcon } from "@/components/icons/regulatory/book-open-icon";
import { ChatBubbleLeftRightIcon } from "@/components/icons/regulatory/chat-bubble-left-right-icon";
import { ArrowTopRightOnSquareIcon } from "@/components/icons/regulatory/arrow-top-right-on-square-icon";
import { MagnifyingGlassIcon } from "@/components/icons/regulatory/magnifying-glass-icon";
import { DocumentDuplicateIcon } from "@/components/icons/regulatory/document-duplicate-icon";
import { ShieldCheckIcon } from "@/components/icons/regulatory/shield-check-icon";
import { ChartBarIcon } from "@/components/icons/regulatory/chart-bar-icon";

// Mock data for regulatory updates
const regulatoryUpdates = [
  {
    id: 1,
    title: "California AB 234 - Marketplace Facilitator Clarifications",
    urgency: "high",
    impact: "3 clients affected",
    effectiveDate: "2024-12-15",
    status: "active",
    summary: "Clarifies marketplace facilitator responsibilities for remote sellers using third-party platforms",
    affectedClients: ["TechCorp SaaS", "RetailChain LLC", "ServicesCorp"],
    penaltyChanges: "+$15K registration delay penalties",
    actionRequired: "Review client marketplace sales within 30 days",
    statute: "Cal. Rev. & Tax Code § 23101",
    fullText: "Assembly Bill 234 modifies Revenue and Taxation Code Section 23101 to clarify that marketplace facilitators must collect and remit tax on behalf of remote sellers when the facilitator's California sales exceed $500,000 annually, regardless of individual seller thresholds.",
    researchLinks: [
      { title: "AB 234 Full Text", url: "#" },
      { title: "FTB Implementation Guide", url: "#" },
      { title: "Marketplace Facilitator FAQ", url: "#" }
    ],
    peerReview: false,
    documentationStatus: "pending"
  },
  {
    id: 2,
    title: "Washington B&O Tax Rate Adjustments",
    urgency: "medium",
    impact: "2 clients affected",
    effectiveDate: "2025-01-01",
    status: "upcoming",
    summary: "Service and retailing B&O tax rates increase by 0.1% effective January 1, 2025",
    affectedClients: ["ManufacturingCo", "StartupInc"],
    penaltyChanges: "No penalty changes",
    actionRequired: "Update client tax calculations by December 31",
    statute: "RCW 82.04.220",
    fullText: "The Washington State Legislature has approved a 0.1% increase in the service and retailing business and occupation tax rates, effective January 1, 2025, to fund transportation infrastructure improvements.",
    researchLinks: [
      { title: "RCW 82.04.220", url: "#" },
      { title: "DOR Rate Change Notice", url: "#" }
    ],
    peerReview: true,
    documentationStatus: "complete"
  },
  {
    id: 3,
    title: "Texas Economic Nexus Threshold Update",
    urgency: "low",
    impact: "1 client affected",
    effectiveDate: "2024-11-01",
    status: "implemented",
    summary: "Texas increases economic nexus threshold from $500K to $750K in annual sales",
    affectedClients: ["TechCorp SaaS"],
    penaltyChanges: "Reduced penalty exposure for late registrations",
    actionRequired: "Monitor TechCorp sales for threshold approach",
    statute: "Tex. Tax Code Ann. § 151.107",
    fullText: "Texas Comptroller has increased the economic nexus threshold from $500,000 to $750,000 in annual Texas sales, providing additional buffer for remote sellers before registration requirements.",
    researchLinks: [
      { title: "Tex. Tax Code § 151.107", url: "#" },
      { title: "Comptroller Bulletin", url: "#" }
    ],
    peerReview: false,
    documentationStatus: "complete"
  }
];

// Mock data for client impact analysis
const clientImpactData = [
  {
    clientId: "techcorp-saas",
    name: "TechCorp SaaS",
    states: ["CA", "TX", "NY", "WA"],
    currentRevenue: 525000,
    nexusStatus: "registered",
    riskLevel: "medium",
    lastReview: "2024-11-15",
    regulatoryAlerts: 2
  },
  {
    clientId: "retailchain-llc",
    name: "RetailChain LLC",
    states: ["CA", "NY", "FL", "IL"],
    currentRevenue: 485000,
    nexusStatus: "pending",
    riskLevel: "high",
    lastReview: "2024-11-20",
    regulatoryAlerts: 3
  },
  {
    clientId: "servicescorp",
    name: "ServicesCorp",
    states: ["CA", "WA", "OR"],
    currentRevenue: 320000,
    nexusStatus: "compliant",
    riskLevel: "low",
    lastReview: "2024-11-10",
    regulatoryAlerts: 1
  }
];

export default function TaxManagerRegulatoryPage() {
  const [selectedTab, setSelectedTab] = useState("updates");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [filterUrgency, setFilterUrgency] = useState("all");
  const [showFullText, setShowFullText] = useState({});

  // Filter updates based on search and urgency
  const filteredUpdates = useMemo(() => {
    return regulatoryUpdates.filter(update => {
      const matchesSearch = update.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           update.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           update.affectedClients.some(client => 
                             client.toLowerCase().includes(searchQuery.toLowerCase())
                           );
      const matchesUrgency = filterUrgency === "all" || update.urgency === filterUrgency;
      return matchesSearch && matchesUrgency;
    });
  }, [searchQuery, filterUrgency]);

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "high": return "danger";
      case "medium": return "warning";
      case "low": return "success";
      default: return "default";
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case "high": return <ExclamationTriangleIcon className="w-4 h-4" />;
      case "medium": return <ClockIcon className="w-4 h-4" />;
      case "low": return <CheckCircleIcon className="w-4 h-4" />;
      default: return <DocumentTextIcon className="w-4 h-4" />;
    }
  };

  const toggleFullText = (updateId) => {
    setShowFullText(prev => ({
      ...prev,
      [updateId]: !prev[updateId]
    }));
  };

  return (
    <div className="min-h-screen bg-black p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-light text-white mb-2">Regulatory Intelligence</h1>
            <p className="text-gray-400 text-sm">Professional regulatory monitoring and client impact analysis</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge content="3" color="danger" size="sm">
              <Button
                isIconOnly
                className="bg-white/10 backdrop-blur-xl border border-white/10 text-white hover:bg-white/20"
                size="sm"
              >
                <BellIcon className="w-5 h-5" />
              </Button>
            </Badge>
            <Button
              className="bg-blue-500/20 backdrop-blur-xl border border-blue-500/30 text-blue-400 hover:bg-blue-500/30"
              size="sm"
            >
              <DocumentTextIcon className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Impact Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Active Alerts</p>
                <p className="text-2xl font-light text-white">6</p>
              </div>
              <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Clients Affected</p>
                <p className="text-2xl font-light text-white">8</p>
              </div>
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <UsersIcon className="w-4 h-4 text-blue-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Penalty Exposure</p>
                <p className="text-2xl font-light text-white">$45K</p>
              </div>
              <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <ShieldCheckIcon className="w-4 h-4 text-yellow-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Documentation</p>
                <p className="text-2xl font-light text-white">94%</p>
              </div>
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="w-4 h-4 text-green-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Regulatory Updates */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            {/* Search and Filter Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Input
                    placeholder="Search regulatory updates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    startContent={<SearchIcon className="w-4 h-4 text-gray-400" />}
                    className="w-80"
                    classNames={{
                      input: "text-white",
                      inputWrapper: "bg-white/10 border-white/20 hover:border-white/30 focus-within:border-blue-500/50"
                    }}
                  />
                </div>
                <div className="flex space-x-2">
                  {["all", "high", "medium", "low"].map((urgency) => (
                    <Button
                      key={urgency}
                      size="sm"
                      className={`${
                        filterUrgency === urgency
                          ? "bg-blue-500/20 border-blue-500/30 text-blue-400"
                          : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                      } backdrop-blur-xl border`}
                      onClick={() => setFilterUrgency(urgency)}
                    >
                      {urgency === "all" ? "All" : urgency.charAt(0).toUpperCase() + urgency.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Regulatory Updates List */}
            <div className="space-y-4">
              {filteredUpdates.map((update) => (
                <div
                  key={update.id}
                  className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Chip
                        color={getUrgencyColor(update.urgency)}
                        size="sm"
                        startContent={getUrgencyIcon(update.urgency)}
                        className="text-xs"
                      >
                        {update.urgency.toUpperCase()}
                      </Chip>
                      <Chip
                        color="primary"
                        variant="flat"
                        size="sm"
                        className="text-xs"
                      >
                        {update.impact}
                      </Chip>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400">{update.effectiveDate}</span>
                      <Button
                        isIconOnly
                        size="sm"
                        className="bg-white/10 hover:bg-white/20"
                        onClick={() => toggleFullText(update.id)}
                      >
                        <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="text-white font-medium mb-2">{update.title}</h3>
                  <p className="text-gray-300 text-sm mb-3">{update.summary}</p>

                  {/* Affected Clients */}
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-2">Affected Clients:</p>
                    <div className="flex flex-wrap gap-2">
                      {update.affectedClients.map((client) => (
                        <Chip
                          key={client}
                          size="sm"
                          variant="flat"
                          className="bg-blue-500/20 text-blue-300 text-xs"
                        >
                          {client}
                        </Chip>
                      ))}
                    </div>
                  </div>

                  {/* Action Required */}
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-3">
                    <p className="text-yellow-300 text-sm font-medium mb-1">Action Required:</p>
                    <p className="text-yellow-200 text-sm">{update.actionRequired}</p>
                  </div>

                  {/* Full Text Toggle */}
                  {showFullText[update.id] && (
                    <div className="mt-4 p-4 bg-black/20 rounded-lg border border-white/10">
                      <div className="mb-3">
                        <p className="text-xs text-gray-400 mb-1">Statute:</p>
                        <p className="text-blue-300 text-sm font-mono">{update.statute}</p>
                      </div>
                      <p className="text-gray-300 text-sm mb-4">{update.fullText}</p>
                      
                      {/* Research Links */}
                      <div className="mb-3">
                        <p className="text-xs text-gray-400 mb-2">Research Resources:</p>
                        <div className="flex flex-wrap gap-2">
                          {update.researchLinks.map((link, index) => (
                            <Button
                              key={index}
                              size="sm"
                              variant="flat"
                              className="bg-white/10 text-gray-300 hover:bg-white/20 text-xs"
                              endContent={<ArrowTopRightOnSquareIcon className="w-3 h-3" />}
                            >
                              {link.title}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Documentation Status */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <span className={update.peerReview ? 'text-green-400' : 'text-gray-400'}>
                              {update.peerReview ? '☑' : '☐'}
                            </span>
                            <span className="text-gray-300 text-xs">Peer Review</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={update.documentationStatus === 'complete' ? 'text-green-400' : 'text-yellow-400'}>
                              {update.documentationStatus === 'complete' ? '☑' : '⏳'}
                            </span>
                            <span className="text-gray-300 text-xs">Documentation</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30"
                        >
                          <DocumentDuplicateIcon className="w-3 h-3 mr-2" />
                          Document Decision
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                    <div className="flex items-center space-x-3">
                      <Button
                        size="sm"
                        variant="flat"
                        className="bg-white/10 text-gray-300 hover:bg-white/20"
                        startContent={<ChatBubbleLeftRightIcon className="w-3 h-3" />}
                      >
                        Annotate
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        className="bg-white/10 text-gray-300 hover:bg-white/20"
                        startContent={<UsersIcon className="w-3 h-3" />}
                      >
                        Peer Review
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      className="bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30"
                      startContent={<CheckCircleIcon className="w-3 h-3" />}
                    >
                      Mark Reviewed
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Client Impact Analysis */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-light text-white">Client Impact Analysis</h2>
              <Button
                isIconOnly
                size="sm"
                className="bg-white/10 hover:bg-white/20"
              >
                <ChartBarIcon className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {clientImpactData.map((client) => (
                <div
                  key={client.clientId}
                  className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-medium text-sm">{client.name}</h3>
                    <Chip
                      color={client.riskLevel === "high" ? "danger" : client.riskLevel === "medium" ? "warning" : "success"}
                      size="sm"
                      className="text-xs"
                    >
                      {client.riskLevel.toUpperCase()}
                    </Chip>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Revenue:</span>
                      <span className="text-white">${client.currentRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Nexus Status:</span>
                      <span className="text-blue-300">{client.nexusStatus}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">States:</span>
                      <div className="flex space-x-1">
                        {client.states.map((state) => (
                          <span key={state} className="text-gray-300">{state}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge content={client.regulatoryAlerts} color="danger" size="sm">
                        <BellIcon className="w-4 h-4 text-gray-400" />
                      </Badge>
                      <span className="text-xs text-gray-400">Alerts</span>
                    </div>
                    <Button
                      size="sm"
                      variant="flat"
                      className="bg-white/10 text-gray-300 hover:bg-white/20 text-xs"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Research Tools */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <h3 className="text-white font-medium mb-4">Research Tools</h3>
              <div className="space-y-3">
                <Button
                  fullWidth
                  variant="flat"
                  className="bg-white/10 text-gray-300 hover:bg-white/20 justify-start"
                  startContent={<BookOpenIcon className="w-4 h-4" />}
                  onPress={() => window.location.href = '/dashboard/tax-manager/regulatory/statutory-database'}
                >
                  Statutory Database
                </Button>
                <Button
                  fullWidth
                  variant="flat"
                  className="bg-white/10 text-gray-300 hover:bg-white/20 justify-start"
                  startContent={<MagnifyingGlassIcon className="w-4 h-4" />}
                >
                  Case Law Search
                </Button>
                <Button
                  fullWidth
                  variant="flat"
                  className="bg-white/10 text-gray-300 hover:bg-white/20 justify-start"
                  startContent={<DocumentTextIcon className="w-4 h-4" />}
                >
                  Professional Guidance
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
