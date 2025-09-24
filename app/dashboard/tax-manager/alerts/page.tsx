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
  Textarea
} from "@nextui-org/react";

// Alert data structure
interface Alert {
  id: string;
  client: string;
  state: string;
  issue: string;
  currentAmount: string;
  threshold: string;
  deadline: string;
  penaltyRisk: string;
  priority: 'high' | 'medium' | 'low';
  status: 'new' | 'in-progress' | 'resolved';
  actions: string[];
  details: string;
}

// Sample alert data
const alerts: Alert[] = [
  {
    id: "1",
    client: "TechCorp SaaS",
    state: "CA",
    issue: "California sales exceeded $500K limit",
    currentAmount: "$525K",
    threshold: "$500K",
    deadline: "15 days",
    penaltyRisk: "$25K - $45K",
    priority: "high",
    status: "new",
    actions: ["Register for CA sales tax", "Start collecting tax immediately", "Consider voluntary disclosure"],
    details: "Client exceeded the $500K California threshold. Must register to avoid penalties. Recommend immediate registration and voluntary disclosure discussion."
  },
  {
    id: "2",
    client: "RetailChain LLC",
    state: "NY",
    issue: "New York approaching $500K + 100 transactions",
    currentAmount: "$485K",
    threshold: "$500K",
    deadline: "30 days",
    penaltyRisk: "$15K - $30K",
    priority: "high",
    status: "new",
    actions: ["Monitor and prepare registration", "Track transaction count", "Prepare compliance documentation"],
    details: "Client is approaching both the $500K revenue threshold and 100 transaction threshold in New York. Monitor closely and prepare for registration."
  },
  {
    id: "3",
    client: "ManufacturingCo",
    state: "TX",
    issue: "Texas sales at $465K of $500K limit",
    currentAmount: "$465K",
    threshold: "$500K",
    deadline: "45 days",
    penaltyRisk: "$10K - $25K",
    priority: "medium",
    status: "in-progress",
    actions: ["Track Q1 2025 projections", "Monitor monthly sales", "Prepare registration materials"],
    details: "Client is at 93% of Texas threshold. Track Q1 2025 projections and prepare for potential registration."
  },
  {
    id: "4",
    client: "ServicesCorp",
    state: "WA",
    issue: "Washington B&O tax implications",
    currentAmount: "$320K",
    threshold: "$500K",
    deadline: "60 days",
    penaltyRisk: "$5K - $15K",
    priority: "medium",
    status: "new",
    actions: ["Review B&O tax requirements", "Assess business activities", "Prepare compliance plan"],
    details: "Client has business activities in Washington that may trigger B&O tax obligations. Review specific activities and prepare compliance plan."
  },
  {
    id: "5",
    client: "StartupInc",
    state: "FL",
    issue: "Florida sales tax registration needed",
    currentAmount: "$180K",
    threshold: "$500K",
    deadline: "90 days",
    penaltyRisk: "$2K - $8K",
    priority: "low",
    status: "new",
    actions: ["Monitor sales growth", "Prepare registration timeline", "Review business structure"],
    details: "Client is growing in Florida but not yet at threshold. Monitor sales growth and prepare registration timeline."
  },
  {
    id: "6",
    client: "EcommercePro",
    state: "IL",
    issue: "Illinois marketplace facilitator rules",
    currentAmount: "$750K",
    threshold: "$500K",
    deadline: "7 days",
    penaltyRisk: "$35K - $60K",
    priority: "high",
    status: "new",
    actions: ["Register as marketplace facilitator", "Update tax collection systems", "Review historical sales"],
    details: "Client exceeded Illinois threshold and must register as marketplace facilitator. High penalty risk due to delayed registration."
  },
  {
    id: "7",
    client: "LocalBusiness",
    state: "CO",
    issue: "Colorado economic nexus threshold",
    currentAmount: "$420K",
    threshold: "$500K",
    deadline: "20 days",
    penaltyRisk: "$8K - $18K",
    priority: "medium",
    status: "in-progress",
    actions: ["Monitor Q4 sales", "Prepare registration documents", "Review business activities"],
    details: "Client is approaching Colorado's economic nexus threshold. Monitor Q4 sales closely and prepare for potential registration."
  },
  {
    id: "8",
    client: "TechStartup",
    state: "MA",
    issue: "Massachusetts sales tax registration",
    currentAmount: "$150K",
    threshold: "$500K",
    deadline: "120 days",
    penaltyRisk: "$1K - $5K",
    priority: "low",
    status: "new",
    actions: ["Track growth metrics", "Plan registration timeline", "Review business model"],
    details: "Client is growing in Massachusetts but not yet at threshold. Plan for future registration as business scales."
  },
  {
    id: "9",
    client: "RetailGiant",
    state: "PA",
    issue: "Pennsylvania marketplace sales",
    currentAmount: "$680K",
    threshold: "$500K",
    deadline: "10 days",
    penaltyRisk: "$30K - $50K",
    priority: "high",
    status: "new",
    actions: ["Register immediately", "Implement tax collection", "File voluntary disclosure"],
    details: "Client significantly exceeded Pennsylvania threshold. Immediate registration required to minimize penalty exposure."
  },
  {
    id: "10",
    client: "ServiceProvider",
    state: "OH",
    issue: "Ohio commercial activity tax",
    currentAmount: "$380K",
    threshold: "$500K",
    deadline: "35 days",
    penaltyRisk: "$6K - $15K",
    priority: "medium",
    status: "resolved",
    actions: ["Monitor monthly sales", "Prepare CAT registration", "Review business structure"],
    details: "Client approaching Ohio's commercial activity tax threshold. Registration completed and monitoring in place."
  },
  {
    id: "11",
    client: "OnlineRetailer",
    state: "NJ",
    issue: "New Jersey sales tax nexus",
    currentAmount: "$520K",
    threshold: "$500K",
    deadline: "12 days",
    penaltyRisk: "$20K - $40K",
    priority: "high",
    status: "new",
    actions: ["Register for NJ sales tax", "Update e-commerce platform", "Train staff on tax collection"],
    details: "Client exceeded New Jersey threshold. Registration required to avoid penalties and ensure compliance."
  },
  {
    id: "12",
    client: "ManufacturingHub",
    state: "MI",
    issue: "Michigan sales tax registration",
    currentAmount: "$290K",
    threshold: "$500K",
    deadline: "50 days",
    penaltyRisk: "$4K - $12K",
    priority: "medium",
    status: "in-progress",
    actions: ["Track manufacturing sales", "Prepare registration materials", "Review nexus activities"],
    details: "Client approaching Michigan threshold through manufacturing activities. Monitor sales and prepare for registration."
  }
];

