"use client";

import React, { useState } from "react";
import { Button, Input, Select, SelectItem, Checkbox, Textarea } from "@nextui-org/react";
import { CheckCircleIcon } from "@/components/icons/profile/check-circle-icon";
import { MapPinIcon } from "@/components/icons/profile/map-pin-icon";
import { DocumentTextIcon } from "@/components/icons/profile/document-text-icon";
import { ClockIcon } from "@/components/icons/profile/clock-icon";
import { UserIcon } from "@/components/icons/profile/user-icon";
import { ChartBarIcon } from "@/components/icons/profile/chart-bar-icon";
import { ExclamationTriangleIcon } from "@/components/icons/profile/exclamation-triangle-icon";
import { ArrowLeftIcon } from "@/components/icons/profile/arrow-left-icon";
import { useDashboard } from "@/contexts/DashboardContext";

type FormState = {
  clientName: string;
  priorityStates: string[];
  painPoints: string[];
  multiStateClientCount: string;
  primaryIndustry: string;
  secondaryIndustries: string[];
  qualifiedForStrategicReview: boolean;
  additionalNotes: string;
};

const STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];

const PAIN_POINT_OPTIONS = [
  { id: "client-naming", label: "Client Name Management", icon: <UserIcon /> },
  { id: "manual-tracking", label: "Manual Tracking Processes", icon: <ClockIcon /> },
  { id: "liability-concerns", label: "Liability & Compliance Concerns", icon: <ExclamationTriangleIcon /> },
  { id: "time-issues", label: "Time Management Issues", icon: <ClockIcon /> },
  { id: "document-management", label: "Document Organization", icon: <DocumentTextIcon /> },
  { id: "state-compliance", label: "Multi-State Compliance Tracking", icon: <MapPinIcon /> },
  { id: "client-communication", label: "Client Communication Gaps", icon: <UserIcon /> },
  { id: "reporting-inefficiencies", label: "Reporting Inefficiencies", icon: <ChartBarIcon /> },
] as const;

const INDUSTRIES = [
  "Real Estate", "Technology", "Healthcare", "Manufacturing",
  "Retail/E-commerce", "Professional Services", "Construction",
  "Hospitality", "Transportation/Logistics", "Financial Services",
  "Non-Profit", "Agriculture", "Energy/Utilities", "Entertainment/Media",
];

const CLIENT_COUNT_RANGES = [
  "1-10", "11-25", "26-50", "51-100", "101-250", "250+",
];

