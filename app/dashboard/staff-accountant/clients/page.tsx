"use client";
import React, { useState, useRef, useEffect } from "react";
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
  Textarea,
  Input,
  Progress,
  Badge,
  Avatar,
  Tooltip
} from "@nextui-org/react";

// Task-oriented client data structure for Staff Accountant
interface StaffClient {
  id: string;
  name: string;
  avatar: string;
  industry: string;
  assignedSince: string;
  supervisor: string;
  taskStatus: 'pending' | 'in-progress' | 'review' | 'completed' | 'escalated';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  currentTasks: {
    id: string;
    type: 'data-entry' | 'validation' | 'communication' | 'document-upload' | 'quality-check';
    title: string;
    description: string;
    dueDate: string;
    progress: number;
    status: 'pending' | 'in-progress' | 'completed' | 'needs-review';
    qualityScore?: number;
  }[];
  dataStatus: {
    salesData: 'complete' | 'partial' | 'missing';
    documents: 'complete' | 'partial' | 'missing';
    validation: 'passed' | 'pending' | 'failed';
    lastUpdate: string;
  };
  communication: {
    lastContact: string;
    pendingRequests: number;
    escalationNeeded: boolean;
    supervisorNotes: string;
  };
  qualityMetrics: {
    accuracyScore: number;
    completionRate: number;
    errorCount: number;
    lastReview: string;
  };
}

// Sample task-oriented client data
const staffClients: StaffClient[] = [
  {
    id: "techcorp-saas",
    name: "TechCorp SaaS",
    avatar: "T",
    industry: "Technology SaaS",
    assignedSince: "Jan 2024",
    supervisor: "Jane Doe, CPA",
    taskStatus: "in-progress",
    priority: "urgent",
    currentTasks: [
      {
        id: "task-1",
        type: "data-entry",
        title: "Q4 Sales Data Entry",
        description: "Enter California sales data for Q4 2024",
        dueDate: "Dec 15, 2024",
        progress: 75,
        status: "in-progress",
        qualityScore: 92
      },
      {
        id: "task-2",
        type: "validation",
        title: "Revenue Threshold Validation",
        description: "Verify California threshold calculations",
        dueDate: "Dec 18, 2024",
        progress: 0,
        status: "pending"
      },
      {
        id: "task-3",
        type: "communication",
        title: "Client Data Request",
        description: "Request missing transaction data",
        dueDate: "Dec 12, 2024",
        progress: 100,
        status: "completed"
      }
    ],
    dataStatus: {
      salesData: "partial",
      documents: "complete",
      validation: "pending",
      lastUpdate: "Dec 10, 2024"
    },
    communication: {
      lastContact: "Dec 8, 2024",
      pendingRequests: 2,
      escalationNeeded: false,
      supervisorNotes: "Client responsive, data quality improving"
    },
    qualityMetrics: {
      accuracyScore: 92,
      completionRate: 78,
      errorCount: 1,
      lastReview: "Dec 5, 2024"
    }
  },
  {
    id: "retailchain-llc",
    name: "RetailChain LLC",
    avatar: "R",
    industry: "E-commerce",
    assignedSince: "Mar 2024",
    supervisor: "Jane Doe, CPA",
    taskStatus: "review",
    priority: "high",
    currentTasks: [
      {
        id: "task-4",
        type: "quality-check",
        title: "Data Quality Review",
        description: "Review entered data for accuracy",
        dueDate: "Dec 14, 2024",
        progress: 100,
        status: "needs-review",
        qualityScore: 88
      },
      {
        id: "task-5",
        type: "document-upload",
        title: "Supporting Documents",
        description: "Upload sales receipts and invoices",
        dueDate: "Dec 16, 2024",
        progress: 60,
        status: "in-progress"
      }
    ],
    dataStatus: {
      salesData: "complete",
      documents: "partial",
      validation: "passed",
      lastUpdate: "Dec 9, 2024"
    },
    communication: {
      lastContact: "Dec 7, 2024",
      pendingRequests: 1,
      escalationNeeded: false,
      supervisorNotes: "Good progress, minor documentation gaps"
    },
    qualityMetrics: {
      accuracyScore: 88,
      completionRate: 85,
      errorCount: 2,
      lastReview: "Dec 3, 2024"
    }
  },
  {
    id: "manufacturingco",
    name: "ManufacturingCo",
    avatar: "M",
    industry: "Manufacturing",
    assignedSince: "Feb 2024",
    supervisor: "Jane Doe, CPA",
    taskStatus: "pending",
    priority: "medium",
    currentTasks: [
      {
        id: "task-6",
        type: "data-entry",
        title: "Texas Sales Data Entry",
        description: "Enter Q4 Texas sales data",
        dueDate: "Dec 20, 2024",
        progress: 0,
        status: "pending"
      }
    ],
    dataStatus: {
      salesData: "missing",
      documents: "missing",
      validation: "pending",
      lastUpdate: "Nov 28, 2024"
    },
    communication: {
      lastContact: "Nov 25, 2024",
      pendingRequests: 3,
      escalationNeeded: true,
      supervisorNotes: "Client unresponsive, may need supervisor intervention"
    },
    qualityMetrics: {
      accuracyScore: 95,
      completionRate: 45,
      errorCount: 0,
      lastReview: "Nov 20, 2024"
    }
  },
  {
    id: "servicescorp",
    name: "ServicesCorp",
    avatar: "S",
    industry: "Professional Services",
    assignedSince: "Jun 2024",
    supervisor: "Jane Doe, CPA",
    taskStatus: "completed",
    priority: "low",
    currentTasks: [
      {
        id: "task-7",
        type: "validation",
        title: "Final Data Validation",
        description: "Complete final validation checks",
        dueDate: "Dec 11, 2024",
        progress: 100,
        status: "completed",
        qualityScore: 96
      }
    ],
    dataStatus: {
      salesData: "complete",
      documents: "complete",
      validation: "passed",
      lastUpdate: "Dec 11, 2024"
    },
    communication: {
      lastContact: "Dec 10, 2024",
      pendingRequests: 0,
      escalationNeeded: false,
      supervisorNotes: "Excellent work, ready for supervisor review"
    },
    qualityMetrics: {
      accuracyScore: 96,
      completionRate: 100,
      errorCount: 0,
      lastReview: "Dec 10, 2024"
    }
  }
];

