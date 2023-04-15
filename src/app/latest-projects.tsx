import Image from "next/image";
import Link from "next/link";

const projectList: {
  title: string;
  description: string;
  logoUrl: string;
  url: string;
  status: "IN_PROGRESS" | "COMPLETE";
}[] = [
  {
    title: "RoomAI.design",
    description: "Transform Your Space with AI-Powered Interior Design",
    url: "https://roomai.design/",
    logoUrl: "https://roomai.design/logo.png",
    status: "IN_PROGRESS",
  },
  {
    title: "Portrait Revive",
    // description: "Revive the Past, Enhance the Present. Available via LINE",
    description:
      "Turn your old blurry portrait to a sharp one. Available via LINE",
    url: "https://lin.ee/SeknHQf",
    logoUrl: "/portraitrevive_logo.png",
    status: "IN_PROGRESS",
  },
];

export default function LatestProjects() {
  return (
    <div className="my-8 p-8 max-w-screen-lg flex items-center flex-col mx-auto">
      <h2 className="text-3xl mb-16">Latest Projects</h2>
      <ul>
        {projectList.map((project) => (
          <li key={project.url} className="mb-4">
            <Link href={project.url} target="_blank">
              <div
                className={`p-4 rounded-lg border flex items-start gap-4 hover:bg-slate-50${
                  project.status === "IN_PROGRESS" ? " relative" : ""
                }`}
              >
                {project.status === "IN_PROGRESS" && (
                  <div className="absolute top-[-1px] right-0 py-0.5 px-1 bg-red-300 text-red-500 rounded-bl-md flex justify-center items-center">
                    <small>In Progress</small>
                  </div>
                )}
                <Image
                  src={project.logoUrl}
                  width={256}
                  height={256}
                  alt={`${project.title}'s logo`}
                  className="w-[64px] h-[64px]"
                />
                <div>
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold">
                      {/* <Link href={project.url} target="_blank"> */}
                      {project.title}
                      {/* </Link> */}
                    </h3>

                    {/* <Link
                      href={project.url}
                      target="_blank"
                      className="underline text-slate-500"
                    > */}
                    <small className="text-slate-500">
                      {new URL(project.url).hostname}
                    </small>
                    {/* </Link> */}
                  </div>
                  <p>{project.description}</p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
