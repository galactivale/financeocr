"use client";
import React, { useState, useMemo } from "react";
import { 
  Card, 
  CardBody, 
  CardHeader,
  Button,
  Chip,
  Input,
  Tabs,
  Tab,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Progress,
  Tooltip,
  Badge,
  Select,
  SelectItem,
  Checkbox,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@nextui-org/react";
import { 
  Search as SearchIcon,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Globe,
  BarChart3,
  Settings,
  Play,
  Pause,
  RotateCcw,
  ExternalLink,
  Activity,
  TrendingUp,
  TrendingDown,
  Wifi,
  WifiOff,
  Zap,
  Shield,
  FileText,
  Calculator,
  BookOpen,
  Code,
  MoreVertical,
  Bell,
  Wrench
} from "lucide-react";

// Integration data structure
interface Integration {
  id: string;
  name: string;
  tenant: string;
  status: "active" | "inactive" | "error" | "syncing" | "maintenance";
  lastSync: string;
  syncFrequency: string;
  errorCount: number;
  performance: number;
  type: "quickbooks" | "avalara" | "regulatory" | "thomson" | "cch" | "custom";
  version: string;
  lastError?: string;
}

// Mock integration data
const integrations: Integration[] = [
  // QuickBooks integrations
  {
    id: "qb-001",
    name: "Main Office - QuickBooks Online",
    tenant: "VaultCPA",
    status: "active",
    lastSync: "2024-11-28T14:30:00Z",
    syncFrequency: "Real-time",
    errorCount: 0,
    performance: 98,
    type: "quickbooks",
    version: "v2.1.3"
  },
  {
    id: "qb-002",
    name: "Branch Office - QuickBooks Desktop",
    tenant: "VaultCPA",
    status: "syncing",
    lastSync: "2024-11-28T14:25:00Z",
    syncFrequency: "Every 15 minutes",
    errorCount: 2,
    performance: 95,
    type: "quickbooks",
    version: "v2.1.2"
  },
  {
    id: "qb-003",
    name: "Client Portal - QuickBooks Online",
    tenant: "VaultCPA",
    status: "error",
    lastSync: "2024-11-28T13:45:00Z",
    syncFrequency: "Real-time",
    errorCount: 5,
    performance: 87,
    type: "quickbooks",
    version: "v2.1.3",
    lastError: "Authentication token expired"
  },
  // Avalara integrations
  {
    id: "ava-001",
    name: "Primary - Avalara AvaTax",
    tenant: "VaultCPA",
    status: "active",
    lastSync: "2024-11-28T14:30:00Z",
    syncFrequency: "Real-time",
    errorCount: 0,
    performance: 99,
    type: "avalara",
    version: "v1.8.2"
  },
  {
    id: "ava-002",
    name: "Backup - Avalara AvaTax",
    tenant: "VaultCPA",
    status: "active",
    lastSync: "2024-11-28T14:28:00Z",
    syncFrequency: "Real-time",
    errorCount: 1,
    performance: 97,
    type: "avalara",
    version: "v1.8.2"
  },
  // Regulatory integrations
  {
    id: "reg-001",
    name: "California Revenue Department API",
    tenant: "VaultCPA",
    status: "active",
    lastSync: "2024-11-28T14:30:00Z",
    syncFrequency: "Daily",
    errorCount: 0,
    performance: 100,
    type: "regulatory",
    version: "v3.0.1"
  },
  {
    id: "reg-002",
    name: "Texas Comptroller API",
    tenant: "VaultCPA",
    status: "maintenance",
    lastSync: "2024-11-28T12:00:00Z",
    syncFrequency: "Daily",
    errorCount: 0,
    performance: 100,
    type: "regulatory",
    version: "v3.0.1"
  },
  // Thomson Reuters integrations
  {
    id: "thom-001",
    name: "Research Portal - Checkpoint",
    tenant: "VaultCPA",
    status: "active",
    lastSync: "2024-11-28T14:30:00Z",
    syncFrequency: "On-demand",
    errorCount: 0,
    performance: 96,
    type: "thomson",
    version: "v4.2.1"
  },
  // CCH integrations
  {
    id: "cch-001",
    name: "Professional Resources - CCH Axcess",
    tenant: "VaultCPA",
    status: "active",
    lastSync: "2024-11-28T14:25:00Z",
    syncFrequency: "On-demand",
    errorCount: 0,
    performance: 94,
    type: "cch",
    version: "v2.5.3"
  },
  // Custom API integrations
  {
    id: "custom-001",
    name: "Internal API - Custom Integration",
    tenant: "VaultCPA",
    status: "inactive",
    lastSync: "2024-11-27T18:00:00Z",
    syncFrequency: "Manual",
    errorCount: 3,
    performance: 82,
    type: "custom",
    version: "v1.0.0"
  }
];

const getStatusColor = (status: Integration["status"]) => {
  switch (status) {
    case "active": return "success";
    case "inactive": return "default";
    case "error": return "danger";
    case "syncing": return "warning";
    case "maintenance": return "secondary";
    default: return "default";
  }
};

const getStatusIcon = (status: Integration["status"]) => {
  switch (status) {
    case "active": return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "inactive": return <Pause className="w-4 h-4 text-gray-500" />;
    case "error": return <AlertTriangle className="w-4 h-4 text-red-500" />;
    case "syncing": return <RefreshCw className="w-4 h-4 text-orange-500 animate-spin" />;
    case "maintenance": return <Settings className="w-4 h-4 text-blue-500" />;
    default: return <Clock className="w-4 h-4 text-gray-500" />;
  }
};

const getTypeIcon = (type: Integration["type"]) => {
  switch (type) {
    case "quickbooks": return <Calculator className="w-5 h-5 text-blue-500" />;
    case "avalara": return <Shield className="w-5 h-5 text-green-500" />;
    case "regulatory": return <Globe className="w-5 h-5 text-purple-500" />;
    case "thomson": return <BookOpen className="w-5 h-5 text-orange-500" />;
    case "cch": return <FileText className="w-5 h-5 text-cyan-500" />;
    case "custom": return <Code className="w-5 h-5 text-pink-500" />;
    default: return <Database className="w-5 h-5 text-gray-500" />;
  }
};

const formatLastSync = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return date.toLocaleDateString();
};

