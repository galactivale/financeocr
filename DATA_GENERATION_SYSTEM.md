# Data Generation System Documentation

## Overview

The VaultCPA data generation system is a comprehensive solution for creating realistic, interconnected dashboard data for tax compliance and nexus monitoring. It generates 10 clients with complete business profiles, nexus states, alerts, and related entities using a three-tier state system with qualification strategy support.

## System Architecture

### Main Components

1. **EnhancedDataGenerator** (`server/src/services/enhancedDataGenerator.js`)
   - Primary data generation service
   - Handles client creation, state generation, and all relationships
   - Uses OpenAI API (with fallback) for realistic data generation

2. **Entry Point** (`server/src/routes/dashboards.js`)
   - POST `/api/dashboards/generate` endpoint
   - Accepts form data and organization ID
   - Orchestrates the complete generation process

## Generation Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    POST /api/dashboards/generate            │
│                         (Form Data)                         │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│         generateCompleteDashboardData()                     │
│  - Ensures Organization exists                              │
│  - Generates 10 clients sequentially                       │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              For each client (1-10):                        │
│                                                             │
│  1. generateUniqueClient()                                  │
│     - Uses OpenAI or fallback                              │
│     - Creates unique company data                           │
│                                                             │
│  2. createClientWithRelationships()                         │
│     - Creates Client record in database                    │
│                                                             │
│  3. generateClientRelatedData()                             │
│     - Business Profile                                      │
│     - Contacts (2 per client)                              │
│     - Business Locations                                    │
│     - Revenue Breakdowns                                   │
│     - Customer Demographics                                 │
│     - Geographic Distributions                              │
│     - Nexus Monitoring Data (States + Alerts)              │
│     - Alerts & Tasks                                        │
│     - Professional Decisions                                │
│     - Decision Table Entries                                │
│     - Audit Trail                                           │
└─────────────────────────────────────────────────────────────┘
```

## Three-Tier State System

The system implements a three-tier state classification for nexus monitoring:

### 1. Compliant States (Green)
- **Count**: 1-4 states per client (random)
- **Revenue Ratio**: Fixed at 10% of threshold
- **Status**: `compliant`
- **Alerts**: None
- **Color**: Green (#10b981)
- **Purpose**: Show healthy compliance status

### 2. Warning States (Orange/Yellow)
- **Count**: Varies by risk level
- **Revenue Ratio**: Between `alertThreshold` and `criticalThreshold - 0.01`
- **Status**: `warning`
- **Alerts**: Medium priority `threshold_approaching` alerts
- **Color**: Orange/Yellow
- **Purpose**: Indicate approaching threshold

### 3. Critical States (Red)
- **Count**: Based on client risk level
  - Critical risk: 1-2 states
  - High risk: 0-1 states
  - Medium/Low risk: 0 states
- **Revenue Ratio**: Above `criticalThreshold` (100-150% of threshold)
- **Status**: `critical`
- **Alerts**: High priority `threshold_breach` alerts
- **Color**: Red (#ef4444)
- **Purpose**: Indicate threshold exceeded

## Qualification Strategies

The system supports 5 qualification strategies that determine alert and critical thresholds:

| Strategy | Warning Threshold | Alert Threshold | Critical Threshold | Description |
|----------|------------------|-----------------|-------------------|-------------|
| **Conservative** | 60% | 80% | 100% | Early warning at 60%, alerts at 80% |
| **Standard** | 80% | 80% | 100% | Alerts at 80%, critical at 100% |
| **Aggressive** | 90% | 90% | 110% | Alerts at 90%, critical at 110% |
| **Compliance-Focused** | 70% | 70% | 90% | Strict monitoring, alerts at 70% |
| **Risk-Tolerant** | 100% | 100% | 120% | Minimal alerts, only at 100%+ |

### Strategy Application

- Strategy is determined from:
  1. Client's `qualificationStrategy` field
  2. Form data's `qualificationStrategy`
  3. Default: `'standard'`

- Strategy affects:
  - Warning state revenue ratios (between alert and critical thresholds)
  - Critical state revenue ratios (above critical threshold)

## State Distribution by Risk Level

### Critical Risk Clients
- **Compliant**: 1-4 states
- **Warning**: At least 2 states (remaining after critical)
- **Critical**: 1-2 states (max 2)
- **Total**: 5-8 states

### High Risk Clients
- **Compliant**: 1-4 states
- **Warning**: At least 2 states (remaining after critical)
- **Critical**: 0-1 states
- **Total**: 5-8 states

### Medium Risk Clients
- **Compliant**: 1-4 states
- **Warning**: All remaining states
- **Critical**: 0 states
- **Total**: 5-8 states

### Low Risk Clients
- **Compliant**: 1-4 states
- **Warning**: All remaining states
- **Critical**: 0 states
- **Total**: 5-8 states

## Entity Relationships

### Core Entities

```
Organization (1)
  ├── Client (10)
  │     ├── BusinessProfile (1:1)
  │     ├── Contact (2 per client)
  │     ├── BusinessLocation (varies)
  │     ├── RevenueBreakdown (varies)
  │     ├── CustomerDemographics (1:1)
  │     ├── GeographicDistribution (varies)
  │     ├── ClientState (5-8 per client)
  │     │     ├── NexusAlert (0-1 per state)
  │     │     └── NexusActivity (1 per state)
  │     ├── Alert (varies)
  │     ├── Task (varies)
  │     ├── ProfessionalDecision (varies)
  │     ├── DecisionTable (varies)
  │     └── AuditTrail (varies)
