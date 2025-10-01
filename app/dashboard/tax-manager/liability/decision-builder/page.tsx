"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Card, 
  CardBody, 
  Button, 
  Input,
  Textarea,
  Select,
  SelectItem,
  Progress,
  Tooltip
} from "@nextui-org/react";
import { 
  ArrowLeft,
  Save,
  Eye,
  Users,
  FileText,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Lock,
  Plus,
  Trash2,
  GripVertical,
  Search,
  Zap,
  Lightbulb,
  Clock,
  Target,
  TrendingUp,
  Shield,
  BookOpen,
  Copy,
  Download,
  Upload,
  Settings,
  HelpCircle,
  Keyboard,
  Sparkles
} from "lucide-react";
import Link from "next/link";

// Block types for the builder
interface Block {
  id: string;
  type: 'nexus_alert' | 'revenue_data' | 'statute' | 'email' | 'phone_call' | 'meeting' | 'client_decision' | 'professional_opinion' | 'peer_review';
  title: string;
  content: string;
  metadata?: any;
  timestamp?: string;
  selectedNexusAlert?: string; // For nexus alert blocks
}

// Nexus alert interface
interface NexusAlert {
  id: string;
  client: string;
  state: string;
  threshold: number;
  currentRevenue: number;
  status: 'active' | 'resolved' | 'pending';
  date: string;
  description: string;
}

// Decision record interface
interface DecisionRecord {
  id: string;
  client: string;
  decisionType: string;
  description: string;
  blocks: Block[];
  status: 'draft' | 'peer_review' | 'finalized';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  exposure: number;
  createdAt: string;
  finalizedAt?: string;
  hash?: string;
  lastSaved?: string;
  completionPercentage?: number;
}

// Smart template interface
interface DecisionTemplate {
  id: string;
  name: string;
  description: string;
  decisionType: string;
  suggestedBlocks: string[];
  riskLevel: string;
  descriptionTemplate: string;
  icon: any;
  color: string;
}

// Mock client data
const mockClients = [
  { id: "CLIENT-001", name: "TechCorp SaaS", industry: "Technology", revenue: 2100000 },
  { id: "CLIENT-002", name: "GrowthCo Inc", industry: "E-commerce", revenue: 1500000 },
  { id: "CLIENT-003", name: "StartupXYZ", industry: "Software", revenue: 800000 },
  { id: "CLIENT-004", name: "EcommercePro", industry: "Retail", revenue: 1200000 },
  { id: "CLIENT-005", name: "SaaS Solutions", industry: "Technology", revenue: 950000 },
  { id: "CLIENT-006", name: "Manufacturing Plus", industry: "Manufacturing", revenue: 3200000 },
  { id: "CLIENT-007", name: "Digital Agency", industry: "Marketing", revenue: 650000 },
  { id: "CLIENT-008", name: "HealthTech Corp", industry: "Healthcare", revenue: 1800000 }
];

// Mock nexus alert data
const mockNexusAlerts: NexusAlert[] = [
  {
    id: "ALERT-001",
    client: "TechCorp SaaS",
    state: "California",
    threshold: 500000,
    currentRevenue: 650000,
    status: "active",
    date: "2024-01-15",
    description: "Economic nexus threshold exceeded - registration required"
  },
  {
    id: "ALERT-002",
    client: "GrowthCo Inc",
    state: "Texas",
    threshold: 500000,
    currentRevenue: 750000,
    status: "active",
    date: "2024-01-12",
    description: "Sales threshold exceeded - nexus established"
  },
  {
    id: "ALERT-003",
    client: "StartupXYZ",
    state: "New York",
    threshold: 500000,
    currentRevenue: 480000,
    status: "pending",
    date: "2024-01-10",
    description: "Approaching economic nexus threshold - monitor closely"
  },
  {
    id: "ALERT-004",
    client: "EcommercePro",
    state: "Florida",
    threshold: 100000,
    currentRevenue: 150000,
    status: "active",
    date: "2024-01-08",
    description: "Low threshold state - registration required"
  },
  {
    id: "ALERT-005",
    client: "SaaS Solutions",
    state: "Washington",
    threshold: 100000,
    currentRevenue: 200000,
    status: "resolved",
    date: "2024-01-05",
    description: "Registration completed - alert resolved"
  }
];

