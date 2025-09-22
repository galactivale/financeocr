import React from "react";
import { Sidebar } from "./sidebar.styles";
import { Avatar, Tooltip } from "@nextui-org/react";
import { CompaniesDropdown } from "./companies-dropdown";
import { HomeIcon } from "../icons/sidebar/home-icon";
import { PaymentsIcon } from "../icons/sidebar/payments-icon";
import { BalanceIcon } from "../icons/sidebar/balance-icon";
import { AccountsIcon } from "../icons/sidebar/accounts-icon";
import { CustomersIcon } from "../icons/sidebar/customers-icon";
import { ProductsIcon } from "../icons/sidebar/products-icon";
import { ReportsIcon } from "../icons/sidebar/reports-icon";
import { DevIcon } from "../icons/sidebar/dev-icon";
import { ViewIcon } from "../icons/sidebar/view-icon";
import { SettingsIcon } from "../icons/sidebar/settings-icon";
import { MonitoringIcon } from "../icons/sidebar/monitoring-icon";
import { AlertsIcon } from "../icons/sidebar/alerts-icon";
import { AdvisoryIcon } from "../icons/sidebar/advisory-icon";
import { LiabilityIcon } from "../icons/sidebar/liability-icon";
import { RegulatoryIcon } from "../icons/sidebar/regulatory-icon";
import { NexusIcon } from "../icons/sidebar/nexus-icon";
import { CollapseItems } from "./collapse-items";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { FilterIcon } from "../icons/sidebar/filter-icon";
import { useSidebarContext } from "../layout/layout-context";
import { ChangeLogIcon } from "../icons/sidebar/changelog-icon";
import { usePathname } from "next/navigation";

interface DynamicSidebarProps {
  userRole?: string;
}

