"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";

interface Client {
  id: string;
  name: string;
  legalName?: string;
  industry?: string;
  status: string;
}

interface StateInfo {
  code: string;
  name: string;
  threshold: number;
  description: string;
}

const AddNexusMonitoring = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [monitoringData, setMonitoringData] = useState<{
    [stateCode: string]: {
      thresholdAmount: number;
      currentAmount: number;
      notes: string;
      priority: 'low' | 'medium' | 'high' | 'critical';
    }
  }>({});

  // US States with nexus thresholds
  const stateInfo: StateInfo[] = [
    { code: 'CA', name: 'California', threshold: 500000, description: 'Economic nexus threshold: $500,000 in sales' },
    { code: 'NY', name: 'New York', threshold: 500000, description: 'Economic nexus threshold: $500,000 in sales' },
    { code: 'TX', name: 'Texas', threshold: 500000, description: 'Economic nexus threshold: $500,000 in sales' },
    { code: 'FL', name: 'Florida', threshold: 100000, description: 'Economic nexus threshold: $100,000 in sales' },
    { code: 'IL', name: 'Illinois', threshold: 100000, description: 'Economic nexus threshold: $100,000 in sales' },
    { code: 'PA', name: 'Pennsylvania', threshold: 100000, description: 'Economic nexus threshold: $100,000 in sales' },
    { code: 'OH', name: 'Ohio', threshold: 100000, description: 'Economic nexus threshold: $100,000 in sales' },
    { code: 'GA', name: 'Georgia', threshold: 100000, description: 'Economic nexus threshold: $100,000 in sales' },
    { code: 'NC', name: 'North Carolina', threshold: 100000, description: 'Economic nexus threshold: $100,000 in sales' },
    { code: 'MI', name: 'Michigan', threshold: 100000, description: 'Economic nexus threshold: $100,000 in sales' },
    { code: 'NJ', name: 'New Jersey', threshold: 100000, description: 'Economic nexus threshold: $100,000 in sales' },
    { code: 'VA', name: 'Virginia', threshold: 100000, description: 'Economic nexus threshold: $100,000 in sales' },
    { code: 'WA', name: 'Washington', threshold: 100000, description: 'Economic nexus threshold: $100,000 in sales' },
    { code: 'AZ', name: 'Arizona', threshold: 100000, description: 'Economic nexus threshold: $100,000 in sales' },
    { code: 'MA', name: 'Massachusetts', threshold: 100000, description: 'Economic nexus threshold: $100,000 in sales' },
    { code: 'TN', name: 'Tennessee', threshold: 100000, description: 'Economic nexus threshold: $100,000 in sales' },
    { code: 'IN', name: 'Indiana', threshold: 100000, description: 'Economic nexus threshold: $100,000 in sales' },
    { code: 'MO', name: 'Missouri', threshold: 100000, description: 'Economic nexus threshold: $100,000 in sales' },
    { code: 'MD', name: 'Maryland', threshold: 100000, description: 'Economic nexus threshold: $100,000 in sales' },
    { code: 'WI', name: 'Wisconsin', threshold: 100000, description: 'Economic nexus threshold: $100,000 in sales' },
  ];

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getClients({ limit: 100 });
      if (response.success && response.data) {
        setClients(response.data.clients || []);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setCurrentStep(2);
  };

  const handleStateToggle = (stateCode: string) => {
    setSelectedStates(prev => {
      if (prev.includes(stateCode)) {
        const newStates = prev.filter(s => s !== stateCode);
        const newMonitoringData = { ...monitoringData };
        delete newMonitoringData[stateCode];
        setMonitoringData(newMonitoringData);
        return newStates;
      } else {
        const state = stateInfo.find(s => s.code === stateCode);
        if (state) {
          setMonitoringData(prev => ({
            ...prev,
            [stateCode]: {
              thresholdAmount: state.threshold,
              currentAmount: 0,
              notes: '',
              priority: 'medium'
            }
          }));
        }
        return [...prev, stateCode];
      }
    });
  };

  const handleMonitoringDataChange = (stateCode: string, field: string, value: any) => {
    setMonitoringData(prev => ({
      ...prev,
      [stateCode]: {
        ...prev[stateCode],
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    if (!selectedClient || selectedStates.length === 0) return;

    try {
      setLoading(true);
      
      // Create client states for each selected state
      for (const stateCode of selectedStates) {
        const data = monitoringData[stateCode];
        if (data) {
          // Create client state
          await apiClient.request(`/api/nexus/client-states`, {
            method: 'POST',
            body: JSON.stringify({
              clientId: selectedClient.id,
              organizationId: 'demo-org-id',
              stateCode,
              stateName: stateInfo.find(s => s.code === stateCode)?.name,
              status: 'monitoring',
              thresholdAmount: data.thresholdAmount,
              currentAmount: data.currentAmount,
              notes: data.notes,
              lastUpdated: new Date().toISOString()
            })
          });

          // Create nexus alert if current amount exceeds threshold
          if (data.currentAmount > data.thresholdAmount) {
            await apiClient.request(`/api/nexus/alerts`, {
              method: 'POST',
              body: JSON.stringify({
                clientId: selectedClient.id,
                organizationId: 'demo-org-id',
                stateCode,
                alertType: 'threshold_breach',
                priority: data.priority,
                status: 'open',
                title: `${stateInfo.find(s => s.code === stateCode)?.name} Nexus Threshold Exceeded`,
                description: `Client has exceeded the economic nexus threshold in ${stateInfo.find(s => s.code === stateCode)?.name}`,
                thresholdAmount: data.thresholdAmount,
                currentAmount: data.currentAmount,
                penaltyRisk: Math.floor((data.currentAmount - data.thresholdAmount) * 0.1)
              })
            });
          }
        }
      }

      // Redirect back to monitoring page
      router.push('/dashboard/managing-partner/monitoring');
    } catch (error) {
      console.error('Error creating nexus monitoring:', error);
      alert('Error creating nexus monitoring. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.legalName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.industry?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black py-8 px-2.5">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Add Nexus Monitoring</h1>
                <p className="text-gray-400">Set up comprehensive nexus monitoring for your clients</p>
              </div>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white/10 text-gray-400'
                  }`}>
                    {step}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    currentStep >= step ? 'text-white' : 'text-gray-400'
                  }`}>
                    {step === 1 ? 'Select Client' : step === 2 ? 'Choose States' : 'Configure Monitoring'}
                  </span>
                  {step < 3 && (
                    <div className={`w-8 h-px ml-4 ${
                      currentStep > step ? 'bg-blue-500' : 'bg-white/10'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Client Selection */}
          {currentStep === 1 && (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Select Client</h2>
              
              {/* Search */}
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 rounded-xl text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>

              {/* Client List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading clients...</p>
                  </div>
                ) : filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <div
                      key={client.id}
                      onClick={() => handleClientSelect(client)}
                      className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-semibold">{client.name}</h3>
                          {client.legalName && (
                            <p className="text-gray-400 text-sm">{client.legalName}</p>
                          )}
                          {client.industry && (
                            <p className="text-gray-500 text-xs">{client.industry}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            client.status === 'active' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {client.status}
                          </span>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No clients found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: State Selection */}
          {currentStep === 2 && (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">Choose States to Monitor</h2>
                  <p className="text-gray-400">Select the states where you want to monitor nexus compliance</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    disabled={selectedStates.length === 0}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    Next ({selectedStates.length} selected)
                  </button>
                </div>
              </div>

              {/* Selected Client Info */}
              {selectedClient && (
                <div className="mb-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <h3 className="text-white font-semibold mb-1">{selectedClient.name}</h3>
                  {selectedClient.legalName && (
                    <p className="text-gray-400 text-sm">{selectedClient.legalName}</p>
                  )}
                  {selectedClient.industry && (
                    <p className="text-gray-500 text-xs">{selectedClient.industry}</p>
                  )}
                </div>
              )}

              {/* State Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {stateInfo.map((state) => (
                  <div
                    key={state.code}
                    onClick={() => handleStateToggle(state.code)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                      selectedStates.includes(state.code)
                        ? 'bg-blue-500/20 border-blue-500/50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold">{state.code}</h3>
                      {selectedStates.includes(state.code) && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-1">{state.name}</p>
                    <p className="text-gray-500 text-xs">${state.threshold.toLocaleString()} threshold</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Configure Monitoring */}
          {currentStep === 3 && (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">Configure Monitoring</h2>
                  <p className="text-gray-400">Set up monitoring parameters for each selected state</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Create Monitoring</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Monitoring Configuration */}
              <div className="space-y-6">
                {selectedStates.map((stateCode) => {
                  const state = stateInfo.find(s => s.code === stateCode);
                  const data = monitoringData[stateCode];
                  
                  if (!state || !data) return null;

                  return (
                    <div key={stateCode} className="p-6 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-white font-semibold text-lg">{state.name} ({stateCode})</h3>
                          <p className="text-gray-400 text-sm">{state.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400 text-sm">Priority:</span>
                          <select
                            value={data.priority}
                            onChange={(e) => handleMonitoringDataChange(stateCode, 'priority', e.target.value)}
                            className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-white text-sm font-medium mb-2">
                            Current Revenue Amount
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                            <input
                              type="number"
                              value={data.currentAmount}
                              onChange={(e) => handleMonitoringDataChange(stateCode, 'currentAmount', parseFloat(e.target.value) || 0)}
                              className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                              placeholder="0"
                            />
                          </div>
                          <p className="text-gray-500 text-xs mt-1">
                            Current revenue in {state.name}
                          </p>
                        </div>

                        <div>
                          <label className="block text-white text-sm font-medium mb-2">
                            Threshold Amount
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                            <input
                              type="number"
                              value={data.thresholdAmount}
                              onChange={(e) => handleMonitoringDataChange(stateCode, 'thresholdAmount', parseFloat(e.target.value) || 0)}
                              className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                              placeholder="0"
                            />
                          </div>
                          <p className="text-gray-500 text-xs mt-1">
                            Economic nexus threshold for {state.name}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-white text-sm font-medium mb-2">
                          Notes
                        </label>
                        <textarea
                          value={data.notes}
                          onChange={(e) => handleMonitoringDataChange(stateCode, 'notes', e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                          rows={3}
                          placeholder="Add any specific notes about this state's monitoring..."
                        />
                      </div>

                      {/* Progress Indicator */}
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Progress to Threshold</span>
                          <span className="text-white font-medium">
                            {Math.round((data.currentAmount / data.thresholdAmount) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              data.currentAmount >= data.thresholdAmount
                                ? 'bg-red-500'
                                : data.currentAmount >= data.thresholdAmount * 0.8
                                ? 'bg-orange-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(100, (data.currentAmount / data.thresholdAmount) * 100)}%` }}
                          />
                        </div>
                        <p className="text-gray-500 text-xs mt-1">
                          {data.currentAmount >= data.thresholdAmount
                            ? '⚠️ Threshold exceeded - registration required'
                            : data.currentAmount >= data.thresholdAmount * 0.8
                            ? '⚠️ Approaching threshold - monitor closely'
                            : '✅ Below threshold - no action needed'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
    </div>
  );
};

export default AddNexusMonitoring;