import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/app/backend/helper/responseFormat";
import { access_role, auth_middleware } from "@/app/backend/helper/auth";
import { prisma } from "@/lib/prisma";
import { sendMessage } from "@/app/backend/helper/whatsappHelper";

export async function POST(req: NextRequest) {

  try {
    const auth_check: any = await auth_middleware(req, access_role.access_role_partner);
    if(!auth_check) {
      return errorResponse(null, "Unauthorized access", 400);
    }
  
    const body = await req.json();
  
    const { type, dueDate, description, documentsRequired, clientId, frequency, period, notes, assignedTo } = body;

    if (!type || !dueDate || !clientId) {
      return errorResponse(null, "Type, dueDate, and clientId are required", 400);
    }

    const client_exists = await prisma.client.count({
      where: {
        id: clientId,
        tenantId: auth_check.auth_tenant_id,
        isDeleted: false
      }
    });

    if (client_exists === 0) {
      return errorResponse(null, "Client not found or doesn't belong to your firm", 400);
    }
  
    const create_compliance = await prisma.complianceItem.create({
      data: {
        type: type, //e.g., "Gst Return", "ITR"
        dueDate: new Date(dueDate),
        description: description,
        documentsRequired: documentsRequired,
        clientId: clientId,
        tenantId: auth_check.auth_tenant_id,
        frequency: frequency || "ONE_TIME", //default
        period: period,
        assignedTo: assignedTo,
        notes: notes,
      }
    });
  
    return successResponse ({
      complianceItem: create_compliance,
    },
    "Compliance Task created Successfully",
    201
);
  } catch (error: any) {
    console.error("Compliance POST error: ", error);
    return errorResponse(error, "Internal server error", 500);
  }


}

