"use client";

import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Chip } from "@nextui-org/chip";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Badge } from "@nextui-org/badge";
import { Switch } from "@nextui-org/switch";
import { Progress } from "@nextui-org/progress";
import { 
  User, 
  ShieldCheck, 
  Bell, 
  Settings, 
  GraduationCap,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Key,
  Smartphone,
  Monitor,
  BarChart3,
  BookOpen,
  Calendar,
  CreditCard,
  Globe,
  Wrench
} from "lucide-react";

// Mock data for profile information
const profileData = {
  personalInfo: {
    name: "Jane Doe",
    title: "Tax Manager, CPA",
    email: "jane.doe@nexuscompliance.com",
    phone: "+1 (555) 123-4567",
    firm: "Nexus Compliance Partners",
    location: "San Francisco, CA",
    joinDate: "January 2022"
  },
  credentials: {
    cpaLicense: {
      number: "CPA-12345",
      state: "California",
      issued: "2020-01-15",
      expires: "2025-12-31",
      status: "active",
      renewalRequired: true,
      renewalDeadline: "2025-12-31"
    },
    continuingEducation: {
      requiredHours: 40,
      completedHours: 32,
      pendingHours: 8,
      lastUpdate: "2024-11-15",
      courses: [
        { name: "Advanced Nexus Compliance", hours: 8, status: "completed", date: "2024-10-15" },
        { name: "Multi-State Tax Planning", hours: 6, status: "completed", date: "2024-09-20" },
        { name: "Professional Ethics Update", hours: 4, status: "completed", date: "2024-08-10" },
        { name: "Technology in Tax Practice", hours: 8, status: "pending", date: "2024-12-15" }
      ]
    }
  },
  notifications: {
    clientAlerts: {
      emergency: true,
      threshold: true,
      compliance: true,
      deadline: true
    },
    professional: {
      ceReminders: true,
      licenseRenewal: true,
      regulatoryUpdates: true,
      peerReview: false
    },
    system: {
      maintenance: false,
      updates: true,
      security: true
    }
  },
  integrations: [
    { name: "QuickBooks", status: "connected", lastSync: "2024-11-28 14:30", type: "accounting" },
    { name: "Salesforce", status: "connected", lastSync: "2024-11-28 14:25", type: "crm" },
    { name: "Thomson Reuters", status: "error", lastSync: "2024-11-27 09:15", type: "research" },
    { name: "State Tax Portal", status: "connected", lastSync: "2024-11-28 15:00", type: "compliance" }
  ],
  security: {
    twoFactor: true,
    lastLogin: "2024-11-28 08:45",
    loginLocation: "San Francisco, CA",
    passwordLastChanged: "2024-10-15",
    activeSessions: 2
  }
};

