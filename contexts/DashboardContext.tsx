"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface Dashboard {
  id: string;
  name: string;
  createdAt: Date;
  isActive?: boolean;
  isArchived?: boolean;
}

interface DashboardContextType {
  dashboards: Dashboard[];
  archivedDashboards: Dashboard[];
  addDashboard: (dashboard: Omit<Dashboard, "id" | "createdAt">) => void;
  archiveDashboard: (id: string) => void;
  unarchiveDashboard: (id: string) => void;
  deleteDashboard: (id: string) => void;
  setActiveDashboard: (id: string) => void;
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
  const [dashboards, setDashboards] = useState<Dashboard[]>([
    {
      id: "1",
      name: "TechCorp Multi-State Dashboard",
      createdAt: new Date("2024-01-15"),
      isActive: true,
    },
    {
      id: "2", 
      name: "Healthcare Partners Analysis",
      createdAt: new Date("2024-01-12"),
    },
    {
      id: "3",
      name: "Real Estate Portfolio Review",
      createdAt: new Date("2024-01-10"),
    },
    {
      id: "4",
      name: "Manufacturing Compliance Report",
      createdAt: new Date("2024-01-08"),
    },
  ]);

  const [archivedDashboards, setArchivedDashboards] = useState<Dashboard[]>([
    {
      id: "5",
      name: "Old Client Dashboard v1",
      createdAt: new Date("2023-12-20"),
      isArchived: true,
    },
    {
      id: "6",
      name: "Test Dashboard",
      createdAt: new Date("2023-12-15"),
      isArchived: true,
    },
  ]);

  const addDashboard = (dashboardData: Omit<Dashboard, "id" | "createdAt">) => {
    const newDashboard: Dashboard = {
      ...dashboardData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setDashboards(prev => [newDashboard, ...prev]);
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
    addDashboard,
    archiveDashboard,
    unarchiveDashboard,
    deleteDashboard,
    setActiveDashboard,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
