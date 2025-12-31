/**
 * STATE RULES DATABASE
 * 
 * Comprehensive state-by-state tax nexus rules for all 50 states + DC
 * 
 * Structure per state:
 * - sales: Sales tax nexus thresholds and triggers
 * - income: Income tax thresholds and PL 86-272 applicability
 * - payroll: Payroll tax requirements
 * - franchise: Franchise/gross receipts tax requirements
 */

const STATE_RULES = {
  "AL": {
    name: "Alabama",
    sales: {
      economicNexusThreshold: 250000,
      transactionCountThreshold: null,
      marketplaceThreshold: 250000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      affiliateNexus: true,
      effectiveDate: '2018-10-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 500000,
      pl86_272Applies: true,
      protectedActivities: ['solicitation', 'order_taking'],
      unprotectedActivities: ['installation', 'training', 'repair', 'technical_support']
    },
    payroll: {
      employeeThreshold: 1,
      contractorThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: true,
      doingBusinessThreshold: 'any_presence',
      minimumTax: 100,
      qualificationRequired: true
    }
  },

  "AK": {
    name: "Alaska",
    sales: {
      hasStateSalesTax: false,
      localSalesTaxMayApply: true,
      economicNexusThreshold: null,
      note: "No state sales tax but some localities impose sales tax"
    },
    income: {
      hasIncomeTax: false,
      note: "No state income tax"
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: false,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: false
    }
  },

  "AZ": {
    name: "Arizona",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: null,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      affiliateNexus: true,
      effectiveDate: '2019-10-01',
      note: "Transaction Privilege Tax (TPT)"
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true,
      protectedActivities: ['solicitation'],
      unprotectedActivities: ['installation', 'training', 'repair']
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: false,
      note: "No franchise tax"
    }
  },

  "AR": {
    name: "Arkansas",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: 200,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      affiliateNexus: true,
      effectiveDate: '2019-07-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: true,
      minimumTax: 150,
      qualificationRequired: true
    }
  },

  "CA": {
    name: "California",
    sales: {
      economicNexusThreshold: 500000,
      transactionCountThreshold: null,
      marketplaceThreshold: 500000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory', 'trade_show_attendance'],
      affiliateNexus: true,
      effectiveDate: '2019-04-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 637252, // 2024 threshold (adjusts annually)
      pl86_272Applies: true,
      protectedActivities: ['solicitation', 'order_taking', 'advertising'],
      unprotectedActivities: ['installation', 'training', 'repair', 'maintenance', 'collection'],
      requiresJudgment: ['software_delivery', 'digital_services', 'cloud_computing']
    },
    payroll: {
      employeeThreshold: 1,
      contractorThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true,
      disabilityInsurance: true,
      paidFamilyLeave: true
    },
    franchise: {
      hasFranchiseTax: true,
      doingBusinessThreshold: 'any_presence',
      minimumTax: 800,
      qualificationRequired: true,
      note: "Minimum $800 franchise tax for all registered entities"
    }
  },

  "CO": {
    name: "Colorado",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: null,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      affiliateNexus: true,
      effectiveDate: '2019-06-01',
      hasLocalTaxComplexity: true,
      note: "Complex home-rule city requirements"
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true,
      paidFamilyLeave: true
    },
    franchise: {
      hasFranchiseTax: false
    }
  },

  "CT": {
    name: "Connecticut",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: 200,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      affiliateNexus: true,
      effectiveDate: '2018-12-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 500000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true,
      paidFamilyLeave: true
    },
    franchise: {
      hasFranchiseTax: false,
      note: "Business entity tax applies"
    }
  },

  "DE": {
    name: "Delaware",
    sales: {
      hasStateSalesTax: false,
      note: "No sales tax in Delaware"
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: true,
      minimumTax: 175,
      qualificationRequired: true,
      note: "Annual franchise tax based on authorized shares or assumed par value capital"
    }
  },

  "DC": {
    name: "District of Columbia",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: 200,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2019-01-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true,
      paidFamilyLeave: true
    },
    franchise: {
      hasFranchiseTax: true,
      minimumTax: 250
    }
  },

  "FL": {
    name: "Florida",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: null,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      affiliateNexus: true,
      effectiveDate: '2021-07-01'
    },
    income: {
      hasIncomeTax: false,
      corporateIncomeTax: true,
      corporateThreshold: 50000,
      pl86_272Applies: true,
      note: "No personal income tax; corporate income tax applies"
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: false,
      unemploymentInsurance: true,
      note: "No state income tax withholding required"
    },
    franchise: {
      hasFranchiseTax: false
    }
  },

  "GA": {
    name: "Georgia",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: 200,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      affiliateNexus: true,
      effectiveDate: '2019-01-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: false,
      netWorthTax: true,
      note: "Net worth tax applies to corporations"
    }
  },

  "HI": {
    name: "Hawaii",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: 200,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2018-07-01',
      note: "General Excise Tax (GET) - applies to gross receipts"
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true,
      temporaryDisabilityInsurance: true
    },
    franchise: {
      hasFranchiseTax: false
    }
  },

  "ID": {
    name: "Idaho",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: null,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2018-06-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: false
    }
  },

  "IL": {
    name: "Illinois",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: 200,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      affiliateNexus: true,
      effectiveDate: '2021-01-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: true,
      note: "Being phased out"
    }
  },

  "IN": {
    name: "Indiana",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: 200,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2018-10-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: false
    }
  },

  "IA": {
    name: "Iowa",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: null,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2019-01-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: false
    }
  },

  "KS": {
    name: "Kansas",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: null,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2021-07-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: true,
      minimumTax: 40
    }
  },

  "KY": {
    name: "Kentucky",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: 200,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2018-10-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: false,
      limitedLiabilityEntityTax: true
    }
  },

  "LA": {
    name: "Louisiana",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: 200,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2018-07-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: true,
      minimumTax: 110
    }
  },

  "ME": {
    name: "Maine",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: 200,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2018-07-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: false
    }
  },

  "MD": {
    name: "Maryland",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: 200,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2018-10-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: false
    }
  },

  "MA": {
    name: "Massachusetts",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: null,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      affiliateNexus: true,
      effectiveDate: '2019-10-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 500000,
      pl86_272Applies: true,
      note: "Factor presence nexus applies"
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true,
      paidFamilyLeave: true
    },
    franchise: {
      hasFranchiseTax: false,
      exciseTax: true
    }
  },

  "MI": {
    name: "Michigan",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: 200,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2018-10-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: false
    }
  },

  "MN": {
    name: "Minnesota",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: 200,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2019-10-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: false
    }
  },

  "MS": {
    name: "Mississippi",
    sales: {
      economicNexusThreshold: 250000,
      transactionCountThreshold: null,
      marketplaceThreshold: 250000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2018-09-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 250000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: true,
      minimumTax: 25
    }
  },

  "MO": {
    name: "Missouri",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: null,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2023-01-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: false
    }
  },

  "MT": {
    name: "Montana",
    sales: {
      hasStateSalesTax: false,
      note: "No general sales tax"
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: false
    }
  },

  "NE": {
    name: "Nebraska",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: 200,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2019-01-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: false
    }
  },

  "NV": {
    name: "Nevada",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: 200,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2018-10-01'
    },
    income: {
      hasIncomeTax: false,
      commerceActivityTax: true,
      commerceThreshold: 4000000,
      note: "No income tax; Commerce Tax applies to gross revenue over $4M"
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: false,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: false,
      businessLicenseFee: true
    }
  },

  "NH": {
    name: "New Hampshire",
    sales: {
      hasStateSalesTax: false,
      note: "No general sales tax"
    },
    income: {
      hasIncomeTax: false,
      interestAndDividendsTax: true,
      businessProfitsTax: true,
      businessEnterprisesTax: true,
      bptThreshold: 50000,
      note: "Business Profits Tax and Business Enterprise Tax apply"
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: false,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: false
    }
  },

  "NJ": {
    name: "New Jersey",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: 200,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      affiliateNexus: true,
      effectiveDate: '2018-11-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true,
      temporaryDisabilityInsurance: true,
      familyLeaveInsurance: true
    },
    franchise: {
      hasFranchiseTax: false,
      corporateBusinessTax: true,
      minimumTax: 500
    }
  },

  "NM": {
    name: "New Mexico",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: null,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2019-07-01',
      note: "Gross Receipts Tax (GRT)"
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: false
    }
  },

  "NY": {
    name: "New York",
    sales: {
      economicNexusThreshold: 500000,
      transactionCountThreshold: 100,
      marketplaceThreshold: 500000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      affiliateNexus: true,
      effectiveDate: '2019-06-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 1000000,
      pl86_272Applies: true,
      note: "Bright-line nexus based on receipts"
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true,
      paidFamilyLeave: true,
      disabilityInsurance: true
    },
    franchise: {
      hasFranchiseTax: true,
      minimumTax: 25,
      note: "Fixed dollar minimum based on receipts"
    }
  },

  "NC": {
    name: "North Carolina",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: 200,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2018-11-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: true,
      minimumTax: 200
    }
  },

  "ND": {
    name: "North Dakota",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: null,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2019-01-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: false
    }
  },

  "OH": {
    name: "Ohio",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: 200,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2019-08-01'
    },
    income: {
      hasIncomeTax: true,
      commercialActivityTax: true,
      catThreshold: 150000,
      pl86_272Applies: true,
      note: "Commercial Activity Tax (CAT) on gross receipts"
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: false
    }
  },

  "OK": {
    name: "Oklahoma",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: null,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2018-07-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: true,
      minimumTax: 25
    }
  },

  "OR": {
    name: "Oregon",
    sales: {
      hasStateSalesTax: false,
      note: "No sales tax",
      corporateActivityTax: true,
      catThreshold: 1000000,
      catNote: "Corporate Activity Tax (CAT) applies to commercial activity over $1M"
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true,
      paidFamilyLeave: true
    },
    franchise: {
      hasFranchiseTax: false,
      minimumTax: 150,
      note: "Minimum excise tax"
    }
  },

  "PA": {
    name: "Pennsylvania",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: null,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2019-07-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true,
      localTaxComplexity: true,
      note: "Complex local earned income tax requirements"
    },
    franchise: {
      hasFranchiseTax: false,
      capitalStockTax: false,
      note: "Capital stock tax phased out"
    }
  },

  "RI": {
    name: "Rhode Island",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: 200,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2019-07-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true,
      temporaryDisabilityInsurance: true
    },
    franchise: {
      hasFranchiseTax: true,
      minimumTax: 400
    }
  },

  "SC": {
    name: "South Carolina",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: null,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2018-11-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: false,
      licenseFee: true
    }
  },

  "SD": {
    name: "South Dakota",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: 200,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2018-11-01',
      note: "Wayfair case originated here"
    },
    income: {
      hasIncomeTax: false,
      note: "No income tax"
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: false,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: false
    }
  },

  "TN": {
    name: "Tennessee",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: null,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2019-10-01'
    },
    income: {
      hasIncomeTax: false,
      franchiseAndExciseTax: true,
      exciseThreshold: 300000,
      note: "No income tax on wages; Franchise & Excise Tax applies to businesses"
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: false,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: true,
      minimumTax: 100,
      exciseTax: true
    }
  },

  "TX": {
    name: "Texas",
    sales: {
      economicNexusThreshold: 500000,
      transactionCountThreshold: null,
      marketplaceThreshold: 500000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      affiliateNexus: true,
      effectiveDate: '2019-10-01'
    },
    income: {
      hasIncomeTax: false,
      franchiseTaxApplies: true,
      franchiseThreshold: 1230000,
      noPL86_272: true,
      note: "No income tax; Franchise (Margin) Tax applies"
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: false,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: true,
      marginTax: true,
      threshold: 1230000,
      minimumTax: 0,
      qualificationRequired: true,
      note: "Franchise (Margin) Tax based on margin"
    }
  },

  "UT": {
    name: "Utah",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: 200,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2019-01-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: false
    }
  },

  "VT": {
    name: "Vermont",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: 200,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2018-07-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: false,
      minimumTax: 250
    }
  },

  "VA": {
    name: "Virginia",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: 200,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2019-07-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: false,
      registrationFee: true
    }
  },

  "WA": {
    name: "Washington",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: null,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2018-10-01'
    },
    income: {
      hasIncomeTax: false,
      businessAndOccupationTax: true,
      botThreshold: 0,
      note: "No income tax; B&O Tax on gross receipts"
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: false,
      unemploymentInsurance: true,
      paidFamilyLeave: true,
      longTermCare: true
    },
    franchise: {
      hasFranchiseTax: false
    }
  },

  "WV": {
    name: "West Virginia",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: 200,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2019-01-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: false
    }
  },

  "WI": {
    name: "Wisconsin",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: null,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2019-10-01'
    },
    income: {
      hasIncomeTax: true,
      economicNexusThreshold: 100000,
      pl86_272Applies: true
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: true,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: false
    }
  },

  "WY": {
    name: "Wyoming",
    sales: {
      economicNexusThreshold: 100000,
      transactionCountThreshold: 200,
      marketplaceThreshold: 100000,
      physicalPresenceTriggers: ['employee', 'property', 'inventory'],
      effectiveDate: '2019-02-01'
    },
    income: {
      hasIncomeTax: false,
      note: "No income tax"
    },
    payroll: {
      employeeThreshold: 1,
      withholdingRequired: false,
      unemploymentInsurance: true
    },
    franchise: {
      hasFranchiseTax: false
    }
  }
};

