import React from "react";

interface Props {
  title: string;
  children?: React.ReactNode;
}

export const SidebarMenu = ({ title, children }: Props) => {
  return (
    <div className="flex gap-2 flex-col">
      <span className="text-xs font-semibold text-gray-400/80 uppercase tracking-wider px-3 py-1.5 border-b border-white/3">{title}</span>
      <div className="flex flex-col gap-0.5">
        {children}
      </div>
    </div>
  );
};
