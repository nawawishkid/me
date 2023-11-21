"use client";

import { Bars3BottomRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const menus: { id: string; label: string; path: string }[] = [
  {
    id: "home",
    label: "Home",
    path: "/",
  },
  {
    id: "projects",
    label: "Projects",
    path: "/projects",
  },
  {
    id: "blog",
    label: "Blogs",
    path: "/blogs",
  },
  {
    id: "about",
    label: "About",
    path: "/about",
  },
  {
    id: "contact",
    label: "Contact",
    path: "/contact",
  },
];

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  return (
    <>
      <button
        className="p-2 md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? (
          <XMarkIcon className="w-8 h-8" />
        ) : (
          <Bars3BottomRightIcon className="w-8 h-8" />
        )}
      </button>
      <nav
        className={`${
          isMenuOpen ? "h-screen" : "h-0"
        } bg-slate-50 overflow-hidden w-screen fixed top-16 left-0 z-50 md:relative md:inline-block md:top-[unset] md:left-[unset] md:w-[unset] md:h-full md:z-[unset] transition-all duration-500`}
      >
        <ul className="py-8 flex flex-col items-start text-xl md:text-base md:flex-row md:items-center gap-4 md:p-0 h-full">
          {menus.map((menu) => (
            <Link
              key={menu.id}
              href={menu.path}
              className={`px-8 py-2 md:p-2 w-full border-b-2 border-transparent md:h-full md:flex md:items-center md:justify-center transition-all duration-300${
                pathname === menu.path
                  ? " font-bold text-green-600 bg-green-100 md:border-green-500 md:bg-[unset]"
                  : " border-transparent hover:text-bg-700 hover:bg-green-100"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <li>{menu.label}</li>
            </Link>
          ))}
        </ul>
      </nav>
    </>
  );
}
