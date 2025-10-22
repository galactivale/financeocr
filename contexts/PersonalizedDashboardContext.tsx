"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { cookieUtils, DashboardSession } from "@/lib/cookies";
import { normalizeOrgId, isUuid } from "@/lib/utils";

interface PersonalizedDashboardContextType {
  dashboardUrl: string | null;
  isPersonalizedMode: boolean;
  clientName: string | null;
  organizationId: string | null;
  setDashboardSession: (session: DashboardSession) => void;
  clearDashboardSession: () => void;
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
    // Load dashboard session from cookie on mount
    const session = cookieUtils.getDashboardSession();
    
    if (session) {
      setDashboardUrl(session.dashboardUrl);
      setClientName(session.clientName);
      const normalized = normalizeOrgId(session.organizationId);
      setOrganizationId(normalized || null);
      if (!isUuid(session.organizationId)) {
        cookieUtils.setDashboardSession({
          ...session,
          organizationId: normalized || session.organizationId,
        });
      }
    } else {
      setDashboardUrl(null);
      setClientName(null);
      setOrganizationId(null);
    }
    
    setIsInitialized(true);
  }, []);

  const setDashboardSession = (session: DashboardSession) => {
    cookieUtils.setDashboardSession(session);
    setDashboardUrl(session.dashboardUrl);
    setClientName(session.clientName);
    setOrganizationId(session.organizationId);
  };

  const clearDashboardSession = () => {
    cookieUtils.clearDashboardSession();
    setDashboardUrl(null);
    setClientName(null);
    setOrganizationId(null);
  };

  const isPersonalizedMode = dashboardUrl !== null;

  const value: PersonalizedDashboardContextType = {
    dashboardUrl,
    isPersonalizedMode,
    clientName,
    organizationId,
    setDashboardSession,
    clearDashboardSession
  };

  return (
    <PersonalizedDashboardContext.Provider value={value}>
      {children}
    </PersonalizedDashboardContext.Provider>
  );
};
