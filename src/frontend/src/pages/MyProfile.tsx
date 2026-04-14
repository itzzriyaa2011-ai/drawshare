import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Bookmark, Camera, LogIn, Save, UserRound } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { DrawingCard } from "../components/DrawingCard";
import { Layout } from "../components/Layout";
import { useAuth } from "../hooks/use-auth";
import { useBackend } from "../hooks/use-backend";

export default function MyProfilePage() {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated, login } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  const { data: savedDrawings, isLoading: savedLoading } = useQuery({
    queryKey: ["drawings", "my-saved"],
    queryFn: async () => {
      if (!actor) return { items: [], total: 0n, offset: 0n, limit: 8n };
      return actor.getSavedDrawings(0n, 8n);
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  if (profile && !initialized) {
    setUsername(profile.username);
    setBio(profile.bio);
    if (profile.avatarBlob) setAvatarPreview(profile.avatarBlob.getDirectURL());
    setInitialized(true);
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      let avatarBlob: ExternalBlob | undefined;
      if (avatarFile) {
        const buffer = new Uint8Array(await avatarFile.arrayBuffer());
        avatarBlob = ExternalBlob.fromBytes(buffer);
      }
      await actor.saveCallerUserProfile({
        username: username.trim(),
        bio: bio.trim(),
        avatarBlob,
      });
    },
    onSuccess: () => {
      toast.success("Profile saved!");
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: () => toast.error("Failed to save profile."),
  });

  const unsaveMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (actor) await actor.unsaveDrawing(id);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["drawings", "my-saved"] }),
  });

  if (!isAuthenticated) {
    return (
      <Layout>
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          data-ocid="my_profile.auth_gate"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <UserRound size={28} className="text-muted-foreground" />
          </div>
          <h2 className="font-display text-xl font-bold mb-2">
            Sign in to view your profile
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Manage your artist profile and saved drawings.
          </p>
          <Button
            onClick={login}
            className="flex items-center gap-2"
            data-ocid="my_profile.login_button"
          >
            <LogIn size={16} /> Sign In
          </Button>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div
          className="max-w-2xl mx-auto space-y-6"
          data-ocid="my_profile.loading_state"
        >
          <Skeleton className="h-8 w-40" />
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </Layout>
    );
  }

  const displayInitial = username[0]?.toUpperCase() ?? "?";

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Page heading */}
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            My Profile
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage how you appear on riartsy
          </p>
        </div>

        {/* Edit form */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveMutation.mutate();
            }}
            className="space-y-6"
            data-ocid="my_profile.form"
          >
            {/* Avatar */}
            <div className="space-y-2">
              <Label>Profile Picture</Label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative group shrink-0"
                  aria-label="Change profile picture"
                  data-ocid="my_profile.upload_avatar_button"
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary text-2xl font-bold font-display">
                        {displayInitial}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-full bg-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera size={16} className="text-card" />
                  </div>
                </button>
                <div className="text-sm text-muted-foreground">
                  <p>Click to change your photo</p>
                  <p className="text-xs mt-0.5">JPG, PNG or GIF · Max 5MB</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setAvatarFile(f);
                      setAvatarPreview(URL.createObjectURL(f));
                    }
                  }}
                />
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Your artist name..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={50}
                data-ocid="my_profile.username_input"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="bio">
                  Bio{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </Label>
                <span className="text-xs text-muted-foreground">
                  {bio.length}/300
                </span>
              </div>
              <Textarea
                id="bio"
                placeholder="Tell the community about your art style..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                maxLength={300}
                data-ocid="my_profile.bio_textarea"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Button
                type="submit"
                disabled={!username.trim() || saveMutation.isPending}
                className="gap-2"
                data-ocid="my_profile.save_button"
              >
                {saveMutation.isPending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} /> Save Profile
                  </>
                )}
              </Button>
              {saveMutation.isSuccess && (
                <span
                  className="text-sm text-accent font-medium"
                  data-ocid="my_profile.success_state"
                >
                  Changes saved!
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Saved drawings section */}
        <section data-ocid="my_profile.saved_section">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Bookmark size={16} className="text-accent" />
            </div>
            <h2 className="font-display text-lg font-bold text-foreground">
              My Saved Drawings
            </h2>
            {savedDrawings && savedDrawings.items.length > 0 && (
              <Link
                to="/saved"
                className="ml-auto text-sm text-primary hover:underline underline-offset-2"
                data-ocid="my_profile.view_all_saved_link"
              >
                View all →
              </Link>
            )}
          </div>

          {savedLoading ? (
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              data-ocid="my_profile.saved_loading_state"
            >
              {Array.from({ length: 4 }, (_, i) => `sk-s-${i}`).map((k) => (
                <div
                  key={k}
                  className="rounded-2xl overflow-hidden border border-border bg-card"
                >
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : !savedDrawings || savedDrawings.items.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-2xl border border-border"
              data-ocid="my_profile.saved_empty_state"
            >
              <Bookmark size={28} className="text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm mb-4">
                You haven't saved any drawings yet.
              </p>
              <Link to="/">
                <Button
                  variant="outline"
                  size="sm"
                  data-ocid="my_profile.browse_button"
                >
                  Browse Drawings
                </Button>
              </Link>
            </div>
          ) : (
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              data-ocid="my_profile.saved_list"
            >
              {savedDrawings.items.map((drawing, idx) => (
                <DrawingCard
                  key={String(drawing.id)}
                  drawing={drawing}
                  index={idx}
                  isSaved
                  onSave={(id) => unsaveMutation.mutate(id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
