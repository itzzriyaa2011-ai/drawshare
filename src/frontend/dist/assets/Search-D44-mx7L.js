import { c as createLucideIcon, a as useNavigate, d as useSearch, r as reactExports, j as jsxRuntimeExports, L as Layout, b as Search, I as Input, S as Skeleton, B as Button, e as Link } from "./index-Py_44o3M.js";
import { T as Tabs, a as TabsList, b as TabsTrigger } from "./tabs-A7iytFXg.js";
import { u as useSearchUsers, P as PostCard, a as useIsFollowing, b as useFollowUser, c as useUnfollowUser } from "./PostCard-DOWsnu6z.js";
import { d as useSearchPosts } from "./use-posts-_6MsgZwc.js";
import { X } from "./x-RBG6_7Va.js";
import { C as CircleUser } from "./proxy-e2KdTrn6.js";
import "./index-x7uG_jp_.js";
import "./index-DOdboGrt.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
];
const UserMinus = createLucideIcon("user-minus", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
];
const UserPlus = createLucideIcon("user-plus", __iconNode);
function UserResultRow({
  user,
  index
}) {
  const { data: isFollowing } = useIsFollowing(user.id);
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-smooth",
      "data-ocid": `search.people_item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/profile/$id",
            params: { id: user.id.toString() },
            className: "flex items-center gap-3 flex-1 min-w-0",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center shrink-0 overflow-hidden", children: user.avatarUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: user.avatarUrl,
                  alt: user.displayName,
                  className: "w-full h-full object-cover"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleUser, { size: 24, className: "text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground truncate", children: user.displayName || "Anonymous" }),
                user.bio && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-1 mt-0.5", children: user.bio }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                  String(user.followerCount),
                  " followers · ",
                  String(user.postCount),
                  " ",
                  "posts"
                ] })
              ] })
            ]
          }
        ),
        isFollowing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "secondary",
            onClick: () => unfollowUser.mutate(user.id),
            disabled: unfollowUser.isPending,
            className: "shrink-0 gap-1.5",
            "data-ocid": `search.follow_button.${index + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserMinus, { size: 14 }),
              "Following"
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: () => followUser.mutate(user.id),
            disabled: followUser.isPending,
            className: "shrink-0 gap-1.5",
            "data-ocid": `search.follow_button.${index + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { size: 14 }),
              "Follow"
            ]
          }
        )
      ]
    }
  );
}
function SearchPage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: "/search" });
  const urlQ = searchParams.q ?? "";
  const [inputValue, setInputValue] = reactExports.useState(urlQ);
  const [activeTab, setActiveTab] = reactExports.useState("posts");
  const timerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    setInputValue(urlQ);
  }, [urlQ]);
  function handleInput(value) {
    setInputValue(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      navigate({
        to: "/search",
        search: { q: value.trim() || void 0 },
        replace: true
      });
    }, 350);
  }
  function handleClear() {
    setInputValue("");
    navigate({ to: "/search", search: {}, replace: true });
  }
  const { data: posts, isLoading: postsLoading } = useSearchPosts(urlQ);
  const { data: users, isLoading: usersLoading } = useSearchUsers(urlQ);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold text-foreground mb-4", children: "Search" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-2xl", children: [
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
            autoFocus: true,
            placeholder: "Search photos or people…",
            value: inputValue,
            onChange: (e) => handleInput(e.target.value),
            className: "pl-10 pr-10 h-12 text-base rounded-xl bg-card shadow-subtle focus-visible:ring-primary",
            "data-ocid": "search.search_input"
          }
        ),
        inputValue && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: handleClear,
            className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
            "aria-label": "Clear search",
            "data-ocid": "search.clear_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 15 })
          }
        )
      ] })
    ] }),
    !urlQ.trim() ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-24 text-center",
        "data-ocid": "search.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 32, className: "text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-semibold text-foreground mb-2", children: "Find photos and people" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs", children: "Search for stunning photos, discover creators, or find specific content." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Tabs,
        {
          value: activeTab,
          onValueChange: (v) => setActiveTab(v),
          className: "mb-6",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { "data-ocid": "search.tabs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "posts", "data-ocid": "search.posts_tab", children: [
              "Photos ",
              posts ? `(${posts.length})` : ""
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "people", "data-ocid": "search.people_tab", children: [
              "People ",
              users ? `(${users.length})` : ""
            ] })
          ] })
        }
      ),
      activeTab === "posts" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "search.posts_section", children: postsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "masonry-grid",
          "data-ocid": "search.posts_loading_state",
          children: Array.from({ length: 8 }, (_, i) => i).map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
          ))
        }
      ) : !posts || posts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center py-20 text-center",
          "data-ocid": "search.posts_empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm", children: [
              'No photos found for "',
              urlQ,
              '"'
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: handleClear,
                className: "mt-3",
                "data-ocid": "search.clear_results_button",
                children: "Clear search"
              }
            )
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "masonry-grid", "data-ocid": "search.posts_list", children: posts.map((post, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(PostCard, { post, index: idx }, String(post.id))) }) }),
      activeTab === "people" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "search.people_section", children: usersLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "space-y-3",
          "data-ocid": "search.people_loading_state",
          children: Array.from({ length: 4 }, (_, i) => i).map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-3 p-4 rounded-xl border border-border bg-card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-12 h-12 rounded-full shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-40" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-60" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-24 rounded-lg shrink-0" })
              ]
            },
            i
          ))
        }
      ) : !users || users.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex flex-col items-center justify-center py-20 text-center",
          "data-ocid": "search.people_empty_state",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm", children: [
            'No people found for "',
            urlQ,
            '"'
          ] })
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "search.people_list", children: users.map((user, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        UserResultRow,
        {
          user,
          index: idx
        },
        user.id.toString()
      )) }) })
    ] })
  ] });
}
export {
  SearchPage as default
};
