"use client";

import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Tabs, Tab } from '@nextui-org/tabs';
import { Progress } from '@nextui-org/progress';
import { Chip } from '@nextui-org/chip';
import { ArrowTrendingUpIcon } from '@/components/icons/profile/arrow-trending-up-icon';
import { ArrowTrendingDownIcon } from '@/components/icons/profile/arrow-trending-down-icon';
import { ChartBarIcon } from '@/components/icons/profile/chart-bar-icon';
import { CheckCircleIcon } from '@/components/icons/profile/check-circle-icon';
import { ClockIcon } from '@/components/icons/profile/clock-icon';

// Mock data for analytics dashboard
const analyticsData = {
  roiAnalysis: {
    platformInvestment: 48000,
    penaltiesPrevented: 1228000,
    totalROI: 2458,
    paybackPeriod: 0.5,
    revenueGrowth: 23,
    operationalEfficiency: 30,
    marketPosition: 15,
    premiumPricing: 23,
    referralGeneration: 12,
    regionalLeadership: 96,
    // Enhanced ROI data
    detailedROI: {
      netROI: 1180000,
      roiPercentage: 2458,
      industryAverage: 890,
      performanceVsIndustry: 176,
      monthlyROI: 98000,
      quarterlyGrowth: 15.2,
      annualizedReturn: 3200
    },
    costBreakdown: {
      softwareLicensing: 18000,
      staffTraining: 12000,
      implementation: 8000,
      maintenance: 6000,
      consulting: 4000
    },
    valueBreakdown: {
      penaltyPrevention: 1228000,
      timeEfficiency: 120000,
      clientRetention: 85000,
      newClientAcquisition: 150000,
      premiumPricing: 230000,
      operationalSavings: 95000
    },
    trendAnalysis: {
      monthly: [
        { month: 'Jan', roi: 1800, penalties: 85000, efficiency: 25 },
        { month: 'Feb', roi: 2100, penalties: 92000, efficiency: 28 },
        { month: 'Mar', roi: 2350, penalties: 105000, efficiency: 30 },
        { month: 'Apr', roi: 2400, penalties: 110000, efficiency: 32 },
        { month: 'May', roi: 2458, penalties: 115000, efficiency: 30 },
        { month: 'Jun', roi: 2500, penalties: 120000, efficiency: 33 }
      ],
      quarterly: [
        { quarter: 'Q1 2024', roi: 2100, growth: 12.5, clients: 42 },
        { quarter: 'Q2 2024', roi: 2350, growth: 15.2, clients: 45 },
        { quarter: 'Q3 2024', roi: 2400, growth: 18.7, clients: 47 },
        { quarter: 'Q4 2024', roi: 2458, growth: 23.1, clients: 47 }
      ]
    },
    scenarioModeling: {
      conservative: { roi: 1800, penalties: 800000, growth: 15 },
      realistic: { roi: 2458, penalties: 1228000, growth: 23 },
      optimistic: { roi: 3200, penalties: 1800000, growth: 35 }
    },
    benchmarking: {
      industryAverage: 890,
      topQuartile: 1200,
      ourPerformance: 2458,
      percentile: 95,
      competitiveAdvantage: 1568
    },
    predictiveAnalytics: {
      nextQuarter: { roi: 2600, penalties: 130000, growth: 25 },
      nextYear: { roi: 3200, penalties: 1800000, growth: 35 },
      confidence: 87
    }
  },
  teamPerformance: {
    teamCapacity: 50,
    currentUtilization: 87,
    clientSatisfaction: 96,
    certificationRate: 100,
    taxManagers: [
      {
        name: 'Jane Doe',
        clients: 24,
        satisfaction: 96,
        penaltiesPrevented: 127000,
        specializations: ['California', 'New York']
      },
      {
        name: 'Robert Kim',
        clients: 23,
        satisfaction: 93,
        penaltiesPrevented: 89000,
        specializations: ['Texas', 'Florida']
      }
    ],
    capacityProjection: {
      currentClients: 47,
      projectedGrowth: 12,
      capacityGap: 1,
      hiringTimeline: 'Q2 2025'
    }
  },
  clientTrends: {
    revenueGrowth: 18,
    clientRetention: 98,
    averageClientValue: 8500,
    newClientAcquisition: 12,
    portfolioSegmentation: {
      highValue: 8,
      mediumValue: 18,
      standardValue: 21
    }
  },
  regulatoryImpact: {
    highImpact: 2,
    mediumImpact: 5,
    lowImpact: 8,
    regulations: [
      {
        name: 'California AB 234 - Marketplace Sales Rules',
        impact: 'high',
        clientsAffected: 8,
        implementationCost: 12000,
        clientValue: 45000,
        status: 'completed'
      },
      {
        name: 'Washington B&O Tax Classification Changes',
        impact: 'medium',
        clientsAffected: 5,
        implementationCost: 8000,
        clientValue: 25000,
        status: 'in_progress'
      }
    ]
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up': return <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />;
    case 'down': return <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />;
    case 'stable': return <div className="w-4 h-4 bg-gray-500 rounded-full" />;
    default: return <div className="w-4 h-4 bg-gray-500 rounded-full" />;
  }
};

