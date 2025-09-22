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
  };

  const handleSaveDecision = () => {
    if (selectedAlert && decision && reasoning) {
      // Here you would typically save the decision to your backend
      console.log("Decision saved:", { alert: selectedAlert.id, decision, reasoning });
      // Update alert status or show success message
    }
  };

  return (
    <div className="h-full lg:px-6">
      <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
        
        {/* Left Section - Alerts Table */}
        <div className="mt-6 gap-6 flex flex-col w-full xl:max-w-4xl">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold">Nexus Alerts</h3>
                <p className="text-default-500">Jane Doe, Tax Manager | {filteredAlerts.length} alerts need attention</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  color={priorityFilter === "high" ? "danger" : "default"}
                  variant={priorityFilter === "high" ? "solid" : "bordered"}
                  onPress={() => setPriorityFilter(priorityFilter === "high" ? "all" : "high")}
                >
                  High Priority
                </Button>
                <Button
                  size="sm"
                  color="default"
                  variant="bordered"
                  onPress={() => setPriorityFilter("all")}
                >
                  All Alerts
                </Button>
                <Button
                  size="sm"
                  color="success"
                  variant="bordered"
                  onPress={() => setStatusFilter("resolved")}
                >
                  Completed
                </Button>
              </div>
            </div>
          </div>

          {/* Alerts Table */}
          <Card className="w-full">
            <CardBody className="p-0">
              <Table aria-label="Nexus Alerts">
                <TableHeader>
                  <TableColumn>CLIENT</TableColumn>
                  <TableColumn>ISSUE</TableColumn>
                  <TableColumn>STATE</TableColumn>
                  <TableColumn>AMOUNT</TableColumn>
                  <TableColumn>DEADLINE</TableColumn>
                  <TableColumn>PRIORITY</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.map((alert) => (
                    <TableRow 
                      key={alert.id}
                      className={`cursor-pointer hover:bg-default-50 ${selectedAlert?.id === alert.id ? 'bg-primary-50' : ''}`}
                      onClick={() => handleAlertSelect(alert)}
                    >
                      <TableCell>
                        <div className="font-semibold text-default-900">
                          {alert.client}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <div className="font-medium text-default-900 text-sm">
                            {alert.issue}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {alert.state}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-default-900">
                            {alert.currentAmount}
                          </div>
                          <div className="text-xs text-default-500">
                            of {alert.threshold}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-default-600">
                          {alert.deadline}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          color={getPriorityColor(alert.priority)}
                          variant="flat"
                        >
                          {alert.priority.toUpperCase()}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          color={getStatusColor(alert.status)}
                          variant="flat"
                        >
                          {alert.status.replace('-', ' ').toUpperCase()}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          color="primary"
                          variant="light"
                          onPress={() => handleAlertSelect(alert)}
                        >
                          Review Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </div>

        {/* Right Section - Alert Details */}
        <div className="mt-4 gap-2 flex flex-col xl:max-w-md w-full">
          {selectedAlert ? (
            <div className="space-y-4">
              {/* Alert Details Card */}
              <Card className="w-full">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <h4 className="font-bold text-large">{selectedAlert.client} Alert</h4>
                  <Chip
                    size="sm"
                    color={getPriorityColor(selectedAlert.priority)}
                    variant="flat"
                    className="mt-2"
                  >
                    {selectedAlert.priority.toUpperCase()} PRIORITY
                  </Chip>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-default-900 mb-2">Problem:</h5>
                      <p className="text-sm text-default-600">{selectedAlert.issue}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-semibold text-default-900 mb-1">Current Amount:</h5>
                        <p className="text-sm text-default-600">{selectedAlert.currentAmount}</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-default-900 mb-1">Deadline:</h5>
                        <p className="text-sm text-default-600">{selectedAlert.deadline}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-default-900 mb-1">Penalty Risk:</h5>
                      <p className="text-sm text-danger">{selectedAlert.penaltyRisk}</p>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-default-900 mb-2">What to do:</h5>
                      <ul className="text-sm text-default-600 space-y-1">
                        {selectedAlert.actions.map((action, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2">{index + 1}.</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" color="primary" variant="solid">
                        Make Decision
                      </Button>
                      <Button size="sm" color="default" variant="bordered">
                        Need Help
                      </Button>
                      <Button size="sm" color="default" variant="bordered">
                        Talk to Client
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Decision Form */}
              <Card className="w-full">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <h4 className="font-bold text-large">Decision for {selectedAlert.client}</h4>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-default-900 mb-2">My recommendation:</h5>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          color={decision === "register-immediately" ? "primary" : "default"}
                          variant={decision === "register-immediately" ? "solid" : "bordered"}
                          onPress={() => setDecision("register-immediately")}
                        >
                          Register immediately
                        </Button>
                        <Button
                          size="sm"
                          color={decision === "monitor-closely" ? "primary" : "default"}
                          variant={decision === "monitor-closely" ? "solid" : "bordered"}
                          onPress={() => setDecision("monitor-closely")}
                        >
                          Monitor closely
                        </Button>
                        <Button
                          size="sm"
                          color={decision === "schedule-review" ? "primary" : "default"}
                          variant={decision === "schedule-review" ? "solid" : "bordered"}
                          onPress={() => setDecision("schedule-review")}
                        >
                          Schedule review
                        </Button>
                        <Button
                          size="sm"
                          color={decision === "escalate-partner" ? "primary" : "default"}
                          variant={decision === "escalate-partner" ? "solid" : "bordered"}
                          onPress={() => setDecision("escalate-partner")}
                        >
                          Escalate to partner
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-default-900 mb-2">Why this decision:</h5>
                      <Textarea
                        placeholder="Explain your reasoning..."
                        value={reasoning}
                        onValueChange={setReasoning}
                        minRows={3}
                      />
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-default-900 mb-2">Next steps:</h5>
                      <div className="flex gap-2 flex-wrap">
                        <Button size="sm" color="default" variant="bordered">
                          Schedule client call
                        </Button>
                        <Button size="sm" color="default" variant="bordered">
                          Prepare registration docs
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        color="success" 
                        variant="solid"
                        onPress={handleSaveDecision}
                        isDisabled={!decision || !reasoning}
                      >
                        Save Decision
                      </Button>
                      <Button size="sm" color="primary" variant="bordered">
                        Send to Managing Partner
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          ) : (
            <Card className="w-full">
              <CardBody className="flex items-center justify-center py-12">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-default-500 mb-2">
                    Select an Alert
                  </h4>
                  <p className="text-sm text-default-400">
                    Choose an alert from the table to view details and make decisions
                  </p>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
