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
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
    colors: ['#00D4AA', '#5B73E8', '#A78BFA'],
    stroke: {
      curve: 'smooth' as const,
      width: 3,
      lineCap: 'round' as const
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
    xaxis: {
      categories: data.map(item => item.month),
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
    yaxis: [
      {
        title: {
          text: 'ROI (%)',
          style: {
            color: '#00D4AA',
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
          }
        }
      },
      {
        opposite: true,
        title: {
          text: 'Penalties ($)',
          style: {
            color: '#5B73E8',
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
          formatter: (value: number) => `$${(value / 1000).toFixed(0)}K`
        }
      }
    ],
    legend: {
      position: 'top' as const,
      horizontalAlign: 'right' as const,
      fontSize: '12px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: 500,
      labels: {
        colors: '#E5E7EB'
      },
      markers: {
        width: 8,
        height: 8,
        radius: 4,
        strokeWidth: 0
      }
    },
    tooltip: {
      theme: 'dark' as const,
      style: {
        fontSize: '13px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      },
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
