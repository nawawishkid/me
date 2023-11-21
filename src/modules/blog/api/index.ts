import {
  BlockObjectResponse,
  PageObjectResponse,
  QueryDatabaseParameters,
} from "@notionhq/client/build/src/api-endpoints";
import {
  CachableFindBlogPostsResponse,
  CachableFindOneBlogPostResponse,
  CacheStatus,
  FindBlogPostsResponse,
  FindOneBlogPostResponse,
  WithCacheStatus,
} from "./types";
import { Client } from "@notionhq/client";
import { BlogPost, BlogPostContent, BlogPostTopic } from "../types";
import { format, parseISO } from "date-fns";
import { getRedis } from "./redis";

function createFindBlogPostsResponseCacheKey(params: QueryDatabaseParameters) {
  return `findBlogPosts:response:query_${JSON.stringify(params)}`;
}

export async function findBlogPosts(
  params: Omit<
    QueryDatabaseParameters,
    "database_id" | "filter_properties"
  > = {}
): Promise<CachableFindBlogPostsResponse> {
  if (process.env.CACHE_NOTION_DATA === "true") {
    const query = {
      ...getDefaultParams(),
      ...params,
    };
    const blogsResponseCacheKey = createFindBlogPostsResponseCacheKey(query);
    const redis = getRedis();

    try {
      const cachedResponse = await redis.get(blogsResponseCacheKey);

      if (cachedResponse) {
        console.log(
          `Successfully got cached ${blogsResponseCacheKey}: `,
          cachedResponse
        );
        return {
          ...JSON.parse(cachedResponse),
          cacheStatus: CacheStatus.HIT,
        };
      }
    } catch (e) {
      if (e instanceof Error) {
        console.error(
          `Failed to get cached ${blogsResponseCacheKey}: ${e.message}`
        );
      }
    }

    const response = await findBlogPostsFromNotion(params);

    redis
      .set(
        blogsResponseCacheKey,
        JSON.stringify(response),
        "EX",
        process.env.REDIS_CACHE_EXPIRATION_IN_SECONDS || 60 * 60 * 24
      )
      .then(() => console.log(`Successfully cached ${blogsResponseCacheKey}`))
      .catch((e) =>
        console.error(`Failed to cache ${blogsResponseCacheKey}: ${e}`)
      );

    return { ...response, cacheStatus: CacheStatus.MISS };
  }

  const response = await findBlogPostsFromNotion(params);

  return { ...response, cacheStatus: CacheStatus.MISS };
}

export async function findBlogPostsFromNotion(
  params: Omit<
    QueryDatabaseParameters,
    "database_id" | "filter_properties"
  > = {}
): Promise<FindBlogPostsResponse> {
  const query = {
    ...getDefaultParams(),
    ...params,
  };

  const notion = getNotionClient();

  try {
    const response = await notion.databases.query(query);
    const posts = (response.results as PageObjectResponse[]).map<BlogPost>(
      (page) => notionPageToBlogPost(page)
    );

    const findBlogsResponse: FindBlogPostsResponse = {
      posts,
      hasMore: response.has_more,
      nextCursor: response.next_cursor,
    };

    return findBlogsResponse;
  } catch (e) {
    console.error(e);

    return {
      posts: [],
      hasMore: false,
      nextCursor: null,
    };
  }
}

function createFindOnePostByIdResponseCacheKey(id: string) {
  return `findOnePostById:response:${id}`;
}

