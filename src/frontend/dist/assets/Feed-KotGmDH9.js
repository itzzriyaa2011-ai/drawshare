import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, u as useAuth, b as useQueryClient, e as useNavigate, n as useSearch, L as Layout, T as TrendingUp, P as Palette, f as Button, S as Skeleton } from "./index-D4tdokbz.js";
import { B as Badge } from "./badge-DSGlaz1B.js";
import { I as Input } from "./input-DGDa2hNz.js";
import { u as useBackend, a as useQuery, b as useMutation } from "./use-backend-CSYGU6gL.js";
import { D as DrawingCard } from "./DrawingCard-Cw2-pe6E.js";
import { X } from "./x-C-9_9A_D.js";
import { M as MotionConfigContext, i as isHTMLElement, u as useConstant, P as PresenceContext, a as usePresence, b as useIsomorphicLayoutEffect, L as LayoutGroupContext, m as motion } from "./proxy-ID89ermQ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode);
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}
class PopChildMeasure extends reactExports.Component {
  getSnapshotBeforeUpdate(prevProps) {
    const element = this.props.childRef.current;
    if (isHTMLElement(element) && prevProps.isPresent && !this.props.isPresent && this.props.pop !== false) {
      const parent = element.offsetParent;
      const parentWidth = isHTMLElement(parent) ? parent.offsetWidth || 0 : 0;
      const parentHeight = isHTMLElement(parent) ? parent.offsetHeight || 0 : 0;
      const computedStyle = getComputedStyle(element);
      const size = this.props.sizeRef.current;
      size.height = parseFloat(computedStyle.height);
      size.width = parseFloat(computedStyle.width);
      size.top = element.offsetTop;
      size.left = element.offsetLeft;
      size.right = parentWidth - size.width - size.left;
      size.bottom = parentHeight - size.height - size.top;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function PopChild({ children, isPresent, anchorX, anchorY, root, pop }) {
  var _a;
  const id = reactExports.useId();
  const ref = reactExports.useRef(null);
  const size = reactExports.useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  });
  const { nonce } = reactExports.useContext(MotionConfigContext);
  const childRef = ((_a = children.props) == null ? void 0 : _a.ref) ?? (children == null ? void 0 : children.ref);
  const composedRef = useComposedRefs(ref, childRef);
  reactExports.useInsertionEffect(() => {
    const { width, height, top, left, right, bottom } = size.current;
    if (isPresent || pop === false || !ref.current || !width || !height)
      return;
    const x = anchorX === "left" ? `left: ${left}` : `right: ${right}`;
    const y = anchorY === "bottom" ? `bottom: ${bottom}` : `top: ${top}`;
    ref.current.dataset.motionPopId = id;
    const style = document.createElement("style");
    if (nonce)
      style.nonce = nonce;
    const parent = root ?? document.head;
    parent.appendChild(style);
    if (style.sheet) {
      style.sheet.insertRule(`
          [data-motion-pop-id="${id}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            ${x}px !important;
            ${y}px !important;
          }
        `);
    }
    return () => {
      var _a2;
      (_a2 = ref.current) == null ? void 0 : _a2.removeAttribute("data-motion-pop-id");
      if (parent.contains(style)) {
        parent.removeChild(style);
      }
    };
  }, [isPresent]);
  return jsxRuntimeExports.jsx(PopChildMeasure, { isPresent, childRef: ref, sizeRef: size, pop, children: pop === false ? children : reactExports.cloneElement(children, { ref: composedRef }) });
}
const PresenceChild = ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode, anchorX, anchorY, root }) => {
  const presenceChildren = useConstant(newChildrenMap);
  const id = reactExports.useId();
  let isReusedContext = true;
  let context = reactExports.useMemo(() => {
    isReusedContext = false;
    return {
      id,
      initial,
      isPresent,
      custom,
      onExitComplete: (childId) => {
        presenceChildren.set(childId, true);
        for (const isComplete of presenceChildren.values()) {
          if (!isComplete)
            return;
        }
        onExitComplete && onExitComplete();
      },
      register: (childId) => {
        presenceChildren.set(childId, false);
        return () => presenceChildren.delete(childId);
      }
    };
  }, [isPresent, presenceChildren, onExitComplete]);
  if (presenceAffectsLayout && isReusedContext) {
    context = { ...context };
  }
  reactExports.useMemo(() => {
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
  }, [isPresent]);
  reactExports.useEffect(() => {
    !isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
  }, [isPresent]);
  children = jsxRuntimeExports.jsx(PopChild, { pop: mode === "popLayout", isPresent, anchorX, anchorY, root, children });
  return jsxRuntimeExports.jsx(PresenceContext.Provider, { value: context, children });
};
function newChildrenMap() {
  return /* @__PURE__ */ new Map();
}
const getChildKey = (child) => child.key || "";
function onlyElements(children) {
  const filtered = [];
  reactExports.Children.forEach(children, (child) => {
    if (reactExports.isValidElement(child))
      filtered.push(child);
  });
  return filtered;
}
const AnimatePresence = ({ children, custom, initial = true, onExitComplete, presenceAffectsLayout = true, mode = "sync", propagate = false, anchorX = "left", anchorY = "top", root }) => {
  const [isParentPresent, safeToRemove] = usePresence(propagate);
  const presentChildren = reactExports.useMemo(() => onlyElements(children), [children]);
  const presentKeys = propagate && !isParentPresent ? [] : presentChildren.map(getChildKey);
  const isInitialRender = reactExports.useRef(true);
  const pendingPresentChildren = reactExports.useRef(presentChildren);
  const exitComplete = useConstant(() => /* @__PURE__ */ new Map());
  const exitingComponents = reactExports.useRef(/* @__PURE__ */ new Set());
  const [diffedChildren, setDiffedChildren] = reactExports.useState(presentChildren);
  const [renderedChildren, setRenderedChildren] = reactExports.useState(presentChildren);
  useIsomorphicLayoutEffect(() => {
    isInitialRender.current = false;
    pendingPresentChildren.current = presentChildren;
    for (let i = 0; i < renderedChildren.length; i++) {
      const key = getChildKey(renderedChildren[i]);
      if (!presentKeys.includes(key)) {
        if (exitComplete.get(key) !== true) {
          exitComplete.set(key, false);
        }
      } else {
        exitComplete.delete(key);
        exitingComponents.current.delete(key);
      }
    }
  }, [renderedChildren, presentKeys.length, presentKeys.join("-")]);
  const exitingChildren = [];
  if (presentChildren !== diffedChildren) {
    let nextChildren = [...presentChildren];
    for (let i = 0; i < renderedChildren.length; i++) {
      const child = renderedChildren[i];
      const key = getChildKey(child);
      if (!presentKeys.includes(key)) {
        nextChildren.splice(i, 0, child);
        exitingChildren.push(child);
      }
    }
    if (mode === "wait" && exitingChildren.length) {
      nextChildren = exitingChildren;
    }
    setRenderedChildren(onlyElements(nextChildren));
    setDiffedChildren(presentChildren);
    return null;
  }
  const { forceRender } = reactExports.useContext(LayoutGroupContext);
  return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: renderedChildren.map((child) => {
    const key = getChildKey(child);
    const isPresent = propagate && !isParentPresent ? false : presentChildren === renderedChildren || presentKeys.includes(key);
    const onExit = () => {
      if (exitingComponents.current.has(key)) {
        return;
      }
      if (exitComplete.has(key)) {
        exitingComponents.current.add(key);
        exitComplete.set(key, true);
      } else {
        return;
      }
      let isEveryExitComplete = true;
      exitComplete.forEach((isExitComplete) => {
        if (!isExitComplete)
          isEveryExitComplete = false;
      });
      if (isEveryExitComplete) {
        forceRender == null ? void 0 : forceRender();
        setRenderedChildren(pendingPresentChildren.current);
        propagate && (safeToRemove == null ? void 0 : safeToRemove());
        onExitComplete && onExitComplete();
      }
    };
    return jsxRuntimeExports.jsx(PresenceChild, { isPresent, initial: !isInitialRender.current || initial ? void 0 : false, custom, presenceAffectsLayout, mode, root, onExitComplete: isPresent ? void 0 : onExit, anchorX, anchorY, children: child }, key);
  }) });
};
const PAGE_SIZE = 20n;
const POPULAR_TAGS = [
  "watercolor",
  "digitalart",
  "characterdesign",
  "portrait",
  "sketchbook",
  "natureillustration",
  "fanart",
  "concept",
  "ink",
  "acrylic"
];
function SkeletonCard({ index }) {
  const heights = ["h-48", "h-64", "h-56", "h-72", "h-52", "h-60"];
  const h = heights[index % heights.length];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "break-inside-avoid mb-4 rounded-2xl overflow-hidden border border-border bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: `w-full ${h}` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-2/3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-24 rounded-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-12" })
      ] })
    ] })
  ] });
}
function FeedPage() {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/" });
  const searchParams = useSearch({ from: "/" });
  const activeTag = searchParams.tag ?? null;
  const urlTag = searchParams.tag;
  const urlQ = searchParams.q;
  const urlSearch = urlQ ?? "";
  const [searchInput, setSearchInput] = reactExports.useState(urlSearch);
  const [page, setPage] = reactExports.useState(0);
  const [allItems, setAllItems] = reactExports.useState([]);
  const [hasMore, setHasMore] = reactExports.useState(true);
  const searchTimerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);
  reactExports.useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      const trimmed = searchInput.trim();
      navigate({
        search: (prev) => {
          const p = prev;
          return {
            q: trimmed.length > 1 ? trimmed : void 0,
            tag: trimmed.length > 1 ? void 0 : p.tag
          };
        },
        replace: true
      });
      setPage(0);
      setAllItems([]);
      setHasMore(true);
    }, 350);
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [searchInput, navigate]);
  const prevTagRef = reactExports.useRef(urlTag);
  const prevQRef = reactExports.useRef(urlQ);
  if (prevTagRef.current !== urlTag || prevQRef.current !== urlQ) {
    prevTagRef.current = urlTag;
    prevQRef.current = urlQ;
    if (page !== 0) setPage(0);
    if (allItems.length > 0) setAllItems([]);
    if (!hasMore) setHasMore(true);
  }
  const queryKey = urlSearch.trim().length > 1 ? ["drawings", "search", urlSearch.trim(), page] : activeTag ? ["drawings", "tag", activeTag, page] : ["drawings", "feed", page];
  const {
    data,
    isLoading,
    isFetching: isPageFetching
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!actor) return { items: [], total: 0n, offset: 0n, limit: PAGE_SIZE };
      const offset = BigInt(page) * PAGE_SIZE;
      if (urlSearch.trim().length > 1) {
        return actor.searchDrawings(urlSearch.trim(), offset, PAGE_SIZE);
      }
      if (activeTag) {
        return actor.listDrawingsByTag(activeTag, offset, PAGE_SIZE);
      }
      return actor.listDrawings(offset, PAGE_SIZE);
    },
    enabled: !!actor && !isFetching
  });
  reactExports.useEffect(() => {
    if (!data) return;
    const newItems = data.items;
    if (page === 0) {
      setAllItems(newItems);
    } else {
      setAllItems((prev) => [...prev, ...newItems]);
    }
    setHasMore(newItems.length === Number(PAGE_SIZE));
  }, [data, page]);
  const likeMutation = useMutation({
    mutationFn: async (id) => {
      if (actor) await actor.likeDrawing(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["drawings"] })
  });
  const saveMutation = useMutation({
    mutationFn: async (id) => {
      if (actor) await actor.saveDrawing(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["drawings"] })
  });
  const handleTagClick = reactExports.useCallback(
    (tag) => {
      navigate({
        search: (prev) => {
          const p = prev;
          return { tag: p.tag === tag ? void 0 : tag, q: void 0 };
        },
        replace: true
      });
      setSearchInput("");
      setPage(0);
      setAllItems([]);
      setHasMore(true);
    },
    [navigate]
  );
  const handleClearAll = reactExports.useCallback(() => {
    navigate({ search: {}, replace: true });
    setSearchInput("");
    setPage(0);
    setAllItems([]);
    setHasMore(true);
  }, [navigate]);
  const isSearchActive = urlSearch.trim().length > 1;
  const showLoading = isLoading && page === 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border pb-4 pt-2 mb-6 -mx-4 px-4 md:-mx-8 md:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "relative max-w-2xl mb-4",
          "data-ocid": "feed.search_section",
          children: [
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
                type: "search",
                placeholder: "Find amazing drawings...",
                value: searchInput,
                onChange: (e) => setSearchInput(e.target.value),
                className: "pl-10 pr-10 bg-card border-border h-11 rounded-xl text-sm shadow-sm focus-visible:ring-primary",
                "data-ocid": "feed.search_input"
              }
            ),
            searchInput && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleClearAll,
                className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
                "aria-label": "Clear search",
                "data-ocid": "feed.search_clear_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 15 })
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none",
          "data-ocid": "feed.tag_filters",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-xs font-semibold text-muted-foreground shrink-0 mr-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 13 }),
              "Tags"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleClearAll,
                "data-ocid": "feed.tag_filter.all",
                className: "shrink-0",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: activeTag === null && !isSearchActive ? "default" : "outline",
                    className: "cursor-pointer px-3 py-1 rounded-full text-xs transition-all duration-200 hover:shadow-sm",
                    children: "All"
                  }
                )
              }
            ),
            POPULAR_TAGS.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => handleTagClick(tag),
                "data-ocid": `feed.tag_filter.${tag}`,
                className: "shrink-0",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    variant: activeTag === tag ? "default" : "outline",
                    className: "cursor-pointer px-3 py-1 rounded-full text-xs transition-all duration-200 hover:shadow-sm",
                    children: [
                      "#",
                      tag
                    ]
                  }
                )
              },
              tag
            ))
          ]
        }
      )
    ] }),
    (isSearchActive || activeTag) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        className: "flex items-center gap-2 mb-5 text-sm text-muted-foreground",
        "data-ocid": "feed.active_filter",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isSearchActive ? `Results for "${urlSearch}"` : `Tagged #${activeTag}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: handleClearAll,
              className: "flex items-center gap-1 text-primary hover:text-primary/80 transition-colors font-medium",
              "data-ocid": "feed.clear_filters_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 13 }),
                "Clear"
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: showLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "columns-2 md:columns-3 lg:columns-4 gap-4",
        "data-ocid": "feed.loading_state",
        children: Array.from({ length: 12 }, (_, i) => i).map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, { index: i }, i))
      },
      "loading"
    ) : allItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0 },
        className: "flex flex-col items-center justify-center py-24 text-center",
        "data-ocid": "feed.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { size: 32, className: "text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-semibold text-foreground mb-2", children: isSearchActive ? "No drawings found" : activeTag ? `No #${activeTag} drawings yet` : "No drawings yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs mb-6", children: isSearchActive ? "Try a different search term or explore by tag." : activeTag ? "Be the first to share artwork with this tag!" : "Be the first to share your artwork with the community!" }),
          (isSearchActive || activeTag) && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: handleClearAll,
              "data-ocid": "feed.empty_state.clear_button",
              children: "Browse all drawings"
            }
          )
        ]
      },
      "empty"
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "columns-2 md:columns-3 lg:columns-4 gap-4",
              "data-ocid": "feed.drawing_list",
              children: allItems.map((drawing, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  className: "break-inside-avoid mb-4",
                  initial: { opacity: 0, y: 16 },
                  animate: { opacity: 1, y: 0 },
                  transition: {
                    duration: 0.3,
                    delay: Math.min(idx * 0.04, 0.4)
                  },
                  "data-ocid": `feed.drawing_list.item.${idx + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    DrawingCard,
                    {
                      drawing,
                      index: idx,
                      authorName: drawing.author.toText(),
                      onLike: isAuthenticated ? (id) => likeMutation.mutate(id) : void 0,
                      onSave: isAuthenticated ? (id) => saveMutation.mutate(id) : void 0
                    }
                  )
                },
                String(drawing.id)
              ))
            }
          ),
          hasMore && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex justify-center mt-10 mb-6",
              "data-ocid": "feed.load_more_section",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "lg",
                  onClick: () => setPage((p) => p + 1),
                  disabled: isPageFetching,
                  className: "rounded-xl px-8 border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200",
                  "data-ocid": "feed.load_more_button",
                  children: isPageFetching ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "mr-2 animate-spin" }),
                    "Loading…"
                  ] }) : "Load more"
                }
              )
            }
          ),
          !hasMore && allItems.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-center text-muted-foreground text-sm py-8",
              "data-ocid": "feed.end_of_feed",
              children: "You've seen all the drawings ✦"
            }
          )
        ]
      },
      "grid"
    ) })
  ] });
}
export {
  FeedPage as default
};
