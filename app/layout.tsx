import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MailGuardian - Intelligent Email Security",
  description: "Gmail-integrated email trust analyzer and threat detector",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MailGuardian",
    startupImage: "/icons/icon-512x512.png",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "MailGuardian",
    title: "MailGuardian - Intelligent Email Security",
    description: "Gmail-integrated email trust analyzer and threat detector",
  },
  twitter: {
    card: "summary",
    title: "MailGuardian - Intelligent Email Security",
    description: "Gmail-integrated email trust analyzer and threat detector",
  },
}

export const viewport: Viewport = {
  themeColor: "#667eea",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icons/icon-72x72.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="msapplication-TileColor" content="#667eea" />
      </head>
      <body className={`${inter.className} crisp-text`}>{children}</body>
    </html>
  )
}
