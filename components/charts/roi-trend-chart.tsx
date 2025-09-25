"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ROITrendChartProps {
  data: Array<{
    month: string;
    roi: number;
    penalties: number;
    efficiency: number;
  }>;
}

export const ROITrendChart: React.FC<ROITrendChartProps> = ({ data }) => {
  const options = {
    chart: {
      type: 'line' as const,
      height: 350,
      background: 'transparent',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      }
    },
    theme: {
      mode: 'dark' as const
    },
    colors: ['#10b981', '#3b82f6', '#8b5cf6'],
    stroke: {
      curve: 'smooth' as const,
      width: 3
    },
    grid: {
      borderColor: '#374151',
      strokeDashArray: 4
    },
    xaxis: {
      categories: data.map(item => item.month),
      labels: {
        style: {
          colors: '#9ca3af'
        }
      }
    },
    yaxis: [
      {
        title: {
          text: 'ROI (%)',
          style: {
            color: '#10b981'
          }
        },
        labels: {
          style: {
            colors: '#9ca3af'
          }
        }
      },
      {
        opposite: true,
        title: {
          text: 'Penalties ($)',
          style: {
            color: '#3b82f6'
          }
        },
        labels: {
          style: {
            colors: '#9ca3af'
          },
          formatter: (value: number) => `$${(value / 1000).toFixed(0)}K`
        }
      }
    ],
    legend: {
      labels: {
        colors: '#ffffff'
      }
    },
    tooltip: {
      theme: 'dark' as const,
      y: [
        {
          formatter: (value: number) => `${value}%`
        },
        {
          formatter: (value: number) => `$${value.toLocaleString()}`
        }
      ]
    }
  };

  const series = [
    {
      name: 'ROI %',
      type: 'line',
      data: data.map(item => item.roi)
    },
    {
      name: 'Penalties Prevented',
      type: 'column',
      data: data.map(item => item.penalties)
    }
  ];

  return (
    <div className="w-full">
      <Chart options={options} series={series} type="line" height={350} />
    </div>
  );
};
