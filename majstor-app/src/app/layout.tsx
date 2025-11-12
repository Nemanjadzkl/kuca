import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MajstorApp",
  description: "Aplikacija za upravljanje poslovima kućnog majstora.",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
