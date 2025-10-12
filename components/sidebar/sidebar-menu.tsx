import React from "react";

interface Props {
  title: string;
  children?: React.ReactNode;
}

export const SidebarMenu = ({ title, children }: Props) => {
  return (
    <div className="flex gap-2 flex-col mb-3">
      <span className="text-xs font-semibold text-white uppercase tracking-wider px-3 py-1.5">{title}</span>
      <div className="flex flex-col gap-1">
        {children}
      </div>
    </div>
  );
};
