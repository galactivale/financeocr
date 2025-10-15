"use client";
import React, { useState, useMemo } from "react";
import { TableWrapper } from "@/components/table/table";
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Button } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import NextLink from "next/link";
import { USAMap, USAStateAbbreviation, StateAbbreviations } from '@mirawision/usa-map-react';
import { useClients, useAlerts, useNexusAlerts, useClientStates } from "@/hooks/useApi";
import { usePersonalizedDashboard } from "@/contexts/PersonalizedDashboardContext";
import { usePersonalizedClientStates, usePersonalizedNexusAlerts } from "@/hooks/usePersonalizedData";
import { User } from "lucide-react";

// Enhanced US Map Component for Managing Partner
const EnhancedUSMap = ({ clientStates, clients, nexusAlerts }: { clientStates: any[], clients: any[], nexusAlerts: any[] }) => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMapStateClick = (stateCode: string) => {
    if (selectedState === stateCode) {
      setSelectedState(null);
    } else {
      setSelectedState(stateCode);
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleStateHover = (stateCode: string) => {
    setHoveredState(stateCode);
  };

  const handleStateLeave = () => {
    setHoveredState(null);
  };

  // Generate firm performance data from real API data
  const firmPerformanceData = useMemo(() => {
    const stateData: Record<string, { status: string; clients: number; revenue: number; alerts: number; nexusStatus: string }> = {};
    
    // Process client states to calculate performance metrics
    (clientStates || []).forEach(clientState => {
      const stateCode = clientState.stateCode;
      if (!stateData[stateCode]) {
        stateData[stateCode] = {
          status: 'good',
          clients: 1,
          revenue: clientState.currentAmount || 0,
          alerts: 0,
          nexusStatus: clientState.status || 'compliant'
        };
      } else {
        stateData[stateCode].clients += 1;
        stateData[stateCode].revenue += clientState.currentAmount || 0;
      }
    });

    // Count alerts per state
    (clients || []).forEach(client => {
      const clientStatesForClient = (clientStates || []).filter(cs => cs.clientId === client.id);
      clientStatesForClient.forEach(cs => {
        const stateCode = cs.stateCode;
        if (stateData[stateCode]) {
          // Count nexus alerts for this client in this state
          const alertsForClient = (nexusAlerts || []).filter(alert => 
            alert.clientId === client.id && alert.stateCode === stateCode
          );
          stateData[stateCode].alerts += alertsForClient.length;
        }
      });
    });

    // Determine status based on nexus compliance and alerts
    Object.keys(stateData).forEach(stateCode => {
      const data = stateData[stateCode];
      
      // Count critical/warning states
      const criticalStates = (clientStates || []).filter(cs => 
        cs.stateCode === stateCode && (cs.status === 'critical' || cs.status === 'warning')
      ).length;
      
      const totalStatesInState = (clientStates || []).filter(cs => cs.stateCode === stateCode).length;
      const criticalRatio = totalStatesInState > 0 ? criticalStates / totalStatesInState : 0;
      
      if (criticalRatio > 0.5 || data.alerts > 3) {
        data.status = 'poor';
        data.nexusStatus = 'critical';
      } else if (criticalRatio > 0.2 || data.alerts > 1) {
        data.status = 'warning';
        data.nexusStatus = 'warning';
      } else if (data.revenue > 1000000) {
        data.status = 'excellent';
        data.nexusStatus = 'compliant';
      } else {
        data.status = 'good';
        data.nexusStatus = 'compliant';
      }
    });

    return stateData;
  }, [clientStates, clients, nexusAlerts]);

  const customStates: Record<string, any> = {};
  Object.keys(firmPerformanceData).forEach(stateCode => {
    const data = firmPerformanceData[stateCode];
    customStates[stateCode] = {
      fill: data.nexusStatus === 'critical' ? '#ef4444' : 
            data.nexusStatus === 'warning' ? '#f59e0b' : 
            data.nexusStatus === 'pending' ? '#3b82f6' : 
            data.nexusStatus === 'transit' ? '#8b5cf6' : 
            data.nexusStatus === 'compliant' ? '#10b981' : '#6b7280',
      stroke: '#ffffff',
      strokeWidth: 1,
      cursor: 'pointer',
      onClick: () => handleMapStateClick(stateCode),
      onMouseEnter: () => handleStateHover(stateCode),
      onMouseLeave: handleStateLeave
    };
  });

  return (
    <div className="w-full h-full relative" onMouseMove={handleMouseMove}>
      <USAMap 
        customStates={customStates}
        hiddenStates={['AK', 'HI']}
        mapSettings={{
          width: '100%',
          height: '100%'
        }}
        className="w-full h-full"
        defaultState={{
          fill: '#6b7280',
          stroke: '#ffffff',
          strokeWidth: 1,
          cursor: 'pointer'
        }}
      />
      
      {/* State Tooltip - Only show for states with data */}
      {hoveredState && firmPerformanceData[hoveredState] && (
        <div 
          className="absolute bg-gray-900/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-xl border border-white/10 z-20 pointer-events-none"
          style={{
            left: `${tooltipPosition.x + 15}px`,
            top: `${tooltipPosition.y - 5}px`
          }}
        >
          <div className="text-white">
            <h3 className="font-semibold text-sm mb-2">{hoveredState}</h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Clients:</span>
                <span className="text-white">{firmPerformanceData[hoveredState]?.clients || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Revenue:</span>
                <span className="text-white">${(firmPerformanceData[hoveredState]?.revenue || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Alerts:</span>
                <span className="text-white">{firmPerformanceData[hoveredState]?.alerts || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={`font-medium ${
                  firmPerformanceData[hoveredState]?.nexusStatus === 'critical' ? 'text-red-400' :
                  firmPerformanceData[hoveredState]?.nexusStatus === 'warning' ? 'text-yellow-400' :
                  firmPerformanceData[hoveredState]?.nexusStatus === 'pending' ? 'text-blue-400' :
                  firmPerformanceData[hoveredState]?.nexusStatus === 'transit' ? 'text-purple-400' :
                  firmPerformanceData[hoveredState]?.nexusStatus === 'compliant' ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {firmPerformanceData[hoveredState]?.nexusStatus || 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white border border-white/20">
        <h4 className="font-semibold text-sm mb-2">Nexus Status</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Critical</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Warning</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span>Transit</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Compliant</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-500 rounded"></div>
            <span>No Activity</span>
          </div>
        </div>
      </div>
      
      {selectedState && (
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white border border-white/20">
          <h3 className="font-semibold text-lg mb-2">{selectedState}</h3>
          <div className="space-y-1 text-sm">
            <p>Clients: {firmPerformanceData[selectedState]?.clients || 0}</p>
            <p>Revenue: ${(firmPerformanceData[selectedState]?.revenue || 0).toLocaleString()}</p>
            <p>Alerts: {firmPerformanceData[selectedState]?.alerts || 0}</p>
            <p>Nexus Status: <span className={`font-medium ${
              firmPerformanceData[selectedState]?.nexusStatus === 'critical' ? 'text-red-400' :
              firmPerformanceData[selectedState]?.nexusStatus === 'warning' ? 'text-yellow-400' :
              firmPerformanceData[selectedState]?.nexusStatus === 'pending' ? 'text-blue-400' :
              firmPerformanceData[selectedState]?.nexusStatus === 'transit' ? 'text-purple-400' :
              firmPerformanceData[selectedState]?.nexusStatus === 'compliant' ? 'text-green-400' : 'text-gray-400'
            }`}>{firmPerformanceData[selectedState]?.nexusStatus || 'Unknown'}</span></p>
          </div>
        </div>
      )}
    </div>
  );
};

// Card Components
const CardTotalRevenue = ({ analytics, clients }: { analytics: any, clients: any[] }) => {
  const totalRevenue = (clients || []).reduce((sum, client) => sum + (client.annualRevenue || 0), 0);

  return (
    <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white">Total Revenue</h4>
        </div>
        
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold text-white leading-none">${(totalRevenue / 1000000).toFixed(1)}M</div>
          <div className="flex items-end space-x-1 h-10">
            {[5, 7, 4, 9, 6, 8, 7].map((height, i) => (
              <div
                key={i}
                className="bg-blue-500 rounded-sm"
                style={{ width: '4px', height: `${height * 4}px` }}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-green-400 text-xs font-medium">+12.5%</span>
          <span className="text-white/60 text-xs">vs last month</span>
        </div>
      </div>
    </div>
  );
};

const CardTotalClients = ({ clients }: { clients: any[] }) => {
  // Count all clients in the database
  const totalClients = (clients || []).length;
  
  // Calculate new clients this month based on creation date
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const newThisMonth = (clients || []).filter(client => {
    if (!client.createdAt) return false;
    const clientDate = new Date(client.createdAt);
    return clientDate.getMonth() === currentMonth && clientDate.getFullYear() === currentYear;
  }).length;

  return (
    <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white">Total Clients</h4>
        </div>
        
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold text-white leading-none">{totalClients}</div>
          <div className="flex items-end space-x-1 h-10">
            {[4, 6, 3, 8, 5, 7, 4].map((height, i) => (
              <div
                key={i}
                className="bg-green-500 rounded-sm"
                style={{ width: '4px', height: `${height * 4}px` }}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-green-400 text-xs font-medium">+{newThisMonth}</span>
          <span className="text-white/60 text-xs">new this month</span>
        </div>
      </div>
    </div>
  );
};

const CardComplianceRate = ({ alerts, clientStates }: { alerts: any[], clientStates: any[] }) => {
  const totalStates = (clientStates || []).length;
  const compliantStates = (clientStates || []).filter(state => state.status === 'compliant' || state.status === 'transit').length;
  const complianceRate = totalStates > 0 ? Math.round((compliantStates / totalStates) * 100) : 100;

  return (
    <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white">Compliance Rate</h4>
        </div>
        
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold text-white leading-none">{complianceRate}%</div>
          <div className="flex items-end space-x-1 h-10">
            {[3, 5, 4, 7, 6, 8, 5].map((height, i) => (
              <div
                key={i}
                className="bg-purple-500 rounded-sm"
                style={{ width: '4px', height: `${height * 4}px` }}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-green-400 text-xs font-medium">+2.1%</span>
          <span className="text-white/60 text-xs">vs last month</span>
        </div>
      </div>
    </div>
  );
};

// Client Performance Table Component
const ClientPerformanceTable = ({ clients, alerts, clientStates }: { clients: any[], alerts: any[], clientStates: any[] }) => {
  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
            <h3 className="text-white font-semibold text-lg">Client Performance Overview</h3>
          </div>
          <Link
            href="/dashboard/managing-partner/clients"
            as={NextLink}
            className="group bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 px-4 py-2 text-white hover:bg-white/20 transition-all duration-200 hover:scale-105"
          >
            <span className="text-sm font-medium">View All</span>
            <svg className="w-4 h-4 ml-2 inline-block group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
                  </div>
                  </div>

      <Table aria-label="Client performance table" className="bg-transparent">
        <TableHeader>
          <TableColumn>CLIENT</TableColumn>
          <TableColumn>REVENUE</TableColumn>
          <TableColumn>RISK LEVEL</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {(clients || []).slice(0, 3).map((client, index) => {
            const clientAlerts = (alerts || []).filter(alert => alert.clientId === client.id);
            const hasAlerts = clientAlerts.length > 0;
            
            // Get the primary state for this client
            const clientStatesForClient = (clientStates || []).filter(cs => cs.clientId === client.id);
            const primaryState = clientStatesForClient.length > 0 ? clientStatesForClient[0].stateCode : 'N/A';
                  
                  return (
              <TableRow key={client.id || index} className="hover:bg-white/5 transition-colors duration-150">
                <TableCell>
                        <div>
                          <div className="text-sm font-medium text-white">{client.name}</div>
                          <div className="text-xs text-white/60 mt-0.5">
                            State: {primaryState}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium text-white">
                    ${(client.annualRevenue || 0).toLocaleString()}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    client.riskLevel === 'low' 
                      ? 'bg-green-100 text-green-800'
                      : client.riskLevel === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : client.riskLevel === 'high'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {client.riskLevel || 'Unknown'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/dashboard/tax-manager/clients/${client.id}`}
                      as={NextLink}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                      View
                    </Link>
                    {hasAlerts && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {clientAlerts.length} Alert{clientAlerts.length > 1 ? 's' : ''}
                          </span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

// Main Component
export default function ManagingPartnerDashboard() {
  
  // Personalized dashboard context
  const { dashboardUrl, isPersonalizedMode, clientName, organizationId, clearDashboardSession } = usePersonalizedDashboard();
  
  // API hooks for data fetching
  const { data: clientsData, loading: clientsLoading } = useClients({ organizationId: organizationId || 'demo-org-id' });
  const { data: alertsData, loading: alertsLoading } = useAlerts();
  const { data: nexusAlertsData, loading: nexusAlertsLoading } = useNexusAlerts({ organizationId: organizationId || 'demo-org-id' });
  const { data: clientStatesData, loading: clientStatesLoading } = useClientStates({ organizationId: organizationId || 'demo-org-id' });
  
  // Fallback clients data
  const fallbackClients = [
    { id: '1', name: 'Acme Corporation', annualRevenue: 2500000, status: 'active', riskLevel: 'low', createdAt: new Date() },
    { id: '2', name: 'TechStart Inc', annualRevenue: 1800000, status: 'active', riskLevel: 'medium', createdAt: new Date() },
    { id: '3', name: 'Global Solutions', annualRevenue: 4200000, status: 'active', riskLevel: 'low', createdAt: new Date() },
    { id: '4', name: 'Innovation Labs', annualRevenue: 950000, status: 'active', riskLevel: 'high', createdAt: new Date() },
    { id: '5', name: 'Enterprise Partners', annualRevenue: 3200000, status: 'active', riskLevel: 'low', createdAt: new Date() }
  ];

  // Extract data from API responses
  const clients = clientsData?.clients && clientsData.clients.length > 0 ? clientsData.clients : fallbackClients;
  const alerts = alertsData?.alerts || [];
  const nexusAlerts = nexusAlertsData?.alerts || [];
  const clientStates = clientStatesData?.clientStates || [];

  // Debug logging
  console.log('Managing Partner Dashboard - Clients data:', clients);
  console.log('Managing Partner Dashboard - Clients count:', clients.length);

  // Personalized data hooks
  const { data: personalizedClientStates } = usePersonalizedClientStates(dashboardUrl);
  const { data: personalizedNexusAlerts } = usePersonalizedNexusAlerts(dashboardUrl);
  
  // Use personalized data if in personalized mode AND data exists, otherwise fall back to regular data
  const effectivePersonalizedMode = isPersonalizedMode && dashboardUrl;
  const displayClientStates = (effectivePersonalizedMode && personalizedClientStates && personalizedClientStates.length > 0) 
    ? personalizedClientStates 
    : (clientStates || []);
  const displayNexusAlerts = (effectivePersonalizedMode && personalizedNexusAlerts && personalizedNexusAlerts.length > 0) 
    ? personalizedNexusAlerts 
    : (nexusAlerts || []);
  
  
  const isLoading = clientsLoading || alertsLoading || analyticsLoading || tasksLoading || nexusAlertsLoading || clientStatesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="text-white mt-4">
            {isPersonalizedMode ? `Loading ${clientName || 'personalized'} dashboard...` : 'Loading managing partner dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-6">
        <div className="flex justify-center gap-2 xl:gap-[10px] pt-2 px-4 lg:px-0 flex-wrap xl:flex-nowrap max-w-[90rem] mx-auto w-full">
          <div className="mt-6 gap-8 flex flex-col w-full">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
              <h2 className="text-3xl font-light text-white tracking-tight">
                {isPersonalizedMode && clientName ? `${clientName} - Firm Performance Overview` : 'Firm Performance Overview'}
              </h2>
              {isPersonalizedMode && (
                <div className="ml-4 flex items-center space-x-2">
                  <div className="px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">
                    <span className="text-blue-400 text-sm font-medium">Personalized View</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    color="danger"
                    onClick={() => {
                      clearDashboardSession();
                      window.location.reload();
                    }}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    Exit
                  </Button>
                </div>
              )}
            </div>

            {/* Tab Navigation */}

            {/* Main Content */}
            <>
          {/* Card Section Top */}
            <div className="flex flex-col gap-4">
              <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-8 justify-center w-full">
                <CardTotalRevenue analytics={analytics} clients={clients} />
                <CardTotalClients clients={clients} />
                    <CardComplianceRate alerts={alerts} clientStates={displayClientStates} />
              </div>
          </div>

          {/* Firm Performance Map and Client Performance Table - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* U.S. States Map - Left Column */}
            <div className="h-full flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-1 h-8 bg-green-500 rounded-full"></div>
                  <h2 className="text-xl font-light text-white tracking-tight">Firm Performance Map</h2>
                </div>
                <Link
                  href="/dashboard/managing-partner/monitoring"
                  as={NextLink}
                  className="group bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 px-4 py-2 text-white hover:bg-white/20 transition-all duration-200 hover:scale-105"
                >
                  <span className="text-sm font-medium">View More</span>
                  <svg className="w-4 h-4 ml-2 inline-block group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              
              <div className="w-full bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-xl rounded-3xl border border-white/5 p-8 shadow-2xl">
                <EnhancedUSMap clientStates={displayClientStates} clients={clients} nexusAlerts={displayNexusAlerts} />
              </div>
            </div>

            {/* Client Performance Table - Right Column */}
            <div className="h-full flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                  <h2 className="text-xl font-light text-white tracking-tight">Client Performance</h2>
                </div>
                <Link
                  href="/dashboard/managing-partner/clients"
                  as={NextLink}
                  className="group bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 px-4 py-2 text-white hover:bg-white/20 transition-all duration-200 hover:scale-105"
                >
                  <span className="text-sm font-medium">View More</span>
                  <svg className="w-4 h-4 ml-2 inline-block group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              
              <div className="w-full bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-xl rounded-3xl border border-white/5 p-8 shadow-2xl">
                <ClientPerformanceTable clients={clients || []} alerts={alerts || []} clientStates={displayClientStates || []} />
              </div>
            </div>
          </div>
            </>
          </div>
        </div>
      </div>
    </div>
  );
}