export default function GeneratePage() {
  const { addDashboard } = useDashboard();
  const [formData, setFormData] = useState<FormState>({
    clientName: "",
    priorityStates: [],
    painPoints: [],
    multiStateClientCount: "",
    primaryIndustry: "",
    secondaryIndustries: [],
    qualifiedForStrategicReview: false,
    additionalNotes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Steps configuration for multi-step flow
  const steps = [
    { id: 1, title: "Basic Info", description: "Client information", icon: UserIcon },
    { id: 2, title: "Locations & Pain Points", description: "States and challenges", icon: MapPinIcon },
    { id: 3, title: "Industry & Strategy", description: "Industry and qualification", icon: ChartBarIcon },
    { id: 4, title: "Notes & Review", description: "Additional notes and submit", icon: DocumentTextIcon },
  ] as const;

  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = steps.length;

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

  const handleSecondaryIndustryToggle = (industry: string) => {
    setFormData((prev) => ({
      ...prev,
      secondaryIndustries: prev.secondaryIndustries.includes(industry)
        ? prev.secondaryIndustries.filter((i) => i !== industry)
        : [...prev.secondaryIndustries, industry],
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    // Create dashboard name from form data
    const dashboardName = `${formData.clientName} Dashboard`;
    
    // Add the new dashboard to the context
    addDashboard({
      name: dashboardName,
      isActive: true,
    });
    
    // eslint-disable-next-line no-console
    console.log("Form Data Submitted:", formData);
    alert("Dashboard generation initiated! Check console for submitted data.");
    setIsSubmitting(false);
    
    // Navigate back to home page
    window.location.href = "/";
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return Boolean(formData.clientName) && Boolean(formData.multiStateClientCount);
      case 2:
        return formData.priorityStates.length > 0; // pain points optional
      case 3:
        return Boolean(formData.primaryIndustry);
      case 4:
        return true;
      default:
        return false;
    }
  };

  const goPrev = () => setCurrentStep((s) => Math.max(1, s - 1));
  const goNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep((s) => s + 1);
      return;
    }
    await handleSubmit();
  };

  const isFormValid = () => {
    return (
      Boolean(formData.clientName) &&
      Boolean(formData.multiStateClientCount) &&
      Boolean(formData.primaryIndustry) &&
      formData.priorityStates.length > 0
    );
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto px-2.5">
        <div className="flex flex-col gap-6">
            
            {/* Header Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Dashboard Generator</h2>
              </div>
              
              {/* Progress Steps */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm text-white/60">Step {currentStep} of {totalSteps}</div>
                  <div className="text-sm text-white/60">{Math.round((currentStep / totalSteps) * 100)}% Complete</div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {steps.map((step, index) => {
                    const Icon = step.icon as any;
                    const isActive = step.id === currentStep;
                    const isCompleted = step.id < currentStep;
                    const isUpcoming = step.id > currentStep;
                    
                    return (
                      <div key={step.id} className="flex items-center space-x-3 flex-1">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                          isCompleted 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : isActive 
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
                          <div className={`text-sm font-medium transition-colors ${
                            isActive ? 'text-white' : isCompleted ? 'text-green-400' : 'text-white/40'
                          }`}>
                            {step.title}
                          </div>
                          <div className={`text-xs transition-colors ${
                            isActive ? 'text-white/60' : 'text-white/30'
                          }`}>
                            {step.description}
                          </div>
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
            </div>

            {/* Form Content */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
              <div className="space-y-8">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                      <h3 className="text-xl font-semibold text-white">Client Information</h3>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white/80">Client/Firm Name *</label>
                        <Input 
                          type="text" 
                          placeholder="Enter client or firm name" 
                          value={formData.clientName}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, clientName: value }))} 
                          isRequired 
                          classNames={{
                            input: "text-white",
                            inputWrapper: "bg-white/10 border-white/20 hover:border-white/30 focus-within:border-blue-500"
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white/80">Number of Multi-State Clients *</label>
                        <Select 
                          placeholder="Select range" 
                          selectedKeys={formData.multiStateClientCount ? [formData.multiStateClientCount] : []}
                          onSelectionChange={(keys) => {
                            const value = Array.from(keys)[0] as string;
                            setFormData((prev) => ({ ...prev, multiStateClientCount: value || "" }));
                          }}
                          isRequired
                          classNames={{
                            trigger: "bg-white/10 border-white/20 hover:border-white/30",
                            value: "text-white",
                            listbox: "bg-black border border-white/20"
                          }}
                        >
                          {CLIENT_COUNT_RANGES.map((r) => (
                            <SelectItem key={r} value={r} className="text-white hover:bg-white/10">
                              {`${r} clients`}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-8">
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                        <h3 className="text-xl font-semibold text-white">Priority States *</h3>
                      </div>
                      <p className="text-sm text-white/60 mb-4">Select the states where this client has the most activity or complexity</p>
                      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                        {STATES.map((st) => {
                          const active = formData.priorityStates.includes(st);
                          return (
                            <button 
                              key={st} 
                              type="button" 
                              onClick={() => handleStateToggle(st)} 
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                active 
                                  ? "bg-green-500 text-white shadow-lg shadow-green-500/25" 
                                  : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/20"
                              }`}
                            >
                              {st}
                            </button>
                          );
                        })}
                      </div>
                      {formData.priorityStates.length > 0 && (
                        <p className="text-sm text-green-400">Selected: {formData.priorityStates.join(", ")}</p>
                      )}
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                        <h3 className="text-xl font-semibold text-white">Identified Pain Points</h3>
                      </div>
                      <p className="text-sm text-white/60 mb-4">Select the challenges mentioned during client discovery</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {PAIN_POINT_OPTIONS.map((opt) => {
                          const active = formData.painPoints.includes(opt.id);
                          return (
                            <button 
                              key={opt.id} 
                              type="button" 
                              onClick={() => handlePainPointToggle(opt.id)} 
                              className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                                active 
                                  ? "border-red-500 bg-red-500/10 text-red-400" 
                                  : "border-white/20 hover:border-white/30 hover:bg-white/5 text-white/80"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-5 h-5 text-current">{opt.icon}</span>
                                <span className="font-medium">{opt.label}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-8">
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                        <h3 className="text-xl font-semibold text-white">Industry Focus</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-white/80">Primary Industry *</label>
                          <Select 
                            placeholder="Select primary industry" 
                            selectedKeys={formData.primaryIndustry ? [formData.primaryIndustry] : []}
                            onSelectionChange={(keys) => {
                              const value = Array.from(keys)[0] as string;
                              setFormData((prev) => ({ ...prev, primaryIndustry: value || "" }));
                            }}
                            isRequired
                            classNames={{
                              trigger: "bg-white/10 border-white/20 hover:border-white/30",
                              value: "text-white",
                              listbox: "bg-black border border-white/20"
                            }}
                          >
                            {INDUSTRIES.map((i) => (
                              <SelectItem key={i} value={i} className="text-white hover:bg-white/10">
                                {i}
                              </SelectItem>
                            ))}
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-white/80">Secondary Industries (Optional)</label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {INDUSTRIES.filter((i) => i !== formData.primaryIndustry).map((industry) => {
                              const active = formData.secondaryIndustries.includes(industry);
                              return (
                                <button 
                                  key={industry} 
                                  type="button" 
                                  onClick={() => handleSecondaryIndustryToggle(industry)} 
                                  className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                    active 
                                      ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25" 
                                      : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/20"
                                  }`}
                                >
                                  {industry}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-1 h-6 bg-yellow-500 rounded-full"></div>
                        <h3 className="text-xl font-semibold text-white">Strategic Review Qualification</h3>
                      </div>
                      <div className="bg-white/5 rounded-xl border border-white/20 p-6">
                        <Checkbox 
                          isSelected={formData.qualifiedForStrategicReview} 
                          onValueChange={(checked) => setFormData((prev) => ({ ...prev, qualifiedForStrategicReview: checked }))}
                          classNames={{
                            wrapper: "after:bg-blue-500",
                            label: "text-white"
                          }}
                        >
                          Client qualifies for strategic review features
                        </Checkbox>
                        <p className="text-sm text-white/60 mt-3">Check this if the client meets criteria for advanced planning and strategic advisory features</p>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                      <h3 className="text-xl font-semibold text-white">Additional Notes</h3>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white/80">Additional Context</label>
                      <Textarea 
                        rows={6} 
                        placeholder="Any additional context, special requirements, or notes about this client's needs..." 
                        value={formData.additionalNotes} 
                        onValueChange={(val) => setFormData((prev) => ({ ...prev, additionalNotes: val }))} 
                        classNames={{
                          input: "text-white",
                          inputWrapper: "bg-white/10 border-white/20 hover:border-white/30 focus-within:border-blue-500"
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between">
                <Button 
                  variant="bordered" 
                  onPress={goPrev} 
                  isDisabled={currentStep === 1 || isSubmitting} 
                  startContent={<ArrowLeftIcon />}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Back
                </Button>
                <Button 
                  onPress={goNext} 
                  isDisabled={!isStepValid(currentStep) || isSubmitting} 
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  isLoading={isSubmitting}
                >
                  {currentStep === totalSteps ? (isSubmitting ? "Generating..." : "Generate Dashboard") : "Next"}
                </Button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}