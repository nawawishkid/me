import { ReactNode } from "react";
import Header from "./header";

export default function BlogsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="p-8 max-w-screen-lg mx-auto">{children}</main>
    </>
  );
}
