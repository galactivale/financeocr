"use client";
import React, { useState } from "react";
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
  Select,
  SelectItem
} from "@nextui-org/react";
import { 
  SearchIcon,
  AlertTriangle,
  CheckCircle,
  Clock,
  Server,
  Database,
  Globe,
  Shield,
  Activity,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  Settings,
  RefreshCw,
  Download,
  Filter
} from "lucide-react";

// System monitoring data structure
interface SystemAlert {
  id: string;
  type: "infrastructure" | "security" | "performance" | "integration" | "compliance";
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  affectedTenants: string[];
  detectedAt: string;
  status: "active" | "investigating" | "resolved" | "false_positive";
  assignedTo: string;
  resolutionTime?: string;
  impact: {
    usersAffected: number;
    servicesAffected: string[];
    estimatedDowntime: string;
  };
}

interface PerformanceMetric {
  name: string;
  currentValue: number;
  threshold: number;
  unit: string;
  status: "healthy" | "warning" | "critical";
  trend: "up" | "down" | "stable";
  changePercent: number;
}

const systemAlerts: SystemAlert[] = [
  {
    id: "SYS-001",
    type: "infrastructure",
    severity: "critical",
    title: "Database Query Performance Degradation",
    description: "Average query response time has exceeded 2 seconds threshold across multiple tenants",
    affectedTenants: ["Demo CPA Firm", "Thompson & Associates", "Metro Tax Services"],
    detectedAt: "2024-11-28T14:30:00Z",
    status: "investigating",
    assignedTo: "Database Team",
    impact: {
      usersAffected: 127,
      servicesAffected: ["Client Portal", "Reporting Engine", "Data Sync"],
      estimatedDowntime: "15 minutes"
    }
  },
  {
    id: "SYS-002",
    type: "security",
    severity: "high",
    title: "Unusual Authentication Pattern Detected",
    description: "Multiple failed login attempts detected from suspicious IP addresses",
    affectedTenants: ["All Tenants"],
    detectedAt: "2024-11-28T12:15:00Z",
    status: "active",
    assignedTo: "Security Team",
    impact: {
      usersAffected: 0,
      servicesAffected: ["Authentication Service"],
      estimatedDowntime: "None"
    }
  },
  {
    id: "SYS-003",
    type: "integration",
    severity: "medium",
    title: "QuickBooks API Rate Limit Approaching",
    description: "API usage approaching rate limits for QuickBooks integration",
    affectedTenants: ["Demo CPA Firm", "Regional Tax Group"],
    detectedAt: "2024-11-28T10:45:00Z",
    status: "active",
    assignedTo: "Integration Team",
    impact: {
      usersAffected: 45,
      servicesAffected: ["QuickBooks Sync", "Financial Data Import"],
      estimatedDowntime: "5 minutes"
    }
  },
  {
    id: "SYS-004",
    type: "performance",
    severity: "low",
    title: "Memory Usage Optimization Opportunity",
    description: "Application servers showing elevated memory usage patterns",
    affectedTenants: ["All Tenants"],
    detectedAt: "2024-11-28T09:20:00Z",
    status: "resolved",
    assignedTo: "DevOps Team",
    resolutionTime: "2024-11-28T11:30:00Z",
    impact: {
      usersAffected: 0,
      servicesAffected: ["Application Servers"],
      estimatedDowntime: "None"
    }
  }
];

const performanceMetrics: PerformanceMetric[] = [
  {
    name: "API Response Time",
    currentValue: 245,
    threshold: 500,
    unit: "ms",
    status: "healthy",
    trend: "down",
    changePercent: -12.5
  },
  {
    name: "Database Connections",
    currentValue: 78,
    threshold: 100,
    unit: "connections",
    status: "healthy",
    trend: "stable",
    changePercent: 2.1
  },
  {
    name: "Memory Usage",
    currentValue: 85,
    threshold: 90,
    unit: "%",
    status: "warning",
    trend: "up",
    changePercent: 8.3
  },
  {
    name: "CPU Utilization",
    currentValue: 45,
    threshold: 80,
    unit: "%",
    status: "healthy",
    trend: "down",
    changePercent: -5.2
  },
  {
    name: "Disk I/O",
    currentValue: 92,
    threshold: 95,
    unit: "MB/s",
    status: "warning",
    trend: "up",
    changePercent: 15.7
  },
  {
    name: "Network Latency",
    currentValue: 12,
    threshold: 50,
    unit: "ms",
    status: "healthy",
    trend: "stable",
    changePercent: 1.2
  }
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical": return "danger";
    case "high": return "warning";
    case "medium": return "primary";
    case "low": return "default";
    default: return "default";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "danger";
    case "investigating": return "warning";
    case "resolved": return "success";
    case "false_positive": return "default";
    default: return "default";
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "infrastructure": return <Server className="w-4 h-4" />;
    case "security": return <Shield className="w-4 h-4" />;
    case "performance": return <Activity className="w-4 h-4" />;
    case "integration": return <Globe className="w-4 h-4" />;
    case "compliance": return <CheckCircle className="w-4 h-4" />;
    default: return <AlertTriangle className="w-4 h-4" />;
  }
};

