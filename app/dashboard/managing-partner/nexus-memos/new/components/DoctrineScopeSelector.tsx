"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  RadioGroup,
  Radio,
  Textarea,
  Card,
  CardBody,
  Alert,
  Chip
} from "@nextui-org/react";
import { AlertTriangle, Info, Building2, Users, Globe } from "lucide-react";
import { apiClient } from "@/lib/api";

interface DoctrineScopeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ruleData: DoctrineRuleData) => Promise<void>;
  alertData: {
    stateCode?: string;
    taxType?: string;
    message?: string;
    threshold?: number;
    currentAmount?: number;
  };
  organizationId: string;
  clientId?: string;
}

interface DoctrineRuleData {
  name: string;
  state?: string;
  taxType?: string;
  activityPattern?: any;
  posture: string;
  decision: string;
  scope: "client" | "office" | "firm";
  clientId?: string;
  rationaleInternal: string;
}

export default function DoctrineScopeSelector({
  isOpen,
  onClose,
  onSave,
  alertData,
  organizationId,
  clientId
}: DoctrineScopeSelectorProps) {
  const [scope, setScope] = useState<"client" | "office" | "firm">("client");
  const [rationale, setRationale] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFirmWarning, setShowFirmWarning] = useState(false);

  const handleScopeChange = (value: string) => {
    const newScope = value as "client" | "office" | "firm";
    setScope(newScope);
    
    if (newScope === "firm") {
      setShowFirmWarning(true);
    } else {
      setShowFirmWarning(false);
    }
  };

  const handleSave = async () => {
    if (!rationale.trim()) {
      setError("Rationale is required");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Generate rule name
      const ruleName = `${alertData.stateCode || "General"} ${alertData.taxType || "Tax"} - ${scope === "client" ? "Client" : scope === "office" ? "Office" : "Firm-wide"} Rule`;

      const ruleData: DoctrineRuleData = {
        name: ruleName,
        state: alertData.stateCode,
        taxType: alertData.taxType,
        activityPattern: {
          revenue_threshold: alertData.threshold,
          revenue_range: alertData.currentAmount 
            ? `${Math.max(0, (alertData.currentAmount || 0) * 0.9)}-${(alertData.currentAmount || 0) * 1.1}`
            : undefined
        },
        posture: "CONSERVATIVE", // Default, can be made configurable
        decision: "NO_ACTION", // Default, can be made configurable
        scope,
        clientId: scope === "client" ? clientId : undefined,
        rationaleInternal: rationale
      };

      await onSave(ruleData);
      handleClose();
    } catch (err: any) {
      setError(err.message || "Failed to save doctrine rule");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setScope("client");
    setRationale("");
    setError(null);
    setShowFirmWarning(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: "bg-gray-900 text-white",
        header: "border-b border-white/10",
        body: "py-6",
        footer: "border-t border-white/10"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center space-x-2">
            <Info className="w-5 h-5 text-blue-400" />
            <span>Save this decision for similar situations?</span>
          </div>
        </ModalHeader>
        <ModalBody>
          {error && (
            <Alert color="danger" variant="flat" className="mb-4">
              {error}
            </Alert>
          )}

          {showFirmWarning && (
            <Alert
              color="warning"
              variant="flat"
              icon={<AlertTriangle className="w-5 h-5" />}
              className="mb-4"
            >
              <div className="font-semibold mb-1">Firm-wide Rule Warning</div>
              <div className="text-sm">
                Firm-wide rules require 2 partner approvals and will apply to all clients.
                Please ensure this decision has been thoroughly reviewed before proceeding.
              </div>
            </Alert>
          )}

          <div className="space-y-4">
            {/* Alert Context */}
            <Card className="bg-white/5 border border-white/10">
              <CardBody className="p-4">
                <div className="text-sm text-gray-400 mb-2">Alert Context</div>
                <div className="space-y-1">
                  {alertData.stateCode && (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">State:</span>
                      <Chip size="sm" variant="flat">{alertData.stateCode}</Chip>
                    </div>
                  )}
                  {alertData.taxType && (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">Tax Type:</span>
                      <Chip size="sm" variant="flat">{alertData.taxType}</Chip>
                    </div>
                  )}
                  {alertData.message && (
                    <div className="text-white text-sm mt-2">{alertData.message}</div>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Scope Selection */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-3 block">
                Rule Scope
              </label>
              <RadioGroup
                value={scope}
                onValueChange={handleScopeChange}
                className="space-y-2"
              >
                <Radio
                  value="client"
                  classNames={{
                    base: "max-w-full p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors",
                    label: "text-white",
                    description: "text-gray-400 text-xs"
                  }}
                  description="Applies only to this client. Auto-activated immediately."
                >
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>Client Only</span>
                  </div>
                </Radio>

                <Radio
                  value="office"
                  classNames={{
                    base: "max-w-full p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors",
                    label: "text-white",
                    description: "text-gray-400 text-xs"
                  }}
                  description="Applies to all clients in your office. Requires 1 partner approval."
                >
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-yellow-400" />
                    <span>Office-wide</span>
                  </div>
                </Radio>

                <Radio
                  value="firm"
                  classNames={{
                    base: "max-w-full p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors",
                    label: "text-white",
                    description: "text-gray-400 text-xs"
                  }}
                  description="Applies to all clients firm-wide. Requires 2 partner approvals."
                >
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-red-400" />
                    <span>Firm-wide</span>
                  </div>
                </Radio>
              </RadioGroup>
            </div>

            {/* Rationale Input */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Internal Rationale <span className="text-red-400">*</span>
              </label>
              <Textarea
                value={rationale}
                onValueChange={setRationale}
                placeholder="Explain the reasoning behind this decision (internal use only, not client-facing)..."
                minRows={4}
                classNames={{
                  base: "bg-white/5",
                  input: "text-white placeholder:text-gray-500",
                  inputWrapper: "border-white/10"
                }}
              />
              <div className="text-xs text-gray-500 mt-1">
                This rationale will be stored internally and used for future reference.
              </div>
            </div>

            {/* Preview */}
            <Card className="bg-blue-500/10 border border-blue-500/30">
              <CardBody className="p-4">
                <div className="text-sm font-medium text-blue-300 mb-2">
                  Rule Preview
                </div>
                <div className="text-xs text-gray-400 space-y-1">
                  <div><span className="text-gray-500">Name:</span> {alertData.stateCode || "General"} {alertData.taxType || "Tax"} - {scope === "client" ? "Client" : scope === "office" ? "Office" : "Firm-wide"} Rule</div>
                  <div><span className="text-gray-500">Scope:</span> {scope.charAt(0).toUpperCase() + scope.slice(1)}</div>
                  <div><span className="text-gray-500">Status:</span> {scope === "client" ? "Active (immediate)" : "Pending Approval"}</div>
                </div>
              </CardBody>
            </Card>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="light"
            onPress={handleClose}
            className="text-gray-400"
            isDisabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSave}
            isLoading={isSaving}
            isDisabled={!rationale.trim()}
          >
            Save Doctrine Rule
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}


