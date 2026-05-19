import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RAZOR_PAY } from '@/app/backend/helper/razorPayHelper';
import { access_role, auth_middleware } from '@/app/backend/helper/auth';
import { errorResponse, successResponse } from '@/app/backend/helper/responseFormat';

const razorpay = RAZOR_PAY();
export async function POST(req: NextRequest) {
  try {
    const auth_check: any = await auth_middleware(
      req,
      access_role.access_role_partner
    );

    const body = await req.json();
    const { period, interval, name, amount, currency, description, notes } =
      body;
    const data = {
      period,
      interval,
      item: {
        name,
        amount: amount * 100, // in paise (₹699.00)
        currency,
        description,
      },
      notes,
    };
    const create_plan = await razorpay.createPlan(data);
    const store_plan = await prisma.plan.create({
      data: {
        razor_pay_plan_id: create_plan.id,
        currency: create_plan.item?.currency || currency,
        description: create_plan.item?.description || description,
        price: create_plan.item?.amount
          ? create_plan.item.amount / 100
          : amount,
        interval_count: create_plan.interval,
        interval: create_plan.period,
        recurring_amount: create_plan.item?.amount
          ? create_plan.item.amount / 100
          : amount,
        name: create_plan.item?.name || name,
        plan_data: create_plan,
        created_by: auth_check.auth_user_id,
      },
    });

    return successResponse(store_plan, 'Plan Created Sucessfully', 201)

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
    const plan_id = searchParams.get('plan_id');
    const page = parseInt(searchParams.get('page') as string) || 1; // Example: from query params
    const limit = parseInt(searchParams.get('limit') as string) || 10; // Number of records per page
    const skip = (page - 1) * limit;
    if (plan_id || plan_id != null) {
      const plan = await prisma.plan.findFirst({
        where: {
          razor_pay_plan_id: plan_id,
        },
      });

      return successResponse(plan, 'Data Found Successfully')

    } else {
      const plan = await prisma.plan.findMany({
        skip: skip,
        take: limit,
      });
      const totalCount = await prisma.plan.count({});
      const totalPages = Math.ceil(totalCount / limit);
      const pagination = {
        total: totalCount,
        page: page,
        limit,
        totalPages,
      };
      //   total: number;
      // page: number;
      // limit: number;
      // totalPages: number;


      return successResponse(
        plan,
        'Data Found Successfully',
        200, pagination
      )

    }
  } catch (error) {
    console.error('Get error:', error);
    return errorResponse(error, 'Failed to Get Data', 500)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth_check: any = await auth_middleware(
      req,
      access_role.access_role_partner
    );
    const { searchParams } = new URL(req.url);
    const plan_id = searchParams.get('plan_id');

    if (!plan_id) {
      return errorResponse(null, 'ID is required', 400)
    }
    const plan = await prisma.plan.findFirst({
      where: { id: plan_id },
    });
    if (!plan) {
      return errorResponse(null, 'Plan not found', 400)
    }

    // Delete company
    await prisma.plan.deleteMany({
      where: { id: plan_id },
    });

    return successResponse(plan_id, 'Plan Deleted Successfully', 200)

  } catch (error) {
    console.error('Delete error:', error);

    return errorResponse(error, 'Failed to Delete Plan', 500)

  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth_check: any = await auth_middleware(
      req,
      access_role.access_role_partner
    );
    const body = await req.json();
    const {
      id,
      name,
      description,
      price_per_user,
      currency,
      trail_day,
      interval,
      interval_count,
    } = body;

    if (!id) {

      return errorResponse(null, 'Plan ID required', 400)

    }

    const existingPlan: any = await prisma.plan.findUnique({
      where: { id: id },
    });

    if (!existingPlan) {

      return errorResponse(null, 'Plan Not Found', 400)

    }
    const updatedPlan = await prisma.plan.update({
      where: { id: id },
      data: {
        name,
        description,
        price: price_per_user,
        currency,
        interval,
        interval_count,
        trailDays: trail_day ? trail_day : existingPlan?.trailDays,
      },
    });


    return successResponse(updatedPlan, 'Plan Updated Successfully', 200)

  } catch (error) {
    console.error('Update error:', error);

    return errorResponse(error, 'Failed to Update Plan', 500)

  }
}
