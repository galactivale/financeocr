import React from "react";
import { Sidebar } from "./sidebar.styles";
import { CompaniesDropdown } from "./companies-dropdown";
import { 
  Home, 
  CreditCard, 
  DollarSign, 
  Users, 
  Building2, 
  Package, 
  BarChart3, 
  Code, 
  Eye, 
  Activity, 
  AlertTriangle, 
  Scale, 
  FileText, 
  MapPin, 
  ClipboardCheck, 
  Shield, 
  MessageSquare, 
  TrendingUp, 
  CheckSquare, 
  Database, 
  HelpCircle, 
  Bell, 
  User, 
  History,
  Clock,
  PieChart,
  EyeIcon,
  LineChart
} from "lucide-react";
import { CollapseItems } from "./collapse-items";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { useSidebarContext } from "../layout/layout-context";
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
              icon={<Home />}
              isActive={pathname === "/dashboard/managing-partner"}
              href="/dashboard/managing-partner"
            />
            <SidebarItem
              isActive={pathname === "/dashboard/managing-partner/monitoring"}
              title="Monitoring"
              icon={<Activity />}
              href="/dashboard/managing-partner/monitoring"
            />
            <SidebarItem
              isActive={pathname === "/dashboard/managing-partner/alerts"}
              title="Alerts"
              icon={<AlertTriangle />}
              href="/dashboard/managing-partner/alerts"
            />
            <SidebarItem
              isActive={pathname === "/dashboard/managing-partner/compliance"}
              title="Compliance"
              icon={<ClipboardCheck />}
              href="/dashboard/managing-partner/compliance"
            />
            <SidebarItem
              isActive={pathname === "/dashboard/managing-partner/clients"}
              title="Clients"
              icon={<Building2 />}
              href="/dashboard/managing-partner/clients"
            />
            <SidebarItem
              isActive={pathname === "/dashboard/managing-partner/risk-management"}
              title="Risk"
              icon={<Shield />}
              href="/dashboard/managing-partner/risk-management"
            />
            <SidebarItem
              isActive={pathname === "/dashboard/managing-partner/analytics"}
              title="Analytics"
              icon={<TrendingUp />}
              href="/dashboard/managing-partner/analytics"
            />
            <SidebarItem
              isActive={pathname === "/dashboard/managing-partner/team-management"}
              title="Team"
              icon={<Users />}
              href="/dashboard/managing-partner/team-management"
            />
            <SidebarItem
              isActive={pathname === "/dashboard/managing-partner/settings"}
              title="Settings"
              icon={<User />}
              href="/dashboard/managing-partner/settings"
            />
          </>
        );

      case 'tax-manager':
        return (
          <>
            <SidebarItem
              title="Dashboard"
              icon={<Home />}
              isActive={pathname === "/dashboard/tax-manager"}
              href="/dashboard/tax-manager"
            />
            <SidebarMenu title="Nexus">
              <SidebarItem
                isActive={pathname === "/dashboard/tax-manager/monitoring"}
                title="Monitoring"
                icon={<Activity />}
                href="/dashboard/tax-manager/monitoring"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/tax-manager/alerts"}
                title="Alerts"
                icon={<AlertTriangle />}
                href="/dashboard/tax-manager/alerts"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/tax-manager/clients"}
                title="Clients"
                icon={<User />}
                href="/dashboard/tax-manager/clients"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/tax-manager/reports"}
                title="Reports"
                icon={<LineChart />}
                href="/dashboard/tax-manager/reports"
              />
            </SidebarMenu>
            <SidebarMenu title="Tools">
              <SidebarItem
                isActive={pathname === "/dashboard/tax-manager/communications"}
                title="Messages"
                icon={<MessageSquare />}
                href="/dashboard/tax-manager/communications"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/tax-manager/liability"}
                title="Liability"
                icon={<Scale />}
                href="/dashboard/tax-manager/liability"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/tax-manager/regulatory"}
                title="Regulatory"
                icon={<EyeIcon />}
                href="/dashboard/tax-manager/regulatory"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/tax-manager/audit-trail"}
                title="Audit"
                icon={<Clock />}
                href="/dashboard/tax-manager/audit-trail"
              />
            </SidebarMenu>
            <SidebarMenu title="Account">
              <SidebarItem
                isActive={pathname === "/dashboard/tax-manager/settings"}
                title="Settings"
                icon={<User />}
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
              icon={<Home />}
              isActive={pathname === "/dashboard/staff-accountant"}
              href="/dashboard/staff-accountant"
            />
            
            <SidebarMenu title="Work">
              <SidebarItem
                isActive={pathname === "/dashboard/staff-accountant/nexus-tasks"}
                title="Tasks"
                icon={<CheckSquare />}
                href="/dashboard/staff-accountant/nexus-tasks"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/staff-accountant/data-entry"}
                title="Data Entry"
                icon={<Database />}
                href="/dashboard/staff-accountant/data-entry"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/staff-accountant/clients"}
                title="Clients"
                icon={<Building2 />}
                href="/dashboard/staff-accountant/clients"
              />
            </SidebarMenu>
            
            <SidebarMenu title="Monitoring">
              <SidebarItem
                isActive={pathname === "/dashboard/staff-accountant/monitoring"}
                title="Tasks"
                icon={<Activity />}
                href="/dashboard/staff-accountant/monitoring"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/staff-accountant/alerts"}
                title="Alerts"
                icon={<AlertTriangle />}
                href="/dashboard/staff-accountant/alerts"
              />
            </SidebarMenu>
            
            <SidebarMenu title="Support">
              <SidebarItem
                isActive={pathname === "/dashboard/staff-accountant/client-support"}
                title="Help"
                icon={<HelpCircle />}
                href="/dashboard/staff-accountant/client-support"
              />
            </SidebarMenu>
            
            <SidebarMenu title="Account">
              <SidebarItem
                isActive={pathname === "/dashboard/staff-accountant/settings"}
                title="Settings"
                icon={<User />}
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
              icon={<Home />}
              isActive={pathname === "/dashboard/system-admin"}
              href="/dashboard/system-admin"
            />
            <SidebarMenu title="System">
              <SidebarItem
                isActive={pathname === "/dashboard/system-admin/system-monitoring"}
                title="Monitoring"
                icon={<Activity />}
                href="/dashboard/system-admin/system-monitoring"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/system-admin/user-management"}
                title="Users"
                icon={<Users />}
                href="/dashboard/system-admin/user-management"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/system-admin/integrations"}
                title="Integrations"
                icon={<Package />}
                href="/dashboard/system-admin/integrations"
              />
            </SidebarMenu>
            <SidebarMenu title="Operations">
              <SidebarItem
                isActive={pathname === "/dashboard/system-admin/backup-recovery"}
                title="Backup"
                icon={<Database />}
                href="/dashboard/system-admin/backup-recovery"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/system-admin/audit-logs"}
                title="Logs"
                icon={<Eye />}
                href="/dashboard/system-admin/audit-logs"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/system-admin/configuration"}
                title="Config"
                icon={<User />}
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
              icon={<Home />}
              isActive={pathname === "/client-portal"}
              href="/client-portal"
            />
            <SidebarMenu title="Compliance">
              <SidebarItem
                isActive={pathname === "/client-portal/compliance"}
                title="Compliance"
                icon={<DollarSign />}
                href="/client-portal/compliance"
              />
              <SidebarItem
                isActive={pathname === "/client-portal/reports"}
                title="Reports"
                icon={<BarChart3 />}
                href="/client-portal/reports"
              />
            </SidebarMenu>
            <SidebarMenu title="Data">
              <SidebarItem
                isActive={pathname === "/client-portal/upload"}
                title="Upload"
                icon={<CreditCard />}
                href="/client-portal/upload"
              />
            </SidebarMenu>
            <SidebarMenu title="Support">
              <SidebarItem
                isActive={pathname === "/client-portal/communications"}
                title="Messages"
                icon={<Users />}
                href="/client-portal/communications"
              />
              <SidebarItem
                isActive={pathname === "/client-portal/help"}
                title="Help"
                icon={<Code />}
                href="/client-portal/help"
              />
            </SidebarMenu>
            <SidebarMenu title="Account">
              <SidebarItem
                isActive={pathname === "/client-portal/account"}
                title="Account"
                icon={<User />}
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
              icon={<Home />}
              isActive={pathname === "/"}
              href="/"
            />
            <SidebarMenu title="Dashboards">
              <SidebarItem
                isActive={pathname === "/dashboard/managing-partner"}
                title="Partner"
                icon={<DollarSign />}
                href="/dashboard/managing-partner"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/tax-manager"}
                title="Manager"
                icon={<CreditCard />}
                href="/dashboard/tax-manager"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/staff-accountant"}
                title="Staff"
                icon={<Users />}
                href="/dashboard/staff-accountant"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/system-admin"}
                title="Admin"
                icon={<Code />}
                href="/dashboard/system-admin"
              />
              <SidebarItem
                isActive={pathname === "/client-portal"}
                title="Client"
                icon={<Building2 />}
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
        className={`sidebar main-sidebar ${Sidebar({
          collapsed: collapsed,
        })}`}
      >
        <div className={Sidebar.Header()}>
          <CompaniesDropdown />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            {getNavigationItems()}
          </div>
          <div className={Sidebar.Footer()}>
          </div>
        </div>
      </div>
    </aside>
  );
};
