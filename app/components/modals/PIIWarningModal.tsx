"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  Divider,
  Card,
  CardBody
} from "@nextui-org/react";
import {
  AlertTriangle,
  Shield,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle
} from "lucide-react";

interface PIIDetection {
  byColumn: Record<string, {
    index: number;
    type: string;
    risk: string;
    sampleValues: string[];
  }>;
  byPattern: Record<string, Array<{
    column: string;
    columnIndex: number;
    row: number;
    value: string;
  }>>;
  severity: "NONE" | "LOW" | "MEDIUM" | "HIGH";
  totalIssues: number;
}

interface PIIWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  piiDetection: PIIDetection;
  onProceed: () => void;
  onAutoExclude: () => void;
}

export default function PIIWarningModal({
  isOpen,
  onClose,
  piiDetection,
  onProceed,
  onAutoExclude
}: PIIWarningModalProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "HIGH":
        return "danger";
      case "MEDIUM":
        return "warning";
      case "LOW":
        return "default";
      default:
        return "default";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "HIGH":
        return <XCircle className="w-6 h-6 text-red-400" />;
      case "MEDIUM":
        return <AlertTriangle className="w-6 h-6 text-yellow-400" />;
      case "LOW":
        return <Shield className="w-6 h-6 text-blue-400" />;
      default:
        return <Shield className="w-6 h-6 text-gray-400" />;
    }
  };

  const columnCount = Object.keys(piiDetection.byColumn || {}).length;
  const patternCount = Object.keys(piiDetection.byPattern || {}).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
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
          {getSeverityIcon(piiDetection.severity)}
          <div>
            <h3 className="text-xl font-semibold text-white">
              Potential PII Detected
            </h3>
            <p className="text-sm text-gray-400 font-normal mt-1">
              {piiDetection.severity} Risk - {piiDetection.totalIssues} issue(s) found
            </p>
          </div>
        </ModalHeader>

        <ModalBody>
          <Card className="bg-red-500/10 border border-red-500/30">
            <CardBody className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  <p className="font-medium text-white mb-2">
                    We detected {piiDetection.totalIssues} potential PII issue(s) in your data.
                  </p>
                  <p>
                    VaultCPA nexus analysis does not require personally identifiable information.
                    Including PII may violate privacy regulations and is unnecessary for tax compliance.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {columnCount > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-white flex items-center gap-2">
                <EyeOff className="w-4 h-4" />
                Columns with Potential PII ({columnCount})
              </h4>
              <div className="space-y-2">
                {Object.entries(piiDetection.byColumn).map(([column, info], idx) => (
                  <Card key={idx} className="bg-gray-700/30 border border-gray-600">
                    <CardBody className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-white">{column}</span>
                          <Chip
                            size="sm"
                            color={getSeverityColor(info.risk)}
                            variant="flat"
                          >
                            {info.risk} Risk
                          </Chip>
                        </div>
                        <Chip size="sm" variant="flat">
                          {info.type}
                        </Chip>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-gray-400">Sample values:</span>
                        {info.sampleValues.map((val, i) => (
                          <Chip key={i} size="sm" variant="flat" className="text-xs">
                            {val}
                          </Chip>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {patternCount > 0 && (
            <div className="space-y-3">
              <Divider className="bg-gray-700" />
              <h4 className="text-sm font-medium text-white flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Detected Patterns ({patternCount})
              </h4>
              <div className="space-y-2">
                {Object.entries(piiDetection.byPattern).map(([type, instances], idx) => (
                  <Card key={idx} className="bg-gray-700/30 border border-gray-600">
                    <CardBody className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white capitalize">
                          {type.replace(/_/g, " ")}
                        </span>
                        <Chip size="sm" color="warning" variant="flat">
                          {instances.length} instance(s)
                        </Chip>
                      </div>
                      <div className="text-xs text-gray-400">
                        Found in columns: {[...new Set(instances.map(i => i.column))].join(", ")}
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <Divider className="bg-gray-700" />

          <Card className="bg-blue-500/10 border border-blue-500/30">
            <CardBody className="p-4">
              <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Recommended Actions
              </h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>
                    <strong>Auto-Exclude PII Columns</strong> - We'll automatically remove detected PII columns from analysis
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>
                    <strong>Use Aggregated Data</strong> - Submit state-level totals instead of individual transactions
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>
                    <strong>Use Client IDs</strong> - Replace names with anonymized identifiers
                  </span>
                </li>
              </ul>
            </CardBody>
          </Card>
        </ModalBody>

        <ModalFooter className="flex justify-between">
          <Button
            variant="light"
            onPress={onClose}
            className="text-gray-400"
          >
            Cancel Upload
          </Button>
          <div className="flex gap-2">
            <Button
              variant="flat"
              onPress={() => {
                onProceed();
                onClose();
              }}
            >
              Proceed Anyway
            </Button>
            <Button
              color="primary"
              startContent={<Shield className="w-4 h-4" />}
              onPress={() => {
                onAutoExclude();
                onClose();
              }}
            >
              Auto-Exclude PII & Continue
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
