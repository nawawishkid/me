"use client";
import { ReactNode } from "react";
import { AnimationProps, HTMLMotionProps, motion } from "framer-motion";

export default function Animatable({
  children,
  ...props
}: { children: ReactNode } & AnimationProps & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
