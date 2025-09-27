"use client";
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Input, 
  Button, 
  Select, 
  SelectItem, 
  Textarea,
  Progress,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Avatar,
  Tooltip,
  Divider,
  Spinner
} from "@nextui-org/react";
import { CheckCircleIcon } from "@/components/icons/profile/check-circle-icon";
import { ExclamationTriangleIcon } from "@/components/icons/profile/exclamation-triangle-icon";
import { DocumentTextIcon } from "@/components/icons/profile/document-text-icon";
import { CloudArrowDownIcon } from "@/components/icons/profile/cloud-arrow-down-icon";
import { ChartBarIcon } from "@/components/icons/profile/chart-bar-icon";
import { UserGroupIcon } from "@/components/icons/profile/user-group-icon";
import { BuildingOfficeIcon } from "@/components/icons/profile/building-office-icon";
import { MapPinIcon } from "@/components/icons/profile/map-pin-icon";
import { CurrencyDollarIcon } from "@/components/icons/profile/currency-dollar-icon";
import { CalendarIcon } from "@/components/icons/profile/calendar-icon";
import { ClockIcon } from "@/components/icons/profile/clock-icon";
import { ShieldCheckIcon } from "@/components/icons/profile/shield-check-icon";
import { ArrowLeftIcon } from "@/components/icons/profile/arrow-left-icon";
import { MagnifyingGlassIcon } from "@/components/icons/profile/magnifying-glass-icon";

// Simplified client data structure
interface Client {
  id: string;
  name: string;
  avatar: string;
  industry: string;
  supervisor: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
    activeStates: string[];
    riskLevel: 'low' | 'medium' | 'high';
  qualityScore: number;
  previousPeriodSales?: number;
}

// State threshold data
interface StateThreshold {
  sales: number;
  transactions: number;
  riskLevel: 'low' | 'medium' | 'high';
}

// Sample data
const availableClients: Client[] = [
  {
    id: "techcorp-saas",
    name: "TechCorp SaaS",
    avatar: "T",
    industry: "Technology SaaS",
    supervisor: "Jane Doe, CPA",
    priority: "urgent",
      activeStates: ["CA", "TX", "NY", "FL"],
      riskLevel: "high",
    qualityScore: 92,
    previousPeriodSales: 485000
  },
  {
    id: "retailchain-llc",
    name: "RetailChain LLC",
    avatar: "R",
    industry: "E-commerce",
    supervisor: "Jane Doe, CPA",
    priority: "high",
      activeStates: ["CA", "TX", "NY", "FL", "WA"],
      riskLevel: "medium",
    qualityScore: 88,
    previousPeriodSales: 320000
  },
  {
    id: "manufacturingco",
    name: "ManufacturingCo",
    avatar: "M",
    industry: "Manufacturing",
    supervisor: "Jane Doe, CPA",
    priority: "medium",
    activeStates: ["TX", "CA", "NY"],
    riskLevel: "low",
    qualityScore: 95,
    previousPeriodSales: 280000
  }
];

const nexusThresholds: Record<string, StateThreshold> = {
  'CA': { sales: 500000, transactions: 200, riskLevel: 'high' },
  'TX': { sales: 500000, transactions: 200, riskLevel: 'high' },
  'NY': { sales: 500000, transactions: 100, riskLevel: 'high' },
  'FL': { sales: 100000, transactions: 200, riskLevel: 'medium' },
  'WA': { sales: 100000, transactions: 200, riskLevel: 'medium' }
};

