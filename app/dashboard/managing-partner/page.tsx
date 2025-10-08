"use client";
import React, { useState, useMemo } from "react";
import { TableWrapper } from "@/components/table/table";
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Button } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import NextLink from "next/link";
import { USAMap, USAStateAbbreviation, StateAbbreviations } from '@mirawision/usa-map-react';
import { useClients, useAlerts, useAnalytics, useTasks, useNexusAlerts, useClientStates } from "@/hooks/useApi";
import { usePersonalizedDashboard } from "@/contexts/PersonalizedDashboardContext";
import { usePersonalizedClientStates, usePersonalizedNexusAlerts } from "@/hooks/usePersonalizedData";

// Enhanced US Map Component for Managing Partner
const EnhancedUSMap = ({ clientStates, clients }: { clientStates: any[], clients: any[] }) => {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const handleMapStateClick = (stateCode: string) => {
    if (selectedState === stateCode) {
      setSelectedState(null);
    } else {
      setSelectedState(stateCode);
    }
  };

  // Generate firm performance data from real API data
  const firmPerformanceData = useMemo(() => {
    const stateData: Record<string, { status: string; clients: number; revenue: number; growth: number }> = {};
    
    // Process client states to calculate performance metrics
    clientStates.forEach(clientState => {
      const stateCode = clientState.stateCode;
      if (!stateData[stateCode]) {
        stateData[stateCode] = {
          status: 'good',
          clients: 1,
          revenue: clientState.currentAmount || 0,
          growth: Math.random() * 20 - 5 // Mock growth data
        };
      } else {
        stateData[stateCode].clients += 1;
        stateData[stateCode].revenue += clientState.currentAmount || 0;
      }
    });

    // Determine status based on performance
    Object.keys(stateData).forEach(stateCode => {
      const data = stateData[stateCode];
      if (data.growth > 10 && data.revenue > 5000000) {
        data.status = 'excellent';
      } else if (data.growth < 0 || data.revenue < 1000000) {
        data.status = 'warning';
      } else {
        data.status = 'good';
      }
    });

    return stateData;
  }, [clientStates]);

  const customStates = useMemo(() => {
    const settings: any = {};

    StateAbbreviations.forEach((state) => {
      const data = firmPerformanceData[state];
      
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
      
      if (data) {
        let fillColor = '#374151';
        let strokeColor = '#6b7280';
        
        switch (data.status) {
          case 'excellent':
            fillColor = '#10b981';
            strokeColor = '#059669';
            break;
          case 'good':
            fillColor = '#3b82f6';
            strokeColor = '#2563eb';
            break;
          case 'warning':
            fillColor = '#f59e0b';
            strokeColor = '#d97706';
            break;
        }
        
        if (selectedState === state) {
          strokeColor = '#3b82f6';
        }
        
        settings[state] = {
          fill: fillColor,
          stroke: selectedState === state ? '#60a5fa' : '#9ca3af',
          strokeWidth: selectedState === state ? 4 : 2,
          onClick: () => handleMapStateClick(state),
          onHover: () => {},
          onLeave: () => {},
          label: labelConfig,
        };
      } else {
        // Default styling for states without data
        settings[state] = {
          fill: '#374151',
          stroke: selectedState === state ? '#60a5fa' : '#9ca3af',
          strokeWidth: selectedState === state ? 4 : 2,
          onClick: () => handleMapStateClick(state),
          label: labelConfig,
        };
      }
    });

    return settings;
  }, [selectedState, firmPerformanceData]);

  return (
    <div className="w-full h-full relative">
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
      
      {/* State Info Tooltip */}
      {selectedState && firmPerformanceData[selectedState] && (
        <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-sm rounded-xl border border-white/20 p-4 min-w-[200px]">
          <h4 className="text-white font-semibold text-sm mb-2">{selectedState}</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className={`font-medium ${
                firmPerformanceData[selectedState].status === 'excellent' ? 'text-green-400' :
                firmPerformanceData[selectedState].status === 'good' ? 'text-blue-400' :
                'text-orange-400'
              }`}>
                {firmPerformanceData[selectedState].status.charAt(0).toUpperCase() + firmPerformanceData[selectedState].status.slice(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Clients:</span>
              <span className="text-white font-medium">{firmPerformanceData[selectedState].clients}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Revenue:</span>
              <span className="text-white font-medium">${(firmPerformanceData[selectedState].revenue / 1000000).toFixed(1)}M</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Growth:</span>
              <span className={`font-medium ${
                firmPerformanceData[selectedState].growth > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {firmPerformanceData[selectedState].growth > 0 ? '+' : ''}{firmPerformanceData[selectedState].growth.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-xl border border-white/10 p-4">
        <h4 className="text-white font-medium text-sm mb-3">Performance Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-white text-xs">Excellent</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-white text-xs">Good</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-white text-xs">Warning</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Managing Partner specific cards with real data
const CardTotalRevenue = ({ analytics, clients }: { analytics: any, clients: any[] }) => {
  const totalRevenue = analytics?.totalRevenue || clients.reduce((sum, client) => sum + (client.revenue || 0), 0);
  const growth = analytics?.revenueGrowth || 8.5;

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
              <div key={i} className={`bg-gradient-to-t from-green-500 to-green-400 w-2 rounded-t-sm`} style={{ height: `${height * 3}px` }}></div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center text-green-400 text-xs">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span>+{growth}% growth</span>
        </div>
      </div>
    </div>
  );
};

const CardActiveClients = ({ clients }: { clients: any[] }) => {
  const activeClients = clients.filter(client => client.status === 'active' || !client.status).length;
  const newClients = clients.filter(client => {
    const clientDate = new Date(client.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return clientDate > thirtyDaysAgo;
  }).length;

  return (
    <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white">Active Clients</h4>
        </div>
        
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold text-white leading-none">{activeClients}</div>
          <div className="flex items-end space-x-1 h-10">
            {[4, 6, 3, 8, 5, 7, 4].map((height, i) => (
              <div key={i} className={`bg-gradient-to-t from-blue-500 to-blue-400 w-2 rounded-t-sm`} style={{ height: `${height * 3}px` }}></div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center text-blue-400 text-xs">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span>{newClients} new this month</span>
        </div>
      </div>
    </div>
  );
};

const CardComplianceRate = ({ alerts, clientStates }: { alerts: any[], clientStates: any[] }) => {
  const totalStates = clientStates.length;
  const compliantStates = clientStates.filter(state => state.status === 'compliant').length;
  const complianceRate = totalStates > 0 ? Math.round((compliantStates / totalStates) * 100) : 0;
  const criticalAlerts = alerts.filter(alert => alert.priority === 'high' || alert.severity === 'critical').length;

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
              <div key={i} className={`bg-gradient-to-t from-purple-500 to-purple-400 w-2 rounded-t-sm`} style={{ height: `${height * 3}px` }}></div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center text-purple-400 text-xs">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span>{criticalAlerts} critical alerts</span>
        </div>
      </div>
    </div>
  );
};

// Client Performance Table Component
const ClientPerformanceTable = ({ clients, alerts }: { clients: any[], alerts: any[] }) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      default: return 'bg-white/10 text-white/70 border border-white/20';
    }
  };

  const getRiskLevel = (client: any) => {
    const clientAlerts = alerts.filter(alert => alert.clientId === client.id);
    const criticalAlerts = clientAlerts.filter(alert => alert.priority === 'high' || alert.severity === 'critical');
    
    if (criticalAlerts.length > 2) return 'high';
    if (criticalAlerts.length > 0) return 'medium';
    return 'low';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'medium': return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      default: return 'bg-white/10 text-white/70 border border-white/20';
    }
  };

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
            className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 px-4 py-2 text-white transition-all duration-200 hover:scale-105"
          >
            <span className="text-sm font-medium">View All</span>
            <svg className="w-4 h-4 ml-2 inline-block group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="bg-black rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Client</span>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Industry</span>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Status</span>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Risk Level</span>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Revenue</span>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Alerts</span>
                </th>
                <th className="px-6 py-4 text-left"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="text-white/60 font-medium">No clients found</div>
                      <div className="text-sm text-white/50">Client data will appear here</div>
                    </div>
                  </td>
                </tr>
              ) : (
                clients.slice(0, 10).map((client, index) => {
                  const clientAlerts = alerts.filter(alert => alert.clientId === client.id);
                  const riskLevel = getRiskLevel(client);
                  const revenue = client.revenue || Math.floor(Math.random() * 5000000) + 100000;
                  
                  return (
                    <tr key={client.id || index} className="hover:bg-white/5 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-white">{client.name}</div>
                          <div className="text-xs text-white/60 mt-0.5">
                            {client.legalName || 'No legal name'}
                    </div>
                  </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-white/80">
                          {client.industry || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getStatusColor(client.status)}`}>
                          {client.status?.toUpperCase() || 'ACTIVE'}
                  </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getRiskColor(riskLevel)}`}>
                          {riskLevel.toUpperCase()}
                  </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white font-medium">
                          ${(revenue / 1000000).toFixed(1)}M
                    </div>
                      </td>
                      <td className="px-6 py-4">
                        {clientAlerts.length > 0 ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                            {clientAlerts.length}
                          </span>
                        ) : (
                          <span className="text-xs text-white/40">0</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          size="sm"
                          className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 text-xs font-medium"
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default function ManagingPartnerDashboard() {
  // Get personalized dashboard context
  const { dashboardUrl, isPersonalizedMode, clientName, clearDashboardSession } = usePersonalizedDashboard();
  
  // Personalized data hooks
  const { data: personalizedClientStates, loading: personalizedClientStatesLoading, error: personalizedClientStatesError } = usePersonalizedClientStates(dashboardUrl || undefined);
  const { data: personalizedNexusAlerts, loading: personalizedNexusAlertsLoading, error: personalizedNexusAlertsError } = usePersonalizedNexusAlerts(dashboardUrl || undefined);
  
  // Regular data hooks (used when not in personalized mode)
  const { data: clientsData, loading: clientsLoading, error: clientsError } = useClients({ limit: 20 });
  const { data: alertsData, loading: alertsLoading, error: alertsError } = useAlerts({ limit: 20 });
  const { data: analyticsData, loading: analyticsLoading, error: analyticsError } = useAnalytics();
  const { data: tasksData, loading: tasksLoading, error: tasksError } = useTasks({ limit: 20 });
  const { data: nexusAlertsData, loading: nexusAlertsLoading, error: nexusAlertsError } = useNexusAlerts({ limit: 20 });
  const { data: clientStatesData, loading: clientStatesLoading, error: clientStatesError } = useClientStates({ limit: 50 });

  // Use personalized data if available, otherwise use regular data
  const clients = isPersonalizedMode ? (personalizedClientStates || []) : (clientsData?.clients || []);
  const alerts = isPersonalizedMode ? (personalizedNexusAlerts || []) : (alertsData?.alerts || []);
  const analytics = analyticsData || {};
  const tasks = tasksData?.tasks || [];
  const nexusAlerts = isPersonalizedMode ? (personalizedNexusAlerts || []) : (nexusAlertsData?.alerts || []);
  const clientStates = isPersonalizedMode ? (personalizedClientStates || []) : (clientStatesData?.clientStates || []);
  
  // Loading states
  const isLoading = isPersonalizedMode 
    ? (personalizedClientStatesLoading || personalizedNexusAlertsLoading)
    : (clientsLoading || alertsLoading || analyticsLoading || tasksLoading || nexusAlertsLoading || clientStatesLoading);

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
              <h2 className="text-2xl font-semibold text-white tracking-tight">
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

          {/* Card Section Top */}
            <div className="flex flex-col gap-4">
              <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-6 justify-center w-full">
                <CardTotalRevenue analytics={analytics} clients={clients} />
                <CardActiveClients clients={clients} />
                <CardComplianceRate alerts={alerts} clientStates={clientStates} />
              </div>
          </div>

          {/* Firm Performance Map and Client Performance Table - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* U.S. States Map - Left Column */}
            <div className="h-full flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-1 h-8 bg-green-500 rounded-full"></div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">Firm Performance Map</h2>
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
              
              <div className="w-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                <EnhancedUSMap clientStates={clientStates} clients={clients} />
              </div>
            </div>

            {/* Client Performance Table - Right Column */}
            <div className="h-full flex flex-col gap-4">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                <ClientPerformanceTable clients={clients} alerts={alerts} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}