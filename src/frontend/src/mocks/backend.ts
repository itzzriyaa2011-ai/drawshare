import { ExternalBlob, UserRole } from "../backend";
import type { backendInterface } from "../backend";

// Sample drawings using placeholder art images
function makeDrawing(
  id: bigint,
  title: string,
  tags: string[],
  description: string,
  likeCount: bigint,
  savedCount: bigint,
  imageUrl: string,
) {
  return {
    id,
    title,
    likeCount,
    imageBlob: ExternalBlob.fromURL(imageUrl),
    createdAt: BigInt(Date.now() - Number(id) * 86400000),
    tags,
    description,
    author: { toText: () => `user-${id}`, compareTo: () => 0, isAnonymous: () => false } as any,
    updatedAt: BigInt(Date.now()),
    savedCount,
  };
}

const SAMPLE_DRAWINGS = [
  makeDrawing(
    1n,
    "Botanic Watercolor Study",
    ["watercolor", "nature", "botanical"],
    "A delicate watercolor study of wildflowers and botanical elements.",
    1200n,
    340n,
    "https://images.unsplash.com/photo-1580757468214-c73f7062a5cb?w=400&q=80",
  ),
  makeDrawing(
    2n,
    "Cozy Cottage Kitchen",
    ["digitalart", "interior", "cozy"],
    "Digital illustration of a warm, inviting cottage kitchen.",
    945n,
    210n,
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  ),
  makeDrawing(
    3n,
    "Whimsical Forest Creature",
    ["characterdesign", "fantasy", "digitalart"],
    "A charming forest creature with antlers wandering through an enchanted wood.",
    1500n,
    420n,
    "https://images.unsplash.com/photo-1617854818583-09e7f077a156?w=400&q=80",
  ),
  makeDrawing(
    4n,
    "Urban Sketch",
    ["sketchbook", "urban", "ink"],
    "A quick ink sketch of the city streets on a sunny afternoon.",
    812n,
    180n,
    "https://images.unsplash.com/photo-1514539079130-25950c84af65?w=400&q=80",
  ),
  makeDrawing(
    5n,
    "Portrait Study",
    ["portrait", "charcoal", "sketchbook"],
    "Charcoal portrait study exploring light and shadow.",
    670n,
    150n,
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
  ),
  makeDrawing(
    6n,
    "Character Design — Mina",
    ["characterdesign", "digitalart", "portrait"],
    "Character sheet for an original character named Mina.",
    1800n,
    510n,
    "https://images.unsplash.com/photo-1494790108755-2616b612b83c?w=400&q=80",
  ),
  makeDrawing(
    7n,
    "Nature Illustration",
    ["natureillustration", "watercolor", "botanical"],
    "Intricate nature illustration with flora and fauna details.",
    920n,
    270n,
    "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400&q=80",
  ),
  makeDrawing(
    8n,
    "Concept Art — Ruins",
    ["concept", "digitalart", "fantasy"],
    "Environmental concept art depicting ancient ruins at sunset.",
    1100n,
    310n,
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  ),
];

const SAMPLE_PAGE = {
  total: BigInt(SAMPLE_DRAWINGS.length),
  offset: 0n,
  limit: 20n,
  items: SAMPLE_DRAWINGS,
};

export const mockBackend: backendInterface = {
  _immutableObjectStorageBlobsAreLive: async () => [],
  _immutableObjectStorageBlobsToDelete: async () => [],
  _immutableObjectStorageConfirmBlobDeletion: async () => undefined,
  _immutableObjectStorageCreateCertificate: async () => ({ method: "PUT", blob_hash: "abc123" }),
  _immutableObjectStorageRefillCashier: async () => ({ success: true, topped_up_amount: 0n }),
  _immutableObjectStorageUpdateGatewayPrincipals: async () => undefined,
  _initializeAccessControl: async () => undefined,

  assignCallerUserRole: async () => undefined,
  deleteDrawing: async () => undefined,
  followUser: async () => undefined,
  getCallerUserProfile: async () => ({
    id: { toText: () => "user-1", compareTo: () => 0, isAnonymous: () => false } as any,
    bio: "Artist and illustrator. I love watercolors and character design.",
    username: "eliza_draws",
    avatarBlob: ExternalBlob.fromURL("https://images.unsplash.com/photo-1494790108755-2616b612b83c?w=80&q=80"),
    createdAt: BigInt(Date.now() - 86400000 * 90),
    followerCount: 248n,
    followingCount: 63n,
  }),
  getCallerUserRole: async () => UserRole.user,
  getDrawing: async (id) => SAMPLE_DRAWINGS.find((d) => d.id === id) ?? null,
  getLikedBy: async () => [],
  getSavedDrawings: async () => ({
    total: 3n,
    offset: 0n,
    limit: 20n,
    items: SAMPLE_DRAWINGS.slice(0, 3),
  }),
  getSuggestedDrawings: async () => SAMPLE_DRAWINGS.slice(4, 7),
  getTrendingDrawings: async () => SAMPLE_DRAWINGS.slice(0, 6),
  getUserProfile: async () => ({
    id: { toText: () => "user-1", compareTo: () => 0, isAnonymous: () => false } as any,
    bio: "Digital artist specializing in character design and environments.",
    username: "artbyoliver",
    avatarBlob: ExternalBlob.fromURL("https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&q=80"),
    createdAt: BigInt(Date.now() - 86400000 * 180),
    followerCount: 512n,
    followingCount: 120n,
  }),
  isCallerAdmin: async () => false,
  isFollowingUser: async () => false,
  likeDrawing: async () => undefined,
  listDrawings: async () => SAMPLE_PAGE,
  listDrawingsByTag: async (tag) => ({
    ...SAMPLE_PAGE,
    items: SAMPLE_DRAWINGS.filter((d) => d.tags.includes(tag)),
  }),
  postDrawing: async (input) => ({
    ...SAMPLE_DRAWINGS[0],
    id: BigInt(Date.now()),
    title: input.title,
    tags: input.tags,
    description: input.description,
    imageBlob: input.imageBlob,
  }),
  saveCallerUserProfile: async () => undefined,
  saveDrawing: async () => undefined,
  searchDrawings: async (query) => ({
    ...SAMPLE_PAGE,
    items: SAMPLE_DRAWINGS.filter(
      (d) =>
        d.title.toLowerCase().includes(query.toLowerCase()) ||
        d.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())),
    ),
  }),
  unfollowUser: async () => undefined,
  unlikeDrawing: async () => undefined,
  unsaveDrawing: async () => undefined,
  updateDrawing: async () => undefined,
};
