# Nexus Monitoring Pages Documentation

## Overview

The Nexus Monitoring system provides real-time visualization and management of client nexus compliance across all US states. The system includes role-specific monitoring pages for different user types, each with tailored features and data views.

## User Roles & Access

### Available Roles

1. **Managing Partner** (`/dashboard/managing-partner/monitoring`)
   - High-level oversight and firm-wide analytics
   - Personalized dashboard mode support
   - Add nexus monitoring capability

2. **Tax Manager** (`/dashboard/tax-manager/monitoring`)
   - Operational monitoring and client management
   - Detailed client state tracking
   - Alert management and notifications

## Common Architecture

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    Sidebar (Dynamic)                        │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │              │  │                  │  │              │ │
│  │  Left Pane   │  │   Center Pane     │  │  Right Pane  │ │
│  │  (1/4 width) │  │   (1/2 width)    │  │  (1/4 width) │ │
│  │              │  │                  │  │              │ │
│  │ - Client     │  │   USA Map        │  │ - Alerts Tab │ │
│  │   List      │  │   Visualization  │  │ - Details    │ │
│  │ - Search    │  │   Interactive    │  │ - Metrics    │ │
│  │ - Status    │  │   State Colors  │  │              │ │
│  │   Overview  │  │   Click/Hover   │  │              │ │
│  │              │  │                  │  │              │ │
│  └──────────────┘  └──────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
API Endpoints
  ├── GET /api/nexus-dashboard-summary
  ├── GET /api/client-states?limit=100&organizationId=...
  └── GET /api/nexus-alerts?limit=100&organizationId=...

      ▼

React Hooks (useApi)
  ├── useNexusDashboardSummary()
  ├── useClientStates()
  └── useNexusAlerts()

      ▼

Data Processing (useMemo)
  ├── nexusData (State-level aggregation)
  ├── clients (Client-level processing)
  └── customStates (Map configuration)

      ▼

UI Components
  ├── EnhancedUSMap (Interactive map)
  ├── Client Cards (Left pane)
  └── Alerts Panel (Right pane)
```

## Managing Partner Monitoring Page

### Route
`/dashboard/managing-partner/monitoring`

### Key Features

#### 1. Personalized Dashboard Mode
- **Toggle**: Switch between organization-wide and client-specific views
- **Data Source**: Uses `usePersonalizedClientStates` and `usePersonalizedNexusAlerts` hooks
- **Header**: Shows client name when in personalized mode
- **Context**: `usePersonalizedDashboard` context provides organization and client IDs

#### 2. Left Pane - Client Management

**Header Section:**
- Live status indicator (pulsing green dot)
- Page title (changes based on personalized mode)
- Active state filter badge (if state selected)
- Refresh button (with loading spinner)
- Settings menu button

**Search Functionality:**
- Real-time client search
- Filters by client name or ID
- Styled with glassmorphism effect

**Add Nexus Monitoring Button:**
- Navigates to `/dashboard/managing-partner/monitoring/add`
- Full-width button with hover effects
- Only visible to Managing Partner role

**Status Overview Dropdown:**
- Collapsible section showing status counts
- Color-coded status indicators:
  - 🔴 Critical (Red)
  - 🟠 Warning (Orange)
  - 🔵 Pending (Blue)
  - 🔵 Transit (Cyan)
  - 🟢 Compliant (Green)
- Real-time counts from filtered clients

**Client Cards:**
- Apple-style glassmorphism design
- Status-based color coding
- Shows:
  - Client name and industry
  - Primary and secondary states
  - Revenue amount
  - Alert count
  - Threshold progress
  - Last update timestamp
- Click to open details panel and focus map
- Hover effects with scale animation

#### 3. Center Pane - Interactive USA Map

**Map Component:**
- Library: `@mirawision/usa-map-react`
- Interactive state selection
- Color-coded by status
- State labels with white text and black stroke

**State Colors:**
- **Critical**: `#ef4444` (Red)
- **Warning**: `#f97316` (Orange)
- **Pending**: `#3b82f6` (Blue)
- **Transit**: `#06b6d4` (Cyan)
- **Compliant**: `#10b981` (Green)
- **No Data**: `#374151` (Grey)

