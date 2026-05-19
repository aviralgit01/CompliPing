import { successResponse, errorResponse } from "@/app/backend/helper/responseFormat";
import { prisma } from "@/lib/prisma";
import { emailTemplate } from "@/app/backend/helper/emailTemplate";
import { sendEmail } from "@/app/backend/helper/awsHelper";
import { encryptEmail } from "@/app/backend/helper/generateToken";
import { access_role, auth_middleware } from "@/app/backend/helper/auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const auth_check: any = await auth_middleware(req, access_role.access_role_partner);
        const user_id = auth_check.auth_user_id;
        const body = await req.json();
        const {
            whatsAppAccessToken,
            whatsAppPhoneNumber,
            whatsAppBusinessAccountID
        } = body;
        if (whatsAppAccessToken ||
            whatsAppPhoneNumber ||
            whatsAppBusinessAccountID) {
            return errorResponse(null, "All Field Required", 400);
        }

        await prisma.userOnBoarding.create({
            data: {
                whatsAppAccessToken: whatsAppAccessToken,
                whatsAppBusinessAccountID: whatsAppBusinessAccountID,
                whatsAppPhoneNumber: whatsAppPhoneNumber,
                userId: user_id
            }
        })

        await prisma.user.update({
            where: {
                id: user_id
            },
            data: {
                onBoardingCompleted: true
            }
        });
        const response = successResponse(
            null,
            "OnBoarding Completed Sucessfully",
            200
        )
        return response;
    } catch (error: any) {
        console.error("OnBoarding  Error:", error);
        return errorResponse(error, "Internal server error", 500)
    }
}
