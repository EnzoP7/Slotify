import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Parsear el JWT sin verificar la firma (solo parte del payload)
    const base64Payload = token.split(".")[1];
    const payload = JSON.parse(atob(base64Payload));

    if (payload.role !== "business") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("❌ Token mal formado:", err);
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/business/:path*", "/admin/:path*"],
};
