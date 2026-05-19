import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { errorResponse, successResponse } from '@/app/backend/helper/responseFormat';
import { access_role, auth_middleware } from '@/app/backend/helper/auth';

export async function GET(request: NextRequest) {
    try {
        const auth_check: any = await auth_middleware(request, access_role.access_role_partner);
        const user_id = auth_check.auth_user_id;
        const user = await prisma.user.findFirst({
            where: {
                id: user_id
            },
            select: {
                name: true,
                email: true,
                role: true,
                status: true,
                tenant: {
                    select: {
                        firmName: true,
                        ownerName: true,
                        phone: true,
                        city: true,

                    }
                },
                plans: true,
                subscriptions: true,
                subscriptionPayments: true
            }
        })
       
        return successResponse(user, 'Auth Data Fetch Successfully', 200);
    } catch (error: any) {
        console.error('Get error:', error);
        return errorResponse(error, 'Failed to Fetch Auth Data', 500)
    }
}
