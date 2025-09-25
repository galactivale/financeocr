"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface BenchmarkingChartProps {
  industryAverage: number;
  topQuartile: number;
  ourPerformance: number;
}

export const BenchmarkingChart: React.FC<BenchmarkingChartProps> = ({ 
  industryAverage, 
  topQuartile, 
  ourPerformance 
}) => {
  const options = {
    chart: {
      type: 'bar' as const,
      height: 300,
      background: 'transparent',
      toolbar: {
        show: false
      }
    },
    theme: {
      mode: 'dark' as const
    },
    colors: ['#6b7280', '#3b82f6', '#10b981'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#ffffff']
      },
      formatter: (val: number) => `${val}%`
    },
    xaxis: {
      categories: ['Industry Average', 'Top Quartile', 'Our Performance'],
      labels: {
        style: {
          colors: '#9ca3af'
        }
      }
    },
    yaxis: {
      title: {
        text: 'ROI Percentage',
        style: {
          color: '#9ca3af'
        }
      },
      labels: {
        style: {
          colors: '#9ca3af'
        },
        formatter: (val: number) => `${val}%`
      }
    },
    grid: {
      borderColor: '#374151',
      strokeDashArray: 4
    },
    tooltip: {
      theme: 'dark' as const,
      y: {
        formatter: (val: number) => `${val}% ROI`
      }
    }
  };

  const series = [
    {
      name: 'ROI Performance',
      data: [industryAverage, topQuartile, ourPerformance]
    }
  ];

  return (
    <div className="w-full">
      <Chart options={options} series={series} type="bar" height={300} />
    </div>
  );
};
