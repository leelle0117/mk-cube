import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CubeMaster - 루빅스큐브 마스터",
  description: "루빅스큐브 알고리즘과 공식을 레벨별로 배우고, 스피드큐빙을 마스터하세요!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation />
        <main className="pt-16 min-h-screen">
          {children}
        </main>
        <footer className="text-center text-gray-600 text-sm pb-8 border-t border-card-border pt-8">
          <p>CubeMaster - 루빅스큐브 마스터 가이드</p>
          <p className="mt-1">기획 · 제작, Made by <strong>이미경 (리앤컴퍼니)</strong></p>
          <p className="mt-1">알고리즘 출처: CFOP Method (Jessica Fridrich)</p>
        </footer>
      </body>
    </html>
  );
}
