import { type NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/server/env";

// BFF proxy. Every request to /api/* on the FE origin is forwarded to the
// internal backend at INTERNAL_API_URL: browser → Next (same-origin, cookie
// attached) → backend (server-to-server). The browser bundle never sees the
// backend URL.
//
// Headers (incl. Cookie) and Set-Cookie flow through transparently. Hop-by-hop
// headers are stripped because the spec forbids forwarding them.

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
]);

// Node's fetch auto-decompresses gzip/brotli upstream bodies, but the
// original Content-Encoding header still rides along on the response.
// Forwarding it tells the browser to decompress an already-decompressed
// stream → ERR_CONTENT_DECODING_FAILED. Strip it on the response side
// (request side: leave alone — upstream may legitimately send compressed).
const RESPONSE_STRIP = new Set([...HOP_BY_HOP, "content-encoding"]);

interface IRouteContext {
  params: Promise<{ proxy: string[] }>;
}

async function forward(req: NextRequest, ctx: IRouteContext): Promise<Response> {
  const { proxy } = await ctx.params;
  const path = proxy.join("/");
  const url = new URL(`/api/${path}`, env.INTERNAL_API_URL);
  url.search = req.nextUrl.search;

  const outboundHeaders = new Headers();
  req.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) {
      outboundHeaders.set(key, value);
    }
  });

  const hasBody = !["GET", "HEAD"].includes(req.method);
  const init: RequestInit & { duplex?: "half" } = {
    method: req.method,
    headers: outboundHeaders,
    redirect: "manual",
    cache: "no-store",
  };
  if (hasBody) {
    init.body = req.body ?? undefined;
    init.duplex = "half";
  }

  const upstream = await fetch(url.toString(), init);

  const responseHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    if (!RESPONSE_STRIP.has(key.toLowerCase())) {
      responseHeaders.set(key, value);
    }
  });

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
export const HEAD = forward;
export const OPTIONS = forward;

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
