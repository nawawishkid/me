"use client";
import Image from "next/image";
import { Inter } from "next/font/google";
import { motion } from "framer-motion";
import Link from "next/link";

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

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="p-8 flex justify-center items-center">
        <div className="my-24">
          <Heading />
          <motion.p
            animate={{ opacity: [0, 1] }}
            transition={{ delay: 3.5, duration: 1 }}
            className="opacity-0"
          >
            I make some stuff
          </motion.p>
        </div>
      </div>
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
    </main>
  );
}

const Heading = () => {
  return (
    <h1 className="relative text-xl my-8">
      <motion.span
        animate={{
          translateY: ["200%", "-100%"],
          rotate: ["0deg", "-12deg"],
          opacity: [0, 1, 1],
        }}
        transition={{
          duration: 1,
        }}
        className="block opacity-0 absolute -left-1/2 w-full text-center"
      >
        Hi, everyone!!!
      </motion.span>
      <motion.span
        animate={{ opacity: [0, 1] }}
        transition={{
          delay: 1,
          duration: 0.5,
        }}
        className="opacity-0"
      >
        I&apos;m{" "}
      </motion.span>
      <motion.span
        whileTap={{ scale: 0.95 }}
        drag
        dragSnapToOrigin
        className="inline-block text-3xl font-bold cursor-pointer hover:[text-shadow:_0_0_5px_red] transition-all select-none"
      >
        <motion.span
          animate={{ opacity: [0, 1] }}
          transition={{ delay: 1.7, duration: 0.15 }}
          className="opacity-0"
        >
          @
        </motion.span>
        <span className="underline">
          {"nawawishkid".split("").map((char, idx) => (
            <motion.span
              key={idx}
              animate={{ opacity: [0, 1] }}
              transition={{ delay: (idx + 1) * 0.1 + 1.7, duration: 0.15 }}
              className="opacity-0"
            >
              {char}
            </motion.span>
          ))}
        </span>
      </motion.span>
    </h1>
  );
};
