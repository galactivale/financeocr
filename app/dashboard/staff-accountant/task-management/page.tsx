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
  Tooltip,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  Select,
  SelectItem
} from "@nextui-org/react";
import { useTasks, useClients, useAlerts } from "@/hooks/useApi";

// Task data structure for Staff Accountant
interface StaffTask {
  id: string;
  title: string;
  description: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  status: 'pending' | 'in-progress' | 'review' | 'completed' | 'escalated';
  priority: 'high' | 'medium' | 'low';
  category: 'data-entry' | 'analysis' | 'communication' | 'review' | 'research';
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
  dependencies?: string[];
  learningOpportunities?: string[];
  skillRequirements?: string[];
}

// Transform API task data to staff task data
const transformTaskToStaffTask = (task: any, clients: any[]): StaffTask => {
  const client = clients.find(c => c.id === task.clientId);
  
  // Calculate progress based on status
  let progress = 0;
  switch (task.status) {
    case 'pending': progress = 0; break;
    case 'in_progress': progress = 50; break;
    case 'review': progress = 80; break;
    case 'completed': progress = 100; break;
    case 'escalated': progress = 25; break;
    default: progress = 0;
  }
  
  // Determine category based on task title/description
  let category: 'data-entry' | 'analysis' | 'communication' | 'review' | 'research' = 'data-entry';
  const title = task.title?.toLowerCase() || '';
  const description = task.description?.toLowerCase() || '';
  
  if (title.includes('analysis') || title.includes('review') || description.includes('analysis')) {
    category = 'analysis';
  } else if (title.includes('communication') || title.includes('email') || title.includes('call')) {
    category = 'communication';
  } else if (title.includes('review') || title.includes('audit')) {
    category = 'review';
  } else if (title.includes('research') || title.includes('investigate')) {
    category = 'research';
  }
  
  // Estimate hours based on category and priority
  let estimatedHours = 4; // default
  if (category === 'data-entry') estimatedHours = 2;
  else if (category === 'analysis') estimatedHours = 6;
  else if (category === 'communication') estimatedHours = 1;
  else if (category === 'review') estimatedHours = 4;
  else if (category === 'research') estimatedHours = 8;
  
  if (task.priority === 'high') estimatedHours *= 1.5;
  else if (task.priority === 'low') estimatedHours *= 0.75;
  
  return {
    id: task.id,
    title: task.title || 'Untitled Task',
    description: task.description || 'No description available',
    clientId: task.clientId,
    clientName: client?.name || 'Unknown Client',
    clientAvatar: client?.name?.charAt(0).toUpperCase() || 'U',
    status: task.status || 'pending',
    priority: task.priority || 'medium',
    category,
    assignedBy: 'Jane Doe, CPA', // Mock supervisor
    assignedAt: task.createdAt || new Date().toISOString(),
    dueDate: task.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: task.completedAt,
    estimatedHours: Math.round(estimatedHours),
    actualHours: task.actualHours,
    progress,
    qualityScore: task.qualityScore,
    notes: task.notes,
    attachments: task.attachments || [],
    dependencies: task.dependencies || [],
    learningOpportunities: category === 'analysis' ? ['Advanced Excel', 'Data Visualization'] : ['Basic Skills'],
    skillRequirements: category === 'research' ? ['Research Skills', 'Regulatory Knowledge'] : ['Standard Skills']
  };
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
    case 'in-progress': return 'primary';
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

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'data-entry': return 'primary';
    case 'analysis': return 'secondary';
    case 'communication': return 'success';
    case 'review': return 'warning';
    case 'research': return 'danger';
    default: return 'default';
  }
};

const getProgressColor = (progress: number) => {
  if (progress >= 80) return 'success';
  if (progress >= 60) return 'primary';
  if (progress >= 40) return 'warning';
  return 'danger';
};

