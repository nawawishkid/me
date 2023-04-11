import LatestBlogPosts from "./latest-blog-posts";
import Hero from "./hero";
import LatestProjects from "./latest-projects";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <LatestProjects />
      <LatestBlogPosts />
    </main>
  );
}
