import { c as createLucideIcon, u as useAuth, a as useNavigate, r as reactExports, j as jsxRuntimeExports, L as Layout, b as Search, I as Input, B as Button, S as Skeleton } from "./index-Py_44o3M.js";
import { P as PostCard } from "./PostCard-DOWsnu6z.js";
import { c as useExplorePosts, d as useSearchPosts, a as useLikePost, b as useSavePost } from "./use-posts-_6MsgZwc.js";
import { X } from "./x-RBG6_7Va.js";
import { C as Camera } from "./camera-DF_9cTwP.js";
import { L as LoaderCircle } from "./loader-circle-BXm1Cabe.js";
import "./proxy-e2KdTrn6.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
];
const Image = createLucideIcon("image", __iconNode);
const PAGE_SIZE = 20n;
function ExploreSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "masonry-grid", "data-ocid": "explore.loading_state", children: Array.from({ length: 12 }, (_, i) => i).map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "masonry-item rounded-2xl overflow-hidden border border-border bg-card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Skeleton,
          {
            className: "w-full",
            style: { height: `${160 + i % 4 * 40}px` }
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
function ExplorePage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = reactExports.useState("");
  const [activeQuery, setActiveQuery] = reactExports.useState("");
  const searchTimerRef = reactExports.useRef(null);
  const [offset, setOffset] = reactExports.useState(0n);
  const [allPosts, setAllPosts] = reactExports.useState([]);
  const [hasMore, setHasMore] = reactExports.useState(true);
  const [searchOffset, setSearchOffset] = reactExports.useState(0n);
  const [searchAllPosts, setSearchAllPosts] = reactExports.useState([]);
  const [searchHasMore, setSearchHasMore] = reactExports.useState(true);
  const [likedIds, setLikedIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [savedIds, setSavedIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const isSearching = activeQuery.trim().length > 0;
  const {
    data: exploreData,
    isLoading: exploreLoading,
    isFetching: exploreFetching
  } = useExplorePosts(offset);
  const {
    data: searchData,
    isLoading: searchLoading,
    isFetching: searchFetching
  } = useSearchPosts(activeQuery, searchOffset);
  const likeMutation = useLikePost();
  const saveMutation = useSavePost();
  if (!isSearching && exploreData && exploreData.length > 0 && !allPosts.some((p) => p.id === exploreData[0].id)) {
    setAllPosts(
      (prev) => offset === 0n ? exploreData : [...prev, ...exploreData]
    );
    setHasMore(exploreData.length === Number(PAGE_SIZE));
  } else if (!isSearching && exploreData && exploreData.length === 0 && offset === 0n && allPosts.length > 0) {
    setAllPosts([]);
    setHasMore(false);
  }
  if (isSearching && searchData && searchData.length > 0 && !searchAllPosts.some((p) => p.id === searchData[0].id)) {
    setSearchAllPosts(
      (prev) => searchOffset === 0n ? searchData : [...prev, ...searchData]
    );
    setSearchHasMore(searchData.length === Number(PAGE_SIZE));
  } else if (isSearching && searchData && searchData.length === 0 && searchOffset === 0n) {
    setSearchAllPosts([]);
    setSearchHasMore(false);
  }
  reactExports.useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    if (searchInput.trim().length === 0) {
      setActiveQuery("");
      setSearchAllPosts([]);
      setSearchOffset(0n);
      setSearchHasMore(true);
      return;
    }
    searchTimerRef.current = setTimeout(() => {
      setActiveQuery(searchInput.trim());
      setSearchAllPosts([]);
      setSearchOffset(0n);
      setSearchHasMore(true);
    }, 400);
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [searchInput]);
  function clearSearch() {
    setSearchInput("");
    setActiveQuery("");
    setSearchAllPosts([]);
    setSearchOffset(0n);
    setSearchHasMore(true);
  }
  const displayPosts = isSearching ? searchAllPosts : allPosts;
  const isLoadingPage = isSearching ? searchLoading && searchAllPosts.length === 0 : exploreLoading && allPosts.length === 0;
  const isFetchingMore = isSearching ? searchFetching : exploreFetching;
  const showHasMore = isSearching ? searchHasMore : hasMore;
  function handleLoadMore() {
    if (isSearching) {
      setSearchOffset((prev) => prev + PAGE_SIZE);
    } else {
      setOffset((prev) => prev + PAGE_SIZE);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold text-foreground mb-1", children: "Explore" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-5", children: "Discover stunning photos from the community" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Search,
          {
            size: 16,
            className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: searchInput,
            onChange: (e) => setSearchInput(e.target.value),
            placeholder: "Search photos by title, tag, or keyword…",
            className: "pl-10 pr-10 rounded-xl h-11",
            "data-ocid": "explore.search_input"
          }
        ),
        searchInput.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: clearSearch,
            className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
            "aria-label": "Clear search",
            "data-ocid": "explore.search_clear_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 15 })
          }
        )
      ] }),
      isSearching && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-sm text-muted-foreground mt-3",
          "data-ocid": "explore.search_results_label",
          children: searchLoading ? "Searching…" : `${searchAllPosts.length} result${searchAllPosts.length !== 1 ? "s" : ""} for "${activeQuery}"`
        }
      )
    ] }),
    isLoadingPage ? /* @__PURE__ */ jsxRuntimeExports.jsx(ExploreSkeleton, {}) : displayPosts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-24 text-center",
        "data-ocid": "explore.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5", children: isSearching ? /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 32, className: "text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { size: 32, className: "text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-semibold text-foreground mb-2", children: isSearching ? `No results for "${activeQuery}"` : "No posts yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs mb-6", children: isSearching ? "Try different keywords or browse all photos below." : "Be the first to share a photo with the community!" }),
          isSearching ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: clearSearch,
              "data-ocid": "explore.clear_search_button",
              children: "Clear search"
            }
          ) : isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => navigate({ to: "/upload" }),
              "data-ocid": "explore.upload_button",
              children: "Share a Photo"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: login, "data-ocid": "explore.login_button", children: "Sign In to Post" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "masonry-grid", "data-ocid": "explore.post_list", children: displayPosts.map((post, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
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
      showHasMore && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex justify-center mt-10",
          "data-ocid": "explore.load_more_section",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "lg",
              onClick: handleLoadMore,
              disabled: isFetchingMore,
              className: "rounded-xl px-8",
              "data-ocid": "explore.load_more_button",
              children: isFetchingMore ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "mr-2 animate-spin" }),
                "Loading…"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 16, className: "mr-2" }),
                "Load more"
              ] })
            }
          )
        }
      ),
      !showHasMore && displayPosts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-center text-muted-foreground text-sm py-8",
          "data-ocid": "explore.end_of_feed",
          children: "You've seen everything ✦"
        }
      )
    ] })
  ] });
}
export {
  ExplorePage as default
};
