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

// Tax Manager specific cards
const CardActiveAlerts = () => (
  <Card className="xl:max-w-sm bg-default-50 flex flex-col w-full">
    <CardHeader className="flex flex-row !items-start !space-x-3 !space-y-0">
      <div className="flex flex-col">
        <p className="text-xs font-medium uppercase text-danger">Active Alerts</p>
        <p className="text-2xl font-bold">8</p>
      </div>
      <div className="text-danger">🚨</div>
    </CardHeader>
    <CardBody className="pt-0">
      <div className="flex gap-2">
        <span className="text-xs text-danger">+2</span>
        <span className="text-xs text-default-500">new today</span>
      </div>
    </CardBody>
  </Card>
);

const CardThresholdMonitoring = () => (
  <Card className="xl:max-w-sm bg-default-50 flex flex-col w-full">
    <CardHeader className="flex flex-row !items-start !space-x-3 !space-y-0">
      <div className="flex flex-col">
        <p className="text-xs font-medium uppercase text-warning">Threshold Monitoring</p>
        <p className="text-2xl font-bold">23</p>
      </div>
      <div className="text-warning">⏰</div>
    </CardHeader>
    <CardBody className="pt-0">
      <div className="flex gap-2">
        <span className="text-xs text-warning">+5</span>
        <span className="text-xs text-default-500">approaching limits</span>
      </div>
    </CardBody>
  </Card>
);

const CardResolvedToday = () => (
  <Card className="xl:max-w-sm bg-default-50 flex flex-col w-full">
    <CardHeader className="flex flex-row !items-start !space-x-3 !space-y-0">
      <div className="flex flex-col">
        <p className="text-xs font-medium uppercase text-success">Resolved Today</p>
        <p className="text-2xl font-bold">15</p>
      </div>
      <div className="text-success">✅</div>
    </CardHeader>
    <CardBody className="pt-0">
      <div className="flex gap-2">
        <span className="text-xs text-success">+3</span>
        <span className="text-xs text-default-500">vs yesterday</span>
      </div>
    </CardBody>
  </Card>
);

const CardPriorityAlerts = () => (
  <Card className="w-full p-4">
    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
      <h4 className="font-bold text-large">Priority Alerts</h4>
    </CardHeader>
    <CardBody className="overflow-visible py-2">
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-danger-50 dark:bg-danger-900/20 rounded-lg">
          <div>
            <p className="font-medium text-danger">TechCorp Inc - California</p>
            <p className="text-sm text-danger-600">$850K sales, 15 days to register</p>
          </div>
          <span className="text-xs bg-danger-100 dark:bg-danger-800 text-danger-800 dark:text-danger-200 px-2 py-1 rounded">
            CRITICAL
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
          <div>
            <p className="font-medium text-warning">RetailPlus LLC - Texas</p>
            <p className="text-sm text-warning-600">$600K sales, approaching threshold</p>
          </div>
          <span className="text-xs bg-warning-100 dark:bg-warning-800 text-warning-800 dark:text-warning-200 px-2 py-1 rounded">
            HIGH
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <div>
            <p className="font-medium text-primary">ServiceCo - New York</p>
            <p className="text-sm text-primary-600">Registration completed, awaiting confirmation</p>
          </div>
          <span className="text-xs bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200 px-2 py-1 rounded">
            PENDING
          </span>
        </div>
      </div>
    </CardBody>
  </Card>
);

const CardStateAnalysis = () => (
  <Card className="w-full p-4">
    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
      <h4 className="font-bold text-large">State-by-State Analysis</h4>
    </CardHeader>
    <CardBody className="overflow-visible py-2">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">California</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-danger">3 alerts</span>
            <div className="w-16 bg-default-200 rounded-full h-2">
              <div className="bg-danger h-2 rounded-full" style={{width: '75%'}}></div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Texas</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-warning">2 alerts</span>
            <div className="w-16 bg-default-200 rounded-full h-2">
              <div className="bg-warning h-2 rounded-full" style={{width: '50%'}}></div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">New York</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-success">1 alert</span>
            <div className="w-16 bg-default-200 rounded-full h-2">
              <div className="bg-success h-2 rounded-full" style={{width: '25%'}}></div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Florida</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-success">0 alerts</span>
            <div className="w-16 bg-default-200 rounded-full h-2">
              <div className="bg-success h-2 rounded-full" style={{width: '10%'}}></div>
            </div>
          </div>
        </div>
      </div>
    </CardBody>
  </Card>
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
    <div className="h-full lg:px-6">
      <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
        <div className="mt-6 gap-6 flex flex-col w-full">
          {/* Card Section Top */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold">Nexus Monitoring Overview</h3>
            <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-5 justify-center w-full">
              <CardActiveAlerts />
              <CardThresholdMonitoring />
              <CardResolvedToday />
            </div>
          </div>

          {/* U.S. States Map */}
          <div className="h-full flex flex-col gap-2">
            <h3 className="text-xl font-semibold">Nexus Client Distribution Map</h3>
            <div className="w-full bg-default-50 shadow-lg rounded-2xl p-6">
              <USStatesMap />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="mt-4 gap-2 flex flex-col xl:max-w-md w-full">
          <h3 className="text-xl font-semibold">Alert Management</h3>
          <div className="flex flex-col justify-center gap-4 flex-wrap md:flex-nowrap md:flex-col">
            <CardPriorityAlerts />
            <CardStateAnalysis />
          </div>
        </div>
      </div>

      {/* Table Recent Nexus Activity */}
      <div className="flex flex-col justify-center w-full py-5 px-4 lg:px-0 max-w-[90rem] mx-auto gap-3">
        <div className="flex flex-wrap justify-between">
          <h3 className="text-center text-xl font-semibold">Recent Nexus Activity</h3>
          <Link
            href="/dashboard/tax-manager/alerts"
            as={NextLink}
            color="primary"
            className="cursor-pointer"
          >
            View All
          </Link>
        </div>
        <NexusActivityTable />
      </div>
    </div>
  );
}
