import BlogPostList from "@/modules/blog/components/blog-post-list";
import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";
import Animatable from "../../components/animatable";

export const metadata = {
  title: "Blog Posts | Nawawishkid 🥰",
  description: "Blog posts written by Nawawishkid 🥰",
};

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export default function BlogPostListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filter = searchParamsToFilter(searchParams);

  return (
    <>
      <h1 className="my-8 text-center text-3xl">Blogs</h1>
      <Animatable>
        <BlogPostList query={{ filter }} />
      </Animatable>
    </>
  );
}

const searchParamsToFilter = (searchParams: SearchParams) => {
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

  return filter;
};