```

### Detailed Relationships

#### 1. Organization → Client (1:N)
- **Relationship**: One organization has many clients
- **Generated**: 10 clients per organization
- **Key Fields**:
  - `organizationId` (FK)
  - `name`, `legalName`, `taxId`
  - `industry`, `riskLevel`
  - `annualRevenue` ($50K-$600K)
  - `qualificationStrategy`

#### 2. Client → BusinessProfile (1:1)
- **Relationship**: One client has one business profile
- **Key Fields**:
  - `legalName`, `dbaName`, `entityType`
  - `federalEin`, `naicsCode`
  - `businessModel`, `marketFocus`
  - `revenueGrowthYoy`, `fundingStage`

#### 3. Client → Contact (1:N)
- **Relationship**: One client has multiple contacts
- **Generated**: 2 contacts per client
- **Types**:
  - Primary Contact (CEO/CFO/CTO/COO/VP)
  - Secondary Contact (Controller/Manager/Director)

#### 4. Client → BusinessLocation (1:N)
- **Relationship**: One client has multiple business locations
- **Generated**: Varies (typically 1-3)
- **Types**: Headquarters, Warehouse, Office, Retail
- **Fields**: `nexusRelevant` flag

#### 5. Client → RevenueBreakdown (1:N)
- **Relationship**: One client has multiple revenue categories
- **Generated**: 3-5 categories per client
- **Categories**: Product Sales, Services, Subscriptions, etc.

#### 6. Client → CustomerDemographics (1:1)
- **Relationship**: One client has one demographics record
- **Key Fields**:
  - `totalActiveCustomers`
  - `averageContractValue`
  - `customerRetentionRate`
  - `monthlyRecurringRevenue`

#### 7. Client → GeographicDistribution (1:N)
- **Relationship**: One client has distributions across states
- **Generated**: 3-5 state distributions
- **Key Fields**: `stateCode`, `customerCount`, `percentage`

#### 8. Client → ClientState (1:N)
- **Relationship**: One client has multiple state records
- **Generated**: 5-8 states per client
- **Key Fields**:
  - `stateCode`, `stateName`
  - `status` (compliant/warning/critical/pending/transit)
  - `thresholdAmount` (varies by state)
  - `currentAmount` (calculated based on status)
  - `registrationRequired` (true for critical)

#### 9. ClientState → NexusAlert (0:1)
- **Relationship**: One state may have one alert
- **Generated**:
  - Compliant states: 0 alerts
  - Warning states: 1 medium priority alert
  - Critical states: 1 high priority alert
- **Alert Types**:
  - `threshold_approaching` (warning states)
  - `threshold_breach` (critical states)
- **Priority Levels**:
  - `medium` (warning)
  - `high` (critical)

#### 10. ClientState → NexusActivity (1:1)
- **Relationship**: One state has one activity record
- **Generated**: 1 activity per state
- **Activity Types**:
  - `compliance_check` (compliant states)
  - `threshold_monitoring` (warning states)
  - `penalty_assessment` (critical states)

#### 11. Client → Alert (1:N)
- **Relationship**: One client has multiple general alerts
- **Generated**: Varies based on risk level
- **Types**: Compliance, Deadline, Review

#### 12. Client → Task (1:N)
- **Relationship**: One client has multiple tasks
- **Generated**: Varies based on risk level
- **Types**: Registration, Documentation, Review

#### 13. Client → ProfessionalDecision (1:N)
- **Relationship**: One client has multiple professional decisions
- **Generated**: Varies
- **Types**: Registration, Exemption, Compliance

#### 14. Client → DecisionTable (1:N)
- **Relationship**: One client has multiple decision table entries
- **Generated**: Varies
- **Purpose**: Track decision logic and outcomes

#### 15. Client → AuditTrail (1:N)
- **Relationship**: One client has multiple audit trail entries
- **Generated**: Varies
- **Purpose**: Track all changes and actions

## Data Generation Process

### Step 1: Organization Setup
```javascript
ensureOrganizationExists(organizationId, formData)
```
- Checks if organization exists
- Creates if missing
- Updates qualification strategy if provided

### Step 2: Client Generation Loop (10 iterations)

For each client:

#### 2.1 Generate Client Data
```javascript
generateUniqueClient(formData, index)
```
- Uses OpenAI API (or fallback) to generate realistic client data
- Ensures uniqueness (names, tax IDs, emails)
- Randomly assigns:
  - Risk level (low/medium/high/critical)
  - Industry
  - Business type
  - Funding stage

#### 2.2 Create Client Record
```javascript
createClientWithRelationships(clientData, organizationId)
```
- Creates Client record in database
- Validates and cleans revenue data ($50K-$600K limit)
- Sets default dates and status

#### 2.3 Generate Related Data
```javascript
generateClientRelatedData(client, organizationId, generatedData, formData, organization)
```

**Sequential Creation:**
1. Business Profile
2. Contacts (2)
3. Business Locations
4. Revenue Breakdowns
5. Customer Demographics
6. Geographic Distributions
7. **Nexus Monitoring Data** (see below)
8. Alerts & Tasks
9. Professional Decisions
10. Decision Table Entries
11. Audit Trail

### Step 3: Nexus Monitoring Data Generation

```javascript
generateNexusMonitoringData(client, organizationId, generatedData, formData, organization)
```

#### 3.1 State Selection
- Uses priority states from form data (or all US states)
- Randomly shuffles and selects states

#### 3.2 State Allocation
- Determines counts for compliant/warning/critical based on risk level
- Ensures balanced distribution

#### 3.3 State Generation

**For Compliant States:**
```javascript
thresholdAmount = determineThresholdAmount(stateCode) // $100K-$1M
currentAmount = thresholdAmount * 0.10 // Exactly 10%
status = 'compliant'
// NO alerts created
```

**For Warning States:**
```javascript
thresholdAmount = determineThresholdAmount(stateCode)
minRatio = strategy.alertThreshold // e.g., 0.8
maxRatio = strategy.criticalThreshold - 0.01 // e.g., 0.99
warningRatio = minRatio + random() * (maxRatio - minRatio)
currentAmount = thresholdAmount * warningRatio
status = 'warning'
// Creates medium priority 'threshold_approaching' alert
```

**For Critical States:**
```javascript
thresholdAmount = determineThresholdAmount(stateCode)
criticalRatio = strategy.criticalThreshold + random() * 0.5 // 1.0 to 1.5
currentAmount = thresholdAmount * criticalRatio
excessAmount = currentAmount - thresholdAmount
penaltyRisk = excessAmount * 0.10 // 10% of excess
status = 'critical'
registrationRequired = true
// Creates high priority 'threshold_breach' alert
```

#### 3.4 Activity Creation
- Creates one `NexusActivity` per state
- Type depends on state status

## Threshold Amount Calculation

State thresholds vary by state size:

```javascript
determineThresholdAmount(stateCode) {
  if (['CA', 'NY', 'TX'].includes(stateCode)) {
    return 500000 + random(0-500000); // $500K-$1M
  } else if (['FL', 'IL', 'PA', 'OH'].includes(stateCode)) {
    return 200000 + random(0-300000); // $200K-$500K
  } else {
    return 100000 + random(0-200000); // $100K-$300K
  }
}
```

## Status Determination Logic

### Database Status (Source of Truth)
- Status is set during generation based on revenue ratio
- Stored in `ClientState.status` field
- Values: `compliant`, `warning`, `critical`, `pending`, `transit`

### Frontend Status Processing

The frontend monitoring pages process statuses as follows:

1. **Read Database Status**: Use `clientState.status` directly
2. **Aggregate Multi-Client States**: When multiple clients in same state
   - Priority: critical > warning > pending > transit > compliant
   - Special case: 1 critical + rest approaching = warning
3. **Alert Processing**: Alerts only count, don't override status
4. **Final Validation**: Ensure status matches client state statuses

### Status Priority
```
critical (5) > warning (4) > pending (3) > transit (2) > compliant (1)
```

## Data Validation & Constraints

### Revenue Constraints
- **Client Annual Revenue**: $50,000 - $600,000
- **State Current Amount**: Based on threshold and ratio
- **Validation**: All revenue values cleaned and validated as integers

### Uniqueness Constraints
- **Company Names**: Tracked in `usedCompanyNames` Set
- **Tax IDs**: Tracked in `usedTaxIds` Set
- **Emails**: Tracked in `usedEmails` Set
- **Fallback**: If OpenAI fails, uses deterministic fallback data

### State Constraints
- **Total States per Client**: 5-8 states
- **Compliant States**: Always 1-4 per client
- **State Selection**: Random from available states (no duplicates per client)

## OpenAI Integration

### Model
- **Model**: `gpt-3.5-turbo`
- **Response Format**: JSON object
- **Temperature**: 0.7
- **Max Tokens**: 4000

### Fallback Behavior
- If `OPENAI_API_KEY` not set: Uses fallback data generation
- If API call fails: Uses `getFallbackClientData()`
- Ensures system works without API key

### Prompt Structure
- System message: "You are a helpful assistant that generates realistic business client data for CPA firms. Always respond with valid JSON only."
- User prompt: Detailed JSON schema with requirements
- Response: Parsed JSON with client data

## Error Handling

### Prisma Errors
- Fail fast on Prisma validation errors
- Prevents wasting API credits on invalid data
- Logs detailed error information

### API Errors
- Retries once on rate limits (429)
- Falls back to deterministic data on failure
- Continues with next client on non-critical errors

### Data Validation
- Revenue values cleaned and validated
- String concatenation issues handled
- Type conversions (string → number) applied

## Output Summary

After generation completes, returns:

```javascript
{
  success: true,
  data: {
    clients: [...],           // 10 clients
    clientStates: [...],      // ~60-80 states (5-8 per client)
    nexusAlerts: [...],       // ~40-60 alerts (warning + critical states)
    nexusActivities: [...],    // ~60-80 activities (1 per state)
    alerts: [...],            // General alerts
    tasks: [...],             // Tasks
    businessProfiles: [...],  // 10 profiles
    contacts: [...],          // 20 contacts (2 per client)
    businessLocations: [...], // Varies
    revenueBreakdowns: [...], // Varies
    customerDemographics: [...], // 10 records
    geographicDistributions: [...], // Varies
    professionalDecisions: [...],   // Varies
    consultations: [...],           // Varies
    communications: [...],          // Varies
    documents: [...],               // Varies
    auditTrails: [...],             // Varies
    dataProcessing: [...],          // Varies
    decisionTables: [...]            // Varies
  },
  summary: {
    totalClients: 10,
    totalRecords: ~200-300
  }
}
```

## Key Features

1. **Realistic Data**: Uses OpenAI to generate realistic business data
2. **Complete Relationships**: All entities properly linked
3. **Three-Tier System**: Compliant, Warning, Critical states
4. **Qualification Strategies**: 5 different threshold strategies
5. **Risk-Based Distribution**: State counts vary by client risk level
6. **Uniqueness Guarantee**: No duplicate names, tax IDs, or emails
7. **Fallback Support**: Works without OpenAI API key
8. **Error Resilience**: Continues on non-critical errors

## Usage

### API Endpoint
```
POST /api/dashboards/generate
Content-Type: application/json

{
  "clientName": "Demo CPA Firm",
  "qualificationStrategy": "standard",
  "priorityStates": ["California", "New York", "Texas"],
  "multiStateClientCount": 10
}
```

### Response
```json
{
  "success": true,
  "data": { ... },
  "summary": {
    "totalClients": 10,
    "totalRecords": 250
  }
}
```

## Database Schema Dependencies

All entities follow Prisma schema relationships:
- Foreign keys properly set
- Required fields validated
- Optional fields handled gracefully
- Dates converted to proper format
- JSON fields (metadata, customFields) properly structured

## Performance Considerations

- **Sequential Generation**: Clients generated one at a time to avoid API rate limits
- **Batch Creation**: Related entities created in batches where possible
- **Transaction Safety**: Each client creation is independent (no rollback on failure)
- **Memory Management**: Uses Sets for uniqueness tracking (O(1) lookups)

## Future Enhancements

Potential improvements:
1. Parallel client generation (with rate limiting)
2. Caching of OpenAI responses
3. More sophisticated fallback data
4. Additional qualification strategies
5. Custom state distribution rules
6. Historical data generation
7. Bulk operations optimization



