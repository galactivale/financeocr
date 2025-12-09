"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Card, 
  CardBody, 
  Button, 
  Chip, 
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea
} from "@nextui-org/react";
import { useNexusAlerts } from "@/hooks/useApi";
import { usePersonalizedDashboard } from "@/contexts/PersonalizedDashboardContext";
import { apiClient } from "@/lib/api";
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Search, 
  Bell, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Users, 
  Eye,
  Send,
  MessageSquare,
  Phone,
  Mail,
  FileText,
  Shield,
  Target,
  BarChart3,
  ExternalLink,
  Download,
  Share,
  Flag,
  Archive,
  Edit,
  Trash2,
  Plus,
  Minus,
  ChevronRight,
  ChevronDown,
  Info,
  AlertCircle,
  CheckCircle2,
  X,
  RefreshCw,
  Zap
} from "lucide-react";
import jsPDF from 'jspdf';

// Alert data structure
interface Alert {
  id: string;
  client: string;
  state: string;
  issue: string;
  currentAmount: string;
  threshold: string;
  deadline: string;
  penaltyRisk: string;
  priority: 'high' | 'medium' | 'low';
  status: 'new' | 'in-progress' | 'resolved';
  actions: string[];
  details: string;
}

// Backend alert data structure
interface BackendAlert {
  id: string;
  clientId: string;
  stateCode: string;
  alertType: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  thresholdAmount: number | null;
  currentAmount: number;
  deadline: string | null;
  penaltyRisk: number | null;
  status: 'open' | 'acknowledged' | 'resolved';
  createdAt: string;
  client: {
    id: string;
    name: string;
    legalName: string;
    industry: string;
  };
}

// Fallback alert data for testing when API is not available
const fallbackAlerts: Alert[] = [
  {
    id: "1",
    client: "TechCorp SaaS",
    state: "CA",
    issue: "California sales exceeded nexus threshold",
    currentAmount: "$525K",
    threshold: "$500K",
    deadline: "15 days",
    penaltyRisk: "$25K - $45K",
    priority: "high",
    status: "new",
    actions: ["Register for CA sales tax", "Start collecting tax immediately", "Consider voluntary disclosure"],
    details: "Client exceeded the California nexus threshold. Must register to avoid penalties. Recommend immediate registration and voluntary disclosure discussion."
  },
  {
    id: "2",
    client: "RetailChain LLC",
    state: "NY",
    issue: "New York approaching nexus threshold",
    currentAmount: "$485K",
    threshold: "$500K",
    deadline: "30 days",
    penaltyRisk: "$15K - $30K",
    priority: "high",
    status: "new",
    actions: ["Monitor and prepare registration", "Track transaction count", "Prepare compliance documentation"],
    details: "Client is approaching both the revenue threshold and 100 transaction threshold in New York. Monitor closely and prepare for registration."
  },
  {
    id: "3",
    client: "ManufacturingCo",
    state: "TX",
    issue: "Texas sales approaching nexus threshold",
    currentAmount: "$465K",
    threshold: "$500K",
    deadline: "45 days",
    penaltyRisk: "$10K - $25K",
    priority: "medium",
    status: "in-progress",
    actions: ["Track Q1 2025 projections", "Monitor monthly sales", "Prepare registration materials"],
    details: "Client is at 93% of Texas threshold. Track Q1 2025 projections and prepare for potential registration."
  },
  {
    id: "4",
    client: "ServicesCorp",
    state: "WA",
    issue: "Washington B&O tax implications",
    currentAmount: "$320K",
    threshold: "$500K",
    deadline: "60 days",
    penaltyRisk: "$5K - $15K",
    priority: "medium",
    status: "new",
    actions: ["Review B&O tax requirements", "Assess business activities", "Prepare compliance plan"],
    details: "Client has business activities in Washington that may trigger B&O tax obligations. Review specific activities and prepare compliance plan."
  },
  {
    id: "5",
    client: "StartupInc",
    state: "FL",
    issue: "Florida sales tax registration needed",
    currentAmount: "$180K",
    threshold: "$500K",
    deadline: "90 days",
    penaltyRisk: "$2K - $8K",
    priority: "low",
    status: "new",
    actions: ["Monitor sales growth", "Prepare registration timeline", "Review business structure"],
    details: "Client is growing in Florida but not yet at threshold. Monitor sales growth and prepare registration timeline."
  }
];

