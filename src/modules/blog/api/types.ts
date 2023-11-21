import { BlogPost } from "../types";

export enum CacheStatus {
  HIT = "HIT",
  MISS = "MISS",
}

export interface WithCacheStatus {
  cacheStatus: CacheStatus;
}

export interface FindBlogPostsResponse {
  posts: BlogPost[];
  hasMore: boolean;
  nextCursor: string | null;
}

export type CachableFindBlogPostsResponse = FindBlogPostsResponse &
  WithCacheStatus;

export interface FindOneBlogPostResponse {
  post: BlogPost | null;
}

export type CachableFindOneBlogPostResponse = FindOneBlogPostResponse &
  WithCacheStatus;
