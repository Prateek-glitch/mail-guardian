import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { fetchGmailMessages, getGmailMessage, analyzeEmail } from "@/lib/gmail"

// Mark this route as dynamic to prevent static generation issues
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    if (!session.accessToken) {
      return NextResponse.json({ error: "No access token available. Please sign in again." }, { status: 401 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const maxResults = Math.min(Number.parseInt(searchParams.get("maxResults") || "10"), 20) // Limit to 20

    console.log(`Fetching ${maxResults} emails for user: ${session.user?.email}`)

    // Fetch messages from Gmail API
    const messagesResponse = await fetchGmailMessages(session.accessToken, maxResults)

    if (!messagesResponse.messages || messagesResponse.messages.length === 0) {
      return NextResponse.json({
        emails: [],
        message: "No emails found in your inbox.",
        totalFetched: 0,
        timestamp: new Date().toISOString(),
      })
    }

    console.log(`Found ${messagesResponse.messages.length} messages, analyzing...`)

    // Fetch detailed message data and analyze each email
    const emailPromises = messagesResponse.messages.map(async (msg, index) => {
      try {
        console.log(`Processing email ${index + 1}/${messagesResponse.messages.length}`)
        const messageDetail = await getGmailMessage(session.accessToken!, msg.id)
        return analyzeEmail(messageDetail)
      } catch (error) {
        console.error(`Error processing email ${msg.id}:`, error)
        return null
      }
    })

    const results = await Promise.all(emailPromises)
    const analyzedEmails = results.filter((email) => email !== null)

    console.log(`Successfully analyzed ${analyzedEmails.length} emails`)

    return NextResponse.json({
      emails: analyzedEmails,
      totalFetched: analyzedEmails.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Gmail API Error:", error)

    if (error instanceof Error) {
      if (error.message.includes("401")) {
        return NextResponse.json(
          {
            error: "Gmail access token expired. Please sign out and sign in again.",
          },
          { status: 401 },
        )
      }
      if (error.message.includes("403")) {
        return NextResponse.json(
          {
            error: "Gmail API access denied. Make sure you granted permission to read your emails.",
          },
          { status: 403 },
        )
      }
      if (error.message.includes("429")) {
        return NextResponse.json(
          {
            error: "Gmail API rate limit exceeded. Please try again in a few minutes.",
          },
          { status: 429 },
        )
      }
    }

    return NextResponse.json(
      {
        error: "Failed to fetch emails from Gmail API",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