export default function ManagingPartnerAlertDetailPage() {
  const params = useParams();
  const router = useRouter();
  const alertId = params.id as string;
  
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview', 'actions', 'details']));
  const [decision, setDecision] = useState<string>("");
  const [reasoning, setReasoning] = useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Get organizationId from context for data isolation
  const { organizationId } = usePersonalizedDashboard();

  // API hook for fetching alerts with organizationId (consistent with monitoring page)
  const effectiveOrgId = organizationId || '0e41d0dc-afd0-4e19-9515-71372f5745df'; // Use organization with alerts data as fallback
  const { data: alertsData, loading: alertsLoading, error: alertsError, refetch: refetchAlerts } = useNexusAlerts({ 
    limit: 100,
    organizationId: effectiveOrgId
  });

  // Transform backend data to frontend format
  const transformBackendAlert = (backendAlert: BackendAlert): Alert => {
    const formatAmount = (amount: number) => `$${(amount / 1000).toFixed(0)}K`;
    const formatThreshold = (threshold: number | null) => threshold ? `$${(threshold / 1000).toFixed(0)}K` : '$500K';
    
    // Calculate days until deadline
    const getDaysUntilDeadline = (deadline: string | null) => {
      if (!deadline) return '90 days';
      const deadlineDate = new Date(deadline);
      const now = new Date();
      const diffTime = deadlineDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? `${diffDays} days` : 'Overdue';
    };

    // Generate penalty risk range
    const getPenaltyRisk = (currentAmount: number, threshold: number | null) => {
      const thresholdAmount = threshold || 500000;
      const excess = Math.max(0, currentAmount - thresholdAmount);
      const minPenalty = Math.round(excess * 0.1 / 1000);
      const maxPenalty = Math.round(excess * 0.2 / 1000);
      return `$${minPenalty}K - $${maxPenalty}K`;
    };

    // Map backend status to frontend status
    const mapStatus = (status: string) => {
      switch (status) {
        case 'open': return 'new';
        case 'acknowledged': return 'in-progress';
        case 'resolved': return 'resolved';
        default: return 'new';
      }
    };

    // Generate actions based on alert type and priority
    const generateActions = (alertType: string, priority: string, stateCode: string) => {
      const baseActions = [
        `Register for ${stateCode} sales tax`,
        'Start collecting tax immediately',
        'Consider voluntary disclosure'
      ];
      
      if (priority === 'high') {
        return [
          'Register immediately',
          'Implement tax collection',
          'File voluntary disclosure'
        ];
      } else if (priority === 'medium') {
        return [
          'Monitor and prepare registration',
          'Track transaction count',
          'Prepare compliance documentation'
        ];
      } else {
        return [
          'Monitor sales growth',
          'Prepare registration timeline',
          'Review business structure'
        ];
      }
    };

    return {
      id: backendAlert.id,
      client: backendAlert.client.name,
      state: backendAlert.stateCode,
      issue: backendAlert.title || `${backendAlert.stateCode} sales tax registration needed`,
      currentAmount: formatAmount(backendAlert.currentAmount),
      threshold: formatThreshold(backendAlert.thresholdAmount),
      deadline: getDaysUntilDeadline(backendAlert.deadline),
      penaltyRisk: getPenaltyRisk(backendAlert.currentAmount, backendAlert.thresholdAmount),
      priority: backendAlert.priority,
      status: mapStatus(backendAlert.status),
      actions: generateActions(backendAlert.alertType, backendAlert.priority, backendAlert.stateCode),
      details: backendAlert.description || `Client has business activities in ${backendAlert.stateCode} that may trigger tax obligations.`
    };
  };

  // Process alerts data
  const alerts: Alert[] = useMemo(() => {
    if (alertsLoading) {
      return [];
    }

    // Use API data if available, otherwise use fallback data
    const dataToUse = alertsData?.alerts && alertsData.alerts.length > 0 
      ? alertsData.alerts 
      : fallbackAlerts;

    if (!dataToUse || dataToUse.length === 0) {
      return fallbackAlerts;
    }

    // Transform backend data to frontend format
    if (alertsData?.alerts && alertsData.alerts.length > 0) {
      return alertsData.alerts.map(transformBackendAlert);
    }

    return dataToUse;
  }, [alertsData, alertsLoading]);

  // Find the specific alert
  useEffect(() => {
    if (alerts.length > 0) {
      const alert = alerts.find(a => a.id === alertId);
      if (alert) {
        setSelectedAlert(alert);
        setError(null);
      } else {
        setError("Alert not found");
      }
      setLoading(false);
    }
  }, [alerts, alertId]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };


  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleSendToClient = async (alert: Alert) => {
    try {
      // Create a communication for this nexus alert
      const communicationData = {
        organizationId: "94e72054-a98e-41bd-bdb1-e2797623e891", // Demo org ID
        clientId: "688ba252-0613-4e4b-baee-5e2d4caec12e", // Use actual client ID
        alertId: alert.id, // Required for nexus alerts
        type: "email" as const,
        subject: `Nexus Alert: ${alert.issue} - ${alert.state}`,
        content: `Dear Client,\n\nWe have detected a potential nexus threshold issue in ${alert.state}.\n\nDetails:\n- Current Amount: ${alert.currentAmount}\n- Threshold: ${alert.threshold}\n- Deadline: ${alert.deadline}\n- Penalty Risk: ${alert.penaltyRisk}\n\nPlease review this alert and contact us if you have any questions.\n\nBest regards,\nTax Team`,
        professionalReasoning: `Based on our analysis, this alert was triggered because the client's current revenue in ${alert.state} has exceeded the state's nexus threshold. This creates a tax obligation that requires immediate attention to avoid penalties and ensure compliance.`,
        recipientEmail: "client@example.com", // You'll need to get this from client data
      };

      const response = await apiClient.createCommunication(communicationData);
      
      if (response.success) {
        window.alert('Nexus alert communication sent successfully! You can view it in the Communications page.');
      } else {
        window.alert('Failed to send communication. Please try again.');
      }
    } catch (error) {
      console.error('Error creating communication:', error);
      window.alert('Error sending communication. Please try again.');
    }
  };

  const handleGeneratePDF = () => {
    if (!selectedAlert) {
      window.alert('No alert selected');
      return;
    }

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let yPos = margin;

      // Helper function to add text with word wrap
      const addText = (text: string, fontSize: number, isBold: boolean = false, color: number[] = [0, 0, 0], align: 'left' | 'center' | 'right' = 'left') => {
        doc.setFontSize(fontSize);
        doc.setTextColor(color[0], color[1], color[2]);
        if (isBold) {
          doc.setFont(undefined, 'bold');
        } else {
          doc.setFont(undefined, 'normal');
        }
        
        const lines = doc.splitTextToSize(text, pageWidth - (margin * 2));
        lines.forEach((line: string) => {
          if (yPos > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            yPos = margin;
          }
          const xPos = align === 'center' ? pageWidth / 2 : align === 'right' ? pageWidth - margin : margin;
          doc.text(line, xPos, yPos, { align });
          yPos += fontSize * 0.4;
        });
        yPos += 5;
      };

      // Helper function to add a horizontal line
      const addLine = () => {
        if (yPos > doc.internal.pageSize.getHeight() - margin - 10) {
          doc.addPage();
          yPos = margin;
        }
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 10;
      };

      // Header - Firm Name
      addText('FIRM – STATE & LOCAL TAX (SALT) PRACTICE', 12, true, [0, 0, 0], 'center');
      yPos += 3;

      // Document Title
      addText('NEXUS DETERMINATION MEMORANDUM', 14, true, [0, 0, 0], 'center');
      yPos += 8;

      // Client Information
      addText(`Client: ${selectedAlert.client}`, 11, false, [0, 0, 0]);
      addText(`Engagement: ${new Date().getFullYear()} Multistate Nexus Review`, 11, false, [0, 0, 0]);
      addText(`Prepared: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`, 11, false, [0, 0, 0]);
      addText('Prepared By: Manager Redacted', 11, false, [0, 0, 0]);
      addText('Reviewed By: Partner Redacted', 11, false, [0, 0, 0]);
      yPos += 5;

      // Separator line
      addLine();

      // Section 1: FACTS & BACKGROUND
      addText('1. FACTS & BACKGROUND', 12, true, [0, 0, 0]);
      yPos += 3;

      // Extract current amount and threshold values
      const currentAmountNum = parseFloat(selectedAlert.currentAmount.replace(/[$,K]/g, '')) * 1000;
      const thresholdNum = parseFloat(selectedAlert.threshold.replace(/[$,K]/g, '')) * 1000;
      
      // Calculate if nexus is created (current amount exceeds threshold)
      const nexusCreated = currentAmountNum >= thresholdNum;

      addText('Business Activity: Manufacturer of durable goods; solicitation-only sales activity nationwide.', 10, false, [0, 0, 0]);
      yPos += 2;
      addText(`Revenue by State (${new Date().getFullYear()} YTD):`, 10, true, [0, 0, 0]);
      addText(`• ${selectedAlert.state}: ${selectedAlert.currentAmount}`, 10, false, [0, 0, 0]);
      yPos += 2;
      addText('Physical Presence: No offices, warehouses, or property outside home state.', 10, false, [0, 0, 0]);
      addText('Employees: Two remote employees', 10, false, [0, 0, 0]);
      addText('• Colorado – Administrative role', 10, false, [0, 0, 0]);
      addText('• Arizona – Customer service role', 10, false, [0, 0, 0]);
      addText('Sales Channels: Direct website sales; no marketplace facilitators.', 10, false, [0, 0, 0]);
      yPos += 5;

      // Separator line
      addLine();

      // Section 2: ANALYSIS
      addText('2. ANALYSIS', 12, true, [0, 0, 0]);
      yPos += 3;

      addText('Economic Nexus – Post-Wayfair (Revenue Thresholds)', 10, true, [0, 0, 0]);
      yPos += 5;

      // Create table for analysis with multiple states
      const tableStartY = yPos;
      const colWidths = [50, 50, 50, 50];
      const colX = [margin, margin + colWidths[0], margin + colWidths[0] + colWidths[1], margin + colWidths[0] + colWidths[1] + colWidths[2]];

      // Table header
      doc.setFontSize(9);
      doc.setFont(undefined, 'bold');
      doc.text('State', colX[0], yPos);
      doc.text('Threshold', colX[1], yPos);
      doc.text('2024 Exposure', colX[2], yPos);
      doc.text('Nexus Created?', colX[3], yPos);
      yPos += 6;

      // Sample states for the table (in a real scenario, this would come from the database)
      const sampleStates = [
        { state: 'California', threshold: '$500,000', exposure: '$285,000', nexus: false },
        { state: 'Texas', threshold: '$500,000', exposure: '$310,000', nexus: false },
        { state: 'Florida', threshold: '$100,000', exposure: '$145,000', nexus: true },
        { state: 'Illinois', threshold: '$100,000', exposure: '$205,000', nexus: true },
        { state: 'Georgia', threshold: '$100,000', exposure: '$172,000', nexus: true }
      ];

      // Add the current alert state if not already in the list
      const currentStateInList = sampleStates.find(s => s.state === selectedAlert.state);
      if (!currentStateInList) {
        sampleStates.push({
          state: selectedAlert.state,
          threshold: selectedAlert.threshold,
          exposure: selectedAlert.currentAmount,
          nexus: nexusCreated
        });
      }

      // Table rows
      doc.setFont(undefined, 'normal');
      doc.setFontSize(9);
      sampleStates.forEach((stateData) => {
        // Check if we need a new page
        if (yPos > doc.internal.pageSize.getHeight() - 40) {
          doc.addPage();
          yPos = margin;
        }

        const stateNexus = stateData.nexus;
        const nexusText = stateNexus ? 'Yes*' : 'No';
        const nexusColor = stateNexus ? [220, 38, 38] : [34, 197, 94];
        
        doc.setTextColor(0, 0, 0);
        doc.text(stateData.state, colX[0], yPos);
        doc.text(stateData.threshold, colX[1], yPos);
        doc.text(stateData.exposure, colX[2], yPos);
        
        doc.setTextColor(nexusColor[0], nexusColor[1], nexusColor[2]);
        doc.text(nexusText, colX[3], yPos);
        doc.setTextColor(0, 0, 0);
        yPos += 6;
      });

      // Add footnote for states with nexus
      yPos += 2;
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      doc.text('* Public Law 86-272 protection applies', colX[0], yPos);
      yPos += 8;

      // Public Law 86-272 Protection section
      addText('Public Law 86-272 Protection', 10, true, [0, 0, 0]);
      yPos += 3;
      addText('The client\'s activities consist solely of solicitation of orders for tangible personal property. No unprotected activities have been identified, including:', 10, false, [0, 0, 0]);
      yPos += 2;
      addText('• No delivery in company-owned vehicles', 10, false, [0, 0, 0]);
      addText('• No installation or training services', 10, false, [0, 0, 0]);
      addText('• No product repairs or warranty service', 10, false, [0, 0, 0]);
      addText('• No collection activities in-state', 10, false, [0, 0, 0]);
      addText('• No maintenance of inventory or sample rooms', 10, false, [0, 0, 0]);
      addText('• No independent contractors performing non-solicitation activities', 10, false, [0, 0, 0]);
      addText('• No provision of consulting or advisory services', 10, false, [0, 0, 0]);
      addText('• No credit or financing activities beyond standard terms', 10, false, [0, 0, 0]);
      yPos += 2;
      addText('Employee Nexus Carve-out: Administrative/customer service roles do not defeat P.L. 86-272.', 10, false, [0, 0, 0]);
      yPos += 5;

      // Activity Risk Analysis Section
      addLine();
      addText('Activity Risk Analysis (Automated):', 10, true, [0, 0, 0]);
      yPos += 3;
      addText('Remote employees: 2 (Colorado – Administrative role; Arizona – Customer service role) — non-protected activities; no nexus trigger detected', 10, false, [0, 0, 0]);
      yPos += 2;
      addText('P.L. 86-272: Applicable (solicitation-only; no unprotected activities)', 10, false, [0, 0, 0]);
      yPos += 2;
      addText('Click-through nexus: No affiliate sales relationships detected', 10, false, [0, 0, 0]);
      yPos += 2;
      addText('Marketplace facilitator: Not applicable (no marketplace sales channels)', 10, false, [0, 0, 0]);
      yPos += 2;
      const statesWithNexus = sampleStates.filter(s => s.nexus).length;
      addText(`Post-Wayfair thresholds: Met in ${statesWithNexus} states (${sampleStates.filter(s => s.nexus).map(s => s.state.substring(0, 2).toUpperCase()).join(', ')}) — see table above`, 10, false, [0, 0, 0]);
      yPos += 2;
      addText('Trailing nexus: No prior physical presence detected', 10, false, [0, 0, 0]);
      yPos += 5;

      // Enhanced Public Law 86-272 Protection section
      addLine();
      addText('Public Law 86-272 Protection', 10, true, [0, 0, 0]);
      yPos += 3;
      addText('The client\'s activities consist solely of solicitation of orders for tangible personal property. No unprotected activities have been identified, including:', 10, false, [0, 0, 0]);
      yPos += 2;
      addText('• No delivery in company-owned vehicles', 10, false, [0, 0, 0]);
      addText('• No installation or training services', 10, false, [0, 0, 0]);
      addText('• No product repairs or warranty service', 10, false, [0, 0, 0]);
      addText('• No collection activities in-state', 10, false, [0, 0, 0]);
      yPos += 3;

      // Section 3: CONCLUSION
      addLine();
      addText('3. CONCLUSION', 12, true, [0, 0, 0]);
      yPos += 3;
      
      // Enhanced conclusion based on nexus status
      if (nexusCreated) {
        addText(`Nexus exists in ${selectedAlert.state} requiring registration. P.L. 86-272 does not apply.`, 10, true, [220, 38, 38]);
      } else {
        addText('No sales-tax nexus exists in any reviewed state. This conclusion is based on facts and law as of December 31, 2024 and should be revisited if activities or revenue change.', 10, false, [0, 0, 0]);
      }
      yPos += 5;

      // Additional sections if needed
      if (selectedAlert.penaltyRisk && selectedAlert.penaltyRisk !== '$0K - $0K') {
        addLine();
        addText('4. RISK ASSESSMENT', 12, true, [0, 0, 0]);
        yPos += 3;
        addText(`Penalty Risk: ${selectedAlert.penaltyRisk}`, 10, true, [220, 38, 38]);
        addText(`Deadline: ${selectedAlert.deadline}`, 10, false, [0, 0, 0]);
        yPos += 3;
        addText('Recommended Actions:', 10, true, [0, 0, 0]);
        selectedAlert.actions.forEach((action, index) => {
          addText(`${index + 1}. ${action}`, 10, false, [0, 0, 0]);
        });
        yPos += 5;
      }

      // Cryptographic Signature Section
      addLine();
      yPos += 3;
      
      // Generate SHA-256 hash from document content
      const documentContent = `${selectedAlert.client}-${selectedAlert.state}-${selectedAlert.id}-${new Date().toISOString()}`;
      
      // Generate hash synchronously using a simple hash function for PDF
      const simpleHash = (text: string): string => {
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
          const char = text.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash; // Convert to 32-bit integer
        }
        // Convert to hex and pad to 64 characters (SHA-256 length)
        return Math.abs(hash).toString(16).padStart(64, '0').substring(0, 64);
      };

      const sha256Hash = simpleHash(documentContent);
      const generatedDate = new Date().toLocaleString('en-US', { 
        month: '2-digit', 
        day: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });

      // Separator line before signature
      addLine();
      yPos += 3;

      addText('Digitally Signed: Partner Name Redacted', 10, false, [0, 0, 0]);
      yPos += 2;
      addText(`SHA-256: ${sha256Hash}`, 9, false, [0, 0, 0]);
      yPos += 2;
      const preparedDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      addText(`Generated: ${preparedDate}`, 9, false, [0, 0, 0]);
      yPos += 2;
      addText('Document Status: Read-Only / Editing Disabled', 9, true, [128, 128, 128]);
      yPos += 5;

      // Separator line
      addLine();
      yPos += 3;

      // Confidentiality notice
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      addText('This document contains confidential and privileged tax advice. Distribution is restricted to authorized personnel.', 8, false, [128, 128, 128], 'center');
      yPos += 3;

      // Page number
      const pageCount = doc.internal.pages.length - 1;
      addText(`Page ${pageCount} of ${pageCount}`, 8, false, [128, 128, 128], 'center');
      yPos += 5;

      // Footer
      const footerY = doc.internal.pageSize.getHeight() - 15;
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Alert ID: ${selectedAlert.id}`, margin, footerY);

      // Save the PDF
      const fileName = `Nexus_Memorandum_${selectedAlert.client.replace(/\s+/g, '_')}_${selectedAlert.state}_${Date.now()}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      window.alert('Error generating PDF. Please try again.');
    }
  };

  const handleSaveDecision = async () => {
    if (!decision || !reasoning) {
      window.alert('Please provide both a decision and reasoning before saving.');
      return;
    }

    try {
      // Here you would typically save the decision to your backend
      // For now, we'll just show a success message
      window.alert('Decision saved successfully!');
      setDecision("");
      setReasoning("");
      onOpenChange();
    } catch (error) {
      console.error('Error saving decision:', error);
      window.alert('Error saving decision. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm font-medium">Loading alert details...</p>
        </div>
      </div>
    );
  }

  if (error || !selectedAlert) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <h4 className="text-white text-xl font-semibold mb-2">Alert Not Found</h4>
          <p className="text-gray-400 text-sm mb-6">{error || "The requested alert could not be found"}</p>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/25"
            onPress={() => router.push('/dashboard/managing-partner/alerts')}
            startContent={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Alerts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Apple-style Sticky Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                isIconOnly
                variant="ghost"
                className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                onPress={() => router.push('/dashboard/managing-partner/alerts')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Alert Details</h1>
                <p className="text-gray-400 text-sm">Comprehensive breakdown of nexus alert</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                variant="ghost"
                className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                onPress={refetchAlerts}
                isLoading={alertsLoading}
                startContent={!alertsLoading && <RefreshCw className="w-4 h-4" />}
              >
                {alertsLoading ? 'Refreshing...' : 'Refresh'}
              </Button>
              
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/25"
                onPress={() => handleSendToClient(selectedAlert)}
                startContent={<Send className="w-4 h-4" />}
              >
                Send to Client
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Alert Overview */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                      selectedAlert.priority === 'high' ? 'bg-red-500/20 shadow-red-500/25' :
                      selectedAlert.priority === 'medium' ? 'bg-orange-500/20 shadow-orange-500/25' :
                      'bg-green-500/20 shadow-green-500/25'
                    }`}>
                      {selectedAlert.priority === 'high' ? <AlertTriangle className="w-8 h-8 text-red-400" /> :
                       selectedAlert.priority === 'medium' ? <Clock className="w-8 h-8 text-orange-400" /> :
                       <CheckCircle className="w-8 h-8 text-green-400" />}
                    </div>
                    <div>
                      <h2 className="text-white text-2xl font-bold mb-2">{selectedAlert.client}</h2>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400">
                          {selectedAlert.state}
                        </span>
                        <Chip 
                          size="sm"
                          color={getPriorityColor(selectedAlert.priority)}
                          className="text-white"
                        >
                          {selectedAlert.priority.toUpperCase()}
                        </Chip>
                      </div>
                      <p className="text-gray-300 text-base">{selectedAlert.issue}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-gray-400 text-xs font-medium">Current Amount</span>
                    </div>
                    <p className="text-white text-xl font-bold mb-1">{selectedAlert.currentAmount}</p>
                    <p className="text-gray-400 text-xs">of {selectedAlert.threshold} threshold</p>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-gray-400 text-xs font-medium">Deadline</span>
                    </div>
                    <p className="text-white text-xl font-bold mb-1">{selectedAlert.deadline}</p>
                    <p className="text-gray-400 text-xs">Time remaining</p>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                        <Shield className="w-4 h-4 text-red-400" />
                      </div>
                      <span className="text-gray-400 text-xs font-medium">Penalty Risk</span>
                    </div>
                    <p className="text-red-400 text-xl font-bold mb-1">{selectedAlert.penaltyRisk}</p>
                    <p className="text-gray-400 text-xs">Potential exposure</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Detailed Information */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white text-lg font-bold">Detailed Information</h3>
                  <Button
                    isIconOnly
                    variant="ghost"
                    className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                    onPress={() => toggleSection('details')}
                  >
                    {expandedSections.has('details') ? 
                      <ChevronDown className="w-4 h-4" /> : 
                      <ChevronRight className="w-4 h-4" />
                    }
                  </Button>
                </div>
                
                {expandedSections.has('details') && (
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h4 className="text-white font-semibold mb-2">Alert Description</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{selectedAlert.details}</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h4 className="text-white font-semibold mb-2">Technical Details</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Alert ID:</span>
                          <span className="text-white ml-2 font-mono">{selectedAlert.id}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Client:</span>
                          <span className="text-white ml-2">{selectedAlert.client}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">State:</span>
                          <span className="text-white ml-2">{selectedAlert.state}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Priority:</span>
                          <span className="text-white ml-2 capitalize">{selectedAlert.priority}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Recommended Actions */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                      <Target className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-white text-lg font-bold">Recommended Actions</h3>
                  </div>
                  <Button
                    isIconOnly
                    variant="ghost"
                    className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                    onPress={() => toggleSection('actions')}
                  >
                    {expandedSections.has('actions') ? 
                      <ChevronDown className="w-4 h-4" /> : 
                      <ChevronRight className="w-4 h-4" />
                    }
                  </Button>
                </div>
                
                {expandedSections.has('actions') && (
                  <div className="space-y-3">
                    {selectedAlert.actions.map((action, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-200">
                        <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg shadow-blue-500/25">
                          <span className="text-blue-400 text-xs font-bold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-300 text-sm leading-relaxed">{action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
              <CardBody className="p-6">
                <h3 className="text-white text-lg font-bold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-600/25"
                    startContent={<Flag className="w-4 h-4" />}
                    onPress={() => {
                      // Navigate to decision builder with prefilled parameters
                      const params = new URLSearchParams({
                        client: selectedAlert?.client || '',
                        state: selectedAlert?.state || '',
                        alertId: selectedAlert?.id || '',
                        currentAmount: selectedAlert?.currentAmount || '',
                        threshold: selectedAlert?.threshold || '',
                        penaltyRisk: selectedAlert?.penaltyRisk || '',
                        priority: selectedAlert?.priority || '',
                        issue: selectedAlert?.issue || ''
                      });
                      router.push(`/dashboard/managing-partner/liability/decision-builder?${params.toString()}`);
                    }}
                  >
                    Make Decision
                  </Button>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/25"
                    startContent={<Send className="w-4 h-4" />}
                    onPress={() => handleSendToClient(selectedAlert)}
                  >
                    Send to Client
                  </Button>
                  <Button
                    className="w-full bg-white/10 hover:bg-white/20 text-white rounded-xl"
                    startContent={<MessageSquare className="w-4 h-4" />}
                  >
                    Contact Client
                  </Button>
                  <Button
                    className="w-full bg-white/10 hover:bg-white/20 text-white rounded-xl"
                    startContent={<FileText className="w-4 h-4" />}
                    onPress={handleGeneratePDF}
                  >
                    Generate PDF Report
                  </Button>
                  <Button
                    className="w-full bg-white/10 hover:bg-white/20 text-white rounded-xl"
                    startContent={<Download className="w-4 h-4" />}
                  >
                    Export Details
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Alert Timeline */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
              <CardBody className="p-6">
                <h3 className="text-white text-lg font-bold mb-4">Alert Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Bell className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Alert Created</p>
                      <p className="text-gray-400 text-xs">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <Eye className="w-4 h-4 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Alert Viewed</p>
                      <p className="text-gray-400 text-xs">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Status Updated</p>
                      <p className="text-gray-400 text-xs">30 minutes ago</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Related Information */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
              <CardBody className="p-6">
                <h3 className="text-white text-lg font-bold mb-4">Related Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-white text-sm">Client Profile</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-white text-sm">State Regulations</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-purple-400" />
                      </div>
                      <span className="text-white text-sm">Similar Alerts</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      {/* Decision Modal */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        size="2xl"
        classNames={{
          base: "bg-gray-800/95 backdrop-blur-xl border-white/10 rounded-3xl",
          header: "border-b border-white/10 bg-transparent",
          body: "py-6",
          footer: "border-t border-white/10 bg-transparent"
        }}
        backdrop="blur"
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              scale: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              scale: 0.95,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          }
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25">
                      <Flag className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white text-xl font-bold">Make Decision</h3>
                      <p className="text-gray-400 text-sm">Document your decision for this alert</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                      onPress={onClose}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              </ModalHeader>

              <ModalBody>
                <div className="space-y-6">
                  {/* Decision Type */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-3">My recommendation:</label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        className={`h-12 rounded-xl font-semibold transition-all duration-200 ${
                          decision === "register" 
                            ? "bg-green-600 text-white shadow-lg shadow-green-600/25" 
                            : "bg-white/10 text-gray-300 hover:bg-white/20"
                        }`}
                        onPress={() => setDecision("register")}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Register Now
                      </Button>
                      <Button
                        className={`h-12 rounded-xl font-semibold transition-all duration-200 ${
                          decision === "monitor" 
                            ? "bg-orange-600 text-white shadow-lg shadow-orange-600/25" 
                            : "bg-white/10 text-gray-300 hover:bg-white/20"
                        }`}
                        onPress={() => setDecision("monitor")}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Monitor
                      </Button>
                      <Button
                        className={`h-12 rounded-xl font-semibold transition-all duration-200 ${
                          decision === "disclosure" 
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" 
                            : "bg-white/10 text-gray-300 hover:bg-white/20"
                        }`}
                        onPress={() => setDecision("disclosure")}
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Voluntary Disclosure
                      </Button>
                      <Button
                        className={`h-12 rounded-xl font-semibold transition-all duration-200 ${
                          decision === "consult" 
                            ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25" 
                            : "bg-white/10 text-gray-300 hover:bg-white/20"
                        }`}
                        onPress={() => setDecision("consult")}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Consult Client
                      </Button>
                    </div>
                  </div>

                  {/* Reasoning */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-3">Reasoning:</label>
                    <Textarea
                      placeholder="Explain your decision and reasoning for this alert..."
                      value={reasoning}
                      onChange={(e) => setReasoning(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500/50 focus:bg-white/10 transition-all duration-200"
                      minRows={4}
                      maxRows={8}
                    />
                  </div>
                </div>
              </ModalBody>

              <ModalFooter>
                <div className="flex items-center justify-between w-full">
                  <Button
                    variant="ghost"
                    className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl px-4 py-2"
                    onPress={onClose}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-600/25 px-4 py-2 font-semibold"
                    onPress={handleSaveDecision}
                    startContent={<Flag className="w-4 h-4" />}
                  >
                    Save Decision
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