**Interactions:**
- **Click**: Focus state (highlights and filters clients)
- **Hover**: Shows tooltip with state data
- **Double-click**: Clear focus
- **Focus State**: Blue border (4px) and lighter background

**State Data Display:**
- Revenue total
- Client count
- Alert count
- Threshold progress
- Risk score

#### 4. Right Pane - Alerts & Details

**Tabs:**
- **Nexus Tab**: State-level alerts and metrics
- **Alerts Tab**: All alerts with filtering

**Nexus Tab Content:**
- Selected state information
- Client list for selected state
- Revenue breakdown
- Alert summary
- Compliance metrics

**Alerts Tab Content:**
- All alerts (including compliant alerts)
- Filterable by priority (high/medium/low)
- Filterable by type (threshold_breach/threshold_approaching)
- Sortable by date, priority, state
- Click to view details

**Details Panel:**
- Opens when client card is clicked
- Shows full client information
- State-by-state breakdown
- Alert details
- Action buttons

### Data Processing Logic

#### Status Determination

```javascript
// Priority: critical > warning > pending > transit > compliant
const statusPriority = {
  'critical': 5,
  'warning': 4,
  'pending': 3,
  'transit': 2,
  'compliant': 1
};
```

**Single Client State:**
- Uses `clientState.status` from database directly
- No recalculation from revenue ratio
- Preserves compliant status

**Multi-Client State Aggregation:**
```javascript
if (allCompliant) {
  status = 'compliant';
} else if (criticalCount === 1 && approachingCount === (totalClients - 1)) {
  status = 'warning'; // Special case: 1 critical + rest approaching
} else if (criticalCount > 1) {
  status = 'critical';
} else if (warningCount > 0 && criticalCount === 0) {
  status = 'warning';
} else if (pendingCount > 0 && criticalCount === 0 && warningCount === 0) {
  status = 'pending';
} else if (transitCount > 0 && criticalCount === 0 && warningCount === 0 && pendingCount === 0) {
  status = 'transit';
}
```

**Alert Processing:**
- Alerts only count, don't override status
- Status comes from client states (database)
- Alerts provide additional context

#### Threshold Progress Calculation

```javascript
// Uses average ratio to avoid inflating progress
const avgRatio = stateData[stateCode].revenue / (threshold * stateData[stateCode].clients);
stateData[stateCode].thresholdProgress = Math.min(100, Math.round(avgRatio * 100));
```

### API Integration

**Hooks Used:**
- `useNexusDashboardSummary(organizationId)` - Summary metrics
- `useClientStates({ limit: 100, organizationId })` - Client state data
- `useNexusAlerts({ limit: 100, organizationId })` - Alert data
- `usePersonalizedClientStates()` - Personalized client states (if enabled)
- `usePersonalizedNexusAlerts()` - Personalized alerts (if enabled)

**Data Refresh:**
- Manual refresh button
- Auto-refresh capability (configurable)
- Loading states for all data fetches

## Tax Manager Monitoring Page

### Route
`/dashboard/tax-manager/monitoring`

### Key Features

#### 1. Operational Focus
- Client-centric view
- Detailed state tracking
- Alert management
- Notification system

#### 2. Left Pane - Client List

**Similar to Managing Partner:**
- Search functionality
- Status overview dropdown
- Client cards with status indicators
- Click to view details

**Differences:**
- No "Add Nexus Monitoring" button
- Focus on operational metrics
- Client status calculated from state ratios

#### 3. Center Pane - USA Map

**Same as Managing Partner:**
- Interactive state visualization
- Color-coded by status
- Click/hover interactions
- Focus state functionality

#### 4. Right Pane - Alerts & Notifications

**Enhanced Features:**
- **AI Scanning Animation**: Visual scanning indicator cycling through states
- **Notification System**: Real-time notifications for:
  - AI scanning status
  - Critical alerts
  - System status
- **Alert Management**: 
  - Filter by priority
  - Filter by type
  - Sort by various criteria
  - Bulk actions

### Data Processing Logic

#### Client Status Calculation

