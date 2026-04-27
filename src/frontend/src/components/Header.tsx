import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Compass,
  Home,
  LogIn,
  LogOut,
  Search,
  Upload,
  User,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/use-auth";

export function Header() {
  const { isAuthenticated, login, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/search", search: { q: searchQuery.trim() } });
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0 group"
          data-ocid="header.logo_link"
        >
          <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shadow-subtle">
            <span className="text-white font-display font-bold text-sm">P</span>
          </div>
          <span className="font-display font-bold text-xl text-foreground tracking-tight group-hover:text-primary transition-colors duration-200">
            PicVibe
          </span>
        </Link>

        {/* Search bar — center, desktop */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-sm mx-4 relative"
        >
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            type="search"
            placeholder="Search photos, people…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-muted border-transparent focus:bg-background focus:border-input transition-colors duration-200"
            data-ocid="header.search_input"
          />
        </form>

        {/* Nav links — desktop */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
            activeProps={{ className: "bg-primary/10 !text-primary" }}
            data-ocid="header.home_link"
          >
            <Home size={16} />
            <span>Home</span>
          </Link>
          <Link
            to="/explore"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
            activeProps={{ className: "bg-primary/10 !text-primary" }}
            data-ocid="header.explore_link"
          >
            <Compass size={16} />
            <span>Explore</span>
          </Link>
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
                Profile
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
