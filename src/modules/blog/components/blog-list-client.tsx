"use client";

import { useState } from "react";
import { BlogPost, BlogPostQuery } from "../types";
import Link from "next/link";
import {
  FindBlogPostsResponse,
  getTopicBgColor,
  getTopicFgColor,
} from "../helpers";
import LoadMoreButton from "./load-more-button";
import LoadingSkeleton from "./loading-skeleton";

type DisplayMode = "row" | "grid";
interface Props {
  query?: BlogPostQuery;
  response: FindBlogPostsResponse;
  mode?: DisplayMode;
}

export default function BlogListClient({
  query,
  response,
  mode = "grid",
}: Props) {
  const [nextCursor, setNextCursor] = useState<string | null>(
    response.nextCursor
  );
  const [blogs, setBlogs] = useState<BlogPost[]>(response.posts);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const isGrid = mode === "grid";

  return (
    <div className="flex flex-col gap-8">
      <ul className="flex flex-wrap gap-8 justify-center">
        {blogs.map((post) => (
          <li
            key={post.url}
            className={`basis-full ${
              isGrid &&
              "sm:basis-[calc(50%_-_theme(spacing.8)_/_2)] lg:basis-[calc(33.33%_-_theme(spacing.8))]"
            }`}
          >
            <Link href={post.url} className="text-inherit hover:no-underline">
              <div className="p-6 sm:p-8 rounded-2xl flex items-start gap-4 bg-slate-50 hover:bg-white shadow-lg shadow-gray-300/30 hover:-translate-y-2 transition-all">
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
                    <ul className="flex gap-2 flex-wrap mt-4">
                      {post.topics.map((topic) => (
                        <li
                          key={topic.id}
                          className="hover:-translate-y-1 hover:translate-x-1 transition-all"
                        >
                          <span
                            className="rounded py-1 px-2 text-xs no-underline"
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
      {isLoadingMore && <LoadingSkeleton mode={mode} />}
      {!isLoadingMore && nextCursor && (
        <div className="flex justify-center">
          <LoadMoreButton
            query={
              query
                ? { ...query, start_cursor: nextCursor }
                : { start_cursor: nextCursor }
            }
            onLoading={() => setIsLoadingMore(true)}
            onLoaded={(res) => {
              setBlogs((prev) => [...prev, ...res.posts]);
              setNextCursor(res.nextCursor);
              setIsLoadingMore(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
