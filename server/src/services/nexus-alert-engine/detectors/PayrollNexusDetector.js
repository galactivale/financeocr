/**
 * Payroll Tax Nexus Detector
 * 
 * Detects payroll tax nexus obligations including:
 * - Employee presence in state
 * - Contractor presence and misclassification risk
 * - State-specific withholding requirements
 * - Unemployment insurance obligations
 */

const { STATE_RULES } = require('../rules/stateRules');

class PayrollNexusDetector {
  constructor(config = {}) {
    this.config = config;
    this.stateRules = STATE_RULES;
  }

  /**
   * Main detection method for payroll tax nexus
   */
  async detect(state, data, config) {
    const alerts = [];
    const stateRule = this.stateRules[state];

    if (!stateRule || !stateRule.payroll) {
      console.log(`[PAYROLL_DETECTOR] No payroll rules found for state: ${state}`);
      return alerts;
    }

    // Extract workforce data
    const workforce = this.extractWorkforce(data, state);
    const employees = workforce.filter(w => w.type === 'employee');
    const contractors = workforce.filter(w => w.type === 'contractor');

    console.log(`[PAYROLL_DETECTOR] ${state} analysis:`, {
      totalWorkforce: workforce.length,
      employees: employees.length,
      contractors: contractors.length
    });

    // Check for employee presence
    if (employees.length >= (stateRule.payroll.employeeThreshold || 1)) {
      alerts.push(this.createEmployeeNexusAlert(state, employees, stateRule));

      // Check withholding requirements
      if (stateRule.payroll.withholdingRequired) {
        alerts.push(this.createWithholdingAlert(state, employees, stateRule));
      }

      // Check unemployment insurance
      if (stateRule.payroll.unemploymentInsurance) {
        alerts.push(this.createUnemploymentInsuranceAlert(state, employees, stateRule));
      }

      // Check state-specific requirements
      if (stateRule.payroll.disabilityInsurance) {
        alerts.push(this.createDisabilityInsuranceAlert(state, employees, stateRule));
      }

      if (stateRule.payroll.paidFamilyLeave) {
        alerts.push(this.createPaidFamilyLeaveAlert(state, employees, stateRule));
      }
    }

    // Check for contractor presence
    if (contractors.length >= (stateRule.payroll.contractorThreshold || 1)) {
      alerts.push(this.createContractorPresenceAlert(state, contractors, stateRule));

      // Check for misclassification risk
      const misclassificationRisk = this.checkContractorMisclassification(contractors);
      if (misclassificationRisk.hasRisk) {
        alerts.push(this.createMisclassificationAlert(state, misclassificationRisk, stateRule));
      }
    }

    // Check for remote worker considerations
    const remoteWorkers = this.detectRemoteWorkers(data, state);
    if (remoteWorkers.length > 0) {
      alerts.push(this.createRemoteWorkerAlert(state, remoteWorkers, stateRule));
    }

    return alerts;
  }

  /**
   * Extract workforce data from rows
   */
  extractWorkforce(data, state) {
    const workforce = [];
    
    for (const row of data) {
      if (!this.matchesState(row, state)) continue;
      
      // Check for employee indicators
      if (row.employee_name || row.employee || row.staff || row.worker) {
        workforce.push({
          type: 'employee',
          name: row.employee_name || row.employee || row.staff || row.worker,
          state: state,
          role: row.role || row.title || row.position || row.job_title,
          startDate: row.start_date || row.hire_date,
          endDate: row.end_date || row.termination_date,
          compensation: this.extractCompensation(row),
          workLocation: row.work_location || row.office || state,
          isRemote: this.isRemoteWorker(row)
        });
      }
      
      // Check for contractor indicators
      if (row.contractor_name || row.contractor || row.vendor || row.consultant) {
        workforce.push({
          type: 'contractor',
          name: row.contractor_name || row.contractor || row.vendor || row.consultant,
          state: state,
          role: row.role || row.title || row.service_type,
          startDate: row.start_date || row.contract_start,
          endDate: row.end_date || row.contract_end,
          compensation: this.extractCompensation(row),
          contractType: row.contract_type || 'unknown',
          isFullTime: this.isFullTimeContractor(row)
        });
      }
    }
    
    return workforce;
  }

