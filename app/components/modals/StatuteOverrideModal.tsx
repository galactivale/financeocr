"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  Chip,
  Divider
} from "@nextui-org/react";
import {
  Scale,
  AlertTriangle,
  FileText,
  Calendar,
  Building2
} from "lucide-react";

interface StatuteOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: StatuteOverrideData) => Promise<void>;
  organizationId: string;
}

export interface StatuteOverrideData {
  stateCode: string;
  taxType: string;
  changeType: string;
  previousValue: any;
  newValue: any;
  effectiveDate: string;
  source: string;
  citation: string;
  notes: string;
}

const TAX_TYPES = [
  { value: "SALES_TAX", label: "Sales Tax" },
  { value: "INCOME_TAX", label: "Income Tax" },
  { value: "FRANCHISE_TAX", label: "Franchise Tax" },
  { value: "GROSS_RECEIPTS", label: "Gross Receipts Tax" },
  { value: "USE_TAX", label: "Use Tax" },
  { value: "PAYROLL_TAX", label: "Payroll Tax" }
];

const CHANGE_TYPES = [
  { value: "THRESHOLD_ADJUSTMENT", label: "Threshold Adjustment" },
  { value: "RATE_CHANGE", label: "Tax Rate Change" },
  { value: "NEW_STATUTE", label: "New Statute" },
  { value: "STATUTE_REPEAL", label: "Statute Repeal" },
  { value: "DEFINITION_CHANGE", label: "Definition Change" },
  { value: "FILING_REQUIREMENT", label: "Filing Requirement Change" },
  { value: "SAFE_HARBOR", label: "Safe Harbor Provision" }
];

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

export default function StatuteOverrideModal({
  isOpen,
  onClose,
  onSave,
  organizationId
}: StatuteOverrideModalProps) {
  const [formData, setFormData] = useState<StatuteOverrideData>({
    stateCode: "",
    taxType: "",
    changeType: "",
    previousValue: {},
    newValue: {},
    effectiveDate: "",
    source: "",
    citation: "",
    notes: ""
  });

  const [previousThreshold, setPreviousThreshold] = useState("");
  const [newThreshold, setNewThreshold] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    // Validation
    if (!formData.stateCode || !formData.taxType || !formData.changeType) {
      setError("Please fill in all required fields");
      return;
    }

    if (!formData.effectiveDate) {
      setError("Effective date is required");
      return;
    }

    setIsSaving(true);

    try {
      // Build value objects based on change type
      const previous: any = {};
      const newVal: any = {};

      if (formData.changeType === "THRESHOLD_ADJUSTMENT") {
        if (previousThreshold) {
          previous.threshold = parseFloat(previousThreshold);
        }
        if (newThreshold) {
          newVal.threshold = parseFloat(newThreshold);
        }
      }

      const overrideData: StatuteOverrideData = {
        ...formData,
        previousValue: previous,
        newValue: newVal
      };

      await onSave(overrideData);

      // Reset form
      setFormData({
        stateCode: "",
        taxType: "",
        changeType: "",
        previousValue: {},
        newValue: {},
        effectiveDate: "",
        source: "",
        citation: "",
        notes: ""
      });
      setPreviousThreshold("");
      setNewThreshold("");

      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save statute override");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      scrollBehavior="inside"
      classNames={{
        base: "bg-gray-800 border border-gray-700",
        header: "border-b border-gray-700",
        body: "py-6",
        footer: "border-t border-gray-700"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-3">
          <Scale className="w-6 h-6 text-blue-400" />
          <div>
            <h3 className="text-xl font-semibold text-white">
              Enter Statute Override
            </h3>
            <p className="text-sm text-gray-400 font-normal mt-1">
              Record firm guidance for statute changes
            </p>
          </div>
        </ModalHeader>

        <ModalBody className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="State"
              placeholder="Select state"
              selectedKeys={formData.stateCode ? [formData.stateCode] : []}
              onChange={(e) => setFormData({ ...formData, stateCode: e.target.value })}
              isRequired
              startContent={<Building2 className="w-4 h-4 text-gray-400" />}
            >
              {US_STATES.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </Select>

            <Select
              label="Tax Type"
              placeholder="Select tax type"
              selectedKeys={formData.taxType ? [formData.taxType] : []}
              onChange={(e) => setFormData({ ...formData, taxType: e.target.value })}
              isRequired
            >
              {TAX_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          <Select
            label="Change Type"
            placeholder="Select change type"
            selectedKeys={formData.changeType ? [formData.changeType] : []}
            onChange={(e) => setFormData({ ...formData, changeType: e.target.value })}
            isRequired
          >
            {CHANGE_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </Select>

          {formData.changeType === "THRESHOLD_ADJUSTMENT" && (
            <>
              <Divider className="bg-gray-700" />
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-white">Threshold Values</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    label="Previous Threshold"
                    placeholder="500000"
                    value={previousThreshold}
                    onChange={(e) => setPreviousThreshold(e.target.value)}
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-gray-400 text-sm">$</span>
                      </div>
                    }
                  />
                  <Input
                    type="number"
                    label="New Threshold"
                    placeholder="250000"
                    value={newThreshold}
                    onChange={(e) => setNewThreshold(e.target.value)}
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-gray-400 text-sm">$</span>
                      </div>
                    }
                    isRequired
                  />
                </div>
              </div>
              <Divider className="bg-gray-700" />
            </>
          )}

          <Input
            type="date"
            label="Effective Date"
            placeholder="Select date"
            value={formData.effectiveDate}
            onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
            isRequired
            startContent={<Calendar className="w-4 h-4 text-gray-400" />}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Source"
              placeholder="Bloomberg Alert, State Website, etc."
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              description="Where this change was discovered"
            />

            <Input
              label="Citation"
              placeholder="TX Tax Code §123.456"
              value={formData.citation}
              onChange={(e) => setFormData({ ...formData, citation: e.target.value })}
              startContent={<FileText className="w-4 h-4 text-gray-400" />}
              description="Legal citation reference"
            />
          </div>

          <Textarea
            label="Notes"
            placeholder="Additional details about this statute change..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            minRows={3}
            description="Internal notes about the change and its impact"
          />

          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-300">
                <p className="font-medium text-yellow-300 mb-1">Requires Partner Validation</p>
                <p>
                  This statute override will be marked as PENDING until validated by a managing partner.
                  It will not affect client memos until validated.
                </p>
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-between">
          <Button
            variant="light"
            onPress={onClose}
            isDisabled={isSaving}
            className="text-gray-400"
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={isSaving}
            startContent={!isSaving && <Scale className="w-4 h-4" />}
          >
            {isSaving ? "Saving..." : "Save Statute Override"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
