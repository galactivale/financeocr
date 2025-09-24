"use client";
import React, { useState, useEffect, useRef } from "react";

interface StateData {
  name: string;
  code: string;
  clients: number;
  alerts: number;
  status: 'compliant' | 'warning' | 'critical' | 'pending';
  revenue: number;
}

// US States SVG Path Data - React 19 Compatible
const US_STATES_PATHS = {
  // Main US States
  "AL": "M 400 200 L 450 200 L 450 250 L 400 250 Z",
  "AZ": "M 200 300 L 300 300 L 300 400 L 200 400 Z", 
  "AR": "M 350 200 L 400 200 L 400 250 L 350 250 Z",
  "CA": "M 50 200 L 200 200 L 200 400 L 50 400 Z",
  "CO": "M 300 200 L 350 200 L 350 300 L 300 300 Z",
  "CT": "M 600 150 L 650 150 L 650 200 L 600 200 Z",
  "DE": "M 600 200 L 650 200 L 650 250 L 600 250 Z",
  "FL": "M 500 100 L 600 100 L 600 200 L 500 200 Z",
  "GA": "M 500 200 L 600 200 L 600 250 L 500 250 Z",
  "ID": "M 200 100 L 300 100 L 300 200 L 200 200 Z",
  "IL": "M 400 150 L 500 150 L 500 200 L 400 200 Z",
  "IN": "M 450 150 L 550 150 L 550 200 L 450 200 Z",
  "IA": "M 350 100 L 450 100 L 450 150 L 350 150 Z",
  "KS": "M 300 150 L 400 150 L 400 200 L 300 200 Z",
  "KY": "M 450 200 L 550 200 L 550 250 L 450 250 Z",
  "LA": "M 350 100 L 450 100 L 450 150 L 350 150 Z",
  "ME": "M 650 50 L 750 50 L 750 100 L 650 100 Z",
  "MD": "M 600 200 L 650 200 L 650 250 L 600 250 Z",
  "MA": "M 650 100 L 750 100 L 750 150 L 650 150 Z",
  "MI": "M 450 100 L 550 100 L 550 150 L 450 150 Z",
  "MN": "M 350 50 L 450 50 L 450 100 L 350 100 Z",
  "MS": "M 400 150 L 500 150 L 500 200 L 400 200 Z",
  "MO": "M 350 150 L 450 150 L 450 200 L 350 200 Z",
  "MT": "M 200 50 L 350 50 L 350 100 L 200 100 Z",
  "NE": "M 300 100 L 400 100 L 400 150 L 300 150 Z",
  "NV": "M 150 200 L 250 200 L 250 300 L 150 300 Z",
  "NH": "M 650 100 L 750 100 L 750 150 L 650 150 Z",
  "NJ": "M 600 150 L 650 150 L 650 200 L 600 200 Z",
  "NM": "M 250 300 L 350 300 L 350 400 L 250 400 Z",
  "NY": "M 600 50 L 700 50 L 700 150 L 600 150 Z",
  "NC": "M 550 200 L 650 200 L 650 250 L 550 250 Z",
  "ND": "M 300 50 L 400 50 L 400 100 L 300 100 Z",
  "OH": "M 500 150 L 600 150 L 600 200 L 500 200 Z",
  "OK": "M 300 250 L 400 250 L 400 300 L 300 300 Z",
  "OR": "M 50 100 L 200 100 L 200 200 L 50 200 Z",
  "PA": "M 550 100 L 650 100 L 650 150 L 550 150 Z",
  "RI": "M 650 150 L 700 150 L 700 200 L 650 200 Z",
  "SC": "M 550 200 L 600 200 L 600 250 L 550 250 Z",
  "SD": "M 300 100 L 400 100 L 400 150 L 300 150 Z",
  "TN": "M 450 200 L 550 200 L 550 250 L 450 250 Z",
  "TX": "M 300 300 L 450 300 L 450 400 L 300 400 Z",
  "UT": "M 200 200 L 300 200 L 300 300 L 200 300 Z",
  "VT": "M 600 100 L 700 100 L 700 150 L 600 150 Z",
  "VA": "M 550 200 L 650 200 L 650 250 L 550 250 Z",
  "WA": "M 50 50 L 200 50 L 200 100 L 50 100 Z",
  "WV": "M 500 150 L 600 150 L 600 200 L 500 200 Z",
  "WI": "M 400 100 L 500 100 L 500 150 L 400 150 Z",
  "WY": "M 250 100 L 350 100 L 350 200 L 250 200 Z",
  "DC": "M 600 200 L 650 200 L 650 250 L 600 250 Z",
  
  // Alaska, Hawaii, Puerto Rico
  "AK": "M 50 350 L 150 350 L 150 450 L 50 450 Z",
  "HI": "M 50 400 L 100 400 L 100 450 L 50 450 Z", 
  "PR": "M 650 400 L 700 400 L 700 450 L 650 450 Z"
};

