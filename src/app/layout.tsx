import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";

export const metadata: Metadata = {
  title: "HomeOrbit",
  description: "Your Society Management App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-background-custom min-h-screen">
        <AuthProvider>
          <main className="max-w-md mx-auto min-h-screen bg-surface shadow-xl relative overflow-hidden">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
