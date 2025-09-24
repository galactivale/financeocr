"use client";
import React, { useState, useRef, useEffect } from "react";
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
  Input
} from "@nextui-org/react";

// Client data structure
interface Client {
  id: string;
  name: string;
  industry: string;
  revenue: string;
  riskLevel: 'critical' | 'high' | 'warning' | 'low';
  totalExposure: string;
  assignedSince: string;
  lastReview: string;
  nextReview: string;
  activeAlerts: number;
  states: {
    state: string;
    amount: string;
    threshold: string;
    status: 'exceeded' | 'approaching' | 'monitoring' | 'compliant';
    transactions?: number;
  }[];
  decisions: {
    date: string;
    decision: string;
    reasoning: string;
  }[];
  actionItems: {
    task: string;
    dueDate: string;
    status: 'pending' | 'in-progress' | 'completed';
  }[];
}

// Sample client data
const clients: Client[] = [
  {
    id: "1",
    name: "TechCorp SaaS",
    industry: "Technology",
    revenue: "$2.1M",
    riskLevel: "critical",
    totalExposure: "$85K",
    assignedSince: "Jan 2024",
    lastReview: "Nov 15, 2024",
    nextReview: "Dec 15, 2024",
    activeAlerts: 3,
    states: [
      { state: "CA", amount: "$525K", threshold: "$500K", status: "exceeded" },
      { state: "NY", amount: "$89K", threshold: "$500K", status: "approaching", transactions: 95 },
      { state: "TX", amount: "$67K", threshold: "$500K", status: "monitoring" },
      { state: "FL", amount: "$28K", threshold: "$500K", status: "compliant" }
    ],
    decisions: [
      {
        date: "Nov 15, 2024",
        decision: "CA nexus exceeded - Registration recommended",
        reasoning: "Client exceeded $500K threshold in California. Immediate registration required to avoid penalties."
      },
      {
        date: "Oct 1, 2024",
        decision: "Quarterly risk assessment - Elevated to high risk",
        reasoning: "Multiple state activities and approaching thresholds in NY and TX."
      }
    ],
    actionItems: [
      { task: "Document CA registration decision", dueDate: "Today", status: "pending" },
      { task: "Schedule client advisory call", dueDate: "Dec 1, 2024", status: "pending" },
      { task: "Review Q4 data validation from staff", dueDate: "Dec 5, 2024", status: "in-progress" }
    ]
  },
  {
    id: "2",
    name: "RetailChain LLC",
    industry: "E-commerce",
    revenue: "$1.8M",
    riskLevel: "warning",
    totalExposure: "$42K",
    assignedSince: "Mar 2024",
    lastReview: "Nov 1, 2024",
    nextReview: "Dec 1, 2024",
    activeAlerts: 2,
    states: [
      { state: "NY", amount: "$485K", threshold: "$500K", status: "approaching" },
      { state: "TX", amount: "$220K", threshold: "$500K", status: "monitoring" },
      { state: "CA", amount: "$180K", threshold: "$500K", status: "monitoring" }
    ],
    decisions: [
      {
        date: "Nov 1, 2024",
        decision: "NY threshold advisory - Monitor Q4 closely",
        reasoning: "Approaching both revenue and transaction thresholds in New York."
      }
    ],
    actionItems: [
      { task: "Monitor NY threshold progress", dueDate: "Dec 1, 2024", status: "in-progress" },
      { task: "Prepare NY registration materials", dueDate: "Dec 10, 2024", status: "pending" }
    ]
  },
  {
    id: "3",
    name: "ManufacturingCo",
    industry: "Manufacturing",
    revenue: "$3.2M",
    riskLevel: "high",
    totalExposure: "$65K",
    assignedSince: "Feb 2024",
    lastReview: "Oct 15, 2024",
    nextReview: "Jan 15, 2025",
    activeAlerts: 1,
    states: [
      { state: "TX", amount: "$465K", threshold: "$500K", status: "approaching" },
      { state: "CA", amount: "$320K", threshold: "$500K", status: "monitoring" },
      { state: "IL", amount: "$280K", threshold: "$500K", status: "monitoring" }
    ],
    decisions: [
      {
        date: "Oct 15, 2024",
        decision: "TX threshold monitoring - Prepare for registration",
        reasoning: "At 93% of Texas threshold. Track Q1 2025 projections."
      }
    ],
    actionItems: [
      { task: "Track Q1 2025 projections", dueDate: "Jan 1, 2025", status: "pending" },
      { task: "Prepare TX registration materials", dueDate: "Jan 10, 2025", status: "pending" }
    ]
  },
  {
    id: "4",
    name: "ServicesCorp",
    industry: "Professional Services",
    revenue: "$950K",
    riskLevel: "low",
    totalExposure: "$15K",
    assignedSince: "Jun 2024",
    lastReview: "Nov 10, 2024",
    nextReview: "Feb 10, 2025",
    activeAlerts: 0,
    states: [
      { state: "WA", amount: "$320K", threshold: "$500K", status: "monitoring" },
      { state: "OR", amount: "$180K", threshold: "$500K", status: "monitoring" }
    ],
    decisions: [
      {
        date: "Nov 10, 2024",
        decision: "WA B&O tax review - Monitor business activities",
        reasoning: "Review specific activities and prepare compliance plan."
      }
    ],
    actionItems: [
      { task: "Review B&O tax requirements", dueDate: "Dec 15, 2024", status: "pending" }
    ]
  }
];

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
    case 'exceeded': return 'danger';
    case 'approaching': return 'warning';
    case 'monitoring': return 'primary';
    case 'compliant': return 'success';
    default: return 'default';
  }
};

