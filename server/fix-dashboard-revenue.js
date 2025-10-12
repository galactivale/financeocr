const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function cleanRevenueValue(revenue) {
  // Handle string concatenation issue - if it's a string with multiple numbers, take the first valid number
  if (typeof revenue === 'string') {
    // Extract the first valid number from the string
    const numberMatch = revenue.match(/\d+/);
    if (numberMatch) {
      const cleanValue = parseInt(numberMatch[0]);
      // Ensure it's within limits
      return Math.min(Math.max(cleanValue, 50000), 600000);
    } else {
      return 50000; // Default fallback
    }
  }
  
  // If it's already a number, validate and clean it
  const numValue = parseFloat(revenue);
  if (isNaN(numValue)) {
    return 50000; // Default fallback
  }
  
  // Ensure it's within limits and is a clean integer
  return Math.round(Math.min(Math.max(numValue, 50000), 600000));
}

function cleanPenaltyExposureValue(penaltyExposure) {
  // Handle string concatenation issue - if it's a string with multiple numbers, take the first valid number
  if (typeof penaltyExposure === 'string') {
    // Extract the first valid number from the string
    const numberMatch = penaltyExposure.match(/\d+/);
    if (numberMatch) {
      const cleanValue = parseInt(numberMatch[0]);
      // Ensure it's within reasonable limits (0 to 200,000)
      return Math.min(Math.max(cleanValue, 0), 200000);
    } else {
      return 0; // Default fallback
    }
  }
  
  // If it's already a number, validate and clean it
  const numValue = parseFloat(penaltyExposure);
  if (isNaN(numValue)) {
    return 0; // Default fallback
  }
  
  // Ensure it's within reasonable limits and is a clean integer
  return Math.round(Math.min(Math.max(numValue, 0), 200000));
}

async function fixDashboardRevenue() {
  console.log('🔧 Starting dashboard revenue data cleanup...');
  
  try {
    // Get all generated dashboards
    const dashboards = await prisma.generatedDashboard.findMany({
      select: {
        id: true,
        clientName: true,
        keyMetrics: true,
        generatedAnalytics: true
      }
    });
    
    console.log(`📊 Found ${dashboards.length} dashboards to check...`);
    
    let fixedCount = 0;
    
    for (const dashboard of dashboards) {
      let needsUpdate = false;
      const updateData = {};
      
      // Check and fix keyMetrics.totalRevenue
      if (dashboard.keyMetrics && dashboard.keyMetrics.totalRevenue) {
        const originalRevenue = dashboard.keyMetrics.totalRevenue;
        const cleanRevenue = cleanRevenueValue(originalRevenue);
        
        if (cleanRevenue !== originalRevenue) {
          updateData.keyMetrics = { ...dashboard.keyMetrics, totalRevenue: cleanRevenue };
          needsUpdate = true;
          console.log(`✅ Fixed dashboard "${dashboard.clientName}" keyMetrics.totalRevenue: ${originalRevenue} → ${cleanRevenue}`);
        }
      }
      
      // Check and fix generatedAnalytics.totalRevenue
      if (dashboard.generatedAnalytics && dashboard.generatedAnalytics.totalRevenue) {
        const originalRevenue = dashboard.generatedAnalytics.totalRevenue;
        const cleanRevenue = cleanRevenueValue(originalRevenue);
        
        if (cleanRevenue !== originalRevenue) {
          updateData.generatedAnalytics = { ...dashboard.generatedAnalytics, totalRevenue: cleanRevenue };
          needsUpdate = true;
          console.log(`✅ Fixed dashboard "${dashboard.clientName}" generatedAnalytics.totalRevenue: ${originalRevenue} → ${cleanRevenue}`);
        }
      }
      
      // Check and fix generatedAnalytics.totalPenaltyExposure
      if (dashboard.generatedAnalytics && dashboard.generatedAnalytics.totalPenaltyExposure) {
        const originalPenaltyExposure = dashboard.generatedAnalytics.totalPenaltyExposure;
        const cleanPenaltyExposure = cleanPenaltyExposureValue(originalPenaltyExposure);
        
        if (cleanPenaltyExposure !== originalPenaltyExposure) {
          updateData.generatedAnalytics = { ...updateData.generatedAnalytics || dashboard.generatedAnalytics, totalPenaltyExposure: cleanPenaltyExposure };
          needsUpdate = true;
          console.log(`✅ Fixed dashboard "${dashboard.clientName}" generatedAnalytics.totalPenaltyExposure: ${originalPenaltyExposure} → ${cleanPenaltyExposure}`);
        }
      }
      
      // Update the dashboard if changes were made
      if (needsUpdate) {
        await prisma.generatedDashboard.update({
          where: { id: dashboard.id },
          data: updateData
        });
        fixedCount++;
      }
    }
    
    console.log(`🎉 Dashboard revenue data cleanup complete! Fixed ${fixedCount} dashboards.`);
    
  } catch (error) {
    console.error('❌ Error during dashboard revenue data cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup
fixDashboardRevenue();
