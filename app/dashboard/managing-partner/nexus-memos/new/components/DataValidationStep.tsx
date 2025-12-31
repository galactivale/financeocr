"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardBody,
  Button,
  Progress,
  Chip,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from "@nextui-org/react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  FileSearch,
  Database,
  MapPin,
  Shield,
  Brain,
  Sparkles,
  ChevronRight,
  Edit3,
  RefreshCw,
  Download,
  Eye,
  AlertCircle,
  Check,
  X
} from "lucide-react";

interface DataValidationStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData?: any;
}

// Pipeline stage definitions
interface PipelineStage {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: "pending" | "running" | "success" | "warning" | "error";
  progress: number;
  message?: string;
  details?: any;
  requiresAction?: boolean;
}

// Validation issue types
interface ValidationIssue {
  id: string;
  type: "column_mapping" | "data_quality" | "state_normalization" | "missing_field" | "duplicate_column" | "conflict";
  severity: "error" | "warning" | "info";
  title: string;
  description: string;
  column?: string;
  affectedRows?: number;
  suggestions?: { value: string; confidence: number; label: string }[];
  resolution?: string;
  resolved?: boolean;
}

// Column mapping result
interface ColumnMapping {
  sourceColumn: string;
  suggestedField: string;
  confidence: number;
  source: "exact" | "fuzzy" | "firm_history" | "industry" | "ml";
  alternatives?: { field: string; confidence: number }[];
  dataType: string;
  sampleValues: string[];
  issues?: string[];
}

// State normalization result
interface StateNormalization {
  original: string;
  normalized: string;
  confidence: number;
  count: number;
  flagged: boolean;
}

