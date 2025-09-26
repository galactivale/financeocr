"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Button, 
  Chip, 
  Progress,
  Badge,
  Avatar,
  Tooltip,
  Textarea,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Divider
} from "@nextui-org/react";

// Task data structure (same as in nexus-tasks page)
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
    industry: string;
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
    completedAt?: string;
  }[];
  escalationNeeded: boolean;
  learningContent?: {
    title: string;
    description: string;
    resources: string[];
  };
  timeEstimate: string;
  actualTime?: string;
  notes?: string;
  attachments?: {
    id: string;
    name: string;
    type: string;
    uploadedAt: string;
  }[];
  supervisorNotes?: string;
  qualityMetrics?: {
    accuracy: number;
    completeness: number;
    timeliness: number;
    overall: number;
  };
}

// Sample task data (in real app, this would come from API)
const sampleTasks: NexusTask[] = [
  {
    id: "task-001",
    title: "Q4 California Sales Data Processing",
    description: "Process and validate Q4 2024 California sales data for TechCorp SaaS. This includes data collection, validation, state allocation, and threshold analysis to ensure compliance with California's economic nexus requirements.",
    category: "sales-data",
    priority: "urgent",
    status: "in-progress",
    client: {
      id: "techcorp-saas",
      name: "TechCorp SaaS",
      avatar: "T",
      industry: "Technology SaaS"
    },
    assignedBy: "Jane Doe, CPA",
    dueDate: "2024-12-15",
    progress: 65,
    qualityScore: 88,
    steps: [
      { 
        id: "step-1", 
        title: "Data Collection", 
        completed: true, 
        description: "Gather Q4 sales data from client systems and documentation",
        completedAt: "2024-12-10"
      },
      { 
        id: "step-2", 
        title: "Data Validation", 
        completed: true, 
        description: "Verify data accuracy, completeness, and consistency across sources",
        completedAt: "2024-12-11"
      },
      { 
        id: "step-3", 
        title: "State Allocation", 
        completed: false, 
        description: "Allocate sales by California jurisdiction and tax districts"
      },
      { 
        id: "step-4", 
        title: "Threshold Analysis", 
        completed: false, 
        description: "Calculate current threshold compliance status and projections"
      },
      { 
        id: "step-5", 
        title: "Quality Review", 
        completed: false, 
        description: "Final accuracy verification and supervisor review"
      }
    ],
    escalationNeeded: false,
    learningContent: {
      title: "California Economic Nexus Thresholds",
      description: "Understanding California's $500,000 revenue threshold and transaction count requirements for economic nexus determination.",
      resources: ["CA Nexus Guide", "Threshold Calculator", "Best Practices", "Regulatory Updates"]
    },
    timeEstimate: "4 hours",
    actualTime: "2.5 hours",
    notes: "Client provided additional documentation on 12/11. Need to verify transaction counts for threshold analysis.",
    attachments: [
      {
        id: "att-1",
        name: "Q4_Sales_Data.xlsx",
        type: "Excel",
        uploadedAt: "2024-12-10"
      },
      {
        id: "att-2",
        name: "CA_Threshold_Guide.pdf",
        type: "PDF",
        uploadedAt: "2024-12-09"
      }
    ],
    supervisorNotes: "Good progress on data collection. Focus on accuracy in state allocation step. Client is responsive to requests.",
    qualityMetrics: {
      accuracy: 92,
      completeness: 85,
      timeliness: 90,
      overall: 88
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

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'sales-data':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case 'client-communication':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      );
    case 'threshold-monitoring':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case 'quality-assurance':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

export default function TaskDetail() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.taskId as string;
  
  const [task, setTask] = useState<NexusTask | null>(null);
  const [isLearningOpen, setIsLearningOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isEscalationOpen, setIsEscalationOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [escalationReason, setEscalationReason] = useState('');

  useEffect(() => {
    // In real app, fetch task data based on taskId
    const foundTask = sampleTasks.find(t => t.id === taskId);
    if (foundTask) {
      setTask(foundTask);
      setNotes(foundTask.notes || '');
    }
  }, [taskId]);

  const handleStepToggle = (stepId: string) => {
    if (!task) return;
    
    const updatedSteps = task.steps.map(step => 
      step.id === stepId 
        ? { 
            ...step, 
            completed: !step.completed,
            completedAt: !step.completed ? new Date().toISOString() : undefined
          }
        : step
    );
    
    const completedSteps = updatedSteps.filter(s => s.completed).length;
    const newProgress = (completedSteps / updatedSteps.length) * 100;
    
    setTask({
      ...task,
      steps: updatedSteps,
      progress: newProgress,
      status: newProgress === 100 ? 'review' : 'in-progress'
    });
  };

  const handleSaveNotes = () => {
    if (!task) return;
    setTask({ ...task, notes });
    setIsNotesOpen(false);
  };

  const handleEscalate = () => {
    if (!task) return;
    setTask({ 
      ...task, 
      escalationNeeded: true,
      status: 'escalated'
    });
    setIsEscalationOpen(false);
  };

  if (!task) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-white text-lg font-semibold mb-2">Loading Task...</h4>
          <p className="text-gray-400 text-sm">Please wait while we load the task details</p>
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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button
                  isIconOnly
                  size="sm"
                  className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                  onPress={() => router.back()}
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Button>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-${getCategoryColor(task.category)}-500/20 rounded-xl flex items-center justify-center`}>
                    <div className={`text-${getCategoryColor(task.category)}-400`}>
                      {getCategoryIcon(task.category)}
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold text-white tracking-tight">{task.title}</h1>
                    <p className="text-gray-400 text-sm font-medium">{task.client.name} • {task.client.industry}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Chip 
                  color={getPriorityColor(task.priority)}
                  size="sm"
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

            {/* Task Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Progress Card */}
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold text-sm">Progress</h3>
                    <span className="text-gray-400 text-xs">{task.progress}%</span>
                  </div>
                  <Progress 
                    value={task.progress}
                    className="w-full mb-2"
                    color="primary"
                  />
                  <p className="text-gray-400 text-xs">
                    {task.steps.filter(s => s.completed).length} of {task.steps.length} steps completed
                  </p>
                </CardBody>
              </Card>

              {/* Quality Score Card */}
              {task.qualityScore && (
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                  <CardBody className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold text-sm">Quality Score</h3>
                      <span className="text-gray-400 text-xs">{task.qualityScore}%</span>
                    </div>
                    <Progress 
                      value={task.qualityScore}
                      className="w-full mb-2"
                      color={task.qualityScore >= 90 ? 'success' : task.qualityScore >= 80 ? 'warning' : 'danger'}
                    />
                    <p className="text-gray-400 text-xs">Overall accuracy rating</p>
                  </CardBody>
                </Card>
              )}

              {/* Time Tracking Card */}
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardBody className="p-6">
                  <h3 className="text-white font-semibold text-sm mb-4">Time Tracking</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-xs">Estimated:</span>
                      <span className="text-white text-sm font-medium">{task.timeEstimate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-xs">Actual:</span>
                      <span className="text-white text-sm font-medium">{task.actualTime || 'Not started'}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Due Date Card */}
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardBody className="p-6">
                  <h3 className="text-white font-semibold text-sm mb-4">Due Date</h3>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-white text-sm font-medium">{formatDate(task.dueDate)}</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-2">Assigned by {task.assignedBy}</p>
                </CardBody>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column - Task Steps */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Task Description */}
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                  <CardHeader className="pb-3">
                    <h3 className="text-white font-semibold text-lg">Task Description</h3>
                  </CardHeader>
                  <CardBody className="pt-0">
                    <p className="text-gray-300 text-sm leading-relaxed">{task.description}</p>
                  </CardBody>
                </Card>

                {/* Task Steps */}
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between w-full">
                      <h3 className="text-white font-semibold text-lg">Task Steps</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400 text-xs">
                          {task.steps.filter(s => s.completed).length}/{task.steps.length} completed
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="pt-0">
                    <div className="space-y-4">
                      {task.steps.map((step, index) => (
                        <div key={step.id} className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl border border-white/10">
                          <button
                            onClick={() => handleStepToggle(step.id)}
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                              step.completed 
                                ? 'bg-green-500 hover:bg-green-600' 
                                : 'bg-gray-500 hover:bg-gray-400 border-2 border-gray-400'
                            }`}
                          >
                            {step.completed ? (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <span className="text-white text-xs font-semibold">{index + 1}</span>
                            )}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className={`font-medium ${step.completed ? 'text-green-400' : 'text-white'}`}>
                                {step.title}
                              </h4>
                              {step.completedAt && (
                                <span className="text-gray-400 text-xs">
                                  {formatDate(step.completedAt)}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>

                {/* Attachments */}
                {task.attachments && task.attachments.length > 0 && (
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                    <CardHeader className="pb-3">
                      <h3 className="text-white font-semibold text-lg">Attachments</h3>
                    </CardHeader>
                    <CardBody className="pt-0">
                      <div className="space-y-3">
                        {task.attachments.map((attachment) => (
                          <div key={attachment.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-white font-medium text-sm">{attachment.name}</p>
                                <p className="text-gray-400 text-xs">{attachment.type} • {formatDate(attachment.uploadedAt)}</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30"
                            >
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                )}
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                
                {/* Action Buttons */}
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                  <CardHeader className="pb-3">
                    <h3 className="text-white font-semibold text-lg">Actions</h3>
                  </CardHeader>
                  <CardBody className="pt-0 space-y-3">
                    <Button 
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                      onPress={() => {
                        // Handle task start/continue
                      }}
                    >
                      {task.status === 'pending' ? 'Start Task' : 'Continue Task'}
                    </Button>
                    
                    <Button 
                      className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
                      onPress={() => setIsNotesOpen(true)}
                    >
                      Add Notes
                    </Button>
                    
                    {task.learningContent && (
                      <Button 
                        className="w-full bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30"
                        onPress={() => setIsLearningOpen(true)}
                      >
                        View Learning Resources
                      </Button>
                    )}
                    
                    {task.escalationNeeded ? (
                      <Button 
                        className="w-full bg-red-500 hover:bg-red-600 text-white"
                        disabled
                      >
                        Escalated
                      </Button>
                    ) : (
                      <Button 
                        className="w-full bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                        onPress={() => setIsEscalationOpen(true)}
                      >
                        Escalate to Supervisor
                      </Button>
                    )}
                  </CardBody>
                </Card>

                {/* Quality Metrics */}
                {task.qualityMetrics && (
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                    <CardHeader className="pb-3">
                      <h3 className="text-white font-semibold text-lg">Quality Metrics</h3>
                    </CardHeader>
                    <CardBody className="pt-0 space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400 text-sm">Accuracy</span>
                          <span className="text-white text-sm font-medium">{task.qualityMetrics.accuracy}%</span>
                        </div>
                        <Progress 
                          value={task.qualityMetrics.accuracy}
                          className="w-full"
                          color={task.qualityMetrics.accuracy >= 90 ? 'success' : task.qualityMetrics.accuracy >= 80 ? 'warning' : 'danger'}
                          size="sm"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400 text-sm">Completeness</span>
                          <span className="text-white text-sm font-medium">{task.qualityMetrics.completeness}%</span>
                        </div>
                        <Progress 
                          value={task.qualityMetrics.completeness}
                          className="w-full"
                          color={task.qualityMetrics.completeness >= 90 ? 'success' : task.qualityMetrics.completeness >= 80 ? 'warning' : 'danger'}
                          size="sm"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400 text-sm">Timeliness</span>
                          <span className="text-white text-sm font-medium">{task.qualityMetrics.timeliness}%</span>
                        </div>
                        <Progress 
                          value={task.qualityMetrics.timeliness}
                          className="w-full"
                          color={task.qualityMetrics.timeliness >= 90 ? 'success' : task.qualityMetrics.timeliness >= 80 ? 'warning' : 'danger'}
                          size="sm"
                        />
                      </div>
                    </CardBody>
                  </Card>
                )}

                {/* Supervisor Notes */}
                {task.supervisorNotes && (
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                    <CardHeader className="pb-3">
                      <h3 className="text-white font-semibold text-lg">Supervisor Notes</h3>
                    </CardHeader>
                    <CardBody className="pt-0">
                      <p className="text-gray-300 text-sm leading-relaxed">{task.supervisorNotes}</p>
                    </CardBody>
                  </Card>
                )}

                {/* Task Notes */}
                {task.notes && (
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                    <CardHeader className="pb-3">
                      <h3 className="text-white font-semibold text-lg">My Notes</h3>
                    </CardHeader>
                    <CardBody className="pt-0">
                      <p className="text-gray-300 text-sm leading-relaxed">{task.notes}</p>
                    </CardBody>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Resources Modal */}
      <Modal 
        isOpen={isLearningOpen} 
        onClose={() => setIsLearningOpen(false)}
        size="2xl"
        className="bg-black/95 backdrop-blur-xl"
        classNames={{
          base: "border border-white/10",
          header: "border-b border-white/10",
          body: "py-6"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-white text-lg font-semibold">
                  {task.learningContent?.title}
                </h3>
              </ModalHeader>
              <ModalBody>
                {task.learningContent && (
                  <div className="space-y-4">
                    <p className="text-gray-300 text-sm">{task.learningContent.description}</p>
                    <div>
                      <h4 className="text-white font-semibold mb-3">Available Resources</h4>
                      <div className="space-y-2">
                        {task.learningContent.resources.map((resource, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                            <span className="text-white font-medium">{resource}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button 
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onPress={onClose}
                >
                  Access Resources
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Notes Modal */}
      <Modal 
        isOpen={isNotesOpen} 
        onClose={() => setIsNotesOpen(false)}
        size="lg"
        className="bg-black/95 backdrop-blur-xl"
        classNames={{
          base: "border border-white/10",
          header: "border-b border-white/10",
          body: "py-6"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-white text-lg font-semibold">Add Task Notes</h3>
              </ModalHeader>
              <ModalBody>
                <Textarea
                  placeholder="Add your notes about this task..."
                  value={notes}
                  onValueChange={setNotes}
                  className="w-full"
                  classNames={{
                    input: "text-white",
                    inputWrapper: "bg-white/5 border-white/10 hover:border-white/20 focus-within:border-blue-500/50"
                  }}
                  minRows={6}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button 
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onPress={handleSaveNotes}
                >
                  Save Notes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Escalation Modal */}
      <Modal 
        isOpen={isEscalationOpen} 
        onClose={() => setIsEscalationOpen(false)}
        size="lg"
        className="bg-black/95 backdrop-blur-xl"
        classNames={{
          base: "border border-white/10",
          header: "border-b border-white/10",
          body: "py-6"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-white text-lg font-semibold">Escalate to Supervisor</h3>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <p className="text-gray-300 text-sm">
                    Please provide a reason for escalating this task to your supervisor. This will help them understand the issue and provide appropriate guidance.
                  </p>
                  <Textarea
                    placeholder="Describe the issue or reason for escalation..."
                    value={escalationReason}
                    onValueChange={setEscalationReason}
                    className="w-full"
                    classNames={{
                      input: "text-white",
                      inputWrapper: "bg-white/5 border-white/10 hover:border-white/20 focus-within:border-blue-500/50"
                    }}
                    minRows={4}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button 
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onPress={handleEscalate}
                  isDisabled={!escalationReason.trim()}
                >
                  Escalate Task
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
