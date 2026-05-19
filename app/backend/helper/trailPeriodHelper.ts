import { prisma } from "@/lib/prisma";

export async function trailPeriodHelper(user_id:string,planId:string){
    const plan:any = await prisma.plan.findUnique({ where: { id: planId } });
       const trail_day = plan.trailDays as number;
        console.log(trail_day);
        const now = new Date();
    
        // start of today in UTC
        const trialStartsAt = new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
        );
    
        // clone start date
        const trialEndsAt = new Date(trialStartsAt);
    
        // add trial days
        trialEndsAt.setUTCDate(trialEndsAt.getUTCDate() + Number(trail_day));
    
        // safety check
        if (isNaN(trialEndsAt.getTime())) {
          throw new Error('Invalid trialEndsAt date');
        }
        const create_subscription = await prisma.subscription.create({
          data: {
            status: 'ACTIVE',
            trialStartsAt: trialStartsAt,
            trialEndsAt: trialEndsAt,
            planId: planId,
            created_by: user_id,
          },
        });
        return true;
}