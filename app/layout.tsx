import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import  "bootstrap/dist/css/bootstrap.min.css"
import  "./style/style.css"
import  "../public/fontawesome/all.css"
import "./globals.css";

 import AddBootstrap from "@/app/components/AddScript/AddBootstrap";
import {Providers} from "@/app/services/stores/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todo App",
  description: "Todo App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
          <script src={"bootstrap/dist/js/bootstrap.bundle.js"} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

      <AddBootstrap/>

      <Providers>
        {children}
      </Providers>

      </body>
    </html>
  );
}
