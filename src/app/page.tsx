import LatestBlogPosts from "./latest-blog-posts";
import Hero from "./hero";
import BlogPostListPage from "./blogs/page";
// import LatestProjects from "./latest-projects";

export default function Home() {
  return (
    <main className="mt-8 mb-16 px-4 sm:mt-16 sm:mb-32 sm:px-8">
      <BlogPostListPage searchParams={{}} />
    </main>
  );
  return (
    <main className="min-h-screen">
      {/* <Hero /> */}
      {/* <LatestProjects /> */}
      <LatestBlogPosts />
    </main>
  );
}
