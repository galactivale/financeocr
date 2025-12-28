"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Select,
  SelectItem,
  Chip,
  Tooltip
} from "@nextui-org/react";
import { Map, ArrowRight, Info } from "lucide-react";
import { apiClient } from "@/lib/api";

interface ColumnMappingStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

interface Mapping {
  columnIndex: number;
  columnName: string;
  suggestedField?: string;
  confidence?: number;
  mappedField?: string | null;
  alternatives?: string[];
}

export default function ColumnMappingStep({ onNext, onBack }: ColumnMappingStepProps) {
  const [uploadData, setUploadData] = useState<any[]>([]);
  const [headerDetection, setHeaderDetection] = useState<Record<string, any>>({});
  const [mappings, setMappings] = useState<Record<string, Mapping[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  const mappableFields = [
    { value: "state", label: "State" },
    { value: "revenue", label: "Revenue" },
    { value: "entity", label: "Entity" },
    { value: "worker", label: "Worker" },
    { value: "gl", label: "GL Account" },
    { value: "date", label: "Date" },
    { value: "customer", label: "Customer" },
    { value: "invoice", label: "Invoice" }
  ];

  useEffect(() => {
    const stored = sessionStorage.getItem('nexusUploadData');
    const headerStored = sessionStorage.getItem('nexusHeaderDetection');
    
    if (stored) {
      const data = JSON.parse(stored);
      setUploadData(data);
    }
    
    if (headerStored) {
      const headerData = JSON.parse(headerStored);
      setHeaderDetection(headerData);
    }
  }, []);

  useEffect(() => {
    if (uploadData.length > 0 && Object.keys(headerDetection).length > 0) {
      loadMappings();
    }
  }, [uploadData, headerDetection]);

  // Smart column name matching
  const suggestFieldForColumn = (columnName: string): { field: string; confidence: number } | null => {
    const normalized = columnName.toLowerCase().trim();
    
    // State patterns
    if (normalized.includes('state') || normalized.includes('st ') || normalized === 'st') {
      return { field: 'state', confidence: 95 };
    }
    
    // Revenue patterns
    if (normalized.includes('revenue') || normalized.includes('sales') || 
        normalized.includes('income') || normalized.includes('amount') ||
        normalized.includes('total') && (normalized.includes('rev') || normalized.includes('sales'))) {
      return { field: 'revenue', confidence: 90 };
    }
    
    // Entity patterns
    if (normalized.includes('entity') || normalized.includes('subsidiary') || 
        normalized.includes('company') || normalized.includes('business')) {
      return { field: 'entity', confidence: 85 };
    }
    
    // Worker patterns
    if (normalized.includes('worker') || normalized.includes('employee') || 
        normalized.includes('staff') || normalized.includes('headcount')) {
      return { field: 'worker', confidence: 85 };
    }
    
    // GL Account patterns
    if (normalized.includes('gl') || normalized.includes('account') || 
        normalized.includes('chart of accounts') || normalized.match(/^\d{4,6}/)) {
      return { field: 'gl', confidence: 80 };
    }
    
    // Date patterns
    if (normalized.includes('date') || normalized.includes('period') || 
        normalized.includes('month') || normalized.includes('year')) {
      return { field: 'date', confidence: 85 };
    }
    
    // Customer patterns
    if (normalized.includes('customer') || normalized.includes('client') || 
        normalized.includes('account name')) {
      return { field: 'customer', confidence: 80 };
    }
    
    // Invoice patterns
    if (normalized.includes('invoice') || normalized.includes('inv ') || 
        normalized.includes('bill')) {
      return { field: 'invoice', confidence: 85 };
    }
    
    return null;
  };

  const loadMappings = async () => {
    setIsLoading(true);
    const newMappings: Record<string, Mapping[]> = {};

    for (const item of uploadData) {
      const headerData = headerDetection[item.uploadId];
      if (!headerData || !headerData.headers || !Array.isArray(headerData.headers)) {
        // Try to get headers from uploadData metadata
        const metadata = item.metadata || item;
        if (metadata.headerDetection?.headers) {
          const fallbackHeaders = metadata.headerDetection.headers;
          newMappings[item.uploadId] = fallbackHeaders.map((header: string, idx: number) => {
            const suggestion = suggestFieldForColumn(header);
            return {
              columnIndex: idx,
              columnName: header,
              suggestedField: suggestion?.field,
              confidence: suggestion?.confidence,
              mappedField: suggestion?.field || null,
              alternatives: []
            };
          });
        }
        continue;
      }

      // Try API first, but have good fallback
      try {
        const response = await apiClient.suggestMappings({
          uploadId: item.uploadId,
          headers: headerData.headers,
          documentType: item.documentClassification?.type,
          sampleData: item.previewData || []
        });

        if (response.success) {
          const responseData = (response as any).data || response;
          const mappings = responseData.mappings || (response as any).mappings;
          if (mappings && Array.isArray(mappings)) {
            newMappings[item.uploadId] = mappings.map((m: any) => ({
              columnIndex: m.columnIndex ?? m.column_index ?? 0,
              columnName: m.columnName ?? m.column_name ?? '',
              suggestedField: m.suggestedField ?? m.suggested_field,
              confidence: m.confidence,
              mappedField: m.suggestedField || null,
              alternatives: m.alternatives || []
            }));
          } else {
            throw new Error('Invalid API response');
          }
        } else {
          throw new Error('Invalid API response');
        }
      } catch (error) {
        console.log('Using fallback mapping logic:', error);
        // Smart fallback: use pattern matching
        newMappings[item.uploadId] = headerData.headers.map((header: string, idx: number) => {
          const suggestion = suggestFieldForColumn(header);
          return {
            columnIndex: idx,
            columnName: header,
            suggestedField: suggestion?.field,
            confidence: suggestion?.confidence,
            mappedField: suggestion?.field || null,
            alternatives: []
          };
        });
      }
    }

    setMappings(newMappings);
    setIsLoading(false);
  };

  const handleMappingChange = (uploadId: string, columnIndex: number, field: string | null) => {
    setMappings((prev) => ({
      ...prev,
      [uploadId]: prev[uploadId].map((m) =>
        m.columnIndex === columnIndex ? { ...m, mappedField: field } : m
      )
    }));
  };

  const handleContinue = () => {
    sessionStorage.setItem('nexusColumnMappings', JSON.stringify(mappings));
    onNext({ mappings });
  };

  const requiredFields = ['state', 'revenue'];
  const isMappingValid = () => {
    if (Object.keys(mappings).length === 0) return false;
    
    for (const uploadId in mappings) {
      const fileMappings = mappings[uploadId];
      if (!fileMappings || fileMappings.length === 0) return false;
      
      const mappedFields = fileMappings
        .filter(m => m.mappedField && m.mappedField !== 'ignore')
        .map(m => m.mappedField as string);
      
      const hasRequired = requiredFields.every(field => mappedFields.includes(field));
      if (!hasRequired) return false;
    }
    return true;
  };

  const getMappedFields = (uploadId: string): string[] => {
    const fileMappings = mappings[uploadId] || [];
    return fileMappings
      .filter(m => m.mappedField && m.mappedField !== 'ignore')
      .map(m => m.mappedField as string);
  };

  const getMissingRequiredFields = (uploadId: string): string[] => {
    const mapped = getMappedFields(uploadId);
    return requiredFields.filter(field => !mapped.includes(field));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-2">Column Mapping</h2>
          <p className="text-gray-400">Analyzing columns and generating mapping suggestions...</p>
        </div>
        <Card className="bg-white/5 border border-white/10">
          <CardBody className="p-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-white">Processing columns...</p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Column Mapping</h2>
        <p className="text-gray-400">Map your columns to standardized fields</p>
      </div>

      {uploadData.length === 0 ? (
        <Card className="bg-white/5 border border-white/10">
          <CardBody className="p-8 text-center">
            <p className="text-white font-medium mb-2">No files found</p>
            <p className="text-gray-400 text-sm">
              Please go back and upload files first.
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {uploadData.map((item) => {
            const fileMappings = mappings[item.uploadId] || [];
            if (fileMappings.length === 0) {
              return (
                <Card key={item.uploadId} className="bg-white/5 border border-white/10">
                  <CardBody className="p-6">
                    <h3 className="text-lg font-medium text-white mb-2">{item.fileName}</h3>
                    <p className="text-gray-400 text-sm">
                      No headers detected. Please go back to header detection step.
                    </p>
                  </CardBody>
                </Card>
              );
            }

            return (
            <Card key={item.uploadId} className="bg-white/5 border border-white/10">
              <CardBody className="p-6">
                <h3 className="text-lg font-medium text-white mb-4">{item.fileName}</h3>
                
                <div className="space-y-3">
                  {fileMappings.map((mapping) => (
                    <div key={mapping.columnIndex} className="flex items-center space-x-4">
                      <div className="flex-1">
                        <p className="text-white font-medium">{mapping.columnName}</p>
                        {mapping.suggestedField && (
                          <div className="flex items-center space-x-2 mt-1">
                            <Chip size="sm" variant="flat" color="secondary">
                              Suggested: {mapping.suggestedField}
                            </Chip>
                            {mapping.confidence && (
                              <Chip size="sm" variant="flat">
                                {mapping.confidence}% confidence
                              </Chip>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <Select
                        selectedKeys={mapping.mappedField ? new Set([mapping.mappedField]) : new Set()}
                        onSelectionChange={(keys) => {
                          const selected = Array.from(keys)[0] as string;
                          // Handle "ignore" as null
                          if (selected === "ignore") {
                            handleMappingChange(item.uploadId, mapping.columnIndex, null);
                          } else {
                            handleMappingChange(item.uploadId, mapping.columnIndex, selected || null);
                          }
                        }}
                        placeholder="Select field..."
                        className="w-48"
                        classNames={{
                          trigger: "bg-white/5 border-white/10",
                          value: "text-white"
                        }}
                        selectionMode="single"
                        items={[
                          { key: "ignore", label: "Ignore" },
                          ...mappableFields.map(f => ({
                            key: f.value,
                            label: requiredFields.includes(f.value) ? `${f.label} *` : f.label
                          }))
                        ]}
                      >
                        {(item) => (
                          <SelectItem key={item.key} value={item.key}>
                            {item.label}
                          </SelectItem>
                        )}
                      </Select>
                    </div>
                  ))}
                </div>

                {(() => {
                  const missingFields = getMissingRequiredFields(item.uploadId);
                  return (
                    <div className={`mt-4 p-3 rounded-lg border ${
                      missingFields.length > 0
                        ? 'bg-yellow-500/10 border-yellow-500/30'
                        : 'bg-green-500/10 border-green-500/30'
                    }`}>
                      <div className="flex items-start space-x-2">
                        <Info className={`w-4 h-4 mt-0.5 ${
                          missingFields.length > 0 ? 'text-yellow-400' : 'text-green-400'
                        }`} />
                        <div className="text-sm text-gray-300 flex-1">
                          <p className="font-medium mb-1">
                            {missingFields.length > 0 
                              ? `Missing required fields: ${missingFields.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(', ')}`
                              : 'All required fields mapped ✓'
                            }
                          </p>
                          <p className="text-gray-400">
                            {missingFields.length > 0
                              ? 'State and Revenue must be mapped to proceed. Other fields are optional.'
                              : 'You can proceed to the next step.'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </CardBody>
            </Card>
          );
        })}
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="light" onPress={onBack} className="text-gray-400">
          Back
        </Button>
        <Button
          color="primary"
          onPress={handleContinue}
          isDisabled={!isMappingValid()}
          endContent={<ArrowRight className="w-4 h-4" />}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

