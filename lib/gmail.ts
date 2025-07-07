export interface GmailMessage {
  id: string
  threadId: string
  snippet: string
  payload: {
    headers: Array<{
      name: string
      value: string
    }>
    body?: {
      data?: string
    }
    parts?: Array<{
      body?: {
        data?: string
      }
    }>
  }
  internalDate: string
}

export interface ProcessedEmail {
  id: string
  subject: string
  sender: string
  trustScore: number
  category: "Social" | "Promotions" | "Updates" | "Suspicious"
  threatLevel: "Safe" | "Suspicious" | "Ultra Threat"
  timestamp: string
  snippet: string
  flags: string[]
}

export async function fetchGmailMessages(
  accessToken: string,
  maxResults = 10,
): Promise<{ messages: Array<{ id: string }> }> {
  const response = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}&q=in:inbox`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Gmail API error: ${response.status} - ${error}`)
  }

  return response.json()
}

export async function getGmailMessage(accessToken: string, messageId: string): Promise<GmailMessage> {
  const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Gmail API error: ${response.status} - ${error}`)
  }

  return response.json()
}

export function analyzeEmail(message: GmailMessage): ProcessedEmail {
  // Extract email details
  const headers = message.payload.headers
  const subject = headers.find((h) => h.name === "Subject")?.value || "No Subject"
  const from = headers.find((h) => h.name === "From")?.value || "Unknown Sender"
  const date = headers.find((h) => h.name === "Date")?.value || message.internalDate

  // Extract sender email
  const senderMatch = from.match(/<(.+)>/) || from.match(/(\S+@\S+)/)
  const senderEmail = senderMatch ? senderMatch[1] : from
  const senderDomain = senderEmail.split("@")[1] || ""

  // Analysis flags
  const flags: string[] = []

  // Trust scoring factors
  let trustScore = 50 // Base score

  // Domain analysis
  const trustedDomains = [
    "gmail.com",
    "github.com",
    "linkedin.com",
    "amazon.com",
    "netflix.com",
    "google.com",
    "microsoft.com",
    "apple.com",
    "facebook.com",
    "twitter.com",
    "instagram.com",
    "youtube.com",
    "paypal.com",
    "stripe.com",
  ]

  const suspiciousDomains = [
    "suspicious-domain.com",
    "fake-bank.net",
    "lottery-scam.com",
    "phishing-site.org",
    "malware-host.biz",
  ]

  if (trustedDomains.includes(senderDomain)) {
    trustScore += 30
    flags.push("Verified Sender")
  } else if (suspiciousDomains.includes(senderDomain) || senderDomain.includes("suspicious")) {
    trustScore -= 40
    flags.push("Suspicious Domain")
  }

  // Content analysis
  const suspiciousKeywords = [
    "urgent",
    "click here",
    "verify now",
    "suspended",
    "winner",
    "congratulations",
    "limited time",
    "act now",
    "claim",
    "prize",
    "lottery",
    "inheritance",
    "nigerian prince",
    "bank account",
    "social security",
    "tax refund",
  ]

  const phishingKeywords = [
    "verify account",
    "confirm identity",
    "update payment",
    "suspended account",
    "click immediately",
    "avoid suspension",
    "security alert",
    "unusual activity",
  ]

  const content = `${subject} ${message.snippet}`.toLowerCase()

  let suspiciousCount = 0
  let phishingCount = 0

  suspiciousKeywords.forEach((keyword) => {
    if (content.includes(keyword)) {
      suspiciousCount++
      trustScore -= 8
    }
  })

  phishingKeywords.forEach((keyword) => {
    if (content.includes(keyword)) {
      phishingCount++
      trustScore -= 15
      flags.push("Phishing Attempt")
    }
  })

  if (suspiciousCount > 0) {
    flags.push("Suspicious Content")
  }

  // Urgency analysis
  const urgentWords = ["urgent", "immediate", "asap", "now", "quickly", "hurry"]
  const hasUrgentLanguage = urgentWords.some((word) => content.includes(word))

  if (hasUrgentLanguage) {
    trustScore -= 10
    flags.push("Urgent Language")
  }

  // Sender reputation
  if (senderEmail.includes("noreply") || senderEmail.includes("no-reply")) {
    trustScore += 5
    flags.push("Automated Sender")
  }

  // Check for missing unsubscribe (simplified check)
  if (!content.includes("unsubscribe") && (content.includes("offer") || content.includes("deal"))) {
    trustScore -= 15
    flags.push("Missing Unsubscribe")
  }

  // Ensure trust score is within bounds
  trustScore = Math.max(0, Math.min(100, trustScore))

  // Determine category
  let category: ProcessedEmail["category"] = "Updates"

  if (["linkedin.com", "twitter.com", "facebook.com", "instagram.com", "youtube.com"].includes(senderDomain)) {
    category = "Social"
    flags.push("Social Platform")
  } else if (
    content.includes("offer") ||
    content.includes("sale") ||
    content.includes("deal") ||
    content.includes("discount")
  ) {
    category = "Promotions"
    flags.push("Promotional Content")
  } else if (trustScore < 40) {
    category = "Suspicious"
  } else if (senderDomain.includes("github") || senderDomain.includes("google") || content.includes("notification")) {
    category = "Updates"
    flags.push("Service Update")
  }

  // Determine threat level
  let threatLevel: ProcessedEmail["threatLevel"] = "Safe"

  if (trustScore < 20 || phishingCount > 1) {
    threatLevel = "Ultra Threat"
  } else if (trustScore < 40 || suspiciousCount > 2) {
    threatLevel = "Suspicious"
  }

  // Add legitimate flags for safe emails
  if (trustScore > 70) {
    flags.push("Legitimate Domain")
  }

  return {
    id: message.id,
    subject,
    sender: from,
    trustScore,
    category,
    threatLevel,
    timestamp: new Date(Number.parseInt(message.internalDate)).toLocaleString(),
    snippet: message.snippet,
    flags: flags.length > 0 ? flags : ["Standard Email"],
  }
}