export default function SystemMonitoringPage() {
  const [selectedTab, setSelectedTab] = useState("alerts");
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");

  const filteredAlerts = systemAlerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-8">
        {/* Header */}
        <div className="pt-8 pb-6">
          <div className="max-w-7xl mx-auto px-4 lg:px-0">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">System Monitoring Command Center</h1>
                <div className="flex items-center space-x-6 mt-2 text-white/60 text-sm">
                  <span>System Administrator</span>
                  <span>•</span>
                  <span>VaultCPA Platform</span>
                  <span>•</span>
                  <span>Multi-Tenant Infrastructure</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/60">Last System Check</div>
                <div className="text-base font-medium text-white">Nov 28, 2024 15:45 UTC</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center px-4 lg:px-0 mb-8">
          <div className="max-w-7xl mx-auto w-full">
            <Tabs
              selectedKey={selectedTab}
              onSelectionChange={(key) => setSelectedTab(key as string)}
              className="w-full"
              classNames={{
                tabList: "bg-white/5 backdrop-blur-xl border border-white/10 shadow-sm rounded-2xl p-1",
                tab: "text-white/70 data-[selected=true]:text-white data-[selected=true]:bg-white/10 data-[selected=true]:shadow-sm rounded-xl",
                panel: "mt-8"
              }}
            >
            <Tab key="alerts" title="System Alerts">
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex gap-4 items-center">
                  <Input
                    placeholder="Search alerts..."
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                    startContent={<SearchIcon />}
                    className="max-w-xs"
                    classNames={{
                      input: "text-white",
                      inputWrapper: "bg-white/10 border-white/20 hover:border-white/30 focus-within:border-blue-500"
                    }}
                  />
                  <Select
                    placeholder="Filter by severity"
                    selectedKeys={[severityFilter]}
                    onSelectionChange={(keys) => setSeverityFilter(Array.from(keys)[0] as string)}
                    className="max-w-xs"
                    classNames={{
                      trigger: "bg-white/10 border-white/20 hover:border-white/30",
                      value: "text-white",
                      listbox: "bg-black border border-white/20"
                    }}
                  >
                    <SelectItem key="all" value="all" className="text-white hover:bg-white/10">All Severities</SelectItem>
                    <SelectItem key="critical" value="critical" className="text-white hover:bg-white/10">Critical</SelectItem>
                    <SelectItem key="high" value="high" className="text-white hover:bg-white/10">High</SelectItem>
                    <SelectItem key="medium" value="medium" className="text-white hover:bg-white/10">Medium</SelectItem>
                    <SelectItem key="low" value="low" className="text-white hover:bg-white/10">Low</SelectItem>
                  </Select>
                  <Button
                    color="primary"
                    variant="flat"
                    startContent={<RefreshCw className="w-4 h-4" />}
                  >
                    Refresh
                  </Button>
                </div>

                {/* Alerts Table */}
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-sm rounded-2xl">
                  <CardHeader className="pb-4">
                    <h3 className="text-lg font-semibold text-white">Active System Alerts</h3>
                  </CardHeader>
                  <CardBody>
                    <Table aria-label="System alerts table">
                      <TableHeader>
                        <TableColumn>ALERT</TableColumn>
                        <TableColumn>SEVERITY</TableColumn>
                        <TableColumn>STATUS</TableColumn>
                        <TableColumn>AFFECTED TENANTS</TableColumn>
                        <TableColumn>DETECTED</TableColumn>
                        <TableColumn>ASSIGNED TO</TableColumn>
                        <TableColumn>ACTIONS</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {filteredAlerts.map((alert) => (
                          <TableRow key={alert.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-lg">
                                  {getTypeIcon(alert.type)}
                                </div>
                                <div>
                                  <p className="font-medium text-white">{alert.title}</p>
                                  <p className="text-sm text-white/70">{alert.description}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Chip
                                color={getSeverityColor(alert.severity)}
                                variant="flat"
                                size="sm"
                              >
                                {alert.severity.toUpperCase()}
                              </Chip>
                            </TableCell>
                            <TableCell>
                              <Chip
                                color={getStatusColor(alert.status)}
                                variant="flat"
                                size="sm"
                              >
                                {alert.status.replace('_', ' ').toUpperCase()}
                              </Chip>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                {alert.affectedTenants.slice(0, 2).map((tenant, index) => (
                                  <span key={index} className="text-sm text-white/80">{tenant}</span>
                                ))}
                                {alert.affectedTenants.length > 2 && (
                                  <span className="text-xs text-white/50">
                                    +{alert.affectedTenants.length - 2} more
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-white/80">
                                {new Date(alert.detectedAt).toLocaleString()}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-white/80">{alert.assignedTo}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg">
                                  Investigate
                                </Button>
                                <Button size="sm" className="bg-green-600 text-white hover:bg-green-700 rounded-lg">
                                  Resolve
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardBody>
                </Card>
              </div>
            </Tab>

            <Tab key="performance" title="Performance Metrics">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {performanceMetrics.map((metric, index) => (
                    <Card key={index} className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-sm rounded-2xl">
                      <CardBody className="p-6">
                        <div className="flex items-center justify-between w-full mb-4">
                          <h4 className="text-sm font-medium text-white/80">{metric.name}</h4>
                          <div className={`flex items-center gap-1 text-xs font-medium ${
                            metric.trend === 'up' ? 'text-red-400' : 
                            metric.trend === 'down' ? 'text-green-400' : 'text-white/50'
                          }`}>
                            {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                            {Math.abs(metric.changePercent)}%
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-white">
                              {metric.currentValue}
                            </span>
                            <span className="text-sm text-white/60">{metric.unit}</span>
                          </div>
                          <Progress
                            value={(metric.currentValue / metric.threshold) * 100}
                            color={
                              metric.status === 'healthy' ? 'success' :
                              metric.status === 'warning' ? 'warning' : 'danger'
                            }
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs">
                            <span className="text-white/50">Threshold: {metric.threshold}{metric.unit}</span>
                            <span className={`font-medium ${
                              metric.status === 'healthy' ? 'text-green-400' :
                              metric.status === 'warning' ? 'text-orange-400' : 'text-red-400'
                            }`}>
                              {metric.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            </Tab>

            <Tab key="infrastructure" title="Infrastructure Health">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-sm rounded-2xl">
                    <CardHeader className="pb-4">
                      <h3 className="text-lg font-semibold text-white">Server Status</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                          <span className="text-white/80 font-medium">Web Servers</span>
                          <Chip color="success" variant="flat" size="sm" className="bg-green-100 text-green-800">Online</Chip>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                          <span className="text-white/80 font-medium">Database Servers</span>
                          <Chip color="warning" variant="flat" size="sm" className="bg-orange-100 text-orange-800">Degraded</Chip>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                          <span className="text-white/80 font-medium">Load Balancers</span>
                          <Chip color="success" variant="flat" size="sm" className="bg-green-100 text-green-800">Online</Chip>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                          <span className="text-white/80 font-medium">Cache Servers</span>
                          <Chip color="success" variant="flat" size="sm" className="bg-green-100 text-green-800">Online</Chip>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-sm rounded-2xl">
                    <CardHeader className="pb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Service Dependencies</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                          <span className="text-white/80 font-medium">QuickBooks API</span>
                          <Chip color="warning" variant="flat" size="sm" className="bg-orange-100 text-orange-800">Rate Limited</Chip>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                          <span className="text-white/80 font-medium">Thomson Reuters</span>
                          <Chip color="success" variant="flat" size="sm" className="bg-green-100 text-green-800">Online</Chip>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                          <span className="text-white/80 font-medium">State Revenue APIs</span>
                          <Chip color="success" variant="flat" size="sm" className="bg-green-100 text-green-800">Online</Chip>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                          <span className="text-white/80 font-medium">Email Service</span>
                          <Chip color="success" variant="flat" size="sm" className="bg-green-100 text-green-800">Online</Chip>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
      </div>
    </div>
  );
}
