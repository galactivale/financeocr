"use client";
import React, { useState, useMemo, useCallback } from "react";
import { TableWrapper } from "@/components/table/table";
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import NextLink from "next/link";
import { USAMap, USAStateAbbreviation, StateAbbreviations } from '@mirawision/usa-map-react';
import { useClients, useAlerts, useNexusAlerts, useNexusActivities, useClientStates, useNexusDashboardSummary, useOrganization } from "@/hooks/useApi";
import { usePersonalizedDashboard } from "@/contexts/PersonalizedDashboardContext";
import { normalizeOrgId } from "@/lib/utils";
import { usePersonalizedClientStates, usePersonalizedNexusAlerts } from "@/hooks/usePersonalizedData";

// Removed hardcoded fallback alert data; rely solely on API data

// Enhanced US Map Component - Matching monitoring page implementation
const EnhancedUSMap = ({ clientStates, nexusAlerts }: { clientStates: any[], nexusAlerts: any[] }) => {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const handleMapStateClick = useCallback((stateCode: string) => {
    if (selectedState === stateCode) {
      setSelectedState(null);
    } else {
      setSelectedState(stateCode);
    }
  }, [selectedState]);

  // Process nexus data from API - exact same logic as monitoring page
  const nexusData = useMemo(() => {
    const stateData: any = {};
    
    // If no data, return empty object (states will show as grey - no activity)
    if (!clientStates || clientStates.length === 0) {
      return {};
    }
    
    // Process client states data with better state mapping
    clientStates.forEach((clientState: any) => {
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
          hasData: true,
          clientStatuses: [status] // Track individual client statuses
        };
      } else {
        stateData[stateCode].clients += 1;
        stateData[stateCode].revenue += revenue;
        stateData[stateCode].companies.push(clientState.client?.name || 'Unknown Client');
        stateData[stateCode].thresholdProgress = Math.min(100, Math.round(stateData[stateCode].revenue / threshold * 100));
        stateData[stateCode].riskScore = Math.round(stateData[stateCode].revenue / threshold * 100);
        stateData[stateCode].hasData = true;
        
        // Track individual client status
        if (!stateData[stateCode].clientStatuses) {
          stateData[stateCode].clientStatuses = [];
        }
        stateData[stateCode].clientStatuses.push(status);
        
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
    if (nexusAlerts && nexusAlerts.length > 0) {
      nexusAlerts.forEach((alert: any) => {
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

    // Check client states for each state to apply new color logic
    // If multiple clients, only 1 critical, and rest are transit/warning/pending, show yellow
    Object.keys(stateData).forEach(stateCode => {
      const state = stateData[stateCode];
      
      if (state.clientStatuses && state.clientStatuses.length > 1) {
        // Count clients by status
        const criticalCount = state.clientStatuses.filter((s: string) => s === 'critical').length;
        const transitCount = state.clientStatuses.filter((s: string) => s === 'transit').length;
        const warningCount = state.clientStatuses.filter((s: string) => s === 'warning').length;
        const pendingCount = state.clientStatuses.filter((s: string) => s === 'pending').length;
        const approachingThresholdCount = transitCount + warningCount + pendingCount;
        const totalClients = state.clientStatuses.length;
        
        // New logic: If multiple clients, only 1 critical, and rest are transit/warning/pending, show yellow
        if (criticalCount === 1 && approachingThresholdCount === (totalClients - 1)) {
          state.status = 'warning';
        }
      }
    });

    return stateData;
  }, [clientStates, nexusAlerts]);

  // Custom states configuration for the map - exact same as monitoring page
  const customStates = useMemo(() => {
    const settings: any = {};

    StateAbbreviations.forEach((state) => {
      const data = nexusData[state as keyof typeof nexusData];
      
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
        
        if (selectedState === state) {
          strokeColor = '#3b82f6';
        }
        
        settings[state] = {
          fill: fillColor,
          stroke: selectedState === state ? '#60a5fa' : '#9ca3af',
          strokeWidth: selectedState === state ? 4 : 2,
          onClick: () => handleMapStateClick(state),
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
          stroke: selectedState === state ? '#60a5fa' : defaultStrokeColor,
          strokeWidth: selectedState === state ? 4 : 1,
          onClick: () => handleMapStateClick(state),
          label: labelConfig,
        };
      }
    });

    return settings;
  }, [selectedState, nexusData, handleMapStateClick]);

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
    </div>
  );
};

// Tax Manager specific cards with real data
const CardActiveAlerts = ({ alerts }: { alerts: any[] }) => {
  const criticalAlerts = alerts.filter(alert => alert.priority === 'high' || alert.severity === 'critical').length;
  const newAlerts = alerts.filter(alert => {
    const alertDate = new Date(alert.createdAt);
    const today = new Date();
    return alertDate.toDateString() === today.toDateString();
  }).length;

  return (
  <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-white">Active Alerts</h4>
      </div>
      
      {/* Main Value with Chart */}
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold text-white leading-none">{criticalAlerts}</div>
        <div className="flex items-end space-x-1 h-10">
          {alerts.slice(0, 7).map((alert, i) => {
            const height = alert.priority === 'high' ? 8 : alert.priority === 'medium' ? 5 : 3;
            return (
              <div key={i} className={`bg-gradient-to-t from-red-500 to-red-400 w-2 rounded-t-sm`} style={{ height: `${height * 3}px` }}></div>
            );
          })}
        </div>
      </div>
      
      {/* Trend */}
      <div className="flex items-center text-red-400 text-xs">
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
        <span>Critical trend</span>
      </div>
    </div>
  </div>
);
};

const CardThresholdMonitoring = ({ alerts }: { alerts: any[] }) => {
  const thresholdAlerts = alerts.filter(alert => 
    alert.alertType === 'threshold_breach' || alert.type === 'threshold' || alert.category === 'threshold'
  ).length;
  const approachingThreshold = alerts.filter(alert => 
    alert.currentAmount && alert.thresholdAmount && 
    (alert.currentAmount / alert.thresholdAmount) > 0.8
  ).length;

  return (
  <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-white">Threshold Monitoring</h4>
      </div>
      
      {/* Main Value with Chart */}
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold text-white leading-none">{thresholdAlerts}</div>
        <div className="flex items-end space-x-1 h-10">
          {alerts.slice(0, 7).map((alert, i) => {
            const height = alert.alertType === 'threshold_breach' ? 8 : 
                          alert.currentAmount && alert.thresholdAmount && (alert.currentAmount / alert.thresholdAmount) > 0.8 ? 6 : 3;
            return (
              <div key={i} className={`bg-gradient-to-t from-orange-500 to-orange-400 w-2 rounded-t-sm`} style={{ height: `${height * 3}px` }}></div>
            );
          })}
        </div>
      </div>
      
      {/* Trend */}
      <div className="flex items-center text-orange-400 text-xs">
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
        <span>{approachingThreshold} approaching threshold</span>
      </div>
    </div>
  </div>
);
};

const CardResolvedToday = ({ activities }: { activities: any[] }) => {
  // Ensure activities is always an array
  const safeActivities = Array.isArray(activities) ? activities : [];
  
  const today = new Date();
  const resolvedToday = safeActivities.filter(activity => {
    if (!activity || !activity.createdAt) return false;
    const activityDate = new Date(activity.createdAt);
    return activity.status === 'completed' && activityDate.toDateString() === today.toDateString();
  }).length;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const resolvedYesterday = safeActivities.filter(activity => {
    if (!activity || !activity.createdAt) return false;
    const activityDate = new Date(activity.createdAt);
    return activity.status === 'completed' && activityDate.toDateString() === yesterday.toDateString();
  }).length;

  const variance = resolvedToday - resolvedYesterday;

  return (
  <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-white">Resolved Today</h4>
      </div>
      
      {/* Main Value with Chart */}
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold text-white leading-none">{resolvedToday}</div>
        <div className="flex items-end space-x-1 h-10">
          {safeActivities.slice(0, 7).map((activity, i) => {
            const height = activity.status === 'completed' ? 8 : activity.status === 'pending' ? 5 : 3;
            return (
              <div key={i} className={`bg-gradient-to-t from-green-500 to-green-400 w-2 rounded-t-sm`} style={{ height: `${height * 3}px` }}></div>
            );
          })}
        </div>
      </div>
      
      {/* Trend */}
      <div className={`flex items-center text-xs ${variance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
        <span>{variance >= 0 ? `+${variance} from yesterday` : `${variance} from yesterday`}</span>
      </div>
    </div>
  </div>
);
};

// Card Components
const CardTotalRevenue = ({ analytics, clients }: { analytics: any, clients: any[] }) => {
  // Debug logging
  console.log('🔍 CardTotalRevenue Debug:', {
    clientsType: typeof clients,
    clientsIsArray: Array.isArray(clients),
    clientsLength: clients?.length,
    clientsRaw: clients,
    sampleClient: clients?.[0]
  });
  
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
  // Debug logging
  console.log('🔍 CardTotalClients Debug:', {
    clientsType: typeof clients,
    clientsIsArray: Array.isArray(clients),
    clientsLength: clients?.length,
    clientsRaw: clients
  });
  
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
  // Calculate compliance rate based on revenue-to-threshold ratio (same logic as EnhancedUSMap)
  const totalStates = (clientStates || []).length;
  let compliantStates = 0;
  
  if (totalStates > 0) {
    clientStates.forEach((clientState: any) => {
      const revenue = clientState.currentAmount || clientState.revenue || 0;
      const threshold = clientState.thresholdAmount || 500000;
      const ratio = revenue / threshold;
      
      // Determine status based on revenue-to-threshold ratio (same as map)
      // States with ratio < 0.8 are considered compliant
      if (ratio < 0.8) {
        compliantStates++;
      }
    });
  }
  
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
            {[6, 8, 5, 7, 9, 6, 8].map((height, i) => (
              <div
                key={i}
                className="bg-purple-500 rounded-sm"
                style={{ width: '4px', height: `${height * 4}px` }}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-green-400 text-xs font-medium">+5.2%</span>
          <span className="text-white/60 text-xs">vs last quarter</span>
        </div>
      </div>
    </div>
  );
};

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
            href="/dashboard/tax-manager/clients"
            as={NextLink}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
          >
            View All →
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

const CardPriorityAlerts = ({ alerts, clients }: { alerts: any[], clients: any[] }) => {
  // Ensure alerts is always an array
  const safeAlerts = Array.isArray(alerts) ? alerts : [];
  
  // Debug logging
  console.log('🔍 CardPriorityAlerts Debug:', {
    alertsType: typeof alerts,
    alertsIsArray: Array.isArray(alerts),
    alertsLength: alerts?.length,
    safeAlertsLength: safeAlerts.length,
    sampleAlert: safeAlerts[0],
    clientsLength: clients?.length,
    allAlerts: safeAlerts.map(alert => ({
      id: alert.id,
      title: alert.title || alert.alertType,
      description: alert.description,
      priority: alert.priority,
      severity: alert.severity,
      stateCode: alert.stateCode,
      alertType: alert.alertType,
      currentAmount: alert.currentAmount,
      thresholdAmount: alert.thresholdAmount,
      clientId: alert.clientId,
      status: alert.status
    })),
    // Additional debug info
    alertsRaw: alerts
  });
  
  // Sort all alerts by priority first (high > medium > low), then by creation date (newest first)
  // Show top 3 alerts regardless of priority (if no high priority, show medium/low)
  const sortedAlerts = safeAlerts
    .sort((a, b) => {
      // Sort by priority first (critical > high > medium > low)
      const priorityOrder: Record<string, number> = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
      const getPriorityValue = (priority?: string, severity?: string): number => {
        const key = priority?.toLowerCase() || severity?.toLowerCase() || '';
        return priorityOrder[key] || 0;
      };
      const aPriority = getPriorityValue(a.priority, a.severity);
      const bPriority = getPriorityValue(b.priority, b.severity);
      if (aPriority !== bPriority) return bPriority - aPriority;
      // Then sort by creation date (newest first)
      const aDate = new Date(a.createdAt || a.created_at || 0).getTime();
      const bDate = new Date(b.createdAt || b.created_at || 0).getTime();
      return bDate - aDate;
    })
    .slice(0, 3);
  
  // Use sorted alerts - show top 3 regardless of priority
  const finalAlertsToUse = sortedAlerts;

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-500/10 border-red-500/20 text-red-400';
      case 'medium': return 'bg-orange-500/10 border-orange-500/20 text-orange-400';
      case 'low': return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/10 border-gray-500/20 text-gray-400';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'CRITICAL';
      case 'medium': return 'HIGH';
      case 'low': return 'PENDING';
      default: return 'INFO';
    }
  };

  const getAlertTypeIcon = (alertType: string) => {
    switch (alertType?.toLowerCase()) {
      case 'threshold_breach':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'nexus_registration':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm8 0a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
          </svg>
        );
      case 'compliance_review':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
  <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-white font-light text-lg tracking-tight">Priority Alerts</h3>
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${finalAlertsToUse.length > 0 ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
      </div>
    </div>
    
    {finalAlertsToUse.length === 0 ? (
      <div className="text-center py-8">
        <div className="w-12 h-12 mx-auto mb-3 bg-white/[0.05] rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h4 className="text-white font-light text-base mb-1">No Priority Alerts</h4>
        <p className="text-gray-500 text-xs font-light">All systems operating normally</p>
      </div>
    ) : (
      <div className="space-y-3">
        {finalAlertsToUse.map((alert, index) => {
          // Fix client name issue - use embedded client data if available, otherwise find in clients array
          const clientName = alert.client?.name || clients.find(c => c.id === alert.clientId)?.name || 'Client';
          const currentAmount = alert.currentAmount ? parseFloat(alert.currentAmount) : 0;
          const amount = currentAmount > 0 ? `$${(currentAmount / 1000).toFixed(0)}K` : '';
          
          // Get alert title/description - handle missing fields
          const alertTitle = alert.title || alert.alertType || 'Alert';
          const alertDescription = alert.description || alert.stateCode || '';
          const alertPriority = alert.priority || alert.severity || 'medium';
          const alertStateCode = alert.stateCode || 'N/A';
          const alertType = alert.alertType || 'unknown';
          
          return (
            <div key={alert.id || `alert-${index}`} className={`group backdrop-blur-sm rounded-xl border border-white/5 p-4 hover:bg-white/[0.02] transition-all duration-300 ${getPriorityColor(alertPriority)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${getPriorityColor(alertPriority)}`}>
                    {getAlertTypeIcon(alertType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-light text-white text-sm truncate">{alertTitle}</p>
                    <p className="text-xs text-gray-500 font-light truncate">
                      {clientName} • {alertStateCode} {amount ? `• ${amount}` : ''}
                    </p>
                    {alertDescription && (
                      <p className="text-xs text-gray-400 font-light truncate mt-1">{alertDescription}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${alertPriority === 'high' || alertPriority === 'critical' ? 'bg-red-500/20 text-red-400' : alertPriority === 'medium' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {getPriorityBadge(alertPriority)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);
};

const CardRiskDistribution = ({ clients, alerts }: { clients: any[], alerts: any[] }) => {
  // Calculate risk distribution from clients data
  const riskData = useMemo(() => {
    if (!clients || clients.length === 0) {
      return {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      };
    }

    const distribution = { critical: 0, high: 0, medium: 0, low: 0 };
    
    clients.forEach(client => {
      const riskLevel = client.riskLevel?.toLowerCase() || 'medium';
      if (distribution.hasOwnProperty(riskLevel)) {
        distribution[riskLevel as keyof typeof distribution]++;
      }
    });

    return distribution;
  }, [clients]);

  const totalClients = Object.values(riskData).reduce((sum, count) => sum + count, 0);
  const riskColors = {
    critical: '#EF4444',
    high: '#F97316', 
    medium: '#EAB308',
    low: '#22C55E'
  };

  const riskLabels = {
    critical: 'Critical Risk',
    high: 'High Risk',
    medium: 'Medium Risk', 
    low: 'Low Risk'
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-orange-500 rounded-full"></div>
          <h3 className="text-2xl font-semibold text-white tracking-tight">Client Risk Distribution</h3>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 px-3 py-2">
          <span className="text-white text-sm font-medium">{totalClients} Total Clients</span>
        </div>
      </div>

      {/* Risk Distribution Chart */}
      <div className="relative h-48 w-full mb-6">
        <svg className="w-full h-full" viewBox="0 0 400 180">
          {/* Background */}
          <rect width="100%" height="100%" fill="rgba(255, 255, 255, 0.02)" rx="12" />
          
          {/* Pie chart segments */}
          {(() => {
            let currentAngle = 0;
            const radius = 60;
            const centerX = 200;
            const centerY = 90;
            
            return Object.entries(riskData).map(([risk, count], index) => {
              if (count === 0) return null;
              
              const percentage = count / totalClients;
              const angle = percentage * 360;
              const startAngle = currentAngle;
              const endAngle = currentAngle + angle;
              
              const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
              const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
              const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
              const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');
              
              currentAngle += angle;
              
              return (
                <path
                  key={risk}
                  d={pathData}
                  fill={riskColors[risk as keyof typeof riskColors]}
                  className="drop-shadow-sm hover:drop-shadow-lg transition-all duration-200"
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                />
              );
            });
          })()}
          
          {/* Center circle */}
          <circle cx="200" cy="90" r="25" fill="rgba(0, 0, 0, 0.3)" />
          <text x="200" y="95" textAnchor="middle" className="fill-white text-sm font-bold">
            {totalClients}
          </text>
        </svg>
      </div>

      {/* Risk Statistics */}
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(riskData).map(([risk, count]) => {
          const percentage = totalClients > 0 ? ((count / totalClients) * 100).toFixed(1) : '0';
          
          return (
            <div key={risk} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full shadow-sm" 
                  style={{ backgroundColor: riskColors[risk as keyof typeof riskColors] }}
                />
                <div>
                  <div className="text-white text-sm font-medium">{riskLabels[risk as keyof typeof riskLabels]}</div>
                  <div className="text-white/60 text-xs">{count} clients</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white text-lg font-bold">{percentage}%</div>
                <div className="text-white/60 text-xs">of total</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alert Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl border border-red-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-white font-medium">Active Alerts</span>
          </div>
          <span className="text-white text-xl font-bold">{alerts?.length || 0}</span>
        </div>
        <div className="text-white/60 text-sm mt-1">
          {alerts?.filter(alert => alert.priority === 'high' || alert.priority === 'critical').length || 0} require immediate attention
        </div>
      </div>
    </div>
  );
};

// Nexus Activity Table Component with real data
const NexusActivityTable = ({ activities, clients }: { activities: any[], clients: any[] }) => {
  // Ensure activities is always an array
  const safeActivities = Array.isArray(activities) ? activities : [];
  
  // Debug logging removed for production
  
  // Use only real data from backend - no fallback data
  const dataToUse = safeActivities;
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'critical': return 'text-danger';
      case 'warning': return 'text-warning';
      case 'complete': return 'text-success';
      case 'resolved': return 'text-success';
      case 'pending': return 'text-primary';
      case 'applied': return 'text-secondary';
      case 'escalated': return 'text-danger';
      case 'open': return 'text-warning';
      case 'closed': return 'text-success';
      default: return 'text-default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="w-full">
      {/* Modern Table Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
            <h3 className="text-white font-semibold text-lg">Activity</h3>
          </div>
          <button className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 px-4 py-2 text-white transition-all duration-200 hover:scale-105">
            <span className="text-sm font-medium">View All</span>
          </button>
        </div>
      </div>

      {/* Black Theme Table Design */}
      <div className="bg-black rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Sortable Header */}
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left">
                  <button className="flex items-center space-x-1 text-xs font-medium text-white/60 uppercase tracking-wider hover:text-white/80">
                    <span>Date</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button className="flex items-center space-x-1 text-xs font-medium text-white/60 uppercase tracking-wider hover:text-white/80">
                    <span>Activity</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button className="flex items-center space-x-1 text-xs font-medium text-white/60 uppercase tracking-wider hover:text-white/80">
                    <span>State</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button className="flex items-center space-x-1 text-xs font-medium text-white/60 uppercase tracking-wider hover:text-white/80">
                    <span>Impact</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button className="flex items-center space-x-1 text-xs font-medium text-white/60 uppercase tracking-wider hover:text-white/80">
                    <span>Status</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </button>
                </th>
                <th className="px-6 py-4 text-left"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {dataToUse.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="text-white/60 font-medium">No nexus activities found</div>
                      <div className="text-sm text-white/50">Activities will appear here as they are processed</div>
                    </div>
                  </td>
                </tr>
              ) : (
                dataToUse.slice(0, 8).filter(activity => {
                  return activity && 
                         typeof activity === 'object' && 
                         activity.id && 
                         (activity.clientId || activity.title || activity.activityType);
                }).map((activity, index) => {
                const client = clients.find(c => c.id === activity.clientId);
                const timeAgo = activity.createdAt ? new Date(activity.createdAt) : new Date();
                const timeDisplay = timeAgo.toLocaleDateString() + ' ' + timeAgo.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                const amount = activity.amount ? `$${(activity.amount / 1000).toFixed(0)}K` : 'N/A';
                
                const safeActivity = {
                  id: activity.id || `activity-${index}`,
                  title: activity.title || 'Unknown Activity',
                  description: activity.description || 'No description available',
                  activityType: activity.activityType || 'unknown',
                  stateCode: activity.stateCode || 'N/A',
                  amount: activity.amount || 0,
                  thresholdAmount: activity.thresholdAmount || 0,
                  status: activity.status || 'unknown',
                  clientId: activity.clientId || 'unknown'
                };
                
                const getActivityTypeDisplay = (type: string) => {
                  switch (type) {
                    case 'threshold_exceeded': return 'Threshold Exceeded';
                    case 'registration_completed': return 'Registration Completed';
                    case 'data_processed': return 'Data Processed';
                    case 'registration_required': return 'Registration Required';
                    case 'deadline_approaching': return 'Deadline Approaching';
                    default: return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                  }
                };

                const getActivityIcon = (type: string) => {
                  switch (type) {
                    case 'threshold_exceeded': return '⚠️';
                    case 'registration_completed': return '✅';
                    case 'data_processed': return '📊';
                    case 'registration_required': return '📋';
                    case 'deadline_approaching': return '⏰';
                    default: return '📝';
                  }
                };

                const getStatusBadge = (status: string) => {
                  switch (status.toLowerCase()) {
                    case 'completed': return 'bg-green-500/20 text-green-400 border border-green-500/30';
                    case 'pending': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
                    case 'critical': return 'bg-red-500/20 text-red-400 border border-red-500/30';
                    default: return 'bg-white/10 text-white/70 border border-white/20';
                  }
                };
                
                return (
                  <tr key={safeActivity.id} className="hover:bg-white/5 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="text-sm text-white/80 font-medium">
                        {timeDisplay}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-white font-medium">
                          {safeActivity.title}
                        </div>
                        <div className="text-xs text-white/60 mt-0.5 max-w-xs truncate">
                          {safeActivity.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-white/10 text-white/80">
                        {safeActivity.stateCode}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-white font-medium">
                          {amount}
                        </div>
                        <div className="text-xs text-white/60 mt-0.5">
                          {safeActivity.thresholdAmount ? `Threshold: $${(safeActivity.thresholdAmount / 1000).toFixed(0)}K` : 'No threshold set'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getStatusBadge(safeActivity.status)}`}>
                        {safeActivity.status.charAt(0).toUpperCase() + safeActivity.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className={`px-4 py-2 rounded-md text-xs font-medium transition-colors ${
                        safeActivity.status === 'completed' 
                          ? 'bg-white/10 text-white/50 cursor-not-allowed' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}>
                        {safeActivity.status === 'completed' ? 'Completed' : 'Process'}
                      </button>
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

// Simplified Nexus Activity Table Component
const SimplifiedNexusTable = ({ activities, clients }: { activities: any[], clients: any[] }) => {
  const safeActivities = Array.isArray(activities) ? activities : [];
  const recentActivities = safeActivities.slice(0, 3); // Show only 3 recent activities

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'critical': return 'bg-red-500/20 text-red-400';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400';
      case 'complete': 
      case 'resolved': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (recentActivities.length === 0) {
    return (
      <div className="text-center py-6">
        <div className="w-10 h-10 mx-auto mb-3 bg-white/[0.05] rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-500 text-xs font-light">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {recentActivities.map((activity, index) => {
        const client = clients.find(c => c.id === activity.clientId);
        return (
          <div key={activity.id || index} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl border border-white/5 hover:bg-white/[0.05] transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-light truncate">{activity.type || 'Activity'}</p>
                <p className="text-gray-500 text-xs font-light truncate">{client?.name || 'Client'} • {activity.stateCode || 'N/A'}</p>
              </div>
            </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                {activity.status || 'Unknown'}
              </span>
          </div>
        );
      })}
    </div>
  );
};

export default function TaxManagerDashboard() {
  // Get personalized dashboard context (same as alerts page)
  const { dashboardUrl, isPersonalizedMode, clientName, organizationId } = usePersonalizedDashboard();
  
  // Personalized data hooks (only for client states - not alerts)
  const { data: personalizedClientStates, loading: personalizedClientStatesLoading, error: personalizedClientStatesError } = usePersonalizedClientStates(dashboardUrl || undefined);
  
  // Use EXACT same approach as alerts page for fetching alerts
  // Ensure organizationId is normalized and valid before passing to API
  const alertOrgId = organizationId ? normalizeOrgId(organizationId) : undefined;
  
  const { data: nexusAlertsData, loading: nexusAlertsLoading, error: nexusAlertsError, refetch: refetchNexusAlerts } = useNexusAlerts({ 
    limit: 100,
    organizationId: alertOrgId || undefined
  });
  
  // Debug: Log what we're sending to the API
  console.log('🔍 Alerts API Request Debug:', {
    organizationId,
    alertOrgId,
    isUuid: alertOrgId ? /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(alertOrgId) : false,
    nexusAlertsLoading,
    nexusAlertsError,
    nexusAlertsData
  });
  
  // For other data, use effectiveOrgId with fallback
  const effectiveOrgId = normalizeOrgId(organizationId) || '0e41d0dc-afd0-4e19-9515-71372f5745df';
  const { data: clientsData, loading: clientsLoading, error: clientsError } = useClients({ limit: 50, organizationId: effectiveOrgId });
  const { data: nexusActivitiesData, loading: nexusActivitiesLoading, error: nexusActivitiesError } = useNexusActivities({ limit: 50, organizationId: effectiveOrgId });
  const { data: clientStatesData, loading: clientStatesLoading, error: clientStatesError } = useClientStates({ limit: 100, organizationId: effectiveOrgId });
  const { data: dashboardSummaryData, loading: dashboardSummaryLoading, error: dashboardSummaryError } = useNexusDashboardSummary(effectiveOrgId);
  const { data: organizationData, loading: organizationLoading } = useOrganization(effectiveOrgId);

  // Always use clientsData for clients array (not client states!)
  // Client states are for compliance/monitoring, clients are for revenue/statistics
  const clients = (clientsData?.clients && clientsData.clients.length > 0) ? clientsData.clients : [];
  
  // Process alerts data - use EXACT same logic as alerts page
  const nexusAlerts = useMemo(() => {
    if (nexusAlertsLoading) {
      return [];
    }

    // Use API data only; same approach as alerts page
    // alertsData should have an 'alerts' property based on the API response structure
    const apiAlerts = nexusAlertsData?.alerts || [];
    
    // Debug logging
    console.log('🔍 Nexus Alerts Processing (same as alerts page):', {
      nexusAlertsLoading,
      nexusAlertsError,
      nexusAlertsData: nexusAlertsData,
      hasAlerts: !!nexusAlertsData?.alerts,
      alertsLength: apiAlerts.length,
      sampleAlert: apiAlerts[0],
      organizationId: organizationId,
      fullNexusAlertsData: nexusAlertsData
    });
    
    return apiAlerts;
  }, [nexusAlertsData, nexusAlertsLoading, nexusAlertsError, organizationId]);
  
  const nexusActivities = nexusActivitiesData?.activities || [];
  
  // Use personalized client states if in personalized mode, otherwise use regular client states
  const clientStates = useMemo(() => {
    if (isPersonalizedMode && personalizedClientStates && personalizedClientStates.length > 0) {
      return personalizedClientStates;
    }
    return clientStatesData?.clientStates || [];
  }, [isPersonalizedMode, personalizedClientStates, clientStatesData]);
  
  // Debug logging for data structure (simplified - no personalized alerts)
  console.log('🔍 Main Dashboard Data Debug:', {
    isPersonalizedMode,
    organizationId,
    effectiveOrgId,
    nexusAlertsData: nexusAlertsData,
    nexusAlerts: nexusAlerts,
    nexusAlertsLength: nexusAlerts?.length,
    clientsLength: clients?.length,
    nexusActivitiesLength: nexusActivities?.length,
    // API loading states
    nexusAlertsLoading,
    nexusAlertsError,
    // Raw API responses - expanded
    rawNexusAlertsData: nexusAlertsData ? {
      alerts: nexusAlertsData.alerts,
      total: nexusAlertsData.total,
      limit: nexusAlertsData.limit,
      offset: nexusAlertsData.offset,
      fullData: nexusAlertsData
    } : null,
    // Client data debug
    clientsData: clientsData ? {
      clients: clientsData.clients?.length || 0,
      total: clientsData.total,
      fullData: clientsData
    } : null,
    clientsError: clientsError,
    clientsLoading: clientsLoading,
    // Alert data structure check
    alertsStructure: nexusAlerts?.map(a => ({
      id: a.id,
      hasTitle: !!a.title,
      hasAlertType: !!a.alertType,
      priority: a.priority,
      status: a.status
    })),
    // API Error details
    apiErrorDetails: {
      nexusAlertsError,
      clientsError
    }
  });
  
  const dashboardSummary = dashboardSummaryData || {};

  // Loading states - always check clients loading since we need it for revenue/statistics
  const isLoading = isPersonalizedMode 
    ? (personalizedClientStatesLoading || clientsLoading || nexusAlertsLoading)
    : (clientsLoading || nexusAlertsLoading || nexusActivitiesLoading || clientStatesLoading || dashboardSummaryLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="text-white mt-4">
            {isPersonalizedMode ? `Loading ${clientName || 'personalized'} tax manager dashboard...` : 'Loading Tax Manager dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="p-8 space-y-8">
        {/* Apple-inspired Minimalistic Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-white tracking-tight">
              {isPersonalizedMode && clientName 
                ? `${clientName}` 
                : organizationData?.name 
                  ? `${organizationData.name} - Tax Manager`
                  : 'Tax Manager'
              }
            </h1>
            <p className="text-gray-500 text-sm font-light mt-1">Nexus monitoring and compliance</p>
          </div>
          <div className="flex items-center space-x-8">
            <div className="text-right">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Clients</p>
              <p className="text-white text-2xl font-light">{clients.length}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Alerts</p>
              <p className="text-white text-2xl font-light">{nexusAlerts.length}</p>
            </div>
            {isPersonalizedMode && (
              <div className="px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20">
                <span className="text-blue-400 text-sm font-medium">Personalized</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Section Top */}
        <div className="flex flex-col gap-4">
          <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-8 justify-center w-full">
            <CardTotalRevenue analytics={[]} clients={clients} />
            <CardTotalClients clients={clients} />
            <CardComplianceRate alerts={nexusAlerts} clientStates={clientStates} />
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
                href="/monitoring"
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
              {clientStates.length > 0 ? (
                <EnhancedUSMap clientStates={clientStates} nexusAlerts={nexusAlerts} />
              ) : (
                <div className="flex items-center justify-center h-80">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white/[0.05] rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm font-light">No nexus data available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Priority Alerts - Right Column */}
          <div className="h-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-8 bg-red-500 rounded-full"></div>
                <h2 className="text-xl font-light text-white tracking-tight">Priority Alerts</h2>
              </div>
              <Link
                href="/dashboard/tax-manager/alerts"
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
              <CardPriorityAlerts alerts={nexusAlerts} clients={clients} />
            </div>
          </div>
        </div>

        {/* Show message when no data is available */}
        {nexusAlerts.length === 0 && nexusActivities.length === 0 && clientStates.length === 0 && !isLoading && (
          <div className="bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/5 p-12">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-white/[0.05] rounded-3xl flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-light text-white mb-3">No Data Available</h3>
              <p className="text-gray-500 text-sm font-light mb-6">
                Generate a dashboard to populate this page with real nexus monitoring data
              </p>
              <Link
                href="/generate"
                as={NextLink}
                className="inline-flex items-center px-6 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-sm font-medium rounded-2xl border border-blue-500/20 transition-all duration-300"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Generate Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}