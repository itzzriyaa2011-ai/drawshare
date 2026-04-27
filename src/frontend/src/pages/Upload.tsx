import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { ImagePlus, LogIn, Upload, X } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { Layout } from "../components/Layout";
import { useAuth } from "../hooks/use-auth";
import { useCreatePost } from "../hooks/use-posts";

export default function UploadPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const createPost = useCreatePost();

  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [titleError, setTitleError] = useState("");
  const [imageError, setImageError] = useState("");

  const handleFileChange = useCallback((file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setImageError("Please upload a valid image file.");
      return;
    }
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setImageError("");
  }, []);

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files?.[0] ?? null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    if (!title.trim()) {
      setTitleError("Title is required.");
      valid = false;
    }
    if (!imageFile) {
      setImageError("Please select a photo.");
      valid = false;
    }
    if (!valid) return;

    try {
      setUploadProgress(0);
      const buffer = new Uint8Array(await imageFile!.arrayBuffer());
      const blob = ExternalBlob.fromBytes(buffer).withUploadProgress((pct) =>
        setUploadProgress(pct),
      );

      await createPost.mutateAsync({
        title: title.trim(),
        caption: caption.trim(),
        isAnonymous,
        imageBlob: blob,
      });

      toast.success("Photo uploaded successfully!");
      navigate({ to: "/" });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Upload failed. Please try again.",
      );
      setUploadProgress(0);
    }
  };

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
            Sign in to share photos
          </h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-xs">
            Join the riartsy community — upload your photos and get discovered.
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

  return (
    <Layout>
      <div className="max-w-2xl mx-auto pb-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">
            Upload Photo
          </h1>
          <p className="text-muted-foreground text-sm">
            Share your best moments with the riartsy community
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-7"
          data-ocid="upload.form"
          noValidate
        >
          {/* Image picker */}
          <div className="space-y-2">
            <Label>
              Photo{" "}
              <span className="text-destructive" aria-hidden>
                *
              </span>
            </Label>
            {previewUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-border bg-card max-h-96">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-contain max-h-80"
                />
                {createPost.isPending && (
                  <div
                    className="absolute inset-0 bg-foreground/60 flex flex-col items-center justify-center gap-3"
                    data-ocid="upload.loading_state"
                  >
                    <div className="w-48 h-2 bg-card/30 rounded-full overflow-hidden">
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
                {!createPost.isPending && (
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setPreviewUrl(null);
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
                className="group flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl py-16 cursor-pointer bg-card hover:bg-muted/40 hover:border-primary/40 transition-smooth"
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
                  PNG, JPG, WEBP — up to 10 MB
                </p>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) =>
                    handleFileChange(e.target.files?.[0] ?? null)
                  }
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

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title{" "}
              <span className="text-destructive" aria-hidden>
                *
              </span>
            </Label>
            <Input
              id="title"
              placeholder="Give your photo a title…"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setTitleError("");
              }}
              onBlur={() => {
                if (!title.trim()) setTitleError("Title is required.");
              }}
              maxLength={100}
              aria-invalid={!!titleError}
              data-ocid="upload.title_input"
            />
            {titleError && (
              <p
                className="text-destructive text-xs"
                role="alert"
                data-ocid="upload.title_field_error"
              >
                {titleError}
              </p>
            )}
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <Label htmlFor="caption">
              Caption{" "}
              <span className="text-muted-foreground font-normal text-xs">
                (optional)
              </span>
            </Label>
            <Textarea
              id="caption"
              placeholder="Write a caption for your photo…"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              maxLength={500}
              data-ocid="upload.caption_textarea"
            />
            <p className="text-xs text-muted-foreground text-right">
              {caption.length}/500
            </p>
          </div>

          {/* Anonymous checkbox */}
          <div className="flex items-start gap-3 bg-card border border-border rounded-xl px-4 py-3">
            <Checkbox
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked === true)}
              className="mt-0.5"
              data-ocid="upload.anonymous_checkbox"
            />
            <div>
              <Label
                htmlFor="anonymous"
                className="text-sm font-medium cursor-pointer select-none"
              >
                Post anonymously (hide your name)
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your identity won't be shown on this post
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              size="lg"
              disabled={createPost.isPending}
              className="w-full gap-2 text-base"
              data-ocid="upload.submit_button"
            >
              {createPost.isPending ? (
                <>
                  <span
                    className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin"
                    aria-hidden
                  />
                  Uploading… {uploadProgress > 0 ? `${uploadProgress}%` : ""}
                </>
              ) : (
                <>
                  <Upload size={18} /> Upload Photo
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
