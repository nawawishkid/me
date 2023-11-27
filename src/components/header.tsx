import Image from "next/image";
import Link from "next/link";
import Nav from "./nav";

export default function Header() {
  return (
    <div className="h-[88px]">
      <header className="fixed left-0 w-full z-50 bg-slate-50 top-0">
        <div className="flex justify-center items-center bg-red-200 text-red-500 text-xs h-6">
          This site is in development
        </div>
        <div className={`flex items-center justify-between gap-4`}>
          <Link href="/" className="inline-flex items-center gap-4 p-4">
            <Image
              src="/logo.png"
              width={32}
              height={32}
              alt="Nawawishkid's logo"
            />
            nawawishkid.me
          </Link>
          <Nav />
        </div>
      </header>
    </div>
  );
}
