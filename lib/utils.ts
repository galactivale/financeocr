import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// UUID utilities
export const isUuid = (value?: string | null): boolean => {
  if (!value) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
};

export const DEMO_ORG_ID = '0e41d0dc-afd0-4e19-9515-71372f5745df';

// Do not fallback to a demo organization. Return a valid UUID or undefined.
export const normalizeOrgId = (maybeOrgId?: string | null): string | undefined => {
  return isUuid(maybeOrgId) ? (maybeOrgId as string) : undefined;
};