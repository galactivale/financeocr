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
      height: 320,
      background: 'transparent',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      toolbar: {
        show: false
      }
    },
    theme: {
      mode: 'dark' as const
    },
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
    labels: Object.keys(costData).map(key => key.replace(/([A-Z])/g, ' $1').trim()),
    legend: {
      position: 'bottom' as const,
      horizontalAlign: 'center' as const,
      fontSize: '12px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: 500,
      labels: {
        colors: '#E5E7EB',
        useSeriesColors: false
      },
      markers: {
        width: 8,
        height: 8,
        radius: 4,
        strokeWidth: 0
      },
      itemMargin: {
        horizontal: 12,
        vertical: 8
      }
    },
    tooltip: {
      theme: 'dark' as const,
      style: {
        fontSize: '13px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      },
      y: {
        formatter: (value: number) => `$${value.toLocaleString()}`
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          background: 'transparent',
          labels: {
            show: true,
            name: {
              show: false
            },
            value: {
              show: false
            },
            total: {
              show: true,
              showAlways: true,
              label: 'Total Investment',
              fontSize: '16px',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              color: '#FFFFFF',
              formatter: () => `$${Object.values(costData).reduce((a, b) => a + b, 0).toLocaleString()}`
            }
          }
        }
      }
    },
    stroke: {
      width: 0
    },
    dataLabels: {
      enabled: false
    }
  };

  const valueOptions = {
    chart: {
      type: 'donut' as const,
      height: 320,
      background: 'transparent',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      toolbar: {
        show: false
      }
    },
    theme: {
      mode: 'dark' as const
    },
    colors: ['#00D4AA', '#5B73E8', '#A78BFA', '#F59E0B', '#EF4444', '#06B6D4'],
    labels: Object.keys(valueData).map(key => key.replace(/([A-Z])/g, ' $1').trim()),
    legend: {
      position: 'bottom' as const,
      horizontalAlign: 'center' as const,
      fontSize: '12px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: 500,
      labels: {
        colors: '#E5E7EB',
        useSeriesColors: false
      },
      markers: {
        width: 8,
        height: 8,
        radius: 4,
        strokeWidth: 0
      },
      itemMargin: {
        horizontal: 12,
        vertical: 8
      }
    },
    tooltip: {
      theme: 'dark' as const,
      style: {
        fontSize: '13px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      },
      y: {
        formatter: (value: number) => `$${value.toLocaleString()}`
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          background: 'transparent',
          labels: {
            show: true,
            name: {
              show: false
            },
            value: {
              show: false
            },
            total: {
              show: true,
              showAlways: true,
              label: 'Total Value',
              fontSize: '16px',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              color: '#FFFFFF',
              formatter: () => `$${Object.values(valueData).reduce((a, b) => a + b, 0).toLocaleString()}`
            }
          }
        }
      }
    },
    stroke: {
      width: 0
    },
    dataLabels: {
      enabled: false
    }
  };

  const costSeries = Object.values(costData);
  const valueSeries = Object.values(valueData);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="text-center">
          <h4 className="text-white font-semibold text-lg mb-2 tracking-tight">Investment Breakdown</h4>
          <p className="text-gray-400 text-sm">Platform development and implementation costs</p>
        </div>
        <div className="relative">
          <Chart options={costOptions} series={costSeries} type="donut" height={320} />
        </div>
      </div>
      <div className="space-y-4">
        <div className="text-center">
          <h4 className="text-white font-semibold text-lg mb-2 tracking-tight">Value Creation</h4>
          <p className="text-gray-400 text-sm">Measurable returns and business impact</p>
        </div>
        <div className="relative">
          <Chart options={valueOptions} series={valueSeries} type="donut" height={320} />
        </div>
      </div>
    </div>
  );
};
