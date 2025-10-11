# Database Schema Documentation

## Overview
This document provides a comprehensive overview of the database schema for the SIFA CPA Dashboard system. The system uses PostgreSQL as the primary database with Prisma ORM for database management.

## Database Technology Stack
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Connection**: Environment variable `DATABASE_URL`

## Core Tables

### 1. Organizations
**Table**: `organizations`
**Purpose**: Central entity for multi-tenant architecture

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| slug | String (unique) | URL-friendly identifier |
| name | String | Organization name |
| legalName | String? | Legal business name |
| taxId | String? | Tax identification number |
| subscriptionTier | String | Subscription level (default: "trial") |
| subscriptionStatus | String | Active/inactive status |
| subscriptionStartedAt | DateTime? | Subscription start date |
| subscriptionExpiresAt | DateTime? | Subscription expiration |
| settings | Json | Organization-specific settings |
| branding | Json | Branding configuration |
| features | Json | Feature flags |
| email | String? | Contact email |
| phone | String? | Contact phone |
| website | String? | Organization website |
| addressLine1 | String? | Primary address |
| addressLine2 | String? | Secondary address |
| city | String? | City |
| state | String? | State |
| postalCode | String? | ZIP code |
| country | String | Country (default: "US") |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |
| createdBy | String? | User who created the organization |

### 2. Users
**Table**: `users`
**Purpose**: System users with role-based access

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| organizationId | String | Foreign key to organizations |
| email | String | User email (unique per organization) |
| passwordHash | String | Hashed password |
| mfaEnabled | Boolean | Multi-factor authentication status |
| mfaSecret | String? | MFA secret key |
| firstName | String? | User's first name |
| lastName | String? | User's last name |
| displayName | String? | Display name |
| avatarUrl | String? | Profile picture URL |
| title | String? | Job title |
| department | String? | Department |
| cpaLicense | String? | CPA license number |
| cpaState | String? | CPA license state |
| cpaExpiration | DateTime? | CPA license expiration |
| role | String | User role (admin, manager, staff, etc.) |
| status | String | User status (active, pending, suspended) |
| lastLogin | DateTime? | Last login timestamp |
| loginCount | Int | Total login count |
| createdAt | DateTime | Account creation date |
| updatedAt | DateTime | Last update timestamp |
| createdBy | String? | User who created this account |

### 3. Clients
**Table**: `clients`
**Purpose**: Client companies managed by the CPA firm

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| organizationId | String | Foreign key to organizations |
| name | String | Client company name |
| slug | String (unique) | URL-friendly identifier |
| legalName | String? | Legal business name |
| taxId | String? | Tax identification number |
| industry | String? | Industry classification |
| foundedYear | Int? | Year company was founded |
| employeeCount | Int? | Number of employees |
| annualRevenue | Decimal? | Annual revenue amount |
| fiscalYearEnd | DateTime? | Fiscal year end date |
| riskLevel | String? | Risk assessment level |
| penaltyExposure | Decimal? | Potential penalty exposure |
| qualityScore | Int? | Data quality score (0-100) |
| assignedPartner | String? | Assigned partner user ID |
| assignedManager | String? | Assigned manager user ID |
| assignedStaff | String[] | Array of assigned staff user IDs |
| assignedSince | DateTime? | Assignment start date |
| lastReview | DateTime? | Last review date |
| nextReview | DateTime? | Next scheduled review |
| primaryContactName | String? | Primary contact name |
| primaryContactEmail | String? | Primary contact email |
| primaryContactPhone | String? | Primary contact phone |
| addressLine1 | String? | Primary address |
| addressLine2 | String? | Secondary address |
| city | String? | City |
| state | String? | State |
| postalCode | String? | ZIP code |
| country | String | Country (default: "US") |
| status | String | Client status (active, inactive, archived) |
| avatarUrl | String? | Client logo URL |
| notes | String? | Internal notes |
| tags | String[] | Tag array for categorization |
| customFields | Json | Custom field data |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |
| createdBy | String? | User who created the client |

