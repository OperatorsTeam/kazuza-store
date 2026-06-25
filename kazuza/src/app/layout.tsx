import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KAZUZA | Premium Egyptian Streetwear",
  description: "KAZUZA - Premium Egyptian streetwear brand from Cairo. Shop the latest drops.",
  keywords: ["streetwear", "egyptian", "cairo", "fashion", "kazuza"],
  openGraph: {
    title: "KAZUZA | Premium Egyptian Streetwear",
    description: "Premium Egyptian streetwear brand from Cairo",
    type: "website",
    locale: "ar_EG",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