export const DynamicSidebar = ({ userRole }: DynamicSidebarProps) => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();

  // Determine user role from pathname if not provided
  const getUserRole = (): string => {
    if (userRole) return userRole;
    if (pathname.includes('/managing-partner')) return 'managing-partner';
    if (pathname.includes('/tax-manager')) return 'tax-manager';
    if (pathname.includes('/staff-accountant')) return 'staff-accountant';
    if (pathname.includes('/system-admin')) return 'system-admin';
    if (pathname.includes('/client-portal')) return 'client-portal';
    return 'default';
  };

  const currentRole = getUserRole();

  // Role-specific navigation items
  const getNavigationItems = () => {
    switch (currentRole) {
      case 'managing-partner':
        return (
          <>
            <SidebarItem
              title="Dashboard"
              icon={<HomeIcon />}
              isActive={pathname === "/dashboard/managing-partner"}
              href="/dashboard/managing-partner"
            />
            <SidebarMenu title="Management">
              <SidebarItem
                isActive={pathname === "/dashboard/managing-partner/compliance"}
                title="Compliance"
                icon={<BalanceIcon />}
                href="/dashboard/managing-partner/compliance"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/managing-partner/risk"}
                title="Risk"
                icon={<ReportsIcon />}
                href="/dashboard/managing-partner/risk"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/managing-partner/clients"}
                title="Clients"
                icon={<CustomersIcon />}
                href="/dashboard/managing-partner/clients"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/managing-partner/analytics"}
                title="Analytics"
                icon={<ViewIcon />}
                href="/dashboard/managing-partner/analytics"
              />
            </SidebarMenu>
            <SidebarMenu title="Admin">
              <SidebarItem
                isActive={pathname === "/dashboard/managing-partner/profile"}
                title="Profile"
                icon={<SettingsIcon />}
                href="/dashboard/managing-partner/profile"
              />
            </SidebarMenu>
          </>
        );

      case 'tax-manager':
        return (
          <>
            <SidebarItem
              title="Dashboard"
              icon={<HomeIcon />}
              isActive={pathname === "/dashboard/tax-manager"}
              href="/dashboard/tax-manager"
            />
            <SidebarMenu title="Nexus">
              <SidebarItem
                isActive={pathname === "/dashboard/tax-manager/monitoring"}
                title="Monitoring"
                icon={<MonitoringIcon />}
                href="/dashboard/tax-manager/monitoring"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/tax-manager/alerts"}
                title="Alerts"
                icon={<AlertsIcon />}
                href="/dashboard/tax-manager/alerts"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/tax-manager/clients"}
                title="Clients"
                icon={<CustomersIcon />}
                href="/dashboard/tax-manager/clients"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/tax-manager/reports"}
                title="Reports"
                icon={<ReportsIcon />}
                href="/dashboard/tax-manager/reports"
              />
            </SidebarMenu>
            <SidebarMenu title="Tools">
              <SidebarItem
                isActive={pathname === "/dashboard/tax-manager/advisory"}
                title="Advisory"
                icon={<AdvisoryIcon />}
                href="/dashboard/tax-manager/advisory"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/tax-manager/liability"}
                title="Liability"
                icon={<LiabilityIcon />}
                href="/dashboard/tax-manager/liability"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/tax-manager/regulatory"}
                title="Regulatory"
                icon={<RegulatoryIcon />}
                href="/dashboard/tax-manager/regulatory"
              />
            </SidebarMenu>
            <SidebarMenu title="Settings">
              <SidebarItem
                isActive={pathname === "/dashboard/tax-manager/profile"}
                title="Profile"
                icon={<SettingsIcon />}
                href="/dashboard/tax-manager/profile"
              />
            </SidebarMenu>
          </>
        );

      case 'staff-accountant':
        return (
          <>
            <SidebarItem
              title="Dashboard"
              icon={<HomeIcon />}
              isActive={pathname === "/dashboard/staff-accountant"}
              href="/dashboard/staff-accountant"
            />
            <SidebarMenu title="Tasks">
              <SidebarItem
                isActive={pathname === "/dashboard/staff-accountant/tasks"}
                title="Tasks"
                icon={<BalanceIcon />}
                href="/dashboard/staff-accountant/tasks"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/staff-accountant/data"}
                title="Data"
                icon={<PaymentsIcon />}
                href="/dashboard/staff-accountant/data"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/staff-accountant/clients"}
                title="Clients"
                icon={<CustomersIcon />}
                href="/dashboard/staff-accountant/clients"
              />
            </SidebarMenu>
            <SidebarMenu title="Support">
              <SidebarItem
                isActive={pathname === "/dashboard/staff-accountant/support"}
                title="Support"
                icon={<AccountsIcon />}
                href="/dashboard/staff-accountant/support"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/staff-accountant/training"}
                title="Training"
                icon={<DevIcon />}
                href="/dashboard/staff-accountant/training"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/staff-accountant/notifications"}
                title="Notifications"
                icon={<ViewIcon />}
                href="/dashboard/staff-accountant/notifications"
              />
            </SidebarMenu>
            <SidebarMenu title="Settings">
              <SidebarItem
                isActive={pathname === "/dashboard/staff-accountant/profile"}
                title="Profile"
                icon={<SettingsIcon />}
                href="/dashboard/staff-accountant/profile"
              />
            </SidebarMenu>
          </>
        );

      case 'system-admin':
        return (
          <>
            <SidebarItem
              title="Dashboard"
              icon={<HomeIcon />}
              isActive={pathname === "/dashboard/system-admin"}
              href="/dashboard/system-admin"
            />
            <SidebarMenu title="System">
              <SidebarItem
                isActive={pathname === "/dashboard/system-admin/monitoring"}
                title="Monitoring"
                icon={<BalanceIcon />}
                href="/dashboard/system-admin/monitoring"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/system-admin/users"}
                title="Users"
                icon={<AccountsIcon />}
                href="/dashboard/system-admin/users"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/system-admin/tenants"}
                title="Tenants"
                icon={<CustomersIcon />}
                href="/dashboard/system-admin/tenants"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/system-admin/integrations"}
                title="Integrations"
                icon={<ProductsIcon />}
                href="/dashboard/system-admin/integrations"
              />
            </SidebarMenu>
            <SidebarMenu title="Operations">
              <SidebarItem
                isActive={pathname === "/dashboard/system-admin/backup"}
                title="Backup"
                icon={<ReportsIcon />}
                href="/dashboard/system-admin/backup"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/system-admin/logs"}
                title="Logs"
                icon={<ViewIcon />}
                href="/dashboard/system-admin/logs"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/system-admin/config"}
                title="Config"
                icon={<SettingsIcon />}
                href="/dashboard/system-admin/config"
              />
            </SidebarMenu>
          </>
        );

      case 'client-portal':
        return (
          <>
            <SidebarItem
              title="Dashboard"
              icon={<HomeIcon />}
              isActive={pathname === "/client-portal"}
              href="/client-portal"
            />
            <SidebarMenu title="Compliance">
              <SidebarItem
                isActive={pathname === "/client-portal/compliance"}
                title="Compliance"
                icon={<BalanceIcon />}
                href="/client-portal/compliance"
              />
              <SidebarItem
                isActive={pathname === "/client-portal/reports"}
                title="Reports"
                icon={<ReportsIcon />}
                href="/client-portal/reports"
              />
            </SidebarMenu>
            <SidebarMenu title="Data">
              <SidebarItem
                isActive={pathname === "/client-portal/upload"}
                title="Upload"
                icon={<PaymentsIcon />}
                href="/client-portal/upload"
              />
            </SidebarMenu>
            <SidebarMenu title="Support">
              <SidebarItem
                isActive={pathname === "/client-portal/communications"}
                title="Communications"
                icon={<AccountsIcon />}
                href="/client-portal/communications"
              />
              <SidebarItem
                isActive={pathname === "/client-portal/help"}
                title="Help"
                icon={<DevIcon />}
                href="/client-portal/help"
              />
            </SidebarMenu>
            <SidebarMenu title="Account">
              <SidebarItem
                isActive={pathname === "/client-portal/account"}
                title="Account"
                icon={<SettingsIcon />}
                href="/client-portal/account"
              />
            </SidebarMenu>
          </>
        );

      default:
        return (
          <>
            <SidebarItem
              title="Home"
              icon={<HomeIcon />}
              isActive={pathname === "/"}
              href="/"
            />
            <SidebarMenu title="Dashboards">
              <SidebarItem
                isActive={pathname === "/dashboard/managing-partner"}
                title="Partner"
                icon={<BalanceIcon />}
                href="/dashboard/managing-partner"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/tax-manager"}
                title="Manager"
                icon={<PaymentsIcon />}
                href="/dashboard/tax-manager"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/staff-accountant"}
                title="Staff"
                icon={<AccountsIcon />}
                href="/dashboard/staff-accountant"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/system-admin"}
                title="Admin"
                icon={<DevIcon />}
                href="/dashboard/system-admin"
              />
              <SidebarItem
                isActive={pathname === "/client-portal"}
                title="Client"
                icon={<CustomersIcon />}
                href="/client-portal"
              />
            </SidebarMenu>
          </>
        );
    }
  };

  return (
    <aside className="h-screen z-[20] sticky top-0">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
          <CompaniesDropdown />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            {getNavigationItems()}
          </div>
          <div className={Sidebar.Footer()}>
            <Tooltip content={"Settings"} color="primary">
              <div className="max-w-fit">
                <SettingsIcon />
              </div>
            </Tooltip>
            <Tooltip content={"Adjustments"} color="primary">
              <div className="max-w-fit">
                <FilterIcon />
              </div>
            </Tooltip>
            <Tooltip content={"Profile"} color="primary">
              <Avatar
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                size="sm"
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </aside>
  );
};