## Risk Management Tables

### 4. ClientStates
**Table**: `client_states`
**Purpose**: Track client nexus status across different states

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| clientId | String | Foreign key to clients |
| organizationId | String | Foreign key to organizations |
| stateCode | String | Two-letter state code |
| stateName | String | Full state name |
| status | String | Monitoring status (monitoring, compliant, warning, critical) |
| registrationRequired | Boolean | Whether registration is required |
| registrationDate | DateTime? | Registration date |
| registrationNumber | String? | State registration number |
| thresholdAmount | Decimal? | Nexus threshold amount |
| currentAmount | Decimal | Current sales/revenue amount |
| lastUpdated | DateTime | Last update timestamp |
| notes | String? | Additional notes |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### 5. NexusAlerts
**Table**: `nexus_alerts`
**Purpose**: Alert system for nexus threshold violations

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| clientId | String | Foreign key to clients |
| organizationId | String | Foreign key to organizations |
| stateCode | String | State where alert occurred |
| alertType | String | Type of alert |
| priority | String | Alert priority level |
| status | String | Alert status (open, acknowledged, resolved) |
| title | String | Alert title |
| description | String? | Detailed description |
| thresholdAmount | Decimal? | Threshold that was exceeded |
| currentAmount | Decimal | Current amount that triggered alert |
| deadline | DateTime? | Resolution deadline |
| penaltyRisk | Decimal? | Estimated penalty risk |
| isActive | Boolean | Whether alert is active |
| acknowledgedAt | DateTime? | Acknowledgment timestamp |
| acknowledgedBy | String? | User who acknowledged |
| resolvedAt | DateTime? | Resolution timestamp |
| resolvedBy | String? | User who resolved |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### 6. NexusActivity
**Table**: `nexus_activities`
**Purpose**: Track nexus-related activities and changes

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| clientId | String | Foreign key to clients |
| organizationId | String | Foreign key to organizations |
| stateCode | String | State code |
| activityType | String | Type of activity |
| title | String | Activity title |
| description | String? | Activity description |
| amount | Decimal? | Amount involved |
| thresholdAmount | Decimal? | Threshold amount |
| status | String | Activity status |
| metadata | Json? | Additional metadata |
| createdAt | DateTime | Creation timestamp |

## Alert and Task Management

### 7. Alerts
**Table**: `alerts`
**Purpose**: General alert system for various issues

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| organizationId | String | Foreign key to organizations |
| clientId | String? | Foreign key to clients (optional) |
| title | String | Alert title |
| description | String? | Alert description |
| issue | String? | Issue type |
| stateCode | String? | Related state |
| stateName | String? | State name |
| currentAmount | Decimal? | Current amount |
| thresholdAmount | Decimal? | Threshold amount |
| penaltyRisk | Decimal? | Penalty risk amount |
| priority | String | Alert priority |
| severity | String? | Alert severity |
| status | String | Alert status |
| type | String? | Alert type |
| category | String? | Alert category |
| deadline | DateTime? | Resolution deadline |
| detectedAt | DateTime | Detection timestamp |
| resolvedAt | DateTime? | Resolution timestamp |
| assignedTo | String? | Assigned user ID |
| assignedAt | DateTime? | Assignment timestamp |
| actions | String[] | Action items |
| resolutionNotes | String? | Resolution notes |
| affectedTenants | String[] | Affected tenants |
| affectedServices | String[] | Affected services |
| usersAffected | Int? | Number of users affected |
| estimatedDowntime | String? | Estimated downtime |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |
| createdBy | String? | Creator user ID |