```javascript
// Check if client has only compliant states
const allStatesCompliant = clientStatesForClient.every((cs: any) => cs.status === 'compliant');

if (allStatesCompliant) {
  client.nexusStatus = 'compliant';
} else if (client.alerts > 0) {
  // Calculate from highest threshold ratio
  const ratio = revenue / highestThreshold;
  if (ratio >= 1.0) {
    client.nexusStatus = 'critical';
  } else if (ratio >= 0.8) {
    client.nexusStatus = 'warning';
  } else if (ratio >= 0.5) {
    client.nexusStatus = 'pending';
  } else if (ratio >= 0.2) {
    client.nexusStatus = 'transit';
  } else {
    client.nexusStatus = 'compliant';
  }
}
```

#### State Aggregation

Similar to Managing Partner but with operational focus:
- Emphasizes alert counts
- Shows threshold progress per client
- Tracks risk scores

### Notification System

**Notification Types:**
1. **AI Scanning**: Shows current state being scanned
2. **Alert Notifications**: Critical and warning alerts
3. **System Status**: Overall monitoring health

**Notification Display:**
- Rotating carousel
- Auto-advance every few seconds
- Click to view details
- Dismissible

## Status Types & Colors

### Status Definitions

| Status | Color | Hex Code | Description | Alert Type |
|--------|-------|----------|-------------|------------|
| **Compliant** | Green | `#10b981` | Revenue < 20% of threshold | None |
| **Transit** | Cyan | `#06b6d4` | Revenue 20-50% of threshold | None |
| **Pending** | Blue | `#3b82f6` | Revenue 50-80% of threshold | None |
| **Warning** | Orange | `#f97316` | Revenue 80-100% of threshold | `threshold_approaching` (Medium) |
| **Critical** | Red | `#ef4444` | Revenue > 100% of threshold | `threshold_breach` (High) |

### Status Priority

```
Critical (5) > Warning (4) > Pending (3) > Transit (2) > Compliant (1)
```

### Status Aggregation Rules

**For States with Multiple Clients:**

1. **All Compliant**: → `compliant`
2. **1 Critical + Rest Approaching**: → `warning` (special case)
3. **Multiple Critical**: → `critical`
4. **Has Warnings, No Critical**: → `warning`
5. **Has Pending, No Critical/Warning**: → `pending`
6. **Has Transit, No Critical/Warning/Pending**: → `transit`

## Map Interactions

### State Click Behavior

```javascript
handleMapStateClick(stateCode) {
  if (mapFocusState === stateCode) {
    // Clear focus
    setMapFocusState(null);
    setSelectedState(null);
  } else {
    // Set focus
    setMapFocusState(stateCode);
    setSelectedState(stateCode);
  }
}
```

### Focus State Effects

- **Visual**: Blue border (4px), lighter background
- **Filtering**: Client list filters to show only clients in focused state
- **Details**: Right pane shows state-specific information
- **Clear**: Click same state again or close details panel

### Hover Effects

- Tooltip with state data
- Slight color brightening
- Cursor change to pointer

## Client Card Features

### Card Structure

```
┌─────────────────────────────────────┐
│ [Icon] Client Name        [Status]  │
│        Industry            Badge    │
├─────────────────────────────────────┤
│ 💰 Revenue        [State1] [State2] │
│ 📊 Progress: XX%  ⚠️ Alerts: X      │
│ 🕐 Last Update: MM/DD/YYYY          │
└─────────────────────────────────────┘
```

### Card Interactions

- **Click**: Opens details panel, focuses map on primary state
- **Hover**: Scale animation (1.02x), shadow effect
- **Status Badge**: Color-coded by nexus status
- **State Tags**: Shows primary and secondary states

### Status Icons

- **Critical/Warning**: Warning triangle (⚠️)
- **Pending**: Clock icon (🕐)
- **Transit**: Grid icon (📊)
- **Compliant**: Checkmark (✅)

## Data Refresh & Loading

### Loading States

**Initial Load:**
- Full-screen loading spinner
- "Loading Nexus Monitoring Data..." message
- Blocks all interactions

**Data Refresh:**
- Refresh button shows spinner
- Individual sections show loading states
- Non-blocking refresh

### Error Handling

