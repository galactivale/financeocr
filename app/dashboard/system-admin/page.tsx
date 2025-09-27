"use client";
import React from "react";
import dynamic from "next/dynamic";
import { TableWrapper } from "@/components/table/table";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import NextLink from "next/link";
import { 
  Server, 
  Users, 
  Shield, 
  AlertTriangle,
  Activity, 
  Globe,
  TrendingUp,
  CheckCircle,
  Clock,
  BarChart3,
  Cpu,
  HardDrive,
  Wifi
} from "lucide-react";

const ActivityLogChart = dynamic(
  () => import("@/components/charts/activity-log-chart").then((mod) => mod.ActivityLogChart),
  {
    ssr: false,
  }
);

// Tax-manager style System Admin cards
const CardSystemHealth = () => (
  <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
          <Server className="w-5 h-5 text-green-500" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm tracking-tight">System Health</h3>
          <p className="text-gray-400 text-xs font-medium">Platform uptime</p>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-white">99.8%</span>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-green-400 text-sm font-medium">+0.2%</span>
        </div>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1">
        <div className="bg-green-500 h-1 rounded-full" style={{width: '99.8%'}}></div>
      </div>
    </div>
  </div>
);

const CardActiveTenants = () => (
  <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
          <Users className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm tracking-tight">Active Tenants</h3>
          <p className="text-gray-400 text-xs font-medium">CPA firms online</p>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-white">47</span>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-green-400 text-sm font-medium">+3 new</span>
        </div>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1">
        <div className="bg-blue-500 h-1 rounded-full" style={{width: '78%'}}></div>
      </div>
    </div>
  </div>
);

const CardSecurityStatus = () => (
  <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
          <Shield className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm tracking-tight">Security Alerts</h3>
          <p className="text-gray-400 text-xs font-medium">Active threats</p>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-white">2</span>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-green-400 text-sm font-medium">-1 resolved</span>
        </div>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1">
        <div className="bg-orange-500 h-1 rounded-full" style={{width: '40%'}}></div>
      </div>
    </div>
  </div>
);


const CardPlatformOverview = () => (
  <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-white font-semibold text-lg tracking-tight">Platform Command Center</h3>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
    </div>
    <div className="space-y-3">
      <div className="group bg-red-500/10 backdrop-blur-sm rounded-xl border border-red-500/20 p-4 hover:bg-red-500/15 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <p className="font-medium text-white text-sm">Database Performance Alert</p>
              <p className="text-xs text-red-400">Query response time exceeding 2s threshold</p>
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
              <Users className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p className="font-medium text-white text-sm">Tenant Onboarding Queue</p>
              <p className="text-xs text-orange-400">3 new firms pending initial configuration</p>
            </div>
          </div>
          <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
            HIGH
          </span>
        </div>
      </div>
      <div className="group bg-green-500/10 backdrop-blur-sm rounded-xl border border-green-500/20 p-4 hover:bg-green-500/15 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <div>
              <p className="font-medium text-white text-sm">Integration Health Check</p>
              <p className="text-xs text-green-400">QuickBooks API connectivity restored</p>
            </div>
          </div>
          <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
            RESOLVED
          </span>
        </div>
      </div>
    </div>
  </div>
);

const CardSystemActions = () => (
  <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-white font-semibold text-lg tracking-tight">System Administration Actions</h3>
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
    </div>
    <div className="space-y-4">
      <div className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium text-sm">Backup Verification</span>
          <span className="text-green-400 text-sm font-medium">2h ago</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{width: '100%'}}></div>
        </div>
      </div>
      <div className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium text-sm">Security Patch Deployment</span>
          <span className="text-green-400 text-sm font-medium">4h ago</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{width: '100%'}}></div>
        </div>
      </div>
      <div className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium text-sm">Tenant Performance Review</span>
          <span className="text-blue-400 text-sm font-medium">1d ago</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" style={{width: '85%'}}></div>
        </div>
      </div>
      <div className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium text-sm">Integration Monitoring</span>
          <span className="text-green-400 text-sm font-medium">2d ago</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{width: '100%'}}></div>
        </div>
      </div>
    </div>
  </div>
);

export default function SystemAdminDashboard() {
  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-6">
        <div className="flex justify-center gap-6 xl:gap-8 pt-6 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-12 max-w-[90rem] mx-auto w-full">
          <div className="mt-6 gap-8 flex flex-col w-full">
            {/* Card Section Top */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">System Health Overview</h2>
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-6 justify-center w-full">
                <CardSystemHealth />
                <CardActiveTenants />
                <CardSecurityStatus />
              </div>
            </div>


            {/* Activity Log Chart */}
            <div className="h-full flex flex-col gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">System Activity Log</h2>
              </div>
              <div className="w-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                <ActivityLogChart />
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="mt-4 gap-6 flex flex-col xl:max-w-md w-full">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-8 bg-orange-500 rounded-full"></div>
              <h2 className="text-2xl font-semibold text-white tracking-tight">System Management</h2>
            </div>
            <div className="flex flex-col justify-center gap-6 flex-wrap md:flex-nowrap md:flex-col">
              <CardPlatformOverview />
              <CardSystemActions />
            </div>
          </div>
        </div>

        {/* Table Critical System Issues */}
        <div className="flex flex-col justify-center w-full py-8 px-4 lg:px-0 max-w-[90rem] mx-auto gap-6">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-8 bg-red-500 rounded-full"></div>
              <h2 className="text-2xl font-semibold text-white tracking-tight">Critical System Issues</h2>
            </div>
            <Link
              href="/dashboard/system-admin/system-monitoring"
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
            <TableWrapper />
          </div>
        </div>
      </div>
    </div>
  );
}
