"use client";
import { AnimatePresence, AnimatePresenceProps } from "framer-motion";
import { ReactNode } from "react";

export default function AL({
  children,
  ...props
}: { children: ReactNode } & AnimatePresenceProps) {
  return <AnimatePresence {...props}>{children}</AnimatePresence>;
}
