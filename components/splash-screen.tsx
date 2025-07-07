"use client"

import { useEffect, useState } from "react"
import { Shield, Mail, Sparkles } from "lucide-react"
import Image from "next/image"

interface SplashScreenProps {
  onComplete: () => void
  duration?: number
}

export function SplashScreen({ onComplete, duration = 2000 }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)
  const [showContent, setShowContent] = useState(false)
  const [loadingText, setLoadingText] = useState("Initializing...")

  useEffect(() => {
    // Shorter delay to account for native splash screen
    const contentTimer = setTimeout(() => {
      setShowContent(true)
    }, 100)

    // Faster progress animation since native splash already showed
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 5 // Even faster increment
      })
    }, duration / 20)

    // Update loading text based on progress
    const textInterval = setInterval(() => {
      setProgress((currentProgress) => {
        if (currentProgress < 30) {
          setLoadingText("Loading Security Engine...")
        } else if (currentProgress < 60) {
          setLoadingText("Connecting to Gmail...")
        } else if (currentProgress < 90) {
          setLoadingText("Initializing Protection...")
        } else {
          setLoadingText("Ready to Secure Your Inbox!")
        }
        return currentProgress
      })
    }, 80)

    // Complete splash screen
    const completeTimer = setTimeout(() => {
      onComplete()
    }, duration)

    return () => {
      clearTimeout(contentTimer)
      clearTimeout(completeTimer)
      clearInterval(progressInterval)
      clearInterval(textInterval)
    }
  }, [onComplete, duration])

  return (
    <div className="fixed inset-0 z-50 gradient-bg overflow-hidden">
      {/* Minimal floating elements for faster loading */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-12 h-12 bg-gradient-to-r from-blue-400/15 to-purple-400/15 rounded-full floating-element blur-sm"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        />
        <div
          className="absolute bottom-32 right-10 w-8 h-8 bg-gradient-to-r from-pink-400/15 to-red-400/15 rounded-lg floating-element blur-sm rotate-45"
          style={{ animationDelay: "0.5s", animationDuration: "4s" }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-6 h-6 bg-gradient-to-r from-green-400/15 to-blue-400/15 rounded-full floating-element blur-sm"
          style={{ animationDelay: "1s", animationDuration: "5s" }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-8">
        {/* Main Content - Faster animation to follow native splash */}
        <div
          className={`text-center transition-all duration-500 transform w-full max-w-sm ${
            showContent ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-98"
          }`}
        >
          {/* Logo Container - Matching the native splash style but enhanced */}
          <div className="relative mb-6">
            <div className="relative mx-auto w-fit">
              {/* Logo Image - Similar to native but with enhancements */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-3 relative">
                {/* Rounded background container - matching native style */}
                <div className="absolute inset-0 rounded-full bg-white/95 backdrop-blur-md border border-white/30 shadow-2xl"></div>

                {/* Logo with transparent background */}
                <div className="absolute inset-1 rounded-full overflow-hidden bg-transparent flex items-center justify-center">
                  <Image
                    src="/icons/icon-72x72.png"
                    alt="MailGuardian Logo"
                    width={72}
                    height={72}
                    className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
                    priority
                  />
                </div>

                {/* Subtle animated ring - less prominent than before */}
                <div
                  className="absolute inset-0 rounded-full border border-blue-400/20 animate-pulse"
                  style={{ animationDuration: "2s" }}
                ></div>
              </div>

              {/* Minimal floating effects */}
              <div className="absolute -top-1 -right-1">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-400/20 flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* App Name - Faster animation */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-gradient">MailGuardian</h1>
            <p className="text-xs sm:text-sm text-white/80 font-medium backdrop-blur-sm bg-white/15 rounded-full px-3 py-1 inline-block">
              Email Security
            </p>
          </div>

          {/* Loading Progress - Streamlined */}
          <div className="w-full max-w-xs mx-auto mb-4">
            <div className="glass-card border-white/30 p-3 rounded-xl">
              {/* Progress Bar */}
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-150 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  {/* Animated shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>

              {/* Loading Text */}
              <div className="text-xs text-white/80 text-center font-medium">{loadingText}</div>
            </div>
          </div>

          {/* Feature Icons - Minimal */}
          <div className="flex justify-center gap-3">
            <div className="glass-card border-white/30 p-2 rounded-lg">
              <Shield className="w-4 h-4 text-green-400" />
            </div>
            <div className="glass-card border-white/30 p-2 rounded-lg">
              <Mail className="w-4 h-4 text-blue-400" />
            </div>
            <div className="glass-card border-white/30 p-2 rounded-lg">
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Bottom text - Faster animation */}
        <div
          className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 transition-all duration-500 delay-200 ${
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
          }`}
        >
          <p className="text-white/50 text-xs text-center px-4">Secured by Design</p>
        </div>
      </div>
    </div>
  )
}
