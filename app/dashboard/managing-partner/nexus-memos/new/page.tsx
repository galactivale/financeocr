"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, Progress, Button } from "@nextui-org/react";
import {
  Upload,
  FileText,
  Map,
  AlertTriangle,
  FileCheck,
  CheckCircle2
} from "lucide-react";
import UploadStep from "./components/UploadStep";
import SheetSelectionStep from "./components/SheetSelectionStep";
import HeaderDetectionStep from "./components/HeaderDetectionStep";
import ColumnMappingStep from "./components/ColumnMappingStep";
import AlertsStep from "./components/AlertsStep";
import MemosStep from "./components/MemosStep";
import { usePersonalizedDashboard } from "@/contexts/PersonalizedDashboardContext";
import { normalizeOrgId } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Upload", icon: Upload },
  { id: 2, label: "Sheet Selection", icon: FileText },
  { id: 3, label: "Header Detection", icon: Map },
  { id: 4, label: "Column Mapping", icon: Map },
  { id: 5, label: "Alerts", icon: AlertTriangle },
  { id: 6, label: "Memos", icon: FileCheck }
];

export default function NewNexusMemoPage() {
  const router = useRouter();
  const { organizationId } = usePersonalizedDashboard();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadData, setUploadData] = useState<any[]>([]);
  const [fileObjects, setFileObjects] = useState<Record<string, File>>({});
  const [selectedSheets, setSelectedSheets] = useState<Record<string, string>>({});
  const [headerDetection, setHeaderDetection] = useState<Record<string, any>>({});
  const [columnMappings, setColumnMappings] = useState<Record<string, any>>({});
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    // Store organizationId in sessionStorage for components
    if (organizationId) {
      const normalizedId = normalizeOrgId(organizationId);
      if (normalizedId) {
        sessionStorage.setItem('organizationId', normalizedId);
      }
    }
  }, [organizationId]);

  const handleNext = (data?: any) => {
    if (data) {
      // Store data from each step
      if (data.uploadResults) {
        setUploadData(data.uploadResults);
        // Store File objects in window for later use
        if (typeof window !== 'undefined') {
          const filesRecord: Record<string, File> = {};
          data.uploadResults.forEach((result: any) => {
            if (result.file instanceof File) {
              filesRecord[result.uploadId] = result.file;
            }
          });
          (window as any).__nexusFiles = filesRecord;
          setFileObjects(filesRecord);
        }
        sessionStorage.setItem('nexusUploadData', JSON.stringify(data.uploadResults));
      }
      
      if (data.selectedSheets) {
        setSelectedSheets(data.selectedSheets);
        sessionStorage.setItem('nexusSelectedSheets', JSON.stringify(data.selectedSheets));
      }
      
      if (data.headerDetection) {
        setHeaderDetection(data.headerDetection);
        sessionStorage.setItem('nexusHeaderDetection', JSON.stringify(data.headerDetection));
      }
      
      if (data.mappings) {
        setColumnMappings(data.mappings);
        sessionStorage.setItem('nexusColumnMappings', JSON.stringify(data.mappings));
      }
      
      if (data.alerts) {
        setAlerts(data.alerts);
        sessionStorage.setItem('nexusAlerts', JSON.stringify(data.alerts));
      }
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - redirect or show success
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
        return <SheetSelectionStep onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <HeaderDetectionStep onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <ColumnMappingStep onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <AlertsStep onNext={handleNext} onBack={handleBack} />;
      case 6:
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
          <h1 className="text-3xl font-bold text-white mb-2">New Nexus Memo</h1>
          <p className="text-gray-400">Process financial documents and generate compliance memos</p>
        </div>

        {/* Progress Steps */}
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
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          isActive
                            ? 'bg-blue-500 text-white scale-110'
                            : isCompleted
                            ? 'bg-green-500 text-white'
                            : 'bg-white/10 text-gray-400'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          <Icon className="w-6 h-6" />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>
                          {step.label}
                        </p>
                        <p className={`text-xs ${isActive ? 'text-blue-400' : 'text-gray-500'}`}>
                          Step {step.id} of {STEPS.length}
                        </p>
                      </div>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-4 rounded ${
                          isCompleted ? 'bg-green-500' : 'bg-white/10'
                        }`}
                      />
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


