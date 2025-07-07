"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Mail,
  Shield,
  AlertTriangle,
  Clock,
  User,
  FileText,
  Flag,
  X,
  ExternalLink,
  Copy,
  CheckCircle,
} from "lucide-react"
import { useState } from "react"
import type { ProcessedEmail } from "@/lib/gmail"

interface EmailDetailModalProps {
  email: ProcessedEmail | null
  isOpen: boolean
  onClose: () => void
}

export function EmailDetailModal({ email, isOpen, onClose }: EmailDetailModalProps) {
  const [copied, setCopied] = useState(false)

  if (!email) return null

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

  const getThreatIcon = (threatLevel: string) => {
    switch (threatLevel) {
      case "Safe":
        return <Shield className="w-5 h-5 text-green-400" />
      case "Suspicious":
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      case "Ultra Threat":
        return <AlertTriangle className="w-5 h-5 text-red-400" />
      default:
        return <Shield className="w-5 h-5 text-gray-400" />
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const extractSenderEmail = (sender: string) => {
    const match = sender.match(/<(.+)>/) || sender.match(/(\S+@\S+)/)
    return match ? match[1] : sender
  }

  const senderEmail = extractSenderEmail(email.sender)
  const senderName = email.sender.replace(/<.*>/, "").trim() || senderEmail

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
        <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900/98 to-slate-800/98 backdrop-blur-xl border border-white/20 text-white rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="relative p-6 border-b border-white/10">
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-bold text-white pr-8">Email Details</h2>
              {/* Trust Score in top right */}
              <div className="absolute top-6 right-6 flex items-center gap-2">
                <div className="text-right">
                  <div className="text-sm text-white/70">Trust Score</div>
                  <div className="flex items-center gap-2">
                    <Progress value={email.trustScore} className="w-20 bg-white/20" />
                    <span className="text-lg font-bold text-white">{email.trustScore}%</span>
                  </div>
                </div>
                {getThreatIcon(email.threatLevel)}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Threat Level Banner */}
            {email.threatLevel !== "Safe" && (
              <div
                className={`p-4 rounded-lg border ${
                  email.threatLevel === "Ultra Threat"
                    ? "bg-red-500/20 border-red-500/30"
                    : "bg-yellow-500/20 border-yellow-500/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle
                    className={`w-5 h-5 ${email.threatLevel === "Ultra Threat" ? "text-red-400" : "text-yellow-400"}`}
                  />
                  <span className="font-semibold text-white">
                    {email.threatLevel === "Ultra Threat" ? "⚠️ HIGH RISK EMAIL" : "⚠️ SUSPICIOUS EMAIL"}
                  </span>
                </div>
                <p className="text-sm mt-1 opacity-90 text-white/80">
                  {email.threatLevel === "Ultra Threat"
                    ? "This email contains multiple threat indicators. Exercise extreme caution."
                    : "This email contains suspicious elements. Please verify before taking any action."}
                </p>
              </div>
            )}

            {/* Email Header Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-white/80">Subject</span>
                  </div>
                  <p className="text-white font-medium break-words">{email.subject}</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-white/80">Sender</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-white font-medium break-words">{senderName}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-white/70 break-all">{senderEmail}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(senderEmail)}
                        className="h-6 w-6 p-0 text-white/60 hover:text-white"
                      >
                        {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-white/80">Received</span>
                  </div>
                  <p className="text-white">{email.timestamp}</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Flag className="w-4 h-4 text-orange-400" />
                    <span className="text-sm font-medium text-white/80">Classification</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getThreatColor(email.threatLevel)}>{email.threatLevel}</Badge>
                    <Badge className={getCategoryColor(email.category)}>{email.category}</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Content */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-white/80">Email Preview</span>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-white/90 text-sm leading-relaxed break-words">
                  {email.snippet || "No preview available"}
                </p>
              </div>
            </div>

            {/* Analysis Flags */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-medium text-white/80">Security Analysis</span>
              </div>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {email.flags.map((flag, index) => (
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
                </div>

                {/* Trust Score Breakdown */}
                <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="text-sm font-medium text-white/80 mb-2">Trust Score Breakdown</h4>
                  <div className="space-y-2 text-xs text-white/70">
                    <div className="flex justify-between">
                      <span>Base Score:</span>
                      <span>50%</span>
                    </div>
                    {email.flags.includes("Verified Sender") && (
                      <div className="flex justify-between text-green-300">
                        <span>+ Verified Domain:</span>
                        <span>+30%</span>
                      </div>
                    )}
                    {email.flags.includes("Suspicious Domain") && (
                      <div className="flex justify-between text-red-300">
                        <span>- Suspicious Domain:</span>
                        <span>-40%</span>
                      </div>
                    )}
                    {email.flags.includes("Phishing Attempt") && (
                      <div className="flex justify-between text-red-300">
                        <span>- Phishing Indicators:</span>
                        <span>-15%</span>
                      </div>
                    )}
                    {email.flags.includes("Urgent Language") && (
                      <div className="flex justify-between text-yellow-300">
                        <span>- Urgent Language:</span>
                        <span>-10%</span>
                      </div>
                    )}
                    <div className="border-t border-white/20 pt-2 flex justify-between font-medium text-white">
                      <span>Final Score:</span>
                      <span>{email.trustScore}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-white/20">
              <Button
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                onClick={() => window.open(`https://gmail.com`, "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in Gmail
              </Button>

              {email.threatLevel !== "Safe" && (
                <Button
                  variant="outline"
                  className="bg-red-500/10 backdrop-blur-sm border-red-500/30 text-red-300 hover:bg-red-500/20"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Report Threat
                </Button>
              )}

              <Button
                variant="outline"
                onClick={onClose}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 ml-auto"
              >
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
