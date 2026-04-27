import { ay as useParams, u as useAuth, r as reactExports, az as __vitePreload, j as jsxRuntimeExports, L as Layout, S as Skeleton, e as Link, B as Button, J as Principal, aA as JSON_KEY_PRINCIPAL, aB as base32Decode, aC as base32Encode, aD as getCrc32 } from "./index-Py_44o3M.js";
import { f as useUserProfile, a as useIsFollowing, b as useFollowUser, c as useUnfollowUser, P as PostCard } from "./PostCard-DOWsnu6z.js";
import { a as useLikePost, b as useSavePost, c as useExplorePosts } from "./use-posts-_6MsgZwc.js";
import { C as CircleUser, m as motion } from "./proxy-e2KdTrn6.js";
import { G as Grid3x3 } from "./grid-3x3-CpmZ5e_5.js";
import { U as Users } from "./users-DFxMFg7r.js";
function ProfilePage() {
  var _a, _b;
  const { id } = useParams({ from: "/profile/$id" });
  const { isAuthenticated, identity } = useAuth();
  const [userId, setUserId] = reactExports.useState(void 0);
  const isOwnProfile = (identity == null ? void 0 : identity.getPrincipal().toText()) === id;
  reactExports.useEffect(() => {
    __vitePreload(async () => {
      const { Principal: Principal2 } = await Promise.resolve().then(() => index);
      return { Principal: Principal2 };
    }, true ? void 0 : void 0).then(({ Principal: Principal2 }) => {
      try {
        setUserId(Principal2.fromText(id));
      } catch {
      }
    });
  }, [id]);
  const { data: profile, isLoading: profileLoading } = useUserProfile(userId);
  const { data: isFollowing } = useIsFollowing(userId);
  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();
  const likeMutation = useLikePost();
  const saveMutation = useSavePost();
  const { data: allPosts, isLoading: postsLoading } = useExplorePosts(0n);
  const userPosts = reactExports.useMemo(() => {
    if (!allPosts || !userId) return [];
    return allPosts.filter((p) => {
      var _a2;
      return ((_a2 = p.authorId) == null ? void 0 : _a2.toString()) === userId.toString();
    });
  }, [allPosts, userId]);
  function handleFollowToggle() {
    if (!userId) return;
    if (isFollowing) {
      unfollowMutation.mutate(userId);
    } else {
      followMutation.mutate(userId);
    }
  }
  if (profileLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "max-w-4xl mx-auto space-y-6",
        "data-ocid": "profile.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-2xl border border-border p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-20 h-20 rounded-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-60" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" })
          ] })
        ] }) })
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleUser, { size: 28, className: "text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold mb-2", children: "Profile not found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6", children: "This profile doesn't exist or has been removed." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/explore", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", "data-ocid": "profile.back_button", children: "Browse Photos" }) })
        ]
      }
    ) });
  }
  const initial = ((_b = (_a = profile.displayName) == null ? void 0 : _a[0]) == null ? void 0 : _b.toUpperCase()) ?? "U";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
        className: "bg-card rounded-2xl border border-border overflow-hidden",
        "data-ocid": "profile.header",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-28 gradient-primary opacity-60" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between -mt-12 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-full border-4 border-card shadow-md overflow-hidden bg-primary/20 flex items-center justify-center shrink-0", children: profile.avatarUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: profile.avatarUrl,
                  alt: profile.displayName,
                  className: "w-full h-full object-cover"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary text-3xl font-bold font-display", children: initial }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mb-1", children: [
                isAuthenticated && !isOwnProfile && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: isFollowing ? "outline" : "default",
                    onClick: handleFollowToggle,
                    disabled: followMutation.isPending || unfollowMutation.isPending,
                    "data-ocid": "profile.follow_button",
                    children: isFollowing ? "Following" : "Follow"
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
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: profile.displayName || "Riartsy User" }),
              profile.bio && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1.5 max-w-prose leading-relaxed", children: profile.bio }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6 mt-4 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Grid3x3, { size: 14 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground font-semibold", children: String(profile.postCount) }),
                  " ",
                  "posts"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 14 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground font-semibold", children: String(profile.followerCount) }),
                  " ",
                  "followers"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground font-semibold", children: String(profile.followingCount) }),
                  " ",
                  "following"
                ] })
              ] })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "profile.posts_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold text-foreground mb-4", children: isOwnProfile ? "Your Posts" : "Posts" }),
      postsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid grid-cols-2 md:grid-cols-3 gap-4",
          "data-ocid": "profile.posts_loading_state",
          children: Array.from({ length: 6 }, (_, i) => `sk-${i}`).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-2xl overflow-hidden border border-border bg-card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-square w-full" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }) })
              ]
            },
            k
          ))
        }
      ) : userPosts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center py-14 text-center bg-muted/30 rounded-2xl border border-border",
          "data-ocid": "profile.posts_empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Grid3x3, { size: 28, className: "text-muted-foreground mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-medium mb-1", children: "No posts yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: isOwnProfile ? "Share your first photo to get started." : "This user hasn't posted anything yet." }),
            isOwnProfile && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/upload", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                className: "mt-4",
                "data-ocid": "profile.upload_button",
                children: "Upload a Photo"
              }
            ) })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "masonry-grid", "data-ocid": "profile.posts_list", children: userPosts.map((post, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        PostCard,
        {
          post,
          index: idx,
          onLike: isAuthenticated ? (postId) => likeMutation.mutate(postId) : void 0,
          onSave: isAuthenticated ? (postId) => saveMutation.mutate(postId) : void 0
        },
        String(post.id)
      )) })
    ] })
  ] }) });
}
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  JSON_KEY_PRINCIPAL,
  Principal,
  base32Decode,
  base32Encode,
  getCrc32
}, Symbol.toStringTag, { value: "Module" }));
export {
  ProfilePage as default
};
