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

// Managing Partner specific cards
const CardExposureAnalysis = () => (
  <Card className="xl:max-w-sm bg-default-50 flex flex-col w-full">
    <CardHeader className="flex flex-row !items-start !space-x-3 !space-y-0">
      <div className="flex flex-col">
        <p className="text-xs font-medium uppercase text-danger">Total Exposure</p>
        <p className="text-2xl font-bold">$2.4M</p>
      </div>
      <div className="text-danger">⚠️</div>
    </CardHeader>
    <CardBody className="pt-0">
      <div className="flex gap-2">
        <span className="text-xs text-danger">+2.5%</span>
        <span className="text-xs text-default-500">vs last month</span>
      </div>
    </CardBody>
  </Card>
);

const CardCriticalAlerts = () => (
  <Card className="xl:max-w-sm bg-default-50 flex flex-col w-full">
    <CardHeader className="flex flex-row !items-start !space-x-3 !space-y-0">
      <div className="flex flex-col">
        <p className="text-xs font-medium uppercase text-danger">Critical Alerts</p>
        <p className="text-2xl font-bold">12</p>
      </div>
      <div className="text-danger">🚨</div>
    </CardHeader>
    <CardBody className="pt-0">
      <div className="flex gap-2">
        <span className="text-xs text-danger">+3</span>
        <span className="text-xs text-default-500">new this week</span>
      </div>
    </CardBody>
  </Card>
);

const CardComplianceRate = () => (
  <Card className="xl:max-w-sm bg-default-50 flex flex-col w-full">
    <CardHeader className="flex flex-row !items-start !space-x-3 !space-y-0">
      <div className="flex flex-col">
        <p className="text-xs font-medium uppercase text-success">Compliance Rate</p>
        <p className="text-2xl font-bold">94.2%</p>
      </div>
      <div className="text-success">✅</div>
    </CardHeader>
    <CardBody className="pt-0">
      <div className="flex gap-2">
        <span className="text-xs text-success">+1.2%</span>
        <span className="text-xs text-default-500">vs last month</span>
      </div>
    </CardBody>
  </Card>
);

const CardExecutiveSummary = () => (
  <Card className="w-full p-4">
    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
      <h4 className="font-bold text-large">Executive Summary</h4>
    </CardHeader>
    <CardBody className="overflow-visible py-2">
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-danger-50 dark:bg-danger-900/20 rounded-lg">
          <div>
            <p className="font-medium text-danger">ABC Corp - California Threshold</p>
            <p className="text-sm text-danger-600">$1.2M exposure, immediate action required</p>
          </div>
          <span className="text-xs bg-danger-100 dark:bg-danger-800 text-danger-800 dark:text-danger-200 px-2 py-1 rounded">
            URGENT
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
          <div>
            <p className="font-medium text-warning">Texas Rule Change Impact</p>
            <p className="text-sm text-warning-600">15 clients affected by new nexus rules</p>
          </div>
          <span className="text-xs bg-warning-100 dark:bg-warning-800 text-warning-800 dark:text-warning-200 px-2 py-1 rounded">
            HIGH
          </span>
        </div>
      </div>
    </CardBody>
  </Card>
);

const CardRecentDecisions = () => (
  <Card className="w-full p-4">
    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
      <h4 className="font-bold text-large">Recent Executive Decisions</h4>
    </CardHeader>
    <CardBody className="overflow-visible py-2">
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <p className="font-medium">XYZ Industries - Registration</p>
            <p className="text-sm text-default-500">Approved immediate registration in 3 states</p>
          </div>
          <span className="text-xs text-default-400">2h ago</span>
        </div>
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <p className="font-medium">Risk Assessment Review</p>
            <p className="text-sm text-default-500">Updated firm-wide exposure analysis</p>
          </div>
          <span className="text-xs text-default-400">1d ago</span>
        </div>
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <p className="font-medium">Team Performance Review</p>
            <p className="text-sm text-default-500">Q3 compliance metrics reviewed</p>
          </div>
          <span className="text-xs text-default-400">3d ago</span>
        </div>
      </div>
    </CardBody>
  </Card>
);

export default function ManagingPartnerDashboard() {
  return (
    <div className="h-full lg:px-6">
      <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
        <div className="mt-6 gap-6 flex flex-col w-full">
          {/* Card Section Top */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold">Executive Overview</h3>
            <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-5 justify-center w-full">
              <CardExposureAnalysis />
              <CardCriticalAlerts />
              <CardComplianceRate />
            </div>
          </div>

          {/* Chart */}
          <div className="h-full flex flex-col gap-2">
            <h3 className="text-xl font-semibold">Firm Performance Analytics</h3>
            <div className="w-full bg-default-50 shadow-lg rounded-2xl p-6">
              <Chart />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="mt-4 gap-2 flex flex-col xl:max-w-md w-full">
          <h3 className="text-xl font-semibold">Executive Actions</h3>
          <div className="flex flex-col justify-center gap-4 flex-wrap md:flex-nowrap md:flex-col">
            <CardExecutiveSummary />
            <CardRecentDecisions />
          </div>
        </div>
      </div>

      {/* Table Latest Critical Issues */}
      <div className="flex flex-col justify-center w-full py-5 px-4 lg:px-0 max-w-[90rem] mx-auto gap-3">
        <div className="flex flex-wrap justify-between">
          <h3 className="text-center text-xl font-semibold">Critical Issues Requiring Attention</h3>
          <Link
            href="/dashboard/managing-partner/compliance/alerts"
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
