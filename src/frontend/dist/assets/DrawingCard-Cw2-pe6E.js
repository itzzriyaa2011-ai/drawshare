import { j as jsxRuntimeExports, d as Link, B as Bookmark } from "./index-D4tdokbz.js";
import { B as Badge, H as Heart } from "./badge-DSGlaz1B.js";
function formatCount(n) {
  const num = Number(n);
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}k`;
  return String(num);
}
function DrawingCard({
  drawing,
  index = 0,
  onLike,
  onSave,
  isLiked = false,
  isSaved = false,
  authorName,
  authorAvatarUrl
}) {
  const imageUrl = drawing.imageBlob.getDirectURL();
  const ocidPrefix = `drawing.item.${index + 1}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "article",
    {
      className: "bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group",
      "data-ocid": ocidPrefix,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/drawing/$id",
            params: { id: String(drawing.id) },
            "data-ocid": `${ocidPrefix}.link`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[4/3] overflow-hidden bg-muted relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: imageUrl,
                alt: drawing.title,
                className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
                loading: "lazy"
              }
            ) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/drawing/$id", params: { id: String(drawing.id) }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground text-base leading-snug mb-2 truncate hover:text-primary transition-colors", children: drawing.title }) }),
          drawing.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mb-3", children: drawing.tags.slice(0, 3).map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "secondary",
              className: "text-xs px-2 py-0.5 rounded-full font-normal",
              children: [
                "#",
                tag
              ]
            },
            tag
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/profile/$id",
                params: { id: drawing.author.toText() },
                className: "flex items-center gap-2 min-w-0",
                "data-ocid": `${ocidPrefix}.author_link`,
                children: [
                  authorAvatarUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: authorAvatarUrl,
                      alt: authorName ?? "Artist",
                      className: "w-6 h-6 rounded-full object-cover shrink-0"
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary text-xs font-bold", children: (authorName ?? "A")[0].toUpperCase() }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground truncate hover:text-foreground transition-colors", children: authorName ?? "Artist" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => onLike == null ? void 0 : onLike(drawing.id),
                  "aria-label": isLiked ? "Unlike" : "Like",
                  className: "flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive transition-colors duration-200",
                  "data-ocid": `${ocidPrefix}.like_button`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Heart,
                      {
                        size: 15,
                        className: isLiked ? "fill-destructive text-destructive" : ""
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatCount(drawing.likeCount) })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => onSave == null ? void 0 : onSave(drawing.id),
                  "aria-label": isSaved ? "Unsave" : "Save",
                  className: "flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors duration-200",
                  "data-ocid": `${ocidPrefix}.save_button`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Bookmark,
                    {
                      size: 15,
                      className: isSaved ? "fill-accent text-accent" : ""
                    }
                  )
                }
              )
            ] })
          ] })
        ] })
      ]
    }
  );
}
export {
  DrawingCard as D
};
