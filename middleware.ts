import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes, including custom sign-in and sign-up
const isPublicRoute = createRouteMatcher([
  '/',
  '/events/:id',
  '/sign-in(.*)', // Custom sign-in route
  '/sign-up(.*)', // Custom sign-up route
  '/api/webhook/clerk',
  '/api/webhook/stripe',
  '/api/uploadthing',
]);

// Define ignored routes (e.g., webhooks)
const isIgnoredRoute = createRouteMatcher([
  '/api/webhook/clerk',
  '/api/webhook/stripe',
  '/api/uploadthing',
]);

export default clerkMiddleware(async (auth, request) => {
  // Skip Clerk processing for ignored routes
  if (isIgnoredRoute(request)) {
    return;
  }

  // Allow access to public routes
  if (isPublicRoute(request)) {
    return;
  }

  // Protect all other routes
  await auth.protect();
});

export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
