"use client";
import React from "react";
import dynamic from "next/dynamic";
import { TableWrapper } from "../table/table";
import { CardBalance1 } from "./card-balance1";
import { CardBalance2 } from "./card-balance2";
import { CardBalance3 } from "./card-balance3";
import { CardAgents } from "./card-agents";
import { CardTransactions } from "./card-transactions";
import { Link } from "@nextui-org/react";
import NextLink from "next/link";

const Chart = dynamic(
  () => import("../charts/steam").then((mod) => mod.Steam),
  {
    ssr: false,
  }
);

export const Content = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    {/* Hero Section */}
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="apple-text-large text-gray-900 mb-6">
            Welcome to VaultCPA
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your comprehensive nexus compliance and tax management platform. 
            Monitor, analyze, and manage your clients&apos; tax obligations with precision.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="apple-card p-8 text-center apple-hover">
            <div className="w-16 h-16 mx-auto mb-4 apple-gradient rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="apple-text-medium text-gray-900 mb-2">Active Clients</h3>
            <p className="text-3xl font-bold text-blue-600">247</p>
            <p className="text-sm text-gray-500 mt-1">+12 this month</p>
          </div>

          <div className="apple-card p-8 text-center apple-hover">
            <div className="w-16 h-16 mx-auto mb-4 apple-gradient-warm rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="apple-text-medium text-gray-900 mb-2">Critical Alerts</h3>
            <p className="text-3xl font-bold text-red-500">8</p>
            <p className="text-sm text-gray-500 mt-1">Require attention</p>
          </div>

          <div className="apple-card p-8 text-center apple-hover">
            <div className="w-16 h-16 mx-auto mb-4 apple-gradient-cool rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="apple-text-medium text-gray-900 mb-2">Compliance Rate</h3>
            <p className="text-3xl font-bold text-green-500">94.2%</p>
            <p className="text-sm text-gray-500 mt-1">Above target</p>
          </div>
        </div>
      </div>
    </div>

    {/* Main Dashboard Content */}
    <div className="max-w-7xl mx-auto px-6 pb-16">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="xl:col-span-2 space-y-8">
          {/* Financial Overview */}
          <div className="apple-card p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="apple-text-medium text-gray-900">Financial Overview</h2>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-500">Live</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CardBalance1 />
              <CardBalance2 />
              <CardBalance3 />
            </div>
          </div>

          {/* Analytics Chart */}
          <div className="apple-card p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="apple-text-medium text-gray-900">Performance Analytics</h2>
              <div className="flex items-center space-x-4">
                <select className="apple-transition-fast bg-white/50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>Last year</option>
                </select>
              </div>
            </div>
            <div className="h-80">
              <Chart />
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-8">
          {/* Team Activity */}
          <div className="apple-card p-6">
            <h3 className="apple-text-medium text-gray-900 mb-6">Team Activity</h3>
            <CardAgents />
          </div>

          {/* Recent Transactions */}
          <div className="apple-card p-6">
            <h3 className="apple-text-medium text-gray-900 mb-6">Recent Activity</h3>
            <CardTransactions />
          </div>

          {/* Quick Actions */}
          <div className="apple-card p-6">
            <h3 className="apple-text-medium text-gray-900 mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/dashboard/tax-manager"
                as={NextLink}
                className="block w-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl apple-transition hover:shadow-lg hover:scale-105"
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="font-medium">Tax Manager Dashboard</span>
                </div>
              </Link>
              
              <Link
                href="/dashboard/managing-partner"
                as={NextLink}
                className="block w-full p-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl apple-transition hover:shadow-lg hover:scale-105"
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="font-medium">Managing Partner</span>
                </div>
              </Link>
              
              <Link
                href="/accounts"
                as={NextLink}
                className="block w-full p-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl apple-transition hover:shadow-lg hover:scale-105"
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <span className="font-medium">User Management</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="mt-16">
        <div className="apple-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="apple-text-medium text-gray-900">Recent Users</h2>
            <Link
              href="/accounts"
              as={NextLink}
              className="apple-transition-fast text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-2"
            >
              <span>View All</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <TableWrapper />
        </div>
      </div>
    </div>
  </div>
);