export async function findOnePostById(
  postId: string
): Promise<CachableFindOneBlogPostResponse> {
  if (process.env.CACHE_NOTION_DATA === "true") {
    const oneBlogResponseCacheKey =
      createFindOnePostByIdResponseCacheKey(postId);
    const redis = getRedis();

    try {
      const cachedResponse = await redis.get(oneBlogResponseCacheKey);

      if (cachedResponse) {
        console.log(
          `Successfully got cached ${oneBlogResponseCacheKey}: `,
          cachedResponse
        );
        return {
          ...JSON.parse(cachedResponse),
          cacheStatus: CacheStatus.HIT,
        };
      }
    } catch (e) {
      if (e instanceof Error) {
        console.error(
          `Failed to get cached ${oneBlogResponseCacheKey}: ${e.message}`
        );
      }
    }

    const response = await findOnePostByIdFromNotion(postId);

    redis
      .set(
        oneBlogResponseCacheKey,
        JSON.stringify(response),
        "EX",
        process.env.REDIS_CACHE_EXPIRATION_IN_SECONDS || 60 * 60 * 24
      )
      .then(() => console.log(`Successfully cached ${oneBlogResponseCacheKey}`))
      .catch((e) =>
        console.error(`Failed to cache ${oneBlogResponseCacheKey}: ${e}`)
      );

    return { ...response, cacheStatus: CacheStatus.MISS };
  }

  const response = await findOnePostByIdFromNotion(postId);

  return { ...response, cacheStatus: CacheStatus.MISS };
}

export async function findOnePostByIdFromNotion(
  postId: string
): Promise<FindOneBlogPostResponse> {
  const notion = getNotionClient();

  try {
    const [notionPageResponse, pageBlocks] = (await Promise.all([
      notion.pages.retrieve({
        page_id: postId,
      }),
      notion.blocks.children
        .list({
          block_id: postId,
        })
        .then((res) => res.results as BlockObjectResponse[]),
    ])) as [PageObjectResponse, BlockObjectResponse[]];

    return {
      post: notionPageToBlogPost(notionPageResponse, pageBlocks),
    };
  } catch (e) {
    console.error(e);

    return { post: null };
  }
}

function notionPageToBlogPost(
  page: PageObjectResponse,
  content?: BlogPostContent
): BlogPost {
  let title: string = "",
    description: string = "",
    coverImageUrl =
      page.cover?.type === "external"
        ? page.cover.external.url
        : page.cover?.file.url,
    path = new URL(page.url).pathname,
    topics: BlogPostTopic[] = [],
    createdAt = "";

  const titleProperty = page.properties["Title"];

  if (titleProperty.type === "title" && titleProperty.title.length > 0) {
    title = titleProperty.title[0].plain_text;
  }

  if (page.cover) {
    if (page.cover.type === "external") {
      coverImageUrl = page.cover.external.url;
    } else if (page.cover.type === "file") {
      coverImageUrl = page.cover.file.url;
    } else {
      coverImageUrl = "";
    }
  }

  const topicsProperty = page.properties["Topics"];

  if (topicsProperty.type === "multi_select") {
    topics = topicsProperty.multi_select.map((topic) => ({
      ...topic,
      url: `/blogs?tag=${encodeURIComponent(topic.name)}`,
    }));
  }

  const descriptionProperty = page.properties["Description"];

  if (descriptionProperty.type === "rich_text") {
    description = descriptionProperty.rich_text
      .map((richText) => richText.plain_text)
      .join("");
  }

  const createdAtProperty = page.properties["Created"];

  if (createdAtProperty.type === "created_time") {
    createdAt = format(
      parseISO(createdAtProperty.created_time),
      "MMMM dd, yyyy"
    );
  }

  return {
    title,
    coverImageUrl,
    description,
    url: `/blogs${path}`,
    topics,
    content,
    createdAt,
  };
}

const getDefaultParams = (): QueryDatabaseParameters => ({
  database_id: getDatabaseId(),
  page_size: 10,
  sorts: [{ property: "Created", direction: "descending" }],
});

const getNotionClient = () =>
  new Client({
    auth: process.env.NOTION_SECRET_KEY,
  });

function getDatabaseId(): string {
  if (process.env.NOTION_DATABASE_ID_FOR_BLOG_POSTS) {
    return process.env.NOTION_DATABASE_ID_FOR_BLOG_POSTS;
  }

  throw new Error(
    "NOTION_DATABASE_ID_FOR_BLOG_POSTS environment variable is required"
  );
}