export default function TaxManagerProfilePage() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profileData.personalInfo);

  const getCredentialStatus = () => {
    const daysUntilExpiry = Math.ceil((new Date(profileData.credentials.cpaLicense.expires).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilExpiry < 30) return { status: "critical", color: "danger", message: "License expires in " + daysUntilExpiry + " days" };
    if (daysUntilExpiry < 90) return { status: "warning", color: "warning", message: "License expires in " + daysUntilExpiry + " days" };
    if (daysUntilExpiry < 180) return { status: "attention", color: "primary", message: "License expires in " + daysUntilExpiry + " days" };
    return { status: "good", color: "success", message: "License valid until " + new Date(profileData.credentials.cpaLicense.expires).toLocaleDateString() };
  };

  const getCEProgress = () => {
    const progress = (profileData.credentials.continuingEducation.completedHours / profileData.credentials.continuingEducation.requiredHours) * 100;
    return progress;
  };

  const getIntegrationStatusColor = (status) => {
    switch (status) {
      case "connected": return "success";
      case "error": return "danger";
      case "pending": return "warning";
      default: return "default";
    }
  };

  return (
    <div className="min-h-screen bg-black p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-light text-white mb-2">Profile & Settings</h1>
            <p className="text-gray-400 text-sm">Professional account management and configuration</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge content="2" color="warning" size="sm">
              <Button
                isIconOnly
                className="bg-white/10 backdrop-blur-xl border border-white/10 text-white hover:bg-white/20"
                size="sm"
              >
                <Bell className="w-5 h-5" />
              </Button>
            </Badge>
            <Button
              className="bg-blue-500/20 backdrop-blur-xl border border-blue-500/30 text-blue-400 hover:bg-blue-500/30"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <User className="w-4 h-4 mr-2" />
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
          </div>
        </div>

        {/* Status Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">License Status</p>
                <p className="text-lg font-light text-white">{getCredentialStatus().status.toUpperCase()}</p>
              </div>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                getCredentialStatus().color === "danger" ? "bg-red-500/20" :
                getCredentialStatus().color === "warning" ? "bg-yellow-500/20" :
                getCredentialStatus().color === "primary" ? "bg-blue-500/20" : "bg-green-500/20"
              }`}>
                <ShieldCheck className={`w-4 h-4 ${
                  getCredentialStatus().color === "danger" ? "text-red-400" :
                  getCredentialStatus().color === "warning" ? "text-yellow-400" :
                  getCredentialStatus().color === "primary" ? "text-blue-400" : "text-green-400"
                }`} />
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">CE Progress</p>
                <p className="text-lg font-light text-white">{profileData.credentials.continuingEducation.completedHours}/{profileData.credentials.continuingEducation.requiredHours}h</p>
              </div>
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-blue-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Active Sessions</p>
                <p className="text-lg font-light text-white">{profileData.security.activeSessions}</p>
              </div>
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Integrations</p>
                <p className="text-lg font-light text-white">{profileData.integrations.filter(i => i.status === "connected").length}/{profileData.integrations.length}</p>
              </div>
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Overview */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <Tabs
              selectedKey={selectedTab}
              onSelectionChange={setSelectedTab}
              className="mb-6"
              classNames={{
                tabList: "bg-white/5 border border-white/10",
                tab: "text-gray-300 data-[selected=true]:text-white",
                cursor: "bg-blue-500/20"
              }}
            >
              <Tab key="overview" title="Overview">
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                      <h2 className="text-xl font-light text-white">Personal Information</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">Full Name</label>
                        {isEditing ? (
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="bg-white/10 border-white/20"
                          />
                        ) : (
                          <p className="text-white">{formData.name}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">Professional Title</label>
                        {isEditing ? (
                          <Input
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="bg-white/10 border-white/20"
                          />
                        ) : (
                          <p className="text-white">{formData.title}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">Email Address</label>
                        {isEditing ? (
                          <Input
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="bg-white/10 border-white/20"
                          />
                        ) : (
                          <p className="text-white">{formData.email}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">Phone Number</label>
                        {isEditing ? (
                          <Input
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="bg-white/10 border-white/20"
                          />
                        ) : (
                          <p className="text-white">{formData.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Professional Credentials */}
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                      <h2 className="text-xl font-light text-white">Professional Credentials</h2>
                    </div>
                    
                    {/* CPA License Status */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-medium">CPA License</h3>
                        <Chip
                          color={getCredentialStatus().color}
                          size="sm"
                          className="text-xs"
                        >
                          {getCredentialStatus().status.toUpperCase()}
                        </Chip>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-gray-400 text-xs">License Number</p>
                          <p className="text-white text-sm">{profileData.credentials.cpaLicense.number}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">State</p>
                          <p className="text-white text-sm">{profileData.credentials.cpaLicense.state}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Issued</p>
                          <p className="text-white text-sm">{new Date(profileData.credentials.cpaLicense.issued).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Expires</p>
                          <p className="text-white text-sm">{new Date(profileData.credentials.cpaLicense.expires).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                        <p className="text-yellow-300 text-sm">{getCredentialStatus().message}</p>
                      </div>
                    </div>

                    {/* Continuing Education */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-medium">Continuing Education</h3>
                        <div className="text-right">
                          <p className="text-white text-sm">{profileData.credentials.continuingEducation.completedHours}/{profileData.credentials.continuingEducation.requiredHours} hours</p>
                          <p className="text-gray-400 text-xs">{Math.round(getCEProgress())}% complete</p>
                        </div>
                      </div>
                      <Progress
                        value={getCEProgress()}
                        className="mb-4"
                        color={getCEProgress() >= 80 ? "success" : getCEProgress() >= 60 ? "warning" : "danger"}
                      />
                      <div className="space-y-2">
                        {profileData.credentials.continuingEducation.courses.map((course, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                            <div>
                              <p className="text-white text-sm">{course.name}</p>
                              <p className="text-gray-400 text-xs">{course.hours} hours • {new Date(course.date).toLocaleDateString()}</p>
                            </div>
                            <Chip
                              color={course.status === "completed" ? "success" : "warning"}
                              size="sm"
                              className="text-xs"
                            >
                              {course.status.toUpperCase()}
                            </Chip>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Tab>

              <Tab key="notifications" title="Notifications">
                <div className="space-y-6">
                  {/* Client Alerts */}
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-1 h-6 bg-red-500 rounded-full"></div>
                      <h2 className="text-xl font-light text-white">Client Emergency Alerts</h2>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-white text-sm">Critical threshold breaches</p>
                          <p className="text-gray-400 text-xs">Immediate alerts for client nexus threshold violations</p>
                        </div>
                        <Switch
                          isSelected={profileData.notifications.clientAlerts.emergency}
                          color="danger"
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-white text-sm">Compliance deadlines</p>
                          <p className="text-gray-400 text-xs">Registration and filing deadline reminders</p>
                        </div>
                        <Switch
                          isSelected={profileData.notifications.clientAlerts.deadline}
                          color="warning"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Professional Notifications */}
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                      <h2 className="text-xl font-light text-white">Professional Development</h2>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-white text-sm">CE requirement reminders</p>
                          <p className="text-gray-400 text-xs">Continuing education deadline notifications</p>
                        </div>
                        <Switch
                          isSelected={profileData.notifications.professional.ceReminders}
                          color="primary"
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-white text-sm">License renewal alerts</p>
                          <p className="text-gray-400 text-xs">CPA license expiration warnings</p>
                        </div>
                        <Switch
                          isSelected={profileData.notifications.professional.licenseRenewal}
                          color="warning"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Tab>

              <Tab key="integrations" title="Integrations">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                      <h2 className="text-xl font-light text-white">Connected Services</h2>
                    </div>
                    <div className="space-y-3">
                      {profileData.integrations.map((integration, index) => (
                        <div key={index} className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                                <Globe className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="text-white font-medium">{integration.name}</h3>
                                <p className="text-gray-400 text-xs capitalize">{integration.type} integration</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Chip
                                color={getIntegrationStatusColor(integration.status)}
                                size="sm"
                                className="text-xs"
                              >
                                {integration.status.toUpperCase()}
                              </Chip>
                              <Button
                                size="sm"
                                variant="flat"
                                className="bg-white/10 text-gray-300 hover:bg-white/20"
                              >
                                <Wrench className="w-3 h-3 mr-2" />
                                Manage
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>Last sync: {new Date(integration.lastSync).toLocaleString()}</span>
                            {integration.status === "error" && (
                              <span className="text-red-400">Connection failed - Click manage to troubleshoot</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Tab>

              <Tab key="security" title="Security">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                      <h2 className="text-xl font-light text-white">Account Protection</h2>
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                            <p className="text-gray-400 text-xs">Professional account protection: Active</p>
                          </div>
                        </div>
                        <Chip color="success" size="sm" className="text-xs">ENABLED</Chip>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">
                        Your account is protected with two-factor authentication, providing enhanced security for sensitive client data and professional decisions.
                      </p>
                      <Button
                        size="sm"
                        variant="flat"
                        className="bg-white/10 text-gray-300 hover:bg-white/20"
                      >
                        <Key className="w-3 h-3 mr-2" />
                        Manage 2FA
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
                        <h3 className="text-white font-medium mb-3">Recent Activity</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Last login:</span>
                            <span className="text-white">{new Date(profileData.security.lastLogin).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Location:</span>
                            <span className="text-white">{profileData.security.loginLocation}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Active sessions:</span>
                            <span className="text-white">{profileData.security.activeSessions}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
                        <h3 className="text-white font-medium mb-3">Password Security</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Last changed:</span>
                            <span className="text-white">{new Date(profileData.security.passwordLastChanged).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Strength:</span>
                            <Chip color="success" size="sm" className="text-xs">STRONG</Chip>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="flat"
                          className="bg-white/10 text-gray-300 hover:bg-white/20 mt-3 w-full"
                        >
                          <Key className="w-3 h-3 mr-2" />
                          Change Password
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>

        {/* Right Column - Quick Actions & Data Management */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Professional Development */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                <h2 className="text-xl font-light text-white">Professional Development</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <h3 className="text-white font-medium text-sm mb-2">Upcoming CE Course</h3>
                  <p className="text-gray-300 text-xs mb-2">Technology in Tax Practice</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Dec 15, 2024</span>
                    <Chip color="warning" size="sm" className="text-xs">8 HOURS</Chip>
                  </div>
                </div>
                <Button
                  fullWidth
                  className="bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30"
                  size="sm"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  View CE Schedule
                </Button>
              </div>
            </div>

            {/* Data Management */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                <h2 className="text-xl font-light text-white">Data Management</h2>
              </div>
              <div className="space-y-3">
                <Button
                  fullWidth
                  variant="flat"
                  className="bg-white/10 text-gray-300 hover:bg-white/20 justify-start"
                  startContent={<Download className="w-4 h-4" />}
                >
                  Export Professional Data
                </Button>
                <Button
                  fullWidth
                  variant="flat"
                  className="bg-white/10 text-gray-300 hover:bg-white/20 justify-start"
                  startContent={<FileText className="w-4 h-4" />}
                >
                  Download Audit Trail
                </Button>
                <Button
                  fullWidth
                  variant="flat"
                  className="bg-white/10 text-gray-300 hover:bg-white/20 justify-start"
                  startContent={<Calendar className="w-4 h-4" />}
                >
                  Backup Schedule
                </Button>
              </div>
            </div>

            {/* Dashboard Preferences */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                <h2 className="text-xl font-light text-white">Dashboard Preferences</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Show risk indicators</span>
                  <Switch defaultSelected color="primary" size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Priority state alerts</span>
                  <Switch defaultSelected color="primary" size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Professional metrics</span>
                  <Switch defaultSelected color="primary" size="sm" />
                </div>
                <Button
                  fullWidth
                  variant="flat"
                  className="bg-white/10 text-gray-300 hover:bg-white/20 mt-3"
                  startContent={<BarChart3 className="w-4 h-4" />}
                >
                  Customize Layout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
