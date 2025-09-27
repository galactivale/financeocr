"use client";
import React, { useState, useMemo } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { 
  Activity, 
  Server, 
  Users, 
  Shield, 
  Database, 
  Globe,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown
} from "lucide-react";

interface ActivityLogEntry {
  id: string;
  timestamp: string;
  type: "system" | "security" | "user" | "integration" | "maintenance";
  severity: "info" | "warning" | "error" | "critical";
  message: string;
  details: string;
  user?: string;
  system?: string;
  impact: "low" | "medium" | "high";
}

const activityData: ActivityLogEntry[] = [
  {
    id: "1",
    timestamp: "2024-11-28T15:45:00Z",
    type: "system",
    severity: "error",
    message: "Database query performance degraded",
    details: "Average response time exceeded 2s threshold",
    system: "Primary Database",
    impact: "high"
  },
  {
    id: "2",
    timestamp: "2024-11-28T15:30:00Z",
    type: "security",
    severity: "warning",
    message: "Unusual authentication pattern detected",
    details: "Multiple failed login attempts from suspicious IPs",
    user: "Security System",
    impact: "medium"
  },
  {
    id: "3",
    timestamp: "2024-11-28T15:15:00Z",
    type: "user",
    severity: "info",
    message: "New tenant onboarded successfully",
    details: "Metro Tax Services - 12 users provisioned",
    user: "System Admin",
    impact: "low"
  },
  {
    id: "4",
    timestamp: "2024-11-28T15:00:00Z",
    type: "integration",
    severity: "warning",
    message: "QuickBooks API rate limit approaching",
    details: "Usage at 85% of daily limit",
    system: "QuickBooks Integration",
    impact: "medium"
  },
  {
    id: "5",
    timestamp: "2024-11-28T14:45:00Z",
    type: "maintenance",
    severity: "info",
    message: "Scheduled backup completed",
    details: "Daily backup verification successful",
    system: "Backup System",
    impact: "low"
  },
  {
    id: "6",
    timestamp: "2024-11-28T14:30:00Z",
    type: "system",
    severity: "info",
    message: "System health check passed",
    details: "All core services operational",
    system: "Health Monitor",
    impact: "low"
  },
  {
    id: "7",
    timestamp: "2024-11-28T14:15:00Z",
    type: "security",
    severity: "info",
    message: "Security patch deployed",
    details: "Critical security updates applied successfully",
    user: "DevOps Team",
    impact: "low"
  },
  {
    id: "8",
    timestamp: "2024-11-28T14:00:00Z",
    type: "integration",
    severity: "error",
    message: "Thomson Reuters API timeout",
    details: "Connection timeout after 30s, retrying",
    system: "Thomson Reuters",
    impact: "high"
  },
  {
    id: "9",
    timestamp: "2024-11-28T13:45:00Z",
    type: "user",
    severity: "info",
    message: "User session expired",
    details: "Admin session timeout after 8 hours",
    user: "System Admin",
    impact: "low"
  },
  {
    id: "10",
    timestamp: "2024-11-28T13:30:00Z",
    type: "system",
    severity: "warning",
    message: "Memory usage elevated",
    details: "Application servers at 85% memory utilization",
    system: "Application Servers",
    impact: "medium"
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "system": return <Server className="w-4 h-4" />;
    case "security": return <Shield className="w-4 h-4" />;
    case "user": return <Users className="w-4 h-4" />;
    case "integration": return <Globe className="w-4 h-4" />;
    case "maintenance": return <Database className="w-4 h-4" />;
    default: return <Activity className="w-4 h-4" />;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical": return "text-red-500 bg-red-500/10 border-red-500/20";
    case "error": return "text-red-400 bg-red-500/10 border-red-500/20";
    case "warning": return "text-orange-400 bg-orange-500/10 border-orange-500/20";
    case "info": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    default: return "text-gray-400 bg-gray-500/10 border-gray-500/20";
  }
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case "high": return "text-red-400";
    case "medium": return "text-orange-400";
    case "low": return "text-green-400";
    default: return "text-gray-400";
  }
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export const ActivityLogChart = () => {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");

  const filteredActivities = useMemo(() => {
    return activityData.filter(activity => {
      const typeMatch = selectedType === "all" || activity.type === selectedType;
      const severityMatch = selectedSeverity === "all" || activity.severity === selectedSeverity;
      return typeMatch && severityMatch;
    });
  }, [selectedType, selectedSeverity]);

  const activityStats = useMemo(() => {
    const stats = {
      total: activityData.length,
      critical: activityData.filter(a => a.severity === "critical").length,
      errors: activityData.filter(a => a.severity === "error").length,
      warnings: activityData.filter(a => a.severity === "warning").length,
      info: activityData.filter(a => a.severity === "info").length
    };
    return stats;
  }, []);

  return (
    <div className="w-full h-full">
      {/* Activity Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-medium">Total Events</p>
              <p className="text-white text-2xl font-bold">{activityStats.total}</p>
            </div>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-400 text-xs font-medium">Critical</p>
              <p className="text-white text-2xl font-bold">{activityStats.critical}</p>
            </div>
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-400 text-xs font-medium">Errors</p>
              <p className="text-white text-2xl font-bold">{activityStats.errors}</p>
            </div>
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-400 text-xs font-medium">Warnings</p>
              <p className="text-white text-2xl font-bold">{activityStats.warnings}</p>
            </div>
            <Clock className="w-5 h-5 text-orange-400" />
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-xs font-medium">Info</p>
              <p className="text-white text-2xl font-bold">{activityStats.info}</p>
            </div>
            <CheckCircle className="w-5 h-5 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold text-lg">System Activity Timeline</h3>
          <div className="flex gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm"
            >
              <option value="all">All Types</option>
              <option value="system">System</option>
              <option value="security">Security</option>
              <option value="user">User</option>
              <option value="integration">Integration</option>
              <option value="maintenance">Maintenance</option>
            </select>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="error">Error</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredActivities.map((activity, index) => (
            <div
              key={activity.id}
              className={`group bg-white/5 backdrop-blur-sm rounded-xl border p-4 hover:bg-white/10 transition-all duration-200 ${
                getSeverityColor(activity.severity)
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={`p-2 rounded-lg ${getSeverityColor(activity.severity)}`}>
                    {getTypeIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium text-white text-sm">{activity.message}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(activity.severity)}`}>
                        {activity.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs mb-2">{activity.details}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{activity.system || activity.user}</span>
                      <span className={`${getImpactColor(activity.impact)}`}>
                        Impact: {activity.impact}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 text-xs">{formatTime(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
