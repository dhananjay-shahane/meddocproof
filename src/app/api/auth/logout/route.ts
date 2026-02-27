import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/logout?role=admin|doctor|user
 * Clears the httpOnly cookie for the specified role.
 * If no role specified, clears ALL role cookies.
 */
export async function POST(request: NextRequest) {
  const role = request.nextUrl.searchParams.get("role");

  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  };

  if (role) {
    // Clear only the specific role cookie
    response.cookies.set(`${role}_token`, "", cookieOptions);
  } else {
    // Clear all role cookies
    for (const name of ["user_token", "admin_token", "doctor_token"]) {
      response.cookies.set(name, "", cookieOptions);
    }
  }

  return response;
}
