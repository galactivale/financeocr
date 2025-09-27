"use client";
import React, { useState, useRef, useEffect } from "react";
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
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
  Tabs,
  Tab,
  Divider
} from "@nextui-org/react";

// Client Support Communication Interface
interface ClientInquiry {
  id: string;
  clientId: string;
  clientName: string;
  avatar: string;
  inquiryType: 'data-request' | 'portal-assistance' | 'status-update' | 'nexus-education' | 'process-overview' | 'compliance-guidance';
  subject: string;
  message: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'new' | 'in-progress' | 'pending-approval' | 'escalated' | 'resolved';
  receivedAt: string;
  assignedTo: string;
  supervisor: string;
  escalationReason?: string;
  responseTemplate?: string;
  customResponse?: string;
  requiresApproval: boolean;
  complexityLevel: 'simple' | 'moderate' | 'complex';
}

// Response Template System
interface ResponseTemplate {
  id: string;
  category: string;
  title: string;
  content: string;
  variables: string[];
  approvalRequired: boolean;
  escalationTriggers: string[];
  usageCount: number;
  successRate: number;
}

// Portal Activity Monitoring
interface PortalActivity {
  id: string;
  clientId: string;
  clientName: string;
  activityType: 'upload-attempt' | 'navigation-issue' | 'access-problem' | 'deadline-reminder' | 'process-update';
  description: string;
  timestamp: string;
  status: 'active' | 'resolved' | 'escalated';
  staffResponse?: string;
  supervisorNotes?: string;
}

// Quality Management and Professional Development
interface QualityMetrics {
  id: string;
  staffMember: string;
  period: string;
  communicationQuality: {
    responseTime: number; // hours
    clientSatisfaction: number; // percentage
    templateUsage: number; // percentage
    escalationRate: number; // percentage
    approvalSuccess: number; // percentage
  };
  professionalDevelopment: {
    skillsAssessed: string[];
    improvementAreas: string[];
    achievements: string[];
    mentorFeedback: string;
    nextGoals: string[];
  };
  performanceTracking: {
    totalInquiries: number;
    resolvedInquiries: number;
    escalatedInquiries: number;
    averageResponseTime: number;
    clientFeedbackScore: number;
  };
}

// Communication Quality Analysis
interface CommunicationAnalysis {
  id: string;
  inquiryId: string;
  staffResponse: string;
  qualityScore: number;
  toneAnalysis: 'professional' | 'friendly' | 'formal' | 'needs-improvement';
  accuracyCheck: 'accurate' | 'minor-issues' | 'major-issues';
  complianceCheck: 'compliant' | 'review-needed' | 'non-compliant';
  supervisorReview?: {
    reviewer: string;
    feedback: string;
    score: number;
    recommendations: string[];
  };
}

