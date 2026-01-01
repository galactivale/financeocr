"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Progress
} from "@nextui-org/react";
import {
  FileCheck,
  Download,
  CheckCircle2,
  ArrowRight,
  Lock,
  Shield,
  AlertTriangle,
  Hash
} from "lucide-react";
import { sealMemo, verifyMemoIntegrity, logAuditAction, createNexusMemo } from "@/lib/api/critical-gaps";

interface MemosStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function MemosStep({ onNext, onBack }: MemosStepProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [memos, setMemos] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [memoId, setMemoId] = useState<string | null>(null);
  const [isSealed, setIsSealed] = useState(false);
  const [sealedHash, setSealedHash] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<any>(null);
  const [isSealing, setIsSealing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    generateMemos();
  }, []);

  const generateMemos = async () => {
    // Simulate memo generation
    const steps = [
      "Analyzing alerts...",
      "Generating executive summary...",
      "Creating state-by-state analysis...",
      "Compiling recommendations...",
      "Finalizing memo..."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(((i + 1) / steps.length) * 100);
    }

    // Load data from sessionStorage
    const alerts = JSON.parse(sessionStorage.getItem('nexusAlerts') || '[]');
    const uploadData = JSON.parse(sessionStorage.getItem('nexusUploadData') || '[]');
    const organizationId = sessionStorage.getItem('organizationId') || '';
    const clientId = sessionStorage.getItem('clientId') || '';

    const generatedMemos = {
      summary: `Generated ${alerts.length} alerts from ${uploadData.length} file(s)`,
      stateAnalysis: {},
      recommendations: alerts.map((a: any) => a.recommendation).filter(Boolean),
      doctrineMetadata: {
        appliedRules: alerts
          .filter((a: any) => a.appliedDoctrineRuleId)
          .map((a: any) => ({
            ruleId: a.appliedDoctrineRuleId,
            version: a.doctrineRuleVersion
          }))
      }
    };

    setMemos(generatedMemos);

    // GAP 6: Create nexus memo in database
    try {
      const memo = await createNexusMemo({
        organizationId,
        clientId,
        title: `Nexus Analysis - ${new Date().toLocaleDateString()}`,
        memoType: 'INITIAL',
        sections: {
          summary: generatedMemos.summary,
          alerts: alerts,
          stateAnalysis: generatedMemos.stateAnalysis
        },
        conclusion: generatedMemos.summary,
        recommendations: generatedMemos.recommendations,
        statuteVersions: generatedMemos.doctrineMetadata
      });

      setMemoId(memo.id);

      // GAP 3: Log memo generation
      await logAuditAction({
        action: 'MEMO_GENERATED',
        entity_type: 'MEMO',
        entity_id: memo.id,
        details: {
          alertsCount: alerts.length,
          filesProcessed: uploadData.length
        },
        severity: 'INFO',
        organizationId,
        memo_id: memo.id
      });

      console.log('[MEMOS] Memo created in database:', memo);
    } catch (error) {
      console.error('[MEMOS] Failed to create memo:', error);
    }

    setIsGenerating(false);
  };

  const handleSealMemo = async () => {
    if (!memoId) {
      alert('No memo to seal');
      return;
    }

    setIsSealing(true);
    try {
      const userId = sessionStorage.getItem('userId') || 'current-user';

      // GAP 4: Seal the memo with hash
      const result = await sealMemo(memoId, userId);

      setIsSealed(true);
      setSealedHash(result.hash);

      // GAP 3: Log seal action
      await logAuditAction({
        action: 'MEMO_SEALED',
        entity_type: 'MEMO',
        entity_id: memoId,
        details: {
          hash: result.hash,
          sealedAt: result.sealedAt
        },
        severity: 'INFO',
        memo_id: memoId
      });

      alert(`Memo sealed successfully! Hash: ${result.hash.substring(0, 16)}...`);
    } catch (error: any) {
      console.error('[MEMOS] Failed to seal memo:', error);
      alert(`Failed to seal memo: ${error.message}`);
    } finally {
      setIsSealing(false);
    }
  };

  const handleVerifyMemo = async () => {
    if (!memoId) {
      alert('No memo to verify');
      return;
    }

    setIsVerifying(true);
    try {
      // GAP 4: Verify memo integrity
      const result = await verifyMemoIntegrity(memoId);

      setVerificationStatus(result);

      // GAP 3: Log verification
      await logAuditAction({
        action: result.verified ? 'HASH_VERIFIED' : 'TAMPER_DETECTED',
        entity_type: 'MEMO',
        entity_id: memoId,
        details: {
          verified: result.verified,
          storedHash: result.storedHash,
          currentHash: result.currentHash
        },
        severity: result.verified ? 'INFO' : 'WARNING',
        memo_id: memoId
      });

      if (result.verified) {
        alert('✓ Memo integrity verified! Document has not been tampered with.');
      } else {
        alert('⚠️ TAMPER DETECTED! Document has been modified since sealing.');
      }
    } catch (error: any) {
      console.error('[MEMOS] Failed to verify memo:', error);
      alert(`Failed to verify memo: ${error.message}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDownload = () => {
    // TODO: Implement PDF/Word export
    alert('Memo download functionality coming soon');
  };

  const handleFinish = () => {
    onNext({ memos });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Memos Generation</h2>
        <p className="text-gray-400">Generating professional memos from your analysis</p>
      </div>

      {isGenerating ? (
        <Card className="bg-white/5 border border-white/10">
          <CardBody className="p-8">
            <div className="text-center space-y-4">
              <FileCheck className="w-16 h-16 text-blue-500 mx-auto animate-pulse" />
              <p className="text-white font-medium">Generating memos...</p>
              <Progress
                value={progress}
                className="max-w-md mx-auto"
                classNames={{
                  indicator: "bg-gradient-to-r from-blue-500 to-purple-500"
                }}
              />
              <p className="text-gray-400 text-sm">{Math.round(progress)}% complete</p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="bg-green-500/10 border border-green-500/30">
            <CardBody className="p-6">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-white font-medium text-lg">Memos Generated Successfully</p>
                  <p className="text-gray-400 text-sm">{memos?.summary}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/5 border border-white/10">
            <CardBody className="p-6">
              <h3 className="text-lg font-medium text-white mb-4">Memo Preview</h3>
              <div className="space-y-3 text-gray-300">
                <p>{memos?.summary}</p>
                {memos?.doctrineMetadata?.appliedRules?.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-sm font-medium text-blue-300 mb-2">
                      Applied Doctrine Rules: {memos.doctrineMetadata.appliedRules.length}
                    </p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* GAP 4: Document Hash & Seal Status */}
          {memoId && (
            <Card className={`border ${isSealed ? 'bg-green-500/10 border-green-500/30' : 'bg-blue-500/10 border-blue-500/30'}`}>
              <CardBody className="p-6">
                <div className="flex items-start gap-3">
                  {isSealed ? (
                    <Lock className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white mb-2">
                      {isSealed ? 'Memo Sealed' : 'Seal Memo for Integrity Protection'}
                    </h4>
                    {isSealed ? (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-300">
                          This memo has been sealed with a cryptographic hash and is now read-only.
                        </p>
                        {sealedHash && (
                          <div className="p-3 bg-black/30 rounded-lg font-mono text-xs text-gray-300 break-all">
                            <div className="flex items-center gap-2 mb-1">
                              <Hash className="w-3 h-3 text-green-400" />
                              <span className="text-green-400 font-medium">Document Hash (SHA-256)</span>
                            </div>
                            {sealedHash}
                          </div>
                        )}
                        {verificationStatus && (
                          <div className={`p-3 rounded-lg ${verificationStatus.verified ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                            <div className="flex items-center gap-2">
                              {verificationStatus.verified ? (
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-red-400" />
                              )}
                              <span className={`text-sm font-medium ${verificationStatus.verified ? 'text-green-300' : 'text-red-300'}`}>
                                {verificationStatus.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              Last verified: {new Date(verificationStatus.verificationTimestamp).toLocaleString()}
                            </p>
                          </div>
                        )}
                        <Button
                          size="sm"
                          variant="flat"
                          color="success"
                          startContent={<Shield className="w-4 h-4" />}
                          onPress={handleVerifyMemo}
                          isLoading={isVerifying}
                        >
                          {isVerifying ? 'Verifying...' : 'Verify Integrity'}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-300">
                          Sealing the memo will generate a cryptographic hash and make it read-only.
                          This ensures the document cannot be altered and provides tamper detection.
                        </p>
                        <Button
                          color="primary"
                          startContent={<Lock className="w-4 h-4" />}
                          onPress={handleSealMemo}
                          isLoading={isSealing}
                        >
                          {isSealing ? 'Sealing...' : 'Seal Memo'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          <div className="flex space-x-3">
            <Button
              variant="flat"
              startContent={<Download className="w-4 h-4" />}
              onPress={handleDownload}
            >
              Download PDF
            </Button>
            <Button
              variant="flat"
              startContent={<Download className="w-4 h-4" />}
              onPress={handleDownload}
            >
              Download Word
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="light" onPress={onBack} className="text-gray-400">
          Back
        </Button>
        <Button
          color="primary"
          onPress={handleFinish}
          isDisabled={isGenerating}
          endContent={<ArrowRight className="w-4 h-4" />}
        >
          Finish
        </Button>
      </div>
    </div>
  );
}