// State center positions for labels
const STATE_CENTERS: { [key: string]: { x: number; y: number } } = {
  "AL": { x: 425, y: 225 }, "AZ": { x: 250, y: 350 }, "AR": { x: 375, y: 225 },
  "CA": { x: 125, y: 300 }, "CO": { x: 325, y: 250 }, "CT": { x: 625, y: 175 },
  "DE": { x: 625, y: 225 }, "FL": { x: 550, y: 150 }, "GA": { x: 550, y: 225 },
  "ID": { x: 250, y: 150 }, "IL": { x: 450, y: 175 }, "IN": { x: 500, y: 175 },
  "IA": { x: 400, y: 125 }, "KS": { x: 350, y: 175 }, "KY": { x: 500, y: 225 },
  "LA": { x: 400, y: 125 }, "ME": { x: 700, y: 75 }, "MD": { x: 625, y: 225 },
  "MA": { x: 700, y: 125 }, "MI": { x: 500, y: 125 }, "MN": { x: 400, y: 75 },
  "MS": { x: 450, y: 175 }, "MO": { x: 400, y: 175 }, "MT": { x: 275, y: 75 },
  "NE": { x: 350, y: 125 }, "NV": { x: 200, y: 250 }, "NH": { x: 700, y: 125 },
  "NJ": { x: 625, y: 175 }, "NM": { x: 300, y: 350 }, "NY": { x: 650, y: 100 },
  "NC": { x: 600, y: 225 }, "ND": { x: 350, y: 75 }, "OH": { x: 550, y: 175 },
  "OK": { x: 350, y: 275 }, "OR": { x: 125, y: 150 }, "PA": { x: 600, y: 125 },
  "RI": { x: 675, y: 175 }, "SC": { x: 575, y: 225 }, "SD": { x: 350, y: 125 },
  "TN": { x: 500, y: 225 }, "TX": { x: 375, y: 350 }, "UT": { x: 250, y: 250 },
  "VT": { x: 650, y: 125 }, "VA": { x: 600, y: 225 }, "WA": { x: 125, y: 75 },
  "WV": { x: 550, y: 175 }, "WI": { x: 450, y: 125 }, "WY": { x: 300, y: 150 },
  "DC": { x: 625, y: 225 }, "AK": { x: 100, y: 400 }, "HI": { x: 75, y: 425 },
  "PR": { x: 675, y: 425 }
};