// Sample data for Staff Accountant Client Support
const clientInquiries: ClientInquiry[] = [
  {
    id: "inq-001",
    clientId: "techcorp-saas",
    clientName: "TechCorp SaaS",
    avatar: "T",
    inquiryType: "data-request",
    subject: "Sales Data Upload Format",
    message: "I'm having trouble uploading our Q4 sales data. What format should I use and are there any specific requirements for California transactions?",
    priority: "high",
    status: "in-progress",
    receivedAt: "2024-12-10T10:30:00Z",
    assignedTo: "Staff Accountant",
    supervisor: "Jane Doe, CPA",
    responseTemplate: "data-upload-guidance",
    requiresApproval: false,
    complexityLevel: "simple"
  },
  {
    id: "inq-002",
    clientId: "retailchain-llc",
    clientName: "RetailChain LLC",
    avatar: "R",
    inquiryType: "portal-assistance",
    subject: "Portal Navigation Help",
    message: "I can't find where to upload my supporting documents. The portal seems different from last quarter. Can you guide me through the process?",
    priority: "medium",
    status: "new",
    receivedAt: "2024-12-10T14:15:00Z",
    assignedTo: "Staff Accountant",
    supervisor: "Jane Doe, CPA",
    responseTemplate: "portal-navigation-help",
    requiresApproval: false,
    complexityLevel: "simple"
  },
  {
    id: "inq-003",
    clientId: "manufacturingco",
    clientName: "ManufacturingCo",
    avatar: "M",
    inquiryType: "nexus-education",
    subject: "Economic Nexus Threshold Questions",
    message: "We're expanding to Texas and want to understand the economic nexus thresholds. What are the requirements and how do we calculate our sales?",
    priority: "urgent",
    status: "escalated",
    receivedAt: "2024-12-09T16:45:00Z",
    assignedTo: "Staff Accountant",
    supervisor: "Jane Doe, CPA",
    escalationReason: "Complex nexus strategy question requiring Tax Manager expertise",
    requiresApproval: true,
    complexityLevel: "complex"
  },
  {
    id: "inq-004",
    clientId: "servicescorp",
    clientName: "ServicesCorp",
    avatar: "S",
    inquiryType: "status-update",
    subject: "Compliance Processing Status",
    message: "I submitted our data last week. Can you provide an update on the processing status and expected timeline for completion?",
    priority: "medium",
    status: "pending-approval",
    receivedAt: "2024-12-10T09:20:00Z",
    assignedTo: "Staff Accountant",
    supervisor: "Jane Doe, CPA",
    responseTemplate: "status-update-template",
    requiresApproval: true,
    complexityLevel: "moderate"
  }
];

const responseTemplates: ResponseTemplate[] = [
  {
    id: "data-upload-guidance",
    category: "Data Request Communications",
    title: "Sales Data Upload Guidance",
    content: "Dear {clientName},\n\nThank you for reaching out regarding your sales data upload. Here's the guidance you need:\n\n**Required Format:**\n- Excel (.xlsx) or CSV format\n- Include columns: Date, State, Sales Amount, Transaction Type\n- Separate file for each state if applicable\n\n**California Specific Requirements:**\n- Include all sales over $500,000 threshold\n- Provide supporting documentation for large transactions\n- Ensure proper state allocation\n\n**Upload Process:**\n1. Log into your client portal\n2. Navigate to 'Data Upload' section\n3. Select 'Sales Data' category\n4. Upload your formatted file\n5. Confirm submission\n\nIf you encounter any issues, please don't hesitate to contact us. We're here to help ensure your compliance process goes smoothly.\n\nBest regards,\n{staffName}\nStaff Accountant\n{supervisorName}",
    variables: ["clientName", "staffName", "supervisorName"],
    approvalRequired: false,
    escalationTriggers: ["complex allocation", "threshold questions", "penalty concerns"],
    usageCount: 45,
    successRate: 94
  },
  {
    id: "portal-navigation-help",
    category: "Portal Assistance Support",
    title: "Portal Navigation Assistance",
    content: "Dear {clientName},\n\nI understand you're having trouble navigating the portal. Let me guide you through the process:\n\n**Step-by-Step Navigation:**\n1. **Login:** Use your credentials at the client portal\n2. **Dashboard:** You'll see your compliance status overview\n3. **Data Upload:** Click 'Upload Documents' in the left sidebar\n4. **Document Types:** Select the appropriate category (Sales Data, Supporting Docs, etc.)\n5. **File Upload:** Drag and drop or browse to select your files\n6. **Confirmation:** Review and submit\n\n**New Features This Quarter:**\n- Improved file preview\n- Better progress tracking\n- Enhanced error messages\n\nIf you're still having trouble, I can schedule a brief screen-sharing session to walk you through it personally.\n\nBest regards,\n{staffName}\nStaff Accountant\n{supervisorName}",
    variables: ["clientName", "staffName", "supervisorName"],
    approvalRequired: false,
    escalationTriggers: ["technical issues", "access problems", "data corruption"],
    usageCount: 32,
    successRate: 89
  },
  {
    id: "status-update-template",
    category: "Status Update Inquiries",
    title: "Processing Status Update",
    content: "Dear {clientName},\n\nThank you for your inquiry about your compliance processing status.\n\n**Current Status:**\n- Data received: {receivedDate}\n- Processing stage: {currentStage}\n- Expected completion: {expectedDate}\n\n**Next Steps:**\n1. Data validation and quality review\n2. Threshold calculations\n3. State-specific compliance checks\n4. Final review and submission\n\n**Timeline:**\n- Standard processing: 5-7 business days\n- Complex cases: 10-14 business days\n- Your case: {estimatedTimeline}\n\nWe'll notify you immediately upon completion. If you have any urgent concerns, please don't hesitate to contact us.\n\nBest regards,\n{staffName}\nStaff Accountant\n{supervisorName}",
    variables: ["clientName", "receivedDate", "currentStage", "expectedDate", "estimatedTimeline", "staffName", "supervisorName"],
    approvalRequired: true,
    escalationTriggers: ["timeline concerns", "urgent requests", "complex cases"],
    usageCount: 28,
    successRate: 92
  }
];

