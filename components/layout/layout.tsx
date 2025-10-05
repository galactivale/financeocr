"use client";

import React from "react";
import { useLockedBody } from "../hooks/useBodyLock";
import { NavbarWrapper } from "../navbar/navbar";
import { SidebarWrapper } from "../sidebar/sidebar";
import { SidebarContext } from "./layout-context";
import { usePathname } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [_, setLocked] = useLockedBody(false);
  const pathname = usePathname();
  
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setLocked(!sidebarOpen);
  };

  // Show sidebar for all routes including generate
  const shouldShowSidebar = true;

  return (
    <SidebarContext.Provider
      value={{
        collapsed: sidebarOpen,
        setCollapsed: handleToggleSidebar,
      }}>
      {pathname === "/generate" ? (
        // Special layout for generate route - sidebar only
        <section className='flex'>
          {shouldShowSidebar && <SidebarWrapper />}
          <div className="flex-1">
            {children}
          </div>
        </section>
      ) : (
        // Regular layout for other routes
        <section className='flex dashboard'>
          {shouldShowSidebar && <SidebarWrapper />}
          <NavbarWrapper>{children}</NavbarWrapper>
        </section>
      )}
    </SidebarContext.Provider>
  );
};