/**
 * PL 86-272 Activity Classifications
 */
const PL_86_272_ACTIVITIES = {
  protected: [
    'solicitation',
    'order_taking',
    'advertising',
    'maintaining_sample_room',
    'attending_trade_shows',
    'distributing_promotional_materials',
    'coordinating_shipments',
    'checking_customer_credit',
    'collecting_customer_data'
  ],
  unprotected: [
    'installation',
    'training',
    'repair',
    'maintenance',
    'collection',
    'credit_investigation',
    'product_demonstrations',
    'technical_support',
    'warranty_service',
    'accepting_returns',
    'storing_inventory',
    'providing_consulting',
    'making_deliveries',
    'accepting_deposits',
    'providing_customer_service'
  ],
  ambiguous: [
    'software_delivery',
    'digital_services',
    'cloud_computing',
    'remote_support',
    'virtual_meetings',
    'online_training'
  ]
};

/**
 * Risk Posture Multipliers
 */
const RISK_MULTIPLIERS = {
  conservative: 0.8,  // Alert at 80% of threshold
  standard: 1.0,      // Alert at 100% of threshold
  aggressive: 1.2     // Alert at 120% of threshold
};

/**
 * Severity Thresholds by Risk Posture
 */
const SEVERITY_THRESHOLDS = {
  conservative: { high: 80, medium: 60, low: 40 },
  standard: { high: 100, medium: 80, low: 60 },
  aggressive: { high: 120, medium: 100, low: 80 }
};

module.exports = {
  STATE_RULES,
  PL_86_272_ACTIVITIES,
  RISK_MULTIPLIERS,
  SEVERITY_THRESHOLDS
};







