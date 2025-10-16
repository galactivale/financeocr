const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getOrganizations() {
  try {
    const orgs = await prisma.organization.findMany({
      select: {
        id: true,
        name: true,
        slug: true
      }
    });
    console.log('Organizations:', orgs);
    
    const dashboards = await prisma.generatedDashboard.findMany({
      select: {
        id: true,
        clientName: true,
        organizationId: true,
        isActive: true
      }
    });
    console.log('Generated Dashboards:', dashboards);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getOrganizations();