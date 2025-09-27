"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Card, 
  CardBody, 
  Button, 
  Chip, 
  Progress,
  Badge,
  Avatar,
  Tooltip,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@nextui-org/react";

// Monitoring data structure for Staff Accountant
interface MonitoringClient {
  id: string;
  name: string;
  avatar: string;
  industry: string;
  assignedSince: string;
  supervisor: string;
  monitoringStatus: 'active' | 'pending' | 'review' | 'escalated';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  states: {
    code: string;
    name: string;
    currentRevenue: number;
    threshold: number;
    percentage: number;
    status: 'safe' | 'approaching' | 'exceeded' | 'critical';
    transactions?: number;
    transactionThreshold?: number;
    projectedBreach?: string;
    lastUpdate: string;
  }[];
  dataStatus: {
    salesData: 'complete' | 'partial' | 'missing';
    validation: 'passed' | 'pending' | 'failed';
    qualityScore: number;
    lastProcessed: string;
  };
  alerts: {
    id: string;
    type: 'threshold' | 'data' | 'deadline' | 'quality';
    message: string;
    priority: 'urgent' | 'high' | 'medium' | 'low';
    createdAt: string;
    actionRequired: boolean;
  }[];
  learningContent?: {
    title: string;
    description: string;
    resources: string[];
  };
  nextReview: string;
  escalationNeeded: boolean;
}

// Sample monitoring data
const monitoringClients: MonitoringClient[] = [
  {
    id: "techcorp-saas",
    name: "TechCorp SaaS",
    avatar: "T",
    industry: "Technology SaaS",
    assignedSince: "Jan 2024",
    supervisor: "Jane Doe, CPA",
    monitoringStatus: "active",
    priority: "urgent",
    states: [
      {
        code: "CA",
        name: "California",
        currentRevenue: 525000,
        threshold: 500000,
        percentage: 105,
        status: "exceeded",
        lastUpdate: "2024-12-10"
      },
      {
        code: "NY",
        name: "New York",
        currentRevenue: 89500,
        threshold: 500000,
        percentage: 18,
        status: "safe",
        transactions: 95,
        transactionThreshold: 100,
        projectedBreach: "Q1 2025",
        lastUpdate: "2024-12-10"
      }
    ],
    dataStatus: {
      salesData: "complete",
      validation: "passed",
      qualityScore: 92,
      lastProcessed: "2024-12-10"
    },
    alerts: [
      {
        id: "alert-1",
        type: "threshold",
        message: "California threshold exceeded by $25,000 - immediate action required",
        priority: "urgent",
        createdAt: "2024-12-10",
        actionRequired: true
      }
    ],
    learningContent: {
      title: "California Economic Nexus Thresholds",
      description: "Understanding California's $500,000 revenue threshold and transaction count requirements for economic nexus determination.",
      resources: ["CA Nexus Guide", "Threshold Calculator", "Registration Process", "Best Practices"]
    },
    nextReview: "2024-12-15",
    escalationNeeded: true
  }
];

// Utility functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'safe': return 'success';
    case 'approaching': return 'warning';
    case 'exceeded': return 'danger';
    case 'critical': return 'danger';
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

const getMonitoringStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'success';
    case 'pending': return 'warning';
    case 'review': return 'primary';
    case 'escalated': return 'danger';
    default: return 'default';
  }
};

