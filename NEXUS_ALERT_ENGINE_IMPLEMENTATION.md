# Nexus Alert Detection Engine - Implementation Guide

## Overview

This document details the implementation of the Nexus Alert Detection Algorithm within the VaultCPA codebase. The engine detects state tax nexus obligations across Sales, Income, Payroll, and Franchise taxes.

## Files Created

```
server/src/services/nexus-alert-engine/
├── README.md                         # Documentation
├── index.js                          # Entry point & exports
├── NexusAlertEngine.js               # Main orchestrator
├── detectors/
│   ├── SalesNexusDetector.js         # Sales tax (economic, physical, marketplace, affiliate)
│   ├── IncomeNexusDetector.js        # Income tax with PL 86-272 analysis
│   ├── PayrollNexusDetector.js       # Payroll tax & misclassification
│   └── FranchiseNexusDetector.js     # Franchise/gross receipts tax
└── rules/
    └── stateRules.js                 # 50-state rules database
```

## Integration Steps

### Step 1: Import the Engine

In your route or service file:

```javascript
const { NexusAlertEngine } = require('../services/nexus-alert-engine');
```

### Step 2: Initialize with Configuration

```javascript
const engine = new NexusAlertEngine({
  firmId: req.user?.firmId || 'default',
  riskPosture: 'standard', // 'conservative' | 'standard' | 'aggressive'
  enabledModules: {
    sales: true,
    income: true,
    payroll: true,
    franchise: true
  }
});
```

### Step 3: Prepare Normalized Data

The engine expects an array of objects with consistent field names:

```javascript
const normalizedData = [
  {
    // State identification (any of these)
    state: 'CA',
    ship_state: 'CA',
    customer_state: 'CA',
    
    // Revenue data
    revenue: 500000,
    amount: 500000,
    sales: 500000,
    
    // Employee data (for payroll detection)
    employee_name: 'John Doe',
    role: 'Sales Representative',
    
    // Contractor data (for misclassification detection)
    contractor_name: 'Jane Smith',
    contract_type: 'consulting',
    
    // Channel data (for marketplace detection)
    channel: 'amazon',
    source: 'shopify'
  },
  // ... more rows
];
```

### Step 4: Run Detection

```javascript
const alerts = await engine.detectNexus(normalizedData);

// Or process with document context
const result = await engine.processDocument(normalizedData, 'PROFIT_LOSS');
```

### Step 5: Handle Results

```javascript
// Filter by severity
const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL' || a.severity === 'HIGH');

// Filter by type
const salesAlerts = alerts.filter(a => a.type === 'SALES_NEXUS');

// Get action items
const actionItems = alerts.filter(a => a.requiresAction);

// Get judgment calls
const judgmentCalls = alerts.filter(a => a.judgmentRequired);
```

## Integration with Nexus Memos Flow

### Update `nexus-memos.js` Route

```javascript
// server/src/routes/nexus-memos.js

const { NexusAlertEngine } = require('../services/nexus-alert-engine');

// Add new endpoint for alert generation
router.post('/generate-alerts', async (req, res) => {
  try {
    const { normalizedData, config } = req.body;
    
    const engine = new NexusAlertEngine({
      firmId: req.user?.firmId,
      riskPosture: config?.riskPosture || 'standard',
      enabledModules: config?.enabledModules || {
        sales: true,
        income: true,
        payroll: true,
        franchise: true
      }
    });
    
    const result = await engine.processDocument(normalizedData, config?.documentType);
    
    res.json({
      success: true,
      alerts: result.alerts,
      summary: result.summary
    });
  } catch (error) {
    console.error('Alert generation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### Update Frontend AlertsStep Component

```typescript
// app/dashboard/managing-partner/nexus-memos/new/components/AlertsStep.tsx

