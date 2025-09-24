"use client";
import React, { useState, useEffect } from "react";
import { USMap } from "react-us-map";

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
  const [isMounted, setIsMounted] = useState(false);

  // Initialize component
  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    { name: 'Alaska', code: 'AK', clients: 3, alerts: 0, status: 'compliant', revenue: 150000 },
    { name: 'Hawaii', code: 'HI', clients: 2, alerts: 0, status: 'compliant', revenue: 100000 },
    { name: 'Puerto Rico', code: 'PR', clients: 1, alerts: 0, status: 'compliant', revenue: 50000 },
  ];

  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  // Helper function to get state data by name
  const getStateDataByName = (stateName: string) => {
    return stateData.find(s => s.name === stateName);
  };

  const handleStateClick = (stateName: string) => {
    const state = stateData.find(s => s.name === stateName);
    if (state) {
      setSelectedState(selectedState?.name === state.name ? null : state);
    }
  };

  const getStateFill = (stateName: string) => {
    const state = stateData.find(s => s.name === stateName);
    if (!state) return isDarkMode ? '#374151' : '#e5e7eb'; // gray-700 for dark, gray-200 for light

    switch (state.status) {
      case 'critical':
        return isDarkMode ? '#dc2626' : '#ef4444'; // red-600 for dark, red-500 for light
      case 'warning':
        return isDarkMode ? '#d97706' : '#f59e0b'; // amber-600 for dark, amber-500 for light
      case 'pending':
        return isDarkMode ? '#2563eb' : '#3b82f6'; // blue-600 for dark, blue-500 for light
      case 'compliant':
        return isDarkMode ? '#059669' : '#10b981'; // emerald-600 for dark, emerald-500 for light
      default:
        return isDarkMode ? '#374151' : '#e5e7eb';
    }
  };

  const getStateStroke = (stateName: string) => {
    const state = stateData.find(s => s.name === stateName);
    if (!state) return isDarkMode ? '#6b7280' : '#9ca3af'; // gray-500 for dark, gray-400 for light

    switch (state.status) {
      case 'critical':
        return isDarkMode ? '#b91c1c' : '#dc2626'; // red-700 for dark, red-600 for light
      case 'warning':
        return isDarkMode ? '#b45309' : '#d97706'; // amber-700 for dark, amber-600 for light
      case 'pending':
        return isDarkMode ? '#1d4ed8' : '#2563eb'; // blue-700 for dark, blue-600 for light
      case 'compliant':
        return isDarkMode ? '#047857' : '#059669'; // emerald-700 for dark, emerald-600 for light
      default:
        return isDarkMode ? '#6b7280' : '#9ca3af';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 dark:text-red-400';
      case 'warning': return 'text-amber-600 dark:text-amber-400';
      case 'pending': return 'text-blue-600 dark:text-blue-400';
      case 'compliant': return 'text-emerald-600 dark:text-emerald-400';
      default: return 'text-gray-600 dark:text-gray-400';
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

  if (!isMounted) {
    return (
      <div className="w-full h-96 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-2">🗺️</div>
          <p className="text-gray-600 dark:text-gray-400">Loading US Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {/* US Map using react-us-map library */}
      <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900">
        <div className="w-full h-full p-4">
          <USMap
            fill={(stateName: string) => {
              const stateInfo = getStateDataByName(stateName);
              return stateInfo ? getStateFill(stateInfo.name) : '#e5e7eb';
            }}
            stroke={(stateName: string) => {
              const stateInfo = getStateDataByName(stateName);
              return stateInfo ? getStateStroke(stateInfo.name) : '#9ca3af';
            }}
            strokeWidth={(stateName: string) => {
              const stateInfo = getStateDataByName(stateName);
              return selectedState?.name === stateName ? 3 : 1;
            }}
            onClick={(stateName: string) => {
              handleStateClick(stateName);
            }}
            tooltip={(stateName: string) => {
              const stateInfo = getStateDataByName(stateName);
              if (!stateInfo) return stateName;
              
              return `
                <div class="p-2">
                  <h4 class="font-bold text-sm mb-1">${stateInfo.name} (${stateInfo.code})</h4>
                  <p class="text-xs mb-1"><strong>Clients:</strong> ${stateInfo.clients}</p>
                  <p class="text-xs mb-1"><strong>Alerts:</strong> ${stateInfo.alerts}</p>
                  <p class="text-xs mb-1"><strong>Status:</strong> <span class="font-semibold ${getStatusTextColor(stateInfo.status)}">${stateInfo.status.toUpperCase()}</span></p>
                  <p class="text-xs"><strong>Revenue:</strong> ${formatCurrency(stateInfo.revenue)}</p>
                </div>
              `;
            }}
            width={800}
            height={400}
            className="w-full h-full"
          />
        </div>
        
        {/* Map Overlay Controls */}
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Nexus Client Distribution</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">Click states for details</p>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
              <span className="text-xs text-gray-700 dark:text-gray-300">Critical</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm"></div>
              <span className="text-xs text-gray-700 dark:text-gray-300">Warning</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div>
              <span className="text-xs text-gray-700 dark:text-gray-300">Pending</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></div>
              <span className="text-xs text-gray-700 dark:text-gray-300">Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* State Details Panel */}
      {selectedState && (
        <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-bold mb-2">{selectedState.name} ({selectedState.code})</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><strong>Clients:</strong> {selectedState.clients}</div>
            <div><strong>Alerts:</strong> {selectedState.alerts}</div>
            <div><strong>Status:</strong> <span className={`font-semibold ${getStatusTextColor(selectedState.status)}`}>{selectedState.status.toUpperCase()}</span></div>
            <div><strong>Revenue:</strong> {formatCurrency(selectedState.revenue)}</div>
          </div>
          <div className="mt-3">
            <h5 className="font-semibold text-default-900 mb-1">Details:</h5>
            <p className="text-sm text-default-600">
              {selectedState.name} has {selectedState.clients} clients with {selectedState.alerts} active alerts. Current status is {selectedState.status}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default USStatesMap;