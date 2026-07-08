import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reel Crafterr | Cinematic Videography & Reels",
  description: "Portfolio of Reel Crafterr (@reel_crafterr). Capturing vibes and moments that click. Specializing in luxury weddings, automotive rolling shots, events, and cinematic short-form editing.",
  keywords: ["Reel Crafterr", "Videographer", "Jaipur", "Wedding Cinematography", "Car shoot", "Reel Shooter", "iPhone Videography"],
  openGraph: {
    title: "Reel Crafterr | Cinematic Videography & Reels",
    description: "Portfolio of Reel Crafterr (@reel_crafterr). Shoot on iPhone 17 Pro Max. Book wedding, automotive, and decor shoots.",
    url: "https://instagram.com/reel_crafterr",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${plusJakartaSans.variable} h-full antialiased`}
      style={{ scrollBehavior: 'smooth' }}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
