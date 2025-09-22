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

// Staff Accountant specific cards
const CardActiveTasks = () => (
  <Card className="xl:max-w-sm bg-default-50 flex flex-col w-full">
    <CardHeader className="flex flex-row !items-start !space-x-3 !space-y-0">
      <div className="flex flex-col">
        <p className="text-xs font-medium uppercase text-primary">Active Tasks</p>
        <p className="text-2xl font-bold">12</p>
      </div>
      <div className="text-primary">📋</div>
    </CardHeader>
    <CardBody className="pt-0">
      <div className="flex gap-2">
        <span className="text-xs text-primary">+3</span>
        <span className="text-xs text-default-500">assigned today</span>
      </div>
    </CardBody>
  </Card>
);

const CardPendingReview = () => (
  <Card className="xl:max-w-sm bg-default-50 flex flex-col w-full">
    <CardHeader className="flex flex-row !items-start !space-x-3 !space-y-0">
      <div className="flex flex-col">
        <p className="text-xs font-medium uppercase text-warning">Pending Review</p>
        <p className="text-2xl font-bold">5</p>
      </div>
      <div className="text-warning">⏰</div>
    </CardHeader>
    <CardBody className="pt-0">
      <div className="flex gap-2">
        <span className="text-xs text-warning">+1</span>
        <span className="text-xs text-default-500">awaiting approval</span>
      </div>
    </CardBody>
  </Card>
);

const CardCompletedToday = () => (
  <Card className="xl:max-w-sm bg-default-50 flex flex-col w-full">
    <CardHeader className="flex flex-row !items-start !space-x-3 !space-y-0">
      <div className="flex flex-col">
        <p className="text-xs font-medium uppercase text-success">Completed Today</p>
        <p className="text-2xl font-bold">8</p>
      </div>
      <div className="text-success">✅</div>
    </CardHeader>
    <CardBody className="pt-0">
      <div className="flex gap-2">
        <span className="text-xs text-success">+2</span>
        <span className="text-xs text-default-500">vs yesterday</span>
      </div>
    </CardBody>
  </Card>
);

const CardTaskQueue = () => (
  <Card className="w-full p-4">
    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
      <h4 className="font-bold text-large">Active Tasks</h4>
    </CardHeader>
    <CardBody className="overflow-visible py-2">
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <div>
            <p className="font-medium text-primary">Data Entry - TechCorp Inc</p>
            <p className="text-sm text-primary-600">Q3 sales data validation</p>
          </div>
          <span className="text-xs bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200 px-2 py-1 rounded">
            HIGH
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
          <div>
            <p className="font-medium text-warning">State Allocation - RetailPlus LLC</p>
            <p className="text-sm text-warning-600">California revenue breakdown</p>
          </div>
          <span className="text-xs bg-warning-100 dark:bg-warning-800 text-warning-800 dark:text-warning-200 px-2 py-1 rounded">
            MEDIUM
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-success-50 dark:bg-success-900/20 rounded-lg">
          <div>
            <p className="font-medium text-success">Quality Control - ServiceCo</p>
            <p className="text-sm text-success-600">Data accuracy verification</p>
          </div>
          <span className="text-xs bg-success-100 dark:bg-success-800 text-success-800 dark:text-success-200 px-2 py-1 rounded">
            LOW
          </span>
        </div>
      </div>
    </CardBody>
  </Card>
);

const CardClientSupport = () => (
  <Card className="w-full p-4">
    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
      <h4 className="font-bold text-large">Client Support Queue</h4>
    </CardHeader>
    <CardBody className="overflow-visible py-2">
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <p className="font-medium">Manufacturing Corp</p>
            <p className="text-sm text-default-500">Upload format questions</p>
          </div>
          <span className="text-xs bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200 px-2 py-1 rounded">
            NEW
          </span>
        </div>
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <p className="font-medium">TechStart Inc</p>
            <p className="text-sm text-default-500">Data processing status inquiry</p>
          </div>
          <span className="text-xs bg-warning-100 dark:bg-warning-800 text-warning-800 dark:text-warning-200 px-2 py-1 rounded">
            IN PROGRESS
          </span>
        </div>
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <p className="font-medium">RetailChain LLC</p>
            <p className="text-sm text-default-500">Historical data request</p>
          </div>
          <span className="text-xs bg-success-100 dark:bg-success-800 text-success-800 dark:text-success-200 px-2 py-1 rounded">
            RESOLVED
          </span>
        </div>
      </div>
    </CardBody>
  </Card>
);

export default function StaffAccountantDashboard() {
  return (
    <div className="h-full lg:px-6">
      <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
        <div className="mt-6 gap-6 flex flex-col w-full">
          {/* Card Section Top */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold">Work Queue Overview</h3>
            <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-5 justify-center w-full">
              <CardActiveTasks />
              <CardPendingReview />
              <CardCompletedToday />
            </div>
          </div>

          {/* Chart */}
          <div className="h-full flex flex-col gap-2">
            <h3 className="text-xl font-semibold">Task Performance Analytics</h3>
            <div className="w-full bg-default-50 shadow-lg rounded-2xl p-6">
              <Chart />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="mt-4 gap-2 flex flex-col xl:max-w-md w-full">
          <h3 className="text-xl font-semibold">Task Management</h3>
          <div className="flex flex-col justify-center gap-4 flex-wrap md:flex-nowrap md:flex-col">
            <CardTaskQueue />
            <CardClientSupport />
          </div>
        </div>
      </div>

      {/* Table Latest Tasks */}
      <div className="flex flex-col justify-center w-full py-5 px-4 lg:px-0 max-w-[90rem] mx-auto gap-3">
        <div className="flex flex-wrap justify-between">
          <h3 className="text-center text-xl font-semibold">Recent Task Activity</h3>
          <Link
            href="/dashboard/staff-accountant/nexus-tasks"
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
