import {
  BlockObjectResponse,
  PageObjectResponse,
  QueryDatabaseParameters,
} from "@notionhq/client/build/src/api-endpoints";
import {
  CacheStatus,
  FindBlogPostsResponse,
  FindOneBlogPostResponse,
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
): Promise<FindBlogPostsResponse> {
  const query = {
    ...getDefaultParams(),
    ...params,
  };
  const blogsResponseCacheKey = createFindBlogPostsResponseCacheKey(query);
  const redis = getRedis();

  if (redis) {
    try {
      const cachedResponse = await redis.get(blogsResponseCacheKey);

      if (cachedResponse) {
        console.log(
          `Successfully got cached ${blogsResponseCacheKey}: `,
          cachedResponse
        );
        return { ...JSON.parse(cachedResponse), cacheStatus: CacheStatus.HIT };
      }
    } catch (e) {
      if (e instanceof Error) {
        console.error(
          `Failed to get cached ${blogsResponseCacheKey}: ${e.message}`
        );
      }
    }
  }

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
      cacheStatus: CacheStatus.MISS,
    };

    if (redis) {
      redis
        .set(
          blogsResponseCacheKey,
          JSON.stringify(findBlogsResponse),
          "EX",
          60 * 60 * 24
        )
        .then(() => console.log(`Successfully cached ${blogsResponseCacheKey}`))
        .catch((e) =>
          console.error(`Failed to cache ${blogsResponseCacheKey}: ${e}`)
        );
    }

    return findBlogsResponse;
  } catch (e) {
    console.error(e);

    return {
      posts: [],
      hasMore: false,
      nextCursor: null,
      cacheStatus: CacheStatus.MISS,
    };
  }
}

function createFindOnePostByIdResponseCacheKey(id: string) {
  return `findOnePostById:response:${id}`;
}

export async function findOnePostById(
  postId: string
): Promise<FindOneBlogPostResponse> {
  const blogResponseCacheKey = createFindOnePostByIdResponseCacheKey(postId);
  const redis = getRedis();

  if (redis) {
    try {
      const cachedResponse = await redis.get(blogResponseCacheKey);

      if (cachedResponse) {
        console.log(
          `Successfully got cached ${blogResponseCacheKey}: `,
          cachedResponse
        );
        return { ...JSON.parse(cachedResponse), cacheStatus: CacheStatus.HIT };
      }
    } catch (e) {
      if (e instanceof Error) {
        console.error(
          `Failed to get cached ${blogResponseCacheKey}: ${e.message}`
        );
      }
    }
  }
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
    const post = notionPageToBlogPost(notionPageResponse, pageBlocks);
    const response: FindOneBlogPostResponse = {
      post,
      cacheStatus: CacheStatus.MISS,
    };

    if (redis) {
      redis
        .set(blogResponseCacheKey, JSON.stringify(response), "EX", 60 * 60 * 24)
        .then(() => console.log(`Successfully cached ${blogResponseCacheKey}`))
        .catch((e) =>
          console.error(`Failed to cache ${blogResponseCacheKey}: ${e}`)
        );
    }

    return response;
  } catch (e) {
    console.error(e);

    return { post: null, cacheStatus: CacheStatus.MISS };
  }
}

function notionPageToBlogPost(
  page: PageObjectResponse,
  content?: BlogPostContent
): BlogPost {
  let title: string = "",
    description: string = "",
    coverImageUrl: string | undefined = undefined,
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
