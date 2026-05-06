import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SOA FM Interactive Book | Accumulation Function",
  description: "First prototype for an interactive financial mathematics book focused on SOA Exam FM.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
