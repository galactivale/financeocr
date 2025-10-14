"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Card, 
  CardBody, 
  Button, 
  Chip, 
  Badge,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea
} from "@nextui-org/react";
import { useNexusAlerts } from "@/hooks/useApi";
import { usePersonalizedDashboard } from "@/contexts/PersonalizedDashboardContext";
import { apiClient } from "@/lib/api";
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Search, 
  Bell, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Users, 
  Eye,
  Send,
  MessageSquare,
  Phone,
  Mail,
  FileText,
  Shield,
  Target,
  BarChart3,
  ExternalLink,
  Download,
  Share,
  Flag,
  Archive,
  Edit,
  Trash2,
  Plus,
  Minus,
  ChevronRight,
  ChevronDown,
  Info,
  AlertCircle,
  CheckCircle2,
  X,
  RefreshCw,
  Zap
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
    issue: "California sales exceeded nexus threshold",
    currentAmount: "$525K",
    threshold: "$500K",
    deadline: "15 days",
    penaltyRisk: "$25K - $45K",
    priority: "high",
    status: "new",
    actions: ["Register for CA sales tax", "Start collecting tax immediately", "Consider voluntary disclosure"],
    details: "Client exceeded the California nexus threshold. Must register to avoid penalties. Recommend immediate registration and voluntary disclosure discussion."
  },
  {
    id: "2",
    client: "RetailChain LLC",
    state: "NY",
    issue: "New York approaching nexus threshold",
    currentAmount: "$485K",
    threshold: "$500K",
    deadline: "30 days",
    penaltyRisk: "$15K - $30K",
    priority: "high",
    status: "new",
    actions: ["Monitor and prepare registration", "Track transaction count", "Prepare compliance documentation"],
    details: "Client is approaching both the revenue threshold and 100 transaction threshold in New York. Monitor closely and prepare for registration."
  },
  {
    id: "3",
    client: "ManufacturingCo",
    state: "TX",
    issue: "Texas sales approaching nexus threshold",
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

export default function ManagingPartnerAlertDetailPage() {
  const params = useParams();
  const router = useRouter();
  const alertId = params.id as string;
  
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview', 'actions', 'details']));
  const [decision, setDecision] = useState<string>("");
  const [reasoning, setReasoning] = useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Get organizationId from context for data isolation
  const { organizationId } = usePersonalizedDashboard();

  // API hook for fetching alerts with organizationId (consistent with monitoring page)
  const { data: alertsData, loading: alertsLoading, error: alertsError, refetch: refetchAlerts } = useNexusAlerts({ 
    limit: 100,
    organizationId: organizationId || 'demo-org-id'
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

  // Find the specific alert
  useEffect(() => {
    if (alerts.length > 0) {
      const alert = alerts.find(a => a.id === alertId);
      if (alert) {
        setSelectedAlert(alert);
        setError(null);
      } else {
        setError("Alert not found");
      }
      setLoading(false);
    }
  }, [alerts, alertId]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };


  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
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

  const handleSaveDecision = async () => {
    if (!decision || !reasoning) {
      window.alert('Please provide both a decision and reasoning before saving.');
      return;
    }

    try {
      // Here you would typically save the decision to your backend
      // For now, we'll just show a success message
      window.alert('Decision saved successfully!');
      setDecision("");
      setReasoning("");
      onOpenChange();
    } catch (error) {
      console.error('Error saving decision:', error);
      window.alert('Error saving decision. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm font-medium">Loading alert details...</p>
        </div>
      </div>
    );
  }

  if (error || !selectedAlert) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <h4 className="text-white text-xl font-semibold mb-2">Alert Not Found</h4>
          <p className="text-gray-400 text-sm mb-6">{error || "The requested alert could not be found"}</p>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/25"
            onPress={() => router.push('/dashboard/managing-partner/alerts')}
            startContent={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Alerts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Apple-style Sticky Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                isIconOnly
                variant="ghost"
                className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                onPress={() => router.push('/dashboard/managing-partner/alerts')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Alert Details</h1>
                <p className="text-gray-400 text-sm">Comprehensive breakdown of nexus alert</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                variant="ghost"
                className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                onPress={refetchAlerts}
                isLoading={alertsLoading}
                startContent={!alertsLoading && <RefreshCw className="w-4 h-4" />}
              >
                {alertsLoading ? 'Refreshing...' : 'Refresh'}
              </Button>
              
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/25"
                onPress={() => handleSendToClient(selectedAlert)}
                startContent={<Send className="w-4 h-4" />}
              >
                Send to Client
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Alert Overview */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
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
                      <h2 className="text-white text-2xl font-bold mb-2">{selectedAlert.client}</h2>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400">
                          {selectedAlert.state}
                        </span>
                        <Chip 
                          size="sm"
                          color={getPriorityColor(selectedAlert.priority)}
                          className="text-white"
                        >
                          {selectedAlert.priority.toUpperCase()}
                        </Chip>
                      </div>
                      <p className="text-gray-300 text-base">{selectedAlert.issue}</p>
                    </div>
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

            {/* Detailed Information */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white text-lg font-bold">Detailed Information</h3>
                  <Button
                    isIconOnly
                    variant="ghost"
                    className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                    onPress={() => toggleSection('details')}
                  >
                    {expandedSections.has('details') ? 
                      <ChevronDown className="w-4 h-4" /> : 
                      <ChevronRight className="w-4 h-4" />
                    }
                  </Button>
                </div>
                
                {expandedSections.has('details') && (
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h4 className="text-white font-semibold mb-2">Alert Description</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{selectedAlert.details}</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h4 className="text-white font-semibold mb-2">Technical Details</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Alert ID:</span>
                          <span className="text-white ml-2 font-mono">{selectedAlert.id}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Client:</span>
                          <span className="text-white ml-2">{selectedAlert.client}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">State:</span>
                          <span className="text-white ml-2">{selectedAlert.state}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Priority:</span>
                          <span className="text-white ml-2 capitalize">{selectedAlert.priority}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Recommended Actions */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                      <Target className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-white text-lg font-bold">Recommended Actions</h3>
                  </div>
                  <Button
                    isIconOnly
                    variant="ghost"
                    className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                    onPress={() => toggleSection('actions')}
                  >
                    {expandedSections.has('actions') ? 
                      <ChevronDown className="w-4 h-4" /> : 
                      <ChevronRight className="w-4 h-4" />
                    }
                  </Button>
                </div>
                
                {expandedSections.has('actions') && (
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
                )}
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
              <CardBody className="p-6">
                <h3 className="text-white text-lg font-bold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-600/25"
                    startContent={<Flag className="w-4 h-4" />}
                    onPress={() => {
                      // Navigate to decision builder with prefilled parameters
                      const params = new URLSearchParams({
                        client: selectedAlert?.client || '',
                        state: selectedAlert?.state || '',
                        alertId: selectedAlert?.id || '',
                        currentAmount: selectedAlert?.currentAmount || '',
                        threshold: selectedAlert?.threshold || '',
                        penaltyRisk: selectedAlert?.penaltyRisk || '',
                        priority: selectedAlert?.priority || '',
                        issue: selectedAlert?.issue || ''
                      });
                      router.push(`/dashboard/managing-partner/liability/decision-builder?${params.toString()}`);
                    }}
                  >
                    Make Decision
                  </Button>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/25"
                    startContent={<Send className="w-4 h-4" />}
                    onPress={() => handleSendToClient(selectedAlert)}
                  >
                    Send to Client
                  </Button>
                  <Button
                    className="w-full bg-white/10 hover:bg-white/20 text-white rounded-xl"
                    startContent={<MessageSquare className="w-4 h-4" />}
                  >
                    Contact Client
                  </Button>
                  <Button
                    className="w-full bg-white/10 hover:bg-white/20 text-white rounded-xl"
                    startContent={<FileText className="w-4 h-4" />}
                  >
                    Generate Report
                  </Button>
                  <Button
                    className="w-full bg-white/10 hover:bg-white/20 text-white rounded-xl"
                    startContent={<Download className="w-4 h-4" />}
                  >
                    Export Details
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Alert Timeline */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
              <CardBody className="p-6">
                <h3 className="text-white text-lg font-bold mb-4">Alert Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Bell className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Alert Created</p>
                      <p className="text-gray-400 text-xs">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <Eye className="w-4 h-4 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Alert Viewed</p>
                      <p className="text-gray-400 text-xs">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Status Updated</p>
                      <p className="text-gray-400 text-xs">30 minutes ago</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Related Information */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
              <CardBody className="p-6">
                <h3 className="text-white text-lg font-bold mb-4">Related Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-white text-sm">Client Profile</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-white text-sm">State Regulations</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-purple-400" />
                      </div>
                      <span className="text-white text-sm">Similar Alerts</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      {/* Decision Modal */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        size="2xl"
        classNames={{
          base: "bg-gray-800/95 backdrop-blur-xl border-white/10 rounded-3xl",
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
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25">
                      <Flag className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white text-xl font-bold">Make Decision</h3>
                      <p className="text-gray-400 text-sm">Document your decision for this alert</p>
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
                <div className="space-y-6">
                  {/* Decision Type */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-3">My recommendation:</label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        className={`h-12 rounded-xl font-semibold transition-all duration-200 ${
                          decision === "register" 
                            ? "bg-green-600 text-white shadow-lg shadow-green-600/25" 
                            : "bg-white/10 text-gray-300 hover:bg-white/20"
                        }`}
                        onPress={() => setDecision("register")}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Register Now
                      </Button>
                      <Button
                        className={`h-12 rounded-xl font-semibold transition-all duration-200 ${
                          decision === "monitor" 
                            ? "bg-orange-600 text-white shadow-lg shadow-orange-600/25" 
                            : "bg-white/10 text-gray-300 hover:bg-white/20"
                        }`}
                        onPress={() => setDecision("monitor")}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Monitor
                      </Button>
                      <Button
                        className={`h-12 rounded-xl font-semibold transition-all duration-200 ${
                          decision === "disclosure" 
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" 
                            : "bg-white/10 text-gray-300 hover:bg-white/20"
                        }`}
                        onPress={() => setDecision("disclosure")}
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Voluntary Disclosure
                      </Button>
                      <Button
                        className={`h-12 rounded-xl font-semibold transition-all duration-200 ${
                          decision === "consult" 
                            ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25" 
                            : "bg-white/10 text-gray-300 hover:bg-white/20"
                        }`}
                        onPress={() => setDecision("consult")}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Consult Client
                      </Button>
                    </div>
                  </div>

                  {/* Reasoning */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-3">Reasoning:</label>
                    <Textarea
                      placeholder="Explain your decision and reasoning for this alert..."
                      value={reasoning}
                      onChange={(e) => setReasoning(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500/50 focus:bg-white/10 transition-all duration-200"
                      minRows={4}
                      maxRows={8}
                    />
                  </div>
                </div>
              </ModalBody>

              <ModalFooter>
                <div className="flex items-center justify-between w-full">
                  <Button
                    variant="ghost"
                    className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl px-4 py-2"
                    onPress={onClose}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-600/25 px-4 py-2 font-semibold"
                    onPress={handleSaveDecision}
                    startContent={<Flag className="w-4 h-4" />}
                  >
                    Save Decision
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

