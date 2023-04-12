import {
  findOnePostById,
  notionBlocksToReactNodes,
} from "@/modules/blog/helpers";
import type { Metadata } from "next";
import { ReactNode, cache } from "react";
import Animatable from "../../../components/animatable";
import { GetBlockResponse } from "@notionhq/client/build/src/api-endpoints";

interface Props {
  params: { slug: string };
}

const findPostFromProps = cache(({ params }: Props) => {
  const splitted = params.slug.split("-");
  const postId = splitted[splitted.length - 1];

  return findOnePostById(postId);
});

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const post = await findPostFromProps(props);

    if (!post) {
      return {};
    }

    const title = `${post.title} | Nawawishkid 🥰`;

    return {
      title,
      description: post.description,
      openGraph: {
        images: post.coverImageUrl,
        title,
        description: post.description,
      },
    };
  } catch (e) {
    console.error(e);

    return {};
  }
}

export default async function BlogPost(props: Props) {
  const post = await findPostFromProps(props);
  let content: ReactNode;

  if (!post) {
    content = <h1>Post not found</h1>;
  } else {
    content = (
      <div>
        <h1 className="text-center my-8 mb-16">{post.title}</h1>
        {post.content ? (
          <article className="max-w-screen-lg mx-auto py-8 my-8">
            <NotionBlocksHtml blocks={post.content} />
            {/* {post.content.map(notionBlockToReactNode)} */}
          </article>
        ) : null}
      </div>
    );
  }

  return <Animatable>{content}</Animatable>;
}

function NotionBlocksHtml({ blocks }: { blocks: GetBlockResponse[] }) {
  return <>{notionBlocksToReactNodes(blocks)}</>;
}
