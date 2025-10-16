"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardBody, 
  CardHeader,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Chip,
  Divider
} from '@nextui-org/react';
import { usePersonalizedDashboard } from '@/contexts/PersonalizedDashboardContext';
import { apiClient } from '@/lib/api';

interface ClientFormData {
  name: string;
  legalName: string;
  ein: string;
  industry: string;
  annualRevenue: string;
  foundedYear: string;
  employeeCount: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  businessAddress: string;
  city: string;
  state: string;
  zipCode: string;
  operatingStates: string[];
  businessType: string;
  description: string;
}

const INDUSTRY_OPTIONS = [
  'Technology',
  'Healthcare',
  'Manufacturing',
  'Retail',
  'Financial Services',
  'Real Estate',
  'Construction',
  'Professional Services',
  'E-commerce',
  'Consulting',
  'Other'
];

const BUSINESS_TYPE_OPTIONS = [
  'Corporation',
  'S-Corporation',
  'LLC',
  'Partnership',
  'Sole Proprietorship',
  'Non-Profit',
  'Other'
];

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export default function AddClientPage() {
  const router = useRouter();
  const { organizationId } = usePersonalizedDashboard();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    legalName: '',
    ein: '',
    industry: '',
    annualRevenue: '',
    foundedYear: '',
    employeeCount: '',
    primaryContactName: '',
    primaryContactEmail: '',
    primaryContactPhone: '',
    businessAddress: '',
    city: '',
    state: '',
    zipCode: '',
    operatingStates: [],
    businessType: '',
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const finalOrganizationId = organizationId || 'demo-org-id';

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Company name is required';
    if (!formData.legalName.trim()) newErrors.legalName = 'Legal name is required';
    if (!formData.ein.trim()) newErrors.ein = 'EIN is required';
    if (!formData.industry) newErrors.industry = 'Industry is required';
    if (!formData.businessType) newErrors.businessType = 'Business type is required';
    if (!formData.annualRevenue.trim()) newErrors.annualRevenue = 'Annual revenue is required';
    if (!formData.foundedYear.trim()) newErrors.foundedYear = 'Founded year is required';
    if (!formData.employeeCount.trim()) newErrors.employeeCount = 'Employee count is required';
    if (!formData.primaryContactName.trim()) newErrors.primaryContactName = 'Primary contact name is required';
    if (!formData.primaryContactEmail.trim()) newErrors.primaryContactEmail = 'Primary contact email is required';
    if (!formData.primaryContactPhone.trim()) newErrors.primaryContactPhone = 'Primary contact phone is required';
    if (!formData.businessAddress.trim()) newErrors.businessAddress = 'Business address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (formData.operatingStates.length === 0) newErrors.operatingStates = 'At least one operating state is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.primaryContactEmail && !emailRegex.test(formData.primaryContactEmail)) {
      newErrors.primaryContactEmail = 'Please enter a valid email address';
    }

    // EIN validation (format: XX-XXXXXXX)
    const einRegex = /^\d{2}-\d{7}$/;
    if (formData.ein && !einRegex.test(formData.ein)) {
      newErrors.ein = 'EIN must be in format XX-XXXXXXX';
    }

    // Phone validation
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$|^\d{3}-\d{3}-\d{4}$|^\d{10}$/;
    if (formData.primaryContactPhone && !phoneRegex.test(formData.primaryContactPhone.replace(/\D/g, ''))) {
      newErrors.primaryContactPhone = 'Please enter a valid phone number';
    }

    // ZIP code validation
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (formData.zipCode && !zipRegex.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code';
    }

    // Numeric validation
    if (formData.annualRevenue && isNaN(Number(formData.annualRevenue))) {
      newErrors.annualRevenue = 'Please enter a valid number';
    }
    if (formData.foundedYear && (isNaN(Number(formData.foundedYear)) || Number(formData.foundedYear) < 1800 || Number(formData.foundedYear) > new Date().getFullYear())) {
      newErrors.foundedYear = 'Please enter a valid year';
    }
    if (formData.employeeCount && isNaN(Number(formData.employeeCount))) {
      newErrors.employeeCount = 'Please enter a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ClientFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleOperatingStatesChange = (selectedKeys: any) => {
    const states = Array.from(selectedKeys) as string[];
    handleInputChange('operatingStates', states);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const clientData = {
        name: formData.name.trim(),
        legalName: formData.legalName.trim(),
        ein: formData.ein.trim(),
        industry: formData.industry,
        businessType: formData.businessType,
        annualRevenue: parseFloat(formData.annualRevenue),
        foundedYear: parseInt(formData.foundedYear),
        employeeCount: parseInt(formData.employeeCount),
        primaryContactName: formData.primaryContactName.trim(),
        primaryContactEmail: formData.primaryContactEmail.trim(),
        primaryContactPhone: formData.primaryContactPhone.trim(),
        businessAddress: formData.businessAddress.trim(),
        city: formData.city.trim(),
        state: formData.state,
        zipCode: formData.zipCode.trim(),
        operatingStates: formData.operatingStates,
        description: formData.description.trim(),
        organizationId: finalOrganizationId,
        // Default values
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        riskLevel: 'medium',
        penaltyExposure: parseFloat(formData.annualRevenue) * 0.1, // 10% of revenue
        qualityScore: 75,
        status: 'active',
        assignedPartner: 'Managing Partner',
        assignedManager: 'Sarah Mitchell',
        tags: [formData.industry.toLowerCase(), formData.businessType.toLowerCase()]
      };

      const response = await apiClient.createClient(clientData);

      if (response.success) {
        // Success - redirect to clients list
        router.push('/dashboard/managing-partner/clients');
      } else {
        console.error('Failed to create client:', response.error);
        // You could show a toast notification here
      }
    } catch (error) {
      console.error('Error creating client:', error);
      // You could show a toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/managing-partner/clients');
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="h-full">
        {/* Header */}
        <div className="flex items-center justify-between pt-6 px-6 mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-white tracking-tight">Add New Client</h1>
            <p className="text-gray-400 mt-2">Create a new client in your portfolio</p>
          </div>
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>

        {/* Form */}
        <div className="px-6">
          <div className="w-full max-w-6xl mx-auto">
            <form onSubmit={handleSubmit}>
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-white">Client Information</h2>
                </CardHeader>
                <CardBody className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Company Name"
                      placeholder="Enter company name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      isInvalid={!!errors.name}
                      errorMessage={errors.name}
                      classNames={{
                        input: "text-white",
                        inputWrapper: "bg-white/10 border-white/20 data-[hover=true]:border-white/30 group-data-[focus=true]:border-white/40"
                      }}
                    />
                    <Input
                      label="Legal Name"
                      placeholder="Enter legal business name"
                      value={formData.legalName}
                      onChange={(e) => handleInputChange('legalName', e.target.value)}
                      isInvalid={!!errors.legalName}
                      errorMessage={errors.legalName}
                      classNames={{
                        input: "text-white",
                        inputWrapper: "bg-white/10 border-white/20 data-[hover=true]:border-white/30 group-data-[focus=true]:border-white/40"
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Select
                      label="Industry"
                      placeholder="Select industry"
                      selectedKeys={formData.industry ? [formData.industry] : []}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        handleInputChange('industry', selected);
                      }}
                      isInvalid={!!errors.industry}
                      errorMessage={errors.industry}
                      classNames={{
                        trigger: "bg-white/10 border-white/20 data-[hover=true]:border-white/30",
                        value: "text-white"
                      }}
                    >
                      {INDUSTRY_OPTIONS.map((industry) => (
                        <SelectItem key={industry} value={industry} className="text-white">
                          {industry}
                        </SelectItem>
                      ))}
                    </Select>
                    <Input
                      label="Annual Revenue"
                      placeholder="Enter annual revenue"
                      type="number"
                      value={formData.annualRevenue}
                      onChange={(e) => handleInputChange('annualRevenue', e.target.value)}
                      isInvalid={!!errors.annualRevenue}
                      errorMessage={errors.annualRevenue}
                      startContent={<span className="text-gray-400">$</span>}
                      classNames={{
                        input: "text-white",
                        inputWrapper: "bg-white/10 border-white/20 data-[hover=true]:border-white/30 group-data-[focus=true]:border-white/40"
                      }}
                    />
                    <Input
                      label="Founded Year"
                      placeholder="Enter founded year"
                      type="number"
                      value={formData.foundedYear}
                      onChange={(e) => handleInputChange('foundedYear', e.target.value)}
                      isInvalid={!!errors.foundedYear}
                      errorMessage={errors.foundedYear}
                      classNames={{
                        input: "text-white",
                        inputWrapper: "bg-white/10 border-white/20 data-[hover=true]:border-white/30 group-data-[focus=true]:border-white/40"
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Employee Count"
                      placeholder="Enter number of employees"
                      type="number"
                      value={formData.employeeCount}
                      onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                      isInvalid={!!errors.employeeCount}
                      errorMessage={errors.employeeCount}
                      classNames={{
                        input: "text-white",
                        inputWrapper: "bg-white/10 border-white/20 data-[hover=true]:border-white/30 group-data-[focus=true]:border-white/40"
                      }}
                    />
                    <Input
                      label="Primary Contact Name"
                      placeholder="Enter contact person name"
                      value={formData.primaryContactName}
                      onChange={(e) => handleInputChange('primaryContactName', e.target.value)}
                      isInvalid={!!errors.primaryContactName}
                      errorMessage={errors.primaryContactName}
                      classNames={{
                        input: "text-white",
                        inputWrapper: "bg-white/10 border-white/20 data-[hover=true]:border-white/30 group-data-[focus=true]:border-white/40"
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Primary Contact Email"
                      placeholder="Enter contact email"
                      type="email"
                      value={formData.primaryContactEmail}
                      onChange={(e) => handleInputChange('primaryContactEmail', e.target.value)}
                      isInvalid={!!errors.primaryContactEmail}
                      errorMessage={errors.primaryContactEmail}
                      classNames={{
                        input: "text-white",
                        inputWrapper: "bg-white/10 border-white/20 data-[hover=true]:border-white/30 group-data-[focus=true]:border-white/40"
                      }}
                    />
                    <Input
                      label="City"
                      placeholder="Enter city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      isInvalid={!!errors.city}
                      errorMessage={errors.city}
                      classNames={{
                        input: "text-white",
                        inputWrapper: "bg-white/10 border-white/20 data-[hover=true]:border-white/30 group-data-[focus=true]:border-white/40"
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                      label="State"
                      placeholder="Select state"
                      selectedKeys={formData.state ? [formData.state] : []}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        handleInputChange('state', selected);
                      }}
                      isInvalid={!!errors.state}
                      errorMessage={errors.state}
                      classNames={{
                        trigger: "bg-white/10 border-white/20 data-[hover=true]:border-white/30",
                        value: "text-white"
                      }}
                    >
                      {US_STATES.map((state) => (
                        <SelectItem key={state} value={state} className="text-white">
                          {state}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  <Textarea
                    label="Description"
                    placeholder="Enter client description or notes"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    classNames={{
                      input: "text-white",
                      inputWrapper: "bg-white/10 border-white/20 data-[hover=true]:border-white/30 group-data-[focus=true]:border-white/40"
                    }}
                  />

                  <Divider className="bg-white/10" />

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-gray-400 hover:text-white"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      color="primary"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8"
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating Client...' : 'Create Client'}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