### 8. Tasks
**Table**: `tasks`
**Purpose**: Task management system

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| organizationId | String | Foreign key to organizations |
| clientId | String? | Foreign key to clients |
| title | String | Task title |
| description | String? | Task description |
| category | String? | Task category |
| type | String? | Task type |
| priority | String? | Task priority |
| status | String | Task status |
| assignedTo | String? | Assigned user ID |
| assignedBy | String? | Assigner user ID |
| assignedAt | DateTime? | Assignment timestamp |
| dueDate | DateTime? | Due date |
| startedAt | DateTime? | Start timestamp |
| completedAt | DateTime? | Completion timestamp |
| estimatedHours | Decimal? | Estimated hours |
| actualHours | Decimal? | Actual hours worked |
| progress | Int | Progress percentage (0-100) |
| stateCode | String? | Related state |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |
| createdBy | String? | Creator user ID |

## Document Management

### 9. Documents
**Table**: `documents`
**Purpose**: Document storage and management

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| organizationId | String | Foreign key to organizations |
| clientId | String? | Foreign key to clients |
| name | String | Document name |
| description | String? | Document description |
| type | String? | Document type |
| category | String? | Document category |
| fileName | String? | Original file name |
| fileSize | BigInt? | File size in bytes |
| fileType | String? | MIME type |
| fileUrl | String? | File URL |
| filePath | String? | Server file path |
| status | String | Document status |
| version | Int | Version number |
| parentDocumentId | String? | Parent document ID for versions |
| visibility | String | Visibility level |
| tags | String[] | Tag array |
| metadata | Json | Additional metadata |
| uploadedAt | DateTime | Upload timestamp |
| uploadedBy | String? | Uploader user ID |
| reviewedBy | String? | Reviewer user ID |
| reviewedAt | DateTime? | Review timestamp |
| approvedBy | String? | Approver user ID |
| approvedAt | DateTime? | Approval timestamp |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

## Communication and Consultation

### 10. Communications
**Table**: `communications`
**Purpose**: Track client communications

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| organizationId | String | Foreign key to organizations |
| clientId | String | Foreign key to clients |
| alertId | String | Foreign key to alerts |
| type | String | Communication type |
| subject | String | Communication subject |
| content | String | Communication content |
| status | String | Communication status |
| sentDate | DateTime | Send timestamp |
| deliveryDate | DateTime? | Delivery timestamp |
| readDate | DateTime? | Read timestamp |
| failureReason | String? | Failure reason if failed |
| recipientEmail | String? | Recipient email |
| recipientPhone | String? | Recipient phone |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |
| professionalReasoning | String? | Professional reasoning notes |

### 11. Consultations
**Table**: `consultations`
**Purpose**: Track client consultations and meetings

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| organizationId | String | Foreign key to organizations |
| clientId | String | Foreign key to clients |
| alertId | String? | Foreign key to alerts |
| topic | String | Consultation topic |
| description | String? | Consultation description |
| scheduledDate | DateTime | Scheduled date |
| scheduledTime | String | Scheduled time |
| duration | Int | Duration in minutes |
| exposureAmount | Decimal? | Financial exposure amount |
| exposureCurrency | String | Currency (default: "USD") |
| status | String | Consultation status |
| prepStatus | String | Preparation status |
| prepNotes | String? | Preparation notes |
| talkingPoints | String? | Talking points |
| advisoryPackage | String? | Advisory package type |
| meetingType | String | Meeting type (call, video, in-person) |
| meetingLink | String? | Meeting link |
| meetingLocation | String? | Meeting location |
| outcome | String? | Consultation outcome |
| followUpRequired | Boolean | Whether follow-up is required |
| followUpDate | DateTime? | Follow-up date |
| followUpNotes | String? | Follow-up notes |
| notes | String? | General notes |
| documents | String[] | Related document IDs |
| recordingUrl | String? | Recording URL |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |
| completedAt | DateTime? | Completion timestamp |
| cancelledAt | DateTime? | Cancellation timestamp |

## Business Intelligence Tables

