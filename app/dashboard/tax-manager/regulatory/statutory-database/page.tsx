"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Card, 
  CardBody, 
  Button, 
  Input,
  Chip,
  Select,
  SelectItem,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@nextui-org/react";
import { 
  Search,
  BookOpen,
  ExternalLink,
  Download,
  Filter,
  RefreshCw,
  FileText,
  Calendar,
  MapPin,
  Scale,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

// Interface for statute data
interface Statute {
  id: string;
  title: string;
  code: string;
  section: string;
  jurisdiction: string;
  category: string;
  lastUpdated: string;
  summary: string;
  fullText: string;
  effectiveDate: string;
  status: 'active' | 'amended' | 'repealed' | 'pending';
  relatedStatutes: string[];
  keywords: string[];
  source: string;
  url: string;
}

// Mock data for demonstration (in production, this would come from API)
const mockStatutes: Statute[] = [
  {
    id: "ca-23101",
    title: "California Economic Nexus Threshold",
    code: "Cal. Rev. & Tax Code",
    section: "§ 23101",
    jurisdiction: "California",
    category: "Sales Tax",
    lastUpdated: "2024-01-15",
    summary: "Establishes economic nexus threshold of $500,000 in annual sales for remote sellers",
    fullText: "A retailer is engaged in business in this state if the retailer has substantial nexus with this state. For purposes of this section, a retailer has substantial nexus with this state if the retailer's sales of tangible personal property for delivery in this state exceed $500,000 during the preceding or current calendar year.",
    effectiveDate: "2019-04-01",
    status: 'active',
    relatedStatutes: ["§ 23102", "§ 23103"],
    keywords: ["economic nexus", "remote seller", "sales threshold", "substantial nexus"],
    source: "California Legislative Information",
    url: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=23101"
  },
  {
    id: "wa-82-04-220",
    title: "Washington B&O Tax Rates",
    code: "RCW",
    section: "82.04.220",
    jurisdiction: "Washington",
    category: "Business Tax",
    lastUpdated: "2024-12-01",
    summary: "Business and occupation tax rates for service and retailing activities",
    fullText: "Upon every person engaging within this state in the business of making sales at retail, as defined in this chapter, the tax imposed is equal to the gross proceeds of sales of the business multiplied by the rate of 0.471 percent.",
    effectiveDate: "2025-01-01",
    status: 'amended',
    relatedStatutes: ["82.04.230", "82.04.240"],
    keywords: ["B&O tax", "retailing", "service", "tax rates"],
    source: "Washington State Legislature",
    url: "https://app.leg.wa.gov/rcw/default.aspx?cite=82.04.220"
  },
  {
    id: "tx-151-107",
    title: "Texas Economic Nexus Provisions",
    code: "Tex. Tax Code Ann.",
    section: "§ 151.107",
    jurisdiction: "Texas",
    category: "Sales Tax",
    lastUpdated: "2024-11-01",
    summary: "Economic nexus threshold for remote sellers in Texas",
    fullText: "A person is engaged in business in this state if the person has substantial nexus with this state. A person has substantial nexus with this state if the person's gross receipts from business done in this state exceed $750,000 during the preceding 12 calendar months.",
    effectiveDate: "2024-11-01",
    status: 'active',
    relatedStatutes: ["§ 151.108", "§ 151.109"],
    keywords: ["economic nexus", "remote seller", "gross receipts", "substantial nexus"],
    source: "Texas Constitution and Statutes",
    url: "https://statutes.capitol.texas.gov/Docs/TX/htm/TX.151.htm"
  },
  {
    id: "ny-1105-b",
    title: "New York Marketplace Facilitator Law",
    code: "N.Y. Tax Law",
    section: "§ 1105-b",
    jurisdiction: "New York",
    category: "Sales Tax",
    lastUpdated: "2024-10-15",
    summary: "Marketplace facilitator collection and remittance requirements",
    fullText: "A marketplace facilitator is required to collect and remit tax on all taxable sales of tangible personal property, services, and digital products facilitated through the marketplace, regardless of whether the marketplace seller has nexus with this state.",
    effectiveDate: "2019-06-01",
    status: 'active',
    relatedStatutes: ["§ 1101", "§ 1105"],
    keywords: ["marketplace facilitator", "collection", "remittance", "digital products"],
    source: "New York State Legislature",
    url: "https://www.nysenate.gov/legislation/laws/TAX/1105-B"
  },
  {
    id: "fl-212-0596",
    title: "Florida Economic Nexus Threshold",
    code: "Fla. Stat.",
    section: "§ 212.0596",
    jurisdiction: "Florida",
    category: "Sales Tax",
    lastUpdated: "2024-09-20",
    summary: "Economic nexus provisions for remote sellers in Florida",
    fullText: "A dealer is engaged in business in this state and is required to collect and remit tax if the dealer has substantial nexus with this state. Substantial nexus exists if the dealer's sales of tangible personal property delivered in this state exceed $100,000 during the preceding calendar year.",
    effectiveDate: "2021-07-01",
    status: 'active',
    relatedStatutes: ["§ 212.05", "§ 212.06"],
    keywords: ["economic nexus", "remote seller", "substantial nexus", "dealer"],
    source: "Florida Legislature",
    url: "https://www.flsenate.gov/laws/statutes/2021/212.0596"
  }
];

export default function StatutoryDatabase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJurisdiction, setSelectedJurisdiction] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [statutes, setStatutes] = useState<Statute[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatute, setSelectedStatute] = useState<Statute | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Simulate API call
  useEffect(() => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setStatutes(mockStatutes);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter statutes based on search and filters
  const filteredStatutes = useMemo(() => {
    return statutes.filter(statute => {
      const matchesSearch = 
        statute.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        statute.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        statute.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
        statute.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        statute.keywords.some(keyword => 
          keyword.toLowerCase().includes(searchQuery.toLowerCase())
        );
      
      const matchesJurisdiction = selectedJurisdiction === "all" || 
        statute.jurisdiction.toLowerCase() === selectedJurisdiction.toLowerCase();
      
      const matchesCategory = selectedCategory === "all" || 
        statute.category.toLowerCase() === selectedCategory.toLowerCase();
      
      const matchesStatus = selectedStatus === "all" || 
        statute.status === selectedStatus;

      return matchesSearch && matchesJurisdiction && matchesCategory && matchesStatus;
    });
  }, [statutes, searchQuery, selectedJurisdiction, selectedCategory, selectedStatus]);

  const handleStatuteClick = (statute: Statute) => {
    setSelectedStatute(statute);
    onOpen();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'amended': return 'warning';
      case 'repealed': return 'danger';
      case 'pending': return 'primary';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'amended': return <AlertCircle className="w-4 h-4" />;
      case 'repealed': return <AlertCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const jurisdictions = ["all", "California", "Washington", "Texas", "New York", "Florida"];
  const categories = ["all", "Sales Tax", "Business Tax", "Income Tax", "Property Tax"];
  const statuses = ["all", "active", "amended", "repealed", "pending"];

  return (
    <div className="min-h-screen bg-black">
      {/* Apple-style Sticky Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/tax-manager/regulatory">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                  startContent={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
              </Link>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Statutory Database</h1>
                <p className="text-gray-400 text-sm">Current Tax Law & Regulations</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                variant="ghost"
                className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                startContent={<RefreshCw className="w-4 h-4" />}
                onPress={() => {
                  setLoading(true);
                  setTimeout(() => setLoading(false), 1000);
                }}
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Integrated Search and Results Table */}
          <div className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl overflow-hidden">
            {/* Search and Filter Header */}
            <div className="bg-white/10 border-b border-white/10 px-6 py-4">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search statutes, codes, or keywords..."
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                      className="w-80 bg-white/5 border-white/10 rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200"
                      classNames={{
                        input: "text-white",
                        inputWrapper: "bg-white/5 border-white/10 hover:border-white/20 focus-within:border-blue-500/50"
                      }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex flex-wrap gap-3">
                    <Select
                      placeholder="Jurisdiction"
                      selectedKeys={[selectedJurisdiction]}
                      onSelectionChange={(keys) => setSelectedJurisdiction(Array.from(keys)[0] as string)}
                      className="w-40"
                      classNames={{
                        trigger: "bg-white/5 border-white/10 text-white",
                        value: "text-white",
                        popoverContent: "bg-gray-800/95 border-white/10"
                      }}
                    >
                      {jurisdictions.map((jurisdiction) => (
                        <SelectItem key={jurisdiction} value={jurisdiction}>
                          {jurisdiction === "all" ? "All Jurisdictions" : jurisdiction}
                        </SelectItem>
                      ))}
                    </Select>

                    <Select
                      placeholder="Category"
                      selectedKeys={[selectedCategory]}
                      onSelectionChange={(keys) => setSelectedCategory(Array.from(keys)[0] as string)}
                      className="w-40"
                      classNames={{
                        trigger: "bg-white/5 border-white/10 text-white",
                        value: "text-white",
                        popoverContent: "bg-gray-800/95 border-white/10"
                      }}
                    >
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </SelectItem>
                      ))}
                    </Select>

                    <Select
                      placeholder="Status"
                      selectedKeys={[selectedStatus]}
                      onSelectionChange={(keys) => setSelectedStatus(Array.from(keys)[0] as string)}
                      className="w-40"
                      classNames={{
                        trigger: "bg-white/5 border-white/10 text-white",
                        value: "text-white",
                        popoverContent: "bg-gray-800/95 border-white/10"
                      }}
                    >
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="text-white text-sm font-semibold">
                        {loading ? "Loading..." : `${filteredStatutes.length} statutes`}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                      startContent={<Download className="w-4 h-4" />}
                    >
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Spinner size="lg" color="primary" />
              </div>
            ) : (
              <>
                {/* Table Column Headers */}
                <div className="bg-white/5 border-b border-white/10 px-6 py-3">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-4">
                      <span className="text-white font-semibold text-sm">Statute</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-white font-semibold text-sm">Jurisdiction</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-white font-semibold text-sm">Category</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-white font-semibold text-sm">Status</span>
                    </div>
                    <div className="col-span-1">
                      <span className="text-white font-semibold text-sm">Updated</span>
                    </div>
                    <div className="col-span-1">
                      <span className="text-white font-semibold text-sm">Actions</span>
                    </div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-white/10">
                  {filteredStatutes.map((statute) => (
                    <div
                      key={statute.id}
                      className="px-6 py-4 hover:bg-white/5 transition-all duration-200 cursor-pointer group"
                      onClick={() => handleStatuteClick(statute)}
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Statute Column */}
                        <div className="col-span-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                              <BookOpen className="w-4 h-4 text-blue-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-white font-semibold text-sm truncate">{statute.title}</h4>
                              <p className="text-gray-400 text-xs font-mono truncate">{statute.code} {statute.section}</p>
                              <p className="text-gray-300 text-xs mt-1 line-clamp-2">{statute.summary}</p>
                            </div>
                          </div>
                        </div>

                        {/* Jurisdiction Column */}
                        <div className="col-span-2">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300 text-sm font-medium">{statute.jurisdiction}</span>
                          </div>
                        </div>

                        {/* Category Column */}
                        <div className="col-span-2">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300 text-sm font-medium">{statute.category}</span>
                          </div>
                        </div>

                        {/* Status Column */}
                        <div className="col-span-2">
                          <Chip
                            color={getStatusColor(statute.status)}
                            size="sm"
                            startContent={getStatusIcon(statute.status)}
                            className="font-semibold text-xs"
                          >
                            {statute.status.toUpperCase()}
                          </Chip>
                        </div>

                        {/* Updated Column */}
                        <div className="col-span-1">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-400 text-xs">{statute.lastUpdated}</span>
                          </div>
                        </div>

                        {/* Actions Column */}
                        <div className="col-span-1">
                          <div className="flex items-center space-x-2">
                            <div
                              className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(statute.url, '_blank');
                              }}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {filteredStatutes.length === 0 && !loading && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-gray-500/20 rounded-2xl flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">No statutes found</h3>
                    <p className="text-gray-400 text-sm text-center max-w-md">
                      Try adjusting your search criteria or filters to find relevant statutes.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Statute Detail Modal */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        size="4xl"
        classNames={{
          base: "bg-gray-800/95 backdrop-blur-xl border-white/10 rounded-3xl",
          header: "border-b border-white/10 bg-transparent",
          body: "py-6",
          footer: "border-t border-white/10 bg-transparent"
        }}
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white text-xl font-bold">{selectedStatute?.title}</h3>
                      <p className="text-gray-400 text-sm font-mono">{selectedStatute?.code} {selectedStatute?.section}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Chip
                      color={selectedStatute ? getStatusColor(selectedStatute.status) : 'default'}
                      size="sm"
                      startContent={selectedStatute ? getStatusIcon(selectedStatute.status) : null}
                      className="font-semibold"
                    >
                      {selectedStatute?.status.toUpperCase()}
                    </Chip>
                  </div>
                </div>
              </ModalHeader>

              <ModalBody>
                {selectedStatute && (
                  <div className="space-y-6">
                    {/* Summary */}
                    <div>
                      <h4 className="text-white font-semibold text-base mb-2">Summary</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{selectedStatute.summary}</p>
                    </div>

                    {/* Full Text */}
                    <div>
                      <h4 className="text-white font-semibold text-base mb-2">Full Text</h4>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-gray-300 text-sm leading-relaxed">{selectedStatute.fullText}</p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-white font-semibold text-base mb-2">Details</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Jurisdiction:</span>
                            <span className="text-white text-sm font-medium">{selectedStatute.jurisdiction}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Category:</span>
                            <span className="text-white text-sm font-medium">{selectedStatute.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Effective Date:</span>
                            <span className="text-white text-sm font-medium">{selectedStatute.effectiveDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Last Updated:</span>
                            <span className="text-white text-sm font-medium">{selectedStatute.lastUpdated}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-semibold text-base mb-2">Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedStatute.keywords.map((keyword, index) => (
                            <Chip
                              key={index}
                              size="sm"
                              variant="flat"
                              className="bg-blue-500/20 text-blue-300 text-xs"
                            >
                              {keyword}
                            </Chip>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Related Statutes */}
                    {selectedStatute.relatedStatutes.length > 0 && (
                      <div>
                        <h4 className="text-white font-semibold text-base mb-2">Related Statutes</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedStatute.relatedStatutes.map((related, index) => (
                            <Chip
                              key={index}
                              size="sm"
                              variant="flat"
                              className="bg-white/10 text-gray-300 text-xs"
                            >
                              {related}
                            </Chip>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ModalBody>

              <ModalFooter>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl px-4 py-2"
                      onPress={onClose}
                    >
                      Close
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 shadow-lg shadow-blue-600/25"
                      startContent={<ExternalLink className="w-4 h-4" />}
                      onPress={() => selectedStatute && window.open(selectedStatute.url, '_blank')}
                    >
                      View Official Source
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