  /**
   * Check if row matches state
   */
  matchesState(row, state) {
    const rowState = String(
      row.state || row.work_state || row.employee_state || row.location || ''
    ).toUpperCase().trim();
    return rowState === state || rowState === this.stateRules[state]?.name?.toUpperCase();
  }

  /**
   * Extract compensation from row
   */
  extractCompensation(row) {
    const compFields = ['compensation', 'salary', 'wages', 'pay', 'annual_salary', 'hourly_rate'];
    
    for (const field of compFields) {
      if (row[field] !== undefined) {
        const value = String(row[field]).replace(/[$,]/g, '');
        const parsed = parseFloat(value);
        if (!isNaN(parsed)) {
          return parsed;
        }
      }
    }
    
    return null;
  }

  /**
   * Check if worker is remote
   */
  isRemoteWorker(row) {
    const remoteIndicators = ['remote', 'wfh', 'work from home', 'telecommute', 'virtual'];
    const workLocation = String(row.work_location || row.location_type || '').toLowerCase();
    return remoteIndicators.some(ind => workLocation.includes(ind));
  }

  /**
   * Check if contractor appears to be full-time
   */
  isFullTimeContractor(row) {
    const role = String(row.role || row.title || '').toLowerCase();
    const hours = row.hours_per_week || row.weekly_hours;
    
    if (hours && hours >= 30) return true;
    if (role.includes('full') || role.includes('ft')) return true;
    
    return false;
  }

  /**
   * Detect remote workers
   */
  detectRemoteWorkers(data, state) {
    const remoteWorkers = [];
    
    for (const row of data) {
      if (this.isRemoteWorker(row) && this.matchesState(row, state)) {
        remoteWorkers.push({
          name: row.employee_name || row.employee || row.name,
          role: row.role || row.title,
          homeState: state,
          companyState: row.company_state || row.employer_state
        });
      }
    }
    
    return remoteWorkers;
  }

  /**
   * Check contractor misclassification risk
   */
  checkContractorMisclassification(contractors) {
    const riskAssessments = contractors.map(contractor => {
      const riskFactors = [];
      
      // Common misclassification indicators
      if (contractor.isFullTime) {
        riskFactors.push({
          factor: 'full_time_role',
          description: 'Contractor works full-time hours',
          weight: 3
        });
      }
      
      if (contractor.compensation && contractor.compensation > 100000) {
        riskFactors.push({
          factor: 'high_compensation',
          description: 'High annual compensation suggests employee relationship',
          weight: 2
        });
      }
      
      const role = String(contractor.role || '').toLowerCase();
      if (role.includes('supervisor') || role.includes('manager') || role.includes('director')) {
        riskFactors.push({
          factor: 'supervisory_role',
          description: 'Supervisory role typically indicates employee status',
          weight: 3
        });
      }
      
      if (role.includes('core') || role.includes('essential') || role.includes('key')) {
        riskFactors.push({
          factor: 'core_business_function',
          description: 'Performing core business functions',
          weight: 2
        });
      }
      
      // Calculate risk score
      const riskScore = riskFactors.reduce((sum, rf) => sum + rf.weight, 0);
      
      return {
        contractor,
        riskFactors,
        riskScore,
        riskLevel: riskScore >= 5 ? 'HIGH' : riskScore >= 3 ? 'MEDIUM' : 'LOW'
      };
    });
    
    const highRiskContractors = riskAssessments.filter(ra => ra.riskLevel === 'HIGH');
    const mediumRiskContractors = riskAssessments.filter(ra => ra.riskLevel === 'MEDIUM');
    
    return {
      hasRisk: highRiskContractors.length > 0 || mediumRiskContractors.length > 0,
      highRiskContractors,
      mediumRiskContractors,
      allAssessments: riskAssessments,
      totalContractors: contractors.length
    };
  }

