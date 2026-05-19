import { successResponse, errorResponse } from "@/app/backend/helper/responseFormat";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isEmailExpired } from "@/app/backend/helper/timeConverter";
import { API_MESSAGES } from "@/app/backend/helper/message";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { token } = body;

        if (!token) {
           
            return errorResponse(null, API_MESSAGES.TOKEN_REQUIRED, 400); 
        }

      
        const user = await prisma.user.findFirst({
            where: { hashedEmail: JSON.stringify(token)  }
        });
        console.log(user);
        if (!user) {
            return errorResponse(null, API_MESSAGES.INVALID_TOKEN, 400);
        }

        if (user.status != "INACTIVE") {
            return errorResponse(null, API_MESSAGES.EMAIL_ALREADY_VERIFIED, 400);
        }

        const user_email_verification_expires_at = user.emailVerificationExpiresAt;
        
        if (user_email_verification_expires_at) {
            const is_email_expired: any = isEmailExpired(user_email_verification_expires_at);
            if (is_email_expired) {
                return errorResponse(null, API_MESSAGES.LINK_EXPIRED, 400);
            } else {

                await prisma.user.update({
                    where: {
                        id: user.id 
                    }, 
                    data: {
                        status: 'ACTIVE'
                    }
                });
                
                const response = successResponse(
                    {
                        email: user.email, 
                    },
                    API_MESSAGES.EMAIL_VERIFIED_SUCCESS,
                    200
                )
                return response;
            }
        } else {

             return errorResponse(null, API_MESSAGES.EMAIL_VERIFY_FAILED, 500); 
        }

    } catch (error: any) {
        console.error("Login Error:", error);
        return errorResponse(error, "Internal Server Error", 500)
    }
}