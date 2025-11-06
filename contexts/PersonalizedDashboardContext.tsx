"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { sessionStorageUtils, DashboardSession } from "@/lib/sessionStorage";
import { normalizeOrgId, isUuid } from "@/lib/utils";

interface PersonalizedDashboardContextType {
  dashboardUrl: string | null;
  isPersonalizedMode: boolean;
  clientName: string | null;
  organizationId: string | null;
  setDashboardSession: (session: DashboardSession) => void;
  clearDashboardSession: () => void;
  refreshFromStorage: () => void; // Refresh orgId from sessionStorage
}

const PersonalizedDashboardContext = createContext<PersonalizedDashboardContextType | undefined>(undefined);

export const usePersonalizedDashboard = () => {
  const context = useContext(PersonalizedDashboardContext);
  if (context === undefined) {
    throw new Error("usePersonalizedDashboard must be used within a PersonalizedDashboardProvider");
  }
  return context;
};

interface PersonalizedDashboardProviderProps {
  children: ReactNode;
}

export const PersonalizedDashboardProvider = ({ children }: PersonalizedDashboardProviderProps) => {
  const [dashboardUrl, setDashboardUrl] = useState<string | null>(null);
  const [clientName, setClientName] = useState<string | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load dashboard session from sessionStorage on mount (client-side only)
    const session = sessionStorageUtils.getDashboardSession();
    
    if (session) {
      setDashboardUrl(session.dashboardUrl);
      setClientName(session.clientName);
      const normalized = normalizeOrgId(session.organizationId);
      setOrganizationId(normalized || null);
      if (!isUuid(session.organizationId)) {
        sessionStorageUtils.setDashboardSession({
          ...session,
          organizationId: normalized || session.organizationId,
        });
      }
    } else {
      // Try to get orgId directly from sessionStorage (for non-personalized dashboards)
      const orgId = sessionStorageUtils.getOrgId();
      if (orgId) {
        setOrganizationId(normalizeOrgId(orgId) || null);
      } else {
        setDashboardUrl(null);
        setClientName(null);
        setOrganizationId(null);
      }
    }
    
    setIsInitialized(true);
  }, []);

  const setDashboardSession = (session: DashboardSession) => {
    sessionStorageUtils.setDashboardSession(session);
    setDashboardUrl(session.dashboardUrl);
    setClientName(session.clientName);
    setOrganizationId(session.organizationId);
  };

  const clearDashboardSession = () => {
    sessionStorageUtils.clearDashboardSession();
    setDashboardUrl(null);
    setClientName(null);
    setOrganizationId(null);
  };

  const refreshFromStorage = () => {
    // Refresh orgId from sessionStorage without full page reload
    const session = sessionStorageUtils.getDashboardSession();
    
    if (session) {
      setDashboardUrl(session.dashboardUrl);
      setClientName(session.clientName);
      const normalized = normalizeOrgId(session.organizationId);
      setOrganizationId(normalized || null);
    } else {
      const orgId = sessionStorageUtils.getOrgId();
      if (orgId) {
        setOrganizationId(normalizeOrgId(orgId) || null);
      } else {
        setDashboardUrl(null);
        setClientName(null);
        setOrganizationId(null);
      }
    }
  };

  const isPersonalizedMode = dashboardUrl !== null;

  const value: PersonalizedDashboardContextType = {
    dashboardUrl,
    isPersonalizedMode,
    clientName,
    organizationId,
    setDashboardSession,
    clearDashboardSession,
    refreshFromStorage
  };

  return (
    <PersonalizedDashboardContext.Provider value={value}>
      {children}
    </PersonalizedDashboardContext.Provider>
  );
};
