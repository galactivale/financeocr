"use client";
import React, { useState, useCallback } from "react";
import {
  Card,
  CardBody,
  Button,
  Progress,
  Chip,
  Tooltip,
  Alert
} from "@nextui-org/react";
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { detectPII, logPIIWarning, logAuditAction } from "@/lib/api/critical-gaps";
import PIIWarningModal from "@/app/components/modals/PIIWarningModal";

interface UploadStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  status: "queued" | "uploading" | "uploaded" | "error";
  uploadId?: string;
  sheets?: any[];
  documentClassification?: {
    type: string;
    subtype: string;
    confidence: number;
    description: string;
  };
  previewData?: any[];
  error?: string;
  fullResult?: any; // Store full backend response
}

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export default function UploadStep({ onNext, onBack }: UploadStepProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPIIWarning, setShowPIIWarning] = useState(false);
  const [currentPIIDetection, setCurrentPIIDetection] = useState<any>(null);
  const [currentFileForPII, setCurrentFileForPII] = useState<string | null>(null);

  // Clear previous upload data on mount
  React.useEffect(() => {
    console.log('[UPLOAD] Clearing previous sessionStorage data');
    sessionStorage.removeItem('nexusUploadData');
    sessionStorage.removeItem('nexusHeaderDetection');
  }, []);

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 15MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`;
    }
    
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const validExtensions = ['.csv', '.xls', '.xlsx'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      return 'Invalid file type. Please upload CSV or Excel files (.csv, .xls, .xlsx)';
    }
    
    return null;
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = async (fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map((file) => {
      const error = validateFile(file);
      return {
        id: `file-${Date.now()}-${Math.random()}`,
        name: file.name,
        type: file.type || file.name.split('.').pop() || '',
        size: file.size,
        status: error ? "error" : "queued",
        error: error || undefined
      };
    });

    setFiles((prev) => [...prev, ...newFiles]);
    
    // Auto-upload valid files
    const validFiles = newFiles.filter(f => f.status === "queued");
    for (const fileData of validFiles) {
      const file = fileList.find(f => f.name === fileData.name);
      if (file) {
        await uploadFile(file, fileData.id);
      }
    }
  };

  const uploadFile = async (file: File, fileId: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, status: "uploading" } : f))
    );
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3080'}/api/nexus-memos/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();

      // Log the full response for debugging
      console.log('[UPLOAD] Backend response:', {
        uploadId: result.uploadId,
        fileName: file.name,
        documentClassification: result.documentClassification,
        headerDetection: result.headerDetection,
        metadata: result.metadata,
        sheetsCount: result.sheets?.length,
        previewRowsCount: result.previewData?.length
      });

      // Store the full result for later steps
      const fullResult = {
        ...result,
        fileName: file.name,
        fileType: file.type
      };

      // Store in sessionStorage for HeaderDetectionStep
      const existingData = JSON.parse(sessionStorage.getItem('nexusUploadData') || '[]');
      existingData.push(fullResult);
      sessionStorage.setItem('nexusUploadData', JSON.stringify(existingData));

      // GAP 2: PII Detection
      if (result.previewData && result.previewData.length > 0) {
        const headers = result.headerDetection?.headers || result.previewData[0] || [];
        const dataRows = result.previewData;

        try {
          const piiResult = await detectPII(dataRows, headers);

          console.log('[UPLOAD] PII Detection result:', piiResult);

          // Log audit action
          await logAuditAction({
            action: 'PII_DETECTED',
            entity_type: 'UPLOAD',
            entity_id: result.uploadId,
            details: {
              severity: piiResult.severity,
              totalIssues: piiResult.totalIssues,
              fileName: file.name
            },
            severity: piiResult.severity === 'HIGH' ? 'WARNING' : 'INFO'
          });

          // Show warning if PII detected
          if (piiResult.severity !== 'NONE') {
            setCurrentPIIDetection(piiResult);
            setCurrentFileForPII(fileId);
            setShowPIIWarning(true);

            // Log that warning was shown
            await logPIIWarning(result.uploadId, piiResult, 'SHOWN');
          }
        } catch (piiError) {
          console.error('[UPLOAD] PII detection failed:', piiError);
          // Continue without PII detection if it fails
        }
      }

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: "uploaded",
                uploadId: result.uploadId,
                sheets: result.sheets,
                documentClassification: result.documentClassification,
                previewData: result.previewData,
                // Store full result for access later
                fullResult
              }
            : f
        )
      );
    } catch (error: any) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? { ...f, status: "error", error: error.message }
            : f
        )
      );
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const getDocumentTypeColor = (type: string) => {
    const colors: Record<string, "default" | "primary" | "secondary" | "success" | "warning" | "danger"> = {
      PROFIT_LOSS: "primary",
      TRANSACTION_DETAIL: "secondary",
      CHANNEL_ANALYSIS: "success",
      MONTHLY_ADJUSTMENTS: "warning",
      STATE_SUMMARY: "default",
      PAYROLL_DATA: "danger",
      GL_DATA: "primary",
      UNKNOWN: "default"
    };
    return colors[type] || "default";
  };

  const getDocumentTypeIcon = (type: string) => {
    return <FileText className="w-3 h-3" />;
  };

  const handleContinue = () => {
    const uploadedFiles = files.filter(f => f.status === "uploaded");
    if (uploadedFiles.length === 0) {
      alert("Please upload at least one file");
      return;
    }

    // Log what we're passing to next step
    console.log('[UPLOAD] Continuing with files:', uploadedFiles.map(f => ({
      name: f.name,
      uploadId: f.uploadId,
      hasFullResult: !!f.fullResult,
      headerDetection: f.fullResult?.headerDetection,
      documentClassification: f.documentClassification
    })));

    const uploadResults = uploadedFiles.map(f => ({
      uploadId: f.uploadId,
      fileName: f.name,
      fileType: f.type,
      fileSize: f.size,
      sheets: f.sheets,
      documentClassification: f.documentClassification,
      previewData: f.previewData,
      metadata: f.fullResult?.metadata,
      headerDetection: f.fullResult?.headerDetection,
      file: (window as any).__nexusFiles?.[f.uploadId || '']
    }));

    // Make sure sessionStorage has the data
    console.log('[UPLOAD] SessionStorage nexusUploadData:', sessionStorage.getItem('nexusUploadData'));

    onNext({ uploadResults });
  };

  const handlePIIProceed = async () => {
    if (currentFileForPII && currentPIIDetection) {
      const file = files.find(f => f.id === currentFileForPII);
      if (file?.uploadId) {
        await logPIIWarning(file.uploadId, currentPIIDetection, 'OVERRIDE');
        await logAuditAction({
          action: 'PII_OVERRIDE',
          entity_type: 'UPLOAD',
          entity_id: file.uploadId,
          details: { reason: 'User chose to proceed with PII' },
          severity: 'WARNING'
        });
      }
    }
  };

  const handlePIIAutoExclude = async () => {
    if (currentFileForPII && currentPIIDetection) {
      const file = files.find(f => f.id === currentFileForPII);
      if (file?.uploadId) {
        await logPIIWarning(file.uploadId, currentPIIDetection, 'AUTO_EXCLUDED');
        await logAuditAction({
          action: 'PII_AUTO_EXCLUDED',
          entity_type: 'UPLOAD',
          entity_id: file.uploadId,
          details: {
            excludedColumns: Object.keys(currentPIIDetection.byColumn || {})
          },
          severity: 'INFO'
        });

        // TODO: Actually filter out the PII columns from the data
        console.log('[UPLOAD] PII columns auto-excluded:', Object.keys(currentPIIDetection.byColumn || {}));
      }
    }
  };

  const allUploaded = files.length > 0 && files.every(f => f.status === "uploaded" || f.status === "error");
  const hasUploadedFiles = files.some(f => f.status === "uploaded");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Upload Files</h2>
        <p className="text-gray-400">Upload CSV or Excel files for processing</p>
      </div>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
          isDragging
            ? "border-blue-500 bg-blue-500/10"
            : "border-white/20 bg-white/5 hover:border-white/40"
        }`}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-white font-medium mb-2">
          Drag and drop files here, or click to browse
        </p>
        <p className="text-gray-400 text-sm mb-4">
          Supports CSV and Excel files (max 15MB per file)
        </p>
        <input
          type="file"
          multiple
          accept=".csv,.xls,.xlsx"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button
            as="span"
            color="primary"
            variant="flat"
            className="cursor-pointer"
          >
            Select Files
          </Button>
        </label>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          {files.map((file) => (
            <Card
              key={file.id}
              className={`bg-white/5 border ${
                file.status === "error"
                  ? "border-red-500/30"
                  : file.status === "uploaded"
                  ? "border-green-500/30"
                  : "border-white/10"
              }`}
            >
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Document Type Icon */}
                    {file.documentClassification && (
                      <Tooltip
                        content={
                          <div className="px-1 py-2">
                            <div className="text-small font-bold">
                              {file.documentClassification.type}
                            </div>
                            <div className="text-tiny">
                              {file.documentClassification.description}
                            </div>
                            <div className="text-tiny">
                              Confidence: {file.documentClassification.confidence}%
                            </div>
                          </div>
                        }
                      >
                        <Chip
                          size="sm"
                          variant="flat"
                          color={getDocumentTypeColor(file.documentClassification.type)}
                          startContent={getDocumentTypeIcon(file.documentClassification.type)}
                          className="text-xs cursor-pointer"
                        >
                          {file.documentClassification.subtype}
                        </Chip>
                      </Tooltip>
                    )}

                    <div className="flex-1">
                      <p className="text-white font-medium">{file.name}</p>
                      <p className="text-gray-400 text-sm">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                    {file.status === "uploading" && (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                        <Progress
                          isIndeterminate
                          size="sm"
                          className="w-24"
                          classNames={{
                            indicator: "bg-blue-500"
                          }}
                        />
                      </div>
                    )}

                    {file.status === "uploaded" && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}

                    {file.status === "error" && (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>

                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={() => removeFile(file.id)}
                    className="text-gray-400"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {file.error && (
                  <Alert color="danger" variant="flat" className="mt-2">
                    {file.error}
                  </Alert>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="light" onPress={onBack} className="text-gray-400">
          Cancel
        </Button>
        <Button
          color="primary"
          onPress={handleContinue}
          isDisabled={!hasUploadedFiles || uploading}
        >
          Continue
        </Button>
      </div>

      {/* PII Warning Modal */}
      {currentPIIDetection && (
        <PIIWarningModal
          isOpen={showPIIWarning}
          onClose={() => setShowPIIWarning(false)}
          piiDetection={currentPIIDetection}
          onProceed={handlePIIProceed}
          onAutoExclude={handlePIIAutoExclude}
        />
      )}
    </div>
  );
}

