import type { Metadata } from "next";
import "./globals.css";
import { FormSubmitFeedback } from "@/components/FormSubmitFeedback";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DubboEwaste Operations",
  description: "Private operations system for DubboEwaste",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><AnalyticsTracker /><FormSubmitFeedback />{children}<footer style={{padding:"20px",textAlign:"center",fontSize:"12px",opacity:0.75}}><Link href="/privacy-analytics">Analytics and privacy</Link></footer></body>
    </html>
  );
}
