import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { AuthProvider } from "@/contexts/AuthContext";
import ClientNavigation from "@/components/ClientNavigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QR Forever - QR Codes That Never Expire",
  description: "Generate unlimited static QR codes for free. No branded links, no expiration dates, no subscription. Pay once for premium.",
};

function Footer() {
  return (
    <footer className="border-t border-gray-200 py-8 mt-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left text-gray-500 text-sm">
          <p>© 2026 QR Forever. Built for longevity.</p>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/features" className="text-gray-500 hover:text-indigo-600 transition">Features</Link>
          <Link href="/pricing" className="text-gray-500 hover:text-indigo-600 transition">Pricing</Link>
          <Link href="/about" className="text-gray-500 hover:text-indigo-600 transition">About</Link>
          <Link href="/support" className="text-gray-500 hover:text-indigo-600 transition">Support</Link>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <ClientNavigation />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
