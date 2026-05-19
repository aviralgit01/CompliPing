import { sendEmail } from "@/app/backend/helper/awsHelper";
import { emailTemplate } from "@/app/backend/helper/emailTemplate";
import { encryptEmail } from "@/app/backend/helper/generateToken";
import { errorResponse, successResponse } from "@/app/backend/helper/responseFormat";
import { trailPeriodHelper } from "@/app/backend/helper/trailPeriodHelper";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const email_verifed_time_hour = parseInt(
      process.env.EMAIL_VERIFED_TIME_HOUR ?? "1"
    );
    const base_url = process.env.NEXT_PUBLIC_APP_URL!;
    const body = await req.json();
    const {
      name,
      email,
      password,
      firmName,
      phone,
      city,
      icaiNumber
    } = body;
    const hashedEmail = encryptEmail(email);
  //   {
  //   iv: iv.toString("hex"),
  //   content: encrypted.toString("hex"),
  //   tag: authTag.toString("hex"),
  // }
    const verifyLink = `${base_url}/verify-email/?iv=${hashedEmail.iv}&content=${hashedEmail.content}&tag=${hashedEmail.tag}`;
    if (!name || !email || !password || !firmName || !phone || !city) {
      return errorResponse(null, "Missing required fields", 400)
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return errorResponse(null, "Email already registered", 400)
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const current_date = new Date();
    current_date.setHours(current_date.getHours() + email_verifed_time_hour);
    const result = await prisma.$transaction(async (tx: any) => {
      const tenant = await tx.tenant.create({
        data: {
          firmName,
          ownerName: name,
          phone,
          city,
          icaiNumber
        }
      })

      const user = await tx.user.create({
        data: {
          name,
          email,
          passwordHash: hashedPassword,
          role: 'PARTNER',
          emailVerificationExpiresAt : current_date,
          hashedEmail :JSON.stringify(hashedEmail),
          tenantId: tenant.id
        }
      });

      return { tenant, user }
    })
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
    const free_trail_id:string=process.env.FREE_TRAIL_ID as string;
    await trailPeriodHelper(result.user.id,free_trail_id);
    const response = successResponse(null, "Email Sent To Your Mail", 201)
    return response;

  } catch (error: any) {
    console.log(error);
    return errorResponse(error, "Internal server error", 500)
  }
}