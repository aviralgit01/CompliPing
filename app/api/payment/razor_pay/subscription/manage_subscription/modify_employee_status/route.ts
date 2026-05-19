import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { access_role, auth_middleware } from '@/app/backend/helper/auth';
import { errorResponse, successResponse } from '@/app/backend/helper/responseFormat';

export async function POST(req: NextRequest) {
  try {
    const auth_check: any = await auth_middleware(
      req,
      access_role.access_role_partner
    );
    const body = await req.json();
    const { user_id, status } = body;
    const update_subscribe_user = await prisma.subscriber_User.updateMany({
      where: {
        user_id: user_id,
      },
      data: {
        status: status,
      },
    });
    const subscriber_user = await prisma.subscriber_User.findFirst({
      where: {
        user_id: user_id,
      },
      include: {
        subscription: true,
      },
    });
    successResponse(subscriber_user, 'Subscriber User Updated', 200);
  } catch (error) {
    console.error('Create error:', error);
    errorResponse(error, 'Failed to Update Subscriber User', 500)
  }
}
