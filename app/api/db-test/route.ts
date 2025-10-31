import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return Response.json({
      message: "✅ Connected to DB",
      count: users.length,
      users
    });
  } catch (err) {
    console.error("❌ DB error:", err);
    return new Response("DB Error", { status: 500 });
  }
}
