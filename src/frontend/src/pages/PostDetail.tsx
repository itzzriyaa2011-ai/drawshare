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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Download,
  Heart,
  Share2,
  Trash2,
  UserCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import { useAuth } from "../hooks/use-auth";
import {
  useDeletePost,
  useLikePost,
  usePost,
  useSavePost,
  useUnsavePost,
} from "../hooks/use-posts";

export default function PostDetailPage() {
  const { id } = useParams({ from: "/post/$id" });
  const navigate = useNavigate();
  const { isAuthenticated, identity } = useAuth();
  const postId = BigInt(id);

  const { data: post, isLoading } = usePost(postId);
  const likeMutation = useLikePost();
  const saveMutation = useSavePost();
  const unsaveMutation = useUnsavePost();
  const deleteMutation = useDeletePost();

  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const callerPrincipal = identity?.getPrincipal();
  const isAuthor = !!(
    callerPrincipal &&
    post?.authorId &&
    post.authorId.toString() === callerPrincipal.toText()
  );

  function handleDownload() {
    if (!post) return;
    const a = document.createElement("a");
    a.href = post.imageUrl;
    a.download = `${post.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.jpg`;
    a.click();
    toast.success("Download started!");
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  }

  async function handleDelete() {
    if (!post) return;
    await deleteMutation.mutateAsync(post.id);
    toast.success("Post deleted.");
    navigate({ to: "/" });
  }

  if (isLoading) {
    return (
      <Layout>
        <div
          className="max-w-5xl mx-auto py-8"
          data-ocid="post_detail.loading_state"
        >
          <Skeleton className="h-8 w-24 mb-8 rounded-full" />
          <div className="grid lg:grid-cols-[1fr_360px] gap-10">
            <Skeleton className="aspect-[4/3] rounded-2xl w-full" />
            <div className="space-y-4">
              <Skeleton className="h-9 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-12 w-full rounded-xl mt-4" />
              <div className="flex gap-3">
                <Skeleton className="h-10 flex-1 rounded-xl" />
                <Skeleton className="h-10 flex-1 rounded-xl" />
                <Skeleton className="h-10 w-10 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div
          className="flex flex-col items-center justify-center py-32 text-center gap-5"
          data-ocid="post_detail.error_state"
        >
          <div className="text-6xl">📸</div>
          <h2 className="font-display text-2xl font-bold">Post not found</h2>
          <p className="text-muted-foreground max-w-xs">
            This post may have been removed or the link is incorrect.
          </p>
          <Button asChild variant="default" data-ocid="post_detail.back_button">
            <Link to="/">Back to Feed</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const authorProfilePath =
    !post.isAnonymous && post.authorId
      ? {
          to: "/profile/$id" as const,
          params: { id: post.authorId.toString() },
        }
      : null;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-8">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
            onClick={() => history.back()}
            data-ocid="post_detail.back_button"
          >
            <ArrowLeft size={15} />
            Back
          </Button>
        </motion.div>

        <div
          className="grid lg:grid-cols-[1fr_360px] gap-10 items-start"
          data-ocid="post_detail.page"
        >
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="rounded-2xl overflow-hidden border border-border bg-card shadow-subtle"
          >
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-auto object-contain max-h-[80vh]"
            />
          </motion.div>

          {/* Info panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            className="flex flex-col gap-5"
          >
            {/* Title + caption */}
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-2 leading-tight">
                {post.title}
              </h1>
              {post.caption && (
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {post.caption}
                </p>
              )}
            </div>

            {/* Author card */}
            {authorProfilePath ? (
              <Link
                {...authorProfilePath}
                className="flex items-center gap-3 group p-3 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all"
                data-ocid="post_detail.author_link"
              >
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <UserCircle size={20} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">
                    {post.authorName ?? "Riartsy User"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(
                      Number(post.createdAt) / 1_000_000,
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <span className="ml-auto text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  View profile →
                </span>
              </Link>
            ) : (
              <div
                className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card"
                data-ocid="post_detail.author_anonymous"
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <UserCircle size={20} className="text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-sm">
                    Anonymous
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(
                      Number(post.createdAt) / 1_000_000,
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            )}

            {/* Like / Save / Share / Download */}
            <div
              className="flex items-center gap-2"
              data-ocid="post_detail.actions"
            >
              <Button
                variant="outline"
                className="gap-2 flex-1"
                onClick={() => {
                  if (!isAuthenticated) return;
                  setIsLiked((prev) => !prev);
                  likeMutation.mutate(post.id);
                }}
                disabled={!isAuthenticated || likeMutation.isPending}
                data-ocid="post_detail.like_button"
              >
                <Heart
                  size={15}
                  className={isLiked ? "text-red-500 fill-red-500" : ""}
                />
                <span>{String(post.likeCount)}</span>
                <span className="hidden sm:inline">Like</span>
              </Button>

              <Button
                variant="outline"
                className="gap-2 flex-1"
                onClick={() => {
                  if (!isAuthenticated) return;
                  setIsSaved((prev) => !prev);
                  if (isSaved) {
                    unsaveMutation.mutate(post.id);
                  } else {
                    saveMutation.mutate(post.id);
                  }
                }}
                disabled={
                  !isAuthenticated ||
                  saveMutation.isPending ||
                  unsaveMutation.isPending
                }
                data-ocid="post_detail.save_button"
              >
                {isSaved ? (
                  <BookmarkCheck size={15} className="text-accent" />
                ) : (
                  <Bookmark size={15} />
                )}
                <span>{String(post.savedCount)}</span>
                <span className="hidden sm:inline">Save</span>
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={handleDownload}
                aria-label="Download photo"
                data-ocid="post_detail.download_button"
              >
                <Download size={15} />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                aria-label="Share post"
                data-ocid="post_detail.share_button"
              >
                <Share2 size={15} />
              </Button>
            </div>

            {/* Auth nudge */}
            {!isAuthenticated && (
              <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 text-center">
                Sign in to like and save photos.
              </p>
            )}

            {/* Delete (own post only) */}
            {isAuthor && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 w-full"
                    data-ocid="post_detail.delete_button"
                  >
                    <Trash2 size={15} />
                    Delete Post
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent data-ocid="post_detail.dialog">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The photo will be
                      permanently removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel data-ocid="post_detail.cancel_button">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={handleDelete}
                      data-ocid="post_detail.confirm_button"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {/* Stats footer */}
            <div className="text-xs text-muted-foreground border-t border-border pt-4 flex justify-between">
              <span>{String(post.savedCount)} saves</span>
              <span>{String(post.likeCount)} likes</span>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
