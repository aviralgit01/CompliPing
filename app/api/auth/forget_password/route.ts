import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt, { hash } from 'bcryptjs';
import { errorResponse, successResponse } from '@/app/backend/helper/responseFormat';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, conform_password, email } = body;

    const user_exist = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user_exist) {

      return errorResponse(
        null,
        'This email address is not registered in our system.',
        400
      )

    } else {
      if (password != conform_password) {

        return errorResponse(null, 'Password Doesnot Match', 400)

      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          passwordHash: hashedPassword,
        },
      });
      await prisma.userSession.deleteMany({
        where: {
          userId: user_exist.id,
        },
      });

      return successResponse(null, 'Password Reset Successfully', 201)

    }
  } catch (error: any) {
    console.error('Create error:', error);
    return errorResponse(error, 'Failed!!', 500);
  }
}
