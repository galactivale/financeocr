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

const TaxManagerMonitoring = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isMounted, setIsMounted] = useState(false);

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
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-2">📊</div>
          <p className="text-gray-600 dark:text-gray-400">Loading Monitoring Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Left Pane - Client Data */}
      <div className="w-1/2 p-6 overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Live Monitoring</h1>
              <p className="text-gray-600 dark:text-gray-400">Real-time nexus compliance tracking</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Live</span>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Clients</p>
                    <p className="text-2xl font-bold">{clients.length}</p>
                  </div>
                  <div className="text-2xl">👥</div>
                </div>
                <div className="mt-2">
                  <span className="text-blue-100 text-xs">+2 this week</span>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm">Critical Alerts</p>
                    <p className="text-2xl font-bold">{clients.reduce((sum, client) => sum + client.alerts, 0)}</p>
                  </div>
                  <div className="text-2xl">🚨</div>
                </div>
                <div className="mt-2">
                  <span className="text-red-100 text-xs">3 new today</span>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Compliant</p>
                    <p className="text-2xl font-bold">{clients.filter(c => c.nexusStatus === 'compliant').length}</p>
                  </div>
                  <div className="text-2xl">✅</div>
                </div>
                <div className="mt-2">
                  <span className="text-green-100 text-xs">85% rate</span>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold">$12.5M</p>
                  </div>
                  <div className="text-2xl">💰</div>
                </div>
                <div className="mt-2">
                  <span className="text-purple-100 text-xs">+5.2% this month</span>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
              startContent={<span className="text-gray-400">🔍</span>}
            />
            {selectedState && (
              <Button
                size="sm"
                variant="bordered"
                onPress={() => setSelectedState(null)}
              >
                Clear Filter: {selectedState}
              </Button>
            )}
          </div>

          {/* Client List */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Client Monitoring</h3>
            </CardHeader>
            <CardBody className="p-0">
              <Table aria-label="Client monitoring table">
                <TableHeader>
                  <TableColumn>CLIENT</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                  <TableColumn>THRESHOLD</TableColumn>
                  <TableColumn>RISK</TableColumn>
                  <TableColumn>ALERTS</TableColumn>
                  <TableColumn>LAST UPDATE</TableColumn>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold">{client.name}</p>
                          <p className="text-sm text-gray-500">{client.industry}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          color={getStatusColor(client.nexusStatus)}
                          size="sm"
                          variant="flat"
                        >
                          {client.nexusStatus.toUpperCase()}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress
                            value={client.thresholdProgress}
                            color={client.thresholdProgress > 90 ? 'danger' : client.thresholdProgress > 70 ? 'warning' : 'success'}
                            className="w-16"
                            size="sm"
                          />
                          <span className="text-sm">{client.thresholdProgress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          color={getRiskColor(client.riskScore)}
                          size="sm"
                          variant="flat"
                        >
                          {client.riskScore}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        {client.alerts > 0 ? (
                          <Badge content={client.alerts} color="danger">
                            <span className="text-red-500">🚨</span>
                          </Badge>
                        ) : (
                          <span className="text-green-500">✅</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-500">{client.lastUpdate}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Right Pane - Interactive US Map */}
      <div className="w-1/2 p-6 bg-white dark:bg-gray-800">
        <div className="h-full flex flex-col">
          {/* Map Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">US Nexus Map</h2>
              <p className="text-gray-600 dark:text-gray-400">Click states to filter clients</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Real-time</span>
            </div>
          </div>

          {/* Interactive US Map */}
          <div className="flex-1 relative">
            <svg 
              viewBox="0 0 800 500" 
              className="w-full h-full"
              style={{ filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))' }}
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
                
                let fillColor = '#e5e7eb';
                let strokeColor = '#9ca3af';
                
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
                      className="text-xs font-semibold fill-gray-800 dark:fill-gray-200 pointer-events-none"
                    >
                      {code}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* State Info Panel */}
            {selectedState && (
              <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 min-w-[250px]">
                {(() => {
                  const stateInfo = stateData.find(s => s.state === selectedState);
                  const stateClients = clients.filter(c => c.states.includes(selectedState));
                  
                  return (
                    <div>
                      <h4 className="font-bold text-lg mb-2">{selectedState}</h4>
                      {stateInfo ? (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Clients:</span>
                            <span className="font-semibold">{stateInfo.clients}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Revenue:</span>
                            <span className="font-semibold">{formatCurrency(stateInfo.totalRevenue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Critical:</span>
                            <span className="font-semibold text-red-600">{stateInfo.criticalAlerts}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Warnings:</span>
                            <span className="font-semibold text-amber-600">{stateInfo.warningAlerts}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Compliance:</span>
                            <span className="font-semibold text-green-600">{stateInfo.complianceRate}%</span>
                          </div>
                          <div className="mt-3">
                            <p className="text-xs text-gray-500">Last updated: {stateInfo.lastUpdated}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No data available</p>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
              <h5 className="font-semibold text-sm mb-2">Status Legend</h5>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-xs">Critical Alerts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-xs">Warning Alerts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs">Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  <span className="text-xs">No Clients</span>
                </div>
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
