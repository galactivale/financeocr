"use client";
import React from "react";
import { FinanceOCRLogo } from "../icons/sifadocs-logo";

export const CompaniesDropdown = () => {
  return (
    <div className="w-full flex justify-center items-center py-3">
      <div className="flex items-center gap-3">
        <FinanceOCRLogo size={24} className="text-white" />
        <h1 className="text-lg font-semibold text-white tracking-tight">
          FINANCEOCR
        </h1>
      </div>
    </div>
  );
};