**API Errors:**
- Error message display
- Retry button
- Fallback to cached data (if available)

**Empty States:**
- "No clients found" message
- Empty state illustration
- Action to add clients

## Filtering & Search

### Search Functionality

**Search By:**
- Client name (case-insensitive)
- Client ID
- Industry (partial match)

**Real-time Filtering:**
- Updates as user types
- Filters client cards
- Updates status counts

### State Filtering

**Map Focus:**
- Click state on map
- Filters client list to that state
- Shows state badge in header
- Clear by clicking state again

### Status Filtering

**Status Overview:**
- Click status count to filter
- Shows only clients with that status
- Updates map visualization

## Responsive Design

### Layout Breakpoints

**Desktop (default):**
- Left: 25% width
- Center: 50% width
- Right: 25% width

**Tablet:**
- Left: 30% width
- Center: 70% width
- Right: Hidden (toggleable)

**Mobile:**
- Single column
- Tabs for pane switching
- Collapsible sections

### Details Panel

**Desktop:**
- Slides in from right
- 320px width
- Overlays map

**Mobile:**
- Full-screen modal
- Swipe to dismiss
- Bottom sheet style

## Performance Optimizations

### Memoization

**useMemo Hooks:**
- `nexusData` - State aggregation (expensive calculation)
- `clients` - Client processing
- `customStates` - Map configuration
- `filteredClients` - Search/filter results

**Dependencies:**
- Only recalculates when source data changes
- Prevents unnecessary re-renders
- Optimizes map rendering

### Data Fetching

**Pagination:**
- Limits: 100 records per request
- Lazy loading for large datasets
- Infinite scroll (future enhancement)

**Caching:**
- React Query caching
- Stale-while-revalidate
- Background refetching

## API Endpoints

### Nexus Dashboard Summary
```
GET /api/nexus-dashboard-summary?organizationId={id}
```

**Response:**
```json
{
  "totalClients": 10,
  "totalStates": 65,
  "criticalStates": 5,
  "warningStates": 12,
  "compliantStates": 48,
  "totalAlerts": 17,
  "criticalAlerts": 5,
  "warningAlerts": 12
}
```

### Client States
```
GET /api/client-states?limit=100&organizationId={id}
```

**Response:**
```json
{
  "clientStates": [
    {
      "id": "...",
      "clientId": "...",
      "stateCode": "CA",
      "stateName": "California",
      "status": "compliant",
      "thresholdAmount": 500000,
      "currentAmount": 50000,
      "lastUpdated": "2025-12-03T...",
      "client": {
        "id": "...",
        "name": "Client Name",
        "industry": "Technology"
      }
    }
  ]
}
```

### Nexus Alerts
```
GET /api/nexus-alerts?limit=100&organizationId={id}
```

**Response:**
```json
{
  "alerts": [
    {
      "id": "...",
      "clientId": "...",
      "stateCode": "NY",
      "alertType": "threshold_breach",
      "priority": "high",
      "status": "open",
      "title": "...",
      "description": "...",
      "thresholdAmount": 500000,
      "currentAmount": 550000,
      "penaltyRisk": 5000,
      "deadline": "2025-12-15T..."
    }
  ]
}
```

## State Status Determination Flow

```
┌─────────────────────────────────────────┐
│      ClientState from Database          │
│      (status: compliant/warning/        │
│       critical/pending/transit)         │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│   Use Database Status Directly           │
│   (No recalculation from ratio)          │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│   Aggregate Multiple Clients             │
│   (If same state has multiple clients)   │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│   Apply Aggregation Rules                │
│   - All compliant → compliant            │
│   - 1 critical + rest approaching →     │
│     warning                              │
│   - Multiple critical → critical         │
│   - Has warnings → warning               │
│   - Has pending → pending                │
│   - Has transit → transit                │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│   Process Alerts (Count Only)            │
│   - Don't override status                │
│   - Only count for metrics               │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│   Final Status Validation                │
│   - Ensure status matches client states  │
│   - Apply special cases                  │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│   Render on Map                          │
│   - Color by status                      │
│   - Show in client cards                 │
│   - Display in alerts                    │
└─────────────────────────────────────────┘
```

