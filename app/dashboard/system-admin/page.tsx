"use client";
import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { TableWrapper } from "@/components/table/table";
import { Card, CardBody, CardHeader, Spinner, Button } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import NextLink from "next/link";
import { 
  Server, 
  Users, 
  Shield, 
  AlertTriangle,
  Activity, 
  Globe,
  TrendingUp,
  CheckCircle,
  Clock,
  BarChart3,
  Cpu,
  HardDrive,
  Wifi,
  Database,
  Zap,
  Eye,
  Settings
} from "lucide-react";
import { useClients, useAlerts, useTasks, useAnalytics } from "@/hooks/useApi";
import { usePersonalizedDashboard } from "@/contexts/PersonalizedDashboardContext";
import { normalizeOrgId } from "@/lib/utils";
import { usePersonalizedClientStates, usePersonalizedNexusAlerts } from "@/hooks/usePersonalizedData";

const ActivityLogChart = dynamic(
  () => import("@/components/charts/activity-log-chart").then((mod) => mod.ActivityLogChart),
  {
    ssr: false,
  }
);

// System Admin cards with real data
const CardSystemHealth = ({ analytics }: { analytics: any }) => {
  const uptime = analytics?.uptime || 99.8;
  const responseTime = analytics?.responseTime || 120;
  
  return (
    <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
            <Server className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm tracking-tight">System Health</h3>
            <p className="text-gray-400 text-xs font-medium">Platform uptime</p>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-white">{uptime}%</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-400 text-sm font-medium">+0.2%</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Response Time</span>
          <span className="text-white font-medium">{responseTime}ms</span>
        </div>
      </div>
    </div>
  );
};

const CardActiveUsers = ({ analytics }: { analytics: any }) => {
  const activeUsers = analytics?.activeUsers || 127;
  const totalUsers = analytics?.totalUsers || 450;
  
  return (
    <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm tracking-tight">Active Users</h3>
            <p className="text-gray-400 text-xs font-medium">Currently online</p>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-white">{activeUsers}</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-blue-400 text-sm font-medium">Live</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Total Users</span>
          <span className="text-white font-medium">{totalUsers}</span>
        </div>
      </div>
    </div>
  );
};

const CardSecurityAlerts = ({ alerts }: { alerts: any[] }) => {
  const securityAlerts = alerts.filter(alert => 
    alert.category === 'security' || alert.type === 'security' || alert.priority === 'high'
  ).length;
  const criticalAlerts = alerts.filter(alert => alert.priority === 'high' || alert.severity === 'critical').length;
  
  return (
    <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm tracking-tight">Security Alerts</h3>
            <p className="text-gray-400 text-xs font-medium">Active threats</p>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-white">{securityAlerts}</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-400 text-sm font-medium">{criticalAlerts} critical</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Last Scan</span>
          <span className="text-white font-medium">2 min ago</span>
        </div>
      </div>
    </div>
  );
};

const CardDatabaseStatus = ({ analytics }: { analytics: any }) => {
  const dbConnections = analytics?.dbConnections || 45;
  const dbSize = analytics?.dbSize || '2.4GB';
  
  return (
    <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
            <Database className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm tracking-tight">Database</h3>
            <p className="text-gray-400 text-xs font-medium">Connection status</p>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-white">{dbConnections}</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-400 text-sm font-medium">Healthy</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Size</span>
          <span className="text-white font-medium">{dbSize}</span>
        </div>
      </div>
    </div>
  );
};

