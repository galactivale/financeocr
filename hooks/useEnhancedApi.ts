import { useState, useEffect, useCallback } from 'react';
import { apiClient, type ApiResponse } from '@/lib/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

// Enhanced Client Hooks
export function useEnhancedClients(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  riskLevel?: string;
  industry?: string;
  stateCode?: string;
  organizationId?: string;
}) {
  return useApi(
    () => apiClient.getEnhancedClients(params),
    [params?.page, params?.limit, params?.search, params?.status, params?.riskLevel, params?.industry, params?.stateCode, params?.organizationId]
  );
}

export function useEnhancedClient(clientId: string) {
  return useApi(
    () => apiClient.getEnhancedClient(clientId),
    [clientId]
  );
}

export function useClientStateCompliance(clientId: string) {
  return useApi(
    () => apiClient.getClientStateCompliance(clientId),
    [clientId]
  );
}

// Enhanced System Hooks
export function useEnhancedSystemOverview(organizationId?: string) {
  return useApi(
    () => apiClient.getEnhancedSystemOverview(organizationId),
    [organizationId]
  );
}

export function useEnhancedUsers(organizationId?: string) {
  return useApi(
    () => apiClient.getEnhancedUsers(organizationId),
    [organizationId]
  );
}

export function useEnhancedIntegrations(organizationId?: string) {
  return useApi(
    () => apiClient.getEnhancedIntegrations(organizationId),
    [organizationId]
  );
}

export function useEnhancedAuditLogs(params?: {
  organizationId?: string;
  page?: number;
  limit?: number;
  action?: string;
  resourceType?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}) {
  return useApi(
    () => apiClient.getEnhancedAuditLogs(params),
    [params?.organizationId, params?.page, params?.limit, params?.action, params?.resourceType, params?.userId, params?.startDate, params?.endDate]
  );
}

// Enhanced Nexus Hooks
export function useEnhancedNexusDashboardSummary(params?: {
  organizationId?: string;
  clientId?: string;
}) {
  return useApi(
    () => apiClient.getEnhancedNexusDashboardSummary(params),
    [params?.organizationId, params?.clientId]
  );
}

