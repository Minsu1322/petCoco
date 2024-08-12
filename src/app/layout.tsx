import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "./provider";
import Header from "@/components/Header";
import Script from "next/script";
import Footer from "@/components/Footer";
import TabBar from "@/components/TabBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "펫CoCo",
  description: "PetCoCo"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
<<<<<<< HEAD
      <body className={`${inter.className} flex min-h-screen flex-col bg-white`}>
=======
      <body className={`${inter.className} flex min-h-screen flex-col`}>
>>>>>>> dev
        <QueryProvider>
          <Header />
          <main className="mx-auto w-full flex-grow">{children}</main>
        </QueryProvider>
        <Script
          strategy="beforeInteractive"
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.KAKAO_MAPS_API}&autoload=false`}
        />
        <TabBar />
      </body>
    </html>
  );
}
