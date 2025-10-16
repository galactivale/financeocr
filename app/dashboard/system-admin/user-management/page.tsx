"use client";
import React, { useState, useMemo } from "react";
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
  Tooltip,
  Avatar,
  Select,
  SelectItem,
  Checkbox,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import NextLink from "next/link";
import { 
  SearchIcon,
  Download,
  MoreVertical,
  UserX,
  Shield,
  Key,
  Settings
} from "lucide-react";

// User data structure
interface User {
  id: string;
  name: string;
  email: string;
  firm: string;
  role: "Managing Partner" | "Tax Manager" | "Staff Accountant" | "System Admin";
  lastLogin: string;
  status: "Active" | "Inactive" | "Suspended" | "Pending";
  cpaLicense?: string;
  mfaEnabled: boolean;
  loginCount: number;
  createdAt: string;
}

const users: User[] = [
  {
    id: "1",
    name: "Michael Thompson, CPA",
    email: "michael.thompson@democpa.com",
    firm: "Demo CPA Firm",
    role: "Managing Partner",
    lastLogin: "2024-11-28T14:30:00Z",
    status: "Active",
    cpaLicense: "CA-12345",
    mfaEnabled: true,
    loginCount: 127,
    createdAt: "2023-01-15T00:00:00Z"
  },
  {
    id: "2",
    name: "Sarah Johnson, CPA",
    email: "sarah.johnson@thompsonassoc.com",
    firm: "Thompson & Associates",
    role: "Tax Manager",
    lastLogin: "2024-11-28T13:45:00Z",
    status: "Active",
    cpaLicense: "TX-67890",
    mfaEnabled: true,
    loginCount: 89,
    createdAt: "2023-03-22T00:00:00Z"
  },
  {
    id: "3",
    name: "David Chen",
    email: "david.chen@metrotax.com",
    firm: "Metro Tax Services",
    role: "Staff Accountant",
    lastLogin: "2024-11-27T16:20:00Z",
    status: "Active",
    mfaEnabled: false,
    loginCount: 45,
    createdAt: "2023-06-10T00:00:00Z"
  },
  {
    id: "4",
    name: "Lisa Rodriguez, CPA",
    email: "lisa.rodriguez@regionaltax.com",
    firm: "Regional Tax Group",
    role: "Tax Manager",
    lastLogin: "2024-11-26T11:15:00Z",
    status: "Inactive",
    cpaLicense: "FL-54321",
    mfaEnabled: true,
    loginCount: 67,
    createdAt: "2023-02-08T00:00:00Z"
  },
  {
    id: "5",
    name: "Robert Kim",
    email: "robert.kim@startupinc.com",
    firm: "Startup Inc",
    role: "Staff Accountant",
    lastLogin: "2024-11-25T09:30:00Z",
    status: "Suspended",
    mfaEnabled: false,
    loginCount: 23,
    createdAt: "2023-08-15T00:00:00Z"
  },
  {
    id: "6",
    name: "Jennifer Walsh, CPA",
    email: "jennifer.walsh@servicescorp.com",
    firm: "Services Corp",
    role: "Managing Partner",
    lastLogin: "2024-11-28T15:10:00Z",
    status: "Active",
    cpaLicense: "NY-98765",
    mfaEnabled: true,
    loginCount: 156,
    createdAt: "2022-11-30T00:00:00Z"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active": return "success";
    case "Inactive": return "warning";
    case "Suspended": return "danger";
    case "Pending": return "primary";
    default: return "default";
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case "Managing Partner": return "primary";
    case "Tax Manager": return "secondary";
    case "Staff Accountant": return "success";
    case "System Admin": return "warning";
    default: return "default";
  }
};

