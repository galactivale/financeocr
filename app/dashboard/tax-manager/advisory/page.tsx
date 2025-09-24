"use client";
import React, { useState } from "react";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  Button, 
  Chip, 
  Input,
  Textarea,
  Tabs,
  Tab,
  Progress
} from "@nextui-org/react";

// Data structures
interface Consultation {
  id: string;
  client: string;
  topic: string;
  date: string;
  time: string;
  duration: string;
  exposure: string;
  prepStatus: 'complete' | 'pending' | 'in-progress';
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface AdvisoryDocument {
  id: string;
  type: string;
  client: string;
  issue: string;
  urgency: string;
  status: 'draft' | 'sent' | 'delivered';
  date: string;
}

interface Communication {
  id: string;
  client: string;
  type: string;
  date: string;
  status: 'sent' | 'delivered' | 'read';
  subject: string;
}

// Sample data
const upcomingConsultations: Consultation[] = [
  {
    id: "1",
    client: "TechCorp SaaS",
    topic: "CA Registration Decision",
    date: "Today",
    time: "2:00 PM",
    duration: "45 min",
    exposure: "$45K",
    prepStatus: "complete",
    status: "scheduled"
  },
  {
    id: "2",
    client: "RetailChain LLC",
    topic: "NY Threshold Strategy",
    date: "Today",
    time: "4:00 PM",
    duration: "30 min",
    exposure: "$38K",
    prepStatus: "pending",
    status: "scheduled"
  },
  {
    id: "3",
    client: "ManufacturingCo",
    topic: "Multi-state compliance review",
    date: "Dec 3",
    time: "10:00 AM",
    duration: "60 min",
    exposure: "$67K",
    prepStatus: "in-progress",
    status: "scheduled"
  },
  {
    id: "4",
    client: "StartupInc",
    topic: "Proactive planning consultation",
    date: "Dec 5",
    time: "3:00 PM",
    duration: "45 min",
    exposure: "$23K",
    prepStatus: "pending",
    status: "scheduled"
  },
  {
    id: "5",
    client: "ServicesCorp",
    topic: "Voluntary disclosure discussion",
    date: "Dec 6",
    time: "11:00 AM",
    duration: "30 min",
    exposure: "$52K",
    prepStatus: "complete",
    status: "scheduled"
  }
];

const completedConsultations = [
  {
    id: "1",
    client: "TechCorp",
    topic: "CA nexus advisory",
    date: "Nov 28",
    duration: "45 min",
    outcome: "Registration recommended",
    documentation: "Complete",
    clientResponse: "Approved"
  },
  {
    id: "2",
    client: "RetailChain",
    topic: "NY threshold planning",
    date: "Nov 25",
    duration: "30 min",
    outcome: "Monitoring plan agreed",
    documentation: "Complete",
    clientResponse: "Next review: Dec 15"
  }
];

const advisoryDocuments: AdvisoryDocument[] = [
  {
    id: "1",
    type: "Registration Advisory",
    client: "TechCorp SaaS",
    issue: "CA Nexus Exceeded",
    urgency: "High - 30 day deadline",
    status: "draft",
    date: "Dec 1, 2024"
  },
  {
    id: "2",
    type: "Threshold Approach",
    client: "RetailChain LLC",
    issue: "NY Threshold Monitoring",
    urgency: "Medium - Q4 review",
    status: "sent",
    date: "Nov 28, 2024"
  }
];

const communications: Communication[] = [
  {
    id: "1",
    client: "TechCorp SaaS",
    type: "Threshold Alert",
    date: "Nov 25",
    status: "delivered",
    subject: "Initial threshold alert sent"
  },
  {
    id: "2",
    client: "TechCorp SaaS",
    type: "Consultation",
    date: "Nov 28",
    status: "delivered",
    subject: "Consultation scheduled (confirmed)"
  },
  {
    id: "3",
    client: "RetailChain LLC",
    type: "Notification",
    date: "Nov 20",
    status: "read",
    subject: "Approaching threshold notification"
  }
];

const talkingPoints = {
  scenario: "Threshold Exceeded - Registration Required",
  opening: "Based on our analysis of your Q4 sales data, your company has exceeded California's economic nexus threshold of $500,000 in annual sales. This creates a legal obligation to register for California sales tax within 30 days.",
  keyPoints: [
    {
      title: "Legal Requirement",
      content: "California Revenue & Taxation Code Section 23101 requires out-of-state sellers to register when they exceed $500,000 in sales to California customers in a calendar year."
    },
    {
      title: "Timeline & Urgency",
      content: "Registration must be completed within 30 days of crossing the threshold to avoid penalty exposure. Based on your sales pattern, this deadline is December 15, 2024."
    },
    {
      title: "Business Impact",
      content: "Once registered, you'll need to collect sales tax on all California sales going forward. This affects your pricing, invoicing, and accounting processes."
    },
    {
      title: "Cost-Benefit Analysis",
      content: "The cost of compliance is significantly less than penalty exposure. Registration delays can result in $5,000-$15,000 penalties plus ongoing interest charges."
    },
    {
      title: "Next Steps",
      content: "I recommend we proceed with immediate registration and explore voluntary disclosure for any past exposure. We can handle the registration process and ongoing compliance."
    }
  ]
};

const clientQuestions = [
  "How did we exceed the threshold?",
  "Can we wait until next year to register?",
  "What are the penalties if we delay?",
  "How much will compliance cost us?",
  "Will this affect other states?"
];

export default function TaxManagerAdvisory() {
  const [selectedClient, setSelectedClient] = useState('TechCorp SaaS');
  const [selectedDocumentType, setSelectedDocumentType] = useState('Registration Advisory');
  const [selectedIssue, setSelectedIssue] = useState('CA Nexus Exceeded');
  const [selectedUrgency, setSelectedUrgency] = useState('High - 30 day deadline');
  const [documentComponents, setDocumentComponents] = useState({
    executiveSummary: true,
    regulatoryAnalysis: true,
    financialImpact: true,
    actionPlan: true,
    professionalOpinion: true,
    nextSteps: true
  });
  const [deliveryFormat, setDeliveryFormat] = useState('Professional Letter');

  const getPrepStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'success';
      case 'pending': return 'warning';
      case 'in-progress': return 'primary';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'primary';
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      case 'sent': return 'primary';
      case 'delivered': return 'success';
      case 'read': return 'success';
      case 'draft': return 'warning';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-6 relative">
        <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
          
          {/* Main Content */}
          <div className="mt-6 gap-6 flex flex-col w-full">
            {/* Advisory Dashboard Header */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-1 h-8 bg-green-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Client Advisory Services</h2>
              </div>
              
              {/* Minimal KPI Stats */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-white font-semibold text-sm tracking-tight">Jane Doe, Tax Manager CPA</h3>
                      <p className="text-gray-400 text-xs font-medium">Professional Client Consultation Hub</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs font-medium">Active</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">5</div>
                      <div className="text-gray-400 text-xs font-medium">Active Consultations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-500">3</div>
                      <div className="text-gray-400 text-xs font-medium">Scheduled Calls</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-500">8</div>
                      <div className="text-gray-400 text-xs font-medium">Pending Advisories</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button 
                      color="primary" 
                      variant="solid"
                      className="bg-green-500 text-white shadow-lg shadow-green-500/25 hover:bg-green-600 transition-all duration-200"
                    >
                      Schedule Consultation
                    </Button>
                    <Button 
                      color="default" 
                      variant="bordered"
                      className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                    >
                      Generate Advisory
                    </Button>
                    <Button 
                      color="default" 
                      variant="bordered"
                      className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                    >
                      Talking Points
                    </Button>
                    <Button 
                      color="default" 
                      variant="bordered"
                      className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                    >
                      Templates
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Advisory Functions */}
            <Tabs aria-label="Advisory Functions" className="w-full">
              <Tab key="consultations" title="Consultation Scheduler">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mt-4">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    <h4 className="text-lg font-semibold text-white">Consultation Management</h4>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Upcoming Consultations */}
                    <div>
                      <h5 className="font-semibold text-white mb-4">UPCOMING CONSULTATIONS</h5>
                      
                      {/* Today's Consultations */}
                      <div className="mb-6">
                        <h6 className="text-sm font-medium text-gray-300 mb-3">TODAY</h6>
                        <div className="space-y-3">
                          {upcomingConsultations.filter(c => c.date === 'Today').map((consultation) => (
                            <div key={consultation.id} className="bg-white/5 rounded-lg border border-white/10 p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <span className="text-white font-medium">{consultation.time}</span>
                                    <span className="text-white font-semibold">{consultation.client}</span>
                                    <span className="text-gray-300">-</span>
                                    <span className="text-gray-300">{consultation.topic}</span>
                                  </div>
                                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                                    <span>Exposure: {consultation.exposure}</span>
                                    <span>Duration: {consultation.duration}</span>
                                    <span>Prep: 
                                      <Chip
                                        size="sm"
                                        color={getPrepStatusColor(consultation.prepStatus)}
                                        variant="flat"
                                        className="ml-1"
                                      >
                                        {consultation.prepStatus}
                                      </Chip>
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {consultation.prepStatus === 'complete' ? (
                                    <>
                                      <Button size="sm" color="primary" variant="solid" className="bg-blue-500 text-white">
                                        Join Call
                                      </Button>
                                      <Button size="sm" color="default" variant="bordered" className="bg-white/10 text-white border-white/20">
                                        Review Brief
                                      </Button>
                                      <Button size="sm" color="default" variant="bordered" className="bg-white/10 text-white border-white/20">
                                        Advisory Package
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Button size="sm" color="warning" variant="solid" className="bg-orange-500 text-white">
                                        Prepare Brief
                                      </Button>
                                      <Button size="sm" color="default" variant="bordered" className="bg-white/10 text-white border-white/20">
                                        Generate Talking Points
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* This Week's Consultations */}
                      <div>
                        <h6 className="text-sm font-medium text-gray-300 mb-3">THIS WEEK</h6>
                        <div className="space-y-2">
                          {upcomingConsultations.filter(c => c.date !== 'Today').map((consultation) => (
                            <div key={consultation.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                              <div className="flex items-center space-x-3">
                                <span className="text-white font-medium">{consultation.date}</span>
                                <span className="text-white">{consultation.client}</span>
                                <span className="text-gray-300">-</span>
                                <span className="text-gray-300">{consultation.topic}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Chip
                                  size="sm"
                                  color={getPrepStatusColor(consultation.prepStatus)}
                                  variant="flat"
                                >
                                  {consultation.prepStatus}
                                </Chip>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-white/10">
                      <Button 
                        color="primary" 
                        variant="solid"
                        className="bg-green-500 text-white shadow-lg shadow-green-500/25 hover:bg-green-600 transition-all duration-200"
                      >
                        Schedule New
                      </Button>
                      <Button 
                        color="default" 
                        variant="bordered"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                      >
                        Reschedule
                      </Button>
                      <Button 
                        color="default" 
                        variant="bordered"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                      >
                        Bulk Notifications
                      </Button>
                    </div>
                  </div>
                </div>
              </Tab>

              <Tab key="preparation" title="Advisory Preparation">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mt-4">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                    <h4 className="text-lg font-semibold text-white">Consultation Brief - {selectedClient}</h4>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Client Situation Summary */}
                    <div>
                      <h5 className="font-semibold text-white mb-3">CLIENT SITUATION SUMMARY</h5>
                      <div className="bg-white/5 rounded-lg border border-white/10 p-4 space-y-2 text-sm text-gray-300">
                        <div><span className="font-medium text-white">Issue:</span> California economic nexus threshold exceeded</div>
                        <div><span className="font-medium text-white">Revenue:</span> $525,000 (105% of $500,000 threshold)</div>
                        <div><span className="font-medium text-white">Timeline:</span> Crossed threshold in Q4 2024</div>
                        <div><span className="font-medium text-white">Urgency:</span> Registration required within 30 days</div>
                        <div><span className="font-medium text-white">Business Impact:</span> Must begin collecting CA sales tax</div>
                      </div>
                    </div>

                    {/* Regulatory Context */}
                    <div>
                      <h5 className="font-semibold text-white mb-3">REGULATORY CONTEXT</h5>
                      <div className="bg-white/5 rounded-lg border border-white/10 p-4 space-y-2 text-sm text-gray-300">
                        <div><span className="font-medium text-white">Statute:</span> California Revenue & Taxation Code § 23101</div>
                        <div><span className="font-medium text-white">Effective Date:</span> April 1, 2019</div>
                        <div><span className="font-medium text-white">Recent Changes:</span> AB 234 marketplace clarifications</div>
                        <div><span className="font-medium text-white">Penalties:</span> $5K-$15K registration delay + interest</div>
                        <div><span className="font-medium text-white">Professional Risk:</span> Malpractice exposure if not addressed</div>
                      </div>
                    </div>

                    {/* Talking Points Prepared */}
                    <div>
                      <h5 className="font-semibold text-white mb-3">TALKING POINTS PREPARED</h5>
                      <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                        <div className="space-y-2 text-sm text-gray-300">
                          <div>1. Threshold Analysis & Legal Requirement</div>
                          <div>2. Registration Process & Timeline</div>
                          <div>3. Tax Collection Implementation</div>
                          <div>4. Voluntary Disclosure Benefits</div>
                          <div>5. Ongoing Compliance Requirements</div>
                        </div>
                      </div>
                    </div>

                    {/* Client Questions Anticipated */}
                    <div>
                      <h5 className="font-semibold text-white mb-3">CLIENT QUESTIONS ANTICIPATED</h5>
                      <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                        <div className="space-y-2 text-sm text-gray-300">
                          {clientQuestions.map((question, index) => (
                            <div key={index}>• "{question}"</div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-white/10">
                      <Button 
                        color="primary" 
                        variant="solid"
                        className="bg-blue-500 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-600 transition-all duration-200"
                      >
                        Edit Brief
                      </Button>
                      <Button 
                        color="default" 
                        variant="bordered"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                      >
                        Generate Advisory Letter
                      </Button>
                      <Button 
                        color="default" 
                        variant="bordered"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                      >
                        Print Package
                      </Button>
                    </div>
                  </div>
                </div>
              </Tab>

              <Tab key="talking-points" title="Talking Points Library">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mt-4">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                    <h4 className="text-lg font-semibold text-white">Professional Talking Points Library</h4>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Scenario */}
                    <div>
                      <h5 className="font-semibold text-white mb-3">SCENARIO: {talkingPoints.scenario}</h5>
                    </div>

                    {/* Opening Statement */}
                    <div>
                      <h5 className="font-semibold text-white mb-3">OPENING STATEMENT</h5>
                      <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                        <p className="text-sm text-gray-300 italic">"{talkingPoints.opening}"</p>
                      </div>
                    </div>

                    {/* Key Explanation Points */}
                    <div>
                      <h5 className="font-semibold text-white mb-3">KEY EXPLANATION POINTS</h5>
                      <div className="space-y-4">
                        {talkingPoints.keyPoints.map((point, index) => (
                          <div key={index} className="bg-white/5 rounded-lg border border-white/10 p-4">
                            <h6 className="font-medium text-white mb-2">{point.title}:</h6>
                            <p className="text-sm text-gray-300 italic">"{point.content}"</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-white/10">
                      <Button 
                        color="primary" 
                        variant="solid"
                        className="bg-orange-500 text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600 transition-all duration-200"
                      >
                        Customize
                      </Button>
                      <Button 
                        color="default" 
                        variant="bordered"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                      >
                        Add to Presentation
                      </Button>
                      <Button 
                        color="default" 
                        variant="bordered"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                      >
                        Save as Template
                      </Button>
                    </div>
                  </div>
                </div>
              </Tab>

              <Tab key="document-generator" title="Advisory Generator">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mt-4">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-1 h-6 bg-cyan-500 rounded-full"></div>
                    <h4 className="text-lg font-semibold text-white">Advisory Document Generator</h4>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Document Type */}
                    <div>
                      <h5 className="font-semibold text-white mb-3">DOCUMENT TYPE</h5>
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          color={selectedDocumentType === 'Registration Advisory' ? 'primary' : 'default'}
                          variant={selectedDocumentType === 'Registration Advisory' ? 'solid' : 'bordered'}
                          onPress={() => setSelectedDocumentType('Registration Advisory')}
                          className={selectedDocumentType === 'Registration Advisory' 
                            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25" 
                            : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                          }
                        >
                          Registration Advisory
                        </Button>
                        <Button 
                          size="sm"
                          color={selectedDocumentType === 'Threshold Approach' ? 'primary' : 'default'}
                          variant={selectedDocumentType === 'Threshold Approach' ? 'solid' : 'bordered'}
                          onPress={() => setSelectedDocumentType('Threshold Approach')}
                          className={selectedDocumentType === 'Threshold Approach' 
                            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25" 
                            : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                          }
                        >
                          Threshold Approach
                        </Button>
                      </div>
                    </div>

                    {/* Client & Situation */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-white mb-2 block">Client</label>
                        <Input
                          placeholder="TechCorp SaaS"
                          value={selectedClient}
                          onValueChange={setSelectedClient}
                          className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-white mb-2 block">Issue</label>
                        <Input
                          placeholder="CA Nexus Exceeded"
                          value={selectedIssue}
                          onValueChange={setSelectedIssue}
                          className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-white mb-2 block">Urgency</label>
                      <Input
                        placeholder="High - 30 day deadline"
                        value={selectedUrgency}
                        onValueChange={setSelectedUrgency}
                        className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                      />
                    </div>

                    {/* Document Components */}
                    <div>
                      <h5 className="font-semibold text-white mb-3">DOCUMENT COMPONENTS</h5>
                      <div className="space-y-2">
                        {Object.entries(documentComponents).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => setDocumentComponents(prev => ({
                                ...prev,
                                [key]: e.target.checked
                              }))}
                              className="rounded bg-white/5 border-white/10 text-blue-500"
                            />
                            <span className="text-sm text-gray-300">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Format */}
                    <div>
                      <h5 className="font-semibold text-white mb-3">DELIVERY FORMAT</h5>
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          color={deliveryFormat === 'Professional Letter' ? 'primary' : 'default'}
                          variant={deliveryFormat === 'Professional Letter' ? 'solid' : 'bordered'}
                          onPress={() => setDeliveryFormat('Professional Letter')}
                          className={deliveryFormat === 'Professional Letter' 
                            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25" 
                            : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                          }
                        >
                          Professional Letter
                        </Button>
                        <Button 
                          size="sm"
                          color={deliveryFormat === 'Executive Memo' ? 'primary' : 'default'}
                          variant={deliveryFormat === 'Executive Memo' ? 'solid' : 'bordered'}
                          onPress={() => setDeliveryFormat('Executive Memo')}
                          className={deliveryFormat === 'Executive Memo' 
                            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25" 
                            : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                          }
                        >
                          Executive Memo
                        </Button>
                        <Button 
                          size="sm"
                          color={deliveryFormat === 'Presentation' ? 'primary' : 'default'}
                          variant={deliveryFormat === 'Presentation' ? 'solid' : 'bordered'}
                          onPress={() => setDeliveryFormat('Presentation')}
                          className={deliveryFormat === 'Presentation' 
                            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25" 
                            : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                          }
                        >
                          Presentation
                        </Button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-white/10">
                      <Button 
                        color="primary" 
                        variant="solid"
                        className="bg-cyan-500 text-white shadow-lg shadow-cyan-500/25 hover:bg-cyan-600 transition-all duration-200"
                      >
                        Generate Advisory
                      </Button>
                      <Button 
                        color="default" 
                        variant="bordered"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                      >
                        Preview
                      </Button>
                      <Button 
                        color="default" 
                        variant="bordered"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                      >
                        Save Template
                      </Button>
                    </div>
                  </div>
                </div>
              </Tab>

              <Tab key="communications" title="Client Communications">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mt-4">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-1 h-6 bg-yellow-500 rounded-full"></div>
                    <h4 className="text-lg font-semibold text-white">Client Communications Center</h4>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Active Communications */}
                    <div>
                      <h5 className="font-semibold text-white mb-4">ACTIVE COMMUNICATIONS</h5>
                      <div className="space-y-4">
                        <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                          <h6 className="font-medium text-white mb-2">TechCorp SaaS</h6>
                          <div className="space-y-1 text-sm text-gray-300">
                            <div>├─ Nov 25: Initial threshold alert sent</div>
                            <div>├─ Nov 28: Consultation scheduled (confirmed)</div>
                            <div>├─ Today: Advisory call at 2 PM</div>
                            <div>└─ Pending: Registration advisory letter</div>
                          </div>
                        </div>
                        
                        <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                          <h6 className="font-medium text-white mb-2">RetailChain LLC</h6>
                          <div className="space-y-1 text-sm text-gray-300">
                            <div>├─ Nov 20: Approaching threshold notification</div>
                            <div>├─ Nov 26: Q4 projection analysis requested</div>
                            <div>├─ Today: Strategy consultation at 4 PM</div>
                            <div>└─ Pending: Monitoring plan advisory</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Communication Templates */}
                    <div>
                      <h5 className="font-semibold text-white mb-3">COMMUNICATION TEMPLATES</h5>
                      <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                        <div className="space-y-1 text-sm text-gray-300">
                          <div>• Threshold exceeded notification</div>
                          <div>• Registration requirement advisory</div>
                          <div>• Voluntary disclosure recommendation</div>
                          <div>• Compliance implementation guide</div>
                          <div>• Quarterly review summary</div>
                          <div>• Regulatory update notification</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-white/10">
                      <Button 
                        color="primary" 
                        variant="solid"
                        className="bg-yellow-500 text-white shadow-lg shadow-yellow-500/25 hover:bg-yellow-600 transition-all duration-200"
                      >
                        Send Communication
                      </Button>
                      <Button 
                        color="default" 
                        variant="bordered"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                      >
                        Schedule Follow-up
                      </Button>
                      <Button 
                        color="default" 
                        variant="bordered"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                      >
                        Track Delivery
                      </Button>
                    </div>
                  </div>
                </div>
              </Tab>

              <Tab key="documentation" title="Professional Documentation">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mt-4">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-1 h-6 bg-gray-500 rounded-full"></div>
                    <h4 className="text-lg font-semibold text-white">Consultation Documentation & Audit Trail</h4>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Completed Consultations */}
                    <div>
                      <h5 className="font-semibold text-white mb-4">COMPLETED CONSULTATIONS (Last 30 Days)</h5>
                      <div className="space-y-3">
                        {completedConsultations.map((consultation) => (
                          <div key={consultation.id} className="bg-white/5 rounded-lg border border-white/10 p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <span className="text-white font-medium">{consultation.date}</span>
                                  <span className="text-white font-semibold">{consultation.client}</span>
                                  <span className="text-gray-300">-</span>
                                  <span className="text-gray-300">{consultation.topic}</span>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-400">
                                  <span>Duration: {consultation.duration}</span>
                                  <span>Outcome: {consultation.outcome}</span>
                                  <span>Documentation: {consultation.documentation}</span>
                                  <span>Client response: {consultation.clientResponse}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button size="sm" color="default" variant="bordered" className="bg-white/10 text-white border-white/20">
                                  View Notes
                                </Button>
                                <Button size="sm" color="default" variant="bordered" className="bg-white/10 text-white border-white/20">
                                  Advisory Letter
                                </Button>
                                <Button size="sm" color="default" variant="bordered" className="bg-white/10 text-white border-white/20">
                                  Follow-up Status
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Professional Standards Compliance */}
                    <div>
                      <h5 className="font-semibold text-white mb-3">PROFESSIONAL STANDARDS COMPLIANCE</h5>
                      <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                          <div>Consultation Documentation: 100% complete</div>
                          <div>Client Advisory Quality: 96% satisfaction</div>
                          <div>Professional Liability Coverage: All consultations documented</div>
                          <div>Follow-up Completion Rate: 94%</div>
                        </div>
                      </div>
                    </div>

                    {/* Advisory Performance Metrics */}
                    <div>
                      <h5 className="font-semibold text-white mb-3">ADVISORY PERFORMANCE METRICS</h5>
                      <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                          <div>Average consultation time: 32 minutes</div>
                          <div>Client implementation rate: 89%</div>
                          <div>Penalty prevention value: $156,000 this month</div>
                          <div>Professional liability incidents: 0</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-white/10">
                      <Button 
                        color="primary" 
                        variant="solid"
                        className="bg-gray-500 text-white shadow-lg shadow-gray-500/25 hover:bg-gray-600 transition-all duration-200"
                      >
                        Export Documentation
                      </Button>
                      <Button 
                        color="default" 
                        variant="bordered"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                      >
                        Performance Report
                      </Button>
                      <Button 
                        color="default" 
                        variant="bordered"
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200"
                      >
                        Archive Records
                      </Button>
                    </div>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

