import { Prisma } from '@/lib/generated/prisma';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { generateUUID } from './generalHelper';

const razorpay_webhook_secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
const razor_pay_key_id = process.env.RAZOR_PAY_KEY_ID!;
const razor_pay_secert = process.env.RAZOR_PAY_SECERT!;
const razor_pay_url = process.env.RAZOR_PAY_URL!;

const auth = Buffer.from(`${razor_pay_key_id}:${razor_pay_secert}`).toString(
  'base64'
);

export interface RazorpayWebhookPayload {
  event: string;
  payload: {
    subscription: {
      entity: {
        id: string;
        plan_id: string;
        customer_id: string;
        status: string;
        current_start: number;
        current_end: number;
        ended_at: number | null;
        quantity: number;
        notes: Record<string, any>;
        charge_at: number;
        start_at: number;
        end_at: number;
        auth_attempts: number;
        total_count: number;
        paid_count: number;
        customer_notify: boolean;
        created_at: number;
        expire_by: number;
        short_url: string;
        has_scheduled_changes: boolean;
        change_scheduled_at: number | null;
        source: string;
        offer_id: string | null;
        remaining_count: number;
      };
    };
    payment?: {
      entity: {
        id: string;
        amount: number;
        currency: string;
        status: string;
        method: string;
        captured: boolean;
        description: string;
        created_at: number;
        fee: number;
        tax: number;
        error_code: string | null;
        error_description: string | null;
        error_source: string | null;
        error_step: string | null;
        error_reason: string | null;
      };
    };
  };
  created_at: number;
}

