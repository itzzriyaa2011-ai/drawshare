import { ExternalBlob, UserRole } from "../backend";
import type { backendInterface } from "../backend";
import type { Principal } from "@icp-sdk/core/principal";

function makePost(
  id: bigint,
  title: string,
  caption: string,
  likeCount: bigint,
  savedCount: bigint,
  imageUrl: string,
  isAnonymous = false,
) {
  return {
    id,
    title,
    caption,
    likeCount,
    savedCount,
    isAnonymous,
    imageBlob: ExternalBlob.fromURL(imageUrl),
    createdAt: BigInt(Date.now() - Number(id) * 86400000),
    updatedAt: BigInt(Date.now()),
    author: { toText: () => `user-${id}`, compareTo: () => 0, isAnonymous: () => false } as unknown as Principal,
  };
}

const SAMPLE_POSTS = [
  makePost(1n, "Golden Hour at the Beach", "Magical sunset vibes captured during my evening walk.", 1200n, 340n, "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80"),
  makePost(2n, "Cozy Morning Coffee", "Nothing beats a quiet morning with a good cup of coffee.", 945n, 210n, "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80"),
  makePost(3n, "City Lights at Night", "The city never sleeps — and neither do I when I have my camera.", 1500n, 420n, "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80"),
  makePost(4n, "Mountain Trail Adventure", "Hiked 12 miles to get this shot. Worth every step!", 812n, 180n, "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80"),
  makePost(5n, "Fresh Garden Harvest", "Nothing more satisfying than vegetables from your own garden.", 670n, 150n, "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80"),
  makePost(6n, "Street Art Discovery", "Found this amazing mural tucked in an alley downtown.", 1800n, 510n, "https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=400&q=80"),
  makePost(7n, "Rainy Day Reflections", "Puddles turn the world upside down in the most beautiful way.", 920n, 270n, "https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=400&q=80"),
  makePost(8n, "Autumn Walk", "The leaves are falling and I couldn't be happier about it.", 1100n, 310n, "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&q=80", true),
];

const SAMPLE_PAGE = {
  total: BigInt(SAMPLE_POSTS.length),
  offset: 0n,
  limit: 20n,
  items: SAMPLE_POSTS,
};

function makeMockProfile(id: string, displayName: string, bio: string, avatarUrl: string) {
  return {
    id: { toText: () => id, compareTo: () => 0, isAnonymous: () => false } as unknown as Principal,
    displayName,
    bio,
    postCount: 12n,
    avatarBlob: ExternalBlob.fromURL(avatarUrl),
    createdAt: BigInt(Date.now() - 86400000 * 90),
    followerCount: 248n,
    followingCount: 63n,
    isAnonymousByDefault: false,
  };
}

export const mockBackend: backendInterface = {
  _immutableObjectStorageBlobsAreLive: async () => [],
  _immutableObjectStorageBlobsToDelete: async () => [],
  _immutableObjectStorageConfirmBlobDeletion: async () => undefined,
  _immutableObjectStorageCreateCertificate: async () => ({ method: "PUT", blob_hash: "abc123" }),
  _immutableObjectStorageRefillCashier: async () => ({ success: true, topped_up_amount: 0n }),
  _immutableObjectStorageUpdateGatewayPrincipals: async () => undefined,
  _initializeAccessControl: async () => undefined,
  assignCallerUserRole: async () => undefined,
  createPost: async (input) => ({
    id: BigInt(Date.now()),
    title: input.title,
    caption: input.caption,
    isAnonymous: input.isAnonymous,
    imageBlob: input.imageBlob,
    likeCount: 0n,
    savedCount: 0n,
    createdAt: BigInt(Date.now()),
    updatedAt: BigInt(Date.now()),
  }),
  deletePost: async () => undefined,
  explorePosts: async () => SAMPLE_PAGE,
  followUser: async () => undefined,
  getCallerUserProfile: async () =>
    makeMockProfile("user-me", "Alex Creator", "Photographer and visual storyteller. Capturing moments that matter.", "https://images.unsplash.com/photo-1494790108755-2616b612b83c?w=80&q=80"),
  getCallerUserRole: async () => UserRole.user,
  getPost: async (id) => SAMPLE_POSTS.find((p) => p.id === id) ?? null,
  getPostLikeCount: async (id) => SAMPLE_POSTS.find((p) => p.id === id)?.likeCount ?? 0n,
  getSavedPosts: async () => ({
    total: 3n,
    offset: 0n,
    limit: 20n,
    items: SAMPLE_POSTS.slice(0, 3),
  }),
  getUserFollowers: async () => [],
  getUserFollowing: async () => [],
  getUserProfile: async () =>
    makeMockProfile("user-1", "Oliver Arts", "Digital artist specializing in photography and visual design.", "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&q=80"),
  homeFeed: async () => SAMPLE_PAGE,
  isCallerAdmin: async () => false,
  isFollowingUser: async () => false,
  likePost: async () => undefined,
  saveCallerUserProfile: async () => undefined,
  savePost: async () => undefined,
  searchPosts: async (keyword) => ({
    ...SAMPLE_PAGE,
    items: SAMPLE_POSTS.filter(
      (p) =>
        p.title.toLowerCase().includes(keyword.toLowerCase()) ||
        p.caption.toLowerCase().includes(keyword.toLowerCase()),
    ),
  }),
  searchUsers: async () => [],
  unfollowUser: async () => undefined,
  unlikePost: async () => undefined,
  unsavePost: async () => undefined,
};
