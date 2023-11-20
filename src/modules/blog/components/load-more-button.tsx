"use client";

import { useEffect, useState } from "react";
import { FindBlogPostsResponse } from "../helpers";
import { BlogPostQuery } from "../types";

export default function LoadMoreButton({
  query,
  onLoaded,
  onLoading,
}: {
  query: BlogPostQuery;
  onLoaded?: (posts: FindBlogPostsResponse) => void;
  onLoading?: () => void;
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
          .then((res) => res.json())
          .then((res) =>
            typeof onLoaded === "function" ? onLoaded(res) : null
          )
          .finally(() => setIsLoading(false));
      }}
      disabled={isLoading}
    >
      {isLoading ? "Loading..." : "Load More"}
    </button>
  );
}
