import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
} from "@/app/backend/helper/responseFormat";

export async function POST(req: NextRequest) {
  try {
    let token = req.cookies.get("token")?.value;

    if (!token) {
      const authHeader = req.headers.get("Authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.replace("Bearer ", "");
      }
    }

    if (token) {
      await prisma.userSession.deleteMany({
        where: {
          sessionToken: token,
        },
      });
    }

    const response = successResponse(null, "Logged out successfully", 200);

    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });

    return response;
  } catch (error: any) {
    console.error("Logout Error:", error);
    return errorResponse(error, "Internal server error", 500);
  }
}
