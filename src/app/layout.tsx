import "./globals.css";
import AnimatePresenceWrapper from "../components/animate-presence-wrapper";
import Animatable from "../components/animatable";
import Header from "@/components/header";
import { Metadata } from "next";

const brandName = "@nawawishkid";
const tagLine = "To live is to create";

export const metadata: Metadata = {
  title: {
    default: tagLine,
    template: "%s | " + brandName,
  },
  creator: brandName,
  description: tagLine,
  twitter: {
    creator: brandName,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <AnimatePresenceWrapper>
          <Animatable>{children}</Animatable>
        </AnimatePresenceWrapper>
      </body>
    </html>
  );
}
