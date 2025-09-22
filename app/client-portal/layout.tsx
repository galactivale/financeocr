"use client";

import React from "react";
import { useLockedBody } from "@/components/hooks/useBodyLock";
import { NavbarWrapper } from "@/components/navbar/navbar";
import { DynamicSidebar } from "@/components/sidebar/dynamic-sidebar";
import { SidebarContext } from "@/components/layout/layout-context";

interface Props {
  children: React.ReactNode;
}

export default function ClientPortalLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [_, setLocked] = useLockedBody(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setLocked(!sidebarOpen);
  };

  return (
    <SidebarContext.Provider
      value={{
        collapsed: sidebarOpen,
        setCollapsed: handleToggleSidebar,
      }}>
      <section className='flex'>
        <DynamicSidebar userRole="client-portal" />
        <NavbarWrapper>{children}</NavbarWrapper>
      </section>
    </SidebarContext.Provider>
  );
}