### 12. BusinessProfile
**Table**: `business_profiles`
**Purpose**: Detailed business information for clients

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| organizationId | String | Foreign key to organizations |
| clientId | String (unique) | Foreign key to clients |
| legalName | String | Legal business name |
| dbaName | String? | Doing business as name |
| entityType | String | Business entity type |
| formationDate | DateTime | Business formation date |
| federalEin | String | Federal EIN |
| primaryIndustry | String | Primary industry |
| naicsCode | String? | NAICS code |
| businessModel | String? | Business model |
| marketFocus | String? | Market focus |
| revenueGrowthYoy | Float? | Year-over-year revenue growth |
| fundingStage | String? | Funding stage |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### 13. RevenueBreakdown
**Table**: `revenue_breakdowns`
**Purpose**: Track revenue by category

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| organizationId | String | Foreign key to organizations |
| clientId | String | Foreign key to clients |
| category | String | Revenue category |
| amount | Decimal | Revenue amount |
| percentage | Float | Percentage of total revenue |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### 14. GeographicDistribution
**Table**: `geographic_distributions`
**Purpose**: Track client revenue by geographic location

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| organizationId | String | Foreign key to organizations |
| clientId | String | Foreign key to clients |
| stateCode | String | State code |
| customerCount | Int | Number of customers in state |
| percentage | Float | Percentage of total customers |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

## System Administration

### 15. StateTaxInfo
**Table**: `state_tax_info`
**Purpose**: State tax threshold and penalty information

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| stateCode | String (unique) | Two-letter state code |
| stateName | String | Full state name |
| thresholdAmount | Decimal | Nexus threshold amount |
| registrationDeadline | Int | Registration deadline in days |
| penaltyRate | Decimal | Penalty rate |
| isActive | Boolean | Whether state is active |
| lastUpdated | DateTime | Last update timestamp |
| notes | String? | Additional notes |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### 16. AuditTrail
**Table**: `audit_trails`
**Purpose**: Comprehensive audit logging

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| organizationId | String | Foreign key to organizations |
| clientId | String | Foreign key to clients |
| action | String | Action performed |
| entityType | String | Type of entity affected |
| entityId | String? | ID of affected entity |
| entityName | String? | Name of affected entity |
| oldValues | Json? | Previous values |
| newValues | Json? | New values |
| changeDescription | String? | Description of changes |
| performedBy | String? | User who performed action |
| performedByName | String? | Name of user who performed action |
| userRole | String? | Role of user |
| ipAddress | String? | IP address |
| userAgent | String? | User agent string |
| sessionId | String? | Session ID |
| performedAt | DateTime | Action timestamp |
| createdAt | DateTime | Creation timestamp |

## Dashboard Generation

### 17. GeneratedDashboard
**Table**: `generated_dashboards`
**Purpose**: Store generated dashboard configurations

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| organizationId | String | Foreign key to organizations |
| clientName | String | Client name |
| uniqueUrl | String (unique) | Unique dashboard URL |
| clientInfo | Json | Client information |
| keyMetrics | Json | Key performance metrics |
| statesMonitored | String[] | Array of monitored states |
| personalizedData | Json | Personalized dashboard data |
| generatedClients | Json? | Generated client data |
| generatedAlerts | Json? | Generated alert data |
| generatedTasks | Json? | Generated task data |
| generatedAnalytics | Json? | Generated analytics data |
| generatedClientStates | Json? | Generated client state data |
| generatedNexusAlerts | Json? | Generated nexus alert data |
| generatedNexusActivities | Json? | Generated nexus activity data |
| generatedSystemHealth | Json? | Generated system health data |
| generatedReports | Json? | Generated report data |
| generatedCommunications | Json? | Generated communication data |
| lastUpdated | DateTime | Last update timestamp |
| isActive | Boolean | Whether dashboard is active |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

## Supporting Tables

### 18. TaskStep
**Table**: `task_steps`
**Purpose**: Break down tasks into manageable steps

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| taskId | String | Foreign key to tasks |
| title | String | Step title |
| description | String? | Step description |
| stepOrder | Int | Order of step |
| completed | Boolean | Whether step is completed |
| required | Boolean | Whether step is required |
| completedAt | DateTime? | Completion timestamp |
| completedBy | String? | User who completed step |
| estimatedTime | Int? | Estimated time in minutes |
| createdAt | DateTime | Creation timestamp |

