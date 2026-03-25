import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await db.user.findUnique({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { bio, name } = body;

    const user = await db.user.upsert({
      where: { clerkId: userId },
      update: {
        ...(bio !== undefined && { bio }),
        ...(name !== undefined && { name }),
      },
      create: {
        clerkId: userId,
        bio,
        name,
      },
    });

    return NextResponse.json(user);
  } catch (err) {
    console.error("[PUT /api/user]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
