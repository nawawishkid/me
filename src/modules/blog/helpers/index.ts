import {
  BlockObjectResponse,
  GetBlockResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { ReactNode, createElement } from "react";
import CodeBlock from "@/components/code-block";

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

export const getTopicBgColor = (color: string) => notionBgColorHex[color];
export const getTopicFgColor = (color: string) => notionFgColorHex[color];

export const notionRichTextToReactNode = (
  richText: RichTextItemResponse,
  componentKey?: number | string
): ReactNode => {
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
      props.language =
        block.code.language === "plain text"
          ? "plaintext"
          : block.code.language;
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
