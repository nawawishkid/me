import Link from "next/link";
import { findBlogPosts, getTopicBgColor, getTopicFgColor } from "../helpers";
import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";
import Animatable from "@/components/animatable";
import { Suspense } from "react";

type DisplayMode = "row" | "grid";
interface Props {
  query?: Omit<QueryDatabaseParameters, "database_id" | "filter_properties">;
  mode?: DisplayMode;
}

export default function BlogPostList({ query, mode = "grid" }: Props) {
  return (
    <Suspense fallback={<LoadingSkeleton mode={mode} />}>
      {/* @ts-expect-error Server Component */}
      <BlogPostListNoSuspense query={query} />
    </Suspense>
  );
}

export async function BlogPostListNoSuspense({ query, mode = "grid" }: Props) {
  const posts = await findBlogPosts(query);
  const isGrid = mode === "grid";

  return (
    <ul className="flex flex-wrap gap-8 justify-center">
      {posts.map((post) => (
        <li
          key={post.url}
          className={`basis-full ${
            isGrid &&
            "sm:basis-[calc(50%_-_theme(spacing.8)_/_2)] lg:basis-[calc(33.33%_-_theme(spacing.8))]"
          }`}
        >
          <Link href={post.url} className="text-inherit hover:no-underline">
            <div className="p-6 sm:p-8 rounded-lg border flex items-start gap-4 hover:bg-slate-50">
              {/* {post.coverImageUrl && (
                <Image
                  src={post.coverImageUrl}
                  width={64}
                  height={64}
                  alt={`${post.title}'s logo`}
                />
              )} */}
              <div
                className={`flex flex-col ${
                  isGrid && "sm:min-h-[200px] lg:min-h-[250px]"
                }`}
              >
                <div className="flex-1">
                  <h3 className="mb-4 text-xl sm:text-2xl font-semibold">
                    {post.title}
                  </h3>
                  <p>{post.description}</p>
                </div>
                <div className="flex-1 flex items-end">
                  <ul className="flex gap-2 mt-4">
                    {post.topics.map((topic) => (
                      <li key={topic.id}>
                        <span
                          className="rounded p-1 text-xs no-underline"
                          style={{
                            backgroundColor: getTopicBgColor(topic.color),
                            color: getTopicFgColor(topic.color),
                          }}
                        >
                          {topic.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function LoadingSkeleton({ mode = "grid" }: { mode?: DisplayMode }) {
  const isGrid = mode === "grid";

  return (
    <Animatable className="w-full max-w-screen-lg">
      {
        <ul className="flex flex-wrap gap-8 justify-center">
          {Array(isGrid ? 5 : 3)
            .fill(null)
            .map((_, idx) => (
              <li
                key={idx}
                className={`basis-full ${
                  isGrid &&
                  "sm:basis-[calc(50%_-_theme(spacing.8)_/_2)] lg:basis-[calc(33.33%_-_theme(spacing.8))]"
                }`}
              >
                <div className="p-6 sm:p-8 rounded-lg border flex items-start gap-4">
                  {/* {post.coverImageUrl && (
                      <Image
                        src={post.coverImageUrl}
                        width={64}
                        height={64}
                        alt={`${post.title}'s logo`}
                      />
                    )} */}
                  <div
                    className={`flex w-full flex-col ${
                      isGrid && "sm:min-h-[200px] lg:min-h-[250px]"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="mb-4 w-full h-8 skeleton"></div>
                      <div className="h-4 mb-2 w-full skeleton"></div>
                      <div className="h-4 w-full skeleton"></div>
                    </div>
                    <div className="flex-1 flex items-end">
                      <ul className="flex gap-2 mt-4 w-full">
                        {Array(3)
                          .fill(null)
                          .map((_, idx) => (
                            <li key={idx} className="h-4 p-1 w-8 skeleton"></li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      }
    </Animatable>
  );
}
