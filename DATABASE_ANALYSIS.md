# Database Schema Analysis & Relationship Mapping

## Core Tables & Relationships

### 1. **Organization** (Root Entity)
- **Primary Key**: `id`
- **Relationships**: 
  - One-to-Many with: `User`, `Client`, `Alert`, `Task`, `Document`, `GeneratedDashboard`
  - One-to-Many with: `AuditLog`, `BusinessLocation`, `BusinessProfile`, `ClientState`
  - One-to-Many with: `NexusAlert`, `NexusActivity`, `DataProcessing`, `Contact`
  - One-to-Many with: `RevenueBreakdown`, `CustomerDemographics`, `GeographicDistribution`
  - One-to-Many with: `AuditTrail`, `Consultation`, `Communication`, `ProfessionalDecision`
  - One-to-Many with: `ComplianceStandard`, `RegulatoryChange`, `Integration`
  - One-to-Many with: `PerformanceMetric`, `OrganizationMetadata`

### 2. **User** (Authentication & Authorization)
- **Primary Key**: `id`
- **Foreign Keys**: `organizationId` → `Organization.id`
- **Relationships**:
  - Many-to-One: `Organization`
  - One-to-Many: `UserSession`, `UserPermission`
  - One-to-Many: `Alert` (assignedTo), `Task` (assignedTo)
  - One-to-Many: `Document` (uploadedBy, reviewedBy, approvedBy)
  - One-to-Many: `ProfessionalDecision` (decisionMaker, peerReviewer)
  - One-to-Many: `Client` (assignedManager, assignedPartner)

### 3. **Client** (Core Business Entity)
- **Primary Key**: `id`
- **Foreign Keys**: 
  - `organizationId` → `Organization.id`
  - `assignedManager` → `User.id`
  - `assignedPartner` → `User.id`
- **Relationships**:
  - Many-to-One: `Organization`, `User` (assignedManager, assignedPartner)
  - One-to-One: `BusinessProfile`, `CustomerDemographics`
  - One-to-Many: `Alert`, `Task`, `Document`, `ProfessionalDecision`
  - One-to-Many: `ClientState`, `NexusAlert`, `NexusActivity`, `DataProcessing`
  - One-to-Many: `Contact`, `BusinessLocation`, `RevenueBreakdown`
  - One-to-Many: `GeographicDistribution`, `AuditTrail`, `Consultation`, `Communication`

### 4. **Alert** (System Notifications)
- **Primary Key**: `id`
- **Foreign Keys**: 
  - `organizationId` → `Organization.id`
  - `clientId` → `Client.id`
  - `assignedTo` → `User.id`
- **Relationships**:
  - Many-to-One: `Organization`, `Client`, `User`
  - One-to-Many: `AlertAction`, `Communication`, `Consultation`

### 5. **Task** (Work Management)
- **Primary Key**: `id`
- **Foreign Keys**: 
  - `organizationId` → `Organization.id`
  - `clientId` → `Client.id`
  - `assignedTo` → `User.id`
- **Relationships**:
  - Many-to-One: `Organization`, `Client`, `User`
  - One-to-Many: `TaskStep`

### 6. **Document** (File Management)
- **Primary Key**: `id`
- **Foreign Keys**: 
  - `organizationId` → `Organization.id`
  - `clientId` → `Client.id`
  - `uploadedBy` → `User.id`
  - `reviewedBy` → `User.id`
  - `approvedBy` → `User.id`
- **Relationships**:
  - Many-to-One: `Organization`, `Client`, `User` (uploadedBy, reviewedBy, approvedBy)

### 7. **ClientState** (State Monitoring)
- **Primary Key**: `id`
- **Foreign Keys**: 
  - `clientId` → `Client.id`
  - `organizationId` → `Organization.id`
- **Unique Constraint**: `[clientId, stateCode]`
- **Relationships**:
  - Many-to-One: `Client`, `Organization`

### 8. **NexusAlert** (State-Specific Alerts)
- **Primary Key**: `id`
- **Foreign Keys**: 
  - `clientId` → `Client.id`
  - `organizationId` → `Organization.id`
- **Relationships**:
  - Many-to-One: `Client`, `Organization`

### 9. **NexusActivity** (State Activities)
- **Primary Key**: `id`
- **Foreign Keys**: 
  - `clientId` → `Client.id`
  - `organizationId` → `Organization.id`
- **Relationships**:
  - Many-to-One: `Client`, `Organization`

### 10. **ProfessionalDecision** (Decision Tracking)
- **Primary Key**: `id`
- **Foreign Keys**: 
  - `clientId` → `Client.id`
  - `organizationId` → `Organization.id`
  - `decisionMakerId` → `User.id`
  - `peerReviewerId` → `User.id`
- **Relationships**:
  - Many-to-One: `Client`, `Organization`, `User` (decisionMaker, peerReviewer)

### 11. **BusinessProfile** (Client Business Details)
- **Primary Key**: `id`
- **Foreign Keys**: 
  - `clientId` → `Client.id` (One-to-One)
  - `organizationId` → `Organization.id`
- **Relationships**:
  - One-to-One: `Client`
  - Many-to-One: `Organization`

