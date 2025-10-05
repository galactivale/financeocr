import React from "react";

export const ArchiveIcon = ({ className = "w-4 h-4" }: { className?: string }) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 8l4 4m0 0l4-4m-4 4V3m6 5v10a2 2 0 01-2 2H7a2 2 0 01-2-2V8m0 0l4 4m0 0l4-4"
      />
    </svg>
  );
};
