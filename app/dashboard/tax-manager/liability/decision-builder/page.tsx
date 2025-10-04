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
  Sparkles,
  ChevronRight,
  ChevronDown,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  RotateCcw,
  MoreHorizontal,
  Filter,
  SortAsc,
  Grid3X3,
  List,
  Layers,
  Workflow,
  Database,
  Link as LinkIcon,
  Code,
  Terminal,
  Cpu,
  Network
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
  { id: "CLIENT-001", name: "TechCorp SaaS", industry: "Technology", revenue: 2100000, states: ["CA", "NY", "TX"] },
  { id: "CLIENT-002", name: "GrowthCo Inc", industry: "E-commerce", revenue: 1500000, states: ["TX", "FL"] },
  { id: "CLIENT-003", name: "StartupXYZ", industry: "Software", revenue: 800000, states: ["NY"] },
  { id: "CLIENT-004", name: "EcommercePro", industry: "Retail", revenue: 1200000, states: ["CA", "TX"] },
  { id: "CLIENT-005", name: "SaaS Solutions", industry: "Technology", revenue: 950000, states: ["WA", "OR"] },
  { id: "CLIENT-006", name: "Manufacturing Plus", industry: "Manufacturing", revenue: 3200000, states: ["IL", "OH", "PA"] },
  { id: "CLIENT-007", name: "Digital Agency", industry: "Marketing", revenue: 650000, states: ["GA"] },
  { id: "CLIENT-008", name: "HealthTech Corp", industry: "Healthcare", revenue: 1800000, states: ["TX", "FL", "NC"] }
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

  // New state for Make-inspired design
  const [leftPanelExpanded, setLeftPanelExpanded] = useState(true);
  const [rightPanelExpanded, setRightPanelExpanded] = useState(true);
  const [centerPanelExpanded, setCenterPanelExpanded] = useState(true);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [workflowMode, setWorkflowMode] = useState<'design' | 'test' | 'deploy'>('design');
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
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'workflow'>('workflow');
  const [isLoading, setIsLoading] = useState(true);
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientModalSearch, setClientModalSearch] = useState("");
  const [clientModalFilter, setClientModalFilter] = useState("all");
  const [showNexusAlertDropdown, setShowNexusAlertDropdown] = useState<{[key: string]: boolean}>({});
  const clientDropdownRef = useRef<HTMLDivElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Loading animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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

  // Filter clients for modal
  const filteredModalClients = mockClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(clientModalSearch.toLowerCase()) ||
                         client.industry.toLowerCase().includes(clientModalSearch.toLowerCase());
    const matchesFilter = clientModalFilter === "all" || client.industry === clientModalFilter;
    return matchesSearch && matchesFilter;
  });

  const handleClientSelect = (clientId: string) => {
    setDecision(prev => ({ ...prev, client: clientId }));
    setClientSearchTerm(mockClients.find(c => c.id === clientId)?.name || "");
    setShowClientDropdown(false);
    setShowClientModal(false);
  };

  const handleClientModalSelect = (clientId: string) => {
    setDecision(prev => ({ ...prev, client: clientId }));
    setClientSearchTerm(mockClients.find(c => c.id === clientId)?.name || "");
    setShowClientModal(false);
    setClientModalSearch("");
    setClientModalFilter("all");
  };

  const handleNexusAlertSelect = (blockId: string, alertId: string) => {
    setDecision(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => 
        block.id === blockId 
          ? { ...block, selectedNexusAlert: alertId, content: mockNexusAlerts.find(a => a.id === alertId)?.description || block.content }
          : block
      )
    }));
    setShowNexusAlertDropdown(prev => ({ ...prev, [blockId]: false }));
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

  // Loading Animation Component
  const LoadingAnimation = () => (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        {/* Animated Builder Icon */}
        <div className="relative mb-8">
          <div className="w-20 h-20 mx-auto relative">
            {/* Inner rotating element */}
            <div className="absolute inset-3 animate-pulse">
              <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                <Workflow className="w-6 h-6 text-gray-400" />
              </div>
            </div>
            {/* Minimal floating particles */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
            <div className="absolute top-1/2 -left-3 w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1/2 -right-3 w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.7s' }}></div>
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="space-y-3">
          <h2 className="text-xl font-medium text-white">Initializing Decision Builder</h2>
          <p className="text-gray-400 text-sm">Setting up your workflow environment...</p>
          <div className="flex items-center justify-center space-x-1 mt-6">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Show loading animation
  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="h-screen bg-black flex flex-col overflow-hidden decision-builder-fullscreen">
      {/* Make-inspired Top Bar */}
      <div className="flex-shrink-0 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-4">
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
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Workflow className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">Decision Builder</h1>
                <div className="flex items-center space-x-2">
                  {isAutoSaving && (
                    <div className="flex items-center space-x-1 text-blue-400">
                      <div className="w-2 h-2 border border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs">Saving...</span>
                    </div>
                  )}
                  {lastSaved && !isAutoSaving && (
                    <div className="flex items-center space-x-1 text-green-400">
                      <CheckCircle className="w-3 h-3" />
                      <span className="text-xs">Saved {lastSaved}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
              </div>
              
            <div className="flex items-center space-x-3">
            {/* Workflow Mode Toggle */}
            <div className="flex items-center bg-white/5 rounded-lg p-1">
                <Button
                  size="sm"
                variant={workflowMode === 'design' ? 'solid' : 'ghost'}
                className={workflowMode === 'design' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}
                onPress={() => setWorkflowMode('design')}
              >
                Design
              </Button>
              </div>
              
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1">
                <Button
                  size="sm"
                variant={viewMode === 'workflow' ? 'solid' : 'ghost'}
                className={viewMode === 'workflow' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}
                startContent={<Workflow className="w-4 h-4" />}
                onPress={() => setViewMode('workflow')}
              />
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'solid' : 'ghost'}
                className={viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}
                startContent={<List className="w-4 h-4" />}
                onPress={() => setViewMode('list')}
              />
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'solid' : 'ghost'}
                className={viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}
                startContent={<Grid3X3 className="w-4 h-4" />}
                onPress={() => setViewMode('grid')}
              />
              </div>
              
              <Button
                size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              startContent={<Play className="w-4 h-4" />}
            >
              Run
              </Button>
            </div>
          </div>
        </div>

      {/* Main Three-Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Modules Library */}
        <div className={`${leftPanelExpanded ? 'w-80' : 'w-12'} transition-all duration-300 bg-white/5 border-r border-white/10 flex flex-col`}>
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            {leftPanelExpanded && (
              <h3 className="text-white font-semibold text-sm">Modules</h3>
            )}
              <Button
                size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
              onPress={() => setLeftPanelExpanded(!leftPanelExpanded)}
            >
              {leftPanelExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
      </div>

          {leftPanelExpanded && (
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {/* Module Categories */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-400 text-xs uppercase tracking-wider">
                  <Database className="w-3 h-3" />
                  <span>Data Sources</span>
                </div>
                {blockTypes.slice(0, 3).map((blockType) => {
                    const IconComponent = blockType.icon;
                    return (
                      <div
                        key={blockType.type}
                      className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200 cursor-grab active:cursor-grabbing group"
                        onClick={() => addBlock(blockType.type)}
                        draggable
                      >
                        <div className={`w-8 h-8 bg-${blockType.color}-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                          <IconComponent className={`w-4 h-4 text-${blockType.color}-400`} />
                        </div>
                        <div className="flex-1">
                          <span className="text-white text-sm font-medium">{blockType.title}</span>
                        <p className="text-gray-400 text-xs">Drag to canvas</p>
                        </div>
                      </div>
                    );
                  })}
                
                <div className="flex items-center space-x-2 text-gray-400 text-xs uppercase tracking-wider mt-4">
                  <Users className="w-3 h-3" />
                  <span>Communication</span>
                </div>
                {blockTypes.slice(3, 6).map((blockType) => {
                    const IconComponent = blockType.icon;
                    return (
                      <div
                        key={blockType.type}
                      className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200 cursor-grab active:cursor-grabbing group"
                        onClick={() => addBlock(blockType.type)}
                        draggable
                      >
                        <div className={`w-8 h-8 bg-${blockType.color}-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                          <IconComponent className={`w-4 h-4 text-${blockType.color}-400`} />
                  </div>
                        <div className="flex-1">
                          <span className="text-white text-sm font-medium">{blockType.title}</span>
                        <p className="text-gray-400 text-xs">Drag to canvas</p>
                </div>
          </div>
                    );
                  })}
                
                <div className="flex items-center space-x-2 text-gray-400 text-xs uppercase tracking-wider mt-4">
                  <Shield className="w-3 h-3" />
                  <span>Decision</span>
                    </div>
                {blockTypes.slice(6).map((blockType) => {
                  const IconComponent = blockType.icon;
                  return (
                    <div
                      key={blockType.type}
                      className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200 cursor-grab active:cursor-grabbing group"
                      onClick={() => addBlock(blockType.type)}
                      draggable
                    >
                      <div className={`w-8 h-8 bg-${blockType.color}-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                        <IconComponent className={`w-4 h-4 text-${blockType.color}-400`} />
                </div>
                      <div className="flex-1">
                        <span className="text-white text-sm font-medium">{blockType.title}</span>
                        <p className="text-gray-400 text-xs">Drag to canvas</p>
                      </div>
                      </div>
                  );
                })}
                    </div>
                          </div>
                        )}
                      </div>
                      
        {/* Center Panel - Workflow Canvas */}
        <div className="flex-1 flex flex-col bg-black">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
                                    <div className="flex items-center space-x-3">
              <h3 className="text-white font-semibold text-sm">Decision Workflow</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-400 text-xs">Live</span>
                                      </div>
                                      </div>
            <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                variant="ghost"
                className="text-gray-400 hover:text-white"
                startContent={<RotateCcw className="w-4 h-4" />}
              >
                Reset
                    </Button>
                    <Button
                      size="sm"
                variant="ghost"
                className="text-gray-400 hover:text-white"
                startContent={<Settings className="w-4 h-4" />}
              >
                Settings
                    </Button>
                                    </div>
                                    </div>
          
          <div className="flex-1 p-6 overflow-auto">
            {viewMode === 'workflow' ? (
              <div className="min-h-full bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center">
                {decision.blocks.length === 0 ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Workflow className="w-8 h-8 text-gray-400" />
                                  </div>
                    <h3 className="text-white font-semibold mb-2">Start Building Your Decision</h3>
                    <p className="text-gray-400 text-sm mb-4">Drag modules from the left panel to create your workflow</p>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      startContent={<Plus className="w-4 h-4" />}
                onPress={() => setShowTemplates(true)}
              >
                      Use Template
              </Button>
                            </div>
                          ) : (
                  <div className="w-full space-y-4">
                    {decision.blocks.map((block, index) => {
                      const IconComponent = getBlockIcon(block.type);
                      const color = getBlockColor(block.type);
                      
                      return (
                        <div
                          key={block.id}
                          className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl border border-white/20 hover:border-white/30 transition-all duration-200"
                        >
                          <div className={`w-10 h-10 bg-${color}-500/20 rounded-lg flex items-center justify-center`}>
                            <IconComponent className={`w-5 h-5 text-${color}-400`} />
                  </div>
                          <div className="flex-1">
                            <h4 className="text-white font-semibold">{block.title}</h4>
                            <p className="text-gray-400 text-sm">Step {index + 1}</p>
                  </div>
                          <div className="flex items-center space-x-2">
              <Button
                size="sm"
                              variant="ghost"
                              className="text-gray-400 hover:text-white"
                              startContent={<Settings className="w-4 h-4" />}
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300"
                              startContent={<Trash2 className="w-4 h-4" />}
                              onPress={() => removeBlock(block.id)}
                    />
                  </div>
                          {index < decision.blocks.length - 1 && (
                            <div className="flex items-center justify-center w-8 h-8">
                              <div className="w-0.5 h-8 bg-white/20"></div>
                              <div className="absolute w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
                  )}
                </div>
                      );
                    })}
                </div>
                )}
                  </div>
            ) : viewMode === 'list' ? (
              decision.blocks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                  <div className="w-24 h-24 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                    <Workflow className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3">Start Building Your Decision</h3>
                  <p className="text-gray-400 text-lg mb-8 max-w-md">
                    Drag modules from the left panel to create your workflow
                  </p>
                  <div className="flex items-center space-x-2 text-gray-500 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Select a template or build from scratch</span>
                  </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {decision.blocks.map((block, index) => {
                      const IconComponent = getBlockIcon(block.type);
                      const color = getBlockColor(block.type);
                      
                      return (
                        <div
                          key={block.id}
                      className="p-4 bg-white/5 rounded-xl border border-white/10"
                        >
                      <div className="flex items-center justify-between mb-3">
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
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-gray-400 hover:text-white"
                                  onPress={() => moveBlock(block.id, 'up')}
                                  isDisabled={index === 0}
                                >
                                  ↑
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-gray-400 hover:text-white"
                                  onPress={() => moveBlock(block.id, 'down')}
                                  isDisabled={index === decision.blocks.length - 1}
                                >
                                  ↓
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-400 hover:text-red-300"
                                  startContent={<Trash2 className="w-4 h-4" />}
                                  onPress={() => removeBlock(block.id)}
                                />
                            </div>
                          </div>
                          
                          {/* Data Source Selection for Nexus Alert */}
                          {block.type === 'nexus_alert' && (
                            <div className="mb-3">
                              <label className="text-white/80 text-xs font-medium mb-2 block">Data Source</label>
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="Select nexus alert..."
                                  value={block.selectedNexusAlert ? mockNexusAlerts.find(a => a.id === block.selectedNexusAlert)?.client + " - " + mockNexusAlerts.find(a => a.id === block.selectedNexusAlert)?.state : ""}
                                  readOnly
                                  onClick={() => setShowNexusAlertDropdown(prev => ({ ...prev, [block.id]: !prev[block.id] }))}
                                  className="w-full bg-white/5 border border-red-500/30 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all duration-200 text-sm cursor-pointer"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                  <ChevronDown className="w-4 h-4 text-gray-400" />
                                    </div>
                                
                                {showNexusAlertDropdown[block.id] && (
                                  <div className="absolute top-full left-0 right-0 mt-1 bg-black/95 backdrop-blur-xl border border-red-500/30 rounded-lg shadow-2xl z-50 max-h-60 overflow-y-auto">
                                    <div className="p-2">
                                      {mockNexusAlerts.map((alert) => (
                                        <div
                                          key={alert.id}
                                          className="p-3 hover:bg-white/10 cursor-pointer rounded-lg transition-all duration-200"
                                          onClick={() => handleNexusAlertSelect(block.id, alert.id)}
                                        >
                                          <div className="flex items-center justify-between">
                                      <div>
                                              <p className="text-white font-medium text-sm">{alert.client}</p>
                                              <p className="text-gray-400 text-xs">{alert.state} • ${alert.currentRevenue.toLocaleString()}</p>
                                          </div>
                                            <div className={`px-2 py-1 rounded-md text-xs font-medium ${
                                              alert.status === 'active' ? 'bg-red-500/20 text-red-400' :
                                              alert.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
                                              'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                              {alert.status}
                                          </div>
                                          </div>
                                          </div>
                                      ))}
                                        </div>
                                        </div>
                                )}
                                      </div>
                                </div>
                              )}
                              
                              <Textarea
                        placeholder={`Enter ${block.title.toLowerCase()} details...`}
                                value={block.content}
                                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                className="text-white"
                                classNames={{
                                  input: "text-white",
                                  inputWrapper: "bg-white/5 border-white/10"
                                }}
                        rows={3}
                              />
                            </div>
                  );
                })}
                            </div>
                          )
                        ) : (
                        decision.blocks.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                            <div className="w-24 h-24 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                              <Workflow className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-semibold text-white mb-3">Start Building Your Decision</h3>
                            <p className="text-gray-400 text-lg mb-8 max-w-md">
                              Drag modules from the left panel to create your workflow
                            </p>
                            <div className="flex items-center space-x-2 text-gray-500 text-sm">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span>Select a template or build from scratch</span>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {decision.blocks.map((block, index) => {
                  const IconComponent = getBlockIcon(block.type);
                  const color = getBlockColor(block.type);
                  
                  return (
                    <div
                      key={block.id}
                      className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200"
                    >
                    <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-10 h-10 bg-${color}-500/20 rounded-lg flex items-center justify-center`}>
                          <IconComponent className={`w-5 h-5 text-${color}-400`} />
                                          </div>
                                          <div>
                          <h3 className="text-white font-semibold">{block.title}</h3>
                          <p className="text-gray-400 text-sm">Step {index + 1}</p>
                                          </div>
                                          </div>
                            {/* Data Source Selection for Nexus Alert */}
                            {block.type === 'nexus_alert' && (
                              <div className="mb-3">
                                <label className="text-white/80 text-xs font-medium mb-2 block">Data Source</label>
                                <div className="relative">
                                  <input
                                    type="text"
                                    placeholder="Select nexus alert..."
                                    value={block.selectedNexusAlert ? mockNexusAlerts.find(a => a.id === block.selectedNexusAlert)?.client + " - " + mockNexusAlerts.find(a => a.id === block.selectedNexusAlert)?.state : ""}
                                    readOnly
                                    onClick={() => setShowNexusAlertDropdown(prev => ({ ...prev, [block.id]: !prev[block.id] }))}
                                    className="w-full bg-white/5 border border-red-500/30 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all duration-200 text-sm cursor-pointer"
                                  />
                                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                  </div>
                                  
                                  {showNexusAlertDropdown[block.id] && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-black/95 backdrop-blur-xl border border-red-500/30 rounded-lg shadow-2xl z-50 max-h-60 overflow-y-auto">
                                      <div className="p-2">
                                        {mockNexusAlerts.map((alert) => (
                                          <div
                                            key={alert.id}
                                            className="p-3 hover:bg-white/10 cursor-pointer rounded-lg transition-all duration-200"
                                            onClick={() => handleNexusAlertSelect(block.id, alert.id)}
                                          >
                                            <div className="flex items-center justify-between">
                                          <div>
                                                <p className="text-white font-medium text-sm">{alert.client}</p>
                                                <p className="text-gray-400 text-xs">{alert.state} • ${alert.currentRevenue.toLocaleString()}</p>
                                          </div>
                                              <div className={`px-2 py-1 rounded-md text-xs font-medium ${
                                                alert.status === 'active' ? 'bg-red-500/20 text-red-400' :
                                                alert.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
                                                'bg-yellow-500/20 text-yellow-400'
                                              }`}>
                                                {alert.status}
                                        </div>
                                        </div>
                                      </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                </div>
                              )}
                              
                            <Textarea
                              placeholder={`Enter ${block.title.toLowerCase()} details...`}
                              value={block.content}
                              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                              className="text-white"
                              classNames={{
                                input: "text-white",
                                inputWrapper: "bg-white/5 border-white/10"
                              }}
                        rows={3}
                              />
                        </div>
                      );
                    })}
                  </div>
                        )
                      )}
                    </div>
                        </div>
                    
        {/* Right Panel - Properties & Settings */}
        <div className={`${rightPanelExpanded ? 'w-80' : 'w-12'} transition-all duration-300 bg-white/5 border-l border-white/10 flex flex-col`}>
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            {rightPanelExpanded && (
              <h3 className="text-white font-semibold text-sm">Properties</h3>
                      )}
                      <Button
                        size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-white"
              onPress={() => setRightPanelExpanded(!rightPanelExpanded)}
            >
              {rightPanelExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </Button>
          </div>
          
          {rightPanelExpanded && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Client Selection */}
              <div>
                <label className="text-white font-medium text-sm mb-2 block">Client</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Click to select client..."
                    value={selectedClient ? selectedClient.name : ""}
                    readOnly
                    onClick={() => setShowClientModal(true)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 text-sm cursor-pointer"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Search className="w-4 h-4 text-gray-400" />
                  </div>
                    </div>
                  </div>
                  
                  {/* Decision Type */}
                  <div>
                <label className="text-white font-medium text-sm mb-2 block">Decision Type</label>
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
                <label className="text-white font-medium text-sm mb-2 block">Risk Level</label>
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
                <label className="text-white font-medium text-sm mb-2 block">Exposure</label>
                    <input
                      type="number"
                      placeholder="$0"
                      value={decision.exposure || ""}
                      onChange={(e) => setDecision(prev => ({ ...prev, exposure: parseFloat(e.target.value) || 0 }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all duration-200 h-10"
                    />
                  </div>

              {/* Description */}
                    <div>
                <label className="text-white font-medium text-sm mb-2 block">Description</label>
                  <textarea
                  placeholder="Brief description of the decision..."
                    value={decision.description}
                    onChange={(e) => setDecision(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all duration-200 resize-none"
                  rows={3}
                  />
                    </div>

              {/* Progress */}
                              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white font-medium text-sm">Progress</label>
                  <span className="text-gray-400 text-xs">{calculateCompletion()}%</span>
                        </div>
                <Progress 
                  value={calculateCompletion()} 
                  className="w-full"
                  color="success"
                  size="sm"
                />
                            </div>

              {/* Actions */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                      <Button
                        size="sm"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                startContent={<Save className="w-4 h-4" />}
                        onPress={() => finalizeDecision()}
                isDisabled={decision.status === 'finalized'}
              >
                {decision.status === 'finalized' ? 'Finalized' : 'Save Draft'}
                                </Button>
                                <Button
                                  size="sm"
                  variant="bordered"
                  className="w-full bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                  startContent={<Eye className="w-4 h-4" />}
                  onPress={() => setShowPreview(true)}
                >
                  Preview
                      </Button>
                    </div>
                    </div>
            )}
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

      {/* Client Selection Modal */}
      {showClientModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-black/90 backdrop-blur-xl rounded-2xl border border-white/20 max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Select Client</h2>
                    <p className="text-gray-400 text-sm">Choose a client for this decision record</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                  onPress={() => setShowClientModal(false)}
                >
                  ×
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Search and Filter Controls */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search clients by name or industry..."
                    value={clientModalSearch}
                    onChange={(e) => setClientModalSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200"
                  />
                </div>
                <Select
                  placeholder="Filter by industry"
                  selectedKeys={[clientModalFilter]}
                  onChange={(e) => setClientModalFilter(e.target.value)}
                  className="w-48"
                  classNames={{
                    trigger: "bg-white/5 border-white/10 h-12",
                    value: "text-white"
                  }}
                >
                  <SelectItem key="all" value="all">All Industries</SelectItem>
                  <SelectItem key="Technology" value="Technology">Technology</SelectItem>
                  <SelectItem key="E-commerce" value="E-commerce">E-commerce</SelectItem>
                  <SelectItem key="Software" value="Software">Software</SelectItem>
                  <SelectItem key="Retail" value="Retail">Retail</SelectItem>
                  <SelectItem key="Manufacturing" value="Manufacturing">Manufacturing</SelectItem>
                  <SelectItem key="Marketing" value="Marketing">Marketing</SelectItem>
                  <SelectItem key="Healthcare" value="Healthcare">Healthcare</SelectItem>
                </Select>
              </div>

              {/* Client List */}
              <div className="max-h-96 overflow-y-auto">
                {filteredModalClients.length > 0 ? (
                  <div className="space-y-2">
                    {filteredModalClients.map((client) => (
                      <div
                        key={client.id}
                        className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer group"
                        onClick={() => handleClientModalSelect(client.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                              <span className="text-white font-bold text-lg">
                                {client.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h3 className="text-white font-semibold text-lg">{client.name}</h3>
                              <p className="text-gray-400 text-sm">{client.industry}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-semibold text-lg">${(client.revenue / 1000000).toFixed(1)}M</p>
                            <p className="text-gray-400 text-sm">Annual Revenue</p>
                          </div>
                        </div>
                        
                        {/* Additional Client Details */}
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-400">Industry</p>
                              <p className="text-white font-medium">{client.industry}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Revenue</p>
                              <p className="text-white font-medium">${client.revenue.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Client ID</p>
                              <p className="text-white font-medium font-mono">{client.id}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Active States</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {client.states.map((state, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-md text-xs font-medium"
                                  >
                                    {state}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">No clients found</h3>
                    <p className="text-gray-400 text-sm">Try adjusting your search or filter criteria</p>
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
