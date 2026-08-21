import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { isLocale } from "@/i18n/config";
import { updateAdminSession } from "@/lib/supabase/proxy";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return updateAdminSession(request);
  }

  const segments = pathname.split("/");
  const urlLocale = segments[1];

  if (urlLocale && isLocale(urlLocale)) {
    const savedLocale = request.cookies.get("ts_locale")?.value;
    if (savedLocale && isLocale(savedLocale) && savedLocale !== urlLocale) {
      segments[1] = savedLocale;
      const targetPath = segments.join("/");
      const redirectUrl = new URL(targetPath, request.url);
      redirectUrl.search = request.nextUrl.search;
      return NextResponse.redirect(redirectUrl);
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-tehnosklad-pathname", pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)",
  ],
};
