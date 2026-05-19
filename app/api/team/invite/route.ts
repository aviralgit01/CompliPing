import { access_role, auth_middleware } from "@/app/backend/helper/auth";
import { errorResponse, successResponse } from "@/app/backend/helper/responseFormat";
import { prisma } from "@/lib/prisma";
import { encryptEmail } from "@/app/backend/helper/generateToken";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/app/backend/helper/awsHelper";


export async function POST(req: NextRequest) {
  try {
    
    //only a partner can send invites
    const auth_check: any = await auth_middleware(req, access_role.access_role_partner);

    const body = await req.json();

    const { email, role } = body;

    if (!email || !role) {
      return errorResponse(null, "Email and role are required", 400);
    }

    const existingUser = await prisma.user.findUnique(
      {
        where: { email }
      }
    );

    const hashedEmail = encryptEmail(email);
    const invite_valid_hours = parseInt(process.env.EMAIL_VERIFIED_TIME_HOUR ?? "1");

    const current_date = new Date();
    const new_expiry_date = new Date();
    new_expiry_date.setHours(new_expiry_date.getHours() + invite_valid_hours );

    
    if (existingUser) {

      if (existingUser.status === "ACTIVE") {
          return errorResponse(null, "User with this email already registered", 400);
      }

      if (existingUser.emailVerificationExpiresAt && existingUser.emailVerificationExpiresAt > current_date){
        return errorResponse(null, "An active invitation has already been sent to this email. Please wait for it to expire.", 400);
      }

      await prisma.user.update({
        where: { email },
        data: {
          role: role,
          emailVerificationExpiresAt: new_expiry_date,
          hashedEmail: JSON.stringify(hashedEmail),
          tenantId: auth_check.auth_tenant_id
        }
      });
    } else {

    await prisma.user.create ({
      data: {
        name: "Pending Invite",
        email: email,
        passwordHash: "",
        role: role,
        status: 'INACTIVE',
        emailVerificationExpiresAt: new_expiry_date,
        hashedEmail: JSON.stringify(hashedEmail), 
        tenantId: auth_check.auth_tenant_id
      }
    });
  }
    const base_url = process.env.NEXT_PUBLIC_APP_URL!;
    const inviteLink = `${base_url}/team-management/invite/?iv=${hashedEmail.iv}&content=${hashedEmail.content}&tag=${hashedEmail.tag}`;

    const data = {
      to: email,
      subject: `You've been invited to join ${auth_check.auth_user_firm_name}`,
      htmlBody: `
        <h3>Welcome to CompliPing Pro!</h3>
        <p>You have been invited by ${auth_check.auth_name} to join their workspace as a ${role}.</p>
        <p><a href="${inviteLink}" style="padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">Accept Invite & Set Password</a></p>
        <p>This link will expire in ${invite_valid_hours} hours.</p>
      `,
    };

    await sendEmail(data);
    return successResponse(null, "Invite Sent successfully", 200);

  } catch (error: any) {
    console.error(error);
    return errorResponse(error, "Internal server error", 500);
  }
}