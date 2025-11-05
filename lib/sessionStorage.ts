// SessionStorage utilities for organization ID management
// This allows multiple browser tabs to have different org IDs simultaneously

const ORG_ID_KEY = 'orgId';
const DASHBOARD_SESSION_KEY = 'dashboard_session';

export interface DashboardSession {
  dashboardUrl: string;
  clientName: string;
  organizationId: string;
  createdAt: number;
}

export const sessionStorageUtils = {
  // Set organization ID in sessionStorage
  setOrgId(orgId: string): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(ORG_ID_KEY, orgId);
    } catch (error) {
      console.error('Error setting orgId in sessionStorage:', error);
    }
  },

  // Get organization ID from sessionStorage
  getOrgId(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return sessionStorage.getItem(ORG_ID_KEY);
    } catch (error) {
      console.error('Error getting orgId from sessionStorage:', error);
      return null;
    }
  },

  // Clear organization ID from sessionStorage
  clearOrgId(): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.removeItem(ORG_ID_KEY);
    } catch (error) {
      console.error('Error clearing orgId from sessionStorage:', error);
    }
  },

  // Set dashboard session in sessionStorage
  setDashboardSession(session: DashboardSession): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(DASHBOARD_SESSION_KEY, JSON.stringify(session));
      // Also set orgId separately for easy access
      this.setOrgId(session.organizationId);
    } catch (error) {
      console.error('Error setting dashboard session in sessionStorage:', error);
    }
  },

  // Get dashboard session from sessionStorage
  getDashboardSession(): DashboardSession | null {
    if (typeof window === 'undefined') return null;
    try {
      const sessionStr = sessionStorage.getItem(DASHBOARD_SESSION_KEY);
      if (!sessionStr) return null;
      return JSON.parse(sessionStr);
    } catch (error) {
      console.error('Error getting dashboard session from sessionStorage:', error);
      return null;
    }
  },

  // Clear dashboard session from sessionStorage
  clearDashboardSession(): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.removeItem(DASHBOARD_SESSION_KEY);
      this.clearOrgId();
    } catch (error) {
      console.error('Error clearing dashboard session from sessionStorage:', error);
    }
  },

  // Check if user is in personalized dashboard mode
  isPersonalizedMode(): boolean {
    return this.getDashboardSession() !== null;
  },

  // Get current dashboard URL for API requests
  getCurrentDashboardUrl(): string | null {
    const session = this.getDashboardSession();
    return session?.dashboardUrl || null;
  },

  // Get current client name
  getCurrentClientName(): string | null {
    const session = this.getDashboardSession();
    return session?.clientName || null;
  }
};


