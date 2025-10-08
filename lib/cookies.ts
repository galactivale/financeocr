// Cookie management utilities for dashboard sessions

export interface DashboardSession {
  dashboardUrl: string;
  clientName: string;
  organizationId: string;
  createdAt: number;
}

const DASHBOARD_SESSION_COOKIE = 'dashboard_session';
const COOKIE_EXPIRY_DAYS = 7; // Session expires after 7 days

export const cookieUtils = {
  // Set dashboard session cookie
  setDashboardSession(session: DashboardSession): void {
    if (typeof window === 'undefined') return;
    
    const expires = new Date();
    expires.setDate(expires.getDate() + COOKIE_EXPIRY_DAYS);
    
    const cookieValue = encodeURIComponent(JSON.stringify(session));
    document.cookie = `${DASHBOARD_SESSION_COOKIE}=${cookieValue}; expires=${expires.toUTCString()}; path=/; SameSite=Lax; Secure`;
  },

  // Get dashboard session from cookie
  getDashboardSession(): DashboardSession | null {
    if (typeof window === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    const sessionCookie = cookies.find(cookie => 
      cookie.trim().startsWith(`${DASHBOARD_SESSION_COOKIE}=`)
    );
    
    if (!sessionCookie) return null;
    
    try {
      const cookieValue = sessionCookie.split('=')[1];
      const session = JSON.parse(decodeURIComponent(cookieValue));
      
      // Check if session is expired
      const now = Date.now();
      const sessionAge = now - session.createdAt;
      const maxAge = COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000; // 7 days in milliseconds
      
      if (sessionAge > maxAge) {
        this.clearDashboardSession();
        return null;
      }
      
      return session;
    } catch (error) {
      console.error('Error parsing dashboard session cookie:', error);
      this.clearDashboardSession();
      return null;
    }
  },

  // Clear dashboard session cookie
  clearDashboardSession(): void {
    if (typeof window === 'undefined') return;
    
    document.cookie = `${DASHBOARD_SESSION_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
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


