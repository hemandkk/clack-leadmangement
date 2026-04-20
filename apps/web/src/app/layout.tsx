import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LeadPro",
  description: "Lead Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={` h-full antialiased`}>
      <body className="min-h-full flex flex-col gap-2">
        <Providers>
          {/*  <Header /> */}
          <main className="min-h-screen mt-10">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
