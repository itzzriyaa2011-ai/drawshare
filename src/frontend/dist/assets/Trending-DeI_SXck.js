import { u as useAuth, b as useQueryClient, j as jsxRuntimeExports, L as Layout, T as TrendingUp, S as Skeleton } from "./index-D4tdokbz.js";
import { B as Badge } from "./badge-DSGlaz1B.js";
import { u as useBackend, a as useQuery, b as useMutation } from "./use-backend-CSYGU6gL.js";
import { D as DrawingCard } from "./DrawingCard-Cw2-pe6E.js";
import { F as Flame } from "./flame-j1nR3hXW.js";
const RANK_STYLES = {
  1: "bg-primary text-primary-foreground",
  2: "bg-muted-foreground/70 text-card",
  3: "bg-accent/80 text-accent-foreground"
};
function TrendingPage() {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { data: trending, isLoading } = useQuery({
    queryKey: ["drawings", "trending"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTrendingDrawings(20n);
    },
    enabled: !!actor && !isFetching
  });
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 20, className: "text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Trending This Week" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Most-liked drawings from the community" })
      ] }),
      trending && trending.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Badge,
        {
          variant: "secondary",
          className: "ml-auto flex items-center gap-1",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { size: 12 }),
            trending.length,
            " hot picks"
          ]
        }
      )
    ] }) }),
    !isLoading && trending && trending.length >= 3 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-3 gap-4 mb-8",
        "data-ocid": "trending.top3_section",
        children: trending.slice(0, 3).map((drawing, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `absolute -top-2 -left-2 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${RANK_STYLES[idx + 1] ?? "bg-muted text-foreground"}`,
              children: [
                "#",
                idx + 1
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DrawingCard,
            {
              drawing,
              index: idx,
              authorName: drawing.author.toText(),
              onLike: isAuthenticated ? (id) => likeMutation.mutate(id) : void 0,
              onSave: isAuthenticated ? (id) => saveMutation.mutate(id) : void 0
            }
          )
        ] }, String(drawing.id)))
      }
    ),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "columns-2 md:columns-3 lg:columns-4 gap-4",
        "data-ocid": "trending.loading_state",
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
    ) : !trending || trending.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-20 text-center",
        "data-ocid": "trending.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 28, className: "text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold mb-1", children: "Nothing trending yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Start liking drawings to see what's popular!" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: trending.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-semibold text-muted-foreground uppercase tracking-wide text-sm", children: "More Trending" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 border-t border-border" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "columns-2 md:columns-3 lg:columns-4 gap-4",
          "data-ocid": "trending.drawing_list",
          children: trending.slice(3).map((drawing, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "break-inside-avoid mb-4 relative",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-1.5 -left-1.5 z-10 w-5 h-5 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs font-medium text-muted-foreground", children: idx + 4 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  DrawingCard,
                  {
                    drawing,
                    index: idx + 3,
                    authorName: drawing.author.toText(),
                    onLike: isAuthenticated ? (id) => likeMutation.mutate(id) : void 0,
                    onSave: isAuthenticated ? (id) => saveMutation.mutate(id) : void 0
                  }
                )
              ]
            },
            String(drawing.id)
          ))
        }
      )
    ] }) })
  ] });
}
export {
  TrendingPage as default
};
