import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "./provider";
import Header from "@/components/Header";
import Script from "next/script";
import Footer from "@/components/Footer";
import { headers } from "next/headers";

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
  const headersList = headers();
  const pathname = headersList.get("x-invoke-path") || "";
  const hideHeaderFooter = pathname.includes("/message");

  return (
    <html lang="en">
      <body className={`${inter.className} flex min-h-screen flex-col bg-background`}>
        <QueryProvider>
          {!hideHeaderFooter && <Header />}
          <main className="mx-auto w-full max-w-[375px] flex-grow">{children}</main>
        </QueryProvider>
        <Script
          strategy="beforeInteractive"
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.KAKAO_MAPS_API}&autoload=false`}
        />
        {!hideHeaderFooter && <Footer />}
      </body>
    </html>
  );
}
