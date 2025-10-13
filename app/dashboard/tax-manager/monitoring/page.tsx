"use client";
import React, { useState, useEffect, useMemo } from "react";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  Button, 
  Chip, 
  Input,
  Progress,
  Badge,
  Tabs,
  Tab,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@nextui-org/react";
import { USAMap, USAStateAbbreviation, StateAbbreviations } from '@mirawision/usa-map-react';
import { DynamicSidebar } from "@/components/sidebar/dynamic-sidebar";
import { SidebarContext } from "@/components/layout/layout-context";
import { useNexusDashboardSummary, useClientStates, useNexusAlerts } from "@/hooks/useApi";
import { usePersonalizedDashboard } from "@/contexts/PersonalizedDashboardContext";

// Client data structure for monitoring
interface Client {
  id: string;
  name: string;
  state: string;
  industry: string;
  revenue: string;
  nexusStatus: 'compliant' | 'warning' | 'critical' | 'pending' | 'transit';
  thresholdProgress: number;
  lastUpdate: string;
  alerts: number;
  riskScore: number;
  states: string[];
}

// State monitoring data
interface StateMonitoringData {
  state: string;
  clients: number;
  totalRevenue: number;
  criticalAlerts: number;
  warningAlerts: number;
  complianceRate: number;
  lastUpdated: string;
}

