import { NextRequest, NextResponse } from "next/server";
import { successResponse, errorResponse } from "@/app/backend/helper/responseFormat";
import { access_role, auth_middleware } from "@/app/backend/helper/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {

    const auth_check: any = await auth_middleware(req, access_role.access_role_partner);
    if (auth_check instanceof NextResponse) return auth_check;

    const tenantId = auth_check.auth_tenant_id;
    

    const searchParams = req.nextUrl.searchParams;
    const complianceItemId = searchParams.get("complianceItemId");
    const clientId = searchParams.get("clientId");

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const search = searchParams.get("search") || "";
    const fromDate = searchParams.get("from");
    const toDate = searchParams.get("to");
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";


    if (!complianceItemId && !clientId) {
      return errorResponse(null, "Please provide either complianceItemId or clientId", 400);
    }

    const whereClause: any = {
      tenantId: tenantId,
    };

    if (complianceItemId) whereClause.complianceItemId = complianceItemId;
    if (clientId) whereClause.clientId = clientId;

    if (fromDate || toDate) {
      whereClause.createdAt = {};
      if (fromDate) whereClause.createdAt.gte = new Date(fromDate);
      if (toDate) whereClause.createdAt.lte = new Date(toDate);
    }

    if (search) {
      whereClause.OR = [
        { client: {name: {contains:search, mode: "insensitive" } } },
        { complianceItem: { type: { contains:search, mode: "insensitive" } } },
        { messageType : { contains:search, mode: "insensitive" } },
      ];
    }

  const [logs, totalCount] = await Promise.all([
      prisma.messageLog.findMany({
        where: whereClause,
        orderBy: { createdAt: sortOrder },
        skip: skip, 
        take: limit, 
        include: {
          complianceItem: { select: { type: true, isRemindersPaused: true } },
          client: { select: { name: true, isRemindersPaused: true } }
        }
      }),
      prisma.messageLog.count({
        where: whereClause
      })
    ]);

    let contextClientName = null;
    let contextClientPaused = false;
    let contextTaskPaused: boolean | null = null;

    if(complianceItemId) {
      const taskContext = await prisma.complianceItem.findFirst({
        where: { id: complianceItemId,  tenantId: tenantId},
        include: { client: {select: {name: true, isRemindersPaused: true}}}
      });

      if (taskContext) {
        contextTaskPaused = taskContext.isRemindersPaused;
        contextClientName = taskContext.client?.name;
        contextClientPaused = taskContext.client?.isRemindersPaused || false;
      }
    } 
    // If querying a Client generally
    else if (clientId) {
      const clientContext = await prisma.client.findFirst({
        where: { id: clientId, tenantId: tenantId }
      });
      
      if (clientContext) {
        contextClientName = clientContext.name;
        contextClientPaused = clientContext.isRemindersPaused;
      }
    }
    const formattedLogs = logs.map(log => {

      let parsedError = null;
      if (log.errorLog) {
        try {
          parsedError = JSON.parse(log.errorLog).error?.message || "Unknown Meta Error";
        } catch (e) {
          parsedError = log.errorLog;
        }
      }

      return {
        id: log.id,
        type: log.messageType,
        complianceItemId: log.complianceItemId,       
        content: log.content,        
        status: log.status,        
        date: new Date(log.createdAt).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        }),
        errorMessage: parsedError,
        taskType: log.complianceItem?.type,
      };
    });

    return successResponse({
      clientName: contextClientName,
      isClientPaused: contextClientPaused,
      isTaskPaused: contextTaskPaused,
      logs: formattedLogs,
      pagination: {
            total: totalCount,
            page: page,
            limit: limit,
            totalPages: Math.ceil(totalCount / limit)
        }
     }, "Message logs fetched successfully", 200);

  } catch (error: any) {
    console.error("Message Log Fetch error: ", error);
    return errorResponse(error, "Internal Server Error", 500);
  }
}