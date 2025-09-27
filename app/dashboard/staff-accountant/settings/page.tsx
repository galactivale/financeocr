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

// Mock data for profile information - Staff Accountant specific
const profileData = {
  personalInfo: {
    name: "Sarah Johnson",
    title: "Staff Accountant",
    email: "sarah.johnson@vaultcpa.com",
    phone: "+1 (555) 123-4567",
    firm: "VaultCPA - Economic Nexus Specialists",
    location: "San Francisco, CA",
    joinDate: "January 2024"
  },
  credentials: {
    cpaLicense: {
      number: "CPA-67890",
      state: "California",
      issued: "2023-06-15",
      expires: "2026-12-31",
      status: "Active"
    },
    certifications: [
      {
        name: "QuickBooks ProAdvisor",
        issuer: "Intuit",
        date: "2024-01-20",
        status: "Active"
      },
      {
        name: "Sales Tax Specialist",
        issuer: "Avalara",
        date: "2024-03-15",
        status: "Active"
      },
      {
        name: "Economic Nexus Compliance",
        issuer: "VaultCPA Training",
        date: "2024-02-01",
        status: "Active"
      }
    ]
  },
  professionalDevelopment: {
    cpeHours: {
      current: 28,
      required: 40,
      deadline: "2024-12-31"
    },
    recentCourses: [
      {
        title: "Economic Nexus Fundamentals",
        provider: "VaultCPA Training",
        hours: 8,
        completed: "2024-11-20",
        status: "Completed"
      },
      {
        title: "Data Entry Best Practices",
        provider: "Professional Development Co.",
        hours: 4,
        completed: "2024-10-15",
        status: "Completed"
      },
      {
        title: "Client Communication Excellence",
        provider: "Professional Development Co.",
        hours: 8,
        completed: "2024-12-31",
        status: "In Progress"
      },
      {
        title: "Advanced Sales Tax Analysis",
        provider: "SALT Institute",
        hours: 8,
        completed: "2024-12-31",
        status: "Planned"
      }
    ]
  },
  systemPreferences: {
    notifications: {
      email: true,
      push: true,
      sms: false,
      desktop: true
    },
    dashboard: {
      layout: "spacious",
      widgets: ["tasks", "alerts", "clients", "metrics"],
      theme: "dark"
    },
    security: {
      twoFactor: true,
      sessionTimeout: 30,
      loginAlerts: true
    }
  }
};

