"use client";

import React, { useState, useEffect, use, useMemo } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Badge } from "@nextui-org/badge";
import { Progress } from "@nextui-org/progress";
import { Spinner } from "@nextui-org/spinner";
import { 
  ArrowLeft,
  Calendar,
  FileText,
  Phone,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Building,
  MapPin,
  Flag,
  MessageSquare,
  Send,
  Eye,
  Edit,
  Archive,
  BarChart3,
  PieChart,
  Target,
  Shield,
  BookOpen,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Plus,
  Filter,
  Search
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useClientDetail, useClientNexusStatus, useClientCommunications, useClientDocuments } from "@/hooks/useClientDetail";
import { useNexusAlerts } from "@/hooks/useApi";
import { usePersonalizedDashboard } from "@/contexts/PersonalizedDashboardContext";

// Helper functions for data formatting
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

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "critical": return "danger";
      case "warning": return "warning";
      case "monitoring": return "primary";
      default: return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "danger";
      case "warning": return "warning";
      case "info": return "primary";
      default: return "default";
    }
  };

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("nexus");
  const [expandedState, setExpandedState] = useState<string | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<number | null>(null);

  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const clientId = resolvedParams.id;

  // Get personalized dashboard context
  const { isPersonalizedMode, clientName, organizationId } = usePersonalizedDashboard();
  
  const finalOrganizationId = organizationId || 'org-1760376582926-5cfsef';

  // Fetch comprehensive client data
  const { 
    data: clientDetailData, 
    loading: clientDetailLoading, 
    error: clientDetailError 
  } = useClientDetail({ 
    clientId: clientId, 
    organizationId: finalOrganizationId,
    enabled: true 
  });

  // Fetch additional data for different tabs
  const { 
    data: nexusStatusData, 
    loading: nexusStatusLoading, 
    error: nexusStatusError 
  } = useClientNexusStatus({ 
    clientId: clientId, 
    organizationId: finalOrganizationId,
    enabled: selectedTab === "nexus" 
  });

  const { 
    data: allAlertsData, 
    loading: alertsLoading, 
    error: alertsError 
  } = useNexusAlerts({ 
    limit: 100,
    organizationId: finalOrganizationId
  });

  // Filter alerts for this specific client
  const alertsData = useMemo(() => {
    if (!allAlertsData?.alerts) return [];
    
    // Try to get client ID from client detail data first
    let actualClientId = clientDetailData?.data?.id;
    
    // If client detail data is not available, try to find the client ID from alerts
    if (!actualClientId) {
      // Look for alerts that have a client with matching name (fallback approach)
      // Convert slug to various possible name formats
      const slugToName = clientId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const slugToNameLower = clientId.replace(/-/g, ' ').toLowerCase();
      const slugWithoutNumbers = clientId.replace(/-\d+$/, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      const matchingAlert = allAlertsData.alerts.find((alert: any) => {
        const alertClientName = alert.client?.name?.toLowerCase() || '';
        return (
          alertClientName.includes(slugToName.toLowerCase()) ||
          alertClientName.includes(slugToNameLower) ||
          alertClientName.includes(slugWithoutNumbers.toLowerCase()) ||
          slugToName.toLowerCase().includes(alertClientName) ||
          slugWithoutNumbers.toLowerCase().includes(alertClientName)
        );
      });
      actualClientId = matchingAlert?.clientId;
    }
    
    if (!actualClientId) return [];
    
    return allAlertsData.alerts.filter((alert: any) => alert.clientId === actualClientId);
  }, [allAlertsData, clientDetailData, clientId]);

  const { 
    data: communicationsData, 
    loading: communicationsLoading, 
    error: communicationsError 
  } = useClientCommunications({ 
    clientId: clientId, 
    organizationId: finalOrganizationId,
    enabled: selectedTab === "communications" 
  });

  const { 
    data: documentsData, 
    loading: documentsLoading, 
    error: documentsError 
  } = useClientDocuments({ 
    clientId: clientId, 
    organizationId: finalOrganizationId,
    enabled: selectedTab === "documents" 
  });

  // Show loading state
  if (clientDetailLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="text-white mt-4">
            {isPersonalizedMode ? `Loading ${clientName} client details...` : 'Loading client details...'}
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (clientDetailError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error Loading Client</div>
          <p className="text-gray-400 mb-4">{clientDetailError}</p>
          <Button 
            onClick={() => router.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Get client data
  const client = clientDetailData?.client;
  const metrics = clientDetailData?.metrics;
  const stateMetrics = clientDetailData?.stateMetrics || [];
  const summary = clientDetailData?.summary;

  if (!client) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Client Not Found</div>
          <Button 
            onClick={() => router.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

    return (
    <div className="min-h-screen bg-black">
      {/* Apple-style Sticky Header */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
                className="text-gray-400 hover:text-white"
          startContent={<ArrowLeft className="w-4 h-4" />}
          onClick={() => router.back()}
        >
                Back
        </Button>
              <div className="w-px h-6 bg-white/10"></div>
          <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Building className="w-5 h-5 text-white" />
          </div>
            <div>
                  <h1 className="text-2xl font-semibold text-white tracking-tight">
                    {client.name}
                    {isPersonalizedMode && (
                      <span className="ml-3 text-sm text-blue-400">({clientName})</span>
                    )}
                  </h1>
                  <p className="text-gray-400 text-sm">
                    {isPersonalizedMode ? 'Personalized client view' : 'Professional nexus compliance oversight'}
                  </p>
              </div>
            </div>
            </div>
            <div className="flex items-center space-x-3">
          <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/25"
                startContent={<MessageSquare className="w-4 h-4" />}
          >
                Contact Client
          </Button>
          <Button
                size="sm"
                className="bg-white/5 text-gray-300 hover:bg-white/10 rounded-xl"
            startContent={<FileText className="w-4 h-4" />}
          >
                Generate Report
          </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Dynamic Nexus Alert */}
        {metrics?.openNexusAlerts > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-red-300 text-sm font-medium">
                {metrics.openNexusAlerts} Active Nexus Alert{metrics.openNexusAlerts > 1 ? 's' : ''}
                {metrics.penaltyExposure > 0 && (
                  <span className="ml-2">• Potential Exposure: {formatCurrency(metrics.penaltyExposure)}</span>
                )}
              </span>
        </div>
      </div>
        )}

      {/* Main Content with Tabs */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
          {/* Apple-style Tab Navigation */}
        <div className="border-b border-white/10">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setSelectedTab("nexus")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                selectedTab === "nexus"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-white hover:border-gray-300"
              }`}
            >
              Nexus Status
            </button>
            <button
              onClick={() => setSelectedTab("details")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                selectedTab === "details"
                  ? "border-cyan-500 text-cyan-400"
                  : "border-transparent text-gray-400 hover:text-white hover:border-gray-300"
              }`}
            >
              Client Details
            </button>
            <button
              onClick={() => setSelectedTab("alerts")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                selectedTab === "alerts"
                  ? "border-red-500 text-red-400"
                  : "border-transparent text-gray-400 hover:text-white hover:border-gray-300"
              }`}
            >
              Active Alerts
            </button>
            <button
              onClick={() => setSelectedTab("audit")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                selectedTab === "audit"
                  ? "border-green-500 text-green-400"
                  : "border-transparent text-gray-400 hover:text-white hover:border-gray-300"
              }`}
            >
              Audit Trail
            </button>
            <button
              onClick={() => setSelectedTab("communications")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                selectedTab === "communications"
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-gray-400 hover:text-white hover:border-gray-300"
              }`}
            >
              Communications
            </button>
            <button
              onClick={() => setSelectedTab("documents")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                selectedTab === "documents"
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-gray-400 hover:text-white hover:border-gray-300"
              }`}
            >
              Documents
            </button>
            <button
              onClick={() => setSelectedTab("analytics")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                selectedTab === "analytics"
                  ? "border-orange-500 text-orange-400"
                  : "border-transparent text-gray-400 hover:text-white hover:border-gray-300"
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>

            {/* Apple-style Tab Content */}
        <div className="p-6">
          {selectedTab === "nexus" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">Multi-State Nexus Dashboard</h2>
                </div>
                <div className="flex items-center space-x-3">
                  {summary && (
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-400">{summary.criticalStates}</div>
                        <div className="text-gray-400 text-xs">Critical</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-400">{summary.warningStates}</div>
                        <div className="text-gray-400 text-xs">Warning</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-400">{summary.monitoringStates}</div>
                        <div className="text-gray-400 text-xs">Monitoring</div>
                      </div>
                    </div>
                  )}
                <Button
                  size="sm"
                      className="bg-white/5 text-gray-300 hover:bg-white/10 rounded-xl"
                      startContent={<Filter className="w-4 h-4" />}
                >
                  Filter States
                </Button>
              </div>
              </div>

                  {/* Apple-style Interactive State Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stateMetrics.map((state, index) => (
                  <div
                    key={`${state.stateCode}-${index}`}
                        className={`group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20 cursor-pointer ${
                      expandedState === state.code ? 'ring-2 ring-blue-500/50' : ''
                    }`}
                    onClick={() => setExpandedState(expandedState === state.code ? null : state.code)}
                  >
                        <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                <Flag className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-sm tracking-tight">{state.stateName}</h3>
                          <p className="text-gray-400 text-xs">{state.stateCode}</p>
                        </div>
                      </div>
                      <Chip
                        color={getStatusColor(state.status)}
                        size="sm"
                        className="text-xs"
                      >
                        {state.status === "critical" ? "REGISTRATION REQUIRED" :
                         state.status === "warning" ? "APPROACHING THRESHOLD" :
                         "MONITORING"}
                      </Chip>
                    </div>

                          <div className="space-y-4">
                      <div>
                              <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Revenue</span>
                          <span className="text-white">{formatCurrency(state.currentAmount)} of {formatCurrency(state.thresholdAmount)}</span>
                        </div>
                        <Progress
                          value={state.percentage}
                          className="mb-2"
                          color={state.percentage >= 100 ? "danger" : state.percentage >= 80 ? "warning" : "primary"}
                        />
                        <p className="text-xs text-gray-400">{state.percentage}% of threshold</p>
                      </div>

                      {state.daysSinceThreshold && (
                              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                          <p className="text-red-300 text-xs">
                            Days since threshold crossed: {state.daysSinceThreshold} days
                          </p>
                          {state.penaltyRisk > 0 && (
                          <p className="text-red-200 text-xs">
                              Estimated penalty: {formatCurrency(state.penaltyRisk)}
                          </p>
                          )}
                        </div>
                      )}

                      {state.lastUpdated && (
                              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                          <p className="text-blue-300 text-xs">
                            Last updated: {formatDate(state.lastUpdated)}
                          </p>
                        </div>
                      )}

                      <div className="flex space-x-2 pt-2">
                        <Button
                          size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs"
                        >
                          {state.status === "critical" ? "Register Client" : 
                           state.status === "warning" ? "Monitor Closely" : "Track Progress"}
                        </Button>
                        <Button
                          size="sm"
                                className="bg-white/5 text-gray-300 hover:bg-white/10 rounded-xl text-xs"
                        >
                          Document Decision
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === "details" && (
            <div className="space-y-6">
              {/* Business Profile Header */}
              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center border border-cyan-500/30">
                      <span className="text-2xl font-semibold text-cyan-400">{client.name?.charAt(0) || 'C'}</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-white tracking-tight">{client.name}</h2>
                      <p className="text-gray-400 text-sm">{client.legalName || client.name}</p>
                      <p className="text-gray-400 text-sm">Founded: {client.foundedYear ? client.foundedYear : 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Chip color="success" size="sm" className="text-xs mb-2">Active Client Since Jan 2024</Chip>
                    <p className="text-gray-400 text-xs">Assigned Tax Manager: Jane Doe, CPA</p>
                    <p className="text-gray-400 text-xs">Service Tier: Professional Nexus Monitoring</p>
                    <p className="text-gray-400 text-xs">Last Updated: Dec 1, 2024</p>
                  </div>
                </div>
              </div>

              {/* Business Overview */}
              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-1 h-6 bg-cyan-500 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-white tracking-tight">Business Overview</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-semibold text-sm mb-3">Corporate Structure</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Legal Name:</span>
                        <span className="text-white">TechCorp SaaS Solutions, LLC</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">DBA Name:</span>
                        <span className="text-white">TechCorp SaaS</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Entity Type:</span>
                        <span className="text-white">Delaware LLC</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Formation Date:</span>
                        <span className="text-white">March 15, 2019</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Federal EIN:</span>
                        <span className="text-white font-mono">12-3456789</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold text-sm mb-3">Business Classification</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Primary Industry:</span>
                        <span className="text-white">Software as a Service (SaaS)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">NAICS Code:</span>
                        <span className="text-white">541511</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Business Model:</span>
                        <span className="text-white">B2B Software Subscriptions</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Market Focus:</span>
                        <span className="text-white">SMB CRM Solutions</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <h4 className="text-white font-semibold text-sm mb-3">Financial Profile</h4>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{formatCurrency(client.annualRevenue || 0)}</div>
                      <div className="text-gray-400 text-xs">Annual Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">{client.qualityScore || 0}%</div>
                      <div className="text-gray-400 text-xs">Quality Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{client.employeeCount || 'N/A'}</div>
                      <div className="text-gray-400 text-xs">Employee Count</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">Series A</div>
                      <div className="text-gray-400 text-xs">Funding Stage</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-1 h-6 bg-cyan-500 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-white tracking-tight">Primary Contacts & Management</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-semibold text-sm mb-3">Primary Contact</h4>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="space-y-2 text-sm">
                        <div className="font-semibold text-white">John Smith, Chief Financial Officer</div>
                        <div className="text-gray-400">john.smith@techcorpsaas.com</div>
                        <div className="text-gray-400">(555) 123-4567 ext. 102</div>
                        <div className="text-gray-400">(555) 987-6543 (Mobile)</div>
                        <div className="text-cyan-400 text-xs">Direct Contact: Preferred for nexus compliance matters</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold text-sm mb-3">Secondary Contacts</h4>
                    <div className="space-y-3">
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="font-semibold text-white text-sm">Sarah Johnson - VP Finance</div>
                        <div className="text-gray-400 text-xs">sarah.j@techcorpsaas.com</div>
                        <div className="text-gray-400 text-xs">Day-to-day operations and data uploads</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="font-semibold text-white text-sm">Mike Chen - CEO</div>
                        <div className="text-gray-400 text-xs">mike.chen@techcorpsaas.com</div>
                        <div className="text-gray-400 text-xs">Strategic decisions and high-exposure issues</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <h4 className="text-white font-semibold text-sm mb-3">Legal Counsel</h4>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="font-semibold text-white text-sm">Wilson & Associates LLP</div>
                    <div className="text-gray-400 text-xs">Contact: David Wilson, Esq.</div>
                    <div className="text-gray-400 text-xs">Specialization: Multi-state tax compliance</div>
                  </div>
                </div>
              </div>

              {/* Business Operations */}
              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-1 h-6 bg-cyan-500 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-white tracking-tight">Business Locations & Operations</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-semibold text-sm mb-3">Headquarters</h4>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="space-y-2 text-sm">
                        <div className="font-semibold text-white">1234 Innovation Drive, Suite 200</div>
                        <div className="text-gray-400">San Jose, CA 95110</div>
                        <div className="text-gray-400">Property: Leased office space</div>
                        <div className="text-gray-400">Employees: 18 (accounting for nexus purposes)</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold text-sm mb-3">Remote Workforce Locations</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">California:</span>
                        <span className="text-white">12 employees (includes HQ)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">New York:</span>
                        <span className="text-white">3 remote employees</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Texas:</span>
                        <span className="text-white">2 remote employees</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Florida:</span>
                        <span className="text-white">1 remote employee</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Other States:</span>
                        <span className="text-white">6 remote employees (various)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <h4 className="text-white font-semibold text-sm mb-3">Physical Nexus Analysis</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-white">California: Physical presence (HQ + employees)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-white">New York: Employee nexus (3 remote workers)</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-white">Texas: Employee nexus (2 remote workers)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-white">Other states: Monitored for employee threshold</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue & Customer Analysis */}
              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-1 h-6 bg-cyan-500 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-white tracking-tight">Revenue Profile & Customer Base</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-semibold text-sm mb-3">Revenue Breakdown (2024 YTD)</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Annual Revenue:</span>
                        <span className="text-white font-semibold">{formatCurrency(client.annualRevenue || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Subscription Revenue:</span>
                        <span className="text-white">$1,850,000 (87%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Professional Services:</span>
                        <span className="text-white">$185,000 (9%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Training & Support:</span>
                        <span className="text-white">$65,000 (3%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Other Revenue:</span>
                        <span className="text-white">$25,000 (1%)</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold text-sm mb-3">Customer Demographics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Active Customers:</span>
                        <span className="text-white">487</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Average Contract Value:</span>
                        <span className="text-white">$4,362 annually</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Customer Retention Rate:</span>
                        <span className="text-white">94%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Monthly Recurring Revenue:</span>
                        <span className="text-white">$154,167</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <h4 className="text-white font-semibold text-sm mb-3">Geographic Distribution</h4>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">156</div>
                      <div className="text-gray-400 text-xs">California (32%)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">89</div>
                      <div className="text-gray-400 text-xs">New York (18%)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">67</div>
                      <div className="text-gray-400 text-xs">Texas (14%)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">45</div>
                      <div className="text-gray-400 text-xs">Florida (9%)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">130</div>
                      <div className="text-gray-400 text-xs">Other States (27%)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-1 h-6 bg-red-500 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-white tracking-tight">Comprehensive Risk Assessment</h3>
                </div>
                
                <div className={`${client.riskLevel === 'high' ? 'bg-red-500/10 border-red-500/20' : client.riskLevel === 'medium' ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-green-500/10 border-green-500/20'} border rounded-lg p-4 mb-4`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-lg font-bold ${client.riskLevel === 'high' ? 'text-red-400' : client.riskLevel === 'medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                        {client.riskLevel?.toUpperCase() || 'UNKNOWN'}
                      </div>
                      <div className="text-gray-400 text-sm">Overall Risk Level</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">{metrics?.riskScore || 0}/100</div>
                      <div className="text-gray-400 text-sm">Risk Score</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-semibold text-sm mb-3">Nexus Risk Factors</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Revenue Growth:</span>
                        <Chip color="danger" size="sm" className="text-xs">HIGH RISK</Chip>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Geographic Expansion:</span>
                        <Chip color="warning" size="sm" className="text-xs">MEDIUM RISK</Chip>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Transaction Volume:</span>
                        <Chip color="danger" size="sm" className="text-xs">HIGH RISK</Chip>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Remote Workforce:</span>
                        <Chip color="danger" size="sm" className="text-xs">HIGH RISK</Chip>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold text-sm mb-3">Financial Risk Factors</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current Penalty Exposure:</span>
                        <span className="text-red-400 font-semibold">{formatCurrency(metrics?.penaltyExposure || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Potential Compliance Costs:</span>
                        <span className="text-white">$45,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Professional Liability:</span>
                        <span className="text-yellow-400">Moderate</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Cash Flow Impact:</span>
                        <span className="text-green-400">Low</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Relationship */}
              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-1 h-6 bg-cyan-500 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-white tracking-tight">Service Engagement & Relationship History</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-semibold text-sm mb-3">Engagement Overview</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Service Start Date:</span>
                        <span className="text-white">January 15, 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Service Type:</span>
                        <span className="text-white">Economic Nexus Monitoring</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Service Level:</span>
                        <span className="text-white">Professional Plus</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Monthly Service Fee:</span>
                        <span className="text-white">$2,850</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold text-sm mb-3">Service Performance Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Response Time:</span>
                        <span className="text-white">4.2 hours avg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Client Satisfaction:</span>
                        <span className="text-white">96%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Issue Resolution:</span>
                        <span className="text-white">98% within SLA</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Penalty Prevention:</span>
                        <span className="text-green-400">{formatCurrency(156000)} YTD</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === "alerts" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-1 h-6 bg-red-500 rounded-full"></div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">Active Alerts</h2>
                </div>
                {alertsLoading ? (
                  <Spinner size="sm" color="primary" />
                ) : (
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                      <div className="text-lg font-bold text-red-400">{alertsData?.filter(a => a.priority === 'high').length || 0}</div>
                    <div className="text-gray-400 text-xs">High Priority</div>
                  </div>
                  <div className="text-center">
                      <div className="text-lg font-bold text-yellow-400">{alertsData?.filter(a => a.priority === 'medium').length || 0}</div>
                    <div className="text-gray-400 text-xs">Medium Priority</div>
                  </div>
                  <div className="text-center">
                      <div className="text-lg font-bold text-white">{alertsData?.length || 0}</div>
                    <div className="text-gray-400 text-xs">Total Alerts</div>
                  </div>
                    {(alertsData?.length || 0) > 0 && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                        <div className="text-red-400 text-sm font-semibold">{alertsData?.length || 0} alerts need attention</div>
                  </div>
                    )}
                </div>
                )}
              </div>


              <div className="space-y-4">
                {alertsData && alertsData.length > 0 ? (
                  alertsData.map((alert, index) => (
                  <div
                    key={alert.id || `alert-${index}`}
                    className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          alert.priority === "high" ? "bg-red-500/20" :
                          alert.priority === "medium" ? "bg-yellow-500/20" : "bg-blue-500/20"
                        }`}>
                          {alert.priority === "high" ? <AlertTriangle className="w-4 h-4 text-red-400" /> :
                           alert.priority === "medium" ? <Clock className="w-4 h-4 text-yellow-400" /> :
                           <CheckCircle className="w-4 h-4 text-blue-400" />}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-sm tracking-tight">{alert.title}</h3>
                          <p className="text-gray-400 text-sm">{alert.description}</p>
                        </div>
                      </div>
                      <Chip
                        color={alert.priority === "high" ? "danger" : alert.priority === "medium" ? "warning" : "primary"}
                        size="sm"
                        className="text-xs"
                      >
                        {alert.priority}
                      </Chip>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-gray-400 text-xs">Current Amount</p>
                        <p className="text-white text-sm font-medium">${(alert.currentAmount / 1000).toFixed(0)}K</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Threshold</p>
                        <p className="text-blue-300 text-sm font-mono">${alert.thresholdAmount ? (alert.thresholdAmount / 1000).toFixed(0) : '500'}K</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">State</p>
                        <p className="text-white text-sm">{alert.stateCode}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Created</p>
                        <p className="text-white text-sm">{formatDate(alert.createdAt)}</p>
                      </div>
                    </div>

                    {alert.deadline && (
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-3">
                        <p className="text-yellow-300 text-sm">
                          Deadline: {formatDate(alert.deadline)}
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30"
                      >
                        Document Decision
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        className="bg-white/10 text-gray-300 hover:bg-white/20"
                      >
                        Client Advisory
                      </Button>
                      {alert.priority === "high" && (
                        <Button
                          size="sm"
                          variant="flat"
                          className="bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        >
                          Escalate to Partner
                        </Button>
                      )}
                    </div>
                  </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Active Alerts</h3>
                    <p className="text-gray-400 mb-6">This client has no outstanding alerts requiring attention.</p>
                    <div className="flex justify-center space-x-4">
                      <Button
                        size="sm"
                        className="bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30"
                      >
                        Run Compliance Check
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        className="bg-white/10 text-gray-300 hover:bg-white/20"
                      >
                        View Alert History
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedTab === "audit" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">Professional Audit Trail</h2>
                </div>
                <div className="flex items-center space-x-3">
                  <Chip color="success" size="sm" className="text-xs">EXCELLENT</Chip>
                  <Button
                    size="sm"
                    className="bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30"
                    startContent={<Shield className="w-3 h-3" />}
                  >
                    Generate Legal Package
                  </Button>
                </div>
              </div>

              {/* Audit Trail Status */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">100%</div>
                    <div className="text-gray-400 text-xs">Documentation Complete</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">YES</div>
                    <div className="text-gray-400 text-xs">Court Defensible</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">156</div>
                    <div className="text-gray-400 text-xs">Decisions Documented</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">Nov 28</div>
                    <div className="text-gray-400 text-xs">Last Review</div>
                  </div>
                </div>
              </div>

              {/* Recent Decisions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white tracking-tight">Recent Professional Decisions</h3>
                {client.professionalDecisions && client.professionalDecisions.length > 0 ? client.professionalDecisions.map((decision: any, index: number) => (
                  <div
                    key={decision.id || `decision-${index}`}
                    className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-blue-400 text-xs font-mono">
                            NEX-2024-{decision.date ? decision.date.replace(/-/g, '').slice(4) : '0000'}-001
                          </span>
                          <span className="text-gray-400 text-xs">
                            {decision.date ? formatDate(decision.date) : 'No date'}
                          </span>
                        </div>
                        <h4 className="text-white font-semibold text-sm tracking-tight">{decision.type || 'Unknown Decision Type'}</h4>
                        <p className="text-gray-300 text-sm">{decision.outcome || 'No outcome specified'}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Chip color="success" size="sm" className="text-xs">{decision.documentation || 'No documentation'}</Chip>
                        <Chip color={decision.clientCommunication === "Complete" ? "success" : "warning"} size="sm" className="text-xs">
                          {decision.clientCommunication || 'Unknown'}
                        </Chip>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-3 mb-3">
                      <p className="text-gray-300 text-sm mb-2">
                        <span className="text-gray-400 text-xs">Professional Reasoning:</span><br />
                        {decision.rationale || 'No reasoning provided'}
                      </p>
                      <p className="text-gray-300 text-sm">
                        <span className="text-gray-400 text-xs">Tax Manager:</span> {decision.manager || 'Unknown Manager'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span>✓ Statutory citation verified</span>
                        <span>✓ Professional reasoning documented</span>
                        <span>✓ Client communication recorded</span>
                      </div>
                      <Button
                        size="sm"
                        variant="flat"
                        className="bg-white/10 text-gray-300 hover:bg-white/20"
                        startContent={<Eye className="w-3 h-3" />}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                )) : (
                  <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-8 text-center">
                    <div className="text-gray-400 mb-2">
                      <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className="text-white font-medium mb-2">No Professional Decisions</h4>
                    <p className="text-gray-400 text-sm">No professional decisions have been recorded for this client yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedTab === "communications" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">Client Communications</h2>
                </div>
                <Button
                  size="sm"
                  className="bg-purple-500/20 border-purple-500/30 text-purple-400 hover:bg-purple-500/30"
                  startContent={<MessageSquare className="w-3 h-3" />}
                >
                  New Communication
                </Button>
              </div>

              <div className="space-y-4">
                {communicationsLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="lg" color="primary" />
                  </div>
                ) : communicationsData?.length > 0 ? (
                  communicationsData.map((comm, index) => (
                  <div
                    key={comm.id || `comm-${index}`}
                    className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          comm.type === "email" ? "bg-blue-500/20" :
                          comm.type === "call" ? "bg-green-500/20" : "bg-purple-500/20"
                        }`}>
                          {comm.type === "email" ? <MessageSquare className="w-4 h-4 text-blue-400" /> :
                           comm.type === "call" ? <Phone className="w-4 h-4 text-green-400" /> :
                           <Calendar className="w-4 h-4 text-purple-400" />}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-sm tracking-tight">{comm.subject}</h3>
                          <p className="text-gray-400 text-xs">
                            {comm.participants.join(", ")} • {formatDate(comm.date)}
                            {comm.duration && ` • ${comm.duration}`}
                          </p>
                        </div>
                      </div>
                      <Chip
                        color={comm.status === "Completed" ? "success" : comm.status === "Sent" ? "primary" : "warning"}
                        size="sm"
                        className="text-xs"
                      >
                        {comm.status}
                      </Chip>
                    </div>

                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-gray-300 text-sm">
                        <span className="text-gray-400 text-xs">Follow-up:</span> {comm.followUp}
                      </p>
                    </div>
                  </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No communications found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedTab === "documents" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">Client Documents</h2>
                </div>
                <Button
                  size="sm"
                  className="bg-indigo-500/20 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/30"
                  startContent={<FileText className="w-3 h-3" />}
                >
                  Upload Document
                </Button>
              </div>

              <div className="space-y-4">
                {documentsLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="lg" color="primary" />
                  </div>
                ) : (
                  <>
                {/* Document Categories */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm">Legal Documents</h3>
                        <p className="text-gray-400 text-xs">12 files</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Engagement Letter</span>
                        <span className="text-green-400">✓</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Entity Formation</span>
                        <span className="text-green-400">✓</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Operating Agreement</span>
                        <span className="text-green-400">✓</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm">Financial Records</h3>
                        <p className="text-gray-400 text-xs">8 files</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Tax Returns</span>
                        <span className="text-green-400">✓</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Financial Statements</span>
                        <span className="text-green-400">✓</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Bank Statements</span>
                        <span className="text-yellow-400">⚠</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Shield className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm">Compliance</h3>
                        <p className="text-gray-400 text-xs">15 files</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Nexus Analysis</span>
                        <span className="text-green-400">✓</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Registration Docs</span>
                        <span className="text-yellow-400">⚠</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Audit Trail</span>
                        <span className="text-green-400">✓</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Documents */}
                <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                  <h3 className="text-lg font-semibold text-white tracking-tight mb-4">Recent Documents</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-sm">CA Sales Tax Registration Application</h4>
                          <p className="text-gray-400 text-xs">Legal Documents • Uploaded Dec 1, 2024</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Chip color="warning" size="sm" className="text-xs">Pending Review</Chip>
                        <Button
                          size="sm"
                          variant="flat"
                          className="bg-white/10 text-gray-300 hover:bg-white/20"
                          startContent={<Eye className="w-3 h-3" />}
                        >
                          View
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <BarChart3 className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-sm">Q4 2024 Financial Statements</h4>
                          <p className="text-gray-400 text-xs">Financial Records • Uploaded Nov 28, 2024</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Chip color="success" size="sm" className="text-xs">Approved</Chip>
                        <Button
                          size="sm"
                          variant="flat"
                          className="bg-white/10 text-gray-300 hover:bg-white/20"
                          startContent={<Download className="w-3 h-3" />}
                        >
                          Download
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <Shield className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-sm">Nexus Threshold Analysis Report</h4>
                          <p className="text-gray-400 text-xs">Compliance • Generated Nov 25, 2024</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Chip color="success" size="sm" className="text-xs">Complete</Chip>
                        <Button
                          size="sm"
                          variant="flat"
                          className="bg-white/10 text-gray-300 hover:bg-white/20"
                          startContent={<Eye className="w-3 h-3" />}
                        >
                          View
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                          <MessageSquare className="w-4 h-4 text-orange-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-sm">Client Advisory Letter - CA Registration</h4>
                          <p className="text-gray-400 text-xs">Communications • Generated Nov 20, 2024</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Chip color="success" size="sm" className="text-xs">Delivered</Chip>
                        <Button
                          size="sm"
                          variant="flat"
                          className="bg-white/10 text-gray-300 hover:bg-white/20"
                          startContent={<Eye className="w-3 h-3" />}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Document Actions */}
                <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                  <h3 className="text-lg font-semibold text-white tracking-tight mb-4">Document Actions</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Button
                        fullWidth
                        variant="flat"
                        className="bg-white/10 text-gray-300 hover:bg-white/20 justify-start"
                        startContent={<FileText className="w-4 h-4" />}
                      >
                        Generate Nexus Report
                      </Button>
                      <Button
                        fullWidth
                        variant="flat"
                        className="bg-white/10 text-gray-300 hover:bg-white/20 justify-start"
                        startContent={<Shield className="w-4 h-4" />}
                      >
                        Create Compliance Package
                      </Button>
                      <Button
                        fullWidth
                        variant="flat"
                        className="bg-white/10 text-gray-300 hover:bg-white/20 justify-start"
                        startContent={<MessageSquare className="w-4 h-4" />}
                      >
                        Generate Advisory Letter
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <Button
                        fullWidth
                        variant="flat"
                        className="bg-white/10 text-gray-300 hover:bg-white/20 justify-start"
                        startContent={<Download className="w-4 h-4" />}
                      >
                        Export All Documents
                      </Button>
                      <Button
                        fullWidth
                        variant="flat"
                        className="bg-white/10 text-gray-300 hover:bg-white/20 justify-start"
                        startContent={<Archive className="w-4 h-4" />}
                      >
                        Archive Old Documents
                      </Button>
                      <Button
                        fullWidth
                        variant="flat"
                        className="bg-white/10 text-gray-300 hover:bg-white/20 justify-start"
                        startContent={<ExternalLink className="w-4 h-4" />}
                      >
                        Share with Client
                      </Button>
                    </div>
                  </div>
                </div>
                  </>
                )}
              </div>
            </div>
          )}

          {selectedTab === "analytics" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Analytics */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">Performance Analytics</h2>
                </div>
                <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Risk Score</span>
                      <span className="text-white text-sm font-semibold">{metrics?.riskScore || 0}/100</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Quality Score</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-white text-sm font-semibold">{client.qualityScore || 0}%</span>
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={`star-${i}`}
                              className={`w-2 h-2 rounded-full ${
                                i < Math.floor((client.qualityScore || 0) / 20) ? 'bg-yellow-400' : 'bg-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Compliance Rate</span>
                      <span className="text-white text-sm font-semibold">{metrics?.complianceScore || 0}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Penalty Prevention</span>
                      <span className="text-green-400 text-sm font-semibold">{formatCurrency(metrics?.penaltyExposure || 0)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Active Alerts</span>
                      <span className="text-white text-sm font-semibold">{metrics?.activeAlerts || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Processing Status */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">Data Processing</h2>
                </div>
                <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
                  <div className="space-y-3">
                    {client.dataProcessing?.length > 0 ? (
                      client.dataProcessing.map((item, index) => (
                        <div key={item.id || `processing-${index}`} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                        <div>
                            <p className="text-white text-sm font-semibold">{item.fileName || `Processing Item ${index + 1}`}</p>
                            <p className="text-gray-400 text-xs">{item.status || 'Processing'}</p>
                        </div>
                          {item.qualityScore && (
                          <Chip
                              color={item.qualityScore >= 95 ? "success" : item.qualityScore >= 90 ? "warning" : "danger"}
                            size="sm"
                            className="text-xs"
                          >
                              {item.qualityScore}%
                          </Chip>
                        )}
                      </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-400">No data processing items found</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
            </div>
        </div>
      </div>
    </div>
  );
}
