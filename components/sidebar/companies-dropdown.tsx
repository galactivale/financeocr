"use client";
import React from "react";
import { FinanceOCRLogo } from "../icons/sifadocs-logo";

export const CompaniesDropdown = () => {
  return (
    <div className="w-full flex justify-center items-center py-4">
      <div className="flex items-center gap-3">
        <FinanceOCRLogo size={28} className="text-primary" />
        <h1 className="text-2xl font-bold text-default-900 dark:text-white tracking-tight">
          FINANCEOCR
        </h1>
      </div>
    </div>
  );
};