// Priority filter options
const priorityOptions = [
  { key: "all", label: "All Alerts" },
  { key: "high", label: "High Priority" },
  { key: "medium", label: "Medium Priority" },
  { key: "low", label: "Low Priority" }
];

// Status filter options
const statusOptions = [
  { key: "all", label: "All Status" },
  { key: "new", label: "New" },
  { key: "in-progress", label: "In Progress" },
  { key: "resolved", label: "Resolved" }
];

export default function TaxManagerAlerts() {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [decision, setDecision] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Filter alerts based on selected filters
  const filteredAlerts = alerts.filter(alert => {
    const priorityMatch = priorityFilter === "all" || alert.priority === priorityFilter;
    const statusMatch = statusFilter === "all" || alert.status === statusFilter;
    return priorityMatch && statusMatch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'primary';
      case 'in-progress': return 'warning';
      case 'resolved': return 'success';
      default: return 'default';
    }
  };

  const handleAlertSelect = (alert: Alert) => {
    setSelectedAlert(alert);
    setDecision("");
    setReasoning("");
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedAlert(null);
    setDecision("");
    setReasoning("");
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

  const handleSaveDecision = () => {
    if (selectedAlert && decision && reasoning) {
      // Here you would typically save the decision to your backend
      console.log("Decision saved:", { alert: selectedAlert.id, decision, reasoning });
      // Update alert status or show success message
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-6 relative">
        <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
          
          {/* Main Content - Full Width Table */}
          <div className="mt-6 gap-6 flex flex-col w-full">
            {/* Minimal KPI Section */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-1 h-8 bg-red-500 rounded-full"></div>
              <h2 className="text-2xl font-semibold text-white tracking-tight">Nexus Alerts</h2>
            </div>
            
            {/* Minimal KPI Stats */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-500">{filteredAlerts.filter(a => a.priority === 'high').length}</div>
                    <div className="text-gray-400 text-xs font-medium">High Priority</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-500">{filteredAlerts.filter(a => a.priority === 'medium').length}</div>
                    <div className="text-gray-400 text-xs font-medium">Medium Priority</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{filteredAlerts.length}</div>
                    <div className="text-gray-400 text-xs font-medium">Total Alerts</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-white text-sm font-medium">{filteredAlerts.length} alerts need attention</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                      priorityFilter === "high" 
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    onPress={() => setPriorityFilter(priorityFilter === "high" ? "all" : "high")}
                  >
                    High Priority
                  </Button>
                  <Button
                    size="sm"
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                      priorityFilter === "all" 
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    onPress={() => setPriorityFilter("all")}
                  >
                    All Alerts
                  </Button>
                  <Button
                    size="sm"
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                      statusFilter === "resolved" 
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    onPress={() => setStatusFilter("resolved")}
                  >
                    Completed
                  </Button>
                </div>
              </div>
            </div>

          {/* Alerts Table */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <Table aria-label="Nexus Alerts" className="text-white">
              <TableHeader>
                <TableColumn className="text-white font-semibold">CLIENT</TableColumn>
                <TableColumn className="text-white font-semibold">ISSUE</TableColumn>
                <TableColumn className="text-white font-semibold">STATE</TableColumn>
                <TableColumn className="text-white font-semibold">AMOUNT</TableColumn>
                <TableColumn className="text-white font-semibold">DEADLINE</TableColumn>
                <TableColumn className="text-white font-semibold">PRIORITY</TableColumn>
                <TableColumn className="text-white font-semibold">STATUS</TableColumn>
                <TableColumn className="text-white font-semibold">ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredAlerts.map((alert) => (
                  <TableRow 
                    key={alert.id}
                    className={`cursor-pointer hover:bg-white/5 transition-colors duration-200 ${
                      selectedAlert?.id === alert.id ? 'bg-blue-500/10 border-l-4 border-l-blue-500' : ''
                    }`}
                    onClick={() => handleAlertSelect(alert)}
                  >
                    <TableCell>
                      <div className="text-white font-semibold">
                        {alert.client}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="text-white font-medium text-sm">
                          {alert.issue}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                        {alert.state}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-white font-medium">
                          {alert.currentAmount}
                        </div>
                        <div className="text-gray-400 text-xs">
                          of {alert.threshold}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-white text-sm font-medium">
                        {alert.deadline}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`px-2 py-1 ${
                        alert.priority === 'high' ? 'bg-red-500' :
                        alert.priority === 'medium' ? 'bg-orange-500' :
                        'bg-green-500'
                      } rounded-full`}>
                        <span className="text-white text-xs font-semibold">{alert.priority.toUpperCase()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`px-2 py-1 ${
                        alert.status === 'new' ? 'bg-blue-500' :
                        alert.status === 'in-progress' ? 'bg-orange-500' :
                        'bg-green-500'
                      } rounded-full`}>
                        <span className="text-white text-xs font-semibold">{alert.status.replace('-', ' ').toUpperCase()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg font-medium transition-all duration-200"
                        onPress={() => handleAlertSelect(alert)}
                      >
                        Review Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          </div>
        </div>
      </div>

      {/* Sliding Alert Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-full w-1/2 bg-black/95 backdrop-blur-xl border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Panel Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-6 bg-red-500 rounded-full"></div>
              <h3 className="text-white text-lg font-semibold tracking-tight">Alert Details</h3>
            </div>
            <Button
              isIconOnly
              size="sm"
              onPress={handleClosePanel}
              className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {selectedAlert ? (
              <div className="space-y-6">
                {/* Alert Details Card */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white text-xl font-bold tracking-tight">{selectedAlert.client} Alert</h4>
                    <div className={`px-3 py-1 ${
                      selectedAlert.priority === 'high' ? 'bg-red-500' :
                      selectedAlert.priority === 'medium' ? 'bg-orange-500' :
                      'bg-green-500'
                    } rounded-full`}>
                      <span className="text-white text-xs font-semibold">{selectedAlert.priority.toUpperCase()} PRIORITY</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-white font-semibold mb-2">Problem:</h5>
                      <p className="text-gray-400 text-sm">{selectedAlert.issue}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-white font-semibold mb-1">Current Amount:</h5>
                        <p className="text-gray-400 text-sm">{selectedAlert.currentAmount}</p>
                      </div>
                      <div>
                        <h5 className="text-white font-semibold mb-1">Deadline:</h5>
                        <p className="text-gray-400 text-sm">{selectedAlert.deadline}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-white font-semibold mb-1">Penalty Risk:</h5>
                      <p className="text-red-400 text-sm font-medium">{selectedAlert.penaltyRisk}</p>
                    </div>
                    
                    <div>
                      <h5 className="text-white font-semibold mb-2">What to do:</h5>
                      <ul className="text-gray-400 text-sm space-y-1">
                        {selectedAlert.actions.map((action, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2 text-blue-400">{index + 1}.</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200">
                        Make Decision
                      </Button>
                      <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg font-medium transition-all duration-200">
                        Need Help
                      </Button>
                      <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg font-medium transition-all duration-200">
                        Talk to Client
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Decision Form */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h4 className="text-white text-lg font-semibold tracking-tight">Decision for {selectedAlert.client}</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-white font-semibold mb-2">My recommendation:</h5>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                            decision === "register-immediately" 
                              ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' 
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                          onPress={() => setDecision("register-immediately")}
                        >
                          Register immediately
                        </Button>
                        <Button
                          size="sm"
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                            decision === "monitor-closely" 
                              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' 
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                          onPress={() => setDecision("monitor-closely")}
                        >
                          Monitor closely
                        </Button>
                        <Button
                          size="sm"
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                            decision === "schedule-review" 
                              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                          onPress={() => setDecision("schedule-review")}
                        >
                          Schedule review
                        </Button>
                        <Button
                          size="sm"
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                            decision === "escalate-partner" 
                              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25' 
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                          onPress={() => setDecision("escalate-partner")}
                        >
                          Escalate to partner
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-white font-semibold mb-2">Why this decision:</h5>
                      <Textarea
                        placeholder="Explain your reasoning..."
                        value={reasoning}
                        onValueChange={setReasoning}
                        minRows={3}
                        className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                        classNames={{
                          input: "text-white",
                          inputWrapper: "bg-white/5 border-white/10 hover:border-white/20 focus-within:border-blue-500/50"
                        }}
                      />
                    </div>
                    
                    <div>
                      <h5 className="text-white font-semibold mb-2">Next steps:</h5>
                      <div className="flex gap-2 flex-wrap">
                        <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg font-medium transition-all duration-200">
                          Schedule client call
                        </Button>
                        <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg font-medium transition-all duration-200">
                          Prepare registration docs
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        className="bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-200 shadow-lg shadow-green-500/25"
                        onPress={handleSaveDecision}
                        isDisabled={!decision || !reasoning}
                      >
                        Save Decision
                      </Button>
                      <Button size="sm" className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg font-medium transition-all duration-200">
                        Send to Managing Partner
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h4 className="text-white text-lg font-semibold mb-2">
                    Select an Alert
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Choose an alert from the table to view details and make decisions
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={handleClosePanel}
        />
      )}
    </div>
  );
}