### 19. AlertAction
**Table**: `alert_actions`
**Purpose**: Track actions taken on alerts

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| alertId | String | Foreign key to alerts |
| userId | String? | User who took action |
| action | String | Action taken |
| details | String? | Action details |
| oldValue | String? | Previous value |
| newValue | String? | New value |
| createdAt | DateTime | Action timestamp |

### 20. UserSession
**Table**: `user_sessions`
**Purpose**: Track user sessions

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| userId | String | Foreign key to users |
| token | String (unique) | Session token |
| ipAddress | String? | IP address |
| userAgent | String? | User agent string |
| expiresAt | DateTime | Session expiration |
| createdAt | DateTime | Session creation |

### 21. UserPermission
**Table**: `user_permissions`
**Purpose**: User permission management

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| userId | String | Foreign key to users |
| resource | String | Resource name |
| action | String | Action name |
| granted | Boolean | Whether permission is granted |
| createdAt | DateTime | Permission creation |

## Key Relationships

### Primary Relationships
1. **Organization → Users**: One-to-many
2. **Organization → Clients**: One-to-many
3. **Client → ClientStates**: One-to-many
4. **Client → NexusAlerts**: One-to-many
5. **Client → Alerts**: One-to-many
6. **Client → Tasks**: One-to-many
7. **Client → Documents**: One-to-many
8. **Client → Communications**: One-to-many
9. **Client → Consultations**: One-to-many

### Cross-References
- **Alerts ↔ Communications**: Many-to-one
- **Alerts ↔ Consultations**: One-to-many
- **Tasks ↔ TaskSteps**: One-to-many
- **Users ↔ UserSessions**: One-to-many
- **Users ↔ UserPermissions**: One-to-many

## Indexes and Performance

### Key Indexes
- `clients.slug` (unique)
- `client_states.clientId`
- `client_states.stateCode`
- `nexus_alerts.clientId`
- `nexus_alerts.status`
- `alerts.clientId`
- `tasks.clientId`
- `audit_trails.clientId`
- `audit_trails.performedAt`

### Composite Indexes
- `[organizationId, email]` on users table
- `[clientId, stateCode]` on client_states table
- `[userId, resource, action]` on user_permissions table

## Data Types and Constraints

### Common Field Types
- **UUIDs**: All primary keys use UUID format
- **Timestamps**: All tables include `createdAt` and `updatedAt`
- **JSON Fields**: Used for flexible data storage (settings, metadata, etc.)
- **Decimal**: Used for monetary amounts and percentages
- **String Arrays**: Used for tags and multi-value fields

### Constraints
- **Cascade Deletes**: Organization deletion cascades to all related records
- **Unique Constraints**: Applied to slugs, emails, and other unique identifiers
- **Foreign Key Constraints**: Maintain referential integrity
- **Default Values**: Sensible defaults for status fields and timestamps

## Security Considerations

### Data Protection
- **Password Hashing**: User passwords are hashed
- **MFA Support**: Multi-factor authentication fields included
- **Audit Trails**: Comprehensive logging of all changes
- **Session Management**: Secure session token handling

### Access Control
- **Role-Based Access**: User roles determine permissions
- **Organization Isolation**: Data is isolated by organization
- **Permission System**: Granular permission management

## Maintenance and Monitoring

### Performance Monitoring
- **Indexes**: Optimized for common query patterns
- **Audit Logs**: Track system performance and usage
- **Session Tracking**: Monitor user activity

### Data Integrity
- **Foreign Key Constraints**: Ensure referential integrity
- **Unique Constraints**: Prevent duplicate data
- **Cascade Rules**: Maintain data consistency on deletions

This schema supports a comprehensive CPA firm management system with focus on nexus monitoring, risk assessment, and client relationship management.



