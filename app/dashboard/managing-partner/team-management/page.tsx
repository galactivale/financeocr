"use client";
import React, { useState, useMemo } from "react";
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
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Select,
  SelectItem,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Checkbox,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea
} from "@nextui-org/react";
import { 
  Users,
  UserCheck,
  TrendingUp,
  Award,
  BookOpen,
  Target,
  Calendar,
  BarChart3,
  Clock,
  AlertTriangle,
  CheckCircle,
  Star,
  Plus,
  Edit,
  Eye,
  Download,
  Upload,
  Filter,
  Search,
  RefreshCw,
  Settings,
  UserPlus,
  GraduationCap,
  Briefcase,
  PieChart,
  Activity,
  Zap,
  Shield,
  Brain,
  Lightbulb
} from "lucide-react";

// Mock data for team management
const staffMembers = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Senior Tax Manager",
    clients: 12,
    capacity: 85,
    skills: ["Economic Nexus", "Multi-State", "Audit Defense"],
    certifications: ["CPA", "CITP"],
    performance: 94,
    workload: "high",
    avatar: "SJ",
    status: "active"
  },
  {
    id: "2", 
    name: "Michael Chen",
    role: "Staff Accountant",
    clients: 8,
    capacity: 65,
    skills: ["Data Entry", "Compliance"],
    certifications: ["CPA Candidate"],
    performance: 87,
    workload: "medium",
    avatar: "MC",
    status: "active"
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "Tax Manager",
    clients: 15,
    capacity: 92,
    skills: ["Economic Nexus", "Research", "Client Relations"],
    certifications: ["CPA", "MST"],
    performance: 96,
    workload: "high",
    avatar: "ER",
    status: "active"
  },
  {
    id: "4",
    name: "David Kim",
    role: "Staff Accountant",
    clients: 6,
    capacity: 45,
    skills: ["Data Entry", "Basic Compliance"],
    certifications: ["CPA Candidate"],
    performance: 78,
    workload: "low",
    avatar: "DK",
    status: "active"
  }
];

const clients = [
  { id: "1", name: "TechCorp Global", complexity: "high", industry: "Technology" },
  { id: "2", name: "RetailPlus LLC", complexity: "medium", industry: "Retail" },
  { id: "3", name: "Manufacturing Co", complexity: "high", industry: "Manufacturing" },
  { id: "4", name: "ServiceHub Inc", complexity: "low", industry: "Services" },
  { id: "5", name: "E-commerce Giant", complexity: "high", industry: "E-commerce" }
];

const competencyAreas = [
  { skill: "Economic Nexus Analysis", level: 85, trend: "+5%" },
  { skill: "Multi-State Compliance", level: 78, trend: "+3%" },
  { skill: "Audit Defense", level: 92, trend: "+2%" },
  { skill: "Client Communication", level: 88, trend: "+4%" },
  { skill: "Research & Analysis", level: 81, trend: "+6%" }
];

