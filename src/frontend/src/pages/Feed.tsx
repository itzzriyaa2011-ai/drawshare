import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { Camera, Compass, Loader2, Users } from "lucide-react";
import { useState } from "react";
import { Layout } from "../components/Layout";
import { PostCard } from "../components/PostCard";
import { useAuth } from "../hooks/use-auth";
import { useHomeFeed, useLikePost, useSavePost } from "../hooks/use-posts";
import type { PostCardData } from "../types";

const PAGE_SIZE = 20n;

function FeedSkeleton() {
  return (
    <div className="masonry-grid" data-ocid="feed.loading_state">
      {Array.from({ length: 12 }, (_, i) => i).map((i) => (
        <div
          key={i}
          className="masonry-item rounded-2xl overflow-hidden border border-border bg-card"
        >
          <Skeleton
            className="w-full"
            style={{ height: `${160 + (i % 5) * 32}px` }}
          />
          <div className="p-3 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FeedPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0n);
  const [allPosts, setAllPosts] = useState<PostCardData[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const { data, isLoading, isFetching: isPageFetching } = useHomeFeed(offset);
  const likeMutation = useLikePost();
  const saveMutation = useSavePost();

  if (data && data.length > 0 && !allPosts.some((p) => p.id === data[0].id)) {
    setAllPosts((prev) => (offset === 0n ? data : [...prev, ...data]));
    setHasMore(data.length === Number(PAGE_SIZE));
  } else if (
    data &&
    data.length === 0 &&
    offset === 0n &&
    allPosts.length > 0
  ) {
    setAllPosts([]);
    setHasMore(false);
  }

  return (
    <Layout>
      {/* Unauthenticated hero banner */}
      {!isAuthenticated && (
        <div
          className="relative bg-card border border-border rounded-2xl p-8 mb-8 overflow-hidden"
          data-ocid="feed.auth_banner"
        >
          <div className="absolute inset-0 gradient-primary opacity-5 pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center gap-6 relative">
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-3xl font-bold text-foreground mb-2">
                Share Your World
              </h2>
              <p className="text-muted-foreground mb-5 max-w-md">
                Discover stunning photos from creators around the world. Sign in
                to follow people, like, and save your favourites.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={login}
                  size="lg"
                  data-ocid="feed.login_cta_button"
                >
                  Get Started — It's Free
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate({ to: "/explore" })}
                  data-ocid="feed.browse_explore_button"
                >
                  <Compass size={16} className="mr-2" />
                  Browse Explore
                </Button>
              </div>
            </div>
            <div className="w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center shadow-elevated shrink-0">
              <Camera size={40} className="text-white" />
            </div>
          </div>
        </div>
      )}

      {isLoading && allPosts.length === 0 ? (
        <FeedSkeleton />
      ) : allPosts.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-24 text-center"
          data-ocid="feed.empty_state"
        >
          {isAuthenticated ? (
            /* Authenticated but not following anyone */
            <>
              <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                <Users size={32} className="text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                Follow someone to see their posts here
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs mb-6">
                Your feed shows photos from people you follow. Head to Explore
                to discover creators and follow the ones you love.
              </p>
              <Button
                onClick={() => navigate({ to: "/explore" })}
                data-ocid="feed.go_explore_button"
              >
                <Compass size={16} className="mr-2" />
                Discover Creators
              </Button>
            </>
          ) : (
            /* Not authenticated — minimal prompt since banner is above */
            <>
              <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                <Camera size={32} className="text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                Nothing here yet
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs mb-6">
                Sign in and follow people to build your personalised feed.
              </p>
              <Button onClick={login} data-ocid="feed.login_button">
                Sign In
              </Button>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="masonry-grid" data-ocid="feed.post_list">
            {allPosts.map((post, idx) => (
              <PostCard
                key={String(post.id)}
                post={post}
                index={idx}
                isLiked={likedIds.has(String(post.id))}
                isSaved={savedIds.has(String(post.id))}
                onLike={
                  isAuthenticated
                    ? (id) => {
                        setLikedIds((prev) => {
                          const next = new Set(prev);
                          if (next.has(String(id))) next.delete(String(id));
                          else next.add(String(id));
                          return next;
                        });
                        likeMutation.mutate(id);
                      }
                    : undefined
                }
                onSave={
                  isAuthenticated
                    ? (id) => {
                        setSavedIds((prev) => {
                          const next = new Set(prev);
                          if (next.has(String(id))) next.delete(String(id));
                          else next.add(String(id));
                          return next;
                        });
                        saveMutation.mutate(id);
                      }
                    : undefined
                }
              />
            ))}
          </div>

          {hasMore && (
            <div
              className="flex justify-center mt-10"
              data-ocid="feed.load_more_section"
            >
              <Button
                variant="outline"
                size="lg"
                onClick={() => setOffset((prev) => prev + PAGE_SIZE)}
                disabled={isPageFetching}
                className="rounded-xl px-8"
                data-ocid="feed.load_more_button"
              >
                {isPageFetching ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Loading…
                  </>
                ) : (
                  "Load more"
                )}
              </Button>
            </div>
          )}

          {!hasMore && allPosts.length > 0 && (
            <p
              className="text-center text-muted-foreground text-sm py-8"
              data-ocid="feed.end_of_feed"
            >
              You're all caught up ✦
            </p>
          )}
        </>
      )}
    </Layout>
  );
}
