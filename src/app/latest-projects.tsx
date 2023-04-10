import Image from "next/image";
import Link from "next/link";

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

export default function LatestProjects() {
  return (
    <div className="my-8 p-8 max-w-screen-lg flex items-center flex-col mx-auto">
      <h2 className="text-3xl mb-16">Latest Projects</h2>
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
}
