"use client";
import React, { useState, useMemo } from "react";
import { TableWrapper } from "@/components/table/table";
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Button } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import NextLink from "next/link";
import { USAMap, USAStateAbbreviation, StateAbbreviations } from '@mirawision/usa-map-react';
import { useClients, useAlerts, useAnalytics, useTasks, useNexusAlerts, useClientStates } from "@/hooks/useApi";
import { usePersonalizedDashboard } from "@/contexts/PersonalizedDashboardContext";
import { usePersonalizedClientStates, usePersonalizedNexusAlerts } from "@/hooks/usePersonalizedData";
import RiskMonitoringDashboard from "@/components/dashboard/risk-monitoring-dashboard";
import { BarChart3, AlertTriangle, MapPin, User } from "lucide-react";

// Enhanced US Map Component for Managing Partner
const EnhancedUSMap = ({ clientStates, clients }: { clientStates: any[], clients: any[] }) => {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const handleMapStateClick = (stateCode: string) => {
    if (selectedState === stateCode) {
      setSelectedState(null);
    } else {
      setSelectedState(stateCode);
    }
  };

  // Generate firm performance data from real API data
  const firmPerformanceData = useMemo(() => {
    const stateData: Record<string, { status: string; clients: number; revenue: number; growth: number }> = {};
    
    // Process client states to calculate performance metrics
    (clientStates || []).forEach(clientState => {
      const stateCode = clientState.stateCode;
      if (!stateData[stateCode]) {
        stateData[stateCode] = {
          status: 'good',
          clients: 1,
          revenue: clientState.currentAmount || 0,
          growth: Math.random() * 20 - 5 // Mock growth data
        };
      } else {
        stateData[stateCode].clients += 1;
        stateData[stateCode].revenue += clientState.currentAmount || 0;
      }
    });

    // Determine status based on performance
    Object.keys(stateData).forEach(stateCode => {
      const data = stateData[stateCode];
      if (data.growth > 10 && data.revenue > 5000000) {
        data.status = 'excellent';
      } else if (data.growth > 5 && data.revenue > 2000000) {
        data.status = 'good';
      } else if (data.growth < -5 || data.revenue < 500000) {
        data.status = 'poor';
      }
    });

    return stateData;
  }, [clientStates]);

  const customStates: Record<string, any> = {};
  Object.keys(firmPerformanceData).forEach(stateCode => {
    const data = firmPerformanceData[stateCode];
    customStates[stateCode] = {
      fill: data.status === 'excellent' ? '#10b981' : 
            data.status === 'good' ? '#3b82f6' : 
            data.status === 'poor' ? '#ef4444' : '#6b7280',
      stroke: '#ffffff',
      strokeWidth: 1,
      cursor: 'pointer',
      onClick: () => handleMapStateClick(stateCode)
    };
  });

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
          fill: '#6b7280',
          stroke: '#ffffff',
          strokeWidth: 1,
          cursor: 'pointer'
        }}
      />
      
      {selectedState && (
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white border border-white/20">
          <h3 className="font-semibold text-lg mb-2">{selectedState}</h3>
          <div className="space-y-1 text-sm">
            <p>Clients: {firmPerformanceData[selectedState]?.clients || 0}</p>
            <p>Revenue: ${(firmPerformanceData[selectedState]?.revenue || 0).toLocaleString()}</p>
            <p>Growth: {firmPerformanceData[selectedState]?.growth?.toFixed(1) || 0}%</p>
            <p>Status: <span className={`font-medium ${
              firmPerformanceData[selectedState]?.status === 'excellent' ? 'text-green-400' :
              firmPerformanceData[selectedState]?.status === 'good' ? 'text-blue-400' :
              firmPerformanceData[selectedState]?.status === 'poor' ? 'text-red-400' : 'text-gray-400'
            }`}>{firmPerformanceData[selectedState]?.status || 'Unknown'}</span></p>
          </div>
        </div>
      )}
    </div>
  );
};