export default function TeamManagementPage() {
  const [selectedTab, setSelectedTab] = useState("assignments");
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    skills: [] as string[],
    certifications: [] as string[],
    experience: "",
    notes: ""
  });

  const filteredStaff = useMemo(() => {
    return staffMembers.filter(staff => 
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const getWorkloadColor = (workload: string) => {
    switch (workload) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getCapacityColor = (capacity: number) => {
    if (capacity >= 90) return 'danger';
    if (capacity >= 75) return 'warning';
    return 'success';
  };

  const handleAddMember = () => {
    // Here you would typically send the data to your backend
    console.log('Adding new member:', newMember);
    
    // Reset form
    setNewMember({
      name: "",
      role: "",
      email: "",
      phone: "",
      skills: [],
      certifications: [],
      experience: "",
      notes: ""
    });
    
    // Close modal
    setIsAddMemberModalOpen(false);
    
    // You could add a success notification here
  };

  const handleSkillToggle = (skill: string) => {
    setNewMember(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleCertificationToggle = (cert: string) => {
    setNewMember(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert) 
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert]
    }));
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-8">
        {/* Header */}
        <div className="pt-8 pb-6">
          <div className="max-w-7xl mx-auto px-4 lg:px-0">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Strategic Workforce Command Center</h1>
                <p className="text-gray-400 text-sm mt-2">Comprehensive human capital management for Economic Nexus compliance operations</p>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  color="primary"
                  variant="flat"
                  startContent={<UserPlus className="w-4 h-4" />}
                  className="bg-blue-600/20 text-blue-400 border-blue-500/30"
                  onPress={() => setIsAddMemberModalOpen(true)}
                >
                  Add Team Member
                </Button>
                <Button
                  color="default"
                  variant="flat"
                  startContent={<Download className="w-4 h-4" />}
                  className="bg-gray-700/50 text-gray-300"
                >
                  Export Report
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Team Performance Overview Cards */}
        <div className="max-w-7xl mx-auto px-4 lg:px-0 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl hover:bg-gray-900/50 transition-all duration-300">
              <CardBody className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600/30 rounded-lg">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-xs font-medium uppercase tracking-wide">Total Team</p>
                    <p className="text-white font-bold text-lg">{staffMembers.length}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl hover:bg-gray-900/50 transition-all duration-300">
              <CardBody className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-600/30 rounded-lg">
                    <UserCheck className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-xs font-medium uppercase tracking-wide">Active Assignments</p>
                    <p className="text-white font-bold text-lg">{staffMembers.reduce((sum, staff) => sum + staff.clients, 0)}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl hover:bg-gray-900/50 transition-all duration-300">
              <CardBody className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-600/30 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-xs font-medium uppercase tracking-wide">Avg Performance</p>
                    <p className="text-white font-bold text-lg">{Math.round(staffMembers.reduce((sum, staff) => sum + staff.performance, 0) / staffMembers.length)}%</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl hover:bg-gray-900/50 transition-all duration-300">
              <CardBody className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-600/30 rounded-lg">
                    <Award className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-xs font-medium uppercase tracking-wide">Certifications</p>
                    <p className="text-white font-bold text-lg">{staffMembers.reduce((sum, staff) => sum + staff.certifications.length, 0)}</p>
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
                <Tab key="assignments" title={
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>Staff Assignments</span>
                  </div>
                }>
                  <div className="space-y-6">
                    {/* Assignment Matrix Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                        <h3 className="text-lg font-semibold text-white">Staff-Client Assignment Matrix</h3>
                      </div>

                      <Card className="bg-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl">
                        <CardHeader>
                          <div className="flex items-center justify-between w-full">
                            <h4 className="text-white font-medium">Assignment Overview</h4>
                            <div className="flex gap-2">
                              <Input
                                placeholder="Search staff..."
                                value={searchTerm}
                                onValueChange={setSearchTerm}
                                startContent={<Search className="w-4 h-4 text-gray-400" />}
                                className="max-w-xs"
                                variant="flat"
                                classNames={{
                                  inputWrapper: "bg-gray-800/50 border-gray-600/50",
                                  input: "text-white placeholder:text-gray-400",
                                }}
                              />
                              <Button
                                size="sm"
                                variant="flat"
                                color="default"
                                startContent={<RefreshCw className="w-4 h-4" />}
                                className="bg-gray-700/50 text-gray-300"
                              >
                                Refresh
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardBody>
                          <Table aria-label="Staff assignment matrix">
                            <TableHeader>
                              <TableColumn>STAFF MEMBER</TableColumn>
                              <TableColumn>ROLE</TableColumn>
                              <TableColumn>CLIENTS</TableColumn>
                              <TableColumn>CAPACITY</TableColumn>
                              <TableColumn>PERFORMANCE</TableColumn>
                              <TableColumn>ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody>
                              {filteredStaff.map((staff) => (
                                <TableRow key={staff.id}>
                                  <TableCell>
                                    <div className="flex items-center gap-3">
                                      <Avatar
                                        name={staff.avatar}
                                        className="w-8 h-8 text-tiny"
                                        color={getCapacityColor(staff.capacity) as any}
                                      />
                                      <div>
                                        <p className="text-white font-medium">{staff.name}</p>
                                        <p className="text-gray-400 text-sm">{staff.certifications.join(", ")}</p>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Chip size="sm" variant="flat" color="primary">
                                      {staff.role}
                                    </Chip>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <span className="text-white font-medium">{staff.clients}</span>
                                      <Chip
                                        size="sm"
                                        variant="flat"
                                        color={getWorkloadColor(staff.workload) as any}
                                      >
                                        {staff.workload}
                                      </Chip>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Progress
                                        value={staff.capacity}
                                        className="max-w-20"
                                        color={getCapacityColor(staff.capacity) as any}
                                        size="sm"
                                      />
                                      <span className="text-white text-sm">{staff.capacity}%</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <span className="text-white font-medium">{staff.performance}%</span>
                                      <TrendingUp className="w-4 h-4 text-green-400" />
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex gap-2">
                                      <Tooltip content="View Details">
                                        <Button size="sm" variant="flat" color="default" isIconOnly>
                                          <Eye className="w-4 h-4" />
                                        </Button>
                                      </Tooltip>
                                      <Tooltip content="Edit Assignments">
                                        <Button size="sm" variant="flat" color="primary" isIconOnly>
                                          <Edit className="w-4 h-4" />
                                        </Button>
                                      </Tooltip>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardBody>
                      </Card>
                    </div>

                    {/* Workload Distribution Dashboard */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                        <h3 className="text-lg font-semibold text-white">Workload Distribution Dashboard</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredStaff.map((staff) => (
                          <Card key={staff.id} className="bg-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl">
                            <CardBody className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <Avatar
                                    name={staff.avatar}
                                    className="w-10 h-10"
                                    color={getCapacityColor(staff.capacity) as any}
                                  />
                                  <div>
                                    <h4 className="text-white font-semibold">{staff.name}</h4>
                                    <p className="text-gray-400 text-sm">{staff.role}</p>
                                  </div>
                                </div>
                                <Chip
                                  size="sm"
                                  variant="flat"
                                  color={getWorkloadColor(staff.workload) as any}
                                >
                                  {staff.workload.toUpperCase()}
                                </Chip>
                              </div>
                              
                              <div className="space-y-3">
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-400">Capacity Utilization</span>
                                    <span className="text-white">{staff.capacity}%</span>
                                  </div>
                                  <Progress
                                    value={staff.capacity}
                                    color={getCapacityColor(staff.capacity) as any}
                                    className="w-full"
                                  />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-400">Active Clients:</span>
                                    <span className="text-white ml-2 font-medium">{staff.clients}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">Performance:</span>
                                    <span className="text-white ml-2 font-medium">{staff.performance}%</span>
                                  </div>
                                </div>
                                
                                <div>
                                  <span className="text-gray-400 text-sm">Skills:</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {staff.skills.map((skill, index) => (
                                      <Chip key={index} size="sm" variant="flat" className="text-xs">
                                        {skill}
                                      </Chip>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </Tab>

                <Tab key="development" title={
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>Professional Development</span>
                  </div>
                }>
                  <div className="space-y-6">
                    {/* Competency Assessment Dashboard */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                        <h3 className="text-lg font-semibold text-white">Competency Assessment Dashboard</h3>
                      </div>

                      <Card className="bg-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl">
                        <CardHeader>
                          <h4 className="text-white font-medium">Team Skill Matrix</h4>
                        </CardHeader>
                        <CardBody>
                          <div className="space-y-4">
                            {competencyAreas.map((area, index) => (
                              <div key={index} className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-white font-medium">{area.skill}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-white text-sm">{area.level}%</span>
                                    <Chip size="sm" variant="flat" color="success">
                                      {area.trend}
                                    </Chip>
                                  </div>
                                </div>
                                <Progress
                                  value={area.level}
                                  color="primary"
                                  className="w-full"
                                />
                              </div>
                            ))}
                          </div>
                        </CardBody>
                      </Card>
                    </div>

                    {/* Training Programs */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                        <h3 className="text-lg font-semibold text-white">Training & Development Programs</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl">
                          <CardBody className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 bg-blue-600/30 rounded-lg">
                                <BookOpen className="w-5 h-5 text-blue-400" />
                              </div>
                              <div>
                                <h4 className="text-white font-semibold">Economic Nexus Specialization</h4>
                                <p className="text-gray-400 text-sm">Advanced certification program</p>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Progress</span>
                                <span className="text-white">3/5 modules</span>
                              </div>
                              <Progress value={60} color="primary" />
                              <div className="flex gap-2">
                                <Button size="sm" color="primary" variant="flat">
                                  Continue
                                </Button>
                                <Button size="sm" variant="flat" color="default">
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </CardBody>
                        </Card>

                        <Card className="bg-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl">
                          <CardBody className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 bg-green-600/30 rounded-lg">
                                <Users className="w-5 h-5 text-green-400" />
                              </div>
                              <div>
                                <h4 className="text-white font-semibold">Mentorship Program</h4>
                                <p className="text-gray-400 text-sm">Senior-junior pairing system</p>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Active Pairs</span>
                                <span className="text-white">4 pairs</span>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" color="success" variant="flat">
                                  Manage
                                </Button>
                                <Button size="sm" variant="flat" color="default">
                                  View Reports
                                </Button>
                              </div>
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
              {/* Team Analytics Card */}
              <Card className="bg-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl hover:bg-gray-900/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-white">Team Analytics</h3>
                  </div>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div>
                    <p className="text-gray-300 text-sm">Average Capacity</p>
                    <p className="text-white font-semibold">
                      {Math.round(staffMembers.reduce((sum, staff) => sum + staff.capacity, 0) / staffMembers.length)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">High Performers</p>
                    <p className="text-white font-semibold">
                      {staffMembers.filter(staff => staff.performance >= 90).length}/{staffMembers.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Certified Professionals</p>
                    <p className="text-white font-semibold">
                      {staffMembers.filter(staff => staff.certifications.includes('CPA')).length}/{staffMembers.length}
                    </p>
                  </div>
                  <Button
                    color="primary"
                    variant="flat"
                    startContent={<BarChart3 className="w-4 h-4" />}
                    className="w-full bg-blue-600/20 text-blue-400 border-blue-500/30"
                  >
                    View Detailed Analytics
                  </Button>
                </CardBody>
              </Card>

              {/* Quick Actions Card */}
              <Card className="bg-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl hover:bg-gray-900/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
                  </div>
                </CardHeader>
                <CardBody className="space-y-3">
                  <Button
                    variant="flat"
                    color="default"
                    startContent={<UserPlus className="w-4 h-4" />}
                    className="w-full justify-start bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                    onPress={() => setIsAddMemberModalOpen(true)}
                  >
                    Add New Team Member
                  </Button>
                  <Button
                    variant="flat"
                    color="default"
                    startContent={<Target className="w-4 h-4" />}
                    className="w-full justify-start bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                  >
                    Create Assignment
                  </Button>
                  <Button
                    variant="flat"
                    color="default"
                    startContent={<BookOpen className="w-4 h-4" />}
                    className="w-full justify-start bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                  >
                    Schedule Training
                  </Button>
                  <Button
                    variant="flat"
                    color="default"
                    startContent={<Download className="w-4 h-4" />}
                    className="w-full justify-start bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                  >
                    Export Team Report
                  </Button>
                </CardBody>
              </Card>

              {/* Performance Insights Card */}
              <Card className="bg-black/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl hover:bg-gray-900/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-white">Performance Insights</h3>
                  </div>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300 text-sm">Team performance up 8% this quarter</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-400" />
                      <span className="text-gray-300 text-sm">2 team members near capacity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300 text-sm">3 new certifications earned</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Add Team Member Modal */}
      <Modal 
        isOpen={isAddMemberModalOpen} 
        onOpenChange={setIsAddMemberModalOpen}
        size="2xl"
        classNames={{
          base: "bg-black/95 backdrop-blur-xl",
          header: "border-b border-gray-700/50",
          body: "py-6",
          footer: "border-t border-gray-700/50"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold text-white">Add New Team Member</h2>
                <p className="text-gray-400 text-sm">Add a new team member to your Economic Nexus compliance team</p>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-white">Basic Information</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Full Name"
                        placeholder="Enter full name"
                        value={newMember.name}
                        onValueChange={(value) => setNewMember(prev => ({ ...prev, name: value }))}
                        variant="flat"
                        classNames={{
                          inputWrapper: "bg-gray-800/50 border-gray-600/50",
                          input: "text-white",
                          label: "text-gray-400"
                        }}
                      />
                      <Input
                        label="Email Address"
                        placeholder="Enter email address"
                        type="email"
                        value={newMember.email}
                        onValueChange={(value) => setNewMember(prev => ({ ...prev, email: value }))}
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
                        label="Phone Number"
                        placeholder="Enter phone number"
                        value={newMember.phone}
                        onValueChange={(value) => setNewMember(prev => ({ ...prev, phone: value }))}
                        variant="flat"
                        classNames={{
                          inputWrapper: "bg-gray-800/50 border-gray-600/50",
                          input: "text-white",
                          label: "text-gray-400"
                        }}
                      />
                      <Select
                        label="Role"
                        placeholder="Select role"
                        selectedKeys={newMember.role ? [newMember.role] : []}
                        onSelectionChange={(keys) => setNewMember(prev => ({ ...prev, role: Array.from(keys)[0] as string }))}
                        variant="flat"
                        classNames={{
                          trigger: "bg-gray-800/50 border-gray-600/50",
                          value: "text-white",
                          label: "text-gray-400"
                        }}
                      >
                        <SelectItem key="Senior Tax Manager" value="Senior Tax Manager">Senior Tax Manager</SelectItem>
                        <SelectItem key="Tax Manager" value="Tax Manager">Tax Manager</SelectItem>
                        <SelectItem key="Staff Accountant" value="Staff Accountant">Staff Accountant</SelectItem>
                        <SelectItem key="Junior Accountant" value="Junior Accountant">Junior Accountant</SelectItem>
                        <SelectItem key="Tax Specialist" value="Tax Specialist">Tax Specialist</SelectItem>
                      </Select>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-white">Skills & Expertise</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-gray-400 text-sm">Select relevant skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {["Economic Nexus", "Multi-State Compliance", "Audit Defense", "Data Entry", "Client Relations", "Research & Analysis", "Tax Preparation", "Regulatory Compliance"].map((skill) => (
                          <Chip
                            key={skill}
                            size="sm"
                            variant={newMember.skills.includes(skill) ? "solid" : "flat"}
                            color={newMember.skills.includes(skill) ? "primary" : "default"}
                            className={newMember.skills.includes(skill) ? "bg-blue-600/20 text-blue-400" : "bg-gray-700/50 text-gray-300"}
                            onClick={() => handleSkillToggle(skill)}
                          >
                            {skill}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-white">Certifications</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-gray-400 text-sm">Select certifications:</p>
                      <div className="flex flex-wrap gap-2">
                        {["CPA", "CPA Candidate", "CITP", "MST", "EA", "CTEC"].map((cert) => (
                          <Chip
                            key={cert}
                            size="sm"
                            variant={newMember.certifications.includes(cert) ? "solid" : "flat"}
                            color={newMember.certifications.includes(cert) ? "success" : "default"}
                            className={newMember.certifications.includes(cert) ? "bg-green-600/20 text-green-400" : "bg-gray-700/50 text-gray-300"}
                            onClick={() => handleCertificationToggle(cert)}
                          >
                            {cert}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Experience & Notes */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-white">Additional Information</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <Input
                        label="Years of Experience"
                        placeholder="e.g., 5 years"
                        value={newMember.experience}
                        onValueChange={(value) => setNewMember(prev => ({ ...prev, experience: value }))}
                        variant="flat"
                        classNames={{
                          inputWrapper: "bg-gray-800/50 border-gray-600/50",
                          input: "text-white",
                          label: "text-gray-400"
                        }}
                      />
                      <Textarea
                        label="Notes"
                        placeholder="Additional notes about the team member..."
                        value={newMember.notes}
                        onValueChange={(value) => setNewMember(prev => ({ ...prev, notes: value }))}
                        variant="flat"
                        classNames={{
                          inputWrapper: "bg-gray-800/50 border-gray-600/50",
                          input: "text-white",
                          label: "text-gray-400"
                        }}
                      />
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button 
                  color="default" 
                  variant="flat" 
                  onPress={onClose}
                  className="bg-gray-700/50 text-gray-300"
                >
                  Cancel
                </Button>
                <Button 
                  color="primary" 
                  onPress={handleAddMember}
                  className="bg-blue-600/20 text-blue-400 border-blue-500/30"
                  isDisabled={!newMember.name || !newMember.role || !newMember.email}
                >
                  Add Team Member
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