export default function StaffAccountantSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Handle save logic here
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
                <h2 className="text-2xl font-semibold text-white tracking-tight">Settings & Profile</h2>
              </div>
              
              {/* Profile Overview */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                      <User className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg tracking-tight">
                        {profileData.personalInfo.name}
                      </h3>
                      <p className="text-gray-400 text-sm font-medium">{profileData.personalInfo.title}</p>
                      <p className="text-gray-400 text-xs">{profileData.personalInfo.firm}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-500">
                        {profileData.professionalDevelopment.cpeHours.current}/{profileData.professionalDevelopment.cpeHours.required}
                      </div>
                      <div className="text-gray-400 text-xs font-medium">CPE Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-500">
                        {profileData.credentials.certifications.length}
                      </div>
                      <div className="text-gray-400 text-xs font-medium">Certifications</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-500">
                        {profileData.professionalDevelopment.recentCourses.length}
                      </div>
                      <div className="text-gray-400 text-xs font-medium">Recent Courses</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
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
                <Tab key="profile" title="Professional Profile">
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                      <CardHeader className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                          <h3 className="text-white text-lg font-semibold tracking-tight">Personal Information</h3>
                        </div>
                        <Button 
                          size="sm"
                          className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg font-medium transition-all duration-200"
                          onPress={handleEdit}
                        >
                          {isEditing ? 'Save' : 'Edit'}
                        </Button>
                      </CardHeader>
                      <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-gray-400 text-sm font-medium">Full Name</label>
                            <p className="text-white font-medium">{profileData.personalInfo.name}</p>
                          </div>
                          <div>
                            <label className="text-gray-400 text-sm font-medium">Title</label>
                            <p className="text-white font-medium">{profileData.personalInfo.title}</p>
                          </div>
                          <div>
                            <label className="text-gray-400 text-sm font-medium">Email</label>
                            <p className="text-white font-medium">{profileData.personalInfo.email}</p>
                          </div>
                          <div>
                            <label className="text-gray-400 text-sm font-medium">Phone</label>
                            <p className="text-white font-medium">{profileData.personalInfo.phone}</p>
                          </div>
                          <div>
                            <label className="text-gray-400 text-sm font-medium">Firm</label>
                            <p className="text-white font-medium">{profileData.personalInfo.firm}</p>
                          </div>
                          <div>
                            <label className="text-gray-400 text-sm font-medium">Location</label>
                            <p className="text-white font-medium">{profileData.personalInfo.location}</p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    {/* Professional Credentials */}
                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                      <CardHeader className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                          <h3 className="text-white text-lg font-semibold tracking-tight">Professional Credentials</h3>
                        </div>
                        <Button 
                          size="sm"
                          className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg font-medium transition-all duration-200"
                        >
                          Manage
                        </Button>
                      </CardHeader>
                      <CardBody>
                        <div className="space-y-4">
                          {/* CPA License */}
                          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-white font-semibold">CPA License</h4>
                              <Chip color="success" size="sm">{profileData.credentials.cpaLicense.status}</Chip>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-gray-400 text-sm font-medium">License Number</label>
                                <p className="text-white font-medium">{profileData.credentials.cpaLicense.number}</p>
                              </div>
                              <div>
                                <label className="text-gray-400 text-sm font-medium">State</label>
                                <p className="text-white font-medium">{profileData.credentials.cpaLicense.state}</p>
                              </div>
                              <div>
                                <label className="text-gray-400 text-sm font-medium">Issued Date</label>
                                <p className="text-white font-medium">{profileData.credentials.cpaLicense.issued}</p>
                              </div>
                              <div>
                                <label className="text-gray-400 text-sm font-medium">Expiration Date</label>
                                <p className="text-white font-medium">{profileData.credentials.cpaLicense.expires}</p>
                              </div>
                            </div>
                          </div>

                          {/* Certifications */}
                          <div>
                            <h4 className="text-white font-semibold mb-3">Professional Certifications</h4>
                            <div className="space-y-3">
                              {profileData.credentials.certifications.map((cert, index) => (
                                <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="text-white font-medium">{cert.name}</p>
                                      <p className="text-gray-400 text-sm">{cert.issuer}</p>
                                    </div>
                                    <div className="text-right">
                                      <Chip color="success" size="sm" className="mb-1">
                                        {cert.status}
                                      </Chip>
                                      <p className="text-gray-400 text-xs">Issued: {cert.date}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    {/* Professional Development */}
                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                      <CardHeader className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                          <h3 className="text-white text-lg font-semibold tracking-tight">Professional Development</h3>
                        </div>
                        <Button 
                          size="sm"
                          className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg font-medium transition-all duration-200"
                        >
                          Add Course
                        </Button>
                      </CardHeader>
                      <CardBody>
                        <div className="space-y-4">
                          {/* CPE Progress */}
                          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="text-white font-semibold">CPE Progress</h4>
                              <span className="text-blue-400 font-medium">
                                {profileData.professionalDevelopment.cpeHours.current}/{profileData.professionalDevelopment.cpeHours.required} hours
                              </span>
                            </div>
                            <Progress 
                              value={(profileData.professionalDevelopment.cpeHours.current / profileData.professionalDevelopment.cpeHours.required) * 100} 
                              className="w-full" 
                              color="primary"
                            />
                            <p className="text-gray-400 text-xs mt-2">Deadline: {profileData.professionalDevelopment.cpeHours.deadline}</p>
                          </div>

                          {/* Recent Courses */}
                          <div>
                            <h4 className="text-white font-semibold mb-3">Recent Courses</h4>
                            <div className="space-y-3">
                              {profileData.professionalDevelopment.recentCourses.map((course, index) => (
                                <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="text-white font-medium">{course.title}</p>
                                      <p className="text-gray-400 text-sm">{course.provider} • {course.hours} hours</p>
                                    </div>
                                    <div className="text-right">
                                      <Chip 
                                        color={course.status === 'Completed' ? 'success' : course.status === 'In Progress' ? 'warning' : 'default'} 
                                        size="sm" 
                                        className="mb-1"
                                      >
                                        {course.status}
                                      </Chip>
                                      <p className="text-gray-400 text-xs">{course.completed}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </Tab>

                <Tab key="preferences" title="System Preferences">
                  <div className="space-y-6">
                    {/* Notification Settings */}
                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                      <CardHeader className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                          <h3 className="text-white text-lg font-semibold tracking-tight">Notification Settings</h3>
                        </div>
                        <Button 
                          size="sm"
                          className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg font-medium transition-all duration-200"
                        >
                          Configure
                        </Button>
                      </CardHeader>
                      <CardBody>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <Bell className="w-4 h-4 text-orange-500" />
                              <span className="text-white font-medium">Email Notifications</span>
                            </div>
                            <Switch isSelected={profileData.systemPreferences.notifications.email} />
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <Smartphone className="w-4 h-4 text-orange-500" />
                              <span className="text-white font-medium">Push Notifications</span>
                            </div>
                            <Switch isSelected={profileData.systemPreferences.notifications.push} />
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <Monitor className="w-4 h-4 text-orange-500" />
                              <span className="text-white font-medium">Desktop Notifications</span>
                            </div>
                            <Switch isSelected={profileData.systemPreferences.notifications.desktop} />
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-orange-500" />
                              <span className="text-white font-medium">SMS Notifications</span>
                            </div>
                            <Switch isSelected={profileData.systemPreferences.notifications.sms} />
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    {/* Dashboard Preferences */}
                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                      <CardHeader className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                          <h3 className="text-white text-lg font-semibold tracking-tight">Dashboard Preferences</h3>
                        </div>
                        <Button 
                          size="sm"
                          className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg font-medium transition-all duration-200"
                        >
                          Customize
                        </Button>
                      </CardHeader>
                      <CardBody>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-white font-medium">Layout Style</span>
                            <Chip color="primary" size="sm">{profileData.systemPreferences.dashboard.layout}</Chip>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white font-medium">Theme</span>
                            <Chip color="primary" size="sm">{profileData.systemPreferences.dashboard.theme}</Chip>
                          </div>
                          <div>
                            <label className="text-gray-400 text-sm font-medium mb-2 block">Widget Order</label>
                            <div className="flex flex-wrap gap-2">
                              {profileData.systemPreferences.dashboard.widgets.map((widget, index) => (
                                <Chip key={index} size="sm" variant="flat">
                                  {widget}
                                </Chip>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    {/* Security Settings */}
                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                      <CardHeader className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-1 h-6 bg-red-500 rounded-full"></div>
                          <h3 className="text-white text-lg font-semibold tracking-tight">Security Settings</h3>
                        </div>
                        <Button 
                          size="sm"
                          className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg font-medium transition-all duration-200"
                        >
                          Update
                        </Button>
                      </CardHeader>
                      <CardBody>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <ShieldCheck className="w-4 h-4 text-red-500" />
                              <span className="text-white font-medium">Two-Factor Authentication</span>
                            </div>
                            <Switch isSelected={profileData.systemPreferences.security.twoFactor} />
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-red-500" />
                              <span className="text-white font-medium">Session Timeout</span>
                            </div>
                            <span className="text-blue-400 font-medium">{profileData.systemPreferences.security.sessionTimeout} minutes</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                              <span className="text-white font-medium">Login Alerts</span>
                            </div>
                            <Switch isSelected={profileData.systemPreferences.security.loginAlerts} />
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </Tab>

                <Tab key="resources" title="External Resources">
                  <div className="space-y-6">
                    {/* Professional Education */}
                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                          <h3 className="text-white text-lg font-semibold tracking-tight">Professional Education</h3>
                        </div>
                      </CardHeader>
                      <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <h4 className="text-white font-semibold mb-3">CPE Providers</h4>
                            <div className="space-y-2">
                              <Button size="sm" className="w-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30">
                                AICPA Learning Center
                              </Button>
                              <Button size="sm" className="w-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30">
                                Becker Professional Education
                              </Button>
                              <Button size="sm" className="w-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30">
                                SALT Institute
                              </Button>
                            </div>
                          </div>
                          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <h4 className="text-white font-semibold mb-3">Professional Associations</h4>
                            <div className="space-y-2">
                              <Button size="sm" className="w-full bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30">
                                AICPA
                              </Button>
                              <Button size="sm" className="w-full bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30">
                                CalCPA
                              </Button>
                              <Button size="sm" className="w-full bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30">
                                SALT
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    {/* Regulatory Resources */}
                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                          <h3 className="text-white text-lg font-semibold tracking-tight">Regulatory Resources</h3>
                        </div>
                      </CardHeader>
                      <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <h4 className="text-white font-semibold mb-3">Government Resources</h4>
                            <div className="space-y-2">
                              <Button size="sm" className="w-full bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30">
                                IRS Tax Center
                              </Button>
                              <Button size="sm" className="w-full bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30">
                                State Revenue Departments
                              </Button>
                              <Button size="sm" className="w-full bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30">
                                Professional Standards
                              </Button>
                            </div>
                          </div>
                          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <h4 className="text-white font-semibold mb-3">Industry Resources</h4>
                            <div className="space-y-2">
                              <Button size="sm" className="w-full bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30">
                                Tax Foundation
                              </Button>
                              <Button size="sm" className="w-full bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30">
                                Sales Tax Institute
                              </Button>
                              <Button size="sm" className="w-full bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30">
                                Nexus Compliance Guide
                              </Button>
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
    </div>
  );
}