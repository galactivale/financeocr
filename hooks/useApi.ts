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

// Specific hooks for different data types
export function useClients(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  riskLevel?: string;
  organizationId?: string;
}) {
  return useApi(
    () => apiClient.getClients(params),
    [params?.page, params?.limit, params?.search, params?.status, params?.riskLevel, params?.organizationId]
  );
}

export function useAlerts(params?: {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  clientId?: string;
}) {
  return useApi(
    () => apiClient.getAlerts(params),
    [params?.page, params?.limit, params?.status, params?.priority, params?.clientId]
  );
}

export function useTasks(params?: {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  clientId?: string;
  assignedTo?: string;
}) {
  return useApi(
    () => apiClient.getTasks(params),
    [params?.page, params?.limit, params?.status, params?.priority, params?.clientId, params?.assignedTo]
  );
}

export function useDocuments(params?: {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  clientId?: string;
}) {
  return useApi(
    () => apiClient.getDocuments(params),
    [params?.page, params?.limit, params?.type, params?.status, params?.clientId]
  );
}

export function useDecisions(params?: {
  page?: number;
  limit?: number;
  status?: string;
  clientId?: string;
}) {
  return useApi(
    () => apiClient.getDecisions(params),
    [params?.page, params?.limit, params?.status, params?.clientId]
  );
}

export function useAnalytics(params?: {
  startDate?: string;
  endDate?: string;
  metricType?: string;
}) {
  return useApi(
    () => apiClient.getAnalytics(params),
    [params?.startDate, params?.endDate, params?.metricType]
  );
}

export function useProfile() {
  return useApi(() => apiClient.getProfile());
}

export function useHealthCheck() {
  return useApi(() => apiClient.healthCheck());
}

// Nexus-specific hooks
export function useNexusAlerts(params?: {
  limit?: number;
  offset?: number;
  status?: string;
  priority?: string;
  stateCode?: string;
  organizationId?: string;
}) {
  return useApi(
    () => apiClient.getNexusAlerts(params),
    [params?.limit, params?.offset, params?.status, params?.priority, params?.stateCode, params?.organizationId]
  );
}

export function useNexusActivities(params?: {
  limit?: number;
  offset?: number;
  clientId?: string;
  stateCode?: string;
  activityType?: string;
  organizationId?: string;
}) {
  return useApi(
    () => apiClient.getNexusActivities(params),
    [params?.limit, params?.offset, params?.clientId, params?.stateCode, params?.activityType, params?.organizationId]
  );
}

export function useClientStates(params?: {
  limit?: number;
  offset?: number;
  clientId?: string;
  stateCode?: string;
  status?: string;
  organizationId?: string;
}) {
  return useApi(
    () => apiClient.getClientStates(params),
    [params?.limit, params?.offset, params?.clientId, params?.stateCode, params?.status, params?.organizationId]
  );
}

export function useStateTaxInfo(stateCode?: string) {
  return useApi(
    () => apiClient.getStateTaxInfo(stateCode),
    [stateCode]
  );
}

export function useNexusDashboardSummary(organizationId?: string) {
  return useApi(
    () => apiClient.getNexusDashboardSummary(organizationId),
    [organizationId]
  );
}

export function useClientDetail(clientId: string) {
  return useApi(
    () => apiClient.getClientDetail(clientId),
    [clientId]
  );
}

export function useClient(clientId: string, organizationId?: string) {
  return useApi(
    () => apiClient.getClient(clientId, organizationId),
    [clientId, organizationId]
  );
}

// Decision Table hooks
export function useDecisionTables(params?: {
  limit?: number;
  offset?: number;
  clientId?: string;
  decisionType?: string;
  status?: string;
  riskLevel?: string;
}) {
  return useApi(
    () => apiClient.getDecisionTables(params),
    [params?.limit, params?.offset, params?.clientId, params?.decisionType, params?.status, params?.riskLevel]
  );
}

export function useDecisionTable(id: string) {
  return useApi(
    () => apiClient.getDecisionTable(id),
    [id]
  );
}

// Consultation hooks
export function useConsultations(params?: {
  organizationId?: string;
  clientId?: string;
  status?: string;
  prepStatus?: string;
}) {
  return useApi(
    () => apiClient.getConsultations(params),
    [params?.organizationId, params?.clientId, params?.status, params?.prepStatus]
  );
}

export function useConsultation(consultationId: string) {
  return useApi(
    () => apiClient.getConsultation(consultationId),
    [consultationId]
  );
}

export function useClientConsultations(clientId: string) {
  return useApi(
    () => apiClient.getClientConsultations(clientId),
    [clientId]
  );
}

// Communication hooks
export function useCommunications(params?: {
  organizationId?: string;
  clientId?: string;
  alertId?: string;
  status?: string;
  type?: 'email' | 'sms';
}) {
  return useApi(
    () => apiClient.getCommunications(params),
    [params?.organizationId, params?.clientId, params?.alertId, params?.status, params?.type]
  );
}

export function useCommunication(communicationId: string) {
  return useApi(
    () => apiClient.getCommunication(communicationId),
    [communicationId]
  );
}
