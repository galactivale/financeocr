const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestDashboards() {
  try {
    console.log('Creating test dashboards...');

    // Get the first organization
    const org = await prisma.organization.findFirst();
    if (!org) {
      console.error('No organization found. Please run the seed script first.');
      return;
    }

    // Create some test dashboards
    const testDashboards = [
      {
        organizationId: org.id,
        clientName: 'Test Client 1',
        uniqueUrl: 'test-client-1-' + Date.now(),
        isActive: true,
        clientInfo: { name: 'Test Client 1', industry: 'Technology' },
        keyMetrics: { revenue: 1000000, alerts: 5 },
        statesMonitored: ['CA', 'NY', 'TX'],
        personalizedData: { clients: [], alerts: [] }
      },
      {
        organizationId: org.id,
        clientName: 'Test Client 2',
        uniqueUrl: 'test-client-2-' + Date.now(),
        isActive: true,
        clientInfo: { name: 'Test Client 2', industry: 'Retail' },
        keyMetrics: { revenue: 500000, alerts: 2 },
        statesMonitored: ['FL', 'WA'],
        personalizedData: { clients: [], alerts: [] }
      },
      {
        organizationId: org.id,
        clientName: 'Archived Client 1',
        uniqueUrl: 'archived-client-1-' + Date.now(),
        isActive: false, // This one is archived
        clientInfo: { name: 'Archived Client 1', industry: 'Manufacturing' },
        keyMetrics: { revenue: 2000000, alerts: 8 },
        statesMonitored: ['CA', 'NY', 'TX', 'FL'],
        personalizedData: { clients: [], alerts: [] }
      },
      {
        organizationId: org.id,
        clientName: 'Archived Client 2',
        uniqueUrl: 'archived-client-2-' + Date.now(),
        isActive: false, // This one is archived
        clientInfo: { name: 'Archived Client 2', industry: 'Healthcare' },
        keyMetrics: { revenue: 750000, alerts: 3 },
        statesMonitored: ['NY', 'NJ'],
        personalizedData: { clients: [], alerts: [] }
      }
    ];

    for (const dashboard of testDashboards) {
      const created = await prisma.generatedDashboard.create({
        data: dashboard
      });
      console.log(`Created dashboard: ${created.clientName} (Active: ${created.isActive})`);
    }

    console.log('✅ Test dashboards created successfully!');
    
    // Show summary
    const activeCount = await prisma.generatedDashboard.count({
      where: { organizationId: org.id, isActive: true }
    });
    const archivedCount = await prisma.generatedDashboard.count({
      where: { organizationId: org.id, isActive: false }
    });
    
    console.log(`📊 Summary:`);
    console.log(`   Active dashboards: ${activeCount}`);
    console.log(`   Archived dashboards: ${archivedCount}`);

  } catch (error) {
    console.error('❌ Error creating test dashboards:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestDashboards();
