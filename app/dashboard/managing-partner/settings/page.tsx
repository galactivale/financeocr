"use client";
import React, { useState } from "react";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Button, 
  Chip, 
  Badge, 
  Tabs, 
  Tab, 
  Progress, 
  Avatar, 
  Divider,
  Input,
  Select,
  SelectItem,
  Switch,
  Textarea,
  Tooltip
} from "@nextui-org/react";
import { 
  Building2,
  Bell, 
  Shield,
  Users,
  ChartLine, 
  Puzzle,
  Save,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Settings,
  FileText,
  Database,
  Lock,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Upload,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  ShieldCheck,
  Key,
  Wifi,
  Monitor,
  Smartphone,
  Tablet,
  HardDrive,
  Cpu,
  MemoryStick,
  Server,
  Activity,
  TrendingUp,
  BarChart3,
  PieChart,
  Target,
  Award,
  Star,
  Zap,
  RefreshCw,
  Search,
  Filter,
  MoreVertical
} from "lucide-react";

export default function SettingsPage() {
  const [selectedTab, setSelectedTab] = useState("firm-profile");

  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-8">
        {/* Header */}
        <div className="pt-8 pb-6">
          <div className="max-w-7xl mx-auto px-4 lg:px-0">
            <div className="flex items-center justify-between">
          <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Firm Configuration Command Center</h1>
                <p className="text-gray-400 text-sm mt-2">Strategic firm management and operational configuration for Economic Nexus compliance excellence</p>
            </div>
              <div className="flex items-center gap-4">
                <Button
                  color="primary"
                  variant="flat"
                  startContent={<Save className="w-4 h-4" />}
                  className="bg-blue-600/20 text-blue-400 border-blue-500/30"
                >
                  Save Changes
                </Button>
                <Button
                  color="default"
                  variant="flat"
                  startContent={<Download className="w-4 h-4" />}
                  className="bg-gray-700/50 text-gray-300"
                >
                  Export Config
                </Button>
          </div>
          </div>
          </div>
        </div>

        {/* Firm Status Overview Cards */}
        <div className="max-w-7xl mx-auto px-4 lg:px-0 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl hover:bg-gray-900/50 transition-all duration-300">
              <CardBody className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600/30 rounded-lg">
                    <Building2 className="w-5 h-5 text-blue-400" />
          </div>
                  <div>
                    <p className="text-gray-300 text-xs font-medium uppercase tracking-wide">Firm Status</p>
                    <p className="text-white font-bold text-lg">Active</p>
        </div>
      </div>
        </CardBody>
      </Card>

            <Card className="bg-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl hover:bg-gray-900/50 transition-all duration-300">
              <CardBody className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-600/30 rounded-lg">
                    <ShieldCheck className="w-5 h-5 text-green-400" />
          </div>
                  <div>
                    <p className="text-gray-300 text-xs font-medium uppercase tracking-wide">Compliance</p>
                    <p className="text-white font-bold text-lg">98.5%</p>
            </div>
          </div>
        </CardBody>
      </Card>

            <Card className="bg-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl hover:bg-gray-900/50 transition-all duration-300">
              <CardBody className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-600/30 rounded-lg">
                    <Users className="w-5 h-5 text-purple-400" />
              </div>
                  <div>
                    <p className="text-gray-300 text-xs font-medium uppercase tracking-wide">Active Users</p>
                    <p className="text-white font-bold text-lg">24</p>
            </div>
          </div>
        </CardBody>
      </Card>

            <Card className="bg-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl hover:bg-gray-900/50 transition-all duration-300">
              <CardBody className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-600/30 rounded-lg">
                    <Activity className="w-5 h-5 text-orange-400" />
                  </div>
                <div>
                    <p className="text-gray-300 text-xs font-medium uppercase tracking-wide">System Health</p>
                    <p className="text-white font-bold text-lg">Excellent</p>
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
                  tabList: "bg-black/80 backdrop-blur-xl border border-gray-700/50 shadow-sm rounded-2xl p-1",
                  tab: "text-gray-400 data-[selected=true]:text-white data-[selected=true]:bg-gray-800 data-[selected=true]:shadow-sm rounded-xl",
                  panel: "mt-8"
                }}
              >
                <Tab key="firm-profile" title={
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>Firm Profile</span>
            </div>
                }>
                  <div className="space-y-6">
                    {/* Firm Information */}
            <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                        <h3 className="text-lg font-semibold text-white">Firm Information</h3>
                </div>

                      <Card className="bg-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl">
                        <CardHeader>
                          <h4 className="text-white font-medium">Basic Information</h4>
        </CardHeader>
                        <CardBody className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              label="Firm Name"
                              placeholder="Demo CPA Firm"
                              variant="flat"
                  classNames={{
                                inputWrapper: "bg-gray-800/50 border-gray-600/50",
                                input: "text-white",
                                label: "text-gray-400"
                              }}
                            />
                <Input
                              label="Firm ID"
                              placeholder="DEMO-CPA-2024"
                              variant="flat"
                  classNames={{
                                inputWrapper: "bg-gray-800/50 border-gray-600/50",
                    input: "text-white",
                                label: "text-gray-400"
                  }}
                />
              </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                              label="Primary Contact"
                              placeholder="Michael Thompson"
                              variant="flat"
                  classNames={{
                                inputWrapper: "bg-gray-800/50 border-gray-600/50",
                    input: "text-white",
                                label: "text-gray-400"
                  }}
                />
                <Input
                              label="Phone Number"
                              placeholder="+1 (555) 123-4567"
                              variant="flat"
                  classNames={{
                                inputWrapper: "bg-gray-800/50 border-gray-600/50",
                    input: "text-white",
                                label: "text-gray-400"
                  }}
                />
                          </div>
                <Input
                            label="Email Address"
                            placeholder="contact@democpafirm.com"
                            variant="flat"
                  classNames={{
                              inputWrapper: "bg-gray-800/50 border-gray-600/50",
                    input: "text-white",
                              label: "text-gray-400"
                            }}
                          />
                          <Textarea
                            label="Firm Description"
                            placeholder="Leading Economic Nexus compliance firm specializing in multi-state tax obligations..."
                            variant="flat"
                            classNames={{
                              inputWrapper: "bg-gray-800/50 border-gray-600/50",
                              input: "text-white",
                              label: "text-gray-400"
                            }}
                          />
                        </CardBody>
                      </Card>
              </div>

                    {/* Business Settings */}
            <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                        <h3 className="text-lg font-semibold text-white">Business Settings</h3>
                      </div>

                      <Card className="bg-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl">
                        <CardHeader>
                          <h4 className="text-white font-medium">Operational Configuration</h4>
                        </CardHeader>
                        <CardBody className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                              label="Primary Business Type"
                              placeholder="Select business type"
                              variant="flat"
                  classNames={{
                                trigger: "bg-gray-800/50 border-gray-600/50",
                                value: "text-white",
                                label: "text-gray-400"
                              }}
                            >
                              <SelectItem key="cpa" value="cpa">CPA Firm</SelectItem>
                              <SelectItem key="tax-prep" value="tax-prep">Tax Preparation</SelectItem>
                              <SelectItem key="consulting" value="consulting">Tax Consulting</SelectItem>
                              <SelectItem key="compliance" value="compliance">Compliance Services</SelectItem>
                </Select>
                <Select
                              label="Service Focus"
                              placeholder="Select focus area"
                              variant="flat"
                  classNames={{
                                trigger: "bg-gray-800/50 border-gray-600/50",
                                value: "text-white",
                                label: "text-gray-400"
                              }}
                            >
                              <SelectItem key="nexus" value="nexus">Economic Nexus</SelectItem>
                              <SelectItem key="multi-state" value="multi-state">Multi-State Tax</SelectItem>
                              <SelectItem key="sales-tax" value="sales-tax">Sales Tax</SelectItem>
                              <SelectItem key="general" value="general">General Tax Services</SelectItem>
                </Select>
              </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                              label="Business License"
                              placeholder="BL-2024-001234"
                              variant="flat"
                  classNames={{
                                inputWrapper: "bg-gray-800/50 border-gray-600/50",
                    input: "text-white",
                                label: "text-gray-400"
                  }}
                />
                <Input
                              label="Tax ID"
                              placeholder="12-3456789"
                              variant="flat"
                  classNames={{
                                inputWrapper: "bg-gray-800/50 border-gray-600/50",
                    input: "text-white",
                                label: "text-gray-400"
                              }}
                            />
          </div>
        </CardBody>
      </Card>
    </div>
                  </div>
                </Tab>

                <Tab key="security" title={
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Security & Access</span>
                  </div>
                }>
    <div className="space-y-6">
                    {/* Security Settings */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-red-500 rounded-full"></div>
                        <h3 className="text-lg font-semibold text-white">Security Configuration</h3>
                      </div>

                      <Card className="bg-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl">
                        <CardHeader>
                          <h4 className="text-white font-medium">Authentication & Access Control</h4>
        </CardHeader>
        <CardBody className="space-y-6">
            <div className="space-y-4">
                  <div className="flex items-center justify-between">
                              <div>
                                <h5 className="text-white font-medium">Two-Factor Authentication</h5>
                                <p className="text-gray-400 text-sm">Require 2FA for all user accounts</p>
                  </div>
                              <Switch defaultSelected color="success" />
                  </div>
                  <div className="flex items-center justify-between">
                              <div>
                                <h5 className="text-white font-medium">Session Timeout</h5>
                                <p className="text-gray-400 text-sm">Auto-logout after 30 minutes of inactivity</p>
                  </div>
                              <Switch defaultSelected color="success" />
                  </div>
                  <div className="flex items-center justify-between">
                              <div>
                                <h5 className="text-white font-medium">IP Whitelisting</h5>
                                <p className="text-gray-400 text-sm">Restrict access to approved IP addresses</p>
                  </div>
                              <Switch color="default" />
                  </div>
                  <div className="flex items-center justify-between">
                              <div>
                                <h5 className="text-white font-medium">Audit Logging</h5>
                                <p className="text-gray-400 text-sm">Log all user activities and system changes</p>
                  </div>
                              <Switch defaultSelected color="success" />
                  </div>
          </div>
        </CardBody>
      </Card>
    </div>

                    {/* Password Policy */}
            <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                        <h3 className="text-lg font-semibold text-white">Password Policy</h3>
              </div>

                      <Card className="bg-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl">
                        <CardHeader>
                          <h4 className="text-white font-medium">Password Requirements</h4>
                        </CardHeader>
                        <CardBody className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                              label="Minimum Length"
                              placeholder="12"
                              variant="flat"
                  classNames={{
                                inputWrapper: "bg-gray-800/50 border-gray-600/50",
                    input: "text-white",
                                label: "text-gray-400"
                  }}
                />
                <Input
                              label="Expiration Days"
                              placeholder="90"
                              variant="flat"
                  classNames={{
                                inputWrapper: "bg-gray-800/50 border-gray-600/50",
                    input: "text-white",
                                label: "text-gray-400"
                  }}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                              <span className="text-gray-300">Require uppercase letters</span>
                              <Switch defaultSelected color="success" />
                </div>
                <div className="flex items-center justify-between">
                              <span className="text-gray-300">Require lowercase letters</span>
                  <Switch defaultSelected color="success" />
                </div>
                <div className="flex items-center justify-between">
                              <span className="text-gray-300">Require numbers</span>
                  <Switch defaultSelected color="success" />
                </div>
                <div className="flex items-center justify-between">
                              <span className="text-gray-300">Require special characters</span>
                  <Switch defaultSelected color="success" />
            </div>
          </div>
        </CardBody>
      </Card>
                </div>
              </div>
                </Tab>

                <Tab key="integrations" title={
                  <div className="flex items-center gap-2">
                    <Puzzle className="w-4 h-4" />
                    <span>Integrations</span>
            </div>
                }>
                  <div className="space-y-6">
                    {/* Connected Services */}
            <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                        <h3 className="text-lg font-semibold text-white">Connected Services</h3>
                  </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl">
                          <CardBody className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 bg-green-600/30 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                                <h4 className="text-white font-semibold">QuickBooks Online</h4>
                                <p className="text-gray-400 text-sm">Connected</p>
                  </div>
                  </div>
                            <div className="flex gap-2">
                              <Button size="sm" color="success" variant="flat">
                                Configure
                              </Button>
                              <Button size="sm" variant="flat" color="default">
                                Disconnect
                              </Button>
          </div>
        </CardBody>
      </Card>

                        <Card className="bg-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl">
                          <CardBody className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 bg-blue-600/30 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-blue-400" />
                              </div>
                    <div>
                                <h4 className="text-white font-semibold">Avalara</h4>
                      <p className="text-gray-400 text-sm">Connected</p>
                    </div>
                  </div>
                            <div className="flex gap-2">
                  <Button size="sm" color="primary" variant="flat">
                                Configure
                              </Button>
                              <Button size="sm" variant="flat" color="default">
                                Disconnect
                  </Button>
                </div>
                          </CardBody>
                        </Card>

                        <Card className="bg-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl">
                          <CardBody className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 bg-orange-600/30 rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-orange-400" />
                              </div>
                    <div>
                                <h4 className="text-white font-semibold">Thomson Reuters</h4>
                                <p className="text-gray-400 text-sm">Not Connected</p>
                    </div>
                  </div>
                            <div className="flex gap-2">
                  <Button size="sm" color="primary" variant="flat">
                    Connect
                  </Button>
                </div>
                          </CardBody>
                        </Card>

                        <Card className="bg-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl">
                          <CardBody className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 bg-gray-600/30 rounded-lg">
                                <Plus className="w-5 h-5 text-gray-400" />
              </div>
                    <div>
                                <h4 className="text-white font-semibold">Custom API</h4>
                                <p className="text-gray-400 text-sm">Add Integration</p>
                    </div>
                  </div>
                            <div className="flex gap-2">
                              <Button size="sm" color="default" variant="flat">
                                Add
                  </Button>
                </div>
                          </CardBody>
                        </Card>
                    </div>
                  </div>
                </div>
                </Tab>
              </Tabs>
              </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* System Status Card */}
              <Card className="bg-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl hover:bg-gray-900/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-white">System Status</h3>
            </div>
                </CardHeader>
                <CardBody className="space-y-4">
              <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300 text-sm">All systems operational</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300 text-sm">Database synchronized</span>
                  </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300 text-sm">Backup completed</span>
                </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-400" />
                      <span className="text-gray-300 text-sm">2 pending updates</span>
            </div>
          </div>
        </CardBody>
      </Card>

              {/* Quick Actions Card */}
              <Card className="bg-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl hover:bg-gray-900/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
                  </div>
        </CardHeader>
                <CardBody className="space-y-3">
                  <Button
                    variant="flat"
                    color="default"
                    startContent={<Download className="w-4 h-4" />}
                    className="w-full justify-start bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                  >
                    Export Configuration
                  </Button>
                  <Button
                    variant="flat"
                    color="default"
                    startContent={<Upload className="w-4 h-4" />}
                    className="w-full justify-start bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                  >
                    Import Settings
                  </Button>
                  <Button
                    variant="flat"
                    color="default"
                    startContent={<RefreshCw className="w-4 h-4" />}
                    className="w-full justify-start bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                  >
                    Reset to Defaults
                  </Button>
                  <Button
                    variant="flat"
                    color="default"
                    startContent={<Shield className="w-4 h-4" />}
                    className="w-full justify-start bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                  >
                    Security Audit
                  </Button>
        </CardBody>
      </Card>

              {/* Recent Changes Card */}
              <Card className="bg-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl hover:bg-gray-900/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-white">Recent Changes</h3>
                  </div>
        </CardHeader>
                <CardBody className="space-y-4">
              <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">Password policy updated</span>
                </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">QuickBooks integration configured</span>
                </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">Firm profile updated</span>
                </div>
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