export default function DataValidationStep({ onNext, onBack, initialData }: DataValidationStepProps) {
  // Pipeline state
  const [stages, setStages] = useState<PipelineStage[]>([
    { id: "parse", name: "File Parsing", description: "Validating file format and structure", icon: <FileSearch className="w-5 h-5" />, status: "pending", progress: 0 },
    { id: "headers", name: "Header Analysis", description: "Detecting and mapping columns", icon: <Database className="w-5 h-5" />, status: "pending", progress: 0 },
    { id: "quality", name: "Data Quality Scan", description: "Analyzing data consistency", icon: <Shield className="w-5 h-5" />, status: "pending", progress: 0 },
    { id: "normalize", name: "State Normalization", description: "Standardizing state values", icon: <MapPin className="w-5 h-5" />, status: "pending", progress: 0 },
    { id: "validate", name: "Required Fields", description: "Checking required fields for analysis", icon: <CheckCircle2 className="w-5 h-5" />, status: "pending", progress: 0 },
    { id: "learn", name: "Firm Learning", description: "Applying firm taxonomy", icon: <Brain className="w-5 h-5" />, status: "pending", progress: 0 },
    { id: "finalize", name: "Finalization", description: "Preparing data for analysis", icon: <Sparkles className="w-5 h-5" />, status: "pending", progress: 0 }
  ]);

  // Validation results
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [stateNormalizations, setStateNormalizations] = useState<StateNormalization[]>([]);
  const [validationSummary, setValidationSummary] = useState<any>(null);

  // UI state
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [currentIssue, setCurrentIssue] = useState<ValidationIssue | null>(null);
  const [showMappingReview, setShowMappingReview] = useState(false);
  const [canProceed, setCanProceed] = useState(false);
  const [autoResolved, setAutoResolved] = useState(0);
  const [manualRequired, setManualRequired] = useState(0);

  // Start pipeline on mount
  useEffect(() => {
    runValidationPipeline();
  }, []);

  const updateStage = (stageId: string, updates: Partial<PipelineStage>) => {
    setStages(prev => prev.map(s => s.id === stageId ? { ...s, ...updates } : s));
  };

  const runValidationPipeline = async () => {
    setIsRunning(true);
    setIssues([]);
    setAutoResolved(0);
    setManualRequired(0);

    try {
      // Get upload data from sessionStorage
      const uploadDataStr = sessionStorage.getItem('nexusUploadData');
      if (!uploadDataStr) {
        throw new Error('No upload data found');
      }
      const uploadData = JSON.parse(uploadDataStr);
      
      console.log('[VALIDATION] Starting pipeline with', uploadData.length, 'files');

      // Call backend validation endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3080'}/api/nexus-memos/validate-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          files: uploadData,
          options: {
            enableFirmLearning: true,
            strictMode: false
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Validation failed: ${response.statusText}`);
      }

      // Stream the response for real-time updates
      const result = await response.json();
      console.log('[VALIDATION] Pipeline result:', result);

      // Process stages from response
      await processValidationResult(result);

    } catch (error: any) {
      console.error('[VALIDATION] Pipeline error:', error);
      updateStage("parse", { status: "error", message: error.message });
    } finally {
      setIsRunning(false);
    }
  };

  const processValidationResult = async (result: any) => {
    const { stages: stageResults, issues: foundIssues, mappings, normalizations, summary } = result;

    // Animate through stages
    for (const stageResult of stageResults || []) {
      await animateStage(stageResult);
    }

    // Set final results
    setColumnMappings(mappings || []);
    setStateNormalizations(normalizations || []);
    setValidationSummary(summary || {});

    // Process issues
    const criticalIssues = (foundIssues || []).filter((i: ValidationIssue) => 
      i.severity === "error" || (i.severity === "warning" && !i.resolved)
    );

    setIssues(foundIssues || []);
    setAutoResolved(summary?.autoResolved || 0);
    setManualRequired(criticalIssues.length);

    // Determine if we can proceed
    const hasBlockingIssues = criticalIssues.some((i: ValidationIssue) => 
      i.severity === "error" && !i.resolved
    );

    setCanProceed(!hasBlockingIssues);

    // If there are issues requiring action, pause and show
    if (criticalIssues.length > 0) {
      setIsPaused(true);
      setShowMappingReview(true);
    }
  };

  const animateStage = async (stageResult: any) => {
    const { id, status, progress, message, details } = stageResult;
    
    // Animate progress
    updateStage(id, { status: "running", progress: 0 });
    
    for (let p = 0; p <= (progress || 100); p += 10) {
      await new Promise(r => setTimeout(r, 50));
      updateStage(id, { progress: p });
    }

    updateStage(id, { 
      status: status || "success", 
      progress: progress || 100, 
      message, 
      details,
      requiresAction: status === "warning" || status === "error"
    });

    await new Promise(r => setTimeout(r, 200));
  };

  const resolveIssue = (issueId: string, resolution: string) => {
    setIssues(prev => prev.map(i => 
      i.id === issueId ? { ...i, resolved: true, resolution } : i
    ));
    
    // Check if all critical issues are resolved
    const remaining = issues.filter(i => 
      i.id !== issueId && i.severity === "error" && !i.resolved
    );
    
    if (remaining.length === 0) {
      setCanProceed(true);
    }
    
    setManualRequired(prev => Math.max(0, prev - 1));
  };

  const handleMappingChange = (sourceColumn: string, newField: string) => {
    setColumnMappings(prev => prev.map(m => 
      m.sourceColumn === sourceColumn ? { ...m, suggestedField: newField, confidence: 100 } : m
    ));
  };

  const handleProceed = () => {
    // Save validated data to sessionStorage
    const validatedData = {
      mappings: columnMappings.reduce((acc, m) => {
        acc[m.sourceColumn] = m.suggestedField;
        return acc;
      }, {} as Record<string, string>),
      normalizations: stateNormalizations,
      summary: validationSummary
    };

    // Get upload data and add mappings
    const uploadDataStr = sessionStorage.getItem('nexusUploadData');
    if (uploadDataStr) {
      const uploadData = JSON.parse(uploadDataStr);
      
      // Create mapping format expected by AlertsStep
      const mappingsForAlerts: Record<string, Record<string, string>> = {};
      
      for (const file of uploadData) {
        const fileMapping: Record<string, string> = {};
        columnMappings.forEach((m, idx) => {
          if (m.suggestedField && m.suggestedField !== 'ignore') {
            fileMapping[String(idx)] = m.suggestedField;
          }
        });
        mappingsForAlerts[file.uploadId] = fileMapping;
      }

      sessionStorage.setItem('nexusColumnMappings', JSON.stringify(mappingsForAlerts));
      sessionStorage.setItem('nexusValidationResult', JSON.stringify(validatedData));
    }

    onNext({ validatedData });
  };

  const getStageIcon = (stage: PipelineStage) => {
    switch (stage.status) {
      case "running":
        return <Loader2 className="w-5 h-5 animate-spin text-blue-400" />;
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-600" />;
    }
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 95) return <Chip size="sm" color="success" variant="flat">Auto-mapped</Chip>;
    if (confidence >= 80) return <Chip size="sm" color="primary" variant="flat">High ({confidence}%)</Chip>;
    if (confidence >= 60) return <Chip size="sm" color="warning" variant="flat">Medium ({confidence}%)</Chip>;
    return <Chip size="sm" color="danger" variant="flat">Low ({confidence}%)</Chip>;
  };

  const unresolvedIssues = issues.filter(i => !i.resolved && (i.severity === "error" || i.severity === "warning"));
  const currentStage = stages.find(s => s.status === "running");
  const completedStages = stages.filter(s => s.status === "success" || s.status === "warning").length;
  const overallProgress = (completedStages / stages.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Data Validation</h2>
        <p className="text-gray-400">
          Automatically analyzing and validating your data for nexus analysis
        </p>
      </div>

      {/* Overall Progress */}
      <Card className="bg-gray-800/50 border border-gray-700">
        <CardBody className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {isRunning ? (
                <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
              ) : canProceed ? (
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
              )}
              <div>
                <h3 className="text-lg font-medium text-white">
                  {isRunning ? "Validating Data..." : canProceed ? "Validation Complete" : "Action Required"}
                </h3>
                <p className="text-sm text-gray-400">
                  {currentStage ? currentStage.description : 
                   canProceed ? "All checks passed. Ready to proceed." :
                   `${unresolvedIssues.length} issue(s) require your attention`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{Math.round(overallProgress)}%</div>
              <div className="text-sm text-gray-400">{completedStages}/{stages.length} stages</div>
            </div>
          </div>
          <Progress 
            value={overallProgress} 
            color={canProceed ? "success" : unresolvedIssues.length > 0 ? "warning" : "primary"}
            className="h-2"
          />
        </CardBody>
      </Card>

      {/* Pipeline Stages */}
      <Card className="bg-gray-800/50 border border-gray-700">
        <CardBody className="p-6">
          <div className="space-y-4">
            {stages.map((stage, idx) => (
              <div key={stage.id} className="relative">
                {idx < stages.length - 1 && (
                  <div className="absolute left-[22px] top-12 w-0.5 h-8 bg-gray-700" />
                )}
                <div className="flex items-start gap-4">
                  <div className={`
                    w-11 h-11 rounded-full flex items-center justify-center
                    ${stage.status === "running" ? "bg-blue-500/20 ring-2 ring-blue-500" :
                      stage.status === "success" ? "bg-green-500/20" :
                      stage.status === "warning" ? "bg-yellow-500/20" :
                      stage.status === "error" ? "bg-red-500/20" :
                      "bg-gray-700"}
                  `}>
                    {getStageIcon(stage)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{stage.name}</span>
                        {stage.status === "success" && (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        )}
                        {stage.requiresAction && (
                          <Chip size="sm" color="warning" variant="flat">Review</Chip>
                        )}
                      </div>
                      {stage.status === "running" && (
                        <span className="text-sm text-blue-400">{stage.progress}%</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {stage.message || stage.description}
                    </p>
                    {stage.status === "running" && (
                      <Progress value={stage.progress} size="sm" className="mt-2 h-1" color="primary" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Issues Panel (Only shown if there are unresolved issues) */}
      {unresolvedIssues.length > 0 && (
        <Card className="bg-yellow-500/10 border border-yellow-500/30">
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              <div>
                <h3 className="text-lg font-medium text-white">Issues Requiring Attention</h3>
                <p className="text-sm text-gray-400">
                  {autoResolved} issues auto-resolved • {unresolvedIssues.length} need manual review
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {unresolvedIssues.map(issue => (
                <div 
                  key={issue.id}
                  className={`
                    p-4 rounded-lg border cursor-pointer transition-all hover:scale-[1.01]
                    ${issue.severity === "error" ? "bg-red-500/10 border-red-500/30" : "bg-yellow-500/10 border-yellow-500/30"}
                  `}
                  onClick={() => {
                    setCurrentIssue(issue);
                    setShowIssueModal(true);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {issue.severity === "error" ? (
                        <XCircle className="w-5 h-5 text-red-400 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                      )}
                      <div>
                        <h4 className="font-medium text-white">{issue.title}</h4>
                        <p className="text-sm text-gray-400 mt-1">{issue.description}</p>
                        {issue.column && (
                          <Chip size="sm" variant="flat" className="mt-2">
                            Column: {issue.column}
                          </Chip>
                        )}
                      </div>
                    </div>
                    <Button size="sm" variant="flat" color="primary">
                      Resolve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Mapping Review Panel (Collapsed by default, expandable) */}
      {columnMappings.length > 0 && (
        <Card className="bg-gray-800/50 border border-gray-700">
          <CardBody className="p-0">
            <details className="group">
              <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-700/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-blue-400" />
                  <span className="font-medium text-white">Column Mappings</span>
                  <Chip size="sm" color="success" variant="flat">
                    {columnMappings.filter(m => m.confidence >= 80).length}/{columnMappings.length} auto-mapped
                  </Chip>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-90" />
              </summary>
              <div className="p-4 pt-0 border-t border-gray-700">
                <Table removeWrapper aria-label="Column mappings">
                  <TableHeader>
                    <TableColumn>SOURCE COLUMN</TableColumn>
                    <TableColumn>MAPPED TO</TableColumn>
                    <TableColumn>CONFIDENCE</TableColumn>
                    <TableColumn>SAMPLE VALUES</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {columnMappings.map((mapping, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <span className="font-mono text-sm">{mapping.sourceColumn}</span>
                        </TableCell>
                        <TableCell>
                          <Select
                            size="sm"
                            selectedKeys={[mapping.suggestedField]}
                            onChange={(e) => handleMappingChange(mapping.sourceColumn, e.target.value)}
                            className="min-w-[160px]"
                          >
                            <SelectItem key="state">State</SelectItem>
                            <SelectItem key="revenue">Revenue/Amount</SelectItem>
                            <SelectItem key="date">Date</SelectItem>
                            <SelectItem key="customer">Customer</SelectItem>
                            <SelectItem key="product">Product/Service</SelectItem>
                            <SelectItem key="activity_type">Activity Type</SelectItem>
                            <SelectItem key="employee">Employee</SelectItem>
                            <SelectItem key="wages">Wages</SelectItem>
                            <SelectItem key="ignore">Ignore</SelectItem>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {getConfidenceBadge(mapping.confidence)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {mapping.sampleValues?.slice(0, 3).map((v, i) => (
                              <Chip key={i} size="sm" variant="flat" className="text-xs">
                                {String(v).substring(0, 15)}
                              </Chip>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Tooltip content="View alternatives">
                            <Button size="sm" variant="light" isIconOnly>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </details>
          </CardBody>
        </Card>
      )}

      {/* State Normalizations Panel */}
      {stateNormalizations.length > 0 && stateNormalizations.some(n => n.original !== n.normalized) && (
        <Card className="bg-gray-800/50 border border-gray-700">
          <CardBody className="p-0">
            <details className="group">
              <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-700/30 transition-colors">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-green-400" />
                  <span className="font-medium text-white">State Normalizations</span>
                  <Chip size="sm" color="success" variant="flat">
                    {stateNormalizations.filter(n => n.confidence >= 90).length} auto-corrected
                  </Chip>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-90" />
              </summary>
              <div className="p-4 pt-0 border-t border-gray-700">
                <Table removeWrapper aria-label="State normalizations">
                  <TableHeader>
                    <TableColumn>ORIGINAL</TableColumn>
                    <TableColumn>NORMALIZED</TableColumn>
                    <TableColumn>CONFIDENCE</TableColumn>
                    <TableColumn>COUNT</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {stateNormalizations.filter(n => n.original !== n.normalized).map((norm, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <span className="font-mono text-sm text-gray-400">{norm.original}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm text-white">{norm.normalized}</span>
                        </TableCell>
                        <TableCell>
                          {getConfidenceBadge(norm.confidence)}
                        </TableCell>
                        <TableCell>
                          <Chip size="sm" variant="flat">{norm.count} rows</Chip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </details>
          </CardBody>
        </Card>
      )}

      {/* Validation Summary */}
      {validationSummary && !isRunning && (
        <Card className="bg-gray-800/50 border border-gray-700">
          <CardBody className="p-6">
            <h3 className="text-lg font-medium text-white mb-4">Validation Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                <div className="text-2xl font-bold text-white">{validationSummary.totalRows || 0}</div>
                <div className="text-sm text-gray-400">Total Rows</div>
              </div>
              <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                <div className="text-2xl font-bold text-green-400">{validationSummary.validRows || 0}</div>
                <div className="text-sm text-gray-400">Valid Rows</div>
              </div>
              <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">{validationSummary.statesDetected || 0}</div>
                <div className="text-sm text-gray-400">States Detected</div>
              </div>
              <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">
                  ${(validationSummary.totalRevenue || 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Total Revenue</div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Issue Resolution Modal */}
      <Modal isOpen={showIssueModal} onClose={() => setShowIssueModal(false)} size="lg">
        <ModalContent className="bg-gray-800 border border-gray-700">
          <ModalHeader className="flex items-center gap-3">
            {currentIssue?.severity === "error" ? (
              <XCircle className="w-6 h-6 text-red-400" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
            )}
            <span>{currentIssue?.title}</span>
          </ModalHeader>
          <ModalBody>
            <p className="text-gray-300">{currentIssue?.description}</p>
            
            {currentIssue?.suggestions && currentIssue.suggestions.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Suggested Resolutions:</h4>
                <div className="space-y-2">
                  {currentIssue.suggestions.map((suggestion, idx) => (
                    <div 
                      key={idx}
                      className="p-3 bg-gray-700/50 rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-700 transition-colors"
                      onClick={() => {
                        resolveIssue(currentIssue.id, suggestion.value);
                        setShowIssueModal(false);
                      }}
                    >
                      <div>
                        <span className="text-white">{suggestion.label}</span>
                        <span className="text-sm text-gray-400 ml-2">({suggestion.confidence}% confidence)</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentIssue?.affectedRows && (
              <div className="mt-4 p-3 bg-gray-700/30 rounded-lg">
                <span className="text-sm text-gray-400">Affected rows: </span>
                <span className="text-white font-medium">{currentIssue.affectedRows}</span>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => setShowIssueModal(false)}>
              Cancel
            </Button>
            <Button 
              color="warning" 
              onPress={() => {
                resolveIssue(currentIssue!.id, "skip");
                setShowIssueModal(false);
              }}
            >
              Skip This Issue
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="flat" onPress={onBack}>
          Back
        </Button>
        <div className="flex gap-3">
          {isRunning && (
            <Button variant="flat" color="warning" onPress={() => setIsPaused(!isPaused)}>
              {isPaused ? "Resume" : "Pause"}
            </Button>
          )}
          <Button
            color="primary"
            onPress={handleProceed}
            isDisabled={isRunning || !canProceed}
            endContent={<ChevronRight className="w-4 h-4" />}
          >
            {canProceed ? "Continue to Analysis" : "Resolve Issues to Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}

