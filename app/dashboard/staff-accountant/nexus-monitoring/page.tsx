"use client";
import React, { useState, useMemo } from "react";
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
  Avatar,
  Spinner
} from "@nextui-org/react";
import { USAMap, USAStateAbbreviation, StateAbbreviations } from '@mirawision/usa-map-react';
import { useNexusAlerts, useNexusActivities, useClientStates, useClients } from "@/hooks/useApi";

// Enhanced US Map Component for Staff Accountant Nexus Monitoring
const EnhancedUSMap = ({ clientStates, nexusAlerts }: { clientStates: any[], nexusAlerts: any[] }) => {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const handleMapStateClick = (stateCode: string) => {
    if (selectedState === stateCode) {
      setSelectedState(null);
    } else {
      setSelectedState(stateCode);
    }
  };

  // Generate nexus data from real API data
  const nexusData = useMemo(() => {
    const stateData: Record<string, { status: string; clients: number; alerts: number; tasks: number }> = {};
    
    // Process client states
    clientStates.forEach(clientState => {
      const stateCode = clientState.stateCode;
      if (!stateData[stateCode]) {
        stateData[stateCode] = {
          status: clientState.status,
          clients: 1,
          alerts: 0,
          tasks: 0
        };
      } else {
        stateData[stateCode].clients += 1;
        // Update status to most critical if needed
        if (clientState.status === 'critical' || 
            (clientState.status === 'warning' && stateData[stateCode].status !== 'critical')) {
          stateData[stateCode].status = clientState.status;
        }
      }
    });

    // Process nexus alerts by state
    nexusAlerts.forEach(alert => {
      if (alert.stateCode && stateData[alert.stateCode]) {
        stateData[alert.stateCode].alerts += 1;
      }
    });

    return stateData;
  }, [clientStates, nexusAlerts]);

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
              <span className="text-gray-400">Alerts:</span>
              <span className="text-white font-medium">{nexusData[selectedState].alerts}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-xl border border-white/10 p-4">
        <h4 className="text-white font-medium text-sm mb-3">Nexus Status Legend</h4>
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

// Staff Accountant specific cards with real data
const CardNexusAlerts = ({ alerts }: { alerts: any[] }) => {
  const criticalAlerts = alerts.filter(alert => alert.priority === 'high' || alert.severity === 'critical').length;
  const newAlerts = alerts.filter(alert => {
    const alertDate = new Date(alert.createdAt);
    const today = new Date();
    return alertDate.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white">Nexus Alerts</h4>
        </div>
        
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold text-white leading-none">{criticalAlerts}</div>
          <div className="flex items-end space-x-1 h-10">
            {[3, 5, 4, 7, 6, 8, 5].map((height, i) => (
              <div key={i} className={`bg-gradient-to-t from-red-500 to-red-400 w-2 rounded-t-sm`} style={{ height: `${height * 3}px` }}></div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center text-red-400 text-xs">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span>{newAlerts} new today</span>
        </div>
      </div>
    </div>
  );
};

const CardDataProcessing = ({ activities }: { activities: any[] }) => {
  const dataProcessingTasks = activities.filter(activity => 
    activity.activityType === 'data_processed' || activity.activityType === 'data_entry'
  ).length;
  const completedToday = activities.filter(activity => {
    if (!activity.createdAt) return false;
    const activityDate = new Date(activity.createdAt);
    const today = new Date();
    return activity.status === 'completed' && activityDate.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white">Data Processing</h4>
        </div>
        
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold text-white leading-none">{dataProcessingTasks}</div>
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
          <span>{completedToday} completed today</span>
        </div>
      </div>
    </div>
  );
};

const CardThresholdMonitoring = ({ alerts }: { alerts: any[] }) => {
  const thresholdAlerts = alerts.filter(alert => 
    alert.type === 'threshold' || alert.category === 'threshold' || alert.alertType === 'threshold_exceeded'
  ).length;
  const approachingThreshold = alerts.filter(alert => 
    alert.currentAmount && alert.thresholdAmount && 
    (alert.currentAmount / alert.thresholdAmount) > 0.8
  ).length;

  return (
    <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white">Threshold Monitoring</h4>
        </div>
        
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold text-white leading-none">{thresholdAlerts}</div>
          <div className="flex items-end space-x-1 h-10">
            {[4, 6, 3, 8, 5, 7, 4].map((height, i) => (
              <div key={i} className={`bg-gradient-to-t from-orange-500 to-orange-400 w-2 rounded-t-sm`} style={{ height: `${height * 3}px` }}></div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center text-orange-400 text-xs">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span>{approachingThreshold} approaching</span>
        </div>
      </div>
    </div>
  );
};

// Nexus Activity Table Component with real data
const NexusActivityTable = ({ activities, clients }: { activities: any[], clients: any[] }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      case 'in_progress': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'critical': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      default: return 'bg-white/10 text-white/70 border border-white/20';
    }
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

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
            <h3 className="text-white font-semibold text-lg">Recent Nexus Activities</h3>
          </div>
        </div>
      </div>

      <div className="bg-black rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Date</span>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Activity</span>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Client</span>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-medium text-white/60 uppercase tracking-wider">State</span>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Amount</span>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Status</span>
                </th>
                <th className="px-6 py-4 text-left"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {activities.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="text-white/60 font-medium">No nexus activities found</div>
                      <div className="text-sm text-white/50">Activities will appear here as they are processed</div>
                    </div>
                  </td>
                </tr>
              ) : (
                activities.slice(0, 10).map((activity, index) => {
                  const client = clients.find(c => c.id === activity.clientId);
                  const timeAgo = activity.createdAt ? new Date(activity.createdAt) : new Date();
                  const timeDisplay = timeAgo.toLocaleDateString() + ' ' + timeAgo.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                  const amount = activity.amount ? `$${(activity.amount / 1000).toFixed(0)}K` : 'N/A';
                  
                  return (
                    <tr key={activity.id || index} className="hover:bg-white/5 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="text-sm text-white/80 font-medium">
                          {timeDisplay}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getActivityIcon(activity.activityType)}</span>
                          <div>
                            <div className="text-sm text-white font-medium">
                              {getActivityTypeDisplay(activity.activityType)}
                            </div>
                            <div className="text-xs text-white/60 mt-0.5 max-w-xs truncate">
                              {activity.description || 'No description'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Avatar 
                            name={client?.name?.charAt(0) || 'U'} 
                            size="sm"
                            className="bg-blue-500/20 text-blue-400"
                          />
                          <span className="text-sm text-white/80">
                            {client?.name || 'Unknown Client'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-white/10 text-white/80">
                          {activity.stateCode || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white font-medium">
                          {amount}
                        </div>
                        {activity.thresholdAmount && (
                          <div className="text-xs text-white/60 mt-0.5">
                            Threshold: ${(activity.thresholdAmount / 1000).toFixed(0)}K
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getStatusColor(activity.status)}`}>
                          {activity.status?.charAt(0).toUpperCase() + activity.status?.slice(1) || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          size="sm"
                          className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 text-xs font-medium"
                        >
                          Process
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

export default function StaffAccountantNexusMonitoring() {
  const { data: nexusAlertsData, loading: nexusAlertsLoading, error: nexusAlertsError } = useNexusAlerts({ limit: 20 });
  const { data: nexusActivitiesData, loading: nexusActivitiesLoading, error: nexusActivitiesError } = useNexusActivities({ limit: 20 });
  const { data: clientStatesData, loading: clientStatesLoading, error: clientStatesError } = useClientStates({ limit: 50 });
  const { data: clientsData, loading: clientsLoading, error: clientsError } = useClients({ limit: 50 });

  const nexusAlerts = nexusAlertsData?.alerts || [];
  const nexusActivities = nexusActivitiesData?.activities || [];
  const clientStates = clientStatesData?.clientStates || [];
  const clients = clientsData?.clients || [];

  if (nexusAlertsLoading || nexusActivitiesLoading || clientStatesLoading || clientsLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="text-white mt-4">Loading nexus monitoring...</p>
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
                <CardNexusAlerts alerts={nexusAlerts} />
                <CardDataProcessing activities={nexusActivities} />
                <CardThresholdMonitoring alerts={nexusAlerts} />
              </div>
            </div>

            {/* U.S. States Map */}
            <div className="h-full flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-1 h-8 bg-green-500 rounded-full"></div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">Nexus Client Distribution Map</h2>
                </div>
              </div>
              
              <div className="w-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                <EnhancedUSMap clientStates={clientStates} nexusAlerts={nexusAlerts} />
              </div>
            </div>
          </div>
        </div>

        {/* Table Recent Nexus Activity */}
        <div className="flex flex-col justify-center w-full py-8 px-4 lg:px-0 max-w-[90rem] mx-auto gap-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
            <NexusActivityTable activities={nexusActivities} clients={clients} />
          </div>
        </div>
      </div>
    </div>
  );
}