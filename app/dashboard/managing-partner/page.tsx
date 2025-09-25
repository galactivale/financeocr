"use client";
import React, { useState, useMemo } from "react";
import { TableWrapper } from "@/components/table/table";
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import NextLink from "next/link";
import { USAMap, USAStateAbbreviation, StateAbbreviations } from '@mirawision/usa-map-react';

// Firm-wide nexus data for states - Only highlighting 4 key states for cleaner appearance
const firmNexusData = {
  'CA': { status: 'critical', clients: 25, revenue: 4850000, alerts: 8 },
  'TX': { status: 'warning', clients: 18, revenue: 2200000, alerts: 5 },
  'NY': { status: 'pending', clients: 22, revenue: 3200000, alerts: 3 },
  'FL': { status: 'compliant', clients: 12, revenue: 1500000, alerts: 1 }
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
      const data = firmNexusData[state as keyof typeof firmNexusData];
      
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
          case 'critical':
            fillColor = '#ef4444';
            strokeColor = '#dc2626';
            break;
          case 'warning':
            fillColor = '#f59e0b';
            strokeColor = '#d97706';
            break;
          case 'pending':
            fillColor = '#3b82f6';
            strokeColor = '#2563eb';
            break;
          case 'compliant':
            fillColor = '#10b981';
            strokeColor = '#059669';
            break;
          case 'transit':
            fillColor = '#06b6d4';
            strokeColor = '#0891b2';
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
        // Default styling for states without nexus data
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
        <h4 className="text-white font-medium text-sm mb-3">Firm Status Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-white text-xs">Critical</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-white text-xs">Warning</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-white text-xs">Pending</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-white text-xs">Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Managing Partner specific cards with Apple design
const CardTotalExposure = () => (
  <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm tracking-tight">Total Exposure</h3>
          <p className="text-gray-400 text-xs font-medium">Firm-wide risk</p>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-white">$2.4M</span>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-red-400 text-sm font-medium">+2.5%</span>
        </div>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1">
        <div className="bg-red-500 h-1 rounded-full" style={{width: '85%'}}></div>
      </div>
    </div>
  </div>
);

const CardCriticalAlerts = () => (
  <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm tracking-tight">Critical Alerts</h3>
          <p className="text-gray-400 text-xs font-medium">Requiring attention</p>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-white">12</span>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          <span className="text-orange-400 text-sm font-medium">+3 new</span>
        </div>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1">
        <div className="bg-orange-500 h-1 rounded-full" style={{width: '70%'}}></div>
      </div>
    </div>
  </div>
);

const CardComplianceRate = () => (
  <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm tracking-tight">Compliance Rate</h3>
          <p className="text-gray-400 text-xs font-medium">Firm performance</p>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-white">94.2%</span>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-green-400 text-sm font-medium">+1.2%</span>
        </div>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1">
        <div className="bg-green-500 h-1 rounded-full" style={{width: '94%'}}></div>
      </div>
    </div>
  </div>
);

const CardExecutiveSummary = () => (
  <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-white font-semibold text-lg tracking-tight">Executive Summary</h3>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
    </div>
    <div className="space-y-3">
      <div className="group bg-red-500/10 backdrop-blur-sm rounded-xl border border-red-500/20 p-4 hover:bg-red-500/15 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-white text-sm">ABC Corp - California Threshold</p>
              <p className="text-xs text-red-400">$1.2M exposure, immediate action required</p>
            </div>
          </div>
          <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
            URGENT
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
              <p className="font-medium text-white text-sm">Texas Rule Change Impact</p>
              <p className="text-xs text-orange-400">15 clients affected by new nexus rules</p>
            </div>
          </div>
          <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
            HIGH
          </span>
        </div>
      </div>
    </div>
  </div>
);

const CardRecentDecisions = () => (
  <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-white font-semibold text-lg tracking-tight">Recent Executive Decisions</h3>
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
    </div>
    <div className="space-y-3">
      <div className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-white text-sm">XYZ Industries - Registration</p>
            <p className="text-xs text-gray-400">Approved immediate registration in 3 states</p>
          </div>
          <span className="text-xs text-gray-400">2h ago</span>
        </div>
      </div>
      <div className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-white text-sm">Risk Assessment Review</p>
            <p className="text-xs text-gray-400">Updated firm-wide exposure analysis</p>
          </div>
          <span className="text-xs text-gray-400">1d ago</span>
        </div>
      </div>
      <div className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-white text-sm">Team Performance Review</p>
            <p className="text-xs text-gray-400">Q3 compliance metrics reviewed</p>
          </div>
          <span className="text-xs text-gray-400">3d ago</span>
        </div>
      </div>
    </div>
  </div>
);

// Firm Activity Table Component
const FirmActivityTable = () => {
  const firmActivities = [
    {
      time: "2 hours ago",
      client: "ABC Corp",
      activity: "Executive Decision Required",
      activityDetail: "California threshold exceeded",
      state: "CA",
      impact: "$1.2M exposure",
      impactDetail: "Immediate action needed",
      status: "Critical",
      user: "Managing Partner"
    },
    {
      time: "4 hours ago",
      client: "XYZ Industries",
      activity: "Registration Approved",
      activityDetail: "Multi-state compliance",
      state: "TX",
      impact: "3 states registered",
      impactDetail: "Risk mitigated",
      status: "Complete",
      user: "Executive Team"
    },
    {
      time: "Yesterday 3:45 PM",
      client: "TechCorp SaaS",
      activity: "Risk Assessment",
      activityDetail: "Firm-wide exposure review",
      state: "NY",
      impact: "Portfolio analysis",
      impactDetail: "Strategic planning",
      status: "Resolved",
      user: "Risk Committee"
    },
    {
      time: "Yesterday 1:20 PM",
      client: "ManufacturingCo",
      activity: "Compliance Review",
      activityDetail: "Q3 performance metrics",
      state: "FL",
      impact: "94.2% compliance",
      impactDetail: "Above target",
      status: "Complete",
      user: "Compliance Team"
    },
    {
      time: "Nov 20 4:15 PM",
      client: "ServicesCorp",
      activity: "Strategic Planning",
      activityDetail: "2025 compliance strategy",
      state: "WA",
      impact: "Resource allocation",
      impactDetail: "Budget approved",
      status: "Approved",
      user: "Executive Board"
    },
    {
      time: "Nov 20 10:30 AM",
      client: "RetailChain",
      activity: "Regulatory Update",
      activityDetail: "Texas nexus rule changes",
      state: "TX",
      impact: "15 clients affected",
      impactDetail: "Action plan created",
      status: "In Progress",
      user: "Legal Team"
    },
    {
      time: "Nov 19 2:10 PM",
      client: "StartupInc",
      activity: "Partnership Review",
      activityDetail: "Client portfolio expansion",
      state: "CA",
      impact: "New market entry",
      impactDetail: "Growth opportunity",
      status: "Approved",
      user: "Business Development"
    },
    {
      time: "Nov 19 11:45 AM",
      client: "LocalBusiness",
      activity: "Performance Review",
      activityDetail: "Team efficiency metrics",
      state: "CO",
      impact: "Productivity +15%",
      impactDetail: "Target exceeded",
      status: "Complete",
      user: "HR Department"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'critical': return 'text-danger';
      case 'complete': return 'text-success';
      case 'resolved': return 'text-success';
      case 'approved': return 'text-success';
      case 'in progress': return 'text-primary';
      default: return 'text-default';
    }
  };

  return (
    <div className="w-full">
      <Table aria-label="Recent Firm Activity">
        <TableHeader>
          <TableColumn>TIME</TableColumn>
          <TableColumn>CLIENT</TableColumn>
          <TableColumn>ACTIVITY</TableColumn>
          <TableColumn>STATE</TableColumn>
          <TableColumn>IMPACT</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>USER</TableColumn>
        </TableHeader>
        <TableBody>
          {firmActivities.map((activity, index) => (
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
                  {activity.state}
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
                <CardTotalExposure />
                <CardCriticalAlerts />
                <CardComplianceRate />
              </div>
            </div>

            {/* U.S. States Map */}
            <div className="h-full flex flex-col gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-8 bg-green-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Firm Client Distribution Map</h2>
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
              <h2 className="text-2xl font-semibold text-white tracking-tight">Executive Actions</h2>
            </div>
            <div className="flex flex-col justify-center gap-6 flex-wrap md:flex-nowrap md:flex-col">
              <CardExecutiveSummary />
              <CardRecentDecisions />
            </div>
          </div>
        </div>

        {/* Table Recent Firm Activity */}
        <div className="flex flex-col justify-center w-full py-8 px-4 lg:px-0 max-w-[90rem] mx-auto gap-6">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
              <h2 className="text-2xl font-semibold text-white tracking-tight">Recent Firm Activity</h2>
            </div>
            <Link
              href="/dashboard/managing-partner/compliance"
              as={NextLink}
              className="group bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 px-4 py-2 text-white hover:bg-white/20 transition-all duration-200 hover:scale-105"
            >
              <span className="text-sm font-medium">View All</span>
              <svg className="w-4 h-4 ml-2 inline-block group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
            <FirmActivityTable />
          </div>
        </div>
      </div>
    </div>
  );
}