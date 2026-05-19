import { access_role, auth_middleware } from "@/app/backend/helper/auth";
import { errorResponse, successResponse } from "@/app/backend/helper/responseFormat";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET (req: NextRequest) {
  try {
    
    const auth_check: any = await auth_middleware(req, access_role.access_role_partner);

    const tenantId = auth_check.auth_tenant_id;

    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const currentDayOfWeek = now.getDay();

    const distanceToMonday = currentDayOfWeek === 0 ? 6: currentDayOfWeek - 1;

    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - distanceToMonday);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const [
      messagesSentToday,
      documentsReceivedToday,
      filingsCompletedToday,
      itemsDueThisWeek,
      itemsCompletedThisWeek,
      itemsOverdue,
      recentLogs,
      activeItems
    ] = await Promise.all([
      prisma.messageLog.count({
        where: { tenantId, createdAt: { gte: startOfToday, lte: endOfToday}}
      }),

      prisma.clientDocument.count({
        where: {client: {tenantId: tenantId}, createdAt:{ gte: startOfToday, lte: endOfToday}}
      }),

      prisma.complianceItem.count({
        where: { tenantId, status: "COMPLETED", completedAt: {gte: startOfToday, lte: endOfToday}, isDeleted: false}
      }),

      prisma.complianceItem.count({
        where: {tenantId, status: "PENDING", dueDate: { gte: startOfWeek, lte: endOfWeek }, isDeleted: false}
      }),

      prisma.complianceItem.count({
        where: { tenantId, status: "COMPLETED", completedAt: { gte: startOfWeek, lte: endOfWeek }, isDeleted: false }
      }),

      prisma.complianceItem.count({
        where: { tenantId, status: "PENDING", dueDate: { lt: startOfToday }, isDeleted: false }
      }),

      prisma.messageLog.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
            client: { select: { name: true } },
            complianceItem: { select: { type: true } }
          }
      }),

      prisma.complianceItem.count({
        where: { tenantId, status: "PENDING", isDeleted: false}
      })
    
    ]);

  const formattedActivity = recentLogs.map((log) => {
        let actionDescription = "System generated an action";
        
        if (log.messageType === "FILING_CONFIRMATION") {
            actionDescription = `Marked ${log.complianceItem?.type} as completed`;
        } else if (log.messageType.includes("DAY") || log.messageType === "MANUAL") {
            actionDescription = `Sent ${log.messageType.toLowerCase()} reminder for ${log.complianceItem?.type}`;
        } else if (log.messageType === "DOCUMENT_REQUEST") {
            actionDescription = `Requested documents for ${log.complianceItem?.type}`;
        }

        return {
            id: log.id,
            clientName: log.client?.name || "Unknown Client",
            action: actionDescription,
            time: new Date(log.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            status: log.status
        };
    });

return successResponse(
        {
            todaysSnapshot: {
                messagesSent: messagesSentToday,
                documentsReceived: documentsReceivedToday,
                filingsCompleted: filingsCompletedToday
            },
            thisWeeksSnapshot: {
                itemsDue: itemsDueThisWeek,
                itemsCompleted: itemsCompletedThisWeek,
                itemsOverdue: itemsOverdue
            },
            complianceHealth: {
              dueThisWeek: itemsDueThisWeek,
              completed: itemsCompletedThisWeek,
              activeItems: activeItems ,
              totalOverdue: itemsOverdue,
            },
            recentActivity: formattedActivity
        },
        "Dashboard metrics fetched successfully",
        200
    );

  } catch (error: any) {
    console.error("Dashboard Fetch Error:", error);
    return errorResponse(error, "Internal server Error", 500);
  }
}