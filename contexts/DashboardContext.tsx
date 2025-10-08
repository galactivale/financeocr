"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiClient } from "../lib/api";

interface Dashboard {
  id: string;
  name: string;
  createdAt: Date;
  isActive?: boolean;
  isArchived?: boolean;
  uniqueUrl?: string;
  dashboardUrl?: string;
  clientInfo?: any;
  keyMetrics?: any;
  statesMonitored?: string[];
  lastUpdated?: string;
}

interface DashboardContextType {
  dashboards: Dashboard[];
  archivedDashboards: Dashboard[];
  loading: boolean;
  error: string | null;
  addDashboard: (dashboard: Omit<Dashboard, "id" | "createdAt">) => void;
  archiveDashboard: (id: string) => void;
  unarchiveDashboard: (id: string) => void;
  deleteDashboard: (id: string) => void;
  setActiveDashboard: (id: string) => void;
  refreshDashboards: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider = ({ children }: DashboardProviderProps) => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [archivedDashboards, setArchivedDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboards from API
  const fetchDashboards = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use demo organization ID for now
      const organizationId = "demo-org-id";
      const response = await apiClient.getDashboards(organizationId);
      
      // Dashboard API response received
      
      if (response.success && response.dashboards && Array.isArray(response.dashboards)) {
        // Convert API data to Dashboard format
        const apiDashboards: Dashboard[] = response.dashboards.map((item: any) => ({
          id: item.id,
          name: `${item.clientName} Dashboard`,
          createdAt: new Date(item.createdAt),
          isActive: item.isActive,
          isArchived: !item.isActive,
          uniqueUrl: item.uniqueUrl,
          dashboardUrl: item.dashboardUrl,
          clientInfo: item.clientInfo,
          keyMetrics: item.keyMetrics,
          statesMonitored: item.statesMonitored,
          lastUpdated: item.lastUpdated,
        }));

        // Separate active and archived dashboards
        const activeDashboards = apiDashboards.filter(d => d.isActive);
        const archivedDashboards = apiDashboards.filter(d => d.isArchived);
        
        setDashboards(activeDashboards);
        setArchivedDashboards(archivedDashboards);
      } else {
        throw new Error(response.error || 'Failed to fetch dashboards');
      }
    } catch (err) {
      console.error('Error fetching dashboards:', err);
      console.error('Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        name: err instanceof Error ? err.name : undefined
      });
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboards');
      // Fallback to empty arrays on error
      setDashboards([]);
      setArchivedDashboards([]);
    } finally {
      setLoading(false);
    }
  };

  // Load dashboards on component mount
  useEffect(() => {
    fetchDashboards();
  }, []);

  const addDashboard = (dashboardData: Omit<Dashboard, "id" | "createdAt">) => {
    const newDashboard: Dashboard = {
      ...dashboardData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setDashboards(prev => [newDashboard, ...prev]);
  };

  const refreshDashboards = async () => {
    await fetchDashboards();
  };

  const archiveDashboard = (id: string) => {
    const dashboard = dashboards.find(d => d.id === id);
    if (dashboard) {
      setDashboards(prev => prev.filter(d => d.id !== id));
      setArchivedDashboards(prev => [{ ...dashboard, isArchived: true }, ...prev]);
    }
  };

  const unarchiveDashboard = (id: string) => {
    const dashboard = archivedDashboards.find(d => d.id === id);
    if (dashboard) {
      setArchivedDashboards(prev => prev.filter(d => d.id !== id));
      setDashboards(prev => [{ ...dashboard, isArchived: false }, ...prev]);
    }
  };

  const deleteDashboard = (id: string) => {
    setDashboards(prev => prev.filter(d => d.id !== id));
    setArchivedDashboards(prev => prev.filter(d => d.id !== id));
  };

  const setActiveDashboard = (id: string) => {
    setDashboards(prev => 
      prev.map(d => ({ ...d, isActive: d.id === id }))
    );
  };

  const value: DashboardContextType = {
    dashboards,
    archivedDashboards,
    loading,
    error,
    addDashboard,
    archiveDashboard,
    unarchiveDashboard,
    deleteDashboard,
    setActiveDashboard,
    refreshDashboards,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
