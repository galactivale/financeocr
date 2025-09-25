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

// Futuristic KPI Cards for Managing Partner
const CardTotalClientPortfolio = () => (
  <div className="group bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/10 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-6 hover:border-blue-400/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm tracking-tight">Total Client Portfolio</h3>
          <p className="text-gray-400 text-xs font-medium">Active clients</p>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-white">47</span>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-medium">↗ 12% growth</span>
        </div>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1 rounded-full" style={{width: '85%'}}></div>
      </div>
    </div>
  </div>
);

const CardCriticalRiskClients = () => (
  <div className="group bg-gradient-to-br from-red-500/10 via-orange-500/5 to-yellow-500/10 backdrop-blur-xl rounded-2xl border border-red-500/20 p-6 hover:border-red-400/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-500/20">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm tracking-tight">Critical Risk Clients</h3>
          <p className="text-gray-400 text-xs font-medium">High risk</p>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-white">8</span>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-red-400 text-sm font-medium">↑ 2 new</span>
        </div>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 h-1 rounded-full" style={{width: '70%'}}></div>
      </div>
    </div>
  </div>
);

const CardProfessionalLiability = () => (
  <div className="group bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-indigo-500/10 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 hover:border-purple-400/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm tracking-tight">Professional Liability</h3>
          <p className="text-gray-400 text-xs font-medium">Exposure</p>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-white">$284,500</span>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-green-400 text-sm font-medium">↘ 15% reduced</span>
        </div>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 rounded-full" style={{width: '60%'}}></div>
      </div>
    </div>
  </div>
);

const CardStatesUnderMonitoring = () => (
  <div className="group bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-teal-500/10 backdrop-blur-xl rounded-2xl border border-green-500/20 p-6 hover:border-green-400/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/20">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm tracking-tight">States Under Monitoring</h3>
          <p className="text-gray-400 text-xs font-medium">Jurisdictions</p>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-white">45</span>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-green-400 text-sm font-medium">→ stable</span>
        </div>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-1 rounded-full" style={{width: '90%'}}></div>
      </div>
    </div>
  </div>
);

const CardProfessionalDecisions = () => (
  <div className="group bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-indigo-500/20 p-6 hover:border-indigo-400/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/20">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm2 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm tracking-tight">Professional Decisions</h3>
          <p className="text-gray-400 text-xs font-medium">Documented</p>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-white">156</span>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-medium">↗ 23% vs LY</span>
        </div>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1">
        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 h-1 rounded-full" style={{width: '95%'}}></div>
      </div>
    </div>
  </div>
);

const CardPenaltiesPrevented = () => (
  <div className="group bg-gradient-to-br from-yellow-500/10 via-amber-500/5 to-orange-500/10 backdrop-blur-xl rounded-2xl border border-yellow-500/20 p-6 hover:border-yellow-400/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-500/20">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm tracking-tight">Penalties Prevented</h3>
          <p className="text-gray-400 text-xs font-medium">This year</p>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-white">$1.2M</span>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-medium">↗ 67% vs LY</span>
        </div>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1">
        <div className="bg-gradient-to-r from-yellow-500 to-amber-500 h-1 rounded-full" style={{width: '88%'}}></div>
      </div>
    </div>
  </div>
);

const CardTeamPerformance = () => (
  <div className="group bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-teal-500/10 backdrop-blur-xl rounded-2xl border border-emerald-500/20 p-6 hover:border-emerald-400/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/20">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm tracking-tight">Team Performance</h3>
          <p className="text-gray-400 text-xs font-medium">Compliance</p>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-white">94%</span>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-green-400 text-sm font-medium">→ stable</span>
        </div>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1">
        <div className="bg-gradient-to-r from-emerald-500 to-green-500 h-1 rounded-full" style={{width: '94%'}}></div>
      </div>
    </div>
  </div>
);

const CardPlatformROI = () => (
  <div className="group bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-indigo-500/10 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6 hover:border-cyan-400/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/20">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm tracking-tight">Platform ROI</h3>
          <p className="text-gray-400 text-xs font-medium">Investment</p>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-white">2,458%</span>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-medium">↗ 340% vs LY</span>
        </div>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1 rounded-full" style={{width: '100%'}}></div>
      </div>
    </div>
  </div>
);

const CardExecutiveSummary = () => (
  <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-white font-semibold text-lg tracking-tight">Executive Summary</h3>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
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
              <p className="font-medium text-white text-sm">ABC Corp - California Threshold</p>
              <p className="text-xs text-red-400">$1.2M exposure, immediate action required</p>
            </div>
          </div>
          <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
            URGENT
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
              <p className="font-medium text-white text-sm">Texas Rule Change Impact</p>
              <p className="text-xs text-orange-400">15 clients affected by new nexus rules</p>
            </div>
          </div>
          <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
            HIGH
          </span>
        </div>
      </div>
    </div>
  </div>
);

