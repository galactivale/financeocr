"use client";
import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, CardHeader, Progress, Chip, Tooltip } from "@nextui-org/react";
import { CheckCircle2, AlertTriangle, Loader2, FileText, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

interface HeaderDetectionStepProps {
  onNext: (headerData: any) => void;
  onBack: () => void;
}

interface DetectionResult {
  success: boolean;
  headerRowIndex: number;
  confidence: number;
  headers: string[];
  dataStartRow: number;
  sampleRows: any[][];
  previewData: any[][];
  fileName: string;
  documentType?: string;
}

export default function HeaderDetectionStep({ onNext, onBack }: HeaderDetectionStepProps) {
  const [uploadData, setUploadData] = useState<any[]>([]);
  const [detectionResults, setDetectionResults] = useState<DetectionResult[]>([]);
  const [isDetecting, setIsDetecting] = useState(true);
  const [currentFile, setCurrentFile] = useState<string>("");
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
  const [processingSteps, setProcessingSteps] = useState<string[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem('nexusUploadData');
    console.log('[HEADER_DETECTION] Raw sessionStorage data:', stored);
    
    if (stored) {
      const data = JSON.parse(stored);
      console.log('[HEADER_DETECTION] Parsed upload data:', data.map((item: any) => ({
        fileName: item.fileName || item.metadata?.fileName,
        uploadId: item.uploadId,
        hasHeaderDetection: !!item.headerDetection,
        headerDetection: item.headerDetection,
        hasMetadata: !!item.metadata,
        metadataHeaderDetection: item.metadata?.headerDetection
      })));
      setUploadData(data);
      detectAllHeaders(data);
    }
  }, []);

  const detectAllHeaders = async (data: any[]) => {
    setIsDetecting(true);
    setProcessingSteps([]);
    const results: DetectionResult[] = [];

    for (const item of data) {
      setCurrentFile(item.fileName || item.metadata?.fileName || 'Unknown file');
      
      const steps = [
        "Reading file structure...",
        "Scanning for header patterns...",
        "Detecting GL account codes...",
        "Identifying state columns...",
        "Analyzing data rows...",
        "Calculating confidence score..."
      ];

      for (const step of steps) {
        setProcessingSteps(prev => [...prev, step]);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      try {
        // Check both item.headerDetection (direct) and item.metadata.headerDetection (nested)
        const hd = item.headerDetection || item.metadata?.headerDetection;
        const previewData = item.previewData || [];
        const fileName = item.fileName || item.metadata?.fileName || 'Unknown file';
        
        console.log('[HEADER_DETECTION] Processing file:', fileName, {
          hasDirectHeaderDetection: !!item.headerDetection,
          hasMetadataHeaderDetection: !!item.metadata?.headerDetection,
          headerDetection: hd,
          previewDataRows: previewData.length
        });
        
        if (hd && hd.headers && hd.headers.length > 0) {
          console.log('[HEADER_DETECTION] SUCCESS - Headers found:', {
            headerRowIndex: hd.headerRowIndex,
            confidence: hd.confidence,
            headersCount: hd.headers.length,
            headers: hd.headers,
            criticalFields: hd.criticalFields
          });
          
          results.push({
            success: true,
            headerRowIndex: hd.headerRowIndex,
            confidence: hd.confidence,
            headers: hd.headers,
            dataStartRow: hd.dataStartRow,
            sampleRows: previewData.slice(hd.dataStartRow, hd.dataStartRow + 5),
            previewData: previewData,
            fileName: fileName,
            documentType: item.documentClassification?.type,
          });
        } else {
          console.log('[HEADER_DETECTION] FAILED - No headers found for:', fileName);
          results.push({
            success: false,
            headerRowIndex: 0,
            confidence: 0,
            headers: [],
            dataStartRow: 0,
            sampleRows: [],
            previewData: previewData,
            fileName: fileName,
            documentType: item.documentClassification?.type,
          });
        }
      } catch (error) {
        console.error('[HEADER_DETECTION] Error processing file:', error);
      }
      
      setProcessingSteps([]);
    }

    setDetectionResults(results);
    setIsDetecting(false);
    
    if (results.length > 0) {
      setExpandedFiles(new Set([results[0].fileName]));
    }
  };

  const toggleExpand = (fileName: string) => {
    setExpandedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileName)) {
        newSet.delete(fileName);
      } else {
        newSet.add(fileName);
      }
      return newSet;
    });
  };

  const handleRetry = () => {
    detectAllHeaders(uploadData);
  };

  const handleContinue = () => {
    const headerData: Record<string, any> = {};
    detectionResults.forEach((result, idx) => {
      if (uploadData[idx]) {
        headerData[uploadData[idx].uploadId] = result;
      }
    });
    sessionStorage.setItem('nexusHeaderDetection', JSON.stringify(headerData));
    onNext({ headerDetection: headerData });
  };

  const getConfidenceColor = (confidence: number): "success" | "warning" | "danger" | "default" => {
    if (confidence >= 80) return 'success';
    if (confidence >= 50) return 'warning';
    if (confidence > 0) return 'danger';
    return 'default';
  };

  const allSuccessful = detectionResults.length > 0 && detectionResults.every(r => r.success && r.confidence >= 50);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Header Detection</h2>
        <p className="text-gray-400">Automatically detecting header rows in your uploaded files</p>
      </div>

      {isDetecting && (
        <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30">
          <CardBody className="p-6">
            <div className="flex items-start space-x-4">
              <div className="relative">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <div className="absolute inset-0 w-8 h-8 bg-blue-500/20 rounded-full animate-ping" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium mb-2">
                  Analyzing: <span className="text-blue-400">{currentFile}</span>
                </p>
                <div className="space-y-1">
                  {processingSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      <span className="text-gray-400">{step}</span>
                    </div>
                  ))}
                </div>
                <Progress 
                  isIndeterminate 
                  size="sm"
                  className="mt-4" 
                  classNames={{
                    indicator: "bg-gradient-to-r from-blue-500 to-purple-500"
                  }}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {!isDetecting && detectionResults.length > 0 && (
        <div className="space-y-4">
          <Card className="bg-white/5 border border-white/10">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    allSuccessful ? 'bg-green-500/20' : 'bg-yellow-500/20'
                  }`}>
                    {allSuccessful ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-yellow-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {allSuccessful 
                        ? `Successfully detected headers in ${detectionResults.length} file${detectionResults.length > 1 ? 's' : ''}`
                        : 'Some files need attention'
                      }
                    </p>
                    <p className="text-sm text-gray-400">
                      {detectionResults.filter(r => r.confidence >= 80).length} high confidence, {' '}
                      {detectionResults.filter(r => r.confidence >= 50 && r.confidence < 80).length} moderate
                    </p>
                  </div>
                </div>
                <Button
                  variant="flat"
                  size="sm"
                  startContent={<RefreshCw className="w-4 h-4" />}
                  onPress={handleRetry}
                >
                  Re-detect
                </Button>
              </div>
            </CardBody>
          </Card>

          {detectionResults.map((result, idx) => (
            <Card key={idx} className="bg-white/5 border border-white/10 overflow-hidden">
              <CardHeader 
                className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => toggleExpand(result.fileName)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-white font-medium">{result.fileName}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {result.documentType && (
                          <Chip size="sm" variant="flat" color="secondary" className="text-xs">
                            {result.documentType.replace('_', ' ')}
                          </Chip>
                        )}
                        <span className="text-xs text-gray-500">
                          Header at row {result.headerRowIndex + 1}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Tooltip content={`${result.confidence}% confidence`}>
                      <Chip
                        size="sm"
                        color={getConfidenceColor(result.confidence)}
                        variant="flat"
                        className="font-medium"
                      >
                        {result.confidence}% confidence
                      </Chip>
                    </Tooltip>
                    {expandedFiles.has(result.fileName) ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </CardHeader>

              {expandedFiles.has(result.fileName) && (
                <CardBody className="p-4 pt-0 border-t border-white/10">
                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2">
                      Detected {result.headers.length} columns:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {result.headers.slice(0, 10).map((header, hIdx) => (
                        <Chip 
                          key={hIdx} 
                          size="sm" 
                          variant="flat"
                          className="text-xs bg-white/10"
                        >
                          {header.length > 25 ? header.substring(0, 25) + '...' : header}
                        </Chip>
                      ))}
                      {result.headers.length > 10 && (
                        <Chip size="sm" variant="flat" className="text-xs bg-white/5">
                          +{result.headers.length - 10} more
                        </Chip>
                      )}
                    </div>
                  </div>

                  {result.sampleRows && result.sampleRows.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Data preview:</p>
                      <div className="bg-black/30 rounded-lg overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-white/10">
                              {result.headers.slice(0, 6).map((header, hIdx) => (
                                <th key={hIdx} className="text-left p-2 text-gray-400 font-medium whitespace-nowrap">
                                  {header.length > 15 ? header.substring(0, 15) + '...' : header}
                                </th>
                              ))}
                              {result.headers.length > 6 && (
                                <th className="text-left p-2 text-gray-500">...</th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {result.sampleRows.slice(0, 3).map((row, rowIdx) => (
                              <tr key={rowIdx} className="border-b border-white/5">
                                {(Array.isArray(row) ? row : []).slice(0, 6).map((cell, cellIdx) => (
                                  <td key={cellIdx} className="p-2 text-white whitespace-nowrap">
                                    {String(cell || '-').substring(0, 20)}
                                  </td>
                                ))}
                                {result.headers.length > 6 && (
                                  <td className="p-2 text-gray-500">...</td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </CardBody>
              )}
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="light" onPress={onBack} className="text-gray-400">
          Back
        </Button>
        <Button
          color="primary"
          onPress={handleContinue}
          isDisabled={isDetecting || detectionResults.length === 0}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}


