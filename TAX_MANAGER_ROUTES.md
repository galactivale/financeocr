# Tax Manager Routes Documentation

## Overview
The Tax Manager module provides comprehensive tools for managing client nexus compliance portfolios, risk assessment, threshold monitoring, and professional decision oversight. This documentation covers all available routes and their functionality.

## Base Route
- **Path**: `/dashboard/tax-manager`
- **Component**: `app/dashboard/tax-manager/page.tsx`
- **Description**: Main dashboard with overview cards, US states map, and quick access to key metrics

### Features
- **Active Alerts Card**: Shows count of active alerts with daily changes
- **Threshold Monitoring Card**: Displays clients approaching nexus thresholds
- **Professional Decisions Card**: Tracks documented professional decisions
- **US States Map**: Interactive map showing client distribution and nexus status
- **Recent Activity Table**: Latest alerts, decisions, and client updates
- **Quick Actions**: Direct links to key functions

---

## Core Routes

### 1. Alerts Management
- **Path**: `/dashboard/tax-manager/alerts`
- **Component**: `app/dashboard/tax-manager/alerts/page.tsx`
- **Description**: Central hub for managing nexus compliance alerts

#### Features
- **Full-Screen Alert Table**: Comprehensive view of all alerts
- **Sliding Panel**: 50% screen width panel for detailed alert information
- **Alert Categories**:
  - Threshold Exceeded
  - Registration Required
  - Documentation Needed
  - Review Overdue
- **Filtering Options**:
  - Priority (High, Medium, Low)
  - Status (New, In Progress, Resolved)
  - Client
  - State
- **Actions Available**:
  - Document Decision
  - Schedule Review
  - Escalate to Partner
  - Mark as Resolved

#### Alert Data Structure
```typescript
interface Alert {
  id: string;
  client: string;
  state: string;
  issue: string;
  currentAmount: string;
  threshold: string;
  deadline: string;
  penaltyRisk: string;
  priority: 'high' | 'medium' | 'low';
  status: 'new' | 'in-progress' | 'resolved';
  actions: string[];
}
```

---

### 2. Client Portfolio Management
- **Path**: `/dashboard/tax-manager/clients`
- **Component**: `app/dashboard/tax-manager/clients/page.tsx`
- **Description**: Comprehensive client portfolio management with risk assessment

#### Features
- **Client Portfolio Overview**: Summary statistics and metrics
- **Dual View Modes**:
  - **Grid View**: Risk-based client cards
  - **List View**: Detailed table format
- **Risk-Based Organization**: Clients sorted by penalty exposure
- **Client Risk Cards**: Visual indicators for immediate attention
- **Individual Client Detail View**: Sliding panel with complete client profile
- **Search and Filtering**: By risk level, industry, and compliance status

#### Client Data Structure
```typescript
interface Client {
  id: string;
  name: string;
  industry: string;
  revenue: string;
  riskLevel: 'critical' | 'high' | 'warning' | 'low';
  totalExposure: string;
  assignedSince: string;
  lastReview: string;
  nextReview: string;
  activeAlerts: number;
  states: StateStatus[];
}
```

#### Key Features
- **Multi-State Status Tracking**: Individual state compliance status
- **Professional Decision History**: Chronological decision documentation
- **Current Action Items**: Task management and deadlines
- **Client Communication Hub**: Advisory scheduling and documentation

---

### 3. Reports Generation
- **Path**: `/dashboard/tax-manager/reports`
- **Component**: `app/dashboard/tax-manager/reports/page.tsx`
- **Description**: Professional documentation center for compliance reports and client advisories

#### Features
- **Reports Dashboard Header**: Statistics and quick actions
- **Report Categories**:
  - Client Compliance Reports
  - Regulatory Analysis
  - Professional Audit Packages
  - Portfolio Summary
  - State Updates
  - Custom Reports

#### Report Types

##### Client Compliance Reports
- Multi-state nexus status summary
- Current threshold analysis
- Active alerts and recommendations
- Professional decisions documented
- Regulatory compliance timeline
- Next review schedule

##### Professional Audit Package
- Complete audit trail documentation
- Professional decisions chronology
- Supporting documentation
- Regulatory references
- Professional certifications
- Court defensibility verification

##### Portfolio Analytics Report
- Risk distribution analysis
- State-by-state breakdown
- Performance metrics
- Penalties prevented tracking
- Client satisfaction scores

#### Report Data Structure
```typescript
interface Report {
  id: string;
  title: string;
  type: 'client-compliance' | 'regulatory-analysis' | 'professional-audit' | 'portfolio-summary' | 'state-updates' | 'custom';
  client?: string;
  date: string;
  format: 'PDF' | 'Excel' | 'PowerPoint';
  size: string;
  status: 'generated' | 'scheduled' | 'in-progress';
}
```