export default function TaxManagerClients() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [riskFilter, setRiskFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);

  // Filter clients based on search and risk filter
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'all' || client.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedClient(null);
  };

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        if (isPanelOpen) {
          handleClosePanel();
        }
      }
    };

    if (isPanelOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPanelOpen]);

  // Calculate portfolio stats
  const portfolioStats = {
    totalClients: clients.length,
    highRisk: clients.filter(c => c.riskLevel === 'critical' || c.riskLevel === 'high').length,
    criticalAlerts: clients.reduce((sum, c) => sum + c.activeAlerts, 0),
    totalExposure: clients.reduce((sum, c) => sum + parseInt(c.totalExposure.replace('$', '').replace('K', '')), 0)
  };

  return (
    <div className="h-full lg:px-6 relative">
      <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
        
        {/* Main Content */}
        <div className="mt-6 gap-6 flex flex-col w-full">
          {/* Client Portfolio Overview */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold">Client Portfolio</h3>
                <p className="text-default-500">
                  Jane Doe, Tax Manager | {portfolioStats.totalClients} Assigned Clients | {portfolioStats.highRisk} High Risk | {portfolioStats.criticalAlerts} Critical Alerts | ${portfolioStats.totalExposure}K Total Exposure
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                  variant={viewMode === 'grid' ? 'solid' : 'bordered'}
                  onPress={() => setViewMode('grid')}
                >
                  Grid View
                </Button>
                <Button
                  size="sm"
                  color={viewMode === 'list' ? 'primary' : 'default'}
                  variant={viewMode === 'list' ? 'solid' : 'bordered'}
                  onPress={() => setViewMode('list')}
                >
                  List View
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Search clients..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  size="sm"
                  className="w-64"
                />
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    color={riskFilter === "all" ? "primary" : "default"}
                    variant={riskFilter === "all" ? "solid" : "bordered"}
                    onPress={() => setRiskFilter("all")}
                  >
                    All
                  </Button>
                  <Button
                    size="sm"
                    color={riskFilter === "critical" ? "danger" : "default"}
                    variant={riskFilter === "critical" ? "solid" : "bordered"}
                    onPress={() => setRiskFilter("critical")}
                  >
                    Critical
                  </Button>
                  <Button
                    size="sm"
                    color={riskFilter === "high" ? "warning" : "default"}
                    variant={riskFilter === "high" ? "solid" : "bordered"}
                    onPress={() => setRiskFilter("high")}
                  >
                    High
                  </Button>
                  <Button
                    size="sm"
                    color={riskFilter === "warning" ? "secondary" : "default"}
                    variant={riskFilter === "warning" ? "solid" : "bordered"}
                    onPress={() => setRiskFilter("warning")}
                  >
                    Warning
                  </Button>
                  <Button
                    size="sm"
                    color={riskFilter === "low" ? "success" : "default"}
                    variant={riskFilter === "low" ? "solid" : "bordered"}
                    onPress={() => setRiskFilter("low")}
                  >
                    Low
                  </Button>
                </div>
                <Button size="sm" color="primary" variant="solid">
                  Add Client
                </Button>
              </div>
            </div>
          </div>

          {/* Client Cards/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredClients.map((client) => (
                <Card 
                  key={client.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  onClick={() => handleClientSelect(client)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start w-full">
                      <div>
                        <h4 className="text-lg font-semibold">{client.name}</h4>
                        <p className="text-sm text-default-500">{client.industry} | {client.revenue} Revenue</p>
                      </div>
                      <div className="text-right">
                        <Chip
                          size="sm"
                          color={getRiskColor(client.riskLevel)}
                          variant="flat"
                          className="mb-2"
                        >
                          {client.riskLevel.toUpperCase()}
                        </Chip>
                        <p className="text-sm font-semibold text-danger">{client.totalExposure} Risk</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="pt-0">
                    <div className="space-y-3">
                      {/* State Status */}
                      <div className="space-y-2">
                        {client.states.slice(0, 2).map((state, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="font-medium">{state.state}: {state.amount}</span>
                            <Chip
                              size="sm"
                              color={getStatusColor(state.status)}
                              variant="flat"
                            >
                              {state.status}
                            </Chip>
                          </div>
                        ))}
                        {client.states.length > 2 && (
                          <p className="text-xs text-default-500">+{client.states.length - 2} more states</p>
                        )}
                      </div>

                      {/* Alerts and Review */}
                      <div className="flex justify-between items-center text-sm">
                        <span>Active Alerts: {client.activeAlerts}</span>
                        <span>Last Review: {client.lastReview}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" color="primary" variant="light">
                          Review Alerts
                        </Button>
                        <Button size="sm" color="default" variant="bordered">
                          Client Details
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardBody className="p-0">
                <Table aria-label="Client List">
                  <TableHeader>
                    <TableColumn>CLIENT</TableColumn>
                    <TableColumn>INDUSTRY</TableColumn>
                    <TableColumn>REVENUE</TableColumn>
                    <TableColumn>RISK LEVEL</TableColumn>
                    <TableColumn>EXPOSURE</TableColumn>
                    <TableColumn>ALERTS</TableColumn>
                    <TableColumn>LAST REVIEW</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow 
                        key={client.id}
                        className="cursor-pointer hover:bg-default-50"
                        onClick={() => handleClientSelect(client)}
                      >
                        <TableCell>
                          <div className="font-semibold">{client.name}</div>
                        </TableCell>
                        <TableCell>{client.industry}</TableCell>
                        <TableCell>{client.revenue}</TableCell>
                        <TableCell>
                          <Chip
                            size="sm"
                            color={getRiskColor(client.riskLevel)}
                            variant="flat"
                          >
                            {client.riskLevel.toUpperCase()}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-danger">{client.totalExposure}</span>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="sm"
                            color={client.activeAlerts > 0 ? "danger" : "default"}
                            variant="flat"
                          >
                            {client.activeAlerts}
                          </Chip>
                        </TableCell>
                        <TableCell>{client.lastReview}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" color="primary" variant="light">
                              Review
                            </Button>
                            <Button size="sm" color="default" variant="bordered">
                              Details
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>
          )}
        </div>
      </div>

      {/* Client Detail Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-full w-1/2 bg-background border-l border-divider shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Panel Header */}
          <div className="flex items-center justify-between p-4 border-b border-divider">
            <h3 className="text-lg font-semibold">Client Nexus Profile</h3>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={handleClosePanel}
              className="text-default-500 hover:text-default-700"
            >
              ✕
            </Button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {selectedClient ? (
              <div className="space-y-6">
                {/* Client Overview */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start w-full">
                      <div>
                        <h4 className="text-xl font-bold">{selectedClient.name} - Complete Nexus Profile</h4>
                        <p className="text-sm text-default-500">Industry: {selectedClient.industry} | Revenue: {selectedClient.revenue} annual</p>
                      </div>
                      <Chip
                        size="sm"
                        color={getRiskColor(selectedClient.riskLevel)}
                        variant="flat"
                      >
                        {selectedClient.riskLevel.toUpperCase()} RISK
                      </Chip>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold">Total Exposure:</span>
                        <span className="ml-2 text-danger font-bold">{selectedClient.totalExposure}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Assigned Since:</span>
                        <span className="ml-2">{selectedClient.assignedSince}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Last Review:</span>
                        <span className="ml-2">{selectedClient.lastReview}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Next Review:</span>
                        <span className="ml-2">{selectedClient.nextReview}</span>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Multi-State Status */}
                <Card>
                  <CardHeader>
                    <h4 className="text-lg font-semibold">Multi-State Status</h4>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-3">
                      {selectedClient.states.map((state, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-default-50 rounded-lg">
                          <div>
                            <span className="font-semibold">{state.state}: {state.amount}</span>
                            <span className="text-sm text-default-500 ml-2">of {state.threshold}</span>
                            {state.transactions && (
                              <span className="text-sm text-default-500 ml-2">+ {state.transactions} transactions</span>
                            )}
                          </div>
                          <Chip
                            size="sm"
                            color={getStatusColor(state.status)}
                            variant="flat"
                          >
                            {state.status.toUpperCase()}
                          </Chip>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>

                {/* Professional Decisions History */}
                <Card>
                  <CardHeader>
                    <h4 className="text-lg font-semibold">Professional Decisions History</h4>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-4">
                      {selectedClient.decisions.map((decision, index) => (
                        <div key={index} className="border-l-4 border-l-primary pl-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{decision.decision}</p>
                              <p className="text-sm text-default-600 mt-1">{decision.reasoning}</p>
                            </div>
                            <span className="text-xs text-default-500">{decision.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>

                {/* Current Action Items */}
                <Card>
                  <CardHeader>
                    <h4 className="text-lg font-semibold">Current Action Items</h4>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-3">
                      {selectedClient.actionItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-default-50 rounded-lg">
                          <div>
                            <p className="font-medium">{item.task}</p>
                            <p className="text-sm text-default-500">Due: {item.dueDate}</p>
                          </div>
                          <Chip
                            size="sm"
                            color={item.status === 'completed' ? 'success' : item.status === 'in-progress' ? 'warning' : 'default'}
                            variant="flat"
                          >
                            {item.status.replace('-', ' ').toUpperCase()}
                          </Chip>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button color="primary" variant="solid">
                    Document Decision
                  </Button>
                  <Button color="default" variant="bordered">
                    Schedule Client Call
                  </Button>
                  <Button color="default" variant="bordered">
                    View Alerts
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-default-500 mb-2">
                    Select a Client
                  </h4>
                  <p className="text-sm text-default-400">
                    Choose a client from the portfolio to view detailed nexus profile
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop overlay when panel is open */}
      {isPanelOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300"
          onClick={handleClosePanel}
        />
      )}
    </div>
  );
}
