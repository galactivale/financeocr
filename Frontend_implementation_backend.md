# Frontend Implementation Backend Mapping

## Overview
This document provides a comprehensive mapping of all frontend API calls to their corresponding backend implementations in the SIFA CPA Dashboard system. It details the data structures, request/response formats, and implementation patterns used throughout the system.

## API Base Configuration

### Frontend API Client (`lib/api.ts`)
- **Base URL**: `http://localhost:3080` (configurable via `NEXT_PUBLIC_API_URL`)
- **Content-Type**: `application/json`
- **Authentication**: Demo mode (no authentication required)

### Backend Server (`server/src/app.js`)
- **Port**: 3080 (configurable via `PORT` environment variable)
- **CORS**: Enabled for `http://localhost:3000`
- **Body Limit**: 10MB
- **Compression**: Enabled

## Core API Routes Mapping

### 1. Client Management APIs

#### Frontend: `apiClient.getClients(params)`
**Route**: `GET /api/clients`
**Backend**: `server/src/routes/clients.js` - `router.get('/')`

**Request Parameters**:
```typescript
{
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  riskLevel?: string;
}
```

**Backend Implementation**:
```javascript
// Query building with Prisma
const where = {};
if (search) {
  where.OR = [
    { name: { contains: search, mode: 'insensitive' } },
    { industry: { contains: search, mode: 'insensitive' } },
    { legalName: { contains: search, mode: 'insensitive' } }
  ];
}
if (status) where.status = status;
if (riskLevel) where.riskLevel = riskLevel;

// Data transformation
const transformedClients = clients.map(client => ({
  id: client.id,
  slug: client.slug,
  name: client.name,
  avatar: client.name.charAt(0).toUpperCase(),
  industry: client.industry,
  revenue: client.annualRevenue || 0,
  riskLevel: calculateRiskLevel(client),
  penaltyExposure: calculatePenaltyExposure(client),
  // ... additional computed fields
}));
```

**Response Structure**:
```typescript
{
  success: boolean;
  data: {
    clients: Client[];
    total: number;
    page: number;
    limit: number;
  }
}
```

#### Frontend: `apiClient.getClient(id)`
**Route**: `GET /api/clients/:id`
**Backend**: `server/src/routes/clients.js` - `router.get('/:id')`

**Backend Implementation**:
```javascript
// Handle both UUID and slug lookups
const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
const whereClause = isUUID ? { id } : { slug: id };

const client = await prisma.client.findUnique({
  where: whereClause,
  include: {
    organization: true,
    clientStates: true,
    nexusAlerts: true,
    communications: true,
    businessProfile: true,
    contacts: true,
    businessLocations: true,
    revenueBreakdowns: true,
    customerDemographics: true,
    geographicDistributions: true,
  },
});
```

### 2. Enhanced Client APIs

#### Frontend: `apiClient.getEnhancedClient(id, organizationId)`
**Route**: `GET /api/enhanced-clients/:id`
**Backend**: `server/src/routes/enhanced-clients.js` - `router.get('/:id')`

**Backend Implementation**:
```javascript
const client = await prisma.client.findFirst({
  where: { 
    OR: [{ id: id }, { slug: id }],
    organizationId: organizationId,
    status: 'active'
  },
  include: {
    clientStates: { orderBy: { lastUpdated: 'desc' } },
    businessProfile: true,
    contacts: { orderBy: { createdAt: 'desc' } },
    businessLocations: { orderBy: { createdAt: 'desc' } },
    revenueBreakdowns: { orderBy: { createdAt: 'desc' } },
    customerDemographics: true,
    geographicDistributions: { orderBy: { percentage: 'desc' } },
    nexusAlerts: { where: { status: 'open' }, orderBy: { createdAt: 'desc' } },
    nexusActivities: { orderBy: { createdAt: 'desc' }, take: 10 },
    alerts: { where: { status: { not: 'resolved' } }, orderBy: { detectedAt: 'desc' } },
    tasks: { orderBy: { createdAt: 'desc' }, take: 20 },
    professionalDecisions: { orderBy: { decisionDate: 'desc' }, take: 10 },
    consultations: { orderBy: { createdAt: 'desc' }, take: 10 },
    communications: { orderBy: { createdAt: 'desc' }, take: 20 },
    documents: { orderBy: { uploadedAt: 'desc' }, take: 20 },
    auditTrails: { orderBy: { performedAt: 'desc' }, take: 50 },
    dataProcessing: { orderBy: { createdAt: 'desc' }, take: 10 }
  }
});
```

