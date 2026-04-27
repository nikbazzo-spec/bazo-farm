import "./globals.css";
import type { Metadata, Viewport } from "next";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Bazo Farm",
  description: "Inteligência agrícola para o Sul do Brasil",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Bazo Farm",
  },
  icons: {
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#1B4332",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen pb-20">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
