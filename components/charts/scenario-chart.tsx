"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ScenarioChartProps {
  scenarios: {
    conservative: { roi: number; penalties: number; growth: number };
    realistic: { roi: number; penalties: number; growth: number };
    optimistic: { roi: number; penalties: number; growth: number };
  };
}

export const ScenarioChart: React.FC<ScenarioChartProps> = ({ scenarios }) => {
  const options = {
    chart: {
      type: 'radar' as const,
      height: 350,
      background: 'transparent',
      toolbar: {
        show: false
      }
    },
    theme: {
      mode: 'dark' as const
    },
    colors: ['#eab308', '#10b981', '#3b82f6'],
    stroke: {
      width: 2
    },
    fill: {
      opacity: 0.1
    },
    markers: {
      size: 4
    },
    xaxis: {
      categories: ['ROI %', 'Penalties Prevented', 'Growth Rate %'],
      labels: {
        style: {
          colors: '#9ca3af'
        }
      }
    },
    yaxis: {
      show: false
    },
    legend: {
      labels: {
        colors: '#ffffff'
      }
    },
    tooltip: {
      theme: 'dark' as const,
      y: {
        formatter: (val: number, opts: any) => {
          const category = opts.w.config.xaxis.categories[opts.dataPointIndex];
          if (category === 'Penalties Prevented') {
            return `$${val.toLocaleString()}`;
          }
          return `${val}%`;
        }
      }
    }
  };

  // Normalize data for radar chart (0-100 scale)
  const normalizeValue = (value: number, max: number) => (value / max) * 100;
  
  const maxROI = Math.max(scenarios.conservative.roi, scenarios.realistic.roi, scenarios.optimistic.roi);
  const maxPenalties = Math.max(scenarios.conservative.penalties, scenarios.realistic.penalties, scenarios.optimistic.penalties);
  const maxGrowth = Math.max(scenarios.conservative.growth, scenarios.realistic.growth, scenarios.optimistic.growth);

  const series = [
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

  return (
    <div className="w-full">
      <Chart options={options} series={series} type="radar" height={350} />
    </div>
  );
};
