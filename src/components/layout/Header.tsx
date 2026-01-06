import { Button } from "@/components/ui/button";
import { Brain, Bell, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg ai-gradient">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight">InterviewAI</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Dashboard
            </Button>
          </Link>
          <Link to="/interviews">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Interviews
            </Button>
          </Link>
          <Link to="/candidates">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Candidates
            </Button>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Bell className="h-4.5 w-4.5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Settings className="h-4.5 w-4.5" />
          </Button>
          <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-4 w-4" />
          </div>
        </div>
      </div>
    </header>
  );
}
