import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { getNow } from "@/src/lib/time";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { content, ttl_seconds, max_views } = body ?? {};

    // ---- Validation ----
    if (typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { error: "content must be a non-empty string" },
        { status: 400 }
      );
    }

    if (
      ttl_seconds !== undefined &&
      (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
    ) {
      return NextResponse.json(
        { error: "ttl_seconds must be an integer >= 1" },
        { status: 400 }
      );
    }

    if (
      max_views !== undefined &&
      (!Number.isInteger(max_views) || max_views < 1)
    ) {
      return NextResponse.json(
        { error: "max_views must be an integer >= 1" },
        { status: 400 }
      );
    }

    // ---- TTL calculation ----
    const now = getNow(req);
    const expiresAt =
      typeof ttl_seconds === "number"
        ? new Date(now.getTime() + ttl_seconds * 1000)
        : null;

    // ---- Create paste ----
    const paste = await prisma.paste.create({
      data: {
        content,
        expiresAt,
        maxViews: typeof max_views === "number" ? max_views : null,
      },
      select: {
        id: true,
      },
    });

    const origin = new URL(req.url).origin;

    return NextResponse.json(
      {
        id: paste.id,
        url: `${origin}/p/${paste.id}`,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "invalid JSON body" },
      { status: 400 }
    );
  }

}
