# `/generate` Endpoint Logic Documentation

## Overview

The `/generate` endpoint (`POST /api/dashboards/generate`) is the core data generation system for VaultCPA. It creates a complete dashboard with clients, states, alerts, and all related data based on user-provided form data.

## Endpoint Details

**Route:** `POST /api/dashboards/generate`  
**Location:** `server/src/routes/dashboards.js`  
**Timeout:** 300 seconds (5 minutes) - configured in nginx  
**Rate Limit:** 5 requests per burst

## Request Structure

### Request Body

```json
{
  "formData": {
    "clientName": "string",              // Name of the client/firm
    "multiStateClientCount": "string",   // Number of clients (typically "10")
    "priorityStates": ["CA", "NY", ...], // Array of state codes to monitor
    "painPoints": ["string", ...],       // Array of pain points
    "primaryIndustry": "string",          // Industry type
    "qualificationStrategy": "string"    // One of: conservative, standard, aggressive, compliance-focused, risk-tolerant
  }
}
```

### Required Fields

- `formData` (object) - Required
  - `clientName` - Name of the client organization
  - `priorityStates` - Array of state codes to monitor
  - `qualificationStrategy` - Strategy for threshold calculations

## Processing Flow

### 1. Schema Validation

```javascript
const schema = await validateDatabaseSchema();
if (!schema.ok) {
  return res.status(500).json({ 
    error: 'Database schema not ready',
    issues: schema.issues
  });
}
```

**Purpose:** Validates that all required database tables exist before proceeding. Prevents API credit waste if schema is incomplete.

### 2. Organization Creation

```javascript
const orgSlug = `org-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
const orgData = {
  slug: orgSlug,
  name: `${formData.clientName} Dashboard Organization`
};