## Key Differences: Managing Partner vs Tax Manager

| Feature | Managing Partner | Tax Manager |
|---------|-----------------|-------------|
| **Personalized Mode** | ✅ Supported | ❌ Not supported |
| **Add Monitoring** | ✅ Button available | ❌ Not available |
| **AI Scanning** | ❌ Not shown | ✅ Visual indicator |
| **Notifications** | Basic | Enhanced with carousel |
| **Client Status Calc** | From DB status | From revenue ratio |
| **Focus** | Strategic overview | Operational management |
| **Data Source** | Organization-wide or personalized | Organization-wide only |

## Common Components

### EnhancedUSMap
- Reusable map component
- Accepts `nexusData` prop
- Handles click/hover events
- Customizable state styling

### Client Cards
- Consistent design across roles
- Status-based styling
- Interactive hover effects
- Click to view details

### Status Overview
- Collapsible dropdown
- Color-coded counts
- Real-time updates
- Filter integration

## US Map Data Visualization

### Map Component Overview

The US Map visualization uses the `@mirawision/usa-map-react` library to display nexus compliance data across all 50 US states. The map provides real-time visual feedback on client nexus status through color-coding and interactive features.

### Data Structure

#### Input Data Sources

The map receives data from two primary sources:

1. **Client States** (`clientStatesData.clientStates`)
   - Array of `ClientState` records from the database
   - Each record contains:
     - `clientId`: Unique client identifier
     - `stateCode`: Two-letter state abbreviation (e.g., "CA", "NY")
     - `stateName`: Full state name
     - `status`: Current nexus status (`compliant`, `warning`, `critical`, `pending`, `transit`)
     - `thresholdAmount`: Nexus threshold for the state
     - `currentAmount`: Current revenue in the state
     - `lastUpdated`: Timestamp of last update
     - `client`: Related client object with name, industry, etc.

2. **Nexus Alerts** (`nexusAlertsData.alerts`)
   - Array of `NexusAlert` records
   - Each alert contains:
     - `clientId`: Client the alert belongs to
     - `stateCode`: State where the alert is active
     - `alertType`: Type of alert (`threshold_breach`, `threshold_approaching`, `compliance_confirmed`)
     - `priority`: Alert priority (`high`, `medium`, `low`)
     - `status`: Alert status (`open`, `acknowledged`, `resolved`)
     - `thresholdAmount`: Threshold that triggered the alert
     - `currentAmount`: Revenue amount at alert time
     - `penaltyRisk`: Estimated penalty risk amount

#### Processed Data Structure (`nexusData`)

The raw data is processed into a state-level aggregation object:

```typescript
interface NexusStateData {
  status: 'compliant' | 'warning' | 'critical' | 'pending' | 'transit';
  revenue: number;                    // Total revenue across all clients
  clients: number;                    // Number of clients in this state
  alerts: number;                     // Total alert count
  companies: string[];                // Array of client names
  thresholdProgress: number;           // Percentage (0-100) of threshold reached
  riskScore: number;                   // Calculated risk score (0-100)
  lastUpdated: string;                // ISO timestamp
  hasData: boolean;                    // Flag indicating if state has client data
  clientStatuses: string[];            // Array of individual client statuses
}
```

### Data Processing Flow

```
┌─────────────────────────────────────────┐
│   Raw Client States from API            │
│   - Multiple clients per state          │
│   - Individual status per client        │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│   State-Level Aggregation                │
│   - Group by stateCode                   │
│   - Sum revenue                          │
│   - Count clients                        │
│   - Track individual statuses            │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│   Alert Processing                       │
│   - Count alerts per state               │
│   - Apply alert-based status upgrades    │
│   - Preserve compliant status            │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│   Multi-Client Status Aggregation         │
│   - Apply priority rules                 │
│   - Handle special cases                 │
│   - Determine final state status         │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│   Map Configuration (customStates)       │
│   - Color assignment                     │
│   - Stroke styling                       │
│   - Event handlers                       │
│   - Data attributes                      │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│   USAMap Component Rendering              │
│   - Visual state representation          │
│   - Interactive features                 │
│   - Tooltips and labels                  │
└─────────────────────────────────────────┘
```

