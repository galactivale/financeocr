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
import { 
  Home as MuiHome,
  People as MuiPeople,
  Business as MuiBusiness,
  Warning as MuiWarning,
  AttachMoney as MuiAttachMoney,
  BarChart as MuiBarChart,
  Code as MuiCode,
  Visibility as MuiVisibility,
  MonitorHeart as MuiMonitorHeart,
  Scale as MuiScale,
  Description as MuiDescription,
  LocationOn as MuiLocationOn,
  AssignmentTurnedIn as MuiAssignmentTurnedIn,
  Security as MuiSecurity,
  Message as MuiMessage,
  TrendingUp as MuiTrendingUp,
  CheckBox as MuiCheckBox,
  Storage as MuiStorage,
  Help as MuiHelp,
  Notifications as MuiNotifications,
  Person as MuiPerson,
  History as MuiHistory,
  AccessTime as MuiAccessTime,
  PieChart as MuiPieChart,
  ShowChart as MuiShowChart,
  CreditCard as MuiCreditCard
} from "@mui/icons-material";
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
              icon={<MuiHome />}
              isActive={pathname === "/dashboard/managing-partner"}
              href="/dashboard/managing-partner"
            />
            
            <SidebarMenu title="Overview">
              <SidebarItem
                isActive={pathname === "/dashboard/managing-partner/monitoring"}
                title="Monitoring"
                icon={<MuiMonitorHeart />}
                href="/dashboard/managing-partner/monitoring"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/managing-partner/alerts"}
                title="Alerts"
                icon={<MuiWarning />}
                href="/dashboard/managing-partner/alerts"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/managing-partner/analytics"}
                title="Analytics"
                icon={<MuiTrendingUp />}
                href="/dashboard/managing-partner/analytics"
              />
            </SidebarMenu>

            <SidebarMenu title="Management">
              <SidebarItem
                isActive={pathname === "/dashboard/managing-partner/clients"}
                title="Clients"
                icon={<MuiBusiness />}
                href="/dashboard/managing-partner/clients"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/managing-partner/team-management"}
                title="Team"
                icon={<MuiPeople />}
                href="/dashboard/managing-partner/team-management"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/managing-partner/risk-management"}
                title="Risk"
                icon={<MuiSecurity />}
                href="/dashboard/managing-partner/risk-management"
              />
            </SidebarMenu>

            <SidebarMenu title="Compliance">
              <SidebarItem
                isActive={pathname === "/dashboard/managing-partner/compliance"}
                title="Compliance"
                icon={<MuiAssignmentTurnedIn />}
                href="/dashboard/managing-partner/compliance"
              />
            </SidebarMenu>

            <SidebarItem
              isActive={pathname === "/dashboard/managing-partner/settings"}
              title="Settings"
              icon={<MuiPerson />}
              href="/dashboard/managing-partner/settings"
            />
          </>
        );

      case 'tax-manager':
        return (
          <>
            <SidebarItem
              title="Dashboard"
              icon={<MuiHome />}
              isActive={pathname === "/dashboard/tax-manager"}
              href="/dashboard/tax-manager"
            />
            <SidebarMenu title="Nexus Management">
              <SidebarItem
                isActive={pathname === "/dashboard/tax-manager/monitoring"}
                title="Monitoring"
                icon={<MuiMonitorHeart />}
                href="/dashboard/tax-manager/monitoring"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/tax-manager/alerts"}
                title="Alerts"
                icon={<MuiWarning />}
                href="/dashboard/tax-manager/alerts"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/tax-manager/clients"}
                title="Clients"
                icon={<MuiBusiness />}
                href="/dashboard/tax-manager/clients"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/tax-manager/reports"}
                title="Reports"
                icon={<MuiShowChart />}
                href="/dashboard/tax-manager/reports"
              />
            </SidebarMenu>

            <SidebarMenu title="Tools">
              <SidebarItem
                isActive={pathname === "/dashboard/tax-manager/communications"}
                title="Messages"
                icon={<MuiMessage />}
                href="/dashboard/tax-manager/communications"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/tax-manager/liability"}
                title="Liability"
                icon={<MuiScale />}
                href="/dashboard/tax-manager/liability"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/tax-manager/regulatory"}
                title="Regulatory"
                icon={<MuiVisibility />}
                href="/dashboard/tax-manager/regulatory"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/tax-manager/audit-trail"}
                title="Audit"
                icon={<MuiAccessTime />}
                href="/dashboard/tax-manager/audit-trail"
              />
            </SidebarMenu>

            <SidebarItem
              isActive={pathname === "/dashboard/tax-manager/settings"}
              title="Settings"
              icon={<MuiPerson />}
              href="/dashboard/tax-manager/settings"
            />
          </>
        );


      case 'system-admin':
        return (
          <>
            <SidebarItem
              title="Dashboard"
              icon={<MuiHome />}
              isActive={pathname === "/dashboard/system-admin"}
              href="/dashboard/system-admin"
            />
            
            <SidebarMenu title="System Management">
              <SidebarItem
                isActive={pathname === "/dashboard/system-admin/system-monitoring"}
                title="Monitoring"
                icon={<MuiMonitorHeart />}
                href="/dashboard/system-admin/system-monitoring"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/system-admin/user-management"}
                title="Users"
                icon={<MuiPeople />}
                href="/dashboard/system-admin/user-management"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/system-admin/integrations"}
                title="Integrations"
                icon={<MuiStorage />}
                href="/dashboard/system-admin/integrations"
              />
            </SidebarMenu>

            <SidebarMenu title="Operations">
              <SidebarItem
                isActive={pathname === "/dashboard/system-admin/backup-recovery"}
                title="Backup"
                icon={<MuiStorage />}
                href="/dashboard/system-admin/backup-recovery"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/system-admin/audit-logs"}
                title="Logs"
                icon={<MuiVisibility />}
                href="/dashboard/system-admin/audit-logs"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/system-admin/configuration"}
                title="Config"
                icon={<MuiPerson />}
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
              icon={<MuiHome />}
              isActive={pathname === "/client-portal"}
              href="/client-portal"
            />
            <SidebarMenu title="Compliance">
              <SidebarItem
                isActive={pathname === "/client-portal/compliance"}
                title="Compliance"
                icon={<MuiAttachMoney />}
                href="/client-portal/compliance"
              />
              <SidebarItem
                isActive={pathname === "/client-portal/reports"}
                title="Reports"
                icon={<MuiBarChart />}
                href="/client-portal/reports"
              />
            </SidebarMenu>
            <SidebarMenu title="Data">
              <SidebarItem
                isActive={pathname === "/client-portal/upload"}
                title="Upload"
                icon={<MuiCreditCard />}
                href="/client-portal/upload"
              />
            </SidebarMenu>
            <SidebarMenu title="Support">
              <SidebarItem
                isActive={pathname === "/client-portal/communications"}
                title="Messages"
                icon={<MuiPeople />}
                href="/client-portal/communications"
              />
              <SidebarItem
                isActive={pathname === "/client-portal/help"}
                title="Help"
                icon={<MuiCode />}
                href="/client-portal/help"
              />
            </SidebarMenu>
            <SidebarMenu title="Account">
              <SidebarItem
                isActive={pathname === "/client-portal/account"}
                title="Account"
                icon={<MuiPerson />}
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
              icon={<MuiHome />}
              isActive={pathname === "/"}
              href="/"
            />
            <SidebarMenu title="Dashboards">
              <SidebarItem
                isActive={pathname === "/dashboard/managing-partner"}
                title="Partner"
                icon={<MuiAttachMoney />}
                href="/dashboard/managing-partner"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/tax-manager"}
                title="Manager"
                icon={<MuiCreditCard />}
                href="/dashboard/tax-manager"
              />
              <SidebarItem
                isActive={pathname === "/dashboard/system-admin"}
                title="Admin"
                icon={<MuiCode />}
                href="/dashboard/system-admin"
              />
              <SidebarItem
                isActive={pathname === "/client-portal"}
                title="Client"
                icon={<MuiBusiness />}
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
