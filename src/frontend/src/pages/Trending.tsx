import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Flame, TrendingUp } from "lucide-react";
import { DrawingCard } from "../components/DrawingCard";
import { Layout } from "../components/Layout";
import { useAuth } from "../hooks/use-auth";
import { useBackend } from "../hooks/use-backend";

const RANK_STYLES: Record<number, string> = {
  1: "bg-primary text-primary-foreground",
  2: "bg-muted-foreground/70 text-card",
  3: "bg-accent/80 text-accent-foreground",
};

export default function TrendingPage() {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: trending, isLoading } = useQuery({
    queryKey: ["drawings", "trending"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTrendingDrawings(20n);
    },
    enabled: !!actor && !isFetching,
  });

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

  return (
    <Layout>
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <TrendingUp size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Trending This Week
            </h1>
            <p className="text-muted-foreground text-sm">
              Most-liked drawings from the community
            </p>
          </div>
          {trending && trending.length > 0 && (
            <Badge
              variant="secondary"
              className="ml-auto flex items-center gap-1"
            >
              <Flame size={12} />
              {trending.length} hot picks
            </Badge>
          )}
        </div>
      </div>

      {/* Top 3 podium — prominent featured row */}
      {!isLoading && trending && trending.length >= 3 && (
        <div
          className="grid grid-cols-3 gap-4 mb-8"
          data-ocid="trending.top3_section"
        >
          {trending.slice(0, 3).map((drawing, idx) => (
            <div key={String(drawing.id)} className="relative">
              <div
                className={`absolute -top-2 -left-2 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${RANK_STYLES[idx + 1] ?? "bg-muted text-foreground"}`}
              >
                #{idx + 1}
              </div>
              <DrawingCard
                drawing={drawing}
                index={idx}
                authorName={drawing.author.toText()}
                onLike={
                  isAuthenticated ? (id) => likeMutation.mutate(id) : undefined
                }
                onSave={
                  isAuthenticated ? (id) => saveMutation.mutate(id) : undefined
                }
              />
            </div>
          ))}
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading ? (
        <div
          className="columns-2 md:columns-3 lg:columns-4 gap-4"
          data-ocid="trending.loading_state"
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
      ) : !trending || trending.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          data-ocid="trending.empty_state"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <TrendingUp size={28} className="text-muted-foreground" />
          </div>
          <h3 className="font-display text-lg font-semibold mb-1">
            Nothing trending yet
          </h3>
          <p className="text-muted-foreground text-sm">
            Start liking drawings to see what's popular!
          </p>
        </div>
      ) : (
        <>
          {/* Remaining drawings after top 3 */}
          {trending.length > 3 && (
            <>
              <div className="flex items-center gap-3 mb-5">
                <h2 className="font-display text-base font-semibold text-muted-foreground uppercase tracking-wide text-sm">
                  More Trending
                </h2>
                <div className="flex-1 border-t border-border" />
              </div>
              <div
                className="columns-2 md:columns-3 lg:columns-4 gap-4"
                data-ocid="trending.drawing_list"
              >
                {trending.slice(3).map((drawing, idx) => (
                  <div
                    key={String(drawing.id)}
                    className="break-inside-avoid mb-4 relative"
                  >
                    <div className="absolute -top-1.5 -left-1.5 z-10 w-5 h-5 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs font-medium text-muted-foreground">
                      {idx + 4}
                    </div>
                    <DrawingCard
                      drawing={drawing}
                      index={idx + 3}
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
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </Layout>
  );
}
