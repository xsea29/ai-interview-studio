import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Settings, User, Link2, Menu, Shield, Building2, ChevronDown, Users, Briefcase, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationBell, NotificationCenter, NotificationModal } from "@/components/notifications";
import { useNotificationContext } from "@/contexts/NotificationContext";
import { useAuth } from "@/auth/useAuth";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };
  
  const {
    notifications,
    unreadCount,
    actionRequiredCount,
    isOpen: isNotificationCenterOpen,
    selectedNotification,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAll,
    toggleCenter,
    closeCenter,
    openNotificationDetail,
    closeNotificationDetail,
  } = useNotificationContext();
  
  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const isInterviewActive = location.pathname.startsWith("/interviews");

  const navLinks = [
    { path: "/", label: "Dashboard" },
    { path: "/analytics", label: "Analytics" },
    { path: "/integrations", label: "Integrations", icon: Link2 },
  ];

  const interviewSubLinks = [
    { path: "/interviews/candidates", label: "Candidates", icon: Users },
    { path: "/interviews/jobs", label: "Jobs", icon: Briefcase },
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
                  {/* Mobile Interview Section */}
                  <div className="pt-2">
                    <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Interviews
                    </p>
                    {interviewSubLinks.map((link) => (
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
                        <link.icon className="h-4 w-4" />
                        {link.label}
                      </Link>
                    ))}
                  </div>
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
          {navLinks.slice(0, 1).map((link) => (
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
          
          {/* Interview Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "text-muted-foreground hover:text-foreground gap-1",
                  isInterviewActive && "text-foreground bg-muted"
                )}
              >
                Interviews
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44 bg-popover border border-border">
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/interviews/candidates" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Candidates
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/interviews/jobs" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Jobs
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {navLinks.slice(1).map((link) => (
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
          <Link to="/onboarding" className="hidden md:block">
            <Button variant="ghost" size="icon" className="text-muted-foreground" title="Company Onboarding">
              <Building2 className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/admin" className="hidden md:block">
            <Button variant="ghost" size="icon" className="text-muted-foreground" title="Platform Admin">
              <Shield className="h-4 w-4" />
            </Button>
          </Link>
          <NotificationBell 
            unreadCount={unreadCount} 
            onClick={toggleCenter}
          />
          <Link to="/settings" className="hidden md:block">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Settings className="h-4.5 w-4.5" />
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ml-1 sm:ml-2 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer">
                <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-popover border border-border">
              {user?.email && (
                <>
                  <div className="px-3 py-2 text-sm text-muted-foreground truncate">
                    {user.email}
                  </div>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Notification Center Sidebar */}
      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={closeCenter}
        notifications={notifications}
        unreadCount={unreadCount}
        actionRequiredCount={actionRequiredCount}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onDismiss={dismissNotification}
        onClearAll={clearAll}
        onViewDetails={openNotificationDetail}
      />

      {/* Notification Detail Modal */}
      <NotificationModal
        notification={selectedNotification}
        isOpen={!!selectedNotification}
        onClose={closeNotificationDetail}
      />
    </header>
  );
}