export default function DataEntryWizard() {
  const [formData, setFormData] = useState({
    selectedClient: '',
    state: '',
    salesAmount: '',
    transactionCount: '',
    period: 'Q4 2024',
    notes: '',
    fileUpload: null as File | null
  });

  const [selectedClientData, setSelectedClientData] = useState<Client | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResults, setValidationResults] = useState<Record<string, any>>({});
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (formData.selectedClient || formData.state || formData.salesAmount) {
        setAutoSaveStatus('saving');
        setTimeout(() => {
          setAutoSaveStatus('saved');
        }, 1000);
      }
    }, 2000);

    return () => clearTimeout(autoSave);
  }, [formData]);

  // Real-time validation
  useEffect(() => {
    if (formData.state && formData.salesAmount) {
      const threshold = nexusThresholds[formData.state];
      const sales = parseFloat(formData.salesAmount);
      
      if (threshold) {
        const validation = {
          thresholdStatus: sales >= threshold.sales ? 'exceeded' : 
                          sales >= threshold.sales * 0.8 ? 'approaching' : 'safe',
          riskLevel: threshold.riskLevel,
          percentageComplete: (sales / threshold.sales) * 100,
          historicalComparison: selectedClientData?.previousPeriodSales ? 
            ((sales - selectedClientData.previousPeriodSales) / selectedClientData.previousPeriodSales) * 100 : null
        };
        setValidationResults(validation);
      }
    }
  }, [formData.state, formData.salesAmount, selectedClientData]);

  // Update selected client data
  useEffect(() => {
    if (formData.selectedClient) {
      const client = availableClients.find(c => c.id === formData.selectedClient);
      setSelectedClientData(client || null);
    }
  }, [formData.selectedClient]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, fileUpload: file }));
    }
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    onOpen();
  };

  const getNexusStatus = () => {
    if (!formData.state || !formData.salesAmount) return null;
    
    const threshold = nexusThresholds[formData.state];
    const sales = parseFloat(formData.salesAmount);
    
    if (threshold && sales >= threshold.sales) {
      return { status: 'critical', message: 'Nexus threshold exceeded' };
    } else if (threshold && sales >= threshold.sales * 0.8) {
      return { status: 'warning', message: 'Approaching nexus threshold' };
    }
    
    return { status: 'safe', message: 'Below nexus threshold' };
  };

  const nexusStatus = getNexusStatus();
  const isFormValid = formData.selectedClient && formData.state && formData.salesAmount;
  const completionPercentage = [
    formData.selectedClient,
    formData.state,
    formData.salesAmount,
    formData.transactionCount
  ].filter(Boolean).length * 25;

  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-6">
        <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
          
          {/* Main Content */}
          <div className="mt-6 gap-6 flex flex-col w-full">
            {/* Header */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
              <Button
                isIconOnly
                variant="light"
                className="text-gray-400 hover:text-white hover:bg-white/10"
                onClick={() => window.history.back()}
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </Button>
              <div>
                    <h2 className="text-2xl font-semibold text-white tracking-tight">Data Entry Wizard</h2>
                    <p className="text-gray-400 text-sm">Streamlined Economic Nexus data entry</p>
              </div>
            </div>
            
                <div className="flex items-center space-x-4">
              <Chip 
                color="success" 
                variant="flat"
                className="bg-green-500/10 text-green-400 border-green-500/20"
                startContent={autoSaveStatus === 'saved' ? <CheckCircleIcon className="w-4 h-4" /> : 
                            autoSaveStatus === 'saving' ? <Spinner size="sm" /> : <ExclamationTriangleIcon className="w-4 h-4" />}
              >
                {autoSaveStatus === 'saved' ? 'Auto-saved' : 
                 autoSaveStatus === 'saving' ? 'Saving...' : 'Save failed'}
              </Chip>
              
              {selectedClientData && (
                <Chip 
                      color={selectedClientData.riskLevel === 'high' ? 'danger' : 
                            selectedClientData.riskLevel === 'medium' ? 'warning' : 'success'}
                  variant="flat"
                >
                      {selectedClientData.riskLevel.toUpperCase()} RISK
                </Chip>
              )}
            </div>
          </div>
          
              {/* Progress Bar */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Entry Progress</span>
                  <span className="text-blue-400 font-medium">{completionPercentage}%</span>
                </div>
                <Progress value={completionPercentage} className="w-full" color="primary" />
          </div>
        </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Client Selection */}
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                  <CardHeader className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                      <h3 className="text-white text-lg font-semibold tracking-tight">Client Selection</h3>
                    </div>
                    {formData.selectedClient && (
                      <Chip color="success" size="sm" variant="flat">
                        Selected
                      </Chip>
                    )}
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-4">
                      <Select
                        value={formData.selectedClient}
                        onChange={(e) => handleInputChange('selectedClient', e.target.value)}
                        placeholder="Choose a client"
                        variant="bordered"
                        size="lg"
                        renderValue={(items) => {
                          return items.map((item) => {
                            const client = availableClients.find(c => c.id === item.key);
                            return (
                              <div key={item.key} className="flex items-center gap-3">
                                <Avatar name={client?.avatar} size="sm" className="bg-blue-500/20 text-blue-400" />
                                <div className="text-left">
                                  <div className="text-white font-medium">{client?.name}</div>
                                  <div className="text-gray-400 text-sm">{client?.industry}</div>
                                </div>
                              </div>
                            );
                          });
                        }}
                      >
                        {availableClients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            <div className="flex items-center gap-3">
                              <Avatar name={client.avatar} size="sm" className="bg-blue-500/20 text-blue-400" />
                              <div className="flex-1">
                                <div className="text-white font-medium">{client.name}</div>
                                <div className="text-gray-400 text-sm">{client.industry}</div>
                              </div>
                              <div className="flex flex-col gap-1">
                                <Chip 
                                  size="sm" 
                                  color={
                                    client.priority === 'urgent' ? 'danger' :
                                    client.priority === 'high' ? 'warning' :
                                    client.priority === 'medium' ? 'primary' : 'default'
                                  }
                                  variant="flat"
                                >
                                  {client.priority}
                                </Chip>
                                <Chip 
                                  size="sm" 
                                  color={
                                    client.riskLevel === 'high' ? 'danger' :
                                    client.riskLevel === 'medium' ? 'warning' : 'success'
                                  }
                                  variant="flat"
                                >
                                  {client.riskLevel} risk
                                </Chip>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </Select>

                      {/* Selected Client Info */}
                      {selectedClientData && (
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Avatar name={selectedClientData.avatar} size="md" className="bg-blue-500/20 text-blue-400" />
                          <div>
                                <h4 className="text-white font-semibold">{selectedClientData.name}</h4>
                                <p className="text-gray-400 text-sm">{selectedClientData.industry}</p>
                                <p className="text-gray-400 text-xs">Supervisor: {selectedClientData.supervisor}</p>
                          </div>
                        </div>
                            <div className="text-right">
                              <div className="text-white font-semibold">{selectedClientData.qualityScore}%</div>
                              <div className="text-gray-400 text-xs">Quality Score</div>
                      </div>
                              </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {selectedClientData.activeStates.map(state => (
                              <Chip key={state} size="sm" variant="flat">
                                      {state}
                                    </Chip>
                                  ))}
                            </div>
                          </div>
                        )}
                  </div>
                </CardBody>
              </Card>

                {/* Data Entry */}
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                  <CardHeader className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                      <h3 className="text-white text-lg font-semibold tracking-tight">Sales Data Entry</h3>
                    </div>
                    {formData.state && formData.salesAmount && (
                      <Chip color="success" size="sm" variant="flat">
                        Data Entered
                      </Chip>
                    )}
                  </CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">State</label>
                        <Select
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          placeholder="Select state"
                          variant="bordered"
                          size="lg"
                          isDisabled={!formData.selectedClient}
                        >
                          {selectedClientData?.activeStates.map(state => (
                            <SelectItem key={state} value={state}>
                              <div className="flex items-center justify-between w-full">
                                <span>{state}</span>
                                <Chip 
                                  size="sm" 
                                  color={
                                    nexusThresholds[state]?.riskLevel === 'high' ? 'danger' :
                                    nexusThresholds[state]?.riskLevel === 'medium' ? 'warning' : 'success'
                                  }
                                  variant="flat"
                                >
                                  {nexusThresholds[state]?.riskLevel}
                                </Chip>
                              </div>
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">Period</label>
                        <Select
                          value={formData.period}
                          onChange={(e) => handleInputChange('period', e.target.value)}
                          placeholder="Select period"
                          variant="bordered"
                          size="lg"
                        >
                          <SelectItem key="q4-2024" value="Q4 2024">Q4 2024</SelectItem>
                          <SelectItem key="q3-2024" value="Q3 2024">Q3 2024</SelectItem>
                          <SelectItem key="q2-2024" value="Q2 2024">Q2 2024</SelectItem>
                          <SelectItem key="q1-2024" value="Q1 2024">Q1 2024</SelectItem>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">Sales Amount</label>
                        <Input
                          value={formData.salesAmount}
                          onChange={(e) => handleInputChange('salesAmount', e.target.value)}
                          placeholder="0.00"
                          type="number"
                          variant="bordered"
                          size="lg"
                          startContent={<CurrencyDollarIcon className="w-5 h-5 text-gray-400" />}
                        />
                        
                        {/* Real-time validation feedback */}
                        {validationResults.thresholdStatus && (
                          <div className={`mt-2 p-3 rounded-lg border ${
                            validationResults.thresholdStatus === 'exceeded' ? 'bg-red-500/10 border-red-500/20' :
                            validationResults.thresholdStatus === 'approaching' ? 'bg-orange-500/10 border-orange-500/20' :
                            'bg-green-500/10 border-green-500/20'
                          }`}>
                            <div className="flex items-center gap-2">
                              {validationResults.thresholdStatus === 'exceeded' && <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />}
                              {validationResults.thresholdStatus === 'approaching' && <ExclamationTriangleIcon className="w-4 h-4 text-orange-500" />}
                              {validationResults.thresholdStatus === 'safe' && <CheckCircleIcon className="w-4 h-4 text-green-500" />}
                              <span className={`text-sm font-medium ${
                                validationResults.thresholdStatus === 'exceeded' ? 'text-red-400' :
                                validationResults.thresholdStatus === 'approaching' ? 'text-orange-400' :
                                'text-green-400'
                              }`}>
                                {validationResults.thresholdStatus === 'exceeded' ? 'THRESHOLD EXCEEDED' :
                                 validationResults.thresholdStatus === 'approaching' ? 'APPROACHING THRESHOLD' :
                                 'BELOW THRESHOLD'}
                              </span>
                            </div>
                            <div className="mt-2">
                              <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Progress to threshold</span>
                                <span>{Math.round(validationResults.percentageComplete)}%</span>
                              </div>
                              <Progress 
                                value={validationResults.percentageComplete} 
                                color={
                                  validationResults.percentageComplete >= 100 ? 'danger' :
                                  validationResults.percentageComplete >= 80 ? 'warning' : 'success'
                                }
                                className="w-full"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">Transaction Count</label>
                        <Input
                          value={formData.transactionCount}
                          onChange={(e) => handleInputChange('transactionCount', e.target.value)}
                          placeholder="0"
                          type="number"
                          variant="bordered"
                          size="lg"
                          startContent={<ChartBarIcon className="w-5 h-5 text-gray-400" />}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Notes</label>
                      <Textarea
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        placeholder="Any additional notes or observations..."
                        variant="bordered"
                        minRows={3}
                        maxRows={6}
                      />
                  </div>
                </CardBody>
              </Card>

                {/* File Upload */}
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                      <h3 className="text-white text-lg font-semibold tracking-tight">Supporting Documents</h3>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-white/40 transition-colors">
                      <CloudArrowDownIcon className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-400 mb-3">
                        Drag files here or click to upload
                      </p>
                      <Button
                            size="sm" 
                        variant="bordered"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        Choose Files
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,.xlsx,.csv"
                      />
                  </div>

                    {formData.fileUpload && (
                      <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <div className="flex items-center gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-400">{formData.fileUpload.name}</span>
                      </div>
                      </div>
                    )}
                  </CardBody>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <Button
                      color="primary"
                      size="lg"
                      onClick={handleSubmit}
                      isLoading={isProcessing}
                    isDisabled={!isFormValid}
                      className="px-8"
                    >
                    {isProcessing ? 'Submitting...' : 'Submit for Review'}
                    </Button>
                  </div>
          </div>

              {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
              <CardBody className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Progress Tracking</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Completion</span>
                          <span className="text-white">{completionPercentage}%</span>
                    </div>
                        <Progress value={completionPercentage} className="w-full" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {formData.selectedClient ? (
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-600" />
                      )}
                      <span className="text-sm text-gray-400">Client selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                          {formData.state ? (
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-600" />
                      )}
                          <span className="text-sm text-gray-400">State selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                          {formData.salesAmount ? (
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-600" />
                      )}
                          <span className="text-sm text-gray-400">Sales amount entered</span>
                    </div>
                    <div className="flex items-center gap-2">
                          {formData.transactionCount ? (
                      <CheckCircleIcon className="w-4 h-4 text-green-500" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-gray-600" />
                          )}
                          <span className="text-sm text-gray-400">Transaction count</span>
                    </div>
                  </div>
                    </div>
              </CardBody>
            </Card>

            {/* Real-time Validation Status */}
            {validationResults.thresholdStatus && (
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardBody className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Validation Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Threshold Status</span>
                      <Chip 
                        size="sm" 
                        color={
                          validationResults.thresholdStatus === 'exceeded' ? 'danger' :
                          validationResults.thresholdStatus === 'approaching' ? 'warning' : 'success'
                        }
                        variant="flat"
                      >
                        {validationResults.thresholdStatus}
                      </Chip>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Progress</span>
                      <span className="text-sm text-white">{Math.round(validationResults.percentageComplete)}%</span>
                    </div>
                    {validationResults.historicalComparison && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">vs Previous</span>
                        <span className={`text-sm ${
                          validationResults.historicalComparison > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {validationResults.historicalComparison > 0 ? '+' : ''}{Math.round(validationResults.historicalComparison)}%
                        </span>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            )}

                {/* Quick Actions */}
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                  <CardBody className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                      <Button 
                        size="sm" 
                        variant="bordered" 
                        className="w-full justify-start"
                        onClick={() => setFormData(prev => ({ ...prev, period: 'Q4 2024' }))}
                      >
                        Set Q4 2024
                      </Button>
                      <Button 
                        size="sm" 
                        variant="bordered" 
                        className="w-full justify-start"
                        onClick={() => setFormData(prev => ({ ...prev, notes: 'Data verified and entered per client instructions' }))}
                      >
                        Add Standard Note
                      </Button>
                      <Button 
                        size="sm" 
                        variant="bordered" 
                        className="w-full justify-start"
                        onClick={() => window.history.back()}
                      >
                        Back to Dashboard
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent className="bg-white/5 backdrop-blur-xl border border-white/10">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Data Entry Complete</h3>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <p className="text-gray-400">
                  Your data entry has been submitted for professional review. 
                  A Tax Manager will review the information and provide feedback within 24 hours.
                </p>
                <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-blue-400">
                      Reference ID: SA-2024-001234
                    </span>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-400">
                      Professional liability protection active
                    </span>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button 
                  color="primary" 
                  onPress={onClose}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Continue
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}