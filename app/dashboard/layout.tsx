"use client";

import React from "react";
import { useLockedBody } from "@/components/hooks/useBodyLock";
import { NavbarWrapper } from "@/components/navbar/navbar";
import { DynamicSidebar } from "@/components/sidebar/dynamic-sidebar";
import { SidebarContext } from "@/components/layout/layout-context";
import { usePathname } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [_, setLocked] = useLockedBody(false);
  const pathname = usePathname();

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setLocked(!sidebarOpen);
  };

  // Get user role based on pathname
  const getUserRole = (): string => {
    if (pathname.includes('/managing-partner')) return 'managing-partner';
    if (pathname.includes('/tax-manager')) return 'tax-manager';
    if (pathname.includes('/system-admin')) return 'system-admin';
    if (pathname.includes('/client-portal')) return 'client-portal';
    return 'default';
  };

  const userRole = getUserRole();

  // Check if this is a view page (no sidebar needed)
  const isViewPage = pathname.includes('/view/');

  if (isViewPage) {
    // For view pages, render without sidebar
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }

  return (
    <SidebarContext.Provider
      value={{
        collapsed: sidebarOpen,
        setCollapsed: handleToggleSidebar,
      }}>
      <section className='flex'>
        <DynamicSidebar userRole={userRole} />
        <NavbarWrapper>{children}</NavbarWrapper>
      </section>
    </SidebarContext.Provider>
  );
}
