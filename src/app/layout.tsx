import SiteNotice, { SiteNoticeProvider } from "@/components/site-notice";
import "./globals.css";
import AL from "./blogs/al";
import Animatable from "./blogs/[slug]/animatable";

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
          <AL>
            <Animatable>{children}</Animatable>
          </AL>
        </SiteNoticeProvider>
      </body>
    </html>
  );
}
