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
export type Timestamp = bigint;
export interface UpdateDrawingInput {
    title: string;
    tags: Array<string>;
    description: string;
}
export type DrawingId = bigint;
export interface CreateDrawingInput {
    title: string;
    imageBlob: ExternalBlob;
    tags: Array<string>;
    description: string;
}
export type UserId = Principal;
export interface Drawing {
    id: DrawingId;
    title: string;
    likeCount: bigint;
    imageBlob: ExternalBlob;
    createdAt: Timestamp;
    tags: Array<string>;
    description: string;
    author: UserId;
    updatedAt: Timestamp;
    savedCount: bigint;
}
export interface UpdateProfileInput {
    bio: string;
    username: string;
    avatarBlob?: ExternalBlob;
}
export interface Page {
    total: bigint;
    offset: bigint;
    limit: bigint;
    items: Array<Drawing>;
}
export interface UserProfile {
    id: UserId;
    bio: string;
    username: string;
    avatarBlob?: ExternalBlob;
    createdAt: Timestamp;
    followerCount: bigint;
    followingCount: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteDrawing(id: DrawingId): Promise<void>;
    followUser(target: UserId): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDrawing(id: DrawingId): Promise<Drawing | null>;
    getLikedBy(id: DrawingId): Promise<Array<UserId>>;
    getSavedDrawings(offset: bigint, limit: bigint): Promise<Page>;
    getSuggestedDrawings(limit: bigint): Promise<Array<Drawing>>;
    getTrendingDrawings(limit: bigint): Promise<Array<Drawing>>;
    getUserProfile(userId: UserId): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isFollowingUser(target: UserId): Promise<boolean>;
    likeDrawing(id: DrawingId): Promise<void>;
    listDrawings(offset: bigint, limit: bigint): Promise<Page>;
    listDrawingsByTag(tag: string, offset: bigint, limit: bigint): Promise<Page>;
    postDrawing(input: CreateDrawingInput): Promise<Drawing>;
    saveCallerUserProfile(input: UpdateProfileInput): Promise<void>;
    saveDrawing(id: DrawingId): Promise<void>;
    searchDrawings(searchQuery: string, offset: bigint, limit: bigint): Promise<Page>;
    unfollowUser(target: UserId): Promise<void>;
    unlikeDrawing(id: DrawingId): Promise<void>;
    unsaveDrawing(id: DrawingId): Promise<void>;
    updateDrawing(id: DrawingId, input: UpdateDrawingInput): Promise<void>;
}
