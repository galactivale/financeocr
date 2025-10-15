"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Progress } from "@nextui-org/progress";
import { Badge } from "@nextui-org/badge";
import { Spinner } from "@nextui-org/spinner";
import { 
  AlertTriangle, 
  Shield, 
  TrendingUp, 
  DollarSign, 
  Users, 
  MapPin,
  ChevronRight,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Target,
  Activity
} from "lucide-react";
import { useRouter } from "next/navigation";

interface RiskMonitoringDashboardProps {
  organizationId?: string;
}

interface Client {
  id: string;
  name: string;
  slug: string;
  industry: string;
  annualRevenue: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  penaltyExposure: number;
  qualityScore: number;
  statesMonitored: number;
  activeAlerts: number;
  nexusAlerts: number;
  pendingTasks: number;
  lastUpdated: string;
}

interface PortfolioMetrics {
  totalClients: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  totalPenaltyExposure: number;
  totalRevenue: number;
  averageQualityScore: number;
  activeAlerts: number;
  openNexusAlerts: number;
  pendingTasks: number;
}

export default function RiskMonitoringDashboard({ organizationId = 'demo-org-id' }: RiskMonitoringDashboardProps) {
  const router = useRouter();
  const [portfolioData, setPortfolioData] = useState<PortfolioMetrics | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [highRiskClients, setHighRiskClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('all');

  const fetchRiskPortfolio = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/risk-portfolio?organizationId=${organizationId}`);
      const data = await response.json();
      
      if (data.success) {
        setPortfolioData(data.data.portfolio);
        setClients(data.data.clients);
        setHighRiskClients(data.data.highRiskClients);
      } else {
        setError('Failed to fetch risk portfolio data');
      }
    } catch (err) {
      setError('Error fetching risk portfolio data');
      console.error('Error fetching risk portfolio:', err);
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    fetchRiskPortfolio();
  }, [fetchRiskPortfolio]);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'primary';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'high': return <AlertCircle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredClients = selectedRiskLevel === 'all' 
    ? clients 
    : clients.filter(client => client.riskLevel === selectedRiskLevel);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-500">{error}</p>
        <Button 
          color="primary" 
          variant="flat" 
          onClick={fetchRiskPortfolio}
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Risk Monitoring Dashboard</h1>
          <p className="text-gray-400 mt-2">Monitor client nexus risk exposure and compliance status</p>
        </div>
        <div className="flex space-x-3">
          <Button
            color="primary"
            variant="flat"
            startContent={<BarChart3 className="w-4 h-4" />}
            onClick={() => router.push('/dashboard/managing-partner')}
          >
            Portfolio Analytics
          </Button>
        </div>
      </div>

      {/* Portfolio Overview Cards */}
      {portfolioData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <Chip color="primary" variant="flat" size="sm">
                  {portfolioData.totalClients} Clients
                </Chip>
              </div>
              <h3 className="text-2xl font-bold text-white">{portfolioData.totalClients}</h3>
              <p className="text-gray-400 text-sm">Total Clients</p>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <Chip color="danger" variant="flat" size="sm">
                  High Risk
                </Chip>
              </div>
              <h3 className="text-2xl font-bold text-white">
                {portfolioData.riskDistribution.critical + portfolioData.riskDistribution.high}
              </h3>
              <p className="text-gray-400 text-sm">High Risk Clients</p>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-yellow-400" />
                </div>
                <Chip color="warning" variant="flat" size="sm">
                  Exposure
                </Chip>
              </div>
              <h3 className="text-2xl font-bold text-white">
                {formatCurrency(portfolioData.totalPenaltyExposure)}
              </h3>
              <p className="text-gray-400 text-sm">Total Penalty Exposure</p>
            </CardBody>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <Chip color="success" variant="flat" size="sm">
                  Quality
                </Chip>
              </div>
              <h3 className="text-2xl font-bold text-white">{portfolioData.averageQualityScore}%</h3>
              <p className="text-gray-400 text-sm">Average Quality Score</p>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Risk Distribution */}
      {portfolioData && (
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
          <CardHeader className="pb-3">
            <h2 className="text-xl font-semibold text-white">Risk Distribution</h2>
          </CardHeader>
          <CardBody className="pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(portfolioData.riskDistribution).map(([level, count]) => (
                <div key={level} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {getRiskIcon(level)}
                    <span className="ml-2 text-sm font-medium text-gray-400 capitalize">{level}</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{count}</div>
                  <div className="text-xs text-gray-500">
                    {Math.round((count / portfolioData.totalClients) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Client Risk Filter */}
      <div className="flex items-center space-x-4">
        <h3 className="text-lg font-semibold text-white">Client Risk Levels</h3>
        <div className="flex space-x-2">
          {['all', 'critical', 'high', 'medium', 'low'].map((level) => (
            <Button
              key={level}
              size="sm"
              color={selectedRiskLevel === level ? 'primary' : 'default'}
              variant={selectedRiskLevel === level ? 'solid' : 'flat'}
              onClick={() => setSelectedRiskLevel(level)}
              className="capitalize"
            >
              {level}
            </Button>
          ))}
        </div>
      </div>

      {/* Client Risk List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card 
            key={client.id}
            className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20 cursor-pointer"
            onClick={() => router.push(`/dashboard/tax-manager/clients/${client.slug}`)}
          >
            <CardBody className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <span className="text-lg font-semibold text-white">
                      {client.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{client.name}</h3>
                    <p className="text-gray-400 text-sm">{client.industry}</p>
                  </div>
                </div>
                <Chip 
                  color={getRiskColor(client.riskLevel)} 
                  variant="flat" 
                  size="sm"
                  startContent={getRiskIcon(client.riskLevel)}
                >
                  {client.riskLevel}
                </Chip>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Revenue</span>
                  <span className="text-white font-semibold">{formatCurrency(client.annualRevenue)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Penalty Exposure</span>
                  <span className="text-red-400 font-semibold">{formatCurrency(client.penaltyExposure)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Quality Score</span>
                  <div className="flex items-center space-x-2">
                    <Progress 
                      value={client.qualityScore} 
                      className="w-16" 
                      color={client.qualityScore >= 90 ? 'success' : client.qualityScore >= 75 ? 'warning' : 'danger'}
                    />
                    <span className="text-white text-sm font-semibold">{client.qualityScore}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/10">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{client.statesMonitored}</div>
                    <div className="text-xs text-gray-400">States</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-400">{client.nexusAlerts}</div>
                    <div className="text-xs text-gray-400">Nexus Alerts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-400">{client.pendingTasks}</div>
                    <div className="text-xs text-gray-400">Tasks</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <span className="text-gray-400 text-xs">
                  Updated {new Date(client.lastUpdated).toLocaleDateString()}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* High Risk Alert */}
      {highRiskClients.length > 0 && (
        <Card className="bg-red-500/10 backdrop-blur-xl border border-red-500/20">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-semibold text-red-400">High Risk Clients Requiring Attention</h2>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {highRiskClients.map((client) => (
                <div 
                  key={client.id}
                  className="flex items-center justify-between p-4 bg-red-500/5 rounded-lg border border-red-500/10 hover:bg-red-500/10 transition-colors cursor-pointer"
                  onClick={() => router.push(`/dashboard/tax-manager/clients/${client.slug}`)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{client.name}</h4>
                      <p className="text-red-400 text-sm">
                        {client.nexusAlerts} nexus alerts • {formatCurrency(client.penaltyExposure)} exposure
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-red-400" />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}





