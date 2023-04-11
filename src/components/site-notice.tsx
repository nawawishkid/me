"use client";
import { ReactNode, useContext } from "react";
import { createContext } from "react";

export const SiteNoticeContext = createContext(true);
export const useSiteNotice = () => useContext(SiteNoticeContext);
export const SiteNoticeProvider = ({
  children,
  isOpen,
}: {
  children: ReactNode;
  isOpen: boolean;
}) => (
  <SiteNoticeContext.Provider value={isOpen}>
    {children}
  </SiteNoticeContext.Provider>
);

export default function SiteNotice() {
  const isOpen = useSiteNotice();

  if (!isOpen) return null;

  return (
    <div className="h-8">
      <div className="fixed h-8 w-full top-0 left-0 bg-red-500 text-white flex justify-center items-center text-sm z-[9999]">
        This site is being developed. It changes everyday!
      </div>
    </div>
  );
}
