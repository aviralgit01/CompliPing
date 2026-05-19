import { access_role, auth_middleware } from '@/app/backend/helper/auth';
import { errorResponse, successResponse } from '@/app/backend/helper/responseFormat';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(req: NextRequest) {
  try {
    const auth_check: any = await auth_middleware(
      req,
      access_role.access_role_partner
    );
    const user_id = auth_check.auth_user_id;
    const company_id = auth_check.auth_company_id;

    const { searchParams } = new URL(req.url);
    const transaction_id = searchParams.get('transaction_id');
    const page = parseInt(searchParams.get('page') as string) || 1; // Example: from query params
    const limit = parseInt(searchParams.get('limit') as string) || 10; // Number of records per page
    const skip = (page - 1) * limit;
    const transaction_history = await prisma.subscriber_User.findMany({
      where: {
        subscription: {
          company_id: company_id,
          subscriptionPayments: {
            every: {
              transaction_id: transaction_id,
            },
          },
        },
      },
      select: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      skip,
      take: limit,
    });
    const totalCount = await prisma.subscriber_User.count({
      where: {
        subscription: {
          company_id: company_id,
          subscriptionPayments: {
            every: {
              transaction_id: transaction_id,
            },
          },
        },
      },
    });
    const totalPages = Math.ceil(totalCount / limit);
    const pagination = {
      total: totalCount,
      totalPages,
      page: page,
      limit,
    };
    successResponse(
      transaction_history,

      'User Found Sucessfully', 200, pagination,
    )
  } catch (error) {
    console.error('Create error:', error);
    errorResponse(error, 'Failed to Get User', 500)
  }
}
