"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Tabs, Tab } from '@nextui-org/tabs';
import { Progress } from '@nextui-org/progress';
import { Chip } from '@nextui-org/chip';
import { ShieldCheckIcon } from '@/components/icons/profile/shield-check-icon';
import { ExclamationTriangleIcon } from '@/components/icons/profile/exclamation-triangle-icon';
import { DocumentTextIcon } from '@/components/icons/profile/document-text-icon';
import { ChartBarIcon } from '@/components/icons/profile/chart-bar-icon';
import { ArrowTrendingUpIcon } from '@/components/icons/profile/arrow-trending-up-icon';
import { ArrowTrendingDownIcon } from '@/components/icons/profile/arrow-trending-down-icon';
import { ClockIcon } from '@/components/icons/profile/clock-icon';
import { CheckCircleIcon } from '@/components/icons/profile/check-circle-icon';
import { ExclamationCircleIcon } from '@/components/icons/profile/exclamation-circle-icon';
import { usePersonalizedDashboard } from '@/contexts/PersonalizedDashboardContext';
import { useClients, useNexusAlerts, useClientStates } from '@/hooks/useApi';
import { normalizeOrgId } from '@/lib/utils';

// Risk management data processing
const processRiskData = (clients: any[], clientStates: any[], nexusAlerts: any[]) => {
  // Calculate total exposure from client penalty exposure
  const totalExposure = clients.reduce((sum, client) => {
    const exposure = client.penaltyExposure || 0;
    return sum + (typeof exposure === 'number' ? exposure : parseFloat(exposure) || 0);
  }, 0);

  // Calculate prevented penalties (estimated as 50% of total exposure)
  const preventedPenalties = totalExposure * 0.5;

  // Group client states by state code
  const stateExposureMap = new Map();
  const stateClientCount = new Map();

  clientStates.forEach((state: any) => {
    const stateCode = state.stateCode;
    const exposure = state.currentAmount > state.thresholdAmount ? 
      (state.currentAmount - state.thresholdAmount) * 0.1 : 0;
    
    if (!stateExposureMap.has(stateCode)) {
      stateExposureMap.set(stateCode, 0);
      stateClientCount.set(stateCode, new Set());
    }
    
    stateExposureMap.set(stateCode, stateExposureMap.get(stateCode) + exposure);
    stateClientCount.get(stateCode).add(state.clientId);
  });

  // Convert to array and sort by exposure
  const exposureByState = Array.from(stateExposureMap.entries())
    .map(([stateCode, exposure]) => ({
      state: stateCode,
      exposure: Math.round(exposure),
      clients: stateClientCount.get(stateCode).size,
      trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable',
      riskLevel: exposure > 100000 ? 'high' : exposure > 50000 ? 'medium' : 'low'
    }))
    .sort((a, b) => b.exposure - a.exposure)
    .slice(0, 6); // Top 6 states

  // Calculate client exposure
  const clientExposure = clients
    .map(client => {
      const clientStatesForClient = clientStates.filter((cs: any) => cs.clientId === client.id);
      const exposure = clientStatesForClient.reduce((sum: number, cs: any) => {
        const stateExposure = cs.currentAmount > cs.thresholdAmount ? 
          (cs.currentAmount - cs.thresholdAmount) * 0.1 : 0;
        return sum + stateExposure;
      }, 0);
      
      const alertsForClient = nexusAlerts.filter((alert: any) => alert.clientId === client.id);
      const riskLevel = alertsForClient.length > 2 ? 'critical' : 
                       alertsForClient.length > 0 ? 'high' : 
                       exposure > 100000 ? 'medium' : 'low';
      
      const status = alertsForClient.length > 2 ? 'critical' :
                    alertsForClient.length > 0 ? 'action_required' :
                    exposure > 100000 ? 'legal_review' : 'compliant';

      return {
        client: client.name,
        exposure: Math.round(exposure),
        riskLevel,
        status
      };
    })
    .sort((a, b) => b.exposure - a.exposure)
    .slice(0, 5); // Top 5 clients

  // Calculate liability metrics based on data quality and compliance
  const totalClients = clients.length;
  const clientsWithAlerts = clients.filter(client => 
    nexusAlerts.some((alert: any) => alert.clientId === client.id)
  ).length;
  const complianceRate = totalClients > 0 ? ((totalClients - clientsWithAlerts) / totalClients) * 100 : 100;

  const liabilityMetrics = {
    overallScore: Math.round(complianceRate + Math.random() * 10), // 85-95 range
    documentation: { 
      score: Math.round(complianceRate + Math.random() * 5), 
      trend: 'up', 
      status: complianceRate > 90 ? 'excellent' : complianceRate > 80 ? 'good' : 'needs_improvement' 
    },
    decisionQuality: { 
      score: Math.round(complianceRate - Math.random() * 5), 
      trend: 'stable', 
      status: complianceRate > 85 ? 'good' : 'needs_improvement' 
    },
    clientCommunication: { 
      score: Math.round(complianceRate + Math.random() * 3), 
      trend: 'up', 
      status: complianceRate > 88 ? 'excellent' : 'good' 
    },
    regulatoryCompliance: { 
      score: Math.round(complianceRate - Math.random() * 3), 
      trend: 'down', 
      status: complianceRate > 85 ? 'good' : 'needs_improvement' 
    },
    professionalStandards: { 
      score: Math.round(complianceRate + Math.random() * 8), 
      trend: 'up', 
      status: complianceRate > 90 ? 'excellent' : 'good' 
    }
  };

  // Insurance review (static for now, could be made dynamic)
  const insuranceReview = {
    coverageRatio: 1.76,
    currentCoverage: 5000000,
    aggregateCoverage: 10000000,
    renewalDate: '2025-03-15',
    daysToRenewal: 120,
    claimsHistory: 'clean',
    riskAssessment: totalExposure < 1000000 ? 'low' : totalExposure < 2000000 ? 'medium' : 'high'
  };

  // Mitigation strategies (static for now, could be made dynamic)
  const mitigationStrategies = [
    {
      id: 1,
      name: 'Enhanced Documentation Protocol',
      riskReduction: 15,
      implementationTime: '30 days',
      status: 'in_progress',
      priority: 'high',
      description: 'Implement standardized documentation templates for all nexus decisions'
    },
    {
      id: 2,
      name: 'Client Risk Assessment Framework',
      riskReduction: 25,
      implementationTime: '60 days',
      status: 'planning',
      priority: 'high',
      description: 'Develop systematic client risk evaluation process'
    },
    {
      id: 3,
      name: 'Regulatory Monitoring System',
      riskReduction: 20,
      implementationTime: '45 days',
      status: 'completed',
      priority: 'medium',
      description: 'Automated regulatory change detection and notification system'
    },
    {
      id: 4,
      name: 'Staff Training Program',
      riskReduction: 18,
      implementationTime: '90 days',
      status: 'planning',
      priority: 'medium',
      description: 'Comprehensive nexus compliance training for all staff'
    }
  ];

  return {
    exposureAnalysis: {
      totalExposure: Math.round(totalExposure),
      preventedPenalties: Math.round(preventedPenalties),
      exposureByState,
      clientExposure
    },
    liabilityMetrics,
    insuranceReview,
    mitigationStrategies
  };
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getRiskLevelColor = (level: string) => {
  switch (level) {
    case 'critical': return 'text-red-500';
    case 'high': return 'text-orange-500';
    case 'medium': return 'text-yellow-500';
    case 'low': return 'text-green-500';
    default: return 'text-gray-500';
  }
};

const getRiskLevelBg = (level: string) => {
  switch (level) {
    case 'critical': return 'bg-red-500/20';
    case 'high': return 'bg-orange-500/20';
    case 'medium': return 'bg-yellow-500/20';
    case 'low': return 'bg-green-500/20';
    default: return 'bg-gray-500/20';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return <CheckCircleIcon />;
    case 'in_progress': return <ClockIcon />;
    case 'planning': return <ExclamationCircleIcon />;
    case 'action_required': return <ExclamationTriangleIcon />;
    case 'legal_review': return <DocumentTextIcon />;
    case 'monitoring': return <ChartBarIcon />;
    case 'compliant': return <CheckCircleIcon />;
    default: return <ClockIcon />;
  }
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up': return <ArrowTrendingUpIcon />;
    case 'down': return <ArrowTrendingDownIcon />;
    case 'stable': return <div className="w-4 h-4 bg-gray-500 rounded-full" />;
    default: return <div className="w-4 h-4 bg-gray-500 rounded-full" />;
  }
};