const newOrganization = await prisma.organization.create({
  data: orgData
});
```

**Purpose:** Creates a new organization record to associate all generated data. Each generation creates a unique organization.

**Key Points:**
- Generates unique slug: `org-{timestamp}-{random}`
- Tests organization creation with minimal data first
- Uses the created organization ID for all subsequent data

### 3. Data Generation

```javascript
const generatedData = await generateDashboardData(formData, finalOrganizationId);
```

**Function:** `generateDashboardData()` in `server/src/routes/dashboards.js`

**Process:**
1. Initializes `EnhancedDataGenerator` class
2. Calls `generateCompleteDashboardData(formData, organizationId)`
3. Returns comprehensive data structure

### 4. Enhanced Data Generator

**Class:** `EnhancedDataGenerator`  
**Location:** `server/src/services/enhancedDataGenerator.js`

#### Main Generation Method: `generateCompleteDashboardData()`

**Flow:**

1. **Organization Verification**
   ```javascript
   const organization = await this.ensureOrganizationExists(organizationId, formData);
   ```
   - Ensures organization exists
   - Updates organization settings with qualification strategy

2. **Client Generation Loop**
   ```javascript
   const clientCount = 10; // Always generates exactly 10 clients
   for (let i = 0; i < clientCount; i++) {
     const clientData = await this.generateUniqueClient(formData, i);
     const client = await this.createClientWithRelationships(clientData, organizationId);
     await this.generateClientRelatedData(client, organizationId, generatedData, formData, organization);
   }
   ```

3. **Alert Limiting**
   ```javascript
   let totalAlerts = 0;
   const maxAlertsPerClient = 2;
   const maxTotalAlerts = 20;
   ```
   - Tracks total alerts across all clients
   - Limits to 2 alerts per client
   - Caps total alerts at 20 maximum

#### Client Generation: `generateUniqueClient()`

**Purpose:** Creates a unique client with realistic data.

**Key Features:**
- **Risk Level Distribution:** Predetermined distribution for 10 clients:
  ```javascript
  const riskLevelDistribution = [
    'critical', 'critical',  // 2 critical risk clients
    'high', 'high',         // 2 high risk clients
    'medium', 'medium', 'medium', // 3 medium risk clients
    'low', 'low', 'low'     // 3 low risk clients
  ];
  ```

- **Revenue Generation:**
  - Validates revenue between $50K - $600K
  - Handles string concatenation issues
  - Ensures clean integer values

- **Uniqueness Tracking:**
  - `usedCompanyNames` - Prevents duplicate company names
  - `usedTaxIds` - Prevents duplicate tax IDs
  - `usedEmails` - Prevents duplicate emails

#### Client Related Data: `generateClientRelatedData()`

**Purpose:** Generates all data related to a client.

**Generates:**
1. **Nexus Monitoring Data** (`generateNexusMonitoringData()`)
   - Client states (3-5 states per client based on risk level)
   - Nexus alerts (capped at 20 total)
   - Nexus activities

2. **State Distribution Logic:**
   ```javascript
   determineStateCount(riskLevel) // Returns 3-5 states
   calculateStateDistribution(riskLevel, totalStates) // Returns { compliant, warning, critical }
   ```
   
   **Target Distribution:**
   - 40% Green (Compliant)
   - 40% Yellow (Warning)
   - 20% Red (Critical)

3. **Alert Generation:**
   - **Compliant States:** Creates `compliance_confirmed` alerts (low priority, closed status)
   - **Warning States:** Creates `threshold_approaching` alerts (medium priority) - selective
   - **Critical States:** Creates `threshold_breach` alerts (high priority) - always

4. **Business Profile**
   - Industry information
   - Business type
   - Registration details

5. **Revenue Breakdown**
   - Annual revenue
   - Revenue by state
   - Revenue by product/service

6. **Geographic Distribution**
   - State-level revenue
   - Customer locations
   - Sales distribution

### 5. Qualification Strategy

**Purpose:** Determines threshold calculations and alert generation based on strategy.

**Strategies:**

| Strategy | Warning Threshold | Alert Threshold | Critical Threshold | Description |
|----------|------------------|-----------------|-------------------|-------------|
| **Conservative** | 60% | 80% | 100% | Early warning at 60%, alerts at 80% |
| **Standard** | 80% | 80% | 100% | Alerts at 80%, critical at 100% |
| **Aggressive** | 90% | 90% | 110% | Alerts at 90%, critical at 110% |
| **Compliance-Focused** | 70% | 70% | 90% | Strict monitoring, alerts at 70% |
| **Risk-Tolerant** | 100% | 100% | 120% | Minimal alerts, only at 100%+ |

**Usage:**
```javascript
const strategy = this.qualificationStrategies[formData.qualificationStrategy || 'standard'];
const { warningThreshold, alertThreshold, criticalThreshold } = strategy;
```

### 6. State Status Determination

**Status Types:**
- **Compliant** (Green) - Revenue < 50% of threshold
- **Pending** (Blue) - Revenue 50-80% of threshold
- **Warning** (Orange) - Revenue 80-100% of threshold
- **Critical** (Red) - Revenue > 100% of threshold

**Note:** Transit status has been removed from the system.

**Status Calculation:**
```javascript
const ratio = currentAmount / thresholdAmount;
if (ratio >= 1.0) {
  status = 'critical';
} else if (ratio >= 0.8) {
  status = 'warning';
} else if (ratio >= 0.5) {
  status = 'pending';
} else {
  status = 'compliant';
}
```

### 7. Alert Distribution

**Target Distribution (20 alerts total):**
- **5 High Priority** - Critical threshold breaches
- **10 Medium Priority** - Warnings/approaching threshold
- **5 Low Priority** - Monitoring/informational (compliance confirmed)

**Per Client Distribution:**
- **Critical Risk Clients:** 2 alerts (1 high, 1 medium)
- **High Risk Clients:** 2 alerts (0-1 high, 1-2 medium)
- **Medium Risk Clients:** 2 alerts (0 high, 1 medium, 1 low)
- **Low Risk Clients:** 2 alerts (0 high, 1 medium, 1 low)

**Alert Types:**
- `threshold_breach` - Revenue exceeds critical threshold (High priority)
- `threshold_approaching` - Revenue approaching threshold (Medium priority)
- `compliance_confirmed` - Client is compliant (Low priority, closed status)
- `nexus_monitoring` - Routine monitoring check (Low priority)

### 8. Dashboard Creation

**Database Record:**
```javascript
const generatedDashboard = await prisma.generatedDashboard.create({
  data: {
    organizationId: finalOrganizationId,
    clientName: formData.clientName,
    uniqueUrl: generateUniqueUrl(formData.clientName),
    clientInfo: { ... },
    keyMetrics: { ... },
    statesMonitored: formData.priorityStates,
    personalizedData: { ... },
    generatedClients: clients,
    generatedAlerts: alerts,
    generatedClientStates: clientStates,
    generatedNexusAlerts: nexusAlerts,
    // ... more generated data
  }
});
```

**Metrics Calculated:**
- Total clients
- Total revenue (sum of all client revenues)
- Risk distribution (critical, high, medium, low counts)
- Total penalty exposure
- Average quality score
- Active alerts count
- Tasks completed

### 9. Response Structure

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "clientName": "string",
    "uniqueUrl": "string",
    "dashboardUrl": "string",
    "dashboardUrls": {
      "main": "string",
      "managingPartner": "string",
      "taxManager": "string",
      "systemAdmin": "string"
    },
    "clientInfo": { ... },
    "keyMetrics": { ... },
    "statesMonitored": ["CA", "NY", ...],
    "personalizedData": { ... },
    "lastUpdated": "ISO date",
    "organizationId": "uuid"
  }
}
```

## Data Generation Details

### Client Generation

**Fields Generated:**
- `name` - Unique company name
- `annualRevenue` - Between $50K - $600K
- `riskLevel` - critical, high, medium, or low
- `industry` - From form data or generated
- `taxId` - Unique EIN format
- `email` - Unique email address
- `phone` - Formatted phone number
- `address` - Full address
- `city`, `state`, `zipCode` - Location data
- `qualityScore` - 0-100 score
- `penaltyExposure` - Calculated based on risk

### State Generation