### 3. Nexus Management APIs

#### Frontend: `apiClient.getNexusAlerts(params)`
**Route**: `GET /api/nexus/alerts`
**Backend**: `server/src/routes/nexus.js` - `router.get('/alerts')`

**Backend Implementation**:
```javascript
const alerts = await prisma.nexusAlert.findMany({
  where,
  include: {
    client: {
      select: {
        id: true,
        name: true,
        legalName: true,
        industry: true
      }
    }
  },
  orderBy: { createdAt: 'desc' },
  take: parseInt(limit),
  skip: parseInt(offset)
});
```

#### Frontend: `apiClient.getClientStates(params)`
**Route**: `GET /api/nexus/client-states`
**Backend**: `server/src/routes/nexus.js` - `router.get('/client-states')`

**Backend Implementation**:
```javascript
const clientStates = await prisma.clientState.findMany({
  where,
  include: {
    client: {
      select: {
        id: true,
        name: true,
        legalName: true,
        industry: true
      }
    }
  },
  orderBy: { lastUpdated: 'desc' },
  take: parseInt(limit),
  skip: parseInt(offset)
});
```

### 4. Dashboard Generation APIs

#### Frontend: `apiClient.generateDashboard(formData, organizationId)`
**Route**: `POST /api/dashboards/generate`
**Backend**: `server/src/routes/dashboards.js` - `router.post('/generate')`

**Request Body**:
```typescript
{
  formData: {
    clientName: string;
    multiStateClientCount: string;
    priorityStates: string[];
    painPoints: string[];
    primaryIndustry: string;
    qualificationStrategy: string;
    additionalNotes?: string;
  };
  organizationId: string;
}
```

**Backend Implementation**:
```javascript
// Generate comprehensive dashboard data using risk-based approach
const generatedData = await generateDashboardData(formData, organizationId);

// Create dashboard record
const generatedDashboard = await prisma.generatedDashboard.create({
  data: {
    organizationId,
    clientName: formData.clientName,
    uniqueUrl: generateUniqueUrl(formData.clientName),
    clientInfo: {
      name: formData.clientName,
      industry: formData.primaryIndustry || 'Technology',
      totalClients: totalClients,
      riskDistribution: riskDistribution,
      totalPenaltyExposure: totalPenaltyExposure
    },
    keyMetrics: {
      totalRevenue: totalRevenue,
      complianceScore: averageQualityScore,
      riskScore: calculateRiskScore(riskDistribution),
      statesMonitored: formData.priorityStates.length,
      alertsActive: calculateActiveAlerts(generatedData),
      tasksCompleted: calculateCompletedTasks(generatedData)
    },
    statesMonitored: formData.priorityStates,
    personalizedData: {
      clientCount: totalClients,
      riskDistribution: riskDistribution,
      totalPenaltyExposure: totalPenaltyExposure,
      clientIds: generatedData.clients.map(c => c.client.id),
      generatedAt: new Date().toISOString()
    },
    lastUpdated: new Date()
  }
});
```

#### Frontend: `apiClient.getDashboard(url)`
**Route**: `GET /api/dashboards/:url`
**Backend**: `server/src/routes/dashboards.js` - `router.get('/:url')`

**Backend Implementation**:
```javascript
const dashboard = await prisma.generatedDashboard.findUnique({
  where: { 
    uniqueUrl: url,
    isActive: true 
  },
  include: {
    organization: {
      select: {
        name: true,
        slug: true
      }
    }
  }
});
```

#### Frontend: `apiClient.getDashboards(organizationId)`
**Route**: `GET /api/dashboards`
**Backend**: `server/src/routes/dashboards.js` - `router.get('/')`

**Backend Implementation**:
```javascript
const dashboards = await prisma.generatedDashboard.findMany({
  where: { 
    organizationId,
    isActive: true 
  },
  orderBy: { createdAt: 'desc' },
  select: {
    id: true,
    clientName: true,
    uniqueUrl: true,
    clientInfo: true,
    keyMetrics: true,
    statesMonitored: true,
    lastUpdated: true,
    createdAt: true
  }
});
```

### 5. Dashboard Deletion APIs

#### Frontend: `apiClient.deleteDashboard(dashboardId)`
**Route**: `DELETE /api/dashboards/:id`
**Backend**: `server/src/routes/dashboards.js` - `router.delete('/:id')`

