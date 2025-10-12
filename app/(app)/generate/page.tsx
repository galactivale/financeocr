"use client";

import React, { useState } from "react";
import { Button, Input, Select, SelectItem, Textarea, Progress, Card, CardBody } from "@nextui-org/react";
import { CheckCircleIcon } from "@/components/icons/profile/check-circle-icon";
import { UserIcon } from "@/components/icons/profile/user-icon";
import { MapPinIcon } from "@/components/icons/profile/map-pin-icon";
import { DocumentTextIcon } from "@/components/icons/profile/document-text-icon";
import { ClockIcon } from "@/components/icons/profile/clock-icon";
import { ChartBarIcon } from "@/components/icons/profile/chart-bar-icon";
import { ExclamationTriangleIcon } from "@/components/icons/profile/exclamation-triangle-icon";
import { ArrowLeftIcon } from "@/components/icons/profile/arrow-left-icon";
import { useDashboard } from "@/contexts/DashboardContext";
import { usePersonalizedDashboard } from "@/contexts/PersonalizedDashboardContext";
import { DashboardDetails } from "@/components/dashboard/dashboard-details";
import { apiClient } from "@/lib/api";

type FormState = {
  clientName: string;
  priorityStates: string[];
  painPoints: string[];
  multiStateClientCount: string;
  primaryIndustry: string;
  qualificationStrategy: string;
  additionalNotes: string;
};

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const PAIN_POINTS = [
  "Multi-state compliance complexity",
  "Nexus determination challenges",
  "Tax rate variations",
  "Filing deadline management",
  "Audit risk assessment",
  "Technology integration",
  "Resource allocation",
  "Client communication"
];

const INDUSTRIES = [
  "Technology", "Healthcare", "Manufacturing", "Retail", "Financial Services",
  "Real Estate", "Construction", "Professional Services", "E-commerce", "Other"
];

const CLIENT_COUNT_RANGES = [
  "1-10", "11-25", "26-50", "51-100", "101-250", "250+",
];

