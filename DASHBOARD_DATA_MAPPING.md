# Dashboard Data Mapping & Implementation Plan

## Current Dashboard Routes Analysis

### 1. **Managing Partner Dashboard** (`/dashboard/managing-partner`)
**Current Data Sources**:
- `useClients()` - Client list and performance
- `useAlerts()` - System alerts and notifications
- `useTasks()` - Task management and assignments
- `useAnalytics()` - Performance metrics and KPIs

**Required Database Tables**:
- `Client` (with relationships: `BusinessProfile`, `Contact`, `BusinessLocation`)
- `Alert` (with relationships: `Client`, `User`)
- `Task` (with relationships: `Client`, `User`)
- `ClientState` (state monitoring data)
- `NexusAlert` (state-specific alerts)
- `RevenueBreakdown` (financial metrics)
- `PerformanceMetric` (analytics)
- `ProfessionalDecision` (decision tracking)
- `Consultation` (client meetings)
- `Communication` (client communications)

### 2. **Tax Manager Dashboard** (`/dashboard/tax-manager`)
**Current Data Sources**:
- `useNexusAlerts()` - State-specific alerts
- `useClientStates()` - State compliance status
- `useNexusActivities()` - State activities
- `useConsultations()` - Client meetings
- `useCommunications()` - Client communications

**Required Database Tables**:
- `Client` (with `BusinessProfile`)
- `ClientState` (compliance status per state)
- `NexusAlert` (state-specific alerts)
- `NexusActivity` (state activities)
- `Task` (tax-related tasks)
- `ProfessionalDecision` (tax decisions)
- `Consultation` (client meetings)
- `Communication` (client communications)
- `RegulatoryChange` (regulatory updates)
- `StateTaxInfo` (state tax information)

### 3. **System Admin Dashboard** (`/dashboard/system-admin`)
**Current Data Sources**:
- `useClients()` - Client overview
- `useAlerts()` - System alerts
- `useTasks()` - System tasks
- `useAnalytics()` - System metrics

**Required Database Tables**:
- `User` (with `UserSession`, `UserPermission`)
- `Organization` (with `OrganizationMetadata`)
- `Integration` (system integrations)
- `AuditLog` (system audit logs)
- `PerformanceMetric` (system performance)
- `Client` (client overview)
- `Alert` (system alerts)
- `Task` (system tasks)

## Comprehensive Data Implementation Plan

### Phase 1: Core Data Services
Create comprehensive data services that query all related tables with proper joins.

### Phase 2: Dashboard-Specific Data Aggregation
Implement dashboard-specific data aggregation services.

### Phase 3: API Route Enhancement
Enhance existing API routes to include all related data.

### Phase 4: Frontend Integration
Update frontend components to use comprehensive data.

## Detailed Implementation

### 1. **Client Data Service**
```typescript
interface ClientDataService {
  getClientWithRelations(clientId: string): Promise<ClientWithRelations>;
  getClientsWithRelations(params: ClientParams): Promise<ClientWithRelations[]>;
}

interface ClientWithRelations {
  // Core client data
  id: string;
  name: string;
  industry: string;
  riskLevel: string;
  qualityScore: number;
  
  // Related data
  businessProfile: BusinessProfile;
  contacts: Contact[];
  businessLocations: BusinessLocation[];
  clientStates: ClientState[];
  revenueBreakdowns: RevenueBreakdown[];
  customerDemographics: CustomerDemographics;
  geographicDistributions: GeographicDistribution[];
  
  // Activity data
  alerts: Alert[];
  tasks: Task[];
  nexusAlerts: NexusAlert[];
  nexusActivities: NexusActivity[];
  consultations: Consultation[];
  communications: Communication[];
  professionalDecisions: ProfessionalDecision[];
  documents: Document[];
  auditTrails: AuditTrail[];
}
```

### 2. **State Monitoring Data Service**
```typescript
interface StateMonitoringService {
  getStateComplianceData(clientId: string): Promise<StateComplianceData>;
  getStateAlerts(clientId: string, stateCode?: string): Promise<NexusAlert[]>;
  getStateActivities(clientId: string, stateCode?: string): Promise<NexusActivity[]>;
}

interface StateComplianceData {
  clientStates: ClientState[];
  stateTaxInfo: StateTaxInfo[];
  nexusAlerts: NexusAlert[];
  nexusActivities: NexusActivity[];
  complianceMetrics: {
    totalStates: number;
    compliantStates: number;
    nonCompliantStates: number;
    atRiskStates: number;
  };
}
```

