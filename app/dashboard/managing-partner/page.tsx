"use client";
import React, { useState, useMemo } from "react";
import { TableWrapper } from "@/components/table/table";
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import NextLink from "next/link";
import { USAMap, USAStateAbbreviation, StateAbbreviations } from '@mirawision/usa-map-react';

// Firm performance data for states - Managing Partner perspective
const firmPerformanceData = {
  'CA': { status: 'excellent', clients: 45, revenue: 8500000, growth: 12.5 },
  'TX': { status: 'good', clients: 28, revenue: 4200000, growth: 8.2 },
  'NY': { status: 'excellent', clients: 38, revenue: 7200000, growth: 15.3 },
  'FL': { status: 'good', clients: 22, revenue: 3100000, growth: 6.8 },
  'WA': { status: 'warning', clients: 15, revenue: 1800000, growth: -2.1 },
  'IL': { status: 'good', clients: 18, revenue: 2500000, growth: 4.5 }
};

// Enhanced US Map Component for Managing Partner
const EnhancedUSMap = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const handleMapStateClick = (stateCode: string) => {
    if (selectedState === stateCode) {
      setSelectedState(null);
    } else {
      setSelectedState(stateCode);
    }
  };

  const customStates = useMemo(() => {
    const settings: any = {};

    StateAbbreviations.forEach((state) => {
      const data = firmPerformanceData[state as keyof typeof firmPerformanceData];
      
      // Always set label configuration for all states
      const labelConfig = {
        enabled: true,
        render: (stateAbbr: USAStateAbbreviation) => (
          <text 
            fontSize="14" 
            fill="white" 
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
            stroke="black"
            strokeWidth="0.5"
            paintOrder="stroke fill"
          >
            {stateAbbr}
          </text>
        ),
      };
      
      if (data) {
        let fillColor = '#374151';
        let strokeColor = '#6b7280';
        
        switch (data.status) {
          case 'excellent':
            fillColor = '#10b981';
            strokeColor = '#059669';
            break;
          case 'good':
            fillColor = '#3b82f6';
            strokeColor = '#2563eb';
            break;
          case 'warning':
            fillColor = '#f59e0b';
            strokeColor = '#d97706';
            break;
          case 'critical':
            fillColor = '#ef4444';
            strokeColor = '#dc2626';
            break;
        }
        
        if (selectedState === state) {
          strokeColor = '#3b82f6';
        }
        
        settings[state] = {
          fill: fillColor,
          stroke: selectedState === state ? '#60a5fa' : '#9ca3af',
          strokeWidth: selectedState === state ? 4 : 2,
          onClick: () => handleMapStateClick(state),
          onHover: () => {},
          onLeave: () => {},
          label: labelConfig,
        };
      } else {
        // Default styling for states without performance data
        settings[state] = {
          fill: '#374151',
          stroke: selectedState === state ? '#60a5fa' : '#9ca3af',
          strokeWidth: selectedState === state ? 4 : 2,
          onClick: () => handleMapStateClick(state),
          label: labelConfig,
        };
      }
    });

    return settings;
  }, [selectedState]);

  return (
    <div className="w-full h-full relative">
      <USAMap 
        customStates={customStates}
        hiddenStates={['AK', 'HI']}
        mapSettings={{
          width: '100%',
          height: '100%'
        }}
        className="w-full h-full"
        defaultState={{
          label: {
            enabled: true,
            render: (stateAbbr: USAStateAbbreviation) => (
              <text 
                fontSize="14" 
                fill="white" 
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
                stroke="black"
                strokeWidth="0.5"
                paintOrder="stroke fill"
              >
                {stateAbbr}
              </text>
            ),
          },
        }}
      />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-xl border border-white/10 p-4">
        <h4 className="text-white font-medium text-sm mb-3">Performance Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-white text-xs">Excellent</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-white text-xs">Good</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-white text-xs">Warning</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-white text-xs">Critical</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Managing Partner specific cards with Apple design
const CardRevenueGrowth = () => (
  <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm tracking-tight">Revenue Growth</h3>
          <p className="text-gray-400 text-xs font-medium">YTD performance</p>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-white">+18.2%</span>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-medium">+2.1% vs Q3</span>
        </div>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1">
        <div className="bg-green-500 h-1 rounded-full" style={{width: '82%'}}></div>
      </div>
    </div>
  </div>
);

const CardClientRetention = () => (
  <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm tracking-tight">Client Retention</h3>
          <p className="text-gray-400 text-xs font-medium">Annual rate</p>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-white">94.8%</span>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-blue-400 text-sm font-medium">+1.2% vs last year</span>
        </div>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1">
        <div className="bg-blue-500 h-1 rounded-full" style={{width: '95%'}}></div>
      </div>
    </div>
  </div>
);

const CardTeamPerformance = () => (
  <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm tracking-tight">Team Performance</h3>
          <p className="text-gray-400 text-xs font-medium">Productivity index</p>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-white">87.3</span>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span className="text-purple-400 text-sm font-medium">+3.1 vs target</span>
        </div>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1">
        <div className="bg-purple-500 h-1 rounded-full" style={{width: '87%'}}></div>
      </div>
    </div>
  </div>
);

const CardStrategicInitiatives = () => (
  <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-white font-semibold text-lg tracking-tight">Strategic Initiatives</h3>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
    </div>
      <div className="space-y-3">
      <div className="group bg-green-500/10 backdrop-blur-sm rounded-xl border border-green-500/20 p-4 hover:bg-green-500/15 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          <div>
              <p className="font-medium text-white text-sm">Digital Transformation</p>
              <p className="text-xs text-green-400">85% complete, on track for Q1</p>
            </div>
          </div>
          <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
            ON TRACK
          </span>
        </div>
      </div>
      <div className="group bg-blue-500/10 backdrop-blur-sm rounded-xl border border-blue-500/20 p-4 hover:bg-blue-500/15 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
          <div>
              <p className="font-medium text-white text-sm">Market Expansion</p>
              <p className="text-xs text-blue-400">Phase 2 planning in progress</p>
            </div>
          </div>
          <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
            PLANNING
          </span>
        </div>
      </div>
      <div className="group bg-orange-500/10 backdrop-blur-sm rounded-xl border border-orange-500/20 p-4 hover:bg-orange-500/15 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          <div>
              <p className="font-medium text-white text-sm">Talent Acquisition</p>
              <p className="text-xs text-orange-400">3 positions pending approval</p>
            </div>
          </div>
          <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
            PENDING
          </span>
        </div>
      </div>
    </div>
  </div>
);

const CardMarketAnalysis = () => (
  <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-white font-semibold text-lg tracking-tight">Market Analysis</h3>
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
    </div>
    <div className="space-y-4">
      <div className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium text-sm">California</span>
          <span className="text-green-400 text-sm font-medium">+12.5% growth</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{width: '85%'}}></div>
            </div>
          </div>
      <div className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium text-sm">New York</span>
          <span className="text-green-400 text-sm font-medium">+15.3% growth</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{width: '90%'}}></div>
            </div>
          </div>
      <div className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium text-sm">Texas</span>
          <span className="text-blue-400 text-sm font-medium">+8.2% growth</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" style={{width: '65%'}}></div>
            </div>
          </div>
      <div className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium text-sm">Washington</span>
          <span className="text-orange-400 text-sm font-medium">-2.1% decline</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <div className="bg-orange-500 h-1.5 rounded-full transition-all duration-500" style={{width: '25%'}}></div>
            </div>
          </div>
        </div>
      </div>
);