const formatLastLogin = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [firmFilter, setFirmFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.firm.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesFirm = firmFilter === "all" || user.firm === firmFilter;
      
      return matchesSearch && matchesStatus && matchesRole && matchesFirm;
    });
  }, [searchTerm, statusFilter, roleFilter, firmFilter]);

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length 
        ? [] 
        : filteredUsers.map(user => user.id)
    );
  };

  const uniqueFirms = useMemo(() => {
    return Array.from(new Set(users.map(user => user.firm)));
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-6">
        {/* Header */}
        <div className="pt-6 pb-6">
          <div className="max-w-7xl mx-auto px-4 lg:px-0">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">User Management</h1>
                <p className="text-lg text-gray-400 mt-2">Multi-tenant user administration and security management</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Total Users</div>
                <div className="text-base font-medium text-white">{users.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* User Management Content */}
        <div className="max-w-7xl mx-auto px-4 lg:px-0">
          <div className="space-y-6">
            {/* Filters and Search */}
            <div className="flex gap-4 items-center flex-wrap">
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onValueChange={setSearchTerm}
                startContent={<SearchIcon />}
                className="max-w-xs"
              />
              <Select
                placeholder="Filter by status"
                selectedKeys={[statusFilter]}
                onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as string)}
                className="max-w-xs"
              >
                <SelectItem key="all" value="all">All Statuses</SelectItem>
                <SelectItem key="Active" value="Active">Active</SelectItem>
                <SelectItem key="Inactive" value="Inactive">Inactive</SelectItem>
                <SelectItem key="Suspended" value="Suspended">Suspended</SelectItem>
                <SelectItem key="Pending" value="Pending">Pending</SelectItem>
              </Select>
              <Select
                placeholder="Filter by role"
                selectedKeys={[roleFilter]}
                onSelectionChange={(keys) => setRoleFilter(Array.from(keys)[0] as string)}
                className="max-w-xs"
              >
                <SelectItem key="all" value="all">All Roles</SelectItem>
                <SelectItem key="Managing Partner" value="Managing Partner">Managing Partner</SelectItem>
                <SelectItem key="Tax Manager" value="Tax Manager">Tax Manager</SelectItem>
                <SelectItem key="Staff Accountant" value="Staff Accountant">Staff Accountant</SelectItem>
                <SelectItem key="System Admin" value="System Admin">System Admin</SelectItem>
              </Select>
              <Select
                placeholder="Filter by firm"
                selectedKeys={[firmFilter]}
                onSelectionChange={(keys) => setFirmFilter(Array.from(keys)[0] as string)}
                className="max-w-xs"
                items={[{ key: "all", value: "all", label: "All Firms" }, ...uniqueFirms.map(firm => ({ key: firm, value: firm, label: firm }))]}
              >
                {(item) => (
                  <SelectItem key={item.key} value={item.value}>
                    {item.label}
                  </SelectItem>
                )}
              </Select>
              <Button
                color="primary"
                variant="flat"
                startContent={<Download className="w-4 h-4" />}
              >
                Export
              </Button>
            </div>

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
              <Card className="bg-blue-500/10 border border-blue-500/20">
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400 font-medium">
                      {selectedUsers.length} user(s) selected
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="flat" color="primary">
                        Change Status
                      </Button>
                      <Button size="sm" variant="flat" color="secondary">
                        Send Notification
                      </Button>
                      <Button size="sm" variant="flat" color="danger">
                        Bulk Suspend
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Users Table */}
            <Card className="bg-white/5 backdrop-blur-xl border-0 shadow-sm rounded-2xl">
              <CardHeader className="pb-4">
                <h3 className="text-lg font-semibold text-white">Platform Users ({filteredUsers.length})</h3>
              </CardHeader>
              <CardBody>
                <Table aria-label="Users table">
                  <TableHeader>
                    <TableColumn>
                      <Checkbox
                        isSelected={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        isIndeterminate={selectedUsers.length > 0 && selectedUsers.length < filteredUsers.length}
                        onValueChange={handleSelectAll}
                      />
                    </TableColumn>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>EMAIL</TableColumn>
                    <TableColumn>FIRM/TENANT</TableColumn>
                    <TableColumn>ROLE</TableColumn>
                    <TableColumn>LAST LOGIN</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow 
                        key={user.id}
                        className="cursor-pointer hover:bg-white/5 transition-colors"
                        onClick={() => window.location.href = `/dashboard/system-admin/user-management/users?user-id=${user.id}`}
                      >
                        <TableCell>
                          <Checkbox
                            isSelected={selectedUsers.includes(user.id)}
                            onValueChange={() => handleSelectUser(user.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar
                              name={user.name}
                              size="sm"
                              className="bg-blue-500/20 text-blue-400"
                            />
                            <div>
                              <p className="font-medium text-white text-sm">{user.name}</p>
                              {user.cpaLicense && (
                                <p className="text-xs text-gray-400">License: {user.cpaLicense}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-300 text-sm">{user.email}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-300 text-sm">{user.firm}</span>
                        </TableCell>
                        <TableCell>
                          <Chip
                            color={getRoleColor(user.role)}
                            variant="flat"
                            size="sm"
                          >
                            {user.role}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-300 text-sm">{formatLastLogin(user.lastLogin)}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Chip
                              color={getStatusColor(user.status)}
                              variant="flat"
                              size="sm"
                            >
                              {user.status}
                            </Chip>
                            {user.mfaEnabled && (
                              <Tooltip content="MFA Enabled">
                                <Shield className="w-4 h-4 text-green-400" />
                              </Tooltip>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Dropdown>
                            <DropdownTrigger>
                              <Button 
                                size="sm" 
                                variant="flat" 
                                color="default" 
                                isIconOnly
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                              <DropdownItem key="reset-password">
                                <Key className="w-4 h-4" />
                                Reset Password
                              </DropdownItem>
                              <DropdownItem key="suspend">
                                <UserX className="w-4 h-4" />
                                Suspend Account
                              </DropdownItem>
                              <DropdownItem key="notify">
                                <Settings className="w-4 h-4" />
                                Send Notification
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