const CardRecentDecisions = () => (
  <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-white font-semibold text-lg tracking-tight">Recent Executive Decisions</h3>
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
    </div>
    <div className="space-y-3">
      <div className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-white text-sm">XYZ Industries - Registration</p>
            <p className="text-xs text-gray-400">Approved immediate registration in 3 states</p>
          </div>
          <span className="text-xs text-gray-400">2h ago</span>
        </div>
      </div>
      <div className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-white text-sm">Risk Assessment Review</p>
            <p className="text-xs text-gray-400">Updated firm-wide exposure analysis</p>
          </div>
          <span className="text-xs text-gray-400">1d ago</span>
        </div>
      </div>
      <div className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-white text-sm">Team Performance Review</p>
            <p className="text-xs text-gray-400">Q3 compliance metrics reviewed</p>
          </div>
          <span className="text-xs text-gray-400">3d ago</span>
        </div>
      </div>
    </div>
  </div>
);

// Firm Activity Table Component
const FirmActivityTable = () => {
  const firmActivities = [
    {
      time: "2 hours ago",
      client: "ABC Corp",
      activity: "Executive Decision Required",
      activityDetail: "California threshold exceeded",
      state: "CA",
      impact: "$1.2M exposure",
      impactDetail: "Immediate action needed",
      status: "Critical",
      user: "Managing Partner"
    },
    {
      time: "4 hours ago",
      client: "XYZ Industries",
      activity: "Registration Approved",
      activityDetail: "Multi-state compliance",
      state: "TX",
      impact: "3 states registered",
      impactDetail: "Risk mitigated",
      status: "Complete",
      user: "Executive Team"
    },
    {
      time: "Yesterday 3:45 PM",
      client: "TechCorp SaaS",
      activity: "Risk Assessment",
      activityDetail: "Firm-wide exposure review",
      state: "NY",
      impact: "Portfolio analysis",
      impactDetail: "Strategic planning",
      status: "Resolved",
      user: "Risk Committee"
    },
    {
      time: "Yesterday 1:20 PM",
      client: "ManufacturingCo",
      activity: "Compliance Review",
      activityDetail: "Q3 performance metrics",
      state: "FL",
      impact: "94.2% compliance",
      impactDetail: "Above target",
      status: "Complete",
      user: "Compliance Team"
    },
    {
      time: "Nov 20 4:15 PM",
      client: "ServicesCorp",
      activity: "Strategic Planning",
      activityDetail: "2025 compliance strategy",
      state: "WA",
      impact: "Resource allocation",
      impactDetail: "Budget approved",
      status: "Approved",
      user: "Executive Board"
    },
    {
      time: "Nov 20 10:30 AM",
      client: "RetailChain",
      activity: "Regulatory Update",
      activityDetail: "Texas nexus rule changes",
      state: "TX",
      impact: "15 clients affected",
      impactDetail: "Action plan created",
      status: "In Progress",
      user: "Legal Team"
    },
    {
      time: "Nov 19 2:10 PM",
      client: "StartupInc",
      activity: "Partnership Review",
      activityDetail: "Client portfolio expansion",
      state: "CA",
      impact: "New market entry",
      impactDetail: "Growth opportunity",
      status: "Approved",
      user: "Business Development"
    },
    {
      time: "Nov 19 11:45 AM",
      client: "LocalBusiness",
      activity: "Performance Review",
      activityDetail: "Team efficiency metrics",
      state: "CO",
      impact: "Productivity +15%",
      impactDetail: "Target exceeded",
      status: "Complete",
      user: "HR Department"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'critical': return 'text-danger';
      case 'complete': return 'text-success';
      case 'resolved': return 'text-success';
      case 'approved': return 'text-success';
      case 'in progress': return 'text-primary';
      default: return 'text-default';
    }
  };

  return (
    <div className="w-full">
      <Table aria-label="Recent Firm Activity">
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
          {firmActivities.map((activity, index) => (
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

export default function ManagingPartnerDashboard() {
  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-6">
        <div className="flex justify-center gap-6 xl:gap-8 pt-6 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-12 max-w-[90rem] mx-auto w-full">
          <div className="mt-6 gap-8 flex flex-col w-full">
            {/* Card Section Top */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Executive Overview</h2>
              </div>
              
              {/* First Row - 4 Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 justify-center w-full">
                <CardTotalClientPortfolio />
                <CardCriticalRiskClients />
                <CardProfessionalLiability />
                <CardStatesUnderMonitoring />
              </div>
              
              {/* Second Row - 4 Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 justify-center w-full">
                <CardProfessionalDecisions />
                <CardPenaltiesPrevented />
                <CardTeamPerformance />
                <CardPlatformROI />
              </div>
            </div>

            {/* U.S. States Map */}
            <div className="h-full flex flex-col gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-8 bg-green-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Firm Client Distribution Map</h2>
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
              <h2 className="text-2xl font-semibold text-white tracking-tight">Executive Actions</h2>
            </div>
            <div className="flex flex-col justify-center gap-6 flex-wrap md:flex-nowrap md:flex-col">
              <CardExecutiveSummary />
              <CardRecentDecisions />
            </div>
          </div>
        </div>

        {/* Table Recent Firm Activity */}
        <div className="flex flex-col justify-center w-full py-8 px-4 lg:px-0 max-w-[90rem] mx-auto gap-6">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
              <h2 className="text-2xl font-semibold text-white tracking-tight">Recent Firm Activity</h2>
            </div>
            <Link
              href="/dashboard/managing-partner/compliance"
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
            <FirmActivityTable />
          </div>
        </div>
      </div>
    </div>
  );
}