"use client";
import React, { useState } from "react";
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
  TableCell
} from "@nextui-org/react";
import { 
  FileText, 
  Download, 
  Plus, 
  Calendar,
  User,
  Building,
  Search,
  RefreshCw
} from "lucide-react";

// Simple report data structure
interface Report {
  id: string;
  title: string;
  client: string;
  date: string;
  type: 'compliance' | 'summary' | 'audit';
  status: 'ready' | 'generating' | 'scheduled';
}

// Sample data
const reports: Report[] = [
  {
    id: "1",
    title: "TechCorp Q4 Compliance Report",
    client: "TechCorp SaaS",
    date: "Dec 1, 2024",
    type: "compliance",
    status: "ready"
  },
  {
    id: "2",
    title: "Portfolio Summary Report",
    client: "All Clients",
    date: "Nov 28, 2024",
    type: "summary",
    status: "ready"
  },
  {
    id: "3",
    title: "Professional Audit Trail",
    client: "TechCorp SaaS",
    date: "Nov 25, 2024",
    type: "audit",
    status: "ready"
  },
  {
    id: "4",
    title: "Monthly Client Review",
    client: "All Clients",
    date: "Nov 20, 2024",
    type: "summary",
    status: "ready"
  }
];

export default function TaxManagerReports() {
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newReport, setNewReport] = useState({
    title: "",
    client: "",
    type: "compliance" as const
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'compliance': return 'primary';
      case 'summary': return 'success';
      case 'audit': return 'warning';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'success';
      case 'generating': return 'warning';
      case 'scheduled': return 'primary';
      default: return 'default';
    }
  };

  const handleGenerateReport = () => {
    // Simple report generation logic
    console.log('Generating report:', newReport);
    setShowGenerateForm(false);
    setNewReport({ title: "", client: "", type: "compliance" });
  };

  // Filter reports based on search term
  const filteredReports = reports.filter(report =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Apple-style Header */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <FileText className="w-5 h-5 text-white" />
              </div>
                    <div>
                <h1 className="text-2xl font-semibold text-white tracking-tight">Reports</h1>
                <p className="text-gray-400 text-sm">Professional documentation center</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/25"
                startContent={<Plus className="w-4 h-4" />}
                onPress={() => setShowGenerateForm(true)}
              >
                Generate Report
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
                  <p className="text-gray-400 text-sm font-medium">Total Reports</p>
                  <p className="text-3xl font-bold text-white mt-1">47</p>
                    </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
            <CardBody className="p-6">
                <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Client Reports</p>
                  <p className="text-3xl font-bold text-green-500 mt-1">32</p>
                  </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                  <User className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Portfolio Reports</p>
                  <p className="text-3xl font-bold text-orange-500 mt-1">15</p>
                </div>
                <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center">
                  <Building className="w-6 h-6 text-orange-400" />
            </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Scheduled</p>
                  <p className="text-3xl font-bold text-purple-500 mt-1">8</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-400" />
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
                placeholder="Search reports..."
                className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 w-80"
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

        {/* Generate Report Form */}
        {showGenerateForm && (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8 shadow-2xl">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-1 h-6 bg-green-500 rounded-full"></div>
              <h2 className="text-xl font-semibold text-white tracking-tight">Generate New Report</h2>
                    </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                <label className="text-sm font-medium text-white mb-2 block">Report Title</label>
                          <Input
                  placeholder="Enter report title"
                  value={newReport.title}
                  onValueChange={(value) => setNewReport(prev => ({ ...prev, title: value }))}
                            className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                          />
                        </div>
                        <div>
                <label className="text-sm font-medium text-white mb-2 block">Client</label>
                          <Input
                  placeholder="Select client or 'All Clients'"
                  value={newReport.client}
                  onValueChange={(value) => setNewReport(prev => ({ ...prev, client: value }))}
                            className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                          />
                        </div>
                      <div>
                <label className="text-sm font-medium text-white mb-2 block">Report Type</label>
                <select
                  value={newReport.type}
                  onChange={(e) => setNewReport(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
                >
                  <option value="compliance" className="bg-gray-800">Compliance Report</option>
                  <option value="summary" className="bg-gray-800">Portfolio Summary</option>
                  <option value="audit" className="bg-gray-800">Audit Trail</option>
                </select>
                        </div>
                      </div>

            <div className="flex gap-3">
                        <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-300 hover:scale-105"
                onPress={handleGenerateReport}
                        >
                          Generate Report
                        </Button>
                        <Button 
                          variant="bordered"
                className="bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/20 rounded-xl transition-all duration-300 hover:scale-105"
                onPress={() => setShowGenerateForm(false)}
              >
                Cancel
                        </Button>
                      </div>
                    </div>
        )}

        {/* Reports List */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white tracking-tight">Recent Reports</h2>
                    </div>
          <div className="divide-y divide-white/10">
            {filteredReports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-white/5 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                      <div>
                      <h3 className="text-white font-semibold text-lg">{report.title}</h3>
                      <p className="text-gray-400 text-sm">{report.client} • {report.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-400 text-sm">{report.date}</span>
                            <Button 
                              size="sm" 
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                      startContent={<Download className="w-4 h-4" />}
                      onPress={() => setSelectedReport(report)}
                            >
                              Download
                            </Button>
                  </div>
                      </div>
                          </div>
                        ))}
                      </div>
                    </div>
                      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">Report Details</h2>
                              <Button 
                                size="sm" 
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                  onPress={() => setSelectedReport(null)}
                >
                  ×
                              </Button>
                            </div>
                          </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                  <FileText className="w-8 h-8 text-blue-400" />
                    </div>
                      <div>
                  <h3 className="text-xl font-semibold text-white">{selectedReport.title}</h3>
                  <p className="text-gray-400">{selectedReport.client}</p>
                        </div>
                      </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-400 text-sm">Type</p>
                  <p className="text-white font-medium">{selectedReport.type}</p>
                        </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-400 text-sm">Date</p>
                  <p className="text-white font-medium">{selectedReport.date}</p>
                        </div>
                      </div>

              <div className="flex space-x-3">
                        <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                  startContent={<Download className="w-4 h-4" />}
                        >
                  Download Report
                        </Button>
                        <Button 
                          variant="bordered"
                  className="bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 rounded-xl"
                >
                  Share
                        </Button>
                      </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}