"use client";
import React, { useState } from "react";
import { 
  Card, 
  CardBody, 
  CardHeader,
  Button,
  Chip,
  Input,
  Badge,
  Progress,
  Tooltip,
  Avatar,
  Select,
  SelectItem,
  Tabs,
  Tab,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import NextLink from "next/link";
import { 
  ArrowLeft,
  Edit,
  Shield,
  Key,
  Settings,
  Activity,
  Clock,
  Globe,
  Database,
  UserX,
  CheckCircle,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Lock,
  Unlock,
  RefreshCw,
  Send
} from "lucide-react";

// Mock user data - in real app, this would come from API
const getUserData = (userId: string) => {
  const users = {
    "1": {
      id: "1",
      name: "Michael Thompson, CPA",
      email: "michael.thompson@democpa.com",
      firm: "Demo CPA Firm",
      role: "Managing Partner",
      status: "Active",
      cpaLicense: "CA-12345",
      licenseExpiry: "2025-12-31",
      phone: "+1 (555) 123-4567",
      address: "123 Business Ave, San Francisco, CA 94105",
      lastLogin: "2024-11-28T14:30:00Z",
      loginCount: 127,
      mfaEnabled: true,
      createdAt: "2023-01-15T00:00:00Z",
      lastPasswordChange: "2024-10-15T00:00:00Z",
      failedLoginAttempts: 0,
      accountLocked: false,
      professionalCredits: 45,
      nextCreditsDue: "2025-06-30"
    }
  };
  
  return users[userId as keyof typeof users] || null;
};

const getActivityLog = (userId: string) => {
  return [
    {
      id: "1",
      timestamp: "2024-11-28T14:30:00Z",
      action: "Login",
      details: "Successful login from San Francisco, CA",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 120.0.0.0"
    },
    {
      id: "2",
      timestamp: "2024-11-28T13:45:00Z",
      action: "Client Data Access",
      details: "Viewed client portfolio for TechCorp Inc",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 120.0.0.0"
    },
    {
      id: "3",
      timestamp: "2024-11-28T12:20:00Z",
      action: "Report Generation",
      details: "Generated Q4 compliance report",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 120.0.0.0"
    },
    {
      id: "4",
      timestamp: "2024-11-27T16:15:00Z",
      action: "Password Change",
      details: "Password updated successfully",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 120.0.0.0"
    },
    {
      id: "5",
      timestamp: "2024-11-27T10:30:00Z",
      action: "MFA Setup",
      details: "Two-factor authentication enabled",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 120.0.0.0"
    }
  ];
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active": return "success";
    case "Inactive": return "warning";
    case "Suspended": return "danger";
    case "Pending": return "primary";
    default: return "default";
  }
};

