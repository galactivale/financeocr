"use client";

import React, { useState, useMemo } from "react";
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  Spinner, 
  Card, 
  CardBody, 
  CardHeader 
} from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import NextLink from "next/link";
import { USAMap, USAStateAbbreviation, StateAbbreviations } from '@mirawision/usa-map-react';
import { useClients, useNexusAlerts, useNexusActivities, useClientStates, useStateTaxInfo } from "@/hooks/useApi";

// Enhanced US Map Component for detailed monitoring
const DetailedUSMap = ({ 
  clientStates, 
  onStateClick 
}: { 
  clientStates: any[]; 
  onStateClick: (stateCode: string) => void; 
}) => {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const handleMapStateClick = (stateCode: string) => {
    setSelectedState(stateCode);
    onStateClick(stateCode);
  };

  // Generate nexus data from clientStates
  const nexusData = useMemo(() => {
    const stateData: Record<string, { 
      status: string; 
      clients: number; 
      revenue: number; 
      alerts: number; 
      hasData: boolean;
    }> = {};
    
    // Process client states data
    clientStates.forEach(clientState => {
      const stateCode = clientState.stateCode;
      if (!stateData[stateCode]) {
        stateData[stateCode] = {
          status: clientState.status,
          clients: 1,
          revenue: clientState.currentAmount || 0,
          alerts: 0,
          hasData: true
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

    // Don't add states without client data - they will show as grey (no activity)

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
          case 'transit':
            fillColor = '#06b6d4';
            strokeColor = '#0891b2';
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
        // Default styling for states without client data - grey (no activity)
        settings[state] = {
          fill: '#374151', // Grey for no activity
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
        <div className="absolute top-4 right-4 bg-default-50 backdrop-blur-sm rounded-xl border border-default-200 p-4 min-w-[200px] shadow-lg">
          <h4 className="text-default-900 font-semibold text-sm mb-2">{selectedState}</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-default-600">Status:</span>
              <span className={`font-medium ${
                nexusData[selectedState].status === 'critical' ? 'text-danger' :
                nexusData[selectedState].status === 'warning' ? 'text-warning' :
                nexusData[selectedState].status === 'pending' ? 'text-primary' :
                'text-success'
              }`}>
                {nexusData[selectedState].status.charAt(0).toUpperCase() + nexusData[selectedState].status.slice(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-default-600">Clients:</span>
              <span className="text-default-900 font-medium">{nexusData[selectedState].clients}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-default-600">Revenue:</span>
              <span className="text-default-900 font-medium">${(nexusData[selectedState].revenue / 1000).toFixed(0)}K</span>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-default-50 backdrop-blur-sm rounded-xl border border-default-200 p-4 shadow-lg">
        <h4 className="text-default-900 font-medium text-sm mb-3">Status Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-danger"></div>
            <span className="text-default-900 text-xs">Critical</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-warning"></div>
            <span className="text-default-900 text-xs">Warning</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-default-900 text-xs">Pending</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-success"></div>
            <span className="text-default-900 text-xs">Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Client States Table Component
const ClientStatesTable = ({ 
  clientStates, 
  clients, 
  selectedState 
}: { 
  clientStates: any[]; 
  clients: any[]; 
  selectedState: string | null; 
}) => {
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

// Main Component
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
      <div className="h-full lg:px-6 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="text-default-600 mt-4">Loading nexus monitoring...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full lg:px-6">
      <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
        
        {/* Left Section - Map and Summary */}
        <div className="mt-6 gap-8 flex flex-col w-full">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Nexus Monitoring Dashboard</h3>
            <Link
              href="/dashboard/tax-manager"
              as={NextLink}
              color="primary"
              className="cursor-pointer"
            >
              Back to Dashboard
            </Link>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-default-50 rounded-xl shadow-md px-3 w-full">
              <CardBody className="py-5">
                <div className="text-2xl font-bold text-default-900">{clientStates.length}</div>
                <div className="text-sm text-default-600">Total Client States</div>
              </CardBody>
            </Card>
            <Card className="bg-danger rounded-xl shadow-md px-3 w-full">
              <CardBody className="py-5">
                <div className="text-2xl font-bold text-white">
                  {clientStates.filter(cs => cs.status === 'critical').length}
                </div>
                <div className="text-sm text-white">Critical States</div>
              </CardBody>
            </Card>
            <Card className="bg-warning rounded-xl shadow-md px-3 w-full">
              <CardBody className="py-5">
                <div className="text-2xl font-bold text-white">
                  {clientStates.filter(cs => cs.status === 'warning').length}
                </div>
                <div className="text-sm text-white">Warning States</div>
              </CardBody>
            </Card>
            <Card className="bg-success rounded-xl shadow-md px-3 w-full">
              <CardBody className="py-5">
                <div className="text-2xl font-bold text-white">
                  ${(clientStates.reduce((sum, cs) => sum + (cs.currentAmount || 0), 0) / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-white">Total Revenue</div>
              </CardBody>
            </Card>
          </div>

          {/* Interactive Map */}
          <div className="h-full flex flex-col gap-2">
            <h3 className="text-xl font-semibold">Interactive State Map</h3>
            {selectedState && (
              <span className="text-sm text-default-600">Filtering by {selectedState}</span>
            )}
            <div className="w-full bg-default-50 shadow-lg rounded-2xl p-6">
              <DetailedUSMap clientStates={clientStates} onStateClick={setSelectedState} />
            </div>
          </div>
        </div>

        {/* Right Section - Client States Table */}
        <div className="mt-4 gap-2 flex flex-col xl:max-w-4xl w-full">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Client States</h3>
            {selectedState && (
              <button
                onClick={() => setSelectedState(null)}
                className="text-sm text-primary hover:text-primary-600 transition-colors"
              >
                Clear Filter
              </button>
            )}
          </div>
          <div className="w-full bg-default-50 shadow-lg rounded-2xl p-6">
            <ClientStatesTable clientStates={clientStates} clients={clients} selectedState={selectedState} />
          </div>
        </div>
      </div>
    </div>
  );
}