### State Aggregation Logic

#### Single Client State

When a state has only one client:
- Status = Client's status from database
- Revenue = Client's `currentAmount`
- Clients = 1
- Alerts = Count of alerts for that client in that state

#### Multiple Client State

When a state has multiple clients, status is determined by priority:

```javascript
// Priority order: critical > warning > pending > transit > compliant

if (allClientsCompliant) {
  status = 'compliant';
} else if (criticalCount === 1 && approachingCount === (totalClients - 1)) {
  status = 'warning'; // Special case: 1 critical + rest approaching
} else if (criticalCount > 1) {
  status = 'critical'; // Multiple critical clients
} else if (warningCount > 0 && criticalCount === 0) {
  status = 'warning'; // Has warnings, no critical
} else if (pendingCount > 0 && criticalCount === 0 && warningCount === 0) {
  status = 'pending'; // Has pending, no critical/warning
} else if (transitCount > 0 && criticalCount === 0 && warningCount === 0 && pendingCount === 0) {
  status = 'transit'; // Has transit, no critical/warning/pending
}
```

#### Revenue Aggregation

```javascript
// Sum all client revenues in the state
stateData[stateCode].revenue = sum(clientStates.map(cs => cs.currentAmount));

// Calculate threshold progress using average ratio
const avgRatio = totalRevenue / (threshold * clientCount);
thresholdProgress = Math.min(100, Math.round(avgRatio * 100));
```

#### Alert Counting

```javascript
// Count all alerts for the state (including compliant alerts)
stateData[stateCode].alerts = alerts.filter(
  alert => alert.stateCode === stateCode
).length;
```

### Color Coding System

#### Status-to-Color Mapping

| Status | Fill Color | Stroke Color | Hex Codes |
|--------|-----------|--------------|-----------|
| **Critical** | `#ef4444` | `#dc2626` | Red |
| **Warning** | `#f59e0b` | `#d97706` | Orange/Amber |
| **Pending** | `#3b82f6` | `#2563eb` | Blue |
| **Transit** | `#06b6d4` | `#0891b2` | Cyan |
| **Compliant** | `#10b981` | `#059669` | Green |
| **No Data** | `#374151` | `#6b7280` | Grey |

#### Visual States

**Normal State:**
- Fill: Status-based color
- Stroke: Matching darker shade
- Stroke Width: 2px
- Opacity: 100%

**Focused State** (when clicked or selected):
- Fill: Status-based color (unchanged)
- Stroke: `#60a5fa` (Blue)
- Stroke Width: 4px
- Visual Effect: Blue glow/border

**Partially Visible State** (when another state is focused):
- Fill: `#4b5563` (Lighter grey)
- Stroke: `#6b7280` (Grey)
- Stroke Width: 2px
- Opacity: Reduced (visual dimming)

**Hovered State:**
- Opacity: 80%
- Cursor: Pointer
- Tooltip: Displayed with state data

### Map Configuration (`customStates`)

Each state receives a configuration object:

```typescript
{
  fill: string,                    // Fill color based on status
  stroke: string,                 // Stroke color
  strokeWidth: number,            // 1, 2, or 4 (focused)
  onClick: () => void,            // Click handler
  onHover: (event) => void,       // Hover handler
  onLeave: () => void,            // Leave handler
  label: {                        // Label configuration
    enabled: boolean,
    render: (abbr) => JSX.Element
  },
  // Data attributes (for integration/testing)
  'data-state': string,           // State code
  'data-status': string,          // Status value
  'data-revenue': number,         // Revenue amount
  'data-clients': number,         // Client count
  'data-alerts': number,          // Alert count
  'data-threshold-progress': number, // Progress percentage
  'data-risk-score': number      // Risk score
}
```

### State Labels

**Label Configuration:**
- **Font**: Bold, 14px
- **Color**: White (`#ffffff`)
- **Stroke**: Black, 0.5px width
- **Position**: Centered on state
- **Text**: Two-letter state abbreviation (e.g., "CA", "NY")
- **Rendering**: SVG `<text>` element with stroke for visibility

