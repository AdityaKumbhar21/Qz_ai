import { prisma } from "@/lib/prisma";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/webhooks";  

const CLERK_WEBHOOK_SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET!;

export async function POST(request: Request) {
    
    const headerPayload = await headers();
    
    const svixId = headerPayload.get("svix-id")!;
    const svixTimestamp = headerPayload.get("svix-timestamp")!;
    const svixSignature = headerPayload.get("svix-signature")!;

    console.log("Headers received:", {
        svixId,
        svixTimestamp,
        svixSignature: svixSignature ? "Present" : "Missing"
    });

    if(!svixId || !svixTimestamp || !svixSignature) {
        console.error("Missing required Svix headers");
        return new Response("Unauthorized", { status: 401 });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);
    

    if (!CLERK_WEBHOOK_SIGNING_SECRET) {
        console.error("CLERK_WEBHOOK_SIGNING_SECRET not found in environment");
        return new Response("Server configuration error", { status: 500 });
    }

    const wh = new Webhook(CLERK_WEBHOOK_SIGNING_SECRET);

    let evt: WebhookEvent;

    try {
        console.log("Verifying webhook signature...");
        evt = wh.verify(body,{
            "svix-id": svixId,
            "svix-timestamp": svixTimestamp,
            "svix-signature": svixSignature
        }) as WebhookEvent;
    }
    catch (e) {
        console.error("Signature verification failed:", e);
        return new Response("Invalid Signature", { status: 401 });
    }

    const  { type, data } = evt;
    console.log("Event type:", type);

    if (type === "user.created") {
        const { id, email_addresses, first_name, last_name, image_url } = data;

        const userEmail = email_addresses?.[0]?.email_address ?? "";
        const fullName = `${first_name ?? ""} ${last_name ?? ""}`.trim();

        try {
            
            const user = await prisma.user.upsert({
                where: { clerkId: id },
                update: {
                    email: userEmail,
                    name: fullName,
                    image: image_url || null,
                },
                create: {
                    clerkId: id,
                    email: userEmail,
                    name: fullName,
                    image: image_url || null,
                },
            });

            return new Response("User synced", { status: 200 });
        } catch (e) {
            console.error("Error syncing user:", e);
            return new Response("Error syncing user", { status: 500 });
        }
    }
}