**Per Client:**
- 3-5 states based on risk level
- States selected from `priorityStates` array
- Each state has:
  - `stateCode` - Two-letter code
  - `stateName` - Full state name
  - `status` - compliant, pending, warning, or critical
  - `thresholdAmount` - State-specific threshold
  - `currentAmount` - Revenue in that state
  - `registrationRequired` - Boolean
  - `lastUpdated` - Timestamp

**State Distribution:**
- **Critical Risk:** 4-5 states (1-2 compliant, 2 warning, 1-2 critical)
- **High Risk:** 4-5 states (2 compliant, 2 warning, 0-1 critical)
- **Medium Risk:** 3-4 states (2-3 compliant, 1-2 warning, 0 critical)
- **Low Risk:** 3-4 states (2-3 compliant, 1 warning, 0 critical)

### Alert Generation

**Alert Structure:**
```javascript
{
  organizationId: "uuid",
  clientId: "uuid",
  stateCode: "CA",
  alertType: "threshold_breach" | "threshold_approaching" | "compliance_confirmed" | "nexus_monitoring",
  priority: "high" | "medium" | "low",
  status: "open" | "closed",
  title: "string",
  description: "string",
  thresholdAmount: number,
  currentAmount: number,
  penaltyRisk: number,
  deadline: Date
}
```

**Alert Creation Rules:**
1. **Compliant States:** Always create `compliance_confirmed` alert
2. **Warning States:** Create `threshold_approaching` alert selectively (based on `shouldCreateWarningAlert()`)
3. **Critical States:** Always create `threshold_breach` alert
4. **Medium/Low Risk Clients:** Create 1 `nexus_monitoring` alert per client

## Error Handling

### Validation Errors

**Missing Form Data:**
```javascript
if (!formData) {
  return res.status(400).json({ 
    error: 'Missing required fields: formData is required' 
  });
}
```

**Schema Validation Failure:**
```javascript
if (!schema.ok) {
  return res.status(500).json({ 
    error: 'Database schema not ready',
    issues: schema.issues
  });
}
```

### Generation Errors

**Prisma Errors:**
- Caught and returned with error details
- Prevents API credit waste on database errors

**No Clients Generated:**
```javascript
if (!clients || clients.length === 0) {
  return res.status(500).json({ 
    error: 'Failed to generate client data',
    details: 'No clients were created during the generation process'
  });
}
```

## Performance Considerations

### Timeouts
- **Nginx Proxy:** 300 seconds (5 minutes)
- **Database Operations:** No explicit timeout (uses Prisma defaults)

### Rate Limiting
- **Nginx:** 5 requests per burst
- **No Application-Level Rate Limiting**

### Optimization
- **Lazy OpenAI Initialization:** Only initializes if API key exists
- **Batch Operations:** Uses Prisma batch operations where possible
- **Alert Capping:** Prevents excessive alert generation

## Dependencies

### External Services
- **OpenAI API** (Optional)
  - Model: `gpt-3.5-turbo`
  - Used for: AI-powered data generation (fallback if not available)

### Database
- **PostgreSQL** via Prisma ORM
- **Tables Used:**
  - `organizations`
  - `clients`
  - `client_states`
  - `nexus_alerts`
  - `nexus_activities`
  - `generated_dashboards`
  - `business_profiles`
  - `revenue_breakdowns`
  - `geographic_distributions`
  - And more...

## Logging

**Key Log Points:**
- Request received
- Schema validation
- Organization creation
- Client generation (per client)
- Alert generation
- Dashboard creation
- Response sent

**Log Format:**
- Uses emoji prefixes for visual scanning
- Includes structured data where helpful
- Error logs include full error details

## Testing

### Manual Testing
1. Send POST request to `/api/dashboards/generate`
2. Verify response structure
3. Check database for created records
4. Verify alert distribution (should be ≤ 20)
5. Verify state distribution (40/40/20 split)

### Validation Checks
- Total alerts ≤ 20
- Alerts per client ≤ 2
- State distribution matches targets
- All clients have unique names/emails/taxIds
- Revenue values within $50K - $600K range

## Future Enhancements

### Potential Improvements
1. **Caching:** Cache generated data for faster regeneration
2. **Incremental Generation:** Allow adding clients to existing dashboard
3. **Custom Client Count:** Allow user to specify exact client count
4. **State Selection:** Allow user to specify exact states per client
5. **Alert Customization:** Allow user to specify alert distribution
6. **Progress Tracking:** WebSocket updates for generation progress
7. **Background Jobs:** Move generation to background queue

## Related Files

- **Route Handler:** `server/src/routes/dashboards.js`
- **Data Generator:** `server/src/services/enhancedDataGenerator.js`
- **Risk Generator:** `server/src/services/riskBasedDataGenerator.js`
- **Frontend Form:** `app/(app)/generate/page.tsx`
- **API Client:** `lib/api.ts`

## Notes

- **Always generates 10 clients** regardless of `multiStateClientCount` value
- **Transit status removed** - system now uses only: compliant, pending, warning, critical
- **Alert limit enforced** - Maximum 20 alerts total, 2 per client
- **Compliant states always have alerts** - `compliance_confirmed` alerts ensure visibility on map
- **Organization created per generation** - Each generation creates a new organization record


