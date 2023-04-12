import {
  findOnePostById,
  notionRichTextToReactNode,
} from "@/modules/blog/helpers";
import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { Metadata } from "next";
import { ReactNode, cache } from "react";
import CodeBlock from "./code-block";
import Animatable from "../../../components/animatable";

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
        <h1 className="text-3xl font-bold text-center my-8 mb-16">
          {post.title}
        </h1>
        {post.content ? (
          <article className="max-w-screen-lg mx-auto">
            {post.content.map((_block) => {
              // console.log("block: ", _block);
              const block = _block as BlockObjectResponse;
              let elem: ReactNode;

              switch (block.type) {
                case "paragraph":
                  elem = (
                    <p key={block.id}>
                      {block.paragraph.rich_text.map(notionRichTextToReactNode)}
                    </p>
                  );
                  break;

                case "code":
                  elem = (
                    <CodeBlock
                      key={block.id}
                      language={block.code.language}
                      className="my-4"
                    >
                      {block.code.rich_text.map(notionRichTextToReactNode)}
                    </CodeBlock>
                  );
                  break;

                case "numbered_list_item":
                  elem = (
                    <ol key={block.id}>
                      {block.numbered_list_item.rich_text.map(
                        (richText, idx) => (
                          <li key={idx}>
                            <span>{idx + 1}.</span>{" "}
                            <span>{notionRichTextToReactNode(richText)}</span>
                          </li>
                        )
                      )}
                    </ol>
                  );
                  break;

                case "bulleted_list_item":
                  elem = (
                    <ul key={block.id}>
                      {block.bulleted_list_item.rich_text.map(
                        (richText, idx) => (
                          <li key={idx}>
                            <span>-</span>{" "}
                            <span>{notionRichTextToReactNode(richText)}</span>
                          </li>
                        )
                      )}
                    </ul>
                  );
                  break;

                case "divider":
                  elem = <hr key={block.id} className="my-4" />;
                  break;

                default:
                  elem = "";
                  break;
              }

              return elem;
            })}
          </article>
        ) : null}
      </div>
    );
  }

  return <Animatable>{content}</Animatable>;
}
