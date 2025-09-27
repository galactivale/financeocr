import React from "react";

interface Props {
  title: string;
  children?: React.ReactNode;
}

export const SidebarMenu = ({ title, children }: Props) => {
  return (
    <div className="flex gap-3 flex-col">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2 border-b border-white/5">{title}</span>
      <div className="flex flex-col gap-1">
        {children}
      </div>
    </div>
  );
};