export default function StaffAccountantMonitoring() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter clients
  const filteredClients = monitoringClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.monitoringStatus === statusFilter;
    const matchesPriority = priorityFilter === 'all' || client.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Calculate monitoring statistics
  const monitoringStats = {
    totalClients: monitoringClients.length,
    activeMonitoring: monitoringClients.filter(c => c.monitoringStatus === 'active').length,
    urgentAlerts: monitoringClients.reduce((sum, c) => sum + c.alerts.filter(a => a.priority === 'urgent').length, 0),
    escalationNeeded: monitoringClients.filter(c => c.escalationNeeded).length,
    approachingThresholds: monitoringClients.reduce((sum, c) => sum + c.states.filter(s => s.status === 'approaching').length, 0),
    exceededThresholds: monitoringClients.reduce((sum, c) => sum + c.states.filter(s => s.status === 'exceeded').length, 0)
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
              <h2 className="text-2xl font-semibold text-white tracking-tight">Threshold Monitoring</h2>
            </div>
            
            {/* Monitoring Statistics */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-white font-semibold text-sm tracking-tight">Assigned Client Monitoring</h3>
                    <p className="text-gray-400 text-xs font-medium">Supervised Economic Nexus Threshold Tracking</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs font-medium">Active</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{monitoringStats.totalClients}</div>
                    <div className="text-gray-400 text-xs font-medium">Assigned Clients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-500">{monitoringStats.activeMonitoring}</div>
                    <div className="text-gray-400 text-xs font-medium">Active Monitoring</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-500">{monitoringStats.urgentAlerts}</div>
                    <div className="text-gray-400 text-xs font-medium">Urgent Alerts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-500">{monitoringStats.approachingThresholds}</div>
                    <div className="text-gray-400 text-xs font-medium">Approaching</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-500">{monitoringStats.exceededThresholds}</div>
                    <div className="text-gray-400 text-xs font-medium">Exceeded</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-500">{monitoringStats.escalationNeeded}</div>
                    <div className="text-gray-400 text-xs font-medium">Escalation</div>
                  </div>
                </div>
              </div>
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
                        statusFilter === "active" 
                          ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setStatusFilter("active")}
                    >
                      Active
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        statusFilter === "pending" 
                          ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/25' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                      onPress={() => setStatusFilter("pending")}
                    >
                      Pending
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

            {/* Client Monitoring Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredClients.map((client) => (
                <Card 
                  key={client.id} 
                  className={`group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20 cursor-pointer ${
                    client.escalationNeeded ? 'ring-2 ring-red-500/20' : ''
                  }`}
                >
                  <CardBody className="p-6">
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
                        <Chip 
                          color={getMonitoringStatusColor(client.monitoringStatus)}
                          size="sm"
                          variant="flat"
                        >
                          {client.monitoringStatus}
                        </Chip>
                      </div>
                    </div>

                    {/* State Thresholds */}
                    <div className="space-y-3 mb-4">
                      <h5 className="text-white font-medium text-sm">State Thresholds</h5>
                      {client.states.slice(0, 2).map((state, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-white text-sm font-medium">{state.code}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Progress 
                              value={Math.min(state.percentage, 100)}
                              className="w-16"
                              color={getStatusColor(state.status)}
                              size="sm"
                            />
                            <span className="text-white text-sm font-semibold">{state.percentage}%</span>
                          </div>
                          <Chip 
                            color={getStatusColor(state.status)}
                            size="sm"
                            variant="flat"
                          >
                            {state.status}
                          </Chip>
                        </div>
                      ))}
                      {client.states.length > 2 && (
                        <p className="text-gray-400 text-xs font-medium">+{client.states.length - 2} more states</p>
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
                        <Progress 
                          value={client.dataStatus.qualityScore}
                          className="w-16"
                          color={client.dataStatus.qualityScore >= 90 ? 'success' : client.dataStatus.qualityScore >= 80 ? 'warning' : 'danger'}
                          size="sm"
                        />
                        <span className="text-white text-sm font-semibold">{client.dataStatus.qualityScore}%</span>
                      </div>
                    </div>

                    {/* Alerts */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm font-medium">Active Alerts</span>
                        <Badge content={client.alerts.length} color="warning">
                          <span className="text-gray-400 text-xs">Alerts</span>
                        </Badge>
                      </div>
                      {client.alerts.slice(0, 2).map((alert) => (
                        <div key={alert.id} className="flex items-center space-x-2 p-2 bg-white/5 rounded-lg">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-gray-300 text-xs flex-1 line-clamp-1">{alert.message}</span>
                        </div>
                      ))}
                      {client.alerts.length > 2 && (
                        <p className="text-gray-400 text-xs font-medium">+{client.alerts.length - 2} more alerts</p>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400 text-xs">Next Review:</span>
                        <span className="text-white text-xs font-medium">{formatDate(client.nextReview)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {client.escalationNeeded && (
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        )}
                        {client.learningContent && (
                          <Tooltip content="Learning Resources Available">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
