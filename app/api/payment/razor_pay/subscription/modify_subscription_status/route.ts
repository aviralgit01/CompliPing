import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RAZOR_PAY } from '@/app/backend/helper/razorPayHelper';
import { errorResponse, successResponse } from '@/app/backend/helper/responseFormat';

const razorpay = RAZOR_PAY();

export async function GET(request: Request) {
  try {
    // const user = await getAuthUser(request);
    // const auth_check = await auth_middleware(
    //     user,
    //     access_role.access_public_hoilday_management_role
    // );
    // if (!auth_check) {
    //     return NextResponse.json(
    //         formatErrorResponse('Unauthorized', 'Unauthorized to use this API')
    //     );
    // }
    const { searchParams } = new URL(request.url);
    const subscription_id = searchParams.get('subscription_id') as string;
    const type = searchParams.get('type') as string;
    if (type) {
      if (type == 'cancel') {
        const cancel_subscription =
          await razorpay.cancelSubscription(subscription_id);
        successResponse(

          cancel_subscription,
          'Subscription Cancelled Successfully', 200
        )
      } else if (type == 'pause') {
        const pause_subscription =
          await razorpay.pauseSubscription(subscription_id);
        successResponse(
          pause_subscription,
          'Subscription Paused Successfully', 200
        )
      } else if (type == 'resume') {
        const resume_subscription =
          await razorpay.resumeSubscription(subscription_id);
        successResponse(
          resume_subscription,
          'Subscription Resumed Successfully', 200
        )
      } else {
        return successResponse(null, 'Type not Found', 404);
      }
    }
  } catch (error) {
    errorResponse(
      error,
      'Failed to Modify Status of Subscription',
      500
    )
  }
}
