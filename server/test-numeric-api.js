/**
 * Test script to verify that API endpoints return proper numeric values
 * instead of long decimal strings
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testNumericAPI() {
  console.log('🧪 Testing API numeric value formatting...\n');

  try {
    // Test 1: Get clients
    console.log('1️⃣ Testing /api/clients endpoint...');
    const clientsResponse = await axios.get(`${BASE_URL}/api/clients?organizationId=demo-org-id`);
    
    if (clientsResponse.data.success && clientsResponse.data.data.clients.length > 0) {
      const client = clientsResponse.data.data.clients[0];
      console.log('✅ Client data received');
      console.log('   - annualRevenue type:', typeof client.annualRevenue, 'value:', client.annualRevenue);
      console.log('   - penaltyExposure type:', typeof client.penaltyExposure, 'value:', client.penaltyExposure);
      console.log('   - qualityScore type:', typeof client.qualityScore, 'value:', client.qualityScore);
      
      // Check if values are proper numbers
      const isRevenueNumber = typeof client.annualRevenue === 'number' && !isNaN(client.annualRevenue);
      const isExposureNumber = typeof client.penaltyExposure === 'number' && !isNaN(client.penaltyExposure);
      const isScoreNumber = typeof client.qualityScore === 'number' && !isNaN(client.qualityScore);
      
      console.log('   - Revenue is proper number:', isRevenueNumber);
      console.log('   - Exposure is proper number:', isExposureNumber);
      console.log('   - Score is proper number:', isScoreNumber);
    } else {
      console.log('❌ No client data found');
    }

    // Test 2: Get nexus alerts
    console.log('\n2️⃣ Testing /api/nexus/alerts endpoint...');
    const alertsResponse = await axios.get(`${BASE_URL}/api/nexus/alerts?organizationId=demo-org-id`);
    
    if (alertsResponse.data.alerts && alertsResponse.data.alerts.length > 0) {
      const alert = alertsResponse.data.alerts[0];
      console.log('✅ Alert data received');
      console.log('   - thresholdAmount type:', typeof alert.thresholdAmount, 'value:', alert.thresholdAmount);
      console.log('   - currentAmount type:', typeof alert.currentAmount, 'value:', alert.currentAmount);
      console.log('   - penaltyRisk type:', typeof alert.penaltyRisk, 'value:', alert.penaltyRisk);
      
      // Check if values are proper numbers
      const isThresholdNumber = typeof alert.thresholdAmount === 'number' && !isNaN(alert.thresholdAmount);
      const isCurrentNumber = typeof alert.currentAmount === 'number' && !isNaN(alert.currentAmount);
      const isRiskNumber = typeof alert.penaltyRisk === 'number' && !isNaN(alert.penaltyRisk);
      
      console.log('   - Threshold is proper number:', isThresholdNumber);
      console.log('   - Current is proper number:', isCurrentNumber);
      console.log('   - Risk is proper number:', isRiskNumber);
    } else {
      console.log('❌ No alert data found');
    }

    // Test 3: Get client states
    console.log('\n3️⃣ Testing /api/nexus/client-states endpoint...');
    const statesResponse = await axios.get(`${BASE_URL}/api/nexus/client-states?organizationId=demo-org-id`);
    
    if (statesResponse.data.clientStates && statesResponse.data.clientStates.length > 0) {
      const state = statesResponse.data.clientStates[0];
      console.log('✅ Client state data received');
      console.log('   - currentAmount type:', typeof state.currentAmount, 'value:', state.currentAmount);
      console.log('   - thresholdAmount type:', typeof state.thresholdAmount, 'value:', state.thresholdAmount);
      console.log('   - penaltyRisk type:', typeof state.penaltyRisk, 'value:', state.penaltyRisk);
      
      // Check if values are proper numbers
      const isCurrentNumber = typeof state.currentAmount === 'number' && !isNaN(state.currentAmount);
      const isThresholdNumber = typeof state.thresholdAmount === 'number' && !isNaN(state.thresholdAmount);
      const isRiskNumber = typeof state.penaltyRisk === 'number' && !isNaN(state.penaltyRisk);
      
      console.log('   - Current is proper number:', isCurrentNumber);
      console.log('   - Threshold is proper number:', isThresholdNumber);
      console.log('   - Risk is proper number:', isRiskNumber);
    } else {
      console.log('❌ No client state data found');
    }

    // Test 4: Get risk portfolio
    console.log('\n4️⃣ Testing /api/risk-portfolio endpoint...');
    const portfolioResponse = await axios.get(`${BASE_URL}/api/risk-portfolio?organizationId=demo-org-id`);
    
    if (portfolioResponse.data.clients && portfolioResponse.data.clients.length > 0) {
      const client = portfolioResponse.data.clients[0];
      console.log('✅ Portfolio data received');
      console.log('   - annualRevenue type:', typeof client.annualRevenue, 'value:', client.annualRevenue);
      console.log('   - penaltyExposure type:', typeof client.penaltyExposure, 'value:', client.penaltyExposure);
      console.log('   - qualityScore type:', typeof client.qualityScore, 'value:', client.qualityScore);
      
      // Check if values are proper numbers
      const isRevenueNumber = typeof client.annualRevenue === 'number' && !isNaN(client.annualRevenue);
      const isExposureNumber = typeof client.penaltyExposure === 'number' && !isNaN(client.penaltyExposure);
      const isScoreNumber = typeof client.qualityScore === 'number' && !isNaN(client.qualityScore);
      
      console.log('   - Revenue is proper number:', isRevenueNumber);
      console.log('   - Exposure is proper number:', isExposureNumber);
      console.log('   - Score is proper number:', isScoreNumber);
    } else {
      console.log('❌ No portfolio data found');
    }

    console.log('\n🎉 API numeric formatting test completed!');

  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Run the test
testNumericAPI();