  /**
   * Create employee nexus alert
   */
  createEmployeeNexusAlert(state, employees, stateRule) {
    const totalCompensation = employees.reduce((sum, e) => sum + (e.compensation || 0), 0);
    
    return {
      id: this.generateAlertId('EMPLOYEE_NEXUS', state),
      type: 'PAYROLL_NEXUS',
      subtype: 'EMPLOYEE_PRESENCE',
      state: state,
      stateName: stateRule.name || state,
      severity: 'HIGH',
      title: `${state} Payroll Tax Nexus - Employee Presence`,
      description: `${employees.length} employee(s) present in ${state} creates payroll tax obligations`,
      facts: {
        employeeCount: employees.length,
        totalCompensation,
        employees: employees.map(e => ({
          name: e.name,
          role: e.role,
          compensation: e.compensation
        })),
        withholdingRequired: stateRule.payroll.withholdingRequired
      },
      recommendation: `Register for payroll tax withholding in ${state}. Ensure proper state tax withholding from employee wages.`,
      judgmentRequired: false,
      requiresAction: true,
      priority: 'HIGH',
      createdDate: new Date().toISOString()
    };
  }

  /**
   * Create withholding alert
   */
  createWithholdingAlert(state, employees, stateRule) {
    return {
      id: this.generateAlertId('WITHHOLDING', state),
      type: 'PAYROLL_NEXUS',
      subtype: 'WITHHOLDING_REQUIRED',
      state: state,
      stateName: stateRule.name || state,
      severity: 'HIGH',
      title: `${state} Income Tax Withholding Required`,
      description: `State income tax withholding required for ${employees.length} employee(s) in ${state}`,
      facts: {
        employeeCount: employees.length,
        withholdingRequired: true
      },
      recommendation: `Register for ${state} income tax withholding. Set up proper payroll withholding procedures.`,
      judgmentRequired: false,
      requiresAction: true,
      priority: 'HIGH',
      createdDate: new Date().toISOString()
    };
  }

  /**
   * Create unemployment insurance alert
   */
  createUnemploymentInsuranceAlert(state, employees, stateRule) {
    return {
      id: this.generateAlertId('UNEMPLOYMENT', state),
      type: 'PAYROLL_NEXUS',
      subtype: 'UNEMPLOYMENT_INSURANCE',
      state: state,
      stateName: stateRule.name || state,
      severity: 'MEDIUM',
      title: `${state} Unemployment Insurance Required`,
      description: `State unemployment insurance required for ${employees.length} employee(s) in ${state}`,
      facts: {
        employeeCount: employees.length,
        unemploymentInsurance: true
      },
      recommendation: `Register for ${state} unemployment insurance (SUTA). File quarterly wage reports.`,
      judgmentRequired: false,
      requiresAction: true,
      priority: 'MEDIUM',
      createdDate: new Date().toISOString()
    };
  }

  /**
   * Create disability insurance alert
   */
  createDisabilityInsuranceAlert(state, employees, stateRule) {
    return {
      id: this.generateAlertId('DISABILITY', state),
      type: 'PAYROLL_NEXUS',
      subtype: 'DISABILITY_INSURANCE',
      state: state,
      stateName: stateRule.name || state,
      severity: 'MEDIUM',
      title: `${state} Disability Insurance Required`,
      description: `State disability insurance (SDI) required for employees in ${state}`,
      facts: {
        employeeCount: employees.length,
        disabilityInsurance: true
      },
      recommendation: `Register for ${state} State Disability Insurance program. Ensure proper employee contributions.`,
      judgmentRequired: false,
      requiresAction: true,
      priority: 'MEDIUM',
      createdDate: new Date().toISOString()
    };
  }

