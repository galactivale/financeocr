"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Checkbox,
  Progress,
  Alert as NextUIAlert,
  Tooltip,
  Badge
} from "@nextui-org/react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Filter,
  Save,
  ArrowRight,
  XCircle,
  Loader2
} from "lucide-react";
import { apiClient } from "@/lib/api";
import DoctrineScopeSelector from "./DoctrineScopeSelector";
import StatuteOverrideModal, { StatuteOverrideData } from "@/app/components/modals/StatuteOverrideModal";
import { createStatuteOverride, logAuditAction } from "@/lib/api/critical-gaps";

interface NexusAlert {
  id: string;
  type: string;
  subtype?: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO" | "RED" | "ORANGE" | "YELLOW";
  state?: string;
  stateCode?: string;
  stateName?: string;
  title?: string;
  message?: string;
  description?: string;
  threshold?: number;
  currentAmount?: number;
  percentage?: number;
  facts?: any;
  recommendation?: string;
  judgmentRequired: boolean;
  requiresAction?: boolean;
  known: boolean;
  appliedDoctrineRuleId?: string;
  doctrineRuleVersion?: number;
}

interface AlertsStepProps {
  onNext: (alertsData: any) => void;
  onBack: () => void;
}

export default function AlertsStep({ onNext, onBack }: AlertsStepProps) {
  const [alerts, setAlerts] = useState<NexusAlert[]>([]);
  const [filter, setFilter] = useState<"all" | "red" | "orange" | "judgment">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Initializing alert detection...");
  const [selectedAlertForDoctrine, setSelectedAlertForDoctrine] = useState<NexusAlert | null>(null);
  const [showDoctrineModal, setShowDoctrineModal] = useState(false);
  const [organizationId, setOrganizationId] = useState<string>("");
  const [clientId, setClientId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showStatuteOverrideModal, setShowStatuteOverrideModal] = useState(false);

  useEffect(() => {
    const orgId = sessionStorage.getItem('organizationId');
    const cId = sessionStorage.getItem('clientId');
    
    if (orgId) setOrganizationId(orgId);
    if (cId) setClientId(cId);
    
    // Check if we already have alerts
    const storedAlerts = sessionStorage.getItem('nexusAlerts');
    if (storedAlerts) {
      try {
        const parsed = JSON.parse(storedAlerts);
        if (parsed && parsed.length > 0) {
          setAlerts(parsed);
          setIsLoading(false);
          return;
        }
      } catch (e) {
        console.error('Error parsing stored alerts:', e);
      }
    }
    
    // Generate alerts from mapped data
    generateAlerts();
  }, []);

  const generateAlerts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get mapped data from sessionStorage
      const mappingsStr = sessionStorage.getItem('nexusColumnMappings');
      const uploadDataStr = sessionStorage.getItem('nexusUploadData');
      
      console.log('[ALERTS] Generating alerts...');
      console.log('[ALERTS] Mappings:', mappingsStr);
      console.log('[ALERTS] Upload data:', uploadDataStr);
      
      if (!mappingsStr || !uploadDataStr) {
        setLoadingMessage("No data available for alert generation");
        setIsLoading(false);
        return;
      }
      
      const mappings = JSON.parse(mappingsStr);
      const uploadData = JSON.parse(uploadDataStr);
      
      // Normalize data based on mappings
      setLoadingMessage("Normalizing data...");
      const normalizedData = normalizeDataWithMappings(uploadData, mappings);
      
      console.log('[ALERTS] Normalized data:', normalizedData.slice(0, 5));
      
      // Call backend to generate alerts
      setLoadingMessage("Running nexus detection engine...");
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3080'}/api/nexus-memos/generate-alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          normalizedData,
          config: {
            riskPosture: 'standard',
            enabledModules: {
              sales: true,
              income: true,
              payroll: true,
              franchise: true
            }
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to generate alerts: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('[ALERTS] Backend response:', result);
      
      if (result.success && result.alerts) {
        // Transform alerts to our format
        const transformedAlerts: NexusAlert[] = result.alerts.map((alert: any) => ({
          id: alert.id,
          type: alert.type,
          subtype: alert.subtype,
          severity: mapSeverity(alert.severity),
          state: alert.state,
          stateCode: alert.state,
          stateName: alert.stateName,
          title: alert.title,
          message: alert.title || alert.description,
          description: alert.description,
          threshold: alert.facts?.threshold,
          currentAmount: alert.facts?.actualRevenue || alert.facts?.actualIncome,
          percentage: alert.facts?.percentageOver ? parseFloat(alert.facts.percentageOver) : undefined,
          facts: alert.facts,
          recommendation: alert.recommendation,
          judgmentRequired: alert.judgmentRequired || false,
          requiresAction: alert.requiresAction || false,
          known: false
        }));
        
        setAlerts(transformedAlerts);
        sessionStorage.setItem('nexusAlerts', JSON.stringify(transformedAlerts));
        
        console.log('[ALERTS] Generated alerts:', transformedAlerts.length);
      } else {
        // No alerts or error
        setAlerts([]);
      }
    } catch (err: any) {
      console.error('[ALERTS] Error generating alerts:', err);
      setError(err.message || 'Failed to generate alerts');
      
      // Fallback: generate sample alerts for demo
      const sampleAlerts = generateSampleAlerts();
      setAlerts(sampleAlerts);
      sessionStorage.setItem('nexusAlerts', JSON.stringify(sampleAlerts));
    } finally {
      setIsLoading(false);
    }
  };

  // Normalize data based on column mappings
  const normalizeDataWithMappings = (uploadData: any[], mappings: Record<string, any>) => {
    const normalized: any[] = [];
    
    console.log('[ALERTS] normalizeDataWithMappings called');
    console.log('[ALERTS] Upload data files:', uploadData.length);
    console.log('[ALERTS] Mappings:', JSON.stringify(mappings, null, 2));
    
    for (const fileData of uploadData) {
      const fileId = fileData.uploadId;
      const fileMapping = mappings[fileId] || {};
      // Use allData if available (full dataset), fallback to previewData
      const dataRows = fileData.allData || fileData.previewData || [];
      const headerDetection = fileData.headerDetection || fileData.metadata?.headerDetection;
      const dataStartRow = headerDetection?.dataStartRow || 1;
      const headers = headerDetection?.headers || [];
      
      console.log('[ALERTS] Processing file:', fileId);
      console.log('[ALERTS] File mapping:', fileMapping);
      console.log('[ALERTS] Data rows available:', dataRows.length);
      console.log('[ALERTS] Data start row:', dataStartRow);
      console.log('[ALERTS] Headers:', headers);
      
      // Skip header row, process data rows
      for (let i = dataStartRow; i < dataRows.length; i++) {
        const row = dataRows[i];
        if (!Array.isArray(row)) continue;
        
        const normalizedRow: any = {};
        
        // Map columns based on explicit mappings first
        Object.entries(fileMapping).forEach(([colIndex, fieldName]) => {
          const idx = parseInt(colIndex);
          if (!isNaN(idx) && row[idx] !== undefined && row[idx] !== null && row[idx] !== '') {
            normalizedRow[fieldName as string] = row[idx];
          }
        });
        
        // Also include by header name for fields not already mapped
        headers.forEach((header: string, idx: number) => {
          if (row[idx] !== undefined && row[idx] !== null && row[idx] !== '') {
            const normalizedHeader = header.toLowerCase().replace(/\s+/g, '_');
            // Don't overwrite explicit mappings
            if (!normalizedRow[normalizedHeader]) {
              normalizedRow[normalizedHeader] = row[idx];
            }
          }
        });
        
        if (Object.keys(normalizedRow).length > 0) {
          normalized.push(normalizedRow);
        }
      }
    }
    
    console.log('[ALERTS] Total normalized rows:', normalized.length);
    if (normalized.length > 0) {
      console.log('[ALERTS] Sample normalized row:', normalized[0]);
    }
    
    return normalized;
  };

  // Map backend severity to UI severity
  const mapSeverity = (severity: string): "RED" | "ORANGE" | "YELLOW" => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
      case 'HIGH':
        return 'RED';
      case 'MEDIUM':
        return 'ORANGE';
      case 'LOW':
      case 'INFO':
      default:
        return 'YELLOW';
    }
  };

  // Generate sample alerts for demo/fallback
  const generateSampleAlerts = (): NexusAlert[] => {
    return [
      {
        id: 'sample-1',
        type: 'SALES_NEXUS',
        subtype: 'ECONOMIC_NEXUS',
        severity: 'RED',
        stateCode: 'CA',
        stateName: 'California',
        title: 'CA Sales Tax Economic Nexus Triggered',
        message: 'Revenue exceeds California economic nexus threshold',
        threshold: 500000,
        currentAmount: 650000,
        percentage: 130,
        judgmentRequired: false,
        requiresAction: true,
        known: false,
        recommendation: 'Register for sales tax collection in California'
      },
      {
        id: 'sample-2',
        type: 'INCOME_NEXUS',
        subtype: 'PL86_272_JUDGMENT_REQUIRED',
        severity: 'ORANGE',
        stateCode: 'TX',
        stateName: 'Texas',
        title: 'TX Franchise Tax Review Required',
        message: 'Texas franchise tax may apply based on revenue',
        threshold: 1230000,
        currentAmount: 980000,
        percentage: 79.7,
        judgmentRequired: true,
        requiresAction: false,
        known: false,
        recommendation: 'Review Texas margin tax requirements'
      },
      {
        id: 'sample-3',
        type: 'SALES_NEXUS',
        subtype: 'ECONOMIC_NEXUS_APPROACHING',
        severity: 'YELLOW',
        stateCode: 'FL',
        stateName: 'Florida',
        title: 'FL Sales Tax Threshold Approaching',
        message: 'Revenue is approaching Florida economic nexus threshold',
        threshold: 100000,
        currentAmount: 85000,
        percentage: 85,
        judgmentRequired: false,
        requiresAction: false,
        known: false,
        recommendation: 'Monitor sales activity in Florida'
      }
    ];
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "RED":
        return "danger";
      case "ORANGE":
        return "warning";
      case "YELLOW":
        return "default";
      default:
        return "default";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "RED":
        return <XCircle className="w-4 h-4" />;
      case "ORANGE":
        return <AlertTriangle className="w-4 h-4" />;
      case "YELLOW":
        return <Info className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "red") return alert.severity === "RED";
    if (filter === "orange") return alert.severity === "ORANGE";
    if (filter === "judgment") return alert.judgmentRequired;
    return true;
  });

  const handleMarkAsKnown = (alertId: string, checked: boolean) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, known: checked } : alert
      )
    );
    
    // Update sessionStorage
    const updated = alerts.map((alert) =>
      alert.id === alertId ? { ...alert, known: checked } : alert
    );
    sessionStorage.setItem('nexusAlerts', JSON.stringify(updated));
  };

  const handleCreateDoctrineRule = (alert: NexusAlert) => {
    setSelectedAlertForDoctrine(alert);
    setShowDoctrineModal(true);
  };

  const handleSaveDoctrineRule = async (ruleData: any) => {
    try {
      const response = await apiClient.createDoctrineRule({
        ...ruleData,
        organizationId,
        clientId: ruleData.scope === "client" ? clientId : undefined
      });

      if (response.success) {
        // Update alert with doctrine rule reference
        const rule = (response as any).rule || (response as any).data?.rule;
        if (selectedAlertForDoctrine && rule) {
          setAlerts((prev) =>
            prev.map((alert) =>
              alert.id === selectedAlertForDoctrine.id
                ? {
                    ...alert,
                    appliedDoctrineRuleId: rule.id || rule.rule_id,
                    doctrineRuleVersion: rule.version,
                    judgmentRequired: false
                  }
                : alert
            )
          );

          // Update sessionStorage
          const updated = alerts.map((alert) =>
            alert.id === selectedAlertForDoctrine.id
              ? {
                  ...alert,
                  appliedDoctrineRuleId: rule.id || rule.rule_id,
                  doctrineRuleVersion: rule.version,
                  judgmentRequired: false
                }
              : alert
          );
          sessionStorage.setItem('nexusAlerts', JSON.stringify(updated));
        }

        setShowDoctrineModal(false);
        setSelectedAlertForDoctrine(null);
      }
    } catch (error: any) {
      console.error('Error creating doctrine rule:', error);
      throw error;
    }
  };

  const handleStatuteOverrideSave = async (data: StatuteOverrideData) => {
    try {
      const userId = sessionStorage.getItem('userId') || 'current-user';

      const override = await createStatuteOverride({
        ...data,
        organizationId,
        enteredBy: userId
      });

      console.log('[ALERTS] Statute override created:', override);

      // GAP 3: Log audit action
      await logAuditAction({
        action: 'STATUTE_OVERRIDE_CREATED',
        entity_type: 'STATUTE_OVERRIDE',
        entity_id: override.id || 'unknown',
        details: {
          stateCode: data.stateCode,
          taxType: data.taxType,
          changeType: data.changeType,
          effectiveDate: data.effectiveDate
        },
        severity: 'INFO',
        organizationId
      });

      alert(`Statute override for ${data.stateCode} ${data.taxType} has been recorded and is pending validation.`);

      setShowStatuteOverrideModal(false);
    } catch (error: any) {
      console.error('Failed to save statute override:', error);
      alert(`Failed to save statute override: ${error.message}`);
      throw error;
    }
  };

  const handleContinue = () => {
    // Store updated alerts
    sessionStorage.setItem('nexusAlerts', JSON.stringify(alerts));
    onNext({ alerts });
  };

  const redCount = alerts.filter((a) => a.severity === "RED").length;
  const orangeCount = alerts.filter((a) => a.severity === "ORANGE").length;
  const judgmentCount = alerts.filter((a) => a.judgmentRequired).length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-2">Alerts Review</h2>
          <p className="text-gray-400">Analyzing data and generating alerts...</p>
        </div>
        <Card className="bg-white/5 border border-white/10">
          <CardBody className="p-8">
            <Progress isIndeterminate className="max-w-md" />
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Alerts Review</h2>
        <p className="text-gray-400">Review and manage nexus compliance alerts</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 border border-white/10">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Alerts</p>
                <p className="text-2xl font-bold text-white">{alerts.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-gray-400" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-red-500/10 border border-red-500/30">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Critical</p>
                <p className="text-2xl font-bold text-red-400">{redCount}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-orange-500/10 border border-orange-500/30">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Warnings</p>
                <p className="text-2xl font-bold text-orange-400">{orangeCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-400" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-yellow-500/10 border border-yellow-500/30">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Judgment Required</p>
                <p className="text-2xl font-bold text-yellow-400">{judgmentCount}</p>
              </div>
              <Info className="w-8 h-8 text-yellow-400" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filters and Statute Override Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">Filter:</span>
          <Button
            size="sm"
            variant={filter === "all" ? "solid" : "flat"}
            color={filter === "all" ? "primary" : "default"}
            onPress={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            size="sm"
            variant={filter === "red" ? "solid" : "flat"}
            color={filter === "red" ? "danger" : "default"}
            onPress={() => setFilter("red")}
          >
            Critical ({redCount})
          </Button>
          <Button
            size="sm"
            variant={filter === "orange" ? "solid" : "flat"}
            color={filter === "orange" ? "warning" : "default"}
            onPress={() => setFilter("orange")}
          >
            Warnings ({orangeCount})
          </Button>
          <Button
            size="sm"
            variant={filter === "judgment" ? "solid" : "flat"}
            color={filter === "judgment" ? "warning" : "default"}
            onPress={() => setFilter("judgment")}
          >
            Judgment Required ({judgmentCount})
          </Button>
        </div>

        {/* GAP 1: Statute Override Entry */}
        <Button
          color="secondary"
          variant="flat"
          startContent={<Save className="w-4 h-4" />}
          onPress={() => setShowStatuteOverrideModal(true)}
        >
          Enter Statute Override
        </Button>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <Card className="bg-white/5 border border-white/10">
            <CardBody className="p-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-white font-medium mb-2">No alerts found</p>
              <p className="text-gray-400 text-sm">
                {filter === "all"
                  ? "All alerts have been resolved."
                  : `No alerts match the "${filter}" filter.`}
              </p>
            </CardBody>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <Card
              key={alert.id}
              className={`bg-white/5 border ${
                alert.severity === "RED"
                  ? "border-red-500/30"
                  : alert.severity === "ORANGE"
                  ? "border-orange-500/30"
                  : "border-white/10"
              }`}
            >
              <CardBody className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3">
                      <Chip
                        color={getSeverityColor(alert.severity)}
                        variant="flat"
                        startContent={getSeverityIcon(alert.severity)}
                      >
                        {alert.severity}
                      </Chip>
                      <Chip size="sm" variant="flat">
                        {alert.stateCode}
                      </Chip>
                      <Chip size="sm" variant="flat">
                        {alert.type}
                      </Chip>
                      {alert.appliedDoctrineRuleId && (
                        <Tooltip content={`Doctrine Rule v${alert.doctrineRuleVersion} applied`}>
                          <Chip
                            size="sm"
                            color="secondary"
                            variant="flat"
                            startContent={<CheckCircle2 className="w-3 h-3" />}
                          >
                            Doctrine Applied
                          </Chip>
                        </Tooltip>
                      )}
                      {alert.judgmentRequired && (
                        <Badge content="!" color="warning" size="sm">
                          <Chip size="sm" color="warning" variant="flat">
                            Judgment Required
                          </Chip>
                        </Badge>
                      )}
                    </div>

                    <p className="text-white font-medium">{alert.message}</p>

                    {alert.threshold && alert.currentAmount && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Threshold:</span>
                          <span className="text-white">
                            ${alert.threshold.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Current:</span>
                          <span className="text-white">
                            ${alert.currentAmount.toLocaleString()}
                          </span>
                        </div>
                        {alert.percentage && (
                          <div className="mt-2">
                            <Progress
                              value={Math.min(alert.percentage, 100)}
                              color={
                                alert.percentage >= 100
                                  ? "danger"
                                  : alert.percentage >= 80
                                  ? "warning"
                                  : "default"
                              }
                              className="max-w-md"
                            />
                            <div className="text-xs text-gray-400 mt-1">
                              {alert.percentage.toFixed(1)}% of threshold
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {alert.judgmentRequired && !alert.appliedDoctrineRuleId && (
                      <div className="pt-2">
                        <Button
                          size="sm"
                          color="primary"
                          variant="flat"
                          startContent={<Save className="w-4 h-4" />}
                          onPress={() => handleCreateDoctrineRule(alert)}
                        >
                          Save as Doctrine Rule
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="ml-4">
                    <Checkbox
                      isSelected={alert.known}
                      onValueChange={(checked) =>
                        handleMarkAsKnown(alert.id, checked)
                      }
                      classNames={{
                        label: "text-sm text-gray-400"
                      }}
                    >
                      Mark as known
                    </Checkbox>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="light" onPress={onBack} className="text-gray-400">
          Back
        </Button>
        <Button color="primary" onPress={handleContinue} endContent={<ArrowRight className="w-4 h-4" />}>
          Continue to Memos
        </Button>
      </div>

      {/* Doctrine Scope Selector Modal */}
      {selectedAlertForDoctrine && (
        <DoctrineScopeSelector
          isOpen={showDoctrineModal}
          onClose={() => {
            setShowDoctrineModal(false);
            setSelectedAlertForDoctrine(null);
          }}
          onSave={handleSaveDoctrineRule}
          alertData={{
            stateCode: selectedAlertForDoctrine.stateCode,
            taxType: selectedAlertForDoctrine.type,
            message: selectedAlertForDoctrine.message,
            threshold: selectedAlertForDoctrine.threshold,
            currentAmount: selectedAlertForDoctrine.currentAmount
          }}
          organizationId={organizationId}
          clientId={clientId}
        />
      )}

      {/* GAP 1: Statute Override Modal */}
      <StatuteOverrideModal
        isOpen={showStatuteOverrideModal}
        onClose={() => setShowStatuteOverrideModal(false)}
        onSave={handleStatuteOverrideSave}
        organizationId={organizationId}
      />
    </div>
  );
}

