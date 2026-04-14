import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Loader2, Palette, Search, TrendingUp, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { DrawingCard } from "../components/DrawingCard";
import { Layout } from "../components/Layout";
import { useAuth } from "../hooks/use-auth";
import { useBackend } from "../hooks/use-backend";
import type { Drawing } from "../types";

const PAGE_SIZE = 20n;

const POPULAR_TAGS = [
  "watercolor",
  "digitalart",
  "characterdesign",
  "portrait",
  "sketchbook",
  "natureillustration",
  "fanart",
  "concept",
  "ink",
  "acrylic",
];

function SkeletonCard({ index }: { index: number }) {
  const heights = ["h-48", "h-64", "h-56", "h-72", "h-52", "h-60"];
  const h = heights[index % heights.length];
  return (
    <div className="break-inside-avoid mb-4 rounded-2xl overflow-hidden border border-border bg-card">
      <Skeleton className={`w-full ${h}`} />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}

export default function FeedPage() {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/" });

  // URL search params — single source of truth for tag/search
  const searchParams = useSearch({ from: "/" }) as { tag?: string; q?: string };
  const activeTag = searchParams.tag ?? null;
  const urlTag = searchParams.tag;
  const urlQ = searchParams.q;
  const urlSearch = urlQ ?? "";

  // Local input state — synced to URL on debounce
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [page, setPage] = useState(0);
  const [allItems, setAllItems] = useState<Drawing[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync input when URL changes externally
  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  // Debounce input → URL
  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      const trimmed = searchInput.trim();
      navigate({
        search: (prev) => {
          const p = prev as { tag?: string; q?: string };
          return {
            q: trimmed.length > 1 ? trimmed : undefined,
            tag: trimmed.length > 1 ? undefined : p.tag,
          };
        },
        replace: true,
      });
      setPage(0);
      setAllItems([]);
      setHasMore(true);
    }, 350);
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [searchInput, navigate]);

  // Reset page accumulation when URL params change
  const prevTagRef = useRef(urlTag);
  const prevQRef = useRef(urlQ);
  if (prevTagRef.current !== urlTag || prevQRef.current !== urlQ) {
    prevTagRef.current = urlTag;
    prevQRef.current = urlQ;
    if (page !== 0) setPage(0);
    if (allItems.length > 0) setAllItems([]);
    if (!hasMore) setHasMore(true);
  }

  const queryKey =
    urlSearch.trim().length > 1
      ? ["drawings", "search", urlSearch.trim(), page]
      : activeTag
        ? ["drawings", "tag", activeTag, page]
        : ["drawings", "feed", page];

  const {
    data,
    isLoading,
    isFetching: isPageFetching,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!actor) return { items: [], total: 0n, offset: 0n, limit: PAGE_SIZE };
      const offset = BigInt(page) * PAGE_SIZE;
      if (urlSearch.trim().length > 1) {
        return actor.searchDrawings(urlSearch.trim(), offset, PAGE_SIZE);
      }
      if (activeTag) {
        return actor.listDrawingsByTag(activeTag, offset, PAGE_SIZE);
      }
      return actor.listDrawings(offset, PAGE_SIZE);
    },
    enabled: !!actor && !isFetching,
  });

  // Accumulate pages
  useEffect(() => {
    if (!data) return;
    const newItems = data.items;
    if (page === 0) {
      setAllItems(newItems);
    } else {
      setAllItems((prev) => [...prev, ...newItems]);
    }
    setHasMore(newItems.length === Number(PAGE_SIZE));
  }, [data, page]);

  const likeMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (actor) await actor.likeDrawing(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["drawings"] }),
  });

  const saveMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (actor) await actor.saveDrawing(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["drawings"] }),
  });

  const handleTagClick = useCallback(
    (tag: string) => {
      navigate({
        search: (prev) => {
          const p = prev as { tag?: string; q?: string };
          return { tag: p.tag === tag ? undefined : tag, q: undefined };
        },
        replace: true,
      });
      setSearchInput("");
      setPage(0);
      setAllItems([]);
      setHasMore(true);
    },
    [navigate],
  );

  const handleClearAll = useCallback(() => {
    navigate({ search: {}, replace: true });
    setSearchInput("");
    setPage(0);
    setAllItems([]);
    setHasMore(true);
  }, [navigate]);

  const isSearchActive = urlSearch.trim().length > 1;
  const showLoading = isLoading && page === 0;

  return (
    <Layout>
      {/* Search + filter header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border pb-4 pt-2 mb-6 -mx-4 px-4 md:-mx-8 md:px-8">
        {/* Search bar */}
        <div
          className="relative max-w-2xl mb-4"
          data-ocid="feed.search_section"
        >
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            type="search"
            placeholder="Find amazing drawings..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10 pr-10 bg-card border-border h-11 rounded-xl text-sm shadow-sm focus-visible:ring-primary"
            data-ocid="feed.search_input"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearAll}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
              data-ocid="feed.search_clear_button"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Tag filters */}
        <div
          className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none"
          data-ocid="feed.tag_filters"
        >
          <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground shrink-0 mr-1">
            <TrendingUp size={13} />
            Tags
          </span>
          <button
            type="button"
            onClick={handleClearAll}
            data-ocid="feed.tag_filter.all"
            className="shrink-0"
          >
            <Badge
              variant={
                activeTag === null && !isSearchActive ? "default" : "outline"
              }
              className="cursor-pointer px-3 py-1 rounded-full text-xs transition-all duration-200 hover:shadow-sm"
            >
              All
            </Badge>
          </button>
          {POPULAR_TAGS.map((tag) => (
            <button
              type="button"
              key={tag}
              onClick={() => handleTagClick(tag)}
              data-ocid={`feed.tag_filter.${tag}`}
              className="shrink-0"
            >
              <Badge
                variant={activeTag === tag ? "default" : "outline"}
                className="cursor-pointer px-3 py-1 rounded-full text-xs transition-all duration-200 hover:shadow-sm"
              >
                #{tag}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Active filter indicator */}
      {(isSearchActive || activeTag) && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-5 text-sm text-muted-foreground"
          data-ocid="feed.active_filter"
        >
          <span>
            {isSearchActive
              ? `Results for "${urlSearch}"`
              : `Tagged #${activeTag}`}
          </span>
          <button
            type="button"
            onClick={handleClearAll}
            className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors font-medium"
            data-ocid="feed.clear_filters_button"
          >
            <X size={13} />
            Clear
          </button>
        </motion.div>
      )}

      {/* Grid */}
      <AnimatePresence mode="wait">
        {showLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="columns-2 md:columns-3 lg:columns-4 gap-4"
            data-ocid="feed.loading_state"
          >
            {Array.from({ length: 12 }, (_, i) => i).map((i) => (
              <SkeletonCard key={i} index={i} />
            ))}
          </motion.div>
        ) : allItems.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="feed.empty_state"
          >
            <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 shadow-sm">
              <Palette size={32} className="text-primary" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              {isSearchActive
                ? "No drawings found"
                : activeTag
                  ? `No #${activeTag} drawings yet`
                  : "No drawings yet"}
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs mb-6">
              {isSearchActive
                ? "Try a different search term or explore by tag."
                : activeTag
                  ? "Be the first to share artwork with this tag!"
                  : "Be the first to share your artwork with the community!"}
            </p>
            {(isSearchActive || activeTag) && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                data-ocid="feed.empty_state.clear_button"
              >
                Browse all drawings
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div
              className="columns-2 md:columns-3 lg:columns-4 gap-4"
              data-ocid="feed.drawing_list"
            >
              {allItems.map((drawing, idx) => (
                <motion.div
                  key={String(drawing.id)}
                  className="break-inside-avoid mb-4"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: Math.min(idx * 0.04, 0.4),
                  }}
                  data-ocid={`feed.drawing_list.item.${idx + 1}`}
                >
                  <DrawingCard
                    drawing={drawing}
                    index={idx}
                    authorName={drawing.author.toText()}
                    onLike={
                      isAuthenticated
                        ? (id) => likeMutation.mutate(id)
                        : undefined
                    }
                    onSave={
                      isAuthenticated
                        ? (id) => saveMutation.mutate(id)
                        : undefined
                    }
                  />
                </motion.div>
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div
                className="flex justify-center mt-10 mb-6"
                data-ocid="feed.load_more_section"
              >
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={isPageFetching}
                  className="rounded-xl px-8 border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
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

            {!hasMore && allItems.length > 0 && (
              <p
                className="text-center text-muted-foreground text-sm py-8"
                data-ocid="feed.end_of_feed"
              >
                You've seen all the drawings ✦
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
