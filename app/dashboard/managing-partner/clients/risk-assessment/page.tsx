"use client";
import React from "react";

export default function RiskAssessmentPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="h-full lg:px-6">
        <div className="flex items-center justify-between pt-6 px-4 lg:px-0 mb-8">
          <h1 className="text-3xl font-semibold text-white tracking-tight">Portfolio Risk Analysis</h1>
        </div>
        
        <div className="flex justify-center gap-6 xl:gap-8 px-4 lg:px-0 flex-wrap xl:flex-nowrap max-w-[90rem] mx-auto w-full">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 w-full">
            <h2 className="text-white font-semibold text-xl tracking-tight mb-4">Risk Assessment</h2>
            <p className="text-gray-400">Comprehensive portfolio risk analysis and assessment tools.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

