import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserId, UserProfile, UserProfileData } from "../types";
import { useBackend } from "./use-backend";

function profileToData(profile: UserProfile): UserProfileData {
  return {
    id: profile.id,
    displayName: profile.displayName,
    bio: profile.bio,
    avatarUrl: profile.avatarBlob?.getDirectURL(),
    postCount: profile.postCount,
    followerCount: profile.followerCount,
    followingCount: profile.followingCount,
    isAnonymousByDefault: profile.isAnonymousByDefault,
  };
}

export function useMyProfile() {
  const { actor, isFetching } = useBackend();
  return useQuery<UserProfileData | null>({
    queryKey: ["my-profile"],
    queryFn: async () => {
      if (!actor) return null;
      const profile = await actor.getCallerUserProfile();
      if (!profile) return null;
      return profileToData(profile);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserProfile(userId: UserId | undefined) {
  const { actor, isFetching } = useBackend();
  return useQuery<UserProfileData | null>({
    queryKey: ["user-profile", userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return null;
      const profile = await actor.getUserProfile(userId);
      if (!profile) return null;
      return profileToData(profile);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useIsFollowing(targetId: UserId | undefined) {
  const { actor, isFetching } = useBackend();
  return useQuery<boolean>({
    queryKey: ["is-following", targetId?.toString()],
    queryFn: async () => {
      if (!actor || !targetId) return false;
      return actor.isFollowingUser(targetId);
    },
    enabled: !!actor && !isFetching && !!targetId,
  });
}

export function useUserFollowers(userId: UserId | undefined) {
  const { actor, isFetching } = useBackend();
  return useQuery<UserProfileData[]>({
    queryKey: ["user-followers", userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return [];
      const followers = await actor.getUserFollowers(userId);
      return followers.map(profileToData);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useUserFollowing(userId: UserId | undefined) {
  const { actor, isFetching } = useBackend();
  return useQuery<UserProfileData[]>({
    queryKey: ["user-following", userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return [];
      const following = await actor.getUserFollowing(userId);
      return following.map(profileToData);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useSearchUsers(keyword: string) {
  const { actor, isFetching } = useBackend();
  return useQuery<UserProfileData[]>({
    queryKey: ["search-users", keyword],
    queryFn: async () => {
      if (!actor || !keyword.trim()) return [];
      const users = await actor.searchUsers(keyword.trim());
      return users.map(profileToData);
    },
    enabled: !!actor && !isFetching && keyword.trim().length > 0,
  });
}

export function useFollowUser() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (targetId: UserId) => {
      if (!actor) throw new Error("Not connected");
      return actor.followUser(targetId);
    },
    onSuccess: (_, targetId) => {
      queryClient.invalidateQueries({
        queryKey: ["is-following", targetId.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-profile", targetId.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-followers", targetId.toString()],
      });
    },
  });
}

export function useUnfollowUser() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (targetId: UserId) => {
      if (!actor) throw new Error("Not connected");
      return actor.unfollowUser(targetId);
    },
    onSuccess: (_, targetId) => {
      queryClient.invalidateQueries({
        queryKey: ["is-following", targetId.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-profile", targetId.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-followers", targetId.toString()],
      });
    },
  });
}

export function useUpdateProfile() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      bio: string;
      displayName: string;
      avatarBlob?: import("../types").ExternalBlob;
      isAnonymousByDefault: boolean;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    },
  });
}
