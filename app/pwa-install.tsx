"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    setDeferredPrompt(null)
  }

  if (!showInstallPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50">
      <div className="glass-card border-white/20 p-4 rounded-xl">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-white font-semibold text-sm">Install MailGuardian</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-white/70 hover:text-white p-1 h-auto"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-white/70 text-xs mb-3">
          Install MailGuardian on your device for quick access and offline functionality.
        </p>
        <Button
          onClick={handleInstall}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Install App
        </Button>
      </div>
    </div>
  )
}