const generateAlerts = async () => {
  setLoading(true);
  try {
    const response = await fetch(`${API_URL}/api/nexus-memos/generate-alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        normalizedData: mappedData,
        config: {
          riskPosture: 'standard',
          documentType: documentClassification?.type,
          enabledModules: {
            sales: true,
            income: true,
            payroll: true,
            franchise: true
          }
        }
      })
    });
    
    const result = await response.json();
    setAlerts(result.alerts);
    setSummary(result.summary);
  } catch (error) {
    console.error('Error generating alerts:', error);
  } finally {
    setLoading(false);
  }
};
```

## Algorithm Details

### Sales Tax Detection Flow

```
1. Calculate total revenue for state
2. Calculate marketplace revenue (Amazon, Shopify, etc.)
3. Calculate direct revenue = total - marketplace
4. Count transactions

5. Check Economic Nexus:
   - Apply risk posture multiplier to threshold
   - Compare revenue vs adjusted threshold
   - Generate alert if exceeded or approaching (80%)

6. Check Marketplace Nexus:
   - Compare marketplace revenue vs threshold
   - Generate info alert if exceeded

7. Check Physical Presence:
   - Scan for employees, contractors, property, inventory
   - Generate alert if any presence detected

8. Check Affiliate Nexus:
   - Detect affiliate/referral relationships
   - Calculate affiliate revenue
   - Generate alert if significant ($10k+)
```

### Income Tax Detection Flow

```
1. Calculate net income for state
2. Detect if business sells tangible property

3. If tangible property AND state applies PL 86-272:
   a. Extract employee activities from data
   b. Classify as protected/unprotected/ambiguous
   c. Apply state-specific interpretation
   d. Generate appropriate alert:
      - Protected: INFO level, no action
      - Unprotected: HIGH level, register required
      - Ambiguous: MEDIUM level, judgment required

4. If no tangible property OR state doesn't apply PL 86-272:
   - Check economic nexus threshold
   - Generate alert if exceeded

5. Check for franchise tax applicability (TX, TN, etc.)
```

### Payroll Tax Detection Flow

```
1. Extract workforce data (employees + contractors)
2. Filter by state

3. If employees present:
   a. Generate employee nexus alert
   b. Check withholding requirements
   c. Check unemployment insurance
   d. Check state-specific (disability, PFL)

4. If contractors present:
   a. Generate contractor presence alert
   b. Analyze misclassification risk:
      - Full-time hours?
      - High compensation?
      - Supervisory role?
      - Core business function?
   c. Generate misclassification alert if high risk

5. Check for remote workers
```

### Franchise Tax Detection Flow

```
1. Check "doing business" indicators:
   - Office presence
   - Employee presence
   - Property ownership
   - Bank accounts
   - Revenue in state
   - Transaction activity

2. Apply state-specific rules

3. If doing business:
   a. Generate franchise nexus alert
   b. Check revenue threshold
   c. Check qualification requirements:
      - Registered agent
      - Certificate of authority
   d. Note minimum tax obligation
```

## State Rules Database

The `stateRules.js` file contains comprehensive rules for all 50 states + DC:

### Key Thresholds (2024)

| State | Sales Threshold | Income Threshold | Notes |
|-------|-----------------|------------------|-------|
| CA    | $500,000        | $637,252         | Minimum $800 franchise tax |
| TX    | $500,000        | N/A              | No income tax; Margin Tax at $1.23M |
| NY    | $500,000 + 100 tx | $1,000,000    | Bright-line nexus |
| FL    | $100,000        | N/A (corp only)  | No personal income tax |
| WA    | $100,000        | N/A              | B&O Tax on gross receipts |

### PL 86-272 Activities

**Protected:**
- Solicitation
- Order taking
- Advertising
- Trade show attendance
- Sample room maintenance

**Unprotected:**
- Installation
- Training
- Repair/Maintenance
- Technical support
- Consulting
- Warranty service

**Ambiguous (Judgment Required):**
- Software delivery
- Digital services
- Cloud computing
- Remote support

## Risk Posture Multipliers

| Posture | Multiplier | Effect |
|---------|------------|--------|
| Conservative | 0.8x | Alert at 80% of threshold |
| Standard | 1.0x | Alert at 100% of threshold |
| Aggressive | 1.2x | Alert at 120% of threshold |

## Alert Severity Levels

| Severity | Description | Action Required |
|----------|-------------|-----------------|
| CRITICAL | Immediate compliance risk | Yes - Urgent |
| HIGH | Threshold exceeded | Yes |
| MEDIUM | Approaching threshold or judgment needed | Review |
| LOW | Minor issue | Monitor |
| INFO | Informational only | No |

## Testing the Implementation

```bash
# Start the backend
cd server
npm run dev

# Test with curl
curl -X POST http://localhost:3080/api/nexus-memos/generate-alerts \
  -H "Content-Type: application/json" \
  -d '{
    "normalizedData": [
      {"state": "CA", "revenue": 600000, "employee_name": "John", "role": "sales"},
      {"state": "TX", "revenue": 1500000, "channel": "amazon"},
      {"state": "FL", "revenue": 150000}
    ],
    "config": {
      "riskPosture": "standard"
    }
  }'
```

## Future Enhancements

1. **Doctrine Integration**: Connect alerts to DoctrineRule system for firm-wide guidance
2. **Historical Tracking**: Monitor nexus status changes over time
3. **Predictive Analysis**: Forecast when thresholds will be exceeded
4. **Multi-Entity**: Handle consolidated group analysis
5. **Audit Trail**: Complete logging of detection decisions
6. **Machine Learning**: Improve activity classification accuracy

## Logging

The engine logs extensively for debugging:

```
[NEXUS_ENGINE] Initialized with config: {...}
[NEXUS_ENGINE] Starting nexus detection...
[NEXUS_ENGINE] States with activity: ['CA', 'TX', 'FL']
[NEXUS_ENGINE] Analyzing state: CA (15 rows)
[SALES_DETECTOR] CA analysis: { totalRevenue: 600000, ... }
[INCOME_DETECTOR] CA analysis: { netIncome: 450000, ... }
[NEXUS_ENGINE] Detection complete. Total alerts: 8
```

View logs with:
```bash
docker-compose logs -f backend | grep NEXUS
```







