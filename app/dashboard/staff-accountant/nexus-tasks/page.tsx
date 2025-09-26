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
  Progress,
  Badge,
  Avatar,
  Tooltip,
  Input
} from "@nextui-org/react";

// Task data structure for Staff Accountant
interface NexusTask {
  id: string;
  title: string;
  description: string;
  category: 'sales-data' | 'client-communication' | 'threshold-monitoring' | 'quality-assurance';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'review' | 'completed' | 'escalated';
  client: {
    id: string;
    name: string;
    avatar: string;
  };
  assignedBy: string;
  dueDate: string;
  progress: number;
  qualityScore?: number;
  steps: {
    id: string;
    title: string;
    completed: boolean;
    description: string;
  }[];
  escalationNeeded: boolean;
  learningContent?: {
    title: string;
    description: string;
    resources: string[];
  };
  timeEstimate: string;
  actualTime?: string;
}

// Sample task data
const nexusTasks: NexusTask[] = [
  {
    id: "task-001",
    title: "Q4 California Sales Data Processing",
    description: "Process and validate Q4 2024 California sales data for TechCorp SaaS",
    category: "sales-data",
    priority: "urgent",
    status: "in-progress",
    client: {
      id: "techcorp-saas",
      name: "TechCorp SaaS",
      avatar: "T"
    },
    assignedBy: "Jane Doe, CPA",
    dueDate: "2024-12-15",
    progress: 65,
    qualityScore: 88,
    steps: [
      { id: "step-1", title: "Data Collection", completed: true, description: "Gather Q4 sales data from client" },
      { id: "step-2", title: "Data Validation", completed: true, description: "Verify data accuracy and completeness" },
      { id: "step-3", title: "State Allocation", completed: false, description: "Allocate sales by California jurisdiction" },
      { id: "step-4", title: "Threshold Analysis", completed: false, description: "Calculate threshold compliance status" },
      { id: "step-5", title: "Quality Review", completed: false, description: "Final accuracy verification" }
    ],
    escalationNeeded: false,
    learningContent: {
      title: "California Economic Nexus Thresholds",
      description: "Understanding California's $500,000 revenue threshold and transaction count requirements",
      resources: ["CA Nexus Guide", "Threshold Calculator", "Best Practices"]
    },
    timeEstimate: "4 hours",
    actualTime: "2.5 hours"
  },
  {
    id: "task-002",
    title: "Client Data Request Communication",
    description: "Request missing transaction data from RetailChain LLC",
    category: "client-communication",
    priority: "high",
    status: "pending",
    client: {
      id: "retailchain-llc",
      name: "RetailChain LLC",
      avatar: "R"
    },
    assignedBy: "Jane Doe, CPA",
    dueDate: "2024-12-12",
    progress: 0,
    steps: [
      { id: "step-1", title: "Template Selection", completed: false, description: "Choose appropriate communication template" },
      { id: "step-2", title: "Content Customization", completed: false, description: "Customize message for client context" },
      { id: "step-3", title: "Supervisor Review", completed: false, description: "Submit for supervisor approval" },
      { id: "step-4", title: "Client Communication", completed: false, description: "Send approved message to client" }
    ],
    escalationNeeded: false,
    learningContent: {
      title: "Professional Client Communication",
      description: "Best practices for requesting sensitive financial data from clients",
      resources: ["Communication Templates", "Client Relations Guide", "Data Request Protocols"]
    },
    timeEstimate: "1 hour"
  },
  {
    id: "task-003",
    title: "New York Threshold Monitoring",
    description: "Monitor ManufacturingCo's approaching New York threshold",
    category: "threshold-monitoring",
    priority: "medium",
    status: "in-progress",
    client: {
      id: "manufacturingco",
      name: "ManufacturingCo",
      avatar: "M"
    },
    assignedBy: "Jane Doe, CPA",
    dueDate: "2024-12-20",
    progress: 40,
    qualityScore: 92,
    steps: [
      { id: "step-1", title: "Data Collection", completed: true, description: "Gather current sales data" },
      { id: "step-2", title: "Trend Analysis", completed: true, description: "Analyze sales trends and projections" },
      { id: "step-3", title: "Threshold Calculation", completed: false, description: "Calculate current threshold percentage" },
      { id: "step-4", title: "Alert Generation", completed: false, description: "Generate threshold alert if needed" }
    ],
    escalationNeeded: false,
    timeEstimate: "2 hours",
    actualTime: "1 hour"
  },
  {
    id: "task-004",
    title: "Data Quality Assurance Review",
    description: "Review and validate ServicesCorp data entry accuracy",
    category: "quality-assurance",
    priority: "high",
    status: "review",
    client: {
      id: "servicescorp",
      name: "ServicesCorp",
      avatar: "S"
    },
    assignedBy: "Jane Doe, CPA",
    dueDate: "2024-12-14",
    progress: 100,
    qualityScore: 95,
    steps: [
      { id: "step-1", title: "Accuracy Check", completed: true, description: "Verify data entry accuracy" },
      { id: "step-2", title: "Consistency Review", completed: true, description: "Check data consistency across sources" },
      { id: "step-3", title: "Completeness Audit", completed: true, description: "Ensure all required data present" },
      { id: "step-4", title: "Supervisor Review", completed: true, description: "Submit for final supervisor approval" }
    ],
    escalationNeeded: false,
    timeEstimate: "3 hours",
    actualTime: "2.8 hours"
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

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'sales-data':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case 'client-communication':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      );
    case 'threshold-monitoring':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case 'quality-assurance':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    default:
      return null;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'sales-data': return 'primary';
    case 'client-communication': return 'secondary';
    case 'threshold-monitoring': return 'warning';
    case 'quality-assurance': return 'success';
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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'success';
    case 'in-progress': return 'primary';
    case 'review': return 'warning';
    case 'escalated': return 'danger';
    case 'pending': return 'default';
    default: return 'default';
  }
};

