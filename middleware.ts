import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const isLoginPage = request.nextUrl.pathname === "/login";

  // Redirection à la page de login si le token n'existe pas et nous ne sommes pas déjà sur la page login
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si nous avons un token et sommes sur la page login, rediriger vers la page d'accueil
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Spécifier les chemins qui déclenchent le middleware
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|pictures).*)"],
};
