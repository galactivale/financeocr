const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

// Sample data
const sampleOrganizations = [
  {
    id: uuidv4(),
    slug: 'acme-accounting',
    name: 'Acme Accounting',
    legalName: 'Acme Accounting LLP',
    taxId: '12-3456789',
    subscriptionTier: 'professional',
    subscriptionStatus: 'active',
    email: 'admin@acmeaccounting.com',
    phone: '+1-555-0123',
    website: 'https://acmeaccounting.com',
    addressLine1: '123 Business Ave',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'US',
    settings: {
      timezone: 'America/New_York',
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY'
    },
    branding: {
      primaryColor: '#3B82F6',
      logo: 'https://example.com/acme-logo.png'
    },
    features: {
      analytics: true,
      integrations: true,
      multiUser: true,
      apiAccess: true
    }
  },
  {
    id: uuidv4(),
    slug: 'smith-tax-pros',
    name: 'Smith Tax Pros',
    legalName: 'Smith Tax Professionals Inc',
    taxId: '98-7654321',
    subscriptionTier: 'enterprise',
    subscriptionStatus: 'active',
    email: 'info@smithtaxpros.com',
    phone: '+1-555-0456',
    website: 'https://smithtaxpros.com',
    addressLine1: '456 Tax Street',
    city: 'Los Angeles',
    state: 'CA',
    postalCode: '90210',
    country: 'US',
    settings: {
      timezone: 'America/Los_Angeles',
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY'
    },
    branding: {
      primaryColor: '#10B981',
      logo: 'https://example.com/smith-logo.png'
    },
    features: {
      analytics: true,
      integrations: true,
      multiUser: true,
      apiAccess: true,
      whiteLabel: true
    }
  }
];

const sampleUsers = [
  // Acme Accounting Users
  {
    id: uuidv4(),
    organizationId: sampleOrganizations[0].id,
    email: 'john.doe@acmeaccounting.com',
    firstName: 'John',
    lastName: 'Doe',
    displayName: 'John Doe',
    title: 'Managing Partner',
    department: 'Executive',
    cpaLicense: 'CPA-12345',
    cpaState: 'NY',
    cpaExpiration: new Date('2025-12-31'),
    role: 'managing-partner',
    status: 'active'
  },
  {
    id: uuidv4(),
    organizationId: sampleOrganizations[0].id,
    email: 'jane.smith@acmeaccounting.com',
    firstName: 'Jane',
    lastName: 'Smith',
    displayName: 'Jane Smith',
    title: 'Tax Manager',
    department: 'Tax Services',
    cpaLicense: 'CPA-67890',
    cpaState: 'NY',
    cpaExpiration: new Date('2026-06-30'),
    role: 'tax-manager',
    status: 'active'
  },
  {
    id: uuidv4(),
    organizationId: sampleOrganizations[0].id,
    email: 'mike.johnson@acmeaccounting.com',
    firstName: 'Mike',
    lastName: 'Johnson',
    displayName: 'Mike Johnson',
    title: 'Senior Accountant',
    department: 'Client Services',
    role: 'tax-manager',
    status: 'active'
  },
  // Smith Tax Pros Users
  {
    id: uuidv4(),
    organizationId: sampleOrganizations[1].id,
    email: 'sarah.wilson@smithtaxpros.com',
    firstName: 'Sarah',
    lastName: 'Wilson',
    displayName: 'Sarah Wilson',
    title: 'Managing Partner',
    department: 'Executive',
    cpaLicense: 'CPA-11111',
    cpaState: 'CA',
    cpaExpiration: new Date('2025-08-15'),
    role: 'managing-partner',
    status: 'active'
  },
  {
    id: uuidv4(),
    organizationId: sampleOrganizations[1].id,
    email: 'david.brown@smithtaxpros.com',
    firstName: 'David',
    lastName: 'Brown',
    displayName: 'David Brown',
    title: 'Tax Manager',
    department: 'Tax Services',
    cpaLicense: 'CPA-22222',
    cpaState: 'CA',
    cpaExpiration: new Date('2026-03-20'),
    role: 'tax-manager',
    status: 'active'
  }
];

