import { prisma } from "@/lib/prisma";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/webhooks";
import { log } from "console";

const CLERK_WEBHOOK_SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET!;

export async function POST(request: Request) {
    const headerPayload = await headers();
    
    const svixId = headerPayload.get("svix-id")!;
    const svixTimestamp = headerPayload.get("svix-timestamp")!;
    const svixSignature = headerPayload.get("svix-signature")!;

    if(!svixId || !svixTimestamp || !svixSignature) {
        console.log("Missing headers: ");
        
        return new Response("Unauthorized", { status: 401 });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);
    console.log(svixId);
    console.log(svixTimestamp);
    console.log(svixSignature);
    console.log(headerPayload);
    
    

    const wh = new Webhook(CLERK_WEBHOOK_SIGNING_SECRET);

    let evt: WebhookEvent;

    try {
        evt = wh.verify(body,{
            "svix-id": svixId,
            "svix-timestamp": svixTimestamp,
            "svix-signature": svixSignature
        }) as WebhookEvent;
    }
    catch (e) {
        console.log("Error in syncing data, ", e);
        return new Response("Invalid Signature", { status: 401 });
    }

    const  { type, data } = evt;

    if (type === "user.created") {
        const {id, email_addresses, first_name, last_name} =  data;
        
        try {
            await prisma.user.upsert({
                where: {clerkId: id},
                update:{},
                create:{
                    clerkId: id,
                    email: email_addresses[0]?.email_address || '',
                    name: first_name + ' ' + last_name
                }
            })

            return new Response("User synced", { status: 200 });
        }
        catch (e) {
            console.log("Error in syncing data, ", e);
            return new Response("Error in syncing data", { status: 500 });
        }

    }
}