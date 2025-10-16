"use client";
import React, { useState, useMemo } from "react";
import { 
  Card, 
  CardBody, 
  Button, 
  Chip, 
  Input,
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem
} from "@nextui-org/react";
import { 
  Mail, 
  Phone, 
  Send, 
  Plus, 
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  RefreshCw,
  ChevronRight,
  Filter,
  X
} from "lucide-react";
import { useCommunications } from "@/hooks/useApi";
import { usePersonalizedDashboard } from "@/contexts/PersonalizedDashboardContext";

// Communication data structure from API
interface Communication {
  id: string;
  type: 'email' | 'sms';
  subject: string;
  content: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  sentDate: string;
  deliveryDate?: string;
  readDate?: string;
  failureReason?: string;
  professionalReasoning?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  organizationId: string;
  clientId: string;
  alertId: string;
  client: {
    id: string;
    name: string;
    slug: string;
    industry: string;
    primaryContactEmail?: string;
    primaryContactPhone?: string;
  };
  alert: {
    id: string;
    title: string;
    issue: string;
    stateCode: string;
    stateName: string;
    currentAmount: number;
    thresholdAmount: number;
    penaltyRisk: number;
    priority: string;
    severity: string;
    status: string;
    deadline: string;
  };
}

export default function CommunicationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSendForm, setShowSendForm] = useState(false);
  const [selectedCommunication, setSelectedCommunication] = useState<Communication | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  const [newCommunication, setNewCommunication] = useState({
    type: "email" as const,
    client: "",
    subject: "",
    content: ""
  });

  // Fetch communications data
  const { data: communicationsData, loading: communicationsLoading, error: communicationsError } = useCommunications();
  const communications = communicationsData || [];

  // Filter communications
  const filteredCommunications = communications.filter(comm =>
    comm.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comm.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistics
  const stats = {
    total: communications.length,
    sent: communications.filter(c => c.status === 'sent').length,
    delivered: communications.filter(c => c.status === 'delivered').length,
    read: communications.filter(c => c.status === 'read').length,
    failed: communications.filter(c => c.status === 'failed').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'warning';
      case 'delivered': return 'primary';
      case 'read': return 'success';
      case 'failed': return 'danger';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Clock className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'read': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'email' ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />;
  };

  const handleSendCommunication = () => {
    setShowSendForm(false);
    setNewCommunication({ type: "email", client: "", subject: "", content: "" });
  };

  const handleViewDetails = (communication: any) => {
    setSelectedCommunication(communication);
    onOpen();
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Apple-style Header */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-white tracking-tight">Communications</h1>
                <p className="text-gray-400 text-sm">Client communication management</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/25"
                startContent={<Plus className="w-4 h-4" />}
                onPress={() => setShowSendForm(true)}
              >
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Apple-style Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Sent</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Delivered</p>
                  <p className="text-3xl font-bold text-blue-500 mt-1">{stats.delivered}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Read</p>
                  <p className="text-3xl font-bold text-green-500 mt-1">{stats.read}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Failed</p>
                  <p className="text-3xl font-bold text-red-500 mt-1">{stats.failed}</p>
                </div>
                <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-400" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Send Communication Form */}
        {showSendForm && (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8 shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-1 h-6 bg-green-500 rounded-full"></div>
              <h2 className="text-xl font-semibold text-white tracking-tight">Send New Communication</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Type</label>
                <select
                  value={newCommunication.type}
                  onChange={(e) => setNewCommunication(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
                >
                  <option value="email" className="bg-gray-800">Email</option>
                  <option value="sms" className="bg-gray-800">SMS</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Client</label>
                <Input
                  placeholder="Enter client name"
                  value={newCommunication.client}
                  onValueChange={(value) => setNewCommunication(prev => ({ ...prev, client: value }))}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium text-white mb-2 block">Subject</label>
              <Input
                placeholder="Enter message subject"
                value={newCommunication.subject}
                onValueChange={(value) => setNewCommunication(prev => ({ ...prev, subject: value }))}
                className="bg-white/5 border-white/10 text-white placeholder-gray-400"
              />
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium text-white mb-2 block">Message Content</label>
              <textarea
                placeholder="Enter your message..."
                value={newCommunication.content}
                onChange={(e) => setNewCommunication(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-400 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-300 hover:scale-105"
                startContent={<Send className="w-4 h-4" />}
                onPress={handleSendCommunication}
              >
                Send Message
              </Button>
              <Button
                variant="bordered"
                className="bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/20 rounded-xl transition-all duration-300 hover:scale-105"
                onPress={() => setShowSendForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Apple-style Search and Controls */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl mb-8">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search communications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  size="sm"
                  className="bg-white/5 text-gray-300 hover:bg-white/10 rounded-xl"
                  startContent={<RefreshCw className="w-4 h-4" />}
                >
                  Refresh
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Communications List */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              <h2 className="text-xl font-semibold text-white tracking-tight">Recent Communications</h2>
            </div>
          </div>
          
          <div className="p-6">
            <Table aria-label="Communications table" className="text-white">
              <TableHeader>
                <TableColumn className="text-white font-semibold">TYPE</TableColumn>
                <TableColumn className="text-white font-semibold">CLIENT</TableColumn>
                <TableColumn className="text-white font-semibold">SUBJECT</TableColumn>
                <TableColumn className="text-white font-semibold">STATUS</TableColumn>
                <TableColumn className="text-white font-semibold">DATE</TableColumn>
                <TableColumn className="text-white font-semibold">ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredCommunications.map((comm) => (
                  <TableRow key={comm.id} className="hover:bg-white/5">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                          {getTypeIcon(comm.type)}
                        </div>
                        <div className="text-gray-300 capitalize">{comm.type}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-gray-300">{comm.client?.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-white">{comm.subject}</div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        color={getStatusColor(comm.status)}
                        variant="flat"
                        startContent={getStatusIcon(comm.status)}
                        className={comm.status === 'sent' ? 'bg-yellow-500/20 text-yellow-400' : 
                                   comm.status === 'delivered' ? 'bg-blue-500/20 text-blue-400' : 
                                   comm.status === 'read' ? 'bg-green-500/20 text-green-400' : 
                                   'bg-red-500/20 text-red-400'}
                      >
                        {comm.status.charAt(0).toUpperCase() + comm.status.slice(1)}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="text-gray-300">{comm.sentDate}</div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="light"
                        className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-xl transition-all duration-300 hover:scale-105"
                        startContent={<Eye className="w-3 h-3" />}
                        onPress={() => handleViewDetails(comm)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Communication Details Modal */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        size="2xl"
        classNames={{
          base: "bg-black/95 backdrop-blur-xl border-white/10",
          header: "border-b border-white/10",
          body: "py-6",
          footer: "border-t border-white/10"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    {selectedCommunication && getTypeIcon(selectedCommunication.type)}
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-semibold">Communication Details</h3>
                    <p className="text-gray-400 text-sm">{selectedCommunication?.subject}</p>
                  </div>
                </div>
              </ModalHeader>

              <ModalBody>
                {selectedCommunication && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400">Type</label>
                        <div className="flex items-center gap-2 mt-1">
                          {getTypeIcon(selectedCommunication.type)}
                          <span className="text-white capitalize">{selectedCommunication.type}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Status</label>
                        <div className="mt-1">
                          <Chip
                            size="sm"
                            color={getStatusColor(selectedCommunication.status)}
                            variant="flat"
                            startContent={getStatusIcon(selectedCommunication.status)}
                            className={selectedCommunication.status === 'sent' ? 'bg-yellow-500/20 text-yellow-400' : 
                                       selectedCommunication.status === 'delivered' ? 'bg-blue-500/20 text-blue-400' : 
                                       selectedCommunication.status === 'read' ? 'bg-green-500/20 text-green-400' : 
                                       'bg-red-500/20 text-red-400'}
                          >
                            {selectedCommunication.status}
                          </Chip>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Client</label>
                        <div className="text-white mt-1">{selectedCommunication.client?.name}</div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Date</label>
                        <div className="text-white mt-1">{selectedCommunication.sentDate}</div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400">Message Content</label>
                      <div className="mt-2 p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="text-white whitespace-pre-wrap">{selectedCommunication.content}</div>
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>

              <ModalFooter>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                      onPress={onClose}
                    >
                      Close
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/25"
                      startContent={<Send className="w-4 h-4" />}
                    >
                      Reply
                    </Button>
                  </div>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}