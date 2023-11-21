import { Suspense } from "react";
import { BlogPostQuery } from "../types";
import BlogListClient from "./blog-list-client";
import LoadingSkeleton from "./loading-skeleton";
import { findBlogPosts } from "../api";

type DisplayMode = "row" | "grid";
interface Props {
  query?: BlogPostQuery;
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
  const response = await findBlogPosts(query);

  return <BlogListClient query={query} response={response} mode={mode} />;
}
