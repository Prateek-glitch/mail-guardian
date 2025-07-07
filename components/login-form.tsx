"use client"

import { useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Shield, Zap, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push("/dashboard")
    }
  }, [session, router])

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: true,
      })
    } catch (error) {
      console.error("Login error:", error)
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="w-full max-w-xs sm:max-w-md mx-auto perspective-container">
        <Card className="glass-card border-0 shadow-2xl">
          <CardContent className="flex items-center justify-center p-6 sm:p-8">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-xs sm:max-w-md mx-auto perspective-container">
      <Card className="glass-card border-0 shadow-2xl card-3d">
        <CardHeader className="text-center relative p-4 sm:p-6">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 neon-glow floating-element">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
            Welcome to MailGuardian
          </CardTitle>
          <CardDescription className="text-white/70 text-sm sm:text-base lg:text-lg">
            Secure your inbox with intelligent email analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 sm:space-y-8 p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 text-sm text-white/80">
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" />
              </div>
              <span className="font-medium text-xs sm:text-sm">Analyze Gmail emails for threats</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-300" />
              </div>
              <span className="font-medium text-xs sm:text-sm">Trust scoring and categorization</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" />
              </div>
              <span className="font-medium text-xs sm:text-sm">Real-time threat notifications</span>
            </div>
          </div>

          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 sm:py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-0 text-sm sm:text-base lg:text-lg neon-glow"
          >
            {isLoading ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Connecting to Google...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Sign in with Google</span>
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            )}
          </Button>

          <p className="text-xs text-white/60 text-center bg-white/5 rounded-full px-3 sm:px-4 py-2 backdrop-blur-sm">
            We only request read-only access to analyze your emails. Your data is never stored permanently.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
