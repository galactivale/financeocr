"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Card, 
  CardBody, 
  Button, 
  Chip, 
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Progress,
  Spinner
} from "@nextui-org/react";
import { useAlerts, useNexusAlerts, useClients } from "@/hooks/useApi";

// Alert data structure for Staff Accountant
interface StaffAlert {
  id: string;
  title: string;
  message: string;
  category: 'task-assignment' | 'client-communication' | 'system-update' | 'quality-feedback' | 'professional-development';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'unread' | 'read' | 'actioned' | 'dismissed';
  createdAt: string;
  dueDate?: string;
  client?: {
    id: string;
    name: string;
    avatar: string;
  };
  supervisor?: {
    name: string;
    role: string;
  };
  actions?: {
    id: string;
    label: string;
    type: 'accept' | 'escalate' | 'respond' | 'complete' | 'learn';
    primary?: boolean;
  }[];
  learningContent?: {
    title: string;
    description: string;
    resources: string[];
  };
  qualityMetrics?: {
    accuracy?: number;
    timeliness?: number;
    completeness?: number;
  };
}

// Utility functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getTimeUntilDue = (dueDate: string) => {
  const now = new Date();
  const due = new Date(dueDate);
  const diffMs = due.getTime() - now.getTime();
  const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 0) return "Overdue";
  if (diffHours < 24) return `${diffHours}h remaining`;
  const diffDays = Math.ceil(diffHours / 24);
  return `${diffDays}d remaining`;
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'task-assignment':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      );
    case 'client-communication':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      );
    case 'system-update':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    case 'quality-feedback':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'professional-development':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    default:
      return null;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'task-assignment': return 'primary';
    case 'client-communication': return 'secondary';
    case 'system-update': return 'warning';
    case 'quality-feedback': return 'success';
    case 'professional-development': return 'purple';
    default: return 'default';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'danger';
    case 'high': return 'warning';
    case 'medium': return 'primary';
    case 'low': return 'success';
    default: return 'default';
  }
};

// Transform API alerts to staff alerts
const transformAlertsToStaffAlerts = (apiAlerts: any[], nexusAlerts: any[], clients: any[]): StaffAlert[] => {
  const staffAlerts: StaffAlert[] = [];

  // Transform regular alerts
  apiAlerts.forEach(alert => {
    const client = clients.find(c => c.id === alert.clientId);
    staffAlerts.push({
      id: alert.id,
      title: alert.title || 'System Alert',
      message: alert.description || 'No description available',
      category: 'system-update',
      priority: alert.priority?.toLowerCase() || 'medium',
      status: alert.status === 'new' ? 'unread' : 'read',
      createdAt: alert.createdAt,
      dueDate: alert.deadline,
      client: client ? {
        id: client.id,
        name: client.name,
        avatar: client.name.charAt(0).toUpperCase()
      } : undefined,
      actions: [
        { id: 'view', label: 'View Details', type: 'respond', primary: true },
        { id: 'escalate', label: 'Escalate', type: 'escalate' }
      ]
    });
  });

  // Transform nexus alerts
  nexusAlerts.forEach(alert => {
    const client = clients.find(c => c.id === alert.clientId);
    staffAlerts.push({
      id: `nexus-${alert.id}`,
      title: `Nexus Alert: ${alert.title}`,
      message: alert.description || `Nexus threshold alert for ${alert.stateCode}`,
      category: 'task-assignment',
      priority: alert.priority?.toLowerCase() || 'medium',
      status: alert.status === 'open' ? 'unread' : 'read',
      createdAt: alert.createdAt,
      dueDate: alert.deadline,
      client: client ? {
        id: client.id,
        name: client.name,
        avatar: client.name.charAt(0).toUpperCase()
      } : undefined,
      actions: [
        { id: 'process', label: 'Process Alert', type: 'accept', primary: true },
        { id: 'escalate', label: 'Escalate', type: 'escalate' }
      ]
    });
  });

  // Add some sample staff-specific alerts
  staffAlerts.push(
    {
      id: "staff-001",
      title: "Professional Development: Economic Nexus Certification",
      message: "Complete your Economic Nexus Fundamentals certification module. This training covers threshold calculations, state-specific requirements, and compliance procedures. Required for advancement to senior staff level.",
      category: "professional-development",
      priority: "medium",
      status: "unread",
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      supervisor: {
        name: "Jane Doe, CPA",
        role: "Tax Manager"
      },
      actions: [
        { id: "start", label: "Start Training", type: "learn", primary: true },
        { id: "schedule", label: "Schedule Time", type: "respond" }
      ],
      learningContent: {
        title: "Economic Nexus Fundamentals Certification",
        description: "Comprehensive training covering all aspects of economic nexus determination, state requirements, and compliance procedures.",
        resources: ["Training Modules", "Practice Exercises", "Certification Exam", "Mentor Support"]
      }
    },
    {
      id: "staff-002",
      title: "Quality Feedback: Q3 Data Processing Review",
      message: "Your Q3 data processing work has been reviewed. Overall quality score: 92%. Areas for improvement: attention to detail in state allocation. Excellent work on client communication. Continue current approach with focus on accuracy.",
      category: "quality-feedback",
      priority: "medium",
      status: "read",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      supervisor: {
        name: "Jane Doe, CPA",
        role: "Tax Manager"
      },
      actions: [
        { id: "review", label: "Review Feedback", type: "respond", primary: true },
        { id: "improve", label: "Improvement Plan", type: "learn" }
      ],
      qualityMetrics: {
        accuracy: 88,
        timeliness: 95,
        completeness: 92
      }
    }
  );

  return staffAlerts;
};

