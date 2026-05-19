import { API_MESSAGES } from "@/app/backend/helper/message";
import { errorResponse, successResponse } from "@/app/backend/helper/responseFormat";
import { isEmailExpired } from "@/app/backend/helper/timeConverter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

export async function POST (req: Request) {
  try {
    
    const body = await req.json();
    const { token, password, name } = body;

    if (!token || !password || !name) {
      return errorResponse(null, "Token, name, and password are required", 400);
    }

    const user = await prisma.user.findFirst({
      where: { hashedEmail: token }
    });

    if (!user) {
      return errorResponse(null, "Invalid or fake invitation token.", 400)
    }

    if (user.status !== "INACTIVE") {
      return errorResponse(null, "This account has already been activated.", 400);
    }

    if(user.emailVerificationExpiresAt) {
      const is_email_expired: any = isEmailExpired(user.emailVerificationExpiresAt);

      if(is_email_expired) {
        return errorResponse(null, API_MESSAGES.LINK_EXPIRED, 400);
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {id: user.id},
      data: {
        name: name,
        passwordHash: hashedPassword,
        status: 'ACTIVE'
      }
    });

    return successResponse(
      null,
      "Account activated successfully! You can now log in.",
      200
    );


  } catch (error: any) {
    console.error(error);
    return errorResponse(error, "Internal server error", 500);
  }
}