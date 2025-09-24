"use client";
import React, { useState, useEffect } from "react";
import { USMap } from 'react-us-map';

interface StateData {
  name: string;
  code: string;
  clients: number;
  alerts: number;
  status: 'compliant' | 'warning' | 'critical' | 'pending';
  revenue: number;
}

const USStatesMap = () => {
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sample data for demonstration
  const stateData: StateData[] = [
    { name: 'California', code: 'CA', clients: 45, alerts: 3, status: 'critical', revenue: 2400000 },
    { name: 'Texas', code: 'TX', clients: 32, alerts: 2, status: 'warning', revenue: 1800000 },
    { name: 'New York', code: 'NY', clients: 28, alerts: 1, status: 'pending', revenue: 1600000 },
    { name: 'Florida', code: 'FL', clients: 22, alerts: 0, status: 'compliant', revenue: 1200000 },
    { name: 'Illinois', code: 'IL', clients: 18, alerts: 1, status: 'warning', revenue: 950000 },
    { name: 'Pennsylvania', code: 'PA', clients: 15, alerts: 0, status: 'compliant', revenue: 800000 },
    { name: 'Ohio', code: 'OH', clients: 12, alerts: 0, status: 'compliant', revenue: 650000 },
    { name: 'Georgia', code: 'GA', clients: 14, alerts: 1, status: 'warning', revenue: 750000 },
    { name: 'North Carolina', code: 'NC', clients: 11, alerts: 0, status: 'compliant', revenue: 600000 },
    { name: 'Michigan', code: 'MI', clients: 9, alerts: 0, status: 'compliant', revenue: 500000 },
    { name: 'New Jersey', code: 'NJ', clients: 13, alerts: 1, status: 'warning', revenue: 700000 },
    { name: 'Virginia', code: 'VA', clients: 8, alerts: 0, status: 'compliant', revenue: 450000 },
    { name: 'Washington', code: 'WA', clients: 16, alerts: 2, status: 'critical', revenue: 900000 },
    { name: 'Arizona', code: 'AZ', clients: 10, alerts: 0, status: 'compliant', revenue: 550000 },
    { name: 'Massachusetts', code: 'MA', clients: 12, alerts: 1, status: 'warning', revenue: 650000 },
    { name: 'Tennessee', code: 'TN', clients: 7, alerts: 0, status: 'compliant', revenue: 400000 },
    { name: 'Indiana', code: 'IN', clients: 6, alerts: 0, status: 'compliant', revenue: 350000 },
    { name: 'Missouri', code: 'MO', clients: 8, alerts: 0, status: 'compliant', revenue: 450000 },
    { name: 'Maryland', code: 'MD', clients: 9, alerts: 0, status: 'compliant', revenue: 500000 },
    { name: 'Wisconsin', code: 'WI', clients: 5, alerts: 0, status: 'compliant', revenue: 300000 },
  ];

  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') || 
                    window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
    };
    
    checkDarkMode();
    
    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  const getStateColor = (status: string) => {
    if (isDarkMode) {
      switch (status) {
        case 'critical': return '#f87171'; // red-400 for dark mode
        case 'warning': return '#fbbf24'; // amber-400 for dark mode
        case 'pending': return '#60a5fa'; // blue-400 for dark mode
        case 'compliant': return '#34d399'; // emerald-400 for dark mode
        default: return '#9ca3af'; // gray-400 for dark mode
      }
    } else {
      switch (status) {
        case 'critical': return '#dc2626'; // red-600 for light mode
        case 'warning': return '#d97706'; // amber-600 for light mode
        case 'pending': return '#2563eb'; // blue-600 for light mode
        case 'compliant': return '#059669'; // emerald-600 for light mode
        default: return '#4b5563'; // gray-600 for light mode
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleStateClick = (stateName: string) => {
    const state = stateData.find(s => s.name === stateName);
    if (state) {
      setSelectedState(selectedState?.name === state.name ? null : state);
    }
  };

  // Get state data by name for the map
  const getStateData = (stateName: string) => {
    return stateData.find(s => s.name === stateName);
  };

  // Get fill color for each state
  const getStateFill = (stateName: string) => {
    const state = getStateData(stateName);
    if (!state) return isDarkMode ? '#374151' : '#e5e7eb'; // Default color
    return getStateColor(state.status);
  };

  // Get stroke color for each state
  const getStateStroke = (stateName: string) => {
    const state = getStateData(stateName);
    if (!state) return isDarkMode ? '#4b5563' : '#d1d5db'; // Default stroke
    return isDarkMode ? '#ffffff' : '#000000';
  };

  // Get tooltip content for each state
  const getStateTooltip = (stateName: string) => {
    const state = getStateData(stateName);
    if (!state) return `${stateName}: No data`;
    
    return `
      <div class="p-2">
        <h3 class="font-bold text-lg">${state.name}</h3>
        <p class="text-sm"><strong>Clients:</strong> ${state.clients}</p>
        <p class="text-sm"><strong>Alerts:</strong> ${state.alerts}</p>
        <p class="text-sm"><strong>Status:</strong> ${state.status}</p>
        <p class="text-sm"><strong>Revenue:</strong> ${formatCurrency(state.revenue)}</p>
      </div>
    `;
  };

  return (
    <div className="w-full h-full">
      {/* React US Map Container */}
      <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900">
        <div className="w-full h-full p-4">
          <USMap
            fill={(stateName: string) => getStateFill(stateName)}
            stroke={(stateName: string) => getStateStroke(stateName)}
            strokeWidth={(stateName: string) => 1.5}
            onClick={(stateName: string) => handleStateClick(stateName)}
            tooltip={(stateName: string) => getStateTooltip(stateName)}
            width={800}
            height={400}
            style={{
              filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))',
              borderRadius: '12px'
            }}
          />
        </div>
        
        {/* Map Overlay Controls */}
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Nexus Client Distribution</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">Click states for details</p>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
              <span className="text-xs text-gray-700 dark:text-gray-300">Critical</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm"></div>
              <span className="text-xs text-gray-700 dark:text-gray-300">Warning</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div>
              <span className="text-xs text-gray-700 dark:text-gray-300">Pending</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></div>
              <span className="text-xs text-gray-700 dark:text-gray-300">Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* State Details Panel */}
      {selectedState && (
        <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedState.name} ({selectedState.code})
            </h4>
            <button
              onClick={() => setSelectedState(null)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Clients:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedState.clients}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Alerts:</span>
                <span className={`text-sm font-medium ${
                  selectedState.alerts > 2 ? 'text-red-600' : 
                  selectedState.alerts > 0 ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {selectedState.alerts}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full text-xs ${
                  selectedState.status === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                  selectedState.status === 'warning' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300' :
                  selectedState.status === 'pending' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                  'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300'
                }`}>
                  {selectedState.status.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Revenue:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(selectedState.revenue)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-4 grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-3 text-white">
          <div className="text-xs opacity-90">Critical States</div>
          <div className="text-lg font-bold">
            {stateData.filter(s => s.status === 'critical').length}
          </div>
        </div>
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-3 text-white">
          <div className="text-xs opacity-90">Warning States</div>
          <div className="text-lg font-bold">
            {stateData.filter(s => s.status === 'warning').length}
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3 text-white">
          <div className="text-xs opacity-90">Pending States</div>
          <div className="text-lg font-bold">
            {stateData.filter(s => s.status === 'pending').length}
          </div>
        </div>
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg p-3 text-white">
          <div className="text-xs opacity-90">Compliant States</div>
          <div className="text-lg font-bold">
            {stateData.filter(s => s.status === 'compliant').length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default USStatesMap;
