"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface CostBenefitChartProps {
  costData: Record<string, number>;
  valueData: Record<string, number>;
}

export const CostBenefitChart: React.FC<CostBenefitChartProps> = ({ costData, valueData }) => {
  const costOptions = {
    chart: {
      type: 'donut' as const,
      height: 300,
      background: 'transparent'
    },
    theme: {
      mode: 'dark' as const
    },
    colors: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'],
    labels: Object.keys(costData).map(key => key.replace(/([A-Z])/g, ' $1').trim()),
    legend: {
      position: 'bottom' as const,
      labels: {
        colors: '#ffffff'
      }
    },
    tooltip: {
      theme: 'dark' as const,
      y: {
        formatter: (value: number) => `$${value.toLocaleString()}`
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Investment',
              color: '#ffffff',
              formatter: () => `$${Object.values(costData).reduce((a, b) => a + b, 0).toLocaleString()}`
            }
          }
        }
      }
    }
  };

  const valueOptions = {
    chart: {
      type: 'donut' as const,
      height: 300,
      background: 'transparent'
    },
    theme: {
      mode: 'dark' as const
    },
    colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'],
    labels: Object.keys(valueData).map(key => key.replace(/([A-Z])/g, ' $1').trim()),
    legend: {
      position: 'bottom' as const,
      labels: {
        colors: '#ffffff'
      }
    },
    tooltip: {
      theme: 'dark' as const,
      y: {
        formatter: (value: number) => `$${value.toLocaleString()}`
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Value',
              color: '#ffffff',
              formatter: () => `$${Object.values(valueData).reduce((a, b) => a + b, 0).toLocaleString()}`
            }
          }
        }
      }
    }
  };

  const costSeries = Object.values(costData);
  const valueSeries = Object.values(valueData);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 className="text-white font-medium mb-4 text-center">Investment Breakdown</h4>
        <Chart options={costOptions} series={costSeries} type="donut" height={300} />
      </div>
      <div>
        <h4 className="text-white font-medium mb-4 text-center">Value Creation</h4>
        <Chart options={valueOptions} series={valueSeries} type="donut" height={300} />
      </div>
    </div>
  );
};
