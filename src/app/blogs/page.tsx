import BlogPostList from "@/modules/blog/components/blog-post-list";
import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";
import Animatable from "./[slug]/animatable";

export const metadata = {
  title: "Blog Posts | Nawawishkid 🥰",
  description: "Blog posts written by Nawawishkid 🥰",
};

export default function BlogPostListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { tag } = searchParams;
  let filter: QueryDatabaseParameters["filter"];

  if (tag) {
    if (Array.isArray(tag)) {
      filter = {
        or: tag.map((t) => ({
          property: "Topics",
          multi_select: { contains: t },
        })),
      };
    } else {
      filter = { property: "Topics", multi_select: { contains: tag } };
    }
  }

  return (
    <>
      <h1 className="my-8 text-center text-3xl">My Blog Posts</h1>
      <Animatable>
        {/* @ts-expect-error Server Component */}
        <BlogPostList filter={filter} />
      </Animatable>
    </>
  );
}
