import type { Metadata } from "next";
import "./globals.css";
import "./appearance.css";
import { ThemeSync } from "@/components/ThemeSync";
import { FormSubmitFeedback } from "@/components/FormSubmitFeedback";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DubboEwaste Operations",
  description: "Private operations system for DubboEwaste",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{__html: "(function(){try{var stored=window.localStorage.getItem('assetflow-appearance');var mode=(stored==='dark'||stored==='light'||stored==='system')?stored:'light';var dark=mode==='dark'||(mode==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=dark?'dark':'light';document.documentElement.style.colorScheme=dark?'dark':'light';}catch(_){document.documentElement.dataset.theme='light';}})();" }} /></head>
      <body><ThemeSync /><AnalyticsTracker /><FormSubmitFeedback />{children}<footer style={{padding:"20px",textAlign:"center",fontSize:"12px",opacity:0.75}}><Link href="/privacy-analytics">Analytics and privacy</Link></footer></body>
    </html>
  );
}