  /**
   * Create paid family leave alert
   */
  createPaidFamilyLeaveAlert(state, employees, stateRule) {
    return {
      id: this.generateAlertId('PAID_FAMILY_LEAVE', state),
      type: 'PAYROLL_NEXUS',
      subtype: 'PAID_FAMILY_LEAVE',
      state: state,
      stateName: stateRule.name || state,
      severity: 'MEDIUM',
      title: `${state} Paid Family Leave Program`,
      description: `Paid Family Leave program applies to employees in ${state}`,
      facts: {
        employeeCount: employees.length,
        paidFamilyLeave: true
      },
      recommendation: `Register for ${state} Paid Family Leave program. Ensure proper employee and employer contributions.`,
      judgmentRequired: false,
      requiresAction: true,
      priority: 'MEDIUM',
      createdDate: new Date().toISOString()
    };
  }

  /**
   * Create contractor presence alert
   */
  createContractorPresenceAlert(state, contractors, stateRule) {
    const totalPayments = contractors.reduce((sum, c) => sum + (c.compensation || 0), 0);
    
    return {
      id: this.generateAlertId('CONTRACTOR_PRESENCE', state),
      type: 'PAYROLL_NEXUS',
      subtype: 'CONTRACTOR_PRESENCE',
      state: state,
      stateName: stateRule.name || state,
      severity: 'INFO',
      title: `${state} Contractor Presence Noted`,
      description: `${contractors.length} contractor(s) performing work in ${state}`,
      facts: {
        contractorCount: contractors.length,
        totalPayments,
        contractors: contractors.map(c => ({
          name: c.name,
          role: c.role,
          compensation: c.compensation
        }))
      },
      recommendation: `Review contractor relationships in ${state}. Ensure proper 1099 reporting and classification.`,
      judgmentRequired: false,
      requiresAction: false,
      priority: 'LOW',
      createdDate: new Date().toISOString()
    };
  }

  /**
   * Create misclassification alert
   */
  createMisclassificationAlert(state, misclassificationRisk, stateRule) {
    const highRisk = misclassificationRisk.highRiskContractors;
    
    return {
      id: this.generateAlertId('MISCLASSIFICATION', state),
      type: 'PAYROLL_NEXUS',
      subtype: 'MISCLASSIFICATION_RISK',
      state: state,
      stateName: stateRule.name || state,
      severity: 'HIGH',
      title: `${state} Contractor Misclassification Risk`,
      description: `${highRisk.length} contractor(s) in ${state} show potential misclassification indicators`,
      facts: {
        highRiskCount: highRisk.length,
        mediumRiskCount: misclassificationRisk.mediumRiskContractors.length,
        totalContractors: misclassificationRisk.totalContractors,
        highRiskContractors: highRisk.map(hr => ({
          name: hr.contractor.name,
          role: hr.contractor.role,
          riskFactors: hr.riskFactors,
          riskScore: hr.riskScore
        }))
      },
      recommendation: `Review contractor classifications in ${state}. Consider ABC test or common law factors. Consult with employment counsel.`,
      judgmentRequired: true,
      requiresAction: true,
      priority: 'HIGH',
      createdDate: new Date().toISOString()
    };
  }

  /**
   * Create remote worker alert
   */
  createRemoteWorkerAlert(state, remoteWorkers, stateRule) {
    return {
      id: this.generateAlertId('REMOTE_WORKER', state),
      type: 'PAYROLL_NEXUS',
      subtype: 'REMOTE_WORKER',
      state: state,
      stateName: stateRule.name || state,
      severity: 'MEDIUM',
      title: `${state} Remote Worker Considerations`,
      description: `${remoteWorkers.length} remote worker(s) located in ${state} may create nexus obligations`,
      facts: {
        remoteWorkerCount: remoteWorkers.length,
        remoteWorkers: remoteWorkers
      },
      recommendation: `Review remote worker tax implications for ${state}. Consider convenience of employer rules and reciprocity agreements.`,
      judgmentRequired: true,
      requiresAction: false,
      priority: 'MEDIUM',
      createdDate: new Date().toISOString()
    };
  }

  /**
   * Generate unique alert ID
   */
  generateAlertId(type, state) {
    return `${type}_${state}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

module.exports = PayrollNexusDetector;







