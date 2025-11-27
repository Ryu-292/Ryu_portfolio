import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Mono } from "next/font/google";

import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import GlobalLoader from "@/components/GlobalLoader";

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "My Portfolio",
  description: "Ryu Osada",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={plexMono.className}>
      <body>
        <GlobalLoader />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