**Backend Implementation**:
```javascript
// Comprehensive deletion with detailed logging
const deleteResults = {
  generatedDashboard: 0,
  clients: 0,
  clientStates: 0,
  nexusAlerts: 0,
  nexusActivities: 0,
  alerts: 0,
  tasks: 0,
  businessProfiles: 0,
  contacts: 0,
  businessLocations: 0,
  revenueBreakdowns: 0,
  customerDemographics: 0,
  geographicDistributions: 0,
  professionalDecisions: 0,
  consultations: 0,
  communications: 0,
  documents: 0,
  auditTrails: 0,
  dataProcessing: 0
};

// Delete related data in correct order to respect foreign key constraints
if (clientId) {
  const deletedClientStates = await prisma.clientState.deleteMany({
    where: { clientId, organizationId }
  });
  deleteResults.clientStates = deletedClientStates.count;
  
  // ... continue with other related data deletions
  
  const deletedClients = await prisma.client.deleteMany({
    where: { id: clientId, organizationId }
  });
  deleteResults.clients = deletedClients.count;
}

// Finally delete the dashboard
const deletedDashboard = await prisma.generatedDashboard.delete({
  where: { id }
});
deleteResults.generatedDashboard = 1;
```

### 6. Risk Portfolio APIs

#### Frontend: `fetch('/api/risk-portfolio?organizationId=${organizationId}')`
**Route**: `GET /api/risk-portfolio`
**Backend**: `server/src/routes/risk-portfolio.js` - `router.get('/')`

**Backend Implementation**:
```javascript
// Get all clients with their risk data
const clients = await prisma.client.findMany({
  where: { 
    organizationId: organizationId,
    status: 'active'
  },
  include: {
    clientStates: { orderBy: { lastUpdated: 'desc' } },
    nexusAlerts: { where: { status: 'open' }, orderBy: { createdAt: 'desc' } },
    alerts: { where: { status: { not: 'resolved' } }, orderBy: { detectedAt: 'desc' } },
    tasks: { where: { status: { not: 'completed' } }, orderBy: { createdAt: 'desc' } }
  },
  orderBy: { riskLevel: 'desc' }
});

// Calculate portfolio metrics
const riskDistribution = {
  low: clients.filter(c => c.riskLevel === 'low').length,
  medium: clients.filter(c => c.riskLevel === 'medium').length,
  high: clients.filter(c => c.riskLevel === 'high').length,
  critical: clients.filter(c => c.riskLevel === 'critical').length
};

const totalPenaltyExposure = clients.reduce((sum, c) => sum + (c.penaltyExposure || 0), 0);
const totalRevenue = clients.reduce((sum, c) => sum + (c.annualRevenue || 0), 0);
const averageQualityScore = clients.length > 0 ? 
  Math.round(clients.reduce((sum, c) => sum + (c.qualityScore || 0), 0) / clients.length) : 0;
```

### 7. Enhanced System APIs

#### Frontend: `apiClient.getEnhancedSystemOverview(organizationId)`
**Route**: `GET /api/enhanced-system/overview`
**Backend**: `server/src/routes/enhanced-system.js` - `router.get('/overview')`

**Backend Implementation**:
```javascript
// Get organization with metadata
const organization = await prisma.organization.findUnique({
  where: { id: organizationId },
  include: { organizationMetadata: true }
});

// Get users with all relationships
const users = await prisma.user.findMany({
  where: { organizationId },
  include: {
    userSessions: { where: { expiresAt: { gt: new Date() } }, orderBy: { createdAt: 'desc' } },
    userPermissions: true,
    managedClients: { select: { id: true, name: true, status: true } },
    assignedClients: { select: { id: true, name: true, status: true } },
    assignedTasks: { select: { id: true, title: true, status: true, priority: true } },
    createdDecisions: { select: { id: true, decisionType: true, status: true, decisionDate: true } }
  },
  orderBy: { createdAt: 'desc' }
});

// Calculate system health metrics
const systemHealth = await calculateSystemHealth(organizationId);
```

### 8. Enhanced Nexus APIs

#### Frontend: `apiClient.getEnhancedNexusDashboardSummary(params)`
**Route**: `GET /api/enhanced-nexus/dashboard-summary`
**Backend**: `server/src/routes/enhanced-nexus.js` - `router.get('/dashboard-summary')`

