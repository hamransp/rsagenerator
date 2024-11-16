"use client";
import { useEffect } from "react";
import localFont from "next/font/local";
import { metadata } from "../app/metadata";
const geistSans = localFont({
  src: "../app/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../app/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Prevent platform detection issues
      Object.defineProperty(window, 'platform', {
        get() { return 'Win32' },
        configurable: true
      });
    }

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c")) ||
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "U" || e.key === "u"))
      ) {
        e.preventDefault();
      }
    };

    const handlePrint = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === "p" || e.key === "P")) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", handlePrint);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", handlePrint);
    };
  }, []);

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
      {children}
    </div>
  );
}