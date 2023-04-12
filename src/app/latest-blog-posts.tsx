import BlogPostList from "@/modules/blog/components/blog-post-list";
import Link from "next/link";

export default function LatestBlogPosts() {
  return (
    <div className="my-8 p-8 max-w-screen-lg flex items-center flex-col mx-auto">
      <h2 className="text-3xl mb-16">Latest Blog Posts</h2>
      <BlogPostList query={{ page_size: 5 }} />
      <div className="my-4 flex justify-center">
        <Link href="/blogs" className="underline">
          View All
        </Link>
      </div>
    </div>
  );
}
