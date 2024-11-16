import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/toaster"
import "./globals.css";
import ClientWrapper from "@/components/ClientWrapper";


export { Metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ClientWrapper>
          {children}
        </ClientWrapper>
        <Toaster />
      </body>
    </html>
  );
}
