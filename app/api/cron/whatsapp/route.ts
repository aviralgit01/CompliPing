import {NextRequest, NextResponse} from "next/server";
import { successResponse, errorResponse } from "@/app/backend/helper/responseFormat";
import { prisma } from "@/lib/prisma";
import { sendMessage } from "@/app/backend/helper/whatsappHelper";

export async function GET(req: NextRequest)
{
  try {
    
    const authHeader = req.headers.get("authorization");
    const expectedSecret = `Bearer ${process.env.CRON_SECRET}`;

    if(authHeader !== expectedSecret)
    {
      console.warn("Unauthorized attemp to triggert whatsapp cron!");
      return errorResponse(null, "Unauthorized cron trigger", 401);
    }

    console.log(" =================================== ");
    console.log(`[SYSTEM] Starting Daily Whatsapp Sweep at ${new Date().toISOString()}`);
    console.log(" =================================== ");

    const eligibleTasks = await prisma.complianceItem.findMany({
      where: {
        status: "PENDING",
        isDeleted: false,
        isRemindersPaused: false,
        client: {
          isRemindersPaused: false,
          isDeleted: false
        }
      },
      include: {
        client: true,
        tenant: true
      }
    });

    console.log(`Found ${eligibleTasks.length} pending tasks to evaluate for today`);
    
    let messagesPrepared = 0;

    for (const task of eligibleTasks) {

      const due = new Date(task.dueDate);
      due.setHours(0,0,0,0);

      const today = new Date();
      today.setHours(0,0,0,0);

      const diffTime = due.getTime() -today.getTime();
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 *60 *24));

      let reminderType: string | null = null;
      let templateName: string | null = null;

      if (daysRemaining === 30) {
        reminderType = "30_DAY";
        templateName = "reminder_30_day";
      } else if (daysRemaining === 7) {
        reminderType = "7_DAY";
        templateName = "reminder_7_day";
      } else if (daysRemaining === 3) {
        reminderType = "3_DAY";
        templateName = "reminder_3_day";
      } else if (daysRemaining === 1) {
        reminderType = "1_DAY";
        templateName = "reminder_1_day";
      } else if (daysRemaining === 0) {
        reminderType = "DUE_TODAY";
        templateName = "reminder_due_today";
      }

      if (!reminderType || !templateName) continue;
      
      const existingLog = await prisma.messageLog.findFirst({
        where: {
          complianceItemId: task.id,
          messageType: reminderType,
          status: {
            not: "FAILED"
          }
        }
      });

      if (existingLog) {
        console.log(`[SKIP] ${reminderType} reminder already sent for Task ${task.id}`);
        continue;
      }

      // connecting meta and update ledger

      console.log(`[SENDING] Task: ${task.type} |Client: ${task.client.name} | Action: ${reminderType}`);

      // const templateComponents: any = [
      //   {
      //     type: "body",
      //     parameters: [
      //       { type: "text", text: task.client.name},
      //       {type: "text", text: task.type}
      //     ]
      //   }
      // ];

      const templateComponents: any = [];

      const waResponse = await sendMessage(
        process.env.PHONE_NUMBER_ID as string, 
        //task.client.phone,
        "9779860900731",
        // templateName,
        "hello_world",
        templateComponents
      );

if (waResponse.success) {
        await prisma.messageLog.create({
          data: {
            messageType: reminderType,
            content: `Sent template_testing template`, 
            status: "SENT",
            clientId: task.client.id,
            complianceItemId: task.id,
            tenantId: task.tenantId,
            metaMessageId: waResponse.data?.messages?.[0]?.id
          }
        });
        messagesPrepared++;
        console.log(`[SUCCESS] Message sent and logged for Task ${task.id}`);
      } else {
        await prisma.messageLog.create({
          data: {
            messageType: reminderType,
            content: `Failed to send template_testing`,
            status: "FAILED",
            errorLog: JSON.stringify(waResponse.error),
            clientId: task.client.id,
            complianceItemId: task.id,
            tenantId: task.tenantId,
          }
        });
        console.error(`[FAILED] WhatsApp API rejected message for Task ${task.id}:`, waResponse.error);
      }
      
    }

    return successResponse(
      {
        evaluateCount: eligibleTasks.length,
        actionableCount: messagesPrepared
      },
      "WhatsApp Daily Sweep executed successfully",
      200
    );
    
  } catch (error) {
    console.error("Whatsapp cron error", error);
    return errorResponse(error, "failed to execute whatsapp sweep",500) ; 
  }
}