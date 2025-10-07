"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
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
  Tabs,
  Tab,
  Badge,
  Progress,
  Tooltip,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Select,
  SelectItem,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea
} from "@nextui-org/react";
import { SearchIcon } from "@/components/icons/searchicon";
import { useTasks, useClients, useAlerts } from "@/hooks/useApi";

// Data entry task structure
interface DataEntryTask {
  id: string;
  title: string;
  description: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  dataType: 'sales_data' | 'transaction_data' | 'client_info' | 'compliance_data' | 'financial_data';
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'needs_correction';
  priority: 'high' | 'medium' | 'low';
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
  dataFields: string[];
  validationRules: string[];
  lastUpdated: string;
  errorCount?: number;
  correctionNotes?: string[];
}

// Transform API tasks to data entry tasks
const transformToDataEntryTasks = (tasks: any[], clients: any[]): DataEntryTask[] => {
  return tasks
    .filter(task => 
      task.category === 'data_entry' || 
      task.type === 'data_entry' ||
      task.title?.toLowerCase().includes('data entry') ||
      task.title?.toLowerCase().includes('data processing')
    )
    .map(task => {
      const client = clients.find(c => c.id === task.clientId);
      
      // Determine data type based on task title/description
      let dataType: 'sales_data' | 'transaction_data' | 'client_info' | 'compliance_data' | 'financial_data' = 'sales_data';
      const title = task.title?.toLowerCase() || '';
      const description = task.description?.toLowerCase() || '';
      
      if (title.includes('transaction') || description.includes('transaction')) {
        dataType = 'transaction_data';
      } else if (title.includes('client') || description.includes('client info')) {
        dataType = 'client_info';
      } else if (title.includes('compliance') || description.includes('compliance')) {
        dataType = 'compliance_data';
      } else if (title.includes('financial') || description.includes('financial')) {
        dataType = 'financial_data';
      }
      
      // Calculate progress based on status
      let progress = 0;
      switch (task.status) {
        case 'pending': progress = 0; break;
        case 'in_progress': progress = 50; break;
        case 'review': progress = 80; break;
        case 'completed': progress = 100; break;
        case 'needs_correction': progress = 30; break;
        default: progress = 0;
      }
      
      return {
        id: task.id,
        title: task.title || 'Data Entry Task',
        description: task.description || 'Enter and validate data according to specifications',
        clientId: task.clientId,
        clientName: client?.name || 'Unknown Client',
        clientAvatar: client?.name?.charAt(0).toUpperCase() || 'U',
        dataType,
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        assignedBy: 'Jane Doe, CPA',
        assignedAt: task.createdAt,
        dueDate: task.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: task.completedAt,
        estimatedHours: 4,
        actualHours: task.actualHours,
        progress,
        qualityScore: task.qualityScore,
        notes: task.notes,
        attachments: task.attachments || [],
        dataFields: getDataFieldsForType(dataType),
        validationRules: getValidationRulesForType(dataType),
        lastUpdated: task.updatedAt || task.createdAt,
        errorCount: Math.floor(Math.random() * 5), // Mock error count
        correctionNotes: task.status === 'needs_correction' ? ['Data format incorrect', 'Missing required fields'] : []
      };
    });
};

// Helper functions
const getDataFieldsForType = (dataType: string): string[] => {
  switch (dataType) {
    case 'sales_data': return ['Date', 'Amount', 'State', 'Product', 'Customer ID'];
    case 'transaction_data': return ['Transaction ID', 'Date', 'Amount', 'Type', 'Reference'];
    case 'client_info': return ['Name', 'Address', 'Tax ID', 'Industry', 'Contact'];
    case 'compliance_data': return ['State', 'Threshold', 'Status', 'Deadline', 'Penalty'];
    case 'financial_data': return ['Account', 'Amount', 'Category', 'Date', 'Description'];
    default: return ['Field 1', 'Field 2', 'Field 3'];
  }
};

