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
      <body>{children}</body>
    </html>
  );
}
