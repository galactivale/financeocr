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
    regionalLeadership: 96
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
                  {/* Executive ROI Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl border border-blue-500/30">
                      <CardBody className="p-6 text-center">
                        <div className="text-3xl font-bold text-blue-400 mb-2">{formatCurrency(analyticsData.roiAnalysis.platformInvestment)}</div>
                        <div className="text-gray-300 text-sm">Platform Investment</div>
                        <div className="text-blue-300 text-xs mt-1">Software + Staff Time</div>
                      </CardBody>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl border border-green-500/30">
                      <CardBody className="p-6 text-center">
                        <div className="text-3xl font-bold text-green-400 mb-2">{formatCurrency(analyticsData.roiAnalysis.penaltiesPrevented)}</div>
                        <div className="text-gray-300 text-sm">Penalties Prevented</div>
                        <div className="text-green-300 text-xs mt-1">18 Major Incidents Avoided</div>
                      </CardBody>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl border border-purple-500/30">
                      <CardBody className="p-6 text-center">
                        <div className="text-3xl font-bold text-purple-400 mb-2">{analyticsData.roiAnalysis.totalROI}%</div>
                        <div className="text-gray-300 text-sm">Total ROI</div>
                        <div className="text-purple-300 text-xs mt-1">176% Above Industry Avg</div>
                      </CardBody>
                    </Card>
                    <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-xl border border-orange-500/30">
                      <CardBody className="p-6 text-center">
                        <div className="text-3xl font-bold text-orange-400 mb-2">{analyticsData.roiAnalysis.paybackPeriod} Years</div>
                        <div className="text-gray-300 text-sm">Payback Period</div>
                        <div className="text-orange-300 text-xs mt-1">6 Month Recovery</div>
                      </CardBody>
                    </Card>
                  </div>

                  {/* Financial Impact Analysis */}
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                    <CardHeader>
                      <h3 className="text-white font-semibold text-lg">Financial Impact Analysis</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="text-2xl font-bold text-green-500 mb-2">+{analyticsData.roiAnalysis.revenueGrowth}%</div>
                          <div className="text-gray-400 text-sm">Revenue Growth</div>
                          <div className="text-green-400 text-xs mt-1">Premium Pricing Capability</div>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="text-2xl font-bold text-blue-500 mb-2">+{analyticsData.roiAnalysis.operationalEfficiency}%</div>
                          <div className="text-gray-400 text-sm">Operational Efficiency</div>
                          <div className="text-blue-400 text-xs mt-1">Time Savings & Automation</div>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="text-2xl font-bold text-purple-500 mb-2">+{analyticsData.roiAnalysis.marketPosition}%</div>
                          <div className="text-gray-400 text-sm">Market Position</div>
                          <div className="text-purple-400 text-xs mt-1">Competitive Advantage</div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Strategic Business Impact */}
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                    <CardHeader>
                      <h3 className="text-white font-semibold text-lg">Strategic Business Impact</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="flex items-center space-x-3">
                            <ChartBarIcon className="w-5 h-5 text-green-500" />
                            <div>
                              <h4 className="text-white font-medium">Premium Pricing Capability</h4>
                              <p className="text-gray-400 text-sm">Regional nexus expertise recognition</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-green-500">+{analyticsData.roiAnalysis.premiumPricing}%</div>
                            <div className="text-gray-400 text-sm">Above Market Rates</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="flex items-center space-x-3">
                            <CheckCircleIcon className="w-5 h-5 text-blue-500" />
                            <div>
                              <h4 className="text-white font-medium">Referral Generation</h4>
                              <p className="text-gray-400 text-sm">New clients from existing portfolio</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-blue-500">+{analyticsData.roiAnalysis.referralGeneration}</div>
                            <div className="text-gray-400 text-sm">New Clients</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="flex items-center space-x-3">
                            <ClockIcon className="w-5 h-5 text-purple-500" />
                            <div>
                              <h4 className="text-white font-medium">Regional Market Leadership</h4>
                              <p className="text-gray-400 text-sm">Professional reputation and expertise</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-purple-500">{analyticsData.roiAnalysis.regionalLeadership}%</div>
                            <div className="text-gray-400 text-sm">Satisfaction Rate</div>
                          </div>
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
