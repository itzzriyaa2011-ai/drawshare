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

// Lazy-loaded pages
const FeedPage = lazy(() => import("./pages/Feed"));
const DrawingDetailPage = lazy(() => import("./pages/DrawingDetail"));
const UploadPage = lazy(() => import("./pages/Upload"));
const ProfilePage = lazy(() => import("./pages/Profile"));
const MyProfilePage = lazy(() => import("./pages/MyProfile"));
const TrendingPage = lazy(() => import("./pages/Trending"));
const SavedPage = lazy(() => import("./pages/Saved"));

function PageLoader() {
  return (
    <Layout>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }, (_, i) => `skeleton-${i}`).map((key) => (
          <div
            key={key}
            className="rounded-2xl overflow-hidden border border-border"
          >
            <Skeleton className="aspect-[4/3] w-full" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

// Route tree
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
  validateSearch: (
    search: Record<string, unknown>,
  ): { tag?: string; q?: string } => ({
    tag: typeof search.tag === "string" ? search.tag : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <FeedPage />
    </Suspense>
  ),
});

const trendingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/trending",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <TrendingPage />
    </Suspense>
  ),
});

const savedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/saved",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <SavedPage />
    </Suspense>
  ),
});

const drawingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/drawing/$id",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <DrawingDetailPage />
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

const routeTree = rootRoute.addChildren([
  indexRoute,
  trendingRoute,
  savedRoute,
  drawingRoute,
  uploadRoute,
  profileRoute,
  meRoute,
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
