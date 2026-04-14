const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-CctSULxh.js","assets/index-D4tdokbz.js","assets/index-DiECGWXS.css"])))=>i.map(i=>d[i]);
import { c as createLucideIcon, l as useParams, u as useAuth, b as useQueryClient, j as jsxRuntimeExports, L as Layout, S as Skeleton, d as Link, f as Button, B as Bookmark, _ as __vitePreload } from "./index-D4tdokbz.js";
import { B as Badge } from "./badge-DSGlaz1B.js";
import { u as useBackend, a as useQuery, b as useMutation } from "./use-backend-CSYGU6gL.js";
import { D as DrawingCard } from "./DrawingCard-Cw2-pe6E.js";
import { U as UserRound } from "./index-CctSULxh.js";
import { F as Flame } from "./flame-j1nR3hXW.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
      key: "1gvzjb"
    }
  ],
  ["path", { d: "M9 18h6", key: "x1upvd" }],
  ["path", { d: "M10 22h4", key: "ceow96" }]
];
const Lightbulb = createLucideIcon("lightbulb", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode);
function ProfilePage() {
  var _a;
  const { id } = useParams({ from: "/profile/$id" });
  const { actor, isFetching } = useBackend();
  const { isAuthenticated, identity } = useAuth();
  const queryClient = useQueryClient();
  const isOwnProfile = (identity == null ? void 0 : identity.getPrincipal().toText()) === id;
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", id],
    queryFn: async () => {
      if (!actor) return null;
      const { Principal } = await __vitePreload(async () => {
        const { Principal: Principal2 } = await import("./index-CctSULxh.js").then((n) => n.i);
        return { Principal: Principal2 };
      }, true ? __vite__mapDeps([0,1,2]) : void 0);
      return actor.getUserProfile(
        Principal.fromText(id)
      );
    },
    enabled: !!actor && !isFetching
  });
  const { data: isFollowing } = useQuery({
    queryKey: ["following", id],
    queryFn: async () => {
      if (!actor) return false;
      const { Principal } = await __vitePreload(async () => {
        const { Principal: Principal2 } = await import("./index-CctSULxh.js").then((n) => n.i);
        return { Principal: Principal2 };
      }, true ? __vite__mapDeps([0,1,2]) : void 0);
      return actor.isFollowingUser(
        Principal.fromText(id)
      );
    },
    enabled: !!actor && isAuthenticated && !isFetching
  });
  const { data: savedDrawings, isLoading: savedLoading } = useQuery({
    queryKey: ["drawings", "saved", "me"],
    queryFn: async () => {
      if (!actor) return { items: [], total: 0n, offset: 0n, limit: 6n };
      return actor.getSavedDrawings(0n, 6n);
    },
    enabled: !!actor && !isFetching && isOwnProfile
  });
  const { data: communityDrawings, isLoading: communityLoading } = useQuery({
    queryKey: ["drawings", "trending", "community"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTrendingDrawings(6n);
    },
    enabled: !!actor && !isFetching && !isOwnProfile
  });
  const { data: suggestedDrawings, isLoading: suggestedLoading } = useQuery({
    queryKey: ["drawings", "suggested", id],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSuggestedDrawings(6n);
    },
    enabled: !!actor && !isFetching
  });
  const followMutation = useMutation({
    mutationFn: async () => {
      if (!actor) return;
      const { Principal } = await __vitePreload(async () => {
        const { Principal: Principal2 } = await import("./index-CctSULxh.js").then((n) => n.i);
        return { Principal: Principal2 };
      }, true ? __vite__mapDeps([0,1,2]) : void 0);
      const p = Principal.fromText(id);
      if (isFollowing) await actor.unfollowUser(p);
      else await actor.followUser(p);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["following", id] });
      queryClient.invalidateQueries({ queryKey: ["profile", id] });
    }
  });
  const saveMutation = useMutation({
    mutationFn: async (drawingId) => {
      if (actor) await actor.saveDrawing(drawingId);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["drawings", "suggested"] })
  });
  if (profileLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "space-y-6 max-w-4xl mx-auto",
        "data-ocid": "profile.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-2xl border border-border p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-20 h-20 rounded-full" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-40" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-60" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: Array.from({ length: 6 }, (_, i) => `sk-${i}`).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-2xl overflow-hidden border border-border bg-card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-[4/3] w-full" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2" })
                ] })
              ]
            },
            k
          )) })
        ]
      }
    ) });
  }
  if (!profile) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-20 text-center",
        "data-ocid": "profile.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserRound, { size: 28, className: "text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold mb-2", children: "Artist not found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6", children: "This profile doesn't exist or has been removed." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", search: {}, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", "data-ocid": "profile.back_home_button", children: "Browse Drawings" }) })
        ]
      }
    ) });
  }
  const profileInitial = ((_a = profile.username[0]) == null ? void 0 : _a.toUpperCase()) ?? "A";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card rounded-2xl border border-border overflow-hidden",
        "data-ocid": "profile.header",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-24 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between -mt-10 mb-4", children: [
              profile.avatarBlob ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: profile.avatarBlob.getDirectURL(),
                  alt: profile.username,
                  className: "w-20 h-20 rounded-full object-cover border-4 border-card shadow-md shrink-0"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-primary/20 border-4 border-card flex items-center justify-center shrink-0 shadow-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary text-2xl font-bold font-display", children: profileInitial }) }),
              isAuthenticated && !isOwnProfile && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: isFollowing ? "outline" : "default",
                  onClick: () => followMutation.mutate(),
                  disabled: followMutation.isPending,
                  className: "shrink-0",
                  "data-ocid": "profile.follow_button",
                  children: followMutation.isPending ? "..." : isFollowing ? "Unfollow" : "Follow"
                }
              ),
              isOwnProfile && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/me", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  "data-ocid": "profile.edit_profile_button",
                  children: "Edit Profile"
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: profile.username }),
              profile.bio && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1 max-w-prose", children: profile.bio }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-5 mt-3 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 14 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground font-semibold", children: Number(profile.followerCount).toLocaleString() }),
                  " ",
                  "followers"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground font-semibold", children: Number(profile.followingCount).toLocaleString() }),
                  " ",
                  "following"
                ] })
              ] })
            ] })
          ] })
        ]
      }
    ),
    isOwnProfile && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "profile.saved_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { size: 16, className: "text-accent" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold text-foreground", children: "Saved Collection" }),
        savedDrawings && savedDrawings.items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "ml-auto", children: [
          Number(savedDrawings.total),
          " saved"
        ] })
      ] }),
      savedLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid grid-cols-2 md:grid-cols-3 gap-4",
          "data-ocid": "profile.saved_loading_state",
          children: Array.from({ length: 3 }, (_, i) => `sk-saved-${i}`).map(
            (k) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-2xl overflow-hidden border border-border bg-card",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-[4/3] w-full" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2" })
                  ] })
                ]
              },
              k
            )
          )
        }
      ) : !savedDrawings || savedDrawings.items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-2xl border border-border",
          "data-ocid": "profile.saved_empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { size: 28, className: "text-muted-foreground mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "You haven't saved any drawings yet. Start exploring!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", search: {}, className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                "data-ocid": "profile.browse_drawings_button",
                children: "Browse Drawings"
              }
            ) })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid grid-cols-2 md:grid-cols-3 gap-4",
          "data-ocid": "profile.saved_list",
          children: savedDrawings.items.map((drawing, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            DrawingCard,
            {
              drawing,
              index: idx,
              isSaved: true,
              authorName: drawing.author.toText()
            },
            String(drawing.id)
          ))
        }
      )
    ] }),
    !isOwnProfile && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "profile.community_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { size: 16, className: "text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold text-foreground", children: "Community Picks" })
      ] }),
      communityLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid grid-cols-2 md:grid-cols-3 gap-4",
          "data-ocid": "profile.community_loading_state",
          children: Array.from({ length: 3 }, (_, i) => `sk-community-${i}`).map(
            (k) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-2xl overflow-hidden border border-border bg-card",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-[4/3] w-full" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2" })
                  ] })
                ]
              },
              k
            )
          )
        }
      ) : !communityDrawings || communityDrawings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-2xl border border-border",
          "data-ocid": "profile.community_empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { size: 28, className: "text-muted-foreground mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No trending drawings yet. Be the first to share your art!" })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid grid-cols-2 md:grid-cols-3 gap-4",
          "data-ocid": "profile.community_list",
          children: communityDrawings.map((drawing, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            DrawingCard,
            {
              drawing,
              index: idx,
              authorName: drawing.author.toText(),
              onSave: isAuthenticated ? (drawingId) => saveMutation.mutate(drawingId) : void 0
            },
            String(drawing.id)
          ))
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "bg-muted/30 rounded-2xl border border-border p-6",
        "data-ocid": "profile.suggestions_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { size: 16, className: "text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold text-foreground", children: "You Might Like" })
          ] }),
          suggestedLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid grid-cols-2 md:grid-cols-3 gap-4",
              "data-ocid": "profile.suggestions_loading_state",
              children: Array.from({ length: 3 }, (_, i) => `sk-sug-${i}`).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded-2xl overflow-hidden border border-border bg-card",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-[4/3] w-full" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2" })
                    ] })
                  ]
                },
                k
              ))
            }
          ) : !suggestedDrawings || suggestedDrawings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-10 text-center",
              "data-ocid": "profile.suggestions_empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { size: 24, className: "text-muted-foreground mb-2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No suggestions available yet. Explore more drawings!" })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid grid-cols-2 md:grid-cols-3 gap-4",
              "data-ocid": "profile.suggestions_list",
              children: suggestedDrawings.map((drawing, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                DrawingCard,
                {
                  drawing,
                  index: idx,
                  authorName: drawing.author.toText(),
                  onSave: isAuthenticated ? (drawingId) => saveMutation.mutate(drawingId) : void 0
                },
                String(drawing.id)
              ))
            }
          )
        ]
      }
    )
  ] }) });
}
export {
  ProfilePage as default
};
