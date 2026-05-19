import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const sesClient = new SESClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
interface SendEmailParams {
  to: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
}
export async function uploadToS3({
  buffer,
  filePath,
  contentType,
}: {
  buffer: Buffer;
  filePath: string;
  contentType: string;
}) {
  const key = `staging/${filePath}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  try {
    await s3.send(command);

    // IMPORTANT: return ONLY key (not public URL)
    return { key };
  } catch (error: any) {
    console.log(error);
    return { error: error.message || "Upload failed" };
  }
}
export async function getPresignedUrl(key: string, expiresInSeconds = 60) {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3, command, {
      expiresIn: expiresInSeconds, // e.g., 60 seconds
    });

    return { signedUrl };
  } catch (error: any) {
    return { error: error.message || 'Failed to generate signed URL' };
  }
}

export async function deleteFromS3(filePath: string) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: filePath,
  });

  try {
    const result = await s3.send(command);
    return { success: true };
  } catch (error: any) {
    console.error('S3 delete error:', error);
    return { error: error.message || 'Delete failed' };
  }
}

export async function sendEmail({
  to,
  subject,
  htmlBody,
  textBody,
}: SendEmailParams): Promise<void> {
  const command = new SendEmailCommand({
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: htmlBody,
        },
        Text: {
          Charset: 'UTF-8',
          Data: textBody || '',
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
    Source: process.env.AWS_SES_EMAIL_FROM!,
  });

  await sesClient.send(command);
}
