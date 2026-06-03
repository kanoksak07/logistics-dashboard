import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Logistics Dashboard",
  description: "ระบบติดตามธุรกิจรับส่งสินค้า",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${inter.variable} h-full`}>
      <body className="h-full bg-[#F4F6F5] antialiased">

        {/* Sidebar — desktop only */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main content area */}
        <div className="md:ml-56 min-h-screen pb-16 md:pb-0">
          {children}
        </div>

        {/* Bottom nav — mobile only, always rendered */}
        <BottomNav />

      </body>
    </html>
  );
}
