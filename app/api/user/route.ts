import { auth } from "@clerk/nextjs/server";
import {prisma} from "@/lib/prisma";

export async function POST(){
    const { userId } = await auth();

    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    const clerkUser = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
        headers: {
            'Authorization': `Bearer ${process.env.CLERK_API_KEY}`,
        },
    }).then(res => res.json());

    const existingUser = await prisma.user.findUnique({ 
        where: { clerkId: userId }
    });

    if (!existingUser) {
        await prisma.user.create({
            data:{
                clerkId: userId,
                email: clerkUser.email_addresses[0]?.email_address || '',
                fullName: clerkUser.first_name + ' ' + clerkUser.last_name,
                profileImageUrl: clerkUser.profile_image_url
            }
        });
    }

    return new Response("User synced", { status: 200 });
}
