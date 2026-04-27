import { u as useAuth, a as useNavigate, r as reactExports, j as jsxRuntimeExports, L as Layout, B as Button, C as Compass, S as Skeleton } from "./index-Py_44o3M.js";
import { P as PostCard } from "./PostCard-DOWsnu6z.js";
import { u as useHomeFeed, a as useLikePost, b as useSavePost } from "./use-posts-_6MsgZwc.js";
import { C as Camera } from "./camera-DF_9cTwP.js";
import { U as Users } from "./users-DFxMFg7r.js";
import { L as LoaderCircle } from "./loader-circle-BXm1Cabe.js";
import "./proxy-e2KdTrn6.js";
const PAGE_SIZE = 20n;
function FeedSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "masonry-grid", "data-ocid": "feed.loading_state", children: Array.from({ length: 12 }, (_, i) => i).map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "masonry-item rounded-2xl overflow-hidden border border-border bg-card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Skeleton,
          {
            className: "w-full",
            style: { height: `${160 + i % 5 * 32}px` }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2" })
        ] })
      ]
    },
    i
  )) });
}
function FeedPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [offset, setOffset] = reactExports.useState(0n);
  const [allPosts, setAllPosts] = reactExports.useState([]);
  const [hasMore, setHasMore] = reactExports.useState(true);
  const [likedIds, setLikedIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [savedIds, setSavedIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const { data, isLoading, isFetching: isPageFetching } = useHomeFeed(offset);
  const likeMutation = useLikePost();
  const saveMutation = useSavePost();
  if (data && data.length > 0 && !allPosts.some((p) => p.id === data[0].id)) {
    setAllPosts((prev) => offset === 0n ? data : [...prev, ...data]);
    setHasMore(data.length === Number(PAGE_SIZE));
  } else if (data && data.length === 0 && offset === 0n && allPosts.length > 0) {
    setAllPosts([]);
    setHasMore(false);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    !isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "relative bg-card border border-border rounded-2xl p-8 mb-8 overflow-hidden",
        "data-ocid": "feed.auth_banner",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 gradient-primary opacity-5 pointer-events-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row items-center gap-6 relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl font-bold text-foreground mb-2", children: "Share Your World" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-5 max-w-md", children: "Discover stunning photos from creators around the world. Sign in to follow people, like, and save your favourites." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    onClick: login,
                    size: "lg",
                    "data-ocid": "feed.login_cta_button",
                    children: "Get Started — It's Free"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "lg",
                    onClick: () => navigate({ to: "/explore" }),
                    "data-ocid": "feed.browse_explore_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Compass, { size: 16, className: "mr-2" }),
                      "Browse Explore"
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center shadow-elevated shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { size: 40, className: "text-white" }) })
          ] })
        ]
      }
    ),
    isLoading && allPosts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(FeedSkeleton, {}) : allPosts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex flex-col items-center justify-center py-24 text-center",
        "data-ocid": "feed.empty_state",
        children: isAuthenticated ? (
          /* Authenticated but not following anyone */
          /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 32, className: "text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-semibold text-foreground mb-2", children: "Follow someone to see their posts here" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs mb-6", children: "Your feed shows photos from people you follow. Head to Explore to discover creators and follow the ones you love." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: () => navigate({ to: "/explore" }),
                "data-ocid": "feed.go_explore_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Compass, { size: 16, className: "mr-2" }),
                  "Discover Creators"
                ]
              }
            )
          ] })
        ) : (
          /* Not authenticated — minimal prompt since banner is above */
          /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { size: 32, className: "text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-semibold text-foreground mb-2", children: "Nothing here yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs mb-6", children: "Sign in and follow people to build your personalised feed." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: login, "data-ocid": "feed.login_button", children: "Sign In" })
          ] })
        )
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "masonry-grid", "data-ocid": "feed.post_list", children: allPosts.map((post, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        PostCard,
        {
          post,
          index: idx,
          isLiked: likedIds.has(String(post.id)),
          isSaved: savedIds.has(String(post.id)),
          onLike: isAuthenticated ? (id) => {
            setLikedIds((prev) => {
              const next = new Set(prev);
              if (next.has(String(id))) next.delete(String(id));
              else next.add(String(id));
              return next;
            });
            likeMutation.mutate(id);
          } : void 0,
          onSave: isAuthenticated ? (id) => {
            setSavedIds((prev) => {
              const next = new Set(prev);
              if (next.has(String(id))) next.delete(String(id));
              else next.add(String(id));
              return next;
            });
            saveMutation.mutate(id);
          } : void 0
        },
        String(post.id)
      )) }),
      hasMore && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex justify-center mt-10",
          "data-ocid": "feed.load_more_section",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "lg",
              onClick: () => setOffset((prev) => prev + PAGE_SIZE),
              disabled: isPageFetching,
              className: "rounded-xl px-8",
              "data-ocid": "feed.load_more_button",
              children: isPageFetching ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "mr-2 animate-spin" }),
                "Loading…"
              ] }) : "Load more"
            }
          )
        }
      ),
      !hasMore && allPosts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-center text-muted-foreground text-sm py-8",
          "data-ocid": "feed.end_of_feed",
          children: "You're all caught up ✦"
        }
      )
    ] })
  ] });
}
export {
  FeedPage as default
};
