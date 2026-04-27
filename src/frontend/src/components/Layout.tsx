import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Compass, Home, Plus, Search, User } from "lucide-react";
import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  noPadding?: boolean;
}

const mobileNavItems = [
  { to: "/", icon: Home, label: "Home", ocid: "nav.home_link" },
  { to: "/explore", icon: Compass, label: "Explore", ocid: "nav.explore_link" },
  {
    to: "/upload",
    icon: Plus,
    label: "Post",
    ocid: "nav.upload_link",
    isAction: true,
  },
  { to: "/search", icon: Search, label: "Search", ocid: "nav.search_link" },
  { to: "/me", icon: User, label: "Profile", ocid: "nav.profile_link" },
];

export function Layout({
  children,
  fullWidth = false,
  noPadding = false,
}: LayoutProps) {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pb-20 md:pb-0">
        {fullWidth || noPadding ? (
          children
        ) : (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        )}
      </main>

      {/* Desktop footer */}
      <footer className="hidden md:block bg-card border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © {year} PicVibe. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with love using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
          {mobileNavItems.map((item) => {
            const isActive =
              item.to === "/"
                ? currentPath === "/"
                : currentPath.startsWith(item.to);

            if (item.isAction) {
              return (
                <button
                  key={item.to}
                  type="button"
                  onClick={() => navigate({ to: item.to })}
                  className="flex flex-col items-center justify-center w-12 h-12 -mt-4 rounded-full gradient-primary shadow-elevated text-white transition-lift hover:scale-105 active:scale-95"
                  aria-label={item.label}
                  data-ocid={item.ocid}
                >
                  <item.icon size={20} strokeWidth={2.5} />
                </button>
              );
            }

            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px] px-2 py-1"
                data-ocid={item.ocid}
              >
                <item.icon
                  size={22}
                  className={
                    isActive ? "text-primary" : "text-muted-foreground"
                  }
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
                <span
                  className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