export function useEnhancedClientStates(params?: {
  organizationId?: string;
  clientId?: string;
  stateCode?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useApi(
    () => apiClient.getEnhancedClientStates(params),
    [params?.organizationId, params?.clientId, params?.stateCode, params?.status, params?.page, params?.limit]
  );
}

export function useEnhancedStateCompliance(clientId: string, organizationId?: string) {
  return useApi(
    () => apiClient.getEnhancedStateCompliance(clientId, organizationId),
    [clientId, organizationId]
  );
}

// Dashboard-specific hooks that combine multiple data sources
export function useManagingPartnerDashboard(organizationId?: string) {
  const [combinedData, setCombinedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clientsQuery = useEnhancedClients({ organizationId, limit: 20 });
  const systemQuery = useEnhancedSystemOverview(organizationId);
  const nexusQuery = useEnhancedNexusDashboardSummary({ organizationId });

  useEffect(() => {
    if (clientsQuery.loading || systemQuery.loading || nexusQuery.loading) {
      setLoading(true);
      return;
    }

    if (clientsQuery.error || systemQuery.error || nexusQuery.error) {
      setError(clientsQuery.error || systemQuery.error || nexusQuery.error);
      setLoading(false);
      return;
    }

    if (clientsQuery.data && systemQuery.data && nexusQuery.data) {
      setCombinedData({
        clients: clientsQuery.data,
        system: systemQuery.data,
        nexus: nexusQuery.data,
        summary: {
          totalClients: clientsQuery.data.summary?.totalClients || 0,
          activeClients: clientsQuery.data.summary?.activeClients || 0,
          highRiskClients: clientsQuery.data.summary?.highRiskClients || 0,
          systemHealth: systemQuery.data.systemHealth,
          complianceMetrics: nexusQuery.data.complianceMetrics
        }
      });
      setLoading(false);
    }
  }, [clientsQuery, systemQuery, nexusQuery]);

  const refetch = useCallback(async () => {
    await Promise.all([
      clientsQuery.refetch(),
      systemQuery.refetch(),
      nexusQuery.refetch()
    ]);
  }, [clientsQuery, systemQuery, nexusQuery]);

  return {
    data: combinedData,
    loading,
    error,
    refetch
  };
}

export function useTaxManagerDashboard(organizationId?: string) {
  const [combinedData, setCombinedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const nexusQuery = useEnhancedNexusDashboardSummary({ organizationId });
  const clientStatesQuery = useEnhancedClientStates({ organizationId });
  const clientsQuery = useEnhancedClients({ organizationId, limit: 10 });

  useEffect(() => {
    if (nexusQuery.loading || clientStatesQuery.loading || clientsQuery.loading) {
      setLoading(true);
      return;
    }

    if (nexusQuery.error || clientStatesQuery.error || clientsQuery.error) {
      setError(nexusQuery.error || clientStatesQuery.error || clientsQuery.error);
      setLoading(false);
      return;
    }

    if (nexusQuery.data && clientStatesQuery.data && clientsQuery.data) {
      setCombinedData({
        nexus: nexusQuery.data,
        clientStates: clientStatesQuery.data,
        clients: clientsQuery.data,
        summary: {
          complianceMetrics: nexusQuery.data.complianceMetrics,
          riskAssessment: nexusQuery.data.riskAssessment,
          alertCounts: nexusQuery.data.alertCounts,
          stateCounts: nexusQuery.data.stateCounts
        }
      });
      setLoading(false);
    }
  }, [nexusQuery, clientStatesQuery, clientsQuery]);

  const refetch = useCallback(async () => {
    await Promise.all([
      nexusQuery.refetch(),
      clientStatesQuery.refetch(),
      clientsQuery.refetch()
    ]);
  }, [nexusQuery, clientStatesQuery, clientsQuery]);

  return {
    data: combinedData,
    loading,
    error,
    refetch
  };
}

export function useSystemAdminDashboard(organizationId?: string) {
  const [combinedData, setCombinedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const systemQuery = useEnhancedSystemOverview(organizationId);
  const usersQuery = useEnhancedUsers(organizationId);
  const integrationsQuery = useEnhancedIntegrations(organizationId);
  const auditLogsQuery = useEnhancedAuditLogs({ organizationId, limit: 50 });

  useEffect(() => {
    if (systemQuery.loading || usersQuery.loading || integrationsQuery.loading || auditLogsQuery.loading) {
      setLoading(true);
      return;
    }

    if (systemQuery.error || usersQuery.error || integrationsQuery.error || auditLogsQuery.error) {
      setError(systemQuery.error || usersQuery.error || integrationsQuery.error || auditLogsQuery.error);
      setLoading(false);
      return;
    }

    if (systemQuery.data && usersQuery.data && integrationsQuery.data && auditLogsQuery.data) {
      setCombinedData({
        system: systemQuery.data,
        users: usersQuery.data,
        integrations: integrationsQuery.data,
        auditLogs: auditLogsQuery.data,
        summary: {
          systemHealth: systemQuery.data.systemHealth,
          userMetrics: systemQuery.data.metrics?.users,
          clientMetrics: systemQuery.data.metrics?.clients,
          integrationHealth: integrationsQuery.data.health
        }
      });
      setLoading(false);
    }
  }, [systemQuery, usersQuery, integrationsQuery, auditLogsQuery]);

  const refetch = useCallback(async () => {
    await Promise.all([
      systemQuery.refetch(),
      usersQuery.refetch(),
      integrationsQuery.refetch(),
      auditLogsQuery.refetch()
    ]);
  }, [systemQuery, usersQuery, integrationsQuery, auditLogsQuery]);

  return {
    data: combinedData,
    loading,
    error,
    refetch
  };
}
