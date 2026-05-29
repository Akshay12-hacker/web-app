import type { Metadata } from "next";
import "./globals.css";
import { NativeProvider } from "@/providers/NativeProvider";

export const metadata: Metadata = {
  title: "HomeOrbit Hybrid",
  description: "Modern hybrid living platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white">
        <NativeProvider>
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </NativeProvider>
      </body>
    </html>
  );
}
