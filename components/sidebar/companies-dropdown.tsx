"use client";
import React from "react";
import { FinanceOCRLogo } from "../icons/sifadocs-logo";

export const CompaniesDropdown = () => {
  return (
    <div className="w-full flex justify-center items-center py-3">
      <div className="flex items-center gap-3">
        <FinanceOCRLogo size={20} className="text-white" />
        <h1 className="text-sm font-light text-white tracking-wider uppercase">
          FinanceOCR
        </h1>
      </div>
    </div>
  );
};
