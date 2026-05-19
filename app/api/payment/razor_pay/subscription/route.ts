import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RAZOR_PAY } from '@/app/backend/helper/razorPayHelper';
import { access_role, auth_middleware } from '@/app/backend/helper/auth';
import { generateUUID } from '@/app/backend/helper/generalHelper';
import { errorResponse, successResponse } from '@/app/backend/helper/responseFormat';

const razorpay = RAZOR_PAY();
export async function POST(req: NextRequest) {
  try {
    const auth_check: any = await auth_middleware(
      req,
      access_role.access_role_partner
    );
    const body = await req.json();
    const user_id = auth_check.auth_user_id;
    const company_id = auth_check.auth_company_id;
    const { razor_pay_plan_id, plan_id, total_count, quantity, notes, status, amount } =
      body;
    const taxRate = 0.18;

    const tax = amount * taxRate;
    const uuid = generateUUID();
    notes.uuid = uuid;
    const data = {
      plan_id: razor_pay_plan_id,
      total_count: total_count,
      quantity: quantity,
      customer_notify: true,
      notes: notes,
      addons: [
        {
          item: {
            name: 'GST (18%)',
            amount: Math.round(tax * 100), // in paise
            currency: 'INR',
          },
        },
      ],
    };
    const plan: any = await prisma.plan.findFirst({
      where: {
        id: plan_id,
      },
    });
    const create_subscriptions = await razorpay.createSubscription(data);
    console.log(create_subscriptions);
    const check_subsciption = await prisma.subscription.findFirst({
      where: {
        created_by: user_id,
      },
    });
    if (check_subsciption) {
      const store_subscription = await prisma.subscription.updateMany({
        where: {
          created_by: user_id,
        },
        data: {
          subscription_id: create_subscriptions.id,
          created_by: user_id,
          amount: plan?.price * quantity,
          created_users: quantity,
          company_id: company_id,
          planId: plan_id,
          subscription_data: create_subscriptions,
          status: status,
        },
      });

      // users.forEach(async (user_id: any) => {
      //   await prisma.subscriber_User.create({
      //     data: {
      //       subscription_id: create_subscriptions.id,
      //       user_id: user_id,
      //       status: 'deactive',
      //       reference_id: uuid,
      //     },
      //   });
      // });
      const check_subsciption = await prisma.subscription.findFirst({
        where: {
          created_by: user_id,
        },
      });

      return successResponse(
        check_subsciption,
        'Subscription Created Sucessfully',
        201
      )
    } else {
      const store_subscription = await prisma.subscription.create({
        data: {
          subscription_id: create_subscriptions.id,
          created_by: user_id,
          amount: plan?.price * quantity,
          created_users: quantity,
          company_id: company_id,
          planId: plan_id,
          subscription_data: create_subscriptions,
          status: status,
        },
      });
      return successResponse(
        store_subscription,
        'Subscription Created Sucessfully', 201
      )
    }
  } catch (error) {
    console.error('Create error:', error);

    return errorResponse(error, 'Failed to Create Plan', 500)
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth_check: any = await auth_middleware(
      req,
      access_role.access_role_partner
    );
    const { searchParams } = new URL(req.url);
    const company_id: any = auth_check.auth_company_id as string;
    const page = parseInt(searchParams.get('page') as string) || 1; // Example: from query params
    const limit = parseInt(searchParams.get('limit') as string) || 10; // Number of records per page
    const skip = (page - 1) * limit;
    const subscription_id = searchParams.get('subscription_id') as string;
    if (subscription_id || subscription_id != null) {
      const subscription = await prisma.subscription.findFirst({
        where: {
          subscription_id: subscription_id,
        },
        include: {
          subscriberUsers: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          subscriptionPayments: true,
          plan: true,
        },
      });
      return successResponse(subscription, 'Data Found Successfully', 200)

    } else {
      const subscription = await prisma.subscription.findMany({
        where: {
          company_id: company_id,
        },
        include: {
          subscriberUsers: {
            select: {
              status: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          subscriptionPayments: true,
          plan: true,
        },
        skip,
        take: limit,
      });
      const totalCount = await prisma.subscription.count({
        where: {
          subscription_id: subscription_id,
        },
      });
      const totalPages = Math.ceil(totalCount / limit);
      const pagination = {
        total: totalCount,

        page: page,
        limit,
        totalPages,
      };
      // pagination?: {
      //   total: number;
      //   page: number;
      //   limit: number;
      //   totalPages: number;
      // }

      return successResponse(
        subscription,
        'Data Found Successfully',
        200,
        pagination,
      )
    }
    // const to = searchParams.get('to');
  } catch (error) {
    console.error('Get error:', error);
    return errorResponse(error, 'Failed to Get Data', 500)
  }
}