export default function StaffAccountantTaskManagement() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState<StaffTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch data from APIs
  const { data: tasksData, loading: tasksLoading, error: tasksError } = useTasks({ limit: 100 });
  const { data: clientsData, loading: clientsLoading, error: clientsError } = useClients({ limit: 50 });
  const { data: alertsData, loading: alertsLoading, error: alertsError } = useAlerts({ limit: 50 });

  const tasks = tasksData?.tasks || [];
  const clients = clientsData?.clients || [];
  const alerts = alertsData?.alerts || [];

  // Transform tasks to staff tasks
  const staffTasks = tasks.map(task => transformTaskToStaffTask(task, clients));

  // Filter tasks
  const filteredTasks = staffTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const handleTaskClick = (task: StaffTask) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<StaffTask>) => {
    console.log(`Updating task ${taskId} with:`, updates);
    // Here you would implement the actual task update logic
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  // Calculate statistics
  const stats = {
    total: staffTasks.length,
    pending: staffTasks.filter(t => t.status === 'pending').length,
    inProgress: staffTasks.filter(t => t.status === 'in-progress').length,
    review: staffTasks.filter(t => t.status === 'review').length,
    completed: staffTasks.filter(t => t.status === 'completed').length,
    escalated: staffTasks.filter(t => t.status === 'escalated').length,
    overdue: staffTasks.filter(t => 
      t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
    ).length,
    highPriority: staffTasks.filter(t => t.priority === 'high').length,
    totalEstimatedHours: staffTasks.reduce((sum, t) => sum + t.estimatedHours, 0),
    totalActualHours: staffTasks.reduce((sum, t) => sum + (t.actualHours || 0), 0),
    averageQuality: Math.round(staffTasks.reduce((sum, t) => sum + (t.qualityScore || 0), 0) / staffTasks.length) || 0
  };

  if (tasksLoading || clientsLoading || alertsLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="text-white mt-4">Loading tasks...</p>
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
              <h2 className="text-2xl font-semibold text-white tracking-tight">Task Management</h2>
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
                  <div className="text-2xl font-bold text-purple-500">{stats.totalEstimatedHours}h</div>
                  <div className="text-gray-400 text-xs">Est. Hours</div>
                </CardBody>
              </Card>
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
                        statusFilter === "in-progress" 
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setStatusFilter("in-progress")}
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
                        priorityFilter === "all" 
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setPriorityFilter("all")}
                    >
                      All Priority
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        priorityFilter === "high" 
                          ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setPriorityFilter("high")}
                    >
                      High
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        priorityFilter === "medium" 
                          ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setPriorityFilter("medium")}
                    >
                      Medium
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        priorityFilter === "low" 
                          ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setPriorityFilter("low")}
                    >
                      Low
                    </Button>
                  </div>
                  
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
                        categoryFilter === "data-entry" 
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setCategoryFilter("data-entry")}
                    >
                      Data Entry
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        categoryFilter === "analysis" 
                          ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setCategoryFilter("analysis")}
                    >
                      Analysis
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        categoryFilter === "communication" 
                          ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setCategoryFilter("communication")}
                    >
                      Communication
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Table */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Task</span>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Client</span>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Status</span>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Priority</span>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Category</span>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Progress</span>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Hours</span>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Due Date</span>
                      </th>
                      <th className="px-6 py-4 text-left"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredTasks.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center space-y-3">
                            <div className="text-white/60 font-medium">No tasks found</div>
                            <div className="text-sm text-white/50">Try adjusting your filters or check back later</div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredTasks.map((task) => (
                        <tr 
                          key={task.id} 
                          className="hover:bg-white/5 transition-colors duration-150 cursor-pointer"
                          onClick={() => handleTaskClick(task)}
                        >
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-white">{task.title}</div>
                              <div className="text-xs text-white/60 mt-0.5 max-w-xs truncate">
                                {task.description}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <Avatar 
                                name={task.clientAvatar} 
                                size="sm"
                                className="bg-blue-500/20 text-blue-400"
                              />
                              <span className="text-sm text-white/80">{task.clientName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Chip 
                              color={getStatusColor(task.status)}
                              size="sm"
                              variant="flat"
                            >
                              {task.status.replace('-', ' ')}
                            </Chip>
                          </td>
                          <td className="px-6 py-4">
                            <Chip 
                              color={getPriorityColor(task.priority)}
                              size="sm"
                              variant="flat"
                            >
                              {task.priority}
                            </Chip>
                          </td>
                          <td className="px-6 py-4">
                            <Chip 
                              color={getCategoryColor(task.category)}
                              size="sm"
                              variant="flat"
                            >
                              {task.category.replace('-', ' ')}
                            </Chip>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <Progress 
                                value={task.progress}
                                color={getProgressColor(task.progress)}
                                size="sm"
                                className="w-20"
                              />
                              <span className="text-xs text-white/60">{task.progress}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs text-white/80">
                              {task.actualHours ? `${task.actualHours}/${task.estimatedHours}h` : `${task.estimatedHours}h`}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`text-xs ${
                              new Date(task.dueDate) < new Date() && task.status !== 'completed' 
                                ? 'text-red-400' 
                                : 'text-white/60'
                            }`}>
                              {formatDate(task.dueDate)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Button
                              size="sm"
                              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 text-xs font-medium"
                              onPress={(e) => {
                                e.stopPropagation();
                                handleTaskClick(task);
                              }}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
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
                        <h4 className="text-white font-medium mb-2">Status</h4>
                        <Chip color={getStatusColor(selectedTask.status)} size="sm">
                          {selectedTask.status.replace('-', ' ')}
                        </Chip>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2">Priority</h4>
                        <Chip color={getPriorityColor(selectedTask.priority)} size="sm">
                          {selectedTask.priority}
                        </Chip>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-white font-medium mb-2">Estimated Hours</h4>
                        <p className="text-white/70 text-sm">{selectedTask.estimatedHours} hours</p>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2">Due Date</h4>
                        <p className="text-white/70 text-sm">{formatDate(selectedTask.dueDate)}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-medium mb-2">Progress</h4>
                      <Progress 
                        value={selectedTask.progress}
                        color={getProgressColor(selectedTask.progress)}
                        className="w-full"
                      />
                    </div>
                    
                    {selectedTask.learningOpportunities && selectedTask.learningOpportunities.length > 0 && (
                      <div>
                        <h4 className="text-white font-medium mb-2">Learning Opportunities</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedTask.learningOpportunities.map((opportunity, index) => (
                            <Chip key={index} size="sm" variant="flat" color="secondary">
                              {opportunity}
                            </Chip>
                          ))}
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
                    handleTaskUpdate(selectedTask.id, { status: 'in-progress' });
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