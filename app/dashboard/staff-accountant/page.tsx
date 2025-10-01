"use client";
import React, { useState, useMemo } from "react";
import { TableWrapper } from "@/components/table/table";
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import NextLink from "next/link";
import { USAMap, USAStateAbbreviation, StateAbbreviations } from '@mirawision/usa-map-react';

// Task data for states - Staff Accountant focused
const taskData = {
  'CA': { status: 'critical', tasks: 15, clients: 8, alerts: 3 },
  'TX': { status: 'warning', tasks: 8, clients: 5, alerts: 2 },
  'NY': { status: 'pending', tasks: 12, clients: 7, alerts: 1 },
  'FL': { status: 'compliant', tasks: 6, clients: 4, alerts: 0 }
};

// Enhanced US Map Component for Staff Accountants
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
      const data = taskData[state as keyof typeof taskData];
      
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
        // Default styling for states without task data
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
        <h4 className="text-white font-medium text-sm mb-3">Task Status Legend</h4>
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

// Staff Accountant specific cards with Apple design
const CardActiveTasks = () => (
  <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm tracking-tight">Active Tasks</h3>
          <p className="text-gray-400 text-xs font-medium">Current assignments</p>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-white">12</span>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-blue-400 text-sm font-medium">+3 new</span>
        </div>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1">
        <div className="bg-blue-500 h-1 rounded-full" style={{width: '75%'}}></div>
      </div>
      </div>
      </div>
);

const CardPendingReview = () => (
  <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm tracking-tight">Pending Review</h3>
          <p className="text-gray-400 text-xs font-medium">Awaiting approval</p>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-white">5</span>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          <span className="text-orange-400 text-sm font-medium">+1 today</span>
        </div>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1">
        <div className="bg-orange-500 h-1 rounded-full" style={{width: '60%'}}></div>
      </div>
      </div>
      </div>
);

const CardCompletedToday = () => (
  <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm tracking-tight">Completed Today</h3>
          <p className="text-gray-400 text-xs font-medium">Finished tasks</p>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-white">8</span>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-green-400 text-sm font-medium">+2 vs yesterday</span>
        </div>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1">
        <div className="bg-green-500 h-1 rounded-full" style={{width: '85%'}}></div>
      </div>
      </div>
      </div>
);

const CardPriorityTasks = () => (
  <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-white font-semibold text-lg tracking-tight">Priority Tasks</h3>
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
              <p className="font-medium text-white text-sm">TechCorp Inc - Data Entry</p>
              <p className="text-xs text-red-400">Q3 sales data validation overdue</p>
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
              <p className="font-medium text-white text-sm">RetailPlus LLC - State Allocation</p>
              <p className="text-xs text-orange-400">California revenue breakdown needed</p>
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
              <p className="font-medium text-white text-sm">ServiceCo - Quality Control</p>
              <p className="text-xs text-blue-400">Data accuracy verification pending</p>
            </div>
          </div>
          <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
            MEDIUM
          </span>
        </div>
      </div>
    </div>
  </div>
);

const CardTaskAnalysis = () => (
  <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-white font-semibold text-lg tracking-tight">Task Analysis</h3>
      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
    </div>
    <div className="space-y-4">
      <div className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium text-sm">Data Entry</span>
          <span className="text-red-400 text-sm font-medium">3 overdue</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <div className="bg-red-500 h-1.5 rounded-full transition-all duration-500" style={{width: '75%'}}></div>
            </div>
          </div>
      <div className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium text-sm">State Allocation</span>
          <span className="text-orange-400 text-sm font-medium">2 pending</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <div className="bg-orange-500 h-1.5 rounded-full transition-all duration-500" style={{width: '50%'}}></div>
            </div>
          </div>
      <div className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium text-sm">Quality Control</span>
          <span className="text-green-400 text-sm font-medium">1 completed</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{width: '25%'}}></div>
            </div>
          </div>
      <div className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium text-sm">Client Support</span>
          <span className="text-green-400 text-sm font-medium">0 pending</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{width: '10%'}}></div>
            </div>
          </div>
        </div>
      </div>
);

