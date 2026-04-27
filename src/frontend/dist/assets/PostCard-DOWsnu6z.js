import { j as jsxRuntimeExports, f as Slot, g as cn, h as cva, i as useQueryClient, a as useNavigate, B as Button } from "./index-Py_44o3M.js";
import { e as useBackend, f as useQuery, g as useMutation } from "./use-posts-_6MsgZwc.js";
import { m as motion, H as Heart, B as Bookmark, C as CircleUser } from "./proxy-e2KdTrn6.js";
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Comp,
    {
      "data-slot": "badge",
      className: cn(badgeVariants({ variant }), className),
      ...props
    }
  );
}
function profileToData(profile) {
  var _a;
  return {
    id: profile.id,
    displayName: profile.displayName,
    bio: profile.bio,
    avatarUrl: (_a = profile.avatarBlob) == null ? void 0 : _a.getDirectURL(),
    postCount: profile.postCount,
    followerCount: profile.followerCount,
    followingCount: profile.followingCount,
    isAnonymousByDefault: profile.isAnonymousByDefault
  };
}
function useMyProfile() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => {
      if (!actor) return null;
      const profile = await actor.getCallerUserProfile();
      if (!profile) return null;
      return profileToData(profile);
    },
    enabled: !!actor && !isFetching
  });
}
function useUserProfile(userId) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["user-profile", userId == null ? void 0 : userId.toString()],
    queryFn: async () => {
      if (!actor || !userId) return null;
      const profile = await actor.getUserProfile(userId);
      if (!profile) return null;
      return profileToData(profile);
    },
    enabled: !!actor && !isFetching && !!userId
  });
}
function useIsFollowing(targetId) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["is-following", targetId == null ? void 0 : targetId.toString()],
    queryFn: async () => {
      if (!actor || !targetId) return false;
      return actor.isFollowingUser(targetId);
    },
    enabled: !!actor && !isFetching && !!targetId
  });
}
function useSearchUsers(keyword) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["search-users", keyword],
    queryFn: async () => {
      if (!actor || !keyword.trim()) return [];
      const users = await actor.searchUsers(keyword.trim());
      return users.map(profileToData);
    },
    enabled: !!actor && !isFetching && keyword.trim().length > 0
  });
}
function useFollowUser() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (targetId) => {
      if (!actor) throw new Error("Not connected");
      return actor.followUser(targetId);
    },
    onSuccess: (_, targetId) => {
      queryClient.invalidateQueries({
        queryKey: ["is-following", targetId.toString()]
      });
      queryClient.invalidateQueries({
        queryKey: ["user-profile", targetId.toString()]
      });
      queryClient.invalidateQueries({
        queryKey: ["user-followers", targetId.toString()]
      });
    }
  });
}
function useUnfollowUser() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (targetId) => {
      if (!actor) throw new Error("Not connected");
      return actor.unfollowUser(targetId);
    },
    onSuccess: (_, targetId) => {
      queryClient.invalidateQueries({
        queryKey: ["is-following", targetId.toString()]
      });
      queryClient.invalidateQueries({
        queryKey: ["user-profile", targetId.toString()]
      });
      queryClient.invalidateQueries({
        queryKey: ["user-followers", targetId.toString()]
      });
    }
  });
}
function useUpdateProfile() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    }
  });
}
function PostCard({
  post,
  index = 0,
  onLike,
  onSave,
  isLiked = false,
  isSaved = false
}) {
  const navigate = useNavigate();
  const { data: authorProfile } = useUserProfile(
    !post.isAnonymous ? post.authorId : void 0
  );
  const resolvedAuthorName = post.isAnonymous ? "Anonymous" : post.authorName ?? (authorProfile == null ? void 0 : authorProfile.displayName) ?? "PicVibe User";
  function handleCardClick() {
    navigate({ to: "/post/$id", params: { id: String(post.id) } });
  }
  function handleLike(e) {
    e.stopPropagation();
    onLike == null ? void 0 : onLike(post.id);
  }
  function handleSave(e) {
    e.stopPropagation();
    onSave == null ? void 0 : onSave(post.id);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.article,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: {
        duration: 0.35,
        delay: index * 0.06,
        ease: [0.4, 0, 0.2, 1]
      },
      className: "masonry-item group relative cursor-pointer",
      onClick: handleCardClick,
      "data-ocid": `post.item.${index + 1}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl overflow-hidden bg-card border border-border shadow-xs card-hover", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: post.imageUrl,
              alt: post.title,
              loading: "lazy",
              className: "w-full object-cover transition-transform duration-500 group-hover:scale-105",
              style: { display: "block" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: `h-8 w-8 rounded-full glass text-white hover:text-red-400 ${isLiked ? "text-red-400" : ""}`,
                onClick: handleLike,
                "aria-label": "Like post",
                "data-ocid": `post.like_button.${index + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 15, fill: isLiked ? "currentColor" : "none" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: `h-8 w-8 rounded-full glass text-white hover:text-accent ${isSaved ? "text-accent" : ""}`,
                onClick: handleSave,
                "aria-label": "Save post",
                "data-ocid": `post.save_button.${index + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { size: 15, fill: isSaved ? "currentColor" : "none" })
              }
            )
          ] }),
          post.isAnonymous && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 left-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "secondary",
              className: "text-xs glass border-0 text-white font-medium",
              children: "Anonymous"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
          post.title && /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-foreground line-clamp-1 mb-1", children: post.title }),
          post.caption && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2 leading-relaxed", children: post.caption }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-2 pt-2 border-t border-border/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                CircleUser,
                {
                  size: 14,
                  className: "text-muted-foreground shrink-0"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground truncate", children: resolvedAuthorName })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 11 }),
                String(post.likeCount)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { size: 11 }),
                String(post.savedCount)
              ] })
            ] })
          ] })
        ] })
      ] })
    }
  );
}
export {
  PostCard as P,
  useIsFollowing as a,
  useFollowUser as b,
  useUnfollowUser as c,
  useMyProfile as d,
  useUpdateProfile as e,
  useUserProfile as f,
  useSearchUsers as u
};
