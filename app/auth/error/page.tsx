"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration."
      case "AccessDenied":
        return "You denied access to your Google account."
      case "Verification":
        return "The verification token has expired or has already been used."
      default:
        return "An unexpected error occurred during authentication."
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto backdrop-blur-lg bg-white/70 border-white/20 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-900">Authentication Error</CardTitle>
            <CardDescription className="text-red-700">{getErrorMessage(error)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <p className="font-medium mb-1">Error Code:</p>
              <p className="font-mono text-xs">{error || "Unknown"}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">Try these solutions:</p>
              <ul className="text-xs text-gray-500 space-y-1 ml-4">
                <li>• Make sure you're using a test user account</li>
                <li>• Check your Google OAuth configuration</li>
                <li>• Clear your browser cache and cookies</li>
                <li>• Try signing in again</li>
              </ul>
            </div>

            <Link href="/">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
