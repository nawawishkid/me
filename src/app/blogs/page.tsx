import BlogPostList from "@/modules/blog/components/blog-post-list";
import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";
import Animatable from "../../components/animatable";
// import { XMarkIcon } from "@heroicons/react/24/outline";

export const metadata = {
  title: "Blog Posts",
  description: "Blog posts written by @nawawishkid",
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
  const filteredTopics: string[] = [];

  if (filter && "property" in filter) {
    if (
      filter.property === "Topics" &&
      "multi_select" in filter &&
      "contains" in filter.multi_select
    ) {
      filteredTopics.push(filter.multi_select.contains);
    }
  }

  return (
    <>
      <h1 className="my-8 text-center text-3xl">Blogs</h1>
      <div className="flex max-w-screen-md mx-auto my-8">
        {filteredTopics.length > 0 && (
          <div>
            <span>Topics: </span>
            <ul className="inline-flex items-center p-2 text-xs">
              {filteredTopics.map((t) => (
                <li
                  key={t}
                  className="py-1 px-2 border rounded flex gap-1 items-center cursor-default"
                >
                  <span>{t}</span>
                  {/* <XMarkIcon className="inline w-4 h-4 cursor-pointer" /> */}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <Animatable>
        <BlogPostList query={{ filter }} />
      </Animatable>
    </>
  );
}

const searchParamsToFilter = (searchParams: SearchParams) => {
  const { topic } = searchParams;
  let filter: QueryDatabaseParameters["filter"];

  if (topic) {
    if (Array.isArray(topic)) {
      filter = {
        or: topic.map((t) => ({
          property: "Topics",
          multi_select: { contains: t },
        })),
      };
    } else {
      filter = { property: "Topics", multi_select: { contains: topic } };
    }
  }

  return filter;
};