---

## Planned Routes (Not Yet Implemented)

### 4. Advisory Services
- **Path**: `/dashboard/tax-manager/advisory`
- **Status**: Planned
- **Description**: Client advisory services and consultation management

#### Planned Features
- Advisory call scheduling
- Client consultation documentation
- Professional recommendation tracking
- Advisory service templates

---

### 5. Nexus Monitoring
- **Path**: `/dashboard/tax-manager/nexus-monitoring`
- **Status**: Planned
- **Description**: Real-time nexus threshold monitoring and alerts

#### Planned Features
- Real-time threshold tracking
- Automated alert generation
- State-specific monitoring
- Historical trend analysis

---

### 6. Notifications Center
- **Path**: `/dashboard/tax-manager/notifications`
- **Status**: Planned
- **Description**: Centralized notification management

#### Planned Features
- Alert notifications
- System notifications
- Email notifications
- Notification preferences

---

### 7. Professional Liability
- **Path**: `/dashboard/tax-manager/professional-liability`
- **Status**: Planned
- **Description**: Professional liability protection and documentation

#### Planned Features
- Liability assessment
- Documentation requirements
- Risk mitigation strategies
- Professional standards compliance

---

### 8. Profile Management
- **Path**: `/dashboard/tax-manager/profile`
- **Status**: Planned
- **Description**: Tax manager profile and settings

#### Planned Features
- Personal information
- Professional credentials
- Contact preferences
- Security settings

---

### 9. Regulatory Updates
- **Path**: `/dashboard/tax-manager/regulatory`
- **Status**: Planned
- **Description**: Regulatory change tracking and impact analysis

#### Planned Features
- Regulatory change notifications
- Impact analysis
- Compliance updates
- State-specific regulations

---

### 10. Settings
- **Path**: `/dashboard/tax-manager/settings`
- **Status**: Planned
- **Description**: System configuration and preferences

#### Planned Features
- Alert preferences
- Notification settings
- Report templates
- System configuration

---

### 11. Task Management
- **Path**: `/dashboard/tax-manager/task-management`
- **Status**: Planned
- **Description**: Task and workflow management

#### Planned Features
- Task assignment
- Workflow automation
- Deadline tracking
- Progress monitoring

---

## Technical Implementation

### Framework
- **Next.js 15.5.4**: App Router with TypeScript
- **React 19**: Latest React features and compatibility
- **NextUI 2.6.11**: Modern UI component library
- **Tailwind CSS**: Utility-first styling

### Key Components
- **USStatesMap**: Custom React 19 compatible US map component
- **Dynamic Sidebar**: Context-aware navigation
- **Table Components**: Reusable data tables
- **Card Components**: Information display cards

### State Management
- **useState**: Local component state
- **useEffect**: Side effects and lifecycle management
- **useRef**: DOM references and imperative operations

### Styling
- **Dark Mode Support**: System and manual theme switching
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliant components

---

## Navigation Structure

```
/dashboard/tax-manager/
├── / (Dashboard Overview)
├── /alerts (Alert Management)
├── /clients (Client Portfolio)
├── /reports (Reports Generation)
├── /advisory (Planned)
├── /nexus-monitoring (Planned)
├── /notifications (Planned)
├── /professional-liability (Planned)
├── /profile (Planned)
├── /regulatory (Planned)
├── /settings (Planned)
└── /task-management (Planned)
```

---

## Data Flow

1. **Dashboard**: Aggregates data from all modules
2. **Alerts**: Real-time threshold monitoring and alert generation
3. **Clients**: Portfolio management and risk assessment
4. **Reports**: Professional documentation and compliance reporting
5. **Planned Modules**: Will integrate with existing data flow

---

## Security Considerations

- **Role-Based Access**: Tax manager specific permissions
- **Data Encryption**: Sensitive client data protection
- **Audit Trail**: Complete action logging
- **Professional Standards**: AICPA compliance requirements

---

## Performance Optimizations

- **Dynamic Imports**: Lazy loading of heavy components
- **Client-Side Rendering**: Interactive components
- **Efficient State Management**: Minimal re-renders
- **Optimized Images**: WebP format and lazy loading

---

## Future Enhancements

1. **Real-time Collaboration**: Multi-user editing capabilities
2. **Advanced Analytics**: Machine learning insights
3. **Mobile App**: Native mobile application
4. **API Integration**: Third-party service connections
5. **Automation**: Workflow automation and AI assistance

---

*Last Updated: January 2025*
*Version: 1.0.0*

