import {
  findOnePostById,
  getTopicBgColor,
  getTopicFgColor,
  notionBlocksToReactNodes,
} from "@/modules/blog/helpers";
import type { Metadata } from "next";
import { ReactNode, cache } from "react";
import Animatable from "../../../components/animatable";
import { GetBlockResponse } from "@notionhq/client/build/src/api-endpoints";
import Link from "next/link";

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
      <div className="mx-auto max-w-screen-md">
        <h1 className="text-3xl md:text-4xl font-bold text-center my-8 mb-16">
          {post.title}
        </h1>
        <small>{post.createdAt}</small>
        <div className="flex items-center mt-4">
          <ul className="flex gap-2 flex-wrap">
            {post.topics.map((topic) => (
              <li
                key={topic.id}
                className="hover:-translate-y-1 hover:translate-x-1 transition-all"
              >
                <Link
                  href={`/blogs?topic=${topic.name}`}
                  className="rounded py-1 px-2 text-xs no-underline"
                  style={{
                    backgroundColor: getTopicBgColor(topic.color),
                    color: getTopicFgColor(topic.color),
                  }}
                >
                  {topic.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {post.content ? (
          <article className="py-8 my-8">
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
