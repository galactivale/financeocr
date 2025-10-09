// API Client for VaultCPA Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3080';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

interface LoginRequest {
  email: string;
  password: string;
  organizationSlug: string;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    displayName: string;
    role: string;
    organization: {
      id: string;
      name: string;
      slug: string;
    };
  };
  token: string;
  refreshToken: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: string;
  organization: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Client {
  id: string;
  slug: string;
  name: string;
  legalName?: string;
  industry?: string;
  riskLevel?: string;
  penaltyExposure?: number;
  qualityScore?: number;
  status: string;
  assignedPartner?: string;
  assignedManager?: string;
  primaryContactName?: string;
  primaryContactEmail?: string;
  city?: string;
  state?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Consultation {
  id: string;
  organizationId: string;
  clientId: string;
  alertId?: string;
  topic: string;
  description?: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  exposureAmount?: number;
  exposureCurrency: string;
  status: string;
  prepStatus: string;
  prepNotes?: string;
  talkingPoints?: string;
  advisoryPackage?: string;
  meetingType: string;
  meetingLink?: string;
  meetingLocation?: string;
  outcome?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  followUpNotes?: string;
  notes?: string;
  documents: string[];
  recordingUrl?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  cancelledAt?: string;
  client?: {
    id: string;
    name: string;
    slug: string;
    industry: string;
  };
  alert?: {
    id: string;
    title: string;
    severity: string;
    status: string;
  };
}

interface Communication {
  id: string;
  organizationId: string;
  clientId: string;
  alertId: string; // Required for nexus alerts
  type: 'email' | 'sms';
  subject: string;
  content: string;
  professionalReasoning?: string;
  status: 'sent' | 'delivered' | 'failed' | 'read';
  sentDate: string;
  deliveryDate?: string;
  readDate?: string;
  failureReason?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  createdAt: string;
  updatedAt: string;
  client?: {
    id: string;
    name: string;
    slug: string;
    industry: string;
    primaryContactEmail?: string;
    primaryContactPhone?: string;
  };
  alert?: {
    id: string;
    title: string;
    issue?: string;
    stateCode?: string;
    stateName?: string;
    currentAmount?: number;
    thresholdAmount?: number;
    penaltyRisk?: number;
    priority: string;
    severity?: string;
    status: string;
    deadline?: string;
  };
}

interface Alert {
  id: string;
  title: string;
  description?: string;
  priority: string;
  severity?: string;
  status: string;
  type?: string;
  category?: string;
  deadline?: string;
  clientId?: string;
  client?: {
    name: string;
  };
  stateCode?: string;
  stateName?: string;
  currentAmount?: number;
  thresholdAmount?: number;
  penaltyRisk?: number;
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  category?: string;
  priority?: string;
  status: string;
  progress: number;
  dueDate?: string;
  clientId?: string;
  client?: {
    name: string;
  };
  assignedTo?: string;
  estimatedHours?: number;
  actualHours?: number;
  createdAt: string;
}

interface Document {
  id: string;
  name: string;
  description?: string;
  type?: string;
  status: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  clientId?: string;
  client?: {
    name: string;
  };
  uploadedAt: string;
}

interface ProfessionalDecision {
  id: string;
  decisionDate: string;
  decisionType: string;
  decisionSummary: string;
  professionalReasoning: string;
  riskLevel?: string;
  financialExposure?: number;
  status: string;
  clientId: string;
  client?: {
    name: string;
  };
  decisionMakerId?: string;
  createdAt: string;
}

interface PerformanceMetric {
  id: string;
  metricDate: string;
  metricType: string;
  value?: number;
  target?: number;
  variance?: number;
  unit?: string;
  category?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Request failed',
          details: data.details,
        };
      }

      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Demo mode - no authentication required

  // Client methods
  async getClients(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    riskLevel?: string;
  }): Promise<ApiResponse<{ clients: Client[]; total: number; page: number; limit: number }>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.riskLevel) queryParams.append('riskLevel', params.riskLevel);

    const query = queryParams.toString();
    return this.request(`/api/clients${query ? `?${query}` : ''}`);
  }

  async getClient(id: string): Promise<ApiResponse<Client>> {
    return this.request<Client>(`/api/clients/${id}`);
  }

  async getClientDetail(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/clients/${id}`);
  }

  // Alert methods
  async getAlerts(params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    clientId?: string;
  }): Promise<ApiResponse<{ alerts: Alert[]; total: number; page: number; limit: number }>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.clientId) queryParams.append('clientId', params.clientId);

    const query = queryParams.toString();
    return this.request(`/api/alerts${query ? `?${query}` : ''}`);
  }

  async getAlert(id: string): Promise<ApiResponse<Alert>> {
    return this.request<Alert>(`/api/alerts/${id}`);
  }

  // Task methods
  async getTasks(params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    clientId?: string;
    assignedTo?: string;
  }): Promise<ApiResponse<{ tasks: Task[]; total: number; page: number; limit: number }>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.clientId) queryParams.append('clientId', params.clientId);
    if (params?.assignedTo) queryParams.append('assignedTo', params.assignedTo);

    const query = queryParams.toString();
    return this.request(`/api/tasks${query ? `?${query}` : ''}`);
  }

  async getTask(id: string): Promise<ApiResponse<Task>> {
    return this.request<Task>(`/api/tasks/${id}`);
  }

  // Document methods
  async getDocuments(params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    clientId?: string;
  }): Promise<ApiResponse<{ documents: Document[]; total: number; page: number; limit: number }>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.type) queryParams.append('type', params.type);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.clientId) queryParams.append('clientId', params.clientId);

    const query = queryParams.toString();
    return this.request(`/api/documents${query ? `?${query}` : ''}`);
  }

  // Professional Decision methods
  async getDecisions(params?: {
    page?: number;
    limit?: number;
    status?: string;
    clientId?: string;
  }): Promise<ApiResponse<{ decisions: ProfessionalDecision[]; total: number; page: number; limit: number }>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.clientId) queryParams.append('clientId', params.clientId);

    const query = queryParams.toString();
    return this.request(`/api/decisions${query ? `?${query}` : ''}`);
  }

  // Analytics methods
  async getAnalytics(params?: {
    startDate?: string;
    endDate?: string;
    metricType?: string;
  }): Promise<ApiResponse<{ metrics: PerformanceMetric[] }>> {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.metricType) queryParams.append('metricType', params.metricType);

    const query = queryParams.toString();
    return this.request(`/api/analytics${query ? `?${query}` : ''}`);
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{
    status: string;
    timestamp: string;
    uptime: number;
    environment: string;
    version: string;
  }>> {
    return this.request('/health');
  }

  // Nexus API methods
  async getNexusAlerts(params?: {
    limit?: number;
    offset?: number;
    status?: string;
    priority?: string;
    stateCode?: string;
  }): Promise<ApiResponse<{
    alerts: any[];
    total: number;
    limit: number;
    offset: number;
  }>> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.stateCode) queryParams.append('stateCode', params.stateCode);
    
    const queryString = queryParams.toString();
    return this.request(`/api/nexus/alerts${queryString ? `?${queryString}` : ''}`);
  }

  async getNexusActivities(params?: {
    limit?: number;
    offset?: number;
    clientId?: string;
    stateCode?: string;
    activityType?: string;
  }): Promise<ApiResponse<{
    activities: any[];
    total: number;
    limit: number;
    offset: number;
  }>> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.clientId) queryParams.append('clientId', params.clientId);
    if (params?.stateCode) queryParams.append('stateCode', params.stateCode);
    if (params?.activityType) queryParams.append('activityType', params.activityType);
    
    const queryString = queryParams.toString();
    return this.request(`/api/nexus/activities${queryString ? `?${queryString}` : ''}`);
  }

  async getClientStates(params?: {
    limit?: number;
    offset?: number;
    clientId?: string;
    stateCode?: string;
    status?: string;
  }): Promise<ApiResponse<{
    clientStates: any[];
    total: number;
    limit: number;
    offset: number;
  }>> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.clientId) queryParams.append('clientId', params.clientId);
    if (params?.stateCode) queryParams.append('stateCode', params.stateCode);
    if (params?.status) queryParams.append('status', params.status);
    
    const queryString = queryParams.toString();
    return this.request(`/api/nexus/client-states${queryString ? `?${queryString}` : ''}`);
  }

  async getStateTaxInfo(stateCode?: string): Promise<ApiResponse<{
    stateTaxInfo: any[];
  }>> {
    const queryParams = new URLSearchParams();
    if (stateCode) queryParams.append('stateCode', stateCode);
    
    const queryString = queryParams.toString();
    return this.request(`/api/nexus/state-tax-info${queryString ? `?${queryString}` : ''}`);
  }

  async getNexusDashboardSummary(organizationId?: string): Promise<ApiResponse<{
    alertCounts: any[];
    priorityCounts: any[];
    stateCounts: any[];
    recentActivities: any[];
    thresholdAlerts: any[];
  }>> {
    const queryParams = new URLSearchParams();
    if (organizationId) queryParams.append('organizationId', organizationId);
    
    const queryString = queryParams.toString();
    return this.request(`/api/nexus/dashboard-summary${queryString ? `?${queryString}` : ''}`);
  }

  // Consultation methods
  async getConsultations(params?: {
    organizationId?: string;
    clientId?: string;
    status?: string;
    prepStatus?: string;
  }): Promise<ApiResponse<Consultation[]>> {
    const queryParams = new URLSearchParams();
    if (params?.organizationId) queryParams.append('organizationId', params.organizationId);
    if (params?.clientId) queryParams.append('clientId', params.clientId);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.prepStatus) queryParams.append('prepStatus', params.prepStatus);

    const query = queryParams.toString();
    return this.request<Consultation[]>(`/api/consultations${query ? `?${query}` : ''}`);
  }

  async getConsultation(id: string): Promise<ApiResponse<Consultation>> {
    return this.request<Consultation>(`/api/consultations/${id}`);
  }

  async getClientConsultations(clientId: string): Promise<ApiResponse<Consultation[]>> {
    return this.request<Consultation[]>(`/api/consultations/client/${clientId}`);
  }

  async createConsultation(consultation: {
    organizationId: string;
    clientId: string;
    alertId?: string;
    topic: string;
    description?: string;
    scheduledDate: string;
    scheduledTime: string;
    duration: number;
    exposureAmount?: number;
    exposureCurrency?: string;
    prepStatus?: string;
    prepNotes?: string;
    meetingType?: string;
    meetingLink?: string;
    meetingLocation?: string;
    notes?: string;
  }): Promise<ApiResponse<Consultation>> {
    return this.request<Consultation>('/api/consultations', {
      method: 'POST',
      body: JSON.stringify(consultation),
    });
  }

  async updateConsultation(id: string, updates: Partial<Consultation>): Promise<ApiResponse<Consultation>> {
    return this.request<Consultation>(`/api/consultations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteConsultation(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/consultations/${id}`, {
      method: 'DELETE',
    });
  }

  // Communication methods
  async getCommunications(params?: {
    organizationId?: string;
    clientId?: string;
    alertId?: string;
    status?: string;
    type?: 'email' | 'sms';
  }): Promise<ApiResponse<Communication[]>> {
    const queryParams = new URLSearchParams();
    if (params?.organizationId) queryParams.append('organizationId', params.organizationId);
    if (params?.clientId) queryParams.append('clientId', params.clientId);
    if (params?.alertId) queryParams.append('alertId', params.alertId);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.type) queryParams.append('type', params.type);

    const query = queryParams.toString();
    return this.request<Communication[]>(`/api/communications${query ? `?${query}` : ''}`);
  }

  async getCommunication(id: string): Promise<ApiResponse<Communication>> {
    return this.request<Communication>(`/api/communications/${id}`);
  }

  async createCommunication(communication: {
    organizationId: string;
    clientId: string;
    alertId: string; // Required for nexus alerts
    type: 'email' | 'sms';
    subject: string;
    content: string;
    professionalReasoning?: string;
    recipientEmail?: string;
    recipientPhone?: string;
  }): Promise<ApiResponse<Communication>> {
    return this.request<Communication>('/api/communications', {
      method: 'POST',
      body: JSON.stringify(communication),
    });
  }

  async updateCommunicationStatus(id: string, status: string, deliveryDate?: string, readDate?: string, failureReason?: string): Promise<ApiResponse<Communication>> {
    return this.request<Communication>(`/api/communications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, deliveryDate, readDate, failureReason }),
    });
  }

  // Dashboard generation methods
  async generateDashboard(formData: {
    clientName: string;
    multiStateClientCount: string;
    priorityStates: string[];
    painPoints: string[];
    primaryIndustry: string;
    qualificationStrategy: string;
    additionalNotes?: string;
  }, organizationId: string): Promise<ApiResponse<{
    id: string;
    clientName: string;
    uniqueUrl: string;
    dashboardUrl: string;
    clientInfo: any;
    keyMetrics: any;
    statesMonitored: string[];
    lastUpdated: string;
  }>> {
    return this.request('/api/dashboards/generate', {
      method: 'POST',
      body: JSON.stringify({ formData, organizationId }),
    });
  }

  async getDashboard(url: string): Promise<ApiResponse<{
    id: string;
    clientName: string;
    uniqueUrl: string;
    clientInfo: any;
    keyMetrics: any;
    statesMonitored: string[];
    lastUpdated: string;
    organization: {
      name: string;
      slug: string;
    };
  }>> {
    return this.request(`/api/dashboards/${url}`);
  }

  async getDashboards(organizationId: string): Promise<{
    success: boolean;
    dashboards?: {
      id: string;
      clientName: string;
      uniqueUrl: string;
      dashboardUrl: string;
      clientInfo: any;
      keyMetrics: any;
      statesMonitored: string[];
      lastUpdated: string;
      createdAt: string;
    }[];
    error?: string;
  }> {
    const url = `${this.baseURL}/api/dashboards?organizationId=${organizationId}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Request failed',
        };
      }

      return {
        success: true,
        dashboards: data.dashboards || [],
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Personalized Dashboard API methods
  async getPersonalizedClients(url: string): Promise<ApiResponse<any[]>> {
    return this.request(`/api/personalized-dashboard/${url}/clients`);
  }

  async getPersonalizedAlerts(url: string): Promise<ApiResponse<any[]>> {
    return this.request(`/api/personalized-dashboard/${url}/alerts`);
  }

  async getPersonalizedTasks(url: string): Promise<ApiResponse<any[]>> {
    return this.request(`/api/personalized-dashboard/${url}/tasks`);
  }

  async getPersonalizedAnalytics(url: string): Promise<ApiResponse<any>> {
    return this.request(`/api/personalized-dashboard/${url}/analytics`);
  }

  async getPersonalizedSystemHealth(url: string): Promise<ApiResponse<any>> {
    return this.request(`/api/personalized-dashboard/${url}/system-health`);
  }

  async getPersonalizedNexusAlerts(url: string): Promise<ApiResponse<any[]>> {
    return this.request(`/api/personalized-dashboard/${url}/nexus-alerts`);
  }

  async getPersonalizedNexusActivities(url: string): Promise<ApiResponse<any[]>> {
    return this.request(`/api/personalized-dashboard/${url}/nexus-activities`);
  }

  async getPersonalizedClientStates(url: string): Promise<ApiResponse<any[]>> {
    return this.request(`/api/personalized-dashboard/${url}/client-states`);
  }

  // Enhanced API methods for comprehensive data
  async getEnhancedClients(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    riskLevel?: string;
    industry?: string;
    stateCode?: string;
    organizationId?: string;
  }): Promise<ApiResponse<{
    clients: any[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    summary: {
      totalClients: number;
      activeClients: number;
      highRiskClients: number;
      averageQualityScore: number;
      totalRevenue: number;
    };
  }>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.riskLevel) queryParams.append('riskLevel', params.riskLevel);
    if (params?.industry) queryParams.append('industry', params.industry);
    if (params?.stateCode) queryParams.append('stateCode', params.stateCode);
    if (params?.organizationId) queryParams.append('organizationId', params.organizationId);

    const query = queryParams.toString();
    return this.request(`/api/enhanced-clients${query ? `?${query}` : ''}`);
  }

  async getEnhancedClient(id: string, organizationId?: string): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (organizationId) queryParams.append('organizationId', organizationId);
    const query = queryParams.toString();
    return this.request(`/api/enhanced-clients/${id}${query ? `?${query}` : ''}`);
  }

  async getClientNexusStatus(clientId: string, organizationId?: string): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (organizationId) queryParams.append('organizationId', organizationId);
    const query = queryParams.toString();
    return this.request(`/api/enhanced-clients/${clientId}/nexus-status${query ? `?${query}` : ''}`);
  }

  async getClientAlerts(clientId: string, organizationId?: string): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (organizationId) queryParams.append('organizationId', organizationId);
    const query = queryParams.toString();
    return this.request(`/api/enhanced-clients/${clientId}/alerts${query ? `?${query}` : ''}`);
  }

  async getClientCommunications(clientId: string, organizationId?: string): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (organizationId) queryParams.append('organizationId', organizationId);
    const query = queryParams.toString();
    return this.request(`/api/enhanced-clients/${clientId}/communications${query ? `?${query}` : ''}`);
  }

  async getClientDocuments(clientId: string, organizationId?: string): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (organizationId) queryParams.append('organizationId', organizationId);
    const query = queryParams.toString();
    return this.request(`/api/enhanced-clients/${clientId}/documents${query ? `?${query}` : ''}`);
  }

  async getClientStateCompliance(clientId: string): Promise<ApiResponse<any>> {
    return this.request(`/api/enhanced-clients/${clientId}/state-compliance`);
  }

  async getEnhancedSystemOverview(organizationId?: string): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (organizationId) queryParams.append('organizationId', organizationId);
    
    const query = queryParams.toString();
    return this.request(`/api/enhanced-system/overview${query ? `?${query}` : ''}`);
  }

  async getEnhancedUsers(organizationId?: string): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (organizationId) queryParams.append('organizationId', organizationId);
    
    const query = queryParams.toString();
    return this.request(`/api/enhanced-system/users${query ? `?${query}` : ''}`);
  }

  async getEnhancedIntegrations(organizationId?: string): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (organizationId) queryParams.append('organizationId', organizationId);
    
    const query = queryParams.toString();
    return this.request(`/api/enhanced-system/integrations${query ? `?${query}` : ''}`);
  }

  async getEnhancedAuditLogs(params?: {
    organizationId?: string;
    page?: number;
    limit?: number;
    action?: string;
    resourceType?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<{
    auditLogs: any[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }>> {
    const queryParams = new URLSearchParams();
    if (params?.organizationId) queryParams.append('organizationId', params.organizationId);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.action) queryParams.append('action', params.action);
    if (params?.resourceType) queryParams.append('resourceType', params.resourceType);
    if (params?.userId) queryParams.append('userId', params.userId);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    const query = queryParams.toString();
    return this.request(`/api/enhanced-system/audit-logs${query ? `?${query}` : ''}`);
  }

  async getEnhancedNexusDashboardSummary(params?: {
    organizationId?: string;
    clientId?: string;
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params?.organizationId) queryParams.append('organizationId', params.organizationId);
    if (params?.clientId) queryParams.append('clientId', params.clientId);
    
    const query = queryParams.toString();
    return this.request(`/api/enhanced-nexus/dashboard-summary${query ? `?${query}` : ''}`);
  }

  async getEnhancedClientStates(params?: {
    organizationId?: string;
    clientId?: string;
    stateCode?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{
    clientStates: any[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }>> {
    const queryParams = new URLSearchParams();
    if (params?.organizationId) queryParams.append('organizationId', params.organizationId);
    if (params?.clientId) queryParams.append('clientId', params.clientId);
    if (params?.stateCode) queryParams.append('stateCode', params.stateCode);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const query = queryParams.toString();
    return this.request(`/api/enhanced-nexus/client-states${query ? `?${query}` : ''}`);
  }

  async getEnhancedStateCompliance(clientId: string, organizationId?: string): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (organizationId) queryParams.append('organizationId', organizationId);
    
    const query = queryParams.toString();
    return this.request(`/api/enhanced-nexus/state-compliance/${clientId}${query ? `?${query}` : ''}`);
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export types
export type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  User,
  Client,
  Consultation,
  Communication,
  Alert,
  Task,
  Document,
  ProfessionalDecision,
  PerformanceMetric,
};
