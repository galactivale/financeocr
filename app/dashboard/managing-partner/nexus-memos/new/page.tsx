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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">New Nexus Analysis</h1>
          <p className="text-gray-400">Upload financial data for automated nexus detection and memo generation</p>
        </div>

        {/* Progress Steps - Streamlined */}
        <Card className="bg-white/5 border border-white/10 mb-6">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <React.Fragment key={step.id}>
                    <div className="flex items-center">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white scale-110 shadow-lg shadow-blue-500/30'
                            : isCompleted
                            ? 'bg-gradient-to-br from-green-500 to-green-600 text-white'
                            : 'bg-white/10 text-gray-400'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-7 h-7" />
                        ) : (
                          <Icon className="w-7 h-7" />
                        )}
                      </div>
                      <div className="ml-4">
                        <p className={`text-sm font-semibold ${isActive ? 'text-white' : isCompleted ? 'text-green-400' : 'text-gray-400'}`}>
                          {step.label}
                        </p>
                        <p className={`text-xs ${isActive ? 'text-blue-400' : 'text-gray-500'}`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div className="flex-1 mx-6 relative">
                        <div className="h-1 bg-white/10 rounded-full">
                          <div 
                            className={`h-1 rounded-full transition-all duration-500 ${
                              isCompleted ? 'bg-gradient-to-r from-green-500 to-green-400 w-full' : 'w-0'
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

        {/* Step Content */}
        <Card className="bg-white/5 border border-white/10">
          <CardBody className="p-8">
            {renderStepContent()}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
