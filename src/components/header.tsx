import Image from "next/image";
import Link from "next/link";
import Nav from "./nav";

export default function Header() {
  return (
    <div className="h-16">
      <header
        className={`fixed flex items-center justify-between gap-4 left-0 w-full h-16 z-50 p-4 border-b bg-slate-100 top-0`}
      >
        <Link href="/" className="inline-flex items-center gap-4">
          <Image
            src="/logo.png"
            width={32}
            height={32}
            alt="Nawawishkid's logo"
          />
          nawawishkid.me
        </Link>
        <Nav />
      </header>
    </div>
  );
}
