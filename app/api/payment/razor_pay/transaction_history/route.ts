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
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') as string) || 1; // Example: from query params
    const limit = parseInt(searchParams.get('limit') as string) || 10; // Number of records per page
    const skip = (page - 1) * limit;
    const transaction_history = await prisma.subscriptionPayment.findMany({
      where: {
        subscription: {
          company_id: company_id,
        },
        ...(search
          ? {
            transaction_id: search,
          }
          : {}),
      },
      select: {
        subscription: {
          include: {
            plan: true,
            subscriberUsers: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                  },
                },
              },
            },
          },
        },
        transaction_id: true,
        amount: true,
        card_email: true,
        card_phone_number: true,
        currency: true,
        payment_date: true,
        user_count: true,
        status: true,
      },
      skip,
      take: limit,
    });
    const transformed_history = transaction_history.map(transaction => ({
      ...transaction,
      status:
        transaction.status === 'captured' ? 'success' : transaction.status,
    }));
    const totalCount = await prisma.subscriptionPayment.count({
      where: {
        subscription: {
          company_id: company_id,
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
      transformed_history,

      'Transaction History Found',
      200,
      pagination,
    )
  } catch (error) {
    console.error('Create error:', error);
    errorResponse(error, 'Failed to Get Transaction History', 500);
  }
}
