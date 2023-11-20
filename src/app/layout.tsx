import "./globals.css";
import AnimatePresenceWrapper from "../components/animate-presence-wrapper";
import Animatable from "../components/animatable";
import Header from "@/components/header";

export const metadata = {
  title: "Nawawishkid 🥰",
  description: "This is is about me! 🥰",
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
