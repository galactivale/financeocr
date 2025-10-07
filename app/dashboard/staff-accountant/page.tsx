"use client";
import React, { useState, useMemo } from "react";
import { TableWrapper } from "@/components/table/table";
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import NextLink from "next/link";
import { USAMap, USAStateAbbreviation, StateAbbreviations } from '@mirawision/usa-map-react';
import { useClients, useTasks, useAlerts, useNexusAlerts, useNexusActivities, useClientStates } from "@/hooks/useApi";

// Enhanced US Map Component for Staff Accountants
const EnhancedUSMap = ({ clientStates, tasks }: { clientStates: any[], tasks: any[] }) => {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const handleMapStateClick = (stateCode: string) => {
    if (selectedState === stateCode) {
      setSelectedState(null);
    } else {
      setSelectedState(stateCode);
    }
  };

  // Generate task data from real API data
  const taskData = useMemo(() => {
    const stateData: Record<string, { status: string; tasks: number; clients: number; alerts: number }> = {};
    
    // Process client states
    clientStates.forEach(clientState => {
      const stateCode = clientState.stateCode;
      if (!stateData[stateCode]) {
        stateData[stateCode] = {
          status: clientState.status,
          tasks: 0,
          clients: 1,
          alerts: 0
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

    // Process tasks by state
    tasks.forEach(task => {
      if (task.stateCode && stateData[task.stateCode]) {
        stateData[task.stateCode].tasks += 1;
      }
    });

    return stateData;
  }, [clientStates, tasks]);

  const customStates = useMemo(() => {
    const settings: any = {};

    StateAbbreviations.forEach((state) => {
      const data = taskData[state];
      
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
  }, [selectedState, taskData]);

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
      {selectedState && taskData[selectedState] && (
        <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-sm rounded-xl border border-white/20 p-4 min-w-[200px]">
          <h4 className="text-white font-semibold text-sm mb-2">{selectedState}</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className={`font-medium ${
                taskData[selectedState].status === 'critical' ? 'text-red-400' :
                taskData[selectedState].status === 'warning' ? 'text-orange-400' :
                taskData[selectedState].status === 'pending' ? 'text-blue-400' :
                'text-green-400'
              }`}>
                {taskData[selectedState].status.charAt(0).toUpperCase() + taskData[selectedState].status.slice(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tasks:</span>
              <span className="text-white font-medium">{taskData[selectedState].tasks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Clients:</span>
              <span className="text-white font-medium">{taskData[selectedState].clients}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-xl border border-white/10 p-4">
        <h4 className="text-white font-medium text-sm mb-3">Task Status Legend</h4>
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
const CardPendingTasks = ({ tasks }: { tasks: any[] }) => {
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < new Date() && task.status !== 'completed';
  }).length;

  return (
    <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
    <div className="space-y-3">
      <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white">Pending Tasks</h4>
        </div>
        
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold text-white leading-none">{pendingTasks}</div>
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
          <span>{overdueTasks} overdue</span>
        </div>
      </div>
    </div>
  );
};

const CardCompletedToday = ({ tasks }: { tasks: any[] }) => {
  const today = new Date();
  const completedToday = tasks.filter(task => {
    if (!task.completedAt) return false;
    const completedDate = new Date(task.completedAt);
    return completedDate.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
    <div className="space-y-3">
      <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white">Completed Today</h4>
        </div>
        
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold text-white leading-none">{completedToday}</div>
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
          <span>Good progress</span>
      </div>
      </div>
      </div>
);
};

const CardDataEntryQueue = ({ tasks }: { tasks: any[] }) => {
  const dataEntryTasks = tasks.filter(task => 
    task.category === 'data_entry' || task.type === 'data_entry'
  ).length;

  return (
    <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white">Data Entry Queue</h4>
        </div>
        
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold text-white leading-none">{dataEntryTasks}</div>
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
          <span>Awaiting processing</span>
      </div>
    </div>
  </div>
);
};

// Task Table Component with real data
const TaskTable = ({ tasks, clients }: { tasks: any[], clients: any[] }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      case 'in_progress': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'overdue': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      default: return 'bg-white/10 text-white/70 border border-white/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
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
            <h3 className="text-white font-semibold text-lg">Recent Tasks</h3>
          </div>
          <Link
            href="/dashboard/staff-accountant/task-management"
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
                  <button className="flex items-center space-x-1 text-xs font-medium text-white/60 uppercase tracking-wider hover:text-white/80">
                    <span>Task</span>
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button className="flex items-center space-x-1 text-xs font-medium text-white/60 uppercase tracking-wider hover:text-white/80">
                    <span>Client</span>
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button className="flex items-center space-x-1 text-xs font-medium text-white/60 uppercase tracking-wider hover:text-white/80">
                    <span>Priority</span>
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button className="flex items-center space-x-1 text-xs font-medium text-white/60 uppercase tracking-wider hover:text-white/80">
                    <span>Status</span>
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button className="flex items-center space-x-1 text-xs font-medium text-white/60 uppercase tracking-wider hover:text-white/80">
                    <span>Due Date</span>
                  </button>
                </th>
                <th className="px-6 py-4 text-left"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="text-white/60 font-medium">No tasks found</div>
                      <div className="text-sm text-white/50">Tasks will appear here as they are assigned</div>
                    </div>
                  </td>
                </tr>
              ) : (
                tasks.slice(0, 8).map((task, index) => {
                  const client = clients.find(c => c.id === task.clientId);
                  const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date';
                  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
                  
                  return (
                    <tr key={task.id || index} className="hover:bg-white/5 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm text-white font-medium">
                            {task.title || 'Untitled Task'}
                          </div>
                          <div className="text-xs text-white/60 mt-0.5 max-w-xs truncate">
                            {task.description || 'No description'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-white/80">
                          {client?.name || 'Unknown Client'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority?.toUpperCase() || 'MEDIUM'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getStatusColor(isOverdue ? 'overdue' : task.status)}`}>
                          {isOverdue ? 'OVERDUE' : (task.status?.toUpperCase() || 'PENDING')}
          </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white/80">
                          {dueDate}
          </div>
                      </td>
                      <td className="px-6 py-4">
                        <button className={`px-4 py-2 rounded-md text-xs font-medium transition-colors ${
                          task.status === 'completed' 
                            ? 'bg-white/10 text-white/50 cursor-not-allowed' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}>
                          {task.status === 'completed' ? 'Completed' : 'Start'}
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

export default function StaffAccountantDashboard() {
  const { data: clientsData, loading: clientsLoading, error: clientsError } = useClients({ limit: 10 });
  const { data: tasksData, loading: tasksLoading, error: tasksError } = useTasks({ limit: 20 });
  const { data: alertsData, loading: alertsLoading, error: alertsError } = useAlerts({ limit: 10 });
  const { data: clientStatesData, loading: clientStatesLoading, error: clientStatesError } = useClientStates({ limit: 50 });

  const clients = clientsData?.clients || [];
  const tasks = tasksData?.tasks || [];
  const alerts = alertsData?.alerts || [];
  const clientStates = clientStatesData?.clientStates || [];

  if (clientsLoading || tasksLoading || alertsLoading || clientStatesLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="text-white mt-4">Loading Staff Accountant dashboard...</p>
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
                <h2 className="text-2xl font-semibold text-white tracking-tight">Task Management Overview</h2>
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-6 justify-center w-full">
                <CardPendingTasks tasks={tasks} />
                <CardCompletedToday tasks={tasks} />
                <CardDataEntryQueue tasks={tasks} />
              </div>
          </div>

          {/* U.S. States Map */}
            <div className="h-full flex flex-col gap-4">
              <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-8 bg-green-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Task Distribution Map</h2>
                </div>
                <Link
                  href="/dashboard/staff-accountant/nexus-monitoring"
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
                <EnhancedUSMap clientStates={clientStates} tasks={tasks} />
              </div>
            </div>
          </div>
        </div>

        {/* Task Table */}
        <div className="flex flex-col justify-center w-full py-8 px-4 lg:px-0 max-w-[90rem] mx-auto gap-6">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
              <h2 className="text-2xl font-semibold text-white tracking-tight">Recent Tasks</h2>
            </div>
        </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
            <TaskTable tasks={tasks} clients={clients} />
          </div>
        </div>
      </div>
    </div>
  );
}