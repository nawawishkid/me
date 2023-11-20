"use client";

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
        className="border rouned-lg p-2 md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? "Close" : "Menu"}
      </button>
      <nav
        className={`${
          isMenuOpen ? "fixed" : "hidden"
        } top-16 left-0 w-screen h-screen z-50 md:relative md:inline-block md:top-[unset] md:left-[unset] md:w-[unset] md:h-[unset] md:z-[unset] bg-slate-100`}
      >
        <ul className="flex flex-col items-start text-xl md:text-base md:flex-row md:items-center gap-4 p-8 md:p-0">
          {menus.map((menu) => (
            <Link
              key={menu.id}
              href={menu.path}
              className={`p-2${
                pathname === menu.path
                  ? " font-bold text-green-500 border-b-2 border-green-500"
                  : ""
              }`}
            >
              <li key={menu.id}>{menu.label}</li>
            </Link>
          ))}
        </ul>
      </nav>
    </>
  );
}