**Label Styling:**
```javascript
<text 
  fontSize="14" 
  fill="white" 
  fontWeight="bold"
  textAnchor="middle"
  dominantBaseline="middle"
  stroke="black"
  strokeWidth="0.5"
  paintOrder="stroke fill"
>
  {stateAbbr}
</text>
```

### Interactive Features

#### Click Interaction

**Behavior:**
- Click state → Focus state (highlight with blue border)
- Click same state again → Clear focus
- Click different state → Switch focus

**Focus Effects:**
- Blue border (4px stroke width)
- Client list filters to show only clients in focused state
- Right pane shows state-specific details
- Other states become partially visible (dimmed)

**Implementation:**
```javascript
handleMapStateClick(stateCode) {
  if (mapFocusState === stateCode) {
    setMapFocusState(null);  // Clear focus
    setSelectedState(null);
  } else {
    setMapFocusState(stateCode);  // Set focus
    setSelectedState(stateCode);
  }
}
```

#### Hover Interaction

**Behavior:**
- Hover over state with data → Show tooltip
- Hover over state without data → No tooltip
- Move mouse → Tooltip follows cursor
- Leave state → Hide tooltip

**Tooltip Content:**
- State code and name
- Status (color-coded)
- Revenue (formatted currency)
- Client count
- Alert count
- Threshold progress percentage

**Tooltip Styling:**
- Background: Dark grey with blur (`bg-gray-900/95 backdrop-blur-sm`)
- Border: White border with opacity
- Position: Follows mouse cursor
- Z-index: 20 (above map)

**Implementation:**
```javascript
handleMapStateHover(stateCode, event) {
  const stateData = nexusData[stateCode];
  if (stateData && stateData.hasData) {
    setHoveredState(stateCode);
    if (event) {
      setTooltipPosition({ 
        x: event.clientX, 
        y: event.clientY 
      });
    }
  }
}
```

### Data Points Displayed

#### On Map (Visual)

1. **State Color**: Status-based fill color
2. **State Border**: Status-based stroke color
3. **State Label**: Two-letter abbreviation
4. **Focus Indicator**: Blue border when selected
5. **Dimming**: Grey overlay when another state is focused

#### In Tooltip (Hover)

1. **State Name**: Full state name (e.g., "California")
2. **State Code**: Two-letter abbreviation (e.g., "CA")
3. **Status**: Current nexus status (color-coded text)
4. **Revenue**: Total revenue formatted as currency
5. **Clients**: Number of clients in the state
6. **Alerts**: Total number of alerts
7. **Progress**: Threshold progress percentage

#### In State Details Panel (Click)

1. **State Information**:
   - State code and name
   - Current status badge
   - Last updated timestamp

2. **Metrics**:
   - Total revenue
   - Client count
   - Alert count
   - Threshold progress
   - Risk score

3. **Client List**:
   - Client names in the state
   - Individual client statuses
   - Client revenue amounts

4. **Alerts**:
   - Alert details
   - Alert priorities
   - Alert types

### Threshold Progress Calculation

**Formula:**
```javascript
// For single client
thresholdProgress = (currentAmount / thresholdAmount) * 100

// For multiple clients (average ratio)
const avgRatio = totalRevenue / (thresholdAmount * clientCount);
thresholdProgress = Math.min(100, Math.round(avgRatio * 100));
```

**Display:**
- Percentage: 0-100%
- Capped at 100% (even if exceeded)
- Rounded to nearest integer
- Shown in tooltip and details panel

### Risk Score Calculation

**Formula:**
```javascript
riskScore = Math.round((currentAmount / thresholdAmount) * 100);
```

**Usage:**
- Same calculation as threshold progress
- Used for risk assessment
- Displayed in state details
- Can be used for sorting/filtering

### States Without Data

**Visual Representation:**
- Fill: `#374151` (Dark grey)
- Stroke: `#6b7280` (Grey)
- Stroke Width: 1px
- Label: Still shows state abbreviation
- Tooltip: Not displayed on hover
- Click: Still interactive (can focus state)

**Purpose:**
- Indicates no client activity in the state
- Helps identify expansion opportunities
- Maintains map completeness

### Map Legend

