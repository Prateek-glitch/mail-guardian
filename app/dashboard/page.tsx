"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Mail, Shield, AlertTriangle, RefreshCw, History, Bell, LogOut, User, Sparkles, Menu } from "lucide-react"
import Link from "next/link"
import { SessionProvider } from "@/components/session-provider"
import { FloatingElements } from "@/components/floating-elements"
import { EmailDetailModal } from "@/components/email-detail-modal"
import type { ProcessedEmail } from "@/lib/gmail"

function DashboardContent() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/")
    },
  })
  const [emails, setEmails] = useState<ProcessedEmail[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState<string>("all")
  const [error, setError] = useState<string | null>(null)
  const [selectedEmail, setSelectedEmail] = useState<ProcessedEmail | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [trustFilter, setTrustFilter] = useState<string>("all") // Add this line

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  const fetchEmails = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/emails?maxResults=15")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch emails")
      }

      setEmails(data.emails || [])
    } catch (error) {
      console.error("Error fetching emails:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch emails")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailClick = (email: ProcessedEmail) => {
    setSelectedEmail(email)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedEmail(null)
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  const getThreatColor = (threatLevel: string) => {
    switch (threatLevel) {
      case "Safe":
        return "bg-green-500/20 text-green-200 border-green-500/30"
      case "Suspicious":
        return "bg-yellow-500/20 text-yellow-200 border-yellow-500/30"
      case "Ultra Threat":
        return "bg-red-500/20 text-red-200 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-200 border-gray-500/30"
    }
  }

  const getTrustScoreGlow = (trustScore: number) => {
    if (trustScore < 40) {
      return "shadow-red-500/30 shadow-lg animate-pulse"
    } else if (trustScore < 50) {
      return "shadow-yellow-500/30 shadow-lg animate-pulse"
    }
    return ""
  }

  const getTrustScoreColor = (trustScore: number) => {
    if (trustScore < 40) {
      return "text-red-400"
    } else if (trustScore < 50) {
      return "text-yellow-400"
    }
    return "text-green-400"
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Social":
        return "bg-blue-500/20 text-blue-200 border-blue-500/30"
      case "Promotions":
        return "bg-purple-500/20 text-purple-200 border-purple-500/30"
      case "Updates":
        return "bg-green-500/20 text-green-200 border-green-500/30"
      case "Suspicious":
        return "bg-red-500/20 text-red-200 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-200 border-gray-500/30"
    }
  }

  const filteredEmails = emails.filter((email) => {
    // Category filter
    let categoryMatch = true
    if (filter === "threats") {
      categoryMatch = email.threatLevel !== "Safe"
    } else if (filter !== "all") {
      categoryMatch = email.category.toLowerCase() === filter.toLowerCase()
    }

    // Trust score filter
    let trustMatch = true
    if (trustFilter === "mild-threat") {
      trustMatch = email.trustScore < 50 && email.trustScore >= 40
    } else if (trustFilter === "threat") {
      trustMatch = email.trustScore < 40
    } else if (trustFilter === "low-trust") {
      trustMatch = email.trustScore < 50
    }

    return categoryMatch && trustMatch
  })

  const threatCount = emails.filter((e) => e.threatLevel !== "Safe").length
  const avgTrustScore =
    emails.length > 0 ? Math.round(emails.reduce((sum, e) => sum + e.trustScore, 0) / emails.length) : 0

  if (status === "loading") {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/80">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      <FloatingElements />
      <div className="relative z-10 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 sm:mb-8 gap-4">
            <div className="w-full lg:w-auto">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 text-gradient">Dashboard</h1>
              <p className="text-white/70 text-sm sm:text-base lg:text-lg">
                Monitor your email security and trust scores
              </p>
              {session.user?.email && (
                <p className="text-xs sm:text-sm text-white/60 flex items-center gap-2 mt-2 bg-white/10 rounded-full px-3 py-1 backdrop-blur-sm w-fit">
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="truncate max-w-[200px] sm:max-w-none">{session.user.email}</span>
                </p>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex gap-3">
              <Link href="/history">
                <Button
                  variant="outline"
                  className="glass-card border-white/20 text-white hover:bg-white/20 bg-transparent"
                >
                  <History className="w-4 h-4 mr-2" />
                  History
                </Button>
              </Link>
              <Button
                variant="outline"
                className="glass-card border-white/20 text-white hover:bg-white/20 bg-transparent"
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="glass-card border-red-500/30 text-red-300 hover:bg-red-500/20 bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden w-full flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="glass-card border-white/20 text-white hover:bg-white/20 bg-transparent"
              >
                <Menu className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Navigation */}
            {showMobileMenu && (
              <div className="lg:hidden w-full mt-4 space-y-2">
                <Link href="/history" className="block">
                  <Button
                    variant="outline"
                    className="w-full glass-card border-white/20 text-white hover:bg-white/20 bg-transparent justify-start"
                  >
                    <History className="w-4 h-4 mr-2" />
                    History
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full glass-card border-white/20 text-white hover:bg-white/20 bg-transparent justify-start"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="w-full glass-card border-red-500/30 text-red-300 hover:bg-red-500/20 bg-transparent justify-start"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 perspective-container">
            <Card className="glass-card border-white/20 card-3d">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/80">Total Emails</CardTitle>
                <Mail className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-white">{emails.length}</div>
                <p className="text-xs text-white/60">Analyzed this session</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20 card-3d">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/80">Threats Detected</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-red-400">{threatCount}</div>
                <p className="text-xs text-white/60">Suspicious or dangerous</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20 card-3d sm:col-span-2 lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/80">Avg Trust Score</CardTitle>
                <Shield className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-green-400">{avgTrustScore}%</div>
                <Progress value={avgTrustScore} className="mt-2 bg-white/20" />
              </CardContent>
            </Card>
          </div>

          {/* Error Display */}
          {error && (
            <Card className="content-card border-red-500/30 mb-6 sm:mb-8">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-200">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">Error:</span>
                  <span className="break-words">{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fetch Emails Section */}
          <Card className="glass-card border-white/20 mb-6 sm:mb-8 card-3d">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-lg sm:text-xl">
                <Mail className="w-5 h-5" />
                Email Analysis
              </CardTitle>
              <CardDescription className="text-white/70 text-sm sm:text-base">
                Fetch and analyze your latest Gmail messages for security threats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={fetchEmails}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 neon-glow border-0"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Analyzing Emails...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Fetch My Emails
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}
                </Button>

                {/* Trust Score Filter Dropdown */}
                <div className="relative">
                  <select
                    value={trustFilter}
                    onChange={(e) => setTrustFilter(e.target.value)}
                    className="appearance-none bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl px-4 py-3 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 hover:bg-white/15 transition-all duration-200"
                  >
                    <option value="all" className="bg-gray-800 text-white">
                      All Trust Levels
                    </option>
                    <option value="low-trust" className="bg-gray-800 text-yellow-300">
                      Low Trust (&lt;50%)
                    </option>
                    <option value="mild-threat" className="bg-gray-800 text-yellow-300">
                      Mild Threat (40-49%)
                    </option>
                    <option value="threat" className="bg-gray-800 text-red-300">
                      High Threat (&lt;40%)
                    </option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Results */}
          {emails.length > 0 && (
            <Card className="content-card border-white/20">
              <CardHeader>
                <div className="flex flex-col gap-4">
                  <div>
                    <CardTitle className="text-white text-lg sm:text-xl">Email Analysis Results</CardTitle>
                    <CardDescription className="text-white/70 text-sm sm:text-base">
                      Latest emails with trust scores and threat analysis • Click on any email for details
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={filter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("all")}
                      className={filter === "all" ? "bg-blue-500 text-white" : "glass-card border-white/20 text-white"}
                    >
                      All
                    </Button>
                    <Button
                      variant={filter === "threats" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("threats")}
                      className={
                        filter === "threats" ? "bg-red-500 text-white" : "glass-card border-white/20 text-white"
                      }
                    >
                      Threats
                    </Button>
                    <Button
                      variant={filter === "social" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("social")}
                      className={
                        filter === "social" ? "bg-blue-500 text-white" : "glass-card border-white/20 text-white"
                      }
                    >
                      Social
                    </Button>

                    {/* Trust Filter Indicator */}
                    {trustFilter !== "all" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTrustFilter("all")}
                        className="glass-card border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/20 bg-transparent"
                      >
                        {trustFilter === "low-trust" && "Low Trust (<50%)"}
                        {trustFilter === "mild-threat" && "Mild Threat (40-49%)"}
                        {trustFilter === "threat" && "High Threat (<40%)"}
                        <span className="ml-2">×</span>
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredEmails.map((email) => (
                    <div
                      key={email.id}
                      className="content-card border-white/20 p-3 sm:p-4 rounded-xl cursor-pointer hover:bg-white/15 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                      onClick={() => handleEmailClick(email)}
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white text-sm sm:text-base lg:text-lg mb-1 break-words">
                              {email.subject}
                            </h3>
                            <p className="text-xs sm:text-sm text-white/80 mb-1 break-words">From: {email.sender}</p>
                            <p className="text-xs text-white/70 break-words line-clamp-2">{email.snippet}</p>
                          </div>
                          <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className={getThreatColor(email.threatLevel)}>{email.threatLevel}</Badge>
                              <Badge className={getCategoryColor(email.category)}>{email.category}</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm font-medium text-white/90">Trust Score:</span>
                              <div className="flex items-center gap-1">
                                <Progress value={email.trustScore} className="w-12 sm:w-16 bg-white/20" />
                                <span
                                  className={`text-xs sm:text-sm font-bold ${getTrustScoreColor(email.trustScore)} ${getTrustScoreGlow(email.trustScore)}`}
                                >
                                  {email.trustScore}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Analysis Flags */}
                        <div className="flex flex-wrap gap-1">
                          {email.flags.slice(0, 3).map((flag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className={`text-xs ${
                                flag.includes("Suspicious") || flag.includes("Phishing") || flag.includes("Scam")
                                  ? "border-red-500/30 text-red-200 bg-red-500/10"
                                  : flag.includes("Verified") || flag.includes("Legitimate")
                                    ? "border-green-500/30 text-green-200 bg-green-500/10"
                                    : "border-white/20 text-white/80 bg-white/10"
                              }`}
                            >
                              {flag}
                            </Badge>
                          ))}
                          {email.flags.length > 3 && (
                            <Badge variant="outline" className="text-xs border-white/20 text-white/60 bg-white/5">
                              +{email.flags.length - 3} more
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-white/70 gap-2">
                          <span>{email.timestamp}</span>
                          <div className="flex items-center gap-2">
                            {email.threatLevel === "Ultra Threat" && (
                              <div className="flex items-center gap-1 text-red-300">
                                <AlertTriangle className="w-3 h-3" />
                                <span className="font-medium">High Risk</span>
                              </div>
                            )}
                            <span className="text-white/50">Click for details →</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Email Detail Modal */}
      <EmailDetailModal email={selectedEmail} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  )
}

export default function Dashboard() {
  return (
    <SessionProvider>
      <DashboardContent />
    </SessionProvider>
  )
}
