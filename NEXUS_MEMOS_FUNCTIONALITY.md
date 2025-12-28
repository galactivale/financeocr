# Nexus Memos - Complete Functionality Documentation

## Overview

Nexus Memos is a comprehensive document processing system designed for managing partners to analyze financial documents (CSV, Excel) and generate nexus compliance alerts and memos. The system provides an intelligent multi-step workflow that automatically classifies documents, detects headers, maps columns, normalizes data, and generates actionable alerts.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Multi-Step Workflow](#multi-step-workflow)
3. [Step 1: File Upload](#step-1-file-upload)
4. [Step 2: Sheet Selection](#step-2-sheet-selection)
5. [Step 3: Header Detection](#step-3-header-detection)
6. [Step 4: Column Mapping](#step-4-column-mapping)
7. [Step 5: Alerts Generation](#step-5-alerts-generation)
8. [Step 6: Memos Generation](#step-6-memos-generation)
9. [Doctrine Propagation System (P10)](#doctrine-propagation-system-p10)
10. [Document Classification Engine](#document-classification-engine)
11. [Data Extraction & Normalization](#data-extraction--normalization)
12. [API Endpoints](#api-endpoints)
13. [Technical Implementation](#technical-implementation)

---

## System Architecture

### Frontend Components

- **Location**: `app/dashboard/managing-partner/nexus-memos/new/`
- **Main Page**: `page.tsx` - Orchestrates the multi-step flow
- **Step Components**:
  - `UploadStep.tsx` - File upload and validation
  - `SheetSelectionStep.tsx` - Excel sheet selection
  - `HeaderDetectionStep.tsx` - Header row detection
  - `ColumnMappingStep.tsx` - Column mapping interface
  - `AlertsStep.tsx` - Alert review and management
  - `MemosStep.tsx` - Final memo generation
- **Doctrine Components**:
  - `DoctrineScopeSelector.tsx` - Scope selection modal for judgment calls
  - `DoctrinePreFlightCheck.tsx` - Pre-flight checklist for firm-wide rules
  - `PartnerApprovalQueue.tsx` - Partner approval queue dashboard
  - `DoctrineImpactDashboard.tsx` - Impact visualization dashboard
  - `DoctrineVersionHistory.tsx` - Version history and rollback interface

### Backend Services

- **Location**: `server/src/services/`
- **Main Service**: `nexusDataExtractor.js` - Core data extraction and classification
- **Alert Engine**: `nexusAlertEngine.js` - Alert generation logic
- **Doctrine Services**:
  - `doctrineRuleService.js` - CRUD for doctrine rules, versioning, rollback
  - `doctrineApprovalService.js` - Approval workflow management
  - `doctrineImpactService.js` - Impact tracking and metrics
  - `doctrineReviewScheduler.js` - Scheduled annual review job
- **API Routes**: 
  - `server/src/routes/nexus-memos.js` - RESTful API endpoints
  - `server/src/routes/doctrine-rules.js` - Doctrine rule endpoints

---

## Multi-Step Workflow

The Nexus Memos system follows a 6-step process:

```
1. Upload → 2. Sheet Selection → 3. Header Detection → 
4. Column Mapping → 5. Alerts → 6. Memos
```

### Step Flow Management

- **Progress Tracking**: Visual step indicators with icons
- **Data Persistence**: Uses `sessionStorage` to maintain state between steps
- **File Management**: Stores `File` objects in memory for processing
- **Validation**: Each step validates data before allowing progression

---

## Step 1: File Upload

### Features

#### File Selection Methods
- **Drag & Drop**: Drag files directly onto the upload area
- **File Browser**: Click to open native file picker
- **Multiple Files**: Support for batch uploads

#### File Validation
- **Size Limit**: Maximum 15MB per file
- **Supported Formats**:
  - CSV files (`.csv`)
  - Excel files (`.xlsx`, `.xls`)
- **Error Handling**: Clear error messages for invalid files

#### Upload Process
1. File validation (size, type)
2. Upload to backend via `/api/nexus-memos/upload`
3. Automatic document classification
4. Header detection (if applicable)
5. Preview data extraction (first 10 rows)

#### Document Classification Display
- **Document Type Badge**: Color-coded chip showing document type
- **Type Icons**: Visual indicators for different document types
- **Confidence Score**: Percentage confidence in classification
- **Description**: Human-readable description of document type

#### Document Types Supported
- **PROFIT_LOSS** - Profit & Loss statements
- **TRANSACTION_DETAIL** - Detailed transaction records
- **CHANNEL_ANALYSIS** - Channel breakdown analysis
- **MONTHLY_ADJUSTMENTS** - Monthly adjustment reports
- **STATE_SUMMARY** - State-level revenue summaries
- **PAYROLL_DATA** - Payroll information
- **GL_DATA** - General Ledger data
- **UNKNOWN** - Unclassified documents

#### Preview Data
- Displays first 10 rows of parsed data
- Shows detected columns
- Helps users verify file content before proceeding

### UI Components
- Upload dropzone with visual feedback
- File list with status indicators
- Document type badges with tooltips
- Progress indicators for upload status
- Error alerts for failed uploads

---

## Step 2: Sheet Selection

### Purpose
For Excel files with multiple sheets, allows users to select which sheet(s) to process.

### Features
- **Sheet Detection**: Automatically lists all sheets in Excel files
- **Sheet Information**: Shows sheet name and data richness score
- **Multi-Select**: Option to process multiple sheets
- **Sheet Preview**: Preview of data in selected sheets
- **Data Richness Scoring**: System scores sheets based on:
  - Number of rows
  - Number of columns
  - Data completeness
  - Header quality

### UI Components
- Sheet selection cards
- Data preview tables
- Richness score indicators
- Select/deselect toggles

---

## Step 3: Header Detection

### Purpose
Automatically detects the header row in uploaded files, skipping metadata rows.

### Features

#### Intelligent Header Detection
- **Pattern Recognition**: Identifies header rows by:
  - Keyword matching (state, revenue, amount, location, etc.)
  - Numeric data validation (checks if next row contains data)
  - GL account code detection (e.g., "40000 -", "40100 -")
  - Metadata row skipping

#### Detection Algorithm
1. Scans first 20 rows of file
2. Scores each row based on:
   - Number of header keywords found
   - Presence of numeric data in subsequent row
   - Column count and structure
3. Selects row with highest score
4. Falls back to first non-empty row if no strong match

#### Detection Results
- **Header Row Index**: Zero-based index of detected header
- **Confidence Score**: 0-100% confidence in detection
- **Detected Headers**: Array of column names
- **Data Start Row**: First row containing actual data
- **Sample Rows**: Preview of data rows for validation

#### Live Processing Animation
- Real-time step-by-step processing display:
  - "Reading file structure..."
  - "Scanning for header patterns..."
  - "Detecting GL account codes..."
  - "Identifying state columns..."
  - "Analyzing data rows..."
  - "Calculating confidence score..."

#### Results Display
- **Summary Card**: Overview of all files analyzed
- **File Cards**: Expandable cards for each file showing:
  - Document type badge
  - Header row location
  - Confidence score with color coding:
    - Green: ≥80% (High confidence)
    - Yellow: ≥50% (Moderate confidence)
    - Red: <50% (Low confidence)
  - List of detected column headers
  - Data preview table (first 3 rows)

#### Manual Override
- Users can manually adjust header row if detection is incorrect
- Re-detect button to re-run detection algorithm

### UI Components
- Processing animation with step indicators
- Expandable file result cards
- Confidence score chips with color coding
- Header list with truncation for long names
- Data preview tables
- Re-detect button

---

## Step 4: Column Mapping

### Purpose
Maps detected columns to standardized field names required for nexus analysis.

### Features

#### Automatic Mapping Suggestions
- **AI-Powered Mapping**: System suggests mappings based on:
  - Column name similarity
  - Data pattern analysis
  - Document type context
- **Confidence Scores**: Each mapping includes confidence percentage
- **Multiple Suggestions**: System may suggest multiple possible mappings

#### Mappable Fields
- **State**: State code or name column
- **Revenue**: Revenue/income/sales amount column
- **Entity**: Entity/subsidiary identifier
- **Worker**: Employee/worker count
- **GL Account**: General ledger account code
- **Date**: Transaction or period date
- **Customer**: Customer identifier
- **Invoice**: Invoice number

#### Mapping Interface
- **Column List**: Shows all detected columns
- **Suggested Mappings**: Displays suggested field with confidence
- **Manual Override**: Dropdown to manually select mapping
- **Ignore Option**: Mark columns as ignored (not mapped)
- **Validation**: Ensures required fields are mapped

#### Mapping Status
- **Mapped**: Column successfully mapped to a field
- **Suggested**: System suggests a mapping (user can accept/reject)
- **Ignored**: Column marked as not needed
- **Required**: Field must be mapped to proceed

### UI Components
- Mapping table with columns and suggestions
- Confidence score badges
- Dropdown selectors for manual mapping
- Required field indicators
- Validation messages

---

## Step 5: Alerts Generation

### Purpose
Analyzes normalized data and generates nexus compliance alerts based on thresholds and patterns.

### Features

#### Alert Types
1. **Sales Tax Alerts**
   - Threshold approaching warnings
   - Threshold exceeded critical alerts
   - Multi-state exposure warnings

2. **Income Tax Alerts**
   - Economic nexus threshold warnings
   - Filing requirement alerts
   - Registration needed alerts

3. **Payroll Tax Alerts**
   - Worker presence warnings
   - Payroll threshold alerts
   - Registration requirements

4. **Franchise Tax Alerts**
   - Entity presence warnings
   - Franchise tax obligations
   - Annual report requirements

#### Alert Severity Levels
- **Red (Critical)**: Immediate action required
  - Threshold exceeded
  - Registration overdue
  - Penalty risk high

- **Orange (Warning)**: Attention needed
  - Threshold approaching (80-99%)
  - Registration may be required
  - Moderate penalty risk

- **Yellow (Info)**: Monitor
  - Threshold at 50-79%
  - Future obligations
  - Low risk

#### Alert Properties
- **Type**: Sales/Income/Payroll/Franchise tax
- **Severity**: Red/Orange/Yellow
- **State Code**: Affected state
- **Message**: Human-readable alert description
- **Threshold**: Relevant threshold amount
- **Percentage**: Current amount as % of threshold
- **Judgment Required**: Boolean flag for alerts needing professional judgment
- **Known**: User can mark alerts as "known" (acknowledged)

#### Alert Filtering
- **All Alerts**: Show all generated alerts
- **Red Only**: Show only critical alerts
- **Orange Only**: Show only warnings
- **Judgment Required**: Filter alerts needing professional review

#### Alert Management
- **Mark as Known**: Checkbox to acknowledge alerts
- **Alert Details**: Expandable cards showing full alert information
- **State Grouping**: Alerts grouped by state for easy review
- **Apply Doctrine**: Button to apply existing doctrine rules to judgment alerts
- **Create Doctrine Rule**: Option to save judgment decisions as reusable rules

#### Doctrine Integration
- **Judgment Call Propagation**: When marking an alert as "judgment required", system prompts to save decision as doctrine rule
- **Scope Selection**: Choose rule scope (Client / Office / Firm-wide)
- **Rule Matching**: System checks active doctrine rules before generating alerts
- **Automatic Application**: Matching doctrine rules automatically applied to similar situations

### Alert Generation Logic

#### Revenue by State Analysis
- Aggregates revenue by state from transaction data
- Compares against state-specific thresholds
- Generates alerts when thresholds are approached or exceeded

#### Threshold Detection
- **Sales Tax**: Typically $100,000 or $500,000 depending on state
- **Income Tax**: Economic nexus thresholds vary by state
- **Payroll Tax**: Based on worker presence and payroll amounts
- **Franchise Tax**: Entity presence and revenue thresholds

#### Conflict Detection
- **GL/Entity Conflicts**: Detects discrepancies between GL account data and entity data
- **State Code Validation**: Validates state codes against USPS abbreviations
- **Data Consistency Checks**: Identifies anomalies in data patterns

### UI Components
- Alert summary cards with severity indicators
- Filter buttons (All, Red, Orange, Judgment Required)
- Alert list with expandable details
- "Mark as known" checkboxes
- State grouping and organization
- Alert count badges

---

## Step 6: Memos Generation

### Purpose
Generates professional memos summarizing the nexus analysis and alerts.

### Features

#### Memo Content
- **Executive Summary**: High-level overview of findings
- **State-by-State Analysis**: Detailed breakdown per state
- **Alert Summary**: List of all alerts with severity
- **Recommendations**: Action items and next steps
- **Data Summary**: Key metrics and statistics
- **Doctrine Metadata**: References to applied doctrine rules (rule_id, version)

#### Doctrine Rule Tracking
- **Applied Rules**: Memos include metadata about which doctrine rules were applied
- **Rule Versioning**: Tracks which version of each rule was used
- **Audit Trail**: Links memos to specific doctrine rule versions for compliance

#### Memo Formatting
- Professional document formatting
- State-organized sections
- Alert severity indicators
- Actionable recommendations
- Export capabilities (PDF, Word)

### UI Components
- Memo preview
- Export buttons
- Print functionality
- Download options

---

## Doctrine Propagation System (P10)

### Overview

The Doctrine Propagation System allows firms to capture, approve, and propagate professional judgment decisions across clients, offices, and the entire firm. This system ensures consistency, reduces redundant analysis, and maintains an audit trail of decision-making.

### Core Concepts

#### Doctrine Rules
Doctrine rules are reusable decision templates that capture:
- **State**: Which state the rule applies to
- **Tax Type**: Sales, Income, Payroll, or Franchise tax
- **Activity Pattern**: Pattern of activity that triggers the rule
- **Posture**: Firm's position or approach
- **Decision**: The recommended action or conclusion
- **Scope**: Client, Office, or Firm-wide applicability

#### Rule Scopes
1. **Client Scope**: Applies only to a specific client
   - Auto-activated upon creation
   - No approval required
   - Stored with `client_id`

2. **Office Scope**: Applies to all clients in an office
   - Requires 1 partner approval
   - Stored with `office_id`

3. **Firm-wide Scope**: Applies to all clients firm-wide
   - Requires 2 distinct partner approvals
   - Stored with `organization_id`
   - Requires pre-flight checklist completion

### Database Entities

#### DoctrineRule Table
Stores all doctrine rules with versioning support.

**Key Fields:**
- `rule_id` (Primary Key)
- `name` - Human-readable rule name
- `state` - State code (e.g., "CA", "NY")
- `tax_type` - Sales/Income/Payroll/Franchise
- `activity_pattern` - JSON pattern matching criteria
- `posture` - Firm's position
- `decision` - Recommended action
- `scope` - client/office/firm
- `client_id` - Nullable, for client-scoped rules
- `office_id` - Nullable, for office-scoped rules
- `status` - draft/pending_approval/active/disabled
- `version` - Version number for tracking
- `rationale_internal` - Internal notes (not client-facing)
- `review_due_at` - Date when rule should be reviewed
- `created_at`, `updated_at` - Timestamps
- `created_by` - User who created the rule

#### DoctrineApproval Table
Tracks approval workflow for office and firm-wide rules.

**Key Fields:**
- `approval_id` (Primary Key)
- `rule_id` (Foreign Key)
- `approver_id` - User who approved/rejected
- `approver_role` - Partner/Manager/etc.
- `approved_at` - Timestamp
- `action` - approve/reject
- `comment` - Optional approval notes

#### DoctrineImpactMetrics Table
Tracks usage and impact of active rules.

**Key Fields:**
- `metric_id` (Primary Key)
- `rule_id` (Foreign Key)
- `total_clients_affected` - Count of clients where rule applied
- `total_memos_generated` - Count of memos using this rule
- `total_revenue_covered` - Total revenue amount covered
- `last_applied_at` - Most recent application timestamp
- `updated_at` - Last metrics update

#### DoctrineVersionEvent Table
Immutable audit log for all rule changes.

**Key Fields:**
- `event_id` (Primary Key)
- `rule_id` (Foreign Key)
- `from_version` - Previous version number
- `to_version` - New version number
- `action_type` - create/update/disable/rollback
- `actor_id` - User who made the change
- `timestamp` - When change occurred
- `reason` - Reason for change
- `previous_snapshot` - JSON snapshot of old rule
- `new_snapshot` - JSON snapshot of new rule

### Workflow Integrations

#### 1. Judgment Call Propagation (P9 Integration)

**Location**: Step 5 (Alerts Generation)

**Trigger**: When a user marks an alert as "judgment required"

**Workflow**:
1. User reviews alert and makes a judgment decision
2. System displays modal: "Save this decision for similar situations?"
3. User selects scope:
   - **Client**: Rule applies only to current client (auto-activated)
   - **Office**: Rule applies to all clients in office (requires approval)
   - **Firm-wide**: Rule applies firm-wide (requires 2 partner approvals)
4. User enters rationale (internal notes)
5. System creates DoctrineRule:
   - If scope = "client": Status = "active" (immediate activation)
   - If scope = "office": Status = "pending_approval" (1 partner needed)
   - If scope = "firm": Status = "pending_approval" (2 partners needed)
6. System creates DoctrineVersionEvent for audit trail

**UI Component**: `DoctrineScopeSelector.tsx`
- Modal dialog with scope selection
- Rationale input field (textarea)
- Preview of rule that will be created
- Confirmation buttons

#### 2. Approval Workflow

**For Office Rules**:
- Requires 1 partner approval
- Notification sent to office partners
- Rule appears in Partner Approval Queue
- Once approved, status changes to "active"

**For Firm-wide Rules**:
- Requires 2 distinct partner approvals
- Pre-flight checklist must be completed before submission
- Notification sent to all partners
- Rule appears in Partner Approval Queue
- Once 2 approvals received, status changes to "active"

**Pre-flight Checklist** (`DoctrinePreFlightCheck.tsx`):
- [ ] Rule has been tested with dry-run
- [ ] Impact analysis reviewed
- [ ] Rationale documented
- [ ] Legal/tax review completed (if applicable)
- [ ] Stakeholders notified

**Partner Approval Queue** (`PartnerApprovalQueue.tsx`):
- Lists all rules pending approval
- Shows rule details, scope, and impact preview
- Approve/Reject buttons with comment fields
- Filters by scope, tax type, state

#### 3. Dry-Run & Impact Preview

**Purpose**: Preview which clients would be affected before activating a rule

**Endpoint**: `POST /api/doctrine-rules/dry-run`

**Request**:
```json
{
  "rule": {
    "state": "CA",
    "tax_type": "SALES_TAX",
    "activity_pattern": {...},
    "posture": "AGGRESSIVE",
    "decision": "NO_REGISTRATION"
  },
  "scope": "firm"
}
```

**Response**:
```json
{
  "success": true,
  "impact": {
    "clientsAffected": 15,
    "clientIds": ["client-1", "client-2", ...],
    "totalRevenue": 5000000,
    "estimatedMemos": 15,
    "riskLevel": "MEDIUM"
  },
  "preview": [
    {
      "clientId": "client-1",
      "clientName": "Acme Corp",
      "currentStatus": "THRESHOLD_EXCEEDED",
      "wouldBecome": "NO_ACTION_NEEDED",
      "revenue": 600000
    }
  ]
}
```

**UI**: Shows preview in modal before rule submission

#### 4. Annual Review Automation

**Scheduled Job**: `doctrineReviewScheduler.js`
- Runs daily to check `review_due_at` dates
- Flags rules that are overdue for review
- Sends email notifications to:
  - Rule owner (creator)
  - Office partners (for office rules)
  - All partners (for firm-wide rules)

**Auto-Disable Logic**:
- Rules overdue by 30+ days are automatically disabled
- Disabled rules do not apply to new memos
- Existing memos retain reference to rule version used
- Notification sent when rule is auto-disabled

**UI Dashboard**:
- "Review Due" badges on rules approaching review date
- Filter: "Review Due Soon" / "Overdue"
- Bulk actions: Extend review date, Disable, Mark as reviewed

### Frontend Components

#### DoctrineScopeSelector.tsx
**Purpose**: Modal for selecting rule scope when saving judgment decisions

**Location**: Used in `AlertsStep.tsx` when user marks alert as judgment required

**Features**:
- Radio buttons for scope selection (Client/Office/Firm-wide)
- Rationale textarea (required)
- Preview of rule that will be created
- Warning message for firm-wide scope
- Cancel/Submit buttons

#### DoctrinePreFlightCheck.tsx
**Purpose**: Pre-flight checklist modal before submitting firm-wide rules

**Location**: Shown before submitting firm-wide doctrine rules

**Features**:
- Checklist items (all must be checked)
- Impact preview link
- Dry-run results display
- Submit/Cancel buttons

#### PartnerApprovalQueue.tsx
**Purpose**: Dashboard for partners to review and approve pending rules

**Location**: New dashboard page `/dashboard/managing-partner/doctrine/approvals`

**Features**:
- Table of pending rules
- Filters: Scope, Tax Type, State, Date
- Rule details expandable view
- Impact preview
- Approve/Reject actions with comments
- Approval history

#### DoctrineImpactDashboard.tsx
**Purpose**: Visualize impact of active doctrine rules

**Location**: New dashboard page `/dashboard/managing-partner/doctrine/impact`

**Features**:
- Blast radius visualization (which clients affected)
- Metrics cards:
  - Total active rules
  - Total clients affected
  - Total memos generated
  - Total revenue covered
- Rule usage statistics
- Trend charts (rules created over time)
- Filter by scope, tax type, state

#### DoctrineVersionHistory.tsx
**Purpose**: View and rollback version history for doctrine rules

**Location**: Used in doctrine rule detail view

**Features**:
- Timeline of version changes
- Diff view (what changed between versions)
- Rollback button (partners only)
- Event details (who, when, why)
- Snapshot comparison

### Backend Services

#### doctrineRuleService.js
**Location**: `server/src/services/doctrineRuleService.js`

**Methods**:
- `createRule(data)` - Create new doctrine rule
- `updateRule(ruleId, data)` - Update existing rule (creates new version)
- `getRule(ruleId, version?)` - Get rule by ID, optionally specific version
- `listRules(filters)` - List rules with filters (scope, status, etc.)
- `disableRule(ruleId)` - Disable a rule
- `rollbackRule(ruleId, targetVersion)` - Rollback to previous version
- `getVersionHistory(ruleId)` - Get all versions of a rule
- `matchRules(criteria)` - Find matching rules for given criteria

#### doctrineApprovalService.js
**Location**: `server/src/services/doctrineApprovalService.js`

**Methods**:
- `submitForApproval(ruleId)` - Submit rule for approval
- `approveRule(ruleId, approverId, comment)` - Approve a rule
- `rejectRule(ruleId, approverId, comment)` - Reject a rule
- `getPendingApprovals(filters)` - Get rules pending approval
- `checkApprovalStatus(ruleId)` - Check if rule has required approvals

#### doctrineImpactService.js
**Location**: `server/src/services/doctrineImpactService.js`

**Methods**:
- `calculateImpact(rule)` - Calculate impact of a rule (dry-run)
- `updateImpactMetrics(ruleId)` - Update metrics for a rule
- `getImpactDashboard(filters)` - Get dashboard data
- `getBlastRadius(ruleId)` - Get list of affected clients

#### doctrineReviewScheduler.js
**Location**: `server/src/jobs/doctrineReviewScheduler.js`

**Purpose**: Scheduled job for annual review automation

**Schedule**: Runs daily at 2:00 AM

**Tasks**:
1. Find rules with `review_due_at <= today`
2. Flag overdue rules
3. Auto-disable rules overdue by 30+ days
4. Send email notifications

### API Endpoints

#### Base URL
```
http://localhost:3080/api/doctrine-rules
```

#### Endpoints

##### 1. POST `/api/doctrine-rules`
Create a new doctrine rule.

**Request**:
```json
{
  "name": "CA Sales Tax - No Registration",
  "state": "CA",
  "tax_type": "SALES_TAX",
  "activity_pattern": {
    "revenue_threshold": 500000,
    "revenue_range": "400000-499999"
  },
  "posture": "CONSERVATIVE",
  "decision": "NO_REGISTRATION",
  "scope": "client",
  "client_id": "client-123",
  "rationale_internal": "Client has temporary revenue spike, not sustained"
}
```

**Response**:
```json
{
  "success": true,
  "rule": {
    "rule_id": "rule-456",
    "version": 1,
    "status": "active",
    ...
  }
}
```

##### 2. POST `/api/doctrine-rules/:id/approve`
Approve a pending rule.

**Request**:
```json
{
  "comment": "Approved after review of impact analysis"
}
```

**Response**:
```json
{
  "success": true,
  "approval": {
    "approval_id": "approval-789",
    "rule_id": "rule-456",
    "approver_id": "user-123",
    "approved_at": "2024-01-15T10:30:00Z"
  },
  "rule": {
    "status": "active", // If all approvals received
    ...
  }
}
```

##### 3. POST `/api/doctrine-rules/:id/reject`
Reject a pending rule.

**Request**:
```json
{
  "comment": "Needs legal review before firm-wide application"
}
```

**Response**:
```json
{
  "success": true,
  "rule": {
    "status": "rejected",
    ...
  }
}
```

##### 4. POST `/api/doctrine-rules/dry-run`
Simulate rule impact without creating the rule.

**Request**: Same as create rule request

**Response**: See Dry-Run & Impact Preview section above

##### 5. GET `/api/doctrine-rules/pending`
List rules pending approval.

**Query Parameters**:
- `scope` - Filter by scope (client/office/firm)
- `tax_type` - Filter by tax type
- `state` - Filter by state code
- `page` - Page number
- `limit` - Results per page

**Response**:
```json
{
  "success": true,
  "rules": [
    {
      "rule_id": "rule-456",
      "name": "CA Sales Tax Rule",
      "scope": "firm",
      "status": "pending_approval",
      "approvals_received": 1,
      "approvals_required": 2,
      ...
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 10
  }
}
```

##### 6. POST `/api/doctrine-rules/:id/rollback`
Rollback rule to a previous version.

**Request**:
```json
{
  "target_version": 2,
  "reason": "New version caused unintended consequences"
}
```

**Response**:
```json
{
  "success": true,
  "rule": {
    "rule_id": "rule-456",
    "version": 3, // New version created from version 2
    ...
  }
}
```

##### 7. POST `/api/doctrine-rules/:id/disable`
Disable an active rule.

**Request**:
```json
{
  "reason": "Rule no longer applicable due to regulatory changes"
}
```

**Response**:
```json
{
  "success": true,
  "rule": {
    "status": "disabled",
    ...
  }
}
```

##### 8. GET `/api/doctrine-rules/impact`
Get impact dashboard data.

**Query Parameters**:
- `scope` - Filter by scope
- `tax_type` - Filter by tax type
- `date_range` - Filter by date range

**Response**:
```json
{
  "success": true,
  "metrics": {
    "total_active_rules": 45,
    "total_clients_affected": 120,
    "total_memos_generated": 350,
    "total_revenue_covered": 50000000
  },
  "rules": [
    {
      "rule_id": "rule-456",
      "name": "CA Sales Tax Rule",
      "clients_affected": 15,
      "memos_generated": 25,
      "revenue_covered": 5000000,
      "last_applied_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Permissions & Roles

#### Partner Role
- Can approve firm/office rules
- Can rollback any rule
- Can disable any rule
- Can create rules at any scope
- Can view all rules and impact dashboard

#### Manager Role
- Can create client/office rules
- Can view impact dashboard
- Can view approval queue (read-only)
- Cannot approve firm-wide rules
- Cannot rollback or disable firm-wide rules

#### User Role
- Can create client-only rules
- Can view applicable rules (client-scoped)
- Cannot create office/firm rules
- Cannot approve rules
- Cannot view impact dashboard

### Integration Points with Nexus Memos

#### Alert Generation Integration
- Before generating alerts, system checks for matching active doctrine rules
- If matching rule found, alert may be suppressed or modified based on rule decision
- Alert metadata includes `applied_doctrine_rule_id` if rule was applied

#### Memo Generation Integration
- Memos include `doctrine_rule_version` in metadata
- Memo content references applied doctrine rules
- Audit trail links memos to specific rule versions

#### Column Mapping Integration (Future)
- Doctrine rules may influence column mapping suggestions
- Rules can specify preferred column names or patterns

### Validation & Safety Guards

#### Default Scope Protection
- Default scope is always "client"
- Users must explicitly select "office" or "firm" scope
- Cannot accidentally create firm-wide rules

#### Firm-wide Confirmation
- Firm-wide scope requires blocking confirmation modal
- Pre-flight checklist must be completed
- Impact preview must be reviewed

#### Immutable Audit Log
- All rule changes create version events
- Previous versions cannot be deleted
- Rollback creates new version, doesn't delete history

#### Annual Auto-Disable
- Rules overdue for review by 30+ days are auto-disabled
- Prevents stale rules from propagating
- Notification sent when auto-disabled

### Metrics to Track

#### Rule Creation Metrics
- Number of rules created (by scope)
- Rules created per month
- Most common tax types
- Most common states

#### Approval Metrics
- Time to approval for firm-wide rules
- Average approval time by scope
- Rejection rate
- Approval queue size

#### Impact Metrics
- Number of clients affected per rule
- Total revenue covered by rules
- Memos generated using rules
- Rule usage frequency

#### Maintenance Metrics
- Rollback frequency and reasons
- Review compliance rate
- Auto-disabled rules count
- Rules overdue for review

### Implementation Phases

#### Phase 1: Core Entities & Judgment Modal
**Status**: Planned

**Tasks**:
- Create DoctrineRule, DoctrineApproval, DoctrineImpactMetrics, DoctrineVersionEvent tables
- Implement `doctrineRuleService.js` with CRUD operations
- Build `DoctrineScopeSelector.tsx` component
- Integrate into AlertsStep workflow
- Add judgment call propagation logic

**Deliverables**:
- Database schema
- Basic rule creation
- Scope selector modal
- Client-scoped rules working

#### Phase 2: Approval Workflow & Queue
**Status**: Planned

**Tasks**:
- Implement `doctrineApprovalService.js`
- Build `PartnerApprovalQueue.tsx` dashboard
- Build `DoctrinePreFlightCheck.tsx` component
- Implement approval logic (1 partner for office, 2 for firm)
- Add notification system integration

**Deliverables**:
- Approval workflow functional
- Partner approval queue
- Pre-flight checklist
- Office and firm-wide rules working

#### Phase 3: Impact Dashboard & Versioning
**Status**: Planned

**Tasks**:
- Implement `doctrineImpactService.js`
- Build `DoctrineImpactDashboard.tsx`
- Build `DoctrineVersionHistory.tsx`
- Implement rollback functionality
- Add dry-run endpoint

**Deliverables**:
- Impact dashboard
- Version history view
- Rollback functionality
- Dry-run simulation

#### Phase 4: Annual Review & Automation
**Status**: Planned

**Tasks**:
- Implement `doctrineReviewScheduler.js` scheduled job
- Add review due date management
- Implement auto-disable logic
- Add email notification integration
- Build review dashboard UI

**Deliverables**:
- Scheduled review job
- Auto-disable functionality
- Review notifications
- Review dashboard

---

## Document Classification Engine

### Overview
The Document Classification Engine automatically identifies document types based on header patterns and data structure.

### Classification Methods

#### Pattern-Based Detection
1. **Profit & Loss Pattern**
   - Looks for GL account codes ("40000 -", "40100 -")
   - "Profit & Loss" header text
   - "Fiscal Year" indicators

2. **Transaction Detail Pattern**
   - Invoice, Customer, Ship columns
   - Tax Code, Subsidiary columns
   - Transaction-level data structure

3. **Channel Analysis Pattern**
   - Amazon, Shopify, Walmart, Ebay columns
   - Channel breakdown indicators

4. **Monthly Adjustments Pattern**
   - Month column
   - Gross_Revenue or Net_Revenue columns

5. **State Summary Pattern**
   - Simple structure (≤3 columns)
   - State and Revenue columns

6. **Payroll Data Pattern**
   - Employee, Worker columns
   - Payroll amount columns

7. **GL Data Pattern**
   - GL Account codes
   - Account descriptions

### Classification Output
```javascript
{
  type: 'PROFIT_LOSS' | 'TRANSACTION_DETAIL' | 'CHANNEL_ANALYSIS' | 
        'MONTHLY_ADJUSTMENTS' | 'STATE_SUMMARY' | 'PAYROLL_DATA' | 
        'GL_DATA' | 'UNKNOWN',
  subtype: 'STATE_AGGREGATED' | 'INVOICE_LEVEL' | 'MARKETPLACE' | 
           'GROSS_NET' | 'REVENUE_ONLY' | 'GENERIC',
  confidence: 0-100, // Percentage confidence
  description: 'Human-readable description'
}
```

### Integration
- Runs automatically during file upload
- Results displayed in Upload Step
- Used to inform column mapping suggestions
- Affects alert generation logic

---

## Data Extraction & Normalization

### Data Extraction

#### CSV Parsing
- **Delimiter Detection**: Automatically detects comma, tab, or pipe delimiters
- **Quoted Fields**: Handles quoted fields with embedded commas
- **Header Detection**: Identifies header row (see Header Detection section)
- **Encoding Support**: UTF-8, Windows-1252, ISO-8859-1

#### Excel Parsing
- **Multi-Sheet Support**: Processes multiple sheets
- **Sheet Selection**: User selects which sheets to process
- **Data Richness Scoring**: Scores sheets based on data quality
- **Format Detection**: Handles various Excel formats (.xlsx, .xls)

### Data Normalization

#### State Normalization
- **USPS Abbreviations**: Converts state names to standard codes (AL, AZ, CA, etc.)
- **Typo Handling**: Corrects common misspellings
- **Variation Handling**: Handles "California" vs "CA" vs "Calif."
- **Case Insensitive**: Normalizes case variations

#### Currency Normalization
- **Symbol Removal**: Strips $, €, £ symbols
- **Comma Handling**: Removes thousands separators
- **K/M Abbreviations**: Converts "1.5K" → 1500, "2M" → 2000000
- **Scientific Notation**: Handles "1.5e6" format
- **Negative Values**: Preserves negative signs and parentheses notation

#### Column Detection
- **State Column**: Identifies state code/name columns
- **Revenue Column**: Finds revenue/income/sales columns
- **Entity Column**: Detects entity/subsidiary identifiers
- **Worker Column**: Identifies employee/worker count columns
- **GL Column**: Finds general ledger account codes

#### Data Aggregation
- **Revenue by State**: Aggregates transaction-level data to state totals
- **Entity Grouping**: Groups data by entity/subsidiary
- **Period Aggregation**: Aggregates by time period if date columns present

### Data Validation
- **Required Fields**: Validates presence of state and revenue data
- **Data Types**: Validates numeric fields are numeric
- **Range Checks**: Validates reasonable value ranges
- **Consistency Checks**: Identifies data inconsistencies

---

## API Endpoints

### Base URL
```
http://localhost:3080/api/nexus-memos
```

### Endpoints

#### 1. POST `/upload`
Uploads a file and performs initial processing.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `file`: File object (CSV or Excel)
  - `fileType`: Optional file type hint

**Response:**
```json
{
  "success": true,
  "uploadId": "upload-1234567890",
  "metadata": {
    "fileName": "example.csv",
    "fileType": "csv",
    "fileSize": 1024000,
    "rowCount": 1000,
    "columnCount": 16
  },
  "sheets": [
    {
      "name": "Sheet1",
      "rowCount": 1000,
      "columnCount": 16,
      "richnessScore": 85
    }
  ],
  "documentClassification": {
    "type": "PROFIT_LOSS",
    "subtype": "STATE_AGGREGATED",
    "confidence": 95,
    "description": "Profit & Loss statement with state-level breakdown"
  },
  "headerDetection": {
    "headerRowIndex": 5,
    "confidence": 100,
    "headers": ["State", "40000 - Product Sales", ...],
    "dataStartRow": 6
  },
  "previewData": [
    ["Alabama", "150000, ...],
    ...
  ],
  "fileBuffer": "base64-encoded-file-content"
}
```

#### 2. POST `/detect-sheets`
Detects and returns available sheets in an Excel file.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `file`: File object
  - `fileType`: "xlsx" or "xls"

**Response:**
```json
{
  "success": true,
  "sheets": [
    {
      "name": "Sheet1",
      "rowCount": 1000,
      "columnCount": 16,
      "richnessScore": 85
    }
  ]
}
```

#### 3. POST `/detect-header`
Detects the header row in an uploaded file.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `file`: File object
  - `fileType`: "csv", "xlsx", or "xls"
  - `sheetName`: Optional sheet name for Excel files

**Response:**
```json
{
  "success": true,
  "headerRowIndex": 5,
  "confidence": 100,
  "headers": ["State", "Revenue", ...],
  "dataStartRow": 6,
  "sampleRows": [
    ["Alabama", "150000", ...],
    ...
  ]
}
```

#### 4. POST `/suggest-mappings`
Suggests column mappings based on detected headers.

**Request:**
- Method: `POST`
- Content-Type: `application/json`
- Body:
```json
{
  "uploadId": "upload-1234567890",
  "headers": ["State", "Revenue", ...],
  "documentType": "PROFIT_LOSS",
  "sampleData": [[...], ...]
}
```

**Response:**
```json
{
  "success": true,
  "mappings": [
    {
      "columnIndex": 0,
      "columnName": "State",
      "suggestedField": "state",
      "confidence": 95,
      "alternatives": []
    },
    {
      "columnIndex": 1,
      "columnName": "Revenue",
      "suggestedField": "revenue",
      "confidence": 90,
      "alternatives": ["income", "sales"]
    }
  ]
}
```

#### 5. POST `/process`
Processes files with mappings and generates alerts.

**Request:**
- Method: `POST`
- Content-Type: `application/json`
- Body:
```json
{
  "uploadId": "upload-1234567890",
  "mappings": [
    {
      "columnIndex": 0,
      "mappedField": "state"
    },
    {
      "columnIndex": 1,
      "mappedField": "revenue"
    }
  ],
  "headerRowIndex": 5
}
```

**Response:**
```json
{
  "success": true,
  "normalizedData": {
    "revenueByState": {
      "AL": 150000,
      "AZ": 200000,
      ...
    },
    "totalRevenue": 5000000
  },
  "alerts": [
    {
      "type": "SALES_TAX",
      "severity": "RED",
      "stateCode": "CA",
      "message": "Threshold exceeded: $500,000",
      "threshold": 500000,
      "currentAmount": 600000,
      "percentage": 120,
      "judgmentRequired": true,
      "known": false,
      "appliedDoctrineRuleId": "rule-456",
      "doctrineRuleVersion": 2
    }
  ],
  "memos": {
    "summary": "...",
    "stateAnalysis": {...},
    "recommendations": [...],
    "doctrineMetadata": {
      "appliedRules": [
        {
          "ruleId": "rule-456",
          "version": 2,
          "name": "CA Sales Tax - No Registration"
        }
      ]
    }
  }
}
```

### Doctrine Rules Endpoints

See [Doctrine Propagation System (P10)](#doctrine-propagation-system-p10) section for complete API documentation.

---

## Technical Implementation

### Frontend Technologies
- **Framework**: Next.js 14+ with App Router
- **UI Library**: NextUI (React component library)
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)
- **API Client**: Custom `apiClient` from `lib/api.ts`
- **File Handling**: Native File API, FormData

### Backend Technologies
- **Runtime**: Node.js
- **Framework**: Express.js
- **File Upload**: Multer middleware
- **Excel Processing**: `xlsx` library
- **CSV Parsing**: Custom parser with delimiter detection
- **Data Processing**: Custom normalization functions

### Data Flow

```
1. User uploads file → Frontend validates → Sends to /upload
2. Backend processes file → Classifies document → Detects headers
3. Backend returns metadata → Frontend displays in Upload Step
4. User proceeds to Sheet Selection (if Excel) → Selects sheets
5. User proceeds to Header Detection → System shows detected headers
6. User proceeds to Column Mapping → System suggests mappings → User confirms
7. User proceeds to Alerts → System processes data → Generates alerts
8. User proceeds to Memos → System generates memos → User reviews/export
```

### Error Handling
- **File Validation**: Size and type checks before upload
- **API Error Handling**: Try-catch blocks with user-friendly messages
- **Network Errors**: Retry logic and error recovery
- **Data Validation**: Validation at each step before progression

### Performance Optimizations
- **Lazy Loading**: Components loaded on demand
- **Data Pagination**: Large files processed in chunks
- **Caching**: Session storage for intermediate results
- **Debouncing**: Search and filter operations debounced

### Security Considerations
- **File Size Limits**: 15MB maximum per file
- **File Type Validation**: Only CSV and Excel files allowed
- **Input Sanitization**: All user inputs sanitized
- **Error Messages**: No sensitive information in error messages

---

## User Experience Features

### Visual Feedback
- **Loading States**: Spinners and progress bars during processing
- **Success Indicators**: Green checkmarks for completed steps
- **Error Alerts**: Red error messages with clear descriptions
- **Confidence Indicators**: Color-coded badges for confidence scores

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: ARIA labels and descriptions
- **Color Contrast**: WCAG AA compliant color schemes
- **Focus Indicators**: Clear focus states for interactive elements

### Responsive Design
- **Mobile Support**: Responsive layout for mobile devices
- **Tablet Optimization**: Optimized for tablet screens
- **Desktop Experience**: Full-featured desktop interface

---

## Future Enhancements

### Planned Features
1. **Batch Processing**: Process multiple files simultaneously
2. **Template System**: Save and reuse column mappings
3. **Historical Comparison**: Compare current data with previous periods
4. **Advanced Analytics**: Trend analysis and forecasting
5. **Integration**: Connect with accounting software (QuickBooks, Xero)
6. **Automated Scheduling**: Schedule periodic file processing
7. **Multi-Entity Support**: Process data for multiple entities simultaneously
8. **Custom Alert Rules**: User-defined alert thresholds and rules

### Doctrine Propagation Features (P10)
1. **Judgment Call Propagation**: Save judgment decisions as reusable doctrine rules
2. **Approval Workflow**: Multi-level approval for office and firm-wide rules
3. **Impact Dashboard**: Visualize blast radius of active rules
4. **Version History**: Track and rollback rule changes
5. **Annual Review Automation**: Automated review scheduling and notifications
6. **Dry-Run Simulation**: Preview rule impact before activation

---

## Troubleshooting

### Common Issues

#### File Upload Fails
- **Check file size**: Must be under 15MB
- **Check file type**: Only CSV and Excel files supported
- **Check network**: Ensure stable internet connection

#### Header Detection Incorrect
- **Review file structure**: Ensure file has clear header row
- **Manual override**: Use manual header selection if needed
- **Check for metadata**: Remove metadata rows if possible

#### Column Mapping Issues
- **Review suggestions**: System suggestions may need manual adjustment
- **Check column names**: Ensure column names are descriptive
- **Required fields**: Ensure all required fields are mapped

#### Alerts Not Generated
- **Check data quality**: Ensure data is properly normalized
- **Verify mappings**: Ensure state and revenue columns are mapped
- **Review thresholds**: Check if data meets alert thresholds

---

## Support & Documentation

### Additional Resources
- API Documentation: See `lib/api.ts` for API client methods
- Backend Services: See `server/src/services/nexusDataExtractor.js`
- Component Documentation: See individual component files

### Contact
For issues or questions, contact the development team or refer to the project documentation.

---

---

## Appendix: Doctrine Propagation Implementation Status

### Current Status
- **Phase 1**: Core Entities & Judgment Modal - **Planned**
- **Phase 2**: Approval Workflow & Queue - **Planned**
- **Phase 3**: Impact Dashboard & Versioning - **Planned**
- **Phase 4**: Annual Review & Automation - **Planned**

### Database Schema Requirements

#### DoctrineRule Table
```sql
CREATE TABLE doctrine_rules (
  rule_id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  state VARCHAR(2),
  tax_type VARCHAR(50),
  activity_pattern JSONB,
  posture VARCHAR(50),
  decision TEXT,
  scope VARCHAR(20) NOT NULL, -- 'client', 'office', 'firm'
  client_id UUID REFERENCES clients(id),
  office_id UUID REFERENCES offices(id),
  organization_id UUID REFERENCES organizations(id),
  status VARCHAR(50) NOT NULL, -- 'draft', 'pending_approval', 'active', 'disabled', 'rejected'
  version INTEGER NOT NULL DEFAULT 1,
  rationale_internal TEXT,
  review_due_at TIMESTAMP,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### DoctrineApproval Table
```sql
CREATE TABLE doctrine_approvals (
  approval_id UUID PRIMARY KEY,
  rule_id UUID REFERENCES doctrine_rules(rule_id),
  approver_id UUID REFERENCES users(id),
  approver_role VARCHAR(50),
  approved_at TIMESTAMP DEFAULT NOW(),
  action VARCHAR(20) NOT NULL, -- 'approve', 'reject'
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### DoctrineImpactMetrics Table
```sql
CREATE TABLE doctrine_impact_metrics (
  metric_id UUID PRIMARY KEY,
  rule_id UUID REFERENCES doctrine_rules(rule_id),
  total_clients_affected INTEGER DEFAULT 0,
  total_memos_generated INTEGER DEFAULT 0,
  total_revenue_covered DECIMAL(15,2) DEFAULT 0,
  last_applied_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(rule_id)
);
```

#### DoctrineVersionEvent Table
```sql
CREATE TABLE doctrine_version_events (
  event_id UUID PRIMARY KEY,
  rule_id UUID REFERENCES doctrine_rules(rule_id),
  from_version INTEGER,
  to_version INTEGER,
  action_type VARCHAR(50) NOT NULL, -- 'create', 'update', 'disable', 'rollback'
  actor_id UUID REFERENCES users(id),
  timestamp TIMESTAMP DEFAULT NOW(),
  reason TEXT,
  previous_snapshot JSONB,
  new_snapshot JSONB
);
```

---

**Last Updated**: 2024
**Version**: 1.1.0 (Added Doctrine Propagation System P10)

