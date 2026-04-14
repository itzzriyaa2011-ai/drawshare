import { c as createLucideIcon, u as useAuth, e as useNavigate, r as reactExports, j as jsxRuntimeExports, L as Layout, U as Upload, f as Button, g as LogIn, h as ue } from "./index-D4tdokbz.js";
import { I as Input } from "./input-DGDa2hNz.js";
import { L as Label, T as Textarea } from "./textarea-CVSyc5WT.js";
import { u as useBackend, b as useMutation, E as ExternalBlob } from "./use-backend-CSYGU6gL.js";
import { X } from "./x-C-9_9A_D.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 5h6", key: "1vod17" }],
  ["path", { d: "M19 2v6", key: "4bpg5p" }],
  ["path", { d: "M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5", key: "1ue2ih" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }]
];
const ImagePlus = createLucideIcon("image-plus", __iconNode);
function UploadPage() {
  const { actor } = useBackend();
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [tagInput, setTagInput] = reactExports.useState("");
  const [tags, setTags] = reactExports.useState([]);
  const [imageFile, setImageFile] = reactExports.useState(null);
  const [previewUrl, setPreviewUrl] = reactExports.useState(null);
  const [uploadProgress, setUploadProgress] = reactExports.useState(0);
  const [titleError, setTitleError] = reactExports.useState("");
  const [imageError, setImageError] = reactExports.useState("");
  const addTag = reactExports.useCallback(() => {
    const normalized = tagInput.trim().toLowerCase().replace(/^#/, "");
    if (!normalized) return;
    const newTags = normalized.split(",").map((t) => t.trim()).filter((t) => t && !tags.includes(t));
    if (newTags.length) setTags((prev) => [...prev, ...newTags]);
    setTagInput("");
  }, [tagInput, tags]);
  const removeTag = (tag) => setTags((prev) => prev.filter((t) => t !== tag));
  const handleFileChange = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setImageError("");
  };
  const handleDrop = (e) => {
    var _a;
    e.preventDefault();
    const file = (_a = e.dataTransfer.files) == null ? void 0 : _a[0];
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setImageError("");
  };
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      if (!imageFile) throw new Error("No image selected");
      setUploadProgress(0);
      const buffer = new Uint8Array(await imageFile.arrayBuffer());
      const blob = ExternalBlob.fromBytes(buffer).withUploadProgress((pct) => {
        setUploadProgress(pct);
      });
      return actor.postDrawing({
        title: title.trim(),
        description: description.trim(),
        tags,
        imageBlob: blob
      });
    },
    onSuccess: (drawing) => {
      ue.success("Drawing uploaded successfully!");
      navigate({ to: "/drawing/$id", params: { id: String(drawing.id) } });
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Upload failed. Please try again.";
      ue.error(message);
      setUploadProgress(0);
    }
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;
    if (!title.trim()) {
      setTitleError("Title is required.");
      valid = false;
    }
    if (!imageFile) {
      setImageError("Please select an image.");
      valid = false;
    }
    if (!valid) return;
    uploadMutation.mutate();
  };
  const isUploading = uploadMutation.isPending;
  const canSubmit = !isUploading;
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-24 text-center",
        "data-ocid": "upload.auth_gate",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 ring-1 ring-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 32, className: "text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold mb-2", children: "Sign in to share your art" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-8 max-w-xs", children: "Join the riartsy community — upload your drawings and get discovered by artists worldwide." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "lg",
              onClick: login,
              className: "flex items-center gap-2 px-8",
              "data-ocid": "upload.login_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { size: 18 }),
                " Sign In to Upload"
              ]
            }
          )
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto pb-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold text-foreground mb-1", children: "Upload Drawing" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Share your artwork with the riartsy community" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        onSubmit: handleSubmit,
        className: "space-y-7",
        "data-ocid": "upload.form",
        noValidate: true,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
              "Drawing Image",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", "aria-hidden": true, children: "*" })
            ] }),
            previewUrl ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-2xl overflow-hidden border border-border bg-card aspect-[4/3]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: previewUrl,
                  alt: "Drawing preview",
                  className: "w-full h-full object-contain"
                }
              ),
              isUploading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-foreground/60 flex flex-col items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-48 h-2 bg-card/30 rounded-full overflow-hidden",
                    "aria-label": `Upload progress: ${uploadProgress}%`,
                    "data-ocid": "upload.loading_state",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "h-full bg-primary rounded-full transition-all duration-200",
                        style: { width: `${uploadProgress}%` }
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-card text-sm font-medium", children: [
                  "Uploading… ",
                  uploadProgress,
                  "%"
                ] })
              ] }),
              !isUploading && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setImageFile(null);
                    setPreviewUrl(null);
                    setUploadProgress(0);
                  },
                  className: "absolute top-3 right-3 w-8 h-8 bg-card rounded-full border border-border flex items-center justify-center hover:bg-muted transition-smooth shadow-sm",
                  "aria-label": "Remove image",
                  "data-ocid": "upload.remove_image_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 })
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                htmlFor: "image-upload",
                className: "group flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl aspect-[4/3] cursor-pointer bg-card hover:bg-muted/40 hover:border-primary/40 transition-smooth",
                onDrop: handleDrop,
                onDragOver: (e) => e.preventDefault(),
                "data-ocid": "upload.dropzone",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { size: 28, className: "text-primary" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground mb-1", children: "Click to upload or drag & drop" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "PNG, JPG, WEBP, GIF — up to 10 MB" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      id: "image-upload",
                      type: "file",
                      accept: "image/*",
                      className: "sr-only",
                      onChange: handleFileChange,
                      "data-ocid": "upload.image_input"
                    }
                  )
                ]
              }
            ),
            imageError && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-destructive text-xs mt-1",
                role: "alert",
                "data-ocid": "upload.image_field_error",
                children: imageError
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "title", children: [
              "Title",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", "aria-hidden": true, children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "title",
                placeholder: "Give your drawing a name…",
                value: title,
                onChange: (e) => {
                  setTitle(e.target.value);
                  if (e.target.value.trim()) setTitleError("");
                },
                onBlur: () => {
                  if (!title.trim()) setTitleError("Title is required.");
                },
                maxLength: 100,
                "aria-describedby": titleError ? "title-error" : void 0,
                "aria-invalid": !!titleError,
                "data-ocid": "upload.title_input"
              }
            ),
            titleError && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                id: "title-error",
                className: "text-destructive text-xs",
                role: "alert",
                "data-ocid": "upload.title_field_error",
                children: titleError
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "description", children: [
              "Description",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal text-xs", children: "(optional)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "description",
                placeholder: "Tell us about your drawing — tools used, inspiration, story behind it…",
                value: description,
                onChange: (e) => setDescription(e.target.value),
                rows: 4,
                maxLength: 1e3,
                "data-ocid": "upload.description_textarea"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-right", children: [
              description.length,
              "/1000"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "tag-input", children: [
              "Tags",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal text-xs", children: "(optional — press Enter or comma to add)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "tag-input",
                  placeholder: "#watercolor, #portrait…",
                  value: tagInput,
                  onChange: (e) => setTagInput(e.target.value),
                  onKeyDown: (e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addTag();
                    }
                  },
                  "data-ocid": "upload.tag_input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: addTag,
                  "data-ocid": "upload.add_tag_button",
                  children: "Add"
                }
              )
            ] }),
            tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 pt-1", children: tags.map((tag, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "flex items-center gap-1 bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm font-medium",
                "data-ocid": `upload.tag.${i + 1}`,
                children: [
                  "#",
                  tag,
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => removeTag(tag),
                      className: "ml-0.5 hover:text-destructive transition-colors",
                      "aria-label": `Remove tag ${tag}`,
                      "data-ocid": `upload.remove_tag_button.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12 })
                    }
                  )
                ]
              },
              tag
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                size: "lg",
                disabled: !canSubmit,
                className: "w-full gap-2 text-base",
                "data-ocid": "upload.submit_button",
                children: isUploading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin",
                      "aria-hidden": true
                    }
                  ),
                  "Uploading… ",
                  uploadProgress > 0 ? `${uploadProgress}%` : ""
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 18 }),
                  "Upload Drawing"
                ] })
              }
            ),
            !title.trim() && !imageFile && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground mt-3", children: "A title and image are required to post" })
          ] })
        ]
      }
    )
  ] }) });
}
export {
  UploadPage as default
};