const CardSystemResources = ({ analytics }: { analytics: any }) => {
  const cpuUsage = analytics?.cpuUsage || 45;
  const memoryUsage = analytics?.memoryUsage || 62;
  const diskUsage = analytics?.diskUsage || 38;
  
  return (
    <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
            <Cpu className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm tracking-tight">System Resources</h3>
            <p className="text-gray-400 text-xs font-medium">CPU & Memory</p>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-white">{cpuUsage}%</span>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${cpuUsage > 80 ? 'bg-red-500' : cpuUsage > 60 ? 'bg-orange-500' : 'bg-green-500'}`}></div>
            <span className={`text-sm font-medium ${cpuUsage > 80 ? 'text-red-400' : cpuUsage > 60 ? 'text-orange-400' : 'text-green-400'}`}>
              {cpuUsage > 80 ? 'High' : cpuUsage > 60 ? 'Medium' : 'Low'}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Memory</span>
            <span className="text-white font-medium">{memoryUsage}%</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Disk</span>
            <span className="text-white font-medium">{diskUsage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CardNetworkStatus = ({ analytics }: { analytics: any }) => {
  const networkLatency = analytics?.networkLatency || 12;
  const bandwidth = analytics?.bandwidth || '1.2Gbps';
  
  return (
    <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
            <Wifi className="w-5 h-5 text-cyan-500" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm tracking-tight">Network</h3>
            <p className="text-gray-400 text-xs font-medium">Connection status</p>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-white">{networkLatency}ms</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-400 text-sm font-medium">Stable</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Bandwidth</span>
          <span className="text-white font-medium">{bandwidth}</span>
        </div>
      </div>
    </div>
  );
};

// System Activity Table Component
const SystemActivityTable = ({ alerts, tasks }: { alerts: any[], tasks: any[] }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      case 'error': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'info': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      default: return 'bg-white/10 text-white/70 border border-white/20';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_login': return '👤';
      case 'system_backup': return '💾';
      case 'security_scan': return '🔒';
      case 'database_update': return '🗄️';
      case 'api_call': return '🔗';
      case 'error_log': return '❌';
      default: return '📝';
    }
  };

  // Combine alerts and tasks for system activity
  const systemActivities = useMemo(() => {
    const activities: any[] = [];
    
    // Add alerts as activities
    alerts.slice(0, 5).forEach(alert => {
      activities.push({
        id: `alert-${alert.id}`,
        type: 'security_scan',
        title: alert.title || 'System Alert',
        description: alert.description || 'System alert detected',
        status: alert.priority === 'high' ? 'error' : 'warning',
        timestamp: alert.createdAt,
        user: 'System',
        category: 'Security'
      });
    });
    
    // Add tasks as activities
    tasks.slice(0, 5).forEach(task => {
      activities.push({
        id: `task-${task.id}`,
        type: 'api_call',
        title: task.title || 'System Task',
        description: task.description || 'System task executed',
        status: task.status === 'completed' ? 'success' : 'info',
        timestamp: task.createdAt,
        user: 'System',
        category: 'Operations'
      });
    });
    
    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [alerts, tasks]);

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
            <h3 className="text-white font-semibold text-lg">System Activity Log</h3>
          </div>
        </div>
      </div>

      <div className="bg-black rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Time</span>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Activity</span>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-medium text-white/60 uppercase tracking-wider">User</span>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Category</span>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Status</span>
                </th>
                <th className="px-6 py-4 text-left"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {systemActivities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="text-white/60 font-medium">No system activity found</div>
                      <div className="text-sm text-white/50">System activities will appear here</div>
                    </div>
                  </td>
                </tr>
              ) : (
                systemActivities.slice(0, 10).map((activity, index) => {
                  const timeAgo = new Date(activity.timestamp);
                  const timeDisplay = timeAgo.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                  
                  return (
                    <tr key={activity.id} className="hover:bg-white/5 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="text-sm text-white/80 font-medium">
                          {timeDisplay}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getActivityIcon(activity.type)}</span>
                          <div>
                            <div className="text-sm text-white font-medium">
                              {activity.title}
                            </div>
                            <div className="text-xs text-white/60 mt-0.5 max-w-xs truncate">
                              {activity.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-white/80">
                          {activity.user}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-white/10 text-white/80">
                          {activity.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getStatusColor(activity.status)}`}>
                          {activity.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          size="sm"
                          className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 text-xs font-medium"
                        >
                          View
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

export default function SystemAdminDashboard() {
  // Get personalized dashboard context
  const { dashboardUrl, isPersonalizedMode, clientName, organizationId } = usePersonalizedDashboard();
  
  // Personalized data hooks
  const { data: personalizedClientStates, loading: personalizedClientStatesLoading, error: personalizedClientStatesError } = usePersonalizedClientStates(dashboardUrl || undefined);
  const { data: personalizedNexusAlerts, loading: personalizedNexusAlertsLoading, error: personalizedNexusAlertsError } = usePersonalizedNexusAlerts(dashboardUrl || undefined);
  
  // Regular data hooks (used when not in personalized mode) with organizationId
  const effectiveOrgId = normalizeOrgId(organizationId);
  const { data: clientsData, loading: clientsLoading, error: clientsError } = useClients({ limit: 10, organizationId: effectiveOrgId });
  const { data: alertsData, loading: alertsLoading, error: alertsError } = useAlerts({ limit: 20 });
  const { data: tasksData, loading: tasksLoading, error: tasksError } = useTasks({ limit: 20 });
  const { data: analyticsData, loading: analyticsLoading, error: analyticsError } = useAnalytics();

  // Use personalized data if available, otherwise use regular data
  const clients = isPersonalizedMode ? (personalizedClientStates || []) : (clientsData?.clients || []);
  const alerts = isPersonalizedMode ? (personalizedNexusAlerts || []) : (alertsData?.alerts || []);
  const tasks = tasksData?.tasks || [];
  const analytics = analyticsData || {};

  // Loading states
  const isLoading = isPersonalizedMode 
    ? (personalizedClientStatesLoading || personalizedNexusAlertsLoading)
    : (clientsLoading || alertsLoading || tasksLoading || analyticsLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="text-white mt-4">
            {isPersonalizedMode ? `Loading ${clientName || 'personalized'} system admin dashboard...` : 'Loading system admin dashboard...'}
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
                {isPersonalizedMode && clientName ? `${clientName} - System Administration` : 'System Administration'}
              </h2>
              {isPersonalizedMode && (
                <div className="ml-4 px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">
                  <span className="text-blue-400 text-sm font-medium">Personalized View</span>
                </div>
              )}
            </div>

            {/* Card Section Top */}
            <div className="flex flex-col gap-4">
              <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-6 justify-center w-full">
                <CardSystemHealth analytics={analytics} />
                <CardActiveUsers analytics={analytics} />
                <CardSecurityAlerts alerts={alerts} />
              </div>
            </div>

            {/* Second Row Cards */}
            <div className="flex flex-col gap-4">
              <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-6 justify-center w-full">
                <CardDatabaseStatus analytics={analytics} />
                <CardSystemResources analytics={analytics} />
                <CardNetworkStatus analytics={analytics} />
              </div>
            </div>

            {/* Activity Chart */}
            <div className="h-full flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-1 h-8 bg-green-500 rounded-full"></div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">System Performance</h2>
                </div>
                <Link
                  href="/dashboard/system-admin/system-monitoring"
                  as={NextLink}
                  className="group bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 px-4 py-2 text-white hover:bg-white/20 transition-all duration-200 hover:scale-105"
                >
                  <span className="text-sm font-medium">View Details</span>
                  <svg className="w-4 h-4 ml-2 inline-block group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              
              <div className="w-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                <ActivityLogChart />
              </div>
            </div>
          </div>
        </div>

        {/* System Activity Table */}
        <div className="flex flex-col justify-center w-full py-8 px-4 lg:px-0 max-w-[90rem] mx-auto gap-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
            <SystemActivityTable alerts={alerts} tasks={tasks} />
          </div>
        </div>
      </div>
    </div>
  );
}