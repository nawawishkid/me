import { BlogPost } from "../types";

export enum CacheStatus {
  HIT = "HIT",
  MISS = "MISS",
}

interface WithCacheStatus {
  cacheStatus: CacheStatus;
}

export interface FindBlogPostsResponse extends WithCacheStatus {
  posts: BlogPost[];
  hasMore: boolean;
  nextCursor: string | null;
}

export interface FindOneBlogPostResponse extends WithCacheStatus {
  post: BlogPost | null;
}
