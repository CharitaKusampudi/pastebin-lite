import { prisma } from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const paste = await prisma.paste.findUnique({
    where: { id },
  });

  if (!paste) {
    return NextResponse.json(
      { error: "not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    content: paste.content,
    remaining_views:
      paste.maxViews === null
        ? null
        : paste.maxViews - paste.views,
    expires_at: paste.expiresAt
      ? paste.expiresAt.toISOString()
      : null,
  });
}