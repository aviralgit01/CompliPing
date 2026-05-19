import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma'; // Adjust path as needed // Adjust path as needed
import { RAZOR_PAY_WEBHOOK, RazorpayWebhookPayload } from '@/app/backend/helper/razorPayHelper';
import { errorResponse, successResponse } from '@/app/backend/helper/responseFormat';

const razorpay_webhook = RAZOR_PAY_WEBHOOK();
export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await request.text();
    const signature: string = request.headers.get('x-razorpay-signature') as string;

    if (!signature) {
      console.error('Missing Razorpay signature');
      errorResponse(
        'Missing signature',
        'Webhook signature is required', 500
      );
    }

    // Verify webhook signature
    if (!razorpay_webhook.verifyWebhookSignature(body, signature)) {
      console.error('Invalid webhook signature');

      errorResponse(
        'Invalid signature',
        'Webhook signature verification failed', 500
      );
    }

    // Parse webhook payload
    const payload: RazorpayWebhookPayload = JSON.parse(body);
    const { event, payload: eventPayload } = payload;

    console.log('Received webhook event:', event);

    // Handle different subscription events
    switch (event) {
      case razorpay_webhook.SubscriptionEvents.SUBSCRIPTION_Authenticated:
        await razorpay_webhook.handleSubscriptionAuthenticated(
          eventPayload.subscription.entity
        );
        break;
      case razorpay_webhook.SubscriptionEvents.SUBSCRIPTION_CREATED:
        await razorpay_webhook.handleSubscriptionCreated(
          eventPayload.subscription.entity
        );
        break;

      case razorpay_webhook.SubscriptionEvents.SUBSCRIPTION_ACTIVATED:
        await razorpay_webhook.handleSubscriptionActivated(
          eventPayload.subscription.entity
        );
        break;

      case razorpay_webhook.SubscriptionEvents.SUBSCRIPTION_CHARGED:
        await razorpay_webhook.handleSubscriptionCharged(
          eventPayload.subscription.entity,
          eventPayload.payment?.entity
        );
        break;

      case razorpay_webhook.SubscriptionEvents.SUBSCRIPTION_COMPLETED:
        console.log('completed');
        console.log(eventPayload.subscription);
        console.log(eventPayload.payment);

        // await prisma.subscription.update({
        //   where: { razorpay_subscription_id: eventPayload.subscription.entity.id },
        //   data: {
        //     status: SubscriptionStatus.COMPLETED,
        //     ended_at: eventPayload.subscription.entity.ended_at
        //       ? new Date(eventPayload.subscription.entity.ended_at * 1000)
        //       : null,
        //     updated_at: new Date(),
        //   },
        // });
        break;

      case razorpay_webhook.SubscriptionEvents.SUBSCRIPTION_CANCELLED:
        await razorpay_webhook.handleSubscriptionCancelled(
          eventPayload.subscription.entity
        );
        break;

      case razorpay_webhook.SubscriptionEvents.SUBSCRIPTION_PAUSED:
        await razorpay_webhook.handleSubscriptionPaused(
          eventPayload.subscription.entity
        );
        break;

      case razorpay_webhook.SubscriptionEvents.SUBSCRIPTION_RESUMED:
        await razorpay_webhook.handleSubscriptionResumed(
          eventPayload.subscription.entity
        );
        break;

      case razorpay_webhook.SubscriptionEvents.SUBSCRIPTION_PENDING:
        console.log('pending');
        await razorpay_webhook.handleSubscriptionPending(
          eventPayload.subscription.entity
        );
        // await prisma.subscription.update({
        //   where: { razorpay_subscription_id: eventPayload.subscription.entity.id },
        //   data: {
        //     status: SubscriptionStatus.CREATED,
        //     updated_at: new Date(),
        //   },
        // });
        break;

      case razorpay_webhook.SubscriptionEvents.SUBSCRIPTION_HALTED:
        console.log('halted');
        await razorpay_webhook.handleSubscriptionHalted(
          eventPayload.subscription.entity
        );
        break;

      case razorpay_webhook.SubscriptionEvents.PAYMENT_FAILED:
        await razorpay_webhook.handlePaymentFailed(
          eventPayload.payment?.entity
        );
        break;

      case razorpay_webhook.SubscriptionEvents.PAYMENT_AUTHORIZED:
        await razorpay_webhook.handlePaymentAuthorized(
          eventPayload.payment?.entity
        );
        break;

      case razorpay_webhook.SubscriptionEvents.PAYMENT_CAPTURED:
        await razorpay_webhook.handlePaymentCaptured(
          eventPayload.payment?.entity
        );
        break;
      case razorpay_webhook.SubscriptionEvents.INVOICE_PAID:
        await razorpay_webhook.handleInvoicePaid(eventPayload.payment?.entity);
        break;
      default:
        console.log('Unhandled webhook event:', event);
        break;
    }

   successResponse(null, 'Webhook processed successfully',200);
  } catch (error) {
    console.error('Webhook processing error:', error);
    errorResponse(error, 'Failed to process webhook',500);
  }
}
