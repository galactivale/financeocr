"use client";
import React, { useState, useMemo } from "react";
import { TableWrapper } from "@/components/table/table";
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import NextLink from "next/link";
import { USAMap, USAStateAbbreviation, StateAbbreviations } from '@mirawision/usa-map-react';
import { useClients, useAlerts, useAnalytics, useTasks, useNexusAlerts, useNexusActivities, useClientStates, useNexusDashboardSummary } from "@/hooks/useApi";

// This will be populated with real data from clientStates

// Enhanced US Map Component
const EnhancedUSMap = ({ clientStates }: { clientStates: any[] }) => {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const handleMapStateClick = (stateCode: string) => {
    if (selectedState === stateCode) {
      setSelectedState(null);
    } else {
      setSelectedState(stateCode);
    }
  };

  // Generate nexus data from clientStates
  const nexusData = useMemo(() => {
    const stateData: Record<string, { status: string; clients: number; revenue: number; alerts: number }> = {};
    
    clientStates.forEach(clientState => {
      const stateCode = clientState.stateCode;
      if (!stateData[stateCode]) {
        stateData[stateCode] = {
          status: clientState.status,
          clients: 1,
          revenue: clientState.currentAmount || 0,
          alerts: 0
        };
      } else {
        stateData[stateCode].clients += 1;
        stateData[stateCode].revenue += clientState.currentAmount || 0;
        // Update status to most critical if needed
        if (clientState.status === 'critical' || 
            (clientState.status === 'warning' && stateData[stateCode].status !== 'critical')) {
          stateData[stateCode].status = clientState.status;
        }
      }
    });

    return stateData;
  }, [clientStates]);

  const customStates = useMemo(() => {
    const settings: any = {};

    StateAbbreviations.forEach((state) => {
      const data = nexusData[state];
      
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
          onHover: () => {},
          onLeave: () => {},
          label: labelConfig,
        };
      } else {
        // Default styling for states without nexus data
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
      
      {/* State Info Tooltip */}
      {selectedState && nexusData[selectedState] && (
        <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-sm rounded-xl border border-white/20 p-4 min-w-[200px]">
          <h4 className="text-white font-semibold text-sm mb-2">{selectedState}</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className={`font-medium ${
                nexusData[selectedState].status === 'critical' ? 'text-red-400' :
                nexusData[selectedState].status === 'warning' ? 'text-orange-400' :
                nexusData[selectedState].status === 'pending' ? 'text-blue-400' :
                'text-green-400'
              }`}>
                {nexusData[selectedState].status.charAt(0).toUpperCase() + nexusData[selectedState].status.slice(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Clients:</span>
              <span className="text-white font-medium">{nexusData[selectedState].clients}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Revenue:</span>
              <span className="text-white font-medium">${(nexusData[selectedState].revenue / 1000).toFixed(0)}K</span>
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
          {[3, 5, 4, 7, 6, 8, 5].map((height, i) => (
            <div key={i} className={`bg-gradient-to-t from-red-500 to-red-400 w-2 rounded-t-sm`} style={{ height: `${height * 3}px` }}></div>
          ))}
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
    alert.type === 'threshold' || alert.category === 'threshold'
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
        <div className="text-2xl font-bold text-white leading-none">11</div>
        <div className="flex items-end space-x-1 h-10">
          {[4, 6, 3, 8, 5, 7, 4].map((height, i) => (
            <div key={i} className={`bg-gradient-to-t from-orange-500 to-orange-400 w-2 rounded-t-sm`} style={{ height: `${height * 3}px` }}></div>
          ))}
        </div>
      </div>
      
      {/* Trend */}
      <div className="flex items-center text-orange-400 text-xs">
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
        <span>Warning trend</span>
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
        <div className="text-2xl font-bold text-white leading-none">23</div>
        <div className="flex items-end space-x-1 h-10">
          {[5, 7, 4, 9, 6, 8, 7].map((height, i) => (
            <div key={i} className={`bg-gradient-to-t from-green-500 to-green-400 w-2 rounded-t-sm`} style={{ height: `${height * 3}px` }}></div>
          ))}
        </div>
      </div>
      
      {/* Trend */}
      <div className="flex items-center text-green-400 text-xs">
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
        <span>Positive trend</span>
      </div>
    </div>
  </div>
);
};

const CardPriorityAlerts = ({ alerts, clients }: { alerts: any[], clients: any[] }) => {
  const priorityAlerts = alerts.slice(0, 3);

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-500/10 border-red-500/20 text-red-400';
      case 'medium': return 'bg-orange-500/10 border-orange-500/20 text-orange-400';
      case 'low': return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/10 border-gray-500/20 text-gray-400';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'CRITICAL';
      case 'medium': return 'HIGH';
      case 'low': return 'PENDING';
      default: return 'INFO';
    }
  };

  return (
  <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-white font-semibold text-lg tracking-tight">Priority Alerts</h3>
      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
    </div>
      <div className="space-y-3">
        {priorityAlerts.map((alert, index) => {
          const client = clients.find(c => c.id === alert.clientId);
          const amount = alert.currentAmount ? `$${(alert.currentAmount / 1000).toFixed(0)}K` : 'N/A';
          
          return (
            <div key={alert.id} className={`group backdrop-blur-sm rounded-xl border p-4 hover:bg-opacity-15 transition-all duration-200 ${getPriorityColor(alert.priority)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getPriorityColor(alert.priority)}`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          <div>
                    <p className="font-medium text-white text-sm">{client?.name || 'Unknown Client'}</p>
                    <p className="text-xs">{alert.description || 'No description'}</p>
            </div>
          </div>
                <span className={`px-2 py-1 text-white text-xs font-medium rounded-full ${alert.priority === 'high' ? 'bg-red-500' : alert.priority === 'medium' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                  {getPriorityBadge(alert.priority)}
          </span>
        </div>
            </div>
          );
        })}
    </div>
  </div>
);
};

const CardStateAnalysis = ({ alerts }: { alerts: any[] }) => {
  // Sample data for the stacked bar chart - states with revenue thresholds
  const stateData = [
    { state: 'CA', revenue: 5800, segments: [1200, 1800, 1500, 800, 500] },
    { state: 'TX', revenue: 4200, segments: [1000, 1200, 1000, 600, 400] },
    { state: 'NY', revenue: 3800, segments: [900, 1100, 900, 500, 400] },
    { state: 'FL', revenue: 3200, segments: [800, 1000, 800, 400, 200] },
    { state: 'IL', revenue: 2800, segments: [700, 900, 700, 300, 200] },
    { state: 'PA', revenue: 2500, segments: [600, 800, 600, 300, 200] },
    { state: 'OH', revenue: 2200, segments: [500, 700, 500, 300, 200] },
    { state: 'GA', revenue: 2000, segments: [400, 600, 500, 300, 200] },
    { state: 'NC', revenue: 1800, segments: [400, 500, 400, 300, 200] },
    { state: 'MI', revenue: 1600, segments: [300, 500, 400, 200, 200] },
    { state: 'NJ', revenue: 1400, segments: [300, 400, 300, 200, 200] },
    { state: 'VA', revenue: 1200, segments: [200, 400, 300, 200, 100] }
  ];

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
          { color: '#EC4899', label: 'Sales Tax' },
          { color: '#F472B6', label: 'Income Tax' },
          { color: '#60A5FA', label: 'Franchise Tax' },
          { color: '#06B6D4', label: 'Property Tax' },
          { color: '#10B981', label: 'Other Fees' }
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
  
  // Debug logging
  console.log('NexusActivityTable - activities:', activities);
  console.log('NexusActivityTable - safeActivities:', safeActivities);
  console.log('NexusActivityTable - safeActivities.length:', safeActivities.length);
  
  // Fallback data for testing
  const fallbackActivities = [
    {
      id: 'fallback-1',
      clientId: 'client-1',
      title: 'Sample Activity',
      description: 'This is a sample activity for testing',
      activityType: 'data_processed',
      stateCode: 'CA',
      amount: 50000,
      thresholdAmount: 500000,
      status: 'completed',
      createdAt: new Date().toISOString()
    }
  ];
  
  // Use fallback data if no real data available
  const dataToUse = safeActivities.length > 0 ? safeActivities : fallbackActivities;
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
  const { data: clientsData, loading: clientsLoading, error: clientsError } = useClients({ limit: 10 });
  const { data: nexusAlertsData, loading: nexusAlertsLoading, error: nexusAlertsError } = useNexusAlerts({ limit: 10 });
  const { data: nexusActivitiesData, loading: nexusActivitiesLoading, error: nexusActivitiesError } = useNexusActivities({ limit: 10 });
  const { data: clientStatesData, loading: clientStatesLoading, error: clientStatesError } = useClientStates({ limit: 10 });
  const { data: dashboardSummaryData, loading: dashboardSummaryLoading, error: dashboardSummaryError } = useNexusDashboardSummary();

  const clients = clientsData?.clients || [];
  const nexusAlerts = nexusAlertsData?.alerts || [];
  const nexusActivities = nexusActivitiesData?.activities || [];
  
  // Focused mock data - 10 key states for clean representation
  const mockClientStates = [
    // Critical states
    { stateCode: 'CA', status: 'critical', currentAmount: 750000, thresholdAmount: 500000, clientId: 'client-1' },
    { stateCode: 'TX', status: 'critical', currentAmount: 650000, thresholdAmount: 500000, clientId: 'client-2' },
    
    // Warning states
    { stateCode: 'NY', status: 'warning', currentAmount: 480000, thresholdAmount: 500000, clientId: 'client-3' },
    { stateCode: 'FL', status: 'warning', currentAmount: 420000, thresholdAmount: 100000, clientId: 'client-4' },
    
    // Pending states
    { stateCode: 'IL', status: 'pending', currentAmount: 180000, thresholdAmount: 500000, clientId: 'client-5' },
    
    // Compliant states (green) - randomly distributed
    { stateCode: 'WA', status: 'compliant', currentAmount: 40000, thresholdAmount: 100000, clientId: 'client-6' },
    { stateCode: 'GA', status: 'compliant', currentAmount: 35000, thresholdAmount: 100000, clientId: 'client-7' },
    { stateCode: 'MI', status: 'compliant', currentAmount: 25000, thresholdAmount: 100000, clientId: 'client-8' },
    { stateCode: 'AZ', status: 'compliant', currentAmount: 20000, thresholdAmount: 100000, clientId: 'client-9' },
    { stateCode: 'NC', status: 'compliant', currentAmount: 15000, thresholdAmount: 100000, clientId: 'client-10' }
  ];
  
  // Use mock data if API data is insufficient, otherwise merge them
  const clientStates = (clientStatesData?.clientStates && clientStatesData.clientStates.length > 0) 
    ? [...clientStatesData.clientStates, ...mockClientStates]
    : mockClientStates;
  
  const dashboardSummary = dashboardSummaryData || {};

  if (clientsLoading || nexusAlertsLoading || nexusActivitiesLoading || clientStatesLoading || dashboardSummaryLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="text-white mt-4">Loading Tax Manager dashboard...</p>
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
                <h2 className="text-2xl font-semibold text-white tracking-tight">Nexus Monitoring Overview</h2>
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-6 justify-center w-full">
              <CardActiveAlerts alerts={nexusAlerts} />
              <CardThresholdMonitoring alerts={nexusAlerts} />
              <CardResolvedToday activities={nexusActivities} />
            </div>
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
                <EnhancedUSMap clientStates={clientStates} />
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
            <CardStateAnalysis alerts={nexusAlerts} />
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