const portalActivities: PortalActivity[] = [
  {
    id: "act-001",
    clientId: "techcorp-saas",
    clientName: "TechCorp SaaS",
    activityType: "upload-attempt",
    description: "Client attempted to upload sales data but received format error",
    timestamp: "2024-12-10T11:45:00Z",
    status: "active",
    staffResponse: "Provided format guidance and template"
  },
  {
    id: "act-002",
    clientId: "retailchain-llc",
    clientName: "RetailChain LLC",
    activityType: "navigation-issue",
    description: "Client spent 15+ minutes looking for document upload section",
    timestamp: "2024-12-10T14:30:00Z",
    status: "resolved",
    staffResponse: "Sent step-by-step navigation guide"
  },
  {
    id: "act-003",
    clientId: "manufacturingco",
    clientName: "ManufacturingCo",
    activityType: "deadline-reminder",
    description: "Q4 deadline approaching - client hasn't started data entry",
    timestamp: "2024-12-10T08:00:00Z",
    status: "active",
    supervisorNotes: "Escalated to Tax Manager for direct client contact"
  }
];

// Sample Quality Metrics and Professional Development Data
const qualityMetrics: QualityMetrics = {
  id: "qm-001",
  staffMember: "Staff Accountant",
  period: "Q4 2024",
  communicationQuality: {
    responseTime: 2.5,
    clientSatisfaction: 94,
    templateUsage: 87,
    escalationRate: 12,
    approvalSuccess: 96
  },
  professionalDevelopment: {
    skillsAssessed: ["Client Communication", "Nexus Knowledge", "Template Usage", "Escalation Judgment"],
    improvementAreas: ["Complex Nexus Questions", "Technical Portal Issues"],
    achievements: ["Improved response time by 30%", "Achieved 94% client satisfaction", "Reduced escalation rate"],
    mentorFeedback: "Excellent progress in client communication. Continue focusing on nexus complexity recognition.",
    nextGoals: ["Master complex nexus scenarios", "Improve technical troubleshooting", "Lead training sessions"]
  },
  performanceTracking: {
    totalInquiries: 156,
    resolvedInquiries: 137,
    escalatedInquiries: 19,
    averageResponseTime: 2.5,
    clientFeedbackScore: 4.7
  }
};

