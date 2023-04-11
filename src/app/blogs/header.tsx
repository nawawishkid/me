"use client";
import { useSiteNotice } from "@/components/site-notice";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const isNoticeOpen = useSiteNotice();

  return (
    <div className="h-16">
      <header
        className={`fixed left-0 w-full h-16 z-50 p-4 border-b bg-white top-${
          isNoticeOpen ? "8" : "0"
        }`}
      >
        <Link href="/" className="inline-block">
          <Image
            src="/logo.png"
            width={32}
            height={32}
            alt="Nawawishkid's logo"
          />
        </Link>
      </header>
    </div>
  );
}
