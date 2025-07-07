import { type NextRequest, NextResponse } from "next/server"

// Mark as dynamic to prevent static generation
export const dynamic = "force-dynamic"

// This would handle Google OAuth2 flow in a real implementation
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")

  if (code) {
    // In a real implementation, exchange code for access token
    // Store user session and redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Redirect to Google OAuth2 authorization URL
  const googleAuthUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&` +
    `response_type=code&` +
    `scope=https://www.googleapis.com/auth/gmail.readonly&` +
    `access_type=offline`

  return NextResponse.redirect(googleAuthUrl)
}
