import React, { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useGetMe, useAdminLogout, getGetMeQueryKey } from "@workspace/api-client-react";
import { LayoutDashboard, Users, LogOut, Menu, X, Briefcase, KeyRound } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { KampulseLogo } from "@/components/KampulseLogo";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [location] = useLocation();

  const { error } = useGetMe({
    query: {
      queryKey: getGetMeQueryKey(),
      enabled: isAuthenticated,
      retry: false,
    },
  });

  const logoutMutation = useAdminLogout();

  useEffect(() => {
    // Only redirect once auth state has finished loading from localStorage
    if (!isLoading && !isAuthenticated) {
      setLocation("/admin/login");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  useEffect(() => {
    if (error && (error as any).status === 401) {
      logout();
      setLocation("/admin/login");
    }
  }, [error, logout, setLocation]);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        logout();
        setLocation("/admin/login");
      },
    });
  };

  if (isLoading || !isAuthenticated) return null;

  const navLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/applications", label: "Applications", icon: Users },
    { href: "/admin/jobs", label: "Job Vacancies", icon: Briefcase },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-sidebar/90 backdrop-blur border-b border-sidebar-border text-sidebar-foreground">
        <div className="flex items-center gap-2">
          <KampulseLogo className="h-9 w-auto drop-shadow-lg" />
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-sidebar/90 backdrop-blur border-r border-sidebar-border text-sidebar-foreground flex flex-col`}
      >
        <div className="hidden md:flex px-6 py-5 items-center justify-center border-b border-sidebar-border/50">
          <KampulseLogo className="w-44 h-auto drop-shadow-lg" />
        </div>

        <div className="p-4 flex flex-col gap-1 flex-1">
          <div className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-4 mt-2 px-2">
            Menu
          </div>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-sidebar-border/50 mt-auto">
          <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-sidebar-accent/30 rounded-md">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-medium truncate">{user?.name}</div>
              <div className="text-xs text-sidebar-foreground/60 truncate">{user?.role}</div>
            </div>
          </div>
          <Link
            href="/admin/change-password"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
          >
            <KeyRound className="w-4 h-4" />
            Change Password
          </Link>
          <div className="flex items-center gap-1 px-1 mt-1">
            <ThemeToggle className="text-sidebar-foreground/70 hover:text-sidebar-foreground flex-1 justify-start" />
            <span className="text-xs text-sidebar-foreground/50 flex-1">Theme</span>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-auto p-4 md:p-8 bg-background/60 backdrop-blur-sm">{children}</div>
      </main>
    </div>
  );
}
