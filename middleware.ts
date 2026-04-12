export { auth as default } from "./auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/timers/:path*",
    "/billing/:path*",
    "/settings/:path*",
    "/admin/:path*",
  ],
};
