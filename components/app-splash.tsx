"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { SplashScreen } from "./splash-screen"

interface AppSplashProps {
  children: React.ReactNode
  showSplash?: boolean
}

export function AppSplash({ children, showSplash = true }: AppSplashProps) {
  const [isLoading, setIsLoading] = useState(showSplash)
  const [isPWA, setIsPWA] = useState(false)

  useEffect(() => {
    // Detect if running as PWA on mobile
    const isPWAMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes("android-app://")

    setIsPWA(isPWAMode)

    // For PWA, always show our splash but make it shorter since native splash already showed
    // For web, check session storage
    if (!isPWAMode) {
      const hasShownSplash = sessionStorage.getItem("mailguardian-splash-shown")
      if (hasShownSplash && showSplash) {
        setIsLoading(false)
      }
    }
  }, [showSplash])

  const handleSplashComplete = () => {
    setIsLoading(false)
    // Only set session storage for web version, not PWA
    if (!isPWA) {
      sessionStorage.setItem("mailguardian-splash-shown", "true")
    }
  }

  if (isLoading) {
    // Shorter duration for PWA since native splash already showed
    return <SplashScreen onComplete={handleSplashComplete} duration={isPWA ? 1500 : 2500} />
  }

  return <>{children}</>
}
