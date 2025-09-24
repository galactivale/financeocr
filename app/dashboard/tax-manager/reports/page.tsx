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
  Progress,
  Tabs,
  Tab
} from "@nextui-org/react";

// Report data structure
interface Report {
  id: string;
  title: string;
  type: 'client-compliance' | 'regulatory-analysis' | 'professional-audit' | 'portfolio-summary' | 'state-updates' | 'custom';
  client?: string;
  date: string;
  format: 'PDF' | 'Excel' | 'PowerPoint';
  size: string;
  status: 'generated' | 'scheduled' | 'in-progress';
}

interface ScheduledReport {
  id: string;
  title: string;
  frequency: string;
  nextDue: string;
  status: 'active' | 'paused';
}

// Sample data
const recentReports: Report[] = [
  {
    id: "1",
    title: "TechCorp Q4 Compliance Review",
    type: "client-compliance",
    client: "TechCorp SaaS",
    date: "Dec 1, 2024",
    format: "PDF",
    size: "2.3 MB",
    status: "generated"
  },
  {
    id: "2",
    title: "Portfolio Risk Analysis",
    type: "portfolio-summary",
    date: "Nov 28, 2024",
    format: "Excel",
    size: "1.8 MB",
    status: "generated"
  },
  {
    id: "3",
    title: "CA Regulation Update Summary",
    type: "regulatory-analysis",
    date: "Nov 25, 2024",
    format: "PDF",
    size: "1.2 MB",
    status: "generated"
  },
  {
    id: "4",
    title: "Professional Decision Audit",
    type: "professional-audit",
    date: "Nov 20, 2024",
    format: "PDF",
    size: "3.1 MB",
    status: "generated"
  },
  {
    id: "5",
    title: "Client Advisory Package",
    type: "client-compliance",
    client: "RetailChain LLC",
    date: "Nov 15, 2024",
    format: "PowerPoint",
    size: "4.2 MB",
    status: "generated"
  }
];

const scheduledReports: ScheduledReport[] = [
  {
    id: "1",
    title: "Client Portfolio Review",
    frequency: "Monthly, 1st of month",
    nextDue: "Jan 1, 2025",
    status: "active"
  },
  {
    id: "2",
    title: "High-Risk Alert Summary",
    frequency: "Weekly, Mondays",
    nextDue: "Tomorrow 9:00 AM",
    status: "active"
  },
  {
    id: "3",
    title: "Regulatory Update Digest",
    frequency: "Weekly, Fridays",
    nextDue: "Friday 5:00 PM",
    status: "active"
  },
  {
    id: "4",
    title: "Professional Decision Log",
    frequency: "Quarterly",
    nextDue: "Dec 31, 2024",
    status: "active"
  },
  {
    id: "5",
    title: "Managing Partner Brief",
    frequency: "Monthly",
    nextDue: "Dec 15, 2024",
    status: "active"
  }
];

const reportTemplates = [
  "Client Quarterly Review",
  "Threshold Approach Advisory",
  "Registration Recommendation",
  "Voluntary Disclosure Analysis",
  "Professional Decision Summary",
  "Regulatory Update Impact"
];

const customTemplates = [
  "TechCorp Quarterly Format",
  "High-Risk Client Deep Dive",
  "Partner Escalation Package"
];

