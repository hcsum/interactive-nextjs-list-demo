import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "./lib/session";

export default async function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (url.pathname === "/create-temp-user") {
    if (session?.userId) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
    return NextResponse.next();
  }

  if (url.pathname === "/logout") {
    (await cookies()).delete("session");
    return NextResponse.redirect(new URL("/create-temp-user", req.nextUrl));
  }

  if (!session?.userId) {
    return NextResponse.redirect(new URL("/create-temp-user", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
