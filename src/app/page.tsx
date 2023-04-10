import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";
import LatestBlogPosts from "./latest-blog-posts";
import Hero from "./hero";

const inter = Inter({ subsets: ["latin"] });
const projectList: {
  title: string;
  description: string;
  logoUrl: string;
  url: string;
}[] = [
  {
    title: "RoomAI.design",
    description: "Transform Your Space with AI-Powered Interior Design",
    url: "https://roomai.design/",
    logoUrl: "https://roomai.design/logo.png",
  },
];

// const blogPostList: {
//   title: string;
//   excerpt: string;
//   coverImageUrl: string;
//   url: string;
// }[] = [
//   {
//     title: "My Windows 11's WiFi option just disappeared",
//     excerpt: "Lorem ipsum dolor sit amet",
//     coverImageUrl: "/blog/first-blog/cover.png",
//     url: "/blog/first-blog",
//   },
// ];

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <MyProjects />
      {/* <BlogPosts /> */}
      <LatestBlogPosts />
    </main>
  );
}

// const BlogPosts = () => {
//   return (
//     <div className="my-8 p-8 max-w-screen-lg flex items-center flex-col mx-auto">
//       <h2 className="text-3xl mb-16">Blog Posts</h2>
//       <ul>
//         {blogPostList.map((blogPost) => (
//           <li key={blogPost.url} className="mb-4">
//             <div className="p-4 rounded-lg border flex items-start gap-4">
//               <Image
//                 src={blogPost.coverImageUrl}
//                 width={64}
//                 height={64}
//                 alt={`${blogPost.title}'s logo`}
//               />
//               <div>
//                 <div className="mb-4">
//                   <h3 className="text-2xl font-bold">{blogPost.title}</h3>
//                   <Link
//                     href={blogPost.url}
//                     target="_blank"
//                     className="underline text-slate-500"
//                   >
//                     <small>{blogPost.url}</small>
//                   </Link>
//                 </div>
//                 <p>{blogPost.excerpt}</p>
//               </div>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

const MyProjects = () => {
  return (
    <div className="my-8 p-8 max-w-screen-lg flex items-center flex-col mx-auto">
      <h2 className="text-3xl mb-16">My projects</h2>
      <ul>
        {projectList.map((project) => (
          <li key={project.url} className="mb-4">
            <div className="p-4 rounded-lg border flex items-start gap-4">
              <Image
                src={project.logoUrl}
                width={64}
                height={64}
                alt={`${project.title}'s logo`}
              />
              <div>
                <div className="mb-4">
                  <h3 className="text-2xl font-bold">{project.title}</h3>
                  <Link
                    href={project.url}
                    target="_blank"
                    className="underline text-slate-500"
                  >
                    <small>{new URL(project.url).hostname}</small>
                  </Link>
                </div>
                <p>{project.description}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
