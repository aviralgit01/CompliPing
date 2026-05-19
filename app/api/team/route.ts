import { access_role, auth_middleware } from "@/app/backend/helper/auth";
import { errorResponse, successResponse } from "@/app/backend/helper/responseFormat";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {

  try {
    
    const auth_check: any = await auth_middleware(req, access_role.access_role_partner);

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    const statusFilter = searchParams.get("status");
    const search = searchParams.get("search") || "";

    const currentDate = new Date();

    const conditions: any[] = [
      { tenantId: auth_check.auth_tenant_id } 
    ];

    if (search) {
      conditions.push({
        OR: [
          { name: {contains: search, mode: "insensitive"}},
          { email: { contains:search, mode: "insensitive" }},
        ]
      });
    }


    if (statusFilter === "ACTIVE") {
      conditions.push({ status: "ACTIVE" });

    } else if (statusFilter === "INACTIVE") {
      conditions.push({
        status: "INACTIVE",
        emailVerificationExpiresAt : {gt: currentDate}
      });
    
    } else {
      conditions.push ({
        OR: [
        { status: "ACTIVE" },
        {
          status: "INACTIVE",
          emailVerificationExpiresAt: {gt: currentDate },
        },
      ]
    });
  }

      const whereClause: any = {
      AND: conditions
    };

    const teamMembers = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
      skip: skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      }
    });

    const totalCount = await prisma.user.count({
      where: whereClause,
    })

    return successResponse(
      teamMembers,
      "Team members fetched successfully",
      200,
      {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      }
    )

  } catch (error: any) {
    console.error(error);
    return errorResponse(error, "Internal server error", 500);
  }
}