import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: '두투 A/B 테스트',
  description: '그룹화 테스트 진행',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="w-[390px] h-[680px] bg-white overflow-auto">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