export default function GeneratePage() {
  const { addDashboard, dashboards, archivedDashboards, refreshDashboards } = useDashboard();
  const { setDashboardSession } = usePersonalizedDashboard();
  const [selectedDashboardId, setSelectedDashboardId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormState>({
    clientName: "",
    priorityStates: [],
    painPoints: [],
    multiStateClientCount: "",
    primaryIndustry: "",
    qualificationStrategy: "",
    additionalNotes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStepMessage, setCurrentStepMessage] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const steps = [
    { id: 1, title: "Client Information", description: "Basic client details", icon: UserIcon },
    { id: 2, title: "Locations & Pain Points", description: "States and challenges", icon: MapPinIcon },
    { id: 3, title: "Industry & Strategy", description: "Industry and qualification", icon: ChartBarIcon },
    { id: 4, title: "Notes & Review", description: "Additional notes and submit", icon: DocumentTextIcon },
  ] as const;

  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = steps.length;

  // Listen for dashboard selection from sidebar
  React.useEffect(() => {
    const handleDashboardSelected = (event: CustomEvent) => {
      setSelectedDashboardId(event.detail.dashboardId);
    };

    window.addEventListener('dashboardSelected', handleDashboardSelected as EventListener);
    return () => {
      window.removeEventListener('dashboardSelected', handleDashboardSelected as EventListener);
    };
  }, []);

  const handleStateToggle = (state: string) => {
    setFormData((prev) => ({
      ...prev,
      priorityStates: prev.priorityStates.includes(state)
        ? prev.priorityStates.filter((s) => s !== state)
        : [...prev.priorityStates, state],
    }));
  };

  const handlePainPointToggle = (painPoint: string) => {
    setFormData((prev) => ({
      ...prev,
      painPoints: prev.painPoints.includes(painPoint)
        ? prev.painPoints.filter((p) => p !== painPoint)
        : [...prev.painPoints, painPoint],
    }));
  };

  const goNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goPrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.clientName.trim() !== "" && formData.multiStateClientCount !== "";
      case 2:
        return formData.priorityStates.length > 0 && formData.painPoints.length > 0;
      case 3:
        return formData.primaryIndustry !== "" && formData.qualificationStrategy !== "";
      case 4:
        return true; // Notes are optional
      default:
        return false;
    }
  };

  const simulateProgress = async () => {
    const steps = [
      { progress: 10, message: "Initializing dashboard generation..." },
      { progress: 25, message: "Creating unique client profiles..." },
      { progress: 40, message: "Generating nexus monitoring data..." },
      { progress: 60, message: "Setting up client relationships..." },
      { progress: 80, message: "Configuring alerts and tasks..." },
      { progress: 95, message: "Finalizing dashboard setup..." },
      { progress: 100, message: "Dashboard generated successfully!" }
    ];

    for (const step of steps) {
      setGenerationProgress(step.progress);
      setCurrentStepMessage(step.message);
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate processing time
    }
  };

  const showSuccessMessage = () => {
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setGenerationProgress(0);
    setCurrentStepMessage("");
    
    // Generate a unique organization ID for each dashboard generation
    // This ensures each firm only sees their own clients
    const organizationId = `org-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    
    try {
      // Start progress simulation
      const progressPromise = simulateProgress();
      
      // Call the backend API to generate the dashboard
      console.log('🚀 Sending dashboard generation request:', { formData, organizationId });
      const response = await apiClient.generateDashboard(formData, organizationId);
      
      // Wait for progress to complete
      await progressPromise;
      
      console.log('📥 Dashboard generation response:', response);
      
      if (response.success && response.data) {
        console.log('✅ Dashboard generation successful:', response.data);
        
        // Validate that we have the required data
        if (!response.data.uniqueUrl || !response.data.dashboardUrl) {
          throw new Error('Invalid dashboard data received from server');
        }
        
        // Show success toast
        showSuccessMessage();
        
        // Set dashboard session cookie
        setDashboardSession({
          dashboardUrl: response.data.uniqueUrl,
          clientName: formData.clientName,
          organizationId: organizationId,
          createdAt: Date.now()
        });
        
        // Refresh the dashboard list to include the new dashboard
        await refreshDashboards();
        
        // Wait a moment to show success message, then redirect
        setTimeout(() => {
          console.log('Redirecting to:', response.data.dashboardUrl);
          window.location.href = response.data.dashboardUrl;
        }, 1500);
        
      } else {
        console.error('❌ Dashboard generation failed:', response);
        throw new Error(response.error || 'Failed to generate dashboard');
      }
    } catch (error) {
      console.error('❌ Error generating dashboard:', error);
      console.error('📋 Error details:', {
        message: error.message,
        stack: error.stack,
        formData: formData,
        organizationId: organizationId
      });
      alert(`Error generating dashboard: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
      setGenerationProgress(0);
      setCurrentStepMessage("");
    }
  };


  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto px-2.5">
        <div className="flex flex-col gap-6">
          {/* Header Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
              <h2 className="text-3xl font-normal text-white tracking-normal" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Dashboard Generator</h2>
            </div>
            
            {/* Generation Progress - Show when generating */}
            {isSubmitting && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                    Generating Dashboard
                  </h3>
                  <div className="text-sm text-white/70" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                    {generationProgress}%
                  </div>
                </div>
                
                <Progress 
                  value={generationProgress} 
                  className="mb-4"
                  color="primary"
                  size="md"
                />
                
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-white/80" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                    {currentStepMessage}
                  </p>
                </div>
              </div>
            )}
            
            {/* Success Toast */}
            {showSuccessToast && (
              <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
                <Card className="bg-green-500/90 backdrop-blur-sm border border-green-400/50">
                  <CardBody className="flex flex-row items-center space-x-3 p-4">
                    <CheckCircleIcon className="w-6 h-6 text-white" />
                    <div>
                      <p className="text-white font-medium" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                        Dashboard Generated Successfully!
                      </p>
                      <p className="text-white/80 text-sm" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                        Redirecting to your new dashboard...
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}
            
            {/* Progress Steps - Only show when no dashboard is selected and not generating */}
            {!selectedDashboardId && !isSubmitting && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-base text-white/70 font-normal" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Step {currentStep} of {totalSteps}</div>
                  <div className="text-base text-white/70 font-normal" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{Math.round((currentStep / totalSteps) * 100)}% Complete</div>
                </div>
                
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => {
                    const isCompleted = currentStep > step.id;
                    const isCurrent = currentStep === step.id;
                    const Icon = step.icon;
                    
                    return (
                      <div key={step.id} className="flex items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                          isCompleted 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : isCurrent 
                              ? 'bg-blue-500 border-blue-500 text-white' 
                              : 'bg-transparent border-white/20 text-white/40'
                        }`}>
                          {isCompleted ? (
                            <CheckCircleIcon className="w-5 h-5" />
                          ) : (
                            <Icon className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white ml-3" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{step.title}</div>
                          <div className="text-xs text-white/60 ml-3" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>{step.description}</div>
                        </div>
                        {index < steps.length - 1 && (
                          <div className={`w-8 h-px transition-colors ${
                            isCompleted ? 'bg-green-500' : 'bg-white/20'
                          }`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
            {selectedDashboardId ? (
              <DashboardDetails 
                dashboardId={selectedDashboardId} 
                onClose={() => setSelectedDashboardId(null)} 
              />
            ) : !isSubmitting ? (
              <div className="space-y-8">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                      <h3 className="text-2xl font-normal text-white" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Client Information</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Client Name"
                        placeholder="Enter client name"
                        value={formData.clientName}
                        onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                        classNames={{
                          input: "text-white",
                          inputWrapper: "bg-white/10 border-white/20 hover:border-white/30 focus-within:border-blue-500"
                        }}
                      />
                      <Select
                        label="Multi-state Client Count"
                        placeholder="Select range"
                        selectedKeys={formData.multiStateClientCount ? [formData.multiStateClientCount] : []}
                        onSelectionChange={(keys) => {
                          const selected = Array.from(keys)[0] as string;
                          setFormData(prev => ({ ...prev, multiStateClientCount: selected }));
                        }}
                        classNames={{
                          trigger: "bg-white/10 border-white/20 hover:border-white/30",
                          value: "text-white",
                          listbox: "bg-black border border-white/20"
                        }}
                      >
                        {CLIENT_COUNT_RANGES.map((range) => (
                          <SelectItem key={range} value={range} className="text-white hover:bg-white/10">
                            {range}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                      <h3 className="text-2xl font-normal text-white" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Locations & Pain Points</h3>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-normal text-white mb-4" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Priority States</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {US_STATES.map((state) => (
                            <button
                              key={state}
                              onClick={() => handleStateToggle(state)}
                              className={`px-3 py-2 rounded-lg text-sm transition-all ${
                                formData.priorityStates.includes(state)
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                              }`}
                              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                            >
                              {state}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-normal text-white mb-4" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Pain Points</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {PAIN_POINTS.map((painPoint) => (
                            <button
                              key={painPoint}
                              onClick={() => handlePainPointToggle(painPoint)}
                              className={`px-4 py-3 rounded-lg text-sm transition-all text-left ${
                                formData.painPoints.includes(painPoint)
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                              }`}
                              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                            >
                              {painPoint}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                      <h3 className="text-2xl font-normal text-white" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Industry & Strategy</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Select
                        label="Primary Industry"
                        placeholder="Select industry"
                        selectedKeys={formData.primaryIndustry ? [formData.primaryIndustry] : []}
                        onSelectionChange={(keys) => {
                          const selected = Array.from(keys)[0] as string;
                          setFormData(prev => ({ ...prev, primaryIndustry: selected }));
                        }}
                        classNames={{
                          trigger: "bg-white/10 border-white/20 hover:border-white/30",
                          value: "text-white",
                          listbox: "bg-black border border-white/20"
                        }}
                      >
                        {INDUSTRIES.map((industry) => (
                          <SelectItem key={industry} value={industry} className="text-white hover:bg-white/10">
                            {industry}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                    
                    <div>
                      <Textarea
                        label="Qualification Strategy"
                        placeholder="Describe your qualification strategy..."
                        value={formData.qualificationStrategy}
                        onChange={(e) => setFormData(prev => ({ ...prev, qualificationStrategy: e.target.value }))}
                        classNames={{
                          input: "text-white",
                          inputWrapper: "bg-white/10 border-white/20 hover:border-white/30 focus-within:border-blue-500"
                        }}
                      />
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                      <h3 className="text-2xl font-normal text-white" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Notes & Review</h3>
                    </div>
                    
                    <div className="space-y-6">
                      <Textarea
                        label="Additional Notes"
                        placeholder="Any additional notes or requirements..."
                        value={formData.additionalNotes}
                        onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                        classNames={{
                          input: "text-white",
                          inputWrapper: "bg-white/10 border-white/20 hover:border-white/30 focus-within:border-blue-500"
                        }}
                      />
                      
                      <div className="bg-white/5 rounded-xl p-6">
                        <h4 className="text-lg font-normal text-white mb-4" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Review Summary</h4>
                        <div className="space-y-2 text-white/70" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                          <p><strong>Client:</strong> {formData.clientName}</p>
                          <p><strong>States:</strong> {formData.priorityStates.join(", ")}</p>
                          <p><strong>Pain Points:</strong> {formData.painPoints.join(", ")}</p>
                          <p><strong>Client Count:</strong> {formData.multiStateClientCount}</p>
                          <p><strong>Industry:</strong> {formData.primaryIndustry}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="mt-8 flex items-center justify-between">
                  <Button 
                    variant="bordered" 
                    onPress={goPrev} 
                    isDisabled={currentStep === 1 || isSubmitting} 
                    startContent={<ArrowLeftIcon />}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <span style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>Back</span>
                  </Button>
                  <Button 
                    onPress={currentStep === totalSteps ? handleSubmit : goNext} 
                    isDisabled={!isStepValid(currentStep) || isSubmitting} 
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-normal text-base"
                    isLoading={isSubmitting}
                  >
                    <span style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                      {currentStep === totalSteps ? (isSubmitting ? "Generating..." : "Generate Dashboard") : "Next"}
                    </span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                    Please wait while we generate your dashboard...
                  </h3>
                  <p className="text-white/60 text-sm" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                    This may take a few moments
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
