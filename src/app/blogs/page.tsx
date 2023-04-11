import BlogPostList from "@/modules/blog/components/blog-post-list";
import { Suspense } from "react";

export const metadata = {
  title: "Blog Posts | Nawawishkid 🥰",
  description: "Blog posts written by Nawawishkid 🥰",
};

export default function BlogPostListPage() {
  return (
    <main className="p-8">
      <h1 className="my-8 text-center text-3xl">My Blog Posts</h1>
      <Suspense fallback={"Loading..."}>
        {/* @ts-expect-error Server Component */}
        <BlogPostList />
      </Suspense>
    </main>
  );
}
