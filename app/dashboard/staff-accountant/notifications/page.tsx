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
  Badge,
  Avatar,
  Tooltip
} from "@nextui-org/react";

// Notification data structure for Staff Accountant
interface StaffNotification {
  id: string;
  title: string;
  message: string;
  category: 'task-assignment' | 'client-communication' | 'quality-feedback' | 'training-update' | 'system-alert' | 'achievement';
  priority: 'critical' | 'high' | 'medium' | 'low';
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
    avatar: string;
  };
  actions?: {
    id: string;
    label: string;
    type: 'accept' | 'escalate' | 'respond' | 'complete' | 'learn' | 'schedule';
    primary?: boolean;
  }[];
  learningContent?: {
    title: string;
    description: string;
    resources: string[];
    estimatedTime: string;
  };
  qualityMetrics?: {
    accuracy?: number;
    timeliness?: number;
    completeness?: number;
    overall?: number;
  };
  achievement?: {
    type: 'skill' | 'certification' | 'performance' | 'milestone';
    badge: string;
    description: string;
  };
  relatedTasks?: string[];
  escalationNeeded: boolean;
}

// Sample notification data
const staffNotifications: StaffNotification[] = [
  {
    id: "notif-001",
    title: "New Task Assignment: Q4 California Nexus Analysis",
    message: "You have been assigned to complete Q4 2024 California economic nexus analysis for TechCorp SaaS. This task requires data validation, threshold calculation, and compliance documentation. Quality expectation: 95% accuracy with supervisor review required.",
    category: "task-assignment",
    priority: "critical",
    status: "unread",
    createdAt: "2024-12-12T09:00:00Z",
    dueDate: "2024-12-15T17:00:00Z",
    client: {
      id: "techcorp-saas",
      name: "TechCorp SaaS",
      avatar: "T"
    },
    supervisor: {
      name: "Jane Doe, CPA",
      role: "Tax Manager",
      avatar: "J"
    },
    actions: [
      { id: "accept", label: "Accept Task", type: "accept", primary: true },
      { id: "view", label: "View Details", type: "respond" },
      { id: "escalate", label: "Need Help", type: "escalate" }
    ],
    learningContent: {
      title: "California Economic Nexus Analysis",
      description: "Comprehensive guide to California's economic nexus requirements, threshold calculations, and compliance procedures.",
      resources: ["CA Nexus Guide", "Threshold Calculator", "Documentation Template", "Supervisor Contact"],
      estimatedTime: "4-6 hours"
    },
    qualityMetrics: {
      accuracy: 95,
      timeliness: 100,
      completeness: 90,
      overall: 95
    },
    relatedTasks: ["Data Collection", "Threshold Analysis", "Documentation"],
    escalationNeeded: false
  },
  {
    id: "notif-002",
    title: "Client Communication: RetailChain Data Upload Issue",
    message: "RetailChain LLC is experiencing difficulties uploading their Q4 sales data. They've requested assistance with the upload process and need guidance on data formatting requirements.",
    category: "client-communication",
    priority: "high",
    status: "unread",
    createdAt: "2024-12-12T08:30:00Z",
    dueDate: "2024-12-13T17:00:00Z",
    client: {
      id: "retailchain-llc",
      name: "RetailChain LLC",
      avatar: "R"
    },
    actions: [
      { id: "contact", label: "Contact Client", type: "respond", primary: true },
      { id: "template", label: "Use Support Template", type: "respond" },
      { id: "escalate", label: "Escalate to IT", type: "escalate" }
    ],
    learningContent: {
      title: "Client Data Upload Support",
      description: "Best practices for assisting clients with data upload issues and troubleshooting common problems.",
      resources: ["Support Templates", "Troubleshooting Guide", "Client Communication Standards"],
      estimatedTime: "1-2 hours"
    }
  },
  {
    id: "notif-003",
    title: "Quality Feedback: Q3 Performance Review",
    message: "Your Q3 2024 performance has been reviewed. Overall quality score: 92%. Excellent work on client communication and data accuracy. Continue current approach with focus on attention to detail in state allocation.",
    category: "quality-feedback",
    priority: "medium",
    status: "read",
    createdAt: "2024-12-10T16:00:00Z",
    supervisor: {
      name: "Jane Doe, CPA",
      role: "Tax Manager",
      avatar: "J"
    },
    actions: [
      { id: "review", label: "Review Feedback", type: "respond", primary: true },
      { id: "improve", label: "Improvement Plan", type: "learn" }
    ],
    qualityMetrics: {
      accuracy: 88,
      timeliness: 95,
      completeness: 92,
      overall: 92
    }
  },
  {
    id: "notif-004",
    title: "Training Update: Economic Nexus Certification",
    message: "Complete your Economic Nexus Fundamentals certification module. This training covers threshold calculations, state-specific requirements, and compliance procedures. Required for advancement to senior staff level.",
    category: "training-update",
    priority: "medium",
    status: "unread",
    createdAt: "2024-12-11T14:00:00Z",
    dueDate: "2024-12-20T17:00:00Z",
    supervisor: {
      name: "Jane Doe, CPA",
      role: "Tax Manager",
      avatar: "J"
    },
    actions: [
      { id: "start", label: "Start Training", type: "learn", primary: true },
      { id: "schedule", label: "Schedule Time", type: "schedule" }
    ],
    learningContent: {
      title: "Economic Nexus Fundamentals Certification",
      description: "Comprehensive training covering all aspects of economic nexus determination, state requirements, and compliance procedures.",
      resources: ["Training Modules", "Practice Exercises", "Certification Exam", "Mentor Support"],
      estimatedTime: "8-10 hours"
    }
  },
  {
    id: "notif-005",
    title: "Achievement Unlocked: Data Accuracy Excellence",
    message: "Congratulations! You've achieved 95%+ accuracy on 10 consecutive data processing tasks. This demonstrates excellent attention to detail and professional competency in Economic Nexus compliance work.",
    category: "achievement",
    priority: "low",
    status: "unread",
    createdAt: "2024-12-12T10:00:00Z",
    achievement: {
      type: "performance",
      badge: "Data Accuracy Excellence",
      description: "Maintained 95%+ accuracy on 10 consecutive tasks"
    },
    actions: [
      { id: "view", label: "View Achievement", type: "respond", primary: true },
      { id: "share", label: "Share with Team", type: "respond" }
    ]
  },
  {
    id: "notif-006",
    title: "System Alert: New Validation Tools Available",
    message: "New automated validation tools have been deployed to improve data accuracy and reduce processing time. Training session scheduled for tomorrow at 2 PM. Attendance required for all staff accountants.",
    category: "system-alert",
    priority: "high",
    status: "unread",
    createdAt: "2024-12-12T10:00:00Z",
    dueDate: "2024-12-13T14:00:00Z",
    actions: [
      { id: "attend", label: "Confirm Attendance", type: "accept", primary: true },
      { id: "learn", label: "Preview Tools", type: "learn" }
    ],
    learningContent: {
      title: "New Data Validation Tools Training",
      description: "Learn to use the new automated validation tools that will improve data accuracy and reduce processing time.",
      resources: ["Tool Documentation", "Training Session", "Practice Exercises", "Support Contact"],
      estimatedTime: "2-3 hours"
    }
  }
];

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
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      );
    case 'client-communication':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      );
    case 'quality-feedback':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'training-update':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case 'system-alert':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    case 'achievement':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
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
    case 'quality-feedback': return 'success';
    case 'training-update': return 'warning';
    case 'system-alert': return 'danger';
    case 'achievement': return 'purple';
    default: return 'default';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical': return 'danger';
    case 'high': return 'warning';
    case 'medium': return 'primary';
    case 'low': return 'success';
    default: return 'default';
  }
};

