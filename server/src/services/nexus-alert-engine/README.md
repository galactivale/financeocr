# Nexus Alert Detection Engine

## Overview

The Nexus Alert Detection Engine is a comprehensive system for detecting state tax nexus obligations across four major tax categories:
- **Sales Tax Nexus** - Economic nexus, physical presence, marketplace, affiliate
- **Income Tax Nexus** - With PL 86-272 protection analysis
- **Payroll Tax Nexus** - Employee/contractor presence and misclassification
- **Franchise Tax Nexus** - "Doing business" indicators and qualification requirements

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    NexusAlertEngine                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────┐ │
│  │   Sales     │ │   Income    │ │  Payroll    │ │ Franchise  │ │
│  │  Detector   │ │  Detector   │ │  Detector   │ │  Detector  │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └────────────┘ │
│         │               │               │              │         │
│         └───────────────┴───────────────┴──────────────┘         │
│                              │                                    │
│                    ┌─────────▼─────────┐                         │
│                    │  Alert Generator  │                         │
│                    └───────────────────┘                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   STATE_RULES     │
                    │    Database       │
                    │   (50 states)     │
                    └───────────────────┘
```

## File Structure

```
server/src/services/nexus-alert-engine/
├── README.md                         # This documentation
├── index.js                          # Main entry point
├── NexusAlertEngine.js               # Core orchestrator
├── detectors/
│   ├── SalesNexusDetector.js         # Sales tax nexus detection
│   ├── IncomeNexusDetector.js        # Income tax with PL 86-272
│   ├── PayrollNexusDetector.js       # Payroll tax detection
│   └── FranchiseNexusDetector.js     # Franchise tax detection
└── rules/
    └── stateRules.js                 # 50-state rules database
```

## Quick Start

```javascript
const { NexusAlertEngine } = require('./services/nexus-alert-engine');

// Initialize with configuration
const engine = new NexusAlertEngine({
  firmId: 'firm_123',
  riskPosture: 'conservative', // 'conservative' | 'standard' | 'aggressive'
  enabledModules: {
    sales: true,
    income: true,
    payroll: true,
    franchise: true
  }
});

// Process normalized data
const normalizedData = [
  { state: 'CA', revenue: 550000, employee_name: 'John Doe', role: 'Sales Rep' },
  { state: 'TX', revenue: 1500000, channel: 'amazon' },
  { state: 'FL', revenue: 150000 },
  // ... more rows
];

const alerts = await engine.detectNexus(normalizedData);
console.log(`Generated ${alerts.length} alerts`);
```

## Configuration Options

### Risk Posture

The risk posture adjusts thresholds based on the firm's risk tolerance:

| Posture | Multiplier | Description |
|---------|------------|-------------|
| `conservative` | 0.8x | Alert at 80% of statutory threshold |
| `standard` | 1.0x | Alert at 100% of statutory threshold |
| `aggressive` | 1.2x | Alert at 120% of statutory threshold |

### Enabled Modules

Toggle individual tax type detectors:

```javascript
enabledModules: {
  sales: true,      // Sales tax nexus detection
  income: true,     // Income tax (with PL 86-272)
  payroll: true,    // Payroll tax nexus
  franchise: true   // Franchise/gross receipts tax
}
```

## Detection Types

### 1. Sales Tax Nexus

**Economic Nexus (Post-Wayfair)**
- Checks state-specific revenue thresholds
- Checks transaction count thresholds (where applicable)
- Applies risk posture multiplier

**Physical Presence**
- Detects employees in state
- Detects property/inventory in state
- Detects contractors in state

**Marketplace Facilitator**
- Identifies marketplace sales (Amazon, Shopify, etc.)
- Verifies marketplace is collecting tax

**Affiliate/Click-Through**
- Detects affiliate relationships
- Calculates referral revenue

### 2. Income Tax Nexus

**Economic Nexus**
- State-specific income thresholds
- Factor presence analysis

**PL 86-272 Protection**
- Classifies activities as protected/unprotected/ambiguous
- Analyzes state-specific interpretations
- Flags judgment-required situations

**Protected Activities:**
- Solicitation
- Order taking
- Advertising
- Trade show attendance

**Unprotected Activities:**
- Installation
- Training
- Repair/Maintenance
- Technical support
- Consulting

### 3. Payroll Tax Nexus

**Employee Presence**
- Any employees trigger nexus
- State withholding requirements
- Unemployment insurance (SUTA)

**State-Specific Requirements**
- Disability insurance (CA, NJ, NY, RI, HI)
- Paid family leave (CA, CT, MA, NJ, NY, OR, WA, DC)

**Contractor Misclassification**
- Risk factor analysis
- Full-time contractor detection
- Supervisory role detection

### 4. Franchise Tax Nexus

**"Doing Business" Indicators**
- Office presence
- Employee presence
- Property ownership
- Bank accounts
- Revenue in state

**Qualification Requirements**
- Registered agent
- Certificate of authority
- Annual report requirements

**Special Tax Types**
- Texas Margin Tax
- Ohio Commercial Activity Tax (CAT)
- Washington B&O Tax
- Tennessee Franchise & Excise

## Alert Structure

Each alert contains:

```javascript
{
  id: 'ECONOMIC_NEXUS_CA_1703847...',
  type: 'SALES_NEXUS',
  subtype: 'ECONOMIC_NEXUS',
  state: 'CA',
  stateName: 'California',
  severity: 'HIGH',           // CRITICAL | HIGH | MEDIUM | LOW | INFO
  title: 'CA Sales Tax Economic Nexus Triggered',
  description: 'Revenue of $550,000 exceeds CA threshold of $500,000',
  facts: {
    threshold: 500000,
    actualRevenue: 550000,
    percentageOver: '110.0'
  },
  recommendation: 'Register for sales tax collection in CA',
  judgmentRequired: false,
  requiresAction: true,
  priority: 'HIGH',
  createdDate: '2024-12-29T...',
  dueDate: '2025-01-28T...'
}
```

## State Rules Database

The engine includes comprehensive rules for all 50 states + DC:

```javascript
const { STATE_RULES } = require('./rules/stateRules');

