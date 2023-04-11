import { findOnePostById } from "@/modules/blog/helpers";
import type { Metadata } from "next";
import { ReactNode, Suspense, cache } from "react";

interface Props {
  params: { slug: string };
}

const cachedFindOnePostById = cache(findOnePostById);
const findPostFromProps = ({ params }: Props) => {
  const splitted = params.slug.split("-");
  const postId = splitted[splitted.length - 1];

  return cachedFindOnePostById(postId);
};

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

export default function SingleBlogPostPage(props: Props) {
  return (
    <main className="p-8">
      <Suspense fallback={"Loading..."}>
        {/* @ts-expect-error Server Component */}
        <BlogPost {...props} />
      </Suspense>
    </main>
  );
}

async function BlogPost(props: Props) {
  const post = await findPostFromProps(props);
  let content: ReactNode;

  if (!post) {
    content = <h1>Post not found</h1>;
  } else {
    content = (
      <article>
        <h1 className="text-3xl font-bold text-center">{post.title}</h1>
      </article>
    );
  }

  return <>{content}</>;
}
