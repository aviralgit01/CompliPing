import { access_role, auth_middleware } from "@/app/backend/helper/auth";
import { errorResponse, successResponse } from "@/app/backend/helper/responseFormat";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";


export async function GET (req: NextRequest) {
  try {
    
    const auth_check: any = await auth_middleware(req, access_role.access_role_partner);
    const tenantId = auth_check.auth_tenant_id;
    const current_date = new Date();

    const [activeCount, pendingCount] = await Promise.all([
      prisma.user.count({
        where: {
          tenantId: tenantId,
          status: "ACTIVE"
        }
      }),

      prisma.user.count({
        where: {
          tenantId: tenantId,
          status: "INACTIVE",
          emailVerificationExpiresAt: {
            gt: current_date,
          },
        },
      }),
    ]);

    const team_stat = {
      totalMembers: activeCount + pendingCount,
      activeMembers: activeCount,
      pendingInvites: pendingCount,
    }

    return successResponse(
      team_stat,
      "Team statistics fetched successfully",
      200
    );

  } catch (error: any) {
    console.error("Team Stats GET error:", error);
    return errorResponse(error, "Internal server error", 500);
  }
}