export default function IntegrationsPage() {
  const [selectedTab, setSelectedTab] = useState("quickbooks");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);

  const filteredIntegrations = useMemo(() => {
    return integrations.filter(integration => {
      const matchesTab = integration.type === selectedTab;
      const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           integration.tenant.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || integration.status === statusFilter;
      return matchesTab && matchesSearch && matchesStatus;
    });
  }, [selectedTab, searchTerm, statusFilter]);

  const handleSelectAll = () => {
    if (selectedIntegrations.length === filteredIntegrations.length) {
      setSelectedIntegrations([]);
    } else {
      setSelectedIntegrations(filteredIntegrations.map(i => i.id));
    }
  };

  const handleSelectIntegration = (id: string) => {
    setSelectedIntegrations(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const getTabStats = (type: Integration["type"]) => {
    const typeIntegrations = integrations.filter(i => i.type === type);
    return {
      total: typeIntegrations.length,
      active: typeIntegrations.filter(i => i.status === "active").length,
      errors: typeIntegrations.filter(i => i.status === "error").length,
      avgPerformance: Math.round(
        typeIntegrations.reduce((sum, i) => sum + i.performance, 0) / typeIntegrations.length
      ) || 0
    };
  };

  const quickbooksStats = getTabStats("quickbooks");
  const avalaraStats = getTabStats("avalara");
  const regulatoryStats = getTabStats("regulatory");
  const thomsonStats = getTabStats("thomson");
  const cchStats = getTabStats("cch");
  const customStats = getTabStats("custom");

  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-8">
        {/* Header */}
        <div className="pt-8 pb-6">
          <div className="max-w-7xl mx-auto px-4 lg:px-0">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">System Integrations</h1>
                <p className="text-gray-400 text-sm mt-2">Third-party service management and configuration</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <Badge color="danger" size="sm" className="absolute -top-2 -right-2">
                    3
                  </Badge>
                </div>
                <Button
                  color="primary"
                  variant="flat"
                  startContent={<RefreshCw className="w-4 h-4" />}
                  className="bg-blue-600/20 text-blue-400 border-blue-500/30"
                >
                  Refresh All
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Overview Cards */}
        <div className="max-w-7xl mx-auto px-4 lg:px-0 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl hover:bg-gray-800/50 transition-all duration-300">
              <CardBody className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600/30 rounded-lg">
                    <Calculator className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-xs font-medium uppercase tracking-wide">QuickBooks</p>
                    <p className="text-white font-bold text-lg">{quickbooksStats.total}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl hover:bg-gray-800/50 transition-all duration-300">
              <CardBody className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-600/30 rounded-lg">
                    <Shield className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-xs font-medium uppercase tracking-wide">Avalara</p>
                    <p className="text-white font-bold text-lg">{avalaraStats.total}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl hover:bg-gray-800/50 transition-all duration-300">
              <CardBody className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-600/30 rounded-lg">
                    <Globe className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-xs font-medium uppercase tracking-wide">Regulatory</p>
                    <p className="text-white font-bold text-lg">{regulatoryStats.total}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl hover:bg-gray-800/50 transition-all duration-300">
              <CardBody className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-600/30 rounded-lg">
                    <BookOpen className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-xs font-medium uppercase tracking-wide">Research</p>
                    <p className="text-white font-bold text-lg">{thomsonStats.total + cchStats.total}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 lg:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* Tab Navigation */}
              <Tabs
                selectedKey={selectedTab}
                onSelectionChange={(key) => setSelectedTab(key as string)}
                className="w-full mb-8"
                classNames={{
                  tabList: "bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 shadow-sm rounded-2xl p-1",
                  tab: "text-gray-400 data-[selected=true]:text-white data-[selected=true]:bg-gray-800 data-[selected=true]:shadow-sm rounded-xl",
                  panel: "mt-8"
                }}
            >
              <Tab key="quickbooks" title={
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  <span>QuickBooks</span>
                  <Badge color="primary" size="sm">
                    {quickbooksStats.total}
                  </Badge>
                </div>
              }>
                <div className="space-y-6">
                  {/* Connected Services Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-white">QuickBooks Integrations</h3>
                    </div>

                    {/* Main Office Integration */}
                    <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl hover:bg-gray-800/50 transition-all duration-300">
                      <CardBody className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-600/30 rounded-xl">
                              <Calculator className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                              <h4 className="text-white font-semibold">Main Office - QuickBooks Online</h4>
                              <p className="text-gray-300 text-sm">Accounting Integration</p>
                              <p className="text-gray-400 text-xs mt-1">Last sync: 11/28/2024, 2:30:00 PM</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Chip color="success" variant="flat" size="sm">
                              CONNECTED
                            </Chip>
                            <Button
                              size="sm"
                              variant="flat"
                              color="default"
                              startContent={<Wrench className="w-4 h-4" />}
                              className="bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                            >
                              Manage
                            </Button>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    {/* Branch Office Integration */}
                    <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl hover:bg-gray-800/50 transition-all duration-300">
                      <CardBody className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-600/30 rounded-xl">
                              <Calculator className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                              <h4 className="text-white font-semibold">Branch Office - QuickBooks Desktop</h4>
                              <p className="text-gray-300 text-sm">Desktop Integration</p>
                              <p className="text-gray-400 text-xs mt-1">Last sync: 11/28/2024, 2:25:00 PM</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Chip color="warning" variant="flat" size="sm">
                              SYNCING
                            </Chip>
                            <Button
                              size="sm"
                              variant="flat"
                              color="default"
                              startContent={<Wrench className="w-4 h-4" />}
                              className="bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                            >
                              Manage
                            </Button>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    {/* Client Portal Integration */}
                    <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl hover:bg-gray-800/50 transition-all duration-300">
                      <CardBody className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-600/30 rounded-xl">
                              <Calculator className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                              <h4 className="text-white font-semibold">Client Portal - QuickBooks Online</h4>
                              <p className="text-gray-300 text-sm">Client Integration</p>
                              <p className="text-gray-400 text-xs mt-1">Last sync: 11/28/2024, 1:45:00 PM</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Chip color="danger" variant="flat" size="sm">
                              ERROR
                            </Chip>
                            <Button
                              size="sm"
                              variant="flat"
                              color="default"
                              startContent={<Wrench className="w-4 h-4" />}
                              className="bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                            >
                              Manage
                            </Button>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-red-400 text-sm">Authentication token expired - Click manage to troubleshoot</p>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </div>
              </Tab>

              <Tab key="avalara" title={
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Avalara</span>
                  <Badge color="success" size="sm">
                    {avalaraStats.total}
                  </Badge>
                </div>
              }>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-white">Avalara Tax Services</h3>
                    </div>

                    {/* Primary Avalara Integration */}
                    <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl hover:bg-gray-800/50 transition-all duration-300">
                      <CardBody className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-600/30 rounded-xl">
                              <Shield className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                              <h4 className="text-white font-semibold">Primary - Avalara AvaTax</h4>
                              <p className="text-gray-300 text-sm">Tax Calculation Service</p>
                              <p className="text-gray-400 text-xs mt-1">Last sync: 11/28/2024, 2:30:00 PM</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Chip color="success" variant="flat" size="sm">
                              CONNECTED
                            </Chip>
                            <Button
                              size="sm"
                              variant="flat"
                              color="default"
                              startContent={<Wrench className="w-4 h-4" />}
                              className="bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                            >
                              Manage
                            </Button>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    {/* Backup Avalara Integration */}
                    <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl hover:bg-gray-800/50 transition-all duration-300">
                      <CardBody className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-600/30 rounded-xl">
                              <Shield className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                              <h4 className="text-white font-semibold">Backup - Avalara AvaTax</h4>
                              <p className="text-gray-300 text-sm">Backup Tax Service</p>
                              <p className="text-gray-400 text-xs mt-1">Last sync: 11/28/2024, 2:28:00 PM</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Chip color="success" variant="flat" size="sm">
                              CONNECTED
                            </Chip>
                            <Button
                              size="sm"
                              variant="flat"
                              color="default"
                              startContent={<Wrench className="w-4 h-4" />}
                              className="bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                            >
                              Manage
                            </Button>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </div>
              </Tab>

              <Tab key="regulatory" title={
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>Regulatory</span>
                  <Badge color="secondary" size="sm">
                    {regulatoryStats.total}
                  </Badge>
                </div>
              }>
                <div className="space-y-6">
                  <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-gray-900">State Revenue Department APIs</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                            <span className="text-gray-700 font-medium">Active APIs</span>
                            <span className="text-green-600 font-bold">{regulatoryStats.active}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                            <span className="text-gray-700 font-medium">Coverage</span>
                            <span className="text-blue-600 font-bold">47 States</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                            <span className="text-gray-700 font-medium">Update Frequency</span>
                            <span className="text-purple-600 font-bold">Daily</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                            <span className="text-gray-700 font-medium">Data Freshness</span>
                            <span className="text-orange-600 font-bold">Real-time</span>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Tab>

              <Tab key="thomson" title={
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Thomson Reuters</span>
                  <Badge color="warning" size="sm">
                    {thomsonStats.total}
                  </Badge>
                </div>
              }>
                <div className="space-y-6">
                  <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-gray-900">Thomson Reuters Research Tools</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                            <span className="text-gray-700 font-medium">Checkpoint Connections</span>
                            <span className="text-green-600 font-bold">{thomsonStats.active}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                            <span className="text-gray-700 font-medium">Research Queries</span>
                            <span className="text-blue-600 font-bold">1,247 today</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                            <span className="text-gray-700 font-medium">Response Time</span>
                            <span className="text-purple-600 font-bold">2.3s avg</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                            <span className="text-gray-700 font-medium">Success Rate</span>
                            <span className="text-orange-600 font-bold">99.2%</span>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Tab>

              <Tab key="cch" title={
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>CCH</span>
                  <Badge color="primary" size="sm">
                    {cchStats.total}
                  </Badge>
                </div>
              }>
                <div className="space-y-6">
                  <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-gray-900">CCH Professional Resources</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                            <span className="text-gray-700 font-medium">Axcess Connections</span>
                            <span className="text-green-600 font-bold">{cchStats.active}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                            <span className="text-gray-700 font-medium">Document Access</span>
                            <span className="text-blue-600 font-bold">3,891 today</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                            <span className="text-gray-700 font-medium">Sync Status</span>
                            <span className="text-purple-600 font-bold">Up to date</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                            <span className="text-gray-700 font-medium">Last Update</span>
                            <span className="text-orange-600 font-bold">2h ago</span>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Tab>

              <Tab key="custom" title={
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  <span>Custom APIs</span>
                  <Badge color="default" size="sm">
                    {customStats.total}
                  </Badge>
                </div>
              }>
                <div className="space-y-6">
                  <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-gray-900">Custom API Integrations</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                            <span className="text-gray-700 font-medium">Active APIs</span>
                            <span className="text-green-600 font-bold">{customStats.active}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                            <span className="text-gray-700 font-medium">Total Endpoints</span>
                            <span className="text-blue-600 font-bold">12</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                            <span className="text-gray-700 font-medium">Average Response</span>
                            <span className="text-purple-600 font-bold">1.8s</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                            <span className="text-gray-700 font-medium">Error Rate</span>
                            <span className="text-orange-600 font-bold">2.1%</span>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Tab>
            </Tabs>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* System Health Card */}
              <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl hover:bg-gray-800/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-white">System Health</h3>
                  </div>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div>
                    <p className="text-gray-300 text-sm">Overall Status</p>
                    <p className="text-white font-semibold">Healthy</p>
                    <div className="mt-2">
                      <Chip color="success" variant="flat" size="sm">
                        99.8% Uptime
                      </Chip>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Active Integrations</p>
                    <p className="text-white font-semibold">8/10</p>
                  </div>
                  <Button
                    color="primary"
                    variant="flat"
                    startContent={<Activity className="w-4 h-4" />}
                    className="w-full bg-blue-600/20 text-blue-400 border-blue-500/30 hover:bg-blue-600/30"
                  >
                    View System Logs
                  </Button>
                </CardBody>
              </Card>

              {/* Integration Management Card */}
              <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl hover:bg-gray-800/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-white">Integration Management</h3>
                  </div>
                </CardHeader>
                <CardBody className="space-y-3">
                  <Button
                    variant="flat"
                    color="default"
                    startContent={<RefreshCw className="w-4 h-4" />}
                    className="w-full justify-start bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                  >
                    Test All Connections
                  </Button>
                  <Button
                    variant="flat"
                    color="default"
                    startContent={<Settings className="w-4 h-4" />}
                    className="w-full justify-start bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                  >
                    Configure Settings
                  </Button>
                  <Button
                    variant="flat"
                    color="default"
                    startContent={<FileText className="w-4 h-4" />}
                    className="w-full justify-start bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                  >
                    View Integration Logs
                  </Button>
                </CardBody>
              </Card>

              {/* Performance Metrics Card */}
              <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl hover:bg-gray-800/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-white">Performance Metrics</h3>
                  </div>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div>
                    <p className="text-gray-300 text-sm">Average Response Time</p>
                    <p className="text-white font-semibold">1.2s</p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Success Rate</p>
                    <p className="text-white font-semibold">98.5%</p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Data Sync Frequency</p>
                    <p className="text-white font-semibold">Real-time</p>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
