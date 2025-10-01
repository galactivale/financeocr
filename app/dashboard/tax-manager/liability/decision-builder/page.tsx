"use client";
import React, { useState } from "react";
import { 
  Card, 
  CardBody, 
  Button, 
  Input,
  Textarea,
  Select,
  SelectItem
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
  GripVertical
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
}

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

  return (
    <div className="min-h-screen bg-black">
      {/* Apple-style Header */}
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
                <p className="text-gray-400 text-sm">Create legally defensible decision records</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                variant="bordered"
                className="bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 rounded-xl"
                startContent={<Eye className="w-4 h-4" />}
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
          {/* Left Sidebar - Block Library */}
          <div className="lg:col-span-1">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
              <CardBody className="p-6">
                <h3 className="text-white font-semibold mb-4">Evidence Blocks</h3>
                <div className="space-y-2">
                  {blockTypes.map((blockType) => {
                    const IconComponent = blockType.icon;
                    return (
                      <div
                        key={blockType.type}
                        className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                        onClick={() => addBlock(blockType.type)}
                      >
                        <div className={`w-8 h-8 bg-${blockType.color}-500/20 rounded-lg flex items-center justify-center`}>
                          <IconComponent className={`w-4 h-4 text-${blockType.color}-400`} />
                        </div>
                        <span className="text-white text-sm">{blockType.title}</span>
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Main Content - Decision Builder */}
          <div className="lg:col-span-3">
            {/* Decision Header */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl mb-6">
              <CardBody className="p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Decision Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Client Name"
                    placeholder="Enter client name"
                    value={decision.client}
                    onChange={(e) => setDecision(prev => ({ ...prev, client: e.target.value }))}
                    className="text-white"
                    classNames={{
                      input: "text-white",
                      inputWrapper: "bg-white/5 border-white/10"
                    }}
                  />
                  <Select
                    label="Decision Type"
                    placeholder="Select decision type"
                    selectedKeys={decision.decisionType ? [decision.decisionType] : []}
                    onChange={(e) => setDecision(prev => ({ ...prev, decisionType: e.target.value }))}
                    className="text-white"
                    classNames={{
                      trigger: "bg-white/5 border-white/10",
                      value: "text-white"
                    }}
                  >
                    <SelectItem key="nexus_registration" value="nexus_registration">Nexus Registration</SelectItem>
                    <SelectItem key="voluntary_disclosure" value="voluntary_disclosure">Voluntary Disclosure</SelectItem>
                    <SelectItem key="penalty_assessment" value="penalty_assessment">Penalty Assessment</SelectItem>
                    <SelectItem key="nexus_analysis" value="nexus_analysis">Nexus Analysis</SelectItem>
                  </Select>
                  <Input
                    label="Risk Level"
                    placeholder="Enter risk level"
                    value={decision.riskLevel}
                    onChange={(e) => setDecision(prev => ({ ...prev, riskLevel: e.target.value as any }))}
                    className="text-white"
                    classNames={{
                      input: "text-white",
                      inputWrapper: "bg-white/5 border-white/10"
                    }}
                  />
                  <Input
                    label="Exposure Amount"
                    placeholder="Enter exposure amount"
                    type="number"
                    value={decision.exposure.toString()}
                    onChange={(e) => setDecision(prev => ({ ...prev, exposure: parseFloat(e.target.value) || 0 }))}
                    className="text-white"
                    classNames={{
                      input: "text-white",
                      inputWrapper: "bg-white/5 border-white/10"
                    }}
                  />
                </div>
                <Textarea
                  label="Decision Description"
                  placeholder="Describe the decision and context"
                  value={decision.description}
                  onChange={(e) => setDecision(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-6 text-white"
                  classNames={{
                    input: "text-white",
                    inputWrapper: "bg-white/5 border-white/10"
                  }}
                />
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
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-gray-400 hover:text-white"
                                startContent={<GripVertical className="w-4 h-4" />}
                              >
                                Drag
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-400 hover:text-red-300"
                                startContent={<Trash2 className="w-4 h-4" />}
                                onPress={() => removeBlock(block.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                          
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
    </div>
  );
}
