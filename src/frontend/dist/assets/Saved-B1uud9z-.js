import { c as createLucideIcon, u as useAuth, b as useQueryClient, r as reactExports, j as jsxRuntimeExports, L as Layout, B as Bookmark, f as Button, g as LogIn, S as Skeleton, d as Link } from "./index-D4tdokbz.js";
import { u as useBackend, a as useQuery, b as useMutation } from "./use-backend-CSYGU6gL.js";
import { D as DrawingCard } from "./DrawingCard-Cw2-pe6E.js";
import "./badge-DSGlaz1B.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = createLucideIcon("chevron-down", __iconNode);
const PAGE_SIZE = 20n;
function SavedPage() {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated, login } = useAuth();
  const queryClient = useQueryClient();
  const [pageOffset, setPageOffset] = reactExports.useState(0n);
  const [allItems, setAllItems] = reactExports.useState([]);
  const {
    data,
    isLoading,
    isFetching: isLoadingMore
  } = useQuery({
    queryKey: ["drawings", "saved", String(pageOffset)],
    queryFn: async () => {
      if (!actor)
        return { items: [], total: 0n, offset: pageOffset, limit: PAGE_SIZE };
      const page = await actor.getSavedDrawings(pageOffset, PAGE_SIZE);
      if (pageOffset === 0n) {
        setAllItems(page.items);
      } else {
        setAllItems((prev) => [...prev, ...page.items]);
      }
      return page;
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const unsaveMutation = useMutation({
    mutationFn: async (id) => {
      if (actor) await actor.unsaveDrawing(id);
    },
    onSuccess: () => {
      setAllItems([]);
      setPageOffset(0n);
      queryClient.invalidateQueries({ queryKey: ["drawings", "saved"] });
    }
  });
  const totalItems = data ? Number(data.total) : 0;
  const hasMore = allItems.length < totalItems;
  const loadMore = () => {
    setPageOffset((prev) => prev + PAGE_SIZE);
  };
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-20 text-center",
        "data-ocid": "saved.auth_gate",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { size: 28, className: "text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold mb-2", children: "Sign in to see your saved drawings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6", children: "Your saved collection will appear here once you log in." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: login,
              className: "flex items-center gap-2",
              "data-ocid": "saved.login_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { size: 16 }),
                " Sign In"
              ]
            }
          )
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { size: 20, className: "text-accent" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Saved Drawings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: totalItems > 0 ? `${totalItems} drawing${totalItems !== 1 ? "s" : ""} in your collection` : "Your personal collection of saved artwork" })
      ] })
    ] }) }),
    isLoading && allItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "columns-2 md:columns-3 lg:columns-4 gap-4",
        "data-ocid": "saved.loading_state",
        children: Array.from({ length: 8 }, (_, i) => `sk-${i}`).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "break-inside-avoid rounded-2xl overflow-hidden border border-border bg-card mb-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full h-48" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2" })
              ] })
            ]
          },
          k
        ))
      }
    ) : allItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-20 text-center",
        "data-ocid": "saved.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { size: 28, className: "text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold mb-1", children: "No saved drawings yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6", children: "Bookmark drawings you love and they'll appear here." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", "data-ocid": "saved.browse_button", children: "Browse Drawings" }) })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "columns-2 md:columns-3 lg:columns-4 gap-4",
          "data-ocid": "saved.drawing_list",
          children: allItems.map((drawing, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "break-inside-avoid mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            DrawingCard,
            {
              drawing,
              index: idx,
              isSaved: true,
              authorName: drawing.author.toText(),
              onSave: (id) => unsaveMutation.mutate(id)
            }
          ) }, String(drawing.id)))
        }
      ),
      hasMore && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: loadMore,
          disabled: isLoadingMore,
          className: "gap-2 min-w-[160px]",
          "data-ocid": "saved.load_more_button",
          children: isLoadingMore ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 border-2 border-muted-foreground/40 border-t-foreground rounded-full animate-spin" }),
            "Loading..."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 16 }),
            "Load more"
          ] })
        }
      ) }),
      !hasMore && allItems.length > PAGE_SIZE && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "p",
        {
          className: "text-center text-sm text-muted-foreground mt-8",
          "data-ocid": "saved.end_of_list",
          children: [
            "You've seen all ",
            totalItems,
            " saved drawings"
          ]
        }
      )
    ] })
  ] });
}
export {
  SavedPage as default
};
