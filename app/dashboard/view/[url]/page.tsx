"use client";

import React, { useState, useEffect, use } from "react";
import { Button, Card, CardBody, Chip, Progress } from "@nextui-org/react";
import { apiClient } from "@/lib/api";
import { usePersonalizedDashboard } from "@/contexts/PersonalizedDashboardContext";

// Icons
const ExternalLinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const MapIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

interface DashboardViewerProps {
  params: Promise<{
    url: string;
  }>;
}

interface DashboardData {
  id: string;
  clientName: string;
  uniqueUrl: string;
  dashboardUrl?: string;
  clientInfo?: {
    description?: string;
    industry?: string;
    clientCount?: string;
    riskLevel?: string;
    complianceScore?: number;
  };
  keyMetrics?: {
    description?: string;
    totalRevenue?: string;
    nexusStates?: number;
    activeAlerts?: number;
    complianceRate?: string;
    lastAuditDate?: string;
  };
  statesMonitored?: string[];
  lastUpdated: string;
  organization?: {
    name: string;
    slug: string;
  };
}

export default function DashboardViewer({ params }: DashboardViewerProps) {
  const resolvedParams = use(params);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setDashboardSession } = usePersonalizedDashboard();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        console.log('Fetching dashboard for URL:', resolvedParams.url);
        
        if (!resolvedParams.url || resolvedParams.url === 'undefined') {
          setError('Invalid dashboard URL');
          return;
        }
        
        // API client will automatically append ?org=${orgId} from sessionStorage
        const response = await apiClient.getDashboard(resolvedParams.url);
        console.log('Dashboard API response:', response);
        
        if (response.success && response.data) {
          setDashboard(response.data);
          
          // If dashboard data includes organization info, set it in sessionStorage
          // This ensures orgId is available for subsequent API calls
          if (response.data.organization) {
            // Try to extract organizationId from the dashboard data or use the URL
            // The backend should return organizationId in the response
            const dashboardData = response.data as any;
            if (dashboardData.organizationId) {
              const { sessionStorageUtils } = require('@/lib/sessionStorage');
              sessionStorageUtils.setOrgId(dashboardData.organizationId);
              
              // Also set the full dashboard session if we have the client name
              setDashboardSession({
                dashboardUrl: resolvedParams.url,
                clientName: response.data.clientName,
                organizationId: dashboardData.organizationId,
                createdAt: Date.now()
              });
            }
          }
        } else {
          setError(response.error || 'Failed to load dashboard');
        }
      } catch (err) {
        console.error('Error fetching dashboard:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [resolvedParams.url, setDashboardSession]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
          <div className="text-white text-xl font-medium">Loading Dashboard</div>
          <div className="text-gray-400 text-sm mt-2">Preparing your comprehensive view...</div>
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <AlertIcon />
          </div>
          <div className="text-red-400 text-xl font-semibold mb-4">Dashboard Not Found</div>
          <div className="text-gray-300 mb-6">{error || 'The requested dashboard could not be loaded'}</div>
          {resolvedParams.url === 'undefined' && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 mb-6">
              <div className="text-yellow-400 text-sm">
                The dashboard URL appears to be undefined. Please try generating a new dashboard.
              </div>
            </div>
          )}
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/25"
            onClick={() => window.location.href = '/dashboard'}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatRevenue = (revenue: string | number | undefined) => {
    if (!revenue) return '$2.5M';
    
    // Convert to number if it's a string
    let numRevenue = typeof revenue === 'string' ? parseFloat(revenue) : revenue;
    
    if (isNaN(numRevenue)) return '$2.5M';
    
    // Format based on size
    if (numRevenue >= 1000000) {
      return `$${(numRevenue / 1000000).toFixed(1)}M`;
    } else if (numRevenue >= 1000) {
      return `$${(numRevenue / 1000).toFixed(0)}K`;
    } else {
      return `$${numRevenue.toLocaleString()}`;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Go Back to Generate Button */}
      <div className="bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/25"
            startContent={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            }
            onPress={() => window.location.href = '/generate'}
          >
            Go back to Generate
          </Button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent"></div>
        <div className="relative bg-black/80 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <BuildingIcon />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                      {dashboard.clientName}
                    </h1>
                    <p className="text-gray-400 text-lg">
                      Comprehensive Tax Compliance Dashboard
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon />
                    <span>Last Updated: {new Date(dashboard.lastUpdated).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <UsersIcon />
                    <span>Generated by Sifa tech LLC</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="inline-flex items-center px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-green-400 text-sm font-medium">Live Dashboard</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Role Access */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/25 px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105"
              startContent={<ExternalLinkIcon />}
              onClick={() => {
                const url = dashboard.dashboardUrl || `${window.location.origin}/dashboard/view/${dashboard.uniqueUrl}`;
                window.open(url, '_blank');
              }}
            >
              Main
            </Button>
            
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg shadow-purple-600/25 px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105"
              startContent={<ExternalLinkIcon />}
              onClick={() => {
                const url = `${window.location.origin}/dashboard/managing-partner`;
                window.open(url, '_blank');
              }}
            >
              Partner
            </Button>
            
            <Button
              className="bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-600/25 px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105"
              startContent={<ExternalLinkIcon />}
              onClick={() => {
                const url = `${window.location.origin}/dashboard/tax-manager`;
                window.open(url, '_blank');
              }}
            >
              Tax Manager
            </Button>
            
            <Button
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-600/25 px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105"
              startContent={<ExternalLinkIcon />}
              onClick={() => {
                const url = `${window.location.origin}/dashboard/system-admin`;
                window.open(url, '_blank');
              }}
            >
              Admin
            </Button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-white">{formatRevenue(dashboard.keyMetrics?.totalRevenue)}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUpIcon />
                    <span className="text-green-400 text-xs ml-1">+12.5%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                  <ChartIcon />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">Nexus States</p>
                  <p className="text-3xl font-bold text-white">{dashboard.keyMetrics?.nexusStates || 10}</p>
                  <div className="flex items-center mt-2">
                    <MapIcon />
                    <span className="text-blue-400 text-xs ml-1">Active</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                  <MapIcon />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">Active Alerts</p>
                  <p className="text-3xl font-bold text-white">{dashboard.keyMetrics?.activeAlerts || 3}</p>
                  <div className="flex items-center mt-2">
                    <AlertIcon />
                    <span className="text-yellow-400 text-xs ml-1">Requires Attention</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center">
                  <AlertIcon />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">Compliance Rate</p>
                  <p className={`text-3xl font-bold ${getComplianceColor(parseInt(dashboard.keyMetrics?.complianceRate || '92'))}`}>
                    {dashboard.keyMetrics?.complianceRate || 92}%
                  </p>
                  <div className="flex items-center mt-2">
                    <CheckCircleIcon />
                    <span className="text-green-400 text-xs ml-1">Excellent</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                  <ShieldIcon />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Client Information */}
          <div className="lg:col-span-1">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
              <CardBody className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                    <BuildingIcon />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Client Overview</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-2">Industry</p>
                    <p className="text-white text-lg">{dashboard.clientInfo?.industry || 'Professional Services'}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-2">Client Portfolio</p>
                    <p className="text-white text-lg">{dashboard.clientInfo?.clientCount || '50-100 clients'}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-3">Risk Assessment</p>
                    <div className={`inline-flex items-center px-4 py-2 rounded-2xl border ${getRiskColor(dashboard.clientInfo?.riskLevel || 'medium')}`}>
                      <span className="text-sm font-medium">
                        {(dashboard.clientInfo?.riskLevel || 'medium').toUpperCase()} RISK
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-3">Compliance Score</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-2xl font-bold">
                          {dashboard.clientInfo?.complianceScore || 85}%
                        </span>
                        <span className="text-green-400 text-sm">Excellent</span>
                      </div>
                      <Progress 
                        value={dashboard.clientInfo?.complianceScore || 85} 
                        className="w-full"
                        classNames={{
                          track: "bg-white/10",
                          indicator: "bg-gradient-to-r from-green-500 to-green-600"
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Dashboard Description & States */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
              <CardBody className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <ChartIcon />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Dashboard Overview</h2>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {dashboard.keyMetrics?.description || 'Real-time compliance tracking and threshold monitoring across multiple jurisdictions with comprehensive risk assessment and automated alert systems.'}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">Last Audit Date</p>
                    <p className="text-white">
                      {dashboard.keyMetrics?.lastAuditDate ? 
                        new Date(dashboard.keyMetrics.lastAuditDate).toLocaleDateString() : 
                        'January 12, 2024'
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm font-medium mb-1">Dashboard Status</p>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-green-400 text-sm font-medium">Active</span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl">
              <CardBody className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                    <MapIcon />
                  </div>
                  <h2 className="text-xl font-semibold text-white">States Monitored</h2>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {(dashboard.statesMonitored || ['CA', 'TX', 'NY', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI']).map((state, index) => (
                    <Chip
                      key={index}
                      className="bg-blue-500/20 text-blue-400 border-blue-500/30 rounded-xl px-4 py-2"
                      size="lg"
                    >
                      {state}
                    </Chip>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-white/5 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">Total Jurisdictions</p>
                      <p className="text-white text-2xl font-bold">
                        {(dashboard.statesMonitored || ['CA', 'TX', 'NY', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI']).length}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm font-medium">Coverage</p>
                      <p className="text-green-400 text-lg font-semibold">100%</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}