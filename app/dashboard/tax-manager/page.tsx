"use client";
import React from "react";
import dynamic from "next/dynamic";
import { TableWrapper } from "@/components/table/table";
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import NextLink from "next/link";

const USStatesMap = dynamic(
  () => import("@/components/charts/us-states-map").then((mod) => mod.default),
  {
    ssr: false,
  }
);

// Tax Manager specific cards with Apple design
const CardActiveAlerts = () => (
  <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm tracking-tight">Active Alerts</h3>
          <p className="text-gray-400 text-xs font-medium">Critical notifications</p>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-white">8</span>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-red-400 text-sm font-medium">+2 new</span>
        </div>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1">
        <div className="bg-red-500 h-1 rounded-full" style={{width: '75%'}}></div>
      </div>
    </div>
  </div>
);

const CardThresholdMonitoring = () => (
  <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm tracking-tight">Threshold Monitoring</h3>
          <p className="text-gray-400 text-xs font-medium">Approaching limits</p>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-white">23</span>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          <span className="text-orange-400 text-sm font-medium">+5 approaching</span>
        </div>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1">
        <div className="bg-orange-500 h-1 rounded-full" style={{width: '60%'}}></div>
      </div>
    </div>
  </div>
);

const CardResolvedToday = () => (
  <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm tracking-tight">Resolved Today</h3>
          <p className="text-gray-400 text-xs font-medium">Completed tasks</p>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-white">15</span>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-green-400 text-sm font-medium">+3 vs yesterday</span>
        </div>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1">
        <div className="bg-green-500 h-1 rounded-full" style={{width: '85%'}}></div>
      </div>
    </div>
  </div>
);

const CardPriorityAlerts = () => (
  <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-white font-semibold text-lg tracking-tight">Priority Alerts</h3>
      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
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
              <p className="font-medium text-white text-sm">TechCorp Inc - California</p>
              <p className="text-xs text-red-400">$850K sales, 15 days to register</p>
            </div>
          </div>
          <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
            CRITICAL
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
              <p className="font-medium text-white text-sm">RetailPlus LLC - Texas</p>
              <p className="text-xs text-orange-400">$600K sales, approaching threshold</p>
            </div>
          </div>
          <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
            HIGH
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
              <p className="font-medium text-white text-sm">ServiceCo - New York</p>
              <p className="text-xs text-blue-400">Registration completed, awaiting confirmation</p>
            </div>
          </div>
          <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
            PENDING
          </span>
        </div>
      </div>
    </div>
  </div>
);

const CardStateAnalysis = () => (
  <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-white font-semibold text-lg tracking-tight">State Analysis</h3>
      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
    </div>
    <div className="space-y-4">
      <div className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium text-sm">California</span>
          <span className="text-red-400 text-sm font-medium">3 alerts</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <div className="bg-red-500 h-1.5 rounded-full transition-all duration-500" style={{width: '75%'}}></div>
        </div>
      </div>
      <div className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium text-sm">Texas</span>
          <span className="text-orange-400 text-sm font-medium">2 alerts</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <div className="bg-orange-500 h-1.5 rounded-full transition-all duration-500" style={{width: '50%'}}></div>
        </div>
      </div>
      <div className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium text-sm">New York</span>
          <span className="text-green-400 text-sm font-medium">1 alert</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{width: '25%'}}></div>
        </div>
      </div>
      <div className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium text-sm">Florida</span>
          <span className="text-green-400 text-sm font-medium">0 alerts</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{width: '10%'}}></div>
        </div>
      </div>
    </div>
  </div>
);

