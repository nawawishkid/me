import SiteNotice, { SiteNoticeProvider } from "@/components/site-notice";
import "./globals.css";

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
          {children}
        </SiteNoticeProvider>
      </body>
    </html>
  );
}
