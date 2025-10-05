"use client";
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Button, 
  Chip, 
  Textarea,
  Input,
  Progress,
  Badge,
  Avatar,
  Tooltip,
  Tabs,
  Tab
} from "@nextui-org/react";
import { 
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  FileText,
  TrendingUp,
  Users,
  Shield,
  Activity,
  Database
} from "lucide-react";

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
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    primaryContact: string;
  };
  businessInfo: {
    founded: string;
    employees: number;
    revenue: string;
    taxId: string;
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
    },
    contactInfo: {
      email: "contact@techcorp-saas.com",
      phone: "(555) 123-4567",
      address: "123 Tech Street, San Francisco, CA 94105",
      primaryContact: "Sarah Johnson, CFO"
    },
    businessInfo: {
      founded: "2018",
      employees: 150,
      revenue: "$25M",
      taxId: "12-3456789"
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
    },
    contactInfo: {
      email: "finance@retailchain-llc.com",
      phone: "(555) 987-6543",
      address: "456 Commerce Ave, Austin, TX 78701",
      primaryContact: "Michael Chen, Controller"
    },
    businessInfo: {
      founded: "2015",
      employees: 75,
      revenue: "$15M",
      taxId: "98-7654321"
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
    },
    contactInfo: {
      email: "accounting@manufacturingco.com",
      phone: "(555) 456-7890",
      address: "789 Industrial Blvd, Houston, TX 77001",
      primaryContact: "David Rodriguez, Finance Director"
    },
    businessInfo: {
      founded: "2010",
      employees: 200,
      revenue: "$45M",
      taxId: "45-6789012"
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
    },
    contactInfo: {
      email: "finance@servicescorp.com",
      phone: "(555) 321-0987",
      address: "321 Business Plaza, Chicago, IL 60601",
      primaryContact: "Lisa Wang, CFO"
    },
    businessInfo: {
      founded: "2012",
      employees: 120,
      revenue: "$18M",
      taxId: "32-1098765"
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
      return <Database className="w-4 h-4" />;
    case 'validation':
      return <CheckCircle className="w-4 h-4" />;
    case 'communication':
      return <MessageSquare className="w-4 h-4" />;
    case 'document-upload':
      return <FileText className="w-4 h-4" />;
    case 'quality-check':
      return <Shield className="w-4 h-4" />;
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

export default function ClientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;
  
  const [selectedTab, setSelectedTab] = useState("overview");
  const [newNote, setNewNote] = useState("");

  // Find the client by ID
  const client = staffClients.find(c => c.id === clientId);

  if (!client) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-white text-xl font-semibold mb-2">Client Not Found</h2>
          <p className="text-gray-400 text-sm mb-4">The requested client could not be found.</p>
          <Button
            onPress={() => router.push('/dashboard/staff-accountant/clients')}
            className="bg-blue-500 hover:bg-blue-600 text-white"
            startContent={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Clients
          </Button>
        </div>
      </div>
    );
  }

  const handleBackToClients = () => {
    router.push('/dashboard/staff-accountant/clients');
  };

  const handleStartTask = (taskId: string) => {
    // Navigate to task detail or open task modal
    console.log('Starting task:', taskId);
  };

  const handleContactClient = () => {
    // Open communication modal or navigate to communication page
    console.log('Contacting client:', client.id);
  };

  const handleEscalate = () => {
    // Handle escalation to supervisor
    console.log('Escalating client:', client.id);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-6">
        <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
          
          {/* Main Content */}
          <div className="mt-6 gap-6 flex flex-col w-full">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button
                  isIconOnly
                  onPress={handleBackToClients}
                  className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </Button>
                <div className="flex items-center space-x-3">
                  <Avatar 
                    name={client.avatar} 
                    className="w-12 h-12 bg-blue-500/20 text-blue-400 font-semibold"
                  />
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">{client.name}</h1>
                    <p className="text-gray-400 text-sm">{client.industry} • Assigned {client.assignedSince}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Chip 
                  color={getPriorityColor(client.priority)}
                  size="lg"
                  className="font-semibold"
                >
                  {client.priority.toUpperCase()} PRIORITY
                </Chip>
                {client.communication.escalationNeeded && (
                  <Chip 
                    color="danger"
                    size="lg"
                    className="font-semibold animate-pulse"
                  >
                    ESCALATION NEEDED
                  </Chip>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Tasks Completed</p>
                      <p className="text-white text-2xl font-bold">
                        {client.currentTasks.filter(t => t.status === 'completed').length}/{client.currentTasks.length}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                </CardBody>
              </Card>
              
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Quality Score</p>
                      <p className="text-white text-2xl font-bold">{client.qualityMetrics.accuracyScore}%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-400" />
                  </div>
                </CardBody>
              </Card>
              
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Pending Requests</p>
                      <p className="text-white text-2xl font-bold">{client.communication.pendingRequests}</p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-orange-400" />
                  </div>
                </CardBody>
              </Card>
              
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Last Contact</p>
                      <p className="text-white text-sm font-semibold">{formatDate(client.communication.lastContact)}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-purple-400" />
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs 
              selectedKey={selectedTab} 
              onSelectionChange={(key) => setSelectedTab(key as string)}
              className="w-full"
              classNames={{
                tabList: "bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-1",
                tab: "text-white data-[selected=true]:bg-white/10 data-[selected=true]:text-white",
                tabContent: "text-white"
              }}
            >
              <Tab key="overview" title="Overview">
                <div className="space-y-6 mt-6">
                  
                  {/* Current Tasks */}
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                    <CardHeader className="flex items-center space-x-3">
                      <Activity className="w-5 h-5 text-blue-400" />
                      <h3 className="text-white text-lg font-semibold">Current Tasks</h3>
                    </CardHeader>
                    <CardBody className="space-y-4">
                      {client.currentTasks.map((task) => (
                        <div key={task.id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="text-blue-400">
                                {getTaskTypeIcon(task.type)}
                              </div>
                              <div>
                                <h4 className="text-white font-semibold">{task.title}</h4>
                                <p className="text-gray-400 text-sm">{task.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Chip 
                                color={getTaskStatusColor(task.status)}
                                size="sm"
                              >
                                {task.status.replace('-', ' ')}
                              </Chip>
                              <Button
                                size="sm"
                                className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30"
                                onPress={() => handleStartTask(task.id)}
                              >
                                Start
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-400 text-sm">Due: {formatDate(task.dueDate)}</span>
                              </div>
                              {task.qualityScore && (
                                <div className="flex items-center space-x-2">
                                  <Shield className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-400 text-sm">Quality: {task.qualityScore}%</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Progress 
                                value={task.progress}
                                className="w-24"
                                color="primary"
                                size="sm"
                              />
                              <span className="text-white text-sm font-semibold">{task.progress}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardBody>
                  </Card>

                  {/* Data Status */}
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                    <CardHeader className="flex items-center space-x-3">
                      <Database className="w-5 h-5 text-green-400" />
                      <h3 className="text-white text-lg font-semibold">Data Status</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-white/5 rounded-xl">
                          <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                            client.dataStatus.salesData === 'complete' ? 'bg-green-500' :
                            client.dataStatus.salesData === 'partial' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                          <p className="text-gray-400 text-xs">Sales Data</p>
                          <p className="text-white font-semibold capitalize">{client.dataStatus.salesData}</p>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-xl">
                          <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                            client.dataStatus.documents === 'complete' ? 'bg-green-500' :
                            client.dataStatus.documents === 'partial' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                          <p className="text-gray-400 text-xs">Documents</p>
                          <p className="text-white font-semibold capitalize">{client.dataStatus.documents}</p>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-xl">
                          <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                            client.dataStatus.validation === 'passed' ? 'bg-green-500' :
                            client.dataStatus.validation === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                          <p className="text-gray-400 text-xs">Validation</p>
                          <p className="text-white font-semibold capitalize">{client.dataStatus.validation}</p>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-xl">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-2"></div>
                          <p className="text-gray-400 text-xs">Last Update</p>
                          <p className="text-white font-semibold text-sm">{formatDate(client.dataStatus.lastUpdate)}</p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Quality Metrics */}
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                    <CardHeader className="flex items-center space-x-3">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                      <h3 className="text-white text-lg font-semibold">Quality Metrics</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 font-medium">Accuracy Score</span>
                            <div className="flex items-center space-x-2">
                              <Progress 
                                value={client.qualityMetrics.accuracyScore}
                                className="w-20"
                                color={client.qualityMetrics.accuracyScore >= 90 ? 'success' : client.qualityMetrics.accuracyScore >= 80 ? 'warning' : 'danger'}
                                size="sm"
                              />
                              <span className="text-white font-semibold">{client.qualityMetrics.accuracyScore}%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 font-medium">Completion Rate</span>
                            <span className="text-white font-semibold">{client.qualityMetrics.completionRate}%</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 font-medium">Error Count</span>
                            <span className="text-white font-semibold">{client.qualityMetrics.errorCount}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 font-medium">Last Review</span>
                            <span className="text-white font-semibold">{formatDate(client.qualityMetrics.lastReview)}</span>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Tab>

              <Tab key="contact" title="Contact & Business Info">
                <div className="space-y-6 mt-6">
                  
                  {/* Contact Information */}
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                    <CardHeader className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-blue-400" />
                      <h3 className="text-white text-lg font-semibold">Contact Information</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <p className="text-gray-400 text-sm font-medium">Primary Contact</p>
                            <p className="text-white font-semibold">{client.contactInfo.primaryContact}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm font-medium">Email</p>
                            <p className="text-white font-semibold">{client.contactInfo.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm font-medium">Phone</p>
                            <p className="text-white font-semibold">{client.contactInfo.phone}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm font-medium">Address</p>
                          <p className="text-white font-semibold">{client.contactInfo.address}</p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Business Information */}
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                    <CardHeader className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-green-400" />
                      <h3 className="text-white text-lg font-semibold">Business Information</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-white/5 rounded-xl">
                          <p className="text-gray-400 text-xs">Founded</p>
                          <p className="text-white font-semibold">{client.businessInfo.founded}</p>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-xl">
                          <p className="text-gray-400 text-xs">Employees</p>
                          <p className="text-white font-semibold">{client.businessInfo.employees}</p>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-xl">
                          <p className="text-gray-400 text-xs">Revenue</p>
                          <p className="text-white font-semibold">{client.businessInfo.revenue}</p>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-xl">
                          <p className="text-gray-400 text-xs">Tax ID</p>
                          <p className="text-white font-semibold text-sm">{client.businessInfo.taxId}</p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Communication Status */}
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                    <CardHeader className="flex items-center space-x-3">
                      <MessageSquare className="w-5 h-5 text-orange-400" />
                      <h3 className="text-white text-lg font-semibold">Communication Status</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 font-medium">Last Contact</span>
                          <span className="text-white font-semibold">{formatDate(client.communication.lastContact)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 font-medium">Pending Requests</span>
                          <Badge content={client.communication.pendingRequests} color="warning">
                            <span className="text-white font-semibold">Requests</span>
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 font-medium">Escalation Needed</span>
                          <Chip 
                            color={client.communication.escalationNeeded ? 'danger' : 'success'}
                            size="sm"
                          >
                            {client.communication.escalationNeeded ? 'YES' : 'NO'}
                          </Chip>
                        </div>
                        {client.communication.supervisorNotes && (
                          <div className="mt-4 p-4 bg-white/5 rounded-xl">
                            <p className="text-gray-400 text-sm font-medium mb-2">Supervisor Notes:</p>
                            <p className="text-white text-sm">{client.communication.supervisorNotes}</p>
                          </div>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Tab>

              <Tab key="notes" title="Notes & Actions">
                <div className="space-y-6 mt-6">
                  
                  {/* Add Note */}
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                    <CardHeader className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <h3 className="text-white text-lg font-semibold">Add Note</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Add a note about this client..."
                          value={newNote}
                          onValueChange={setNewNote}
                          className="w-full"
                          classNames={{
                            input: "text-white",
                            inputWrapper: "bg-white/5 border-white/10 hover:border-white/20 focus-within:border-blue-500/50"
                          }}
                        />
                        <div className="flex justify-end">
                          <Button
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                            onPress={() => {
                              console.log('Adding note:', newNote);
                              setNewNote('');
                            }}
                          >
                            Add Note
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Action Buttons */}
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                    <CardHeader className="flex items-center space-x-3">
                      <Activity className="w-5 h-5 text-green-400" />
                      <h3 className="text-white text-lg font-semibold">Quick Actions</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button
                          className="bg-blue-500 hover:bg-blue-600 text-white py-6 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-blue-500/25"
                          onPress={handleContactClient}
                          startContent={<MessageSquare className="w-5 h-5" />}
                        >
                          Contact Client
                        </Button>
                        <Button
                          className="bg-green-500 hover:bg-green-600 text-white py-6 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-green-500/25"
                          onPress={() => handleStartTask(client.currentTasks[0]?.id)}
                          startContent={<CheckCircle className="w-5 h-5" />}
                        >
                          Start Next Task
                        </Button>
                        {client.communication.escalationNeeded && (
                          <Button
                            className="bg-red-500 hover:bg-red-600 text-white py-6 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-red-500/25"
                            onPress={handleEscalate}
                            startContent={<AlertTriangle className="w-5 h-5" />}
                          >
                            Escalate to Supervisor
                          </Button>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