### 12. **Contact** (Client Contacts)
- **Primary Key**: `id`
- **Foreign Keys**: 
  - `clientId` → `Client.id`
  - `organizationId` → `Organization.id`
- **Relationships**:
  - Many-to-One: `Client`, `Organization`

### 13. **BusinessLocation** (Physical Locations)
- **Primary Key**: `id`
- **Foreign Keys**: 
  - `clientId` → `Client.id`
  - `organizationId` → `Organization.id`
- **Relationships**:
  - Many-to-One: `Client`, `Organization`

### 14. **RevenueBreakdown** (Revenue Analysis)
- **Primary Key**: `id`
- **Foreign Keys**: 
  - `clientId` → `Client.id`
  - `organizationId` → `Organization.id`
- **Relationships**:
  - Many-to-One: `Client`, `Organization`

### 15. **CustomerDemographics** (Customer Metrics)
- **Primary Key**: `id`
- **Foreign Keys**: 
  - `clientId` → `Client.id` (One-to-One)
  - `organizationId` → `Organization.id`
- **Relationships**:
  - One-to-One: `Client`
  - Many-to-One: `Organization`

### 16. **GeographicDistribution** (State Distribution)
- **Primary Key**: `id`
- **Foreign Keys**: 
  - `clientId` → `Client.id`
  - `organizationId` → `Organization.id`
- **Relationships**:
  - Many-to-One: `Client`, `Organization`

### 17. **Consultation** (Client Meetings)
- **Primary Key**: `id`
- **Foreign Keys**: 
  - `clientId` → `Client.id`
  - `organizationId` → `Organization.id`
  - `alertId` → `Alert.id`
- **Relationships**:
  - Many-to-One: `Client`, `Organization`, `Alert`

### 18. **Communication** (Client Communications)
- **Primary Key**: `id`
- **Foreign Keys**: 
  - `clientId` → `Client.id`
  - `organizationId` → `Organization.id`
  - `alertId` → `Alert.id`
- **Relationships**:
  - Many-to-One: `Client`, `Organization`, `Alert`

### 19. **AuditTrail** (Change Tracking)
- **Primary Key**: `id`
- **Foreign Keys**: 
  - `clientId` → `Client.id`
  - `organizationId` → `Organization.id`
- **Relationships**:
  - Many-to-One: `Client`, `Organization`

### 20. **DataProcessing** (File Processing)
- **Primary Key**: `id`
- **Foreign Keys**: 
  - `clientId` → `Client.id`
  - `organizationId` → `Organization.id`
- **Relationships**:
  - Many-to-One: `Client`, `Organization`

### 21. **StateTaxInfo** (Reference Data)
- **Primary Key**: `id`
- **Unique**: `stateCode`
- **Relationships**: None (Reference table)

### 22. **GeneratedDashboard** (Dashboard References)
- **Primary Key**: `id`
- **Foreign Keys**: 
  - `organizationId` → `Organization.id`
- **Relationships**:
  - Many-to-One: `Organization`

## Dashboard Data Requirements Analysis

### Managing Partner Dashboard
**Data Needs**:
- Client overview and performance metrics
- Alert summaries and risk assessments
- Task management and team performance
- Revenue and compliance analytics
- State monitoring and nexus alerts

**Required Tables**:
- `Client` (with relationships)
- `Alert` (with client and user relationships)
- `Task` (with assignments)
- `ClientState` (state monitoring)
- `NexusAlert` (state-specific alerts)
- `RevenueBreakdown` (financial metrics)
- `PerformanceMetric` (analytics)

### Tax Manager Dashboard
**Data Needs**:
- Client state compliance status
- Nexus monitoring and alerts
- Tax-related tasks and deadlines
- Regulatory updates and changes
- Professional decisions and liability

**Required Tables**:
- `Client` (with business profile)
- `ClientState` (compliance status)
- `NexusAlert` (state alerts)
- `NexusActivity` (state activities)
- `Task` (tax-related tasks)
- `ProfessionalDecision` (decisions)
- `RegulatoryChange` (updates)
- `Consultation` (client meetings)

### System Admin Dashboard
**Data Needs**:
- System health and performance
- User management and permissions
- Integration status and monitoring
- Audit logs and security
- Organization settings

**Required Tables**:
- `User` (with permissions and sessions)
- `Organization` (settings and metadata)
- `Integration` (system integrations)
- `AuditLog` (system logs)
- `PerformanceMetric` (system metrics)
- `UserSession` (active sessions)
- `UserPermission` (access control)

## Data Consistency Requirements

### 1. **Client-Centric Views**
All client-related dashboards should show:
- Client basic info (name, industry, revenue, risk level)
- Current state compliance status
- Active alerts and tasks
- Recent activities and decisions

### 2. **State-Centric Views**
All state-related data should include:
- State code and name
- Current compliance status
- Threshold amounts and current amounts
- Alert status and priority
- Recent activities

### 3. **User-Centric Views**
All user-related data should include:
- User role and permissions
- Assigned clients and tasks
- Recent activities and decisions
- Performance metrics

### 4. **Organization-Centric Views**
All organization-level data should include:
- Organization settings and metadata
- User counts and roles
- Client counts and metrics
- System health and performance