const communicationAnalyses: CommunicationAnalysis[] = [
  {
    id: "ca-001",
    inquiryId: "inq-001",
    staffResponse: "Thank you for reaching out regarding your sales data upload. Here's the guidance you need...",
    qualityScore: 92,
    toneAnalysis: "professional",
    accuracyCheck: "accurate",
    complianceCheck: "compliant",
    supervisorReview: {
      reviewer: "Jane Doe, CPA",
      feedback: "Excellent use of template with appropriate customization. Professional tone maintained throughout.",
      score: 92,
      recommendations: ["Consider adding more specific examples for California requirements"]
    }
  },
  {
    id: "ca-002",
    inquiryId: "inq-002",
    staffResponse: "I understand you're having trouble navigating the portal. Let me guide you through the process...",
    qualityScore: 88,
    toneAnalysis: "friendly",
    accuracyCheck: "accurate",
    complianceCheck: "compliant",
    supervisorReview: {
      reviewer: "Jane Doe, CPA",
      feedback: "Good use of step-by-step guidance. Consider being more concise in future responses.",
      score: 88,
      recommendations: ["Practice more concise communication", "Add visual aids when possible"]
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

const getInquiryTypeIcon = (type: string) => {
  switch (type) {
    case 'data-request':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case 'portal-assistance':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0l1.83 7.5a1.5 1.5 0 01-1.442 1.933H9.937a1.5 1.5 0 01-1.442-1.933l1.83-7.5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case 'status-update':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      );
    case 'nexus-education':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'new': return 'primary';
    case 'in-progress': return 'warning';
    case 'pending-approval': return 'secondary';
    case 'escalated': return 'danger';
    case 'resolved': return 'success';
    default: return 'default';
  }
};

const getComplexityColor = (complexity: string) => {
  switch (complexity) {
    case 'simple': return 'success';
    case 'moderate': return 'warning';
    case 'complex': return 'danger';
    default: return 'default';
  }
};

export default function StaffAccountantClientSupport() {
  const [selectedInquiry, setSelectedInquiry] = useState<ClientInquiry | null>(null);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ResponseTemplate | null>(null);
  const [customResponse, setCustomResponse] = useState('');
  const [inquiryFilter, setInquiryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('inquiries');

  // Filter inquiries based on search and filter
  const filteredInquiries = clientInquiries.filter(inquiry => {
    const matchesSearch = inquiry.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inquiry.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = inquiryFilter === 'all' || inquiry.status === inquiryFilter;
    return matchesSearch && matchesFilter;
  });

  const handleInquirySelect = (inquiry: ClientInquiry) => {
    setSelectedInquiry(inquiry);
    setIsResponseModalOpen(true);
  };

  const handleTemplateSelect = (template: ResponseTemplate) => {
    setSelectedTemplate(template);
    setIsTemplateModalOpen(true);
  };

  const handleSendResponse = () => {
    // Implementation for sending response
    console.log('Sending response:', { selectedInquiry, customResponse });
    setIsResponseModalOpen(false);
    setCustomResponse('');
  };

  const handleEscalateInquiry = (inquiry: ClientInquiry) => {
    // Implementation for escalation
    console.log('Escalating inquiry:', inquiry);
  };

  // Calculate support metrics
  const supportMetrics = {
    totalInquiries: clientInquiries.length,
    newInquiries: clientInquiries.filter(i => i.status === 'new').length,
    inProgress: clientInquiries.filter(i => i.status === 'in-progress').length,
    pendingApproval: clientInquiries.filter(i => i.status === 'pending-approval').length,
    escalated: clientInquiries.filter(i => i.status === 'escalated').length,
    resolved: clientInquiries.filter(i => i.status === 'resolved').length,
    averageResponseTime: "2.5 hours",
    clientSatisfaction: 94
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-6">
        <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
          
          {/* Main Content */}
          <div className="mt-6 gap-6 flex flex-col w-full">
            {/* Header */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Client Support Center</h2>
              </div>
              
              {/* Support Metrics */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-white font-semibold text-sm tracking-tight">Supervised Client Communication</h3>
                      <p className="text-gray-400 text-xs font-medium">Professional Development Through Client Service</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs font-medium">Active</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{supportMetrics.totalInquiries}</div>
                      <div className="text-gray-400 text-xs font-medium">Total Inquiries</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-500">{supportMetrics.newInquiries}</div>
                      <div className="text-gray-400 text-xs font-medium">New</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-500">{supportMetrics.inProgress}</div>
                      <div className="text-gray-400 text-xs font-medium">In Progress</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-500">{supportMetrics.pendingApproval}</div>
                      <div className="text-gray-400 text-xs font-medium">Pending Approval</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-500">{supportMetrics.escalated}</div>
                      <div className="text-gray-400 text-xs font-medium">Escalated</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-500">{supportMetrics.resolved}</div>
                      <div className="text-gray-400 text-xs font-medium">Resolved</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs for different views */}
              <Tabs 
                selectedKey={activeTab} 
                onSelectionChange={(key) => setActiveTab(key as string)}
                className="mb-6"
                classNames={{
                  tabList: "bg-white/5 backdrop-blur-xl border border-white/10",
                  tab: "text-white data-[selected=true]:text-blue-400",
                  cursor: "bg-blue-500"
                }}
              >
                <Tab key="inquiries" title="Client Inquiries">
                  <div className="space-y-6">
                    {/* Controls */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
                      <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg font-medium transition-all duration-200"
                            onPress={() => setIsTemplateModalOpen(true)}
                          >
                            View Templates
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30 rounded-lg font-medium transition-all duration-200"
                          >
                            Portal Activity
                          </Button>
                        </div>
                        
                        <div className="flex gap-3 items-center">
                          <div className="relative">
                            <Input
                              placeholder="Search inquiries..."
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
                                inquiryFilter === "all" 
                                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                                  : 'bg-white/10 text-white hover:bg-white/20'
                              }`}
                              onPress={() => setInquiryFilter("all")}
                            >
                              All
                            </Button>
                            <Button
                              size="sm"
                              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                                inquiryFilter === "new" 
                                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                                  : 'bg-white/10 text-white hover:bg-white/20'
                              }`}
                              onPress={() => setInquiryFilter("new")}
                            >
                              New
                            </Button>
                            <Button
                              size="sm"
                              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                                inquiryFilter === "in-progress" 
                                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' 
                                  : 'bg-white/10 text-white hover:bg-white/20'
                              }`}
                              onPress={() => setInquiryFilter("in-progress")}
                            >
                              In Progress
                            </Button>
                            <Button
                              size="sm"
                              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                                inquiryFilter === "escalated" 
                                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' 
                                  : 'bg-white/10 text-white hover:bg-white/20'
                              }`}
                              onPress={() => setInquiryFilter("escalated")}
                            >
                              Escalated
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Inquiries Table */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                      <Table aria-label="Client Inquiries" className="text-white">
                        <TableHeader>
                          <TableColumn className="text-white font-semibold">CLIENT</TableColumn>
                          <TableColumn className="text-white font-semibold">INQUIRY TYPE</TableColumn>
                          <TableColumn className="text-white font-semibold">SUBJECT</TableColumn>
                          <TableColumn className="text-white font-semibold">PRIORITY</TableColumn>
                          <TableColumn className="text-white font-semibold">STATUS</TableColumn>
                          <TableColumn className="text-white font-semibold">COMPLEXITY</TableColumn>
                          <TableColumn className="text-white font-semibold">RECEIVED</TableColumn>
                          <TableColumn className="text-white font-semibold">ACTIONS</TableColumn>
                        </TableHeader>
                        <TableBody>
                          {filteredInquiries.map((inquiry) => (
                            <TableRow 
                              key={inquiry.id}
                              className="cursor-pointer hover:bg-white/5 transition-colors duration-200"
                              onClick={() => handleInquirySelect(inquiry)}
                            >
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar 
                                    name={inquiry.avatar} 
                                    className="w-8 h-8 bg-blue-500/20 text-blue-400 font-semibold"
                                  />
                                  <div>
                                    <div className="text-white font-semibold">{inquiry.clientName}</div>
                                    <div className="text-gray-400 text-xs">ID: {inquiry.clientId}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <div className="text-blue-400">
                                    {getInquiryTypeIcon(inquiry.inquiryType)}
                                  </div>
                                  <span className="text-white text-sm capitalize">
                                    {inquiry.inquiryType.replace('-', ' ')}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="max-w-xs">
                                  <div className="text-white font-medium truncate">{inquiry.subject}</div>
                                  <div className="text-gray-400 text-xs truncate">{inquiry.message}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  color={getPriorityColor(inquiry.priority)}
                                  size="sm"
                                >
                                  {inquiry.priority.toUpperCase()}
                                </Chip>
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  color={getStatusColor(inquiry.status)}
                                  size="sm"
                                >
                                  {inquiry.status.replace('-', ' ')}
                                </Chip>
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  color={getComplexityColor(inquiry.complexityLevel)}
                                  size="sm"
                                  variant="flat"
                                >
                                  {inquiry.complexityLevel.toUpperCase()}
                                </Chip>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm text-white">
                                  {formatDate(inquiry.receivedAt)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg font-medium transition-all duration-200"
                                    onPress={() => handleInquirySelect(inquiry)}
                                  >
                                    Respond
                                  </Button>
                                  {inquiry.requiresApproval && (
                                    <Button 
                                      size="sm" 
                                      className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-lg font-medium transition-all duration-200"
                                    >
                                      Approve
                                    </Button>
                                  )}
                                  {inquiry.complexityLevel === 'complex' && (
                                    <Button 
                                      size="sm" 
                                      className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 rounded-lg font-medium transition-all duration-200"
                                      onPress={() => handleEscalateInquiry(inquiry)}
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
                  </div>
                </Tab>
                
                <Tab key="templates" title="Response Templates">
                  <div className="space-y-6">
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                        <h3 className="text-white text-lg font-semibold tracking-tight">Professional Communication Templates</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {responseTemplates.map((template) => (
                          <Card 
                            key={template.id}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                            isPressable
                            onPress={() => handleTemplateSelect(template)}
                          >
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start w-full">
                                <div>
                                  <h4 className="text-white font-semibold text-sm">{template.title}</h4>
                                  <p className="text-gray-400 text-xs">{template.category}</p>
                                </div>
                                {template.approvalRequired && (
                                  <Chip size="sm" color="warning" variant="flat">
                                    Approval Required
                                  </Chip>
                                )}
                              </div>
                            </CardHeader>
                            <CardBody className="pt-0">
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-400 text-xs">Usage Count:</span>
                                  <span className="text-white text-sm font-medium">{template.usageCount}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-400 text-xs">Success Rate:</span>
                                  <span className="text-white text-sm font-medium">{template.successRate}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-400 text-xs">Variables:</span>
                                  <span className="text-white text-sm font-medium">{template.variables.length}</span>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </Tab>
                
                <Tab key="portal" title="Portal Monitoring">
                  <div className="space-y-6">
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                        <h3 className="text-white text-lg font-semibold tracking-tight">Client Portal Activity</h3>
                      </div>
                      
                      <div className="space-y-4">
                        {portalActivities.map((activity) => (
                          <div key={activity.id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center space-x-3">
                                <Avatar 
                                  name={activity.clientName.charAt(0)} 
                                  className="w-8 h-8 bg-purple-500/20 text-purple-400 font-semibold"
                                />
                                <div>
                                  <div className="text-white font-semibold">{activity.clientName}</div>
                                  <div className="text-gray-400 text-sm">{activity.description}</div>
                                  <div className="text-gray-400 text-xs">{formatDate(activity.timestamp)}</div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Chip 
                                  color={activity.status === 'active' ? 'warning' : activity.status === 'resolved' ? 'success' : 'danger'}
                                  size="sm"
                                >
                                  {activity.status.toUpperCase()}
                                </Chip>
                                <Button 
                                  size="sm" 
                                  className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg font-medium transition-all duration-200"
                                >
                                  Assist
                                </Button>
                              </div>
                            </div>
                            {activity.staffResponse && (
                              <div className="mt-3 p-3 bg-white/5 rounded-lg">
                                <p className="text-gray-400 text-xs font-medium mb-1">Staff Response:</p>
                                <p className="text-white text-sm">{activity.staffResponse}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Tab>
                
                <Tab key="quality" title="Quality & Development">
                  <div className="space-y-6">
                    {/* Quality Metrics Overview */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                        <h3 className="text-white text-lg font-semibold tracking-tight">Communication Quality Metrics</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-500">{qualityMetrics.communicationQuality.responseTime}h</div>
                            <div className="text-gray-400 text-xs font-medium">Avg Response Time</div>
                          </div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-500">{qualityMetrics.communicationQuality.clientSatisfaction}%</div>
                            <div className="text-gray-400 text-xs font-medium">Client Satisfaction</div>
                          </div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-500">{qualityMetrics.communicationQuality.templateUsage}%</div>
                            <div className="text-gray-400 text-xs font-medium">Template Usage</div>
                          </div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-500">{qualityMetrics.communicationQuality.escalationRate}%</div>
                            <div className="text-gray-400 text-xs font-medium">Escalation Rate</div>
                          </div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-500">{qualityMetrics.communicationQuality.approvalSuccess}%</div>
                            <div className="text-gray-400 text-xs font-medium">Approval Success</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Professional Development */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                        <h3 className="text-white text-lg font-semibold tracking-tight">Professional Development</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-white font-semibold mb-3">Skills Assessment</h4>
                            <div className="space-y-2">
                              {qualityMetrics.professionalDevelopment.skillsAssessed.map((skill, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                                  <span className="text-white text-sm">{skill}</span>
                                  <Progress 
                                    value={85 + (index * 3)} 
                                    className="w-20" 
                                    color="success" 
                                    size="sm" 
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-white font-semibold mb-3">Improvement Areas</h4>
                            <div className="space-y-2">
                              {qualityMetrics.professionalDevelopment.improvementAreas.map((area, index) => (
                                <div key={index} className="p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                                  <span className="text-orange-400 text-sm">{area}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-white font-semibold mb-3">Recent Achievements</h4>
                            <div className="space-y-2">
                              {qualityMetrics.professionalDevelopment.achievements.map((achievement, index) => (
                                <div key={index} className="flex items-center space-x-2 p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  <span className="text-green-400 text-sm">{achievement}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-white font-semibold mb-3">Mentor Feedback</h4>
                            <div className="p-3 bg-white/5 rounded-lg">
                              <p className="text-gray-300 text-sm">{qualityMetrics.professionalDevelopment.mentorFeedback}</p>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-white font-semibold mb-3">Next Goals</h4>
                            <div className="space-y-2">
                              {qualityMetrics.professionalDevelopment.nextGoals.map((goal, index) => (
                                <div key={index} className="flex items-center space-x-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span className="text-blue-400 text-sm">{goal}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Communication Analysis */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                        <h3 className="text-white text-lg font-semibold tracking-tight">Communication Quality Analysis</h3>
                      </div>
                      
                      <div className="space-y-4">
                        {communicationAnalyses.map((analysis) => (
                          <div key={analysis.id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="text-white font-semibold">Inquiry #{analysis.inquiryId}</h4>
                                <p className="text-gray-400 text-sm">Quality Score: {analysis.qualityScore}/100</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Chip 
                                  color={analysis.toneAnalysis === 'professional' ? 'success' : analysis.toneAnalysis === 'friendly' ? 'primary' : 'warning'}
                                  size="sm"
                                >
                                  {analysis.toneAnalysis.toUpperCase()}
                                </Chip>
                                <Chip 
                                  color={analysis.accuracyCheck === 'accurate' ? 'success' : 'warning'}
                                  size="sm"
                                  variant="flat"
                                >
                                  {analysis.accuracyCheck.toUpperCase()}
                                </Chip>
                              </div>
                            </div>
                            
                            <div className="mb-3 p-3 bg-white/5 rounded-lg">
                              <p className="text-gray-300 text-sm">{analysis.staffResponse}</p>
                            </div>
                            
                            {analysis.supervisorReview && (
                              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="text-blue-400 text-sm font-medium">Supervisor Review:</span>
                                  <span className="text-white text-sm">{analysis.supervisorReview.reviewer}</span>
                                  <span className="text-blue-400 text-sm">({analysis.supervisorReview.score}/100)</span>
                                </div>
                                <p className="text-gray-300 text-sm mb-2">{analysis.supervisorReview.feedback}</p>
                                <div>
                                  <p className="text-gray-400 text-xs font-medium mb-1">Recommendations:</p>
                                  <ul className="text-gray-300 text-xs space-y-1">
                                    {analysis.supervisorReview.recommendations.map((rec, index) => (
                                      <li key={index} className="flex items-center space-x-2">
                                        <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                                        <span>{rec}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Response Modal */}
      <Modal 
        isOpen={isResponseModalOpen} 
        onOpenChange={setIsResponseModalOpen}
        size="3xl"
        classNames={{
          base: "bg-black/95 backdrop-blur-xl border border-white/10",
          header: "border-b border-white/10",
          body: "py-6",
          footer: "border-t border-white/10"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center space-x-3">
                  <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                  <h3 className="text-white text-lg font-semibold">Client Response</h3>
                </div>
                {selectedInquiry && (
                  <div className="flex items-center space-x-3 mt-2">
                    <Avatar 
                      name={selectedInquiry.avatar} 
                      className="w-8 h-8 bg-blue-500/20 text-blue-400 font-semibold"
                    />
                    <div>
                      <div className="text-white font-medium">{selectedInquiry.clientName}</div>
                      <div className="text-gray-400 text-sm">{selectedInquiry.subject}</div>
                    </div>
                  </div>
                )}
              </ModalHeader>
              <ModalBody>
                {selectedInquiry && (
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-lg">
                      <h4 className="text-white font-medium mb-2">Client Inquiry:</h4>
                      <p className="text-gray-300 text-sm">{selectedInquiry.message}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-white font-medium">Response:</h4>
                      <Textarea
                        placeholder="Enter your response to the client..."
                        value={customResponse}
                        onValueChange={setCustomResponse}
                        className="w-full"
                        classNames={{
                          input: "text-white",
                          inputWrapper: "bg-white/5 border-white/10 hover:border-white/20 focus-within:border-blue-500/50"
                        }}
                        minRows={6}
                      />
                    </div>
                    
                    {selectedInquiry.requiresApproval && (
                      <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span className="text-yellow-400 text-sm font-medium">This response requires supervisor approval before sending.</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button 
                  color="danger" 
                  variant="light" 
                  onPress={onClose}
                  className="text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onPress={handleSendResponse}
                >
                  {selectedInquiry?.requiresApproval ? 'Submit for Approval' : 'Send Response'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Template Modal */}
      <Modal 
        isOpen={isTemplateModalOpen} 
        onOpenChange={setIsTemplateModalOpen}
        size="4xl"
        classNames={{
          base: "bg-black/95 backdrop-blur-xl border border-white/10",
          header: "border-b border-white/10",
          body: "py-6",
          footer: "border-t border-white/10"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center space-x-3">
                  <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                  <h3 className="text-white text-lg font-semibold">Response Templates</h3>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  {responseTemplates.map((template) => (
                    <div key={template.id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-white font-semibold">{template.title}</h4>
                          <p className="text-gray-400 text-sm">{template.category}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Chip size="sm" color="primary" variant="flat">
                            {template.usageCount} uses
                          </Chip>
                          <Chip size="sm" color="success" variant="flat">
                            {template.successRate}% success
                          </Chip>
                          {template.approvalRequired && (
                            <Chip size="sm" color="warning" variant="flat">
                              Approval Required
                            </Chip>
                          )}
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 mb-3">
                        <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono">
                          {template.content}
                        </pre>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-400 text-xs">
                            Variables: {template.variables.join(', ')}
                          </span>
                          <span className="text-gray-400 text-xs">
                            Escalation Triggers: {template.escalationTriggers.join(', ')}
                          </span>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg font-medium transition-all duration-200"
                        >
                          Use Template
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button 
                  color="danger" 
                  variant="light" 
                  onPress={onClose}
                  className="text-white hover:bg-white/10"
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