// Task Activity Table Component
const TaskActivityTable = () => {
  const taskActivities = [
    {
      time: "2 hours ago",
      client: "TechCorp SaaS",
      activity: "Data Entry Completed",
      activityDetail: "Q3 sales data validation",
      state: "CA",
      impact: "Ready for review",
      impactDetail: "Manager approval needed",
      status: "Complete",
      user: "S.Johnson"
    },
    {
      time: "4 hours ago",
      client: "RetailChain",
      activity: "State Allocation",
      activityDetail: "California revenue breakdown",
      state: "NY",
      impact: "Quality: 95%",
      impactDetail: "Threshold: 78%",
      status: "In Progress",
      user: "M.Wilson"
    },
    {
      time: "Yesterday 3:45 PM",
      client: "StartupInc",
      activity: "Quality Control",
      activityDetail: "Data accuracy verification",
      state: "TX",
      impact: "Monitor status",
      impactDetail: "No issues found",
      status: "Complete",
      user: "J.Doe"
    },
    {
      time: "Yesterday 1:20 PM",
      client: "ManufacturingCo",
      activity: "Client Support",
      activityDetail: "Upload format assistance",
      state: "FL",
      impact: "Issue resolved",
      impactDetail: "Client satisfied",
      status: "Resolved",
      user: "A.Smith"
    },
    {
      time: "Nov 20 4:15 PM",
      client: "ServicesCorp",
      activity: "Data Processing",
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
      activity: "Task Assignment",
      activityDetail: "New data entry task",
      state: "CA",
      impact: "Priority: High",
      impactDetail: "Due: 2 days",
      status: "Assigned",
      user: "Manager"
    },
    {
      time: "Nov 19 2:10 PM",
      client: "RetailChain",
      activity: "Review Completed",
      activityDetail: "Data accuracy check",
      state: "NY",
      impact: "Approved",
      impactDetail: "Ready for submission",
      status: "Approved",
      user: "T.Manager"
    },
    {
      time: "Nov 19 11:45 AM",
      client: "LocalBusiness",
      activity: "Training Completed",
      activityDetail: "New software training",
      state: "CO",
      impact: "Certified",
      impactDetail: "Ready for advanced tasks",
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
      case 'assigned': return 'text-secondary';
      case 'approved': return 'text-success';
      case 'in progress': return 'text-warning';
      default: return 'text-default';
    }
  };

  return (
    <div className="w-full">
      <Table aria-label="Recent Task Activity">
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
          {taskActivities.map((activity, index) => (
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

export default function StaffAccountantDashboard() {
  return (
    <div className="min-h-screen bg-black">
    <div className="h-full lg:px-6">
        <div className="flex justify-center gap-6 xl:gap-8 pt-6 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-12 max-w-[90rem] mx-auto w-full">
          <div className="mt-6 gap-8 flex flex-col w-full">
          {/* Card Section Top */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Task Management Overview</h2>
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-6 justify-center w-full">
              <CardActiveTasks />
              <CardPendingReview />
              <CardCompletedToday />
            </div>
          </div>

          {/* U.S. States Map */}
            <div className="h-full flex flex-col gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-8 bg-green-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Task Distribution Map</h2>
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
              <h2 className="text-2xl font-semibold text-white tracking-tight">Task Management</h2>
            </div>
            <div className="flex flex-col justify-center gap-6 flex-wrap md:flex-nowrap md:flex-col">
            <CardPriorityTasks />
            <CardTaskAnalysis />
          </div>
        </div>
      </div>

      {/* Table Recent Task Activity */}
        <div className="flex flex-col justify-center w-full py-8 px-4 lg:px-0 max-w-[90rem] mx-auto gap-6">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
              <h2 className="text-2xl font-semibold text-white tracking-tight">Recent Task Activity</h2>
            </div>
          <Link
            href="/dashboard/staff-accountant/task-management"
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
            <TaskActivityTable />
          </div>
        </div>
      </div>
    </div>
  );
}
