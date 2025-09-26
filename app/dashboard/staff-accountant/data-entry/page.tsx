"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
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
  Tabs,
  Tab,
  Badge,
  Progress,
  Tooltip,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Select,
  SelectItem
} from "@nextui-org/react";
import { SearchIcon } from "@/components/icons/searchicon";
import { CheckCircleIcon } from "@/components/icons/profile/check-circle-icon";
import { ExclamationTriangleIcon } from "@/components/icons/profile/exclamation-triangle-icon";
import { ClockIcon } from "@/components/icons/profile/clock-icon";
import { ChartBarIcon } from "@/components/icons/profile/chart-bar-icon";
import { DocumentTextIcon } from "@/components/icons/profile/document-text-icon";
import { UserGroupIcon } from "@/components/icons/profile/user-group-icon";
import { BuildingOfficeIcon } from "@/components/icons/profile/building-office-icon";
import { MapPinIcon } from "@/components/icons/profile/map-pin-icon";
import { CurrencyDollarIcon } from "@/components/icons/profile/currency-dollar-icon";
import { CalendarIcon } from "@/components/icons/profile/calendar-icon";
import { ShieldCheckIcon } from "@/components/icons/profile/shield-check-icon";
import { AcademicCapIcon } from "@/components/icons/profile/academic-cap-icon";
import { DotsIcon } from "@/components/icons/accounts/dots-icon";
import { EyeIcon } from "@/components/icons/table/eye-icon";
import { EditIcon } from "@/components/icons/table/edit-icon";
import { DeleteIcon } from "@/components/icons/table/delete-icon";
import { InfoIcon } from "@/components/icons/accounts/info-icon";

// Document data structure
interface Document {
  id: string;
  clientName: string;
  clientCode: string;
  state: string;
  period: string;
  salesAmount: number;
  transactionCount: number;
  businessType: string;
  status: 'pending' | 'under-review' | 'approved' | 'rejected' | 'needs-revision';
  priority: 'low' | 'medium' | 'high' | 'critical';
  submittedBy: string;
  submittedDate: string;
  reviewedBy?: string;
  reviewedDate?: string;
  qualityScore: number;
  nexusStatus: 'safe' | 'warning' | 'critical';
  fileUploaded: boolean;
  notes?: string;
  documentType: string;
  category: string;
  issuedBy: string;
  expiryDate?: string;
}

