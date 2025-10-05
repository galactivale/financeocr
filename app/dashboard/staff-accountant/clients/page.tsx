"use client";
import React, { useState } from "react";
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
  Input,
  Progress,
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [taskFilter, setTaskFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter clients based on search and task filter
  const filteredClients = staffClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTask = taskFilter === 'all' || client.taskStatus === taskFilter;
    return matchesSearch && matchesTask;
  });

  const handleClientSelect = (client: StaffClient) => {
    // Navigate to individual client page instead of opening panel
    router.push(`/dashboard/staff-accountant/clients/${client.id}`);
  };


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

    </div>
  );
}
