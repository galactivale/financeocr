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
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      toolbar: {
        show: false
      }
    },
    theme: {
      mode: 'dark' as const
    },
    colors: ['#6B7280', '#5B73E8', '#00D4AA'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: 8,
        borderRadiusApplication: 'end' as const,
        borderRadiusWhenStacked: 'last' as const
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#FFFFFF'],
        fontSize: '12px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontWeight: 600
      },
      formatter: (val: number) => `${val}%`,
      offsetY: -20
    },
    xaxis: {
      categories: ['Industry Average', 'Top Quartile', 'Our Performance'],
      labels: {
        style: {
          colors: '#9ca3af',
          fontSize: '12px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontWeight: 500
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      title: {
        text: 'ROI Percentage',
        style: {
          color: '#9ca3af',
          fontSize: '12px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontWeight: 600
        }
      },
      labels: {
        style: {
          colors: '#9ca3af',
          fontSize: '11px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        },
        formatter: (val: number) => `${val}%`
      }
    },
    grid: {
      borderColor: '#374151',
      strokeDashArray: 0,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true,
          strokeDashArray: 4
        }
      }
    },
    tooltip: {
      theme: 'dark' as const,
      style: {
        fontSize: '13px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      },
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
