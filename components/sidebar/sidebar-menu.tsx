import React from "react";

interface Props {
  title: string;
  children?: React.ReactNode;
}

export const SidebarMenu = ({ title, children }: Props) => {
  return (
    <div className="flex gap-2 flex-col">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-1">{title}</span>
      <div className="flex flex-col gap-1">
        {children}
      </div>
    </div>
  );
};
