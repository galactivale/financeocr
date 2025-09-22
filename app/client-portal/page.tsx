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

// Client Portal specific cards
const CardComplianceStatus = () => (
  <Card className="xl:max-w-sm bg-default-50 flex flex-col w-full">
    <CardHeader className="flex flex-row !items-start !space-x-3 !space-y-0">
      <div className="flex flex-col">
        <p className="text-xs font-medium uppercase text-success">Compliance Status</p>
        <p className="text-2xl font-bold">COMPLIANT</p>
      </div>
      <div className="text-success">✅</div>
    </CardHeader>
    <CardBody className="pt-0">
      <div className="flex gap-2">
        <span className="text-xs text-success">8/8</span>
        <span className="text-xs text-default-500">states current</span>
      </div>
    </CardBody>
  </Card>
);

const CardPendingActions = () => (
  <Card className="xl:max-w-sm bg-default-50 flex flex-col w-full">
    <CardHeader className="flex flex-row !items-start !space-x-3 !space-y-0">
      <div className="flex flex-col">
        <p className="text-xs font-medium uppercase text-warning">Pending Actions</p>
        <p className="text-2xl font-bold">3</p>
      </div>
      <div className="text-warning">⚠️</div>
    </CardHeader>
    <CardBody className="pt-0">
      <div className="flex gap-2">
        <span className="text-xs text-warning">+1</span>
        <span className="text-xs text-default-500">requiring attention</span>
      </div>
    </CardBody>
  </Card>
);

const CardDataUploads = () => (
  <Card className="xl:max-w-sm bg-default-50 flex flex-col w-full">
    <CardHeader className="flex flex-row !items-start !space-x-3 !space-y-0">
      <div className="flex flex-col">
        <p className="text-xs font-medium uppercase text-primary">Data Uploads</p>
        <p className="text-2xl font-bold">12</p>
      </div>
      <div className="text-primary">📤</div>
    </CardHeader>
    <CardBody className="pt-0">
      <div className="flex gap-2">
        <span className="text-xs text-primary">+3</span>
        <span className="text-xs text-default-500">this month</span>
      </div>
    </CardBody>
  </Card>
);

const CardStateCompliance = () => (
  <Card className="w-full p-4">
    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
      <h4 className="font-bold text-large">State Compliance Status</h4>
    </CardHeader>
    <CardBody className="overflow-visible py-2">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">California</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-sm text-success">Compliant</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Texas</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-sm text-success">Compliant</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">New York</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-warning rounded-full"></div>
            <span className="text-sm text-warning">Pending Review</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Florida</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-sm text-success">Compliant</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Illinois</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-sm text-success">Compliant</span>
          </div>
        </div>
      </div>
    </CardBody>
  </Card>
);

const CardActionItems = () => (
  <Card className="w-full p-4">
    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
      <h4 className="font-bold text-large">Action Items</h4>
    </CardHeader>
    <CardBody className="overflow-visible py-2">
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
          <div>
            <p className="font-medium text-warning">New York Registration Documents</p>
            <p className="text-sm text-warning-600">Additional documentation required</p>
          </div>
          <span className="text-xs bg-warning-100 dark:bg-warning-800 text-warning-800 dark:text-warning-200 px-2 py-1 rounded">
            URGENT
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <div>
            <p className="font-medium text-primary">Q4 Sales Data Upload</p>
            <p className="text-sm text-primary-600">Due by end of month</p>
          </div>
          <span className="text-xs bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200 px-2 py-1 rounded">
            DUE SOON
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-success-50 dark:bg-success-900/20 rounded-lg">
          <div>
            <p className="font-medium text-success">Annual Compliance Review</p>
            <p className="text-sm text-success-600">Schedule consultation</p>
          </div>
          <span className="text-xs bg-success-100 dark:bg-success-800 text-success-800 dark:text-success-200 px-2 py-1 rounded">
            SCHEDULE
          </span>
        </div>
      </div>
    </CardBody>
  </Card>
);

export default function ClientPortalDashboard() {
  return (
    <div className="h-full lg:px-6">
      <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
        <div className="mt-6 gap-6 flex flex-col w-full">
          {/* Card Section Top */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold">Compliance Overview</h3>
            <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-5 justify-center w-full">
              <CardComplianceStatus />
              <CardPendingActions />
              <CardDataUploads />
            </div>
          </div>

          {/* Chart */}
          <div className="h-full flex flex-col gap-2">
            <h3 className="text-xl font-semibold">Compliance Analytics</h3>
            <div className="w-full bg-default-50 shadow-lg rounded-2xl p-6">
              <Chart />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="mt-4 gap-2 flex flex-col xl:max-w-md w-full">
          <h3 className="text-xl font-semibold">Status & Actions</h3>
          <div className="flex flex-col justify-center gap-4 flex-wrap md:flex-nowrap md:flex-col">
            <CardStateCompliance />
            <CardActionItems />
          </div>
        </div>
      </div>

      {/* Table Recent Activity */}
      <div className="flex flex-col justify-center w-full py-5 px-4 lg:px-0 max-w-[90rem] mx-auto gap-3">
        <div className="flex flex-wrap justify-between">
          <h3 className="text-center text-xl font-semibold">Recent Activity</h3>
          <Link
            href="/client-portal/activity"
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