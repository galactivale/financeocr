import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

interface ClientDetailData {
  client: any;
  metrics: {
    totalRevenue: number;
    riskScore: number;
    complianceScore: number;
    activeAlerts: number;
    openNexusAlerts: number;
    pendingTasks: number;
    statesMonitored: number;
    documentsCount: number;
    lastActivity: string | null;
    penaltyExposure: number;
  };
  stateMetrics: Array<{
    stateCode: string;
    stateName: string;
    status: string;
    currentAmount: number;
    thresholdAmount: number;
    percentage: number;
    daysSinceThreshold: number | null;
    penaltyRisk: number;
    lastUpdated: string;
  }>;
  recentActivities: any[];
  summary: {
    totalStates: number;
    criticalStates: number;
    warningStates: number;
    monitoringStates: number;
  };
}

interface ClientDetailOptions {
  clientId: string;
  organizationId?: string;
  enabled?: boolean;
}

export function useClientDetail({ clientId, organizationId, enabled = true }: ClientDetailOptions) {
  const [data, setData] = useState<ClientDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !clientId) return;

    const fetchClientDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.getEnhancedClient(clientId, organizationId);
        setData(response.data);
      } catch (err: any) {
        console.error('Error fetching client detail:', err);
        setError(err.message || 'Failed to fetch client data');
      } finally {
        setLoading(false);
      }
    };

    fetchClientDetail();
  }, [clientId, organizationId, enabled]);

  return { data, loading, error, refetch: () => {
    if (clientId) {
      setLoading(true);
      setError(null);
      // Trigger re-fetch
      const fetchClientDetail = async () => {
        try {
          const response = await apiClient.getEnhancedClient(clientId, organizationId);
          setData(response.data);
        } catch (err: any) {
          console.error('Error fetching client detail:', err);
          setError(err.message || 'Failed to fetch client data');
        } finally {
          setLoading(false);
        }
      };
      fetchClientDetail();
    }
  }};
}

export function useClientNexusStatus({ clientId, organizationId, enabled = true }: ClientDetailOptions) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !clientId) return;

    const fetchNexusStatus = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.getClientNexusStatus(clientId, organizationId);
        setData(response.data);
      } catch (err: any) {
        console.error('Error fetching nexus status:', err);
        setError(err.message || 'Failed to fetch nexus status');
      } finally {
        setLoading(false);
      }
    };

    fetchNexusStatus();
  }, [clientId, organizationId, enabled]);

  return { data, loading, error };
}

export function useClientAlerts({ clientId, organizationId, enabled = true }: ClientDetailOptions) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !clientId) return;

    const fetchAlerts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.getClientAlerts(clientId, organizationId);
        setData(response.data);
      } catch (err: any) {
        console.error('Error fetching client alerts:', err);
        setError(err.message || 'Failed to fetch alerts');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [clientId, organizationId, enabled]);

  return { data, loading, error };
}

export function useClientCommunications({ clientId, organizationId, enabled = true }: ClientDetailOptions) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !clientId) return;

    const fetchCommunications = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.getClientCommunications(clientId, organizationId);
        setData(response.data);
      } catch (err: any) {
        console.error('Error fetching communications:', err);
        setError(err.message || 'Failed to fetch communications');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunications();
  }, [clientId, organizationId, enabled]);

  return { data, loading, error };
}

export function useClientDocuments({ clientId, organizationId, enabled = true }: ClientDetailOptions) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !clientId) return;

    const fetchDocuments = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.getClientDocuments(clientId, organizationId);
        setData(response.data);
      } catch (err: any) {
        console.error('Error fetching documents:', err);
        setError(err.message || 'Failed to fetch documents');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [clientId, organizationId, enabled]);

  return { data, loading, error };
}
