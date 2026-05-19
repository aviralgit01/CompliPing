import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { compare, hash } from 'bcryptjs';
import { errorResponse, successResponse } from '@/app/backend/helper/responseFormat';
import { access_role, auth_middleware } from '@/app/backend/helper/auth';

export async function POST(request: NextRequest) {
    try {
        const auth_check: any = await auth_middleware(request, access_role.access_role_partner);
        const user_id = auth_check.auth_user_id;
        const body = await request.json();
        const { password, new_password, confirm_password } = body;
        // Return all companies as [{ label: name }]
        const db_user: any = await prisma.user.findFirst({
            where: { id: user_id },
        });
        if (new_password != confirm_password) {
            return errorResponse(
                null,
                'Password doesnot match with Confirm_Password',
                400
            );
        }

        const password_hash = await hash(new_password, 10);
        if (db_user) {
            const isValidPassword = await compare(password, db_user.passwordHash);
            if (!isValidPassword) {
                return
                errorResponse(null, 'Old Password doesnot match', 400)
                    ;
            }
            await prisma.user.update({
                where: { id: user_id },
                data: {
                    passwordHash: password_hash,
                },
            });
        }
        await prisma.userSession.deleteMany({
            where: {
                userId: user_id,
            },
        });
        return successResponse(user_id, 'Password Changed Successfully', 200);
    } catch (error: any) {
        console.error('Get error:', error);
        return errorResponse(error, 'Failed to Change Password', 500);
    }
}
