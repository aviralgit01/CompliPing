import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/app/backend/helper/responseFormat";
import { access_role, auth_middleware } from "@/app/backend/helper/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req:NextRequest) {
  try {
    
    const auth_check: any = await auth_middleware(req, access_role.access_role_partner);
    if (!auth_check) {
      return errorResponse(null, "Unauthorized access", 401);
    }

    const tenantId = auth_check.auth_tentat_id;

    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");

    

  } catch (error) {
    
  }
}