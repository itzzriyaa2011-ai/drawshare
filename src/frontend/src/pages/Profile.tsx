import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { Grid3X3, UserCircle, Users } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Layout } from "../components/Layout";
import { PostCard } from "../components/PostCard";
import { useAuth } from "../hooks/use-auth";
import { useExplorePosts, useLikePost, useSavePost } from "../hooks/use-posts";
import {
  useFollowUser,
  useIsFollowing,
  useUnfollowUser,
  useUserProfile,
} from "../hooks/use-user";
import type { UserId } from "../types";

export default function ProfilePage() {
  const { id } = useParams({ from: "/profile/$id" });
  const { isAuthenticated, identity } = useAuth();
  const [userId, setUserId] = useState<UserId | undefined>(undefined);

  const isOwnProfile = identity?.getPrincipal().toText() === id;

  useEffect(() => {
    import("@icp-sdk/core/principal").then(({ Principal }) => {
      try {
        setUserId(Principal.fromText(id) as UserId);
      } catch {
        /* invalid id */
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

  // Filter posts by this user's ID
  const userPosts = useMemo(() => {
    if (!allPosts || !userId) return [];
    return allPosts.filter((p) => p.authorId?.toString() === userId.toString());
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
    return (
      <Layout>
        <div
          className="max-w-4xl mx-auto space-y-6"
          data-ocid="profile.loading_state"
        >
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="w-20 h-20 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-60" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          data-ocid="profile.error_state"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <UserCircle size={28} className="text-muted-foreground" />
          </div>
          <h2 className="font-display text-xl font-bold mb-2">
            Profile not found
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            This profile doesn't exist or has been removed.
          </p>
          <Link to="/explore">
            <Button variant="outline" data-ocid="profile.back_button">
              Browse Photos
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const initial = profile.displayName?.[0]?.toUpperCase() ?? "U";

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile header card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card rounded-2xl border border-border overflow-hidden"
          data-ocid="profile.header"
        >
          {/* Cover strip */}
          <div className="h-28 gradient-primary opacity-60" />

          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-12 mb-4">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full border-4 border-card shadow-md overflow-hidden bg-primary/20 flex items-center justify-center shrink-0">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-primary text-3xl font-bold font-display">
                    {initial}
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 mb-1">
                {isAuthenticated && !isOwnProfile && (
                  <Button
                    variant={isFollowing ? "outline" : "default"}
                    onClick={handleFollowToggle}
                    disabled={
                      followMutation.isPending || unfollowMutation.isPending
                    }
                    data-ocid="profile.follow_button"
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                )}
                {isOwnProfile && (
                  <Link to="/me">
                    <Button
                      variant="outline"
                      data-ocid="profile.edit_profile_button"
                    >
                      Edit Profile
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Name + bio */}
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                {profile.displayName || "Riartsy User"}
              </h1>
              {profile.bio && (
                <p className="text-muted-foreground text-sm mt-1.5 max-w-prose leading-relaxed">
                  {profile.bio}
                </p>
              )}

              {/* Stats row */}
              <div className="flex items-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Grid3X3 size={14} />
                  <strong className="text-foreground font-semibold">
                    {String(profile.postCount)}
                  </strong>{" "}
                  posts
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users size={14} />
                  <strong className="text-foreground font-semibold">
                    {String(profile.followerCount)}
                  </strong>{" "}
                  followers
                </div>
                <div className="text-muted-foreground">
                  <strong className="text-foreground font-semibold">
                    {String(profile.followingCount)}
                  </strong>{" "}
                  following
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Posts grid */}
        <section data-ocid="profile.posts_section">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">
            {isOwnProfile ? "Your Posts" : "Posts"}
          </h2>

          {postsLoading ? (
            <div
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
              data-ocid="profile.posts_loading_state"
            >
              {Array.from({ length: 6 }, (_, i) => `sk-${i}`).map((k) => (
                <div
                  key={k}
                  className="rounded-2xl overflow-hidden border border-border bg-card"
                >
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : userPosts.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-14 text-center bg-muted/30 rounded-2xl border border-border"
              data-ocid="profile.posts_empty_state"
            >
              <Grid3X3 size={28} className="text-muted-foreground mb-3" />
              <p className="text-foreground font-medium mb-1">No posts yet</p>
              <p className="text-muted-foreground text-sm">
                {isOwnProfile
                  ? "Share your first photo to get started."
                  : "This user hasn't posted anything yet."}
              </p>
              {isOwnProfile && (
                <Link to="/upload">
                  <Button
                    size="sm"
                    className="mt-4"
                    data-ocid="profile.upload_button"
                  >
                    Upload a Photo
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="masonry-grid" data-ocid="profile.posts_list">
              {userPosts.map((post, idx) => (
                <PostCard
                  key={String(post.id)}
                  post={post}
                  index={idx}
                  onLike={
                    isAuthenticated
                      ? (postId) => likeMutation.mutate(postId)
                      : undefined
                  }
                  onSave={
                    isAuthenticated
                      ? (postId) => saveMutation.mutate(postId)
                      : undefined
                  }
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
