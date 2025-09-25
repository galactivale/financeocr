"use client";
import React, { useState } from "react";
import { Button, Tabs, Tab } from "@nextui-org/react";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Users, 
  Shield, 
  FileText, 
  BarChart3,
  DollarSign,
  Target,
  Award,
  Calendar,
  ArrowUpRight,
  ChevronRight
} from "lucide-react";

export default function CompliancePage() {
  const [selectedTab, setSelectedTab] = useState("executive-decisions");

  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-6 px-4 lg:px-0 mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-white tracking-tight">Compliance Intelligence Center</h1>
            <div className="flex items-center space-x-6 mt-2 text-gray-400 text-sm">
              <span>Michael Thompson, Managing Partner CPA</span>
              <span>•</span>
              <span>Demo CPA Firm</span>
              <span>•</span>
              <span>Portfolio: 47 clients</span>
              <span>•</span>
              <span>Total Exposure: $284,500</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-gray-400 text-sm">Last Strategic Review</div>
            <div className="text-white font-medium">Nov 28, 2024</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center px-4 lg:px-0 mb-8">
          <div className="w-full max-w-[90rem]">
            <Tabs
              selectedKey={selectedTab}
              onSelectionChange={(key) => setSelectedTab(key as string)}
              className="w-full"
              classNames={{
                tabList: "bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-1",
                tab: "text-gray-400 hover:text-white data-[selected=true]:text-white data-[selected=true]:bg-white/10",
                tabContent: "text-sm font-medium",
                cursor: "bg-white/10 rounded-xl"
              }}
            >
              <Tab key="executive-decisions" title="Executive Decisions" />
              <Tab key="risk-analysis" title="Risk Analysis" />
              <Tab key="business-impact" title="Business Impact" />
              <Tab key="team-performance" title="Team Performance" />
              <Tab key="liability-management" title="Liability Management" />
              <Tab key="action-center" title="Action Center" />
            </Tabs>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex justify-center px-4 lg:px-0">
          <div className="w-full max-w-[90rem]">
            {selectedTab === "executive-decisions" && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-1 h-8 bg-red-500 rounded-full"></div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">Executive Decisions Required</h2>
                </div>
                
                {/* High Exposure Decisions */}
                <div className="space-y-4 mb-6">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <span className="text-red-400 font-semibold text-sm">HIGH EXPOSURE DECISIONS AWAITING APPROVAL (2)</span>
                      </div>
                      <div className="flex items-center space-x-2 text-red-400 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>Must approve by 4:00 PM today</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-black/20 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-semibold">TechCorp SaaS - California Registration Decision</h3>
                          <span className="text-red-400 font-bold">$45,000</span>
                        </div>
                        <div className="text-gray-300 text-sm mb-3">
                          Tax Manager: Jane Doe | Recommendation: Immediate registration required
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-green-400">Professional Rationale: Complete</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-green-400">Peer Review: Approved</span>
                          </div>
                        </div>
                        <div className="flex space-x-3 mt-4">
                          <Button size="sm" className="bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30">
                            Review Decision Package
                          </Button>
                          <Button size="sm" className="bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30">
                            Approve
                          </Button>
                          <Button size="sm" className="bg-gray-500/20 border-gray-500/30 text-gray-400 hover:bg-gray-500/30">
                            Request Modification
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-black/20 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-semibold">RetailChain LLC - Multi-State Compliance Strategy</h3>
                          <span className="text-orange-400 font-bold">$67,000</span>
                        </div>
                        <div className="text-gray-300 text-sm mb-3">
                          Tax Manager: Robert Kim | Recommendation: Register in NY, monitor TX closely
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-green-400">Professional Analysis: Complete</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400">Legal Review: Pending</span>
                          </div>
                        </div>
                        <div className="text-gray-300 text-sm mb-3">
                          Strategic Impact: Affects 3 similar clients in portfolio
                        </div>
                        <div className="flex space-x-3 mt-4">
                          <Button size="sm" className="bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30">
                            Review Strategy
                          </Button>
                          <Button size="sm" className="bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30">
                            Approve
                          </Button>
                          <Button size="sm" className="bg-purple-500/20 border-purple-500/30 text-purple-400 hover:bg-purple-500/30">
                            Schedule Partner Meeting
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Escalated Issues */}
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-400 font-semibold text-sm">ESCALATED ISSUES (1)</span>
                    </div>
                    
                    <div className="bg-black/20 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-2">GlobalServices Inc - Complex Multi-Jurisdiction Analysis</h3>
                      <div className="text-gray-300 text-sm space-y-1">
                        <div>Requires: Legal counsel consultation + regulatory research</div>
                        <div>Impact: 12 clients with similar business models</div>
                        <div>Status: External counsel engaged (Wilson & Associates)</div>
                      </div>
                      <div className="flex space-x-3 mt-4">
                        <Button size="sm" className="bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30">
                          Monitor Legal Progress
                        </Button>
                        <Button size="sm" className="bg-purple-500/20 border-purple-500/30 text-purple-400 hover:bg-purple-500/30">
                          Internal Strategy Meeting
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === "risk-analysis" && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-1 h-8 bg-orange-500 rounded-full"></div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">Firm-Wide Risk Portfolio Analysis</h2>
                </div>
                
                {/* Executive Risk Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-black/20 rounded-xl p-4">
                    <div className="text-gray-400 text-sm mb-1">Total Portfolio Risk</div>
                    <div className="text-white text-2xl font-bold">$284,500</div>
                    <div className="text-green-400 text-sm">WITHIN acceptable limits</div>
                  </div>
                  <div className="bg-black/20 rounded-xl p-4">
                    <div className="text-gray-400 text-sm mb-1">Firm Risk Threshold</div>
                    <div className="text-white text-2xl font-bold">$500,000</div>
                    <div className="text-blue-400 text-sm">43% capacity remaining</div>
                  </div>
                  <div className="bg-black/20 rounded-xl p-4">
                    <div className="text-gray-400 text-sm mb-1">Professional Liability</div>
                    <div className="text-white text-2xl font-bold">PROTECTED</div>
                    <div className="text-green-400 text-sm">Excellent documentation</div>
                  </div>
                </div>
                
                {/* Risk Distribution Analysis */}
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-4">Risk Distribution Analysis</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span className="text-white text-sm">Critical (8 clients): $127,000</span>
                      </div>
                      <div className="text-gray-400 text-sm">45%</div>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{width: '45%'}}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-orange-500 rounded"></div>
                        <span className="text-white text-sm">High (12 clients): $89,500</span>
                      </div>
                      <div className="text-gray-400 text-sm">31%</div>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{width: '31%'}}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                        <span className="text-white text-sm">Medium (18 clients): $52,000</span>
                      </div>
                      <div className="text-gray-400 text-sm">18%</div>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{width: '18%'}}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span className="text-white text-sm">Low (9 clients): $16,000</span>
                      </div>
                      <div className="text-gray-400 text-sm">6%</div>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '6%'}}></div>
                    </div>
                  </div>
                </div>
                
                {/* Strategic Risk Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-white font-semibold mb-3">Strategic Risk Indicators</h4>
                    <div className="space-y-2 text-sm">
                      <div className="text-gray-300">Risk Concentration: 8 clients = 45% of total exposure</div>
                      <div className="text-gray-300">Geographic Risk: CA (40%), NY (25%), TX (20%), Others (15%)</div>
                      <div className="text-gray-300">Industry Risk: Technology (35%), Retail (28%), Manufacturing (22%)</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-3">Risk Trend Analysis</h4>
                    <div className="space-y-2 text-sm">
                      <div className="text-gray-300">Risk Escalations This Quarter: 5 clients moved to higher risk</div>
                      <div className="text-gray-300">Risk Mitigations Achieved: 8 clients successfully managed down</div>
                      <div className="text-gray-300">New Client Risk Profile: 3 high-risk clients added</div>
                    </div>
                  </div>
                </div>
                
                {/* Executive Action Recommendations */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <h4 className="text-white font-semibold mb-3">Executive Action Recommendations</h4>
                  <div className="space-y-2 text-sm text-gray-300 mb-4">
                    <div>• Consider risk threshold increase to $750K (business case attached)</div>
                    <div>• Evaluate additional malpractice coverage for growth</div>
                    <div>• Assess need for NY jurisdiction specialist on team</div>
                  </div>
                  <div className="flex space-x-3">
                    <Button size="sm" className="bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30">
                      Detailed Risk Analysis
                    </Button>
                    <Button size="sm" className="bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30">
                      Business Case Review
                    </Button>
                    <Button size="sm" className="bg-purple-500/20 border-purple-500/30 text-purple-400 hover:bg-purple-500/30">
                      Strategy Planning
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === "business-impact" && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-1 h-8 bg-green-500 rounded-full"></div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">Economic Nexus Platform Business Impact</h2>
                </div>
                
                {/* Financial Performance */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-black/20 rounded-xl p-4">
                    <div className="text-gray-400 text-sm mb-1">Platform Investment</div>
                    <div className="text-white text-2xl font-bold">$48,000</div>
                    <div className="text-gray-300 text-sm">software + staff time</div>
                  </div>
                  <div className="bg-black/20 rounded-xl p-4">
                    <div className="text-gray-400 text-sm mb-1">Direct Value Created</div>
                    <div className="text-white text-2xl font-bold">$1,228,000</div>
                    <div className="text-green-400 text-sm">penalties prevented</div>
                  </div>
                  <div className="bg-black/20 rounded-xl p-4">
                    <div className="text-gray-400 text-sm mb-1">Net ROI</div>
                    <div className="text-white text-2xl font-bold">2,458%</div>
                    <div className="text-green-400 text-sm">$1,180,000 net value</div>
                  </div>
                </div>
                
                {/* Value Breakdown */}
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-4">Value Breakdown Analysis</h3>
                  <div className="bg-black/20 rounded-xl p-4">
                    <div className="text-white font-semibold mb-3">Penalty Prevention: $1,228,000 (18 major incidents avoided)</div>
                    <div className="space-y-2 text-sm text-gray-300 ml-4">
                      <div>├─ California registrations: $456,000 in penalties avoided</div>
                      <div>├─ New York compliance: $298,000 in penalties avoided</div>
                      <div>├─ Texas proactive measures: $234,000 in penalties avoided</div>
                      <div>└─ Multi-state coordination: $240,000 in penalties avoided</div>
                    </div>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="text-gray-300">Time Efficiency Gains: $120,000 (480 hours saved @ $250/hr)</div>
                      <div className="text-gray-300">Professional Liability Protection: UNQUANTIFIED (significant)</div>
                    </div>
                  </div>
                </div>
                
                {/* Competitive Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-white font-semibold mb-3">Competitive Analysis</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Industry Average ROI:</span>
                        <span className="text-white">890%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Our Performance:</span>
                        <span className="text-green-400 font-bold">2,458%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Client Satisfaction:</span>
                        <span className="text-white">96% (vs 87% avg)</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-3">Strategic Business Value</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Client Retention:</span>
                        <span className="text-white">98% (vs 89% avg)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Premium Pricing:</span>
                        <span className="text-white">23% above market</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Referral Generation:</span>
                        <span className="text-white">12 new clients</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button size="sm" className="bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30">
                    Executive ROI Report
                  </Button>
                  <Button size="sm" className="bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30">
                    Board Presentation
                  </Button>
                  <Button size="sm" className="bg-purple-500/20 border-purple-500/30 text-purple-400 hover:bg-purple-500/30">
                    Client Case Studies
                  </Button>
                </div>
              </div>
            )}

            {selectedTab === "team-performance" && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">Nexus Team Strategic Performance</h2>
                </div>
                
                {/* Team Composition */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-white font-semibold mb-4">Team Composition & Utilization</h3>
                    <div className="space-y-4">
                      <div className="bg-black/20 rounded-xl p-4">
                        <div className="text-white font-semibold mb-2">Tax Managers: 2 (Capacity: 87% utilized)</div>
                        <div className="space-y-2 text-sm text-gray-300">
                          <div>├─ Jane Doe: 24 clients, 96% satisfaction, $127K prevented</div>
                          <div>└─ Robert Kim: 23 clients, 93% satisfaction, $89K prevented</div>
                        </div>
                      </div>
                      <div className="bg-black/20 rounded-xl p-4">
                        <div className="text-white font-semibold mb-2">Staff Accountants: 3 (Capacity: 92% utilized)</div>
                        <div className="space-y-1 text-sm text-gray-300">
                          <div>Quality Score: 94% | Response Time: 18 min avg</div>
                          <div>Professional Development: 100% nexus certified</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-4">Capacity Planning Analysis</h3>
                    <div className="space-y-4">
                      <div className="bg-black/20 rounded-xl p-4">
                        <div className="text-white font-semibold mb-2">Current Portfolio: 47 clients</div>
                        <div className="text-gray-300 text-sm">Team capacity: ~50 clients</div>
                      </div>
                      <div className="bg-black/20 rounded-xl p-4">
                        <div className="text-white font-semibold mb-2">Growth Trajectory</div>
                        <div className="text-gray-300 text-sm">+12 clients expected in next 6 months</div>
                      </div>
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                        <div className="text-yellow-400 font-semibold text-sm">Capacity Gap</div>
                        <div className="text-gray-300 text-sm">Need 1 additional Tax Manager by Q2 2025</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Specialization Assessment */}
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-4">Specialization Assessment</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                      <div className="text-green-400 font-semibold text-sm">California</div>
                      <div className="text-white text-xs">STRONG</div>
                      <div className="text-gray-300 text-xs">Both qualified</div>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center">
                      <div className="text-yellow-400 font-semibold text-sm">New York</div>
                      <div className="text-white text-xs">ADEQUATE</div>
                      <div className="text-gray-300 text-xs">1 specialist</div>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                      <div className="text-green-400 font-semibold text-sm">Texas</div>
                      <div className="text-white text-xs">STRONG</div>
                      <div className="text-gray-300 text-xs">Current updates</div>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center">
                      <div className="text-yellow-400 font-semibold text-sm">Other States</div>
                      <div className="text-white text-xs">ADEQUATE</div>
                      <div className="text-gray-300 text-xs">General principles</div>
                    </div>
                  </div>
                </div>
                
                {/* Resource Investment Recommendations */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <h4 className="text-white font-semibold mb-3">Resource Investment Recommendations</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-white font-medium mb-2">Immediate Needs</h5>
                      <div className="space-y-2 text-sm text-gray-300">
                        <div>• NY/NJ specialist hiring ($95K investment)</div>
                        <div>• Training Investment: $15K for advanced multi-state course</div>
                        <div>• Technology Upgrade: AI enhancement ($25K) - 30% efficiency gain</div>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-white font-medium mb-2">ROI Projections</h5>
                      <div className="space-y-2 text-sm text-gray-300">
                        <div>• Additional Tax Manager: $280K additional prevention value</div>
                        <div>• Technology Upgrade: $45K annual efficiency savings</div>
                        <div>• Training Investment: $67K improved capability value</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-4">
                    <Button size="sm" className="bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30">
                      Resource Planning
                    </Button>
                    <Button size="sm" className="bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30">
                      Hiring Authorization
                    </Button>
                    <Button size="sm" className="bg-purple-500/20 border-purple-500/30 text-purple-400 hover:bg-purple-500/30">
                      Investment Analysis
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === "liability-management" && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">Professional Liability Strategic Management</h2>
                </div>
                
                {/* Malpractice Protection Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-white font-semibold mb-4">Malpractice Protection Status</h3>
                    <div className="space-y-3">
                      <div className="bg-black/20 rounded-xl p-4">
                        <div className="text-gray-400 text-sm mb-1">Current Coverage</div>
                        <div className="text-white text-lg font-bold">$5,000,000 per claim</div>
                        <div className="text-gray-300 text-sm">$10,000,000 aggregate</div>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                        <div className="text-green-400 font-semibold text-sm">Coverage Adequacy: EXCELLENT</div>
                        <div className="text-gray-300 text-sm">vs $284K current exposure</div>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                        <div className="text-green-400 font-semibold text-sm">Claims History: PERFECT</div>
                        <div className="text-gray-300 text-sm">Zero claims in 10+ years</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-4">Professional Standards Compliance</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Team Documentation Rate</span>
                        <span className="text-green-400 font-semibold">100%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Audit Trail Completeness</span>
                        <span className="text-green-400 font-semibold">98%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Peer Review Compliance</span>
                        <span className="text-green-400 font-semibold">94%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">AICPA Standards</span>
                        <span className="text-green-400 font-semibold">FULL COMPLIANCE</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Quality Assurance Metrics */}
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-4">Quality Assurance Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-black/20 rounded-xl p-4 text-center">
                      <div className="text-white text-2xl font-bold">96%</div>
                      <div className="text-gray-400 text-sm">Decision Quality</div>
                    </div>
                    <div className="bg-black/20 rounded-xl p-4 text-center">
                      <div className="text-white text-2xl font-bold">100%</div>
                      <div className="text-gray-400 text-sm">Regulatory Accuracy</div>
                    </div>
                    <div className="bg-black/20 rounded-xl p-4 text-center">
                      <div className="text-white text-2xl font-bold">96%</div>
                      <div className="text-gray-400 text-sm">Client Satisfaction</div>
                    </div>
                    <div className="bg-black/20 rounded-xl p-4 text-center">
                      <div className="text-white text-2xl font-bold">156h</div>
                      <div className="text-gray-400 text-sm">Professional Dev</div>
                    </div>
                  </div>
                </div>
                
                {/* Legal Preparedness */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <h4 className="text-white font-semibold mb-3">Legal Preparedness Assessment</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="space-y-2 text-sm">
                        <div className="text-gray-300">Court-Ready Documentation: 100% of high-exposure decisions</div>
                        <div className="text-gray-300">Legal Counsel Relationship: ACTIVE (Wilson & Associates)</div>
                      </div>
                    </div>
                    <div>
                      <div className="space-y-2 text-sm">
                        <div className="text-gray-300">Professional Competence: DEMONSTRATED (specialization recognized)</div>
                        <div className="text-gray-300">Regulatory Examination Readiness: EXCELLENT</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-4">
                    <Button size="sm" className="bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30">
                      Insurance Review
                    </Button>
                    <Button size="sm" className="bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30">
                      Legal Strategy Meeting
                    </Button>
                    <Button size="sm" className="bg-purple-500/20 border-purple-500/30 text-purple-400 hover:bg-purple-500/30">
                      Risk Assessment
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === "action-center" && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-1 h-8 bg-cyan-500 rounded-full"></div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">Executive Action & Decision Support</h2>
                </div>
                
                {/* Immediate Partner Decisions */}
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-4">Immediate Partner Decisions (3)</h3>
                  <div className="space-y-4">
                    <div className="bg-black/20 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-semibold">Resource Allocation Decision</h4>
                        <span className="text-blue-400 text-sm">Dec 15 deadline</span>
                      </div>
                      <div className="text-gray-300 text-sm mb-2">Question: Authorize hiring of additional Tax Manager?</div>
                      <div className="text-gray-300 text-sm mb-2">Business Case: $95K investment → $280K prevention value</div>
                      <div className="text-gray-300 text-sm">Impact: Reduces team utilization risk, enables growth</div>
                    </div>
                    
                    <div className="bg-black/20 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-semibold">Technology Investment Decision</h4>
                        <span className="text-green-400 text-sm">6-month payback</span>
                      </div>
                      <div className="text-gray-300 text-sm mb-2">Question: Approve AI processing upgrade ($25K)?</div>
                      <div className="text-gray-300 text-sm mb-2">Benefit: 30% efficiency gain + higher accuracy rates</div>
                      <div className="text-gray-300 text-sm">Impact: Maintains competitive advantage in processing</div>
                    </div>
                    
                    <div className="bg-black/20 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-semibold">Client Risk Threshold Decision</h4>
                        <span className="text-yellow-400 text-sm">Insurance review needed</span>
                      </div>
                      <div className="text-gray-300 text-sm mb-2">Question: Increase firm exposure limit to $500K?</div>
                      <div className="text-gray-300 text-sm mb-2">Current: $284K exposure (57% of proposed limit)</div>
                      <div className="text-gray-300 text-sm">Benefit: Accept higher-value clients, increase revenue</div>
                    </div>
                  </div>
                </div>
                
                {/* Strategic Planning Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-white font-semibold mb-4">Strategic Planning Items (5)</h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div>• Annual fee structure review (15% increase recommended)</div>
                      <div>• Professional development budget (Q1 2025 planning)</div>
                      <div>• Malpractice insurance renewal (March 2025 deadline)</div>
                      <div>• Geographic expansion feasibility (NY office consideration)</div>
                      <div>• Partnership opportunities (referral network development)</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-4">Performance Review Items (2)</h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div>• Tax Manager performance reviews (annual cycle)</div>
                      <div>• Platform ROI assessment for board presentation</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <Button size="sm" className="bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30">
                    Decision Analysis
                  </Button>
                  <Button size="sm" className="bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30">
                    Business Cases
                  </Button>
                  <Button size="sm" className="bg-purple-500/20 border-purple-500/30 text-purple-400 hover:bg-purple-500/30">
                    Strategic Planning
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}