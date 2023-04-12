import SiteNotice, { SiteNoticeProvider } from "@/components/site-notice";
import "./globals.css";
import AnimatePresenceWrapper from "../components/animate-presence-wrapper";
import Animatable from "../components/animatable";

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
        <SiteNoticeProvider isOpen={true}>
          <SiteNotice />
          <AnimatePresenceWrapper>
            <Animatable>{children}</Animatable>
          </AnimatePresenceWrapper>
        </SiteNoticeProvider>
      </body>
    </html>
  );
}
