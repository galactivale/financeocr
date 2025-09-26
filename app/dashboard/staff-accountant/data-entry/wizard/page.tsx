"use client";
import React, { useState, useEffect, useRef } from "react";
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
  Divider,
  Tooltip
} from "@nextui-org/react";
import { CheckCircleIcon } from "@/components/icons/profile/check-circle-icon";
import { ExclamationTriangleIcon } from "@/components/icons/profile/exclamation-triangle-icon";
import { InfoIcon } from "@/components/icons/accounts/info-icon";
import { DocumentTextIcon } from "@/components/icons/profile/document-text-icon";
import { CloudArrowDownIcon } from "@/components/icons/profile/cloud-arrow-down-icon";
import { MagnifyingGlassIcon } from "@/components/icons/profile/magnifying-glass-icon";
import { ChartBarIcon } from "@/components/icons/profile/chart-bar-icon";
import { UserGroupIcon } from "@/components/icons/profile/user-group-icon";
import { BuildingOfficeIcon } from "@/components/icons/profile/building-office-icon";
import { MapPinIcon } from "@/components/icons/profile/map-pin-icon";
import { CurrencyDollarIcon } from "@/components/icons/profile/currency-dollar-icon";
import { CalendarIcon } from "@/components/icons/profile/calendar-icon";
import { ClockIcon } from "@/components/icons/profile/clock-icon";
import { ShieldCheckIcon } from "@/components/icons/profile/shield-check-icon";
import { AcademicCapIcon } from "@/components/icons/profile/academic-cap-icon";