// Card Components
const CardTotalRevenue = ({ analytics, clients }: { analytics: any, clients: any[] }) => {
  const totalRevenue = (clients || []).reduce((sum, client) => sum + (client.annualRevenue || 0), 0);

  return (
    <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white">Total Revenue</h4>
        </div>
        
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold text-white leading-none">${(totalRevenue / 1000000).toFixed(1)}M</div>
          <div className="flex items-end space-x-1 h-10">
            {[5, 7, 4, 9, 6, 8, 7].map((height, i) => (
              <div
                key={i}
                className="bg-blue-500 rounded-sm"
                style={{ width: '4px', height: `${height * 4}px` }}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-green-400 text-xs font-medium">+12.5%</span>
          <span className="text-white/60 text-xs">vs last month</span>
        </div>
      </div>
    </div>
  );
};

const CardActiveClients = ({ clients }: { clients: any[] }) => {
  const activeClients = (clients || []).filter(client => client.status === 'active').length;

  return (
    <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white">Active Clients</h4>
        </div>
        
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold text-white leading-none">{activeClients}</div>
          <div className="flex items-end space-x-1 h-10">
            {[4, 6, 3, 8, 5, 7, 4].map((height, i) => (
              <div
                key={i}
                className="bg-green-500 rounded-sm"
                style={{ width: '4px', height: `${height * 4}px` }}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-green-400 text-xs font-medium">+3</span>
          <span className="text-white/60 text-xs">new this month</span>
        </div>
      </div>
    </div>
  );
};

const CardComplianceRate = ({ alerts, clientStates }: { alerts: any[], clientStates: any[] }) => {
  const totalStates = (clientStates || []).length;
  const compliantStates = (clientStates || []).filter(state => state.status === 'compliant' || state.status === 'transit').length;
  const complianceRate = totalStates > 0 ? Math.round((compliantStates / totalStates) * 100) : 100;

  return (
    <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white">Compliance Rate</h4>
        </div>
        
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold text-white leading-none">{complianceRate}%</div>
          <div className="flex items-end space-x-1 h-10">
            {[3, 5, 4, 7, 6, 8, 5].map((height, i) => (
              <div
                key={i}
                className="bg-purple-500 rounded-sm"
                style={{ width: '4px', height: `${height * 4}px` }}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-green-400 text-xs font-medium">+2.1%</span>
          <span className="text-white/60 text-xs">vs last month</span>
        </div>
      </div>
    </div>
  );
};

// Client Performance Table Component
const ClientPerformanceTable = ({ clients, alerts }: { clients: any[], alerts: any[] }) => {
  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
            <h3 className="text-white font-semibold text-lg">Client Performance Overview</h3>
          </div>
          <Link
            href="/dashboard/managing-partner/clients"
            as={NextLink}
            className="group bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 px-4 py-2 text-white hover:bg-white/20 transition-all duration-200 hover:scale-105"
          >
            <span className="text-sm font-medium">View All</span>
            <svg className="w-4 h-4 ml-2 inline-block group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
                  </div>
                  </div>

      <Table aria-label="Client performance table" className="bg-transparent">
        <TableHeader>
          <TableColumn>CLIENT</TableColumn>
          <TableColumn>REVENUE</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>RISK LEVEL</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {(clients || []).slice(0, 5).map((client, index) => {
            const clientAlerts = (alerts || []).filter(alert => alert.clientId === client.id);
            const hasAlerts = clientAlerts.length > 0;
                  
                  return (
              <TableRow key={client.id || index} className="hover:bg-white/5 transition-colors duration-150">
                <TableCell>
                        <div>
                          <div className="text-sm font-medium text-white">{client.name}</div>
                          <div className="text-xs text-white/60 mt-0.5">
                            {client.legalName || 'No legal name'}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium text-white">
                    ${(client.annualRevenue || 0).toLocaleString()}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    client.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {client.status || 'Unknown'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    client.riskLevel === 'low' 
                      ? 'bg-green-100 text-green-800'
                      : client.riskLevel === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : client.riskLevel === 'high'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {client.riskLevel || 'Unknown'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/dashboard/tax-manager/clients/${client.id}`}
                      as={NextLink}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                      View
                    </Link>
                    {hasAlerts && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {clientAlerts.length} Alert{clientAlerts.length > 1 ? 's' : ''}
                          </span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

// Main Component
export default function ManagingPartnerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Personalized dashboard context
  const { dashboardUrl, isPersonalizedMode, clientName, organizationId, clearDashboardSession } = usePersonalizedDashboard();
  
  // API hooks for data fetching
  const { data: clientsData, loading: clientsLoading } = useClients({ organizationId: organizationId || undefined });
  const { data: alertsData, loading: alertsLoading } = useAlerts();
  const { data: analyticsData, loading: analyticsLoading } = useAnalytics();
  const { data: tasksData, loading: tasksLoading } = useTasks();
  const { data: nexusAlertsData, loading: nexusAlertsLoading } = useNexusAlerts({ organizationId: organizationId || undefined });
  const { data: clientStatesData, loading: clientStatesLoading } = useClientStates({ organizationId: organizationId || undefined });
  
  // Extract data from API responses
  const clients = clientsData?.clients || [];
  const alerts = alertsData?.alerts || [];
  const analytics = analyticsData?.metrics || [];
  const tasks = tasksData?.tasks || [];
  const nexusAlerts = nexusAlertsData?.alerts || [];
  const clientStates = clientStatesData?.clientStates || [];

  // Personalized data hooks
  const { data: personalizedClientStates } = usePersonalizedClientStates();
  const { data: personalizedNexusAlerts } = usePersonalizedNexusAlerts();
  
  // Use personalized data if in personalized mode
  const displayClientStates = isPersonalizedMode && personalizedClientStates ? personalizedClientStates : (clientStates || []);
  const displayNexusAlerts = isPersonalizedMode && personalizedNexusAlerts ? personalizedNexusAlerts : (nexusAlerts || []);
  
  const isLoading = clientsLoading || alertsLoading || analyticsLoading || tasksLoading || nexusAlertsLoading || clientStatesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="text-white mt-4">
            {isPersonalizedMode ? `Loading ${clientName || 'personalized'} dashboard...` : 'Loading managing partner dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
    <div className="h-full lg:px-6">
        <div className="flex justify-center gap-2 xl:gap-[10px] pt-2 px-4 lg:px-0 flex-wrap xl:flex-nowrap max-w-[90rem] mx-auto w-full">
          <div className="mt-6 gap-8 flex flex-col w-full">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
              <h2 className="text-2xl font-semibold text-white tracking-tight">
                {isPersonalizedMode && clientName ? `${clientName} - Firm Performance Overview` : 'Firm Performance Overview'}
              </h2>
              {isPersonalizedMode && (
                <div className="ml-4 flex items-center space-x-2">
                  <div className="px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">
                    <span className="text-blue-400 text-sm font-medium">Personalized View</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    color="danger"
                    onClick={() => {
                      clearDashboardSession();
                      window.location.reload();
                    }}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    Exit
                  </Button>
                </div>
              )}
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-8">
              <Button
                color={activeTab === "overview" ? "primary" : "default"}
                variant={activeTab === "overview" ? "solid" : "flat"}
                onClick={() => setActiveTab("overview")}
                startContent={<BarChart3 className="w-4 h-4" />}
              >
                Portfolio Overview
              </Button>
              <Button
                color={activeTab === "risk" ? "primary" : "default"}
                variant={activeTab === "risk" ? "solid" : "flat"}
                onClick={() => setActiveTab("risk")}
                startContent={<AlertTriangle className="w-4 h-4" />}
              >
                Risk Monitoring
              </Button>
              <Button
                color={activeTab === "nexus" ? "primary" : "default"}
                variant={activeTab === "nexus" ? "solid" : "flat"}
                onClick={() => setActiveTab("nexus")}
                startContent={<MapPin className="w-4 h-4" />}
              >
                Nexus Status
              </Button>
            </div>

            {/* Tab Content */}
            {activeTab === "risk" ? (
              <RiskMonitoringDashboard organizationId="demo-org-id" />
            ) : activeTab === "nexus" ? (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Nexus Status View</h3>
                <p className="text-gray-400">Nexus monitoring dashboard coming soon...</p>
              </div>
            ) : (
              <>
          {/* Card Section Top */}
            <div className="flex flex-col gap-4">
              <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-6 justify-center w-full">
                <CardTotalRevenue analytics={analytics} clients={clients} />
                <CardActiveClients clients={clients} />
                    <CardComplianceRate alerts={alerts} clientStates={displayClientStates} />
              </div>
          </div>

          {/* Firm Performance Map and Client Performance Table - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* U.S. States Map - Left Column */}
            <div className="h-full flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-1 h-8 bg-green-500 rounded-full"></div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">Firm Performance Map</h2>
                </div>
                <Link
                  href="/dashboard/managing-partner/monitoring"
                  as={NextLink}
                  className="group bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 px-4 py-2 text-white hover:bg-white/20 transition-all duration-200 hover:scale-105"
                >
                  <span className="text-sm font-medium">View More</span>
                  <svg className="w-4 h-4 ml-2 inline-block group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              
              <div className="w-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                      <EnhancedUSMap clientStates={displayClientStates} clients={clients} />
              </div>
            </div>

            {/* Client Performance Table - Right Column */}
            <div className="h-full flex flex-col gap-4">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                      <ClientPerformanceTable clients={clients || []} alerts={alerts || []} />
                    </div>
              </div>
            </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}