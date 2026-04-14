import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ImagePlus, LogIn, Upload, X } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { Layout } from "../components/Layout";
import { useAuth } from "../hooks/use-auth";
import { useBackend } from "../hooks/use-backend";

export default function UploadPage() {
  const { actor } = useBackend();
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [titleError, setTitleError] = useState("");
  const [imageError, setImageError] = useState("");

  const addTag = useCallback(() => {
    const normalized = tagInput.trim().toLowerCase().replace(/^#/, "");
    if (!normalized) return;
    const newTags = normalized
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t && !tags.includes(t));
    if (newTags.length) setTags((prev) => [...prev, ...newTags]);
    setTagInput("");
  }, [tagInput, tags]);

  const removeTag = (tag: string) =>
    setTags((prev) => prev.filter((t) => t !== tag));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setImageError("");
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
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
        imageBlob: blob,
      });
    },
    onSuccess: (drawing) => {
      toast.success("Drawing uploaded successfully!");
      navigate({ to: "/drawing/$id", params: { id: String(drawing.id) } });
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "Upload failed. Please try again.";
      toast.error(message);
      setUploadProgress(0);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
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

  // ── Auth gate ──────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <Layout>
        <div
          className="flex flex-col items-center justify-center py-24 text-center"
          data-ocid="upload.auth_gate"
        >
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 ring-1 ring-primary/20">
            <Upload size={32} className="text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-2">
            Sign in to share your art
          </h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-xs">
            Join the riartsy community — upload your drawings and get discovered
            by artists worldwide.
          </p>
          <Button
            size="lg"
            onClick={login}
            className="flex items-center gap-2 px-8"
            data-ocid="upload.login_button"
          >
            <LogIn size={18} /> Sign In to Upload
          </Button>
        </div>
      </Layout>
    );
  }

  // ── Upload form ────────────────────────────────────────────────────────────
  return (
    <Layout>
      <div className="max-w-2xl mx-auto pb-12">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">
            Upload Drawing
          </h1>
          <p className="text-muted-foreground text-sm">
            Share your artwork with the riartsy community
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-7"
          data-ocid="upload.form"
          noValidate
        >
          {/* ── Image picker ── */}
          <div className="space-y-2">
            <Label>
              Drawing Image{" "}
              <span className="text-destructive" aria-hidden>
                *
              </span>
            </Label>

            {previewUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-border bg-card aspect-[4/3]">
                <img
                  src={previewUrl}
                  alt="Drawing preview"
                  className="w-full h-full object-contain"
                />

                {/* Progress overlay */}
                {isUploading && (
                  <div className="absolute inset-0 bg-foreground/60 flex flex-col items-center justify-center gap-3">
                    <div
                      className="w-48 h-2 bg-card/30 rounded-full overflow-hidden"
                      aria-label={`Upload progress: ${uploadProgress}%`}
                      data-ocid="upload.loading_state"
                    >
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <span className="text-card text-sm font-medium">
                      Uploading… {uploadProgress}%
                    </span>
                  </div>
                )}

                {/* Remove button */}
                {!isUploading && (
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setPreviewUrl(null);
                      setUploadProgress(0);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 bg-card rounded-full border border-border flex items-center justify-center hover:bg-muted transition-smooth shadow-sm"
                    aria-label="Remove image"
                    data-ocid="upload.remove_image_button"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ) : (
              <label
                htmlFor="image-upload"
                className="group flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl aspect-[4/3] cursor-pointer bg-card hover:bg-muted/40 hover:border-primary/40 transition-smooth"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                data-ocid="upload.dropzone"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-smooth">
                  <ImagePlus size={28} className="text-primary" />
                </div>
                <p className="font-semibold text-foreground mb-1">
                  Click to upload or drag &amp; drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WEBP, GIF — up to 10 MB
                </p>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFileChange}
                  data-ocid="upload.image_input"
                />
              </label>
            )}

            {imageError && (
              <p
                className="text-destructive text-xs mt-1"
                role="alert"
                data-ocid="upload.image_field_error"
              >
                {imageError}
              </p>
            )}
          </div>

          {/* ── Title ── */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title{" "}
              <span className="text-destructive" aria-hidden>
                *
              </span>
            </Label>
            <Input
              id="title"
              placeholder="Give your drawing a name…"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setTitleError("");
              }}
              onBlur={() => {
                if (!title.trim()) setTitleError("Title is required.");
              }}
              maxLength={100}
              aria-describedby={titleError ? "title-error" : undefined}
              aria-invalid={!!titleError}
              data-ocid="upload.title_input"
            />
            {titleError && (
              <p
                id="title-error"
                className="text-destructive text-xs"
                role="alert"
                data-ocid="upload.title_field_error"
              >
                {titleError}
              </p>
            )}
          </div>

          {/* ── Description ── */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description{" "}
              <span className="text-muted-foreground font-normal text-xs">
                (optional)
              </span>
            </Label>
            <Textarea
              id="description"
              placeholder="Tell us about your drawing — tools used, inspiration, story behind it…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={1000}
              data-ocid="upload.description_textarea"
            />
            <p className="text-xs text-muted-foreground text-right">
              {description.length}/1000
            </p>
          </div>

          {/* ── Tags ── */}
          <div className="space-y-2">
            <Label htmlFor="tag-input">
              Tags{" "}
              <span className="text-muted-foreground font-normal text-xs">
                (optional — press Enter or comma to add)
              </span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="tag-input"
                placeholder="#watercolor, #portrait…"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                data-ocid="upload.tag_input"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addTag}
                data-ocid="upload.add_tag_button"
              >
                Add
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {tags.map((tag, i) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm font-medium"
                    data-ocid={`upload.tag.${i + 1}`}
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-0.5 hover:text-destructive transition-colors"
                      aria-label={`Remove tag ${tag}`}
                      data-ocid={`upload.remove_tag_button.${i + 1}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── Submit ── */}
          <div className="pt-2">
            <Button
              type="submit"
              size="lg"
              disabled={!canSubmit}
              className="w-full gap-2 text-base"
              data-ocid="upload.submit_button"
            >
              {isUploading ? (
                <>
                  <span
                    className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin"
                    aria-hidden
                  />
                  Uploading… {uploadProgress > 0 ? `${uploadProgress}%` : ""}
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Upload Drawing
                </>
              )}
            </Button>

            {!title.trim() && !imageFile && (
              <p className="text-center text-xs text-muted-foreground mt-3">
                A title and image are required to post
              </p>
            )}
          </div>
        </form>
      </div>
    </Layout>
  );
}
