import type {
  Drawing,
  DrawingId,
  ExternalBlob,
  Page,
  Timestamp,
  UserId,
  UserProfile,
} from "./backend";

export type {
  Drawing,
  DrawingId,
  Page,
  UserProfile,
  UserId,
  Timestamp,
  ExternalBlob,
};

export interface DrawingCardData {
  id: DrawingId;
  title: string;
  likeCount: bigint;
  savedCount: bigint;
  imageUrl: string;
  tags: string[];
  description: string;
  author: UserId;
  createdAt: Timestamp;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  protected?: boolean;
}
