/**
 * RootLayout component: the top-level layout component for the application.
 *
 * Features:
 *  - Sets the HTML document language to English
 *  - Applies the Inter font from Google Fonts
 *  - Wraps the application with the Providers component for state management and authentication
 *  - Includes the Toaster component for displaying notifications
 *
 * Props:
 *  - children: the React nodes to be rendered within the layout
 *
 * Purpose:
 *  - Provides a basic layout structure for the application
 *  - Sets up the necessary providers and fonts for the application
 *  - Renders the Toaster component for displaying notifications
 *  - Renders the children components within the layout
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todo App",
  description: "A simple todo application built with Next.js and shadcn/ui",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Toaster position="top-right" richColors />
          {children}
        </Providers>
      </body>
    </html>
  );
}
