import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Logistics Dashboard",
  description: "ระบบติดตามธุรกิจรับส่งสินค้า",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${inter.variable} h-full`}>
      <body className="h-full bg-[#F8FAFC] antialiased">
        <div className="flex h-full">
          <Sidebar />
          <main className="ml-56 flex-1 flex flex-col min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
