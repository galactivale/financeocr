"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, Progress, Button } from "@nextui-org/react";
import {
  Upload,
  Shield,
  AlertTriangle,
  FileCheck,
  CheckCircle2
} from "lucide-react";
import UploadStep from "./components/UploadStep";
import DataValidationStep from "./components/DataValidationStep";
import AlertsStep from "./components/AlertsStep";
import MemosStep from "./components/MemosStep";
import { usePersonalizedDashboard } from "@/contexts/PersonalizedDashboardContext";
import { normalizeOrgId } from "@/lib/utils";

// Simplified 4-step flow
const STEPS = [
  { id: 1, label: "Upload", description: "Upload your data files", icon: Upload },
  { id: 2, label: "Validation", description: "Automated data validation", icon: Shield },
  { id: 3, label: "Review Alerts", description: "Review nexus alerts", icon: AlertTriangle },
  { id: 4, label: "Generate Memos", description: "Generate compliance memos", icon: FileCheck }
];

export default function NewNexusMemoPage() {
  const router = useRouter();
  const { organizationId } = usePersonalizedDashboard();
  const [currentStep, setCurrentStep] = useState(1);
  const [stepData, setStepData] = useState<Record<string, any>>({});

  useEffect(() => {
    // Store organizationId in sessionStorage for components
    if (organizationId) {
      const normalizedId = normalizeOrgId(organizationId);
      if (normalizedId) {
        sessionStorage.setItem('organizationId', normalizedId);
      }
    }
    
    // Clear previous session data on fresh start
    sessionStorage.removeItem('nexusUploadData');
    sessionStorage.removeItem('nexusColumnMappings');
    sessionStorage.removeItem('nexusValidationResult');
    sessionStorage.removeItem('nexusAlerts');
  }, []);

  const handleNext = (data?: any) => {
    if (data) {
      setStepData(prev => ({ ...prev, [`step${currentStep}`]: data }));
      
      // Store uploaded files data
      if (data.uploadResults) {
        sessionStorage.setItem('nexusUploadData', JSON.stringify(data.uploadResults));
        // Store File objects in window for later use
        if (typeof window !== 'undefined') {
          const filesRecord: Record<string, File> = {};
          data.uploadResults.forEach((result: any) => {
            if (result.file instanceof File) {
              filesRecord[result.uploadId] = result.file;
            }
          });
          (window as any).__nexusFiles = filesRecord;
        }
      }
      
      // Store validation results
      if (data.validatedData) {
        sessionStorage.setItem('nexusValidationResult', JSON.stringify(data.validatedData));
      }
      
      // Store alerts
      if (data.alerts) {
        sessionStorage.setItem('nexusAlerts', JSON.stringify(data.alerts));
      }
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - redirect to memos list
      router.push('/dashboard/managing-partner/nexus-memos');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <UploadStep onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <DataValidationStep onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <AlertsStep onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <MemosStep onNext={handleNext} onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Premium Design */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-3">
                New Nexus Analysis
              </h1>
              <p className="text-gray-400 text-lg">
                Upload financial data for automated nexus detection and professional memo generation
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-lg">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">Step {currentStep} of {STEPS.length}</span>
            </div>
          </div>
        </div>

        {/* Progress Steps - Premium Design */}
        <Card className="bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-zinc-800 mb-8 shadow-2xl">
          <CardBody className="p-8">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                  <React.Fragment key={step.id}>
                    <div className="flex items-center">
                      <div className="relative">
                        {/* Glow effect for active step */}
                        {isActive && (
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full blur-xl opacity-40 animate-pulse"></div>
                        )}
                        <div
                          className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                            isActive
                              ? 'bg-gradient-to-br from-emerald-500 to-blue-500 text-white scale-110 shadow-2xl shadow-emerald-500/30 ring-4 ring-emerald-500/20'
                              : isCompleted
                              ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/20'
                              : 'bg-zinc-800/50 text-gray-500 border border-zinc-700'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-8 h-8" />
                          ) : (
                            <Icon className="w-8 h-8" />
                          )}
                        </div>
                      </div>
                      <div className="ml-5">
                        <p className={`text-base font-bold transition-colors duration-300 ${
                          isActive ? 'text-white' : isCompleted ? 'text-emerald-400' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </p>
                        <p className={`text-sm mt-0.5 transition-colors duration-300 ${
                          isActive ? 'text-emerald-400' : 'text-gray-600'
                        }`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div className="flex-1 mx-8 relative">
                        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              isCompleted
                                ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 w-full shadow-lg shadow-emerald-500/30'
                                : 'w-0'
                            }`}
                          />
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </CardBody>
        </Card>

        {/* Step Content with Premium Card */}
        <Card className="bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-zinc-800 shadow-2xl">
          <CardBody className="p-10">
            {renderStepContent()}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
