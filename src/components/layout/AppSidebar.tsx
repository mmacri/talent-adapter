import { NavLink, useLocation } from "react-router-dom";
import { 
  FileText, 
  Layers, 
  Briefcase, 
  Mail, 
  Layout, 
  BarChart3, 
  Settings,
  User,
  FileBarChart
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "Master Resume", url: "/master", icon: FileText },
  { title: "Variants", url: "/variants", icon: Layers },
  { title: "Resume Viewer", url: "/viewer", icon: FileBarChart },
  { title: "Job Applications", url: "/jobs", icon: Briefcase },
  { title: "Cover Letters", url: "/cover-letters", icon: Mail },
  { title: "Templates", url: "/templates", icon: Layout },
];

const utilityItems = [
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isMobile = useIsMobile();
  const isCollapsed = state === "collapsed";
  
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };
  
  const getNavClassName = (path: string) => {
    const baseClasses = "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors touch-manipulation";
    const activeClasses = "bg-primary text-primary-foreground hover:bg-primary/90";
    const inactiveClasses = "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";
    
    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
  };

  return (
    <Sidebar 
      className={`${isCollapsed ? "w-16" : "w-64"} ${isMobile ? "z-50" : ""}`} 
      collapsible={isMobile ? "offcanvas" : "icon"}
      variant={isMobile ? "floating" : "sidebar"}
    >
      <SidebarContent>
        {/* Brand Header - Mobile optimized */}
        <div className={`flex items-center gap-3 px-4 ${isMobile ? 'py-4' : 'py-6'} border-b border-sidebar-border`}>
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <FileBarChart className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className={isCollapsed ? "hidden" : "block"}>
            <h1 className={`font-bold text-sidebar-foreground ${isMobile ? 'text-base' : 'text-lg'}`}>
              Resume Manager
            </h1>
            <p className="text-xs text-sidebar-foreground/60">Mike Macri</p>
          </div>
        </div>

        {/* Main Navigation - Enhanced mobile experience */}
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className={isMobile ? "px-3 py-2 text-xs" : ""}>
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="p-0">
                    <NavLink to={item.url} className={getNavClassName(item.url)}>
                      <item.icon className={`flex-shrink-0 ${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
                      <span className={`${isCollapsed ? "hidden" : "block"} ${isMobile ? 'font-medium' : ''}`}>
                        {item.title}
                      </span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Utility Navigation */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent className="px-2">
            <SidebarMenu className="space-y-1">
              {utilityItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="p-0">
                    <NavLink to={item.url} className={getNavClassName(item.url)}>
                      <item.icon className={`flex-shrink-0 ${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
                      <span className={`${isCollapsed ? "hidden" : "block"} ${isMobile ? 'font-medium' : ''}`}>
                        {item.title}
                      </span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Profile - Mobile optimized */}
        <div className={`mt-auto ${isMobile ? 'p-3' : 'p-4'} border-t border-sidebar-border ${isCollapsed ? "hidden" : "block"}`}>
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center ${isMobile ? 'w-10 h-10' : 'w-8 h-8'} bg-accent rounded-full`}>
              <User className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} text-accent-foreground`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`${isMobile ? 'text-sm' : 'text-sm'} font-medium text-sidebar-foreground truncate`}>
                Mike Macri
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                MikeMacri@gmail.com
              </p>
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}