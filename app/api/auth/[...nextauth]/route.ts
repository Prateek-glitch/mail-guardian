import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Validate environment variables
if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("Missing GOOGLE_CLIENT_ID environment variable")
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing GOOGLE_CLIENT_SECRET environment variable")
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("Missing NEXTAUTH_SECRET environment variable")
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
