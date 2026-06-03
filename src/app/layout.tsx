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
        {/* Desktop: sidebar layout */}
        <div className="hidden md:flex h-full">
          <Sidebar />
          <main className="ml-56 flex-1 flex flex-col min-h-screen">
            {children}
          </main>
        </div>

        {/* Mobile: full-width + bottom nav */}
        <div className="md:hidden flex flex-col min-h-screen">
          <main className="flex-1 pb-16">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