// Smart decision templates
const decisionTemplates: DecisionTemplate[] = [
  {
    id: "nexus_registration",
    name: "Nexus Registration Decision",
    description: "Standard template for nexus registration decisions",
    decisionType: "nexus_registration",
    suggestedBlocks: ["nexus_alert", "revenue_data", "statute", "professional_opinion", "client_decision"],
    riskLevel: "high",
    descriptionTemplate: "Client has exceeded economic nexus threshold in {state}. Recommend immediate registration to avoid penalties and ensure compliance.",
    icon: AlertTriangle,
    color: "red"
  },
  {
    id: "voluntary_disclosure",
    name: "Voluntary Disclosure",
    description: "Template for voluntary disclosure decisions",
    decisionType: "voluntary_disclosure",
    suggestedBlocks: ["nexus_alert", "revenue_data", "statute", "email", "professional_opinion", "peer_review"],
    riskLevel: "critical",
    descriptionTemplate: "Client has nexus exposure for {period} years. Recommend voluntary disclosure to minimize penalties and establish compliance.",
    icon: Shield,
    color: "orange"
  },
  {
    id: "penalty_assessment",
    name: "Penalty Assessment Response",
    description: "Template for responding to penalty assessments",
    decisionType: "penalty_assessment",
    suggestedBlocks: ["nexus_alert", "statute", "email", "phone_call", "professional_opinion", "peer_review"],
    riskLevel: "high",
    descriptionTemplate: "Client received penalty assessment of ${amount}. Analyzing basis for appeal vs payment based on nexus analysis and compliance history.",
    icon: Target,
    color: "yellow"
  }
];

