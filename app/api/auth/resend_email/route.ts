import { successResponse, errorResponse } from "@/app/backend/helper/responseFormat";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createToken } from "@/app/backend/helper/auth";
import { convertToLocalTime, isEmailExpired } from "@/app/backend/helper/timeConverter";
import { emailTemplate } from "@/app/backend/helper/emailTemplate";
import { sendEmail } from "@/app/backend/helper/awsHelper";
import { encryptEmail } from "@/app/backend/helper/generateToken";

export async function POST(req: Request) {
    try {
        const base_url = process.env.NEXT_PUBLIC_APP_URL!;
        const email_verifed_time_hour = parseInt(
            process.env.EMAIL_VERIFED_TIME_HOUR ?? "1"
        );
        const body = await req.json();
        const { email } = body;
        const hashedEmail = encryptEmail(email);
        const verifyLink = `${base_url}/verify-email/?iv=${hashedEmail.iv}&content=${hashedEmail.content}&tag=${hashedEmail.tag}`;
        if (!email) {
            return errorResponse(null, "Email is required", 400);
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return errorResponse(null, "Invalid email or password", 400);
        }

        if (user.status != "INACTIVE") {
            return errorResponse(null, "Email Already Verify !!", 400);
        }
        await prisma.user.update({
            where: {
                email: email
            },
            data: {
                hashedEmail: JSON.stringify(hashedEmail)
            }
        });
        const current_date = new Date();
        current_date.setHours(current_date.getHours() + email_verifed_time_hour);
        const subject = 'Verify Your Mail';
        const buttonLink = verifyLink;
        const buttonText = 'Verify Mail';
        const htmlContent = emailTemplate(buttonLink, buttonText);
        const data = {
            to: email,
            subject,
            htmlBody: htmlContent.verification_mail,
        };
        await sendEmail(data);
        const response = successResponse(
            null,
            "Email Resend Sucessfully",
            200
        )
        return response;


    } catch (error: any) {
        console.error("Login Error:", error);
        return errorResponse(error, "Internal server error", 500)
    }
}