import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Interactive Next.js 15 list example",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-[90vh] bg-gray-50 dark:bg-gray-900 relative">
          <Providers>
            <Header />
            {children}
          </Providers>
        </div>
        <footer className="bg-gray-800 py-6 text-white text-center">
          <div className="max-w-6xl mx-auto">
            <p className="text-sm">Interactive Next.js 15 List Example</p>
          </div>
        </footer>
      </body>
      <GoogleAnalytics gaId="G-LT4QGDFCR2" />
    </html>
  );
}
