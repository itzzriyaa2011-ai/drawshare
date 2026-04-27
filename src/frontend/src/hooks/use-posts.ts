import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Post, PostCardData, UserId } from "../types";
import { useBackend } from "./use-backend";

const PAGE_SIZE = 20n;

function postToCardData(post: Post): PostCardData {
  return {
    id: post.id,
    imageUrl: post.imageBlob.getDirectURL(),
    title: post.title,
    caption: post.caption,
    isAnonymous: post.isAnonymous,
    authorId: post.author as UserId | undefined,
    likeCount: post.likeCount,
    savedCount: post.savedCount,
    createdAt: post.createdAt,
  };
}

export function useHomeFeed(offset = 0n) {
  const { actor, isFetching } = useBackend();
  return useQuery<PostCardData[]>({
    queryKey: ["home-feed", String(offset)],
    queryFn: async () => {
      if (!actor) return [];
      const page = await actor.homeFeed(offset, PAGE_SIZE);
      return page.items.map(postToCardData);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useExplorePosts(offset = 0n) {
  const { actor, isFetching } = useBackend();
  return useQuery<PostCardData[]>({
    queryKey: ["explore-posts", String(offset)],
    queryFn: async () => {
      if (!actor) return [];
      const page = await actor.explorePosts(offset, PAGE_SIZE);
      return page.items.map(postToCardData);
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePost(id: bigint) {
  const { actor, isFetching } = useBackend();
  return useQuery<PostCardData | null>({
    queryKey: ["post", String(id)],
    queryFn: async () => {
      if (!actor) return null;
      const post = await actor.getPost(id);
      if (!post) return null;
      return postToCardData(post);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchPosts(keyword: string, offset = 0n) {
  const { actor, isFetching } = useBackend();
  return useQuery<PostCardData[]>({
    queryKey: ["search-posts", keyword, String(offset)],
    queryFn: async () => {
      if (!actor || !keyword.trim()) return [];
      const page = await actor.searchPosts(keyword.trim(), offset, PAGE_SIZE);
      return page.items.map(postToCardData);
    },
    enabled: !!actor && !isFetching && keyword.trim().length > 0,
  });
}

export function useSavedPosts(offset = 0n) {
  const { actor, isFetching } = useBackend();
  return useQuery<PostCardData[]>({
    queryKey: ["saved-posts", String(offset)],
    queryFn: async () => {
      if (!actor) return [];
      const page = await actor.getSavedPosts(offset, PAGE_SIZE);
      return page.items.map(postToCardData);
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePostLikeCount(id: bigint) {
  const { actor, isFetching } = useBackend();
  return useQuery<bigint>({
    queryKey: ["post-like-count", String(id)],
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getPostLikeCount(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLikePost() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.likePost(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["post", String(id)] });
      queryClient.invalidateQueries({
        queryKey: ["post-like-count", String(id)],
      });
      queryClient.invalidateQueries({ queryKey: ["home-feed"] });
      queryClient.invalidateQueries({ queryKey: ["explore-posts"] });
    },
  });
}

export function useUnlikePost() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.unlikePost(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["post", String(id)] });
      queryClient.invalidateQueries({
        queryKey: ["post-like-count", String(id)],
      });
      queryClient.invalidateQueries({ queryKey: ["home-feed"] });
      queryClient.invalidateQueries({ queryKey: ["explore-posts"] });
    },
  });
}

export function useSavePost() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.savePost(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-posts"] });
    },
  });
}

export function useUnsavePost() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.unsavePost(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-posts"] });
    },
  });
}

export function useCreatePost() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      title: string;
      imageBlob: import("../types").ExternalBlob;
      isAnonymous: boolean;
      caption: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createPost(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-feed"] });
      queryClient.invalidateQueries({ queryKey: ["explore-posts"] });
    },
  });
}

export function useDeletePost() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deletePost(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-feed"] });
      queryClient.invalidateQueries({ queryKey: ["explore-posts"] });
    },
  });
}
