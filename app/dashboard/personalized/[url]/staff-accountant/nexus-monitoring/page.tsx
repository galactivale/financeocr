"use client";
import React, { useState, useEffect, useMemo, use } from "react";
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
  Badge
} from "@nextui-org/react";
import { USAMap, USAStateAbbreviation, StateAbbreviations } from '@mirawision/usa-map-react';
import { DynamicSidebar } from "@/components/sidebar/dynamic-sidebar";
import { SidebarContext } from "@/components/layout/layout-context";
import { usePersonalizedDashboard } from "@/contexts/PersonalizedDashboardContext";
import { usePersonalizedClientStates, usePersonalizedNexusAlerts } from "@/hooks/usePersonalizedData";

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

interface PersonalizedMonitoringProps {
  params: Promise<{
    url: string;
  }>;
}

const PersonalizedStaffAccountantNexusMonitoring = ({ params }: PersonalizedMonitoringProps) => {
  const resolvedParams = use(params);
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
  const [forceRefresh, setForceRefresh] = useState(0);

  // Get personalized dashboard context
  const { dashboardUrl, isPersonalizedMode, clientName } = usePersonalizedDashboard();

  // Personalized data hooks
  const { data: personalizedClientStates, loading: personalizedClientStatesLoading, error: personalizedClientStatesError } = usePersonalizedClientStates(dashboardUrl || undefined);
  const { data: personalizedNexusAlerts, loading: personalizedNexusAlertsLoading, error: personalizedNexusAlertsError } = usePersonalizedNexusAlerts(dashboardUrl || undefined);

  // Process nexus data from personalized data
  const nexusData = useMemo(() => {
    if (personalizedClientStatesLoading || personalizedNexusAlertsLoading) {
      return {};
    }
    
    const dataToUse = personalizedClientStates && personalizedClientStates.length > 0 ? personalizedClientStates : [];
    
    if (!dataToUse || dataToUse.length === 0) {
      return {};
    }

    const stateData: { [key: string]: StateMonitoringData } = {};

    // Initialize all states with default values
    const allStates = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'];
    
    allStates.forEach(state => {
      stateData[state] = {
        state,
        clients: 0,
        totalRevenue: 0,
        criticalAlerts: 0,
        warningAlerts: 0,
        complianceRate: 0,
        lastUpdated: new Date().toISOString()
      };
    });

    // Process client states data
    dataToUse.forEach((clientState: any) => {
      const stateCode = clientState.stateCode?.toUpperCase();
      if (stateCode && stateData[stateCode]) {
        stateData[stateCode].clients += 1;
        stateData[stateCode].totalRevenue += clientState.revenue || 0;
        stateData[stateCode].complianceRate = Math.round((stateData[stateCode].complianceRate + 85) / 2);
        stateData[stateCode].lastUpdated = clientState.lastUpdated || new Date().toISOString();
      }
    });

    // Process alerts data
    const alertsToUse = personalizedNexusAlerts && personalizedNexusAlerts.length > 0 ? personalizedNexusAlerts : [];
    
    if (alertsToUse && alertsToUse.length > 0) {
      alertsToUse.forEach((alert: any) => {
        const stateCode = alert.stateCode?.toUpperCase();
        if (stateCode && stateData[stateCode]) {
          if (alert.severity === 'critical' || alert.priority === 'high') {
            stateData[stateCode].criticalAlerts += 1;
          } else {
            stateData[stateCode].warningAlerts += 1;
          }
        }
      });
    }

    return stateData;
  }, [personalizedClientStates, personalizedNexusAlerts, personalizedClientStatesLoading, personalizedNexusAlertsLoading, forceRefresh]);

  // Process client data from personalized data
  const clients: Client[] = useMemo(() => {
    if (personalizedClientStatesLoading || personalizedNexusAlertsLoading) {
      return [];
    }
    
    const dataToUse = personalizedClientStates && personalizedClientStates.length > 0 ? personalizedClientStates : [];
    
    if (!dataToUse || dataToUse.length === 0) {
      return [];
    }

    const clientMap = new Map<string, Client>();

    // Process client states data
    dataToUse.forEach((clientState: any) => {
      const clientId = clientState.clientId;
      const client = clientState.client;
      
      if (!clientMap.has(clientId)) {
        clientMap.set(clientId, {
          id: clientId,
          name: client?.name || 'Unknown Client',
          state: clientState.stateCode || 'Unknown',
          industry: client?.industry || 'Unknown',
          revenue: `$${(clientState.revenue || 0).toLocaleString()}`,
          nexusStatus: clientState.status === 'compliant' ? 'compliant' : 
                      clientState.status === 'warning' ? 'warning' : 
                      clientState.status === 'critical' ? 'critical' : 'pending',
          thresholdProgress: Math.min(100, Math.round((clientState.revenue || 0) / 100000 * 100)),
          lastUpdate: clientState.lastUpdated || new Date().toISOString(),
          alerts: 0,
          riskScore: Math.round((clientState.revenue || 0) / 500000 * 100),
          states: [clientState.stateCode || 'Unknown']
        });
      } else {
        const existingClient = clientMap.get(clientId)!;
        existingClient.states.push(clientState.stateCode || 'Unknown');
      }
    });

    // Add alert counts
    const alertsToUse = personalizedNexusAlerts && personalizedNexusAlerts.length > 0 ? personalizedNexusAlerts : [];
    
    if (alertsToUse && alertsToUse.length > 0) {
      alertsToUse.forEach((alert: any) => {
        const client = clientMap.get(alert.clientId);
        if (client) {
          client.alerts += 1;
        }
      });
    }

    return Array.from(clientMap.values());
  }, [personalizedClientStates, personalizedNexusAlerts, personalizedClientStatesLoading, personalizedNexusAlertsLoading, forceRefresh]);

  useEffect(() => {
    setIsMounted(true);
    
    // Prevent body scrolling for full-screen experience
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Filter clients based on search and map focus
  useEffect(() => {
    let filtered = clients;
    
    if (searchQuery) {
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.industry.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (mapFocusState) {
      filtered = filtered.filter(client => 
        client.states.includes(mapFocusState)
      );
    }
    
    setFilteredClients(filtered);
  }, [clients, searchQuery, mapFocusState]);

  if (!isMounted || personalizedClientStatesLoading || personalizedNexusAlertsLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-black text-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
          <p className="mt-4 text-lg">Loading Personalized Dashboard...</p>
        </div>
      </div>
    );
  }

  if (personalizedClientStatesError || personalizedNexusAlertsError) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-black text-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-400 text-center max-w-md">
            {personalizedClientStatesError || personalizedNexusAlertsError}
          </p>
        </div>
      </div>
    );
  }

  return (
    <SidebarContext.Provider value={{ collapsed: sidebarOpen, setCollapsed: setSidebarOpen }}>
      <div className="flex h-screen w-full bg-black text-white overflow-hidden">
        <DynamicSidebar userRole="staff-accountant" />
        
        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Left Pane - Modern Nexus Monitoring */}
          <div className={`${isDetailsPanelOpen ? 'w-80' : 'w-1/4'} pt-5 px-3 bg-black flex flex-col transition-all duration-300 ease-in-out`}>
            {/* Modern Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse"></div>
                  <h1 className="text-white text-lg font-semibold tracking-tight">
                    {clientName ? `${clientName} - Staff Accountant Monitor` : 'Personalized Staff Accountant Monitor'}
                  </h1>
                </div>
                {mapFocusState && (
                  <div className="flex items-center space-x-2 bg-blue-500/20 rounded-full px-2 py-1">
                    <span className="text-blue-400 text-xs font-medium">{mapFocusState}</span>
                    <button 
                      onClick={() => setMapFocusState(null)}
                      className="text-blue-400 hover:text-blue-300 text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Apple-Style Client Cards */}
            <div 
              key={`client-cards-${forceRefresh}`}
              className="flex-1 space-y-2 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-600/30 hover:scrollbar-thumb-gray-500/50"
            >
              {personalizedClientStatesLoading || personalizedNexusAlertsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-gray-400 text-sm">Loading client data...</p>
                </div>
              ) : filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer group"
                    onClick={() => {
                      setSelectedClient(client);
                      setIsDetailsPanelOpen(true);
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          client.nexusStatus === 'compliant' ? 'bg-green-400' :
                          client.nexusStatus === 'warning' ? 'bg-yellow-400' :
                          client.nexusStatus === 'critical' ? 'bg-red-400' :
                          'bg-gray-400'
                        }`}></div>
                        <span className="text-white font-medium text-sm">{client.name}</span>
                      </div>
                      {client.alerts > 0 && (
                        <Badge content={client.alerts} color="danger" size="sm">
                          <div className="w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Revenue</span>
                        <span className="text-white">{client.revenue}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>States</span>
                        <span className="text-white">{client.states.join(', ')}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Risk Score</span>
                        <span className="text-white">{client.riskScore}%</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <div className="text-gray-400 text-sm font-medium mb-2">
                    {mapFocusState ? `No clients found in ${mapFocusState}` : 
                     searchQuery ? 'No clients match your search' :
                     'No client data available'}
                  </div>
                  <div className="text-gray-500 text-xs mb-4">
                    {personalizedClientStatesError || personalizedNexusAlertsError ? 'Error loading data' : 'Try refreshing or check your connection'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Pane - USA Map */}
          <div className="flex-1 bg-black flex items-center justify-center p-8">
            <div className="w-full h-full max-w-4xl">
              <USAMap
                customize={nexusData}
                onClick={(state) => {
                  setMapFocusState(state);
                  setSelectedState(state);
                }}
                onMouseEnter={(state) => {
                  setHoveredState(state);
                }}
                onMouseLeave={() => {
                  setHoveredState(null);
                }}
                width="100%"
                height="100%"
              />
            </div>
          </div>
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

export default PersonalizedStaffAccountantNexusMonitoring;