export default function TaxManagerReports() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('Q4 2024');
  const [reportComponents, setReportComponents] = useState({
    nexusStatus: true,
    thresholdAnalysis: true,
    activeAlerts: true,
    professionalDecisions: true,
    complianceTimeline: true,
    nextReview: true
  });
  const [deliveryOptions, setDeliveryOptions] = useState({
    clientPortal: true,
    email: true,
    presentation: false
  });

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'client-compliance': return 'primary';
      case 'regulatory-analysis': return 'secondary';
      case 'professional-audit': return 'warning';
      case 'portfolio-summary': return 'success';
      case 'state-updates': return 'default';
      case 'custom': return 'danger';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generated': return 'success';
      case 'scheduled': return 'primary';
      case 'in-progress': return 'warning';
      case 'active': return 'success';
      case 'paused': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-6 relative">
        <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
          
          {/* Main Content */}
          <div className="mt-6 gap-6 flex flex-col w-full">
            {/* Professional Reports Center Header */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Professional Reports Center</h2>
              </div>
              
              {/* Minimal KPI Stats */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-white font-semibold text-sm tracking-tight">Jane Doe, Tax Manager CPA</h3>
                      <p className="text-gray-400 text-xs font-medium">Professional Documentation Center</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs font-medium">Active</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">47</div>
                      <div className="text-gray-400 text-xs font-medium">Generated This Month</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-500">32</div>
                      <div className="text-gray-400 text-xs font-medium">Client Reports</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-500">15</div>
                      <div className="text-gray-400 text-xs font-medium">Compliance Reports</div>
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
                      className="bg-blue-500 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-600 transition-all duration-200"
                    >
                      Quick Generate
                    </Button>
                    <Button 
                      color="default" 
                      variant="bordered"
                      className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                    >
                      Report Templates
                    </Button>
                    <Button 
                      color="default" 
                      variant="bordered"
                      className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                    >
                      Scheduled Reports
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
            </div>

            {/* Report Categories */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                <h4 className="text-lg font-semibold text-white">Report Categories</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  color={selectedCategory === 'all' ? 'primary' : 'default'}
                  variant={selectedCategory === 'all' ? 'solid' : 'bordered'}
                  onPress={() => setSelectedCategory('all')}
                  className={selectedCategory === 'all' 
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25" 
                    : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                  }
                >
                  All Reports
                </Button>
                <Button
                  size="sm"
                  color={selectedCategory === 'client-compliance' ? 'primary' : 'default'}
                  variant={selectedCategory === 'client-compliance' ? 'solid' : 'bordered'}
                  onPress={() => setSelectedCategory('client-compliance')}
                  className={selectedCategory === 'client-compliance' 
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25" 
                    : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                  }
                >
                  Client Compliance
                </Button>
                <Button
                  size="sm"
                  color={selectedCategory === 'regulatory-analysis' ? 'primary' : 'default'}
                  variant={selectedCategory === 'regulatory-analysis' ? 'solid' : 'bordered'}
                  onPress={() => setSelectedCategory('regulatory-analysis')}
                  className={selectedCategory === 'regulatory-analysis' 
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25" 
                    : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                  }
                >
                  Regulatory Analysis
                </Button>
                <Button
                  size="sm"
                  color={selectedCategory === 'professional-audit' ? 'primary' : 'default'}
                  variant={selectedCategory === 'professional-audit' ? 'solid' : 'bordered'}
                  onPress={() => setSelectedCategory('professional-audit')}
                  className={selectedCategory === 'professional-audit' 
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25" 
                    : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                  }
                >
                  Professional Audit
                </Button>
                <Button
                  size="sm"
                  color={selectedCategory === 'portfolio-summary' ? 'primary' : 'default'}
                  variant={selectedCategory === 'portfolio-summary' ? 'solid' : 'bordered'}
                  onPress={() => setSelectedCategory('portfolio-summary')}
                  className={selectedCategory === 'portfolio-summary' 
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25" 
                    : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                  }
                >
                  Portfolio Summary
                </Button>
                <Button
                  size="sm"
                  color={selectedCategory === 'state-updates' ? 'primary' : 'default'}
                  variant={selectedCategory === 'state-updates' ? 'solid' : 'bordered'}
                  onPress={() => setSelectedCategory('state-updates')}
                  className={selectedCategory === 'state-updates' 
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25" 
                    : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                  }
                >
                  State Updates
                </Button>
                <Button
                  size="sm"
                  color={selectedCategory === 'custom' ? 'primary' : 'default'}
                  variant={selectedCategory === 'custom' ? 'solid' : 'bordered'}
                  onPress={() => setSelectedCategory('custom')}
                  className={selectedCategory === 'custom' 
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25" 
                    : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                  }
                >
                  Custom Reports
                </Button>
              </div>
            </div>

            {/* Report Generation Interface */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <Tabs aria-label="Report Generation" className="w-full">
                <Tab key="client-compliance" title="Client Compliance">
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mt-4">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                      <h4 className="text-lg font-semibold text-white">Client Nexus Compliance Report</h4>
                    </div>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-white mb-2 block">Client</label>
                          <Input
                            placeholder="TechCorp SaaS"
                            value={selectedClient}
                            onValueChange={setSelectedClient}
                            className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-white mb-2 block">Period</label>
                          <Input
                            placeholder="Q4 2024"
                            value={selectedPeriod}
                            onValueChange={setSelectedPeriod}
                            className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                          />
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold text-white mb-3">Report Components</h5>
                        <div className="space-y-2">
                          {Object.entries(reportComponents).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => setReportComponents(prev => ({
                                  ...prev,
                                  [key]: e.target.checked
                                }))}
                                className="rounded bg-white/5 border-white/10 text-blue-500"
                              />
                              <span className="text-sm text-gray-300">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold text-white mb-3">Delivery Options</h5>
                        <div className="space-y-2">
                          {Object.entries(deliveryOptions).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => setDeliveryOptions(prev => ({
                                  ...prev,
                                  [key]: e.target.checked
                                }))}
                                className="rounded bg-white/5 border-white/10 text-blue-500"
                              />
                              <span className="text-sm text-gray-300">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          color="primary" 
                          variant="solid"
                          className="bg-blue-500 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-600 transition-all duration-200"
                        >
                          Generate Report
                        </Button>
                        <Button 
                          color="default" 
                          variant="bordered"
                          className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                        >
                          Preview
                        </Button>
                        <Button 
                          color="default" 
                          variant="bordered"
                          className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                        >
                          Schedule Recurring
                        </Button>
                      </div>
                    </div>
                  </div>
                </Tab>

                <Tab key="professional-audit" title="Professional Audit">
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mt-4">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                      <h4 className="text-lg font-semibold text-white">Professional Liability Audit Package</h4>
                    </div>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-semibold text-white">CLIENT:</span> 
                          <span className="text-gray-300 ml-2">TechCorp SaaS</span>
                        </div>
                        <div>
                          <span className="font-semibold text-white">PERIOD:</span> 
                          <span className="text-gray-300 ml-2">2024 Annual</span>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold text-white mb-3">AUDIT TRAIL COMPONENTS</h5>
                        <div className="space-y-2 text-sm text-gray-300">
                          <div>├─ Professional decisions: 8 documented</div>
                          <div>├─ Statutory citations: Complete references</div>
                          <div>├─ Client communications: All logged</div>
                          <div>├─ Data validation records: Quality scores</div>
                          <div>├─ Regulatory updates: Applied changes</div>
                          <div>└─ Peer review documentation: 3 reviews</div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold text-white mb-3">PROFESSIONAL STANDARDS COMPLIANCE</h5>
                        <div className="space-y-2 text-sm text-gray-300">
                          <div>├─ AICPA guidelines: Fully compliant</div>
                          <div>├─ State CPA requirements: Met</div>
                          <div>├─ Documentation completeness: 100%</div>
                          <div>└─ Court defensibility: Verified</div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold text-white mb-3">PACKAGE CONTENTS</h5>
                        <div className="space-y-1 text-sm text-gray-300">
                          <div>• Executive summary (2 pages)</div>
                          <div>• Decision chronology (12 pages)</div>
                          <div>• Supporting documentation (45 pages)</div>
                          <div>• Regulatory references (8 pages)</div>
                          <div>• Professional certifications</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          color="primary" 
                          variant="solid"
                          className="bg-blue-500 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-600 transition-all duration-200"
                        >
                          Generate Audit Package
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
                          Archive Copy
                        </Button>
                      </div>
                    </div>
                  </div>
                </Tab>

                <Tab key="portfolio-analytics" title="Portfolio Analytics">
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mt-4">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                      <h4 className="text-lg font-semibold text-white">Client Portfolio Risk Analysis</h4>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h5 className="font-semibold text-white mb-3">PORTFOLIO OVERVIEW</h5>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                          <div>Total Clients: 24 | High Risk: 8 | Critical Alerts: 3</div>
                          <div>Total Exposure: $284,500 | Avg per Client: $11,854</div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold text-white mb-3">RISK DISTRIBUTION</h5>
                        <div className="space-y-2 text-sm text-gray-300">
                          <div className="flex justify-between">
                            <span>Critical (3): $127K exposure</span>
                            <span>18% of portfolio</span>
                          </div>
                          <div className="flex justify-between">
                            <span>High (8): $98K exposure</span>
                            <span>35% of portfolio</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Medium (9): $47K exposure</span>
                            <span>37% of portfolio</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Low (4): $12K exposure</span>
                            <span>10% of portfolio</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold text-white mb-3">STATE ANALYSIS</h5>
                        <div className="space-y-2 text-sm text-gray-300">
                          <div>California: 15 clients, $156K exposure, 3 critical</div>
                          <div>New York: 12 clients, $78K exposure, 2 warnings</div>
                          <div>Texas: 8 clients, $34K exposure, 1 warning</div>
                          <div>Other States: Combined $16K exposure</div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold text-white mb-3">PERFORMANCE METRICS</h5>
                        <div className="space-y-2 text-sm text-gray-300">
                          <div>Penalties Prevented: $1.2M this year</div>
                          <div>Avg Decision Time: 2.3 days</div>
                          <div>Client Satisfaction: 96%</div>
                          <div>Professional Standards: 100% compliant</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          color="primary" 
                          variant="solid"
                          className="bg-blue-500 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-600 transition-all duration-200"
                        >
                          Export Analysis
                        </Button>
                        <Button 
                          color="default" 
                          variant="bordered"
                          className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                        >
                          Share with Partner
                        </Button>
                        <Button 
                          color="default" 
                          variant="bordered"
                          className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                        >
                          Schedule Review
                        </Button>
                      </div>
                    </div>
                  </div>
                </Tab>

                <Tab key="quick-generator" title="Quick Generator">
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mt-4">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-1 h-6 bg-cyan-500 rounded-full"></div>
                      <h4 className="text-lg font-semibold text-white">Quick Report Generation</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-white mb-2 block">Report Type</label>
                          <Input 
                            placeholder="Client Status Update" 
                            className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-white mb-2 block">Client/Scope</label>
                          <Input 
                            placeholder="All Assigned Clients" 
                            className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-white mb-2 block">Time Period</label>
                          <Input 
                            placeholder="Last 30 Days" 
                            className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-white mb-2 block">Detail Level</label>
                          <Input 
                            placeholder="Executive Summary" 
                            className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-white mb-2 block">Output Format</label>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              color="primary" 
                              variant="solid"
                              className="bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                            >
                              PDF
                            </Button>
                            <Button 
                              size="sm" 
                              color="default" 
                              variant="bordered"
                              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                            >
                              Excel
                            </Button>
                            <Button 
                              size="sm" 
                              color="default" 
                              variant="bordered"
                              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                            >
                              PowerPoint
                            </Button>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-white mb-2 block">Delivery</label>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              color="primary" 
                              variant="solid"
                              className="bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                            >
                              Download
                            </Button>
                            <Button 
                              size="sm" 
                              color="default" 
                              variant="bordered"
                              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                            >
                              Email
                            </Button>
                            <Button 
                              size="sm" 
                              color="default" 
                              variant="bordered"
                              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                            >
                              Client Portal
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          color="primary" 
                          variant="solid"
                          className="bg-blue-500 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-600 transition-all duration-200"
                        >
                          Generate Now
                        </Button>
                        <Button 
                          color="default" 
                          variant="bordered"
                          className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                        >
                          Save Template
                        </Button>
                        <Button 
                          color="default" 
                          variant="bordered"
                          className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                        >
                          Schedule Recurring
                        </Button>
                      </div>
                    </div>
                  </div>
                </Tab>

                <Tab key="templates" title="Templates">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                        <h4 className="text-lg font-semibold text-white">Standard Templates</h4>
                      </div>
                      <div className="space-y-2">
                        {reportTemplates.map((template, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                            <span className="text-sm text-gray-300">• {template}</span>
                            <Button 
                              size="sm" 
                              color="primary" 
                              variant="light"
                              className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                            >
                              Use
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                        <h4 className="text-lg font-semibold text-white">Custom Templates (3)</h4>
                      </div>
                      <div className="space-y-2">
                        {customTemplates.map((template, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                            <span className="text-sm text-gray-300">• {template}</span>
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                color="primary" 
                                variant="light"
                                className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                              >
                                Use
                              </Button>
                              <Button 
                                size="sm" 
                                color="default" 
                                variant="light"
                                className="bg-white/10 text-white hover:bg-white/20"
                              >
                                Edit
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4">
                        <Button 
                          color="primary" 
                          variant="solid" 
                          className="w-full bg-blue-500 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-600 transition-all duration-200"
                        >
                          Create New Template
                        </Button>
                      </div>
                    </div>
                  </div>
                </Tab>

                <Tab key="scheduled" title="Scheduled Reports">
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mt-4">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-1 h-6 bg-yellow-500 rounded-full"></div>
                      <h4 className="text-lg font-semibold text-white">Scheduled Report Management</h4>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold text-white mb-3">ACTIVE SCHEDULES</h5>
                        <div className="space-y-2">
                          {scheduledReports.map((report) => (
                            <div key={report.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                              <div>
                                <div className="font-medium text-white">{report.title}</div>
                                <div className="text-sm text-gray-400">{report.frequency}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-white">{report.nextDue}</div>
                                <Chip
                                  size="sm"
                                  color={getStatusColor(report.status)}
                                  variant="flat"
                                  className={report.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}
                                >
                                  {report.status}
                                </Chip>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold text-white mb-3">NEXT REPORTS DUE</h5>
                        <div className="space-y-2 text-sm text-gray-300">
                          <div>• High-Risk Summary: Tomorrow 9:00 AM</div>
                          <div>• TechCorp Quarterly: Dec 5, 2024</div>
                          <div>• Regulatory Digest: Friday 5:00 PM</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          color="primary" 
                          variant="solid"
                          className="bg-blue-500 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-600 transition-all duration-200"
                        >
                          Add Schedule
                        </Button>
                        <Button 
                          color="default" 
                          variant="bordered"
                          className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                        >
                          Modify Schedule
                        </Button>
                        <Button 
                          color="default" 
                          variant="bordered"
                          className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                        >
                          Pause All
                        </Button>
                      </div>
                    </div>
                  </div>
                </Tab>

                <Tab key="archive" title="Archive">
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mt-4">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-1 h-6 bg-gray-500 rounded-full"></div>
                      <h4 className="text-lg font-semibold text-white">Report Archive</h4>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold text-white mb-3">RECENT REPORTS (Last 30 Days)</h5>
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                          <Table aria-label="Recent Reports" className="text-white">
                            <TableHeader>
                              <TableColumn className="text-white font-semibold">DATE</TableColumn>
                              <TableColumn className="text-white font-semibold">TITLE</TableColumn>
                              <TableColumn className="text-white font-semibold">TYPE</TableColumn>
                              <TableColumn className="text-white font-semibold">FORMAT</TableColumn>
                              <TableColumn className="text-white font-semibold">SIZE</TableColumn>
                              <TableColumn className="text-white font-semibold">ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody>
                              {recentReports.map((report) => (
                                <TableRow key={report.id} className="hover:bg-white/5">
                                  <TableCell className="text-gray-300">{report.date}</TableCell>
                                  <TableCell>
                                    <div>
                                      <div className="font-medium text-white">{report.title}</div>
                                      {report.client && (
                                        <div className="text-sm text-gray-400">{report.client}</div>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      size="sm"
                                      color={getReportTypeColor(report.type)}
                                      variant="flat"
                                      className="bg-blue-500/20 text-blue-400"
                                    >
                                      {report.type.replace('-', ' ')}
                                    </Chip>
                                  </TableCell>
                                  <TableCell className="text-gray-300">{report.format}</TableCell>
                                  <TableCell className="text-gray-300">{report.size}</TableCell>
                                  <TableCell>
                                    <Button 
                                      size="sm" 
                                      color="primary" 
                                      variant="light"
                                      className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                                    >
                                      Download
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          color="default" 
                          variant="bordered"
                          className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                        >
                          Search Archive
                        </Button>
                        <Button 
                          color="default" 
                          variant="bordered"
                          className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                        >
                          Filter by Client
                        </Button>
                        <Button 
                          color="default" 
                          variant="bordered"
                          className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                        >
                          Export List
                        </Button>
                      </div>

                      <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                        <h5 className="font-semibold text-white mb-2">STORAGE USAGE</h5>
                        <div className="text-sm text-gray-300">
                          2.3 GB used of 10 GB limit | 156 reports archived
                        </div>
                        <Progress 
                          value={23} 
                          className="mt-2"
                          classNames={{
                            track: "bg-white/10",
                            indicator: "bg-blue-500"
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}