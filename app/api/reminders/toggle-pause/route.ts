import { access_role, auth_middleware } from "@/app/backend/helper/auth";
import { errorResponse, successResponse } from "@/app/backend/helper/responseFormat";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server"

export async function PATCH (req: NextRequest) {
  try {
    
    const auth_check: any = await auth_middleware(req, access_role.access_role_partner);
    if (auth_check instanceof NextResponse) return auth_check;

    const tenantId = auth_check.auth_tenant_id;

    const body = await req.json();
    const {targetId, targetType, isPaused} = body;

    if (!targetId || !targetType || typeof isPaused !== "boolean") {
      return errorResponse(null,
        "Missing required fields: targetId, targetType ('client' or 'task') and isPaused (boolean)",
        400
      );
    }

    if (targetType === "CLIENT") {
      await prisma.client.update({
        where: { id: targetId, tenantId: tenantId },
        data: { isRemindersPaused: isPaused }
      });
    } else if (targetType === "TASK") {
      await prisma.complianceItem.update({
        where: { id: targetId, tenantId: tenantId },
        data: { isRemindersPaused: isPaused }
      });
    } else {
      return errorResponse(null, "Invalid targetType. Must be exactly 'CLIENT' or 'TASK'", 400);
    }

    const action = isPaused ? "paused" : "resumed";
    return successResponse({isPaused},
      `Reminders successfully ${action} for this ${targetType.toLowerCase()}`,
      200,
    );

  } catch (error: any) {
    console.error("Toggle Pause error: ", error);

    if (error.code === 'P2025') {
        return errorResponse(null, "Record not found or you do not have permission to edit it.", 404);
    }
    
    return errorResponse(error, "Internal Server Error", 500);
  }
}