// Apple Design System inspired data entry wizard page
export default function DataEntryWizard() {
  const [formData, setFormData] = useState({
    clientName: '',
    state: '',
    salesAmount: '',
    transactionCount: '',
    period: '',
    businessType: '',
    notes: '',
    fileUpload: null as File | null
  });

  const [validation, setValidation] = useState({
    clientName: { isValid: true, message: '' },
    state: { isValid: true, message: '' },
    salesAmount: { isValid: true, message: '' },
    transactionCount: { isValid: true, message: '' }
  });

  const [qualityScore, setQualityScore] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [dragActive, setDragActive] = useState(false);
  
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State-specific nexus thresholds
  const nexusThresholds = {
    'CA': { sales: 500000, transactions: 200 },
    'TX': { sales: 500000, transactions: 200 },
    'NY': { sales: 500000, transactions: 100 },
    'FL': { sales: 100000, transactions: 200 },
    'WA': { sales: 100000, transactions: 200 }
  };

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (formData.clientName || formData.state || formData.salesAmount) {
        setAutoSaveStatus('saving');
        // Simulate auto-save
        setTimeout(() => {
          setAutoSaveStatus('saved');
        }, 1000);
      }
    }, 2000);

    return () => clearTimeout(autoSave);
  }, [formData]);

  // Real-time validation
  useEffect(() => {
    validateForm();
    calculateQualityScore();
  }, [formData]);

  const validateForm = () => {
    const newValidation = { ...validation };

    // Client name validation
    if (formData.clientName.length < 2) {
      newValidation.clientName = { isValid: false, message: 'Client name must be at least 2 characters' };
    } else {
      newValidation.clientName = { isValid: true, message: '' };
    }

    // Sales amount validation
    const salesNum = parseFloat(formData.salesAmount);
    if (formData.salesAmount && (isNaN(salesNum) || salesNum < 0)) {
      newValidation.salesAmount = { isValid: false, message: 'Please enter a valid sales amount' };
    } else {
      newValidation.salesAmount = { isValid: true, message: '' };
    }

    // State-specific threshold validation
    if (formData.state && formData.salesAmount) {
      const threshold = nexusThresholds[formData.state as keyof typeof nexusThresholds];
      if (threshold && salesNum >= threshold.sales) {
        newValidation.salesAmount = { 
          isValid: true, 
          message: `⚠️ Approaching nexus threshold (${threshold.sales.toLocaleString()})` 
        };
      }
    }

    setValidation(newValidation);
  };

  const calculateQualityScore = () => {
    let score = 0;
    const fields = ['clientName', 'state', 'salesAmount', 'transactionCount'];
    
    fields.forEach(field => {
      if (formData[field as keyof typeof formData]) score += 25;
    });

    setQualityScore(score);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, fileUpload: file }));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData(prev => ({ ...prev, fileUpload: e.dataTransfer.files[0] }));
    }
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    onOpen();
  };

  const getNexusStatus = () => {
    if (!formData.state || !formData.salesAmount) return null;
    
    const threshold = nexusThresholds[formData.state as keyof typeof nexusThresholds];
    const sales = parseFloat(formData.salesAmount);
    
    if (threshold && sales >= threshold.sales) {
      return { status: 'critical', message: 'Nexus threshold exceeded' };
    } else if (threshold && sales >= threshold.sales * 0.8) {
      return { status: 'warning', message: 'Approaching nexus threshold' };
    }
    
    return { status: 'safe', message: 'Below nexus threshold' };
  };

  const nexusStatus = getNexusStatus();

  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-6">
        <div className="flex justify-center gap-6 xl:gap-8 pt-6 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-12 max-w-[90rem] mx-auto w-full">
          <div className="mt-6 gap-8 flex flex-col w-full">
            {/* Header with Apple-style typography */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Data Entry Wizard</h2>
              </div>
              <p className="text-gray-400 text-sm font-medium ml-4">
                Economic Nexus compliance data processing
              </p>
            </div>
            
            {/* Status Cards */}
            <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-6 justify-center w-full">
              {/* Auto-save Status Card */}
              <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                      {autoSaveStatus === 'saved' && (
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      )}
                      {autoSaveStatus === 'saving' && (
                        <ClockIcon className="w-5 h-5 text-blue-500 animate-spin" />
                      )}
                      {autoSaveStatus === 'error' && (
                        <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm tracking-tight">Auto-Save</h3>
                      <p className="text-gray-400 text-xs font-medium">
                        {autoSaveStatus === 'saved' ? 'All changes saved' : 
                         autoSaveStatus === 'saving' ? 'Saving...' : 'Save failed'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quality Score Card */}
              <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                      <ChartBarIcon className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm tracking-tight">Data Quality</h3>
                      <p className="text-gray-400 text-xs font-medium">Completeness score</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-white">{qualityScore}%</span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        qualityScore >= 75 ? 'bg-green-500' : 
                        qualityScore >= 50 ? 'bg-orange-500' : 'bg-red-500'
                      }`}></div>
                      <span className={`text-sm font-medium ${
                        qualityScore >= 75 ? 'text-green-400' : 
                        qualityScore >= 50 ? 'text-orange-400' : 'text-red-400'
                      }`}>
                        {qualityScore >= 75 ? 'Excellent' : 
                         qualityScore >= 50 ? 'Good' : 'Needs work'}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1">
                    <div className={`h-1 rounded-full transition-all duration-500 ${
                      qualityScore >= 75 ? 'bg-green-500' : 
                      qualityScore >= 50 ? 'bg-orange-500' : 'bg-red-500'
                    }`} style={{width: `${qualityScore}%`}}></div>
                  </div>
                </div>
              </div>

              {/* Nexus Status Card */}
              {nexusStatus && (
                <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        nexusStatus.status === 'critical' ? 'bg-red-500/10' :
                        nexusStatus.status === 'warning' ? 'bg-orange-500/10' :
                        'bg-green-500/10'
                      }`}>
                        {nexusStatus.status === 'critical' && (
                          <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                        )}
                        {nexusStatus.status === 'warning' && (
                          <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />
                        )}
                        {nexusStatus.status === 'safe' && (
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm tracking-tight">Nexus Status</h3>
                        <p className="text-gray-400 text-xs font-medium">Threshold monitoring</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-lg font-bold ${
                        nexusStatus.status === 'critical' ? 'text-red-400' :
                        nexusStatus.status === 'warning' ? 'text-orange-400' :
                        'text-green-400'
                      }`}>
                        {nexusStatus.status === 'critical' ? 'CRITICAL' :
                         nexusStatus.status === 'warning' ? 'WARNING' : 'SAFE'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {nexusStatus.message}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Main Form Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form - Primary Layer */}
              <div className="lg:col-span-2 space-y-6">
                {/* Client Information Card */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                      <BuildingOfficeIcon className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white tracking-tight">
                        Client Information
                      </h2>
                      <p className="text-sm text-gray-400 font-medium">
                        Essential client details for nexus analysis
                      </p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                          Client Name *
                        </label>
                        <Input
                          value={formData.clientName}
                          onChange={(e) => handleInputChange('clientName', e.target.value)}
                          placeholder="Enter client name"
                          variant="bordered"
                          className="font-mono bg-white/5 border-white/20 text-white placeholder-gray-400"
                          color={validation.clientName.isValid ? 'default' : 'danger'}
                          errorMessage={validation.clientName.message}
                          startContent={<UserGroupIcon />}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                          Business Type
                        </label>
                        <Select
                          value={formData.businessType}
                          onChange={(e) => handleInputChange('businessType', e.target.value)}
                          placeholder="Select business type"
                          variant="bordered"
                          className="bg-white/5 border-white/20"
                        >
                          <SelectItem key="retail" value="retail">Retail</SelectItem>
                          <SelectItem key="saas" value="saas">SaaS</SelectItem>
                          <SelectItem key="manufacturing" value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem key="services" value="services">Services</SelectItem>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Economic Nexus Data Card */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                      <MapPinIcon className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white tracking-tight">
                        Economic Nexus Data
                      </h2>
                      <p className="text-sm text-gray-400 font-medium">
                        State-specific sales and transaction data
                      </p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                          State *
                        </label>
                        <Select
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          placeholder="Select state"
                          variant="bordered"
                          className="bg-white/5 border-white/20"
                          color={validation.state.isValid ? 'default' : 'danger'}
                          errorMessage={validation.state.message}
                        >
                          <SelectItem key="CA" value="CA">California</SelectItem>
                          <SelectItem key="TX" value="TX">Texas</SelectItem>
                          <SelectItem key="NY" value="NY">New York</SelectItem>
                          <SelectItem key="FL" value="FL">Florida</SelectItem>
                          <SelectItem key="WA" value="WA">Washington</SelectItem>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                          Reporting Period
                        </label>
                        <Select
                          value={formData.period}
                          onChange={(e) => handleInputChange('period', e.target.value)}
                          placeholder="Select period"
                          variant="bordered"
                          className="bg-white/5 border-white/20"
                        >
                          <SelectItem key="q1-2024" value="q1-2024">Q1 2024</SelectItem>
                          <SelectItem key="q2-2024" value="q2-2024">Q2 2024</SelectItem>
                          <SelectItem key="q3-2024" value="q3-2024">Q3 2024</SelectItem>
                          <SelectItem key="q4-2024" value="q4-2024">Q4 2024</SelectItem>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                          Sales Amount *
                        </label>
                        <Input
                          value={formData.salesAmount}
                          onChange={(e) => handleInputChange('salesAmount', e.target.value)}
                          placeholder="0.00"
                          variant="bordered"
                          type="number"
                          className="font-mono text-lg bg-white/5 border-white/20 text-white placeholder-gray-400"
                          color={validation.salesAmount.isValid ? 'default' : 'danger'}
                          errorMessage={validation.salesAmount.message}
                          startContent={<CurrencyDollarIcon />}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                          Transaction Count
                        </label>
                        <Input
                          value={formData.transactionCount}
                          onChange={(e) => handleInputChange('transactionCount', e.target.value)}
                          placeholder="0"
                          variant="bordered"
                          type="number"
                          className="font-mono text-lg bg-white/5 border-white/20 text-white placeholder-gray-400"
                          color={validation.transactionCount.isValid ? 'default' : 'danger'}
                          errorMessage={validation.transactionCount.message}
                          startContent={<ChartBarIcon />}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* File Upload Card */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                      <DocumentTextIcon className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white tracking-tight">
                        Supporting Documentation
                      </h2>
                      <p className="text-sm text-gray-400 font-medium">
                        Upload financial statements or supporting files
                      </p>
                    </div>
                  </div>
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                      dragActive 
                        ? 'border-blue-400 bg-blue-500/10' 
                        : 'border-white/20 hover:border-white/40'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <CloudArrowDownIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-white mb-2">
                      Drag and drop files here, or click to browse
                    </p>
                    <p className="text-sm text-gray-400 mb-4">
                      PDF, Excel, CSV files up to 10MB
                    </p>
                    <Button
                      color="primary"
                      variant="bordered"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose Files
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.xlsx,.csv"
                    />
                  </div>
                  
                  {formData.fileUpload && (
                    <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div className="flex items-center space-x-3">
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium text-green-400">
                          {formData.fileUpload.name}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Notes Card */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gray-500/10 rounded-xl flex items-center justify-center">
                      <DocumentTextIcon className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white tracking-tight">
                        Additional Notes
                      </h2>
                      <p className="text-sm text-gray-400 font-medium">
                        Any additional context or observations
                      </p>
                    </div>
                  </div>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Enter any additional notes or observations..."
                    variant="bordered"
                    minRows={4}
                    maxRows={8}
                    className="bg-white/5 border-white/20 text-white placeholder-gray-400"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <Button
                    color="default"
                    variant="bordered"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    onClick={() => setShowHelp(!showHelp)}
                    startContent={<AcademicCapIcon className="w-5 h-5" />}
                  >
                    {showHelp ? 'Hide Help' : 'Show Help'}
                  </Button>
                  
                  <Button
                    color="primary"
                    size="lg"
                    onClick={handleSubmit}
                    isLoading={isProcessing}
                    isDisabled={qualityScore < 75}
                    startContent={!isProcessing && <ShieldCheckIcon className="w-5 h-5" />}
                    className="px-8 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isProcessing ? 'Processing...' : 'Submit for Review'}
                  </Button>
                </div>
              </div>

              {/* Sidebar - Secondary Layer */}
              <div className="mt-4 gap-6 flex flex-col xl:max-w-md w-full">
                {/* Help Panel */}
                {showHelp && (
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                        <InfoIcon className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white tracking-tight">
                          Economic Nexus Guide
                        </h3>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <h4 className="font-medium text-white">What is Economic Nexus?</h4>
                        <p className="text-sm text-gray-400">
                          Economic nexus is established when a business exceeds certain sales or transaction thresholds in a state, requiring tax registration and compliance.
                        </p>
                      </div>
                      
                      <div className="w-full h-px bg-white/10"></div>
                      
                      <div className="space-y-3">
                        <h4 className="font-medium text-white">Common Thresholds</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">California</span>
                            <span className="font-mono text-white">$500K</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Texas</span>
                            <span className="font-mono text-white">$500K</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Florida</span>
                            <span className="font-mono text-white">$100K</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quality Metrics */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                      <ChartBarIcon className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white tracking-tight">
                        Data Quality
                      </h3>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Completeness</span>
                        <Chip 
                          color={qualityScore >= 75 ? 'success' : qualityScore >= 50 ? 'warning' : 'danger'}
                          size="sm"
                        >
                          {qualityScore}%
                        </Chip>
                      </div>
                      <Progress 
                        value={qualityScore} 
                        color={qualityScore >= 75 ? 'success' : qualityScore >= 50 ? 'warning' : 'danger'}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-400">Client name provided</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-400">State selected</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-400">Sales amount entered</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-400">Transaction count provided</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                      <ClockIcon className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white tracking-tight">
                        Recent Activity
                      </h3>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-white">Auto-save completed</p>
                          <p className="text-xs text-gray-400">2 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-white">Validation updated</p>
                          <p className="text-xs text-gray-400">5 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-white">Session started</p>
                          <p className="text-xs text-gray-400">15 minutes ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md" className="bg-black">
        <ModalContent className="bg-white/5 backdrop-blur-xl border border-white/10">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white tracking-tight">
                      Data Submitted Successfully
                    </h3>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <p className="text-gray-400">
                  Your data entry has been submitted for review. A tax manager will review the information and provide feedback within 24 hours.
                </p>
                <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="flex items-center space-x-2">
                    <InfoIcon className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-blue-400">
                      Reference ID: SA-2024-001234
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

