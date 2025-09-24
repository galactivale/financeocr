"use client";
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  Button, 
  Chip, 
  Input,
  Progress,
  Badge
} from "@nextui-org/react";

// Client data structure for monitoring
interface Client {
  id: string;
  name: string;
  state: string;
  industry: string;
  revenue: string;
  nexusStatus: 'compliant' | 'warning' | 'critical' | 'pending';
  thresholdProgress: number;
  lastUpdate: string;
  alerts: number;
  riskScore: number;
  states: string[];
}

// State monitoring data
interface StateMonitoringData {
  state: string;
  clients: number;
  totalRevenue: number;
  criticalAlerts: number;
  warningAlerts: number;
  complianceRate: number;
  lastUpdated: string;
}

// Circular Gauge Component
const CircularGauge = ({ 
  value, 
  max = 100, 
  label, 
  color = "blue", 
  size = 120 
}: { 
  value: number; 
  max?: number; 
  label: string; 
  color?: string; 
  size?: number; 
}) => {
  const percentage = (value / max) * 100;
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    switch (color) {
      case 'orange': return '#f59e0b';
      case 'yellow': return '#eab308';
      case 'purple': return '#8b5cf6';
      case 'red': return '#ef4444';
      case 'green': return '#10b981';
      default: return '#3b82f6';
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#374151"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getColor()}
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{value}%</div>
            <div className="text-xs text-gray-400">{label}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Line Graph Component
const LineGraph = ({ 
  title, 
  status, 
  currentValue, 
  change, 
  changePercent, 
  data = [] 
}: { 
  title: string; 
  status: string; 
  currentValue: string; 
  change: string; 
  changePercent: string; 
  data?: number[]; 
}) => {
  const maxValue = Math.max(...data, 100);
  const minValue = Math.min(...data, 0);
  const range = maxValue - minValue;

  const getPathData = () => {
    if (data.length === 0) return "";
    const width = 200;
    const height = 60;
    const stepX = width / (data.length - 1);
    
    return data.map((value, index) => {
      const x = index * stepX;
      const y = height - ((value - minValue) / range) * height;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-white font-semibold text-sm">{title}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-gray-400">Status:</span>
            <span className="text-xs text-green-400 font-medium">{status}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-white font-bold text-lg">{currentValue}</div>
          <div className="flex items-center space-x-1">
            <span className="text-xs text-red-400">{change}</span>
            <span className="text-xs text-red-400">({changePercent})</span>
          </div>
        </div>
      </div>
      
      <div className="relative h-16">
        <svg width="100%" height="100%" className="overflow-visible">
          <path
            d={getPathData()}
            stroke="#ffffff"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="absolute bottom-0 left-0 text-xs text-gray-400">09:00</div>
        <div className="absolute bottom-0 right-0 text-xs text-gray-400">10:00</div>
      </div>
    </div>
  );
};

const TaxManagerMonitoring = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("nexus");

  // Sample client data
  const clients: Client[] = [
    {
      id: "1",
      name: "TechCorp SaaS",
      state: "California",
      industry: "Technology",
      revenue: "$2.1M",
      nexusStatus: "critical",
      thresholdProgress: 105,
      lastUpdate: "2 min ago",
      alerts: 3,
      riskScore: 95,
      states: ["CA", "NY", "TX"]
    },
    {
      id: "2", 
      name: "RetailChain LLC",
      state: "New York",
      industry: "E-commerce",
      revenue: "$1.8M",
      nexusStatus: "warning",
      thresholdProgress: 97,
      lastUpdate: "5 min ago",
      alerts: 2,
      riskScore: 78,
      states: ["NY", "TX", "FL"]
    },
    {
      id: "3",
      name: "Manufacturing Inc",
      state: "Texas",
      industry: "Manufacturing",
      revenue: "$3.2M",
      nexusStatus: "compliant",
      thresholdProgress: 45,
      lastUpdate: "1 min ago",
      alerts: 0,
      riskScore: 25,
      states: ["TX", "CA", "IL"]
    },
    {
      id: "4",
      name: "ServicePro Corp",
      state: "Florida",
      industry: "Services",
      revenue: "$950K",
      nexusStatus: "pending",
      thresholdProgress: 78,
      lastUpdate: "3 min ago",
      alerts: 1,
      riskScore: 65,
      states: ["FL", "GA", "NC"]
    },
    {
      id: "5",
      name: "HealthTech Solutions",
      state: "Illinois",
      industry: "Healthcare",
      revenue: "$1.5M",
      nexusStatus: "warning",
      thresholdProgress: 89,
      lastUpdate: "4 min ago",
      alerts: 2,
      riskScore: 72,
      states: ["IL", "IN", "WI"]
    },
    {
      id: "6",
      name: "FinanceFirst LLC",
      state: "Pennsylvania",
      industry: "Financial",
      revenue: "$2.8M",
      nexusStatus: "compliant",
      thresholdProgress: 32,
      lastUpdate: "1 min ago",
      alerts: 0,
      riskScore: 18,
      states: ["PA", "NJ", "DE"]
    }
  ];

  // State monitoring data
  const stateData: StateMonitoringData[] = [
    { state: "California", clients: 15, totalRevenue: 12500000, criticalAlerts: 8, warningAlerts: 12, complianceRate: 65, lastUpdated: "1 min ago" },
    { state: "New York", clients: 12, totalRevenue: 9800000, criticalAlerts: 3, warningAlerts: 8, complianceRate: 78, lastUpdated: "2 min ago" },
    { state: "Texas", clients: 18, totalRevenue: 15200000, criticalAlerts: 5, warningAlerts: 15, complianceRate: 72, lastUpdated: "1 min ago" },
    { state: "Florida", clients: 8, totalRevenue: 4200000, criticalAlerts: 2, warningAlerts: 4, complianceRate: 85, lastUpdated: "3 min ago" },
    { state: "Illinois", clients: 10, totalRevenue: 6800000, criticalAlerts: 4, warningAlerts: 6, complianceRate: 70, lastUpdated: "2 min ago" },
    { state: "Pennsylvania", clients: 7, totalRevenue: 3500000, criticalAlerts: 1, warningAlerts: 3, complianceRate: 88, lastUpdated: "1 min ago" }
  ];

  // Sample graph data
  const frequencyData = [59.2, 59.1, 59.3, 59.0, 59.4, 59.2, 59.1, 59.3, 59.0, 59.4];
  const thresholdData = [45, 47, 43, 49, 46, 48, 44, 47, 45, 46];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let filtered = clients;
    
    if (searchQuery) {
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.industry.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedState) {
      filtered = filtered.filter(client => 
        client.states.includes(selectedState) || client.state === selectedState
      );
    }
    
    setFilteredClients(filtered);
  }, [searchQuery, selectedState]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'danger';
      case 'warning': return 'warning';
      case 'compliant': return 'success';
      case 'pending': return 'primary';
      default: return 'default';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'danger';
    if (score >= 60) return 'warning';
    if (score >= 40) return 'primary';
    return 'success';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleStateClick = (stateCode: string) => {
    setSelectedState(selectedState === stateCode ? null : stateCode);
  };

  if (!isMounted) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-blue-600">
        <div className="text-center text-white">
          <div className="text-2xl mb-2">📊</div>
          <p>Loading Nexus Monitoring Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex bg-blue-600">
      {/* Left Pane - Monitoring Data */}
      <div className="w-1/2 p-6 overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">NEXUS MONITORING</h1>
              <div className="flex items-center space-x-2">
                <Button isIconOnly size="sm" variant="light" className="text-white">
                  ⚙️
                </Button>
                <Button isIconOnly size="sm" variant="light" className="text-white">
                  🔔
                </Button>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center space-x-4">
            <Button
              size="sm"
              variant={activeTab === "nexus" ? "solid" : "light"}
              color={activeTab === "nexus" ? "primary" : "default"}
              className={activeTab === "nexus" ? "bg-blue-500 text-white" : "text-white"}
              onPress={() => setActiveTab("nexus")}
            >
              👤
            </Button>
            <Button
              size="sm"
              variant={activeTab === "nexus" ? "solid" : "light"}
              color={activeTab === "nexus" ? "primary" : "default"}
              className={activeTab === "nexus" ? "bg-blue-500 text-white" : "text-white"}
              onPress={() => setActiveTab("nexus")}
            >
              ⚡
            </Button>
            <Button
              size="sm"
              variant="light"
              className="text-white"
              onPress={() => setActiveTab("analytics")}
            >
              📊
            </Button>
            <Button
              size="sm"
              variant="light"
              className="text-white"
              onPress={() => setActiveTab("alerts")}
            >
              🔔
            </Button>
          </div>

          {/* Circular Gauges */}
          <div className="flex justify-between">
            <CircularGauge value={75} label="THRESHOLD" color="orange" />
            <CircularGauge value={17} label="COMPLIANCE" color="yellow" />
            <CircularGauge value={34} label="RISK LEVEL" color="purple" />
          </div>

          {/* Line Graphs */}
          <div className="space-y-4">
            <LineGraph
              title="FREQUENCY"
              status="Normal"
              currentValue="59.450 Hz"
              change="-0.0043"
              changePercent="-0.78%"
              data={frequencyData}
            />
            <LineGraph
              title="THRESHOLD"
              status="Normal"
              currentValue="750 Mw"
              change="-0.0021"
              changePercent="-0.16%"
              data={thresholdData}
            />
          </div>

          {/* Data Table */}
          <div className="bg-gray-800 rounded-lg p-4">
            <Table aria-label="Client monitoring table" className="text-white">
              <TableHeader>
                <TableColumn className="text-white">CLIENT</TableColumn>
                <TableColumn className="text-white">DR</TableColumn>
                <TableColumn className="text-white">FREQUENCY</TableColumn>
                <TableColumn className="text-white">MAGNITUDE</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredClients.slice(0, 6).map((client, index) => (
                  <TableRow key={client.id} className="text-white">
                    <TableCell>
                      <span className="font-mono text-sm">Client{index + 1}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm ${client.thresholdProgress > 90 ? 'text-red-400' : 'text-white'}`}>
                        {client.thresholdProgress > 90 ? '-' : ''}{client.thresholdProgress.toFixed(2)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-white">0.{client.riskScore.toString().padStart(2, '0')}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm ${client.alerts > 0 ? 'text-orange-400' : 'text-white'}`}>
                        {client.alerts > 0 ? (client.alerts * 10).toFixed(1) : '0.0'}M
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Right Pane - Interactive US Map */}
      <div className="w-1/2 p-6 bg-gray-900">
        <div className="h-full flex flex-col">
          {/* Map Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-white">US NEXUS GRID</h2>
              <p className="text-gray-400">Click states to filter clients</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="light" className="text-white">+</Button>
              <Button size="sm" variant="light" className="text-white">-</Button>
              <Button size="sm" variant="light" className="text-white">2D</Button>
              <Button size="sm" variant="solid" color="primary" className="bg-blue-500">3D</Button>
              <Button isIconOnly size="sm" variant="light" className="text-white">🧭</Button>
            </div>
          </div>

          {/* Interactive US Map */}
          <div className="flex-1 relative bg-gray-800 rounded-lg overflow-hidden">
            <svg 
              viewBox="0 0 800 500" 
              className="w-full h-full"
            >
              {/* Main US States */}
              {Object.entries({
                "CA": "M 50 200 L 200 200 L 200 400 L 50 400 Z",
                "TX": "M 300 300 L 450 300 L 450 400 L 300 400 Z",
                "NY": "M 600 50 L 700 50 L 700 150 L 600 150 Z",
                "FL": "M 500 100 L 600 100 L 600 200 L 500 200 Z",
                "IL": "M 400 150 L 500 150 L 500 200 L 400 200 Z",
                "PA": "M 550 100 L 650 100 L 650 150 L 550 150 Z",
                "OH": "M 500 150 L 600 150 L 600 200 L 500 200 Z",
                "GA": "M 500 200 L 600 200 L 600 250 L 500 250 Z",
                "NC": "M 550 200 L 650 200 L 650 250 L 550 250 Z",
                "MI": "M 450 100 L 550 100 L 550 150 L 450 150 Z",
                "NJ": "M 600 150 L 650 150 L 650 200 L 600 200 Z",
                "VA": "M 550 200 L 650 200 L 650 250 L 550 250 Z",
                "WA": "M 50 50 L 200 50 L 200 100 L 50 100 Z",
                "AZ": "M 200 300 L 300 300 L 300 400 L 200 400 Z",
                "MA": "M 650 100 L 750 100 L 750 150 L 650 150 Z",
                "TN": "M 450 200 L 550 200 L 550 250 L 450 250 Z",
                "IN": "M 450 150 L 550 150 L 550 200 L 450 200 Z",
                "MO": "M 350 150 L 450 150 L 450 200 L 350 200 Z",
                "MD": "M 600 200 L 650 200 L 650 250 L 600 250 Z",
                "WI": "M 400 100 L 500 100 L 500 150 L 400 150 Z"
              }).map(([code, path]) => {
                const stateInfo = stateData.find(s => s.state === code);
                const isSelected = selectedState === code;
                const hasClients = clients.some(c => c.states.includes(code));
                
                let fillColor = '#374151';
                let strokeColor = '#6b7280';
                
                if (hasClients) {
                  if (stateInfo) {
                    if (stateInfo.criticalAlerts > 0) {
                      fillColor = '#ef4444';
                      strokeColor = '#dc2626';
                    } else if (stateInfo.warningAlerts > 0) {
                      fillColor = '#f59e0b';
                      strokeColor = '#d97706';
                    } else {
                      fillColor = '#10b981';
                      strokeColor = '#059669';
                    }
                  }
                }
                
                if (isSelected) {
                  strokeColor = '#3b82f6';
                }
                
                return (
                  <g key={code}>
                    <path
                      d={path}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? 3 : 1}
                      className="cursor-pointer transition-all duration-200 hover:opacity-80"
                      onClick={() => handleStateClick(code)}
                      style={{
                        filter: isSelected ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))' : 'none'
                      }}
                    />
                    <text
                      x={getStateCenter(code).x}
                      y={getStateCenter(code).y}
                      textAnchor="middle"
                      className="text-xs font-semibold fill-white pointer-events-none"
                    >
                      {code}
                    </text>
                    {/* Network nodes */}
                    {hasClients && (
                      <g>
                        <circle
                          cx={getStateCenter(code).x}
                          cy={getStateCenter(code).y - 10}
                          r="8"
                          fill="white"
                          stroke="#3b82f6"
                          strokeWidth="2"
                          className="animate-pulse"
                        />
                        <circle
                          cx={getStateCenter(code).x}
                          cy={getStateCenter(code).y - 10}
                          r="12"
                          fill="none"
                          stroke="white"
                          strokeWidth="1"
                          opacity="0.5"
                          className="animate-ping"
                        />
                      </g>
                    )}
                  </g>
                );
              })}
              
              {/* Network connections */}
              <g opacity="0.3">
                <line x1="125" y1="300" x2="375" y2="350" stroke="white" strokeWidth="1" />
                <line x1="375" y1="350" x2="450" y2="175" stroke="white" strokeWidth="1" />
                <line x1="450" y1="175" x2="600" y2="125" stroke="white" strokeWidth="1" />
                <line x1="600" y1="125" x2="650" y2="100" stroke="white" strokeWidth="1" />
                <line x1="550" y1="150" x2="500" y2="200" stroke="white" strokeWidth="1" />
              </g>
            </svg>

            {/* State Info Panel */}
            {selectedState && (
              <div className="absolute top-4 right-4 bg-gray-800 border border-gray-600 rounded-lg shadow-lg p-4 min-w-[250px]">
                {(() => {
                  const stateInfo = stateData.find(s => s.state === selectedState);
                  const stateClients = clients.filter(c => c.states.includes(selectedState));
                  
                  return (
                    <div>
                      <h4 className="font-bold text-lg text-white mb-2">{selectedState}</h4>
                      {stateInfo ? (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Clients:</span>
                            <span className="font-semibold text-white">{stateInfo.clients}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Revenue:</span>
                            <span className="font-semibold text-white">{formatCurrency(stateInfo.totalRevenue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Critical:</span>
                            <span className="font-semibold text-red-400">{stateInfo.criticalAlerts}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Warnings:</span>
                            <span className="font-semibold text-amber-400">{stateInfo.warningAlerts}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Compliance:</span>
                            <span className="font-semibold text-green-400">{stateInfo.complianceRate}%</span>
                          </div>
                          <div className="mt-3">
                            <p className="text-xs text-gray-500">Last updated: {stateInfo.lastUpdated}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">No data available</p>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Scale Bar */}
            <div className="absolute bottom-4 right-4 bg-gray-800 border border-gray-600 rounded p-2">
              <div className="flex items-center space-x-2 text-white text-xs">
                <div className="w-16 h-1 bg-white"></div>
                <span>100KM</span>
              </div>
              <div className="flex items-center space-x-1 mt-1 text-gray-400 text-xs">
                <span>10</span>
                <span>40</span>
                <span>70</span>
                <span>90</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get state center positions
const getStateCenter = (stateCode: string) => {
  const centers: { [key: string]: { x: number; y: number } } = {
    "CA": { x: 125, y: 300 }, "TX": { x: 375, y: 350 }, "NY": { x: 650, y: 100 },
    "FL": { x: 550, y: 150 }, "IL": { x: 450, y: 175 }, "PA": { x: 600, y: 125 },
    "OH": { x: 550, y: 175 }, "GA": { x: 550, y: 225 }, "NC": { x: 600, y: 225 },
    "MI": { x: 500, y: 125 }, "NJ": { x: 625, y: 175 }, "VA": { x: 600, y: 225 },
    "WA": { x: 125, y: 75 }, "AZ": { x: 250, y: 350 }, "MA": { x: 700, y: 125 },
    "TN": { x: 500, y: 225 }, "IN": { x: 500, y: 175 }, "MO": { x: 400, y: 175 },
    "MD": { x: 625, y: 225 }, "WI": { x: 450, y: 125 }
  };
  
  return centers[stateCode] || { x: 400, y: 200 };
};

export default TaxManagerMonitoring;