import { errorResponse, successResponse } from "@/app/backend/helper/responseFormat";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";


export async function GET(req: NextRequest) {

  try {
    
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    if (!email) {
      return errorResponse(null, "Invalid invitation link format", 400);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!existingUser) {
      return errorResponse(null, "Invitation not found for this email", 404);
    }

    if (existingUser.status === "ACTIVE") {
      return errorResponse(null, "This invitation has already been accepted. Please log in.", 400);
    }

    const currentDate = new Date();
    if (
      !existingUser.emailVerificationExpiresAt || existingUser.emailVerificationExpiresAt < currentDate ) {
        return errorResponse(null, "Invitation link has expired. Please request a new one from your admin.", 400);
      }
    
    return successResponse(
      {
        email: existingUser.email,
        role: existingUser.role,
      },
      "Valid invitation link",
      200
    );

  } catch (error: any) {
    console.error("Verify Invite GET error:", error);
    return errorResponse(error, "Internal server error", 500);
  }
}