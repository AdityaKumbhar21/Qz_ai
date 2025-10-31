import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks/sign-up",   // ✅ allow all webhook routes
  "/api/db-test"
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return;       
  }

  // Protect everything else
  await auth.protect();
});

export const config = {
  matcher: [
    // Skip static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
