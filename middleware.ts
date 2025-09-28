import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // All routes are now free to access - no authentication checks
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/accounts", "/register", "/dashboard/:path*"],
};
