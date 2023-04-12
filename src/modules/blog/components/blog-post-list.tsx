import Image from "next/image";
import Link from "next/link";
import { findBlogPosts, getTopicBgColor, getTopicFgColor } from "../helpers";
import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";
import Animatable from "@/components/animatable";

export default async function BlogPostList(
  params?: Omit<QueryDatabaseParameters, "database_id" | "filter_properties">
) {
  const posts = await findBlogPosts(params);

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.url} className="mb-8">
          <div className="p-6 sm:p-8 rounded-lg border flex items-start gap-4">
            {post.coverImageUrl && (
              <Image
                src={post.coverImageUrl}
                width={64}
                height={64}
                alt={`${post.title}'s logo`}
              />
            )}
            <div>
              <div className="mb-4">
                <Link href={post.url}>
                  <h3 className="text-xl sm:text-2xl font-semibold">
                    {post.title}
                  </h3>
                </Link>
              </div>
              <p>{post.description}</p>
              <div>
                <ul className="flex gap-2 mt-4">
                  {post.topics.map((topic) => (
                    <li key={topic.id}>
                      <Link
                        href={topic.url}
                        className="rounded p-1 text-xs no-underline"
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
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function LoadingSkeleton() {
  return (
    <Animatable className="w-full max-w-screen-lg p-8">
      {Array(3)
        .fill(null)
        .map((_, idx) => (
          <div
            key={idx}
            className="p-6 sm:p-8 rounded-lg border flex items-start gap-4 bg-white mb-8"
          >
            <div className="flex-shrink-0 flex-grow basis-[100px] h-[100px] bg-slate-200 animate-pulse rounded"></div>
            <div className="flex-1 basis-4/5">
              <div className="mb-6 w-full h-8 bg-slate-200 animate-pulse rounded"></div>
              <div className="mb-2 w-full h-4 bg-slate-200 animate-pulse rounded"></div>
              <div className="w-full h-4 bg-slate-200 animate-pulse rounded"></div>
            </div>
          </div>
        ))}
    </Animatable>
  );
}
