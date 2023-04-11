import {
  BlockObjectResponse,
  GetBlockResponse,
} from "@notionhq/client/build/src/api-endpoints";

export interface BlogPostTopic {
  id: string;
  name: string;
  color: string;
  url: string;
}

export type BlogPostContent = GetBlockResponse[];

export interface BlogPost {
  title: string;
  description: string;
  coverImageUrl?: string;
  url: string;
  topics: BlogPostTopic[];
  content?: BlogPostContent;
}