export default function StaffAccountantNotifications() {
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter notifications
  const filteredNotifications = staffNotifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || notification.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || notification.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || notification.status === statusFilter;
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  const handleAction = (notificationId: string, actionId: string) => {
    console.log(`Action ${actionId} for notification ${notificationId}`);
  };

  // Calculate notification statistics
  const notificationStats = {
    total: staffNotifications.length,
    unread: staffNotifications.filter(n => n.status === 'unread').length,
    critical: staffNotifications.filter(n => n.priority === 'critical').length,
    overdue: staffNotifications.filter(n => n.dueDate && new Date(n.dueDate) < new Date()).length,
    taskAssignments: staffNotifications.filter(n => n.category === 'task-assignment').length,
    clientCommunications: staffNotifications.filter(n => n.category === 'client-communication').length,
    qualityFeedback: staffNotifications.filter(n => n.category === 'quality-feedback').length,
    trainingUpdates: staffNotifications.filter(n => n.category === 'training-update').length,
    achievements: staffNotifications.filter(n => n.category === 'achievement').length,
    withLearningContent: staffNotifications.filter(n => n.learningContent).length,
    requiresAction: staffNotifications.filter(n => n.actions && n.actions.length > 0).length
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-6 relative">
        <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
          
          {/* Main Content */}
          <div className="mt-6 gap-6 flex flex-col w-full">
            
            {/* Header */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
              <h2 className="text-2xl font-semibold text-white tracking-tight">Notifications Center</h2>
            </div>
            
            {/* Notification Statistics */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-white font-semibold text-sm tracking-tight">Communication Hub</h3>
                    <p className="text-gray-400 text-xs font-medium">Supervised Task Coordination & Professional Development</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs font-medium">Active</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{notificationStats.total}</div>
                    <div className="text-gray-400 text-xs font-medium">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-500">{notificationStats.unread}</div>
                    <div className="text-gray-400 text-xs font-medium">Unread</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-500">{notificationStats.critical}</div>
                    <div className="text-gray-400 text-xs font-medium">Critical</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-500">{notificationStats.overdue}</div>
                    <div className="text-gray-400 text-xs font-medium">Overdue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-500">{notificationStats.taskAssignments}</div>
                    <div className="text-gray-400 text-xs font-medium">Tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-500">{notificationStats.trainingUpdates}</div>
                    <div className="text-gray-400 text-xs font-medium">Training</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-500">{notificationStats.achievements}</div>
                    <div className="text-gray-400 text-xs font-medium">Achievements</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search notifications..."
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
                        categoryFilter === "training-update" 
                          ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setCategoryFilter("training-update")}
                    >
                      Training
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        categoryFilter === "achievement" 
                          ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setCategoryFilter("achievement")}
                    >
                      Achievements
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
                        priorityFilter === "critical" 
                          ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setPriorityFilter("critical")}
                    >
                      Critical
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
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        statusFilter === "all" 
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setStatusFilter("all")}
                    >
                      All Status
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        statusFilter === "unread" 
                          ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setStatusFilter("unread")}
                    >
                      Unread
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        statusFilter === "actioned" 
                          ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setStatusFilter("actioned")}
                    >
                      Actioned
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Cards */}
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl hover:shadow-black/20 cursor-pointer ${
                    notification.status === 'unread' ? 'ring-2 ring-blue-500/20' : ''
                  } ${
                    notification.priority === 'critical' ? 'ring-2 ring-red-500/20' : ''
                  } ${
                    notification.category === 'achievement' ? 'ring-2 ring-purple-500/20' : ''
                  }`}
                >
                  <CardBody className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Notification Icon */}
                        <div className={`w-12 h-12 bg-${getCategoryColor(notification.category)}-500/20 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          notification.priority === 'critical' ? 'animate-pulse' : ''
                        }`}>
                          <div className={`text-${getCategoryColor(notification.category)}-400`}>
                            {getCategoryIcon(notification.category)}
                          </div>
                        </div>
                        
                        {/* Notification Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-white font-semibold text-lg tracking-tight">{notification.title}</h4>
                            {notification.status === 'unread' && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            )}
                            {notification.priority === 'critical' && (
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            )}
                            {notification.category === 'achievement' && (
                              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                          
                          <p className="text-gray-300 text-sm mb-3 line-clamp-2">{notification.message}</p>
                          
                          {/* Quality Metrics */}
                          {notification.qualityMetrics && (
                            <div className="flex items-center space-x-4 mb-3">
                              <div className="flex items-center space-x-2">
                                <span className="text-gray-400 text-xs">Overall Score:</span>
                                <div className="flex items-center space-x-1">
                                  <Progress 
                                    value={notification.qualityMetrics.overall || 0}
                                    className="w-16"
                                    color={notification.qualityMetrics.overall >= 90 ? 'success' : notification.qualityMetrics.overall >= 80 ? 'warning' : 'danger'}
                                    size="sm"
                                  />
                                  <span className="text-white text-xs font-semibold">{notification.qualityMetrics.overall}%</span>
                                </div>
                              </div>
                              {notification.qualityMetrics.accuracy && (
                                <div className="flex items-center space-x-1">
                                  <span className="text-gray-400 text-xs">Accuracy:</span>
                                  <span className="text-white text-xs">{notification.qualityMetrics.accuracy}%</span>
                                </div>
                              )}
                              {notification.qualityMetrics.timeliness && (
                                <div className="flex items-center space-x-1">
                                  <span className="text-gray-400 text-xs">Timeliness:</span>
                                  <span className="text-white text-xs">{notification.qualityMetrics.timeliness}%</span>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Achievement Badge */}
                          {notification.achievement && (
                            <div className="flex items-center space-x-2 mb-3 p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                              <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                              </div>
                              <div>
                                <span className="text-purple-400 text-sm font-semibold">{notification.achievement.badge}</span>
                                <p className="text-gray-300 text-xs">{notification.achievement.description}</p>
                              </div>
                            </div>
                          )}
                          
                          {/* Notification Metadata */}
                          <div className="flex items-center space-x-4 text-xs">
                            <div className="flex items-center space-x-1">
                              <span className="text-gray-400">Created:</span>
                              <span className="text-white">{formatDate(notification.createdAt)}</span>
                            </div>
                            {notification.dueDate && (
                              <div className="flex items-center space-x-1">
                                <span className="text-gray-400">Due:</span>
                                <span className={`font-medium ${
                                  new Date(notification.dueDate) < new Date() ? 'text-red-400' : 
                                  new Date(notification.dueDate).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000 ? 'text-orange-400' : 'text-white'
                                }`}>
                                  {getTimeUntilDue(notification.dueDate)}
                                </span>
                              </div>
                            )}
                            {notification.client && (
                              <div className="flex items-center space-x-1">
                                <span className="text-gray-400">Client:</span>
                                <span className="text-white">{notification.client.name}</span>
                              </div>
                            )}
                            {notification.supervisor && (
                              <div className="flex items-center space-x-1">
                                <span className="text-gray-400">From:</span>
                                <span className="text-white">{notification.supervisor.name}</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Learning Content Indicator */}
                          {notification.learningContent && (
                            <div className="flex items-center space-x-2 mt-2">
                              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                              <span className="text-purple-400 text-xs font-medium">Learning Resources Available ({notification.learningContent.estimatedTime})</span>
                            </div>
                          )}
                          
                          {/* Related Tasks */}
                          {notification.relatedTasks && (
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-gray-400 text-xs">Related Tasks:</span>
                              <div className="flex space-x-1">
                                {notification.relatedTasks.map((task, index) => (
                                  <Chip key={index} size="sm" variant="flat" className="text-xs">
                                    {task}
                                  </Chip>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Notification Actions & Status */}
                      <div className="flex flex-col items-end space-y-3">
                        <div className="flex items-center space-x-2">
                          <Chip 
                            color={getPriorityColor(notification.priority)}
                            size="sm"
                            className={notification.priority === 'critical' ? 'animate-pulse' : ''}
                          >
                            {notification.priority.toUpperCase()}
                          </Chip>
                          <Chip 
                            color={getCategoryColor(notification.category)}
                            size="sm"
                            variant="flat"
                          >
                            {notification.category.replace('-', ' ')}
                          </Chip>
                        </div>
                        
                        {/* Quick Actions */}
                        {notification.actions && (
                          <div className="flex gap-2">
                            {notification.actions.slice(0, 2).map((action) => (
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
                                  handleAction(notification.id, action.id);
                                }}
                              >
                                {action.label}
                              </Button>
                            ))}
                            {notification.actions.length > 2 && (
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
                        {notification.learningContent && (
                          <Button
                            size="sm"
                            className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 text-xs font-medium"
                            onPress={(e) => {
                              e.stopPropagation();
                              handleAction(notification.id, 'learn');
                            }}
                          >
                            View Resources
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
