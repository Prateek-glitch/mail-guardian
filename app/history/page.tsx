"use client"

import { useState } from "react"
import { useSession, SessionProvider } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Filter, Download, Calendar, Mail, Shield, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface HistoryEmail {
  id: string
  subject: string
  sender: string
  trustScore: number
  category: "Social" | "Promotions" | "Updates" | "Suspicious"
  threatLevel: "Safe" | "Suspicious" | "Ultra Threat"
  timestamp: string
  analysisDate: string
  snippet: string
  flags: string[]
}

function HistoryContent() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/")
    },
  })
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "trust" | "threat">("date")
  const [filterCategory, setFilterCategory] = useState<string>("all")

  const historyEmails: HistoryEmail[] = [
    {
      id: "1",
      subject: "Your Netflix subscription is expiring",
      sender: "netflix@suspicious-domain.com",
      trustScore: 25,
      category: "Suspicious",
      threatLevel: "Ultra Threat",
      timestamp: "2024-01-07 10:30",
      analysisDate: "2024-01-07",
      snippet: "Click here immediately to avoid suspension...",
      flags: ["Suspicious Domain", "Urgent Language", "Missing Unsubscribe"],
    },
    {
      id: "2",
      subject: "Weekly GitHub Activity Summary",
      sender: "noreply@github.com",
      trustScore: 95,
      category: "Updates",
      threatLevel: "Safe",
      timestamp: "2024-01-07 09:15",
      analysisDate: "2024-01-07",
      snippet: "Here's your weekly summary of activity on GitHub...",
      flags: ["Verified Sender", "Legitimate Domain"],
    },
    {
      id: "3",
      subject: "New connection request on LinkedIn",
      sender: "invitations@linkedin.com",
      trustScore: 88,
      category: "Social",
      threatLevel: "Safe",
      timestamp: "2024-01-07 08:45",
      analysisDate: "2024-01-07",
      snippet: "John Doe wants to connect with you on LinkedIn...",
      flags: ["Verified Sender", "Social Platform"],
    },
    {
      id: "4",
      subject: "URGENT: Bank Account Verification Required",
      sender: "security@fake-bank.net",
      trustScore: 15,
      category: "Suspicious",
      threatLevel: "Ultra Threat",
      timestamp: "2024-01-06 14:20",
      analysisDate: "2024-01-06",
      snippet: "Your account will be suspended unless you verify immediately...",
      flags: ["Phishing Attempt", "Fake Domain", "Urgent Language", "No Unsubscribe"],
    },
    {
      id: "5",
      subject: "50% OFF Everything - Limited Time!",
      sender: "deals@amazon.com",
      trustScore: 72,
      category: "Promotions",
      threatLevel: "Safe",
      timestamp: "2024-01-06 12:30",
      analysisDate: "2024-01-06",
      snippet: "Don't miss out on our biggest sale of the year...",
      flags: ["Legitimate Sender", "Promotional Content"],
    },
    {
      id: "6",
      subject: "You've won $1,000,000!",
      sender: "winner@lottery-scam.com",
      trustScore: 5,
      category: "Suspicious",
      threatLevel: "Ultra Threat",
      timestamp: "2024-01-05 16:45",
      analysisDate: "2024-01-05",
      snippet: "Congratulations! Click here to claim your prize...",
      flags: ["Scam Content", "Suspicious Domain", "Too Good to be True"],
    },
  ]

  const getThreatColor = (threatLevel: string) => {
    switch (threatLevel) {
      case "Safe":
        return "bg-green-100 text-green-800"
      case "Suspicious":
        return "bg-yellow-100 text-yellow-800"
      case "Ultra Threat":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Social":
        return "bg-blue-100 text-blue-800"
      case "Promotions":
        return "bg-purple-100 text-purple-800"
      case "Updates":
        return "bg-green-100 text-green-800"
      case "Suspicious":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredAndSortedEmails = historyEmails
    .filter((email) => {
      const matchesSearch =
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.sender.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory =
        filterCategory === "all" ||
        email.category.toLowerCase() === filterCategory.toLowerCase() ||
        (filterCategory === "threats" && email.threatLevel !== "Safe")
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "trust":
          return b.trustScore - a.trustScore
        case "threat":
          const threatOrder = { "Ultra Threat": 3, Suspicious: 2, Safe: 1 }
          return threatOrder[b.threatLevel] - threatOrder[a.threatLevel]
        default:
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      }
    })

  const stats = {
    total: historyEmails.length,
    threats: historyEmails.filter((e) => e.threatLevel !== "Safe").length,
    avgTrust: Math.round(historyEmails.reduce((sum, e) => sum + e.trustScore, 0) / historyEmails.length),
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading history...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Email History</h1>
              <p className="text-gray-600">Review your email analysis history and security reports</p>
            </div>
          </div>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="backdrop-blur-lg bg-white/70 border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Analyzed</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Emails processed</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-lg bg-white/70 border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Threats Found</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.threats}</div>
              <p className="text-xs text-muted-foreground">Security issues detected</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-lg bg-white/70 border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Trust Score</CardTitle>
              <Shield className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.avgTrust}%</div>
              <p className="text-xs text-muted-foreground">Overall security rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="backdrop-blur-lg bg-white/70 border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search emails by subject or sender..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-white"
                >
                  <option value="all">All Categories</option>
                  <option value="threats">Threats Only</option>
                  <option value="social">Social</option>
                  <option value="promotions">Promotions</option>
                  <option value="updates">Updates</option>
                  <option value="suspicious">Suspicious</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "date" | "trust" | "threat")}
                  className="px-3 py-2 border rounded-md bg-white"
                >
                  <option value="date">Sort by Date</option>
                  <option value="trust">Sort by Trust Score</option>
                  <option value="threat">Sort by Threat Level</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email History List */}
        <Card className="backdrop-blur-lg bg-white/70 border-white/20">
          <CardHeader>
            <CardTitle>Analysis History</CardTitle>
            <CardDescription>Detailed history of all analyzed emails with security assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAndSortedEmails.map((email) => (
                <div key={email.id} className="border rounded-lg p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{email.subject}</h3>
                      <p className="text-sm text-gray-600 mb-1">From: {email.sender}</p>
                      <p className="text-xs text-gray-500">{email.snippet}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getThreatColor(email.threatLevel)}>{email.threatLevel}</Badge>
                        <Badge className={getCategoryColor(email.category)}>{email.category}</Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">Trust Score: {email.trustScore}%</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {email.analysisDate}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Analysis Flags */}
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-700 mb-1">Analysis Flags:</p>
                    <div className="flex flex-wrap gap-1">
                      {email.flags.map((flag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className={`text-xs ${
                            flag.includes("Suspicious") || flag.includes("Phishing") || flag.includes("Scam")
                              ? "border-red-200 text-red-700"
                              : flag.includes("Verified") || flag.includes("Legitimate")
                                ? "border-green-200 text-green-700"
                                : "border-gray-200 text-gray-700"
                          }`}
                        >
                          {flag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Received: {email.timestamp}</span>
                    {email.threatLevel === "Ultra Threat" && (
                      <div className="flex items-center gap-1 text-red-600 font-medium">
                        <AlertTriangle className="w-3 h-3" />
                        <span>HIGH RISK EMAIL</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredAndSortedEmails.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No emails found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function History() {
  return (
    <SessionProvider>
      <HistoryContent />
    </SessionProvider>
  )
}
