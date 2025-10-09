import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

interface PersonalizedData {
  clients: any[];
  alerts: any[];
  tasks: any[];
  analytics: any;
  systemHealth: any;
  nexusAlerts: any[];
  nexusActivities: any[];
  clientStates: any[];
}

export const usePersonalizedData = (dashboardUrl?: string) => {
  const [data, setData] = useState<PersonalizedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!dashboardUrl) {
      setData(null);
      return;
    }

    const fetchPersonalizedData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [
          clientsResponse,
          alertsResponse,
          tasksResponse,
          analyticsResponse,
          systemHealthResponse,
          nexusAlertsResponse,
          nexusActivitiesResponse,
          clientStatesResponse
        ] = await Promise.all([
          apiClient.getPersonalizedClients(dashboardUrl),
          apiClient.getPersonalizedAlerts(dashboardUrl),
          apiClient.getPersonalizedTasks(dashboardUrl),
          apiClient.getPersonalizedAnalytics(dashboardUrl),
          apiClient.getPersonalizedSystemHealth(dashboardUrl),
          apiClient.getPersonalizedNexusAlerts(dashboardUrl),
          apiClient.getPersonalizedNexusActivities(dashboardUrl),
          apiClient.getPersonalizedClientStates(dashboardUrl)
        ]);

        const personalizedData: PersonalizedData = {
          clients: clientsResponse.success ? clientsResponse.data || [] : [],
          alerts: alertsResponse.success ? alertsResponse.data || [] : [],
          tasks: tasksResponse.success ? tasksResponse.data || [] : [],
          analytics: analyticsResponse.success ? analyticsResponse.data || {} : {},
          systemHealth: systemHealthResponse.success ? systemHealthResponse.data || {} : {},
          nexusAlerts: nexusAlertsResponse.success ? nexusAlertsResponse.data || [] : [],
          nexusActivities: nexusActivitiesResponse.success ? nexusActivitiesResponse.data || [] : [],
          clientStates: clientStatesResponse.success ? clientStatesResponse.data || [] : []
        };

        setData(personalizedData);
      } catch (err) {
        console.error('Error fetching personalized data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch personalized data');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalizedData();
  }, [dashboardUrl]);

  return { data, loading, error };
};

export const usePersonalizedClientStates = (dashboardUrl?: string) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!dashboardUrl) {
      setData([]);
      return;
    }

    const fetchClientStates = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.getPersonalizedClientStates(dashboardUrl);
        if (response.success) {
          setData(response.data || []);
        } else {
          setError(response.error || 'Failed to fetch client states');
        }
      } catch (err) {
        console.error('Error fetching personalized client states:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch client states');
      } finally {
        setLoading(false);
      }
    };

    fetchClientStates();
  }, [dashboardUrl]);

  return { data, loading, error };
};

export const usePersonalizedNexusAlerts = (dashboardUrl?: string) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!dashboardUrl) {
      setData([]);
      return;
    }

    const fetchNexusAlerts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.getPersonalizedNexusAlerts(dashboardUrl);
        if (response.success) {
          setData(response.data || []);
        } else {
          setError(response.error || 'Failed to fetch nexus alerts');
        }
      } catch (err) {
        console.error('Error fetching personalized nexus alerts:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch nexus alerts');
      } finally {
        setLoading(false);
      }
    };

    fetchNexusAlerts();
  }, [dashboardUrl]);

  return { data, loading, error };
};