const sampleClients = [
  // Acme Accounting Clients
  {
    id: uuidv4(),
    organizationId: sampleOrganizations[0].id,
    name: 'TechCorp Solutions',
    slug: 'techcorp-saas',
    legalName: 'TechCorp Solutions Inc',
    taxId: '11-1111111',
    industry: 'Technology',
    foundedYear: 2018,
    employeeCount: 150,
    annualRevenue: 2500000,
    riskLevel: 'medium',
    penaltyExposure: 50000,
    qualityScore: 85,
    assignedPartner: sampleUsers[0].id,
    assignedManager: sampleUsers[1].id,
    assignedStaff: [sampleUsers[2].id],
    primaryContactName: 'Alice Johnson',
    primaryContactEmail: 'alice@techcorp.com',
    primaryContactPhone: '+1-555-1000',
    addressLine1: '789 Tech Drive',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94105',
    country: 'US',
    status: 'active',
    tags: ['technology', 'saas', 'enterprise']
  },
  {
    id: uuidv4(),
    organizationId: sampleOrganizations[0].id,
    name: 'RetailMax Stores',
    slug: 'retailmax-stores',
    legalName: 'RetailMax Stores LLC',
    taxId: '22-2222222',
    industry: 'Retail',
    foundedYear: 2015,
    employeeCount: 75,
    annualRevenue: 1200000,
    riskLevel: 'low',
    penaltyExposure: 15000,
    qualityScore: 92,
    assignedPartner: sampleUsers[0].id,
    assignedManager: sampleUsers[1].id,
    assignedStaff: [sampleUsers[2].id],
    primaryContactName: 'Bob Williams',
    primaryContactEmail: 'bob@retailmax.com',
    primaryContactPhone: '+1-555-2000',
    addressLine1: '321 Commerce Blvd',
    city: 'Chicago',
    state: 'IL',
    postalCode: '60601',
    country: 'US',
    status: 'active',
    tags: ['retail', 'ecommerce', 'b2c']
  },
  // Smith Tax Pros Clients
  {
    id: uuidv4(),
    organizationId: sampleOrganizations[1].id,
    name: 'Manufacturing Plus',
    slug: 'manufacturing-plus',
    legalName: 'Manufacturing Plus Corp',
    taxId: '33-3333333',
    industry: 'Manufacturing',
    foundedYear: 2010,
    employeeCount: 200,
    annualRevenue: 5000000,
    riskLevel: 'high',
    penaltyExposure: 125000,
    qualityScore: 78,
    assignedPartner: sampleUsers[3].id,
    assignedManager: sampleUsers[4].id,
    primaryContactName: 'Carol Davis',
    primaryContactEmail: 'carol@manufacturingplus.com',
    primaryContactPhone: '+1-555-3000',
    addressLine1: '555 Industrial Way',
    city: 'Detroit',
    state: 'MI',
    postalCode: '48201',
    country: 'US',
    status: 'active',
    tags: ['manufacturing', 'automotive', 'b2b']
  }
];

const sampleAlerts = [
  {
    id: uuidv4(),
    organizationId: sampleOrganizations[0].id,
    clientId: sampleClients[0].id,
    title: 'Nexus Threshold Exceeded - California',
    description: 'TechCorp Solutions has exceeded the economic nexus threshold in California',
    issue: 'Revenue threshold exceeded by $150,000',
    stateCode: 'CA',
    stateName: 'California',
    currentAmount: 400000,
    thresholdAmount: 250000,
    penaltyRisk: 25000,
    priority: 'high',
    severity: 'high',
    status: 'new',
    type: 'nexus-threshold',
    category: 'compliance',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    assignedTo: sampleUsers[1].id
  },
  {
    id: uuidv4(),
    organizationId: sampleOrganizations[0].id,
    clientId: sampleClients[1].id,
    title: 'Registration Required - Texas',
    description: 'RetailMax Stores needs to register for sales tax in Texas',
    issue: 'Transaction count threshold exceeded',
    stateCode: 'TX',
    stateName: 'Texas',
    currentAmount: 0,
    thresholdAmount: 0,
    penaltyRisk: 5000,
    priority: 'medium',
    severity: 'medium',
    status: 'in-progress',
    type: 'registration',
    category: 'compliance',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    assignedTo: sampleUsers[2].id
  }
];

const sampleTasks = [
  {
    id: uuidv4(),
    organizationId: sampleOrganizations[0].id,
    clientId: sampleClients[0].id,
    title: 'California Nexus Analysis',
    description: 'Complete comprehensive nexus analysis for California operations',
    category: 'nexus-analysis',
    type: 'compliance',
    priority: 'high',
    status: 'in-progress',
    assignedTo: sampleUsers[1].id,
    assignedBy: sampleUsers[0].id,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    estimatedHours: 8,
    progress: 60,
    stateCode: 'CA'
  },
  {
    id: uuidv4(),
    organizationId: sampleOrganizations[0].id,
    clientId: sampleClients[1].id,
    title: 'Texas Registration Process',
    description: 'Complete Texas sales tax registration for RetailMax Stores',
    category: 'registration',
    type: 'compliance',
    priority: 'medium',
    status: 'pending',
    assignedTo: sampleUsers[2].id,
    assignedBy: sampleUsers[1].id,
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    estimatedHours: 4,
    progress: 0,
    stateCode: 'TX'
  }
];

