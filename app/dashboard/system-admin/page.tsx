"use client";
import React from "react";
import dynamic from "next/dynamic";
import { TableWrapper } from "@/components/table/table";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import NextLink from "next/link";

const Chart = dynamic(
  () => import("@/components/charts/steam").then((mod) => mod.Steam),
  {
    ssr: false,
  }
);

// System Admin specific cards
const CardSystemHealth = () => (
  <Card className="xl:max-w-sm bg-default-50 flex flex-col w-full">
    <CardHeader className="flex flex-row !items-start !space-x-3 !space-y-0">
      <div className="flex flex-col">
        <p className="text-xs font-medium uppercase text-success">System Health</p>
        <p className="text-2xl font-bold">99.9%</p>
      </div>
      <div className="text-success">💚</div>
    </CardHeader>
    <CardBody className="pt-0">
      <div className="flex gap-2">
        <span className="text-xs text-success">+0.1%</span>
        <span className="text-xs text-default-500">uptime last 30 days</span>
      </div>
    </CardBody>
  </Card>
);

const CardActiveUsers = () => (
  <Card className="xl:max-w-sm bg-default-50 flex flex-col w-full">
    <CardHeader className="flex flex-row !items-start !space-x-3 !space-y-0">
      <div className="flex flex-col">
        <p className="text-xs font-medium uppercase text-primary">Active Users</p>
        <p className="text-2xl font-bold">1,247</p>
      </div>
      <div className="text-primary">👥</div>
    </CardHeader>
    <CardBody className="pt-0">
      <div className="flex gap-2">
        <span className="text-xs text-primary">+23</span>
        <span className="text-xs text-default-500">across all tenants</span>
      </div>
    </CardBody>
  </Card>
);

const CardSecurityStatus = () => (
  <Card className="xl:max-w-sm bg-default-50 flex flex-col w-full">
    <CardHeader className="flex flex-row !items-start !space-x-3 !space-y-0">
      <div className="flex flex-col">
        <p className="text-xs font-medium uppercase text-success">Security Status</p>
        <p className="text-2xl font-bold">SECURE</p>
      </div>
      <div className="text-success">🛡️</div>
    </CardHeader>
    <CardBody className="pt-0">
      <div className="flex gap-2">
        <span className="text-xs text-success">0</span>
        <span className="text-xs text-default-500">security alerts</span>
      </div>
    </CardBody>
  </Card>
);

const CardSystemStatus = () => (
  <Card className="w-full p-4">
    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
      <h4 className="font-bold text-large">System Components Status</h4>
    </CardHeader>
    <CardBody className="overflow-visible py-2">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Web Application</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-sm text-success">Operational</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Database</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-sm text-success">Operational</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">AI Processing Engine</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-sm text-success">Operational</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Regulatory Data Feed</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-warning rounded-full"></div>
            <span className="text-sm text-warning">Syncing</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Backup System</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-sm text-success">Operational</span>
          </div>
        </div>
      </div>
    </CardBody>
  </Card>
);

const CardIntegrationStatus = () => (
  <Card className="w-full p-4">
    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
      <h4 className="font-bold text-large">Integration Status</h4>
    </CardHeader>
    <CardBody className="overflow-visible py-2">
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <p className="font-medium">QuickBooks Integration</p>
            <p className="text-sm text-default-500">Last sync: 2 minutes ago</p>
          </div>
          <span className="text-xs bg-success-100 dark:bg-success-800 text-success-800 dark:text-success-200 px-2 py-1 rounded">
            ACTIVE
          </span>
        </div>
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <p className="font-medium">Sage Integration</p>
            <p className="text-sm text-default-500">Last sync: 5 minutes ago</p>
          </div>
          <span className="text-xs bg-success-100 dark:bg-success-800 text-success-800 dark:text-success-200 px-2 py-1 rounded">
            ACTIVE
          </span>
        </div>
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <p className="font-medium">Xero Integration</p>
            <p className="text-sm text-default-500">Last sync: 1 hour ago</p>
          </div>
          <span className="text-xs bg-warning-100 dark:bg-warning-800 text-warning-800 dark:text-warning-200 px-2 py-1 rounded">
            WARNING
          </span>
        </div>
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <p className="font-medium">Thomson Reuters Feed</p>
            <p className="text-sm text-default-500">Last update: 30 minutes ago</p>
          </div>
          <span className="text-xs bg-success-100 dark:bg-success-800 text-success-800 dark:text-success-200 px-2 py-1 rounded">
            ACTIVE
          </span>
        </div>
      </div>
    </CardBody>
  </Card>
);

export default function SystemAdminDashboard() {
  return (
    <div className="h-full lg:px-6">
      <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
        <div className="mt-6 gap-6 flex flex-col w-full">
          {/* Card Section Top */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold">System Overview</h3>
            <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-5 justify-center w-full">
              <CardSystemHealth />
              <CardActiveUsers />
              <CardSecurityStatus />
            </div>
          </div>

          {/* Chart */}
          <div className="h-full flex flex-col gap-2">
            <h3 className="text-xl font-semibold">System Performance Analytics</h3>
            <div className="w-full bg-default-50 shadow-lg rounded-2xl p-6">
              <Chart />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="mt-4 gap-2 flex flex-col xl:max-w-md w-full">
          <h3 className="text-xl font-semibold">System Monitoring</h3>
          <div className="flex flex-col justify-center gap-4 flex-wrap md:flex-nowrap md:flex-col">
            <CardSystemStatus />
            <CardIntegrationStatus />
          </div>
        </div>
      </div>

      {/* Table Latest System Activity */}
      <div className="flex flex-col justify-center w-full py-5 px-4 lg:px-0 max-w-[90rem] mx-auto gap-3">
        <div className="flex flex-wrap justify-between">
          <h3 className="text-center text-xl font-semibold">Recent System Activity</h3>
          <Link
            href="/dashboard/system-admin/system-monitoring/logs"
            as={NextLink}
            color="primary"
            className="cursor-pointer"
          >
            View All
          </Link>
        </div>
        <TableWrapper />
      </div>
    </div>
  );
}
