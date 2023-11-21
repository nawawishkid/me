import "./globals.css";
import AnimatePresenceWrapper from "../components/animate-presence-wrapper";
import Animatable from "../components/animatable";
import Header from "@/components/header";
import { Metadata } from "next";
import Script from "next/script";

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
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_MEASUREMENT_ID}`}
        />
        <Script id="google-analytics">
          {`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${process.env.GA_MEASUREMENT_ID}');
  `}
        </Script>

        <Header />
        <AnimatePresenceWrapper>
          <Animatable>{children}</Animatable>
        </AnimatePresenceWrapper>
      </body>
    </html>
  );
}
