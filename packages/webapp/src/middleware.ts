import { NextRequest, NextResponse } from "next/server";

function getAppOrigins(): string[] {
  const origins: string[] = [];
  if (process.env.NEXT_PUBLIC_APP_URL) origins.push(process.env.NEXT_PUBLIC_APP_URL);
  if (process.env.VERCEL_URL) origins.push(`https://${process.env.VERCEL_URL}`);
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    origins.push(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  return origins;
}

function isSameOrigin(req: NextRequest): boolean {
  const origins = getAppOrigins();
  if (origins.length === 0) return false;
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  return origins.some(
    (o) => origin === o || referer?.startsWith(o + "/"),
  );
}

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname !== "/api/render") return NextResponse.next();

  if (req.method === "OPTIONS") return NextResponse.next();

  const apiKey = process.env.RENDER_API_KEY;
  if (!apiKey) return NextResponse.next();
  if (isSameOrigin(req)) return NextResponse.next();

  const provided = req.headers.get("x-api-key");
  if (provided !== apiKey) {
    return NextResponse.json(
      { error: "Invalid or missing API key" },
      { status: 401 },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/render"],
};
