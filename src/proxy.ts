import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Next.js 16 renomeou "middleware" para "proxy" (mesma API). Proxy roda em
// runtime Node.js por padrão, o que é necessário aqui pois o Credentials
// provider usa o Prisma Client (APIs Node.js, incompatíveis com Edge Runtime).
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname === "/login";

  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|logo-navecon.png).*)"],
};
