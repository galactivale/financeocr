"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Card, 
  CardBody, 
  Button, 
  Chip, 
  Progress,
  Input,
  Select,
  SelectItem,
  Spinner,
  Avatar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea
} from "@nextui-org/react";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  FileText, 
  MessageSquare, 
  Shield, 
  Search,
  Filter
} from "lucide-react";
import { useNexusAlerts, useNexusActivities, useClients, useTasks } from "@/hooks/useApi";

// Task data structure for Staff Accountant
interface NexusTask {
  id: string;
  title: string;
  description: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  stateCode: string;
  taskType: 'threshold_monitoring' | 'data_processing' | 'registration' | 'compliance_check' | 'reporting';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'escalated';
  assignedBy: string;
  assignedAt: string;
  dueDate: string;
  completedAt?: string;
  estimatedHours: number;
  actualHours?: number;
  progress: number;
  qualityScore?: number;
  notes?: string;
  attachments?: string[];
  thresholdAmount?: number;
  currentAmount?: number;
  complianceStatus?: string;
  lastUpdated: string;
}

// Transform API data to nexus tasks
const transformToNexusTasks = (alerts: any[], activities: any[], clients: any[], tasks: any[]): NexusTask[] => {
  const nexusTasks: NexusTask[] = [];

  // Transform nexus alerts to tasks
  alerts.forEach(alert => {
    const client = clients.find(c => c.id === alert.clientId);
    nexusTasks.push({
      id: `alert-${alert.id}`,
      title: alert.title || 'Nexus Alert Processing',
      description: alert.description || 'Process nexus alert and take appropriate action',
      clientId: alert.clientId,
      clientName: client?.name || 'Unknown Client',
      clientAvatar: client?.name?.charAt(0).toUpperCase() || 'U',
      stateCode: alert.stateCode,
      taskType: 'threshold_monitoring',
      priority: alert.priority || 'medium',
      status: alert.status === 'open' ? 'pending' : 'completed',
      assignedBy: 'Jane Doe, CPA',
      assignedAt: alert.createdAt,
      dueDate: alert.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      completedAt: alert.resolvedAt,
      estimatedHours: 4,
      progress: alert.status === 'open' ? 0 : 100,
      thresholdAmount: alert.thresholdAmount,
      currentAmount: alert.currentAmount,
      complianceStatus: alert.status,
      lastUpdated: alert.updatedAt || alert.createdAt
    });
  });

  // Transform nexus activities to tasks
  activities.forEach(activity => {
    const client = clients.find(c => c.id === activity.clientId);
    let taskType: 'threshold_monitoring' | 'data_processing' | 'registration' | 'compliance_check' | 'reporting' = 'data_processing';
    
    switch (activity.activityType) {
      case 'threshold_exceeded': taskType = 'threshold_monitoring'; break;
      case 'registration_completed': taskType = 'registration'; break;
      case 'data_processed': taskType = 'data_processing'; break;
      case 'registration_required': taskType = 'registration'; break;
      case 'deadline_approaching': taskType = 'compliance_check'; break;
    }

    nexusTasks.push({
      id: `activity-${activity.id}`,
      title: activity.title || 'Nexus Activity Processing',
      description: activity.description || 'Process nexus activity and update records',
      clientId: activity.clientId,
      clientName: client?.name || 'Unknown Client',
      clientAvatar: client?.name?.charAt(0).toUpperCase() || 'U',
      stateCode: activity.stateCode,
      taskType,
      priority: 'medium',
      status: activity.status === 'completed' ? 'completed' : 'pending',
      assignedBy: 'Jane Doe, CPA',
      assignedAt: activity.createdAt,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      completedAt: activity.status === 'completed' ? activity.createdAt : undefined,
      estimatedHours: 2,
      progress: activity.status === 'completed' ? 100 : 0,
      lastUpdated: activity.createdAt
    });
  });

  // Transform regular tasks that are nexus-related
  tasks.forEach(task => {
    if (task.category === 'nexus' || task.title?.toLowerCase().includes('nexus')) {
      const client = clients.find(c => c.id === task.clientId);
      nexusTasks.push({
        id: `task-${task.id}`,
        title: task.title || 'Nexus Task',
        description: task.description || 'Complete nexus-related task',
        clientId: task.clientId,
        clientName: client?.name || 'Unknown Client',
        clientAvatar: client?.name?.charAt(0).toUpperCase() || 'U',
        stateCode: task.stateCode || 'N/A',
        taskType: 'data_processing',
        priority: task.priority || 'medium',
        status: task.status || 'pending',
        assignedBy: 'Jane Doe, CPA',
        assignedAt: task.createdAt,
        dueDate: task.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: task.completedAt,
        estimatedHours: 4,
        actualHours: task.actualHours,
        progress: task.status === 'completed' ? 100 : task.status === 'in_progress' ? 50 : 0,
        lastUpdated: task.updatedAt || task.createdAt
      });
    }
  });

  return nexusTasks;
};