export async function GET (req: NextRequest) {
  try {
    const auth_check: any = await auth_middleware(req, access_role.access_role_partner);

    if (!auth_check) {
      return errorResponse(null, "Unauthorized access", 401);
    }

    const tenantId = auth_check.auth_tenant_id;
    
    const { searchParams } = new URL(req.url);
    
    const page = parseInt(searchParams.get("page")  || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const clientId = searchParams.get("clientId");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
  
    const skip = (page - 1) * limit;
  
    const whereClause: any = {
      tenantId: tenantId,
      isDeleted: false 
    };
  
    if (clientId) {
      whereClause.clientId = clientId;
    }
    if (status) {
      whereClause.status = status;
    }

    if (startDate || endDate) {
      let dateFilter: any = {};

      if (startDate && endDate) {
        dateFilter.gte = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.lte = end;

      } else if (startDate && !endDate) {
        const startOfDay = new Date(startDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(startDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        dateFilter.gte = startOfDay;
        dateFilter.lte = endOfDay;
      } else if (!startDate && endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.lte = endDate;
      }

      
      whereClause.OR = [
        { dueDate: dateFilter },
        { frequency: {not: "ONE_TIME"} }
      ];
    }
    
    const compliance_items = await prisma.complianceItem.findMany({
       where: whereClause,
       skip: skip,
       take: limit,
       orderBy: { dueDate: "asc" },
       include: {
        client : {
          select: { name: true, businessName: true, phone: true }
        }
       }
    });
  
    const totalCount = await prisma.complianceItem.count({
      where: whereClause
    });

    // THE TWO DATA BUCKETS
    const calendarData: any = {};
    const recurringData: any = {};

    compliance_items.forEach((item: any) => {
    if (item.frequency !== "ONE_TIME") {
        const day = item.dueDate.getUTCDate().toString();
        
        if (!recurringData[day]) {
          recurringData[day] = [];
        }
        recurringData[day].push(item);
        
      } else {

        const fullDateStr = item.dueDate.toISOString().split('T')[0];
        
        if (!calendarData[fullDateStr]) {
          calendarData[fullDateStr] = [];
        }
        calendarData[fullDateStr].push(item);
      }
    });
  
    return successResponse(
      {
        calendarData,
        recurringData
      },
      "Compliance calendar fetched successfully",
      200,
      {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
      }
    );

  } catch (error: any) {
    console.error("Compliance Get error: ", error);
    return errorResponse(error, "Internal Server Error", 500);
  }
}

export async function PUT (req: NextRequest) {
  try {
    const auth_check: any = await auth_middleware(req, access_role.access_role_partner);
    const tenantId = auth_check.auth_tenant_id;

    const { searchParams } = new URL(req.url);
    const complianceId = searchParams.get("id");

    if( !complianceId ) {
      return errorResponse(null, "Comliance Task ID is required in the URL", 400);
    }

    const existing_task = await prisma.complianceItem.findFirst({
      where: {
        id: complianceId,
        tenantId: tenantId,
        isDeleted: false
      },
      include: { client : true }
    });

    if (!existing_task) {
      return errorResponse(null, "Task not found or you do not have permisssionto edit it", 400);
    }

    const body = await req.json();
    const {type, dueDate, description, documentsRequired, status, frequency, period, assignedTo, notes, acknowledgmentNumber } = body;

    const updated_compliance = await prisma.complianceItem.update({
      where: {
        id: complianceId
      }, 
      data: {
        type: type ?? existing_task.type,
        dueDate: dueDate ? new Date(dueDate) : existing_task.dueDate,
        description: description ?? existing_task.description,
        documentsRequired: documentsRequired ?? existing_task.documentsRequired,
        status: status ?? existing_task.status,
        frequency: frequency ?? existing_task.frequency,
        period: period ?? existing_task.period,
        assignedTo: assignedTo ?? existing_task.assignedTo,
        notes: notes ?? existing_task.notes,
        acknowledgmentNumber: acknowledgmentNumber ?? existing_task.acknowledgmentNumber,
        completedAt: status === "COMPLETED" ? new Date() : existing_task.completedAt,
      }
    });

      // ==========================================
      // CORE MODULE 6: FILING COMPLETION LOGIC
      // ==========================================
      if (status === "COMPLETED" && existing_task.status !== "COMPLETED") {
      const currentFrequency = updated_compliance.frequency;
      
      let nextDueDate: Date | null = null; 

      if (currentFrequency !== "ONE_TIME") {
        nextDueDate = new Date(updated_compliance.dueDate);

        if (currentFrequency === "MONTHLY") {
          nextDueDate.setMonth(nextDueDate.getMonth() + 1);
        } else if (currentFrequency === "QUARTERLY") {
          nextDueDate.setMonth(nextDueDate.getMonth() + 3);
        } else if (currentFrequency === "ANNUALLY") {
          nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
        }

        await prisma.complianceItem.create({
          data: {
            type: updated_compliance.type,
            frequency: currentFrequency,
            dueDate: nextDueDate,
            description: updated_compliance.description,
            documentsRequired: updated_compliance.documentsRequired,
            status: 'PENDING',
            clientId: updated_compliance.clientId,
            tenantId: updated_compliance.tenantId,
          }
        });

        console.log(`[SYSTEM] Auto-generated next ${currentFrequency} task for client ${updated_compliance.clientId}`);
      }


      try {
        const nextDueDateStr = nextDueDate ? nextDueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'}) : "N/A";
        const ackText = acknowledgmentNumber ? ` Acknowledgment: ${acknowledgmentNumber}.` : "";
        
        const messageContent = `Your ${updated_compliance.type} for ${updated_compliance.period || "this period"} has been filed successfully.${ackText} Next due date: ${nextDueDateStr}.`;

        // Send the Meta Message
        const waResponse = await sendMessage(
            process.env.PHONE_NUMBER_ID as string, 
            "9779860900731", // change to existing_task.client.phone for Prod!
            "hello_world",   // Change to your approved filing template later
            []
        );

        // Log it to the database
        await prisma.messageLog.create({
            data: {
                messageType: "FILING_CONFIRMATION",
                content: messageContent,
                status: waResponse.success ? "SENT" : "FAILED",
                errorLog: waResponse.success ? null : JSON.stringify(waResponse.error),
                clientId: updated_compliance.clientId,
                complianceItemId: updated_compliance.id,
                tenantId: updated_compliance.tenantId,
                metaMessageId: waResponse.data?.messages?.[0]?.id
            }
        });
      } catch (error) {
        console.error("Failed to send Filing Confirmation WhatsApp:", error);
      }
    }

    return successResponse(
      {
        complianceItem: updated_compliance
      },
      "Compliance Task Updated Successfully",
      200
    );

  } catch (error: any) {
    console.error("Compliance PUT Error", error);
    return errorResponse(error, "Internal server error", 500);
  }
}

export async function DELETE (req: NextRequest) {

try {
    const auth_check: any = await auth_middleware(req, access_role.access_role_partner);
    const tenantId = auth_check.auth_tenant_id;
  
    const { searchParams } = new URL(req.url);
    const complianceId = searchParams.get("id");
  
    if (!complianceId) {
              return errorResponse(null, "Compliance Task ID is required in the URL to delete", 400);
          }
  
    const task_exists = await prisma.complianceItem.count({
    where: {
              id: complianceId,
              tenantId: tenantId // The hard wall!
            }
    });
    if (task_exists === 0) {
      return errorResponse(null, "Task not found or you do not have permission to delete it", 404);
    }
  
    await prisma.complianceItem.update({
      where: {
        id: complianceId
      },
      data: { isDeleted: true }
    });
  
  
    return successResponse(
      {
        deleted_id: complianceId,
      },
      "Compliance Task Deleted succesfully",
      200
    );
} catch (error: any) {
  console.error("Compliance Delete error: ", error);
  return errorResponse(error, "Internal server error", 500);  
}

}