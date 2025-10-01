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
  <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm tracking-tight">Active Alerts</h3>
          <p className="text-gray-400 text-xs font-medium">Critical notifications</p>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-white">{criticalAlerts}</span>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-400 text-sm font-medium">+{newAlerts} new</span>
        </div>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1">
          <div className="bg-red-500 h-1 rounded-full" style={{width: `${Math.min(criticalAlerts * 10, 100)}%`}}></div>
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
  <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm tracking-tight">Threshold Monitoring</h3>
          <p className="text-gray-400 text-xs font-medium">Approaching limits</p>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-white">{thresholdAlerts}</span>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-orange-400 text-sm font-medium">+{approachingThreshold} approaching</span>
        </div>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1">
          <div className="bg-orange-500 h-1 rounded-full" style={{width: `${Math.min(thresholdAlerts * 4, 100)}%`}}></div>
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
  <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm tracking-tight">Resolved Today</h3>
          <p className="text-gray-400 text-xs font-medium">Completed tasks</p>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-white">{resolvedToday}</span>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-400 text-sm font-medium">+{variance} vs yesterday</span>
        </div>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1">
          <div className="bg-green-500 h-1 rounded-full" style={{width: `${Math.min(resolvedToday * 6, 100)}%`}}></div>
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
  const stateAnalysis = alerts.reduce((acc, alert) => {
    if (alert.stateCode) {
      if (!acc[alert.stateCode]) {
        acc[alert.stateCode] = 0;
      }
      acc[alert.stateCode]++;
    }
    return acc;
  }, {} as Record<string, number>);

  const getStateColor = (count: number) => {
    if (count >= 3) return 'text-red-400';
    if (count >= 2) return 'text-orange-400';
    if (count >= 1) return 'text-blue-400';
    return 'text-green-400';
  };

  const getStateWidth = (count: number) => {
    return Math.min(count * 25, 100);
  };

  return (
  <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-white font-semibold text-lg tracking-tight">State Analysis</h3>
      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
    </div>
    <div className="space-y-4">
        {Object.entries(stateAnalysis).slice(0, 4).map(([state, count]) => {
          const alertCount = count as number;
          return (
            <div key={state} className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium text-sm">{state}</span>
                <span className={`text-sm font-medium ${getStateColor(alertCount)}`}>{alertCount} alerts</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full transition-all duration-500 ${alertCount >= 3 ? 'bg-red-500' : alertCount >= 2 ? 'bg-orange-500' : alertCount >= 1 ? 'bg-blue-500' : 'bg-green-500'}`} style={{width: `${getStateWidth(alertCount)}%`}}></div>
        </div>
            </div>
          );
        })}
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
      <Table aria-label="Recent Nexus Activity">
        <TableHeader>
          <TableColumn>TIME</TableColumn>
          <TableColumn>CLIENT</TableColumn>
          <TableColumn>ACTIVITY</TableColumn>
          <TableColumn>STATE</TableColumn>
          <TableColumn>IMPACT</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>ACTIVITY TYPE</TableColumn>
        </TableHeader>
        <TableBody>
          {dataToUse.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <div className="flex flex-col items-center space-y-2">
                  <div className="text-4xl">📊</div>
                  <div className="text-default-500">No nexus activities found</div>
                  <div className="text-sm text-default-400">Activities will appear here as they are processed</div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            dataToUse.slice(0, 8).filter(activity => {
              // More comprehensive validation
              return activity && 
                     typeof activity === 'object' && 
                     activity.id && 
                     (activity.clientId || activity.title || activity.activityType);
            }).map((activity, index) => {
            const client = clients.find(c => c.id === activity.clientId);
            const timeAgo = activity.createdAt ? new Date(activity.createdAt) : new Date();
            const timeDisplay = timeAgo.toLocaleDateString() + ' ' + timeAgo.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            const amount = activity.amount ? `$${(activity.amount / 1000).toFixed(0)}K` : 'N/A';
            
            // Ensure all required properties have default values
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
            
            // Get activity type display name
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

            // Get activity icon
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
            
            return (
              <TableRow key={safeActivity.id}>
              <TableCell>
                <div className="text-sm font-medium text-default-600">
                    {timeDisplay}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-semibold text-default-900">
                    {client?.name || 'Unknown Client'}
                  </div>
                  <div className="text-xs text-default-500">
                    {client?.industry || 'N/A'}
                </div>
              </TableCell>
              <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getActivityIcon(safeActivity.activityType)}</span>
                <div>
                  <div className="font-medium text-default-900">
                        {safeActivity.title}
                  </div>
                  <div className="text-sm text-default-500">
                        {safeActivity.description}
                      </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {safeActivity.stateCode}
                </span>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium text-default-900">
                      {amount}
                  </div>
                  <div className="text-sm text-default-500">
                      {safeActivity.thresholdAmount ? `Threshold: $${(safeActivity.thresholdAmount / 1000).toFixed(0)}K` : 'No threshold set'}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(safeActivity.status)}`}>
                    {safeActivity.status.charAt(0).toUpperCase() + safeActivity.status.slice(1)}
                </span>
              </TableCell>
              <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(safeActivity.activityType)}`}>
                    {getActivityTypeDisplay(safeActivity.activityType)}
                  </span>
              </TableCell>
            </TableRow>
            );
          })
          )}
        </TableBody>
      </Table>
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
  const clientStates = clientStatesData?.clientStates || [];
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
        <div className="flex justify-center gap-6 xl:gap-8 pt-6 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-12 max-w-[90rem] mx-auto w-full">
          <div className="mt-6 gap-8 flex flex-col w-full">
          {/* Card Section Top */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Nexus Monitoring Overview</h2>
                <span className="text-sm text-gray-400">Demo Mode - Real Data</span>
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
          <div className="mt-4 gap-6 flex flex-col xl:max-w-md w-full">
            <div className="flex items-center space-x-3">
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