// Nexus Activity Table Component
const NexusActivityTable = () => {
  const nexusActivities = [
    {
      time: "2 hours ago",
      client: "TechCorp SaaS",
      activity: "Threshold Exceeded",
      activityDetail: "Revenue: $525K > $500K",
      state: "CA",
      impact: "$25K exposure",
      impactDetail: "Registration req'd",
      status: "Critical",
      user: "System"
    },
    {
      time: "4 hours ago",
      client: "RetailChain",
      activity: "Data Processed",
      activityDetail: "Q4 sales allocation",
      state: "NY",
      impact: "Quality: 95%",
      impactDetail: "Threshold: 78%",
      status: "Complete",
      user: "S.Johnson"
    },
    {
      time: "Yesterday 3:45 PM",
      client: "StartupInc",
      activity: "Professional Decision",
      activityDetail: "Advisory consultation",
      state: "TX",
      impact: "Monitor status",
      impactDetail: "No action needed",
      status: "Resolved",
      user: "J.Doe"
    },
    {
      time: "Yesterday 1:20 PM",
      client: "ManufacturingCo",
      activity: "Approaching Threshold",
      activityDetail: "Revenue trend analysis",
      state: "FL",
      impact: "$15K from limit",
      impactDetail: "Monitor Q1 2025",
      status: "Warning",
      user: "System"
    },
    {
      time: "Nov 20 4:15 PM",
      client: "ServicesCorp",
      activity: "Client Data Upload",
      activityDetail: "Q4 financial statements",
      state: "WA",
      impact: "Processing required",
      impactDetail: "B&O tax implications",
      status: "Pending",
      user: "Client"
    },
    {
      time: "Nov 20 10:30 AM",
      client: "TechCorp SaaS",
      activity: "Regulation Update Applied",
      activityDetail: "Marketplace sales rules",
      state: "CA",
      impact: "AB 234 rule change",
      impactDetail: "Recalc required",
      status: "Applied",
      user: "System"
    },
    {
      time: "Nov 19 2:10 PM",
      client: "RetailChain",
      activity: "Alert Escalated",
      activityDetail: "Revenue + transaction",
      state: "NY",
      impact: "Combined threshold",
      impactDetail: "Partner review",
      status: "Escalated",
      user: "T.Manager"
    },
    {
      time: "Nov 19 11:45 AM",
      client: "LocalBusiness",
      activity: "Nexus Registration",
      activityDetail: "Proactive compliance",
      state: "CO",
      impact: "Voluntary disclosure",
      impactDetail: "Penalty avoided",
      status: "Complete",
      user: "J.Doe"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'critical': return 'text-danger';
      case 'warning': return 'text-warning';
      case 'complete': return 'text-success';
      case 'resolved': return 'text-success';
      case 'pending': return 'text-primary';
      case 'applied': return 'text-secondary';
      case 'escalated': return 'text-danger';
      default: return 'text-default';
    }
  };

  return (
    <div className="w-full">
      <Table aria-label="Recent Nexus Activity">
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
          {nexusActivities.map((activity, index) => (
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

export default function TaxManagerDashboard() {
  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-6">
        <div className="flex justify-center gap-6 xl:gap-8 pt-6 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-12 max-w-[90rem] mx-auto w-full">
          <div className="mt-6 gap-8 flex flex-col w-full">
            {/* Card Section Top */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Nexus Monitoring Overview</h2>
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-6 justify-center w-full">
                <CardActiveAlerts />
                <CardThresholdMonitoring />
                <CardResolvedToday />
              </div>
            </div>

            {/* U.S. States Map */}
            <div className="h-full flex flex-col gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-8 bg-green-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Nexus Client Distribution Map</h2>
              </div>
              <div className="w-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                <USStatesMap />
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="mt-4 gap-6 flex flex-col xl:max-w-md w-full">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-8 bg-orange-500 rounded-full"></div>
              <h2 className="text-2xl font-semibold text-white tracking-tight">Alert Management</h2>
            </div>
            <div className="flex flex-col justify-center gap-6 flex-wrap md:flex-nowrap md:flex-col">
              <CardPriorityAlerts />
              <CardStateAnalysis />
            </div>
          </div>
        </div>

        {/* Table Recent Nexus Activity */}
        <div className="flex flex-col justify-center w-full py-8 px-4 lg:px-0 max-w-[90rem] mx-auto gap-6">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
              <h2 className="text-2xl font-semibold text-white tracking-tight">Recent Nexus Activity</h2>
            </div>
            <Link
              href="/dashboard/tax-manager/alerts"
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
            <NexusActivityTable />
          </div>
        </div>
      </div>
    </div>
  );
}
