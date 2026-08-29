import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/TopNav";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fundamental Investment Research System",
  description: "Institutional research workstation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} antialiased bg-background text-foreground min-h-screen flex flex-col font-sans`}>
        <TopNav />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
