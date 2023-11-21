"use client";

import { useState } from "react";
import { BlogPost, BlogPostQuery } from "../types";
import Link from "next/link";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import { getTopicBgColor, getTopicFgColor } from "../helpers";
import LoadMoreButton from "./load-more-button";
import LoadingSkeleton from "./loading-skeleton";
import { FindBlogPostsResponse } from "../api/types";
import Image from "next/image";

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
            <div className="rounded-2xl flex flex-col gap-4 bg-slate-50 hover:bg-white shadow-lg shadow-gray-300/30 hover:-translate-y-2 transition-all hover:shadow-green-300/30">
              {post.coverImageUrl && (
                <div className="w-full min-h-[250px] relative rounded-tl-2xl rounded-tr-2xl overflow-hidden">
                  <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div
                className={`px-6 pb-6 sm:px-8 sm:pb-8 flex flex-col justify-between gap-4 ${
                  isGrid && "sm:min-h-[200px] lg:min-h-[250px]"
                }`}
              >
                <div className="flex flex-col gap-4">
                  <div>
                    <small>{post.createdAt}</small>
                    <Link
                      href={post.url}
                      className="hover:no-underline transition-all duration-200 hover:[text-shadow:_0_0_2px_theme(colors.green.500)]"
                    >
                      <h3 className="text-xl sm:text-2xl font-semibold">
                        {post.title}
                      </h3>
                    </Link>
                  </div>
                  <div className="flex items-center">
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
                  <p>{post.description}</p>
                </div>
                <Link
                  href={post.url}
                  className="hover:underline font-bold text-blue-500"
                >
                  Read more
                  <ArrowLongRightIcon className="w-4 h-4 inline ml-2" />
                </Link>
              </div>
            </div>
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
            onError={(e) => {
              console.error(e);
              setIsLoadingMore(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
