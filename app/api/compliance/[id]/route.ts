import { NextRequest, NextResponse } from "next/server"; 
import { successResponse, errorResponse } from "@/app/backend/helper/responseFormat";
import { access_role, auth_middleware } from "@/app/backend/helper/auth";
import { prisma } from "@/lib/prisma";

export async function GET ( req:NextRequest, context: any)
{
  try {
    const auth_check: any = await auth_middleware(req, access_role.access_role_partner);

    if (auth_check instanceof NextResponse) {
      return auth_check;
    }

    const tenantId = auth_check.auth_tenant_id;
    const resolvedParams = await context.params;
    console.log("DYNAMIC PARAMS DETECTED:", resolvedParams);

    const complianceId =  resolvedParams?.id;

    if(!complianceId) {
      return errorResponse(null, `Compliance Id is required. Received: ${JSON.stringify(resolvedParams)}`, 400); 
    }

    const single_task: any = await prisma.complianceItem.findFirst({
      where: {
        id: complianceId,
        tenantId: tenantId,
        isDeleted: false,
      },
      include: {
          client: true
        }
    })

    if (!single_task) {
      return errorResponse(null, "Compliance task not found", 404);
    }

    // Calculating days remaining
    const today = new Date();
    const due = new Date(single_task.dueDate);
    const timeDiff = due.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // Generating client initials
    const businessName = single_task.client?.businessName || single_task.client?.name || "Unknown";
    // FIXED: Changed .subString to .substring
    const initials = businessName.split(" ").map((word: string) => word[0]).join("").toUpperCase().substring(0, 2);

    const docString = single_task.documentsRequired || "";
    const documentsArray = docString
    .split(",")
    .filter(Boolean)
    .map((docName: string, index: number) => ({
      id: `doc-${index+1}`,
      name: docName.trim(),
      description: "Awaiting Upload",
      status: "REQUIRED",
      fileName: null,
    }));

    const lifecycle = [
      {
        id: "lc-1",
        label: "Current State",
        detail: single_task.status === "COMPLETED" ? "Task Completed" : "Pending Documentation",
        timestamp: "Current",
        isActive: true,
      },
      {
        id: "lc-2",
        label: "Created At",
        detail: new Date(single_task.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        timestamp: "System Generated",
        isActive: false,
      },
    ];

    let nextCycle = "N/A";
    if (single_task.frequency !== "ONE_TIME") {
      const nextDate = new Date(single_task.dueDate);

      if (single_task.frequency === "MONTHLY"){
        nextDate.setMonth(nextDate.getMonth() + 1);
      } else if (single_task.frequency === "QUARTERLY") {
        nextDate.setMonth(nextDate.getMonth() + 3);
      } else if (single_task.frequency === "ANNUALLY") {
        nextDate.setFullYear(nextDate.getFullYear() + 1);
      }

      nextCycle = nextDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric'});
    }
    const formattedData = {
      ...single_task,

      refCode: `${single_task.type.substring(0,3).toUpperCase()}-${new Date().getFullYear()}-${initials}`,
      daysRemaining: daysRemaining,
      filingPeriod: single_task.period || "N/A",
      nextCycle: nextCycle,

      client: {
        ...single_task.client,
        initials: initials,
        entityType: single_task.client?.entityType || "Corporate Entity"
      },

      documents: documentsArray,
      lifecycle: lifecycle,
    };

    return successResponse(
        { complianceItem: formattedData },
        "Single compliance task fetched successfully",
        200
    );
    
  } catch (error: any) {
    console.error("Compliance Get error: ", error);
    return errorResponse(error, "Internal Server Error", 500);
  }
}