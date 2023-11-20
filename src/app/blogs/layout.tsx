import { ReactNode } from "react";

export default function BlogsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="p-8 max-w-screen-xl mx-auto">{children}</main>
    </>
  );
}