const sampleDocuments = [
  {
    id: uuidv4(),
    organizationId: sampleOrganizations[0].id,
    clientId: sampleClients[0].id,
    name: 'California Nexus Analysis Report',
    description: 'Comprehensive analysis of California economic nexus requirements',
    type: 'nexus-analysis',
    category: 'compliance',
    fileName: 'ca-nexus-analysis-2024.pdf',
    fileSize: 2048576, // 2MB
    fileType: 'application/pdf',
    status: 'review',
    visibility: 'private',
    tags: ['nexus', 'california', 'analysis'],
    uploadedBy: sampleUsers[1].id
  },
  {
    id: uuidv4(),
    organizationId: sampleOrganizations[0].id,
    clientId: sampleClients[1].id,
    name: 'Texas Registration Application',
    description: 'Sales tax registration application for Texas',
    type: 'registration',
    category: 'compliance',
    fileName: 'tx-registration-2024.pdf',
    fileSize: 1024768, // 1MB
    fileType: 'application/pdf',
    status: 'draft',
    visibility: 'private',
    tags: ['registration', 'texas', 'sales-tax'],
    uploadedBy: sampleUsers[2].id
  }
];

const sampleProfessionalDecisions = [
  {
    id: uuidv4(),
    organizationId: sampleOrganizations[0].id,
    clientId: sampleClients[0].id,
    decisionDate: new Date('2024-01-15'),
    decisionType: 'nexus-threshold-analysis',
    decisionSummary: 'Recommended immediate registration in California due to economic nexus threshold exceedance',
    professionalReasoning: 'Client has exceeded both revenue ($400K vs $250K threshold) and transaction count thresholds. Immediate registration required to avoid penalties.',
    riskLevel: 'high',
    financialExposure: 25000,
    status: 'approved',
    decisionMakerId: sampleUsers[0].id,
    peerReviewerId: sampleUsers[1].id
  }
];

const sampleClientStates = [
  {
    id: uuidv4(),
    clientId: sampleClients[0].id,
    organizationId: sampleOrganizations[0].id,
    stateCode: 'CA',
    stateName: 'California',
    status: 'critical',
    registrationRequired: true,
    thresholdAmount: 500000,
    currentAmount: 850000,
    notes: 'Threshold exceeded - registration required'
  },
  {
    id: uuidv4(),
    clientId: sampleClients[1].id,
    organizationId: sampleOrganizations[0].id,
    stateCode: 'TX',
    stateName: 'Texas',
    status: 'warning',
    registrationRequired: false,
    thresholdAmount: 500000,
    currentAmount: 400000,
    notes: 'Approaching threshold'
  }
];