// Sample document data
const documents: Document[] = [
  {
    id: "DE-2024-001",
    clientName: "TechCorp Solutions",
    clientCode: "TC-001",
    state: "CA",
    period: "Q3 2024",
    salesAmount: 750000,
    transactionCount: 1250,
    businessType: "SaaS",
    status: "under-review",
    priority: "high",
    submittedBy: "Sarah Johnson",
    submittedDate: "2024-01-15",
    reviewedBy: "Michael Chen",
    reviewedDate: "2024-01-16",
    qualityScore: 95,
    nexusStatus: "critical",
    fileUploaded: true,
    notes: "Approaching nexus threshold - requires immediate attention",
    documentType: "Economic Nexus Report",
    category: "Compliance",
    issuedBy: "Sarah Johnson",
    expiryDate: "2024-12-31"
  },
  {
    id: "DE-2024-002",
    clientName: "RetailMax Inc",
    clientCode: "RM-002",
    state: "TX",
    period: "Q3 2024",
    salesAmount: 450000,
    transactionCount: 890,
    businessType: "Retail",
    status: "approved",
    priority: "medium",
    submittedBy: "David Wilson",
    submittedDate: "2024-01-14",
    reviewedBy: "Lisa Rodriguez",
    reviewedDate: "2024-01-15",
    qualityScore: 88,
    nexusStatus: "warning",
    fileUploaded: true,
    documentType: "Sales Tax Return",
    category: "Tax Filing",
    issuedBy: "David Wilson"
  },
  {
    id: "DE-2024-003",
    clientName: "Manufacturing Plus",
    clientCode: "MP-003",
    state: "NY",
    period: "Q3 2024",
    salesAmount: 1200000,
    transactionCount: 2100,
    businessType: "Manufacturing",
    status: "needs-revision",
    priority: "critical",
    submittedBy: "Emily Davis",
    submittedDate: "2024-01-13",
    qualityScore: 72,
    nexusStatus: "critical",
    fileUploaded: false,
    notes: "Missing supporting documentation and transaction details",
    documentType: "Nexus Analysis",
    category: "Compliance",
    issuedBy: "Emily Davis",
    expiryDate: "2024-06-30"
  },
  {
    id: "DE-2024-004",
    clientName: "ServicePro LLC",
    clientCode: "SP-004",
    state: "FL",
    period: "Q3 2024",
    salesAmount: 85000,
    transactionCount: 340,
    businessType: "Services",
    status: "pending",
    priority: "low",
    submittedBy: "James Brown",
    submittedDate: "2024-01-17",
    qualityScore: 92,
    nexusStatus: "safe",
    fileUploaded: true,
    documentType: "Quarterly Report",
    category: "Reporting",
    issuedBy: "James Brown"
  },
  {
    id: "DE-2024-005",
    clientName: "E-commerce Giant",
    clientCode: "EG-005",
    state: "WA",
    period: "Q3 2024",
    salesAmount: 950000,
    transactionCount: 1800,
    businessType: "Retail",
    status: "approved",
    priority: "high",
    submittedBy: "Maria Garcia",
    submittedDate: "2024-01-12",
    reviewedBy: "Robert Kim",
    reviewedDate: "2024-01-13",
    qualityScore: 96,
    nexusStatus: "critical",
    fileUploaded: true,
    documentType: "Multi-State Filing",
    category: "Tax Filing",
    issuedBy: "Maria Garcia"
  }
];


// Status color mapping
const getStatusColor = (status: Document['status']) => {
  switch (status) {
    case 'approved': return 'success';
    case 'under-review': return 'warning';
    case 'pending': return 'default';
    case 'needs-revision': return 'danger';
    case 'rejected': return 'danger';
    default: return 'default';
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Compliance': return 'success';
    case 'Tax Filing': return 'primary';
    case 'Reporting': return 'secondary';
    case 'Analysis': return 'warning';
    default: return 'default';
  }
};

// Table columns
const columns = [
  { name: "Document name", uid: "documentName" },
  { name: "Document type", uid: "documentType" },
  { name: "Associated with", uid: "associatedWith" },
  { name: "Category", uid: "category" },
  { name: "Issued by", uid: "issuedBy" },
  { name: "Status", uid: "status" },
  { name: "Actions", uid: "actions" }
];

// Render cell component
const RenderCell = ({ document, columnKey }: { document: Document; columnKey: string }) => {
  switch (columnKey) {
    case "documentName":
      return (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <DocumentTextIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">{document.id}</p>
            <p className="text-xs text-gray-400">{document.clientName}</p>
          </div>
        </div>
      );
    
    case "documentType":
      return (
        <div>
          <p className="text-sm text-white">{document.documentType}</p>
          <p className="text-xs text-gray-400">{document.period}</p>
        </div>
      );
    
    case "associatedWith":
      return (
        <div>
          <p className="text-sm text-white">{document.clientName}</p>
          <p className="text-xs text-gray-400">{document.clientCode}</p>
        </div>
      );
    
    case "category":
      return (
        <Chip
          color={getCategoryColor(document.category)}
          size="sm"
          variant="flat"
          className="text-xs"
        >
          {document.category}
        </Chip>
      );
    
    case "issuedBy":
      return (
        <div>
          <p className="text-sm text-white">{document.issuedBy}</p>
          <p className="text-xs text-gray-400">{document.submittedDate}</p>
        </div>
      );
    
    case "status":
      return (
        <div className="flex items-center space-x-2">
          <Chip
            color={getStatusColor(document.status)}
            size="sm"
            variant="flat"
            className="text-xs"
          >
            {document.status.replace('-', ' ').toUpperCase()}
          </Chip>
          {document.nexusStatus === 'critical' && (
            <Tooltip content="Critical nexus threshold exceeded">
              <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />
            </Tooltip>
          )}
        </div>
      );
    
    case "actions":
      return (
        <div className="flex items-center space-x-2">
          <Tooltip content="View Details">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="text-gray-400 hover:text-white"
            >
              <EyeIcon />
            </Button>
          </Tooltip>
          <Tooltip content="Download">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </Button>
          </Tooltip>
          <Dropdown>
            <DropdownTrigger>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="text-gray-400 hover:text-white"
              >
                <DotsIcon />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Document actions">
              <DropdownItem key="view">View</DropdownItem>
              <DropdownItem key="edit">Edit</DropdownItem>
              <DropdownItem key="rename">Rename doc</DropdownItem>
              <DropdownItem key="replace">Replace doc</DropdownItem>
              <DropdownItem key="delete" className="text-danger" color="danger">
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );
    
    default:
      return null;
  }
};

