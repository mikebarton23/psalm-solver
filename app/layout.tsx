import type { Metadata } from "next";
import Head from "next/head";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Psalm Solver",
  description: "Daily Bible verse guessing game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <body className={inter.className}>
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