**Location:** Bottom-left corner of map

**Content:**
- Color swatches for each status
- Status labels
- "No Activity" indicator

**Styling:**
- Background: Dark with blur (`bg-black/80 backdrop-blur-sm`)
- Border: White border with opacity
- Text: White, small font
- Layout: Vertical list

### Data Attributes

Each state element includes data attributes for integration:

```html
<path
  data-state="CA"
  data-status="critical"
  data-revenue="2400000"
  data-clients="5"
  data-alerts="3"
  data-threshold-progress="120"
  data-risk-score="120"
/>
```

**Use Cases:**
- Testing and automation
- Analytics tracking
- External integrations
- Accessibility features

### Performance Optimizations

#### Memoization

**`nexusData` useMemo:**
- Dependencies: `clientStatesData`, `nexusAlertsData`, loading states
- Recalculates only when source data changes
- Prevents unnecessary re-renders

**`customStates` useMemo:**
- Dependencies: `mapFocusState`, `nexusData`, `handleMapStateClick`, `selectedState`
- Recalculates map configuration only when needed
- Optimizes map rendering

#### State Management

- Uses React state for UI interactions
- Callbacks memoized with `useCallback`
- Prevents unnecessary function recreations

### Map Library Integration

**Library:** `@mirawision/usa-map-react`

**Component:** `<USAMap />`

**Props:**
- `customStates`: State configuration object
- `hiddenStates`: Array of states to hide (e.g., `['AK', 'HI']`)
- `mapSettings`: Map dimensions and settings
- `className`: CSS classes
- `defaultState`: Default state styling

**Features:**
- SVG-based rendering
- Responsive design
- Customizable styling
- Event handling support

### Special Cases

#### Alaska and Hawaii

- **Hidden by Default**: Not shown on main map (too far from mainland)
- **Can be Enabled**: Can be shown if needed
- **Styling**: Same color system as other states
- **Data**: Processed same as other states

#### Focus State Dimming

When a state is focused:
- **Focused State**: Full color, blue border
- **Other States**: Dimmed to grey (`#4b5563`)
- **Purpose**: Visual emphasis on selected state
- **Clear**: Click same state or close details panel

#### Multi-Client Status Priority

Special handling for states with multiple clients:
- **1 Critical + Rest Approaching**: Shows as `warning` (not `critical`)
- **All Compliant**: Shows as `compliant`
- **Multiple Critical**: Shows as `critical`
- **Mixed Statuses**: Uses priority system

### Debugging and Logging

**Console Logs:**
```javascript
console.log('🗺️ Map color distribution:', {
  red: criticalStates,
  orange: warningStates,
  blue: pendingStates,
  cyan: transitStates,
  green: compliantStates,
  grey: noDataStates
});
```

**Data Logging:**
- Total states with clients
- States by status type
- Sample state data
- Color distribution statistics

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live data
2. **Advanced Filtering**: Multi-criteria filters
3. **Export Functionality**: PDF/Excel reports
4. **Historical Trends**: Time-series charts
5. **Bulk Actions**: Multi-select operations
6. **Custom Views**: Saveable filter presets
7. **Mobile App**: Native mobile experience
8. **Offline Mode**: Cached data access

## Troubleshooting

### Common Issues

**All States Show as Critical:**
- Check status determination logic
- Verify database statuses are correct
- Ensure thresholdProgress calculation uses average ratio

**States Not Appearing:**
- Verify API data is loading
- Check organizationId is correct
- Ensure client states exist in database

**Map Not Interactive:**
- Check map component is mounted
- Verify event handlers are attached
- Check for JavaScript errors in console

**Status Colors Wrong:**
- Verify status values match expected strings
- Check color mapping in customStates
- Ensure status aggregation logic is correct

## Best Practices

1. **Always use database status** as source of truth
2. **Don't override status** based on alerts alone
3. **Calculate threshold progress** using average ratio for multi-client states
4. **Memoize expensive calculations** to prevent re-renders
5. **Handle loading states** gracefully
6. **Provide error feedback** when API calls fail
7. **Optimize map rendering** with proper memoization
8. **Test with various data distributions** to ensure correct status display

