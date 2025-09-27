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
  MoreVertical
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="h-full lg:px-8">
        {/* Header */}
        <div className="pt-8 pb-6">
          <div className="max-w-7xl mx-auto px-4 lg:px-0">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Integrations</h1>
                <div className="flex items-center space-x-6 mt-2 text-gray-600 text-sm">
                  <span>System Administrator</span>
                  <span>•</span>
                  <span>VaultCPA Platform</span>
                  <span>•</span>
                  <span>Third-Party Service Management</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Last System Check</div>
                <div className="text-base font-medium text-gray-900">Nov 28, 2024 15:45 UTC</div>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Overview Cards */}
        <div className="max-w-7xl mx-auto px-4 lg:px-0 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="w-full bg-white/80 backdrop-blur-xl border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Calculator className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500 tracking-wide">QuickBooks</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{quickbooksStats.total}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className="text-sm font-medium text-green-600">{quickbooksStats.active} active</span>
                  </div>
                  {quickbooksStats.errors > 0 && (
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-red-500" />
                      <span className="text-sm font-medium text-red-600">{quickbooksStats.errors} errors</span>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>

            <Card className="w-full bg-white/80 backdrop-blur-xl border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500 tracking-wide">Avalara</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{avalaraStats.total}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className="text-sm font-medium text-green-600">{avalaraStats.active} active</span>
                  </div>
                  {avalaraStats.errors > 0 && (
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-red-500" />
                      <span className="text-sm font-medium text-red-600">{avalaraStats.errors} errors</span>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>

            <Card className="w-full bg-white/80 backdrop-blur-xl border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Globe className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500 tracking-wide">Regulatory</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{regulatoryStats.total}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className="text-sm font-medium text-green-600">{regulatoryStats.active} active</span>
                  </div>
                  {regulatoryStats.errors > 0 && (
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-red-500" />
                      <span className="text-sm font-medium text-red-600">{regulatoryStats.errors} errors</span>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
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
                tabList: "bg-white/80 backdrop-blur-xl border-0 shadow-sm rounded-2xl p-1",
                tab: "text-gray-600 data-[selected=true]:text-blue-600 data-[selected=true]:bg-white data-[selected=true]:shadow-sm rounded-xl",
                panel: "mt-8"
              }}
            >
              <Tab key="quickbooks" title={
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  <span>QuickBooks</span>
                  <Badge content={quickbooksStats.total} color="primary" size="sm" />
                </div>
              }>
                <div className="space-y-6">
                  {/* Filters and Search */}
                  <div className="flex gap-4 items-center flex-wrap">
                    <Input
                      placeholder="Search QuickBooks integrations..."
                      value={searchTerm}
                      onValueChange={setSearchTerm}
                      startContent={<SearchIcon className="w-4 h-4 text-gray-400" />}
                      className="max-w-xs"
                    />
                    <Select
                      placeholder="Filter by status"
                      selectedKeys={[statusFilter]}
                      onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as string)}
                      className="max-w-xs"
                    >
                      <SelectItem key="all" value="all">All Statuses</SelectItem>
                      <SelectItem key="active" value="active">Active</SelectItem>
                      <SelectItem key="error" value="error">Error</SelectItem>
                      <SelectItem key="syncing" value="syncing">Syncing</SelectItem>
                      <SelectItem key="inactive" value="inactive">Inactive</SelectItem>
                    </Select>
                    <Button
                      color="primary"
                      variant="flat"
                      startContent={<RefreshCw className="w-4 h-4" />}
                    >
                      Refresh All
                    </Button>
                  </div>

                  {/* Bulk Actions */}
                  {selectedIntegrations.length > 0 && (
                    <Card className="bg-blue-50 border border-blue-200">
                      <CardBody className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-700 font-medium">
                            {selectedIntegrations.length} integration(s) selected
                          </span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="flat" color="primary" startContent={<Play className="w-4 h-4" />}>
                              Test Connections
                            </Button>
                            <Button size="sm" variant="flat" color="secondary" startContent={<RotateCcw className="w-4 h-4" />}>
                              Restart Sync
                            </Button>
                            <Button size="sm" variant="flat" color="warning" startContent={<Settings className="w-4 h-4" />}>
                              Update Config
                            </Button>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  )}

                  {/* Integrations Table */}
                  <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
                    <CardHeader className="pb-4">
                      <h3 className="text-lg font-semibold text-gray-900">QuickBooks Integrations ({filteredIntegrations.length})</h3>
                    </CardHeader>
                    <CardBody>
                      <Table aria-label="QuickBooks integrations table">
                        <TableHeader>
                          <TableColumn>
                            <Checkbox
                              isSelected={selectedIntegrations.length === filteredIntegrations.length && filteredIntegrations.length > 0}
                              isIndeterminate={selectedIntegrations.length > 0 && selectedIntegrations.length < filteredIntegrations.length}
                              onValueChange={handleSelectAll}
                            />
                          </TableColumn>
                          <TableColumn>INTEGRATION</TableColumn>
                          <TableColumn>TENANT</TableColumn>
                          <TableColumn>STATUS</TableColumn>
                          <TableColumn>LAST SYNC</TableColumn>
                          <TableColumn>PERFORMANCE</TableColumn>
                          <TableColumn>ACTIONS</TableColumn>
                        </TableHeader>
                        <TableBody>
                          {filteredIntegrations.map((integration) => (
                            <TableRow key={integration.id}>
                              <TableCell>
                                <Checkbox
                                  isSelected={selectedIntegrations.includes(integration.id)}
                                  onValueChange={() => handleSelectIntegration(integration.id)}
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  {getTypeIcon(integration.type)}
                                  <div>
                                    <p className="font-medium text-gray-900 text-sm">{integration.name}</p>
                                    <p className="text-xs text-gray-500">v{integration.version}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="text-gray-700 text-sm">{integration.tenant}</span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(integration.status)}
                                  <Chip
                                    color={getStatusColor(integration.status)}
                                    variant="flat"
                                    size="sm"
                                  >
                                    {integration.status}
                                  </Chip>
                                  {integration.errorCount > 0 && (
                                    <Badge content={integration.errorCount} color="danger" size="sm" />
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <span className="text-gray-700 text-sm">{formatLastSync(integration.lastSync)}</span>
                                  <p className="text-xs text-gray-500">{integration.syncFrequency}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Progress
                                    value={integration.performance}
                                    className="max-w-20"
                                    color={integration.performance > 95 ? "success" : integration.performance > 85 ? "warning" : "danger"}
                                    size="sm"
                                  />
                                  <span className="text-gray-700 text-sm">{integration.performance}%</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Tooltip content="Test Connection">
                                    <Button size="sm" variant="flat" color="primary" isIconOnly>
                                      <Play className="w-4 h-4" />
                                    </Button>
                                  </Tooltip>
                                  <Tooltip content="View Details">
                                    <Button size="sm" variant="flat" color="secondary" isIconOnly>
                                      <ExternalLink className="w-4 h-4" />
                                    </Button>
                                  </Tooltip>
                                  <Dropdown>
                                    <DropdownTrigger>
                                      <Button size="sm" variant="flat" color="default" isIconOnly>
                                        <MoreVertical className="w-4 h-4" />
                                      </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu>
                                      <DropdownItem key="reconnect">
                                        <RotateCcw className="w-4 h-4" />
                                        Reconnect
                                      </DropdownItem>
                                      <DropdownItem key="configure">
                                        <Settings className="w-4 h-4" />
                                        Configure
                                      </DropdownItem>
                                      <DropdownItem key="logs">
                                        <FileText className="w-4 h-4" />
                                        View Logs
                                      </DropdownItem>
                                      <DropdownItem key="disable">
                                        <Pause className="w-4 h-4" />
                                        Disable
                                      </DropdownItem>
                                    </DropdownMenu>
                                  </Dropdown>
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

              <Tab key="avalara" title={
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Avalara</span>
                  <Badge content={avalaraStats.total} color="success" size="sm" />
                </div>
              }>
                <div className="space-y-6">
                  <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-gray-900">Avalara Tax Calculation Services</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                            <span className="text-gray-700 font-medium">Active Connections</span>
                            <span className="text-green-600 font-bold">{avalaraStats.active}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                            <span className="text-gray-700 font-medium">Average Performance</span>
                            <span className="text-blue-600 font-bold">{avalaraStats.avgPerformance}%</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                            <span className="text-gray-700 font-medium">Total Integrations</span>
                            <span className="text-purple-600 font-bold">{avalaraStats.total}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                            <span className="text-gray-700 font-medium">Error Rate</span>
                            <span className="text-orange-600 font-bold">
                              {avalaraStats.total > 0 ? Math.round((avalaraStats.errors / avalaraStats.total) * 100) : 0}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Tab>

              <Tab key="regulatory" title={
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>Regulatory</span>
                  <Badge content={regulatoryStats.total} color="secondary" size="sm" />
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
                  <Badge content={thomsonStats.total} color="warning" size="sm" />
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
                  <Badge content={cchStats.total} color="primary" size="sm" />
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
                  <Badge content={customStats.total} color="default" size="sm" />
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
        </div>
      </div>
    </div>
  );
}