export default function StaffAccountantDataEntry() {
  const [filterValue, setFilterValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Filter documents based on search and filters
  const filteredDocuments = useMemo(() => {
    let filtered = documents;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(doc => doc.category === selectedCategory);
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter(doc => doc.status === selectedStatus);
    }

    // Filter by search
    if (filterValue) {
      filtered = filtered.filter(doc =>
        doc.clientName.toLowerCase().includes(filterValue.toLowerCase()) ||
        doc.clientCode.toLowerCase().includes(filterValue.toLowerCase()) ||
        doc.id.toLowerCase().includes(filterValue.toLowerCase()) ||
        doc.documentType.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filtered;
  }, [filterValue, selectedCategory, selectedStatus]);

  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-6">
        <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
          
          {/* Main Content */}
          <div className="mt-6 gap-6 flex flex-col w-full">
            {/* Header Section - Tax Manager Style */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Documents</h2>
              </div>
              
            </div>


            {/* Documents Table */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
              {/* Table Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        variant="bordered"
                        startContent={
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                          </svg>
                        }
                        className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                      >
                        Filter
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Filter options">
                      <DropdownItem key="all">All Categories</DropdownItem>
                      <DropdownItem key="Compliance">Compliance</DropdownItem>
                      <DropdownItem key="Tax Filing">Tax Filing</DropdownItem>
                      <DropdownItem key="Reporting">Reporting</DropdownItem>
                      <DropdownItem key="Analysis">Analysis</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>

                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        variant="bordered"
                        startContent={
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                          </svg>
                        }
                        className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                      >
                        Columns
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Column options">
                      <DropdownItem key="all">Show All</DropdownItem>
                      <DropdownItem key="essential">Essential Only</DropdownItem>
                      <DropdownItem key="custom">Custom View</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>

                <div className="flex items-center space-x-4">
                  <Input
                    isClearable
                    placeholder="Search documents..."
                    startContent={<SearchIcon />}
                    value={filterValue}
                    onClear={() => setFilterValue("")}
                    onValueChange={setFilterValue}
                    className="w-80 bg-white/5 border-white/20 text-white placeholder-gray-400"
                  />
                  
                  <Link href="/dashboard/staff-accountant/data-entry/wizard">
                    <Button
                      color="primary"
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      startContent={<AcademicCapIcon className="w-5 h-5" />}
                    >
                      Add Documents
                    </Button>
                  </Link>
                </div>
              </div>

              <Table aria-label="Documents table" removeWrapper>
                <TableHeader columns={columns}>
                  {(column) => (
                    <TableColumn
                      key={column.uid}
                      hideHeader={column.uid === "actions"}
                      align={column.uid === "actions" ? "center" : "start"}
                      className="text-gray-400 font-medium text-sm"
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.name}</span>
                        <InfoIcon className="w-3 h-3 text-gray-500" />
                      </div>
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody items={filteredDocuments}>
                  {(document) => (
                    <TableRow key={document.id} className="hover:bg-white/5">
                      {(columnKey) => (
                        <TableCell className="py-4">
                          {RenderCell({ document, columnKey: columnKey as string })}
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}