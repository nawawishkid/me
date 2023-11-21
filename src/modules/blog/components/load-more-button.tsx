"use client";

import { useEffect, useState } from "react";
import { BlogPostQuery } from "../types";
import { FindBlogPostsResponse } from "../api/types";

export default function LoadMoreButton({
  query,
  onLoaded,
  onLoading,
  onError,
}: {
  query: BlogPostQuery;
  onLoaded?: (posts: FindBlogPostsResponse) => void;
  onLoading?: () => void;
  onError?: (error: Error) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoading && typeof onLoading === "function") {
      onLoading();
    }
  }, [isLoading, onLoading]);

  return (
    <button
      className={`p-4 rounded-lg bg-slate-50 hover:bg-white shadow-lg shadow-gray-300/30 hover:-translate-y-2 transition-all border${
        isLoading ? " opacity-50" : ""
      }`}
      onClick={() => {
        setIsLoading(true);
        fetch(`/api/blogs/search`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(query),
        })
          .then((res) => {
            const body = res.json();

            if (res.status !== 200) {
              if (body && typeof body === "object" && "error" in body) {
                throw new Error(body.error as string);
              }

              throw new Error(`Failed to load blogs: ${res.statusText}`);
            }

            return body;
          })
          .then((res) =>
            typeof onLoaded === "function" ? onLoaded(res) : null
          )
          .catch((e) => {
            if (typeof onError === "function") {
              onError(e);
            } else {
              console.error(e);
            }
          })
          .finally(() => setIsLoading(false));
      }}
      disabled={isLoading}
    >
      {isLoading ? "Loading..." : "Load More"}
    </button>
  );
}
