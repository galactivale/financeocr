"use client";
import React, { useState, useMemo } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Card, CardBody, CardHeader } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import NextLink from "next/link";
import { USAMap, USAStateAbbreviation, StateAbbreviations } from '@mirawision/usa-map-react';
import { useClients, useNexusAlerts, useNexusActivities, useClientStates, useStateTaxInfo } from "@/hooks/useApi";

// Enhanced US Map Component for detailed monitoring
const DetailedUSMap = ({ clientStates, onStateClick }: { clientStates: any[], onStateClick: (stateCode: string) => void }) => {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const handleMapStateClick = (stateCode: string) => {
    setSelectedState(stateCode);
    onStateClick(stateCode);
  };

  // Generate nexus data from clientStates
  const nexusData = useMemo(() => {
    const stateData: Record<string, { status: string; clients: number; revenue: number; alerts: number }> = {};
    
    clientStates.forEach(clientState => {
      const stateCode = clientState.stateCode;
      if (!stateData[stateCode]) {
        stateData[stateCode] = {
          status: clientState.status,
          clients: 1,
          revenue: clientState.currentAmount || 0,
          alerts: 0
        };
      } else {
        stateData[stateCode].clients += 1;
        stateData[stateCode].revenue += clientState.currentAmount || 0;
        // Update status to most critical if needed
        if (clientState.status === 'critical' || 
            (clientState.status === 'warning' && stateData[stateCode].status !== 'critical')) {
          stateData[stateCode].status = clientState.status;
        }
      }
    });

    return stateData;
  }, [clientStates]);

  const customStates = useMemo(() => {
    const settings: any = {};

    StateAbbreviations.forEach((state) => {
      const data = nexusData[state];
      
      const labelConfig = {
        enabled: true,
        render: (stateAbbr: USAStateAbbreviation) => (
          <text 
            fontSize="12" 
            fill="white" 
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
            stroke="black"
            strokeWidth="0.5"
            paintOrder="stroke fill"
          >
            {stateAbbr}
          </text>
        ),
      };
      
      if (data) {
        let fillColor = '#374151';
        let strokeColor = '#6b7280';
        
        switch (data.status) {
          case 'critical':
            fillColor = '#ef4444';
            strokeColor = '#dc2626';
            break;
          case 'warning':
            fillColor = '#f59e0b';
            strokeColor = '#d97706';
            break;
          case 'pending':
            fillColor = '#3b82f6';
            strokeColor = '#2563eb';
            break;
          case 'compliant':
            fillColor = '#10b981';
            strokeColor = '#059669';
            break;
        }
        
        if (selectedState === state) {
          strokeColor = '#3b82f6';
        }
        
        settings[state] = {
          fill: fillColor,
          stroke: selectedState === state ? '#60a5fa' : '#9ca3af',
          strokeWidth: selectedState === state ? 4 : 2,
          onClick: () => handleMapStateClick(state),
          onHover: () => {},
          onLeave: () => {},
          label: labelConfig,
        };
      } else {
        settings[state] = {
          fill: '#374151',
          stroke: selectedState === state ? '#60a5fa' : '#9ca3af',
          strokeWidth: selectedState === state ? 4 : 2,
          onClick: () => handleMapStateClick(state),
          label: labelConfig,
        };
      }
    });

    return settings;
  }, [selectedState, nexusData]);

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
      />
      
      {/* State Info Tooltip */}
      {selectedState && nexusData[selectedState] && (
        <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-sm rounded-xl border border-white/20 p-4 min-w-[200px]">
          <h4 className="text-white font-semibold text-sm mb-2">{selectedState}</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className={`font-medium ${
                nexusData[selectedState].status === 'critical' ? 'text-red-400' :
                nexusData[selectedState].status === 'warning' ? 'text-orange-400' :
                nexusData[selectedState].status === 'pending' ? 'text-blue-400' :
                'text-green-400'
              }`}>
                {nexusData[selectedState].status.charAt(0).toUpperCase() + nexusData[selectedState].status.slice(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Clients:</span>
              <span className="text-white font-medium">{nexusData[selectedState].clients}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Revenue:</span>
              <span className="text-white font-medium">${(nexusData[selectedState].revenue / 1000).toFixed(0)}K</span>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-xl border border-white/10 p-4">
        <h4 className="text-white font-medium text-sm mb-3">Status Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-white text-xs">Critical</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-white text-xs">Warning</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-white text-xs">Pending</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-white text-xs">Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Client States Table Component
const ClientStatesTable = ({ clientStates, clients, selectedState }: { clientStates: any[], clients: any[], selectedState: string | null }) => {
  const filteredStates = selectedState 
    ? clientStates.filter(cs => cs.stateCode === selectedState)
    : clientStates;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'critical': return 'text-danger';
      case 'warning': return 'text-warning';
      case 'pending': return 'text-primary';
      case 'compliant': return 'text-success';
      default: return 'text-default';
    }
  };

  return (
    <div className="w-full">
      <Table aria-label="Client States">
        <TableHeader>
          <TableColumn>CLIENT</TableColumn>
          <TableColumn>STATE</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>CURRENT AMOUNT</TableColumn>
          <TableColumn>THRESHOLD</TableColumn>
          <TableColumn>REGISTRATION</TableColumn>
          <TableColumn>NOTES</TableColumn>
        </TableHeader>
        <TableBody>
          {filteredStates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <div className="flex flex-col items-center space-y-2">
                  <div className="text-4xl">🗺️</div>
                  <div className="text-default-500">No client states found</div>
                  <div className="text-sm text-default-400">
                    {selectedState ? `No clients in ${selectedState}` : 'No client states available'}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredStates.map((clientState) => {
              const client = clients.find(c => c.id === clientState.clientId);
              const currentAmount = clientState.currentAmount ? `$${(clientState.currentAmount / 1000).toFixed(0)}K` : 'N/A';
              const thresholdAmount = clientState.thresholdAmount ? `$${(clientState.thresholdAmount / 1000).toFixed(0)}K` : 'N/A';
              
              return (
                <TableRow key={clientState.id}>
                  <TableCell>
                    <div>
                      <div className="font-semibold text-default-900">
                        {client?.name || 'Unknown Client'}
                      </div>
                      <div className="text-sm text-default-500">
                        {client?.industry || 'N/A'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {clientState.stateCode}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(clientState.status)}`}>
                      {clientState.status.charAt(0).toUpperCase() + clientState.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-default-900">
                      {currentAmount}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-default-900">
                      {thresholdAmount}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      clientState.registrationRequired ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {clientState.registrationRequired ? 'Required' : 'Not Required'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-default-600 max-w-[200px] truncate">
                      {clientState.notes || 'No notes'}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default function NexusMonitoringPage() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  
  const { data: clientsData, loading: clientsLoading } = useClients({ limit: 50 });
  const { data: clientStatesData, loading: clientStatesLoading } = useClientStates({ limit: 50 });
  const { data: stateTaxInfoData, loading: stateTaxInfoLoading } = useStateTaxInfo();

  const clients = clientsData?.clients || [];
  const clientStates = clientStatesData?.clientStates || [];
  const stateTaxInfo = stateTaxInfoData?.stateTaxInfo || [];

  if (clientsLoading || clientStatesLoading || stateTaxInfoLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="text-white mt-4">Loading nexus monitoring...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-6">
        <div className="flex justify-center gap-6 xl:gap-8 pt-6 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-12 max-w-[90rem] mx-auto w-full">
          
          {/* Left Section - Map and Summary */}
          <div className="mt-6 gap-8 flex flex-col w-full">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-8 bg-green-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Nexus Monitoring Dashboard</h2>
              </div>
              <Link
                href="/dashboard/tax-manager"
                as={NextLink}
                className="group bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 px-4 py-2 text-white hover:bg-white/20 transition-all duration-200 hover:scale-105"
              >
                <svg className="w-4 h-4 mr-2 inline-block group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-medium">Back to Dashboard</span>
              </Link>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
                <div className="text-2xl font-bold text-white">{clientStates.length}</div>
                <div className="text-sm text-gray-400">Total Client States</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
                <div className="text-2xl font-bold text-red-400">
                  {clientStates.filter(cs => cs.status === 'critical').length}
                </div>
                <div className="text-sm text-gray-400">Critical States</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
                <div className="text-2xl font-bold text-orange-400">
                  {clientStates.filter(cs => cs.status === 'warning').length}
                </div>
                <div className="text-sm text-gray-400">Warning States</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
                <div className="text-2xl font-bold text-green-400">
                  ${(clientStates.reduce((sum, cs) => sum + (cs.currentAmount || 0), 0) / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-gray-400">Total Revenue</div>
              </div>
            </div>

            {/* Interactive Map */}
            <div className="h-full flex flex-col gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Interactive State Map</h2>
                {selectedState && (
                  <span className="text-sm text-gray-400">• Filtering by {selectedState}</span>
                )}
              </div>
              <div className="w-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                <DetailedUSMap clientStates={clientStates} onStateClick={setSelectedState} />
              </div>
            </div>
          </div>

          {/* Right Section - Client States Table */}
          <div className="mt-4 gap-6 flex flex-col xl:max-w-4xl w-full">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
              <h2 className="text-2xl font-semibold text-white tracking-tight">Client States</h2>
              {selectedState && (
                <button
                  onClick={() => setSelectedState(null)}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Clear Filter
                </button>
              )}
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
              <ClientStatesTable clientStates={clientStates} clients={clients} selectedState={selectedState} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

