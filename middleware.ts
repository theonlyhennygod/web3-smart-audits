import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/analyze/payment", "/analyze/results", "/admin"]

// Routes that are only accessible to admins
const adminRoutes = ["/admin"]

export async function middleware(request: NextRequest) {
  const sessionId = request.cookies.get("session_id")?.value
  const path = request.nextUrl.pathname

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route))

  /* --- Temporarily Disabled Route Protection ---
  if (isProtectedRoute) {
    // If no session, redirect to login
    if (!sessionId) {
      return NextResponse.redirect(new URL("/?auth=required", request.url))
    }

    // For admin routes, check if user is admin
    if (isAdminRoute) {
      // Fetch user from API
      const response = await fetch(new URL("/api/auth/session", request.url))
      const data = await response.json()

      if (!data.user || data.user.role !== "admin") {
        return NextResponse.redirect(new URL("/?auth=admin", request.url))
      }
    }
  }
  */

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/analyze/payment/:path*", "/analyze/results/:path*", "/admin/:path*"],
}
