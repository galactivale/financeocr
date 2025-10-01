"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
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
  Badge,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@nextui-org/react";
import { useNexusAlerts } from "@/hooks/useApi";
import { apiClient } from "@/lib/api";
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Filter, 
  Search, 
  Bell, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Users, 
  ChevronRight,
  Eye,
  Send,
  MessageSquare,
  Phone,
  Mail,
  FileText,
  Shield,
  Zap,
  Target,
  BarChart3
} from "lucide-react";

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

// Backend alert data structure
interface BackendAlert {
  id: string;
  clientId: string;
  stateCode: string;
  alertType: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  thresholdAmount: number | null;
  currentAmount: number;
  deadline: string | null;
  penaltyRisk: number | null;
  status: 'open' | 'acknowledged' | 'resolved';
  createdAt: string;
  client: {
    id: string;
    name: string;
    legalName: string;
    industry: string;
  };
}

// Fallback alert data for testing when API is not available
const fallbackAlerts: Alert[] = [
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
  const [searchTerm, setSearchTerm] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const panelRef = useRef<HTMLDivElement>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // API hook for fetching alerts
  const { data: alertsData, loading: alertsLoading, error: alertsError, refetch: refetchAlerts } = useNexusAlerts({ 
    limit: 100 
  });

  // Transform backend data to frontend format
  const transformBackendAlert = (backendAlert: BackendAlert): Alert => {
    const formatAmount = (amount: number) => `$${(amount / 1000).toFixed(0)}K`;
    const formatThreshold = (threshold: number | null) => threshold ? `$${(threshold / 1000).toFixed(0)}K` : '$500K';
    
    // Calculate days until deadline
    const getDaysUntilDeadline = (deadline: string | null) => {
      if (!deadline) return '90 days';
      const deadlineDate = new Date(deadline);
      const now = new Date();
      const diffTime = deadlineDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? `${diffDays} days` : 'Overdue';
    };

    // Generate penalty risk range
    const getPenaltyRisk = (currentAmount: number, threshold: number | null) => {
      const thresholdAmount = threshold || 500000;
      const excess = Math.max(0, currentAmount - thresholdAmount);
      const minPenalty = Math.round(excess * 0.1 / 1000);
      const maxPenalty = Math.round(excess * 0.2 / 1000);
      return `$${minPenalty}K - $${maxPenalty}K`;
    };

    // Map backend status to frontend status
    const mapStatus = (status: string) => {
      switch (status) {
        case 'open': return 'new';
        case 'acknowledged': return 'in-progress';
        case 'resolved': return 'resolved';
        default: return 'new';
      }
    };

    // Generate actions based on alert type and priority
    const generateActions = (alertType: string, priority: string, stateCode: string) => {
      const baseActions = [
        `Register for ${stateCode} sales tax`,
        'Start collecting tax immediately',
        'Consider voluntary disclosure'
      ];
      
      if (priority === 'high') {
        return [
          'Register immediately',
          'Implement tax collection',
          'File voluntary disclosure'
        ];
      } else if (priority === 'medium') {
        return [
          'Monitor and prepare registration',
          'Track transaction count',
          'Prepare compliance documentation'
        ];
      } else {
        return [
          'Monitor sales growth',
          'Prepare registration timeline',
          'Review business structure'
        ];
      }
    };

    return {
      id: backendAlert.id,
      client: backendAlert.client.name,
      state: backendAlert.stateCode,
      issue: backendAlert.title || `${backendAlert.stateCode} sales tax registration needed`,
      currentAmount: formatAmount(backendAlert.currentAmount),
      threshold: formatThreshold(backendAlert.thresholdAmount),
      deadline: getDaysUntilDeadline(backendAlert.deadline),
      penaltyRisk: getPenaltyRisk(backendAlert.currentAmount, backendAlert.thresholdAmount),
      priority: backendAlert.priority,
      status: mapStatus(backendAlert.status),
      actions: generateActions(backendAlert.alertType, backendAlert.priority, backendAlert.stateCode),
      details: backendAlert.description || `Client has business activities in ${backendAlert.stateCode} that may trigger tax obligations.`
    };
  };

  // Process alerts data
  const alerts: Alert[] = useMemo(() => {
    if (alertsLoading) {
      return [];
    }

    // Use API data if available, otherwise use fallback data
    const dataToUse = alertsData?.alerts && alertsData.alerts.length > 0 
      ? alertsData.alerts 
      : fallbackAlerts;

    if (!dataToUse || dataToUse.length === 0) {
      return fallbackAlerts;
    }

    // Transform backend data to frontend format
    if (alertsData?.alerts && alertsData.alerts.length > 0) {
      return alertsData.alerts.map(transformBackendAlert);
    }

    return dataToUse;
  }, [alertsData, alertsLoading]);

  // Filter alerts based on selected filters
  const filteredAlerts = alerts.filter(alert => {
    const priorityMatch = priorityFilter === "all" || alert.priority === priorityFilter;
    const statusMatch = statusFilter === "all" || alert.status === statusFilter;
    const searchMatch = searchTerm === "" || 
      alert.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.state.toLowerCase().includes(searchTerm.toLowerCase());
    return priorityMatch && statusMatch && searchMatch;
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

  const handleSendToClient = async (alert: Alert) => {
    try {
      // Create a communication for this nexus alert
      const communicationData = {
        organizationId: "94e72054-a98e-41bd-bdb1-e2797623e891", // Demo org ID
        clientId: "688ba252-0613-4e4b-baee-5e2d4caec12e", // Use actual client ID
        alertId: alert.id, // Required for nexus alerts
        type: "email" as const,
        subject: `Nexus Alert: ${alert.issue} - ${alert.state}`,
        content: `Dear Client,\n\nWe have detected a potential nexus threshold issue in ${alert.state}.\n\nDetails:\n- Current Amount: ${alert.currentAmount}\n- Threshold: ${alert.threshold}\n- Deadline: ${alert.deadline}\n- Penalty Risk: ${alert.penaltyRisk}\n\nPlease review this alert and contact us if you have any questions.\n\nBest regards,\nTax Team`,
        professionalReasoning: `Based on our analysis, this alert was triggered because the client's current revenue in ${alert.state} has exceeded the state's nexus threshold. This creates a tax obligation that requires immediate attention to avoid penalties and ensure compliance.`,
        recipientEmail: "client@example.com", // You'll need to get this from client data
      };

      const response = await apiClient.createCommunication(communicationData);
      
      if (response.success) {
        window.alert('Nexus alert communication sent successfully! You can view it in the Communications page.');
      } else {
        window.alert('Failed to send communication. Please try again.');
      }
    } catch (error) {
      console.error('Error creating communication:', error);
      window.alert('Error sending communication. Please try again.');
    }
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
      {/* Apple-style Header */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-white tracking-tight">Nexus Alerts</h1>
                <p className="text-gray-400 text-sm">Monitor and manage tax compliance alerts</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                variant="ghost"
                className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                onPress={refetchAlerts}
                isLoading={alertsLoading}
                startContent={!alertsLoading && <ArrowRight className="w-4 h-4" />}
              >
                {alertsLoading ? 'Refreshing...' : 'Refresh'}
              </Button>
              
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/25"
                onPress={onOpen}
                startContent={<Filter className="w-4 h-4" />}
              >
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Apple-style Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">High Priority</p>
                  <p className="text-3xl font-bold text-red-400 mt-1">
                    {filteredAlerts.filter(a => a.priority === 'high').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Medium Priority</p>
                  <p className="text-3xl font-bold text-orange-400 mt-1">
                    {filteredAlerts.filter(a => a.priority === 'medium').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Alerts</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {filteredAlerts.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Resolved</p>
                  <p className="text-3xl font-bold text-green-400 mt-1">
                    {filteredAlerts.filter(a => a.status === 'resolved').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Apple-style Search and Controls */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl mb-8">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search alerts, clients, or states..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant={priorityFilter === "high" ? "solid" : "ghost"}
                    className={priorityFilter === "high" ? "bg-red-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/10"}
                    onPress={() => setPriorityFilter(priorityFilter === "high" ? "all" : "high")}
                  >
                    High Priority
                  </Button>
                  <Button
                    size="sm"
                    variant={statusFilter === "new" ? "solid" : "ghost"}
                    className={statusFilter === "new" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/10"}
                    onPress={() => setStatusFilter(statusFilter === "new" ? "all" : "new")}
                  >
                    New
                  </Button>
                  <Button
                    size="sm"
                    variant={statusFilter === "resolved" ? "solid" : "ghost"}
                    className={statusFilter === "resolved" ? "bg-green-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/10"}
                    onPress={() => setStatusFilter(statusFilter === "resolved" ? "all" : "resolved")}
                  >
                    Resolved
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant={viewMode === "grid" ? "solid" : "ghost"}
                  className={viewMode === "grid" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/10"}
                  onPress={() => setViewMode("grid")}
                >
                  Grid
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "list" ? "solid" : "ghost"}
                  className={viewMode === "list" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/10"}
                  onPress={() => setViewMode("list")}
                >
                  List
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Apple-style Alerts Display */}
        {alertsLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-gray-400 text-sm font-medium">Loading alerts...</p>
            </div>
          </div>
        ) : alertsError ? (
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
            <CardBody className="p-12 text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <h4 className="text-white text-xl font-semibold mb-2">Error Loading Alerts</h4>
              <p className="text-gray-400 text-sm mb-6">{alertsError}</p>
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/25"
                onPress={refetchAlerts}
              >
                Try Again
              </Button>
            </CardBody>
          </Card>
        ) : filteredAlerts.length === 0 ? (
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
            <CardBody className="p-12 text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-white text-xl font-semibold mb-2">No Alerts Found</h4>
              <p className="text-gray-400 text-sm">
                {priorityFilter !== "all" || statusFilter !== "all" || searchTerm !== ""
                  ? "No alerts match your current filters" 
                  : "No alerts available at the moment"}
              </p>
            </CardBody>
          </Card>
        ) : viewMode === "grid" ? (
          /* Apple-style Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlerts.map((alert) => (
              <Card 
                key={alert.id}
                className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                isPressable
                onPress={() => handleAlertSelect(alert)}
              >
                <CardBody className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                        alert.priority === 'high' ? 'bg-red-500/20' :
                        alert.priority === 'medium' ? 'bg-orange-500/20' :
                        'bg-green-500/20'
                      }`}>
                        {alert.priority === 'high' ? <AlertTriangle className="w-5 h-5 text-red-400" /> :
                         alert.priority === 'medium' ? <Clock className="w-5 h-5 text-orange-400" /> :
                         <CheckCircle className="w-5 h-5 text-green-400" />}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm">{alert.client}</h3>
                        <p className="text-gray-400 text-xs">{alert.state}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      alert.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                      alert.status === 'in-progress' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {alert.status.replace('-', ' ')}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-gray-300 text-sm line-clamp-2">{alert.issue}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-white font-medium text-sm">{alert.currentAmount}</span>
                        <span className="text-gray-400 text-xs">of {alert.threshold}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400 text-xs">{alert.deadline}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-red-400" />
                        <span className="text-red-400 text-xs font-medium">{alert.penaltyRisk}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          /* Apple-style List View */
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
            <CardBody className="p-0">
              <div className="divide-y divide-white/10">
                {filteredAlerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className="p-6 hover:bg-white/5 transition-colors duration-200 cursor-pointer group"
                    onClick={() => handleAlertSelect(alert)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                          alert.priority === 'high' ? 'bg-red-500/20' :
                          alert.priority === 'medium' ? 'bg-orange-500/20' :
                          'bg-green-500/20'
                        }`}>
                          {alert.priority === 'high' ? <AlertTriangle className="w-6 h-6 text-red-400" /> :
                           alert.priority === 'medium' ? <Clock className="w-6 h-6 text-orange-400" /> :
                           <CheckCircle className="w-6 h-6 text-green-400" />}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="text-white font-semibold text-base">{alert.client}</h3>
                            <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400">
                              {alert.state}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm mb-2">{alert.issue}</p>
                          
                          <div className="flex items-center space-x-6 text-xs text-gray-400">
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-3 h-3" />
                              <span>{alert.currentAmount} of {alert.threshold}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{alert.deadline}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Shield className="w-3 h-3 text-red-400" />
                              <span className="text-red-400">{alert.penaltyRisk}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className={`px-3 py-1 rounded-lg text-xs font-medium ${
                          alert.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                          alert.status === 'in-progress' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {alert.status.replace('-', ' ')}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                            onPress={() => handleAlertSelect(alert)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                            onPress={() => handleSendToClient(alert)}
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Enhanced Apple-style Modal for Alert Details */}
      <Modal 
        isOpen={isPanelOpen} 
        onOpenChange={setIsPanelOpen}
        size="4xl"
        classNames={{
          base: "bg-black/95 backdrop-blur-xl border-white/10 rounded-3xl",
          header: "border-b border-white/10 bg-transparent",
          body: "py-6",
          footer: "border-t border-white/10 bg-transparent"
        }}
        backdrop="blur"
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              scale: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              scale: 0.95,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          }
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white text-xl font-bold">Alert Details</h3>
                      <p className="text-gray-400 text-sm">Review and take action on this nexus alert</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                      onPress={onClose}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              </ModalHeader>

              <ModalBody>
                {selectedAlert ? (
                  <div className="space-y-6">
                    {/* Compact Alert Overview Card */}
                    <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
                      <CardBody className="p-6">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                              selectedAlert.priority === 'high' ? 'bg-red-500/20 shadow-red-500/25' :
                              selectedAlert.priority === 'medium' ? 'bg-orange-500/20 shadow-orange-500/25' :
                              'bg-green-500/20 shadow-green-500/25'
                            }`}>
                              {selectedAlert.priority === 'high' ? <AlertTriangle className="w-8 h-8 text-red-400" /> :
                               selectedAlert.priority === 'medium' ? <Clock className="w-8 h-8 text-orange-400" /> :
                               <CheckCircle className="w-8 h-8 text-green-400" />}
                            </div>
                            <div>
                              <h4 className="text-white text-2xl font-bold mb-2">{selectedAlert.client}</h4>
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400">
                                  {selectedAlert.state}
                                </span>
                                <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${
                                  selectedAlert.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                                  selectedAlert.status === 'in-progress' ? 'bg-orange-500/20 text-orange-400' :
                                  'bg-green-500/20 text-green-400'
                                }`}>
                                  {selectedAlert.status.replace('-', ' ')}
                                </span>
                              </div>
                              <p className="text-gray-300 text-base">{selectedAlert.issue}</p>
                            </div>
                          </div>
                          <div className={`px-4 py-2 rounded-xl text-xs font-bold shadow-lg ${
                            selectedAlert.priority === 'high' ? 'bg-red-500/20 text-red-400 shadow-red-500/25' :
                            selectedAlert.priority === 'medium' ? 'bg-orange-500/20 text-orange-400 shadow-orange-500/25' :
                            'bg-green-500/20 text-green-400 shadow-green-500/25'
                          }`}>
                            {selectedAlert.priority.toUpperCase()}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-4 h-4 text-green-400" />
                              </div>
                              <span className="text-gray-400 text-xs font-medium">Current Amount</span>
                            </div>
                            <p className="text-white text-xl font-bold mb-1">{selectedAlert.currentAmount}</p>
                            <p className="text-gray-400 text-xs">of {selectedAlert.threshold} threshold</p>
                          </div>
                          
                          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-blue-400" />
                              </div>
                              <span className="text-gray-400 text-xs font-medium">Deadline</span>
                            </div>
                            <p className="text-white text-xl font-bold mb-1">{selectedAlert.deadline}</p>
                            <p className="text-gray-400 text-xs">Time remaining</p>
                          </div>
                          
                          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                                <Shield className="w-4 h-4 text-red-400" />
                              </div>
                              <span className="text-gray-400 text-xs font-medium">Penalty Risk</span>
                            </div>
                            <p className="text-red-400 text-xl font-bold mb-1">{selectedAlert.penaltyRisk}</p>
                            <p className="text-gray-400 text-xs">Potential exposure</p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    {/* Compact Recommended Actions */}
                    <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
                      <CardBody className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                            <Target className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <h5 className="text-white text-lg font-bold">Recommended Actions</h5>
                            <p className="text-gray-400 text-sm">Priority steps to address this alert</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          {selectedAlert.actions.map((action, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-200">
                              <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg shadow-blue-500/25">
                                <span className="text-blue-400 text-xs font-bold">{index + 1}</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-gray-300 text-sm leading-relaxed">{action}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardBody>
                    </Card>

                    {/* Compact Decision Form */}
                    <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
                      <CardBody className="p-6">
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
                            <Zap className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <h5 className="text-white text-lg font-bold">Make a Decision</h5>
                            <p className="text-gray-400 text-sm">Choose your recommended action</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <h6 className="text-white font-semibold text-base mb-4">My recommendation:</h6>
                            <div className="grid grid-cols-2 gap-3">
                              <Button
                                size="md"
                                className={`h-12 rounded-xl font-semibold text-sm transition-all duration-300 ${
                                  decision === "register-immediately" 
                                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 scale-105' 
                                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:scale-105 border border-white/10'
                                }`}
                                onPress={() => setDecision("register-immediately")}
                              >
                                <div className="flex flex-col items-center space-y-0.5">
                                  <span>Register Immediately</span>
                                  <span className="text-xs opacity-75">High Priority</span>
                                </div>
                              </Button>
                              <Button
                                size="md"
                                className={`h-12 rounded-xl font-semibold text-sm transition-all duration-300 ${
                                  decision === "monitor-closely" 
                                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/25 scale-105' 
                                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:scale-105 border border-white/10'
                                }`}
                                onPress={() => setDecision("monitor-closely")}
                              >
                                <div className="flex flex-col items-center space-y-0.5">
                                  <span>Monitor Closely</span>
                                  <span className="text-xs opacity-75">Medium Priority</span>
                                </div>
                              </Button>
                              <Button
                                size="md"
                                className={`h-12 rounded-xl font-semibold text-sm transition-all duration-300 ${
                                  decision === "schedule-review" 
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-105' 
                                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:scale-105 border border-white/10'
                                }`}
                                onPress={() => setDecision("schedule-review")}
                              >
                                <div className="flex flex-col items-center space-y-0.5">
                                  <span>Schedule Review</span>
                                  <span className="text-xs opacity-75">Planned Action</span>
                                </div>
                              </Button>
                              <Button
                                size="md"
                                className={`h-12 rounded-xl font-semibold text-sm transition-all duration-300 ${
                                  decision === "escalate-partner" 
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25 scale-105' 
                                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:scale-105 border border-white/10'
                                }`}
                                onPress={() => setDecision("escalate-partner")}
                              >
                                <div className="flex flex-col items-center space-y-0.5">
                                  <span>Escalate to Partner</span>
                                  <span className="text-xs opacity-75">Senior Review</span>
                                </div>
                              </Button>
                            </div>
                          </div>
                          
                          <div>
                            <h6 className="text-white font-semibold text-base mb-3">Reasoning:</h6>
                            <Textarea
                              placeholder="Explain your decision and reasoning for this alert..."
                              value={reasoning}
                              onValueChange={setReasoning}
                              minRows={4}
                              className="bg-white/5 border-white/10 text-white placeholder-gray-400 rounded-xl"
                              classNames={{
                                input: "text-white text-sm",
                                inputWrapper: "bg-white/5 border-white/10 hover:border-white/20 focus-within:border-blue-500/50 rounded-xl shadow-lg"
                              }}
                            />
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Bell className="w-8 h-8 text-gray-400" />
                      </div>
                      <h4 className="text-white text-lg font-semibold mb-2">Select an Alert</h4>
                      <p className="text-gray-400 text-sm">Choose an alert to view details and make decisions</p>
                    </div>
                  </div>
                )}
              </ModalBody>

              <ModalFooter>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl px-4 py-2"
                      onPress={onClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl px-4 py-2"
                      startContent={<MessageSquare className="w-4 h-4" />}
                    >
                      Contact Client
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/25 px-4 py-2 font-semibold"
                      startContent={<Send className="w-4 h-4" />}
                      onPress={() => selectedAlert && handleSendToClient(selectedAlert)}
                    >
                      Send to Client
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-600/25 px-4 py-2 font-semibold"
                      onPress={handleSaveDecision}
                      isDisabled={!decision || !reasoning}
                    >
                      Save Decision
                    </Button>
                  </div>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