// Utility functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getTaskTypeIcon = (type: string) => {
  switch (type) {
    case 'data-entry':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case 'validation':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'communication':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      );
    case 'document-upload':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      );
    case 'quality-check':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      );
    default:
      return null;
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

const getTaskStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'success';
    case 'in-progress': return 'primary';
    case 'needs-review': return 'warning';
    case 'pending': return 'default';
    default: return 'default';
  }
};

export default function StaffAccountantClients() {
  const router = useRouter();
  const [selectedClient, setSelectedClient] = useState<StaffClient | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [taskFilter, setTaskFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);

  // Filter clients based on search and task filter
  const filteredClients = staffClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTask = taskFilter === 'all' || client.taskStatus === taskFilter;
    return matchesSearch && matchesTask;
  });

  const handleClientSelect = (client: StaffClient) => {
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

  // Calculate work queue stats
  const workQueueStats = {
    totalClients: staffClients.length,
    pendingTasks: staffClients.reduce((sum, c) => sum + c.currentTasks.filter(t => t.status === 'pending').length, 0),
    inProgressTasks: staffClients.reduce((sum, c) => sum + c.currentTasks.filter(t => t.status === 'in-progress').length, 0),
    needsReview: staffClients.reduce((sum, c) => sum + c.currentTasks.filter(t => t.status === 'needs-review').length, 0),
    escalationNeeded: staffClients.filter(c => c.communication.escalationNeeded).length
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-6 relative">
        <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
          
          {/* Main Content */}
          <div className="mt-6 gap-6 flex flex-col w-full">
            {/* Work Queue Header */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Client Work Queue</h2>
              </div>
              
              {/* Work Queue Stats */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-white font-semibold text-sm tracking-tight">Staff Accountant Dashboard</h3>
                      <p className="text-gray-400 text-xs font-medium">Task-Oriented Client Management</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs font-medium">Active</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{workQueueStats.totalClients}</div>
                      <div className="text-gray-400 text-xs font-medium">Assigned Clients</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-500">{workQueueStats.pendingTasks}</div>
                      <div className="text-gray-400 text-xs font-medium">Pending Tasks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-500">{workQueueStats.inProgressTasks}</div>
                      <div className="text-gray-400 text-xs font-medium">In Progress</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-500">{workQueueStats.needsReview}</div>
                      <div className="text-gray-400 text-xs font-medium">Needs Review</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-500">{workQueueStats.escalationNeeded}</div>
                      <div className="text-gray-400 text-xs font-medium">Escalation</div>
                    </div>
                  </div>
                </div>
              </div>

            {/* Controls */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    onPress={() => setViewMode('grid')}
                  >
                    Grid View
                  </Button>
                  <Button
                    size="sm"
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    onPress={() => setViewMode('list')}
                  >
                    List View
                  </Button>
                </div>
                
                <div className="flex gap-3 items-center">
                  <div className="relative">
                    <Input
                      placeholder="Search clients..."
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
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        taskFilter === "all" 
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setTaskFilter("all")}
                    >
                      All
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        taskFilter === "pending" 
                          ? 'bg-gray-500 text-white shadow-lg shadow-gray-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setTaskFilter("pending")}
                    >
                      Pending
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        taskFilter === "in-progress" 
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setTaskFilter("in-progress")}
                    >
                      In Progress
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        taskFilter === "review" 
                          ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setTaskFilter("review")}
                    >
                      Review
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        taskFilter === "escalated" 
                          ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setTaskFilter("escalated")}
                    >
                      Escalated
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Client Cards/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredClients.map((client) => (
                <div 
                  key={client.id} 
                  className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20 cursor-pointer"
                  onClick={() => handleClientSelect(client)}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar 
                        name={client.avatar} 
                        className="w-10 h-10 bg-blue-500/20 text-blue-400 font-semibold"
                      />
                      <div>
                        <h4 className="text-white font-semibold text-lg tracking-tight">{client.name}</h4>
                        <p className="text-gray-400 text-sm font-medium">{client.industry}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Chip 
                        color={getPriorityColor(client.priority)}
                        size="sm"
                        className="mb-2"
                      >
                        {client.priority.toUpperCase()}
                      </Chip>
                      <p className="text-gray-400 text-xs font-medium">Supervisor: {client.supervisor}</p>
                    </div>
                  </div>

                  {/* Task Progress */}
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white text-sm font-medium">Task Progress</span>
                      <span className="text-gray-400 text-xs">
                        {client.currentTasks.filter(t => t.status === 'completed').length}/{client.currentTasks.length}
                      </span>
                    </div>
                    <Progress 
                      value={(client.currentTasks.filter(t => t.status === 'completed').length / client.currentTasks.length) * 100}
                      className="w-full"
                      color="primary"
                      size="sm"
                    />
                  </div>

                  {/* Current Tasks */}
                  <div className="space-y-2 mb-4">
                    {client.currentTasks.slice(0, 2).map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="text-blue-400">
                            {getTaskTypeIcon(task.type)}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{task.title}</p>
                            <p className="text-gray-400 text-xs">Due: {formatDate(task.dueDate)}</p>
                          </div>
                        </div>
                        <Chip 
                          color={getTaskStatusColor(task.status)}
                          size="sm"
                          variant="flat"
                        >
                          {task.status.replace('-', ' ')}
                        </Chip>
                      </div>
                    ))}
                    {client.currentTasks.length > 2 && (
                      <p className="text-gray-400 text-xs font-medium">+{client.currentTasks.length - 2} more tasks</p>
                    )}
                  </div>

                  {/* Data Status */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        client.dataStatus.salesData === 'complete' ? 'bg-green-500' :
                        client.dataStatus.salesData === 'partial' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-white text-sm font-medium">Data Status</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {client.communication.escalationNeeded && (
                        <Tooltip content="Escalation Required">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        </Tooltip>
                      )}
                      <span className="text-gray-400 text-xs">Last: {formatDate(client.dataStatus.lastUpdate)}</span>
                    </div>
                  </div>

                  {/* Quality Score */}
                  <div className="flex justify-between items-center">
                    <span className="text-white text-sm font-medium">Quality Score</span>
                    <div className="flex items-center space-x-2">
                      <Progress 
                        value={client.qualityMetrics.accuracyScore}
                        className="w-16"
                        color={client.qualityMetrics.accuracyScore >= 90 ? 'success' : client.qualityMetrics.accuracyScore >= 80 ? 'warning' : 'danger'}
                        size="sm"
                      />
                      <span className="text-white text-sm font-semibold">{client.qualityMetrics.accuracyScore}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <Table aria-label="Client Work Queue" className="text-white">
                <TableHeader>
                  <TableColumn className="text-white font-semibold">CLIENT</TableColumn>
                  <TableColumn className="text-white font-semibold">PRIORITY</TableColumn>
                  <TableColumn className="text-white font-semibold">TASKS</TableColumn>
                  <TableColumn className="text-white font-semibold">PROGRESS</TableColumn>
                  <TableColumn className="text-white font-semibold">DATA STATUS</TableColumn>
                  <TableColumn className="text-white font-semibold">QUALITY</TableColumn>
                  <TableColumn className="text-white font-semibold">ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow 
                      key={client.id}
                      className="cursor-pointer hover:bg-white/5 transition-colors duration-200"
                      onClick={() => handleClientSelect(client)}
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar 
                            name={client.avatar} 
                            className="w-8 h-8 bg-blue-500/20 text-blue-400 font-semibold"
                          />
                          <div>
                            <div className="text-white font-semibold">{client.name}</div>
                            <div className="text-gray-400 text-xs">{client.industry}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          color={getPriorityColor(client.priority)}
                          size="sm"
                        >
                          {client.priority.toUpperCase()}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">
                            {client.currentTasks.filter(t => t.status === 'completed').length}/{client.currentTasks.length}
                          </span>
                          <span className="text-gray-400 text-xs">completed</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Progress 
                          value={(client.currentTasks.filter(t => t.status === 'completed').length / client.currentTasks.length) * 100}
                          className="w-20"
                          color="primary"
                          size="sm"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            client.dataStatus.salesData === 'complete' ? 'bg-green-500' :
                            client.dataStatus.salesData === 'partial' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                          <span className="text-white text-sm">{client.dataStatus.salesData}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress 
                            value={client.qualityMetrics.accuracyScore}
                            className="w-16"
                            color={client.qualityMetrics.accuracyScore >= 90 ? 'success' : client.qualityMetrics.accuracyScore >= 80 ? 'warning' : 'danger'}
                            size="sm"
                          />
                          <span className="text-white text-sm font-semibold">{client.qualityMetrics.accuracyScore}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg font-medium transition-all duration-200"
                          >
                            Work Tasks
                          </Button>
                          {client.communication.escalationNeeded && (
                            <Button 
                              size="sm" 
                              className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 rounded-lg font-medium transition-all duration-200"
                            >
                              Escalate
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Client Detail Panel */}
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
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              <h3 className="text-white text-lg font-semibold tracking-tight">Client Work Details</h3>
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
            {selectedClient ? (
              <div className="space-y-6">
                {/* Client Overview */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                  <div className="flex justify-between items-start w-full mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar 
                        name={selectedClient.avatar} 
                        className="w-12 h-12 bg-blue-500/20 text-blue-400 font-semibold"
                      />
                      <div>
                        <h4 className="text-white text-xl font-bold tracking-tight">{selectedClient.name}</h4>
                        <p className="text-gray-400 text-sm font-medium">{selectedClient.industry}</p>
                        <p className="text-gray-400 text-xs">Supervisor: {selectedClient.supervisor}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Chip 
                        color={getPriorityColor(selectedClient.priority)}
                        size="sm"
                        className="mb-2"
                      >
                        {selectedClient.priority.toUpperCase()} PRIORITY
                      </Chip>
                      <p className="text-gray-400 text-xs">Assigned: {selectedClient.assignedSince}</p>
                    </div>
                  </div>
                </div>

                {/* Current Tasks */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                    <h4 className="text-white text-lg font-semibold tracking-tight">Current Tasks</h4>
                  </div>
                  <div className="space-y-3">
                    {selectedClient.currentTasks.map((task) => (
                      <div key={task.id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="text-blue-400">
                              {getTaskTypeIcon(task.type)}
                            </div>
                            <div>
                              <p className="text-white font-semibold">{task.title}</p>
                              <p className="text-gray-400 text-sm">{task.description}</p>
                            </div>
                          </div>
                          <Chip 
                            color={getTaskStatusColor(task.status)}
                            size="sm"
                          >
                            {task.status.replace('-', ' ')}
                          </Chip>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-xs">Due: {formatDate(task.dueDate)}</span>
                          <div className="flex items-center space-x-2">
                            <Progress 
                              value={task.progress}
                              className="w-20"
                              color="primary"
                              size="sm"
                            />
                            <span className="text-white text-sm font-semibold">{task.progress}%</span>
                          </div>
                        </div>
                        {task.qualityScore && (
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-gray-400 text-xs">Quality Score:</span>
                            <span className="text-white text-sm font-semibold">{task.qualityScore}%</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Data Status */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                    <h4 className="text-white text-lg font-semibold tracking-tight">Data Status</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-medium">Sales Data:</span>
                      <Chip 
                        color={selectedClient.dataStatus.salesData === 'complete' ? 'success' : selectedClient.dataStatus.salesData === 'partial' ? 'warning' : 'danger'}
                        size="sm"
                      >
                        {selectedClient.dataStatus.salesData}
                      </Chip>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-medium">Documents:</span>
                      <Chip 
                        color={selectedClient.dataStatus.documents === 'complete' ? 'success' : selectedClient.dataStatus.documents === 'partial' ? 'warning' : 'danger'}
                        size="sm"
                      >
                        {selectedClient.dataStatus.documents}
                      </Chip>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-medium">Validation:</span>
                      <Chip 
                        color={selectedClient.dataStatus.validation === 'passed' ? 'success' : selectedClient.dataStatus.validation === 'pending' ? 'warning' : 'danger'}
                        size="sm"
                      >
                        {selectedClient.dataStatus.validation}
                      </Chip>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-medium">Last Update:</span>
                      <span className="text-white">{formatDate(selectedClient.dataStatus.lastUpdate)}</span>
                    </div>
                  </div>
                </div>

                {/* Quality Metrics */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                    <h4 className="text-white text-lg font-semibold tracking-tight">Quality Metrics</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-medium">Accuracy Score:</span>
                      <div className="flex items-center space-x-2">
                        <Progress 
                          value={selectedClient.qualityMetrics.accuracyScore}
                          className="w-16"
                          color={selectedClient.qualityMetrics.accuracyScore >= 90 ? 'success' : selectedClient.qualityMetrics.accuracyScore >= 80 ? 'warning' : 'danger'}
                          size="sm"
                        />
                        <span className="text-white font-semibold">{selectedClient.qualityMetrics.accuracyScore}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-medium">Completion Rate:</span>
                      <span className="text-white font-semibold">{selectedClient.qualityMetrics.completionRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-medium">Error Count:</span>
                      <span className="text-white font-semibold">{selectedClient.qualityMetrics.errorCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-medium">Last Review:</span>
                      <span className="text-white">{formatDate(selectedClient.qualityMetrics.lastReview)}</span>
                    </div>
                  </div>
                </div>

                {/* Communication Status */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h4 className="text-white text-lg font-semibold tracking-tight">Communication</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-medium">Last Contact:</span>
                      <span className="text-white">{formatDate(selectedClient.communication.lastContact)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-medium">Pending Requests:</span>
                      <Badge content={selectedClient.communication.pendingRequests} color="warning">
                        <span className="text-white font-semibold">Requests</span>
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-medium">Escalation Needed:</span>
                      <Chip 
                        color={selectedClient.communication.escalationNeeded ? 'danger' : 'success'}
                        size="sm"
                      >
                        {selectedClient.communication.escalationNeeded ? 'YES' : 'NO'}
                      </Chip>
                    </div>
                    {selectedClient.communication.supervisorNotes && (
                      <div className="mt-3 p-3 bg-white/5 rounded-lg">
                        <p className="text-gray-400 text-xs font-medium mb-1">Supervisor Notes:</p>
                        <p className="text-white text-sm">{selectedClient.communication.supervisorNotes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-blue-500/25">
                    Start Task
                  </Button>
                  <Button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 border border-white/20">
                    Contact Client
                  </Button>
                  {selectedClient.communication.escalationNeeded && (
                    <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-red-500/25">
                      Escalate to Supervisor
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h4 className="text-white text-lg font-semibold mb-2">
                    Select a Client
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Choose a client from your work queue to view task details and progress
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
