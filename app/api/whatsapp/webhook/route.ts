import axios from "axios";
import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "@/app/backend/helper/awsHelper";
import { parseWhatsAppNumber } from "@/app/backend/helper/phoneNumberHelper";
import { prisma } from "@/lib/prisma";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

// ✅ Use /tmp for serverless compatibility (Vercel, AWS Lambda, etc.)
const downloadDir = "/Users/ujjanjoshi/Atticbits-Code/CompliPing-Pro/data-downloads";
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

/**
 * ✅ VERIFY WEBHOOK
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

/**
 * 📩 RECEIVE MESSAGES
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // console.log("Webhook body:", JSON.stringify(body, null, 2));

    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    // Handle status updates
    if (value?.statuses?.length > 0) {
      for (const status of value.statuses) {
        const metaId = status.id;
        const newStatus = status.status.toUpperCase();

        console.log(`📱 [WhatsApp] Message ${metaId} is now ${newStatus}`);

        if (metaId) {
          try {
            await prisma.messageLog.updateMany({
              where: {metaMessageId: metaId},
              data: {status: newStatus}
            });
          } catch (dbError) {
            console.error("Error updating message status in DB:", dbError);
            
          }
        }     
      }
      return NextResponse.json({ success: true });
    }

    // Handle incoming messages
    if (value?.messages?.length > 0) {
      const message = value.messages[0];

      if (message.type === "text") {
        console.log("Text:", message.text?.body);
      }

      if (message.type === "document") {
        const filename = message.document.filename || "file.pdf";
        const url = message.document.url;
        const phoneNumber = message.from;
        const formatted_number = parseWhatsAppNumber(phoneNumber).nationalNumber as string;
        if (formatted_number != null) {
          const check_client:any = await prisma.client.findFirst({
            where: {
              phone: formatted_number
            }
          });
          if (check_client) {
            await downloadFile(url, filename,formatted_number,check_client.id);

          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
/**
 * 📥 DOWNLOAD FILE
 */
async function downloadFile(
  url: string,
  filename: string,
  phoneNumber: string,
  client_id: string
): Promise<void> {
  try {
    // 1. Download file as BUFFER (NOT stream)
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      },
      responseType: "arraybuffer",
    });

    const buffer = Buffer.from(response.data);

    // 2. Create S3 file path
    const filePath = `${phoneNumber}/${Date.now()}-${filename}`;

    // 3. Upload to S3
    const result = await uploadToS3({
      buffer,
      filePath,
      contentType: response.headers["content-type"] || "application/octet-stream",
    });

    if ("error" in result) {
      console.error("S3 upload failed:", result.error);
      return;
    }
    // (optional) here you can save to DB
   const data= await prisma.clientDocument.create({
      data:{
        client_id:client_id,
        file_key:result.key,
        file_name:filename
      }
    });

  } catch (error) {
    console.error("❌ downloadFile error:", error);
  }
}