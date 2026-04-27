import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  Bookmark,
  Camera,
  Grid3X3,
  LogIn,
  Save,
  UserCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { Layout } from "../components/Layout";
import { PostCard } from "../components/PostCard";
import { useAuth } from "../hooks/use-auth";
import {
  useExplorePosts,
  useLikePost,
  useSavedPosts,
  useUnsavePost,
} from "../hooks/use-posts";
import { useMyProfile, useUpdateProfile } from "../hooks/use-user";

export default function MyProfilePage() {
  const { isAuthenticated, login, identity } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading } = useMyProfile();
  const { data: savedPosts, isLoading: savedLoading } = useSavedPosts();
  const { data: allPosts, isLoading: postsLoading } = useExplorePosts(0n);
  const updateProfile = useUpdateProfile();
  const unsavePost = useUnsavePost();
  const likeMutation = useLikePost();

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [isAnonymousByDefault, setIsAnonymousByDefault] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Sync form state once profile loads
  if (profile && !initialized) {
    setDisplayName(profile.displayName);
    setBio(profile.bio);
    setIsAnonymousByDefault(profile.isAnonymousByDefault);
    if (profile.avatarUrl) setAvatarPreview(profile.avatarUrl);
    setInitialized(true);
  }

  // Filter own posts from the explore feed
  const myPrincipal = identity?.getPrincipal().toText();
  const myPosts = useMemo(() => {
    if (!allPosts || !myPrincipal) return [];
    return allPosts.filter((p) => p.authorId?.toString() === myPrincipal);
  }, [allPosts, myPrincipal]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      let avatarBlob: ExternalBlob | undefined;
      if (avatarFile) {
        const buffer = new Uint8Array(await avatarFile.arrayBuffer());
        avatarBlob = ExternalBlob.fromBytes(buffer);
      }
      await updateProfile.mutateAsync({
        displayName: displayName.trim(),
        bio: bio.trim(),
        avatarBlob,
        isAnonymousByDefault,
      });
      toast.success("Profile saved!");
      setAvatarFile(null);
    } catch {
      toast.error("Failed to save profile.");
    }
  }

  // Auth gate
  if (!isAuthenticated) {
    return (
      <Layout>
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          data-ocid="my_profile.auth_gate"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Camera size={28} className="text-muted-foreground" />
          </div>
          <h2 className="font-display text-xl font-bold mb-2">
            Sign in to manage your profile
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Customize your profile, bio, and saved photos.
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

  // Loading
  if (isLoading) {
    return (
      <Layout>
        <div
          className="max-w-3xl mx-auto space-y-6"
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

  const displayInitial = displayName[0]?.toUpperCase() ?? "?";

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            My Profile
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage how you appear on riartsy
          </p>
        </motion.div>

        {/* Profile stats strip */}
        {profile && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Posts", value: String(profile.postCount) },
              { label: "Followers", value: String(profile.followerCount) },
              { label: "Following", value: String(profile.followingCount) },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-card border border-border rounded-xl py-4 px-3 text-center"
              >
                <div className="font-display text-2xl font-bold text-foreground">
                  {value}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit form */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-card rounded-2xl border border-border p-6"
        >
          <h2 className="font-display font-semibold text-foreground text-base mb-5">
            Edit Profile
          </h2>
          <form
            onSubmit={handleSave}
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
                  data-ocid="my_profile.upload_button"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-primary text-2xl font-bold font-display">
                        {displayInitial}
                      </span>
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera size={16} className="text-card" />
                  </div>
                </button>
                <div className="text-sm text-muted-foreground">
                  <p>Click to change your photo</p>
                  <p className="text-xs mt-0.5">JPG, PNG or GIF · Max 5 MB</p>
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

            {/* Display name */}
            <div className="space-y-2">
              <Label htmlFor="display-name">Display Name</Label>
              <Input
                id="display-name"
                placeholder="Your name…"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={50}
                data-ocid="my_profile.display_name_input"
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
                placeholder="Tell the community about yourself…"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                maxLength={300}
                data-ocid="my_profile.bio_textarea"
              />
            </div>

            {/* Anonymous by default */}
            <div className="flex items-center justify-between bg-muted/40 rounded-xl px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Post anonymously by default
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Hide your identity on new posts by default
                </p>
              </div>
              <Switch
                checked={isAnonymousByDefault}
                onCheckedChange={setIsAnonymousByDefault}
                data-ocid="my_profile.anonymous_switch"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Button
                type="submit"
                disabled={updateProfile.isPending}
                className="gap-2"
                data-ocid="my_profile.save_button"
              >
                {updateProfile.isPending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save size={16} /> Save Profile
                  </>
                )}
              </Button>
              {updateProfile.isSuccess && (
                <span
                  className="text-sm text-accent font-medium"
                  data-ocid="my_profile.success_state"
                >
                  Changes saved!
                </span>
              )}
            </div>
          </form>
        </motion.div>

        {/* Posts + Saved tabs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Tabs defaultValue="posts" data-ocid="my_profile.content_tabs">
            <TabsList className="mb-6">
              <TabsTrigger
                value="posts"
                className="gap-2"
                data-ocid="my_profile.posts_tab"
              >
                <Grid3X3 size={14} />
                My Posts
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="gap-2"
                data-ocid="my_profile.saved_tab"
              >
                <Bookmark size={14} />
                Saved
              </TabsTrigger>
            </TabsList>

            {/* My Posts tab */}
            <TabsContent value="posts" data-ocid="my_profile.posts_section">
              {postsLoading ? (
                <div
                  className="grid grid-cols-2 md:grid-cols-3 gap-4"
                  data-ocid="my_profile.posts_loading_state"
                >
                  {Array.from({ length: 6 }, (_, i) => `sk-p-${i}`).map((k) => (
                    <div
                      key={k}
                      className="rounded-2xl overflow-hidden border border-border bg-card"
                    >
                      <Skeleton className="aspect-square w-full" />
                      <div className="p-3 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : myPosts.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-14 text-center bg-muted/30 rounded-2xl border border-border"
                  data-ocid="my_profile.posts_empty_state"
                >
                  <UserCircle
                    size={28}
                    className="text-muted-foreground mb-3"
                  />
                  <p className="text-foreground font-medium mb-1">
                    No posts yet
                  </p>
                  <p className="text-muted-foreground text-sm mb-4">
                    Share your first photo with the community.
                  </p>
                  <Link to="/upload">
                    <Button size="sm" data-ocid="my_profile.upload_button">
                      Upload a Photo
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="masonry-grid" data-ocid="my_profile.posts_list">
                  {myPosts.map((post, idx) => (
                    <PostCard
                      key={String(post.id)}
                      post={post}
                      index={idx}
                      onLike={(postId) => likeMutation.mutate(postId)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Saved tab */}
            <TabsContent value="saved" data-ocid="my_profile.saved_section">
              {savedLoading ? (
                <div
                  className="grid grid-cols-2 md:grid-cols-3 gap-4"
                  data-ocid="my_profile.saved_loading_state"
                >
                  {Array.from({ length: 6 }, (_, i) => `sk-s-${i}`).map((k) => (
                    <div
                      key={k}
                      className="rounded-2xl overflow-hidden border border-border bg-card"
                    >
                      <Skeleton className="aspect-square w-full" />
                      <div className="p-3 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : !savedPosts || savedPosts.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-14 text-center bg-muted/30 rounded-2xl border border-border"
                  data-ocid="my_profile.saved_empty_state"
                >
                  <Bookmark size={28} className="text-muted-foreground mb-3" />
                  <p className="text-foreground font-medium mb-1">
                    No saved photos yet
                  </p>
                  <p className="text-muted-foreground text-sm mb-4">
                    Save photos you love and find them here.
                  </p>
                  <Link to="/explore">
                    <Button
                      variant="outline"
                      size="sm"
                      data-ocid="my_profile.browse_button"
                    >
                      Explore Photos
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="masonry-grid" data-ocid="my_profile.saved_list">
                  {savedPosts.map((post, idx) => (
                    <PostCard
                      key={String(post.id)}
                      post={post}
                      index={idx}
                      isSaved
                      onSave={(postId) => unsavePost.mutate(postId)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
}
