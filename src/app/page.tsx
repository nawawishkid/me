import LatestBlogPosts from "./latest-blog-posts";
import Hero from "./hero";
import LatestProjects from "./latest-projects";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="fixed w-full top-0 left-0 bg-red-500 text-white text-center p-2 text-sm z-[9999]">
        This site is being developed. It changes everyday!
      </div>
      <Hero />
      <LatestProjects />
      <LatestBlogPosts />
    </main>
  );
}
