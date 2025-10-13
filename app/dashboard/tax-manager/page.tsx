"use client";
import React, { useState, useMemo } from "react";
import { TableWrapper } from "@/components/table/table";
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import NextLink from "next/link";
import { USAMap, USAStateAbbreviation, StateAbbreviations } from '@mirawision/usa-map-react';
import { useClients, useAlerts, useAnalytics, useTasks, useNexusAlerts, useNexusActivities, useClientStates, useNexusDashboardSummary } from "@/hooks/useApi";
import { usePersonalizedDashboard } from "@/contexts/PersonalizedDashboardContext";
import { usePersonalizedClientStates, usePersonalizedNexusAlerts } from "@/hooks/usePersonalizedData";

// This will be populated with real data from clientStates

// Enhanced US Map Component - Matching monitoring page implementation
const EnhancedUSMap = ({ clientStates, nexusAlerts }: { clientStates: any[], nexusAlerts: any[] }) => {
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
          stroke: selectedState === state ? '#60a5fa' : defaultStrokeColor,
          strokeWidth: selectedState === state ? 4 : 1,
          onClick: () => handleMapStateClick(state),
          onHover: (event: any) => handleMapStateHover(state, event),
          onLeave: () => handleMapStateLeave(),
          label: labelConfig,
        };
      }
    });

    return settings;
  }, [selectedState, nexusData]);

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
            </div>
          </div>
        </div>
      )}
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-xl border border-white/10 p-4">
        <h4 className="text-white font-medium text-sm mb-3">Status Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-white text-xs">Critical</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-white text-xs">Warning</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-white text-xs">Pending</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
            <span className="text-white text-xs">In Transit</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-white text-xs">Compliant</span>
          </div>
        </div>
      </div>
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