### 3. **System Administration Data Service**
```typescript
interface SystemAdminService {
  getSystemOverview(): Promise<SystemOverview>;
  getUserManagement(): Promise<UserManagementData>;
  getSystemHealth(): Promise<SystemHealthData>;
  getAuditLogs(): Promise<AuditLog[]>;
}

interface SystemOverview {
  organization: Organization;
  users: UserWithRelations[];
  clients: ClientSummary[];
  integrations: Integration[];
  performanceMetrics: PerformanceMetric[];
}

interface UserWithRelations {
  // Core user data
  id: string;
  email: string;
  role: string;
  status: string;
  
  // Related data
  userSessions: UserSession[];
  userPermissions: UserPermission[];
  assignedClients: Client[];
  assignedTasks: Task[];
  createdDecisions: ProfessionalDecision[];
}
```

## API Route Enhancements

### 1. **Enhanced Client API** (`/api/clients`)
```typescript
// GET /api/clients - Enhanced with all relationships
interface ClientListResponse {
  clients: ClientWithRelations[];
  total: number;
  page: number;
  limit: number;
  summary: {
    totalClients: number;
    activeClients: number;
    highRiskClients: number;
    totalRevenue: number;
    averageQualityScore: number;
  };
}
```

### 2. **Enhanced Nexus API** (`/api/nexus`)
```typescript
// GET /api/nexus/dashboard-summary - Comprehensive state data
interface NexusDashboardSummary {
  clientStates: ClientState[];
  nexusAlerts: NexusAlert[];
  nexusActivities: NexusActivity[];
  stateTaxInfo: StateTaxInfo[];
  complianceMetrics: ComplianceMetrics;
  riskAssessment: RiskAssessment;
}
```

### 3. **System Admin API** (`/api/system`)
```typescript
// GET /api/system/overview - System administration data
interface SystemOverviewResponse {
  organization: Organization;
  users: UserWithRelations[];
  clients: ClientSummary[];
  integrations: Integration[];
  performanceMetrics: PerformanceMetric[];
  auditLogs: AuditLog[];
  systemHealth: SystemHealthData;
}
```

## Frontend Component Updates

### 1. **Managing Partner Dashboard Components**
- `ClientPerformanceTable` - Enhanced with business profile, contacts, locations
- `AlertManagement` - Enhanced with client relationships and user assignments
- `TaskManagement` - Enhanced with client context and user assignments
- `AnalyticsDashboard` - Enhanced with comprehensive metrics

### 2. **Tax Manager Dashboard Components**
- `NexusMonitoringTable` - Enhanced with state tax info and compliance status
- `ClientStateOverview` - Enhanced with detailed state compliance data
- `RegulatoryUpdates` - New component for regulatory changes
- `ProfessionalDecisions` - New component for decision tracking

### 3. **System Admin Dashboard Components**
- `UserManagement` - Enhanced with permissions and sessions
- `SystemHealth` - Enhanced with performance metrics
- `IntegrationStatus` - New component for integration monitoring
- `AuditTrail` - New component for audit log viewing

## Data Consistency Requirements

### 1. **Client-Centric Consistency**
All client-related data should be consistent across dashboards:
- Client basic information (name, industry, risk level)
- Business profile and contact information
- State compliance status
- Current alerts and tasks
- Recent activities and decisions

### 2. **State-Centric Consistency**
All state-related data should be consistent:
- State code and name
- Compliance status and thresholds
- Alert status and priorities
- Recent activities and changes
- Tax information and deadlines

### 3. **User-Centric Consistency**
All user-related data should be consistent:
- User role and permissions
- Assigned clients and tasks
- Recent activities and decisions
- Performance metrics and KPIs

### 4. **Organization-Centric Consistency**
All organization-level data should be consistent:
- Organization settings and metadata
- User counts and roles
- Client counts and metrics
- System health and performance
- Integration status and monitoring

## Implementation Priority

### High Priority (Phase 1)
1. **Client Data Enhancement** - Add all client relationships
2. **State Monitoring Enhancement** - Add comprehensive state data
3. **Alert System Enhancement** - Add client and user relationships
4. **Task Management Enhancement** - Add client and user context

### Medium Priority (Phase 2)
1. **System Administration Enhancement** - Add user and system data
2. **Analytics Enhancement** - Add comprehensive metrics
3. **Document Management** - Add client and user relationships
4. **Communication System** - Add client and alert relationships

### Low Priority (Phase 3)
1. **Audit Trail Enhancement** - Add comprehensive audit data
2. **Integration Monitoring** - Add system integration data
3. **Performance Metrics** - Add detailed performance data
4. **Regulatory Updates** - Add regulatory change tracking
