import type {
  CreatePostInput,
  ExternalBlob,
  Page,
  Post,
  PostId,
  Timestamp,
  UpdateProfileInput,
  UserId,
  UserProfile,
} from "./backend";

export type {
  Post,
  PostId,
  Page,
  UserProfile,
  UserId,
  Timestamp,
  ExternalBlob,
  CreatePostInput,
  UpdateProfileInput,
};

export interface PostCardData {
  id: PostId;
  imageUrl: string;
  title: string;
  caption: string;
  isAnonymous: boolean;
  authorId?: UserId;
  authorName?: string;
  likeCount: bigint;
  savedCount: bigint;
  createdAt: Timestamp;
}

export interface UserProfileData {
  id: UserId;
  displayName: string;
  bio: string;
  avatarUrl?: string;
  postCount: bigint;
  followerCount: bigint;
  followingCount: bigint;
  isAnonymousByDefault: boolean;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  protected?: boolean;
}
