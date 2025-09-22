import React from "react";

interface LogoProps {
  size?: number;
  className?: string;
}

export const FinanceOCRLogo = ({ size = 32, className = "" }: LogoProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Primary gradient - blue to purple */}
        <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        
        {/* Secondary gradient - green to blue */}
        <linearGradient id="secondaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        
        {/* Accent gradient - orange to pink */}
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        
        {/* Background gradient */}
        <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>
        
        {/* Glow effect */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Background circle with gradient */}
      <circle 
        cx="16" 
        cy="16" 
        r="14" 
        fill="url(#backgroundGradient)" 
        stroke="url(#primaryGradient)" 
        strokeWidth="1"
      />
      
      {/* Main "F" shape with gradient */}
      <path 
        d="M10 8 L10 24 M10 8 L18 8 M10 16 L16 16" 
        fill="none" 
        stroke="url(#primaryGradient)" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        filter="url(#glow)"
      />
      
      {/* OCR scanning lines with gradient */}
      <line x1="20" y1="10" x2="24" y2="10" stroke="url(#secondaryGradient)" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="13" x2="24" y2="13" stroke="url(#secondaryGradient)" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="16" x2="24" y2="16" stroke="url(#secondaryGradient)" strokeWidth="2" strokeLinecap="round" />
      
      {/* Dollar sign with accent gradient */}
      <path 
        d="M12 20 L12 26 M10 22 C10 21, 11 20, 12 20 C13 20, 14 21, 14 22 C14 23, 13 24, 12 24 C11 24, 10 25, 10 26 C10 27, 11 28, 12 28 C13 28, 14 27, 14 26" 
        fill="none" 
        stroke="url(#accentGradient)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Tech dots with gradient */}
      <circle cx="22" cy="20" r="1.5" fill="url(#primaryGradient)" />
      <circle cx="25" cy="20" r="1.5" fill="url(#secondaryGradient)" />
      <circle cx="22" cy="23" r="1.5" fill="url(#accentGradient)" />
      <circle cx="25" cy="23" r="1.5" fill="url(#primaryGradient)" />
      
      {/* Scanning beam effect */}
      <rect 
        x="8" 
        y="12" 
        width="1.5" 
        height="8" 
        fill="url(#secondaryGradient)" 
        opacity="0.6"
        rx="0.75"
      />
    </svg>
  );
};