// Executive Activity Table Component
const ExecutiveActivityTable = () => {
  const executiveActivities = [
    {
      time: "2 hours ago",
      client: "TechCorp Global",
      activity: "Strategic Review",
      activityDetail: "Q4 performance analysis",
      region: "CA",
      impact: "$2.1M revenue",
      impactDetail: "15% growth target",
      status: "Completed",
      user: "M.Partner"
    },
    {
      time: "4 hours ago",
      client: "Enterprise Solutions",
      activity: "Partnership Agreement",
      activityDetail: "New market expansion",
      region: "NY",
      impact: "Strategic alliance",
      impactDetail: "3-year contract",
      status: "Approved",
      user: "M.Partner"
    },
    {
      time: "Yesterday 3:45 PM",
      client: "Regional Firm",
      activity: "Merger Discussion",
      activityDetail: "Due diligence phase",
      region: "TX",
      impact: "Market consolidation",
      impactDetail: "Pending review",
      status: "In Progress",
      user: "M.Partner"
    },
    {
      time: "Yesterday 1:20 PM",
      client: "Investment Group",
      activity: "Portfolio Review",
      activityDetail: "Risk assessment",
      region: "FL",
      impact: "$5M portfolio",
      impactDetail: "Diversification strategy",
      status: "Completed",
      user: "M.Partner"
    },
    {
      time: "Nov 20 4:15 PM",
      client: "Government Contract",
      activity: "Compliance Audit",
      activityDetail: "Annual review process",
      region: "WA",
      impact: "Regulatory compliance",
      impactDetail: "Zero findings",
      status: "Passed",
      user: "M.Partner"
    },
    {
      time: "Nov 20 10:30 AM",
      client: "International Corp",
      activity: "Tax Strategy",
      activityDetail: "Cross-border optimization",
      region: "CA",
      impact: "Tax efficiency",
      impactDetail: "15% savings achieved",
      status: "Implemented",
      user: "M.Partner"
    },
    {
      time: "Nov 19 2:10 PM",
      client: "Startup Accelerator",
      activity: "Investment Decision",
      activityDetail: "Series A funding",
      region: "NY",
      impact: "$500K investment",
      impactDetail: "Equity stake 8%",
      status: "Approved",
      user: "M.Partner"
    },
    {
      time: "Nov 19 11:45 AM",
      client: "Family Office",
      activity: "Estate Planning",
      activityDetail: "Multi-generational strategy",
      region: "IL",
      impact: "Wealth preservation",
      impactDetail: "Tax optimization",
      status: "Completed",
      user: "M.Partner"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-success';
      case 'approved': return 'text-success';
      case 'passed': return 'text-success';
      case 'implemented': return 'text-success';
      case 'in progress': return 'text-warning';
      case 'pending': return 'text-primary';
      default: return 'text-default';
    }
  };

  return (
    <div className="w-full">
      <Table aria-label="Executive Activity">
        <TableHeader>
          <TableColumn>TIME</TableColumn>
          <TableColumn>CLIENT</TableColumn>
          <TableColumn>ACTIVITY</TableColumn>
          <TableColumn>REGION</TableColumn>
          <TableColumn>IMPACT</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>USER</TableColumn>
        </TableHeader>
        <TableBody>
          {executiveActivities.map((activity, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="text-sm font-medium text-default-600">
                  {activity.time}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-semibold text-default-900">
                  {activity.client}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium text-default-900">
                    {activity.activity}
                  </div>
                  <div className="text-sm text-default-500">
                    {activity.activityDetail}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {activity.region}
                </span>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium text-default-900">
                    {activity.impact}
                  </div>
                  <div className="text-sm text-default-500">
                    {activity.impactDetail}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                  {activity.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="text-sm font-medium text-default-600">
                  {activity.user}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default function ManagingPartnerDashboard() {
  return (
    <div className="min-h-screen bg-black">
    <div className="h-full lg:px-6">
        <div className="flex justify-center gap-6 xl:gap-8 pt-6 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-12 max-w-[90rem] mx-auto w-full">
          <div className="mt-6 gap-8 flex flex-col w-full">
          {/* Card Section Top */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Executive Overview</h2>
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-6 justify-center w-full">
              <CardRevenueGrowth />
              <CardClientRetention />
              <CardTeamPerformance />
            </div>
          </div>

          {/* U.S. States Map */}
            <div className="h-full flex flex-col gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-8 bg-green-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Firm Performance Map</h2>
              </div>
              <div className="w-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                <EnhancedUSMap />
              </div>
          </div>
        </div>

        {/* Right Section */}
          <div className="mt-4 gap-6 flex flex-col xl:max-w-md w-full">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-8 bg-orange-500 rounded-full"></div>
              <h2 className="text-2xl font-semibold text-white tracking-tight">Strategic Management</h2>
            </div>
            <div className="flex flex-col justify-center gap-6 flex-wrap md:flex-nowrap md:flex-col">
            <CardStrategicInitiatives />
            <CardMarketAnalysis />
          </div>
        </div>
      </div>

      {/* Table Executive Activity */}
        <div className="flex flex-col justify-center w-full py-8 px-4 lg:px-0 max-w-[90rem] mx-auto gap-6">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
              <h2 className="text-2xl font-semibold text-white tracking-tight">Executive Activity</h2>
            </div>
          <Link
            href="/dashboard/managing-partner/analytics"
            as={NextLink}
              className="group bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 px-4 py-2 text-white hover:bg-white/20 transition-all duration-200 hover:scale-105"
          >
              <span className="text-sm font-medium">View Analytics</span>
              <svg className="w-4 h-4 ml-2 inline-block group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
          </Link>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
            <ExecutiveActivityTable />
          </div>
        </div>
      </div>
    </div>
  );
}