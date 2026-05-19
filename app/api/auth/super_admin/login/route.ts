import { successResponse, errorResponse } from "@/app/backend/helper/responseFormat";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createToken } from "@/app/backend/helper/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return errorResponse(null, "Email and password are required", 400);
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });
    console.log(user);

    if (!user) {
      return errorResponse(null, "Invalid email or password", 401);
    }
    if (user.role != "SUPER_ADMIN") {
      return errorResponse(null, "Unauthorized", 401);
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return errorResponse(null, "Invalid email or password", 401);
    }
    if (user.status == "INACTIVE") {
      return errorResponse(null, "Email Not Verified !!", 400);
    }

    const token = await createToken({
      userId: user.id,
      tenantId: user.tenantId,
      role: user.role
    });
    await prisma.userSession.create({
      data: {
        userId: user.id,
        sessionToken: token,
      }
    })

    const { passwordHash, ...safeUser } = user;

    const response = successResponse(
      {
        token: token,
        user_data: {
          name: user.name,
          role: user.role,
          status: user.status,
          email: user.email,
          id: user.id,
        }
      },
      "Login successful",
      200
    )

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return response;

  } catch (error: any) {
    console.error("Login Error:", error);
    return errorResponse(error, "Internal server error", 500)
  }
}