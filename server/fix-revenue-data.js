const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixRevenueData() {
  console.log('🔧 Starting revenue data cleanup...');
  
  try {
    // Get all clients with potentially corrupted revenue data
    const clients = await prisma.client.findMany({
      select: {
        id: true,
        name: true,
        annualRevenue: true
      }
    });
    
    console.log(`📊 Found ${clients.length} clients to check...`);
    
    let fixedCount = 0;
    
    for (const client of clients) {
      const originalRevenue = client.annualRevenue;
      let cleanRevenue = originalRevenue;
      
      // Check if revenue is a string with concatenated numbers
      if (typeof originalRevenue === 'string') {
        // Extract the first valid number from the string
        const numberMatch = originalRevenue.match(/\d+/);
        if (numberMatch) {
          cleanRevenue = parseInt(numberMatch[0]);
          // Ensure it's within limits
          cleanRevenue = Math.min(Math.max(cleanRevenue, 50000), 600000);
        } else {
          cleanRevenue = 50000; // Default fallback
        }
      } else if (typeof originalRevenue === 'number') {
        // If it's already a number, validate and clean it
        if (isNaN(originalRevenue) || originalRevenue > 600000) {
          cleanRevenue = 600000; // Cap at maximum
        } else if (originalRevenue < 50000) {
          cleanRevenue = 50000; // Minimum
        } else {
          cleanRevenue = Math.round(originalRevenue); // Ensure it's a clean integer
        }
      }
      
      // Only update if the value changed
      if (cleanRevenue !== originalRevenue) {
        await prisma.client.update({
          where: { id: client.id },
          data: { annualRevenue: cleanRevenue }
        });
        
        console.log(`✅ Fixed client "${client.name}": ${originalRevenue} → ${cleanRevenue}`);
        fixedCount++;
      }
    }
    
    console.log(`🎉 Revenue data cleanup complete! Fixed ${fixedCount} clients.`);
    
    // Also check and fix any client states that might have corrupted threshold amounts
    const clientStates = await prisma.clientState.findMany({
      select: {
        id: true,
        clientId: true,
        stateCode: true,
        thresholdAmount: true,
        currentAmount: true
      }
    });
    
    console.log(`📊 Found ${clientStates.length} client states to check...`);
    
    let fixedStatesCount = 0;
    
    for (const state of clientStates) {
      let needsUpdate = false;
      const updateData = {};
      
      // Fix threshold amount
      if (typeof state.thresholdAmount === 'string') {
        const numberMatch = state.thresholdAmount.match(/\d+/);
        if (numberMatch) {
          updateData.thresholdAmount = parseInt(numberMatch[0]);
          needsUpdate = true;
        }
      }
      
      // Fix current amount
      if (typeof state.currentAmount === 'string') {
        const numberMatch = state.currentAmount.match(/\d+/);
        if (numberMatch) {
          updateData.currentAmount = parseInt(numberMatch[0]);
          needsUpdate = true;
        }
      }
      
      if (needsUpdate) {
        await prisma.clientState.update({
          where: { id: state.id },
          data: updateData
        });
        
        console.log(`✅ Fixed client state ${state.stateCode} for client ${state.clientId}`);
        fixedStatesCount++;
      }
    }
    
    console.log(`🎉 Client state data cleanup complete! Fixed ${fixedStatesCount} client states.`);
    
  } catch (error) {
    console.error('❌ Error during revenue data cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup
fixRevenueData();