const CardPriorityAlerts = ({ alerts, clients }: { alerts: any[], clients: any[] }) => {
  // Ensure alerts is always an array
  const safeAlerts = Array.isArray(alerts) ? alerts : [];
  const priorityAlerts = safeAlerts.slice(0, 3);
  
  // Debug logging
  console.log('🔍 CardPriorityAlerts Debug:', {
    alertsType: typeof alerts,
    alertsIsArray: Array.isArray(alerts),
    alertsLength: alerts?.length,
    safeAlertsLength: safeAlerts.length,
    priorityAlertsLength: priorityAlerts.length,
    sampleAlert: safeAlerts[0],
    clientsLength: clients?.length,
    allAlerts: safeAlerts.map(alert => ({
      id: alert.id,
      title: alert.title,
      description: alert.description,
      priority: alert.priority,
      stateCode: alert.stateCode,
      alertType: alert.alertType,
      currentAmount: alert.currentAmount,
      thresholdAmount: alert.thresholdAmount,
      clientId: alert.clientId
    }))
  });
  
  // Use only real alerts from database - no fallback data
  const alertsToUse = priorityAlerts;
  
  
  // Use only real alerts from database - no fallback data
  const finalAlertsToUse = alertsToUse;

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
  <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-white font-semibold text-lg tracking-tight">Priority Alerts</h3>
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${finalAlertsToUse.length > 0 ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
      </div>
    </div>
    
    {finalAlertsToUse.length === 0 ? (
      <div className="text-center py-8">
        <div className="w-12 h-12 mx-auto mb-3 bg-gray-700 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h4 className="text-white font-medium mb-2">No Priority Alerts</h4>
        <p className="text-gray-400 text-sm">All systems are operating normally</p>
      </div>
    ) : (
      <div className="space-y-3">
        {finalAlertsToUse.map((alert, index) => {
          const client = clients.find(c => c.id === alert.clientId);
          const currentAmount = alert.currentAmount ? parseFloat(alert.currentAmount) : 0;
          const thresholdAmount = alert.thresholdAmount ? parseFloat(alert.thresholdAmount) : 0;
          const amount = currentAmount > 0 ? `$${(currentAmount / 1000).toFixed(0)}K` : 'N/A';
          const threshold = thresholdAmount > 0 ? `$${(thresholdAmount / 1000).toFixed(0)}K` : 'N/A';
          
          return (
            <div key={alert.id || `alert-${index}`} className={`group backdrop-blur-sm rounded-xl border p-4 hover:bg-opacity-15 transition-all duration-200 ${getPriorityColor(alert.priority)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getPriorityColor(alert.priority)}`}>
                    {getAlertTypeIcon(alert.alertType)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white text-sm">{client?.name || 'Unknown Client'}</p>
                    <p className="text-xs text-gray-300 mb-1">{alert.title || alert.description || 'No description'}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <span>State: {alert.stateCode}</span>
                      <span>Amount: {amount}</span>
                      {thresholdAmount > 0 && <span>Threshold: {threshold}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-2 py-1 text-white text-xs font-medium rounded-full ${alert.priority === 'high' ? 'bg-red-500' : alert.priority === 'medium' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                    {getPriorityBadge(alert.priority)}
                  </span>
                  {alert.deadline && (
                    <span className="text-xs text-gray-400">
                      Due: {new Date(alert.deadline).toLocaleDateString()}
                    </span>
                  )}
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

const CardStateAnalysis = ({ alerts, clientStates }: { alerts: any[], clientStates: any[] }) => {
  // Generate real data from clientStates
  const stateData = useMemo(() => {
    const stateMap: Record<string, { revenue: number; segments: number[] }> = {};
    
    // Process client states to aggregate revenue by state
    clientStates.forEach(clientState => {
      const stateCode = clientState.stateCode;
      const revenue = clientState.currentAmount || 0;
      
      if (!stateMap[stateCode]) {
        stateMap[stateCode] = {
          revenue: 0,
          segments: [0, 0, 0, 0, 0] // Initialize segments for different tax types
        };
      }
      
      stateMap[stateCode].revenue += revenue;
      
      // Distribute revenue across segments based on status
      const segmentIndex = clientState.status === 'critical' ? 0 :
                          clientState.status === 'warning' ? 1 :
                          clientState.status === 'pending' ? 2 :
                          clientState.status === 'transit' ? 3 : 4;
      stateMap[stateCode].segments[segmentIndex] += revenue;
    });
    
    // Convert to array and sort by revenue
    return Object.entries(stateMap)
      .map(([state, data]) => ({
        state,
        revenue: data.revenue,
        segments: data.segments
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 12); // Top 12 states
  }, [clientStates]);

  const maxRevenue = Math.max(...stateData.map(d => d.revenue));
  const colors = ['#EC4899', '#F472B6', '#60A5FA', '#06B6D4', '#10B981'];

  return (
    <div className="bg-black rounded-2xl border border-white/10 p-4">
      {/* Header with Title and Filters */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-bold text-sm">Top 12 States</h3>
        <div className="flex gap-2">
          <div className="flex items-center bg-white/10 rounded-lg px-2 py-1">
            <span className="text-white text-xs mr-1">Revenue</span>
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div className="flex items-center bg-white/10 rounded-lg px-2 py-1">
            <span className="text-white text-xs mr-1">This Month</span>
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Compact Chart Container */}
      <div className="relative h-48 w-full">
        <svg className="w-full h-full" viewBox="0 0 600 180">
          {/* Y-axis labels (Revenue thresholds) */}
          {[0, 1, 2, 3, 4, 5, 6].map((value) => (
            <text
              key={value}
              x="10"
              y={160 - (value * 25)}
              className="fill-white text-xs"
              style={{ fontSize: '10px' }}
            >
              {value}k
            </text>
          ))}

          {/* Horizontal grid lines */}
          {[0, 1, 2, 3, 4, 5, 6].map((value) => (
            <line
              key={`grid-${value}`}
              x1="30"
              y1={160 - (value * 25)}
              x2="580"
              y2={160 - (value * 25)}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
            />
          ))}

          {/* Stacked bars */}
          {stateData.map((state, index) => {
            const x = 40 + (index * 45);
            let currentY = 160;
            
            return (
              <g key={state.state}>
                {state.segments.map((segment, segIndex) => {
                  const segmentHeight = (segment / 1000) * 25; // Convert to k scale
                  const y = currentY - segmentHeight;
                  
                  const rect = (
                    <rect
                      key={segIndex}
                      x={x}
                      y={y}
                      width="30"
                      height={segmentHeight}
                      fill={colors[segIndex]}
                      rx="2"
                      ry="2"
                    />
                  );
                  
                  currentY = y;
                  return rect;
                })}
              </g>
            );
          })}

          {/* X-axis labels (States) */}
          {stateData.map((state, index) => {
            const x = 40 + (index * 45) + 15;
            return (
              <text
                key={state.state}
                x={x}
                y="175"
                textAnchor="middle"
                className="fill-white text-xs"
                style={{ fontSize: '10px' }}
              >
                {state.state}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-3 justify-center">
        {[
          { color: '#EC4899', label: 'Critical' },
          { color: '#F472B6', label: 'Warning' },
          { color: '#60A5FA', label: 'Pending' },
          { color: '#06B6D4', label: 'In Transit' },
          { color: '#10B981', label: 'Compliant' }
        ].map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-white text-xs">{item.label}</span>
          </div>
        ))}
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

export default function TaxManagerDashboard() {
  // Get personalized dashboard context
  const { dashboardUrl, isPersonalizedMode, clientName, organizationId } = usePersonalizedDashboard();
  
  // Personalized data hooks
  const { data: personalizedClientStates, loading: personalizedClientStatesLoading, error: personalizedClientStatesError } = usePersonalizedClientStates(dashboardUrl || undefined);
  const { data: personalizedNexusAlerts, loading: personalizedNexusAlertsLoading, error: personalizedNexusAlertsError } = usePersonalizedNexusAlerts(dashboardUrl || undefined);
  
  // Regular data hooks (used when not in personalized mode) - fetch more data for comprehensive view
  const { data: clientsData, loading: clientsLoading, error: clientsError } = useClients({ limit: 50, organizationId: organizationId || 'demo-org-id' });
  const { data: nexusAlertsData, loading: nexusAlertsLoading, error: nexusAlertsError } = useNexusAlerts({ limit: 50, organizationId: organizationId || 'demo-org-id' });
  const { data: nexusActivitiesData, loading: nexusActivitiesLoading, error: nexusActivitiesError } = useNexusActivities({ limit: 50, organizationId: organizationId || 'demo-org-id' });
  const { data: clientStatesData, loading: clientStatesLoading, error: clientStatesError } = useClientStates({ limit: 100, organizationId: organizationId || 'demo-org-id' });
  const { data: dashboardSummaryData, loading: dashboardSummaryLoading, error: dashboardSummaryError } = useNexusDashboardSummary(organizationId || 'demo-org-id');

  // Use personalized data if available, otherwise use regular data
  const clients = isPersonalizedMode ? (personalizedClientStates || []) : (clientsData?.clients || []);
  const nexusAlerts = isPersonalizedMode ? 
    (Array.isArray(personalizedNexusAlerts) ? personalizedNexusAlerts : ((personalizedNexusAlerts as any)?.alerts || [])) : 
    (nexusAlertsData?.alerts || []);
  const nexusActivities = nexusActivitiesData?.activities || [];
  
  // Debug the personalized data structure
  console.log('🔍 Personalized Data Structure Debug:', {
    personalizedNexusAlerts,
    personalizedNexusAlertsType: typeof personalizedNexusAlerts,
    personalizedNexusAlertsKeys: personalizedNexusAlerts ? Object.keys(personalizedNexusAlerts) : 'null',
    personalizedClientStates,
    personalizedClientStatesType: typeof personalizedClientStates,
    personalizedClientStatesKeys: personalizedClientStates ? Object.keys(personalizedClientStates) : 'null'
  });
  
  // Debug logging for data structure
  console.log('🔍 Main Dashboard Data Debug:', {
    isPersonalizedMode,
    nexusAlertsData: nexusAlertsData,
    personalizedNexusAlerts: personalizedNexusAlerts,
    nexusAlerts: nexusAlerts,
    nexusAlertsLength: nexusAlerts?.length,
    clientsLength: clients?.length,
    nexusActivitiesLength: nexusActivities?.length,
    // API loading states
    nexusAlertsLoading,
    nexusAlertsError,
    personalizedNexusAlertsLoading,
    personalizedNexusAlertsError,
    // Raw API responses
    rawNexusAlertsData: nexusAlertsData,
    rawPersonalizedNexusAlerts: personalizedNexusAlerts
  });
  
  // Use ONLY real backend data - no mock data
  const clientStates = clientStatesData?.clientStates || [];
  
  const dashboardSummary = dashboardSummaryData || {};

  // Loading states
  const isLoading = isPersonalizedMode 
    ? (personalizedClientStatesLoading || personalizedNexusAlertsLoading)
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
    <div className="h-full lg:px-6">
        <div className="flex justify-center gap-2 xl:gap-[10px] pt-2 px-4 lg:px-0 flex-wrap xl:flex-nowrap max-w-[90rem] mx-auto w-full">
          <div className="mt-6 gap-8 flex flex-col w-full">
          {/* Card Section Top */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">
                  {isPersonalizedMode && clientName ? `${clientName} - Nexus Monitoring Overview` : 'Nexus Monitoring Overview'}
                </h2>
                {isPersonalizedMode && (
                  <div className="ml-4 px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">
                    <span className="text-blue-400 text-sm font-medium">Personalized View</span>
                  </div>
                )}
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-6 justify-center w-full">
              <CardActiveAlerts alerts={nexusAlerts} />
              <CardThresholdMonitoring alerts={nexusAlerts} />
              <CardResolvedToday activities={nexusActivities} />
            </div>
            
            {/* Show message when no data is available */}
            {nexusAlerts.length === 0 && nexusActivities.length === 0 && clientStates.length === 0 && !isLoading && (
              <div className="mt-6 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gray-700 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">No Data Available</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Generate a dashboard to populate this page with real nexus monitoring data
                  </p>
                  <Link
                    href="/generate"
                    as={NextLink}
                    className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Generate Dashboard
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* U.S. States Map */}
            <div className="h-full flex flex-col gap-4">
              <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-8 bg-green-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Nexus Client Distribution Map</h2>
                </div>
                <Link
                  href="/dashboard/tax-manager/nexus-monitoring"
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
                {clientStates.length > 0 ? (
                  <EnhancedUSMap clientStates={clientStates} nexusAlerts={nexusAlerts} />
                ) : (
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">No Nexus Data Available</h3>
                      <p className="text-gray-400 text-sm mb-4">
                        Generate a dashboard to see nexus monitoring data on the map
                      </p>
                      <Link
                        href="/generate"
                        as={NextLink}
                        className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Generate Dashboard
                      </Link>
                    </div>
                  </div>
                )}
              </div>
          </div>
        </div>

        {/* Right Section */}
          <div className="mt-4 xl:mt-0 gap-6 flex flex-col xl:max-w-md w-full">
            <div className="flex items-center space-x-3 xl:pt-6">
              <div className="w-1 h-8 bg-orange-500 rounded-full"></div>
              <h2 className="text-2xl font-semibold text-white tracking-tight">Alert Management</h2>
            </div>
            <div className="flex flex-col justify-center gap-6 flex-wrap md:flex-nowrap md:flex-col">
            <CardPriorityAlerts alerts={nexusAlerts} clients={clients} />
            <CardStateAnalysis alerts={nexusAlerts} clientStates={clientStates} />
            
            {/* Debug Panel - Temporary */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-600 p-4">
              <h4 className="text-white font-medium mb-3">Debug Info</h4>
              <div className="text-xs text-gray-300 space-y-1">
                <div>Nexus Alerts Length: {nexusAlerts?.length || 0}</div>
                <div>Clients Length: {clients?.length || 0}</div>
                <div>Loading: {nexusAlertsLoading ? 'Yes' : 'No'}</div>
                <div>Error: {nexusAlertsError || 'None'}</div>
                <div>Personalized Mode: {isPersonalizedMode ? 'Yes' : 'No'}</div>
                <div>Personalized Nexus Alerts: {personalizedNexusAlerts ? 'Exists' : 'Null'}</div>
                <div>Personalized Client States: {personalizedClientStates ? 'Exists' : 'Null'}</div>
                <div>Raw Data: {JSON.stringify(nexusAlertsData, null, 2).substring(0, 200)}...</div>
                <div>Personalized Data: {JSON.stringify(personalizedNexusAlerts, null, 2).substring(0, 200)}...</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Recent Nexus Activity */}
        <div className="flex flex-col justify-center w-full py-8 px-4 lg:px-0 max-w-[90rem] mx-auto gap-6">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
              <h2 className="text-2xl font-semibold text-white tracking-tight">Recent Nexus Activity</h2>
            </div>
          <Link
            href="/dashboard/tax-manager/alerts"
            as={NextLink}
              className="group bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 px-4 py-2 text-white hover:bg-white/20 transition-all duration-200 hover:scale-105"
          >
              <span className="text-sm font-medium">View All</span>
              <svg className="w-4 h-4 ml-2 inline-block group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
          </Link>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
            <NexusActivityTable activities={nexusActivities} clients={clients} />
          </div>
        </div>
      </div>
    </div>
  );
}