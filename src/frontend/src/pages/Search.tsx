import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Search, UserCircle, UserMinus, UserPlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Layout } from "../components/Layout";
import { PostCard } from "../components/PostCard";
import { useSearchPosts } from "../hooks/use-posts";
import {
  useFollowUser,
  useIsFollowing,
  useUnfollowUser,
} from "../hooks/use-user";
import { useSearchUsers } from "../hooks/use-user";
import type { UserId, UserProfileData } from "../types";

function UserResultRow({
  user,
  index,
}: {
  user: UserProfileData;
  index: number;
}) {
  const { data: isFollowing } = useIsFollowing(user.id as UserId);
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();

  return (
    <div
      className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-smooth"
      data-ocid={`search.people_item.${index + 1}`}
    >
      <Link
        to="/profile/$id"
        params={{ id: user.id.toString() }}
        className="flex items-center gap-3 flex-1 min-w-0"
      >
        <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center shrink-0 overflow-hidden">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <UserCircle size={24} className="text-primary" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground truncate">
            {user.displayName || "Anonymous"}
          </p>
          {user.bio && (
            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
              {user.bio}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-0.5">
            {String(user.followerCount)} followers · {String(user.postCount)}{" "}
            posts
          </p>
        </div>
      </Link>
      {isFollowing ? (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => unfollowUser.mutate(user.id as UserId)}
          disabled={unfollowUser.isPending}
          className="shrink-0 gap-1.5"
          data-ocid={`search.follow_button.${index + 1}`}
        >
          <UserMinus size={14} />
          Following
        </Button>
      ) : (
        <Button
          size="sm"
          variant="outline"
          onClick={() => followUser.mutate(user.id as UserId)}
          disabled={followUser.isPending}
          className="shrink-0 gap-1.5"
          data-ocid={`search.follow_button.${index + 1}`}
        >
          <UserPlus size={14} />
          Follow
        </Button>
      )}
    </div>
  );
}

export default function SearchPage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: "/search" }) as { q?: string };
  const urlQ = searchParams.q ?? "";

  const [inputValue, setInputValue] = useState(urlQ);
  const [activeTab, setActiveTab] = useState<"posts" | "people">("posts");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setInputValue(urlQ);
  }, [urlQ]);

  function handleInput(value: string) {
    setInputValue(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      navigate({
        to: "/search",
        search: { q: value.trim() || undefined },
        replace: true,
      });
    }, 350);
  }

  function handleClear() {
    setInputValue("");
    navigate({ to: "/search", search: {}, replace: true });
  }

  const { data: posts, isLoading: postsLoading } = useSearchPosts(urlQ);
  const { data: users, isLoading: usersLoading } = useSearchUsers(urlQ);

  return (
    <Layout>
      {/* Search bar */}
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-foreground mb-4">
          Search
        </h1>
        <div className="relative max-w-2xl">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            type="search"
            autoFocus
            placeholder="Search photos or people…"
            value={inputValue}
            onChange={(e) => handleInput(e.target.value)}
            className="pl-10 pr-10 h-12 text-base rounded-xl bg-card shadow-subtle focus-visible:ring-primary"
            data-ocid="search.search_input"
          />
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
              data-ocid="search.clear_button"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {!urlQ.trim() ? (
        <div
          className="flex flex-col items-center justify-center py-24 text-center"
          data-ocid="search.empty_state"
        >
          <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mb-5">
            <Search size={32} className="text-muted-foreground" />
          </div>
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
            Find photos and people
          </h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            Search for stunning photos, discover creators, or find specific
            content.
          </p>
        </div>
      ) : (
        <>
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "posts" | "people")}
            className="mb-6"
          >
            <TabsList data-ocid="search.tabs">
              <TabsTrigger value="posts" data-ocid="search.posts_tab">
                Photos {posts ? `(${posts.length})` : ""}
              </TabsTrigger>
              <TabsTrigger value="people" data-ocid="search.people_tab">
                People {users ? `(${users.length})` : ""}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {activeTab === "posts" && (
            <div data-ocid="search.posts_section">
              {postsLoading ? (
                <div
                  className="masonry-grid"
                  data-ocid="search.posts_loading_state"
                >
                  {Array.from({ length: 8 }, (_, i) => i).map((i) => (
                    <div
                      key={i}
                      className="masonry-item rounded-2xl overflow-hidden border border-border bg-card"
                    >
                      <Skeleton
                        className="w-full"
                        style={{ height: `${160 + (i % 4) * 40}px` }}
                      />
                      <div className="p-3 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : !posts || posts.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-20 text-center"
                  data-ocid="search.posts_empty_state"
                >
                  <p className="text-muted-foreground text-sm">
                    No photos found for "{urlQ}"
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="mt-3"
                    data-ocid="search.clear_results_button"
                  >
                    Clear search
                  </Button>
                </div>
              ) : (
                <div className="masonry-grid" data-ocid="search.posts_list">
                  {posts.map((post, idx) => (
                    <PostCard key={String(post.id)} post={post} index={idx} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "people" && (
            <div data-ocid="search.people_section">
              {usersLoading ? (
                <div
                  className="space-y-3"
                  data-ocid="search.people_loading_state"
                >
                  {Array.from({ length: 4 }, (_, i) => i).map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card"
                    >
                      <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-60" />
                      </div>
                      <Skeleton className="h-9 w-24 rounded-lg shrink-0" />
                    </div>
                  ))}
                </div>
              ) : !users || users.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-20 text-center"
                  data-ocid="search.people_empty_state"
                >
                  <p className="text-muted-foreground text-sm">
                    No people found for "{urlQ}"
                  </p>
                </div>
              ) : (
                <div className="space-y-3" data-ocid="search.people_list">
                  {users.map((user, idx) => (
                    <UserResultRow
                      key={user.id.toString()}
                      user={user}
                      index={idx}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