export default function DecisionBuilder() {
  const [decision, setDecision] = useState<DecisionRecord>({
    id: `DEC-${Date.now()}`,
    client: "",
    decisionType: "",
    description: "",
    blocks: [],
    status: 'draft',
    riskLevel: 'medium',
    exposure: 0,
    createdAt: new Date().toISOString()
  });

  const [showBlockSelector, setShowBlockSelector] = useState(false);
  const [draggedBlock, setDraggedBlock] = useState<Block | null>(null);
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [draggedBlockType, setDraggedBlockType] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const clientDropdownRef = useRef<HTMLDivElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save functionality
  const autoSave = useCallback(() => {
    if (decision.client && decision.decisionType) {
      setIsAutoSaving(true);
      // Simulate auto-save
      setTimeout(() => {
        setLastSaved(new Date().toLocaleTimeString());
        setIsAutoSaving(false);
        setDecision(prev => ({ ...prev, lastSaved: new Date().toISOString() }));
      }, 1000);
    }
  }, [decision.client, decision.decisionType]);

  // Auto-save on changes
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    autoSaveTimeoutRef.current = setTimeout(() => {
      autoSave();
    }, 2000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [decision, autoSave]);

  // Calculate completion percentage
  const calculateCompletion = useCallback(() => {
    let completed = 0;
    const total = 6; // client, decisionType, description, riskLevel, exposure, blocks

    if (decision.client) completed++;
    if (decision.decisionType) completed++;
    if (decision.description) completed++;
    if (decision.riskLevel) completed++;
    if (decision.exposure > 0) completed++;
    if (decision.blocks.length > 0) completed++;

    return Math.round((completed / total) * 100);
  }, [decision]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (clientDropdownRef.current && !clientDropdownRef.current.contains(event.target as Node)) {
        setShowClientDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 's':
            event.preventDefault();
            autoSave();
            break;
          case 'k':
            event.preventDefault();
            setShowKeyboardShortcuts(true);
            break;
          case 'n':
            event.preventDefault();
            setShowTemplates(true);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [autoSave]);

  // Available block types
  const blockTypes = [
    { type: 'nexus_alert', title: 'Nexus Alert', icon: AlertTriangle, color: 'red' },
    { type: 'revenue_data', title: 'Revenue Data', icon: DollarSign, color: 'green' },
    { type: 'statute', title: 'State Statute', icon: FileText, color: 'blue' },
    { type: 'email', title: 'Email Communication', icon: Mail, color: 'purple' },
    { type: 'phone_call', title: 'Phone Call', icon: Phone, color: 'orange' },
    { type: 'meeting', title: 'Client Meeting', icon: Calendar, color: 'cyan' },
    { type: 'client_decision', title: 'Client Decision', icon: CheckCircle, color: 'green' },
    { type: 'professional_opinion', title: 'Professional Opinion', icon: FileText, color: 'yellow' },
    { type: 'peer_review', title: 'Peer Review', icon: Users, color: 'blue' }
  ];

  const addBlock = (blockType: string) => {
    const blockTypeInfo = blockTypes.find(bt => bt.type === blockType);
    if (!blockTypeInfo) return;

    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type: blockType as any,
      title: blockTypeInfo.title,
      content: "",
      timestamp: new Date().toISOString()
    };

    setDecision(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock]
    }));
    setShowBlockSelector(false);
  };

  const updateBlock = (blockId: string, updates: Partial<Block>) => {
    setDecision(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => 
        block.id === blockId ? { ...block, ...updates } : block
      )
    }));
  };

  const removeBlock = (blockId: string) => {
    setDecision(prev => ({
      ...prev,
      blocks: prev.blocks.filter(block => block.id !== blockId)
    }));
  };

  const finalizeDecision = () => {
    // Generate cryptographic hash (simplified)
    const hash = `hash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    setDecision(prev => ({
      ...prev,
      status: 'finalized',
      finalizedAt: new Date().toISOString(),
      hash
    }));
  };

  const getBlockIcon = (type: string) => {
    const blockType = blockTypes.find(bt => bt.type === type);
    return blockType ? blockType.icon : FileText;
  };

  const getBlockColor = (type: string) => {
    const blockType = blockTypes.find(bt => bt.type === type);
    return blockType ? blockType.color : 'gray';
  };

  // Filter clients based on search term
  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
    client.industry.toLowerCase().includes(clientSearchTerm.toLowerCase())
  );

  const selectedClient = mockClients.find(client => client.id === decision.client);

  const handleClientSelect = (clientId: string) => {
    setDecision(prev => ({ ...prev, client: clientId }));
    setClientSearchTerm(mockClients.find(c => c.id === clientId)?.name || "");
    setShowClientDropdown(false);
  };

  const applyTemplate = (template: DecisionTemplate) => {
    setDecision(prev => ({
      ...prev,
      decisionType: template.decisionType,
      riskLevel: template.riskLevel as any,
      description: template.descriptionTemplate
    }));
    
    // Add suggested blocks
    template.suggestedBlocks.forEach((blockType, index) => {
      setTimeout(() => {
        addBlock(blockType);
      }, index * 200); // Stagger the additions for smooth animation
    });
    
    setShowTemplates(false);
  };

  const duplicateBlock = (blockId: string) => {
    const blockToDuplicate = decision.blocks.find(block => block.id === blockId);
    if (blockToDuplicate) {
      const newBlock: Block = {
        ...blockToDuplicate,
        id: `block-${Date.now()}`,
        timestamp: new Date().toISOString()
      };
      setDecision(prev => ({
        ...prev,
        blocks: [...prev.blocks, newBlock]
      }));
    }
  };

  const moveBlock = (blockId: string, direction: 'up' | 'down') => {
    const currentIndex = decision.blocks.findIndex(block => block.id === blockId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= decision.blocks.length) return;

    const newBlocks = [...decision.blocks];
    [newBlocks[currentIndex], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[currentIndex]];
    
    setDecision(prev => ({
      ...prev,
      blocks: newBlocks
    }));
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Enhanced Apple-style Header */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard/tax-manager/liability">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                  startContent={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
              </Link>
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-white tracking-tight">Decision Builder</h1>
                <div className="flex items-center space-x-4">
                  <p className="text-gray-400 text-sm">Create legally defensible decision records</p>
                  {isAutoSaving && (
                    <div className="flex items-center space-x-2 text-blue-400">
                      <div className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs">Auto-saving...</span>
                    </div>
                  )}
                  {lastSaved && !isAutoSaving && (
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="w-3 h-3" />
                      <span className="text-xs">Saved {lastSaved}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Progress Indicator */}
              <div className="flex items-center space-x-2">
                <Progress 
                  value={calculateCompletion()} 
                  className="w-20"
                  color="success"
                  size="sm"
                />
                <span className="text-gray-400 text-xs">{calculateCompletion()}%</span>
              </div>
              
              <Tooltip content="Keyboard Shortcuts (Ctrl+K)">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                  startContent={<Keyboard className="w-4 h-4" />}
                  onPress={() => setShowKeyboardShortcuts(true)}
                />
              </Tooltip>
              
              <Button
                size="sm"
                variant="bordered"
                className="bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 rounded-xl"
                startContent={<Sparkles className="w-4 h-4" />}
                onPress={() => setShowTemplates(true)}
              >
                Templates
              </Button>
              
              <Button
                size="sm"
                variant="bordered"
                className="bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 rounded-xl"
                startContent={<Eye className="w-4 h-4" />}
                onPress={() => setShowPreview(true)}
              >
                Preview
              </Button>
              
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
                startContent={<Save className="w-4 h-4" />}
                onPress={() => finalizeDecision()}
                isDisabled={decision.status === 'finalized'}
              >
                {decision.status === 'finalized' ? 'Finalized' : 'Save Draft'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Enhanced Block Library */}
          <div className="lg:col-span-1">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Evidence Blocks</h3>
                  <Tooltip content="Drag blocks to add them">
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                  </Tooltip>
                </div>
                <div className="space-y-2">
                  {blockTypes.map((blockType) => {
                    const IconComponent = blockType.icon;
                    return (
                      <div
                        key={blockType.type}
                        className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200 cursor-grab active:cursor-grabbing group"
                        onClick={() => addBlock(blockType.type)}
                        draggable
                        onDragStart={(e) => {
                          setDraggedBlockType(blockType.type);
                          e.dataTransfer.effectAllowed = 'copy';
                        }}
                        onDragEnd={() => setDraggedBlockType(null)}
                      >
                        <div className={`w-8 h-8 bg-${blockType.color}-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                          <IconComponent className={`w-4 h-4 text-${blockType.color}-400`} />
                        </div>
                        <div className="flex-1">
                          <span className="text-white text-sm font-medium">{blockType.title}</span>
                          <p className="text-gray-400 text-xs">Click or drag to add</p>
                        </div>
                        <GripVertical className="w-4 h-4 text-gray-500 group-hover:text-gray-300" />
                      </div>
                    );
                  })}
                </div>
                
                {/* Quick Actions */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <h4 className="text-white font-medium mb-3 text-sm">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      variant="bordered"
                      className="w-full bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 rounded-xl justify-start"
                      startContent={<Copy className="w-4 h-4" />}
                    >
                      Duplicate Last Block
                    </Button>
                    <Button
                      size="sm"
                      variant="bordered"
                      className="w-full bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 rounded-xl justify-start"
                      startContent={<Upload className="w-4 h-4" />}
                    >
                      Import Evidence
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Main Content - Decision Builder */}
          <div className="lg:col-span-3">
            {/* Decision Header - Compact */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl mb-6">
              <CardBody className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Decision Information</h2>
                  {selectedClient && (
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-400">Client:</span>
                      <span className="text-white font-medium">{selectedClient.name}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400">{selectedClient.industry}</span>
                    </div>
                  )}
                </div>
                
                {/* Enhanced Client Search - More Prominent */}
                <div className="mb-6">
                  <div className="relative" ref={clientDropdownRef}>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <Search className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <label className="text-white font-semibold text-lg">Select Client</label>
                        <p className="text-gray-400 text-sm">Choose the client for this decision record</p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Type to search clients by name or industry..."
                        value={clientSearchTerm}
                        onChange={(e) => {
                          setClientSearchTerm(e.target.value);
                          setShowClientDropdown(true);
                        }}
                        onFocus={() => setShowClientDropdown(true)}
                        className="w-full bg-white/10 border-2 border-white/20 rounded-2xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/70 focus:bg-white/15 transition-all duration-300 text-lg font-medium shadow-lg"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                        {clientSearchTerm && (
                          <div className="text-gray-400 text-sm">
                            {filteredClients.length} result{filteredClients.length !== 1 ? 's' : ''}
                          </div>
                        )}
                        <Search className="text-gray-400 w-5 h-5" />
                      </div>
                      
                      {/* Enhanced Dropdown */}
                      {showClientDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl z-50 max-h-80 overflow-y-auto">
                          {filteredClients.length > 0 ? (
                            <div className="p-2">
                              {filteredClients.map((client) => (
                                <div
                                  key={client.id}
                                  className="p-4 hover:bg-white/10 cursor-pointer rounded-xl transition-all duration-200 border border-transparent hover:border-white/20"
                                  onClick={() => handleClientSelect(client.id)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">
                                          {client.name.charAt(0)}
                                        </span>
                                      </div>
                                      <div>
                                        <p className="text-white font-semibold text-lg">{client.name}</p>
                                        <p className="text-gray-400 text-sm">{client.industry}</p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-white font-semibold">${(client.revenue / 1000000).toFixed(1)}M</p>
                                      <p className="text-gray-400 text-xs">Annual Revenue</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-6 text-center">
                              <div className="w-16 h-16 bg-gray-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                <Search className="w-8 h-8 text-gray-400" />
                              </div>
                              <p className="text-gray-400 text-lg">No clients found</p>
                              <p className="text-gray-500 text-sm">Try a different search term</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  {/* Decision Type */}
                  <div>
                    <label className="text-gray-400 text-sm font-medium mb-1 block">Decision Type</label>
                    <Select
                      placeholder="Select type"
                      selectedKeys={decision.decisionType ? [decision.decisionType] : []}
                      onChange={(e) => setDecision(prev => ({ ...prev, decisionType: e.target.value }))}
                      className="text-white"
                      classNames={{
                        trigger: "bg-white/5 border-white/10 h-10",
                        value: "text-white text-sm"
                      }}
                    >
                      <SelectItem key="nexus_registration" value="nexus_registration">Nexus Registration</SelectItem>
                      <SelectItem key="voluntary_disclosure" value="voluntary_disclosure">Voluntary Disclosure</SelectItem>
                      <SelectItem key="penalty_assessment" value="penalty_assessment">Penalty Assessment</SelectItem>
                      <SelectItem key="nexus_analysis" value="nexus_analysis">Further Review</SelectItem>
                    </Select>
                  </div>

                  {/* Risk Level */}
                  <div>
                    <label className="text-gray-400 text-sm font-medium mb-1 block">Risk Level</label>
                    <Select
                      placeholder="Select risk"
                      selectedKeys={[decision.riskLevel]}
                      onChange={(e) => setDecision(prev => ({ ...prev, riskLevel: e.target.value as any }))}
                      className="text-white"
                      classNames={{
                        trigger: "bg-white/5 border-white/10 h-10",
                        value: "text-white text-sm"
                      }}
                    >
                      <SelectItem key="low" value="low">Low</SelectItem>
                      <SelectItem key="medium" value="medium">Medium</SelectItem>
                      <SelectItem key="high" value="high">High</SelectItem>
                      <SelectItem key="critical" value="critical">Critical</SelectItem>
                    </Select>
                  </div>

                  {/* Exposure Amount */}
                  <div>
                    <label className="text-gray-400 text-sm font-medium mb-1 block">Exposure</label>
                    <input
                      type="number"
                      placeholder="$0"
                      value={decision.exposure || ""}
                      onChange={(e) => setDecision(prev => ({ ...prev, exposure: parseFloat(e.target.value) || 0 }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all duration-200 h-10"
                    />
                  </div>
                </div>

                {/* Description - Compact */}
                <div className="mt-4">
                  <label className="text-gray-400 text-sm font-medium mb-1 block">Description</label>
                  <textarea
                    placeholder="Brief description of the decision and context..."
                    value={decision.description}
                    onChange={(e) => setDecision(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all duration-200 resize-none"
                    rows={2}
                  />
                </div>
              </CardBody>
            </Card>

            {/* Evidence Blocks */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Evidence & Documentation</h2>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                    startContent={<Plus className="w-4 h-4" />}
                    onPress={() => setShowBlockSelector(true)}
                  >
                    Add Block
                  </Button>
                </div>

                {decision.blocks.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No evidence blocks added yet</p>
                    <p className="text-gray-500 text-sm">Drag blocks from the sidebar or click "Add Block" to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {decision.blocks.map((block, index) => {
                      const IconComponent = getBlockIcon(block.type);
                      const color = getBlockColor(block.type);
                      
                      return (
                        <div
                          key={block.id}
                          className="bg-white/5 rounded-xl p-4 border border-white/10"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 bg-${color}-500/20 rounded-lg flex items-center justify-center`}>
                                <IconComponent className={`w-4 h-4 text-${color}-400`} />
                              </div>
                              <div>
                                <h3 className="text-white font-semibold">{block.title}</h3>
                                <p className="text-gray-400 text-sm">Block {index + 1}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Tooltip content="Move up">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-gray-400 hover:text-white"
                                  onPress={() => moveBlock(block.id, 'up')}
                                  isDisabled={index === 0}
                                >
                                  ↑
                                </Button>
                              </Tooltip>
                              <Tooltip content="Move down">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-gray-400 hover:text-white"
                                  onPress={() => moveBlock(block.id, 'down')}
                                  isDisabled={index === decision.blocks.length - 1}
                                >
                                  ↓
                                </Button>
                              </Tooltip>
                              <Tooltip content="Duplicate block">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-gray-400 hover:text-white"
                                  startContent={<Copy className="w-4 h-4" />}
                                  onPress={() => duplicateBlock(block.id)}
                                />
                              </Tooltip>
                              <Tooltip content="Remove block">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-400 hover:text-red-300"
                                  startContent={<Trash2 className="w-4 h-4" />}
                                  onPress={() => removeBlock(block.id)}
                                />
                              </Tooltip>
                            </div>
                          </div>
                          
                          {block.type === 'nexus_alert' ? (
                            <div className="space-y-4">
                              <Select
                                label="Select Nexus Alert"
                                placeholder="Choose a nexus alert from the system"
                                selectedKeys={block.selectedNexusAlert ? [block.selectedNexusAlert] : []}
                                onChange={(e) => updateBlock(block.id, { selectedNexusAlert: e.target.value })}
                                className="text-white"
                                classNames={{
                                  trigger: "bg-white/5 border-white/10",
                                  value: "text-white"
                                }}
                              >
                                {mockNexusAlerts.map((alert) => (
                                  <SelectItem key={alert.id} value={alert.id}>
                                    <div className="flex flex-col">
                                      <span className="text-white font-medium">{alert.client} - {alert.state}</span>
                                      <span className="text-gray-400 text-sm">
                                        ${alert.currentRevenue.toLocaleString()} / ${alert.threshold.toLocaleString()} threshold
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </Select>
                              
                              {block.selectedNexusAlert && (
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                  {(() => {
                                    const selectedAlert = mockNexusAlerts.find(alert => alert.id === block.selectedNexusAlert);
                                    return selectedAlert ? (
                                      <div>
                                        <h4 className="text-white font-semibold mb-2">Selected Alert Details:</h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                          <div>
                                            <p className="text-gray-400">Client:</p>
                                            <p className="text-white">{selectedAlert.client}</p>
                                          </div>
                                          <div>
                                            <p className="text-gray-400">State:</p>
                                            <p className="text-white">{selectedAlert.state}</p>
                                          </div>
                                          <div>
                                            <p className="text-gray-400">Current Revenue:</p>
                                            <p className="text-white">${selectedAlert.currentRevenue.toLocaleString()}</p>
                                          </div>
                                          <div>
                                            <p className="text-gray-400">Threshold:</p>
                                            <p className="text-white">${selectedAlert.threshold.toLocaleString()}</p>
                                          </div>
                                        </div>
                                        <div className="mt-3">
                                          <p className="text-gray-400 text-sm">Description:</p>
                                          <p className="text-white text-sm">{selectedAlert.description}</p>
                                        </div>
                                      </div>
                                    ) : null;
                                  })()}
                                </div>
                              )}
                              
                              <Textarea
                                label="Additional Notes"
                                placeholder="Add any additional context or analysis about this nexus alert..."
                                value={block.content}
                                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                className="text-white"
                                classNames={{
                                  input: "text-white",
                                  inputWrapper: "bg-white/5 border-white/10"
                                }}
                              />
                            </div>
                          ) : (
                            <Textarea
                              placeholder={`Enter ${block.title.toLowerCase()} details...`}
                              value={block.content}
                              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                              className="text-white"
                              classNames={{
                                input: "text-white",
                                inputWrapper: "bg-white/5 border-white/10"
                              }}
                            />
                          )}
                          
                          {block.timestamp && (
                            <p className="text-gray-500 text-xs mt-2">
                              Added: {new Date(block.timestamp).toLocaleString()}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Finalization Section */}
            {decision.blocks.length > 0 && (
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl mt-6">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">Ready to Finalize?</h3>
                      <p className="text-gray-400 text-sm">
                        Once finalized, this record will be cryptographically sealed and cannot be modified.
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {decision.status === 'finalized' && (
                        <div className="flex items-center space-x-2 text-green-400">
                          <Lock className="w-4 h-4" />
                          <span className="text-sm">Finalized</span>
                        </div>
                      )}
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
                        startContent={<Lock className="w-4 h-4" />}
                        onPress={() => finalizeDecision()}
                        isDisabled={decision.status === 'finalized' || !decision.client || !decision.decisionType}
                      >
                        Finalize & Sign
                      </Button>
                    </div>
                  </div>
                  
                  {decision.hash && (
                    <div className="mt-4 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                      <p className="text-green-400 text-sm font-medium">Cryptographic Hash:</p>
                      <p className="text-green-300 text-xs font-mono break-all">{decision.hash}</p>
                    </div>
                  )}
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Smart Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Smart Templates</h2>
                    <p className="text-gray-400 text-sm">Choose a template to get started quickly</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                  onPress={() => setShowTemplates(false)}
                >
                  ×
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {decisionTemplates.map((template) => {
                  const IconComponent = template.icon;
                  return (
                    <Card
                      key={template.id}
                      className="bg-white/5 border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                      isPressable
                      onPress={() => applyTemplate(template)}
                    >
                      <CardBody className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className={`w-12 h-12 bg-${template.color}-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                            <IconComponent className={`w-6 h-6 text-${template.color}-400`} />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">{template.name}</h3>
                            <p className="text-gray-400 text-sm">Risk: {template.riskLevel}</p>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm mb-4">{template.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-xs">
                            {template.suggestedBlocks.length} suggested blocks
                          </span>
                          <Button
                            size="sm"
                            className={`bg-${template.color}-600 hover:bg-${template.color}-700 text-white rounded-xl`}
                          >
                            Use Template
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Modal */}
      {showKeyboardShortcuts && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 max-w-2xl w-full">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                    <Keyboard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Keyboard Shortcuts</h2>
                    <p className="text-gray-400 text-sm">Speed up your workflow</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                  onPress={() => setShowKeyboardShortcuts(false)}
                >
                  ×
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div>
                    <p className="text-white font-medium">Save Draft</p>
                    <p className="text-gray-400 text-sm">Auto-save your work</p>
                  </div>
                  <kbd className="px-2 py-1 bg-white/10 text-white text-sm rounded">Ctrl+S</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div>
                    <p className="text-white font-medium">Open Templates</p>
                    <p className="text-gray-400 text-sm">Quick access to smart templates</p>
                  </div>
                  <kbd className="px-2 py-1 bg-white/10 text-white text-sm rounded">Ctrl+N</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div>
                    <p className="text-white font-medium">Show Shortcuts</p>
                    <p className="text-gray-400 text-sm">Open this help dialog</p>
                  </div>
                  <kbd className="px-2 py-1 bg-white/10 text-white text-sm rounded">Ctrl+K</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Professional Decision Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Decision Record Preview</h2>
                    <p className="text-gray-400 text-sm">Professional documentation preview</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                  onPress={() => setShowPreview(false)}
                >
                  ×
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Header Section */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-white">Professional Decision Record</h1>
                      <p className="text-gray-400">Tax Manager Liability Documentation</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Record ID</p>
                    <p className="text-white font-mono">{decision.id}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-400 text-sm">Client</p>
                    <p className="text-white font-semibold">{selectedClient?.name || 'Not selected'}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-400 text-sm">Decision Type</p>
                    <p className="text-white font-semibold">{decision.decisionType || 'Not selected'}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-400 text-sm">Risk Level</p>
                    <p className="text-white font-semibold capitalize">{decision.riskLevel}</p>
                  </div>
                </div>
              </div>

              {/* Decision Description */}
              {decision.description && (
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-white font-semibold text-lg mb-3">Decision Summary</h3>
                  <p className="text-gray-300 leading-relaxed">{decision.description}</p>
                </div>
              )}

              {/* Evidence Blocks */}
              {decision.blocks.length > 0 && (
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-white font-semibold text-lg mb-4">Supporting Evidence</h3>
                  <div className="space-y-4">
                    {decision.blocks.map((block, index) => {
                      const IconComponent = getBlockIcon(block.type);
                      const color = getBlockColor(block.type);
                      
                      return (
                        <div key={block.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className={`w-8 h-8 bg-${color}-500/20 rounded-lg flex items-center justify-center`}>
                              <IconComponent className={`w-4 h-4 text-${color}-400`} />
                            </div>
                            <div>
                              <h4 className="text-white font-semibold">{block.title}</h4>
                              <p className="text-gray-400 text-sm">Evidence #{index + 1}</p>
                            </div>
                          </div>
                          
                          {block.type === 'nexus_alert' && block.selectedNexusAlert && (
                            <div className="mb-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                              {(() => {
                                const selectedAlert = mockNexusAlerts.find(alert => alert.id === block.selectedNexusAlert);
                                return selectedAlert ? (
                                  <div>
                                    <p className="text-blue-400 font-medium text-sm">Selected Nexus Alert:</p>
                                    <p className="text-white font-semibold">{selectedAlert.client} - {selectedAlert.state}</p>
                                    <p className="text-gray-300 text-sm">${selectedAlert.currentRevenue.toLocaleString()} / ${selectedAlert.threshold.toLocaleString()} threshold</p>
                                  </div>
                                ) : null;
                              })()}
                            </div>
                          )}
                          
                          {block.content && (
                            <div className="bg-white/5 rounded-lg p-3">
                              <p className="text-gray-300 text-sm">{block.content}</p>
                            </div>
                          )}
                          
                          {block.timestamp && (
                            <p className="text-gray-500 text-xs mt-2">
                              Added: {new Date(block.timestamp).toLocaleString()}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Risk Assessment */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-white font-semibold text-lg mb-4">Risk Assessment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-400 text-sm">Risk Level</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className={`w-3 h-3 rounded-full ${
                        decision.riskLevel === 'low' ? 'bg-green-500' :
                        decision.riskLevel === 'medium' ? 'bg-yellow-500' :
                        decision.riskLevel === 'high' ? 'bg-orange-500' : 'bg-red-500'
                      }`}></div>
                      <p className="text-white font-semibold capitalize">{decision.riskLevel}</p>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-400 text-sm">Exposure Amount</p>
                    <p className="text-white font-semibold text-lg">
                      {decision.exposure > 0 ? `$${decision.exposure.toLocaleString()}` : 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Professional Standards */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-white font-semibold text-lg mb-4">Professional Standards Compliance</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-white">Decision documented with timestamp</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-white">Evidence blocks linked and organized</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-white">Risk assessment completed</span>
                  </div>
                  {decision.blocks.some(block => block.type === 'peer_review') && (
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-white">Peer review included</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Created</p>
                    <p className="text-white font-semibold">{new Date(decision.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Status</p>
                    <p className="text-white font-semibold capitalize">{decision.status.replace('_', ' ')}</p>
                  </div>
                </div>
                
                {decision.status === 'finalized' && decision.hash && (
                  <div className="mt-4 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                    <p className="text-green-400 text-sm font-medium">Cryptographic Hash:</p>
                    <p className="text-green-300 text-xs font-mono break-all">{decision.hash}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