export default function StaffAccountantAlerts() {
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch data from APIs
  const { data: alertsData, loading: alertsLoading, error: alertsError } = useAlerts({ limit: 20 });
  const { data: nexusAlertsData, loading: nexusAlertsLoading, error: nexusAlertsError } = useNexusAlerts({ limit: 20 });
  const { data: clientsData, loading: clientsLoading, error: clientsError } = useClients({ limit: 50 });

  const alerts = alertsData?.alerts || [];
  const nexusAlerts = nexusAlertsData?.alerts || [];
  const clients = clientsData?.clients || [];

  // Transform API data to staff alerts
  const staffAlerts = transformAlertsToStaffAlerts(alerts, nexusAlerts, clients);

  // Filter alerts
  const filteredAlerts = staffAlerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || alert.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || alert.priority === priorityFilter;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const handleAction = (alertId: string, actionId: string) => {
    console.log(`Action ${actionId} for alert ${alertId}`);
    // Here you would implement the actual action logic
  };

  // Calculate alert statistics
  const alertStats = {
    total: staffAlerts.length,
    unread: staffAlerts.filter(a => a.status === 'unread').length,
    urgent: staffAlerts.filter(a => a.priority === 'urgent').length,
    overdue: staffAlerts.filter(a => a.dueDate && new Date(a.dueDate) < new Date()).length,
    taskAssignments: staffAlerts.filter(a => a.category === 'task-assignment').length,
    clientCommunications: staffAlerts.filter(a => a.category === 'client-communication').length,
    professionalDevelopment: staffAlerts.filter(a => a.category === 'professional-development').length,
    qualityFeedback: staffAlerts.filter(a => a.category === 'quality-feedback').length,
    systemUpdates: staffAlerts.filter(a => a.category === 'system-update').length,
    withLearningContent: staffAlerts.filter(a => a.learningContent).length,
    requiresAction: staffAlerts.filter(a => a.actions && a.actions.length > 0).length
  };

  if (alertsLoading || nexusAlertsLoading || clientsLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="text-white mt-4">Loading alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-6 relative">
        <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
          
          {/* Main Content */}
          <div className="mt-6 gap-6 flex flex-col w-full">
            
            {/* Header */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
              <h2 className="text-2xl font-semibold text-white tracking-tight">Staff Accountant Alerts</h2>
            </div>
            
            {/* Alert Statistics */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-white font-semibold text-sm tracking-tight">Communication Center</h3>
                    <p className="text-gray-400 text-xs font-medium">Role-Appropriate Notifications & Professional Development</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs font-medium">Active</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{alertStats.total}</div>
                    <div className="text-gray-400 text-xs font-medium">Total Alerts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-500">{alertStats.unread}</div>
                    <div className="text-gray-400 text-xs font-medium">Unread</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-500">{alertStats.urgent}</div>
                    <div className="text-gray-400 text-xs font-medium">Urgent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-500">{alertStats.overdue}</div>
                    <div className="text-gray-400 text-xs font-medium">Overdue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-500">{alertStats.taskAssignments}</div>
                    <div className="text-gray-400 text-xs font-medium">Tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-500">{alertStats.clientCommunications}</div>
                    <div className="text-gray-400 text-xs font-medium">Communication</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-500">{alertStats.professionalDevelopment}</div>
                    <div className="text-gray-400 text-xs font-medium">Development</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">{alertStats.withLearningContent}</div>
                    <div className="text-gray-400 text-xs font-medium">Learning</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search alerts..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                    size="sm"
                    className="w-64 bg-white/5 border-white/10 text-white placeholder-gray-400"
                    classNames={{
                      input: "text-white",
                      inputWrapper: "bg-white/5 border-white/10 hover:border-white/20 focus-within:border-blue-500/50"
                    }}
                  />
                </div>
                
                <div className="flex gap-3 items-center">
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        categoryFilter === "all" 
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setCategoryFilter("all")}
                    >
                      All Categories
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        categoryFilter === "task-assignment" 
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setCategoryFilter("task-assignment")}
                    >
                      Tasks
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        categoryFilter === "client-communication" 
                          ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setCategoryFilter("client-communication")}
                    >
                      Communication
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        categoryFilter === "professional-development" 
                          ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setCategoryFilter("professional-development")}
                    >
                      Development
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        categoryFilter === "quality-feedback" 
                          ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setCategoryFilter("quality-feedback")}
                    >
                      Feedback
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        categoryFilter === "system-update" 
                          ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setCategoryFilter("system-update")}
                    >
                      Updates
                    </Button>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        priorityFilter === "all" 
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setPriorityFilter("all")}
                    >
                      All Priorities
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        priorityFilter === "urgent" 
                          ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setPriorityFilter("urgent")}
                    >
                      Urgent
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        priorityFilter === "high" 
                          ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setPriorityFilter("high")}
                    >
                      High
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Alert Cards */}
            <div className="space-y-4">
              {filteredAlerts.length === 0 ? (
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center">
                  <div className="text-white/60 font-medium text-lg mb-2">No alerts found</div>
                  <div className="text-white/40 text-sm">Try adjusting your filters or check back later</div>
                </div>
              ) : (
                filteredAlerts.map((alert) => (
                  <Card 
                    key={alert.id} 
                    className={`group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl hover:shadow-black/20 cursor-pointer ${
                      alert.status === 'unread' ? 'ring-2 ring-blue-500/20' : ''
                    } ${
                      alert.priority === 'urgent' ? 'ring-2 ring-red-500/20' : ''
                    }`}
                  >
                    <CardBody className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          {/* Alert Icon */}
                          <div className={`w-12 h-12 bg-${getCategoryColor(alert.category)}-500/20 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            alert.priority === 'urgent' ? 'animate-pulse' : ''
                          }`}>
                            <div className={`text-${getCategoryColor(alert.category)}-400`}>
                              {getCategoryIcon(alert.category)}
                            </div>
                          </div>
                          
                          {/* Alert Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-white font-semibold text-lg tracking-tight">{alert.title}</h4>
                              {alert.status === 'unread' && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                              )}
                              {alert.priority === 'urgent' && (
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                              )}
                            </div>
                            
                            <p className="text-gray-300 text-sm mb-3 line-clamp-2">{alert.message}</p>
                            
                            {/* Quality Metrics */}
                            {alert.qualityMetrics && (
                              <div className="flex items-center space-x-4 mb-3">
                                <div className="flex items-center space-x-2">
                                  <span className="text-gray-400 text-xs">Quality Score:</span>
                                  <div className="flex items-center space-x-1">
                                    <Progress 
                                      value={alert.qualityMetrics.accuracy || 0}
                                      className="w-16"
                                      color={alert.qualityMetrics.accuracy >= 90 ? 'success' : alert.qualityMetrics.accuracy >= 80 ? 'warning' : 'danger'}
                                      size="sm"
                                    />
                                    <span className="text-white text-xs font-semibold">{alert.qualityMetrics.accuracy}%</span>
                                  </div>
                                </div>
                                {alert.qualityMetrics.timeliness && (
                                  <div className="flex items-center space-x-1">
                                    <span className="text-gray-400 text-xs">Timeliness:</span>
                                    <span className="text-white text-xs">{alert.qualityMetrics.timeliness}%</span>
                                  </div>
                                )}
                                {alert.qualityMetrics.completeness && (
                                  <div className="flex items-center space-x-1">
                                    <span className="text-gray-400 text-xs">Completeness:</span>
                                    <span className="text-white text-xs">{alert.qualityMetrics.completeness}%</span>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* Alert Metadata */}
                            <div className="flex items-center space-x-4 text-xs">
                              <div className="flex items-center space-x-1">
                                <span className="text-gray-400">Created:</span>
                                <span className="text-white">{formatDate(alert.createdAt)}</span>
                              </div>
                              {alert.dueDate && (
                                <div className="flex items-center space-x-1">
                                  <span className="text-gray-400">Due:</span>
                                  <span className={`font-medium ${
                                    new Date(alert.dueDate) < new Date() ? 'text-red-400' : 
                                    new Date(alert.dueDate).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000 ? 'text-orange-400' : 'text-white'
                                  }`}>
                                    {getTimeUntilDue(alert.dueDate)}
                                  </span>
                                </div>
                              )}
                              {alert.client && (
                                <div className="flex items-center space-x-1">
                                  <span className="text-gray-400">Client:</span>
                                  <span className="text-white">{alert.client.name}</span>
                                </div>
                              )}
                              {alert.supervisor && (
                                <div className="flex items-center space-x-1">
                                  <span className="text-gray-400">From:</span>
                                  <span className="text-white">{alert.supervisor.name}</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Learning Content Indicator */}
                            {alert.learningContent && (
                              <div className="flex items-center space-x-2 mt-2">
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                <span className="text-purple-400 text-xs font-medium">Learning Resources Available</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Alert Actions & Status */}
                        <div className="flex flex-col items-end space-y-3">
                          <div className="flex items-center space-x-2">
                            <Chip 
                              color={getPriorityColor(alert.priority)}
                              size="sm"
                              className={alert.priority === 'urgent' ? 'animate-pulse' : ''}
                            >
                              {alert.priority.toUpperCase()}
                            </Chip>
                            <Chip 
                              color={getCategoryColor(alert.category)}
                              size="sm"
                              variant="flat"
                            >
                              {alert.category.replace('-', ' ')}
                            </Chip>
                          </div>
                          
                          {/* Quick Actions */}
                          {alert.actions && (
                            <div className="flex gap-2">
                              {alert.actions.slice(0, 2).map((action) => (
                                <Button
                                  key={action.id}
                                  size="sm"
                                  className={`${
                                    action.primary 
                                      ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                                  } text-xs font-medium transition-all duration-200`}
                                  onPress={(e) => {
                                    e.stopPropagation();
                                    handleAction(alert.id, action.id);
                                  }}
                                >
                                  {action.label}
                                </Button>
                              ))}
                              {alert.actions.length > 2 && (
                                <Button
                                  size="sm"
                                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-medium"
                                >
                                  More
                                </Button>
                              )}
                            </div>
                          )}
                          
                          {/* Learning Content Button */}
                          {alert.learningContent && (
                            <Button
                              size="sm"
                              className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 text-xs font-medium"
                              onPress={(e) => {
                                e.stopPropagation();
                                handleAction(alert.id, 'learn');
                              }}
                            >
                              View Resources
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}