//razor_pay api
export const RAZOR_PAY = () => {
  const createPlan = async (request: any) => {
    try {
      const razorpayRes = await fetch(razor_pay_url + '/v1/plans', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await razorpayRes.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  const getPlans = async () => {
    try {
      const razorpayRes = await fetch(razor_pay_url + '/v1/plans', {
        method: 'GET',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await razorpayRes.json();
      console.log(data);
      if (!razorpayRes.ok) {
        return false;
      }

      return data;
    } catch (error) {
      return false;
    }
  };

  const getPlanByID = async (plan_id: string) => {
    try {
      const razorpayRes = await fetch(razor_pay_url + '/v1/plans/' + plan_id, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await razorpayRes.json();
      console.log(data);
      if (!razorpayRes.ok) {
        return false;
      }

      return data;
    } catch (error) {
      return false;
    }
  };

  const createSubscription = async (response: any) => {
    try {
      const razorpayRes = await fetch(razor_pay_url + '/v1/subscriptions', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify({
        //     plan_id: "plan_QsozT9KDpEpfpM",
        //     total_count: 6,
        //     quantity: 1,
        //     customer_notify: true,
        //     notes: {
        //         notes_key_1: "Tea, Earl Grey, Hot",
        //         notes_key_2: "Tea, Earl Grey… decaf."
        //     }
        // }),
        body: JSON.stringify(response),
      });

      const data = await razorpayRes.json();
      return data;
    } catch (error) {
      return false;
    }
  };

  const getSubscriptions = async () => {
    try {
      const razorpayRes = await fetch(razor_pay_url + '/v1/subscriptions/', {
        method: 'GET',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await razorpayRes.json();
      console.log(data);
      if (!razorpayRes.ok) {
        return false;
      }

      return data;
    } catch (error) {
      return false;
    }
  };

  const getSubscriptionByID = async (subscription_id: string) => {
    try {
      const razorpayRes = await fetch(
        razor_pay_url + '/v1/subscriptions/' + subscription_id,
        {
          method: 'GET',
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await razorpayRes.json();
      console.log(data);
      return data;
    } catch (error) {
      return false;
    }
  };
  const cancelSubscription = async (subscription_id: string) => {
    try {
      const razorpayRes = await fetch(
        razor_pay_url + '/v1/subscriptions/' + subscription_id + '/cancel',
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cancel_at_cycle_end: true,
          }),
        }
      );

      const data = await razorpayRes.json();
      console.log(data);
      return data;
    } catch (error) {
      return false;
    }
  };

  const pauseSubscription = async (subscription_id: string) => {
    try {
      const razorpayRes = await fetch(
        razor_pay_url + '/v1/subscriptions/' + subscription_id + '/pause',
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pause_at: 'now',
          }),
        }
      );

      const data = await razorpayRes.json();
      console.log(data);
      return data;
    } catch (error) {
      return false;
    }
  };

  const resumeSubscription = async (subscription_id: string) => {
    try {
      const razorpayRes = await fetch(
        razor_pay_url + '/v1/subscriptions/' + subscription_id + '/pause',
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            resume_at: 'now',
          }),
        }
      );

      const data = await razorpayRes.json();
      console.log(data);
      return data;
    } catch (error) {
      return false;
    }
  };
  return {
    createPlan,
    getPlanByID,
    getPlans,
    createSubscription,
    getSubscriptionByID,
    getSubscriptions,
    cancelSubscription,
    pauseSubscription,
    resumeSubscription,
  };
};

//razor_pay webhook

export const RAZOR_PAY_WEBHOOK = () => {
  enum SubscriptionEvents {
    SUBSCRIPTION_Authenticated = 'subscription.authenticated',
    SUBSCRIPTION_CREATED = 'subscription.created',
    SUBSCRIPTION_ACTIVATED = 'subscription.activated',
    SUBSCRIPTION_CHARGED = 'subscription.charged',
    SUBSCRIPTION_COMPLETED = 'subscription.completed',
    SUBSCRIPTION_CANCELLED = 'subscription.cancelled',
    SUBSCRIPTION_PAUSED = 'subscription.paused',
    SUBSCRIPTION_RESUMED = 'subscription.resumed',
    SUBSCRIPTION_PENDING = 'subscription.pending',
    SUBSCRIPTION_HALTED = 'subscription.halted',
    PAYMENT_FAILED = 'payment.failed',
    PAYMENT_AUTHORIZED = 'payment.authorized',
    PAYMENT_CAPTURED = 'payment.captured',
    INVOICE_PAID = 'invoice.paid',
  }

  enum SubscriptionStatus {
    CREATED = 'created',
    AUTHENTICATED = 'authenticated',
    ACTIVE = 'active',
    PAUSED = 'paused',
    HALTED = 'halted',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed',
    EXPIRED = 'expired',
  }

  const verifyWebhookSignature = async (
    body: string,
    signature: string
  ): Promise<boolean> => {
    if (!razorpay_webhook_secret) {
      console.error('Razorpay webhook secret not configured');
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha256', razorpay_webhook_secret)
      .update(body)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  };

  const handleSubscriptionAuthenticated = async (subscriptionData: any) => {
    console.log('subscription_authenticate');
    console.log(subscriptionData);
  };

  const handleSubscriptionCreated = async (subscriptionData: any) => {
    console.log('subscription_created');
    console.log(subscriptionData);
  };

  const handleSubscriptionActivated = async (subscriptionData: any) => {
    console.log('subscription_activated');
    console.log(subscriptionData);
  };
  const handleSubscriptionCharged = async (
    subscriptionData: any,
    paymentData: any
  ) => {
    console.log('subscription_charged');
    console.log(subscriptionData);
    console.log('paymentData');
    console.log(paymentData);
    const startDate = new Date(subscriptionData.current_start * 1000);
    const endDate = new Date(subscriptionData.current_end * 1000);
    const subscription = await prisma.subscription.findFirst({
      where: {
        subscription_id: subscriptionData.id,
      },
    });
    if (subscription) {
      await prisma.subscription.update({
        where: {
          subscription_id: subscriptionData.id,
        },
        data: {
          trialEndsAt: null,
          trialStartsAt: null,
          customer_id: subscriptionData.customer_id,
          status: 'ACTIVE',
          currentPeriodStart: startDate,
          currentPeriodEnd: endDate,
          subscription_data: subscriptionData,
        },
      });
      const store_payment_data = await prisma.subscriptionPayment.create({
        data: {
          amount: paymentData.amount / 100,
          currency: paymentData.currency,
          status: paymentData.status,
          order_id: paymentData.order_id,
          payment_details: paymentData,
          description: paymentData.description,
          card: paymentData.card,
          customer_id: subscriptionData.customer_id,
          subscription_id: subscriptionData.id,
          payment_date: new Date(),
          card_phone_number: paymentData.contact,
          card_email: paymentData.email,
          payment_id: paymentData.id,
          transaction_id: generateUUID(),
          user_count: subscriptionData.quantity,
        },
      });
      // await prisma.subscriber_User.updateMany({
      //   where: {
      //     subscription_id: subscriptionData.id,
      //     reference_id: subscriptionData.notes.uuid,
      //   },
      //   data: {
      //     status: 'active',
      //     payment_id: store_payment_data.id,
      //   },
      // });

      // Update referral status to confirmed when user subscribes
    }
    //   await prisma.subscription_Payment.create({
    //     data:{
    //         amount:(paymentData.amount)/100,
    //         currency:paymentData.currency,
    //         payment_date:new Date(),
    //         subscription_id:subscriptionData.id,
    //         price_per_user

    //     }
    // })
  };

  const handleSubscriptionCancelled = async (subscriptionData: any) => {
    console.log('subscription_cancelled');
    console.log(subscriptionData);
    const subscription = await prisma.subscription.findFirst({
      where: {
        subscription_id: subscriptionData.id,
      },
    });
    if (subscription) {
      await prisma.subscription.update({
        where: {
          subscription_id: subscriptionData.id,
        },
        data: {
          customer_id: subscriptionData.customer_id,
          status: 'ACTIVE',
          subscription_data: subscriptionData,
          updatedAt: new Date(),
        },
      });

      // await prisma.subscriber_User.updateMany({
      //   where: {
      //     subscription_id: subscriptionData.id,
      //   },
      //   data: {
      //     status: 'deactive',
      //   },
      // });
    }
  };

  const handleSubscriptionHalted = async (subscriptionData: any) => {
    console.log('subscription_cancelled');
    console.log(subscriptionData);
    const subscription = await prisma.subscription.findFirst({
      where: {
        subscription_id: subscriptionData.id,
      },
    });
    if (subscription) {
      await prisma.subscription.update({
        where: {
          subscription_id: subscriptionData.id,
        },
        data: {
          customer_id: subscriptionData.customer_id,
          status: 'INACTIVE',
          subscription_data: subscriptionData,
          updatedAt: new Date(),
        },
      });

      // await prisma.subscriber_User.updateMany({
      //   where: {
      //     subscription_id: subscriptionData.id,
      //   },
      //   data: {
      //     status: 'deactive',
      //   },
      // });
    }
  };

  const handleSubscriptionPaused = async (subscriptionData: any) => {
    console.log('subscription_paused');
    console.log(subscriptionData);
    const subscription = await prisma.subscription.findFirst({
      where: {
        subscription_id: subscriptionData.id,
      },
    });
    if (subscription) {
      await prisma.subscription.update({
        where: {
          subscription_id: subscriptionData.id,
        },
        data: {
          customer_id: subscriptionData.customer_id,
          status: 'INACTIVE',
          subscription_data: subscriptionData,
          updatedAt: new Date(),
        },
      });
    // `  await` prisma.subscriber_User.updateMany({
    //     where: {
    //       subscription_id: subscriptionData.id,
    //     },
    //     data: {
    //       status: 'deactive',
    //     },
    //   });
    }
  };

  const handleSubscriptionPending = async (subscriptionData: any) => {
    console.log('subscription_paused');
    console.log(subscriptionData);
    const subscription = await prisma.subscription.findFirst({
      where: {
        subscription_id: subscriptionData.id,
      },
    });
    if (subscription) {
      await prisma.subscription.update({
        where: {
          subscription_id: subscriptionData.id,
        },
        data: {
          customer_id: subscriptionData.customer_id,
          status: 'INACTIVE',
          subscription_data: subscriptionData,
          updatedAt: new Date(),
        },
      });
      // await prisma.subscriber_User.updateMany({
      //   where: {
      //     subscription_id: subscriptionData.id,
      //   },
      //   data: {
      //     status: 'deactive',
      //   },
      // });
    }
  };
  const handleSubscriptionResumed = async (subscriptionData: any) => {
    console.log('subscription_resumed');
    console.log(subscriptionData);
    const subscription = await prisma.subscription.findFirst({
      where: {
        subscription_id: subscriptionData.id,
      },
    });
    if (subscription) {
      await prisma.subscription.update({
        where: {
          subscription_id: subscriptionData.id,
        },
        data: {
          customer_id: subscriptionData.customer_id,
          status: 'ACTIVE',
          subscription_data: subscriptionData,
          updatedAt: new Date(),
        },
      });
      // await prisma.subscriber_User.updateMany({
      //   where: {
      //     subscription_id: subscriptionData.id,
      //   },
      //   data: {
      //     status: 'active',
      //   },
      // });
    }
  };

  const handlePaymentFailed = async (paymentData: any) => {
    console.log('paymentData');
    console.log(paymentData);
    const subscription_payment = await prisma.subscriptionPayment.findFirst({
      select: {
        subscription_id: true,
        card: true,
      },
    });
    if (
      subscription_payment?.card &&
      typeof subscription_payment.card === 'object' &&
      !Array.isArray(subscription_payment.card)
    ) {
      const cardJson = subscription_payment.card as Prisma.JsonObject;
      const cardId = cardJson.id as string | undefined;
      console.log('Card ID:', cardId);
      if (paymentData.card_id === cardId) {
        const subscriptionData: any = await prisma.subscription.findFirst({
          where: {
            subscription_id: subscription_payment.subscription_id,
          },
        });
        await prisma.subscriptionPayment.create({
          data: {
            amount: paymentData.amount / 100,
            currency: paymentData.currency,
            status: paymentData.status,
            order_id: paymentData.order_id,
            payment_details: paymentData,
            description: paymentData.description,
            error_description: paymentData.error_description,
            card: paymentData.card,
            customer_id: subscriptionData.customer_id,
            subscription_id: subscriptionData.subscription_id,
            payment_date: new Date(),
            card_phone_number: paymentData.contact,
            card_email: paymentData.email,
            payment_id: paymentData.id,
            transaction_id: generateUUID(),
            user_count: subscriptionData.quantity,
          },
        });
      }
    }
  };

  const handlePaymentAuthorized = async (paymentData: any) => {
    console.log('paymentData');
    console.log(paymentData);
  };

  const handlePaymentCaptured = async (paymentData: any) => {
    console.log('paymentData');
    console.log(paymentData);
    const subscription_payment = await prisma.subscriptionPayment.findFirst({
      select: {
        subscription_id: true,
        card: true,
      },
    });
    if (
      subscription_payment?.card &&
      typeof subscription_payment.card === 'object' &&
      !Array.isArray(subscription_payment.card)
    ) {
      const cardJson = subscription_payment.card as Prisma.JsonObject;
      const cardId = cardJson.id as string | undefined;
      console.log('Card ID:', cardId);
      if (paymentData.card_id === cardId) {
        const subscriptionData: any = await prisma.subscription.findFirst({
          where: {
            subscription_id: subscription_payment.subscription_id,
          },
        });
        await prisma.subscriptionPayment.create({
          data: {
            amount: paymentData.amount / 100,
            currency: paymentData.currency,
            status: paymentData.status,
            order_id: paymentData.order_id,
            payment_details: paymentData,
            description: paymentData.description,
            error_description: paymentData.error_description,
            card: paymentData.card,
            customer_id: subscriptionData.customer_id,
            subscription_id: subscriptionData.subscription_id,
            payment_date: new Date(),
            card_phone_number: paymentData.contact,
            card_email: paymentData.email,
            payment_id: paymentData.id,
            transaction_id: generateUUID(),
            user_count: subscriptionData.quantity,
          },
        });
      }
    }
  };

  const handleInvoicePaid = async (paymentData: any) => {
    console.log('paymentData');
    console.log(paymentData);
    const subscription_payment = await prisma.subscriptionPayment.findFirst({
      select: {
        subscription_id: true,
        card: true,
      },
    });
    if (
      subscription_payment?.card &&
      typeof subscription_payment.card === 'object' &&
      !Array.isArray(subscription_payment.card)
    ) {
      const cardJson = subscription_payment.card as Prisma.JsonObject;
      const cardId = cardJson.id as string | undefined;
      console.log('Card ID:', cardId);
      if (paymentData.card_id === cardId) {
        const subscriptionData: any = await prisma.subscription.findFirst({
          where: {
            subscription_id: subscription_payment.subscription_id,
          },
        });
        await prisma.subscriptionPayment.create({
          data: {
            amount: paymentData.amount / 100,
            currency: paymentData.currency,
            status: paymentData.status,
            order_id: paymentData.order_id,
            payment_details: paymentData,
            description: paymentData.description,
            error_description: paymentData.error_description,
            card: paymentData.card,
            customer_id: subscriptionData.customer_id,
            subscription_id: subscriptionData.subscription_id,
            payment_date: new Date(),
            card_phone_number: paymentData.contact,
            card_email: paymentData.email,
            payment_id: paymentData.id,
            transaction_id: generateUUID(),
            user_count: subscriptionData.quantity,
          },
        });
      }
    }
  };
  return {
    SubscriptionEvents,
    SubscriptionStatus,
    verifyWebhookSignature,
    handlePaymentFailed,
    handleSubscriptionActivated,
    handleSubscriptionAuthenticated,
    handleSubscriptionCancelled,
    handleSubscriptionCharged,
    handleSubscriptionCreated,
    handleSubscriptionPaused,
    handleSubscriptionResumed,
    handlePaymentCaptured,
    handlePaymentAuthorized,
    handleSubscriptionPending,
    handleSubscriptionHalted,
    handleInvoicePaid,
  };
};
// Define subscription event types