const USStatesMap = () => {
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

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

  const handleStateHover = (stateName: string | null) => {
    setHoveredState(stateName);
  };

  const getStateFill = (stateName: string) => {
    const state = stateData.find(s => s.name === stateName);
    if (!state) return isDarkMode ? '#374151' : '#e5e7eb';

    switch (state.status) {
      case 'critical':
        return isDarkMode ? '#dc2626' : '#ef4444';
      case 'warning':
        return isDarkMode ? '#d97706' : '#f59e0b';
      case 'pending':
        return isDarkMode ? '#2563eb' : '#3b82f6';
      case 'compliant':
        return isDarkMode ? '#059669' : '#10b981';
      default:
        return isDarkMode ? '#374151' : '#e5e7eb';
    }
  };

  const getStateStroke = (stateName: string) => {
    const state = stateData.find(s => s.name === stateName);
    if (!state) return isDarkMode ? '#6b7280' : '#9ca3af';

    switch (state.status) {
      case 'critical':
        return isDarkMode ? '#b91c1c' : '#dc2626';
      case 'warning':
        return isDarkMode ? '#b45309' : '#d97706';
      case 'pending':
        return isDarkMode ? '#1d4ed8' : '#2563eb';
      case 'compliant':
        return isDarkMode ? '#047857' : '#059669';
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
    <div className="w-full h-full relative">
      {/* US Map - React 19 Compatible */}
      <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900">
        <div className="w-full h-full p-4">
          <svg 
            viewBox="0 0 800 500" 
            className="w-full h-full"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))' }}
          >
            {/* Main US States */}
            <g className="main-states">
              {Object.entries(US_STATES_PATHS).filter(([code]) => !['AK', 'HI', 'PR'].includes(code)).map(([code, path]) => {
                const stateInfo = getStateDataByName(code);
                const fillColor = stateInfo ? getStateFill(stateInfo.name) : '#e5e7eb';
                const strokeColor = stateInfo ? getStateStroke(stateInfo.name) : '#9ca3af';
                const isSelected = selectedState?.code === code;
                const isHovered = hoveredState === code;
                
                return (
                  <g key={code}>
                    <path
                      d={path}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? 3 : 1}
                      className="cursor-pointer transition-all duration-200 hover:opacity-80"
                      onClick={() => stateInfo && handleStateClick(stateInfo.name)}
                      onMouseEnter={() => handleStateHover(code)}
                      onMouseLeave={() => handleStateHover(null)}
                      style={{
                        filter: isSelected ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))' : 'none',
                        opacity: isHovered ? 0.8 : 1
                      }}
                    />
                    <text
                      x={STATE_CENTERS[code]?.x || 400}
                      y={STATE_CENTERS[code]?.y || 200}
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
                const alaskaState = getStateDataByName('Alaska');
                const fillColor = alaskaState ? getStateFill(alaskaState.name) : '#e5e7eb';
                const strokeColor = alaskaState ? getStateStroke(alaskaState.name) : '#9ca3af';
                const isSelected = selectedState?.code === 'AK';
                const isHovered = hoveredState === 'AK';
                
                return (
                  <g>
                    <path
                      d={US_STATES_PATHS.AK}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? 3 : 1}
                      className="cursor-pointer transition-all duration-200 hover:opacity-80"
                      onClick={() => alaskaState && handleStateClick(alaskaState.name)}
                      onMouseEnter={() => handleStateHover('AK')}
                      onMouseLeave={() => handleStateHover(null)}
                      style={{
                        filter: isSelected ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))' : 'none',
                        opacity: isHovered ? 0.8 : 1
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
                const hawaiiState = getStateDataByName('Hawaii');
                const fillColor = hawaiiState ? getStateFill(hawaiiState.name) : '#e5e7eb';
                const strokeColor = hawaiiState ? getStateStroke(hawaiiState.name) : '#9ca3af';
                const isSelected = selectedState?.code === 'HI';
                const isHovered = hoveredState === 'HI';
                
                return (
                  <g>
                    <path
                      d={US_STATES_PATHS.HI}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? 3 : 1}
                      className="cursor-pointer transition-all duration-200 hover:opacity-80"
                      onClick={() => hawaiiState && handleStateClick(hawaiiState.name)}
                      onMouseEnter={() => handleStateHover('HI')}
                      onMouseLeave={() => handleStateHover(null)}
                      style={{
                        filter: isSelected ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))' : 'none',
                        opacity: isHovered ? 0.8 : 1
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
                const prState = getStateDataByName('Puerto Rico');
                const fillColor = prState ? getStateFill(prState.name) : '#e5e7eb';
                const strokeColor = prState ? getStateStroke(prState.name) : '#9ca3af';
                const isSelected = selectedState?.code === 'PR';
                const isHovered = hoveredState === 'PR';
                
                return (
                  <g>
                    <path
                      d={US_STATES_PATHS.PR}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? 3 : 1}
                      className="cursor-pointer transition-all duration-200 hover:opacity-80"
                      onClick={() => prState && handleStateClick(prState.name)}
                      onMouseEnter={() => handleStateHover('PR')}
                      onMouseLeave={() => handleStateHover(null)}
            style={{
                        filter: isSelected ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))' : 'none',
                        opacity: isHovered ? 0.8 : 1
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

      {/* Tooltip */}
      {hoveredState && (
        <div 
          ref={tooltipRef}
          className="absolute z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 pointer-events-none"
          style={{
            top: '10px',
            right: '10px',
            minWidth: '200px'
          }}
        >
          {(() => {
            const stateInfo = getStateDataByName(hoveredState);
            if (!stateInfo) return <div>Loading...</div>;
            
            return (
              <div>
                <h4 className="font-bold text-sm mb-1">{stateInfo.name} ({stateInfo.code})</h4>
                <p className="text-xs mb-1"><strong>Clients:</strong> {stateInfo.clients}</p>
                <p className="text-xs mb-1"><strong>Alerts:</strong> {stateInfo.alerts}</p>
                <p className="text-xs mb-1"><strong>Status:</strong> <span className={`font-semibold ${getStatusTextColor(stateInfo.status)}`}>{stateInfo.status.toUpperCase()}</span></p>
                <p className="text-xs"><strong>Revenue:</strong> {formatCurrency(stateInfo.revenue)}</p>
              </div>
            );
          })()}
        </div>
      )}

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