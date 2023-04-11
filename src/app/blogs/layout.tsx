import { ReactNode } from "react";
import Header from "./header";

export default function BlogsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