const getValidationRulesForType = (dataType: string): string[] => {
  switch (dataType) {
    case 'sales_data': return ['Amount must be positive', 'Date must be valid', 'State code required'];
    case 'transaction_data': return ['Transaction ID must be unique', 'Amount must be numeric', 'Date format required'];
    case 'client_info': return ['Tax ID must be valid format', 'Address must be complete', 'Contact info required'];
    case 'compliance_data': return ['State code must be valid', 'Threshold must be numeric', 'Deadline must be future date'];
    case 'financial_data': return ['Account must exist', 'Amount must be numeric', 'Category must be valid'];
    default: return ['Field validation required'];
  }
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
    case 'needs_correction': return 'danger';
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

const getDataTypeColor = (dataType: string) => {
  switch (dataType) {
    case 'sales_data': return 'primary';
    case 'transaction_data': return 'secondary';
    case 'client_info': return 'success';
    case 'compliance_data': return 'warning';
    case 'financial_data': return 'danger';
    default: return 'default';
  }
};

const getDataTypeIcon = (dataType: string) => {
  switch (dataType) {
    case 'sales_data': return '💰';
    case 'transaction_data': return '💳';
    case 'client_info': return '👤';
    case 'compliance_data': return '📋';
    case 'financial_data': return '📊';
    default: return '📝';
  }
};

export default function StaffAccountantDataEntry() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dataTypeFilter, setDataTypeFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState<DataEntryTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Fetch data from APIs
  const { data: tasksData, loading: tasksLoading, error: tasksError } = useTasks({ limit: 100 });
  const { data: clientsData, loading: clientsLoading, error: clientsError } = useClients({ limit: 50 });
  const { data: alertsData, loading: alertsLoading, error: alertsError } = useAlerts({ limit: 50 });

  const tasks = tasksData?.tasks || [];
  const clients = clientsData?.clients || [];
  const alerts = alertsData?.alerts || [];

  // Transform to data entry tasks
  const dataEntryTasks = transformToDataEntryTasks(tasks, clients);

  // Filter tasks
  const filteredTasks = dataEntryTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesDataType = dataTypeFilter === 'all' || task.dataType === dataTypeFilter;
    const matchesTab = activeTab === 'all' || task.status === activeTab;
    return matchesSearch && matchesStatus && matchesDataType && matchesTab;
  });

  const handleTaskClick = (task: DataEntryTask) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<DataEntryTask>) => {
    console.log(`Updating task ${taskId} with:`, updates);
    // Here you would implement the actual task update logic
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  // Calculate statistics
  const stats = {
    total: dataEntryTasks.length,
    pending: dataEntryTasks.filter(t => t.status === 'pending').length,
    inProgress: dataEntryTasks.filter(t => t.status === 'in_progress').length,
    review: dataEntryTasks.filter(t => t.status === 'review').length,
    completed: dataEntryTasks.filter(t => t.status === 'completed').length,
    needsCorrection: dataEntryTasks.filter(t => t.status === 'needs_correction').length,
    overdue: dataEntryTasks.filter(t => 
      t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
    ).length,
    highPriority: dataEntryTasks.filter(t => t.priority === 'high').length,
    averageQuality: Math.round(dataEntryTasks.reduce((sum, t) => sum + (t.qualityScore || 0), 0) / dataEntryTasks.length) || 0,
    totalErrors: dataEntryTasks.reduce((sum, t) => sum + (t.errorCount || 0), 0)
  };

  if (tasksLoading || clientsLoading || alertsLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="text-white mt-4">Loading data entry tasks...</p>
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
              <h2 className="text-2xl font-semibold text-white tracking-tight">Data Entry Management</h2>
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
                  <div className="text-2xl font-bold text-red-500">{stats.needsCorrection}</div>
                  <div className="text-gray-400 text-xs">Needs Correction</div>
                </CardBody>
              </Card>
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardBody className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-500">{stats.overdue}</div>
                  <div className="text-gray-400 text-xs">Overdue</div>
                </CardBody>
              </Card>
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardBody className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-500">{stats.averageQuality}%</div>
                  <div className="text-gray-400 text-xs">Avg Quality</div>
                </CardBody>
              </Card>
            </div>

            {/* Tabs */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6">
              <Tabs 
                selectedKey={activeTab} 
                onSelectionChange={(key) => setActiveTab(key as string)}
                className="w-full"
                classNames={{
                  tabList: "bg-white/5 border border-white/10",
                  tab: "text-white/70 data-[selected=true]:text-white",
                  cursor: "bg-blue-500"
                }}
              >
                <Tab key="all" title={`All (${stats.total})`} />
                <Tab key="pending" title={`Pending (${stats.pending})`} />
                <Tab key="in_progress" title={`In Progress (${stats.inProgress})`} />
                <Tab key="review" title={`Review (${stats.review})`} />
                <Tab key="completed" title={`Completed (${stats.completed})`} />
                <Tab key="needs_correction" title={`Corrections (${stats.needsCorrection})`} />
              </Tabs>
                </div>

            {/* Filters */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search data entry tasks..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                    size="sm"
                    className="w-64 bg-white/5 border-white/10 text-white placeholder-gray-400"
                    classNames={{
                      input: "text-white",
                      inputWrapper: "bg-white/5 border-white/10 hover:border-white/20 focus-within:border-blue-500/50"
                    }}
                    startContent={<SearchIcon className="w-4 h-4 text-white/40" />}
                  />
                </div>
                
                <div className="flex gap-3 items-center">
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        dataTypeFilter === "all" 
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setDataTypeFilter("all")}
                    >
                      All Types
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        dataTypeFilter === "sales_data" 
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setDataTypeFilter("sales_data")}
                    >
                      Sales Data
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        dataTypeFilter === "transaction_data" 
                          ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setDataTypeFilter("transaction_data")}
                    >
                      Transactions
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        dataTypeFilter === "client_info" 
                          ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setDataTypeFilter("client_info")}
                    >
                      Client Info
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        dataTypeFilter === "compliance_data" 
                          ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setDataTypeFilter("compliance_data")}
                    >
                      Compliance
                    </Button>
                  </div>
                </div>
                </div>
              </div>

            {/* Task Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.length === 0 ? (
                <div className="col-span-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center">
                  <div className="text-white/60 font-medium text-lg mb-2">No data entry tasks found</div>
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
                          <div className={`w-10 h-10 bg-${getDataTypeColor(task.dataType)}-500/20 rounded-xl flex items-center justify-center`}>
                            <span className="text-lg">{getDataTypeIcon(task.dataType)}</span>
                          </div>
                          <div>
                            <h4 className="text-white font-semibold text-sm">{task.title}</h4>
                            <p className="text-white/60 text-xs">{task.clientName}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Chip 
                            color={getStatusColor(task.status)}
                            size="sm"
                            variant="flat"
                          >
                            {task.status.replace('_', ' ')}
                          </Chip>
                          {task.errorCount && task.errorCount > 0 && (
                            <Badge content={task.errorCount} color="danger" size="sm">
                              <Chip color="danger" size="sm" variant="flat">
                                Errors
                              </Chip>
                            </Badge>
                          )}
                        </div>
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
                            <Chip 
                              color={getDataTypeColor(task.dataType)}
                              size="sm"
                              variant="flat"
                            >
                              {task.dataType.replace('_', ' ')}
                            </Chip>
                          </div>
                          <div className="text-white/60 text-xs">
                            Due: {formatDate(task.dueDate)}
                          </div>
                        </div>
                        
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="text-xs text-white/60 mb-2">Data Fields Required:</div>
                          <div className="flex flex-wrap gap-1">
                            {task.dataFields.slice(0, 3).map((field, index) => (
                              <Chip key={index} size="sm" variant="flat" color="default">
                                {field}
                              </Chip>
                            ))}
                            {task.dataFields.length > 3 && (
                              <Chip size="sm" variant="flat" color="default">
                                +{task.dataFields.length - 3} more
                              </Chip>
                            )}
                          </div>
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

      {/* Task Detail Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onOpenChange={setIsModalOpen}
        size="3xl"
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
                  <div className="space-y-6">
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
                        <h4 className="text-white font-medium mb-2">Data Type</h4>
                        <Chip color={getDataTypeColor(selectedTask.dataType)} size="sm">
                          {selectedTask.dataType.replace('_', ' ')}
                        </Chip>
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
                    
                    <div>
                      <h4 className="text-white font-medium mb-2">Data Fields Required</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedTask.dataFields.map((field, index) => (
                          <div key={index} className="bg-white/5 rounded-lg p-2 text-center">
                            <span className="text-white/70 text-sm">{field}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-medium mb-2">Validation Rules</h4>
                      <div className="space-y-1">
                        {selectedTask.validationRules.map((rule, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                            <span className="text-white/70 text-sm">{rule}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {selectedTask.correctionNotes && selectedTask.correctionNotes.length > 0 && (
                      <div>
                        <h4 className="text-white font-medium mb-2">Correction Notes</h4>
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          {selectedTask.correctionNotes.map((note, index) => (
                            <div key={index} className="flex items-center space-x-2 mb-1">
                              <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                              <span className="text-red-400 text-sm">{note}</span>
                            </div>
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
                    handleTaskUpdate(selectedTask.id, { status: 'in_progress' });
                  }
                }}>
                  Start Data Entry
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}