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
    <div className="h-full lg:px-6">
      <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
        
        {/* Main Content */}
        <div className="mt-6 gap-6 flex flex-col w-full">
          {/* Reports Dashboard Header */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold">Professional Reports Center</h3>
                <p className="text-default-500">
                  Jane Doe, Tax Manager CPA | Generated This Month: 47 | Client Reports: 32 | Compliance Reports: 15
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button color="primary" variant="solid">
                Quick Generate
              </Button>
              <Button color="default" variant="bordered">
                Report Templates
              </Button>
              <Button color="default" variant="bordered">
                Scheduled Reports
              </Button>
              <Button color="default" variant="bordered">
                Archive
              </Button>
            </div>
          </div>

          {/* Report Categories */}
          <Card>
            <CardHeader>
              <h4 className="text-lg font-semibold">Report Categories</h4>
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  color={selectedCategory === 'all' ? 'primary' : 'default'}
                  variant={selectedCategory === 'all' ? 'solid' : 'bordered'}
                  onPress={() => setSelectedCategory('all')}
                >
                  All Reports
                </Button>
                <Button
                  size="sm"
                  color={selectedCategory === 'client-compliance' ? 'primary' : 'default'}
                  variant={selectedCategory === 'client-compliance' ? 'solid' : 'bordered'}
                  onPress={() => setSelectedCategory('client-compliance')}
                >
                  Client Compliance
                </Button>
                <Button
                  size="sm"
                  color={selectedCategory === 'regulatory-analysis' ? 'primary' : 'default'}
                  variant={selectedCategory === 'regulatory-analysis' ? 'solid' : 'bordered'}
                  onPress={() => setSelectedCategory('regulatory-analysis')}
                >
                  Regulatory Analysis
                </Button>
                <Button
                  size="sm"
                  color={selectedCategory === 'professional-audit' ? 'primary' : 'default'}
                  variant={selectedCategory === 'professional-audit' ? 'solid' : 'bordered'}
                  onPress={() => setSelectedCategory('professional-audit')}
                >
                  Professional Audit
                </Button>
                <Button
                  size="sm"
                  color={selectedCategory === 'portfolio-summary' ? 'primary' : 'default'}
                  variant={selectedCategory === 'portfolio-summary' ? 'solid' : 'bordered'}
                  onPress={() => setSelectedCategory('portfolio-summary')}
                >
                  Portfolio Summary
                </Button>
                <Button
                  size="sm"
                  color={selectedCategory === 'state-updates' ? 'primary' : 'default'}
                  variant={selectedCategory === 'state-updates' ? 'solid' : 'bordered'}
                  onPress={() => setSelectedCategory('state-updates')}
                >
                  State Updates
                </Button>
                <Button
                  size="sm"
                  color={selectedCategory === 'custom' ? 'primary' : 'default'}
                  variant={selectedCategory === 'custom' ? 'solid' : 'bordered'}
                  onPress={() => setSelectedCategory('custom')}
                >
                  Custom Reports
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Report Generation Interface */}
          <Tabs aria-label="Report Generation">
            <Tab key="client-compliance" title="Client Compliance">
              <Card>
                <CardHeader>
                  <h4 className="text-lg font-semibold">Client Nexus Compliance Report</h4>
                </CardHeader>
                <CardBody>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Client</label>
                        <Input
                          placeholder="TechCorp SaaS"
                          value={selectedClient}
                          onValueChange={setSelectedClient}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Period</label>
                        <Input
                          placeholder="Q4 2024"
                          value={selectedPeriod}
                          onValueChange={setSelectedPeriod}
                        />
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold mb-3">Report Components</h5>
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
                              className="rounded"
                            />
                            <span className="text-sm">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold mb-3">Delivery Options</h5>
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
                              className="rounded"
                            />
                            <span className="text-sm">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button color="primary" variant="solid">
                        Generate Report
                      </Button>
                      <Button color="default" variant="bordered">
                        Preview
                      </Button>
                      <Button color="default" variant="bordered">
                        Schedule Recurring
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>

            <Tab key="professional-audit" title="Professional Audit">
              <Card>
                <CardHeader>
                  <h4 className="text-lg font-semibold">Professional Liability Audit Package</h4>
                </CardHeader>
                <CardBody>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-semibold">CLIENT:</span> TechCorp SaaS
                      </div>
                      <div>
                        <span className="font-semibold">PERIOD:</span> 2024 Annual
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold mb-3">AUDIT TRAIL COMPONENTS</h5>
                      <div className="space-y-2 text-sm">
                        <div>├─ Professional decisions: 8 documented</div>
                        <div>├─ Statutory citations: Complete references</div>
                        <div>├─ Client communications: All logged</div>
                        <div>├─ Data validation records: Quality scores</div>
                        <div>├─ Regulatory updates: Applied changes</div>
                        <div>└─ Peer review documentation: 3 reviews</div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold mb-3">PROFESSIONAL STANDARDS COMPLIANCE</h5>
                      <div className="space-y-2 text-sm">
                        <div>├─ AICPA guidelines: Fully compliant</div>
                        <div>├─ State CPA requirements: Met</div>
                        <div>├─ Documentation completeness: 100%</div>
                        <div>└─ Court defensibility: Verified</div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold mb-3">PACKAGE CONTENTS</h5>
                      <div className="space-y-1 text-sm">
                        <div>• Executive summary (2 pages)</div>
                        <div>• Decision chronology (12 pages)</div>
                        <div>• Supporting documentation (45 pages)</div>
                        <div>• Regulatory references (8 pages)</div>
                        <div>• Professional certifications</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button color="primary" variant="solid">
                        Generate Audit Package
                      </Button>
                      <Button color="default" variant="bordered">
                        Legal Review
                      </Button>
                      <Button color="default" variant="bordered">
                        Archive Copy
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>

            <Tab key="portfolio-analytics" title="Portfolio Analytics">
              <Card>
                <CardHeader>
                  <h4 className="text-lg font-semibold">Client Portfolio Risk Analysis</h4>
                </CardHeader>
                <CardBody>
                  <div className="space-y-6">
                    <div>
                      <h5 className="font-semibold mb-3">PORTFOLIO OVERVIEW</h5>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>Total Clients: 24 | High Risk: 8 | Critical Alerts: 3</div>
                        <div>Total Exposure: $284,500 | Avg per Client: $11,854</div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold mb-3">RISK DISTRIBUTION</h5>
                      <div className="space-y-2 text-sm">
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
                      <h5 className="font-semibold mb-3">STATE ANALYSIS</h5>
                      <div className="space-y-2 text-sm">
                        <div>California: 15 clients, $156K exposure, 3 critical</div>
                        <div>New York: 12 clients, $78K exposure, 2 warnings</div>
                        <div>Texas: 8 clients, $34K exposure, 1 warning</div>
                        <div>Other States: Combined $16K exposure</div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold mb-3">PERFORMANCE METRICS</h5>
                      <div className="space-y-2 text-sm">
                        <div>Penalties Prevented: $1.2M this year</div>
                        <div>Avg Decision Time: 2.3 days</div>
                        <div>Client Satisfaction: 96%</div>
                        <div>Professional Standards: 100% compliant</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button color="primary" variant="solid">
                        Export Analysis
                      </Button>
                      <Button color="default" variant="bordered">
                        Share with Partner
                      </Button>
                      <Button color="default" variant="bordered">
                        Schedule Review
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>

            <Tab key="quick-generator" title="Quick Generator">
              <Card>
                <CardHeader>
                  <h4 className="text-lg font-semibold">Quick Report Generation</h4>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Report Type</label>
                        <Input placeholder="Client Status Update" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Client/Scope</label>
                        <Input placeholder="All Assigned Clients" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Time Period</label>
                        <Input placeholder="Last 30 Days" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Detail Level</label>
                        <Input placeholder="Executive Summary" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Output Format</label>
                        <div className="flex gap-2">
                          <Button size="sm" color="primary" variant="solid">PDF</Button>
                          <Button size="sm" color="default" variant="bordered">Excel</Button>
                          <Button size="sm" color="default" variant="bordered">PowerPoint</Button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Delivery</label>
                        <div className="flex gap-2">
                          <Button size="sm" color="primary" variant="solid">Download</Button>
                          <Button size="sm" color="default" variant="bordered">Email</Button>
                          <Button size="sm" color="default" variant="bordered">Client Portal</Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button color="primary" variant="solid">
                        Generate Now
                      </Button>
                      <Button color="default" variant="bordered">
                        Save Template
                      </Button>
                      <Button color="default" variant="bordered">
                        Schedule Recurring
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>

            <Tab key="templates" title="Templates">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <h4 className="text-lg font-semibold">Standard Templates</h4>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-2">
                      {reportTemplates.map((template, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-default-50 rounded">
                          <span className="text-sm">• {template}</span>
                          <Button size="sm" color="primary" variant="light">
                            Use
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <h4 className="text-lg font-semibold">Custom Templates (3)</h4>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-2">
                      {customTemplates.map((template, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-default-50 rounded">
                          <span className="text-sm">• {template}</span>
                          <div className="flex gap-1">
                            <Button size="sm" color="primary" variant="light">
                              Use
                            </Button>
                            <Button size="sm" color="default" variant="light">
                              Edit
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Button color="primary" variant="solid" className="w-full">
                        Create New Template
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </Tab>

            <Tab key="scheduled" title="Scheduled Reports">
              <Card>
                <CardHeader>
                  <h4 className="text-lg font-semibold">Scheduled Report Management</h4>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold mb-3">ACTIVE SCHEDULES</h5>
                      <div className="space-y-2">
                        {scheduledReports.map((report) => (
                          <div key={report.id} className="flex items-center justify-between p-3 bg-default-50 rounded">
                            <div>
                              <div className="font-medium">{report.title}</div>
                              <div className="text-sm text-default-500">{report.frequency}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">{report.nextDue}</div>
                              <Chip
                                size="sm"
                                color={getStatusColor(report.status)}
                                variant="flat"
                              >
                                {report.status}
                              </Chip>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold mb-3">NEXT REPORTS DUE</h5>
                      <div className="space-y-2 text-sm">
                        <div>• High-Risk Summary: Tomorrow 9:00 AM</div>
                        <div>• TechCorp Quarterly: Dec 5, 2024</div>
                        <div>• Regulatory Digest: Friday 5:00 PM</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button color="primary" variant="solid">
                        Add Schedule
                      </Button>
                      <Button color="default" variant="bordered">
                        Modify Schedule
                      </Button>
                      <Button color="default" variant="bordered">
                        Pause All
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>

            <Tab key="archive" title="Archive">
              <Card>
                <CardHeader>
                  <h4 className="text-lg font-semibold">Report Archive</h4>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold mb-3">RECENT REPORTS (Last 30 Days)</h5>
                      <Table aria-label="Recent Reports">
                        <TableHeader>
                          <TableColumn>DATE</TableColumn>
                          <TableColumn>TITLE</TableColumn>
                          <TableColumn>TYPE</TableColumn>
                          <TableColumn>FORMAT</TableColumn>
                          <TableColumn>SIZE</TableColumn>
                          <TableColumn>ACTIONS</TableColumn>
                        </TableHeader>
                        <TableBody>
                          {recentReports.map((report) => (
                            <TableRow key={report.id}>
                              <TableCell>{report.date}</TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{report.title}</div>
                                  {report.client && (
                                    <div className="text-sm text-default-500">{report.client}</div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  size="sm"
                                  color={getReportTypeColor(report.type)}
                                  variant="flat"
                                >
                                  {report.type.replace('-', ' ')}
                                </Chip>
                              </TableCell>
                              <TableCell>{report.format}</TableCell>
                              <TableCell>{report.size}</TableCell>
                              <TableCell>
                                <Button size="sm" color="primary" variant="light">
                                  Download
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="flex gap-2">
                      <Button color="default" variant="bordered">
                        Search Archive
                      </Button>
                      <Button color="default" variant="bordered">
                        Filter by Client
                      </Button>
                      <Button color="default" variant="bordered">
                        Export List
                      </Button>
                    </div>

                    <div className="mt-4 p-4 bg-default-50 rounded">
                      <h5 className="font-semibold mb-2">STORAGE USAGE</h5>
                      <div className="text-sm">
                        2.3 GB used of 10 GB limit | 156 reports archived
                      </div>
                      <Progress value={23} className="mt-2" />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
