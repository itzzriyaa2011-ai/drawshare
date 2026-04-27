import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Bookmark, Heart, UserCircle } from "lucide-react";
import { motion } from "motion/react";
import { useUserProfile } from "../hooks/use-user";
import type { PostCardData, UserId } from "../types";

interface PostCardProps {
  post: PostCardData;
  index?: number;
  onLike?: (id: bigint) => void;
  onSave?: (id: bigint) => void;
  isLiked?: boolean;
  isSaved?: boolean;
}

export function PostCard({
  post,
  index = 0,
  onLike,
  onSave,
  isLiked = false,
  isSaved = false,
}: PostCardProps) {
  const navigate = useNavigate();
  const { data: authorProfile } = useUserProfile(
    !post.isAnonymous ? (post.authorId as UserId | undefined) : undefined,
  );
  const resolvedAuthorName = post.isAnonymous
    ? "Anonymous"
    : (post.authorName ?? authorProfile?.displayName ?? "PicVibe User");

  function handleCardClick() {
    navigate({ to: "/post/$id", params: { id: String(post.id) } });
  }

  function handleLike(e: React.MouseEvent) {
    e.stopPropagation();
    onLike?.(post.id);
  }

  function handleSave(e: React.MouseEvent) {
    e.stopPropagation();
    onSave?.(post.id);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.06,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="masonry-item group relative cursor-pointer"
      onClick={handleCardClick}
      data-ocid={`post.item.${index + 1}`}
    >
      <div className="rounded-2xl overflow-hidden bg-card border border-border shadow-xs card-hover">
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.title}
            loading="lazy"
            className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ display: "block" }}
          />

          {/* Hover overlay with actions */}
          <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3 gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-full glass text-white hover:text-red-400 ${isLiked ? "text-red-400" : ""}`}
              onClick={handleLike}
              aria-label="Like post"
              data-ocid={`post.like_button.${index + 1}`}
            >
              <Heart size={15} fill={isLiked ? "currentColor" : "none"} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-full glass text-white hover:text-accent ${isSaved ? "text-accent" : ""}`}
              onClick={handleSave}
              aria-label="Save post"
              data-ocid={`post.save_button.${index + 1}`}
            >
              <Bookmark size={15} fill={isSaved ? "currentColor" : "none"} />
            </Button>
          </div>

          {/* Anonymous badge */}
          {post.isAnonymous && (
            <div className="absolute top-2 left-2">
              <Badge
                variant="secondary"
                className="text-xs glass border-0 text-white font-medium"
              >
                Anonymous
              </Badge>
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="p-3">
          {post.title && (
            <h3 className="font-display font-semibold text-sm text-foreground line-clamp-1 mb-1">
              {post.title}
            </h3>
          )}
          {post.caption && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {post.caption}
            </p>
          )}

          {/* Footer: author + stats */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/60">
            <div className="flex items-center gap-1.5 min-w-0">
              <UserCircle
                size={14}
                className="text-muted-foreground shrink-0"
              />
              <span className="text-xs text-muted-foreground truncate">
                {resolvedAuthorName}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                <Heart size={11} />
                {String(post.likeCount)}
              </span>
              <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                <Bookmark size={11} />
                {String(post.savedCount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
