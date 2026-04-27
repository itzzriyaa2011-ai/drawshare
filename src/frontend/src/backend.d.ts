import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type UserId = Principal;
export type Timestamp = bigint;
export interface UpdateProfileInput {
    bio: string;
    displayName: string;
    avatarBlob?: ExternalBlob;
    isAnonymousByDefault: boolean;
}
export interface Page {
    total: bigint;
    offset: bigint;
    limit: bigint;
    items: Array<Post>;
}
export type PostId = bigint;
export interface Post {
    id: PostId;
    title: string;
    likeCount: bigint;
    imageBlob: ExternalBlob;
    createdAt: Timestamp;
    isAnonymous: boolean;
    author?: UserId;
    updatedAt: Timestamp;
    caption: string;
    savedCount: bigint;
}
export interface CreatePostInput {
    title: string;
    imageBlob: ExternalBlob;
    isAnonymous: boolean;
    caption: string;
}
export interface UserProfile {
    id: UserId;
    bio: string;
    postCount: bigint;
    displayName: string;
    avatarBlob?: ExternalBlob;
    createdAt: Timestamp;
    followerCount: bigint;
    followingCount: bigint;
    isAnonymousByDefault: boolean;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPost(input: CreatePostInput): Promise<Post>;
    deletePost(id: PostId): Promise<void>;
    explorePosts(offset: bigint, limit: bigint): Promise<Page>;
    followUser(target: UserId): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPost(id: PostId): Promise<Post | null>;
    getPostLikeCount(id: PostId): Promise<bigint>;
    getSavedPosts(offset: bigint, limit: bigint): Promise<Page>;
    getUserFollowers(userId: UserId): Promise<Array<UserProfile>>;
    getUserFollowing(userId: UserId): Promise<Array<UserProfile>>;
    getUserProfile(userId: UserId): Promise<UserProfile | null>;
    homeFeed(offset: bigint, limit: bigint): Promise<Page>;
    isCallerAdmin(): Promise<boolean>;
    isFollowingUser(target: UserId): Promise<boolean>;
    likePost(id: PostId): Promise<void>;
    saveCallerUserProfile(input: UpdateProfileInput): Promise<void>;
    savePost(id: PostId): Promise<void>;
    searchPosts(keyword: string, offset: bigint, limit: bigint): Promise<Page>;
    searchUsers(keyword: string): Promise<Array<UserProfile>>;
    unfollowUser(target: UserId): Promise<void>;
    unlikePost(id: PostId): Promise<void>;
    unsavePost(id: PostId): Promise<void>;
}