export default function UserDetailsPage() {
  const [selectedTab, setSelectedTab] = useState("roles-permissions");
  const [isEditing, setIsEditing] = useState(false);
  
  // Get user ID from URL search params
  const [userId, setUserId] = useState<string>("");
  
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('user-id');
    if (id) {
      setUserId(id);
    }
  }, []);
  
  const user = getUserData(userId);
  const activityLog = getActivityLog(userId);

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">User Not Found</h1>
          <Link href="/dashboard/system-admin/user-management" as={NextLink}>
            <Button color="primary">Back to User Management</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-6">
        {/* Header */}
        <div className="pt-6 pb-6">
          <div className="max-w-7xl mx-auto px-4 lg:px-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/dashboard/system-admin/user-management" as={NextLink}>
                  <Button variant="flat" isIconOnly>
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">{user.name}</h1>
                  <p className="text-lg text-gray-400 mt-1">{user.role} • {user.firm}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  color="secondary"
                  variant="flat"
                  startContent={<Edit className="w-4 h-4" />}
                  onPress={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancel Edit" : "Edit User"}
                </Button>
                <Button
                  color="danger"
                  variant="flat"
                  startContent={<UserX className="w-4 h-4" />}
                >
                  Suspend Account
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - User Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* User Profile Card */}
              <Card className="bg-white/5 backdrop-blur-xl border-0 shadow-sm rounded-2xl">
                <CardBody className="p-6">
                  <div className="text-center mb-6">
                    <Avatar
                      name={user.name}
                      size="lg"
                      className="bg-blue-500/20 text-blue-400 text-2xl mb-4 mx-auto"
                    />
                    <h3 className="text-xl font-semibold text-white">{user.name}</h3>
                    <p className="text-gray-400">{user.role}</p>
                    <Chip
                      color={getStatusColor(user.status)}
                      variant="flat"
                      className="mt-2"
                    >
                      {user.status}
                    </Chip>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300">{user.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300">{user.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300">License: {user.cpaLicense}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300">Expires: {user.licenseExpiry}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Security Status */}
              <Card className="bg-white/5 backdrop-blur-xl border-0 shadow-sm rounded-2xl">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-white">Security Status</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">MFA Status</span>
                      <div className="flex items-center gap-2">
                        {user.mfaEnabled ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-orange-500" />
                        )}
                        <span className={user.mfaEnabled ? "text-green-400" : "text-orange-400"}>
                          {user.mfaEnabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Account Locked</span>
                      <div className="flex items-center gap-2">
                        {user.accountLocked ? (
                          <Lock className="w-5 h-5 text-red-500" />
                        ) : (
                          <Unlock className="w-5 h-5 text-green-500" />
                        )}
                        <span className={user.accountLocked ? "text-red-400" : "text-green-400"}>
                          {user.accountLocked ? "Locked" : "Unlocked"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Failed Logins</span>
                      <span className="text-white">{user.failedLoginAttempts}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Last Password Change</span>
                      <span className="text-white text-sm">{new Date(user.lastPasswordChange).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Professional Credits */}
              <Card className="bg-white/5 backdrop-blur-xl border-0 shadow-sm rounded-2xl">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-white">Professional Credits</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Current Credits</span>
                      <span className="text-white font-bold">{user.professionalCredits}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Next Due</span>
                      <span className="text-white text-sm">{user.nextCreditsDue}</span>
                    </div>
                    <Progress
                      value={75}
                      color="success"
                      className="w-full"
                    />
                    <p className="text-xs text-gray-400">75% of annual requirement completed</p>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Right Column - Tabs */}
            <div className="lg:col-span-2">
              <Tabs
                selectedKey={selectedTab}
                onSelectionChange={(key) => setSelectedTab(key as string)}
                className="w-full"
                classNames={{
                  tabList: "bg-white/5 backdrop-blur-xl border-0 shadow-sm rounded-2xl p-1",
                  tab: "text-gray-400 data-[selected=true]:text-white data-[selected=true]:bg-white data-[selected=true]:shadow-sm rounded-xl",
                  panel: "mt-6"
                }}
              >
                <Tab key="roles-permissions" title="Roles & Permissions">
                  <div className="space-y-6">
                    <Card className="bg-white/5 backdrop-blur-xl border-0 shadow-sm rounded-2xl">
                      <CardHeader>
                        <h3 className="text-lg font-semibold text-white">Current Role & Permissions</h3>
                      </CardHeader>
                      <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <label className="text-gray-400 text-sm">Current Role</label>
                              <div className="mt-2">
                                <Chip color="primary" variant="flat" size="lg">
                                  {user.role}
                                </Chip>
                              </div>
                            </div>
                            <div>
                              <label className="text-gray-400 text-sm">Firm/Tenant</label>
                              <div className="mt-2">
                                <span className="text-white">{user.firm}</span>
                              </div>
                            </div>
                            <div>
                              <label className="text-gray-400 text-sm">Account Status</label>
                              <div className="mt-2">
                                <Chip 
                                  color={user.status === 'Active' ? 'success' : user.status === 'Suspended' ? 'danger' : 'warning'} 
                                  variant="flat"
                                >
                                  {user.status}
                                </Chip>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="text-gray-400 text-sm">Role Change</label>
                              <Select
                                placeholder="Select new role"
                                className="mt-2"
                              >
                                <SelectItem key="Managing Partner" value="Managing Partner">Managing Partner</SelectItem>
                                <SelectItem key="Tax Manager" value="Tax Manager">Tax Manager</SelectItem>
                                <SelectItem key="Staff Accountant" value="Staff Accountant">Staff Accountant</SelectItem>
                                <SelectItem key="System Admin" value="System Admin">System Admin</SelectItem>
                              </Select>
                            </div>
                            <div>
                              <label className="text-gray-400 text-sm">Status Change</label>
                              <Select
                                placeholder="Select new status"
                                className="mt-2"
                              >
                                <SelectItem key="Active" value="Active">Active</SelectItem>
                                <SelectItem key="Inactive" value="Inactive">Inactive</SelectItem>
                                <SelectItem key="Suspended" value="Suspended">Suspended</SelectItem>
                                <SelectItem key="Pending" value="Pending">Pending</SelectItem>
                              </Select>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button color="primary" size="sm">Update Role</Button>
                              <Button variant="flat" size="sm">Reset Permissions</Button>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    <Card className="bg-white/5 backdrop-blur-xl border-0 shadow-sm rounded-2xl">
                      <CardHeader>
                        <h3 className="text-lg font-semibold text-white">Permission Matrix</h3>
                      </CardHeader>
                      <CardBody>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-white/10">
                                <th className="text-left text-gray-400 py-3">Feature</th>
                                <th className="text-center text-gray-400 py-3">Current Access</th>
                                <th className="text-center text-gray-400 py-3">Available</th>
                              </tr>
                            </thead>
                            <tbody className="space-y-2">
                              <tr className="border-b border-white/5">
                                <td className="text-white py-3">Client Management</td>
                                <td className="text-center py-3"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                                <td className="text-center py-3"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                              </tr>
                              <tr className="border-b border-white/5">
                                <td className="text-white py-3">Financial Reports</td>
                                <td className="text-center py-3"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                                <td className="text-center py-3"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                              </tr>
                              <tr className="border-b border-white/5">
                                <td className="text-white py-3">User Management</td>
                                <td className="text-center py-3"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                                <td className="text-center py-3"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                              </tr>
                              <tr className="border-b border-white/5">
                                <td className="text-white py-3">System Settings</td>
                                <td className="text-center py-3"><AlertTriangle className="w-5 h-5 text-red-500 mx-auto" /></td>
                                <td className="text-center py-3"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </Tab>

                <Tab key="access-control" title="Access Control">
                  <div className="space-y-6">
                    <Card className="bg-white/5 backdrop-blur-xl border-0 shadow-sm rounded-2xl">
                      <CardHeader>
                        <h3 className="text-lg font-semibold text-white">Access Control Overview</h3>
                      </CardHeader>
                      <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-xl">
                              <span className="text-white font-medium">MFA Status</span>
                              <Chip color={user.mfaEnabled ? "success" : "warning"} variant="flat">
                                {user.mfaEnabled ? "Enabled" : "Disabled"}
                              </Chip>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-xl">
                              <span className="text-white font-medium">Account Status</span>
                              <Chip color={user.accountLocked ? "danger" : "success"} variant="flat">
                                {user.accountLocked ? "Locked" : "Unlocked"}
                              </Chip>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-xl">
                              <span className="text-white font-medium">Failed Login Attempts</span>
                              <span className="text-orange-400 font-bold">{user.failedLoginAttempts}</span>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-xl">
                              <span className="text-white font-medium">Last Login</span>
                              <span className="text-purple-400 text-sm">{new Date(user.lastLogin).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-cyan-500/10 rounded-xl">
                              <span className="text-white font-medium">Total Logins</span>
                              <span className="text-cyan-400 font-bold">{user.loginCount}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-xl">
                              <span className="text-white font-medium">Last Password Change</span>
                              <span className="text-red-400 text-sm">{new Date(user.lastPasswordChange).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    <Card className="bg-white/5 backdrop-blur-xl border-0 shadow-sm rounded-2xl">
                      <CardHeader>
                        <h3 className="text-lg font-semibold text-white">Security Actions</h3>
                      </CardHeader>
                      <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Button
                            color="primary"
                            variant="flat"
                            startContent={<Key className="w-4 h-4" />}
                          >
                            Reset Password
                          </Button>
                          <Button
                            color="secondary"
                            variant="flat"
                            startContent={<Shield className="w-4 h-4" />}
                          >
                            {user.mfaEnabled ? "Disable MFA" : "Enable MFA"}
                          </Button>
                          <Button
                            color="warning"
                            variant="flat"
                            startContent={<RefreshCw className="w-4 h-4" />}
                          >
                            Refresh Sessions
                          </Button>
                          <Button
                            color="danger"
                            variant="flat"
                            startContent={<Lock className="w-4 h-4" />}
                          >
                            {user.accountLocked ? "Unlock Account" : "Lock Account"}
                          </Button>
                        </div>
                      </CardBody>
                    </Card>

                    <Card className="bg-white/5 backdrop-blur-xl border-0 shadow-sm rounded-2xl">
                      <CardHeader>
                        <h3 className="text-lg font-semibold text-white">Login Statistics</h3>
                      </CardHeader>
                      <CardBody>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-white">{user.loginCount}</p>
                            <p className="text-gray-400 text-sm">Total Logins</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-white">{user.failedLoginAttempts}</p>
                            <p className="text-gray-400 text-sm">Failed Attempts</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-white">
                              {new Date(user.lastLogin).toLocaleDateString()}
                            </p>
                            <p className="text-gray-400 text-sm">Last Login</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-white">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-gray-400 text-sm">Account Created</p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </Tab>

                <Tab key="authentication" title="Authentication">
                  <div className="space-y-6">
                    <Card className="bg-white/5 backdrop-blur-xl border-0 shadow-sm rounded-2xl">
                      <CardHeader>
                        <h3 className="text-lg font-semibold text-white">Authentication Methods</h3>
                      </CardHeader>
                      <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-xl">
                              <span className="text-white font-medium">Password Authentication</span>
                              <Chip color="success" variant="flat">Active</Chip>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-xl">
                              <span className="text-white font-medium">Multi-Factor Authentication</span>
                              <Chip color={user.mfaEnabled ? "success" : "warning"} variant="flat">
                                {user.mfaEnabled ? "Enabled" : "Disabled"}
                              </Chip>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-xl">
                              <span className="text-white font-medium">Single Sign-On</span>
                              <Chip color="default" variant="flat">Not Configured</Chip>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-xl">
                              <span className="text-white font-medium">Password Age</span>
                              <span className="text-orange-400 text-sm">44 days</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-cyan-500/10 rounded-xl">
                              <span className="text-white font-medium">Session Timeout</span>
                              <span className="text-cyan-400 text-sm">8 hours</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-xl">
                              <span className="text-white font-medium">Max Failed Attempts</span>
                              <span className="text-red-400 text-sm">5 attempts</span>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    <Card className="bg-white/5 backdrop-blur-xl border-0 shadow-sm rounded-2xl">
                      <CardHeader>
                        <h3 className="text-lg font-semibold text-white">Password Policy</h3>
                      </CardHeader>
                      <CardBody>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Minimum Length</span>
                            <span className="text-white">8 characters</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Complexity Requirements</span>
                            <span className="text-white">Uppercase, Lowercase, Numbers, Symbols</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Expiration Period</span>
                            <span className="text-white">90 days</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Password History</span>
                            <span className="text-white">5 previous passwords</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Account Lockout</span>
                            <span className="text-white">5 failed attempts</span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </Tab>

                <Tab key="security-policies" title="Security Policies">
                  <div className="space-y-6">
                    <Card className="bg-white/5 backdrop-blur-xl border-0 shadow-sm rounded-2xl">
                      <CardHeader>
                        <h3 className="text-lg font-semibold text-white">Platform Security Standards</h3>
                      </CardHeader>
                      <CardBody>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-white text-sm">Data encryption at rest and in transit</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-white text-sm">Regular security audits and penetration testing</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-white text-sm">Professional liability protection protocols</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-white text-sm">SOC 2 Type II compliance</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-white text-sm">GDPR and CCPA compliance</span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    <Card className="bg-white/5 backdrop-blur-xl border-0 shadow-sm rounded-2xl">
                      <CardHeader>
                        <h3 className="text-lg font-semibold text-white">Incident Response Procedures</h3>
                      </CardHeader>
                      <CardBody>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                            <span className="text-white text-sm">24/7 security monitoring and alerting</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                            <span className="text-white text-sm">Automated threat detection and response</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                            <span className="text-white text-sm">Immediate incident response team activation</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                            <span className="text-white text-sm">Client notification protocols within 24 hours</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                            <span className="text-white text-sm">Regulatory reporting and compliance documentation</span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    <Card className="bg-white/5 backdrop-blur-xl border-0 shadow-sm rounded-2xl">
                      <CardHeader>
                        <h3 className="text-lg font-semibold text-white">Compliance & Audit Requirements</h3>
                      </CardHeader>
                      <CardBody>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-white text-sm">Professional standards tracking and enforcement</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-white text-sm">Regulatory requirement monitoring and compliance</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-white text-sm">Comprehensive audit trail maintenance</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-white text-sm">Professional liability protection documentation</span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </Tab>

                <Tab key="user-log" title="User Log">
                  <Card className="bg-white/5 backdrop-blur-xl border-0 shadow-sm rounded-2xl">
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-white">User Activity Log</h3>
                      <p className="text-gray-400 text-sm">Complete activity history for {user?.name}</p>
                    </CardHeader>
                    <CardBody>
                      <Table aria-label="User activity log">
                        <TableHeader>
                          <TableColumn>TIME</TableColumn>
                          <TableColumn>ACTION</TableColumn>
                          <TableColumn>DETAILS</TableColumn>
                          <TableColumn>IP ADDRESS</TableColumn>
                          <TableColumn>USER AGENT</TableColumn>
                        </TableHeader>
                        <TableBody>
                          {activityLog.map((activity) => (
                            <TableRow key={activity.id}>
                              <TableCell>
                                <span className="text-gray-300 text-sm">
                                  {formatTimestamp(activity.timestamp)}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  color={
                                    activity.action === "Login" ? "success" :
                                    activity.action === "Logout" ? "warning" :
                                    activity.action.includes("Access") ? "primary" :
                                    activity.action.includes("Update") ? "secondary" :
                                    "default"
                                  }
                                  variant="flat"
                                  size="sm"
                                >
                                  {activity.action}
                                </Chip>
                              </TableCell>
                              <TableCell>
                                <span className="text-gray-300 text-sm">{activity.details}</span>
                              </TableCell>
                              <TableCell>
                                <span className="text-gray-400 text-sm font-mono">{activity.ipAddress}</span>
                              </TableCell>
                              <TableCell>
                                <span className="text-gray-400 text-sm">{activity.userAgent}</span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardBody>
                  </Card>

                  <Card className="bg-white/5 backdrop-blur-xl border-0 shadow-sm rounded-2xl">
                    <CardHeader>
                      <h3 className="text-lg font-semibold text-white">Activity Summary</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-blue-500/10 rounded-xl">
                          <p className="text-2xl font-bold text-blue-400">{activityLog.length}</p>
                          <p className="text-gray-400 text-sm">Total Activities</p>
                        </div>
                        <div className="text-center p-4 bg-green-500/10 rounded-xl">
                          <p className="text-2xl font-bold text-green-400">
                            {activityLog.filter(a => a.action === "Login").length}
                          </p>
                          <p className="text-gray-400 text-sm">Login Sessions</p>
                        </div>
                        <div className="text-center p-4 bg-purple-500/10 rounded-xl">
                          <p className="text-2xl font-bold text-purple-400">
                            {activityLog.filter(a => a.action.includes("Access")).length}
                          </p>
                          <p className="text-gray-400 text-sm">Data Access Events</p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
