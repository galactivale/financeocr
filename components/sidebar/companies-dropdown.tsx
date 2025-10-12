"use client";
import React from "react";
import { FinanceOCRLogo } from "../icons/sifadocs-logo";

export const CompaniesDropdown = () => {
  return (
    <div className="w-full flex justify-center items-center py-3">
      <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10 shadow-lg shadow-white/5">
        <FinanceOCRLogo size={20} className="text-white" />
        <h1 className="text-sm font-medium text-white tracking-tight">
          FinanceOCR
        </h1>
      </div>
    </div>
  );
};
