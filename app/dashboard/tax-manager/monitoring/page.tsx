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
      {/* Left Pane - Live Monitoring */}
      <div className="w-1/4 p-6 overflow-hidden bg-black flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white text-lg font-semibold">Live Nexus monitoring</h1>
          <div className="flex items-center space-x-3">
            {/* Live Status Indicator */}
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-lime-400 rounded-full animate-pulse"></div>
              <span className="text-lime-400 text-sm font-medium">Live</span>
            </div>
            <Button isIconOnly size="sm" variant="light" className="text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </Button>
            <Button isIconOnly size="sm" variant="light" className="text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Search Box */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Client ID..."
            className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white placeholder-gray-400 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-opacity-50"
          />
        </div>


        {/* Rest of left pane content can go here */}
        <div className="flex-1">
          {/* Additional content area */}
        </div>
      </div>

      {/* Right Pane - Dark Glass */}
      <div className="w-3/4 bg-black/90 backdrop-blur-sm">
        {/* Empty dark glass pane */}
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