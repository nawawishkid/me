import { Client } from "@notionhq/client";
import {
  BlockObjectResponse,
  GetBlockResponse,
  PageObjectResponse,
  QueryDatabaseParameters,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { BlogPost, BlogPostContent, BlogPostTopic } from "../types";
import { ReactNode, createElement } from "react";
import CodeBlock from "@/components/code-block";
import { format, parse, parseISO } from "date-fns";

const notionBgColorHex: Record<string, string> = {
  red: "#ffe2dd",
  blue: "#d3e5ef",
  orange: "#fadec9",
  purple: "#e8deee",
  pink: "#f5e0e9",
  green: "#dbeddb",
  gray: "#5a5a5a",
  brown: "#603b2c",
  default: "#373737",
  yellow: "#89632a",
};
const notionFgColorHex: Record<string, string> = {
  red: "rgb(93, 23, 21)",
  blue: "rgb(24, 51, 71)",
  orange: "rgb(73, 41, 14)",
  purple: "rgb(65, 36, 84)",
  pink: "rgb(76, 35, 55)",
  green: "rgb(28, 56, 41)",
  gray: "#ffffffcd",
  brown: "#ffffffcd",
  default: "#ffffffcd",
  yellow: "#ffffffcd",
};

const defaultParams: QueryDatabaseParameters = {
  database_id: getDatabaseId(),
  page_size: 10,
  sorts: [{ property: "Created", direction: "descending" }],
};

const getNotionClient = () =>
  new Client({
    auth: process.env.NOTION_SECRET_KEY,
  });

export interface FindBlogPostsResponse {
  posts: BlogPost[];
  hasMore: boolean;
  nextCursor: string | null;
}

export async function findBlogPosts(
  params: Omit<
    QueryDatabaseParameters,
    "database_id" | "filter_properties"
  > = {}
): Promise<FindBlogPostsResponse> {
  const notion = getNotionClient();

  try {
    const response = await notion.databases.query({
      ...defaultParams,
      ...params,
    });
    const posts = (response.results as PageObjectResponse[]).map<BlogPost>(
      (page) => notionPageToBlogPost(page)
    );

    return {
      posts,
      hasMore: response.has_more,
      nextCursor: response.next_cursor,
    };
  } catch (e) {
    console.error(e);

    return {
      posts: [],
      hasMore: false,
      nextCursor: null,
    };
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
        { href: link.url, target: "_blank", key: componentKey },
        child
      );
    }
  }

  return node || plain_text;
};

function getDatabaseId(): string {
  if (process.env.NOTION_DATABASE_ID_FOR_BLOG_POSTS) {
    return process.env.NOTION_DATABASE_ID_FOR_BLOG_POSTS;
  }

  console.error(
    "NOTION_DATABASE_ID_FOR_BLOG_POSTS environment variable is required"
  );
  return "";
  // throw new Error(
  //   "NOTION_DATABASE_ID_FOR_BLOG_POSTS environment variable is required"
  // );
}

interface ListBlockInfo {
  index: number;
  nodes: ReactNode[];
  type: "ul" | "ol";
}

export function notionBlocksToReactNodes(
  blocks: GetBlockResponse[]
): ReactNode[] {
  const listBlockInfoMap: Record<string, ListBlockInfo> = {};
  let currentListBlockIndex: number | null = null;

  // 1. Turn Notion Blocks to ReactNode[], excluding list item blocks.
  // Group related list item blocks together. We'll create a parent for them later.
  const nodes = blocks.reduce((arr, _block, idx) => {
    const block = _block as BlockObjectResponse;

    if (
      block.type === "bulleted_list_item" ||
      block.type === "numbered_list_item"
    ) {
      const type = block.type === "bulleted_list_item" ? "ul" : "ol";

      if (
        currentListBlockIndex === null || // first list block
        !listBlockInfoMap[currentListBlockIndex] ||
        listBlockInfoMap[currentListBlockIndex].type !== type //  found a contiguous list item but has different type
      ) {
        currentListBlockIndex = idx;
        listBlockInfoMap[currentListBlockIndex] = {
          index: currentListBlockIndex,
          nodes: [],
          type,
        };
      }

      listBlockInfoMap[currentListBlockIndex!].nodes.push(
        notionBlockToReactNode(block)
      );

      return arr;
    } else {
      // Reset current list block info
      if (currentListBlockIndex !== null) {
        currentListBlockIndex = null;
      }
    }

    arr.push(notionBlockToReactNode(block));

    return arr;
  }, [] as ReactNode[]);

  // 2. Create a list parent for the grouped list item nodes
  // then insert it back to the nodes array at its original block position
  for (const idx in listBlockInfoMap) {
    const blockInfo = listBlockInfoMap[idx];

    nodes.splice(
      blockInfo.index,
      0,
      createElement(blockInfo.type, { key: `list-${idx}` }, blockInfo.nodes)
    );
  }

  return nodes;
}

export function notionBlockToReactNode(_block: GetBlockResponse): ReactNode {
  const block = _block as BlockObjectResponse;
  // let elem: ReactNode;
  let tag: any;
  const props: Record<string, any> = { key: block.id };
  let children: any[] | undefined;

  switch (block.type) {
    case "heading_1":
      tag = "h1";
      children = block.heading_1.rich_text.map(notionRichTextToReactNode);
      break;

    case "heading_2":
      tag = "h2";
      children = block.heading_2.rich_text.map(notionRichTextToReactNode);
      break;

    case "heading_3":
      tag = "h3";
      children = block.heading_3.rich_text.map(notionRichTextToReactNode);
      break;

    case "paragraph":
      tag = "p";
      children = block.paragraph.rich_text.map(notionRichTextToReactNode);
      break;

    case "code":
      tag = CodeBlock;
      props.language = block.code.language;
      props.className = "my-4";
      children = block.code.rich_text.map(notionRichTextToReactNode);
      break;

    case "bulleted_list_item":
    case "numbered_list_item":
      const item =
        block.type === "bulleted_list_item"
          ? block.bulleted_list_item
          : block.numbered_list_item;

      tag = "li";
      children = item.rich_text.map(notionRichTextToReactNode);
      break;

    case "divider":
      tag = "hr";
      props.className = "my-4";
      break;
  }

  return tag ? createElement(tag, props, children) : "";
}
