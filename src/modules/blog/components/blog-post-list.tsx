import Image from "next/image";
import Link from "next/link";
import { findBlogPosts, getTopicBgColor, getTopicFgColor } from "../helpers";

export default async function BlogPostList() {
  const posts = await findBlogPosts();

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
                <Link href={post.url} className="underline">
                  <h3 className="text-2xl font-bold">{post.title}</h3>
                </Link>
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
                          backgroundColor: getTopicBgColor(topic.color),
                          color: getTopicFgColor(topic.color),
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
