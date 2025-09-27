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
import { AuditTrailIcon } from "../icons/sidebar/audit-trail-icon";
import { ComplianceIcon } from "../icons/sidebar/compliance-icon";
import { RiskManagementIcon } from "../icons/sidebar/risk-management-icon";
import { AnalyticsIcon } from "../icons/sidebar/analytics-icon";
import { TasksIcon } from "../icons/sidebar/tasks-icon";
import { DataIcon } from "../icons/sidebar/data-icon";
import { SupportIcon } from "../icons/sidebar/support-icon";
import { NotificationsIcon } from "../icons/sidebar/notifications-icon";
import { ProfileIcon } from "../icons/sidebar/profile-icon";
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
            <SidebarItem
              isActive={pathname === "/dashboard/managing-partner/compliance"}
              title="Compliance"
              icon={<ComplianceIcon />}
              href="/dashboard/managing-partner/compliance"
            />
            <SidebarItem
              isActive={pathname === "/dashboard/managing-partner/clients"}
              title="Clients"
              icon={<CustomersIcon />}
              href="/dashboard/managing-partner/clients"
            />
            <SidebarItem
              isActive={pathname === "/dashboard/managing-partner/risk-management"}
              title="Risk Management"
              icon={<RiskManagementIcon />}
              href="/dashboard/managing-partner/risk-management"
            />
            <SidebarItem
              isActive={pathname === "/dashboard/managing-partner/analytics"}
              title="Analytics"
              icon={<AnalyticsIcon />}
              href="/dashboard/managing-partner/analytics"
            />
            <SidebarItem
              isActive={pathname === "/dashboard/managing-partner/settings"}
              title="Settings"
              icon={<SettingsIcon />}
              href="/dashboard/managing-partner/settings"
            />
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
              <SidebarItem
                isActive={pathname === "/dashboard/tax-manager/audit-trail"}
                title="Audit Trail"
                icon={<AuditTrailIcon />}
                href="/dashboard/tax-manager/audit-trail"
              />
            </SidebarMenu>
            <SidebarMenu title="Account">
              <SidebarItem
                isActive={pathname === "/dashboard/tax-manager/settings"}
                title="Settings & Profile"
                icon={<ProfileIcon />}
                href="/dashboard/tax-manager/settings"
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
            
            <SidebarMenu title="Work Management">
              <SidebarItem
                isActive={pathname === "/dashboard/staff-accountant/nexus-tasks"}
                title="Nexus Tasks"
                icon={<TasksIcon />}
                href="/dashboard/staff-accountant/nexus-tasks"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/staff-accountant/data-entry"}
                title="Data Entry"
                icon={<DataIcon />}
                href="/dashboard/staff-accountant/data-entry"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/staff-accountant/clients"}
                title="Client Management"
                icon={<CustomersIcon />}
                href="/dashboard/staff-accountant/clients"
              />
            </SidebarMenu>
            
            <SidebarMenu title="Monitoring & Alerts">
              <SidebarItem
                isActive={pathname === "/dashboard/staff-accountant/monitoring"}
                title="Task Monitoring"
                icon={<MonitoringIcon />}
                href="/dashboard/staff-accountant/monitoring"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/staff-accountant/alerts"}
                title="Alerts & Notifications"
                icon={<AlertsIcon />}
                href="/dashboard/staff-accountant/alerts"
              />
            </SidebarMenu>
            
            <SidebarMenu title="Support & Resources">
              <SidebarItem
                isActive={pathname === "/dashboard/staff-accountant/client-support"}
                title="Client Support"
                icon={<SupportIcon />}
                href="/dashboard/staff-accountant/client-support"
              />
            </SidebarMenu>
            
            <SidebarMenu title="Account">
              <SidebarItem
                isActive={pathname === "/dashboard/staff-accountant/settings"}
                title="Settings"
                icon={<SettingsIcon />}
                href="/dashboard/staff-accountant/settings"
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
                isActive={pathname === "/dashboard/system-admin/system-monitoring"}
                title="System Monitoring"
                icon={<MonitoringIcon />}
                href="/dashboard/system-admin/system-monitoring"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/system-admin/user-management"}
                title="User Management"
                icon={<AccountsIcon />}
                href="/dashboard/system-admin/user-management"
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
                isActive={pathname === "/dashboard/system-admin/backup-recovery"}
                title="Backup & Recovery"
                icon={<ReportsIcon />}
                href="/dashboard/system-admin/backup-recovery"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/system-admin/audit-logs"}
                title="Audit Logs"
                icon={<ViewIcon />}
                href="/dashboard/system-admin/audit-logs"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/system-admin/configuration"}
                title="Configuration"
                icon={<SettingsIcon />}
                href="/dashboard/system-admin/configuration"
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