// Seed function
async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data (in reverse order of dependencies)
    console.log('🧹 Clearing existing data...');
    await prisma.auditTrail.deleteMany();
    await prisma.geographicDistribution.deleteMany();
    await prisma.customerDemographics.deleteMany();
    await prisma.revenueBreakdown.deleteMany();
    await prisma.businessLocation.deleteMany();
    await prisma.contact.deleteMany();
    await prisma.businessProfile.deleteMany();
    await prisma.dataProcessing.deleteMany();
    await prisma.communication.deleteMany();
    await prisma.nexusActivity.deleteMany();
    await prisma.nexusAlert.deleteMany();
    await prisma.clientState.deleteMany();
    await prisma.stateTaxInfo.deleteMany();
    await prisma.alertAction.deleteMany();
    await prisma.taskStep.deleteMany();
    await prisma.professionalDecision.deleteMany();
    await prisma.document.deleteMany();
    await prisma.task.deleteMany();
    await prisma.alert.deleteMany();
    await prisma.client.deleteMany();
    await prisma.userSession.deleteMany();
    await prisma.userPermission.deleteMany();
    await prisma.user.deleteMany();
    await prisma.organizationMetadata.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.performanceMetric.deleteMany();
    await prisma.integration.deleteMany();
    await prisma.regulatoryChange.deleteMany();
    await prisma.complianceStandard.deleteMany();
    await prisma.organization.deleteMany();

    // Seed organizations
    console.log('🏢 Seeding organizations...');
    const organizations = [];
    for (const org of sampleOrganizations) {
      const createdOrg = await prisma.organization.create({
        data: org
      });
      organizations.push(createdOrg);
    }

    // Seed users with hashed passwords
    console.log('👥 Seeding users...');
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    for (const user of sampleUsers) {
      await prisma.user.create({
        data: {
          ...user,
          passwordHash: hashedPassword,
          loginCount: Math.floor(Math.random() * 50),
          lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random login within last week
        }
      });
    }

    // Seed user permissions
    console.log('🔐 Seeding user permissions...');
    const permissions = [
      { resource: 'clients', action: 'view' },
      { resource: 'clients', action: 'create' },
      { resource: 'clients', action: 'edit' },
      { resource: 'clients', action: 'delete' },
      { resource: 'alerts', action: 'view' },
      { resource: 'alerts', action: 'create' },
      { resource: 'alerts', action: 'edit' },
      { resource: 'tasks', action: 'view' },
      { resource: 'tasks', action: 'create' },
      { resource: 'tasks', action: 'edit' },
      { resource: 'documents', action: 'view' },
      { resource: 'documents', action: 'create' },
      { resource: 'documents', action: 'edit' },
      { resource: 'analytics', action: 'view' },
      { resource: 'compliance', action: 'view' },
      { resource: 'compliance', action: 'create' },
      { resource: 'compliance', action: 'edit' }
    ];

    for (const user of sampleUsers) {
      for (const permission of permissions) {
        await prisma.userPermission.create({
          data: {
            userId: user.id,
            resource: permission.resource,
            action: permission.action,
            granted: true
          }
        });
      }
    }

    // Seed clients
    console.log('🏢 Seeding clients...');
    const clients = [];
    for (const client of sampleClients) {
      const createdClient = await prisma.client.create({
        data: client
      });
      clients.push(createdClient);
    }

    // Seed client states
    console.log('🗺️ Seeding client states...');
    for (const clientState of sampleClientStates) {
      await prisma.clientState.create({
        data: clientState
      });
    }

    // Seed alerts
    console.log('🚨 Seeding alerts...');
    for (const alert of sampleAlerts) {
      await prisma.alert.create({
        data: alert
      });
    }

    // Seed tasks
    console.log('📋 Seeding tasks...');
    for (const task of sampleTasks) {
      await prisma.task.create({
        data: task
      });
    }

    // Seed task steps
    console.log('📝 Seeding task steps...');
    for (const task of sampleTasks) {
      const steps = [
        {
          taskId: task.id,
          title: 'Initial Research',
          description: 'Research state requirements and thresholds',
          stepOrder: 1,
          estimatedTime: 60
        },
        {
          taskId: task.id,
          title: 'Data Collection',
          description: 'Gather client financial data and transaction records',
          stepOrder: 2,
          estimatedTime: 120
        },
        {
          taskId: task.id,
          title: 'Analysis',
          description: 'Analyze data against state requirements',
          stepOrder: 3,
          estimatedTime: 180
        },
        {
          taskId: task.id,
          title: 'Documentation',
          description: 'Prepare final report and recommendations',
          stepOrder: 4,
          estimatedTime: 90
        }
      ];

      for (const step of steps) {
        await prisma.taskStep.create({
          data: step
        });
      }
    }

    // Seed documents
    console.log('📄 Seeding documents...');
    for (const document of sampleDocuments) {
      await prisma.document.create({
        data: document
      });
    }

    // Seed professional decisions
    console.log('⚖️ Seeding professional decisions...');
    for (const decision of sampleProfessionalDecisions) {
      await prisma.professionalDecision.create({
        data: decision
      });
    }

    // Seed performance metrics
    console.log('📊 Seeding performance metrics...');
    const metrics = [
      { metricType: 'revenue', value: 150000, target: 200000, unit: 'USD' },
      { metricType: 'client_retention', value: 95, target: 90, unit: 'percentage' },
      { metricType: 'task_completion', value: 88, target: 85, unit: 'percentage' },
      { metricType: 'alert_resolution', value: 92, target: 90, unit: 'percentage' }
    ];

    for (const org of sampleOrganizations) {
      for (const metric of metrics) {
        await prisma.performanceMetric.create({
          data: {
            organizationId: org.id,
            metricDate: new Date(),
            ...metric
          }
        });
      }
    }

    // Seed compliance standards
    console.log('📋 Seeding compliance standards...');
    const complianceStandards = [
      {
        organizationId: sampleOrganizations[0].id,
        standardName: 'SSTS No. 1 - State and Local Tax Services',
        standardCode: 'SSTS-1',
        description: 'Standards for state and local tax services',
        category: 'tax',
        status: 'compliant',
        lastReviewDate: new Date('2024-01-01'),
        nextReviewDate: new Date('2025-01-01')
      },
      {
        organizationId: sampleOrganizations[0].id,
        standardName: 'SSTS No. 2 - Nexus Standards',
        standardCode: 'SSTS-2',
        description: 'Standards for nexus determination and analysis',
        category: 'nexus',
        status: 'compliant',
        lastReviewDate: new Date('2024-01-01'),
        nextReviewDate: new Date('2025-01-01')
      }
    ];

    for (const standard of complianceStandards) {
      await prisma.complianceStandard.create({
        data: standard
      });
    }

    // Seed audit logs
    console.log('📝 Seeding audit logs...');
    const auditLogs = [
      {
        organizationId: sampleOrganizations[0].id,
        userId: sampleUsers[0].id,
        action: 'create',
        resourceType: 'client',
        resourceId: sampleClients[0].id,
        details: 'Created new client TechCorp Solutions',
        severity: 'info'
      },
      {
        organizationId: sampleOrganizations[0].id,
        userId: sampleUsers[1].id,
        action: 'create',
        resourceType: 'alert',
        resourceId: sampleAlerts[0].id,
        details: 'Created nexus threshold alert for California',
        severity: 'warning'
      }
    ];

    for (const log of auditLogs) {
      await prisma.auditLog.create({
        data: log
      });
    }

    // Seed state tax information
    console.log('🏛️ Seeding state tax information...');
    const stateTaxInfo = [
      { stateCode: 'CA', stateName: 'California', thresholdAmount: 500000, registrationDeadline: 30, penaltyRate: 0.1 },
      { stateCode: 'TX', stateName: 'Texas', thresholdAmount: 500000, registrationDeadline: 30, penaltyRate: 0.1 },
      { stateCode: 'NY', stateName: 'New York', thresholdAmount: 500000, registrationDeadline: 30, penaltyRate: 0.1 },
      { stateCode: 'FL', stateName: 'Florida', thresholdAmount: 100000, registrationDeadline: 30, penaltyRate: 0.1 },
      { stateCode: 'WA', stateName: 'Washington', thresholdAmount: 100000, registrationDeadline: 30, penaltyRate: 0.1 },
      { stateCode: 'CO', stateName: 'Colorado', thresholdAmount: 100000, registrationDeadline: 30, penaltyRate: 0.1 }
    ];

    for (const state of stateTaxInfo) {
      await prisma.stateTaxInfo.create({
        data: state
      });
    }


    // Seed nexus alerts
    console.log('🚨 Seeding nexus alerts...');
    const nexusAlerts = [
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        stateCode: 'CA',
        alertType: 'threshold_exceeded',
        priority: 'high',
        status: 'open',
        title: 'California Threshold Exceeded',
        description: 'Client has exceeded $500K threshold in California',
        thresholdAmount: 500000,
        currentAmount: 850000,
        penaltyRisk: 50000
      },
      {
        clientId: clients[1].id,
        organizationId: organizations[0].id,
        stateCode: 'TX',
        alertType: 'threshold_approaching',
        priority: 'medium',
        status: 'open',
        title: 'Texas Threshold Approaching',
        description: 'Client approaching $500K threshold in Texas',
        thresholdAmount: 500000,
        currentAmount: 400000,
        penaltyRisk: 25000
      },
      {
        clientId: clients[2].id,
        organizationId: organizations[0].id,
        stateCode: 'NY',
        alertType: 'registration_required',
        priority: 'high',
        status: 'acknowledged',
        title: 'New York Registration Required',
        description: 'Client must register for sales tax in New York',
        thresholdAmount: 500000,
        currentAmount: 600000,
        penaltyRisk: 30000
      }
    ];

    for (const alert of nexusAlerts) {
      await prisma.nexusAlert.create({
        data: alert
      });
    }

    // Seed nexus activities
    console.log('📊 Seeding nexus activities...');
    const nexusActivities = [
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        stateCode: 'CA',
        activityType: 'threshold_exceeded',
        title: 'California Threshold Exceeded',
        description: 'Revenue exceeded $500K threshold',
        amount: 850000,
        thresholdAmount: 500000,
        status: 'completed'
      },
      {
        clientId: clients[1].id,
        organizationId: organizations[0].id,
        stateCode: 'TX',
        activityType: 'data_processed',
        title: 'Texas Sales Data Processed',
        description: 'Q4 sales data processed for Texas',
        amount: 400000,
        status: 'completed'
      },
      {
        clientId: clients[2].id,
        organizationId: organizations[0].id,
        stateCode: 'NY',
        activityType: 'registration_completed',
        title: 'New York Registration Submitted',
        description: 'Sales tax registration submitted to NY',
        status: 'completed'
      }
    ];

    for (const activity of nexusActivities) {
      await prisma.nexusActivity.create({
        data: activity
      });
    }

    // Seed communications
    console.log('💬 Seeding communications...');
    const communications = [
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        alertId: sampleAlerts[0].id,
        type: 'email',
        subject: 'California Nexus Update',
        content: 'We need to discuss the California nexus threshold exceedance and next steps for registration.',
        status: 'sent',
        recipientEmail: 'alice@techcorp.com'
      },
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        alertId: sampleAlerts[0].id,
        type: 'call',
        subject: 'Q4 Review Discussion',
        content: 'Scheduled call to discuss Q4 review and California nexus compliance.',
        status: 'sent',
        recipientPhone: '+1-555-1000'
      },
      {
        clientId: clients[1].id,
        organizationId: organizations[0].id,
        alertId: sampleAlerts[1].id,
        type: 'email',
        subject: 'Texas Registration Status',
        content: 'Update on Texas registration process and required documentation.',
        status: 'sent',
        recipientEmail: 'bob@retailmax.com'
      }
    ];

    for (const comm of communications) {
      await prisma.communication.create({
        data: comm
      });
    }

    // Seed data processing
    console.log('📊 Seeding data processing...');
    const dataProcessing = [
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        fileName: 'Q4_Sales_Data.xlsx',
        fileType: 'excel',
        status: 'processing',
        quality: 95,
        processedAt: new Date()
      },
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        fileName: 'Customer_List.csv',
        fileType: 'csv',
        status: 'validated',
        quality: 98,
        processedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        fileName: 'Transaction_Log.json',
        fileType: 'json',
        status: 'pending',
        quality: null
      },
      {
        clientId: clients[1].id,
        organizationId: organizations[0].id,
        fileName: 'Q4_Retail_Data.xlsx',
        fileType: 'excel',
        status: 'validated',
        quality: 92,
        processedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      }
    ];

    for (const dp of dataProcessing) {
      await prisma.dataProcessing.create({
        data: dp
      });
    }

    // Seed business profiles
    console.log('🏢 Seeding business profiles...');
    const businessProfiles = [
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        legalName: 'TechCorp SaaS Solutions, LLC',
        dbaName: 'TechCorp SaaS',
        entityType: 'Delaware LLC',
        formationDate: new Date('2019-03-15'),
        federalEin: '12-3456789',
        primaryIndustry: 'Software as a Service (SaaS)',
        naicsCode: '541511',
        businessModel: 'B2B Software Subscriptions',
        marketFocus: 'SMB CRM Solutions',
        revenueGrowthYoy: 47.0,
        fundingStage: 'Series A'
      }
    ];

    for (const profile of businessProfiles) {
      await prisma.businessProfile.create({
        data: profile
      });
    }

    // Seed contacts
    console.log('👥 Seeding contacts...');
    const contacts = [
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        name: 'John Smith',
        title: 'Chief Financial Officer',
        email: 'john.smith@techcorpsaas.com',
        phone: '(555) 123-4567 ext. 102',
        mobile: '(555) 987-6543',
        role: 'primary',
        notes: 'Direct Contact: Preferred for nexus compliance matters'
      },
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        name: 'Sarah Johnson',
        title: 'VP Finance',
        email: 'sarah.j@techcorpsaas.com',
        role: 'secondary',
        notes: 'Day-to-day operations and data uploads'
      },
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        name: 'Mike Chen',
        title: 'CEO',
        email: 'mike.chen@techcorpsaas.com',
        role: 'secondary',
        notes: 'Strategic decisions and high-exposure issues'
      },
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        name: 'David Wilson, Esq.',
        title: 'Partner',
        email: 'david.wilson@wilsonassociates.com',
        role: 'legal',
        specialization: 'Multi-state tax compliance',
        notes: 'Wilson & Associates LLP'
      }
    ];

    for (const contact of contacts) {
      await prisma.contact.create({
        data: contact
      });
    }

    // Seed business locations
    console.log('📍 Seeding business locations...');
    const businessLocations = [
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        type: 'headquarters',
        address: '1234 Innovation Drive, Suite 200',
        city: 'San Jose',
        state: 'CA',
        postalCode: '95110',
        propertyType: 'Leased office space',
        employeeCount: 18,
        nexusRelevant: true
      },
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        type: 'remote',
        address: 'Remote',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        employeeCount: 3,
        nexusRelevant: true
      },
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        type: 'remote',
        address: 'Remote',
        city: 'Austin',
        state: 'TX',
        postalCode: '73301',
        employeeCount: 2,
        nexusRelevant: true
      },
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        type: 'remote',
        address: 'Remote',
        city: 'Miami',
        state: 'FL',
        postalCode: '33101',
        employeeCount: 1,
        nexusRelevant: false
      }
    ];

    for (const location of businessLocations) {
      await prisma.businessLocation.create({
        data: location
      });
    }

    // Seed revenue breakdowns
    console.log('💰 Seeding revenue breakdowns...');
    const revenueBreakdowns = [
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        category: 'subscription',
        amount: 1850000,
        percentage: 87.0
      },
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        category: 'services',
        amount: 185000,
        percentage: 9.0
      },
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        category: 'training',
        amount: 65000,
        percentage: 3.0
      },
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        category: 'other',
        amount: 25000,
        percentage: 1.0
      }
    ];

    for (const revenue of revenueBreakdowns) {
      await prisma.revenueBreakdown.create({
        data: revenue
      });
    }

    // Seed customer demographics
    console.log('👥 Seeding customer demographics...');
    const customerDemographics = [
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        totalActiveCustomers: 487,
        averageContractValue: 4362,
        customerRetentionRate: 94.0,
        monthlyRecurringRevenue: 154167
      }
    ];

    for (const demo of customerDemographics) {
      await prisma.customerDemographics.create({
        data: demo
      });
    }

    // Seed geographic distributions
    console.log('🗺️ Seeding geographic distributions...');
    const geographicDistributions = [
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        stateCode: 'CA',
        customerCount: 156,
        percentage: 32.0
      },
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        stateCode: 'NY',
        customerCount: 89,
        percentage: 18.0
      },
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        stateCode: 'TX',
        customerCount: 67,
        percentage: 14.0
      },
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        stateCode: 'FL',
        customerCount: 45,
        percentage: 9.0
      },
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        stateCode: 'OTHER',
        customerCount: 130,
        percentage: 27.0
      }
    ];

    for (const geo of geographicDistributions) {
      await prisma.geographicDistribution.create({
        data: geo
      });
    }

    // Seed audit trails
    console.log('📋 Seeding audit trails...');
    const auditTrails = [
      // TechCorp Solutions audit trails
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        action: 'created',
        entityType: 'client',
        entityId: clients[0].id,
        entityName: 'TechCorp Solutions',
        changeDescription: 'Client profile created and onboarded',
        performedBy: sampleUsers[0].id,
        performedByName: 'John Doe',
        userRole: 'admin',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        performedAt: new Date('2024-01-15T09:00:00Z')
      },
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        action: 'updated',
        entityType: 'business_profile',
        entityId: businessProfiles[0].id,
        entityName: 'TechCorp SaaS Solutions, LLC',
        changeDescription: 'Updated business profile with formation date and EIN',
        performedBy: sampleUsers[1].id,
        performedByName: 'Jane Smith',
        userRole: 'manager',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        performedAt: new Date('2024-01-20T14:30:00Z')
      },
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        action: 'created',
        entityType: 'contact',
        entityId: contacts[0].id,
        entityName: 'John Smith - CFO',
        changeDescription: 'Added primary contact information',
        performedBy: sampleUsers[1].id,
        performedByName: 'Jane Smith',
        userRole: 'manager',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        performedAt: new Date('2024-01-22T10:15:00Z')
      },
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        action: 'created',
        entityType: 'business_location',
        entityId: businessLocations[0].id,
        entityName: 'San Jose Headquarters',
        changeDescription: 'Added headquarters location information',
        performedBy: sampleUsers[2].id,
        performedByName: 'Bob Brown',
        userRole: 'staff',
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        performedAt: new Date('2024-01-25T16:45:00Z')
      },
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        action: 'updated',
        entityType: 'revenue_breakdown',
        entityId: revenueBreakdowns[0].id,
        entityName: 'Subscription Revenue',
        changeDescription: 'Updated subscription revenue from $1.5M to $1.85M',
        performedBy: sampleUsers[1].id,
        performedByName: 'Jane Smith',
        userRole: 'manager',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        performedAt: new Date('2024-02-01T11:20:00Z')
      },
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        action: 'viewed',
        entityType: 'client',
        entityId: clients[0].id,
        entityName: 'TechCorp Solutions',
        changeDescription: 'Client profile viewed for quarterly review',
        performedBy: sampleUsers[0].id,
        performedByName: 'John Doe',
        userRole: 'admin',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        performedAt: new Date('2024-02-15T09:30:00Z')
      },
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        action: 'created',
        entityType: 'nexus_alert',
        entityId: 'nexus-alert-1',
        entityName: 'California Threshold Exceeded',
        changeDescription: 'System generated alert for California nexus threshold exceedance',
        performedBy: 'system',
        performedByName: 'System',
        userRole: 'system',
        ipAddress: '127.0.0.1',
        userAgent: 'System Generated',
        performedAt: new Date('2024-02-20T08:00:00Z')
      },
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        action: 'exported',
        entityType: 'client',
        entityId: clients[0].id,
        entityName: 'TechCorp Solutions',
        changeDescription: 'Client data exported for compliance review',
        performedBy: sampleUsers[1].id,
        performedByName: 'Jane Smith',
        userRole: 'manager',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        performedAt: new Date('2024-02-25T15:45:00Z')
      },
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        action: 'updated',
        entityType: 'contact',
        entityId: contacts[1].id,
        entityName: 'Sarah Johnson - VP Finance',
        changeDescription: 'Updated secondary contact email address',
        performedBy: sampleUsers[2].id,
        performedByName: 'Bob Brown',
        userRole: 'staff',
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        performedAt: new Date('2024-03-01T13:20:00Z')
      },
      {
        clientId: clients[0].id,
        organizationId: organizations[0].id,
        action: 'viewed',
        entityType: 'audit_trail',
        entityId: 'audit-trail-1',
        entityName: 'Client Audit Trail',
        changeDescription: 'Audit trail reviewed for compliance audit',
        performedBy: sampleUsers[0].id,
        performedByName: 'John Doe',
        userRole: 'admin',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        performedAt: new Date('2024-03-05T10:15:00Z')
      },
      // RetailMax Stores audit trails
      {
        clientId: clients[1].id,
        organizationId: organizations[0].id,
        action: 'created',
        entityType: 'client',
        entityId: clients[1].id,
        entityName: 'RetailMax Stores',
        changeDescription: 'Client profile created and onboarded',
        performedBy: sampleUsers[0].id,
        performedByName: 'John Doe',
        userRole: 'admin',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        performedAt: new Date('2024-01-10T08:30:00Z')
      },
      {
        clientId: clients[1].id,
        organizationId: organizations[0].id,
        action: 'updated',
        entityType: 'client',
        entityId: clients[1].id,
        entityName: 'RetailMax Stores',
        changeDescription: 'Updated client status to active',
        performedBy: sampleUsers[1].id,
        performedByName: 'Jane Smith',
        userRole: 'manager',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        performedAt: new Date('2024-01-12T14:20:00Z')
      },
      {
        clientId: clients[1].id,
        organizationId: organizations[0].id,
        action: 'viewed',
        entityType: 'client',
        entityId: clients[1].id,
        entityName: 'RetailMax Stores',
        changeDescription: 'Client profile viewed for monthly review',
        performedBy: sampleUsers[2].id,
        performedByName: 'Bob Brown',
        userRole: 'staff',
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        performedAt: new Date('2024-02-10T11:45:00Z')
      },
      // Manufacturing Plus audit trails
      {
        clientId: clients[2].id,
        organizationId: organizations[0].id,
        action: 'created',
        entityType: 'client',
        entityId: clients[2].id,
        entityName: 'Manufacturing Plus',
        changeDescription: 'Client profile created and onboarded',
        performedBy: sampleUsers[0].id,
        performedByName: 'John Doe',
        userRole: 'admin',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        performedAt: new Date('2024-01-05T10:00:00Z')
      },
      {
        clientId: clients[2].id,
        organizationId: organizations[0].id,
        action: 'updated',
        entityType: 'client',
        entityId: clients[2].id,
        entityName: 'Manufacturing Plus',
        changeDescription: 'Updated annual revenue from $4.5M to $5M',
        performedBy: sampleUsers[1].id,
        performedByName: 'Jane Smith',
        userRole: 'manager',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        performedAt: new Date('2024-01-18T16:30:00Z')
      },
      {
        clientId: clients[2].id,
        organizationId: organizations[0].id,
        action: 'viewed',
        entityType: 'client',
        entityId: clients[2].id,
        entityName: 'Manufacturing Plus',
        changeDescription: 'Client profile viewed for tax planning session',
        performedBy: sampleUsers[0].id,
        performedByName: 'John Doe',
        userRole: 'admin',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        performedAt: new Date('2024-02-28T09:15:00Z')
      }
    ];

    for (const audit of auditTrails) {
      await prisma.auditTrail.create({
        data: audit
      });
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Seeded Data Summary:');
    console.log(`   Organizations: ${sampleOrganizations.length}`);
    console.log(`   Users: ${sampleUsers.length}`);
    console.log(`   Clients: ${sampleClients.length}`);
    console.log(`   Client States: ${sampleClientStates.length}`);
    console.log(`   Alerts: ${sampleAlerts.length}`);
    console.log(`   Tasks: ${sampleTasks.length}`);
    console.log(`   Documents: ${sampleDocuments.length}`);
    console.log(`   Professional Decisions: ${sampleProfessionalDecisions.length}`);
    console.log(`   Performance Metrics: ${metrics.length * sampleOrganizations.length}`);
    console.log(`   Compliance Standards: ${complianceStandards.length}`);
    console.log(`   Communications: ${communications.length}`);
    console.log(`   Data Processing: ${dataProcessing.length}`);
    console.log(`   Business Profiles: ${businessProfiles.length}`);
    console.log(`   Contacts: ${contacts.length}`);
    console.log(`   Business Locations: ${businessLocations.length}`);
    console.log(`   Revenue Breakdowns: ${revenueBreakdowns.length}`);
    console.log(`   Customer Demographics: ${customerDemographics.length}`);
    console.log(`   Geographic Distributions: ${geographicDistributions.length}`);
    console.log(`   Audit Trails: ${auditTrails.length}`);
    console.log(`   Audit Logs: ${auditLogs.length}`);

    console.log('\n🔑 Default Login Credentials:');
    console.log('   Email: john.doe@acmeaccounting.com');
    console.log('   Password: password123');
    console.log('   Organization: acme-accounting');
    console.log('\n   Email: sarah.wilson@smithtaxpros.com');
    console.log('   Password: password123');
    console.log('   Organization: smith-tax-pros');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
if (require.main === module) {
  seed()
    .then(() => {
      console.log('🎉 Seeding process completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seed };
