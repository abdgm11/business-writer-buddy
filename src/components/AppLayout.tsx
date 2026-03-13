import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sparkles, LayoutDashboard, PenTool, BookOpen, Settings, LogOut, Award, HelpCircle, Fingerprint } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
{ to: "/coach", label: "Coach", icon: PenTool },
{ to: "/lessons", label: "Lessons", icon: BookOpen },
{ to: "/report", label: "Report Card", icon: Award },
{ to: "/support", label: "Help & Support", icon: HelpCircle },
{ to: "/settings", label: "Settings", icon: Settings }];


export const AppLayout = ({ children }: {children: ReactNode;}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-sidebar lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-gold">
            <Fingerprint className="h-4 w-4 text-accent-foreground" />
          </div>
          <span className="text-lg font-bold text-sidebar-foreground">
            Prose<span className="text-sidebar-primary">AI</span>
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active ?
                "bg-sidebar-accent text-sidebar-primary" :
                "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"}`
                }>
                
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>);

          })}
        </nav>
        <div className="border-t border-sidebar-border p-4 space-y-1">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs text-sidebar-foreground/60">Theme</span>
            <ThemeToggle />
          </div>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors">
            
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b bg-card px-4 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded gradient-navy">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
            </div>
            <span className="font-bold text-foreground">ProseAI</span>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <nav className="flex gap-1">
            {navItems.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`rounded-lg p-2 ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
                    
                  <item.icon className="h-4 w-4" />
                </Link>);

              })}
            </nav>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>);

};