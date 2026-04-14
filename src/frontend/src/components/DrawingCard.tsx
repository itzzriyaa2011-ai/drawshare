import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { Bookmark, Heart } from "lucide-react";
import type { Drawing } from "../types";

interface DrawingCardProps {
  drawing: Drawing;
  index?: number;
  onLike?: (id: bigint) => void;
  onSave?: (id: bigint) => void;
  isLiked?: boolean;
  isSaved?: boolean;
  authorName?: string;
  authorAvatarUrl?: string;
}

function formatCount(n: bigint): string {
  const num = Number(n);
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return String(num);
}

export function DrawingCard({
  drawing,
  index = 0,
  onLike,
  onSave,
  isLiked = false,
  isSaved = false,
  authorName,
  authorAvatarUrl,
}: DrawingCardProps) {
  const imageUrl = drawing.imageBlob.getDirectURL();
  const ocidPrefix = `drawing.item.${index + 1}`;

  return (
    <article
      className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group"
      data-ocid={ocidPrefix}
    >
      {/* Image */}
      <Link
        to="/drawing/$id"
        params={{ id: String(drawing.id) }}
        data-ocid={`${ocidPrefix}.link`}
      >
        <div className="aspect-[4/3] overflow-hidden bg-muted relative">
          <img
            src={imageUrl}
            alt={drawing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to="/drawing/$id" params={{ id: String(drawing.id) }}>
          <h3 className="font-display font-semibold text-foreground text-base leading-snug mb-2 truncate hover:text-primary transition-colors">
            {drawing.title}
          </h3>
        </Link>

        {/* Tags */}
        {drawing.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {drawing.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs px-2 py-0.5 rounded-full font-normal"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Author + actions row */}
        <div className="flex items-center justify-between gap-2">
          <Link
            to="/profile/$id"
            params={{ id: drawing.author.toText() }}
            className="flex items-center gap-2 min-w-0"
            data-ocid={`${ocidPrefix}.author_link`}
          >
            {authorAvatarUrl ? (
              <img
                src={authorAvatarUrl}
                alt={authorName ?? "Artist"}
                className="w-6 h-6 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <span className="text-primary text-xs font-bold">
                  {(authorName ?? "A")[0].toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-sm text-muted-foreground truncate hover:text-foreground transition-colors">
              {authorName ?? "Artist"}
            </span>
          </Link>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onLike?.(drawing.id)}
              aria-label={isLiked ? "Unlike" : "Like"}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive transition-colors duration-200"
              data-ocid={`${ocidPrefix}.like_button`}
            >
              <Heart
                size={15}
                className={isLiked ? "fill-destructive text-destructive" : ""}
              />
              <span>{formatCount(drawing.likeCount)}</span>
            </button>

            <button
              type="button"
              onClick={() => onSave?.(drawing.id)}
              aria-label={isSaved ? "Unsave" : "Save"}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors duration-200"
              data-ocid={`${ocidPrefix}.save_button`}
            >
              <Bookmark
                size={15}
                className={isSaved ? "fill-accent text-accent" : ""}
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
