const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearDatabase() {
  console.log('🗑️ Starting database cleanup...');
  
  try {
    // Get all organizations first to preserve them
    const organizations = await prisma.organization.findMany({
      select: { id: true, name: true }
    });
    
    console.log(`📋 Found ${organizations.length} organization(s) to preserve:`, 
      organizations.map(org => ({ id: org.id, name: org.name }))
    );

    // Delete all data in the correct order to respect foreign key constraints
    const deleteResults = {
      generatedDashboards: 0,
      clients: 0,
      clientStates: 0,
      nexusAlerts: 0,
      nexusActivities: 0,
      alerts: 0,
      tasks: 0,
      businessProfiles: 0,
      contacts: 0,
      businessLocations: 0,
      revenueBreakdowns: 0,
      customerDemographics: 0,
      geographicDistributions: 0,
      professionalDecisions: 0,
      consultations: 0,
      communications: 0,
      documents: 0,
      auditTrails: 0,
      dataProcessing: 0,
      userSessions: 0,
      userPermissions: 0,
      taskSteps: 0,
      alertActions: 0,
      complianceStandards: 0,
      regulatoryChanges: 0,
      integrations: 0,
      performanceMetrics: 0,
      auditLogs: 0,
      organizationMetadata: 0
    };

    // Delete generated dashboards first
    const deletedDashboards = await prisma.generatedDashboard.deleteMany({});
    deleteResults.generatedDashboards = deletedDashboards.count;
    console.log('✅ Deleted generated dashboards:', deletedDashboards.count);

    // Delete all client-related data
    const deletedClients = await prisma.client.deleteMany({});
    deleteResults.clients = deletedClients.count;
    console.log('✅ Deleted clients:', deletedClients.count);

    // Delete client states
    const deletedClientStates = await prisma.clientState.deleteMany({});
    deleteResults.clientStates = deletedClientStates.count;
    console.log('✅ Deleted client states:', deletedClientStates.count);

    // Delete nexus alerts
    const deletedNexusAlerts = await prisma.nexusAlert.deleteMany({});
    deleteResults.nexusAlerts = deletedNexusAlerts.count;
    console.log('✅ Deleted nexus alerts:', deletedNexusAlerts.count);

    // Delete nexus activities
    const deletedNexusActivities = await prisma.nexusActivity.deleteMany({});
    deleteResults.nexusActivities = deletedNexusActivities.count;
    console.log('✅ Deleted nexus activities:', deletedNexusActivities.count);

    // Delete alerts
    const deletedAlerts = await prisma.alert.deleteMany({});
    deleteResults.alerts = deletedAlerts.count;
    console.log('✅ Deleted alerts:', deletedAlerts.count);

    // Delete tasks
    const deletedTasks = await prisma.task.deleteMany({});
    deleteResults.tasks = deletedTasks.count;
    console.log('✅ Deleted tasks:', deletedTasks.count);

    // Delete business profiles
    const deletedBusinessProfiles = await prisma.businessProfile.deleteMany({});
    deleteResults.businessProfiles = deletedBusinessProfiles.count;
    console.log('✅ Deleted business profiles:', deletedBusinessProfiles.count);

    // Delete contacts
    const deletedContacts = await prisma.contact.deleteMany({});
    deleteResults.contacts = deletedContacts.count;
    console.log('✅ Deleted contacts:', deletedContacts.count);

    // Delete business locations
    const deletedBusinessLocations = await prisma.businessLocation.deleteMany({});
    deleteResults.businessLocations = deletedBusinessLocations.count;
    console.log('✅ Deleted business locations:', deletedBusinessLocations.count);

    // Delete revenue breakdowns
    const deletedRevenueBreakdowns = await prisma.revenueBreakdown.deleteMany({});
    deleteResults.revenueBreakdowns = deletedRevenueBreakdowns.count;
    console.log('✅ Deleted revenue breakdowns:', deletedRevenueBreakdowns.count);

    // Delete customer demographics
    const deletedCustomerDemographics = await prisma.customerDemographics.deleteMany({});
    deleteResults.customerDemographics = deletedCustomerDemographics.count;
    console.log('✅ Deleted customer demographics:', deletedCustomerDemographics.count);

    // Delete geographic distributions
    const deletedGeographicDistributions = await prisma.geographicDistribution.deleteMany({});
    deleteResults.geographicDistributions = deletedGeographicDistributions.count;
    console.log('✅ Deleted geographic distributions:', deletedGeographicDistributions.count);

    // Delete professional decisions
    const deletedProfessionalDecisions = await prisma.professionalDecision.deleteMany({});
    deleteResults.professionalDecisions = deletedProfessionalDecisions.count;
    console.log('✅ Deleted professional decisions:', deletedProfessionalDecisions.count);

    // Delete consultations
    const deletedConsultations = await prisma.consultation.deleteMany({});
    deleteResults.consultations = deletedConsultations.count;
    console.log('✅ Deleted consultations:', deletedConsultations.count);

    // Delete communications
    const deletedCommunications = await prisma.communication.deleteMany({});
    deleteResults.communications = deletedCommunications.count;
    console.log('✅ Deleted communications:', deletedCommunications.count);

    // Delete documents
    const deletedDocuments = await prisma.document.deleteMany({});
    deleteResults.documents = deletedDocuments.count;
    console.log('✅ Deleted documents:', deletedDocuments.count);

    // Delete audit trails
    const deletedAuditTrails = await prisma.auditTrail.deleteMany({});
    deleteResults.auditTrails = deletedAuditTrails.count;
    console.log('✅ Deleted audit trails:', deletedAuditTrails.count);

    // Delete data processing records
    const deletedDataProcessing = await prisma.dataProcessing.deleteMany({});
    deleteResults.dataProcessing = deletedDataProcessing.count;
    console.log('✅ Deleted data processing records:', deletedDataProcessing.count);

    // Delete user sessions
    const deletedUserSessions = await prisma.userSession.deleteMany({});
    deleteResults.userSessions = deletedUserSessions.count;
    console.log('✅ Deleted user sessions:', deletedUserSessions.count);

    // Delete user permissions
    const deletedUserPermissions = await prisma.userPermission.deleteMany({});
    deleteResults.userPermissions = deletedUserPermissions.count;
    console.log('✅ Deleted user permissions:', deletedUserPermissions.count);

    // Delete task steps
    const deletedTaskSteps = await prisma.taskStep.deleteMany({});
    deleteResults.taskSteps = deletedTaskSteps.count;
    console.log('✅ Deleted task steps:', deletedTaskSteps.count);

    // Delete alert actions
    const deletedAlertActions = await prisma.alertAction.deleteMany({});
    deleteResults.alertActions = deletedAlertActions.count;
    console.log('✅ Deleted alert actions:', deletedAlertActions.count);

    // Delete compliance standards
    const deletedComplianceStandards = await prisma.complianceStandard.deleteMany({});
    deleteResults.complianceStandards = deletedComplianceStandards.count;
    console.log('✅ Deleted compliance standards:', deletedComplianceStandards.count);

    // Delete regulatory changes
    const deletedRegulatoryChanges = await prisma.regulatoryChange.deleteMany({});
    deleteResults.regulatoryChanges = deletedRegulatoryChanges.count;
    console.log('✅ Deleted regulatory changes:', deletedRegulatoryChanges.count);

    // Delete integrations
    const deletedIntegrations = await prisma.integration.deleteMany({});
    deleteResults.integrations = deletedIntegrations.count;
    console.log('✅ Deleted integrations:', deletedIntegrations.count);

    // Delete performance metrics
    const deletedPerformanceMetrics = await prisma.performanceMetric.deleteMany({});
    deleteResults.performanceMetrics = deletedPerformanceMetrics.count;
    console.log('✅ Deleted performance metrics:', deletedPerformanceMetrics.count);

    // Delete audit logs
    const deletedAuditLogs = await prisma.auditLog.deleteMany({});
    deleteResults.auditLogs = deletedAuditLogs.count;
    console.log('✅ Deleted audit logs:', deletedAuditLogs.count);

    // Delete organization metadata
    const deletedOrganizationMetadata = await prisma.organizationMetadata.deleteMany({});
    deleteResults.organizationMetadata = deletedOrganizationMetadata.count;
    console.log('✅ Deleted organization metadata:', deletedOrganizationMetadata.count);

    const totalDeleted = Object.values(deleteResults).reduce((sum, count) => sum + count, 0);

    console.log('🎉 Database cleanup completed successfully!');
    console.log('📊 Deletion summary:', deleteResults);
    console.log('📊 Total records deleted:', totalDeleted);
    console.log('🏢 Organizations preserved:', organizations.length);
    console.log('⏱️ Cleanup completed at:', new Date().toISOString());

    // Verify organizations are still there
    const remainingOrgs = await prisma.organization.findMany({
      select: { id: true, name: true }
    });
    console.log('✅ Organizations still in database:', remainingOrgs);

  } catch (error) {
    console.error('❌ Error during database cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup
clearDatabase()
  .then(() => {
    console.log('✅ Database cleanup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database cleanup failed:', error);
    process.exit(1);
  });
