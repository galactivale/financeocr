"use client";
import React, { useState } from "react";
import { Button, Tabs, Tab, Input, Textarea, Switch, Select, SelectItem, Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { 
  BuildingOffice2, 
  Bell, 
  ShieldAlert, 
  UserGroup, 
  ChartLine, 
  PuzzlePiece,
  Save,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Settings,
  FileText,
  Database,
  Lock,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Upload
} from "lucide-react";

export default function SettingsPage() {
  const [selectedTab, setSelectedTab] = useState("firm-profile");

  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-6 px-4 lg:px-0 mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-white tracking-tight">Firm Configuration Command Center</h1>
            <div className="flex items-center space-x-6 mt-2 text-gray-400 text-sm">
              <span>Michael Thompson, Managing Partner CPA</span>
              <span>•</span>
              <span>Demo CPA Firm</span>
              <span>•</span>
              <span>Administrative Control Interface</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-gray-400 text-sm">Last Configuration Update</div>
            <div className="text-white font-medium">Nov 28, 2024</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center px-4 lg:px-0 mb-8">
          <div className="w-full max-w-[90rem]">
            <Tabs
              selectedKey={selectedTab}
              onSelectionChange={(key) => setSelectedTab(key as string)}
              className="w-full"
              classNames={{
                tabList: "bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-1",
                tab: "text-gray-400 hover:text-white data-[selected=true]:text-white data-[selected=true]:bg-white/10",
                tabContent: "text-sm font-medium",
                cursor: "bg-white/10 rounded-xl"
              }}
            >
              <Tab key="firm-profile" title="Firm Profile" />
              <Tab key="alert-configuration" title="Alert Configuration" />
              <Tab key="liability-settings" title="Liability Settings" />
              <Tab key="team-management" title="Team Management" />
              <Tab key="roi-tracking" title="ROI Tracking" />
              <Tab key="integration-settings" title="Integration Settings" />
            </Tabs>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex justify-center px-4 lg:px-0">
          <div className="w-full max-w-[90rem]">
            {selectedTab === "firm-profile" && <FirmProfileTab />}
            {selectedTab === "alert-configuration" && <AlertConfigurationTab />}
            {selectedTab === "liability-settings" && <LiabilitySettingsTab />}
            {selectedTab === "team-management" && <TeamManagementTab />}
            {selectedTab === "roi-tracking" && <ROITrackingTab />}
            {selectedTab === "integration-settings" && <IntegrationSettingsTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Firm Profile Tab Component
function FirmProfileTab() {
  return (
    <div className="space-y-6">
      {/* Company Information Panel */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
        <CardHeader className="flex items-center space-x-3">
          <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Company Information</h2>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Legal Business Name"
              placeholder="Demo CPA Firm LLC"
              variant="bordered"
              classNames={{
                input: "text-white",
                inputWrapper: "bg-white/5 border-white/20 hover:border-white/30"
              }}
            />
            <Input
              label="Business Structure"
              placeholder="Limited Liability Company"
              variant="bordered"
              classNames={{
                input: "text-white",
                inputWrapper: "bg-white/5 border-white/20 hover:border-white/30"
              }}
            />
            <Input
              label="Federal EIN"
              placeholder="12-3456789"
              variant="bordered"
              classNames={{
                input: "text-white",
                inputWrapper: "bg-white/5 border-white/20 hover:border-white/30"
              }}
            />
            <Input
              label="Primary Contact Email"
              placeholder="admin@democpafirm.com"
              variant="bordered"
              classNames={{
                input: "text-white",
                inputWrapper: "bg-white/5 border-white/20 hover:border-white/30"
              }}
            />
          </div>
          <Textarea
            label="Business Address"
            placeholder="123 Professional Plaza, Suite 200, Business City, ST 12345"
            variant="bordered"
            classNames={{
              input: "text-white",
              inputWrapper: "bg-white/5 border-white/20 hover:border-white/30"
            }}
          />
        </CardBody>
      </Card>

      {/* Professional Licensing Management */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
        <CardHeader className="flex items-center space-x-3">
          <div className="w-1 h-8 bg-green-500 rounded-full"></div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Professional Licensing Management</h2>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Primary CPA License Number"
              placeholder="CPA-12345"
              variant="bordered"
              classNames={{
                input: "text-white",
                inputWrapper: "bg-white/5 border-white/20 hover:border-white/30"
              }}
            />
            <Input
              label="License Renewal Date"
              placeholder="12/31/2025"
              variant="bordered"
              classNames={{
                input: "text-white",
                inputWrapper: "bg-white/5 border-white/20 hover:border-white/30"
              }}
            />
            <Input
              label="Continuing Education Hours Required"
              placeholder="40"
              variant="bordered"
              classNames={{
                input: "text-white",
                inputWrapper: "bg-white/5 border-white/20 hover:border-white/30"
              }}
            />
            <Input
              label="Hours Completed This Period"
              placeholder="32"
              variant="bordered"
              classNames={{
                input: "text-white",
                inputWrapper: "bg-white/5 border-white/20 hover:border-white/30"
              }}
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-medium">Compliance Status: Current</span>
            </div>
            <Button size="sm" color="success" variant="flat">
              View All Licenses
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Branding Configuration */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
        <CardHeader className="flex items-center space-x-3">
          <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Branding Configuration</h2>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="text-white font-medium">Firm Logo</label>
              <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Upload firm logo (PNG, JPG, SVG)</p>
                <Button size="sm" className="mt-2" variant="flat">
                  Choose File
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-white font-medium">Color Scheme</label>
              <Select
                placeholder="Select primary color"
                variant="bordered"
                classNames={{
                  trigger: "bg-white/5 border-white/20 hover:border-white/30",
                  value: "text-white"
                }}
              >
                <SelectItem key="blue" value="blue">Professional Blue</SelectItem>
                <SelectItem key="green" value="green">Trust Green</SelectItem>
                <SelectItem key="purple" value="purple">Premium Purple</SelectItem>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="flat" color="default">
              Reset to Default
            </Button>
            <Button color="primary" startContent={<Save className="w-4 h-4" />}>
              Save Changes
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// Alert Configuration Tab Component
function AlertConfigurationTab() {
  return (
    <div className="space-y-6">
      {/* Critical Alert Categories */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
        <CardHeader className="flex items-center space-x-3">
          <div className="w-1 h-8 bg-red-500 rounded-full"></div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Critical Alert Categories</h2>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <div>
                  <h3 className="text-white font-semibold">Critical Nexus Alerts</h3>
                  <p className="text-gray-400 text-sm">Immediate partner attention required</p>
                </div>
                <Switch defaultSelected color="danger" />
              </div>
              <div className="flex items-center space-x-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <Clock className="w-5 h-5 text-yellow-400" />
                <div>
                  <h3 className="text-white font-semibold">Registration Deadlines</h3>
                  <p className="text-gray-400 text-sm">Systematic compliance monitoring</p>
                </div>
                <Switch defaultSelected color="warning" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <FileText className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="text-white font-semibold">Regulatory Updates</h3>
                  <p className="text-gray-400 text-sm">Proactive knowledge management</p>
                </div>
                <Switch defaultSelected color="primary" />
              </div>
              <div className="flex items-center space-x-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                <ShieldAlert className="w-5 h-5 text-orange-400" />
                <div>
                  <h3 className="text-white font-semibold">Professional Liability Warnings</h3>
                  <p className="text-gray-400 text-sm">Malpractice prevention protocols</p>
                </div>
                <Switch defaultSelected color="warning" />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Escalation Protocol Management */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
        <CardHeader className="flex items-center space-x-3">
          <div className="w-1 h-8 bg-yellow-500 rounded-full"></div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Escalation Protocol Management</h2>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <h3 className="text-white font-semibold mb-3">Critical Alert Routing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="Primary Escalation"
                  placeholder="Managing Partner"
                  variant="bordered"
                  classNames={{
                    trigger: "bg-white/5 border-white/20 hover:border-white/30",
                    value: "text-white"
                  }}
                >
                  <SelectItem key="managing-partner" value="managing-partner">Managing Partner</SelectItem>
                  <SelectItem key="senior-partner" value="senior-partner">Senior Partner</SelectItem>
                  <SelectItem key="tax-manager" value="tax-manager">Tax Manager</SelectItem>
                </Select>
                <Select
                  label="Secondary Escalation"
                  placeholder="Tax Manager"
                  variant="bordered"
                  classNames={{
                    trigger: "bg-white/5 border-white/20 hover:border-white/30",
                    value: "text-white"
                  }}
                >
                  <SelectItem key="tax-manager" value="tax-manager">Tax Manager</SelectItem>
                  <SelectItem key="senior-accountant" value="senior-accountant">Senior Accountant</SelectItem>
                </Select>
                <Input
                  label="Escalation Time (minutes)"
                  placeholder="15"
                  variant="bordered"
                  classNames={{
                    input: "text-white",
                    inputWrapper: "bg-white/5 border-white/20 hover:border-white/30"
                  }}
                />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Communication Channel Configuration */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
        <CardHeader className="flex items-center space-x-3">
          <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Communication Channel Configuration</h2>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Email Notifications</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Critical Alerts</span>
                  <Switch defaultSelected color="primary" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Daily Summaries</span>
                  <Switch defaultSelected color="primary" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Weekly Reports</span>
                  <Switch color="primary" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-semibold">SMS Alerts</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Emergency Only</span>
                  <Switch defaultSelected color="danger" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Deadline Reminders</span>
                  <Switch color="warning" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Dashboard Alerts</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Real-time Updates</span>
                  <Switch defaultSelected color="success" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Visual Indicators</span>
                  <Switch defaultSelected color="success" />
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// Liability Settings Tab Component
function LiabilitySettingsTab() {
  return (
    <div className="space-y-6">
      {/* Documentation Standards Configuration */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
        <CardHeader className="flex items-center space-x-3">
          <div className="w-1 h-8 bg-orange-500 rounded-full"></div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Documentation Standards Configuration</h2>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Audit Trail Requirements</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Complete Decision Documentation</span>
                  <Switch defaultSelected color="warning" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Peer Review Requirements</span>
                  <Switch defaultSelected color="warning" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Professional Reasoning Documentation</span>
                  <Switch defaultSelected color="warning" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Client Communication Logging</span>
                  <Switch defaultSelected color="warning" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Quality Assurance Protocols</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Automated Compliance Checks</span>
                  <Switch defaultSelected color="success" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Manual Review Triggers</span>
                  <Switch defaultSelected color="warning" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Document Retention Policies</span>
                  <Switch defaultSelected color="primary" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Backup and Recovery</span>
                  <Switch defaultSelected color="success" />
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Decision Approval Thresholds */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
        <CardHeader className="flex items-center space-x-3">
          <div className="w-1 h-8 bg-red-500 rounded-full"></div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Decision Approval Thresholds</h2>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Penalty Exposure Thresholds</h3>
              <div className="space-y-3">
                <Input
                  label="Low Risk Threshold"
                  placeholder="$5,000"
                  variant="bordered"
                  classNames={{
                    input: "text-white",
                    inputWrapper: "bg-white/5 border-white/20 hover:border-white/30"
                  }}
                />
                <Input
                  label="Medium Risk Threshold"
                  placeholder="$25,000"
                  variant="bordered"
                  classNames={{
                    input: "text-white",
                    inputWrapper: "bg-white/5 border-white/20 hover:border-white/30"
                  }}
                />
                <Input
                  label="High Risk Threshold"
                  placeholder="$100,000"
                  variant="bordered"
                  classNames={{
                    input: "text-white",
                    inputWrapper: "bg-white/5 border-white/20 hover:border-white/30"
                  }}
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Client Risk Levels</h3>
              <div className="space-y-3">
                <Select
                  label="Low Risk Client Criteria"
                  placeholder="Select criteria"
                  variant="bordered"
                  classNames={{
                    trigger: "bg-white/5 border-white/20 hover:border-white/30",
                    value: "text-white"
                  }}
                >
                  <SelectItem key="established" value="established">Established Business (&gt;5 years)</SelectItem>
                  <SelectItem key="simple" value="simple">Simple Business Structure</SelectItem>
                  <SelectItem key="compliant" value="compliant">Historical Compliance</SelectItem>
                </Select>
                <Select
                  label="High Risk Client Criteria"
                  placeholder="Select criteria"
                  variant="bordered"
                  classNames={{
                    trigger: "bg-white/5 border-white/20 hover:border-white/30",
                    value: "text-white"
                  }}
                >
                  <SelectItem key="new" value="new">New Business (&lt;2 years)</SelectItem>
                  <SelectItem key="complex" value="complex">Complex Structure</SelectItem>
                  <SelectItem key="noncompliant" value="noncompliant">History of Non-compliance</SelectItem>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Professional Decision Complexity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Multi-State Nexus Issues</span>
                  <Switch defaultSelected color="danger" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Regulatory Ambiguity</span>
                  <Switch defaultSelected color="warning" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Client Disagreement</span>
                  <Switch defaultSelected color="warning" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Legal Precedent Changes</span>
                  <Switch defaultSelected color="danger" />
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Professional Standards Compliance */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
        <CardHeader className="flex items-center space-x-3">
          <div className="w-1 h-8 bg-green-500 rounded-full"></div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Professional Standards Compliance</h2>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-white font-semibold">AICPA Standards Alignment</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <span className="text-green-400 font-medium">Professional Competence</span>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <span className="text-green-400 font-medium">Due Professional Care</span>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <span className="text-green-400 font-medium">Planning and Supervision</span>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <span className="text-green-400 font-medium">Sufficient Evidence</span>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-semibold">State Board Requirements</h3>
              <div className="space-y-3">
                <Input
                  label="Continuing Education Hours Required"
                  placeholder="40"
                  variant="bordered"
                  classNames={{
                    input: "text-white",
                    inputWrapper: "bg-white/5 border-white/20 hover:border-white/30"
                  }}
                />
                <Input
                  label="Ethics Hours Required"
                  placeholder="4"
                  variant="bordered"
                  classNames={{
                    input: "text-white",
                    inputWrapper: "bg-white/5 border-white/20 hover:border-white/30"
                  }}
                />
                <Input
                  label="License Renewal Period"
                  placeholder="2 years"
                  variant="bordered"
                  classNames={{
                    input: "text-white",
                    inputWrapper: "bg-white/5 border-white/20 hover:border-white/30"
                  }}
                />
                <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <span className="text-blue-400 font-medium">Quality Assurance Review</span>
                  <Button size="sm" color="primary" variant="flat">
                    Schedule Review
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// Team Management Tab Component
function TeamManagementTab() {
  return (
    <div className="space-y-6">
      {/* User Role Management */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
        <CardHeader className="flex items-center space-x-3">
          <div className="w-1 h-8 bg-green-500 rounded-full"></div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">User Role Management</h2>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Managing Partner</h3>
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Full System Access</span>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Client Management</span>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Risk Management</span>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Team Administration</span>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Tax Manager</h3>
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Nexus Monitoring</span>
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Client Management</span>
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Report Generation</span>
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Staff Oversight</span>
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Staff Accountant</h3>
              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Data Entry</span>
                    <CheckCircle className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Document Preparation</span>
                    <CheckCircle className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Client Support</span>
                    <CheckCircle className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Task Management</span>
                    <CheckCircle className="w-4 h-4 text-purple-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button color="primary" startContent={<Plus className="w-4 h-4" />}>
              Add New User
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// ROI Tracking Tab Component
function ROITrackingTab() {
  return (
    <div className="space-y-6">
      {/* Value Metric Configuration */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
        <CardHeader className="flex items-center space-x-3">
          <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Value Metric Configuration</h2>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Penalty Prevention Quantification</h3>
              <div className="space-y-3">
                <Input
                  label="Average Penalty Avoided per Client"
                  placeholder="$15,000"
                  variant="bordered"
                  classNames={{
                    input: "text-white",
                    inputWrapper: "bg-white/5 border-white/20 hover:border-white/30"
                  }}
                />
                <Input
                  label="Total Penalties Prevented (Annual)"
                  placeholder="$450,000"
                  variant="bordered"
                  classNames={{
                    input: "text-white",
                    inputWrapper: "bg-white/5 border-white/20 hover:border-white/30"
                  }}
                />
                <Input
                  label="Compliance Rate Improvement"
                  placeholder="95%"
                  variant="bordered"
                  classNames={{
                    input: "text-white",
                    inputWrapper: "bg-white/5 border-white/20 hover:border-white/30"
                  }}
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Professional Liability Protection</h3>
              <div className="space-y-3">
                <Input
                  label="Malpractice Claims Prevented"
                  placeholder="3"
                  variant="bordered"
                  classNames={{
                    input: "text-white",
                    inputWrapper: "bg-white/5 border-white/20 hover:border-white/30"
                  }}
                />
                <Input
                  label="Average Claim Value Avoided"
                  placeholder="$250,000"
                  variant="bordered"
                  classNames={{
                    input: "text-white",
                    inputWrapper: "bg-white/5 border-white/20 hover:border-white/30"
                  }}
                />
                <Input
                  label="Insurance Premium Reduction"
                  placeholder="15%"
                  variant="bordered"
                  classNames={{
                    input: "text-white",
                    inputWrapper: "bg-white/5 border-white/20 hover:border-white/30"
                  }}
                />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Reporting Schedule Management */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
        <CardHeader className="flex items-center space-x-3">
          <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Reporting Schedule Management</h2>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Executive Reports</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Monthly ROI Summary</span>
                  <Switch defaultSelected color="primary" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Quarterly Value Analysis</span>
                  <Switch defaultSelected color="primary" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Annual Performance Review</span>
                  <Switch defaultSelected color="primary" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Board Presentation Materials</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Strategic Value Dashboard</span>
                  <Switch defaultSelected color="success" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Risk Mitigation Reports</span>
                  <Switch defaultSelected color="success" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Investment Justification</span>
                  <Switch defaultSelected color="success" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Stakeholder Communication</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Client Value Reports</span>
                  <Switch defaultSelected color="warning" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Team Performance Updates</span>
                  <Switch defaultSelected color="warning" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Compliance Achievement</span>
                  <Switch defaultSelected color="warning" />
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Benchmark Comparison Settings */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
        <CardHeader className="flex items-center space-x-3">
          <div className="w-1 h-8 bg-green-500 rounded-full"></div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Benchmark Comparison Settings</h2>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Peer Firm Comparison</h3>
              <div className="space-y-3">
                <Select
                  label="Firm Size Category"
                  placeholder="Select category"
                  variant="bordered"
                  classNames={{
                    trigger: "bg-white/5 border-white/20 hover:border-white/30",
                    value: "text-white"
                  }}
                >
                  <SelectItem key="small" value="small">Small Firm (1-10 employees)</SelectItem>
                  <SelectItem key="medium" value="medium">Medium Firm (11-50 employees)</SelectItem>
                  <SelectItem key="large" value="large">Large Firm (50+ employees)</SelectItem>
                </Select>
                <Select
                  label="Geographic Region"
                  placeholder="Select region"
                  variant="bordered"
                  classNames={{
                    trigger: "bg-white/5 border-white/20 hover:border-white/30",
                    value: "text-white"
                  }}
                >
                  <SelectItem key="northeast" value="northeast">Northeast</SelectItem>
                  <SelectItem key="southeast" value="southeast">Southeast</SelectItem>
                  <SelectItem key="midwest" value="midwest">Midwest</SelectItem>
                  <SelectItem key="west" value="west">West</SelectItem>
                </Select>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Anonymous Benchmarking</span>
                  <Switch defaultSelected color="success" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Market Standard Assessment</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div>
                    <span className="text-green-400 font-medium">Industry Average ROI</span>
                    <p className="text-gray-400 text-sm">285%</p>
                  </div>
                  <div className="text-right">
                    <span className="text-green-400 font-bold">320%</span>
                    <p className="text-gray-400 text-xs">Your ROI</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div>
                    <span className="text-blue-400 font-medium">Compliance Rate</span>
                    <p className="text-gray-400 text-sm">Industry: 87%</p>
                  </div>
                  <div className="text-right">
                    <span className="text-blue-400 font-bold">95%</span>
                    <p className="text-gray-400 text-xs">Your Rate</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div>
                    <span className="text-purple-400 font-medium">Client Retention</span>
                    <p className="text-gray-400 text-sm">Industry: 78%</p>
                  </div>
                  <div className="text-right">
                    <span className="text-purple-400 font-bold">92%</span>
                    <p className="text-gray-400 text-xs">Your Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// Integration Settings Tab Component
function IntegrationSettingsTab() {
  return (
    <div className="space-y-6">
      {/* Professional Software Integration */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
        <CardHeader className="flex items-center space-x-3">
          <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Professional Software Integration</h2>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Accounting Systems</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Database className="w-5 h-5 text-green-400" />
                    <div>
                      <span className="text-green-400 font-medium">QuickBooks Online</span>
                      <p className="text-gray-400 text-sm">Connected</p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Database className="w-5 h-5 text-blue-400" />
                    <div>
                      <span className="text-blue-400 font-medium">Sage Intacct</span>
                      <p className="text-gray-400 text-sm">Available</p>
                    </div>
                  </div>
                  <Button size="sm" color="primary" variant="flat">
                    Connect
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Database className="w-5 h-5 text-purple-400" />
                    <div>
                      <span className="text-purple-400 font-medium">Xero</span>
                      <p className="text-gray-400 text-sm">Available</p>
                    </div>
                  </div>
                  <Button size="sm" color="primary" variant="flat">
                    Connect
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Tax Research Platforms</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-green-400" />
                    <div>
                      <span className="text-green-400 font-medium">Thomson Reuters</span>
                      <p className="text-gray-400 text-sm">Connected</p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-orange-400" />
                    <div>
                      <span className="text-orange-400 font-medium">CCH ProSystem</span>
                      <p className="text-gray-400 text-sm">Available</p>
                    </div>
                  </div>
                  <Button size="sm" color="warning" variant="flat">
                    Connect
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <div>
                      <span className="text-blue-400 font-medium">RIA Checkpoint</span>
                      <p className="text-gray-400 text-sm">Available</p>
                    </div>
                  </div>
                  <Button size="sm" color="primary" variant="flat">
                    Connect
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Compliance Services</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ShieldAlert className="w-5 h-5 text-green-400" />
                    <div>
                      <span className="text-green-400 font-medium">Avalara</span>
                      <p className="text-gray-400 text-sm">Connected</p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ShieldAlert className="w-5 h-5 text-yellow-400" />
                    <div>
                      <span className="text-yellow-400 font-medium">TaxJar</span>
                      <p className="text-gray-400 text-sm">Available</p>
                    </div>
                  </div>
                  <Button size="sm" color="warning" variant="flat">
                    Connect
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ShieldAlert className="w-5 h-5 text-blue-400" />
                    <div>
                      <span className="text-blue-400 font-medium">Vertex</span>
                      <p className="text-gray-400 text-sm">Available</p>
                    </div>
                  </div>
                  <Button size="sm" color="primary" variant="flat">
                    Connect
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Data Synchronization Management */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
        <CardHeader className="flex items-center space-x-3">
          <div className="w-1 h-8 bg-green-500 rounded-full"></div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Data Synchronization Management</h2>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Sync Scheduling</h3>
              <div className="space-y-3">
                <Select
                  label="Data Sync Frequency"
                  placeholder="Select frequency"
                  variant="bordered"
                  classNames={{
                    trigger: "bg-white/5 border-white/20 hover:border-white/30",
                    value: "text-white"
                  }}
                >
                  <SelectItem key="realtime" value="realtime">Real-time</SelectItem>
                  <SelectItem key="hourly" value="hourly">Hourly</SelectItem>
                  <SelectItem key="daily" value="daily">Daily</SelectItem>
                  <SelectItem key="weekly" value="weekly">Weekly</SelectItem>
                </Select>
                <Input
                  label="Sync Time (24-hour format)"
                  placeholder="02:00"
                  variant="bordered"
                  classNames={{
                    input: "text-white",
                    inputWrapper: "bg-white/5 border-white/20 hover:border-white/30"
                  }}
                />
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Automatic Error Recovery</span>
                  <Switch defaultSelected color="success" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Data Validation</span>
                  <Switch defaultSelected color="success" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Error Detection & Resolution</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div>
                    <span className="text-green-400 font-medium">Last Sync Status</span>
                    <p className="text-gray-400 text-sm">Successful - 2 hours ago</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div>
                    <span className="text-blue-400 font-medium">Data Integrity Check</span>
                    <p className="text-gray-400 text-sm">99.8% accuracy</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div>
                    <span className="text-yellow-400 font-medium">Pending Sync Items</span>
                    <p className="text-gray-400 text-sm">3 items queued</p>
                  </div>
                  <Button size="sm" color="warning" variant="flat">
                    Process Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Security and Authentication */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
        <CardHeader className="flex items-center space-x-3">
          <div className="w-1 h-8 bg-red-500 rounded-full"></div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Security and Authentication</h2>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Connection Security</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">SSL/TLS Encryption</span>
                  <Switch defaultSelected color="success" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">API Key Rotation</span>
                  <Switch defaultSelected color="success" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">OAuth 2.0 Authentication</span>
                  <Switch defaultSelected color="success" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">IP Whitelisting</span>
                  <Switch defaultSelected color="warning" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Audit Trail & Monitoring</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Connection Logging</span>
                  <Switch defaultSelected color="primary" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Data Access Tracking</span>
                  <Switch defaultSelected color="primary" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Anomaly Detection</span>
                  <Switch defaultSelected color="primary" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Compliance Reporting</span>
                  <Switch defaultSelected color="primary" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="flat" color="default" startContent={<Download className="w-4 h-4" />}>
              Export Security Report
            </Button>
            <Button color="primary" startContent={<Save className="w-4 h-4" />}>
              Save Security Settings
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}


