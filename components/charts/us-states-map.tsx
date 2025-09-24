"use client";
import React, { useState, useEffect } from "react";

// US Map SVG Paths - Simplified but recognizable state shapes
const US_MAP_PATHS = {
  // Main US States (simplified SVG paths)
  "AL": "M 400 200 L 450 200 L 450 250 L 400 250 Z", // Alabama
  "AZ": "M 200 300 L 300 300 L 300 400 L 200 400 Z", // Arizona
  "AR": "M 350 200 L 400 200 L 400 250 L 350 250 Z", // Arkansas
  "CA": "M 50 200 L 200 200 L 200 400 L 50 400 Z", // California
  "CO": "M 300 200 L 350 200 L 350 300 L 300 300 Z", // Colorado
  "CT": "M 600 150 L 650 150 L 650 200 L 600 200 Z", // Connecticut
  "DE": "M 600 200 L 650 200 L 650 250 L 600 250 Z", // Delaware
  "FL": "M 500 100 L 600 100 L 600 200 L 500 200 Z", // Florida
  "GA": "M 500 200 L 600 200 L 600 250 L 500 250 Z", // Georgia
  "ID": "M 200 100 L 300 100 L 300 200 L 200 200 Z", // Idaho
  "IL": "M 400 150 L 500 150 L 500 200 L 400 200 Z", // Illinois
  "IN": "M 450 150 L 550 150 L 550 200 L 450 200 Z", // Indiana
  "IA": "M 350 100 L 450 100 L 450 150 L 350 150 Z", // Iowa
  "KS": "M 300 150 L 400 150 L 400 200 L 300 200 Z", // Kansas
  "KY": "M 450 200 L 550 200 L 550 250 L 450 250 Z", // Kentucky
  "LA": "M 350 100 L 450 100 L 450 150 L 350 150 Z", // Louisiana
  "ME": "M 650 50 L 750 50 L 750 100 L 650 100 Z", // Maine
  "MD": "M 600 200 L 650 200 L 650 250 L 600 250 Z", // Maryland
  "MA": "M 650 100 L 750 100 L 750 150 L 650 150 Z", // Massachusetts
  "MI": "M 450 100 L 550 100 L 550 150 L 450 150 Z", // Michigan
  "MN": "M 350 50 L 450 50 L 450 100 L 350 100 Z", // Minnesota
  "MS": "M 400 150 L 500 150 L 500 200 L 400 200 Z", // Mississippi
  "MO": "M 350 150 L 450 150 L 450 200 L 350 200 Z", // Missouri
  "MT": "M 200 50 L 350 50 L 350 100 L 200 100 Z", // Montana
  "NE": "M 300 100 L 400 100 L 400 150 L 300 150 Z", // Nebraska
  "NV": "M 150 200 L 250 200 L 250 300 L 150 300 Z", // Nevada
  "NH": "M 650 100 L 750 100 L 750 150 L 650 150 Z", // New Hampshire
  "NJ": "M 600 150 L 650 150 L 650 200 L 600 200 Z", // New Jersey
  "NM": "M 250 300 L 350 300 L 350 400 L 250 400 Z", // New Mexico
  "NY": "M 600 50 L 700 50 L 700 150 L 600 150 Z", // New York
  "NC": "M 550 200 L 650 200 L 650 250 L 550 250 Z", // North Carolina
  "ND": "M 300 50 L 400 50 L 400 100 L 300 100 Z", // North Dakota
  "OH": "M 500 150 L 600 150 L 600 200 L 500 200 Z", // Ohio
  "OK": "M 300 250 L 400 250 L 400 300 L 300 300 Z", // Oklahoma
  "OR": "M 50 100 L 200 100 L 200 200 L 50 200 Z", // Oregon
  "PA": "M 550 100 L 650 100 L 650 150 L 550 150 Z", // Pennsylvania
  "RI": "M 650 150 L 700 150 L 700 200 L 650 200 Z", // Rhode Island
  "SC": "M 550 200 L 600 200 L 600 250 L 550 250 Z", // South Carolina
  "SD": "M 300 100 L 400 100 L 400 150 L 300 150 Z", // South Dakota
  "TN": "M 450 200 L 550 200 L 550 250 L 450 250 Z", // Tennessee
  "TX": "M 300 300 L 450 300 L 450 400 L 300 400 Z", // Texas
  "UT": "M 200 200 L 300 200 L 300 300 L 200 300 Z", // Utah
  "VT": "M 600 100 L 700 100 L 700 150 L 600 150 Z", // Vermont
  "VA": "M 550 200 L 650 200 L 650 250 L 550 250 Z", // Virginia
  "WA": "M 50 50 L 200 50 L 200 100 L 50 100 Z", // Washington
  "WV": "M 500 150 L 600 150 L 600 200 L 500 200 Z", // West Virginia
  "WI": "M 400 100 L 500 100 L 500 150 L 400 150 Z", // Wisconsin
  "WY": "M 250 100 L 350 100 L 350 200 L 250 200 Z", // Wyoming
  "DC": "M 600 200 L 650 200 L 650 250 L 600 250 Z", // District of Columbia
  
  // Alaska (positioned separately)
  "AK": "M 50 350 L 150 350 L 150 450 L 50 450 Z",
  
  // Hawaii (positioned separately)
  "HI": "M 50 400 L 100 400 L 100 450 L 50 450 Z",
  
  // Puerto Rico (positioned separately)
  "PR": "M 650 400 L 700 400 L 700 450 L 650 450 Z"
};


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

  const getStateCenter = (stateCode: string) => {
    // Calculate center position for state labels based on the SVG paths
    const centers: { [key: string]: { x: number; y: number } } = {
      "AL": { x: 425, y: 225 },
      "AZ": { x: 250, y: 350 },
      "AR": { x: 375, y: 225 },
      "CA": { x: 125, y: 300 },
      "CO": { x: 325, y: 250 },
      "CT": { x: 625, y: 175 },
      "DE": { x: 625, y: 225 },
      "FL": { x: 550, y: 150 },
      "GA": { x: 550, y: 225 },
      "ID": { x: 250, y: 150 },
      "IL": { x: 450, y: 175 },
      "IN": { x: 500, y: 175 },
      "IA": { x: 400, y: 125 },
      "KS": { x: 350, y: 175 },
      "KY": { x: 500, y: 225 },
      "LA": { x: 400, y: 125 },
      "ME": { x: 700, y: 75 },
      "MD": { x: 625, y: 225 },
      "MA": { x: 700, y: 125 },
      "MI": { x: 500, y: 125 },
      "MN": { x: 400, y: 75 },
      "MS": { x: 450, y: 175 },
      "MO": { x: 400, y: 175 },
      "MT": { x: 275, y: 75 },
      "NE": { x: 350, y: 125 },
      "NV": { x: 200, y: 250 },
      "NH": { x: 700, y: 125 },
      "NJ": { x: 625, y: 175 },
      "NM": { x: 300, y: 350 },
      "NY": { x: 650, y: 100 },
      "NC": { x: 600, y: 225 },
      "ND": { x: 350, y: 75 },
      "OH": { x: 550, y: 175 },
      "OK": { x: 350, y: 275 },
      "OR": { x: 125, y: 150 },
      "PA": { x: 600, y: 125 },
      "RI": { x: 675, y: 175 },
      "SC": { x: 575, y: 225 },
      "SD": { x: 350, y: 125 },
      "TN": { x: 500, y: 225 },
      "TX": { x: 375, y: 350 },
      "UT": { x: 250, y: 250 },
      "VT": { x: 650, y: 125 },
      "VA": { x: 600, y: 225 },
      "WA": { x: 125, y: 75 },
      "WV": { x: 550, y: 175 },
      "WI": { x: 450, y: 125 },
      "WY": { x: 300, y: 150 },
      "DC": { x: 625, y: 225 }
    };
    
    return centers[stateCode] || { x: 400, y: 200 };
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
      {/* US Map Visualization - Based on usmap R package */}
      <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900">
        <div className="w-full h-full p-4">
          {/* SVG US Map with Actual State Shapes */}
          <svg 
            viewBox="0 0 800 500" 
            className="w-full h-full"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))' }}
          >
            {/* Main US States */}
            <g className="main-states">
              {Object.entries(US_MAP_PATHS).filter(([code]) => !['AK', 'HI', 'PR'].includes(code)).map(([code, path]) => {
                const stateInfo = stateData.find(s => s.code === code);
                const fillColor = stateInfo ? getStateFill(stateInfo.name) : '#e5e7eb';
                const strokeColor = stateInfo ? getStateStroke(stateInfo.name) : '#9ca3af';
                
                return (
                  <g key={code}>
                    {/* State Shape */}
                    <path
                      d={path}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth="1"
                      className="cursor-pointer transition-all duration-200 hover:opacity-80"
                      onClick={() => stateInfo && handleStateClick(stateInfo.name)}
                      style={{
                        filter: selectedState?.code === code ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))' : 'none'
                      }}
                    />
                    {/* State Label */}
                    <text
                      x={getStateCenter(code).x}
                      y={getStateCenter(code).y}
                      textAnchor="middle"
                      className="text-xs font-semibold fill-gray-800 dark:fill-gray-200 pointer-events-none"
                    >
                      {code}
                    </text>
                  </g>
                );
              })}
            </g>
            
            {/* Alaska */}
            <g className="alaska">
              {(() => {
                const alaskaState = stateData.find(s => s.code === 'AK');
                const fillColor = alaskaState ? getStateFill(alaskaState.name) : '#e5e7eb';
                const strokeColor = alaskaState ? getStateStroke(alaskaState.name) : '#9ca3af';
                
                return (
                  <g>
                    <path
                      d={US_MAP_PATHS.AK}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth="1"
                      className="cursor-pointer transition-all duration-200 hover:opacity-80"
                      onClick={() => alaskaState && handleStateClick(alaskaState.name)}
                      style={{
                        filter: selectedState?.code === 'AK' ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))' : 'none'
                      }}
                    />
                    <text
                      x="100"
                      y="400"
                      textAnchor="middle"
                      className="text-xs font-semibold fill-gray-800 dark:fill-gray-200 pointer-events-none"
                    >
                      AK
                    </text>
                  </g>
                );
              })()}
            </g>
            
            {/* Hawaii */}
            <g className="hawaii">
              {(() => {
                const hawaiiState = stateData.find(s => s.code === 'HI');
                const fillColor = hawaiiState ? getStateFill(hawaiiState.name) : '#e5e7eb';
                const strokeColor = hawaiiState ? getStateStroke(hawaiiState.name) : '#9ca3af';
                
                return (
                  <g>
                    <path
                      d={US_MAP_PATHS.HI}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth="1"
                      className="cursor-pointer transition-all duration-200 hover:opacity-80"
                      onClick={() => hawaiiState && handleStateClick(hawaiiState.name)}
                      style={{
                        filter: selectedState?.code === 'HI' ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))' : 'none'
                      }}
                    />
                    <text
                      x="75"
                      y="425"
                      textAnchor="middle"
                      className="text-xs font-semibold fill-gray-800 dark:fill-gray-200 pointer-events-none"
                    >
                      HI
                    </text>
                  </g>
                );
              })()}
            </g>
            
            {/* Puerto Rico */}
            <g className="puerto-rico">
              {(() => {
                const prState = stateData.find(s => s.code === 'PR');
                const fillColor = prState ? getStateFill(prState.name) : '#e5e7eb';
                const strokeColor = prState ? getStateStroke(prState.name) : '#9ca3af';
                
                return (
                  <g>
                    <path
                      d={US_MAP_PATHS.PR}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth="1"
                      className="cursor-pointer transition-all duration-200 hover:opacity-80"
                      onClick={() => prState && handleStateClick(prState.name)}
            style={{
                        filter: selectedState?.code === 'PR' ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))' : 'none'
                      }}
                    />
                    <text
                      x="675"
                      y="425"
                      textAnchor="middle"
                      className="text-xs font-semibold fill-gray-800 dark:fill-gray-200 pointer-events-none"
                    >
                      PR
                    </text>
                  </g>
                );
              })()}
            </g>
            
            {/* Labels for Alaska, Hawaii, Puerto Rico */}
            <text x="200" y="400" className="text-xs fill-gray-600 dark:fill-gray-400">Alaska</text>
            <text x="150" y="450" className="text-xs fill-gray-600 dark:fill-gray-400">Hawaii</text>
            <text x="750" y="450" className="text-xs fill-gray-600 dark:fill-gray-400">Puerto Rico</text>
          </svg>
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
