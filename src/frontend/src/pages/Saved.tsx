import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Bookmark, ChevronDown, LogIn } from "lucide-react";
import { useState } from "react";
import { DrawingCard } from "../components/DrawingCard";
import { Layout } from "../components/Layout";
import { useAuth } from "../hooks/use-auth";
import { useBackend } from "../hooks/use-backend";
import type { Drawing } from "../types";

const PAGE_SIZE = 20n;

export default function SavedPage() {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated, login } = useAuth();
  const queryClient = useQueryClient();
  const [pageOffset, setPageOffset] = useState(0n);
  const [allItems, setAllItems] = useState<Drawing[]>([]);

  const {
    data,
    isLoading,
    isFetching: isLoadingMore,
  } = useQuery({
    queryKey: ["drawings", "saved", String(pageOffset)],
    queryFn: async () => {
      if (!actor)
        return { items: [], total: 0n, offset: pageOffset, limit: PAGE_SIZE };
      const page = await actor.getSavedDrawings(pageOffset, PAGE_SIZE);
      if (pageOffset === 0n) {
        setAllItems(page.items);
      } else {
        setAllItems((prev) => [...prev, ...page.items]);
      }
      return page;
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  const unsaveMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (actor) await actor.unsaveDrawing(id);
    },
    onSuccess: () => {
      setAllItems([]);
      setPageOffset(0n);
      queryClient.invalidateQueries({ queryKey: ["drawings", "saved"] });
    },
  });

  const totalItems = data ? Number(data.total) : 0;
  const hasMore = allItems.length < totalItems;

  const loadMore = () => {
    setPageOffset((prev) => prev + PAGE_SIZE);
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          data-ocid="saved.auth_gate"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Bookmark size={28} className="text-muted-foreground" />
          </div>
          <h2 className="font-display text-xl font-bold mb-2">
            Sign in to see your saved drawings
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Your saved collection will appear here once you log in.
          </p>
          <Button
            onClick={login}
            className="flex items-center gap-2"
            data-ocid="saved.login_button"
          >
            <LogIn size={16} /> Sign In
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Bookmark size={20} className="text-accent" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Saved Drawings
            </h1>
            <p className="text-muted-foreground text-sm">
              {totalItems > 0
                ? `${totalItems} drawing${totalItems !== 1 ? "s" : ""} in your collection`
                : "Your personal collection of saved artwork"}
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      {isLoading && allItems.length === 0 ? (
        <div
          className="columns-2 md:columns-3 lg:columns-4 gap-4"
          data-ocid="saved.loading_state"
        >
          {Array.from({ length: 8 }, (_, i) => `sk-${i}`).map((k) => (
            <div
              key={k}
              className="break-inside-avoid rounded-2xl overflow-hidden border border-border bg-card mb-4"
            >
              <Skeleton className="w-full h-48" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : allItems.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          data-ocid="saved.empty_state"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Bookmark size={28} className="text-muted-foreground" />
          </div>
          <h3 className="font-display text-lg font-semibold mb-1">
            No saved drawings yet
          </h3>
          <p className="text-muted-foreground text-sm mb-6">
            Bookmark drawings you love and they'll appear here.
          </p>
          <Link to="/">
            <Button variant="outline" data-ocid="saved.browse_button">
              Browse Drawings
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div
            className="columns-2 md:columns-3 lg:columns-4 gap-4"
            data-ocid="saved.drawing_list"
          >
            {allItems.map((drawing, idx) => (
              <div key={String(drawing.id)} className="break-inside-avoid mb-4">
                <DrawingCard
                  drawing={drawing}
                  index={idx}
                  isSaved
                  authorName={drawing.author.toText()}
                  onSave={(id) => unsaveMutation.mutate(id)}
                />
              </div>
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                onClick={loadMore}
                disabled={isLoadingMore}
                className="gap-2 min-w-[160px]"
                data-ocid="saved.load_more_button"
              >
                {isLoadingMore ? (
                  <>
                    <span className="w-4 h-4 border-2 border-muted-foreground/40 border-t-foreground rounded-full animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} />
                    Load more
                  </>
                )}
              </Button>
            </div>
          )}

          {!hasMore && allItems.length > PAGE_SIZE && (
            <p
              className="text-center text-sm text-muted-foreground mt-8"
              data-ocid="saved.end_of_list"
            >
              You've seen all {totalItems} saved drawings
            </p>
          )}
        </>
      )}
    </Layout>
  );
}
