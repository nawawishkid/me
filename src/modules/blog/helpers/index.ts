import { Client } from "@notionhq/client";
import {
  PageObjectResponse,
  QueryDatabaseParameters,
} from "@notionhq/client/build/src/api-endpoints";
import { BlogPost, BlogPostTopic } from "../types";

const notionBgColorHex: Record<string, string> = {
  red: "#ffe2dd",
  blue: "#d3e5ef",
  orange: "#fadec9",
  purple: "#e8deee",
  pink: "#f5e0e9",
  green: "#dbeddb",
};
const notionFgColorHex: Record<string, string> = {
  red: "rgb(93, 23, 21)",
  blue: "rgb(24, 51, 71)",
  orange: "rgb(73, 41, 14)",
  purple: "rgb(65, 36, 84)",
  pink: "rgb(76, 35, 55)",
  green: "rgb(28, 56, 41)",
};

const defaultParams: QueryDatabaseParameters = {
  database_id: "5d56f6caeb1e447db26faf98127f5552",
  page_size: 10,
  sorts: [{ property: "Created", direction: "descending" }],
};

const getNotionClient = () =>
  new Client({
    auth: process.env.NOTION_SECRET_KEY,
  });

export async function findBlogPosts(
  params: Omit<
    QueryDatabaseParameters,
    "database_id" | "filter_properties"
  > = {}
) {
  const notion = getNotionClient();

  try {
    const response = await notion.databases.query({
      ...defaultParams,
      ...params,
    });
    const posts = (response.results as PageObjectResponse[]).map<BlogPost>(
      notionPageToBlogPost
    );

    return posts;
  } catch (e) {
    console.error(e);

    return [];
  }
}

export async function findOnePostById(
  postId: string
): Promise<BlogPost | null> {
  const notion = getNotionClient();

  try {
    const notionPage = (await notion.pages.retrieve({
      page_id: postId,
    })) as PageObjectResponse;

    if (!notionPage) {
      return null;
    }

    return notionPageToBlogPost(notionPage);
  } catch (e) {
    console.error(e);

    return null;
  }
}

export const getTopicBgColor = (color: string) => notionBgColorHex[color];
export const getTopicFgColor = (color: string) => notionFgColorHex[color];

function notionPageToBlogPost(page: PageObjectResponse): BlogPost {
  let title: string = "";
  let coverImageUrl: string | undefined = undefined;
  let path = new URL(page.url).pathname;
  let topics: BlogPostTopic[] = [];

  const titleProperty = page.properties["Title"];

  if (titleProperty.type === "title") {
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
      url: `/blogs?tag=${topic.name}`,
    }));
  }

  return {
    title,
    coverImageUrl,
    description: "Lorem ipsum dolor sit amet",
    url: `/blogs${path}`,
    topics,
  };
}
