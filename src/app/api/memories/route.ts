import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { memorySchema } from "@/lib/validations";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await db.user.findUnique({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const favorite = searchParams.get("favorite");
    const search = searchParams.get("search");

    const memories = await db.memory.findMany({
      where: {
        userId: user.id,
        published: true,
        ...(category && { category }),
        ...(favorite === "true" && { favorite: true }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { locationName: { contains: search, mode: "insensitive" } },
            { city: { contains: search, mode: "insensitive" } },
            { country: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      include: { mediaItems: { orderBy: { orderIndex: "asc" } } },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(memories);
  } catch (err) {
    console.error("[GET /api/memories]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await db.user.findUnique({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await req.json();
    const { mediaItems, coverMediaId, ...memoryData } = body;

    const validated = memorySchema.parse({
      ...memoryData,
      latitude: parseFloat(memoryData.latitude),
      longitude: parseFloat(memoryData.longitude),
    });

    const memory = await db.memory.create({
      data: {
        ...validated,
        userId: user.id,
        date: new Date(validated.date),
        endDate: validated.endDate ? new Date(validated.endDate) : null,
        mediaItems: {
          create: (mediaItems ?? []).map((item: any, i: number) => ({
            type: item.type,
            url: item.url,
            thumbnailUrl: item.thumbnailUrl ?? null,
            publicId: item.publicId ?? null,
            caption: item.caption ?? null,
            orderIndex: i,
          })),
        },
      },
      include: { mediaItems: { orderBy: { orderIndex: "asc" } } },
    });

    // Set cover media
    if (coverMediaId) {
      const coverMedia = memory.mediaItems.find((m) => m.id === coverMediaId);
      if (coverMedia) {
        await db.memory.update({
          where: { id: memory.id },
          data: { coverMediaId: coverMedia.id },
        });
      }
    } else if (memory.mediaItems.length > 0) {
      await db.memory.update({
        where: { id: memory.id },
        data: { coverMediaId: memory.mediaItems[0].id },
      });
    }

    const updated = await db.memory.findUnique({
      where: { id: memory.id },
      include: { mediaItems: { orderBy: { orderIndex: "asc" } } },
    });

    return NextResponse.json(updated, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: err.issues }, { status: 400 });
    }
    console.error("[POST /api/memories]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
