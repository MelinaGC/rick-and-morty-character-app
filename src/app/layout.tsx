import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rick and Morty Episode Explorer",
  description:
    "Compare two Rick and Morty characters and discover their exclusive and shared episodes across the multiverse.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