const TaxManagerMonitoring = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("nexus");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mapFocusState, setMapFocusState] = useState<string | null>(null);
  const [isStatusOverviewOpen, setIsStatusOverviewOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [dataLoaded, setDataLoaded] = useState(false);
  const [scanningStateIndex, setScanningStateIndex] = useState(0);
  const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0);

  // State name mapping for full names
  const stateNameMapping: Record<string, string> = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
    'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
    'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
    'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
    'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
    'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
    'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
    'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
  };

  // Personalized dashboard context
  const { organizationId } = usePersonalizedDashboard();

  // API hooks for data fetching with refresh capability - fetch more data
  const { data: dashboardSummary, loading: summaryLoading, error: summaryError, refetch: refetchSummary } = useNexusDashboardSummary(organizationId || 'demo-org-id');
  const { data: clientStatesData, loading: clientStatesLoading, error: clientStatesError, refetch: refetchClientStates } = useClientStates({ limit: 100, organizationId: organizationId || 'demo-org-id' });
  const { data: nexusAlertsData, loading: alertsLoading, error: alertsError, refetch: refetchAlerts } = useNexusAlerts({ limit: 100, organizationId: organizationId || 'demo-org-id' });

  // Fallback data for testing when API is not available
  const fallbackClientStates = [
    {
      id: "1",
      clientId: "client-1",
      stateCode: "CA",
      status: "critical",
      revenue: 525000,
      lastUpdated: new Date().toISOString(),
      client: {
        id: "client-1",
        name: "TechCorp SaaS",
        legalName: "TechCorp SaaS Inc.",
        industry: "Technology"
      }
    },
    {
      id: "2",
      clientId: "client-2", 
      stateCode: "TX",
      status: "warning",
      revenue: 485000,
      lastUpdated: new Date().toISOString(),
      client: {
        id: "client-2",
        name: "RetailChain LLC",
        legalName: "RetailChain LLC",
        industry: "Retail"
      }
    },
    {
      id: "3",
      clientId: "client-3",
      stateCode: "FL", 
      status: "pending",
      revenue: 280000,
      lastUpdated: new Date().toISOString(),
      client: {
        id: "client-3",
        name: "GlobalFin Solutions",
        legalName: "GlobalFin Solutions Inc.",
        industry: "Finance"
      }
    },
    {
      id: "4",
      clientId: "client-4",
      stateCode: "IL",
      status: "compliant", 
      revenue: 180000,
      lastUpdated: new Date().toISOString(),
      client: {
        id: "client-4",
        name: "HealthCare Inc.",
        legalName: "HealthCare Inc.",
        industry: "Healthcare"
      }
    },
    {
      id: "5",
      clientId: "client-5",
      stateCode: "WA",
      status: "transit",
      revenue: 160000,
      lastUpdated: new Date().toISOString(),
      client: {
        id: "client-5",
        name: "Manufacturing Co.",
        legalName: "Manufacturing Co.",
        industry: "Manufacturing"
      }
    }
  ];

  const fallbackAlerts = [
    {
      id: "alert-1",
      clientId: "client-1",
      stateCode: "CA",
      priority: "high",
      status: "open"
    },
    {
      id: "alert-2", 
      clientId: "client-2",
      stateCode: "TX",
      priority: "medium",
      status: "open"
    }
  ];

  // Refresh all data
  const refreshAllData = async () => {
    try {
      await Promise.all([
        refetchSummary(),
        refetchClientStates(),
        refetchAlerts()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleClientCardClick = (client: Client) => {
    setSelectedClient(client);
    setIsDetailsPanelOpen(true);
    // Focus the primary state (first state in the array) on the map
    if (client.states && client.states.length > 0) {
      setMapFocusState(client.states[0]);
      setSelectedState(client.states[0]);
    }
  };

  const handleCloseDetailsPanel = () => {
    setIsDetailsPanelOpen(false);
    setSelectedClient(null);
    // Clear map focus when closing the details panel
    setMapFocusState(null);
    setSelectedState(null);
  };

  const handleMapStateClick = (stateCode: string) => {
    if (mapFocusState === stateCode) {
      // If clicking the same state, clear the filter
      setMapFocusState(null);
      setSelectedState(null);
    } else {
      // Set new focus state
      setMapFocusState(stateCode);
      setSelectedState(stateCode);
    }
  };

  const handleMapStateHover = (stateCode: string, event?: any) => {
    // Add hover effects for better interactivity - only for states with data
    const stateData = nexusData[stateCode];
    if (stateData && stateData.hasData) {
      setHoveredState(stateCode);
      if (event) {
        setTooltipPosition({ x: event.clientX, y: event.clientY });
      }
    }
  };

  const handleMapStateLeave = () => {
    setHoveredState(null);
  };

  // Process nexus data from API with enhanced chart integration
  const nexusData = useMemo(() => {
    // If still loading, return empty object
    if (clientStatesLoading || alertsLoading) {
      return {};
    }
    
    // Use real API data, fallback to static data only if API fails
    const dataToUse = clientStatesData?.clientStates && clientStatesData.clientStates.length > 0 
      ? clientStatesData.clientStates 
      : (clientStatesError ? fallbackClientStates : []);
    
    const stateData: any = {};
    
    // If no data, return empty object (states will show as grey - no activity)
    if (!dataToUse || dataToUse.length === 0) {
      return {};
    }
    
    // Process client states data with better state mapping
    dataToUse.forEach((clientState: any) => {
      const stateCode = clientState.stateCode?.toUpperCase();
      if (!stateCode) return;
      
      // Use currentAmount from backend data, fallback to revenue for static data
      const revenue = clientState.currentAmount || clientState.revenue || 0;
      const threshold = clientState.thresholdAmount || 500000;
      
      // Determine status based on revenue-to-threshold ratio
      const ratio = revenue / threshold;
      let status = 'compliant';
      if (ratio >= 1.0) {
        status = 'critical';
      } else if (ratio >= 0.8) {
        status = 'warning';
      } else if (ratio >= 0.5) {
        status = 'pending';
      } else if (ratio >= 0.2) {
        status = 'transit';
      }
      
      if (!stateData[stateCode]) {
        stateData[stateCode] = {
          status: status,
          revenue: revenue,
          clients: 1,
          alerts: 0,
          companies: [clientState.client?.name || 'Unknown Client'],
          thresholdProgress: Math.min(100, Math.round(revenue / threshold * 100)),
          riskScore: Math.round(revenue / threshold * 100),
          lastUpdated: clientState.lastUpdated || new Date().toISOString(),
          hasData: true
        };
      } else {
        stateData[stateCode].clients += 1;
        stateData[stateCode].revenue += revenue;
        stateData[stateCode].companies.push(clientState.client?.name || 'Unknown Client');
        stateData[stateCode].thresholdProgress = Math.min(100, Math.round(stateData[stateCode].revenue / threshold * 100));
        stateData[stateCode].riskScore = Math.round(stateData[stateCode].revenue / threshold * 100);
        stateData[stateCode].hasData = true;
        
        // Update status to most critical if needed
        const newRatio = stateData[stateCode].revenue / threshold;
        if (newRatio >= 1.0) {
          stateData[stateCode].status = 'critical';
        } else if (newRatio >= 0.8 && stateData[stateCode].status !== 'critical') {
          stateData[stateCode].status = 'warning';
        } else if (newRatio >= 0.5 && stateData[stateCode].status === 'compliant') {
          stateData[stateCode].status = 'pending';
        } else if (newRatio >= 0.2 && stateData[stateCode].status === 'compliant') {
          stateData[stateCode].status = 'transit';
        }
      }
    });

    // Process alerts data with enhanced status mapping
    const alertsToUse = nexusAlertsData?.alerts && nexusAlertsData.alerts.length > 0 
      ? nexusAlertsData.alerts 
      : (alertsError ? fallbackAlerts : []);
    
    if (alertsToUse && alertsToUse.length > 0) {
      alertsToUse.forEach((alert: any) => {
        const stateCode = alert.stateCode?.toUpperCase();
        if (stateCode && stateData[stateCode]) {
          stateData[stateCode].alerts += 1;
          
          // Enhanced status determination based on alert priority and threshold
          const currentStatus = stateData[stateCode].status;
          const thresholdProgress = stateData[stateCode].thresholdProgress;
          
          if (alert.priority === 'high' || thresholdProgress >= 95) {
            stateData[stateCode].status = 'critical';
          } else if (alert.priority === 'medium' || thresholdProgress >= 70) {
            if (currentStatus !== 'critical') {
              stateData[stateCode].status = 'warning';
            }
          } else if (alert.priority === 'low' && thresholdProgress < 50) {
            if (currentStatus === 'compliant') {
              stateData[stateCode].status = 'pending';
            }
          }
        }
      });
    }

    // Don't add states without client data - they will show as grey (no activity)

    // Debug logging
    console.log('🗺️ Tax Manager Monitoring - Processed state data:', {
      totalStatesWithClients: Object.keys(stateData).length,
      statesWithData: Object.values(stateData).filter((s: any) => s.hasData).length,
      statesCompliant: Object.values(stateData).filter((s: any) => s.status === 'compliant').length,
      statesCritical: Object.values(stateData).filter((s: any) => s.status === 'critical').length,
      statesWarning: Object.values(stateData).filter((s: any) => s.status === 'warning').length,
      statesPending: Object.values(stateData).filter((s: any) => s.status === 'pending').length,
      statesTransit: Object.values(stateData).filter((s: any) => s.status === 'transit').length,
      sampleStates: Object.entries(stateData).slice(0, 5).map(([code, data]: [string, any]) => ({
        state: code,
        status: data.status,
        hasData: data.hasData,
        revenue: data.revenue,
        clients: data.clients
      }))
    });

    return stateData;
  }, [clientStatesData, nexusAlertsData, clientStatesLoading, alertsLoading]);

  // Custom states configuration for the map
  const customStates = useMemo(() => {
    const settings: any = {};

    StateAbbreviations.forEach((state) => {
      const data = nexusData[state as keyof typeof nexusData];
      
      // If a state is focused (from client card click), make other states partially visible
      const isFocusedState = mapFocusState === state;
      const isPartiallyVisible = mapFocusState && !isFocusedState;
      
      // Always set label configuration for all states
      const labelConfig = {
        enabled: true,
        render: (stateAbbr: USAStateAbbreviation) => (
          <text 
            fontSize="14" 
            fill="white" 
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
            stroke="black"
            strokeWidth="0.5"
            paintOrder="stroke fill"
          >
            {stateAbbr}
          </text>
        ),
      };
      
      // Apply styling to all states (both with data and compliant states)
      if (data) {
        let fillColor = '#374151';
        let strokeColor = '#6b7280';
        
        switch (data.status) {
          case 'critical':
            fillColor = '#ef4444';
            strokeColor = '#dc2626';
            break;
          case 'warning':
            fillColor = '#f59e0b';
            strokeColor = '#d97706';
            break;
          case 'pending':
            fillColor = '#3b82f6';
            strokeColor = '#2563eb';
            break;
          case 'compliant':
            fillColor = '#10b981';
            strokeColor = '#059669';
            break;
          case 'transit':
            fillColor = '#06b6d4';
            strokeColor = '#0891b2';
            break;
        }
        
        // Make colors lighter for partially visible states
        if (isPartiallyVisible) {
          fillColor = '#4b5563'; // Lighter gray
          strokeColor = '#6b7280'; // Lighter stroke
        }
        
        // Note: selectedState highlighting is handled separately to avoid map re-renders
        
        settings[state] = {
          fill: fillColor,
          stroke: mapFocusState === state ? '#60a5fa' : (isPartiallyVisible ? '#6b7280' : '#9ca3af'),
          strokeWidth: mapFocusState === state ? 4 : 2,
          onClick: () => handleMapStateClick(state),
          onHover: (event: any) => handleMapStateHover(state, event),
          onLeave: () => handleMapStateLeave(),
          label: labelConfig,
          // Add data attributes for better integration
          'data-state': state,
          'data-status': data.status,
          'data-revenue': data.revenue,
          'data-clients': data.clients,
          'data-alerts': data.alerts,
          'data-threshold-progress': data.thresholdProgress,
          'data-risk-score': data.riskScore,
        };
      } else {
        // Default styling for states without client data - grey (no activity)
        const defaultFillColor = '#1f2937'; // Dark grey for no activity
        const defaultStrokeColor = '#374151';
        
        settings[state] = {
          fill: defaultFillColor,
          stroke: mapFocusState === state ? '#60a5fa' : defaultStrokeColor,
          strokeWidth: mapFocusState === state ? 4 : 1,
          onClick: () => handleMapStateClick(state),
          onHover: (event: any) => handleMapStateHover(state, event),
          onLeave: () => handleMapStateLeave(),
          label: labelConfig,
        };
      }
    });

    // Debug logging for map colors
    const colorStats = Object.entries(settings).reduce((acc, [state, config]: [string, any]) => {
      const color = config.fill;
      acc[color] = (acc[color] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('🗺️ Tax Manager Monitoring - Map color distribution:', colorStats);

    return settings;
  }, [mapFocusState, nexusData]);

  // Process client data from API with better error handling and fallback
  const clients: Client[] = useMemo(() => {
    // If still loading, return empty array
    if (clientStatesLoading || alertsLoading) {
      return [];
    }
    
    // Use real API data, fallback to static data only if API fails
    const dataToUse = clientStatesData?.clientStates && clientStatesData.clientStates.length > 0 
      ? clientStatesData.clientStates 
      : (clientStatesError ? fallbackClientStates : []);
    
    if (!dataToUse || dataToUse.length === 0) {
      return [];
    }

    // Group client states by client
    const clientMap = new Map<string, any>();
    
    dataToUse.forEach((clientState: any) => {
      const clientId = clientState.clientId;
      if (!clientId) return; // Skip if no client ID
      
      // Use currentAmount from backend data, fallback to revenue for static data
      const revenue = clientState.currentAmount || clientState.revenue || 0;
      const threshold = clientState.thresholdAmount || 500000;
      
      if (!clientMap.has(clientId)) {
        // Determine status based on revenue-to-threshold ratio (same logic as nexusData)
        const ratio = revenue / threshold;
        let status = 'compliant';
        if (ratio >= 1.0) {
          status = 'critical';
        } else if (ratio >= 0.8) {
          status = 'warning';
        } else if (ratio >= 0.5) {
          status = 'pending';
        } else if (ratio >= 0.2) {
          status = 'transit';
        }

        clientMap.set(clientId, {
          id: clientId,
          name: clientState.client?.name || clientState.client?.legalName || 'Unknown Client',
          state: clientState.stateCode || 'Unknown',
          industry: clientState.client?.industry || 'Unknown',
          revenue: `$${revenue.toLocaleString()}`,
          nexusStatus: status,
          thresholdProgress: Math.min(100, Math.round(revenue / threshold * 100)),
          lastUpdate: new Date(clientState.lastUpdated || Date.now()).toLocaleString(),
          alerts: 0,
          riskScore: Math.round(revenue / threshold * 100),
          states: [clientState.stateCode].filter(Boolean)
        });
      } else {
        const client = clientMap.get(clientId);
        if (clientState.stateCode && !client.states.includes(clientState.stateCode)) {
          client.states.push(clientState.stateCode);
        }
        
        // Update revenue calculation
        const currentRevenue = parseInt(client.revenue.replace(/[$,]/g, '')) || 0;
        const newRevenue = currentRevenue + revenue;
        client.revenue = `$${newRevenue.toLocaleString()}`;
        client.thresholdProgress = Math.min(100, Math.round(newRevenue / threshold * 100));
        client.riskScore = Math.round(newRevenue / threshold * 100);
        
        // Update status based on new revenue-to-threshold ratio
        const newRatio = newRevenue / threshold;
        if (newRatio >= 1.0) {
          client.nexusStatus = 'critical';
        } else if (newRatio >= 0.8) {
          client.nexusStatus = 'warning';
        } else if (newRatio >= 0.5) {
          client.nexusStatus = 'pending';
        } else if (newRatio >= 0.2) {
          client.nexusStatus = 'transit';
        } else {
          client.nexusStatus = 'compliant';
        }
      }
    });

    // Add alert counts
    const alertsToUse = nexusAlertsData?.alerts && nexusAlertsData.alerts.length > 0 
      ? nexusAlertsData.alerts 
      : (alertsError ? fallbackAlerts : []);
    
    if (alertsToUse && alertsToUse.length > 0) {
      alertsToUse.forEach((alert: any) => {
        const client = clientMap.get(alert.clientId);
        if (client) {
          client.alerts += 1;
        }
      });
    }

    const result = Array.from(clientMap.values());
    
    // Debug logging for client status values
    console.log('🔍 Tax Manager Monitoring - Client status values:', {
      totalClients: result.length,
      statusBreakdown: result.reduce((acc, client) => {
        acc[client.nexusStatus] = (acc[client.nexusStatus] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      sampleClients: result.slice(0, 3).map(client => ({
        name: client.name,
        status: client.nexusStatus,
        revenue: client.revenue,
        thresholdProgress: client.thresholdProgress
      }))
    });

    return result;
  }, [clientStatesData, nexusAlertsData, clientStatesLoading, alertsLoading]);

  // Generate dynamic notifications based on alerts and scanning data
  const generateNotifications = useMemo(() => {
    const notifications: any[] = [];
    
    // AI Scanning notification
    const currentState = Object.keys(nexusData)[scanningStateIndex];
    notifications.push({
      id: 'ai-scanning',
      type: 'scanning',
      title: 'AI Nexus Scanner',
      message: `Currently scanning ${currentState ? stateNameMapping[currentState] || currentState : '--'}`,
      status: 'active',
      icon: 'scan',
      priority: 'info',
      timestamp: new Date().toLocaleTimeString()
    });

    // Alert notifications based on nexus alerts
    if (nexusAlertsData?.alerts) {
      nexusAlertsData.alerts.slice(0, 5).forEach((alert: any, index: number) => {
        const client = clients.find(c => c.id === alert.clientId);
        notifications.push({
          id: `alert-${alert.id}`,
          type: 'alert',
          title: `${alert.priority === 'high' ? 'Critical' : 'Warning'} Alert`,
          message: `${client?.name || 'Client'} - ${alert.stateCode} threshold ${alert.alertType === 'threshold_breach' ? 'exceeded' : 'approaching'}`,
          status: alert.priority === 'high' ? 'critical' : 'warning',
          icon: 'alert',
          priority: alert.priority,
          timestamp: new Date(alert.createdAt).toLocaleTimeString(),
          details: {
            client: client?.name,
            state: alert.stateCode,
            threshold: alert.thresholdAmount,
            current: alert.currentAmount
          }
        });
      });
    }

    // System status notifications
    notifications.push({
      id: 'system-status',
      type: 'system',
      title: 'System Status',
      message: `Monitoring ${Object.keys(nexusData).length} states with ${clients.length} active clients`,
      status: 'info',
      icon: 'system',
      priority: 'info',
      timestamp: new Date().toLocaleTimeString()
    });

    return notifications;
  }, [nexusData, scanningStateIndex, nexusAlertsData, clients, stateNameMapping]);

  useEffect(() => {
    setIsMounted(true);
    
    // Prevent body scrolling for full-screen experience
    document.body.style.overflow = 'hidden';
    
    // Initial data fetch on mount
    const initialDataFetch = async () => {
      try {
        await refreshAllData();
      } catch (error) {
        console.error('Error in initial data fetch:', error);
      }
    };
    
    // Fetch data immediately on mount
    initialDataFetch();
    
    // Cleanup: restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    let filtered = clients;
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by map focus state
    if (mapFocusState) {
      filtered = filtered.filter(client => 
        client.states.includes(mapFocusState)
      );
    }
    
    setFilteredClients(filtered);
  }, [clients, searchQuery, mapFocusState]);

  // Scanning animation effect
  useEffect(() => {
    const states = Object.keys(nexusData);
    if (states.length === 0) return;

    const interval = setInterval(() => {
      setScanningStateIndex(prev => (prev + 1) % states.length);
    }, 1200); // Change state every 1200ms for slower, more deliberate scanning

    return () => clearInterval(interval);
  }, [nexusData]);

  // Auto-scrolling notification center effect
  useEffect(() => {
    const notificationInterval = setInterval(() => {
      setCurrentNotificationIndex(prev => (prev + 1) % generateNotifications.length);
    }, 5000); // Change notification every 5 seconds

    return () => clearInterval(notificationInterval);
  }, [generateNotifications.length]);

  if (!isMounted || summaryLoading || clientStatesLoading || alertsLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-black text-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
          <p className="mt-4 text-lg">Loading Nexus Monitoring Data...</p>
        </div>
      </div>
    );
  }

  if (summaryError || clientStatesError || alertsError) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-black text-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-lg text-red-400 mb-2">Failed to load monitoring data</p>
          <p className="text-sm text-gray-400">Please check your connection and try again</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarContext.Provider
      value={{
        collapsed: sidebarOpen,
        setCollapsed: handleToggleSidebar,
      }}>
      <div className="fixed inset-0 w-full h-full flex bg-black overflow-hidden z-50">
        {/* Sidebar */}
        <DynamicSidebar userRole="tax-manager" />
        
        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Left Pane - Modern Nexus Monitoring */}
          <div className={`${isDetailsPanelOpen ? 'w-80' : 'w-1/4'} pt-5 px-3 bg-black flex flex-col transition-all duration-300 ease-in-out`}>
            {/* Modern Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse"></div>
                  <h1 className="text-white text-lg font-semibold tracking-tight">Nexus Monitor</h1>
                </div>
                {mapFocusState && (
                  <div className="flex items-center space-x-2 bg-blue-500/20 rounded-full px-2 py-1">
                    <span className="text-blue-400 text-xs font-medium">{mapFocusState}</span>
                    <button 
                      onClick={() => setMapFocusState(null)}
                      className="text-blue-400 hover:text-blue-300 text-xs transition-colors"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={refreshAllData}
                  disabled={summaryLoading || clientStatesLoading || alertsLoading}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Refresh Data"
                >
                  <svg 
                    className={`w-4 h-4 ${(summaryLoading || clientStatesLoading || alertsLoading) ? 'animate-spin' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>


            {/* Modern Search */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 rounded-xl text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
              />
            </div>

            {/* Modern Status Overview Dropdown */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 mb-4 overflow-hidden">
              <button 
                onClick={() => setIsStatusOverviewOpen(!isStatusOverviewOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <h3 className="text-white text-sm font-semibold">Status Overview</h3>
                  <span className="text-gray-400 text-xs">{filteredClients.length} Total</span>
                </div>
                <svg 
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isStatusOverviewOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isStatusOverviewOpen && (
                <div className="px-4 pb-4 border-t border-white/10">
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-white text-sm font-medium">Critical</span>
                      <span className="text-red-400 text-sm font-semibold ml-auto">
                        {filteredClients.filter(c => c.nexusStatus === 'critical').length}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-white text-sm font-medium">Warning</span>
                      <span className="text-orange-400 text-sm font-semibold ml-auto">
                        {filteredClients.filter(c => c.nexusStatus === 'warning').length}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-white text-sm font-medium">Pending</span>
                      <span className="text-blue-400 text-sm font-semibold ml-auto">
                        {filteredClients.filter(c => c.nexusStatus === 'pending').length}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                      <span className="text-white text-sm font-medium">Transit</span>
                      <span className="text-cyan-400 text-sm font-semibold ml-auto">
                        {filteredClients.filter(c => c.nexusStatus === 'transit').length}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 col-span-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-white text-sm font-medium">Compliant</span>
                      <span className="text-green-400 text-sm font-semibold ml-auto">
                        {filteredClients.filter(c => c.nexusStatus === 'compliant').length}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Apple-Style Client Cards */}
            <div 
              className="flex-1 space-y-2 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-600/30 hover:scrollbar-thumb-gray-500/50"
            >
              {clientStatesLoading || alertsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-gray-400 text-sm">Loading client data...</p>
                </div>
              ) : filteredClients.length > 0 ? (
                filteredClients.map((client) => {
                  const getStatusColor = (status: string) => {
                    const normalizedStatus = (status || '').toLowerCase().trim();
                    
                    switch (normalizedStatus) {
                      case 'critical': return 'bg-red-500';
                      case 'warning': return 'bg-orange-500';
                      case 'pending': return 'bg-blue-500';
                      case 'transit': return 'bg-cyan-500';
                      case 'compliant': return 'bg-green-500';
                      default: return 'bg-gray-500';
                    }
                  };

                  const getStatusText = (status: string) => {
                    // Ensure status is a valid string and normalize it
                    const normalizedStatus = (status || '').toLowerCase().trim();
                    
                    switch (normalizedStatus) {
                      case 'critical': return 'Critical';
                      case 'warning': return 'Warning';
                      case 'pending': return 'Pending';
                      case 'transit': return 'Transit';
                      case 'compliant': return 'Compliant';
                      default: 
                        console.warn('🔍 Unknown status value:', status, 'for client');
                        return 'Compliant'; // Default to compliant instead of unknown
                    }
                  };

                  const getStatusTextColor = (status: string) => {
                    const normalizedStatus = (status || '').toLowerCase().trim();
                    
                    switch (normalizedStatus) {
                      case 'critical': return 'text-red-500';
                      case 'warning': return 'text-orange-500';
                      case 'pending': return 'text-blue-500';
                      case 'transit': return 'text-cyan-500';
                      case 'compliant': return 'text-green-500';
                      default: return 'text-gray-500';
                    }
                  };

                  const getIconColor = (status: string) => {
                    const normalizedStatus = (status || '').toLowerCase().trim();
                    
                    switch (normalizedStatus) {
                      case 'critical': return 'text-red-500';
                      case 'warning': return 'text-orange-500';
                      case 'pending': return 'text-blue-500';
                      case 'transit': return 'text-cyan-500';
                      case 'compliant': return 'text-green-500';
                      default: return 'text-gray-500';
                    }
                  };

                  const getIconBgColor = (status: string) => {
                    const normalizedStatus = (status || '').toLowerCase().trim();
                    
                    switch (normalizedStatus) {
                      case 'critical': return 'bg-red-500/10';
                      case 'warning': return 'bg-orange-500/10';
                      case 'pending': return 'bg-blue-500/10';
                      case 'transit': return 'bg-cyan-500/10';
                      case 'compliant': return 'bg-green-500/10';
                      default: return 'bg-gray-500/10';
                    }
                  };

                  // Get the primary state (first in the array)
                  const primaryState = client.states[0];
                  const secondaryState = client.states[1];

                  return (
                    <div 
                      key={client.id} 
                      className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-3 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20 cursor-pointer select-none"
                      onClick={() => handleClientCardClick(client)}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 ${getIconBgColor(client.nexusStatus)} rounded-lg flex items-center justify-center`}>
                            <svg className={`w-4 h-4 ${getIconColor(client.nexusStatus)}`} fill="currentColor" viewBox="0 0 20 20">
                              {client.nexusStatus === 'critical' || client.nexusStatus === 'warning' ? (
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              ) : client.nexusStatus === 'pending' ? (
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              ) : client.nexusStatus === 'transit' ? (
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                              ) : (
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              )}
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-white font-semibold text-sm tracking-tight">{client.name}</h3>
                            <p className="text-gray-400 text-xs font-medium">{client.industry}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`px-2 py-1 ${getStatusColor(client.nexusStatus)} rounded-full`}>
                            <span className="text-white text-xs font-semibold">{getStatusText(client.nexusStatus)}</span>
                          </div>
                          <div className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
                            <svg className="w-3 h-3 text-white group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-2">
                        {/* Revenue and States */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-white text-sm font-medium">{client.revenue}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="bg-white/10 rounded-lg px-2 py-1">
                              <span className="text-white text-xs font-medium">{primaryState}</span>
                            </div>
                            {secondaryState && (
                              <div className="bg-white/5 rounded-lg px-2 py-1">
                                <span className="text-gray-300 text-xs font-medium">{secondaryState}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Status Description */}
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${getStatusTextColor(client.nexusStatus)}`}>
                            {client.nexusStatus === 'critical' ? 'Exceeded $500K threshold' :
                             client.nexusStatus === 'warning' ? 'Approaching $500K threshold' :
                             client.nexusStatus === 'pending' ? 'Under review process' :
                             client.nexusStatus === 'transit' ? 'Active monitoring' :
                             'Fully compliant'}
                          </p>
                          <div className="flex items-center space-x-1">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                            <span className="text-gray-400 text-xs">{client.alerts} alert{client.alerts !== 1 ? 's' : ''}</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-white font-medium">{client.thresholdProgress}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-1">
                            <div 
                              className={`h-1 rounded-full transition-all duration-500 ${
                                client.nexusStatus === 'critical' ? 'bg-red-500' :
                                client.nexusStatus === 'warning' ? 'bg-orange-500' :
                                client.nexusStatus === 'pending' ? 'bg-blue-500' :
                                client.nexusStatus === 'transit' ? 'bg-cyan-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${client.thresholdProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="text-gray-400 text-sm font-medium mb-2">
                    {mapFocusState ? `No clients found in ${mapFocusState}` : 
                     searchQuery ? 'No clients match your search' :
                     'No client data available'}
                  </div>
                  <div className="text-gray-500 text-xs mb-4">
                    {clientStatesError || alertsError ? 'Error loading data' : 'Try refreshing or check your connection'}
                  </div>
                  <div className="flex flex-col space-y-2">
                  {mapFocusState && (
                    <button 
                      onClick={() => setMapFocusState(null)}
                      className="text-blue-400 text-sm hover:text-blue-300 font-medium transition-colors"
                    >
                      Clear filter
                    </button>
                  )}
                    <button 
                      onClick={refreshAllData}
                      className="text-blue-400 text-sm hover:text-blue-300 font-medium transition-colors"
                    >
                      Refresh Data
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Pane - US Nexus Map */}
          <div className="flex-1 bg-black/95 backdrop-blur-sm p-4 pt-0">
            <div className="h-full flex flex-col">

              {/* Dynamic Notification Center */}
              <div className="absolute top-0 left-0 right-0 z-40">
                <style jsx>{`
                  @keyframes slideDown {
                    0% { transform: translateY(-100%); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                  }
                  @keyframes slideUp {
                    0% { transform: translateY(0); opacity: 1; }
                    100% { transform: translateY(-100%); opacity: 0; }
                  }
                `}</style>
                <div className="bg-black/95 backdrop-blur-2xl border-b border-white/20 px-6 py-4 relative overflow-hidden">
                  {/* Subtle Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 animate-pulse"></div>
                  
                  <div className="flex items-center justify-between relative z-10 w-full">
                    {/* Left Section - Notification Icon */}
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                          {generateNotifications[currentNotificationIndex]?.icon === 'scan' ? (
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : generateNotifications[currentNotificationIndex]?.icon === 'alert' ? (
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div className="absolute inset-0 w-8 h-8 bg-blue-400/30 rounded-xl animate-ping"></div>
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="text-white text-sm font-medium">
                          {generateNotifications[currentNotificationIndex]?.title || 'Notification Center'}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {generateNotifications[currentNotificationIndex]?.timestamp || new Date().toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    {/* Center Section - Notification Message */}
                    <div className="flex-1 mx-6">
                      <div className="text-white text-sm font-medium text-center">
                        {generateNotifications[currentNotificationIndex]?.message || 'No notifications'}
                      </div>
                      {generateNotifications[currentNotificationIndex]?.details && (
                        <div className="text-gray-400 text-xs text-center mt-1">
                          {generateNotifications[currentNotificationIndex].details.client} • 
                          {generateNotifications[currentNotificationIndex].details.state} • 
                          ${generateNotifications[currentNotificationIndex].details.current?.toLocaleString()}
                        </div>
                      )}
                    </div>

                    {/* Right Section - Status and Progress */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          generateNotifications[currentNotificationIndex]?.status === 'critical' ? 'bg-red-400' :
                          generateNotifications[currentNotificationIndex]?.status === 'warning' ? 'bg-yellow-400' :
                          generateNotifications[currentNotificationIndex]?.status === 'active' ? 'bg-green-400' :
                          'bg-blue-400'
                        } animate-pulse`}></div>
                        <span className={`text-xs font-medium ${
                          generateNotifications[currentNotificationIndex]?.status === 'critical' ? 'text-red-400' :
                          generateNotifications[currentNotificationIndex]?.status === 'warning' ? 'text-yellow-400' :
                          generateNotifications[currentNotificationIndex]?.status === 'active' ? 'text-green-400' :
                          'text-blue-400'
                        }`}>
                          {generateNotifications[currentNotificationIndex]?.status?.toUpperCase() || 'INFO'}
                        </span>
                      </div>
                      
                      <div className="text-gray-400 text-xs font-mono">
                        {currentNotificationIndex + 1}/{generateNotifications.length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive US Map */}
              <div className="flex-1 relative bg-black rounded-lg overflow-hidden transition-all duration-500 ease-in-out mt-16">
                {/* Cool Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                  {/* Grid Pattern */}
                  <div className="absolute inset-0" style={{
                    backgroundImage: `
                      linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px'
                  }}></div>
                  
                  {/* Radial Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-radial from-blue-500/5 via-transparent to-transparent"></div>
                  
                  {/* Geometric Shapes */}
                  <div className="absolute top-10 left-10 w-20 h-20 border border-blue-400/20 rounded-full"></div>
                  <div className="absolute top-32 right-16 w-16 h-16 border border-cyan-400/20 rotate-45"></div>
                  <div className="absolute bottom-20 left-20 w-12 h-12 border border-indigo-400/20 rounded-full"></div>
                  <div className="absolute bottom-32 right-32 w-24 h-24 border border-purple-400/20 rotate-12"></div>
                  
                  {/* Subtle Lines */}
                  <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
                  <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
                  <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-indigo-400/30 to-transparent"></div>
                  <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-purple-400/30 to-transparent"></div>
                </div>
                
                <div className="w-full h-full relative z-10">
                  <USAMap 
                    customStates={customStates}
                    hiddenStates={['AK', 'HI']}
                    mapSettings={{
                      width: '100%',
                      height: '100%'
                    }}
                    className="w-full h-full"
                    defaultState={{
                      label: {
                        enabled: true,
                        render: (stateAbbr: USAStateAbbreviation) => (
                          <text 
                            fontSize="14" 
                            fill="white" 
                            fontWeight="bold"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            stroke="black"
                            strokeWidth="0.5"
                            paintOrder="stroke fill"
                          >
                            {stateAbbr}
                          </text>
                        ),
                      },
                    }}
                  />
                </div>


                {/* State Tooltip - Only show for states with data */}
                {hoveredState && nexusData[hoveredState] && nexusData[hoveredState].hasData && (
                  <div 
                    className="absolute bg-gray-900/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-xl border border-white/10 z-20 pointer-events-none"
                    style={{
                      left: `${tooltipPosition.x + 10}px`,
                      top: `${tooltipPosition.y - 10}px`,
                      transform: 'translateY(-100%)'
                    }}
                  >
                    <div className="text-white">
                      <h3 className="font-semibold text-sm mb-2">{hoveredState}</h3>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status:</span>
                          <span className={`font-medium ${
                            nexusData[hoveredState].status === 'critical' ? 'text-red-400' :
                            nexusData[hoveredState].status === 'warning' ? 'text-orange-400' :
                            nexusData[hoveredState].status === 'pending' ? 'text-blue-400' :
                            nexusData[hoveredState].status === 'transit' ? 'text-cyan-400' :
                            'text-green-400'
                          }`}>
                            {nexusData[hoveredState].status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Revenue:</span>
                          <span className="text-white">${nexusData[hoveredState].revenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Clients:</span>
                          <span className="text-white">{nexusData[hoveredState].clients}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Alerts:</span>
                          <span className="text-white">{nexusData[hoveredState].alerts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Progress:</span>
                          <span className="text-white">{nexusData[hoveredState].thresholdProgress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
                      <span className="text-xs text-gray-300">Critical</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm"></div>
                      <span className="text-xs text-gray-300">Warning</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div>
                      <span className="text-xs text-gray-300">Pending</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-sm"></div>
                      <span className="text-xs text-gray-300">Transit</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
                      <span className="text-xs text-gray-300">Compliant</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* State Details Panel */}
          {selectedState && !isDetailsPanelOpen && (
            <div className="w-96 bg-black/95 backdrop-blur-xl border-l border-white/10 p-6 overflow-y-auto transition-all duration-300 ease-in-out">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-white text-lg font-semibold">{selectedState}</h2>
                    <p className="text-gray-400 text-sm">State Nexus Details</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedState(null)}
                  className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* State Data */}
              {nexusData[selectedState] ? (
                <>
                  {/* Status Overview */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-medium">Nexus Status</h3>
                      <div className={`px-3 py-1 ${
                        nexusData[selectedState].status === 'critical' ? 'bg-red-500' :
                        nexusData[selectedState].status === 'warning' ? 'bg-orange-500' :
                        nexusData[selectedState].status === 'pending' ? 'bg-blue-500' :
                        nexusData[selectedState].status === 'transit' ? 'bg-cyan-500' :
                        'bg-green-500'
                      } rounded-full`}>
                        <span className="text-white text-sm font-semibold">
                          {nexusData[selectedState].status === 'critical' ? 'Critical' :
                           nexusData[selectedState].status === 'warning' ? 'Warning' :
                           nexusData[selectedState].status === 'pending' ? 'Pending' :
                           nexusData[selectedState].status === 'transit' ? 'Transit' :
                           'Compliant'}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {nexusData[selectedState].status === 'critical' ? 'This state has clients exceeding the nexus threshold and requires immediate attention.' :
                       nexusData[selectedState].status === 'warning' ? 'This state has clients approaching the nexus threshold and should be monitored closely.' :
                       nexusData[selectedState].status === 'pending' ? 'This state is currently under review for nexus compliance.' :
                       nexusData[selectedState].status === 'transit' ? 'This state is actively being monitored for nexus compliance.' :
                       'This state is fully compliant with all nexus requirements.'}
                    </p>
                  </div>

                  {/* Key Metrics */}
                  <div className="mb-6">
                    <h3 className="text-white font-medium mb-3">Key Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Total Clients</span>
                        <span className="text-white font-medium">{nexusData[selectedState].clients || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Total Revenue</span>
                        <span className="text-white font-medium">${(nexusData[selectedState].revenue || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Active Alerts</span>
                        <span className="text-white font-medium">{nexusData[selectedState].alerts || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Threshold</span>
                        <span className="text-white font-medium">${(nexusData[selectedState].threshold || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Clients in this State */}
                  <div className="mb-6">
                    <h3 className="text-white font-medium mb-3">Clients in {selectedState}</h3>
                    <div className="space-y-2">
                      {filteredClients
                        .filter(client => client.states.includes(selectedState))
                        .map((client) => (
                          <div 
                            key={client.id}
                            className="bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                            onClick={() => {
                              setSelectedClient(client);
                              setIsDetailsPanelOpen(true);
                              setSelectedState(null);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-white text-sm font-medium">{client.name}</p>
                                <p className="text-gray-400 text-xs">{client.industry}</p>
                              </div>
                              <div className={`px-2 py-1 ${
                                client.nexusStatus === 'critical' ? 'bg-red-500' :
                                client.nexusStatus === 'warning' ? 'bg-orange-500' :
                                client.nexusStatus === 'pending' ? 'bg-blue-500' :
                                client.nexusStatus === 'transit' ? 'bg-cyan-500' :
                                'bg-green-500'
                              } rounded-full`}>
                                <span className="text-white text-xs font-semibold">
                                  {client.nexusStatus === 'critical' ? 'Critical' :
                                   client.nexusStatus === 'warning' ? 'Warning' :
                                   client.nexusStatus === 'pending' ? 'Pending' :
                                   client.nexusStatus === 'transit' ? 'Transit' :
                                   'Compliant'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                      View Reports
                    </button>
                    <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                      Export Data
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-500/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm">No data available for {selectedState}</p>
                  <p className="text-gray-500 text-xs mt-1">This state has no client activity</p>
                </div>
              )}
            </div>
          )}

          {/* Inline Expandable Details Panel */}
          {isDetailsPanelOpen && selectedClient && (
            <div className="w-96 bg-black/95 backdrop-blur-xl border-l border-white/10 p-6 overflow-y-auto transition-all duration-300 ease-in-out">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${
                  selectedClient.nexusStatus === 'critical' ? 'bg-red-500/10' :
                  selectedClient.nexusStatus === 'warning' ? 'bg-orange-500/10' :
                  selectedClient.nexusStatus === 'pending' ? 'bg-blue-500/10' :
                  selectedClient.nexusStatus === 'transit' ? 'bg-cyan-500/10' :
                  'bg-green-500/10'
                } rounded-xl flex items-center justify-center`}>
                  <svg className={`w-5 h-5 ${
                    selectedClient.nexusStatus === 'critical' ? 'text-red-500' :
                    selectedClient.nexusStatus === 'warning' ? 'text-orange-500' :
                    selectedClient.nexusStatus === 'pending' ? 'text-blue-500' :
                    selectedClient.nexusStatus === 'transit' ? 'text-cyan-500' :
                    'text-green-500'
                  }`} fill="currentColor" viewBox="0 0 20 20">
                    {selectedClient.nexusStatus === 'critical' || selectedClient.nexusStatus === 'warning' ? (
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    ) : selectedClient.nexusStatus === 'pending' ? (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    ) : selectedClient.nexusStatus === 'transit' ? (
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    ) : (
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    )}
                  </svg>
                </div>
                <div>
                  <h2 className="text-white text-lg font-semibold">{selectedClient.name}</h2>
                  <p className="text-gray-400 text-sm">{selectedClient.industry}</p>
                </div>
              </div>
              <button
                onClick={handleCloseDetailsPanel}
                className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nexus Status */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium">Nexus Status</h3>
                <div className={`px-3 py-1 ${
                  selectedClient.nexusStatus === 'critical' ? 'bg-red-500' :
                  selectedClient.nexusStatus === 'warning' ? 'bg-orange-500' :
                  selectedClient.nexusStatus === 'pending' ? 'bg-blue-500' :
                  selectedClient.nexusStatus === 'transit' ? 'bg-cyan-500' :
                  'bg-green-500'
                } rounded-full`}>
                  <span className="text-white text-sm font-semibold">
                    {selectedClient.nexusStatus === 'critical' ? 'Critical' :
                     selectedClient.nexusStatus === 'warning' ? 'Warning' :
                     selectedClient.nexusStatus === 'pending' ? 'Pending' :
                     selectedClient.nexusStatus === 'transit' ? 'Transit' :
                     'Compliant'}
                  </span>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {selectedClient.nexusStatus === 'critical' ? 'This client has exceeded the $500K threshold and requires immediate registration in the affected states.' :
                 selectedClient.nexusStatus === 'warning' ? 'This client is approaching the $500K threshold and should be monitored closely for potential registration requirements.' :
                 selectedClient.nexusStatus === 'pending' ? 'This client is currently under review for nexus determination and compliance requirements.' :
                 selectedClient.nexusStatus === 'transit' ? 'This client is actively being monitored for nexus compliance across multiple states.' :
                 'This client is fully compliant with all nexus requirements and thresholds.'}
              </p>
            </div>

            {/* Financial Information */}
            <div className="mb-6">
              <h3 className="text-white font-medium mb-3">Financial Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Annual Revenue</span>
                  <span className="text-white font-medium">{selectedClient.revenue}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Threshold Progress</span>
                  <span className="text-white font-medium">{selectedClient.thresholdProgress}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Risk Score</span>
                  <span className="text-white font-medium">{selectedClient.riskScore}/100</span>
                </div>
              </div>
            </div>

            {/* State Coverage */}
            <div className="mb-6">
              <h3 className="text-white font-medium mb-3">State Coverage</h3>
              <div className="flex flex-wrap gap-2">
                {selectedClient.states.map((state, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setMapFocusState(state);
                      setSelectedState(state);
                    }}
                    className={`rounded-lg px-3 py-1 transition-all duration-200 ${
                      mapFocusState === state 
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <span className="text-sm font-medium">{state}</span>
                  </button>
                ))}
              </div>
              <p className="text-gray-400 text-xs mt-2">
                Click a state to focus it on the map
              </p>
            </div>

            {/* Alerts & Updates */}
            <div className="mb-6">
              <h3 className="text-white font-medium mb-3">Alerts & Updates</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Active Alerts</span>
                  <span className="text-white font-medium">{selectedClient.alerts}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Last Update</span>
                  <span className="text-white font-medium">{selectedClient.lastUpdate}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                View Details
              </button>
              <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                Generate Report
              </button>
            </div>
            </div>
          )}
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

export default TaxManagerMonitoring;