// Example: California rules
STATE_RULES['CA'] = {
  name: 'California',
  sales: {
    economicNexusThreshold: 500000,
    transactionCountThreshold: null,
    marketplaceThreshold: 500000,
    physicalPresenceTriggers: ['employee', 'property', 'inventory'],
    affiliateNexus: true,
    effectiveDate: '2019-04-01'
  },
  income: {
    hasIncomeTax: true,
    economicNexusThreshold: 637252,
    pl86_272Applies: true,
    protectedActivities: ['solicitation', 'order_taking', 'advertising'],
    unprotectedActivities: ['installation', 'training', 'repair']
  },
  payroll: {
    employeeThreshold: 1,
    withholdingRequired: true,
    unemploymentInsurance: true,
    disabilityInsurance: true,
    paidFamilyLeave: true
  },
  franchise: {
    hasFranchiseTax: true,
    minimumTax: 800,
    qualificationRequired: true
  }
};
```

## Integration with Document Processing

```javascript
const { NexusAlertEngine } = require('./services/nexus-alert-engine');

// In your nexus-memos route
router.post('/process', async (req, res) => {
  const { normalizedData, documentType, config } = req.body;
  
  const engine = new NexusAlertEngine(config);
  const result = await engine.processDocument(normalizedData, documentType);
  
  res.json({
    success: true,
    alerts: result.alerts,
    summary: result.summary
  });
});
```

## Data Quality Checks

The engine automatically checks for:
- Missing state information
- Missing revenue data
- Incomplete employee records

## Example Output

```javascript
{
  success: true,
  documentType: 'PROFIT_LOSS',
  alerts: [
    {
      type: 'SALES_NEXUS',
      subtype: 'ECONOMIC_NEXUS',
      state: 'CA',
      severity: 'HIGH',
      title: 'CA Sales Tax Economic Nexus Triggered',
      requiresAction: true
    },
    {
      type: 'INCOME_NEXUS',
      subtype: 'PL86_272_JUDGMENT_REQUIRED',
      state: 'CA',
      severity: 'MEDIUM',
      title: 'CA PL 86-272 Analysis Requires Judgment',
      judgmentRequired: true
    },
    // ... more alerts
  ],
  summary: {
    total: 12,
    bySeverity: { HIGH: 3, MEDIUM: 5, LOW: 2, INFO: 2 },
    byType: { SALES_NEXUS: 5, INCOME_NEXUS: 3, PAYROLL_NEXUS: 2, FRANCHISE_NEXUS: 2 },
    byState: { CA: 4, TX: 3, FL: 2, IL: 2, GA: 1 },
    requiresAction: 6,
    judgmentRequired: 2
  }
}
```

## Future Enhancements

1. **Doctrine Integration** - Connect with DoctrineRule system for firm guidance
2. **Historical Analysis** - Track nexus status changes over time
3. **Predictive Alerts** - Forecast when thresholds will be exceeded
4. **Multi-Entity Support** - Handle consolidated group analysis
5. **Audit Trail** - Complete logging of detection decisions

## Testing

```bash
# Run tests
npm test -- --grep "NexusAlertEngine"

# Test with sample data
node -e "
const { NexusAlertEngine } = require('./src/services/nexus-alert-engine');
const engine = new NexusAlertEngine({ riskPosture: 'standard' });
const data = [{ state: 'CA', revenue: 600000 }];
engine.detectNexus(data).then(alerts => console.log(alerts));
"
```