export default function AnalyticsPage() {
  const [selectedTab, setSelectedTab] = useState('roi');

  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-6 px-4 lg:px-0 mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-white tracking-tight">Strategic Analytics Command Center</h1>
            <p className="text-gray-400 mt-2">Executive intelligence and business performance insights</p>
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
                    <p className="text-gray-400 text-xs font-medium">Strategic Business Intelligence</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs font-medium">Active Analytics</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-500">{analyticsData.roiAnalysis.totalROI}%</div>
                    <div className="text-gray-400 text-xs font-medium">Total ROI</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-500">{analyticsData.teamPerformance.currentUtilization}%</div>
                    <div className="text-gray-400 text-xs font-medium">Team Utilization</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-500">{analyticsData.clientTrends.clientRetention}%</div>
                    <div className="text-gray-400 text-xs font-medium">Client Retention</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-500">{analyticsData.regulatoryImpact.highImpact}</div>
                    <div className="text-gray-400 text-xs font-medium">High Impact Regs</div>
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
              <Tab key="roi" title="ROI Analysis">
                <div className="space-y-6">
                  {/* Executive ROI Dashboard */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl border border-blue-500/30">
                      <CardBody className="p-6 text-center">
                        <div className="text-3xl font-bold text-blue-400 mb-2">{formatCurrency(analyticsData.roiAnalysis.platformInvestment)}</div>
                        <div className="text-gray-300 text-sm">Platform Investment</div>
                        <div className="text-blue-300 text-xs mt-1">Software + Staff Time</div>
                        <div className="mt-2 text-xs text-blue-200">6-Month Payback</div>
                      </CardBody>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl border border-green-500/30">
                      <CardBody className="p-6 text-center">
                        <div className="text-3xl font-bold text-green-400 mb-2">{formatCurrency(analyticsData.roiAnalysis.penaltiesPrevented)}</div>
                        <div className="text-gray-300 text-sm">Penalties Prevented</div>
                        <div className="text-green-300 text-xs mt-1">18 Major Incidents Avoided</div>
                        <div className="mt-2 text-xs text-green-200">+15.2% QoQ Growth</div>
                      </CardBody>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl border border-purple-500/30">
                      <CardBody className="p-6 text-center">
                        <div className="text-3xl font-bold text-purple-400 mb-2">{analyticsData.roiAnalysis.detailedROI.roiPercentage}%</div>
                        <div className="text-gray-300 text-sm">Total ROI</div>
                        <div className="text-purple-300 text-xs mt-1">176% Above Industry Avg</div>
                        <div className="mt-2 text-xs text-purple-200">95th Percentile</div>
                      </CardBody>
                    </Card>
                    <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-xl border border-orange-500/30">
                      <CardBody className="p-6 text-center">
                        <div className="text-3xl font-bold text-orange-400 mb-2">{analyticsData.roiAnalysis.detailedROI.annualizedReturn}%</div>
                        <div className="text-gray-300 text-sm">Annualized Return</div>
                        <div className="text-orange-300 text-xs mt-1">Projected Performance</div>
                        <div className="mt-2 text-xs text-orange-200">87% Confidence</div>
                      </CardBody>
                    </Card>
                  </div>

                  {/* Advanced ROI Metrics */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Cost-Benefit Analysis */}
                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                      <CardHeader>
                        <h3 className="text-white font-semibold text-lg">Cost-Benefit Analysis</h3>
                      </CardHeader>
                      <CardBody>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-white font-medium mb-3">Investment Breakdown</h4>
                            <div className="space-y-2">
                              {Object.entries(analyticsData.roiAnalysis.costBreakdown).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-center">
                                  <span className="text-gray-400 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                  <span className="text-white font-semibold">{formatCurrency(value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="border-t border-white/10 pt-4">
                            <h4 className="text-white font-medium mb-3">Value Creation</h4>
                            <div className="space-y-2">
                              {Object.entries(analyticsData.roiAnalysis.valueBreakdown).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-center">
                                  <span className="text-gray-400 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                  <span className="text-green-400 font-semibold">{formatCurrency(value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    {/* Performance Benchmarking */}
                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                      <CardHeader>
                        <h3 className="text-white font-semibold text-lg">Performance Benchmarking</h3>
                      </CardHeader>
                      <CardBody>
                        <div className="space-y-4">
                          <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="text-2xl font-bold text-green-500 mb-2">{analyticsData.roiAnalysis.benchmarking.percentile}th</div>
                            <div className="text-gray-400 text-sm">Industry Percentile</div>
                            <div className="text-green-400 text-xs mt-1">Top 5% Performance</div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-sm">Industry Average</span>
                              <span className="text-gray-300">{analyticsData.roiAnalysis.benchmarking.industryAverage}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-sm">Top Quartile</span>
                              <span className="text-blue-400">{analyticsData.roiAnalysis.benchmarking.topQuartile}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-sm">Our Performance</span>
                              <span className="text-green-500 font-bold">{analyticsData.roiAnalysis.benchmarking.ourPerformance}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-sm">Competitive Advantage</span>
                              <span className="text-purple-500 font-bold">+{analyticsData.roiAnalysis.benchmarking.competitiveAdvantage}%</span>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>

                  {/* Trend Analysis & Forecasting */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Monthly Trend Analysis */}
                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                      <CardHeader>
                        <h3 className="text-white font-semibold text-lg">Monthly ROI Trend Analysis</h3>
                      </CardHeader>
                      <CardBody>
                        <div className="space-y-4">
                          {analyticsData.roiAnalysis.trendAnalysis.monthly.map((month, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                              <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <div>
                                  <div className="text-white font-medium">{month.month}</div>
                                  <div className="text-gray-400 text-xs">ROI: {month.roi}%</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-green-500 font-semibold">{formatCurrency(month.penalties)}</div>
                                <div className="text-gray-400 text-xs">Efficiency: {month.efficiency}%</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardBody>
                    </Card>

                    {/* Quarterly Performance */}
                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                      <CardHeader>
                        <h3 className="text-white font-semibold text-lg">Quarterly Performance</h3>
                      </CardHeader>
                      <CardBody>
                        <div className="space-y-4">
                          {analyticsData.roiAnalysis.trendAnalysis.quarterly.map((quarter, index) => (
                            <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-white font-medium">{quarter.quarter}</h4>
                                <Chip size="sm" className="bg-green-500/20 text-green-400 border-0">
                                  {quarter.roi}% ROI
                                </Chip>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <div className="text-lg font-bold text-blue-500">+{quarter.growth}%</div>
                                  <div className="text-gray-400 text-xs">Growth Rate</div>
                                </div>
                                <div>
                                  <div className="text-lg font-bold text-purple-500">{quarter.clients}</div>
                                  <div className="text-gray-400 text-xs">Active Clients</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardBody>
                    </Card>
                  </div>

                  {/* Scenario Modeling & Predictive Analytics */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Scenario Modeling */}
                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                      <CardHeader>
                        <h3 className="text-white font-semibold text-lg">Scenario Modeling</h3>
                      </CardHeader>
                      <CardBody>
                        <div className="space-y-4">
                          {Object.entries(analyticsData.roiAnalysis.scenarioModeling).map(([scenario, data]) => (
                            <div key={scenario} className={`p-4 rounded-xl border ${
                              scenario === 'realistic' ? 'bg-green-500/10 border-green-500/30' :
                              scenario === 'optimistic' ? 'bg-blue-500/10 border-blue-500/30' :
                              'bg-yellow-500/10 border-yellow-500/30'
                            }`}>
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-white font-medium capitalize">{scenario} Scenario</h4>
                                <Chip size="sm" className={`${
                                  scenario === 'realistic' ? 'bg-green-500/20 text-green-400' :
                                  scenario === 'optimistic' ? 'bg-blue-500/20 text-blue-400' :
                                  'bg-yellow-500/20 text-yellow-400'
                                } border-0`}>
                                  {data.roi}% ROI
                                </Chip>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <div className="text-lg font-bold text-white">{formatCurrency(data.penalties)}</div>
                                  <div className="text-gray-400 text-xs">Penalties Prevented</div>
                                </div>
                                <div>
                                  <div className="text-lg font-bold text-white">+{data.growth}%</div>
                                  <div className="text-gray-400 text-xs">Growth Rate</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardBody>
                    </Card>

                    {/* Predictive Analytics */}
                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                      <CardHeader>
                        <h3 className="text-white font-semibold text-lg">Predictive Analytics</h3>
                      </CardHeader>
                      <CardBody>
                        <div className="space-y-4">
                          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-white font-medium">Next Quarter Forecast</h4>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-green-400 text-xs">{analyticsData.roiAnalysis.predictiveAnalytics.confidence}% Confidence</span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-lg font-bold text-green-500">{analyticsData.roiAnalysis.predictiveAnalytics.nextQuarter.roi}%</div>
                                <div className="text-gray-400 text-xs">Projected ROI</div>
                              </div>
                              <div>
                                <div className="text-lg font-bold text-blue-500">{formatCurrency(analyticsData.roiAnalysis.predictiveAnalytics.nextQuarter.penalties)}</div>
                                <div className="text-gray-400 text-xs">Penalties Prevented</div>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-white font-medium">Annual Projection</h4>
                              <Chip size="sm" className="bg-purple-500/20 text-purple-400 border-0">
                                Long-term
                              </Chip>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-lg font-bold text-purple-500">{analyticsData.roiAnalysis.predictiveAnalytics.nextYear.roi}%</div>
                                <div className="text-gray-400 text-xs">Annual ROI</div>
                              </div>
                              <div>
                                <div className="text-lg font-bold text-orange-500">{formatCurrency(analyticsData.roiAnalysis.predictiveAnalytics.nextYear.penalties)}</div>
                                <div className="text-gray-400 text-xs">Total Value</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>

                  {/* Strategic Business Impact */}
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                    <CardHeader>
                      <h3 className="text-white font-semibold text-lg">Strategic Business Impact Analysis</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                          <ChartBarIcon className="w-8 h-8 text-green-500 mx-auto mb-3" />
                          <div className="text-2xl font-bold text-green-500 mb-2">+{analyticsData.roiAnalysis.premiumPricing}%</div>
                          <div className="text-gray-400 text-sm">Premium Pricing Capability</div>
                          <div className="text-green-400 text-xs mt-1">Regional Expertise Recognition</div>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                          <CheckCircleIcon className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                          <div className="text-2xl font-bold text-blue-500 mb-2">+{analyticsData.roiAnalysis.referralGeneration}</div>
                          <div className="text-gray-400 text-sm">Referral Generation</div>
                          <div className="text-blue-400 text-xs mt-1">New Clients from Portfolio</div>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                          <ClockIcon className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                          <div className="text-2xl font-bold text-purple-500 mb-2">{analyticsData.roiAnalysis.regionalLeadership}%</div>
                          <div className="text-gray-400 text-sm">Regional Market Leadership</div>
                          <div className="text-purple-400 text-xs mt-1">Professional Reputation</div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Tab>

              <Tab key="team" title="Team Performance">
                <div className="space-y-6">
                  {/* Team Overview Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                      <CardBody className="p-6 text-center">
                        <div className="text-3xl font-bold text-blue-500 mb-2">{analyticsData.teamPerformance.teamCapacity}</div>
                        <div className="text-gray-400 text-sm">Team Capacity</div>
                        <div className="text-blue-400 text-xs mt-1">Maximum Clients</div>
                      </CardBody>
                    </Card>
                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                      <CardBody className="p-6 text-center">
                        <div className="text-3xl font-bold text-green-500 mb-2">{analyticsData.teamPerformance.currentUtilization}%</div>
                        <div className="text-gray-400 text-sm">Utilization Rate</div>
                        <div className="text-green-400 text-xs mt-1">Optimal Performance</div>
                      </CardBody>
                    </Card>
                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                      <CardBody className="p-6 text-center">
                        <div className="text-3xl font-bold text-purple-500 mb-2">{analyticsData.teamPerformance.clientSatisfaction}%</div>
                        <div className="text-gray-400 text-sm">Client Satisfaction</div>
                        <div className="text-purple-400 text-xs mt-1">Above Industry Avg</div>
                      </CardBody>
                    </Card>
                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                      <CardBody className="p-6 text-center">
                        <div className="text-3xl font-bold text-orange-500 mb-2">{analyticsData.teamPerformance.certificationRate}%</div>
                        <div className="text-gray-400 text-sm">Certification Rate</div>
                        <div className="text-orange-400 text-xs mt-1">Nexus Certified</div>
                      </CardBody>
                    </Card>
                  </div>

                  {/* Individual Performance Profiles */}
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                    <CardHeader>
                      <h3 className="text-white font-semibold text-lg">Individual Performance Profiles</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="space-y-4">
                        {analyticsData.teamPerformance.taxManagers.map((manager, index) => (
                          <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="text-white font-medium text-lg">{manager.name}</h4>
                                <p className="text-gray-400 text-sm">Tax Manager</p>
                              </div>
                              <div className="flex space-x-4">
                                <div className="text-center">
                                  <div className="text-lg font-bold text-blue-500">{manager.clients}</div>
                                  <div className="text-gray-400 text-xs">Clients</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg font-bold text-green-500">{manager.satisfaction}%</div>
                                  <div className="text-gray-400 text-xs">Satisfaction</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg font-bold text-purple-500">{formatCurrency(manager.penaltiesPrevented)}</div>
                                  <div className="text-gray-400 text-xs">Prevented</div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-400 text-sm">Specializations:</span>
                              {manager.specializations.map((spec, idx) => (
                                <Chip key={idx} size="sm" className="bg-blue-500/20 text-blue-400 border-0">
                                  {spec}
                                </Chip>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>

                  {/* Capacity Planning Analysis */}
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                    <CardHeader>
                      <h3 className="text-white font-semibold text-lg">Capacity Planning Analysis</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <h4 className="text-white font-medium mb-3">Current Portfolio</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Current Clients</span>
                                <span className="text-white font-semibold">{analyticsData.teamPerformance.capacityProjection.currentClients}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Projected Growth</span>
                                <span className="text-green-500 font-semibold">+{analyticsData.teamPerformance.capacityProjection.projectedGrowth}</span>
                              </div>
                              <Progress 
                                value={(analyticsData.teamPerformance.capacityProjection.currentClients / analyticsData.teamPerformance.teamCapacity) * 100}
                                className="w-full mt-2"
                                classNames={{
                                  track: "bg-gray-700",
                                  indicator: "bg-blue-500"
                                }}
                              />
                            </div>
                          </div>
                          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <h4 className="text-white font-medium mb-3">Hiring Requirements</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Capacity Gap</span>
                                <span className="text-orange-500 font-semibold">{analyticsData.teamPerformance.capacityProjection.capacityGap} Tax Manager</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Timeline</span>
                                <span className="text-white font-semibold">{analyticsData.teamPerformance.capacityProjection.hiringTimeline}</span>
                              </div>
                              <div className="mt-3">
                                <Chip size="sm" className="bg-orange-500/20 text-orange-400 border-0">
                                  URGENT HIRING NEED
                                </Chip>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Tab>

              <Tab key="clients" title="Client Trends">
                <div className="space-y-6">
                  {/* Key Metrics Dashboard */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                      <CardBody className="p-6 text-center">
                        <div className="flex items-center justify-center mb-2">
                          {getTrendIcon('up')}
                        </div>
                        <div className="text-3xl font-bold text-green-500 mb-2">+{analyticsData.clientTrends.revenueGrowth}%</div>
                        <div className="text-gray-400 text-sm">Revenue Growth</div>
                        <div className="text-green-400 text-xs mt-1">YoY Performance</div>
                      </CardBody>
                    </Card>
                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                      <CardBody className="p-6 text-center">
                        <div className="flex items-center justify-center mb-2">
                          {getTrendIcon('up')}
                        </div>
                        <div className="text-3xl font-bold text-blue-500 mb-2">{analyticsData.clientTrends.clientRetention}%</div>
                        <div className="text-gray-400 text-sm">Client Retention</div>
                        <div className="text-blue-400 text-xs mt-1">vs 89% Industry Avg</div>
                      </CardBody>
                    </Card>
                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                      <CardBody className="p-6 text-center">
                        <div className="flex items-center justify-center mb-2">
                          {getTrendIcon('up')}
                        </div>
                        <div className="text-3xl font-bold text-purple-500 mb-2">{formatCurrency(analyticsData.clientTrends.averageClientValue)}</div>
                        <div className="text-gray-400 text-sm">Avg Client Value</div>
                        <div className="text-purple-400 text-xs mt-1">Annual Revenue</div>
                      </CardBody>
                    </Card>
                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                      <CardBody className="p-6 text-center">
                        <div className="flex items-center justify-center mb-2">
                          {getTrendIcon('up')}
                        </div>
                        <div className="text-3xl font-bold text-orange-500 mb-2">+{analyticsData.clientTrends.newClientAcquisition}</div>
                        <div className="text-gray-400 text-sm">New Clients</div>
                        <div className="text-orange-400 text-xs mt-1">This Quarter</div>
                      </CardBody>
                    </Card>
                  </div>

                  {/* Client Portfolio Segmentation */}
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                    <CardHeader>
                      <h3 className="text-white font-semibold text-lg">Client Portfolio Segmentation</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="text-2xl font-bold text-green-500 mb-2">{analyticsData.clientTrends.portfolioSegmentation.highValue}</div>
                          <div className="text-gray-400 text-sm">High Value Clients</div>
                          <div className="text-green-400 text-xs mt-1">Premium Services</div>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="text-2xl font-bold text-blue-500 mb-2">{analyticsData.clientTrends.portfolioSegmentation.mediumValue}</div>
                          <div className="text-gray-400 text-sm">Medium Value Clients</div>
                          <div className="text-blue-400 text-xs mt-1">Standard Services</div>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="text-2xl font-bold text-purple-500 mb-2">{analyticsData.clientTrends.portfolioSegmentation.standardValue}</div>
                          <div className="text-gray-400 text-sm">Standard Clients</div>
                          <div className="text-purple-400 text-xs mt-1">Basic Services</div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Tab>

              <Tab key="regulatory" title="Regulatory Impact">
                <div className="space-y-6">
                  {/* Regulatory Impact Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                      <CardBody className="p-6 text-center">
                        <div className="text-3xl font-bold text-red-500 mb-2">{analyticsData.regulatoryImpact.highImpact}</div>
                        <div className="text-gray-400 text-sm">High Impact</div>
                        <div className="text-red-400 text-xs mt-1">Immediate Action Required</div>
                      </CardBody>
                    </Card>
                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                      <CardBody className="p-6 text-center">
                        <div className="text-3xl font-bold text-yellow-500 mb-2">{analyticsData.regulatoryImpact.mediumImpact}</div>
                        <div className="text-gray-400 text-sm">Medium Impact</div>
                        <div className="text-yellow-400 text-xs mt-1">Monitor Closely</div>
                      </CardBody>
                    </Card>
                    <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                      <CardBody className="p-6 text-center">
                        <div className="text-3xl font-bold text-green-500 mb-2">{analyticsData.regulatoryImpact.lowImpact}</div>
                        <div className="text-gray-400 text-sm">Low Impact</div>
                        <div className="text-green-400 text-xs mt-1">Routine Monitoring</div>
                      </CardBody>
                    </Card>
                  </div>

                  {/* Regulatory Impact Assessment */}
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                    <CardHeader>
                      <h3 className="text-white font-semibold text-lg">Regulatory Impact Assessment</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="space-y-4">
                        {analyticsData.regulatoryImpact.regulations.map((regulation, index) => (
                          <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="text-white font-medium">{regulation.name}</h4>
                                <p className="text-gray-400 text-sm">{regulation.clientsAffected} clients affected</p>
                              </div>
                              <Chip 
                                size="sm" 
                                className={`${
                                  regulation.impact === 'high' ? 'bg-red-500/20 text-red-500' :
                                  regulation.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                                  'bg-green-500/20 text-green-500'
                                } border-0`}
                              >
                                {regulation.impact.toUpperCase()}
                              </Chip>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="text-center">
                                <div className="text-lg font-bold text-orange-500">{formatCurrency(regulation.implementationCost)}</div>
                                <div className="text-gray-400 text-xs">Implementation Cost</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-green-500">{formatCurrency(regulation.clientValue)}</div>
                                <div className="text-gray-400 text-xs">Client Value</div>
                              </div>
                              <div className="text-center">
                                <Chip 
                                  size="sm" 
                                  className={`${
                                    regulation.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                                    regulation.status === 'in_progress' ? 'bg-blue-500/20 text-blue-500' :
                                    'bg-yellow-500/20 text-yellow-500'
                                  } border-0`}
                                >
                                  {regulation.status.replace('_', ' ').toUpperCase()}
                                </Chip>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
