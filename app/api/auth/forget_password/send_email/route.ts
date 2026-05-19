import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

import { errorResponse, successResponse } from '@/app/backend/helper/responseFormat';
import { encryptEmail } from '@/app/backend/helper/generateToken';
import { emailTemplate } from '@/app/backend/helper/emailTemplate';
import { sendEmail } from '@/app/backend/helper/awsHelper';

export async function POST(request: NextRequest) {
    try {
        const base_url = process.env.NEXT_PUBLIC_APP_URL!;
        const body = await request.json();
        const { email } = body;

        const hashedEmail = await encryptEmail(email);
        const verifyLink = `${base_url}/reset-password/?iv=${hashedEmail.iv}&content=${hashedEmail.content}&tag=${hashedEmail.tag}`;
        const user_exist = await prisma.user.findFirst({
            where: {
                email: email
            },
        });
        if (!user_exist) {
              return  errorResponse(
                    null,
                    'This email address is not registered in our system.',
                    400
                )
        }
        const subject = 'Reset Your Password';
        const buttonLink = verifyLink;
        const buttonText = 'Reset Password';
        const htmlContent = emailTemplate(buttonLink, buttonText);
        const data = {
            to: email,
            subject,
            htmlBody: htmlContent.verification_mail,
        };
        await sendEmail(data);
       return successResponse(null, 'mail send', 201)
    } catch (error: any) {
        console.error('Create error:', error);

       return errorResponse(error, 'Failed to Send Mail', 500)

    }
}
