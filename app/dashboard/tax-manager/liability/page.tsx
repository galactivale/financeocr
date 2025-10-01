"use client";
import React, { useState } from "react";
import { 
  Card, 
  CardBody, 
  Button, 
  Chip,
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell
} from "@nextui-org/react";
import { 
  Shield, 
  AlertTriangle, 
  FileText, 
  Users,
  CheckCircle,
  Clock,
  Plus,
  Search,
  RefreshCw,
  Eye,
  Edit,
  Download
} from "lucide-react";
import Link from "next/link";

// Decision record interface
interface DecisionRecord {
  id: string;
  client: string;
  decisionType: string;
  date: string;
  status: "draft" | "peer_review" | "finalized";
  riskLevel: "low" | "medium" | "high" | "critical";
  exposure: number;
  description: string;
  peerReviewer?: string;
  finalizedDate?: string;
}

// Sample data
const decisionRecords: DecisionRecord[] = [
  {
    id: "DEC-001",
    client: "TechCorp SaaS",
    decisionType: "Nexus Registration",
    date: "2024-01-15",
    status: "finalized",
    riskLevel: "high",
    exposure: 125000,
    description: "Recommended immediate CA registration due to economic nexus threshold",
    peerReviewer: "Mike Johnson, CPA",
    finalizedDate: "2024-01-16"
  },
  {
    id: "DEC-002",
    client: "GrowthCo Inc",
    decisionType: "Voluntary Disclosure",
    date: "2024-01-12",
    status: "peer_review",
    riskLevel: "critical",
    exposure: 250000,
    description: "Advising client to file voluntary disclosure for 3-year back period",
    peerReviewer: "Sarah Wilson, CPA"
  },
  {
    id: "DEC-003",
    client: "StartupXYZ",
    decisionType: "Penalty Assessment",
    date: "2024-01-10",
    status: "draft",
    riskLevel: "medium",
    exposure: 45000,
    description: "Client received penalty notice, evaluating appeal vs payment"
  }
];

export default function TaxManagerLiability() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<DecisionRecord | null>(null);

  // Filter records based on search term
  const filteredRecords = decisionRecords.filter(record =>
    record.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.decisionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'danger';
      case 'critical': return 'danger';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'warning';
      case 'peer_review': return 'primary';
      case 'finalized': return 'success';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Apple-style Header */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-white tracking-tight">Professional Liability</h1>
                <p className="text-gray-400 text-sm">Legal protection through documented decisions</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/dashboard/tax-manager/liability/decision-builder">
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-600/25"
                  startContent={<Plus className="w-4 h-4" />}
                >
                  New Decision Record
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Risk Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Exposure</p>
                  <p className="text-3xl font-bold text-red-500 mt-1">$847K</p>
                </div>
                <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">High-Risk Clients</p>
                  <p className="text-3xl font-bold text-orange-500 mt-1">12</p>
                </div>
                <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Pending Documentation</p>
                  <p className="text-3xl font-bold text-yellow-500 mt-1">3</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Peer Review Backlog</p>
                  <p className="text-3xl font-bold text-blue-500 mt-1">2</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
            <CardBody className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center">
                  <Plus className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Create Decision Record</h3>
                  <p className="text-gray-400 text-sm">Document professional decisions</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
            <CardBody className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Peer Reviews</h3>
                  <p className="text-gray-400 text-sm">2 pending reviews</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
            <CardBody className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Recent Decisions</h3>
                  <p className="text-gray-400 text-sm">View latest records</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Search and Controls Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search decisions..."
                className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all duration-200 w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
              startContent={<RefreshCw className="w-4 h-4" />}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Decision Log Table */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white tracking-tight">Decision Log</h2>
          </div>
          <div className="divide-y divide-white/10">
            {filteredRecords.map((record) => (
              <div key={record.id} className="p-6 hover:bg-white/5 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{record.client}</h3>
                      <p className="text-gray-400 text-sm">{record.decisionType} • {record.date}</p>
                      <p className="text-gray-500 text-xs mt-1">{record.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-white font-semibold">{formatCurrency(record.exposure)}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Chip
                          size="sm"
                          color={getRiskColor(record.riskLevel)}
                          variant="flat"
                          className="text-xs"
                        >
                          {record.riskLevel.toUpperCase()}
                        </Chip>
                        <Chip
                          size="sm"
                          color={getStatusColor(record.status)}
                          variant="flat"
                          className="text-xs"
                        >
                          {record.status.replace('_', ' ').toUpperCase()}
                        </Chip>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-white"
                        startContent={<Eye className="w-4 h-4" />}
                        onPress={() => setSelectedRecord(record)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
                        startContent={<Edit className="w-4 h-4" />}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Standards Compliance Tracker */}
        <div className="mt-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-semibold text-white tracking-tight mb-6">Standards Compliance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <div>
                <p className="text-white font-medium">Critical Decisions Documented</p>
                <p className="text-gray-400 text-sm">100% compliance rate</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <div>
                <p className="text-white font-medium">Peer Review Timeliness</p>
                <p className="text-gray-400 text-sm">94% within 48 hours</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
              <div>
                <p className="text-white font-medium">Follow-up Required</p>
                <p className="text-gray-400 text-sm">3 decisions over 30 days old</p>
              </div>
            </div>
          </div>
        </div>

        {/* Templates & Resources */}
        <div className="mt-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-semibold text-white tracking-tight mb-6">Templates & Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="bordered"
              className="bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 rounded-xl h-auto p-4"
            >
              <div className="text-left">
                <p className="text-white font-medium">Decision Templates</p>
                <p className="text-gray-400 text-xs">Pre-built forms</p>
              </div>
            </Button>
            <Button
              variant="bordered"
              className="bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 rounded-xl h-auto p-4"
            >
              <div className="text-left">
                <p className="text-white font-medium">State Statutes</p>
                <p className="text-gray-400 text-xs">Legal references</p>
              </div>
            </Button>
            <Button
              variant="bordered"
              className="bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 rounded-xl h-auto p-4"
            >
              <div className="text-left">
                <p className="text-white font-medium">Standards Guide</p>
                <p className="text-gray-400 text-xs">Professional guidelines</p>
              </div>
            </Button>
            <Button
              variant="bordered"
              className="bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 rounded-xl h-auto p-4"
            >
              <div className="text-left">
                <p className="text-white font-medium">Insurance Forms</p>
                <p className="text-gray-400 text-xs">Notification templates</p>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Decision Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">Decision Details</h2>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                  onPress={() => setSelectedRecord(null)}
                >
                  ×
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{selectedRecord.client}</h3>
                  <p className="text-gray-400">{selectedRecord.decisionType}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-400 text-sm">Risk Level</p>
                  <Chip
                    size="sm"
                    color={getRiskColor(selectedRecord.riskLevel)}
                    variant="flat"
                    className="mt-1"
                  >
                    {selectedRecord.riskLevel.toUpperCase()}
                  </Chip>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-400 text-sm">Exposure</p>
                  <p className="text-white font-medium mt-1">{formatCurrency(selectedRecord.exposure)}</p>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-2">Description</p>
                <p className="text-white">{selectedRecord.description}</p>
              </div>

              {selectedRecord.peerReviewer && (
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-2">Peer Reviewer</p>
                  <p className="text-white">{selectedRecord.peerReviewer}</p>
                </div>
              )}

              <div className="flex space-x-3">
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
                  startContent={<Download className="w-4 h-4" />}
                >
                  Download Record
                </Button>
                <Button
                  variant="bordered"
                  className="bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 rounded-xl"
                >
                  Edit Record
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}