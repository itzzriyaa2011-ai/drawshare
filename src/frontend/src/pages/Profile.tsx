import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { Bookmark, Flame, Lightbulb, UserRound, Users } from "lucide-react";
import { DrawingCard } from "../components/DrawingCard";
import { Layout } from "../components/Layout";
import { useAuth } from "../hooks/use-auth";
import { useBackend } from "../hooks/use-backend";

export default function ProfilePage() {
  const { id } = useParams({ from: "/profile/$id" });
  const { actor, isFetching } = useBackend();
  const { isAuthenticated, identity } = useAuth();
  const queryClient = useQueryClient();

  const isOwnProfile = identity?.getPrincipal().toText() === id;

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", id],
    queryFn: async () => {
      if (!actor) return null;
      const { Principal } = await import("@icp-sdk/core/principal");
      return actor.getUserProfile(
        Principal.fromText(id) as unknown as Principal,
      );
    },
    enabled: !!actor && !isFetching,
  });

  const { data: isFollowing } = useQuery({
    queryKey: ["following", id],
    queryFn: async () => {
      if (!actor) return false;
      const { Principal } = await import("@icp-sdk/core/principal");
      return actor.isFollowingUser(
        Principal.fromText(id) as unknown as Principal,
      );
    },
    enabled: !!actor && isAuthenticated && !isFetching,
  });

  // Own profile: show caller's saved drawings
  const { data: savedDrawings, isLoading: savedLoading } = useQuery({
    queryKey: ["drawings", "saved", "me"],
    queryFn: async () => {
      if (!actor) return { items: [], total: 0n, offset: 0n, limit: 6n };
      return actor.getSavedDrawings(0n, 6n);
    },
    enabled: !!actor && !isFetching && isOwnProfile,
  });

  // Other profile: show trending drawings as community picks
  const { data: communityDrawings, isLoading: communityLoading } = useQuery({
    queryKey: ["drawings", "trending", "community"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTrendingDrawings(6n);
    },
    enabled: !!actor && !isFetching && !isOwnProfile,
  });

  const { data: suggestedDrawings, isLoading: suggestedLoading } = useQuery({
    queryKey: ["drawings", "suggested", id],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSuggestedDrawings(6n);
    },
    enabled: !!actor && !isFetching,
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      if (!actor) return;
      const { Principal } = await import("@icp-sdk/core/principal");
      const p = Principal.fromText(id) as unknown as Principal;
      if (isFollowing) await actor.unfollowUser(p);
      else await actor.followUser(p);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["following", id] });
      queryClient.invalidateQueries({ queryKey: ["profile", id] });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (drawingId: bigint) => {
      if (actor) await actor.saveDrawing(drawingId);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["drawings", "suggested"] }),
  });

  if (profileLoading) {
    return (
      <Layout>
        <div
          className="space-y-6 max-w-4xl mx-auto"
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }, (_, i) => `sk-${i}`).map((k) => (
              <div
                key={k}
                className="rounded-2xl overflow-hidden border border-border bg-card"
              >
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
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
            <UserRound size={28} className="text-muted-foreground" />
          </div>
          <h2 className="font-display text-xl font-bold mb-2">
            Artist not found
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            This profile doesn't exist or has been removed.
          </p>
          <Link to="/" search={{}}>
            <Button variant="outline" data-ocid="profile.back_home_button">
              Browse Drawings
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const profileInitial = profile.username[0]?.toUpperCase() ?? "A";

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile header card */}
        <div
          className="bg-card rounded-2xl border border-border overflow-hidden"
          data-ocid="profile.header"
        >
          {/* Cover gradient */}
          <div className="h-24 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/5" />
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-10 mb-4">
              {profile.avatarBlob ? (
                <img
                  src={profile.avatarBlob.getDirectURL()}
                  alt={profile.username}
                  className="w-20 h-20 rounded-full object-cover border-4 border-card shadow-md shrink-0"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary/20 border-4 border-card flex items-center justify-center shrink-0 shadow-md">
                  <span className="text-primary text-2xl font-bold font-display">
                    {profileInitial}
                  </span>
                </div>
              )}
              {isAuthenticated && !isOwnProfile && (
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  onClick={() => followMutation.mutate()}
                  disabled={followMutation.isPending}
                  className="shrink-0"
                  data-ocid="profile.follow_button"
                >
                  {followMutation.isPending
                    ? "..."
                    : isFollowing
                      ? "Unfollow"
                      : "Follow"}
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

            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                {profile.username}
              </h1>
              {profile.bio && (
                <p className="text-muted-foreground text-sm mt-1 max-w-prose">
                  {profile.bio}
                </p>
              )}
              <div className="flex items-center gap-5 mt-3 text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Users size={14} />
                  <strong className="text-foreground font-semibold">
                    {Number(profile.followerCount).toLocaleString()}
                  </strong>{" "}
                  followers
                </span>
                <span className="text-muted-foreground">
                  <strong className="text-foreground font-semibold">
                    {Number(profile.followingCount).toLocaleString()}
                  </strong>{" "}
                  following
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Collection (own profile only) */}
        {isOwnProfile && (
          <section data-ocid="profile.saved_section">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Bookmark size={16} className="text-accent" />
              </div>
              <h2 className="font-display text-lg font-bold text-foreground">
                Saved Collection
              </h2>
              {savedDrawings && savedDrawings.items.length > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {Number(savedDrawings.total)} saved
                </Badge>
              )}
            </div>

            {savedLoading ? (
              <div
                className="grid grid-cols-2 md:grid-cols-3 gap-4"
                data-ocid="profile.saved_loading_state"
              >
                {Array.from({ length: 3 }, (_, i) => `sk-saved-${i}`).map(
                  (k) => (
                    <div
                      key={k}
                      className="rounded-2xl overflow-hidden border border-border bg-card"
                    >
                      <Skeleton className="aspect-[4/3] w-full" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : !savedDrawings || savedDrawings.items.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-2xl border border-border"
                data-ocid="profile.saved_empty_state"
              >
                <Bookmark size={28} className="text-muted-foreground mb-3" />
                <p className="text-muted-foreground text-sm">
                  You haven't saved any drawings yet. Start exploring!
                </p>
                <Link to="/" search={{}} className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    data-ocid="profile.browse_drawings_button"
                  >
                    Browse Drawings
                  </Button>
                </Link>
              </div>
            ) : (
              <div
                className="grid grid-cols-2 md:grid-cols-3 gap-4"
                data-ocid="profile.saved_list"
              >
                {savedDrawings.items.map((drawing, idx) => (
                  <DrawingCard
                    key={String(drawing.id)}
                    drawing={drawing}
                    index={idx}
                    isSaved
                    authorName={drawing.author.toText()}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Community Picks (other profiles) */}
        {!isOwnProfile && (
          <section data-ocid="profile.community_section">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Flame size={16} className="text-primary" />
              </div>
              <h2 className="font-display text-lg font-bold text-foreground">
                Community Picks
              </h2>
            </div>

            {communityLoading ? (
              <div
                className="grid grid-cols-2 md:grid-cols-3 gap-4"
                data-ocid="profile.community_loading_state"
              >
                {Array.from({ length: 3 }, (_, i) => `sk-community-${i}`).map(
                  (k) => (
                    <div
                      key={k}
                      className="rounded-2xl overflow-hidden border border-border bg-card"
                    >
                      <Skeleton className="aspect-[4/3] w-full" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : !communityDrawings || communityDrawings.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-2xl border border-border"
                data-ocid="profile.community_empty_state"
              >
                <Flame size={28} className="text-muted-foreground mb-3" />
                <p className="text-muted-foreground text-sm">
                  No trending drawings yet. Be the first to share your art!
                </p>
              </div>
            ) : (
              <div
                className="grid grid-cols-2 md:grid-cols-3 gap-4"
                data-ocid="profile.community_list"
              >
                {communityDrawings.map((drawing, idx) => (
                  <DrawingCard
                    key={String(drawing.id)}
                    drawing={drawing}
                    index={idx}
                    authorName={drawing.author.toText()}
                    onSave={
                      isAuthenticated
                        ? (drawingId) => saveMutation.mutate(drawingId)
                        : undefined
                    }
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Suggestions Section */}
        <section
          className="bg-muted/30 rounded-2xl border border-border p-6"
          data-ocid="profile.suggestions_section"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Lightbulb size={16} className="text-primary" />
            </div>
            <h2 className="font-display text-lg font-bold text-foreground">
              You Might Like
            </h2>
          </div>

          {suggestedLoading ? (
            <div
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
              data-ocid="profile.suggestions_loading_state"
            >
              {Array.from({ length: 3 }, (_, i) => `sk-sug-${i}`).map((k) => (
                <div
                  key={k}
                  className="rounded-2xl overflow-hidden border border-border bg-card"
                >
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : !suggestedDrawings || suggestedDrawings.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-10 text-center"
              data-ocid="profile.suggestions_empty_state"
            >
              <Lightbulb size={24} className="text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-sm">
                No suggestions available yet. Explore more drawings!
              </p>
            </div>
          ) : (
            <div
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
              data-ocid="profile.suggestions_list"
            >
              {suggestedDrawings.map((drawing, idx) => (
                <DrawingCard
                  key={String(drawing.id)}
                  drawing={drawing}
                  index={idx}
                  authorName={drawing.author.toText()}
                  onSave={
                    isAuthenticated
                      ? (drawingId) => saveMutation.mutate(drawingId)
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