// Utility functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'success';
    case 'in_progress': return 'primary';
    case 'review': return 'warning';
    case 'escalated': return 'danger';
    case 'pending': return 'default';
    default: return 'default';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'danger';
    case 'medium': return 'warning';
    case 'low': return 'success';
    default: return 'default';
  }
};

const getTaskTypeColor = (taskType: string) => {
  switch (taskType) {
    case 'threshold_monitoring': return 'danger';
    case 'data_processing': return 'primary';
    case 'registration': return 'secondary';
    case 'compliance_check': return 'warning';
    case 'reporting': return 'success';
    default: return 'default';
  }
};

const getTaskTypeIcon = (taskType: string) => {
  switch (taskType) {
    case 'threshold_monitoring': return <AlertTriangle className="w-4 h-4" />;
    case 'data_processing': return <FileText className="w-4 h-4" />;
    case 'registration': return <Shield className="w-4 h-4" />;
    case 'compliance_check': return <CheckCircle className="w-4 h-4" />;
    case 'reporting': return <TrendingUp className="w-4 h-4" />;
    default: return <FileText className="w-4 h-4" />;
  }
};

export default function StaffAccountantNexusTasks() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [taskTypeFilter, setTaskTypeFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState<NexusTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch data from APIs
  const { data: nexusAlertsData, loading: nexusAlertsLoading, error: nexusAlertsError } = useNexusAlerts({ limit: 50 });
  const { data: nexusActivitiesData, loading: nexusActivitiesLoading, error: nexusActivitiesError } = useNexusActivities({ limit: 50 });
  const { data: clientsData, loading: clientsLoading, error: clientsError } = useClients({ limit: 50 });
  const { data: tasksData, loading: tasksLoading, error: tasksError } = useTasks({ limit: 100 });

  const nexusAlerts = nexusAlertsData?.alerts || [];
  const nexusActivities = nexusActivitiesData?.activities || [];
  const clients = clientsData?.clients || [];
  const tasks = tasksData?.tasks || [];

  // Transform to nexus tasks
  const nexusTasks = transformToNexusTasks(nexusAlerts, nexusActivities, clients, tasks);

  // Filter tasks
  const filteredTasks = nexusTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesTaskType = taskTypeFilter === 'all' || task.taskType === taskTypeFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesTaskType;
  });

  const handleTaskClick = (task: NexusTask) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<NexusTask>) => {
    console.log(`Updating task ${taskId} with:`, updates);
    // Here you would implement the actual task update logic
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  // Calculate statistics
  const stats = {
    total: nexusTasks.length,
    pending: nexusTasks.filter(t => t.status === 'pending').length,
    inProgress: nexusTasks.filter(t => t.status === 'in_progress').length,
    completed: nexusTasks.filter(t => t.status === 'completed').length,
    escalated: nexusTasks.filter(t => t.status === 'escalated').length,
    overdue: nexusTasks.filter(t => 
      t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
    ).length,
    highPriority: nexusTasks.filter(t => t.priority === 'high').length,
    thresholdMonitoring: nexusTasks.filter(t => t.taskType === 'threshold_monitoring').length,
    dataProcessing: nexusTasks.filter(t => t.taskType === 'data_processing').length,
    registration: nexusTasks.filter(t => t.taskType === 'registration').length,
    complianceCheck: nexusTasks.filter(t => t.taskType === 'compliance_check').length,
    reporting: nexusTasks.filter(t => t.taskType === 'reporting').length
  };

  if (nexusAlertsLoading || nexusActivitiesLoading || clientsLoading || tasksLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="text-white mt-4">Loading nexus tasks...</p>
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
              <h2 className="text-2xl font-semibold text-white tracking-tight">Nexus Tasks</h2>
            </div>
            
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardBody className="p-4 text-center">
                  <div className="text-2xl font-bold text-white">{stats.total}</div>
                  <div className="text-gray-400 text-xs">Total Tasks</div>
                </CardBody>
              </Card>
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardBody className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-500">{stats.inProgress}</div>
                  <div className="text-gray-400 text-xs">In Progress</div>
                </CardBody>
              </Card>
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardBody className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
                  <div className="text-gray-400 text-xs">Completed</div>
                </CardBody>
              </Card>
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardBody className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-500">{stats.overdue}</div>
                  <div className="text-gray-400 text-xs">Overdue</div>
                </CardBody>
              </Card>
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardBody className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-500">{stats.highPriority}</div>
                  <div className="text-gray-400 text-xs">High Priority</div>
                </CardBody>
              </Card>
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardBody className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-500">{stats.thresholdMonitoring}</div>
                  <div className="text-gray-400 text-xs">Threshold Alerts</div>
                </CardBody>
              </Card>
            </div>

            {/* Filters */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search nexus tasks..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                    size="sm"
                    className="w-64 bg-white/5 border-white/10 text-white placeholder-gray-400"
                    classNames={{
                      input: "text-white",
                      inputWrapper: "bg-white/5 border-white/10 hover:border-white/20 focus-within:border-blue-500/50"
                    }}
                    startContent={<Search className="w-4 h-4 text-white/40" />}
                  />
                </div>
                
                <div className="flex gap-3 items-center">
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
                        statusFilter === "pending" 
                          ? 'bg-gray-500 text-white shadow-lg shadow-gray-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setStatusFilter("pending")}
                    >
                      Pending
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        statusFilter === "in_progress" 
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setStatusFilter("in_progress")}
                    >
                      In Progress
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        statusFilter === "completed" 
                          ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setStatusFilter("completed")}
                    >
                      Completed
                    </Button>
                </div>
                
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        taskTypeFilter === "all" 
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setTaskTypeFilter("all")}
                    >
                      All Types
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        taskTypeFilter === "threshold_monitoring" 
                          ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setTaskTypeFilter("threshold_monitoring")}
                    >
                      Threshold
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        taskTypeFilter === "data_processing" 
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setTaskTypeFilter("data_processing")}
                    >
                      Data Processing
                    </Button>
                <Button
                  size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        taskTypeFilter === "registration" 
                          ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setTaskTypeFilter("registration")}
                    >
                      Registration
                </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.length === 0 ? (
                <div className="col-span-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center">
                  <div className="text-white/60 font-medium text-lg mb-2">No nexus tasks found</div>
                  <div className="text-sm text-white/50">Try adjusting your filters or check back later</div>
          </div>
              ) : (
                filteredTasks.map((task) => (
              <Card 
                key={task.id} 
                    className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20 cursor-pointer"
                    onClick={() => handleTaskClick(task)}
              >
                <CardBody className="p-6">
                      <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-${getTaskTypeColor(task.taskType)}-500/20 rounded-xl flex items-center justify-center`}>
                            <div className={`text-${getTaskTypeColor(task.taskType)}-400`}>
                              {getTaskTypeIcon(task.taskType)}
                        </div>
                      </div>
                      <div>
                            <h4 className="text-white font-semibold text-sm">{task.title}</h4>
                            <p className="text-white/60 text-xs">{task.clientName}</p>
                      </div>
                    </div>
                      <Chip 
                        color={getStatusColor(task.status)}
                        size="sm"
                        variant="flat"
                      >
                          {task.status.replace('_', ' ')}
                      </Chip>
                  </div>

                      <p className="text-white/70 text-sm mb-4 line-clamp-2">{task.description}</p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/60">Progress</span>
                          <span className="text-white font-medium">{task.progress}%</span>
                    </div>
                    <Progress 
                      value={task.progress}
                          color={task.progress >= 80 ? 'success' : task.progress >= 50 ? 'primary' : 'warning'}
                      size="sm"
                        />
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Chip 
                              color={getPriorityColor(task.priority)}
                              size="sm"
                              variant="flat"
                            >
                              {task.priority}
                            </Chip>
                            <span className="text-white/60 text-xs">{task.stateCode}</span>
                          </div>
                          <div className="text-white/60 text-xs">
                            Due: {formatDate(task.dueDate)}
                  </div>
                        </div>
                        
                        {task.thresholdAmount && task.currentAmount && (
                          <div className="bg-white/5 rounded-lg p-3">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-white/60">Threshold</span>
                              <span className="text-white font-medium">${(task.thresholdAmount / 1000).toFixed(0)}K</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-white/60">Current</span>
                              <span className={`font-medium ${
                                task.currentAmount >= task.thresholdAmount ? 'text-red-400' : 'text-green-400'
                              }`}>
                                ${(task.currentAmount / 1000).toFixed(0)}K
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                ))
              )}
            </div>
          </div>
                    </div>
                  </div>

      {/* Task Detail Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onOpenChange={setIsModalOpen}
        size="2xl"
        className="bg-black border border-white/10"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-white">
                {selectedTask?.title}
              </ModalHeader>
              <ModalBody>
                {selectedTask && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-medium mb-2">Description</h4>
                      <p className="text-white/70 text-sm">{selectedTask.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-white font-medium mb-2">Client</h4>
                        <div className="flex items-center space-x-2">
                          <Avatar 
                            name={selectedTask.clientAvatar} 
                            size="sm"
                            className="bg-blue-500/20 text-blue-400"
                          />
                          <span className="text-white/70 text-sm">{selectedTask.clientName}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2">State</h4>
                        <span className="text-white/70 text-sm">{selectedTask.stateCode}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-white font-medium mb-2">Status</h4>
                        <Chip color={getStatusColor(selectedTask.status)} size="sm">
                          {selectedTask.status.replace('_', ' ')}
                        </Chip>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2">Priority</h4>
                        <Chip color={getPriorityColor(selectedTask.priority)} size="sm">
                          {selectedTask.priority}
                        </Chip>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-medium mb-2">Progress</h4>
                      <Progress 
                        value={selectedTask.progress}
                        color={selectedTask.progress >= 80 ? 'success' : selectedTask.progress >= 50 ? 'primary' : 'warning'}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-white font-medium mb-2">Due Date</h4>
                        <p className="text-white/70 text-sm">{formatDate(selectedTask.dueDate)}</p>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2">Estimated Hours</h4>
                        <p className="text-white/70 text-sm">{selectedTask.estimatedHours} hours</p>
                      </div>
                    </div>
                    
                    {selectedTask.thresholdAmount && selectedTask.currentAmount && (
                      <div>
                        <h4 className="text-white font-medium mb-2">Threshold Information</h4>
                        <div className="bg-white/5 rounded-lg p-3 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-white/60 text-sm">Threshold Amount:</span>
                            <span className="text-white text-sm">${(selectedTask.thresholdAmount / 1000).toFixed(0)}K</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/60 text-sm">Current Amount:</span>
                            <span className={`text-sm ${
                              selectedTask.currentAmount >= selectedTask.thresholdAmount ? 'text-red-400' : 'text-green-400'
                            }`}>
                              ${(selectedTask.currentAmount / 1000).toFixed(0)}K
                            </span>
                  </div>
                          <div className="flex justify-between">
                            <span className="text-white/60 text-sm">Status:</span>
                            <span className={`text-sm ${
                              selectedTask.currentAmount >= selectedTask.thresholdAmount ? 'text-red-400' : 'text-green-400'
                            }`}>
                              {selectedTask.currentAmount >= selectedTask.thresholdAmount ? 'Exceeded' : 'Within Limit'}
                            </span>
          </div>
        </div>
      </div>
                    )}
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={() => {
                  if (selectedTask) {
                    handleTaskUpdate(selectedTask.id, { status: 'in_progress' });
                  }
                }}>
                  Start Task
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}