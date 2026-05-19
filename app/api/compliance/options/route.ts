import { NextRequest, NextResponse } from "next/server";
import { successResponse, errorResponse } from "@/app/backend/helper/responseFormat";
import { access_role, auth_middleware } from "@/app/backend/helper/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    
    const auth_check: any = await auth_middleware(req, access_role.access_role_partner);

    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");
    
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;


    if (!clientId) {
      return errorResponse(null, "Client ID is required in the query parameters.", 400);
    }

    const whereClause: any = {
      clientId: clientId,
      tenantId: auth_check.auth_tenant_id,
      isDeleted: false
    };

    if (search) {
      whereClause.OR = [
        { type: { contains: search, mode: "insensitive" } },
        { status: { contains: search, mode: "insensitive" } }
      ];
    }

    const [compliances, totalCount] = await Promise.all([
      prisma.complianceItem.findMany({
        where: whereClause,
        orderBy: { dueDate: 'asc' }, 
        skip: skip,
        take: limit,
        select: {
          id: true,
          type: true, 
          isRemindersPaused: true
        }
      }),
      prisma.complianceItem.count({
        where: whereClause
      })
    ]);

    const dropdownOptions = compliances.map((task) => ({
      label: task.type,
      value: task.id,
      isTaskPaused: task.isRemindersPaused
    }));

    return successResponse(
      dropdownOptions,
      "Compliance options fetched successfully",
      200,
      {
        total: totalCount,
        page: page,
        limit: limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    );
  } catch (error: any) {
    console.error("Compliance Options Fetch Error:", error);
    return errorResponse(error, "Internal Server Error", 500);
  }
}