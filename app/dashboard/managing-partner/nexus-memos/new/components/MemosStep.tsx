"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Progress
} from "@nextui-org/react";
import {
  FileCheck,
  Download,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

interface MemosStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function MemosStep({ onNext, onBack }: MemosStepProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [memos, setMemos] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    generateMemos();
  }, []);

  const generateMemos = async () => {
    // Simulate memo generation
    const steps = [
      "Analyzing alerts...",
      "Generating executive summary...",
      "Creating state-by-state analysis...",
      "Compiling recommendations...",
      "Finalizing memo..."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(((i + 1) / steps.length) * 100);
    }

    // Load data from sessionStorage
    const alerts = JSON.parse(sessionStorage.getItem('nexusAlerts') || '[]');
    const uploadData = JSON.parse(sessionStorage.getItem('nexusUploadData') || '[]');

    const generatedMemos = {
      summary: `Generated ${alerts.length} alerts from ${uploadData.length} file(s)`,
      stateAnalysis: {},
      recommendations: [],
      doctrineMetadata: {
        appliedRules: alerts
          .filter((a: any) => a.appliedDoctrineRuleId)
          .map((a: any) => ({
            ruleId: a.appliedDoctrineRuleId,
            version: a.doctrineRuleVersion
          }))
      }
    };

    setMemos(generatedMemos);
    setIsGenerating(false);
  };

  const handleDownload = () => {
    // TODO: Implement PDF/Word export
    alert('Memo download functionality coming soon');
  };

  const handleFinish = () => {
    onNext({ memos });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Memos Generation</h2>
        <p className="text-gray-400">Generating professional memos from your analysis</p>
      </div>

      {isGenerating ? (
        <Card className="bg-white/5 border border-white/10">
          <CardBody className="p-8">
            <div className="text-center space-y-4">
              <FileCheck className="w-16 h-16 text-blue-500 mx-auto animate-pulse" />
              <p className="text-white font-medium">Generating memos...</p>
              <Progress
                value={progress}
                className="max-w-md mx-auto"
                classNames={{
                  indicator: "bg-gradient-to-r from-blue-500 to-purple-500"
                }}
              />
              <p className="text-gray-400 text-sm">{Math.round(progress)}% complete</p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="bg-green-500/10 border border-green-500/30">
            <CardBody className="p-6">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-white font-medium text-lg">Memos Generated Successfully</p>
                  <p className="text-gray-400 text-sm">{memos?.summary}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/5 border border-white/10">
            <CardBody className="p-6">
              <h3 className="text-lg font-medium text-white mb-4">Memo Preview</h3>
              <div className="space-y-3 text-gray-300">
                <p>{memos?.summary}</p>
                {memos?.doctrineMetadata?.appliedRules?.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-sm font-medium text-blue-300 mb-2">
                      Applied Doctrine Rules: {memos.doctrineMetadata.appliedRules.length}
                    </p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          <div className="flex space-x-3">
            <Button
              variant="flat"
              startContent={<Download className="w-4 h-4" />}
              onPress={handleDownload}
            >
              Download PDF
            </Button>
            <Button
              variant="flat"
              startContent={<Download className="w-4 h-4" />}
              onPress={handleDownload}
            >
              Download Word
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="light" onPress={onBack} className="text-gray-400">
          Back
        </Button>
        <Button
          color="primary"
          onPress={handleFinish}
          isDisabled={isGenerating}
          endContent={<ArrowRight className="w-4 h-4" />}
        >
          Finish
        </Button>
      </div>
    </div>
  );
}


