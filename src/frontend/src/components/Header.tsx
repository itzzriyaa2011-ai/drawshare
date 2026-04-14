import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bookmark,
  Home,
  LogIn,
  LogOut,
  TrendingUp,
  Upload,
  User,
} from "lucide-react";
import { useAuth } from "../hooks/use-auth";

export function Header() {
  const { isAuthenticated, login, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 mr-4 shrink-0"
          data-ocid="header.logo_link"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-sm">
              r
            </span>
          </div>
          <span className="font-display font-bold text-xl text-foreground tracking-tight">
            riartsy
          </span>
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
            activeProps={{ className: "bg-primary/10 text-primary" }}
            data-ocid="header.home_link"
          >
            <Home size={16} />
            <span>Home</span>
          </Link>
          <Link
            to="/trending"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
            activeProps={{ className: "bg-primary/10 text-primary" }}
            data-ocid="header.trending_link"
          >
            <TrendingUp size={16} />
            <span>Trending</span>
          </Link>
          {isAuthenticated && (
            <Link
              to="/saved"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
              activeProps={{ className: "bg-primary/10 text-primary" }}
              data-ocid="header.saved_link"
            >
              <Bookmark size={16} />
              <span>Saved</span>
            </Link>
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-auto">
          {isAuthenticated ? (
            <>
              <Button
                variant="default"
                size="sm"
                className="hidden sm:flex items-center gap-1.5"
                onClick={() => navigate({ to: "/upload" })}
                data-ocid="header.upload_button"
              >
                <Upload size={15} />
                Upload
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex items-center gap-1.5"
                onClick={() => navigate({ to: "/me" })}
                data-ocid="header.profile_button"
              >
                <User size={15} />
                My Profile
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                aria-label="Log out"
                data-ocid="header.logout_button"
              >
                <LogOut size={16} />
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={login}
              className="flex items-center gap-1.5"
              data-ocid="header.login_button"
            >
              <LogIn size={15} />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