**Backend Implementation**:
```javascript
// Get client states with client information
const clientStates = await prisma.clientState.findMany({
  where,
  include: {
    client: {
      select: { id: true, name: true, industry: true, riskLevel: true }
    }
  },
  orderBy: { lastUpdated: 'desc' }
});

// Get nexus alerts
const nexusAlerts = await prisma.nexusAlert.findMany({
  where,
  include: {
    client: {
      select: { id: true, name: true, industry: true }
    }
  },
  orderBy: { createdAt: 'desc' }
});

// Calculate compliance metrics
const complianceMetrics = calculateComplianceMetrics(clientStates);

// Calculate risk assessment
const riskAssessment = calculateRiskAssessment(clientStates, nexusAlerts);
```

## Frontend Hook Implementations

### 1. Enhanced API Hooks (`hooks/useEnhancedApi.ts`)

#### `useEnhancedClients(params)`
```typescript
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
```

#### `useManagingPartnerDashboard(organizationId)`
```typescript
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

  return { data: combinedData, loading, error, refetch };
}
```

### 2. Client Detail Hooks (`hooks/useClientDetail.ts`)

#### `useClientDetail({ clientId, organizationId, enabled })`
```typescript
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

  return { data, loading, error, refetch };
}
```

## Data Structure Patterns

### 1. Standard API Response Format
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}
```

### 2. Pagination Structure
```typescript
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

### 3. Client Data Structure
```typescript
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
```

### 4. Dashboard Data Structure
```typescript
interface DashboardData {
  id: string;
  clientName: string;
  uniqueUrl: string;
  clientInfo: {
    name: string;
    industry: string;
    totalClients: number;
    riskDistribution: {
      low: number;
      medium: number;
      high: number;
      critical: number;
    };
    totalPenaltyExposure: number;
  };
  keyMetrics: {
    totalRevenue: number;
    complianceScore: number;
    riskScore: number;
    statesMonitored: number;
    alertsActive: number;
    tasksCompleted: number;
  };
  statesMonitored: string[];
  personalizedData: {
    clientCount: number;
    riskDistribution: any;
    totalPenaltyExposure: number;
    clientIds: string[];
    generatedAt: string;
  };
  lastUpdated: string;
}
```

## Error Handling Patterns

### 1. Frontend Error Handling
```typescript
private async request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, { ...options, headers });
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
```

### 2. Backend Error Handling
```javascript
try {
  // API logic here
  res.json({ success: true, data: result });
} catch (error) {
  console.error('Error in API:', error);
  res.status(500).json({ 
    success: false,
    error: 'Failed to process request',
    details: error.message 
  });
}
```

## Performance Optimizations

### 1. Database Query Optimization
- **Selective Field Loading**: Using `select` to load only required fields
- **Relationship Loading**: Using `include` for related data
- **Pagination**: Implementing `skip` and `take` for large datasets
- **Ordering**: Using `orderBy` for consistent data ordering
- **Filtering**: Using `where` clauses for data filtering

### 2. Frontend Data Management
- **React Hooks**: Custom hooks for data fetching and state management
- **Dependency Arrays**: Proper dependency management in useEffect
- **Error Boundaries**: Comprehensive error handling
- **Loading States**: Proper loading state management
- **Data Caching**: Using React state for data caching

### 3. API Response Optimization
- **Data Transformation**: Backend data transformation to match frontend needs
- **Computed Fields**: Calculating derived fields on the backend
- **Batch Operations**: Combining multiple queries where possible
- **Response Compression**: Using compression middleware

## Security Considerations

### 1. CORS Configuration
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
```

### 2. Input Validation
- **Parameter Validation**: Checking required parameters
- **Type Validation**: Ensuring correct data types
- **SQL Injection Prevention**: Using Prisma ORM for safe queries
- **XSS Prevention**: Proper data sanitization

### 3. Error Information Disclosure
- **Production Error Handling**: Limiting error details in production
- **Logging**: Comprehensive logging for debugging
- **Error Codes**: Standardized error response format

## Monitoring and Logging

### 1. Request Logging
```javascript
app.use(morgan('combined', {
  stream: {
    write: (message) => console.log(message.trim()),
  },
}));
```

### 2. Error Logging
```javascript
console.error('Error in API:', {
  message: error.message,
  stack: error.stack,
  timestamp: new Date().toISOString(),
  endpoint: req.path,
  method: req.method
});
```

### 3. Performance Monitoring
- **Response Time Tracking**: Monitoring API response times
- **Database Query Performance**: Tracking slow queries
- **Memory Usage**: Monitoring memory consumption
- **Error Rates**: Tracking error frequencies

This comprehensive mapping provides a complete understanding of how the frontend and backend communicate, the data structures used, and the implementation patterns followed throughout the SIFA CPA Dashboard system.



