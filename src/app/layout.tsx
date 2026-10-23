import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CSSGradientBackground } from "@/components/CSSGradientBackground";
import { Agentation } from "agentation";
import MotionProvider from "@/components/MotionProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});


export const metadata: Metadata = {
  metadataBase: new URL("https://idamadam.com"),
  title: "Idam Adam — Lead Product Designer",
  description:
    "Idam Adam is a Lead Product Designer designing with machines: AI products, agent skills and tools for designing with coding agents.",
  authors: [{ name: "Idam Adam" }],
  openGraph: {
    title: "Idam Adam — Lead Product Designer",
    description:
      "Idam Adam is a Lead Product Designer designing with machines: AI products, agent skills and tools for designing with coding agents.",
    url: "https://idamadam.com",
    siteName: "Idam Adam",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Idam Adam — Lead Product Designer",
    description:
      "Idam Adam is a Lead Product Designer designing with machines: AI products, agent skills and tools for designing with coding agents.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#FAFAFA",
  viewportFit: "cover",
};

// Polyfill localStorage for SSR
if (typeof window === 'undefined') {
  global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    length: 0,
  } as Storage;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
      </head>
      <body
        className={`${inter.variable} antialiased`}
      >
        <CSSGradientBackground />
        <MotionProvider>{children}</MotionProvider>
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
