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

// Monthly Revenue & Exposure Chart Component
const MonthlyRevenueChart = () => {
  const monthlyData = [
    { month: 'Jan', revenue: 3200000, exposure: 2800000, net: 400000 },
    { month: 'Feb', revenue: 3400000, exposure: 2900000, net: 500000 },
    { month: 'Mar', revenue: 3600000, exposure: 3100000, net: 500000 },
    { month: 'Apr', revenue: 3800000, exposure: 3200000, net: 600000 },
    { month: 'May', revenue: 4200000, exposure: 3500000, net: 700000 },
    { month: 'Jun', revenue: 4000000, exposure: 3300000, net: 700000 },
    { month: 'Jul', revenue: 4100000, exposure: 3400000, net: 700000 },
    { month: 'Aug', revenue: 4300000, exposure: 3600000, net: 700000 },
    { month: 'Sep', revenue: 4400000, exposure: 3700000, net: 700000 },
    { month: 'Oct', revenue: 4500000, exposure: 3800000, net: 700000 },
    { month: 'Nov', revenue: 4600000, exposure: 3900000, net: 700000 },
    { month: 'Dec', revenue: 4800000, exposure: 4000000, net: 800000 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-semibold text-lg tracking-tight">Monthly Revenue & Exposure</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-white text-sm">Revenue</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-pink-500"></div>
            <span className="text-white text-sm">Exposure</span>
          </div>
        </div>
      </div>
      
      <div className="h-80 flex items-end justify-between space-x-2">
        {monthlyData.map((data, index) => (
          <div key={data.month} className="flex flex-col items-center flex-1 group">
            <div className="relative w-full flex flex-col items-center space-y-1 mb-2">
              {/* Revenue Bar */}
              <div 
                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm transition-all duration-300 group-hover:from-blue-500 group-hover:to-blue-300"
                style={{ height: `${(data.revenue / 5000000) * 200}px` }}
              ></div>
              {/* Exposure Bar */}
              <div 
                className="w-full bg-gradient-to-b from-pink-600 to-pink-400 rounded-b-sm transition-all duration-300 group-hover:from-pink-500 group-hover:to-pink-300"
                style={{ height: `${(data.exposure / 5000000) * 200}px` }}
              ></div>
            </div>
            <span className="text-gray-400 text-xs font-medium">{data.month}</span>
            
            {/* Tooltip for May */}
            {data.month === 'May' && (
              <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm rounded-lg border border-white/20 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="text-white text-sm font-medium mb-2">May 2024</div>
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-white text-xs">Revenue: {formatCurrency(data.revenue)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                  <span className="text-white text-xs">Exposure: {formatCurrency(data.exposure)}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Summary Statistics Panel
const SummaryStatistics = () => {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
      <h3 className="text-white font-semibold text-lg tracking-tight mb-6">Summary Statistics</h3>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white text-2xl font-bold">$48.2M</div>
            <div className="text-gray-400 text-sm">Total Revenue</div>
          </div>
          <div className="text-green-400 text-sm font-medium">+8.7%</div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white text-2xl font-bold">$40.1M</div>
            <div className="text-gray-400 text-sm">Total Exposure</div>
          </div>
          <div className="text-red-400 text-sm font-medium">-6.3%</div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white text-2xl font-bold">$8.1M</div>
            <div className="text-gray-400 text-sm">Net Income</div>
          </div>
          <div className="text-green-400 text-sm font-medium">+21.4%</div>
        </div>
      </div>
    </div>
  );
};

// Client Portfolio Overview
const ClientPortfolioOverview = () => {
  const portfolioData = [
    { category: 'Enterprise', amount: 18000000, percentage: 37, color: 'bg-green-500' },
    { category: 'Mid-Market', amount: 22000000, percentage: 44, color: 'bg-blue-500' },
    { category: 'SMB', amount: 8200000, percentage: 19, color: 'bg-yellow-500' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-semibold text-lg tracking-tight">Client Portfolio Overview</h3>
        <button className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors">
          Categories
        </button>
      </div>
      
      <div className="mb-4">
        <div className="text-white text-2xl font-bold mb-2">$48.2M</div>
        <div className="text-gray-400 text-sm">Total Portfolio Value</div>
      </div>
      
      <div className="w-full bg-white/10 rounded-full h-2 mb-4">
        <div className="flex h-2 rounded-full overflow-hidden">
          <div className="bg-green-500" style={{width: '37%'}}></div>
          <div className="bg-blue-500" style={{width: '44%'}}></div>
          <div className="bg-yellow-500" style={{width: '19%'}}></div>
        </div>
      </div>
      
      <div className="space-y-3">
        {portfolioData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              <span className="text-white text-sm font-medium">{item.category}</span>
            </div>
            <div className="text-right">
              <div className="text-white text-sm font-medium">{formatCurrency(item.amount)}</div>
              <div className="text-gray-400 text-xs">{item.percentage}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Risk Analysis Component
const RiskAnalysis = () => {
  const riskData = [
    { category: 'Critical', count: 8, percentage: 40, color: 'bg-red-500' },
    { category: 'High', count: 5, percentage: 25, color: 'bg-orange-500' },
    { category: 'Medium', count: 4, percentage: 20, color: 'bg-yellow-500' },
    { category: 'Low', count: 2, percentage: 10, color: 'bg-green-500' },
    { category: 'Compliant', count: 1, percentage: 5, color: 'bg-gray-500' }
  ];

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-semibold text-lg tracking-tight">Risk Analysis</h3>
        <button className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors">
          Details
        </button>
      </div>
      
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * 0.2}`}
              className="transition-all duration-500"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="25%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="75%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#6b7280" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-white text-lg font-bold">20</div>
              <div className="text-gray-400 text-xs">Total</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        {riskData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              <span className="text-white text-sm font-medium">{item.category}</span>
            </div>
            <div className="text-right">
              <div className="text-white text-sm font-medium">{item.count}</div>
              <div className="text-gray-400 text-xs">{item.percentage}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Financial Forecast Component
const FinancialForecast = () => {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
      <h3 className="text-white font-semibold text-lg tracking-tight mb-6">Financial Forecast</h3>
      
      <div className="h-48 mb-4">
        <div className="relative w-full h-full">
          {/* Simplified line chart representation */}
          <svg className="w-full h-full" viewBox="0 0 300 120">
            {/* Income line */}
            <path
              d="M 20 80 Q 80 60 150 50 Q 220 40 280 30"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              className="transition-all duration-500"
            />
            {/* Exposure line */}
            <path
              d="M 20 90 Q 80 85 150 80 Q 220 75 280 70"
              fill="none"
              stroke="#ec4899"
              strokeWidth="2"
              className="transition-all duration-500"
            />
            {/* Shaded area */}
            <path
              d="M 20 80 Q 80 60 150 50 Q 220 40 280 30 L 280 70 Q 220 75 150 80 Q 80 85 20 90 Z"
              fill="url(#areaGradient)"
              opacity="0.3"
            />
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            
            {/* May highlight */}
            <line x1="150" y1="0" x2="150" y2="120" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,4" />
            <text x="150" y="15" textAnchor="middle" className="text-xs fill-yellow-400">May</text>
          </svg>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-white text-sm">Revenue</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-pink-500"></div>
          <span className="text-white text-sm">Exposure</span>
        </div>
      </div>
      
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 text-yellow-400 mt-0.5">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-yellow-300 text-sm">
              Expecting <span className="font-semibold">deficit in May</span>. Consider saving more in April or <span className="font-semibold">optimizing leisure expenses</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ManagingPartnerDashboard() {
  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-6 px-4 lg:px-0 mb-8">
          <h1 className="text-3xl font-semibold text-white tracking-tight">Financial Analytics</h1>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <button className="text-white text-sm font-medium border-b-2 border-blue-500 pb-1">Summary</button>
              <button className="text-gray-400 text-sm font-medium hover:text-white transition-colors">Balance</button>
              <button className="text-gray-400 text-sm font-medium hover:text-white transition-colors">Spending</button>
              <button className="text-gray-400 text-sm font-medium hover:text-white transition-colors">Income</button>
              <button className="text-gray-400 text-sm font-medium hover:text-white transition-colors">Net Income</button>
              <button className="text-gray-400 text-sm font-medium hover:text-white transition-colors">Savings</button>
              <button className="text-gray-400 text-sm font-medium hover:text-white transition-colors">Net Worth</button>
            </div>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <select className="bg-transparent text-white border-none outline-none">
                <option>All Accounts</option>
              </select>
              <span>/</span>
              <button className="text-gray-400 hover:text-white transition-colors">Weekly</button>
              <button className="text-white font-medium">Monthly</button>
              <button className="text-gray-400 hover:text-white transition-colors">Yearly</button>
              <span>/</span>
              <select className="bg-transparent text-white border-none outline-none">
                <option>2024</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Chart and Summary */}
        <div className="flex justify-center gap-6 xl:gap-8 px-4 lg:px-0 flex-wrap xl:flex-nowrap max-w-[90rem] mx-auto w-full mb-8">
          <div className="flex-1">
            <MonthlyRevenueChart />
          </div>
          <div className="xl:w-80 w-full">
            <SummaryStatistics />
          </div>
        </div>

        {/* Bottom Section - Three Columns */}
        <div className="flex justify-center gap-6 xl:gap-8 px-4 lg:px-0 flex-wrap xl:flex-nowrap max-w-[90rem] mx-auto w-full">
          <div className="flex-1">
            <ClientPortfolioOverview />
          </div>
          <div className="flex-1">
            <RiskAnalysis />
          </div>
          <div className="flex-1">
            <FinancialForecast />
          </div>
        </div>
      </div>
    </div>
  );
}