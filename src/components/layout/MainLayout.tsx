import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider
      defaultOpen={!isMobile}
      className={isMobile ? "mobile" : "desktop"}
    >
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header - Enhanced for mobile with safe areas */}
          <header className="h-12 md:h-14 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40 flex items-center px-3 md:px-4 lg:px-6 safe-top">
            <SidebarTrigger className="mr-2 touch-target" />
            <div className="flex-1 flex items-center justify-between">
              <h1 className="text-sm md:text-base font-semibold text-foreground truncate">
                Resume Manager
              </h1>
              <div className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                Mike Macri
              </div>
            </div>
          </header>
          
          {/* Main Content - Mobile optimized with safe areas */}
          <main className="flex-1 overflow-auto scroll-smooth safe-bottom">
            <div className={`min-h-full ${isMobile ? 'mobile-spacing' : ''}`}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}