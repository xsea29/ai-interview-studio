import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Bell, Settings, User, Link2, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { path: "/", label: "Dashboard" },
    { path: "/interviews", label: "Interviews" },
    { path: "/integrations", label: "Integrations", icon: Link2 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="container flex h-14 sm:h-16 items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile menu trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-muted-foreground -ml-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2.5 p-4 border-b border-border">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg ai-gradient">
                    <Brain className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-lg font-semibold tracking-tight">InterviewAI</span>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        isActive(link.path)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      {link.icon && <link.icon className="h-4 w-4" />}
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="p-4 border-t border-border">
                  <Link
                    to="/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive("/settings")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg ai-gradient">
              <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            <span className="text-base sm:text-lg font-semibold tracking-tight hidden sm:block">InterviewAI</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path}>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "text-muted-foreground hover:text-foreground",
                  isActive(link.path) && "text-foreground bg-muted"
                )}
              >
                {link.icon && <link.icon className="h-4 w-4 mr-1.5" />}
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8 sm:h-9 sm:w-9">
            <Bell className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          </Button>
          <Link to="/settings" className="hidden md:block">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Settings className="h-4.5 w-4.5" />
            </Button>
          </Link>
          <div className="ml-1 sm:ml-2 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
        </div>
      </div>
    </header>
  );
}
