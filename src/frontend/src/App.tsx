import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";
import NotFound from "./pages/NotFound";

const FeedPage = lazy(() => import("./pages/Feed"));
const ExplorePage = lazy(() => import("./pages/Explore"));
const PostDetailPage = lazy(() => import("./pages/PostDetail"));
const UploadPage = lazy(() => import("./pages/Upload"));
const ProfilePage = lazy(() => import("./pages/Profile"));
const MyProfilePage = lazy(() => import("./pages/MyProfile"));
const SearchPage = lazy(() => import("./pages/Search"));

function PageLoader() {
  return (
    <Layout>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {Array.from({ length: 8 }, (_, i) => `skeleton-${i}`).map((key) => (
          <div
            key={key}
            className="break-inside-avoid rounded-2xl overflow-hidden border border-border"
          >
            <Skeleton
              className="w-full"
              style={{ height: `${Math.floor(Math.random() * 120 + 160)}px` }}
            />
            <div className="p-3 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="bottom-right" />
    </>
  ),
  notFoundComponent: NotFound,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <FeedPage />
    </Suspense>
  ),
});

const exploreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/explore",
  validateSearch: (search: Record<string, unknown>): { q?: string } => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ExplorePage />
    </Suspense>
  ),
});

const postRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/post/$id",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <PostDetailPage />
    </Suspense>
  ),
});

const uploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/upload",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <UploadPage />
    </Suspense>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile/$id",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ProfilePage />
    </Suspense>
  ),
});

const meRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/me",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <MyProfilePage />
    </Suspense>
  ),
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search",
  validateSearch: (search: Record<string, unknown>): { q?: string } => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <SearchPage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  exploreRoute,
  postRoute,
  uploadRoute,
  profileRoute,
  meRoute,
  searchRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
