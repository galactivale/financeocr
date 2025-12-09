"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
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
  Spinner
} from "@nextui-org/react";
import { useNexusAlerts } from "@/hooks/useApi";
import { usePersonalizedDashboard } from "@/contexts/PersonalizedDashboardContext";
import { normalizeOrgId } from "@/lib/utils";
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
  DollarSign, 
  Calendar, 
  ChevronRight,
  Eye,
  Send,
  Shield,
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
  penaltyRiskValue: number | null; // Numeric value for risk checking
  priority: 'high' | 'medium' | 'low';
  status: 'new' | 'in-progress' | 'compliant';
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
  status: 'open' | 'acknowledged' | 'compliant';
  createdAt: string;
  client: {
    id: string;
    name: string;
    legalName: string;
    industry: string;
  };
}

// Removed hardcoded fallback alerts; rely solely on API data

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
  { key: "compliant", label: "Compliant" }
];

export default function ManagingPartnerAlerts() {
  const router = useRouter();
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Get organizationId from context for data isolation
  const { organizationId } = usePersonalizedDashboard();

  // API hook for fetching alerts with organizationId (consistent with monitoring page)
  const effectiveOrgId = normalizeOrgId(organizationId) || '0e41d0dc-afd0-4e19-9515-71372f5745df'; // Use organization with alerts data as fallback
  const { data: alertsData, loading: alertsLoading, error: alertsError, refetch: refetchAlerts } = useNexusAlerts({ 
    limit: 100,
    organizationId: effectiveOrgId
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
    // Also check alertType for compliance_confirmed alerts
    const mapStatus = (status: string, alertType?: string) => {
      // If alert is compliance_confirmed, it's compliant
      if (alertType === 'compliance_confirmed') {
        return 'compliant';
      }
      
      switch (status) {
        case 'open': return 'new';
        case 'acknowledged': return 'in-progress';
        case 'resolved': return 'compliant';
        case 'compliant': return 'compliant';
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
      penaltyRiskValue: backendAlert.penaltyRisk, // Store numeric value for risk checking
      priority: backendAlert.priority,
      status: mapStatus(backendAlert.status, backendAlert.alertType),
      actions: generateActions(backendAlert.alertType, backendAlert.priority, backendAlert.stateCode),
      details: backendAlert.description || `Client has business activities in ${backendAlert.stateCode} that may trigger tax obligations.`
    };
  };

  // Process alerts data
  const alerts: Alert[] = useMemo(() => {
    if (alertsLoading) {
      return [];
    }

    // API-only: transform if available else []
    const apiAlerts = alertsData?.alerts || [];
    if (apiAlerts.length === 0) return [];
    return apiAlerts.map(transformBackendAlert);
  }, [alertsData, alertsLoading]);

  // Filter alerts based on selected filters
  const filteredAlerts = alerts.filter(alert => {
    const priorityMatch = priorityFilter === "all" || alert.priority === priorityFilter;
    const searchMatch = searchTerm === "" || 
      alert.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.state.toLowerCase().includes(searchTerm.toLowerCase());
    return priorityMatch && searchMatch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };


  const handleAlertSelect = (alert: Alert) => {
    router.push(`/dashboard/tax-manager/alerts/${alert.id}`);
  };

  const handleSendToClient = async (alert: Alert) => {
    try {
      if (!effectiveOrgId) {
        window.alert('Missing organization context. Please select an organization.');
        return;
      }
      // Create a communication for this nexus alert
      const communicationData = {
        organizationId: effectiveOrgId,
        clientId: undefined as unknown as string, // TODO: fetch from selected alert detail if needed
        alertId: alert.id, // Required for nexus alerts
        type: "email" as const,
        subject: `Nexus Alert: ${alert.issue} - ${alert.state}`,
        content: `Dear Client,\n\nWe have detected a potential nexus threshold issue in ${alert.state}.\n\nDetails:\n- Current Amount: ${alert.currentAmount}\n- Threshold: ${alert.threshold}\n- Deadline: ${alert.deadline}\n- Penalty Risk: ${alert.penaltyRisk}\n\nPlease review this alert and contact us if you have any questions.\n\nBest regards,\nTax Team`,
        professionalReasoning: `Based on our analysis, this alert was triggered because the client's current revenue in ${alert.state} has exceeded the state's nexus threshold. This creates a tax obligation that requires immediate attention to avoid penalties and ensure compliance.`,
        recipientEmail: undefined, // Populate from client data in detail page
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
                  <p className="text-gray-400 text-sm font-medium">Compliant</p>
                  <p className="text-3xl font-bold text-green-400 mt-1">
                    {filteredAlerts.filter(a => a.status === 'compliant').length}
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
                {priorityFilter !== "all" || searchTerm !== ""
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
                        <Shield className={`w-4 h-4 ${alert.penaltyRiskValue === 0 || alert.penaltyRiskValue === null ? 'text-green-400' : 'text-red-400'}`} />
                        <span className={`text-xs font-medium ${alert.penaltyRiskValue === 0 || alert.penaltyRiskValue === null ? 'text-green-400' : 'text-red-400'}`}>{alert.penaltyRisk}</span>
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
                              <Shield className={`w-3 h-3 ${alert.penaltyRiskValue === 0 || alert.penaltyRiskValue === null ? 'text-green-400' : 'text-red-400'}`} />
                              <span className={alert.penaltyRiskValue === 0 || alert.penaltyRiskValue === null ? 'text-green-400' : 'text-red-400'}>{alert.penaltyRisk}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        
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

    </div>
  );
}

