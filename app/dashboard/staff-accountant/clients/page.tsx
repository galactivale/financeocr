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
  Spinner
} from "@nextui-org/react";
import { useClients, useTasks, useAlerts } from "@/hooks/useApi";

// Task-oriented client data structure for Staff Accountant
interface StaffClient {
  id: string;
  name: string;
  avatar: string;
  industry: string;
  assignedSince: string;
  supervisor: string;
  taskStatus: 'pending' | 'in-progress' | 'review' | 'completed' | 'escalated';
  priority: 'high' | 'medium' | 'low';
  currentTask: string;
    progress: number;
  nextDeadline: string;
  qualityScore: number;
  communicationScore: number;
  dataQuality: number;
  lastActivity: string;
  alerts: number;
  tasksCompleted: number;
  tasksPending: number;
  notes?: string;
  learningOpportunities?: string[];
  skillGaps?: string[];
}

// Transform API client data to staff client data
const transformClientToStaffClient = (client: any, tasks: any[], alerts: any[]): StaffClient => {
  const clientTasks = tasks.filter(task => task.clientId === client.id);
  const clientAlerts = alerts.filter(alert => alert.clientId === client.id);
  
  const completedTasks = clientTasks.filter(task => task.status === 'completed').length;
  const pendingTasks = clientTasks.filter(task => task.status === 'pending' || task.status === 'in_progress').length;
  
  // Calculate progress based on completed tasks
  const totalTasks = clientTasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  // Determine task status
  let taskStatus: 'pending' | 'in-progress' | 'review' | 'completed' | 'escalated' = 'pending';
  if (completedTasks === totalTasks && totalTasks > 0) {
    taskStatus = 'completed';
  } else if (pendingTasks > 0) {
    taskStatus = 'in-progress';
  }
  
  // Determine priority based on alerts and deadlines
  let priority: 'high' | 'medium' | 'low' = 'medium';
  const urgentAlerts = clientAlerts.filter(alert => alert.priority === 'high' || alert.priority === 'urgent').length;
  const overdueTasks = clientTasks.filter(task => 
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'
  ).length;
  
  if (urgentAlerts > 0 || overdueTasks > 0) {
    priority = 'high';
  } else if (clientAlerts.length === 0 && overdueTasks === 0) {
    priority = 'low';
  }
  
  // Get current task
  const currentTask = clientTasks.find(task => task.status === 'pending' || task.status === 'in_progress')?.title || 'No active tasks';
  
  // Get next deadline
  const upcomingTasks = clientTasks
    .filter(task => task.dueDate && task.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const nextDeadline = upcomingTasks.length > 0 ? upcomingTasks[0].dueDate : 'No upcoming deadlines';
  
  // Calculate quality scores (mock data for now)
  const qualityScore = Math.floor(Math.random() * 20) + 80; // 80-100
  const communicationScore = Math.floor(Math.random() * 20) + 80; // 80-100
  const dataQuality = Math.floor(Math.random() * 20) + 80; // 80-100
  
  return {
    id: client.id,
    name: client.name,
    avatar: client.name.charAt(0).toUpperCase(),
    industry: client.industry || 'Unknown',
    assignedSince: client.createdAt || new Date().toISOString(),
    supervisor: 'Jane Doe, CPA', // Mock supervisor
    taskStatus,
    priority,
    currentTask,
    progress,
    nextDeadline,
    qualityScore,
    communicationScore,
    dataQuality,
    lastActivity: client.updatedAt || client.createdAt || new Date().toISOString(),
    alerts: clientAlerts.length,
    tasksCompleted: completedTasks,
    tasksPending: pendingTasks,
    notes: client.notes,
    learningOpportunities: client.industry === 'Technology' ? ['SaaS Revenue Recognition', 'Multi-state Compliance'] : ['Industry-specific Regulations'],
    skillGaps: ['Advanced Excel', 'State Tax Codes']
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

const getTaskStatusColor = (status: string) => {
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

const getProgressColor = (progress: number) => {
  if (progress >= 80) return 'success';
  if (progress >= 60) return 'primary';
  if (progress >= 40) return 'warning';
  return 'danger';
};

export default function StaffAccountantClients() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Fetch data from APIs
  const { data: clientsData, loading: clientsLoading, error: clientsError } = useClients({ limit: 50 });
  const { data: tasksData, loading: tasksLoading, error: tasksError } = useTasks({ limit: 100 });
  const { data: alertsData, loading: alertsLoading, error: alertsError } = useAlerts({ limit: 100 });

  const clients = clientsData?.clients || [];
  const tasks = tasksData?.tasks || [];
  const alerts = alertsData?.alerts || [];

  // Transform clients to staff clients
  const staffClients = clients.map(client => transformClientToStaffClient(client, tasks, alerts));

  // Filter clients
  const filteredClients = staffClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.taskStatus === statusFilter;
    const matchesPriority = priorityFilter === 'all' || client.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleClientClick = (clientId: string) => {
    router.push(`/dashboard/staff-accountant/clients/${clientId}`);
  };

  // Calculate statistics
  const stats = {
    total: staffClients.length,
    inProgress: staffClients.filter(c => c.taskStatus === 'in-progress').length,
    completed: staffClients.filter(c => c.taskStatus === 'completed').length,
    escalated: staffClients.filter(c => c.taskStatus === 'escalated').length,
    highPriority: staffClients.filter(c => c.priority === 'high').length,
    averageQuality: Math.round(staffClients.reduce((sum, c) => sum + c.qualityScore, 0) / staffClients.length) || 0,
    totalTasks: staffClients.reduce((sum, c) => sum + c.tasksCompleted + c.tasksPending, 0),
    totalAlerts: staffClients.reduce((sum, c) => sum + c.alerts, 0)
  };

  if (clientsLoading || tasksLoading || alertsLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="text-white mt-4">Loading clients...</p>
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
              <h2 className="text-2xl font-semibold text-white tracking-tight">Client Management</h2>
              </div>
              
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardBody className="p-4 text-center">
                  <div className="text-2xl font-bold text-white">{stats.total}</div>
                  <div className="text-gray-400 text-xs">Total Clients</div>
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
                  <div className="text-2xl font-bold text-red-500">{stats.escalated}</div>
                  <div className="text-gray-400 text-xs">Escalated</div>
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
                  <div className="text-2xl font-bold text-purple-500">{stats.averageQuality}%</div>
                  <div className="text-gray-400 text-xs">Avg Quality</div>
                </CardBody>
              </Card>
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardBody className="p-4 text-center">
                  <div className="text-2xl font-bold text-cyan-500">{stats.totalTasks}</div>
                  <div className="text-gray-400 text-xs">Total Tasks</div>
                </CardBody>
              </Card>
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardBody className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-500">{stats.totalAlerts}</div>
                  <div className="text-gray-400 text-xs">Active Alerts</div>
                </CardBody>
              </Card>
                  </div>
                  
            {/* Filters */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-2">
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
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        statusFilter === "escalated" 
                          ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setStatusFilter("escalated")}
                    >
                      Escalated
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
                </div>
              </div>
            </div>

            {/* Client Table */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
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
                        <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Current Task</span>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Progress</span>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Quality</span>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Tasks</span>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Alerts</span>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Next Deadline</span>
                      </th>
                      <th className="px-6 py-4 text-left"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredClients.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center space-y-3">
                            <div className="text-white/60 font-medium">No clients found</div>
                            <div className="text-sm text-white/50">Try adjusting your filters or check back later</div>
          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredClients.map((client) => (
                        <tr 
                  key={client.id} 
                          className="hover:bg-white/5 transition-colors duration-150 cursor-pointer"
                          onClick={() => handleClientClick(client.id)}
                >
                          <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <Avatar 
                        name={client.avatar} 
                                size="sm"
                                className="bg-blue-500/20 text-blue-400"
                      />
                      <div>
                                <div className="text-sm font-medium text-white">{client.name}</div>
                                <div className="text-xs text-white/60">{client.industry}</div>
                      </div>
                    </div>
                          </td>
                          <td className="px-6 py-4">
                      <Chip 
                              color={getTaskStatusColor(client.taskStatus)}
                          size="sm"
                          variant="flat"
                        >
                              {client.taskStatus.replace('-', ' ')}
                        </Chip>
                          </td>
                          <td className="px-6 py-4">
                        <Chip 
                          color={getPriorityColor(client.priority)}
                          size="sm"
                              variant="flat"
                        >
                              {client.priority}
                        </Chip>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-white/80 max-w-xs truncate">
                              {client.currentTask}
                        </div>
                          </td>
                          <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Progress 
                                value={client.progress}
                                color={getProgressColor(client.progress)}
                            size="sm"
                                className="w-20"
                              />
                              <span className="text-xs text-white/60">{Math.round(client.progress)}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-white/60">Q:</span>
                              <span className="text-xs text-white font-medium">{client.qualityScore}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-green-400">{client.tasksCompleted}</span>
                              <span className="text-xs text-white/40">/</span>
                              <span className="text-xs text-orange-400">{client.tasksPending}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {client.alerts > 0 ? (
                              <Chip color="danger" size="sm" variant="flat">
                                {client.alerts}
                              </Chip>
                            ) : (
                              <span className="text-xs text-white/40">0</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs text-white/60">
                              {client.nextDeadline !== 'No upcoming deadlines' ? formatDate(client.nextDeadline) : 'None'}
                        </div>
                          </td>
                          <td className="px-6 py-4">
                          <Button 
                            size="sm" 
                              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 text-xs font-medium"
                              onPress={(e) => {
                                e.stopPropagation();
                                handleClientClick(client.id);
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
    </div>
  );
}