import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Download,
  Heart,
  Share2,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import { useAuth } from "../hooks/use-auth";
import { useBackend } from "../hooks/use-backend";

export default function DrawingDetailPage() {
  const { id } = useParams({ from: "/drawing/$id" });
  const { actor, isFetching } = useBackend();
  const { isAuthenticated, identity } = useAuth();
  const queryClient = useQueryClient();

  const drawingId = BigInt(id);

  // Fetch drawing
  const { data: drawing, isLoading: isDrawingLoading } = useQuery({
    queryKey: ["drawing", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDrawing(drawingId);
    },
    enabled: !!actor && !isFetching,
  });

  // Fetch author profile
  const { data: author } = useQuery({
    queryKey: ["userProfile", drawing?.author.toText()],
    queryFn: async () => {
      if (!actor || !drawing) return null;
      return actor.getUserProfile(drawing.author);
    },
    enabled: !!actor && !!drawing,
  });

  // Fetch liked-by list to determine if caller liked this drawing
  const { data: likedBy } = useQuery({
    queryKey: ["likedBy", id],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLikedBy(drawingId);
    },
    enabled: !!actor && !isFetching,
  });

  // Optimistic like count & liked state
  const callerPrincipal = identity?.getPrincipal();
  const isLiked = !!(
    callerPrincipal &&
    likedBy?.some((p) => p.toText() === callerPrincipal.toText())
  );
  const isAuthor = !!(
    callerPrincipal &&
    drawing &&
    drawing.author.toText() === callerPrincipal.toText()
  );

  // Fetch saved drawings to determine saved state
  const { data: savedPage } = useQuery({
    queryKey: ["savedDrawings", "check", id],
    queryFn: async () => {
      if (!actor || !isAuthenticated) return null;
      return actor.getSavedDrawings(0n, 200n);
    },
    enabled: !!actor && isAuthenticated,
  });
  const isSaved = !!savedPage?.items?.some((d) => d.id === drawingId);

  // Like / unlike toggle
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!actor) return;
      if (isLiked) {
        await actor.unlikeDrawing(drawingId);
      } else {
        await actor.likeDrawing(drawingId);
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["drawing", id] });
      await queryClient.cancelQueries({ queryKey: ["likedBy", id] });
      const prevDrawing = queryClient.getQueryData(["drawing", id]);
      const prevLikedBy = queryClient.getQueryData(["likedBy", id]);
      // Optimistically update likeCount
      queryClient.setQueryData(["drawing", id], (old: typeof drawing) => {
        if (!old) return old;
        return {
          ...old,
          likeCount: isLiked ? old.likeCount - 1n : old.likeCount + 1n,
        };
      });
      // Optimistically update likedBy
      queryClient.setQueryData(["likedBy", id], (old: typeof likedBy) => {
        if (!old || !callerPrincipal) return old;
        if (isLiked) {
          return old.filter((p) => p.toText() !== callerPrincipal.toText());
        }
        return [...old, callerPrincipal];
      });
      return { prevDrawing, prevLikedBy };
    },
    onError: (_err, _vars, context) => {
      if (context?.prevDrawing !== undefined)
        queryClient.setQueryData(["drawing", id], context.prevDrawing);
      if (context?.prevLikedBy !== undefined)
        queryClient.setQueryData(["likedBy", id], context.prevLikedBy);
      toast.error("Failed to update like. Please try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["drawing", id] });
      queryClient.invalidateQueries({ queryKey: ["likedBy", id] });
    },
  });

  // Save / unsave toggle
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) return;
      if (isSaved) {
        await actor.unsaveDrawing(drawingId);
      } else {
        await actor.saveDrawing(drawingId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedDrawings"] });
      toast.success(
        isSaved ? "Removed from saved" : "Drawing saved to your collection",
      );
    },
    onError: () => {
      toast.error("Failed to update save. Please try again.");
    },
  });

  // Delete drawing
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!actor) return;
      await actor.deleteDrawing(drawingId);
    },
    onSuccess: () => {
      toast.success("Drawing deleted.");
      queryClient.invalidateQueries({ queryKey: ["drawings"] });
    },
    onError: () => {
      toast.error("Failed to delete drawing.");
    },
  });

  // Download image
  const handleDownload = async () => {
    if (!drawing) return;
    try {
      const url = drawing.imageBlob.getDirectURL();
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${drawing.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      toast.success("Download started!");
    } catch {
      toast.error("Failed to download image.");
    }
  };

  // Share
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  // --- Loading state ---
  if (isDrawingLoading || isFetching) {
    return (
      <Layout>
        <div
          className="max-w-5xl mx-auto px-4 py-8"
          data-ocid="drawing_detail.loading_state"
        >
          <Skeleton className="h-8 w-24 mb-8 rounded-full" />
          <div className="grid lg:grid-cols-[1fr_380px] gap-10">
            <Skeleton className="aspect-[4/3] rounded-2xl w-full" />
            <div className="space-y-5">
              <Skeleton className="h-9 w-3/4 rounded-xl" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-24 rounded-full" />
              </div>
              <Skeleton className="h-14 w-full rounded-xl mt-4" />
              <div className="flex gap-3 pt-2">
                <Skeleton className="h-10 flex-1 rounded-xl" />
                <Skeleton className="h-10 flex-1 rounded-xl" />
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-10 w-10 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // --- 404 state ---
  if (!drawing) {
    return (
      <Layout>
        <div
          className="flex flex-col items-center justify-center py-32 text-center gap-5"
          data-ocid="drawing_detail.error_state"
        >
          <div className="text-6xl">🎨</div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Drawing not found
          </h2>
          <p className="text-muted-foreground max-w-xs">
            This drawing may have been removed or the link is incorrect.
          </p>
          <Button
            asChild
            variant="default"
            data-ocid="drawing_detail.back_button"
          >
            <Link to="/">Back to Gallery</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const likeCount = Number(drawing.likeCount);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back navigation */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-8"
        >
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
            data-ocid="drawing_detail.back_button"
          >
            <Link to="/">
              <ArrowLeft size={15} />
              Back to Gallery
            </Link>
          </Button>
        </motion.div>

        <div
          className="grid lg:grid-cols-[1fr_380px] gap-10 items-start"
          data-ocid="drawing_detail.page"
        >
          {/* Full-size image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="rounded-2xl overflow-hidden border border-border bg-card shadow-sm"
          >
            <img
              src={drawing.imageBlob.getDirectURL()}
              alt={drawing.title}
              className="w-full h-auto object-contain max-h-[75vh]"
            />
          </motion.div>

          {/* Info panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            {/* Title + description */}
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-3 leading-tight">
                {drawing.title}
              </h1>
              {drawing.description && (
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {drawing.description}
                </p>
              )}
            </div>

            {/* Tags */}
            {drawing.tags.length > 0 && (
              <div
                className="flex flex-wrap gap-2"
                data-ocid="drawing_detail.tags"
              >
                {drawing.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="rounded-full px-3 py-1 text-xs cursor-default hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Author */}
            {author && (
              <Link
                to="/profile/$id"
                params={{ id: drawing.author.toText() }}
                className="flex items-center gap-3 group p-3 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all"
                data-ocid="drawing_detail.author_link"
              >
                {author.avatarBlob ? (
                  <img
                    src={author.avatarBlob.getDirectURL()}
                    alt={author.username}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-border group-hover:ring-primary/40 transition-all"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center ring-2 ring-border group-hover:ring-primary/40 transition-all flex-shrink-0">
                    <span className="text-primary font-bold text-lg">
                      {author.username[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate text-sm">
                    {author.username}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {Number(author.followerCount).toLocaleString()} followers
                  </p>
                </div>
                <ArrowLeft
                  size={14}
                  className="ml-auto rotate-180 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0"
                />
              </Link>
            )}

            {/* Action buttons */}
            <div
              className="flex items-center gap-2"
              data-ocid="drawing_detail.actions"
            >
              {/* Like / Unlike */}
              <Button
                variant={isLiked ? "default" : "outline"}
                className="gap-2 flex-1 transition-all"
                onClick={() => isAuthenticated && likeMutation.mutate()}
                disabled={!isAuthenticated || likeMutation.isPending}
                data-ocid="drawing_detail.like_button"
              >
                <Heart size={15} className={isLiked ? "fill-current" : ""} />
                <span>{likeCount.toLocaleString()}</span>
                <span className="hidden sm:inline">
                  {isLiked ? "Liked" : "Like"}
                </span>
              </Button>

              {/* Save / Unsave */}
              <Button
                variant={isSaved ? "default" : "outline"}
                className="gap-2 flex-1 transition-all"
                onClick={() => isAuthenticated && saveMutation.mutate()}
                disabled={!isAuthenticated || saveMutation.isPending}
                data-ocid="drawing_detail.save_button"
              >
                {isSaved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                <span className="hidden sm:inline">
                  {isSaved ? "Saved" : "Save"}
                </span>
              </Button>

              {/* Download */}
              <Button
                variant="outline"
                size="icon"
                onClick={handleDownload}
                aria-label="Download drawing"
                data-ocid="drawing_detail.download_button"
                className="flex-shrink-0"
              >
                <Download size={15} />
              </Button>

              {/* Share */}
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                aria-label="Share drawing"
                data-ocid="drawing_detail.share_button"
                className="flex-shrink-0"
              >
                <Share2 size={15} />
              </Button>
            </div>

            {/* Auth hint */}
            {!isAuthenticated && (
              <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 text-center">
                Sign in to like, save, and download drawings.
              </p>
            )}

            {/* Delete button — author only */}
            {isAuthor && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 hover:border-destructive/60 w-full mt-2"
                    data-ocid="drawing_detail.delete_button"
                  >
                    <Trash2 size={15} />
                    Delete Drawing
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent data-ocid="drawing_detail.dialog">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this drawing?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The drawing will be
                      permanently removed from the gallery.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel data-ocid="drawing_detail.cancel_button">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => deleteMutation.mutate()}
                      data-ocid="drawing_detail.confirm_button"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {/* Metadata */}
            <div className="text-xs text-muted-foreground border-t border-border pt-4 flex justify-between">
              <span>{Number(drawing.savedCount).toLocaleString()} saves</span>
              <span>
                {new Date(
                  Number(drawing.createdAt) / 1_000_000,
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
