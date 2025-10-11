# Nexus Monitoring Setup Wizard

## Overview
The Nexus Monitoring Setup Wizard is a comprehensive tool that allows managing partners to set up nexus monitoring for their clients across multiple states. This wizard provides a step-by-step process to configure economic nexus thresholds, current revenue amounts, and monitoring parameters.

## Features

### 1. **Client Selection**
- **Search Functionality**: Real-time search through all active clients
- **Client Information Display**: Shows client name, legal name, industry, and status
- **Visual Selection**: Clean, modern interface for client selection
- **Validation**: Ensures only active clients can be selected

### 2. **State Selection**
- **Comprehensive State Coverage**: 20 major US states with economic nexus requirements
- **State Information**: Each state shows threshold amounts and descriptions
- **Multi-State Selection**: Select multiple states for comprehensive monitoring
- **Visual Feedback**: Clear indication of selected states with checkmarks

### 3. **Monitoring Configuration**
- **Threshold Management**: Set and modify economic nexus thresholds per state
- **Current Revenue Tracking**: Input current revenue amounts for each state
- **Priority Levels**: Set monitoring priority (Low, Medium, High, Critical)
- **Progress Visualization**: Real-time progress bars showing threshold proximity
- **Notes System**: Add specific notes for each state's monitoring setup

## Technical Implementation

### Frontend Architecture

#### **Main Components**
- **`/dashboard/managing-partner/monitoring/add/page.tsx`**: Main wizard interface
- **Step-based Navigation**: 3-step process with progress indicators
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Validation**: Immediate feedback on form inputs

#### **State Management**
```typescript
interface MonitoringData {
  [stateCode: string]: {
    thresholdAmount: number;
    currentAmount: number;
    notes: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
  }
}
```

#### **API Integration**
- **Client Fetching**: Retrieves all active clients from the database
- **State Information**: Hardcoded state data with economic nexus thresholds
- **Real-time Updates**: Immediate API calls for data persistence

### Backend Architecture

#### **API Endpoints**

##### **Client States Management**
```javascript
POST /api/nexus/client-states
- Creates new client state monitoring record
- Validates against existing records
- Includes client relationship data

PATCH /api/nexus/client-states/:id
- Updates existing client state
- Supports partial updates
- Maintains audit trail

DELETE /api/nexus/client-states/:id
- Removes client state monitoring
- Cascades to related alerts
```

##### **Nexus Alerts Management**
```javascript
POST /api/nexus/alerts
- Creates threshold breach alerts
- Automatic alert generation when thresholds exceeded
- Configurable priority and assignment

PATCH /api/nexus/alerts/:id
- Updates alert status and details
- Supports workflow management
- Maintains update timestamps

DELETE /api/nexus/alerts/:id
- Removes alerts from system
- Maintains data integrity
```

#### **Database Schema Integration**
- **ClientState Table**: Stores monitoring configuration per client/state
- **NexusAlert Table**: Manages threshold breach notifications
- **Audit Trail**: Complete tracking of all monitoring setup activities

## User Experience Flow

### **Step 1: Client Selection**
1. User navigates to `/dashboard/managing-partner/monitoring/add`
2. System displays all active clients with search functionality
3. User searches and selects target client
4. System validates client selection and proceeds to Step 2

### **Step 2: State Selection**
1. System displays 20 major US states with economic nexus requirements
2. User selects multiple states for monitoring setup
3. System shows selected count and enables "Next" button
4. User proceeds to Step 3 with selected states

### **Step 3: Monitoring Configuration**
1. System displays configuration form for each selected state
2. User sets threshold amounts, current revenue, and priority levels
3. System shows real-time progress indicators and warnings
4. User adds notes and submits configuration
5. System creates client states and alerts, redirects to monitoring dashboard

## State Information

