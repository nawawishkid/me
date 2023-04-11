import { Client } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

interface BlogPostTopic {
  id: string;
  name: string;
  color: string;
  url: string;
}

interface BlogPost {
  title: string;
  description: string;
  coverImageUrl?: string;
  url: string;
  topics: BlogPostTopic[];
}

const notionBgColorHex: Record<string, string> = {
  red: "#ffe2dd",
  blue: "#d3e5ef",
  orange: "#fadec9",
  purple: "#e8deee",
  pink: "#f5e0e9",
  green: "#dbeddb",
};
const notionFgColorHex: Record<string, string> = {
  red: "rgb(93, 23, 21)",
  blue: "rgb(24, 51, 71)",
  orange: "rgb(73, 41, 14)",
  purple: "rgb(65, 36, 84)",
  pink: "rgb(76, 35, 55)",
  green: "rgb(28, 56, 41)",
};

async function getPosts() {
  const notion = new Client({
    auth: process.env.NOTION_SECRET_KEY,
  });

  try {
    const response = await notion.databases.query({
      database_id: "5d56f6caeb1e447db26faf98127f5552",
      page_size: 10,
      sorts: [{ property: "Created", direction: "descending" }],
    });
    const posts = (response.results as PageObjectResponse[]).map<BlogPost>(
      (page) => {
        let title: string = "";
        let coverImageUrl: string | undefined = undefined;
        let path = new URL(page.url).pathname;
        let topics: BlogPostTopic[] = [];

        const titleProperty = page.properties["Title"];

        if (titleProperty.type === "title") {
          title = titleProperty.title[0].plain_text;
        }

        if (page.cover) {
          if (page.cover.type === "external") {
            coverImageUrl = page.cover.external.url;
          } else if (page.cover.type === "file") {
            coverImageUrl = page.cover.file.url;
          } else {
            coverImageUrl = "";
          }
        }

        const topicsProperty = page.properties["Topics"];

        if (topicsProperty.type === "multi_select") {
          topics = topicsProperty.multi_select.map((topic) => ({
            ...topic,
            url: `/blogs?tag=${topic.name}`,
          }));
        }

        return {
          title,
          coverImageUrl,
          description: "Lorem ipsum dolor sit amet",
          url: `/blogs${path}`,
          topics,
        };
      }
    );

    return posts;
  } catch (e) {
    console.error(e);

    return [];
  }
}

export default function LatestBlogPosts() {
  const posts = getPosts();
  /* @ts-expect-error Server Component */
  const content = <BlogPostList promise={posts} />;

  return (
    <div className="my-8 p-8 max-w-screen-lg flex items-center flex-col mx-auto">
      <h2 className="text-3xl mb-16">Blog Posts</h2>
      <Suspense fallback={<div>Loading...</div>}>{content}</Suspense>
    </div>
  );
}

async function BlogPostList({ promise }: { promise: Promise<BlogPost[]> }) {
  const posts = await promise;

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.url} className="mb-4">
          <div className="p-4 rounded-lg border flex items-start gap-4">
            {post.coverImageUrl && (
              <Image
                src={post.coverImageUrl}
                width={64}
                height={64}
                alt={`${post.title}'s logo`}
              />
            )}
            <div>
              <div className="mb-4">
                <Link href={post.url} target="_blank" className="underline">
                  <h3 className="text-2xl font-bold">{post.title}</h3>
                </Link>
                {/* <Link
                  href={post.url}
                  target="_blank"
                  className="underline text-slate-500"
                >
                  <small>{post.url}</small>
                </Link> */}
              </div>
              <p>{post.description}</p>
              <div>
                <ul className="flex gap-2 mt-4">
                  {post.topics.map((topic) => (
                    <li key={topic.id}>
                      <Link
                        href={topic.url}
                        className="rounded p-1 text-xs"
                        style={{
                          backgroundColor: notionBgColorHex[topic.color],
                          color: notionFgColorHex[topic.color],
                        }}
                      >
                        {topic.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
