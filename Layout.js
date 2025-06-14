
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Activity, GraduationCap, PanelLeftOpen, PanelRightOpen, Menu, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { CourseProvider } from "@/components/CourseProvider";

const navigationItems = [
  {
    title: "עמוד הבית",
    url: createPageUrl("Home"),
    icon: Home,
  },
  {
    title: "מעקב התקדמות",
    url: createPageUrl("ProgressTracker"),
    icon: Activity,
  },
];

const DesktopHeader = () => {
  const { open, setOpen } = useSidebar();
  return (
    <header className="hidden md:flex items-center bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-3 sticky top-0 z-10">
      <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
        {open ? <PanelRightOpen className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
      </Button>
    </header>
  );
};

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <CourseProvider>
      <SidebarProvider>
        <style>{`
        :root {
          --bme-blue: #003d82;
          --bme-cyan: #00a0e0;
          --bme-pink: #e6007e;
          --bme-yellow: #ffc20e;
        }
        body {
          direction: rtl;
          font-family: 'Assistant', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>
        
        <div className="min-h-screen flex w-full bg-slate-50 flex-row-reverse">
          <Sidebar className="border-r border-slate-200 bg-white/90 backdrop-blur-md">
            <SidebarHeader className="border-b border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-bme-blue rounded-xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-slate-900">מדריך אקדמי BME</h2>
                  <p className="text-sm text-slate-500">הפקולטה להנדסה ביו-רפואית</p>
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="p-4">
              <SidebarGroup>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-xl mb-1 ${
                          location.pathname === item.url 
                            ? 'bg-blue-50 text-blue-700 shadow-sm' 
                            : 'text-slate-600'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          <main className="flex-1 flex flex-col">
            {/* Mobile Header */}
            <header className="flex items-center justify-between bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-4 md:hidden sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-bme-blue" />
                <h1 className="text-lg font-bold text-slate-900">מדריך BME</h1>
              </div>
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
            </header>

            {/* Desktop Header */}
            <DesktopHeader />

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </CourseProvider>
  );
}