### **Economic Nexus Thresholds**
| State | Code | Threshold | Description |
|-------|------|-----------|-------------|
| California | CA | $500,000 | Economic nexus threshold: $500,000 in sales |
| New York | NY | $500,000 | Economic nexus threshold: $500,000 in sales |
| Texas | TX | $500,000 | Economic nexus threshold: $500,000 in sales |
| Florida | FL | $100,000 | Economic nexus threshold: $100,000 in sales |
| Illinois | IL | $100,000 | Economic nexus threshold: $100,000 in sales |
| Pennsylvania | PA | $100,000 | Economic nexus threshold: $100,000 in sales |
| Ohio | OH | $100,000 | Economic nexus threshold: $100,000 in sales |
| Georgia | GA | $100,000 | Economic nexus threshold: $100,000 in sales |
| North Carolina | NC | $100,000 | Economic nexus threshold: $100,000 in sales |
| Michigan | MI | $100,000 | Economic nexus threshold: $100,000 in sales |
| New Jersey | NJ | $100,000 | Economic nexus threshold: $100,000 in sales |
| Virginia | VA | $100,000 | Economic nexus threshold: $100,000 in sales |
| Washington | WA | $100,000 | Economic nexus threshold: $100,000 in sales |
| Arizona | AZ | $100,000 | Economic nexus threshold: $100,000 in sales |
| Massachusetts | MA | $100,000 | Economic nexus threshold: $100,000 in sales |
| Tennessee | TN | $100,000 | Economic nexus threshold: $100,000 in sales |
| Indiana | IN | $100,000 | Economic nexus threshold: $100,000 in sales |
| Missouri | MO | $100,000 | Economic nexus threshold: $100,000 in sales |
| Maryland | MD | $100,000 | Economic nexus threshold: $100,000 in sales |
| Wisconsin | WI | $100,000 | Economic nexus threshold: $100,000 in sales |

## Progress Indicators

### **Threshold Progress Visualization**
- **Green (0-79%)**: Below threshold - no action needed
- **Orange (80-99%)**: Approaching threshold - monitor closely
- **Red (100%+)**: Threshold exceeded - registration required

### **Priority Levels**
- **Low**: Standard monitoring, quarterly reviews
- **Medium**: Monthly monitoring, regular updates
- **High**: Weekly monitoring, immediate attention
- **Critical**: Daily monitoring, immediate action required

## Error Handling

### **Frontend Validation**
- **Required Fields**: Client selection, state selection, threshold amounts
- **Data Types**: Numeric validation for amounts
- **Range Validation**: Reasonable threshold and revenue ranges
- **Duplicate Prevention**: Prevents duplicate state monitoring setup

### **Backend Validation**
- **Database Constraints**: Ensures data integrity
- **Duplicate Detection**: Prevents multiple monitoring records for same client/state
- **Error Responses**: Detailed error messages for troubleshooting
- **Transaction Safety**: Rollback on partial failures

## Integration Points

### **Monitoring Dashboard**
- **Real-time Updates**: New monitoring setups appear immediately
- **Status Indicators**: Visual representation of monitoring status
- **Alert Integration**: Threshold breaches generate alerts automatically

### **Client Management**
- **Client Profiles**: Links to detailed client information
- **Historical Data**: Tracks monitoring setup history
- **Audit Trail**: Complete record of all monitoring activities

### **Reporting System**
- **Compliance Reports**: Generate nexus compliance status reports
- **Threshold Analysis**: Analyze threshold proximity across clients
- **Alert Summaries**: Consolidated alert and notification reports

## Security Features

### **Access Control**
- **Role-based Access**: Only managing partners can access setup wizard
- **Organization Isolation**: Clients and data isolated by organization
- **Session Management**: Secure session handling for all operations

### **Data Protection**
- **Input Sanitization**: All user inputs sanitized and validated
- **SQL Injection Prevention**: Parameterized queries for all database operations
- **XSS Protection**: Output encoding for all user-generated content

## Performance Optimizations

### **Frontend Performance**
- **Lazy Loading**: Client data loaded on demand
- **Debounced Search**: Optimized search with debouncing
- **Efficient Rendering**: Minimal re-renders with proper state management

### **Backend Performance**
- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: Efficient database connection management
- **Caching**: Strategic caching of frequently accessed data

## Future Enhancements

### **Planned Features**
- **Bulk Setup**: Set up monitoring for multiple clients simultaneously
- **Template System**: Save and reuse monitoring configurations
- **Advanced Analytics**: Predictive threshold analysis
- **Integration APIs**: Connect with external tax compliance systems

### **Scalability Considerations**
- **Multi-tenant Architecture**: Support for multiple organizations
- **Microservices**: Break down into smaller, focused services
- **Event-driven Updates**: Real-time updates via WebSocket connections
- **Advanced Caching**: Redis-based caching for improved performance

## Usage Examples

### **Basic Setup**
1. Navigate to monitoring dashboard
2. Click "Add Nexus Monitoring" button
3. Search and select client
4. Choose states to monitor
5. Configure thresholds and amounts
6. Submit and review results

### **Advanced Configuration**
1. Set different priorities for different states
2. Add detailed notes for complex situations
3. Configure custom threshold amounts
4. Set up automated alert assignments
5. Review and approve configuration

This comprehensive nexus monitoring setup wizard provides managing partners with a powerful tool to ensure their clients remain compliant with economic nexus requirements across all relevant states.



