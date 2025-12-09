const OpenAI = require('openai');

class DashboardDataGenerator {
  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  // Helper method to call OpenAI API
  async callOpenAI(prompt) {
    const result = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates realistic business client data for CPA firms. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });
    const text = result.choices[0].message.content;
    
    // Parse JSON from response
    try {
      return JSON.parse(text);
    } catch (parseError) {
      // Fallback: try to extract JSON if not directly parseable
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No valid JSON found in response');
    }
  }

  async generateComprehensiveDashboardData(formData) {
    console.log('🚀 Starting comprehensive dashboard data generation...');
    
    try {
      // Generate all data types in parallel for efficiency
      const [
        clientInfo,
        keyMetrics,
        clientStates,
        nexusAlerts,
        nexusActivities,
        alerts,
        tasks,
        analytics,
        systemHealth,
        reports,
        communications
      ] = await Promise.all([
        this.generateClientInfo(formData),
        this.generateKeyMetrics(formData),
        this.generateClientStates(formData),
        this.generateNexusAlerts(formData),
        this.generateNexusActivities(formData),
        this.generateAlerts(formData),
        this.generateTasks(formData),
        this.generateAnalytics(formData),
        this.generateSystemHealth(formData),
        this.generateReports(formData),
        this.generateCommunications(formData)
      ]);

      const comprehensiveData = {
        clientInfo,
        keyMetrics,
        clientStates,
        nexusAlerts,
        nexusActivities,
        alerts,
        tasks,
        analytics,
        systemHealth,
        reports,
        communications,
        generatedAt: new Date().toISOString()
      };

      console.log('✅ Comprehensive dashboard data generation completed');
      return comprehensiveData;

    } catch (error) {
      console.error('❌ Error generating comprehensive dashboard data:', error);
      throw error;
    }
  }

  async generateClientInfo(formData) {
    const prompt = `
    Generate detailed client information for a tax compliance dashboard based on the following form data:
    
    Client Name: ${formData.clientName}
    Priority States: ${formData.priorityStates.join(', ')}
    Pain Points: ${formData.painPoints.join(', ')}
    Multi-State Client Count: ${formData.multiStateClientCount}
    Annual Revenue: ${formData.annualRevenue}
    Industry: ${formData.industry}
    Business Model: ${formData.businessModel}
    Current Challenges: ${formData.currentChallenges}
    
    Generate realistic client information including:
    - Business profile details
    - Industry-specific characteristics
    - Revenue patterns
    - Geographic presence
    - Compliance history
    - Risk factors
    
    Return as a JSON object with realistic business data.
    `;

    try {
      return await this.callOpenAI(prompt);
    } catch (error) {
      console.error('Error parsing client info JSON:', error);
      return this.getFallbackClientInfo(formData);
    }
  }

  async generateKeyMetrics(formData) {
    const prompt = `
    Generate key performance metrics for ${formData.clientName} based on:
    - Annual Revenue: ${formData.annualRevenue}
    - Industry: ${formData.industry}
    - Multi-state operations in: ${formData.priorityStates.join(', ')}
    - Pain Points: ${formData.painPoints.join(', ')}
    
    Include realistic metrics for:
    - Revenue by state
    - Compliance scores
    - Risk assessments
    - Performance indicators
    - Growth metrics
    
    Return as a JSON object with numerical data and percentages.
    `;

    try {
      return await this.callOpenAI(prompt);
    } catch (error) {
      console.error('Error parsing key metrics JSON:', error);
      return this.getFallbackKeyMetrics(formData);
    }
  }

  async generateClientStates(formData) {
    const prompt = `
    Generate client state monitoring data for ${formData.clientName} operating in these states:
    ${formData.priorityStates.join(', ')}
    
    For each state, generate realistic data including:
    - Current revenue amounts
    - Threshold amounts
    - Compliance status
    - Risk levels
    - Registration status
    - Last updated dates
    
    Annual Revenue: ${formData.annualRevenue}
    Industry: ${formData.industry}
    
    Return as a JSON array of state objects with realistic financial and compliance data.
    `;

    try {
      return await this.callOpenAI(prompt);
    } catch (error) {
      console.error('Error parsing client states JSON:', error);
      return this.getFallbackClientStates(formData);
    }
  }

  async generateNexusAlerts(formData) {
    const prompt = `
    Generate nexus alerts for ${formData.clientName} based on:
    - States: ${formData.priorityStates.join(', ')}
    - Pain Points: ${formData.painPoints.join(', ')}
    - Annual Revenue: ${formData.annualRevenue}
    - Industry: ${formData.industry}
    
    Create realistic alerts including:
    - Threshold breaches
    - Registration deadlines
    - Compliance issues
    - Risk assessments
    - Priority levels
    - Current amounts vs thresholds
    
    Return as a JSON array of alert objects with realistic data.
    `;

    try {
      return await this.callOpenAI(prompt);
    } catch (error) {
      console.error('Error parsing nexus alerts JSON:', error);
      return this.getFallbackNexusAlerts(formData);
    }
  }

  async generateNexusActivities(formData) {
    const prompt = `
    Generate nexus activities for ${formData.clientName} including:
    - Recent compliance activities
    - Registration submissions
    - Tax filings
    - Audit responses
    - State communications
    
    Based on states: ${formData.priorityStates.join(', ')}
    Industry: ${formData.industry}
    
    Return as a JSON array of activity objects with realistic timestamps and descriptions.
    `;

    try {
      return await this.callOpenAI(prompt);
    } catch (error) {
      console.error('Error parsing nexus activities JSON:', error);
      return this.getFallbackNexusActivities(formData);
    }
  }

  async generateAlerts(formData) {
    const prompt = `
    Generate general alerts for ${formData.clientName} based on:
    - Pain Points: ${formData.painPoints.join(', ')}
    - Industry: ${formData.industry}
    - Current Challenges: ${formData.currentChallenges}
    
    Include alerts for:
    - Compliance deadlines
    - Risk notifications
    - System issues
    - Regulatory changes
    - Performance warnings
    
    Return as a JSON array of alert objects.
    `;

    try {
      return await this.callOpenAI(prompt);
    } catch (error) {
      console.error('Error parsing alerts JSON:', error);
      return this.getFallbackAlerts(formData);
    }
  }

  async generateTasks(formData) {
    const prompt = `
    Generate tasks for ${formData.clientName} based on:
    - Pain Points: ${formData.painPoints.join(', ')}
    - Current Challenges: ${formData.currentChallenges}
    - States: ${formData.priorityStates.join(', ')}
    
    Include tasks for:
    - Compliance activities
    - Documentation
    - Client communications
    - System maintenance
    - Follow-ups
    
    Return as a JSON array of task objects with realistic priorities and due dates.
    `;

    try {
      return await this.callOpenAI(prompt);
    } catch (error) {
      console.error('Error parsing tasks JSON:', error);
      return this.getFallbackTasks(formData);
    }
  }

  async generateAnalytics(formData) {
    const prompt = `
    Generate analytics data for ${formData.clientName} including:
    - Performance metrics
    - Trend analysis
    - Comparative data
    - Growth indicators
    - Efficiency metrics
    
    Based on:
    - Annual Revenue: ${formData.annualRevenue}
    - Industry: ${formData.industry}
    - Multi-state operations
    
    Return as a JSON object with realistic analytical data.
    `;

    try {
      return await this.callOpenAI(prompt);
    } catch (error) {
      console.error('Error parsing analytics JSON:', error);
      return this.getFallbackAnalytics(formData);
    }
  }

  async generateSystemHealth(formData) {
    const prompt = `
    Generate system health data for ${formData.clientName}'s dashboard including:
    - System performance metrics
    - Data processing status
    - Integration health
    - Security status
    - Uptime statistics
    
    Return as a JSON object with realistic system health indicators.
    `;

    try {
      return await this.callOpenAI(prompt);
    } catch (error) {
      console.error('Error parsing system health JSON:', error);
      return this.getFallbackSystemHealth(formData);
    }
  }

  async generateReports(formData) {
    const prompt = `
    Generate report data for ${formData.clientName} including:
    - Compliance reports
    - Performance summaries
    - Risk assessments
    - Financial reports
    - Audit reports
    
    Based on industry: ${formData.industry} and states: ${formData.priorityStates.join(', ')}
    
    Return as a JSON array of report objects with realistic data.
    `;

    try {
      return await this.callOpenAI(prompt);
    } catch (error) {
      console.error('Error parsing reports JSON:', error);
      return this.getFallbackReports(formData);
    }
  }

  async generateCommunications(formData) {
    const prompt = `
    Generate communication data for ${formData.clientName} including:
    - Client communications
    - State correspondence
    - Internal memos
    - Alert notifications
    - Follow-up messages
    
    Based on pain points: ${formData.painPoints.join(', ')}
    
    Return as a JSON array of communication objects with realistic content and timestamps.
    `;

    try {
      return await this.callOpenAI(prompt);
    } catch (error) {
      console.error('Error parsing communications JSON:', error);
      return this.getFallbackCommunications(formData);
    }
  }

  // Fallback methods for when AI generation fails
  getFallbackClientInfo(formData) {
    return {
      name: formData.clientName,
      industry: formData.industry,
      annualRevenue: formData.annualRevenue,
      businessModel: formData.businessModel,
      states: formData.priorityStates,
      riskLevel: 'medium',
      complianceScore: 85
    };
  }

  getFallbackKeyMetrics(formData) {
    return {
      totalRevenue: formData.annualRevenue,
      complianceScore: 85,
      riskScore: 15,
      statesMonitored: formData.priorityStates.length,
      alertsActive: 3,
      tasksCompleted: 12
    };
  }

  getFallbackClientStates(formData) {
    return formData.priorityStates.map(state => ({
      stateCode: state,
      stateName: this.getStateName(state),
      currentAmount: Math.floor(Math.random() * 100000) + 50000,
      thresholdAmount: 100000,
      status: 'monitoring',
      riskLevel: 'medium'
    }));
  }

  getFallbackNexusAlerts(formData) {
    return [
      {
        id: 'alert-1',
        stateCode: formData.priorityStates[0],
        title: 'Threshold Approaching',
        priority: 'medium',
        currentAmount: 85000,
        thresholdAmount: 100000,
        status: 'open'
      }
    ];
  }

  getFallbackNexusActivities(formData) {
    return [
      {
        id: 'activity-1',
        stateCode: formData.priorityStates[0],
        activityType: 'registration',
        title: 'State Registration Submitted',
        status: 'completed',
        createdAt: new Date().toISOString()
      }
    ];
  }

  getFallbackAlerts(formData) {
    return [
      {
        id: 'alert-1',
        title: 'Compliance Review Due',
        priority: 'high',
        status: 'new',
        category: 'compliance'
      }
    ];
  }

  getFallbackTasks(formData) {
    return [
      {
        id: 'task-1',
        title: 'Review State Compliance',
        priority: 'high',
        status: 'pending',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  }

  getFallbackAnalytics(formData) {
    return {
      totalClients: 1,
      totalRevenue: formData.annualRevenue,
      complianceRate: 85,
      riskScore: 15
    };
  }

  getFallbackSystemHealth(formData) {
    return {
      status: 'healthy',
      uptime: 99.9,
      performance: 'good',
      lastCheck: new Date().toISOString()
    };
  }

  getFallbackReports(formData) {
    return [
      {
        id: 'report-1',
        title: 'Monthly Compliance Report',
        type: 'compliance',
        status: 'completed',
        generatedAt: new Date().toISOString()
      }
    ];
  }

  getFallbackCommunications(formData) {
    return [
      {
        id: 'comm-1',
        type: 'email',
        subject: 'Compliance Update',
        status: 'sent',
        sentDate: new Date().toISOString()
      }
    ];
  }

  getStateName(stateCode) {
    const stateNames = {
      'CA': 'California',
      'NY': 'New York',
      'TX': 'Texas',
      'FL': 'Florida',
      'IL': 'Illinois',
      'PA': 'Pennsylvania',
      'OH': 'Ohio',
      'GA': 'Georgia',
      'NC': 'North Carolina',
      'MI': 'Michigan'
    };
    return stateNames[stateCode] || stateCode;
  }
}

module.exports = DashboardDataGenerator;


