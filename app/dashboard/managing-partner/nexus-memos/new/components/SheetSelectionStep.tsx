"use client";
import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Button, Chip, Checkbox } from "@nextui-org/react";
import { FileText, CheckCircle2, ArrowRight } from "lucide-react";

interface SheetSelectionStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function SheetSelectionStep({ onNext, onBack }: SheetSelectionStepProps) {
  const [uploadData, setUploadData] = useState<any[]>([]);
  const [selectedSheets, setSelectedSheets] = useState<Record<string, string>>({});

  useEffect(() => {
    const stored = sessionStorage.getItem('nexusUploadData');
    if (stored) {
      const data = JSON.parse(stored);
      setUploadData(data);
      
      // Auto-select first sheet for each file
      const autoSelected: Record<string, string> = {};
      data.forEach((item: any) => {
        if (item.sheets && item.sheets.length > 0) {
          autoSelected[item.uploadId] = item.sheets[0].name;
        }
      });
      setSelectedSheets(autoSelected);
    }
  }, []);

  const handleSheetSelect = (uploadId: string, sheetName: string) => {
    setSelectedSheets((prev) => ({
      ...prev,
      [uploadId]: sheetName
    }));
  };

  const handleContinue = () => {
    sessionStorage.setItem('nexusSelectedSheets', JSON.stringify(selectedSheets));
    onNext({ selectedSheets });
  };

  const filesWithSheets = uploadData.filter(item => item.sheets && item.sheets.length > 0);
  const filesWithoutSheets = uploadData.filter(item => !item.sheets || item.sheets.length === 0);

  // Auto-skip if no Excel files
  useEffect(() => {
    if (filesWithSheets.length === 0 && uploadData.length > 0) {
      handleContinue();
    }
  }, [uploadData.length]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Sheet Selection</h2>
        <p className="text-gray-400">Select which sheets to process from your Excel files</p>
      </div>

      <div className="space-y-4">
        {filesWithSheets.map((item) => (
          <Card key={item.uploadId} className="bg-white/5 border border-white/10">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-medium text-white">{item.fileName}</h3>
                <Chip size="sm" variant="flat">
                  {item.sheets.length} sheet{item.sheets.length > 1 ? 's' : ''}
                </Chip>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="space-y-2">
                {item.sheets.map((sheet: any) => (
                  <div
                    key={sheet.name}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedSheets[item.uploadId] === sheet.name
                        ? 'bg-blue-500/20 border-blue-500/50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                    onClick={() => handleSheetSelect(item.uploadId, sheet.name)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          isSelected={selectedSheets[item.uploadId] === sheet.name}
                          onValueChange={() => handleSheetSelect(item.uploadId, sheet.name)}
                        />
                        <div>
                          <p className="text-white font-medium">{sheet.name}</p>
                          <p className="text-gray-400 text-sm">
                            {sheet.rowCount} rows × {sheet.columnCount} columns
                          </p>
                        </div>
                      </div>
                      {sheet.richnessScore && (
                        <Chip size="sm" variant="flat" color="secondary">
                          Score: {sheet.richnessScore}
                        </Chip>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="light" onPress={onBack} className="text-gray-400">
          Back
        </Button>
        <Button
          color="primary"
          onPress={handleContinue}
          endContent={<ArrowRight className="w-4 h-4" />}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

