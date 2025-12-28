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
  Alert,
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
  XCircle
} from "lucide-react";
import { apiClient } from "@/lib/api";
import DoctrineScopeSelector from "./DoctrineScopeSelector";

interface Alert {
  id: string;
  type: string;
  severity: "RED" | "ORANGE" | "YELLOW";
  stateCode: string;
  message: string;
  threshold?: number;
  currentAmount?: number;
  percentage?: number;
  judgmentRequired: boolean;
  known: boolean;
  appliedDoctrineRuleId?: string;
  doctrineRuleVersion?: number;
}

interface AlertsStepProps {
  onNext: (alertsData: any) => void;
  onBack: () => void;
}

export default function AlertsStep({ onNext, onBack }: AlertsStepProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<"all" | "red" | "orange" | "judgment">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAlertForDoctrine, setSelectedAlertForDoctrine] = useState<Alert | null>(null);
  const [showDoctrineModal, setShowDoctrineModal] = useState(false);
  const [organizationId, setOrganizationId] = useState<string>("");
  const [clientId, setClientId] = useState<string>("");

  useEffect(() => {
    // Load alerts from sessionStorage or API
    const stored = sessionStorage.getItem('nexusAlerts');
    const orgId = sessionStorage.getItem('organizationId');
    const cId = sessionStorage.getItem('clientId');
    
    if (orgId) setOrganizationId(orgId);
    if (cId) setClientId(cId);
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAlerts(parsed);
      } catch (e) {
        console.error('Error parsing stored alerts:', e);
      }
    }
    
    setIsLoading(false);
  }, []);

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

  const handleCreateDoctrineRule = (alert: Alert) => {
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

      {/* Filters */}
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
    </div>
  );
}

