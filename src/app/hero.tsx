"use client";
import { motion } from "framer-motion";

export default function Hero() {
  return (
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
  );
}

function Heading() {
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
        Hi, there!!!
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
}
