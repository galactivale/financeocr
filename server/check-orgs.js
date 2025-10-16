const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkOrgs() {
  try {
    const orgs = await prisma.organization.findMany();
    console.log('Organizations in database:');
    orgs.forEach(org => {
      console.log(`- ID: ${org.id}, Name: ${org.name}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkOrgs();
