"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardBody, CardHeader, Button, Chip, Progress } from '@nextui-org/react';
import { TrendingUp, TrendingDown, Target, AlertTriangle, CheckCircle, BarChart3, PieChart, Activity } from 'lucide-react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ScenarioChartProps {
  scenarios: {
    conservative: { roi: number; penalties: number; growth: number };
    realistic: { roi: number; penalties: number; growth: number };
    optimistic: { roi: number; penalties: number; growth: number };
  };
}

export const ScenarioChart: React.FC<ScenarioChartProps> = ({ scenarios }) => {
  const [selectedView, setSelectedView] = useState<'overview' | 'detailed' | 'comparison'>('overview');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getScenarioColor = (scenario: string) => {
    switch (scenario) {
      case 'conservative': return 'warning';
      case 'realistic': return 'success';
      case 'optimistic': return 'primary';
      default: return 'default';
    }
  };

  const getScenarioIcon = (scenario: string) => {
    switch (scenario) {
      case 'conservative': return <AlertTriangle className="w-4 h-4" />;
      case 'realistic': return <Target className="w-4 h-4" />;
      case 'optimistic': return <TrendingUp className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  // Chart options for different views
  const getChartOptions = (type: 'bar' | 'radar' | 'line') => {
    const baseOptions = {
    chart: {
        type: type,
        height: 300,
      background: 'transparent',
        toolbar: { show: false }
    },
      theme: { mode: 'dark' as const },
    colors: ['#eab308', '#10b981', '#3b82f6'],
      stroke: { width: 2 },
      fill: { opacity: 0.1 },
      markers: { size: 4 },
    legend: {
        labels: { colors: '#ffffff' },
        position: 'bottom' as const
    },
    tooltip: {
      theme: 'dark' as const,
      y: {
        formatter: (val: number, opts: any) => {
            const seriesName = opts.w.config.series[opts.seriesIndex]?.name;
            if (seriesName && seriesName.includes('Penalties')) {
              return formatCurrency(val);
          }
          return `${val}%`;
        }
      }
    }
  };

    if (type === 'bar') {
      return {
        ...baseOptions,
        xaxis: {
          categories: ['Conservative', 'Realistic', 'Optimistic'],
          labels: { style: { colors: '#9ca3af' } }
        },
        yaxis: {
          labels: { style: { colors: '#9ca3af' } }
        }
      };
    }

    if (type === 'radar') {
      return {
        ...baseOptions,
        xaxis: {
          categories: ['ROI %', 'Penalties Prevented', 'Growth Rate %'],
          labels: { style: { colors: '#9ca3af' } }
        },
        yaxis: { show: false }
      };
    }

    return baseOptions;
  };

  const getChartSeries = (type: 'bar' | 'radar' | 'line') => {
    if (type === 'bar') {
      return [
        {
          name: 'ROI %',
          data: [scenarios.conservative.roi, scenarios.realistic.roi, scenarios.optimistic.roi]
        },
        {
          name: 'Growth Rate %',
          data: [scenarios.conservative.growth, scenarios.realistic.growth, scenarios.optimistic.growth]
        }
      ];
    }

    if (type === 'radar') {
  const maxROI = Math.max(scenarios.conservative.roi, scenarios.realistic.roi, scenarios.optimistic.roi);
  const maxPenalties = Math.max(scenarios.conservative.penalties, scenarios.realistic.penalties, scenarios.optimistic.penalties);
  const maxGrowth = Math.max(scenarios.conservative.growth, scenarios.realistic.growth, scenarios.optimistic.growth);

      const normalizeValue = (value: number, max: number) => (value / max) * 100;

      return [
    {
      name: 'Conservative',
      data: [
        normalizeValue(scenarios.conservative.roi, maxROI),
        normalizeValue(scenarios.conservative.penalties, maxPenalties),
        normalizeValue(scenarios.conservative.growth, maxGrowth)
      ]
    },
    {
      name: 'Realistic',
      data: [
        normalizeValue(scenarios.realistic.roi, maxROI),
        normalizeValue(scenarios.realistic.penalties, maxPenalties),
        normalizeValue(scenarios.realistic.growth, maxGrowth)
      ]
    },
    {
      name: 'Optimistic',
      data: [
        normalizeValue(scenarios.optimistic.roi, maxROI),
        normalizeValue(scenarios.optimistic.penalties, maxPenalties),
        normalizeValue(scenarios.optimistic.growth, maxGrowth)
      ]
    }
  ];
    }

    return [];
  };

  return (
    <div className="w-full space-y-6">
      {/* View Toggle */}
      <div className="flex justify-center gap-2">
        <Button
          size="sm"
          variant={selectedView === 'overview' ? 'solid' : 'flat'}
          color={selectedView === 'overview' ? 'primary' : 'default'}
          onClick={() => setSelectedView('overview')}
          startContent={<BarChart3 className="w-4 h-4" />}
          className={selectedView === 'overview' ? 'bg-blue-600/20 text-blue-400' : 'bg-gray-700/50 text-gray-300'}
        >
          Overview
        </Button>
        <Button
          size="sm"
          variant={selectedView === 'detailed' ? 'solid' : 'flat'}
          color={selectedView === 'detailed' ? 'primary' : 'default'}
          onClick={() => setSelectedView('detailed')}
          startContent={<PieChart className="w-4 h-4" />}
          className={selectedView === 'detailed' ? 'bg-blue-600/20 text-blue-400' : 'bg-gray-700/50 text-gray-300'}
        >
          Detailed
        </Button>
        <Button
          size="sm"
          variant={selectedView === 'comparison' ? 'solid' : 'flat'}
          color={selectedView === 'comparison' ? 'primary' : 'default'}
          onClick={() => setSelectedView('comparison')}
          startContent={<Activity className="w-4 h-4" />}
          className={selectedView === 'comparison' ? 'bg-blue-600/20 text-blue-400' : 'bg-gray-700/50 text-gray-300'}
        >
          Comparison
        </Button>
      </div>

      {selectedView === 'overview' && (
        <div className="space-y-4">
          {/* Scenario Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(scenarios).map(([key, scenario]) => (
              <Card key={key} className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl">
                <CardBody className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    {getScenarioIcon(key)}
                    <h4 className="text-white font-semibold capitalize">{key}</h4>
                    <Chip size="sm" color={getScenarioColor(key) as any} variant="flat">
                      {key === 'conservative' ? 'Low Risk' : key === 'realistic' ? 'Balanced' : 'High Growth'}
                    </Chip>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">ROI</span>
                      <span className="text-white font-medium">{scenario.roi}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Penalties Prevented</span>
                      <span className="text-white font-medium">{formatCurrency(scenario.penalties)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Growth Rate</span>
                      <span className="text-white font-medium">{scenario.growth}%</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Bar Chart */}
          <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl">
            <CardHeader>
              <h4 className="text-white font-medium">ROI & Growth Comparison</h4>
            </CardHeader>
            <CardBody>
              <Chart 
                options={getChartOptions('bar')} 
                series={getChartSeries('bar')} 
                type="bar" 
                height={300} 
              />
            </CardBody>
          </Card>
        </div>
      )}

      {selectedView === 'detailed' && (
        <div className="space-y-4">
          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(scenarios).map(([key, scenario]) => (
              <Card key={key} className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {getScenarioIcon(key)}
                    <h4 className="text-white font-semibold capitalize">{key} Scenario</h4>
                  </div>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400 text-sm">ROI Performance</span>
                      <span className="text-white font-medium">{scenario.roi}%</span>
                    </div>
                    <Progress 
                      value={scenario.roi} 
                      maxValue={4000} 
                      color={getScenarioColor(key) as any}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400 text-sm">Penalties Prevented</span>
                      <span className="text-white font-medium">{formatCurrency(scenario.penalties)}</span>
                    </div>
                    <Progress 
                      value={(scenario.penalties / 2000000) * 100} 
                      color={getScenarioColor(key) as any}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400 text-sm">Growth Rate</span>
                      <span className="text-white font-medium">{scenario.growth}%</span>
                    </div>
                    <Progress 
                      value={scenario.growth} 
                      maxValue={50} 
                      color={getScenarioColor(key) as any}
                      className="w-full"
                    />
                  </div>

                  <div className="pt-2 border-t border-gray-700/50">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">
                        {key === 'conservative' ? 'Low Risk, Steady Growth' : 
                         key === 'realistic' ? 'Balanced Approach' : 
                         'High Growth Potential'}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        {key === 'conservative' ? 'Conservative investment strategy' : 
                         key === 'realistic' ? 'Market-aligned expectations' : 
                         'Aggressive growth targets'}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedView === 'comparison' && (
        <div className="space-y-4">
          {/* Radar Chart */}
          <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl">
            <CardHeader>
              <h4 className="text-white font-medium">Multi-Dimensional Scenario Analysis</h4>
            </CardHeader>
            <CardBody>
              <Chart 
                options={getChartOptions('radar')} 
                series={getChartSeries('radar')} 
                type="radar" 
                height={350} 
              />
            </CardBody>
          </Card>

          {/* Scenario Comparison Table */}
          <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl">
            <CardHeader>
              <h4 className="text-white font-medium">Scenario Comparison Matrix</h4>
            </CardHeader>
            <CardBody>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700/50">
                      <th className="text-left text-gray-400 text-sm py-2">Metric</th>
                      <th className="text-center text-gray-400 text-sm py-2">Conservative</th>
                      <th className="text-center text-gray-400 text-sm py-2">Realistic</th>
                      <th className="text-center text-gray-400 text-sm py-2">Optimistic</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    <tr className="border-b border-gray-700/30">
                      <td className="text-white text-sm py-2">ROI %</td>
                      <td className="text-center text-yellow-400 text-sm py-2">{scenarios.conservative.roi}%</td>
                      <td className="text-center text-green-400 text-sm py-2">{scenarios.realistic.roi}%</td>
                      <td className="text-center text-blue-400 text-sm py-2">{scenarios.optimistic.roi}%</td>
                    </tr>
                    <tr className="border-b border-gray-700/30">
                      <td className="text-white text-sm py-2">Penalties Prevented</td>
                      <td className="text-center text-yellow-400 text-sm py-2">{formatCurrency(scenarios.conservative.penalties)}</td>
                      <td className="text-center text-green-400 text-sm py-2">{formatCurrency(scenarios.realistic.penalties)}</td>
                      <td className="text-center text-blue-400 text-sm py-2">{formatCurrency(scenarios.optimistic.penalties)}</td>
                    </tr>
                    <tr>
                      <td className="text-white text-sm py-2">Growth Rate %</td>
                      <td className="text-center text-yellow-400 text-sm py-2">{scenarios.conservative.growth}%</td>
                      <td className="text-center text-green-400 text-sm py-2">{scenarios.realistic.growth}%</td>
                      <td className="text-center text-blue-400 text-sm py-2">{scenarios.optimistic.growth}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};

