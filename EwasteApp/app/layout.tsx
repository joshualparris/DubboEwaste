import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DubboEwaste Operations",
  description: "Private operations system for DubboEwaste",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
