'use client';

import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Input, Button, Divider } from '@nextui-org/react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationSlug, setOrganizationSlug] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login({
        email,
        password,
        organizationSlug,
      });

      if (result.success) {
        // Redirect based on user role
        router.push('/dashboard/managing-partner');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 text-center">
          <h1 className="text-2xl font-bold">VaultCPA</h1>
          <p className="text-small text-default-500">Sign in to your account</p>
        </CardHeader>
        <Divider />
        <CardBody className="gap-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Organization"
              placeholder="Enter organization slug"
              value={organizationSlug}
              onChange={(e) => setOrganizationSlug(e.target.value)}
              isRequired
              description="e.g., acme-accounting"
            />
            
            <Input
              label="Email"
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isRequired
            />
            
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeSlashIcon className="h-4 w-4 text-default-400" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-default-400" />
                  )}
                </button>
              }
              type={isVisible ? 'text' : 'password'}
            />

            {error && (
              <div className="text-danger text-sm text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              color="primary"
              isLoading={isLoading}
              className="w-full"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <Divider />
          
          <div className="text-center text-small text-default-500">
            <p className="mb-2">Demo Credentials:</p>
            <div className="text-left space-y-1">
              <p><strong>Acme Accounting:</strong></p>
              <p>Org: acme-accounting</p>
              <p>Email: john.doe@acmeaccounting.com</p>
              <p>Password: password123</p>
              <br />
              <p><strong>Smith Tax Pros:</strong></p>
              <p>Org: smith-tax-pros</p>
              <p>Email: sarah.wilson@smithtaxpros.com</p>
              <p>Password: password123</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}


