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

  // Helper function to get state center positions
  const getStateCenter = (stateCode: string) => {
    const centers: { [key: string]: { x: number; y: number } } = {
      "CA": { x: 125, y: 300 },
      "TX": { x: 375, y: 350 },
      "FL": { x: 550, y: 150 },
      "IL": { x: 450, y: 175 },
      "WA": { x: 125, y: 75 },
      "NY": { x: 650, y: 100 },
      "PA": { x: 600, y: 125 },
      "GA": { x: 550, y: 225 },
      "AZ": { x: 250, y: 350 },
      "NV": { x: 200, y: 275 },
      "CO": { x: 400, y: 225 },
      "UT": { x: 350, y: 275 },
      "OR": { x: 100, y: 125 }
    };
    return centers[stateCode] || { x: 400, y: 250 };
  };

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
    <div className="w-full h-full flex bg-blue-600">
      {/* Left Pane - World-Class Nexus Monitoring */}
      <div className="w-1/4 p-1 bg-black flex flex-col">
        {/* Premium Header */}
        <div className="flex items-center justify-between mb-2 px-2 py-1">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse"></div>
            <h1 className="text-white text-sm font-medium tracking-wide">NEXUS MONITOR</h1>
          </div>
          <div className="flex items-center space-x-1">
            <button className="p-1 text-gray-400 hover:text-white transition-colors">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
            <button className="p-1 text-gray-400 hover:text-white transition-colors">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Ultra-Compact Search */}
        <div className="relative mb-2 px-2">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Client ID..."
            className="w-full pl-8 pr-3 py-1.5 bg-gray-900/80 text-white placeholder-gray-500 rounded text-xs border border-gray-800 focus:outline-none focus:ring-1 focus:ring-lime-400/50 focus:border-lime-400/50"
          />
        </div>

        {/* Status Summary Bar */}
        <div className="flex items-center justify-between mb-2 px-2 py-1 bg-gray-900/50 rounded">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
              <span className="text-red-400 text-xs font-medium">3</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
              <span className="text-amber-400 text-xs font-medium">2</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <span className="text-blue-400 text-xs font-medium">1</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span className="text-green-400 text-xs font-medium">1</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-gray-400 text-xs">7 Total</div>
            <div className="w-3 h-3 flex items-center justify-center">
              <svg className="w-2 h-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
            </div>
          </div>
        </div>

        {/* Ultra-Compact Client Cards */}
        <div className="flex-1 space-y-1 overflow-y-auto px-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-600/30 hover:scrollbar-thumb-gray-500/50">
          {/* Card 1 - Critical */}
          <div className="bg-gray-900/60 backdrop-blur-sm rounded border border-gray-800/50 p-2 hover:bg-gray-800/60 transition-colors">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-white font-semibold text-xs tracking-wide">TechCorp SaaS</h3>
              <span className="bg-red-500/90 text-white px-1.5 py-0.5 rounded text-xs font-medium">CRIT</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <div className="bg-gray-700/50 rounded px-1 py-0.5 mb-0.5 inline-block">
                  <span className="text-white text-xs font-medium">CA</span>
                </div>
                <p className="text-gray-300 text-xs">$525K Revenue</p>
                <p className="text-red-400 text-xs">Exceeded $500K</p>
              </div>
              <div className="flex items-center mx-2">
                <div className="w-4 h-4 bg-red-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="w-8 h-0.5 border-t border-dashed border-gray-600 mx-1"></div>
                <div className="bg-gray-700/50 rounded px-1 py-0.5">
                  <span className="text-white text-xs">3 Alerts</span>
                </div>
              </div>
              <div className="flex-1 text-right">
                <div className="bg-gray-700/50 rounded px-1 py-0.5 mb-0.5 inline-block">
                  <span className="text-white text-xs font-medium">NY</span>
                </div>
                <p className="text-gray-300 text-xs">$89K Revenue</p>
                <p className="text-amber-400 text-xs">95 Transactions</p>
              </div>
            </div>
          </div>

          {/* Card 2 - Warning */}
          <div className="bg-gray-900/60 backdrop-blur-sm rounded border border-gray-800/50 p-2 hover:bg-gray-800/60 transition-colors">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-white font-semibold text-xs tracking-wide">RetailChain LLC</h3>
              <span className="bg-amber-500/90 text-white px-1.5 py-0.5 rounded text-xs font-medium">WARN</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <div className="bg-gray-700/50 rounded px-1 py-0.5 mb-0.5 inline-block">
                  <span className="text-white text-xs font-medium">TX</span>
                </div>
                <p className="text-gray-300 text-xs">$485K Revenue</p>
                <p className="text-amber-400 text-xs">Approaching $500K</p>
              </div>
              <div className="flex items-center mx-2">
                <div className="w-4 h-4 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="w-8 h-0.5 border-t border-dashed border-gray-600 mx-1"></div>
                <div className="bg-gray-700/50 rounded px-1 py-0.5">
                  <span className="text-white text-xs">2 Alerts</span>
                </div>
              </div>
              <div className="flex-1 text-right">
                <div className="bg-gray-700/50 rounded px-1 py-0.5 mb-0.5 inline-block">
                  <span className="text-white text-xs font-medium">CA</span>
                </div>
                <p className="text-gray-300 text-xs">$220K Revenue</p>
                <p className="text-green-400 text-xs">Safe Zone</p>
              </div>
            </div>
          </div>

          {/* Card 3 - Pending */}
          <div className="bg-gray-900/60 backdrop-blur-sm rounded border border-gray-800/50 p-2 hover:bg-gray-800/60 transition-colors">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-white font-semibold text-xs tracking-wide">GlobalFin Solutions</h3>
              <span className="bg-blue-500/90 text-white px-1.5 py-0.5 rounded text-xs font-medium">PEND</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <div className="bg-gray-700/50 rounded px-1 py-0.5 mb-0.5 inline-block">
                  <span className="text-white text-xs font-medium">FL</span>
                </div>
                <p className="text-gray-300 text-xs">$28K Revenue</p>
                <p className="text-blue-400 text-xs">Under Review</p>
              </div>
              <div className="flex items-center mx-2">
                <div className="w-4 h-4 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="w-8 h-0.5 border-t border-dashed border-gray-600 mx-1"></div>
                <div className="bg-gray-700/50 rounded px-1 py-0.5">
                  <span className="text-white text-xs">0 Alerts</span>
                </div>
              </div>
              <div className="flex-1 text-right">
                <div className="bg-gray-700/50 rounded px-1 py-0.5 mb-0.5 inline-block">
                  <span className="text-white text-xs font-medium">GA</span>
                </div>
                <p className="text-gray-300 text-xs">$15K Revenue</p>
                <p className="text-green-400 text-xs">Compliant</p>
              </div>
            </div>
          </div>

          {/* Card 4 - Compliant */}
          <div className="bg-gray-900/60 backdrop-blur-sm rounded border border-gray-800/50 p-2 hover:bg-gray-800/60 transition-colors">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-white font-semibold text-xs tracking-wide">HealthCare Inc.</h3>
              <span className="bg-green-500/90 text-white px-1.5 py-0.5 rounded text-xs font-medium">OK</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <div className="bg-gray-700/50 rounded px-1 py-0.5 mb-0.5 inline-block">
                  <span className="text-white text-xs font-medium">IL</span>
                </div>
                <p className="text-gray-300 text-xs">$18K Revenue</p>
                <p className="text-green-400 text-xs">Compliant</p>
              </div>
              <div className="flex items-center mx-2">
                <div className="w-4 h-4 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="w-8 h-0.5 border-t border-dashed border-gray-600 mx-1"></div>
                <div className="bg-gray-700/50 rounded px-1 py-0.5">
                  <span className="text-white text-xs">0 Alerts</span>
                </div>
              </div>
              <div className="flex-1 text-right">
                <div className="bg-gray-700/50 rounded px-1 py-0.5 mb-0.5 inline-block">
                  <span className="text-white text-xs font-medium">PA</span>
                </div>
                <p className="text-gray-300 text-xs">$12K Revenue</p>
                <p className="text-green-400 text-xs">Safe Zone</p>
              </div>
            </div>
          </div>

          {/* Card 5 - In Transit */}
          <div className="bg-gray-900/60 backdrop-blur-sm rounded border border-gray-800/50 p-2 hover:bg-gray-800/60 transition-colors">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-white font-semibold text-xs tracking-wide">Manufacturing Co.</h3>
              <span className="bg-cyan-500/90 text-white px-1.5 py-0.5 rounded text-xs font-medium">TRANS</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <div className="bg-gray-700/50 rounded px-1 py-0.5 mb-0.5 inline-block">
                  <span className="text-white text-xs font-medium">WA</span>
                </div>
                <p className="text-gray-300 text-xs">$16K Revenue</p>
                <p className="text-cyan-400 text-xs">Active Monitoring</p>
              </div>
              <div className="flex items-center mx-2">
                <div className="w-4 h-4 bg-cyan-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <div className="w-8 h-0.5 border-t border-dashed border-gray-600 mx-1"></div>
                <div className="bg-gray-700/50 rounded px-1 py-0.5">
                  <span className="text-white text-xs">2 Alerts</span>
                </div>
              </div>
              <div className="flex-1 text-right">
                <div className="bg-gray-700/50 rounded px-1 py-0.5 mb-0.5 inline-block">
                  <span className="text-white text-xs font-medium">OR</span>
                </div>
                <p className="text-gray-300 text-xs">$8K Revenue</p>
                <p className="text-green-400 text-xs">Low Risk</p>
              </div>
            </div>
          </div>

          {/* Additional Cards for World-Class Feel */}
          <div className="bg-gray-900/60 backdrop-blur-sm rounded border border-gray-800/50 p-2 hover:bg-gray-800/60 transition-colors">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-white font-semibold text-xs tracking-wide">E-commerce Hub</h3>
              <span className="bg-green-500/90 text-white px-1.5 py-0.5 rounded text-xs font-medium">OK</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <div className="bg-gray-700/50 rounded px-1 py-0.5 mb-0.5 inline-block">
                  <span className="text-white text-xs font-medium">AZ</span>
                </div>
                <p className="text-gray-300 text-xs">$12K Revenue</p>
                <p className="text-green-400 text-xs">Compliant</p>
              </div>
              <div className="flex items-center mx-2">
                <div className="w-4 h-4 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="w-8 h-0.5 border-t border-dashed border-gray-600 mx-1"></div>
                <div className="bg-gray-700/50 rounded px-1 py-0.5">
                  <span className="text-white text-xs">0 Alerts</span>
                </div>
              </div>
              <div className="flex-1 text-right">
                <div className="bg-gray-700/50 rounded px-1 py-0.5 mb-0.5 inline-block">
                  <span className="text-white text-xs font-medium">NV</span>
                </div>
                <p className="text-gray-300 text-xs">$8K Revenue</p>
                <p className="text-green-400 text-xs">Safe Zone</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/60 backdrop-blur-sm rounded border border-gray-800/50 p-2 hover:bg-gray-800/60 transition-colors">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-white font-semibold text-xs tracking-wide">Logistics Corp</h3>
              <span className="bg-amber-500/90 text-white px-1.5 py-0.5 rounded text-xs font-medium">WARN</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <div className="bg-gray-700/50 rounded px-1 py-0.5 mb-0.5 inline-block">
                  <span className="text-white text-xs font-medium">CO</span>
                </div>
                <p className="text-gray-300 text-xs">$89K Revenue</p>
                <p className="text-amber-400 text-xs">Approaching $100K</p>
              </div>
              <div className="flex items-center mx-2">
                <div className="w-4 h-4 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="w-8 h-0.5 border-t border-dashed border-gray-600 mx-1"></div>
                <div className="bg-gray-700/50 rounded px-1 py-0.5">
                  <span className="text-white text-xs">1 Alert</span>
                </div>
              </div>
              <div className="flex-1 text-right">
                <div className="bg-gray-700/50 rounded px-1 py-0.5 mb-0.5 inline-block">
                  <span className="text-white text-xs font-medium">UT</span>
                </div>
                <p className="text-gray-300 text-xs">$45K Revenue</p>
                <p className="text-green-400 text-xs">Safe Zone</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane - US Nexus Map */}
      <div className="w-3/4 bg-black/90 backdrop-blur-sm p-4">
        <div className="h-full flex flex-col">
          {/* Map Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white text-lg font-semibold">US NEXUS GRID</h2>
              <p className="text-gray-400 text-sm">Live geographical nexus monitoring</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
              <button className="px-3 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-600 transition-colors">2D</button>
              <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors">3D</button>
            </div>
          </div>

          {/* Interactive US Map */}
          <div className="flex-1 relative bg-gray-800/50 rounded-lg overflow-hidden">
            <svg viewBox="0 0 800 500" className="w-full h-full">
              {/* US States with Nexus Data */}
              {Object.entries({
                "CA": { path: "M 50 200 L 200 200 L 200 400 L 50 400 Z", status: "critical", revenue: 525000, clients: 2, alerts: 3 },
                "TX": { path: "M 300 300 L 450 300 L 450 400 L 300 400 Z", status: "warning", revenue: 485000, clients: 1, alerts: 2 },
                "FL": { path: "M 500 100 L 600 100 L 600 200 L 500 200 Z", status: "pending", revenue: 28000, clients: 1, alerts: 0 },
                "IL": { path: "M 400 150 L 500 150 L 500 200 L 400 200 Z", status: "compliant", revenue: 18000, clients: 1, alerts: 0 },
                "WA": { path: "M 50 50 L 200 50 L 200 100 L 50 100 Z", status: "transit", revenue: 16000, clients: 1, alerts: 2 }
              }).map(([code, data]) => {
                const isSelected = selectedState === code;
                
                let fillColor = '#374151';
                let strokeColor = '#6b7280';
                
                switch (data.status) {
                  case 'critical': fillColor = '#ef4444'; strokeColor = '#dc2626'; break;
                  case 'warning': fillColor = '#f59e0b'; strokeColor = '#d97706'; break;
                  case 'pending': fillColor = '#3b82f6'; strokeColor = '#2563eb'; break;
                  case 'compliant': fillColor = '#10b981'; strokeColor = '#059669'; break;
                  case 'transit': fillColor = '#06b6d4'; strokeColor = '#0891b2'; break;
                }
                
                if (isSelected) strokeColor = '#3b82f6';
                
                return (
                  <g key={code}>
                    <path
                      d={data.path}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? 3 : 1}
                      className="cursor-pointer transition-all duration-200 hover:opacity-80"
                      onClick={() => setSelectedState(selectedState === code ? null : code)}
                    />
                    <text
                      x={getStateCenter(code).x}
                      y={getStateCenter(code).y}
                      textAnchor="middle"
                      className="text-xs font-semibold fill-white pointer-events-none"
                    >
                      {code}
                    </text>
                    {data.clients > 0 && (
                      <circle
                        cx={getStateCenter(code).x}
                        cy={getStateCenter(code).y - 10}
                        r="6"
                        fill="white"
                        stroke={strokeColor}
                        strokeWidth="2"
                        className="animate-pulse"
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-xs text-gray-300">Critical</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-xs text-gray-300">Warning</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-300">Compliant</span>
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