export default function NexusTasks() {
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tasks
  const filteredTasks = nexusTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.client.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const handleTaskSelect = (task: NexusTask) => {
    router.push(`/dashboard/staff-accountant/nexus-tasks/${task.id}`);
  };


  // Calculate task statistics
  const taskStats = {
    total: nexusTasks.length,
    pending: nexusTasks.filter(t => t.status === 'pending').length,
    inProgress: nexusTasks.filter(t => t.status === 'in-progress').length,
    review: nexusTasks.filter(t => t.status === 'review').length,
    completed: nexusTasks.filter(t => t.status === 'completed').length,
    escalated: nexusTasks.filter(t => t.escalationNeeded).length
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
              <h2 className="text-2xl font-semibold text-white tracking-tight">Nexus Task Monitoring</h2>
            </div>
            
            {/* Task Statistics */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-white font-semibold text-sm tracking-tight">Staff Accountant Work Queue</h3>
                    <p className="text-gray-400 text-xs font-medium">Supervised Economic Nexus Compliance Tasks</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs font-medium">Active</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{taskStats.total}</div>
                    <div className="text-gray-400 text-xs font-medium">Total Tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-500">{taskStats.pending}</div>
                    <div className="text-gray-400 text-xs font-medium">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-500">{taskStats.inProgress}</div>
                    <div className="text-gray-400 text-xs font-medium">In Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-500">{taskStats.review}</div>
                    <div className="text-gray-400 text-xs font-medium">Review</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-500">{taskStats.completed}</div>
                    <div className="text-gray-400 text-xs font-medium">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-500">{taskStats.escalated}</div>
                    <div className="text-gray-400 text-xs font-medium">Escalated</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search tasks..."
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
                        categoryFilter === "sales-data" 
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setCategoryFilter("sales-data")}
                    >
                      Sales Data
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
                        categoryFilter === "threshold-monitoring" 
                          ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setCategoryFilter("threshold-monitoring")}
                    >
                      Monitoring
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        categoryFilter === "quality-assurance" 
                          ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setCategoryFilter("quality-assurance")}
                    >
                      QA
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

            {/* Task Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20 cursor-pointer"
                  onClick={() => handleTaskSelect(task)}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-${getCategoryColor(task.category)}-500/20 rounded-xl flex items-center justify-center`}>
                        <div className={`text-${getCategoryColor(task.category)}-400`}>
                          {getCategoryIcon(task.category)}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-lg tracking-tight">{task.title}</h4>
                        <p className="text-gray-400 text-sm font-medium">{task.client.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Chip 
                        color={getPriorityColor(task.priority)}
                        size="sm"
                        className="mb-2"
                      >
                        {task.priority.toUpperCase()}
                      </Chip>
                      <Chip 
                        color={getStatusColor(task.status)}
                        size="sm"
                        variant="flat"
                      >
                        {task.status.replace('-', ' ')}
                      </Chip>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{task.description}</p>

                  {/* Progress */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white text-sm font-medium">Progress</span>
                      <span className="text-gray-400 text-xs">{task.progress}%</span>
                    </div>
                    <Progress 
                      value={task.progress}
                      className="w-full"
                      color="primary"
                      size="sm"
                    />
                  </div>

                  {/* Steps */}
                  <div className="space-y-2 mb-4">
                    <span className="text-white text-sm font-medium">Task Steps</span>
                    <div className="flex flex-wrap gap-1">
                      {task.steps.slice(0, 3).map((step, index) => (
                        <div key={step.id} className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${
                            step.completed ? 'bg-green-500' : 'bg-gray-500'
                          }`}></div>
                          <span className="text-gray-400 text-xs">{step.title}</span>
                        </div>
                      ))}
                      {task.steps.length > 3 && (
                        <span className="text-gray-400 text-xs">+{task.steps.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400 text-xs">Due:</span>
                      <span className="text-white text-xs font-medium">{formatDate(task.dueDate)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {task.qualityScore && (
                        <div className="flex items-center space-x-1">
                          <span className="text-gray-400 text-xs">Quality:</span>
                          <span className="text-white text-xs font-semibold">{task.qualityScore}%</span>
                        </div>
                      )}
                      {task.escalationNeeded && (
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
