import { Client } from "@notionhq/client";
import {
  BlockObjectResponse,
  PageObjectResponse,
  QueryDatabaseParameters,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { BlogPost, BlogPostContent, BlogPostTopic } from "../types";
import { ReactNode, createElement } from "react";

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
  database_id: getDatbaseId(),
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
      (page) => notionPageToBlogPost(page)
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

    return notionPageToBlogPost(notionPageResponse, pageBlocks);
  } catch (e) {
    console.error(e);

    return null;
  }
}

export const getTopicBgColor = (color: string) => notionBgColorHex[color];
export const getTopicFgColor = (color: string) => notionFgColorHex[color];

function notionPageToBlogPost(
  page: PageObjectResponse,
  content?: BlogPostContent
): BlogPost {
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
      url: `/blogs?tag=${encodeURIComponent(topic.name)}`,
    }));
  }

  return {
    title,
    coverImageUrl,
    description: "Lorem ipsum dolor sit amet",
    url: `/blogs${path}`,
    topics,
    content,
  };
}

export const notionRichTextToReactNode = (
  richText: RichTextItemResponse,
  componentKey?: number | string
): ReactNode => {
  // console.log("richText: ", richText);
  const { type, annotations, plain_text } = richText;
  let node: ReactNode;

  if (type === "text") {
    const {
      text: { link },
    } = richText;

    for (const key in annotations) {
      const annotation = key as keyof RichTextItemResponse["annotations"];

      if (
        typeof annotations[annotation] !== "boolean" ||
        annotations[annotation] === false
      ) {
        continue;
      }

      const child = node ? node : plain_text;
      const props = componentKey ? { key: componentKey } : {};

      switch (annotation as keyof RichTextItemResponse["annotations"]) {
        case "bold":
          node = createElement("b", props, child);
          break;

        case "code":
          node = createElement("code", props, child);
          break;

        case "italic":
          node = createElement("i", props, child);
          break;

        case "strikethrough":
          node = createElement("s", props, child);
          break;

        case "underline":
          node = createElement("u", props, child);
          break;

        default:
          node = child;
          break;
      }
    }

    if (link && link.url) {
      const child = node ? node : plain_text;

      node = createElement(
        "a",
        { href: link.url, key: componentKey },
        child
      ).key;
    }
  }

  return node || plain_text;
};

function getDatbaseId(): string {
  if (process.env.NOTION_DATABASE_ID_FOR_BLOG_POSTS) {
    return process.env.NOTION_DATABASE_ID_FOR_BLOG_POSTS;
  }

  throw new Error(
    "NOTION_DATABASE_ID_FOR_BLOG_POSTS environment variable is required"
  );
}
