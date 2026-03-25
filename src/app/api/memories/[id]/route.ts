import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { memorySchema } from "@/lib/validations";
import { deleteCloudinaryAsset } from "@/lib/cloudinary";
import { z } from "zod";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await db.user.findUnique({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const memory = await db.memory.findUnique({
      where: { id, userId: user.id },
      include: { mediaItems: { orderBy: { orderIndex: "asc" } } },
    });

    if (!memory) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(memory);
  } catch (err) {
    console.error("[GET /api/memories/:id]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await db.user.findUnique({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Verify ownership
    const existing = await db.memory.findUnique({
      where: { id, userId: user.id },
      include: { mediaItems: true },
    });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await req.json();
    const { mediaItems, coverMediaId, ...memoryData } = body;

    const validated = memorySchema.parse({
      ...memoryData,
      latitude: parseFloat(memoryData.latitude ?? memoryData.latitude),
      longitude: parseFloat(memoryData.longitude ?? memoryData.longitude),
    });

    // Delete old media items that are being replaced
    if (mediaItems !== undefined) {
      const newMediaIds = new Set(
        mediaItems.filter((m: any) => m.id && !m.id.startsWith("uploaded-")).map((m: any) => m.id),
      );
      const toDelete = existing.mediaItems.filter((m) => !newMediaIds.has(m.id));
      for (const item of toDelete) {
        if (item.publicId) await deleteCloudinaryAsset(item.publicId);
        await db.mediaItem.delete({ where: { id: item.id } });
      }

      // Upsert new media items
      for (let i = 0; i < mediaItems.length; i++) {
        const item = mediaItems[i];
        if (item.id && !item.id.startsWith("uploaded-")) {
          await db.mediaItem.update({
            where: { id: item.id },
            data: {
              caption: item.caption ?? null,
              orderIndex: i,
            },
          });
        } else {
          await db.mediaItem.create({
            data: {
              memoryId: id,
              type: item.type,
              url: item.url,
              thumbnailUrl: item.thumbnailUrl ?? null,
              publicId: item.publicId ?? null,
              caption: item.caption ?? null,
              orderIndex: i,
            },
          });
        }
      }
    }

    const memory = await db.memory.update({
      where: { id },
      data: {
        ...validated,
        date: new Date(validated.date),
        endDate: validated.endDate ? new Date(validated.endDate) : null,
        coverMediaId: coverMediaId ?? null,
      },
      include: { mediaItems: { orderBy: { orderIndex: "asc" } } },
    });

    return NextResponse.json(memory);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: err.issues }, { status: 400 });
    }
    console.error("[PUT /api/memories/:id]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await db.user.findUnique({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const memory = await db.memory.findUnique({
      where: { id, userId: user.id },
      include: { mediaItems: true },
    });
    if (!memory) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Delete media from Cloudinary
    for (const item of memory.mediaItems) {
      if (item.publicId) await deleteCloudinaryAsset(item.publicId);
    }

    await db.memory.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/memories/:id]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