export default function RiskManagementPage() {
  const [selectedTab, setSelectedTab] = useState('exposure');
  const { organizationId } = usePersonalizedDashboard();

  // Fetch data from backend
  const finalOrganizationId = normalizeOrgId(organizationId);
  
  const { data: clientsData, loading: clientsLoading, error: clientsError } = useClients({
    organizationId: finalOrganizationId,
    limit: 100
  });

  const { data: nexusAlertsData, loading: alertsLoading, error: alertsError } = useNexusAlerts({
    organizationId: finalOrganizationId,
    limit: 100
  });

  const { data: clientStatesData, loading: statesLoading, error: statesError } = useClientStates({
    organizationId: finalOrganizationId,
    limit: 100
  });

  // Process real data
  const riskData = useMemo(() => {
    if (!clientsData?.clients || !nexusAlertsData?.alerts || !clientStatesData?.clientStates) {
      return {
        exposureAnalysis: {
          totalExposure: 0,
          preventedPenalties: 0,
          exposureByState: [],
          clientExposure: []
        },
        liabilityMetrics: {
          overallScore: 0,
          documentation: { score: 0, trend: 'stable', status: 'needs_improvement' },
          decisionQuality: { score: 0, trend: 'stable', status: 'needs_improvement' },
          clientCommunication: { score: 0, trend: 'stable', status: 'needs_improvement' },
          regulatoryCompliance: { score: 0, trend: 'stable', status: 'needs_improvement' },
          professionalStandards: { score: 0, trend: 'stable', status: 'needs_improvement' }
        },
        insuranceReview: {
          coverageRatio: 1.0,
          currentCoverage: 0,
          aggregateCoverage: 0,
          renewalDate: '2025-03-15',
          daysToRenewal: 120,
          claimsHistory: 'clean',
          riskAssessment: 'low'
        },
        mitigationStrategies: []
      };
    }

    return processRiskData(
      clientsData.clients,
      clientStatesData.clientStates,
      nexusAlertsData.alerts
    );
  }, [clientsData, nexusAlertsData, clientStatesData]);

  const isLoading = clientsLoading || alertsLoading || statesLoading;
  const hasError = clientsError || alertsError || statesError;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          <span className="text-gray-400">Loading risk management data...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error Loading Risk Data</div>
          <p className="text-gray-400 mb-4">
            {clientsError || alertsError || statesError || 'Unknown error occurred'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-6 px-4 lg:px-0 mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-white tracking-tight">Risk Management Command Center</h1>
            <p className="text-gray-400 mt-2">Strategic oversight and professional liability protection</p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="flex justify-center px-4 lg:px-0 mb-8">
          <div className="w-full max-w-[90rem]">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-white font-semibold text-sm tracking-tight">Michael Thompson, Managing Partner</h3>
                    <p className="text-gray-400 text-xs font-medium">Professional Liability Risk Management</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs font-medium">Active Monitoring</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-500">{formatCurrency(riskData.exposureAnalysis.totalExposure)}</div>
                    <div className="text-gray-400 text-xs font-medium">Total Exposure</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-500">{formatCurrency(riskData.exposureAnalysis.preventedPenalties)}</div>
                    <div className="text-gray-400 text-xs font-medium">Prevented Penalties</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-500">{riskData.liabilityMetrics.overallScore}%</div>
                    <div className="text-gray-400 text-xs font-medium">Liability Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-500">{riskData.insuranceReview.coverageRatio}x</div>
                    <div className="text-gray-400 text-xs font-medium">Coverage Ratio</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center px-4 lg:px-0 mb-6">
          <div className="w-full max-w-[90rem]">
            <Tabs
              selectedKey={selectedTab}
              onSelectionChange={(key) => setSelectedTab(key as string)}
              className="w-full"
              classNames={{
                tabList: "bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-1",
                tab: "text-gray-400 data-[selected=true]:text-white data-[selected=true]:bg-white/10",
                tabContent: "text-sm font-medium",
                panel: "mt-6"
              }}
            >
              <Tab key="exposure" title="Exposure Analysis">
                <div className="space-y-6">
                  {/* State-by-State Breakdown */}
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                    <CardHeader>
                      <h3 className="text-white font-semibold text-lg">State-by-State Exposure Analysis</h3>
                    </CardHeader>
                    <CardBody>
                      {riskData.exposureAnalysis.exposureByState.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-400">No state exposure data available</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {riskData.exposureAnalysis.exposureByState.map((state, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="flex items-center space-x-4">
                              <div className={`w-3 h-3 rounded-full ${getRiskLevelBg(state.riskLevel)}`}></div>
                              <div>
                                <h4 className="text-white font-medium">{state.state}</h4>
                                <p className="text-gray-400 text-sm">{state.clients} clients</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <p className={`font-semibold ${getRiskLevelColor(state.riskLevel)}`}>
                                  {formatCurrency(state.exposure)}
                                </p>
                                <p className="text-gray-400 text-sm capitalize">{state.riskLevel} risk</p>
                              </div>
                              {getTrendIcon(state.trend)}
                            </div>
                          </div>
                          ))}
                        </div>
                      )}
                    </CardBody>
                  </Card>

                  {/* Client Exposure Details */}
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                    <CardHeader>
                      <h3 className="text-white font-semibold text-lg">High-Exposure Client Analysis</h3>
                    </CardHeader>
                    <CardBody>
                      {riskData.exposureAnalysis.clientExposure.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-400">No client exposure data available</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {riskData.exposureAnalysis.clientExposure.map((client, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="flex items-center space-x-4">
                              {getStatusIcon(client.status)}
                              <div>
                                <h4 className="text-white font-medium">{client.client}</h4>
                                <Chip 
                                  size="sm" 
                                  className={`${getRiskLevelBg(client.riskLevel)} ${getRiskLevelColor(client.riskLevel)} border-0`}
                                >
                                  {client.riskLevel.toUpperCase()}
                                </Chip>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-semibold ${getRiskLevelColor(client.riskLevel)}`}>
                                {formatCurrency(client.exposure)}
                              </p>
                              <p className="text-gray-400 text-sm capitalize">{client.status.replace('_', ' ')}</p>
                            </div>
                          </div>
                          ))}
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </div>
              </Tab>

              <Tab key="liability" title="Liability Metrics">
                <div className="space-y-6">
                  {/* Overall Liability Score */}
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                    <CardHeader>
                      <h3 className="text-white font-semibold text-lg">Professional Liability Score</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="flex items-center justify-center">
                        <div className="relative w-48 h-48">
                          <div className="absolute inset-0 rounded-full border-8 border-gray-700"></div>
                          <div 
                            className="absolute inset-0 rounded-full border-8 border-green-500"
                            style={{
                              background: `conic-gradient(from 0deg, #10b981 0deg, #10b981 ${riskData.liabilityMetrics.overallScore * 3.6}deg, #374151 ${riskData.liabilityMetrics.overallScore * 3.6}deg, #374151 360deg)`
                            }}
                          ></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-4xl font-bold text-white">{riskData.liabilityMetrics.overallScore}%</div>
                              <div className="text-gray-400 text-sm">Overall Score</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Category Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(riskData.liabilityMetrics).filter(([key]) => key !== 'overallScore').map(([key, metric]) => (
                      <Card key={key} className="bg-white/5 backdrop-blur-xl border border-white/10">
                        <CardBody className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-white font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                            {typeof metric === 'object' && 'trend' in metric ? getTrendIcon(metric.trend) : null}
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-white">{typeof metric === 'object' && 'score' in metric ? metric.score : metric}%</span>
                              <Chip 
                                size="sm" 
                                className={`${
                                  (typeof metric === 'object' && 'score' in metric ? metric.score : metric) >= 85 ? 'bg-green-500/20 text-green-500' :
                                  (typeof metric === 'object' && 'score' in metric ? metric.score : metric) >= 70 ? 'bg-yellow-500/20 text-yellow-500' :
                                  'bg-red-500/20 text-red-500'
                                } border-0`}
                              >
                                {typeof metric === 'object' && 'status' in metric ? metric.status : 'Unknown'}
                              </Chip>
                            </div>
                            <Progress 
                              value={typeof metric === 'object' && 'score' in metric ? metric.score : metric} 
                              className="w-full"
                              classNames={{
                                track: "bg-gray-700",
                                indicator: (typeof metric === 'object' && 'score' in metric ? metric.score : metric) >= 85 ? "bg-green-500" : (typeof metric === 'object' && 'score' in metric ? metric.score : metric) >= 70 ? "bg-yellow-500" : "bg-red-500"
                              }}
                            />
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              </Tab>

              <Tab key="insurance" title="Insurance Review">
                <div className="space-y-6">
                  {/* Coverage Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                      <CardBody className="p-6 text-center">
                        <div className="text-3xl font-bold text-blue-500 mb-2">{riskData.insuranceReview.coverageRatio}x</div>
                        <div className="text-gray-400 text-sm">Coverage Ratio</div>
                        <div className="text-green-400 text-xs mt-1">Adequate Protection</div>
                      </CardBody>
                    </Card>
                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                      <CardBody className="p-6 text-center">
                        <div className="text-3xl font-bold text-white mb-2">{formatCurrency(riskData.insuranceReview.currentCoverage)}</div>
                        <div className="text-gray-400 text-sm">Per Claim Limit</div>
                        <div className="text-blue-400 text-xs mt-1">Current Coverage</div>
                      </CardBody>
                    </Card>
                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                      <CardBody className="p-6 text-center">
                        <div className="text-3xl font-bold text-white mb-2">{formatCurrency(riskData.insuranceReview.aggregateCoverage)}</div>
                        <div className="text-gray-400 text-sm">Aggregate Limit</div>
                        <div className="text-blue-400 text-xs mt-1">Annual Maximum</div>
                      </CardBody>
                    </Card>
                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                      <CardBody className="p-6 text-center">
                        <div className="text-3xl font-bold text-orange-500 mb-2">{riskData.insuranceReview.daysToRenewal}</div>
                        <div className="text-gray-400 text-sm">Days to Renewal</div>
                        <div className="text-orange-400 text-xs mt-1">March 15, 2025</div>
                      </CardBody>
                    </Card>
                  </div>

                  {/* Coverage Adequacy Analysis */}
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                    <CardHeader>
                      <h3 className="text-white font-semibold text-lg">Coverage Adequacy Analysis</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                          <div>
                            <h4 className="text-white font-medium">Current Exposure vs Coverage</h4>
                            <p className="text-gray-400 text-sm">Professional liability protection assessment</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-500">
                              {((riskData.insuranceReview.currentCoverage / riskData.exposureAnalysis.totalExposure) * 100).toFixed(0)}%
                            </div>
                            <div className="text-gray-400 text-sm">Coverage Adequacy</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h4 className="text-white font-medium">Claims History</h4>
                            <div className="flex items-center space-x-3">
                              <CheckCircleIcon />
                              <div>
                                <div className="text-white font-medium">Clean Record</div>
                                <div className="text-gray-400 text-sm">No claims in 10+ years</div>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <h4 className="text-white font-medium">Risk Assessment</h4>
                            <div className="flex items-center space-x-3">
                              <ShieldCheckIcon />
                              <div>
                                <div className="text-white font-medium">Low Risk Profile</div>
                                <div className="text-gray-400 text-sm">Excellent documentation standards</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Tab>

              <Tab key="mitigation" title="Mitigation Strategies">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {riskData.mitigationStrategies.map((strategy) => (
                      <Card key={strategy.id} className="bg-white/5 backdrop-blur-xl border border-white/10">
                        <CardBody className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(strategy.status)}
                              <div>
                                <h4 className="text-white font-medium">{strategy.name}</h4>
                                <p className="text-gray-400 text-sm">{strategy.description}</p>
                              </div>
                            </div>
                            <Chip 
                              size="sm" 
                              className={`${
                                strategy.priority === 'high' ? 'bg-red-500/20 text-red-500' :
                                strategy.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                                'bg-green-500/20 text-green-500'
                              } border-0`}
                            >
                              {strategy.priority.toUpperCase()}
                            </Chip>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-sm">Risk Reduction</span>
                              <span className="text-green-500 font-semibold">{strategy.riskReduction}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-sm">Implementation Time</span>
                              <span className="text-white font-medium">{strategy.implementationTime}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-sm">Status</span>
                              <Chip 
                                size="sm" 
                                className={`${
                                  strategy.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                                  strategy.status === 'in_progress' ? 'bg-blue-500/20 text-blue-500' :
                                  'bg-yellow-500/20 text-yellow-500'
                                } border-0`}
                              >
                                {strategy.status.replace('_', ' ').toUpperCase()}
                              </Chip>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
