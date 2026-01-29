export const dynamic = "force-dynamic";

import { prisma } from "@/src/lib/prisma";
import { notFound } from "next/navigation";
import { getNow } from "@/src/lib/time";

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
    const{ id } = await params;
  const now = getNow();

  const paste = await prisma.paste.findFirst({
    where: {
      id,
      AND: [
        {
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: now } },
          ],
        },
        {
          OR: [
            { maxViews: null },
            { views: { lt: prisma.paste.fields.maxViews } },
          ],
        },
      ],
    },
  });

  if (!paste) notFound();

  return (
    <main style={{ padding: "2rem"}}>
     <pre>{paste.content}</pre>
    </main>
  );
}
