import { access_role, auth_middleware } from "@/app/backend/helper/auth";
import { errorResponse, successResponse } from "@/app/backend/helper/responseFormat";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { sendMessage } from "@/app/backend/helper/whatsappHelper";


export async function POST (req: NextRequest) {
  try {
    
    const auth_check: any = await auth_middleware(req, access_role.access_role_partner);
    const tenantId = auth_check.auth_tenant_id;

    const body = await req.json();

    const { complianceItemId } = body;

    if (!complianceItemId) {
      return errorResponse(null, "complianceItemId is strictly required to send a manual reminder.", 400);
    }

    const task = await prisma.complianceItem.findFirst({
      where: {
        id: complianceItemId,
        tenantId: tenantId,
        isDeleted: false
      },
      include: {
        client: true,
      }
    });

    if (!task || !task.client) {
      return errorResponse(null, "Task not found, or the connected client has been deleted", 404);
    }

    if (task.isRemindersPaused || task.client.isRemindersPaused) {
      return errorResponse(null, "Cannot send message. Reminders are currently paused for this client or task.", 403);
    }

    const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
    if (!PHONE_NUMBER_ID) {
      return errorResponse(null, "Server configuration error: Missing Phone Number ID", 500);
    }

    const metaResponse = await sendMessage(
      PHONE_NUMBER_ID,
      "9779860900731",      // task.client.phone
      "hello_world",
      []
    ); 

    await prisma.messageLog.create({
      data: {
        tenantId: tenantId,
        clientId: task.client.id,
        complianceItemId: task.id,
        messageType: "MANUAL",
        content: `Sent manual reminder for ${task.type}`,
        status: metaResponse.success ? "SENT" : "FAILED",
        errorLog: metaResponse.success ? null : JSON.stringify(metaResponse.error),
        metaMessageId: metaResponse.data?.messages?.[0]?.id
      }
    });

    if(!metaResponse.success){
      return errorResponse(metaResponse.error, "Meta API rejected the message.", 500);
    }

    return successResponse(
    { messageId: metaResponse.data?.messages?.[0]?.id },
    "Manual reminder dispatched successfully!",
    200
    );

  } catch (error: any) {
    console.error("Manual Send Error: ", error);
    return errorResponse(error, "Internal Server Error", 500);
  }
}