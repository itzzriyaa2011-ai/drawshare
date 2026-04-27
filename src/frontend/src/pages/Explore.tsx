import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { Camera, ImageIcon, Loader2, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Layout } from "../components/Layout";
import { PostCard } from "../components/PostCard";
import { useAuth } from "../hooks/use-auth";
import {
  useExplorePosts,
  useLikePost,
  useSavePost,
  useSearchPosts,
} from "../hooks/use-posts";
import type { PostCardData } from "../types";

const PAGE_SIZE = 20n;

function ExploreSkeleton() {
  return (
    <div className="masonry-grid" data-ocid="explore.loading_state">
      {Array.from({ length: 12 }, (_, i) => i).map((i) => (
        <div
          key={i}
          className="masonry-item rounded-2xl overflow-hidden border border-border bg-card"
        >
          <Skeleton
            className="w-full"
            style={{ height: `${160 + (i % 4) * 40}px` }}
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

export default function ExplorePage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  // Search state
  const [searchInput, setSearchInput] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pagination for browse (all posts)
  const [offset, setOffset] = useState(0n);
  const [allPosts, setAllPosts] = useState<PostCardData[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // Search pagination
  const [searchOffset, setSearchOffset] = useState(0n);
  const [searchAllPosts, setSearchAllPosts] = useState<PostCardData[]>([]);
  const [searchHasMore, setSearchHasMore] = useState(true);

  // Liked/saved tracking
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const isSearching = activeQuery.trim().length > 0;

  const {
    data: exploreData,
    isLoading: exploreLoading,
    isFetching: exploreFetching,
  } = useExplorePosts(offset);

  const {
    data: searchData,
    isLoading: searchLoading,
    isFetching: searchFetching,
  } = useSearchPosts(activeQuery, searchOffset);

  const likeMutation = useLikePost();
  const saveMutation = useSavePost();

  // Accumulate explore pages
  if (
    !isSearching &&
    exploreData &&
    exploreData.length > 0 &&
    !allPosts.some((p) => p.id === exploreData[0].id)
  ) {
    setAllPosts((prev) =>
      offset === 0n ? exploreData : [...prev, ...exploreData],
    );
    setHasMore(exploreData.length === Number(PAGE_SIZE));
  } else if (
    !isSearching &&
    exploreData &&
    exploreData.length === 0 &&
    offset === 0n &&
    allPosts.length > 0
  ) {
    setAllPosts([]);
    setHasMore(false);
  }

  // Accumulate search pages
  if (
    isSearching &&
    searchData &&
    searchData.length > 0 &&
    !searchAllPosts.some((p) => p.id === searchData[0].id)
  ) {
    setSearchAllPosts((prev) =>
      searchOffset === 0n ? searchData : [...prev, ...searchData],
    );
    setSearchHasMore(searchData.length === Number(PAGE_SIZE));
  } else if (
    isSearching &&
    searchData &&
    searchData.length === 0 &&
    searchOffset === 0n
  ) {
    setSearchAllPosts([]);
    setSearchHasMore(false);
  }

  // Debounce search input → activeQuery
  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    if (searchInput.trim().length === 0) {
      setActiveQuery("");
      setSearchAllPosts([]);
      setSearchOffset(0n);
      setSearchHasMore(true);
      return;
    }
    searchTimerRef.current = setTimeout(() => {
      setActiveQuery(searchInput.trim());
      setSearchAllPosts([]);
      setSearchOffset(0n);
      setSearchHasMore(true);
    }, 400);
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [searchInput]);

  function clearSearch() {
    setSearchInput("");
    setActiveQuery("");
    setSearchAllPosts([]);
    setSearchOffset(0n);
    setSearchHasMore(true);
  }

  const displayPosts = isSearching ? searchAllPosts : allPosts;
  const isLoadingPage = isSearching
    ? searchLoading && searchAllPosts.length === 0
    : exploreLoading && allPosts.length === 0;
  const isFetchingMore = isSearching ? searchFetching : exploreFetching;
  const showHasMore = isSearching ? searchHasMore : hasMore;

  function handleLoadMore() {
    if (isSearching) {
      setSearchOffset((prev) => prev + PAGE_SIZE);
    } else {
      setOffset((prev) => prev + PAGE_SIZE);
    }
  }

  return (
    <Layout>
      {/* Page header + search */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-1">
          Explore
        </h1>
        <p className="text-muted-foreground text-sm mb-5">
          Discover stunning photos from the community
        </p>

        {/* Search bar */}
        <div className="relative max-w-xl">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search photos by title, tag, or keyword…"
            className="pl-10 pr-10 rounded-xl h-11"
            data-ocid="explore.search_input"
          />
          {searchInput.length > 0 && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
              data-ocid="explore.search_clear_button"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Active query label */}
        {isSearching && (
          <p
            className="text-sm text-muted-foreground mt-3"
            data-ocid="explore.search_results_label"
          >
            {searchLoading
              ? "Searching…"
              : `${searchAllPosts.length} result${searchAllPosts.length !== 1 ? "s" : ""} for "${activeQuery}"`}
          </p>
        )}
      </div>

      {isLoadingPage ? (
        <ExploreSkeleton />
      ) : displayPosts.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-24 text-center"
          data-ocid="explore.empty_state"
        >
          <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
            {isSearching ? (
              <Search size={32} className="text-primary" />
            ) : (
              <Camera size={32} className="text-primary" />
            )}
          </div>
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
            {isSearching ? `No results for "${activeQuery}"` : "No posts yet"}
          </h3>
          <p className="text-muted-foreground text-sm max-w-xs mb-6">
            {isSearching
              ? "Try different keywords or browse all photos below."
              : "Be the first to share a photo with the community!"}
          </p>
          {isSearching ? (
            <Button
              variant="outline"
              onClick={clearSearch}
              data-ocid="explore.clear_search_button"
            >
              Clear search
            </Button>
          ) : isAuthenticated ? (
            <Button
              onClick={() => navigate({ to: "/upload" })}
              data-ocid="explore.upload_button"
            >
              Share a Photo
            </Button>
          ) : (
            <Button onClick={login} data-ocid="explore.login_button">
              Sign In to Post
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="masonry-grid" data-ocid="explore.post_list">
            {displayPosts.map((post, idx) => (
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

          {showHasMore && (
            <div
              className="flex justify-center mt-10"
              data-ocid="explore.load_more_section"
            >
              <Button
                variant="outline"
                size="lg"
                onClick={handleLoadMore}
                disabled={isFetchingMore}
                className="rounded-xl px-8"
                data-ocid="explore.load_more_button"
              >
                {isFetchingMore ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Loading…
                  </>
                ) : (
                  <>
                    <ImageIcon size={16} className="mr-2" />
                    Load more
                  </>
                )}
              </Button>
            </div>
          )}

          {!showHasMore && displayPosts.length > 0 && (
            <p
              className="text-center text-muted-foreground text-sm py-8"
              data-ocid="explore.end_of_feed"
            >
              You've seen everything ✦
            </p>
          )}
        </>
      )}
    </Layout>
  );
}
