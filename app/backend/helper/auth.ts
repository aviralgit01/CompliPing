// src/lib/jwt.ts
import jwt from 'jsonwebtoken';
import * as jose from 'jose';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkSessionExistMiddleware } from '../middleware/checkSessionExist';
import { errorResponse } from './responseFormat';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const encoder = new TextEncoder();
const secretKey = encoder.encode(JWT_SECRET);
export function createToken(payload: object): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err || !token) return reject(err);
      resolve(token);
    });
  });
}
export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jose.jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new Error('Invalid token');
  }
};

export const getAuthUser = async (request: NextRequest) => {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.replace('Bearer ', '');
    await checkSessionExistMiddleware(request, token);
    const decoded = await verifyToken(token);
    const user = await prisma.user.findFirst({
      where: {
        id: (decoded as { userId: string }).userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        tenant: {
          select: {
            id: true,
            firmName: true,
            ownerName: true,
            phone: true,
            city: true,
            icaiNumber: true,
          }
        }
      }
    });
    if (!user || user.status === "INACTIVE") {
      // Token is considered invalid if user is inactive
      return null;
    }

    return user;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
};

export const authorizeRole = (
  user: any | null,
  allowedRoles: string[]
): boolean => {
  if (!user) return false;
  return allowedRoles.includes(user.role);
};

export const auth_data = async (user: any, role: any) => {
  if (!user) {
    return false;
  }
  const auth_name = user.name;
  const auth_user_id = user.id;
  const auth_user_email = user.email;
  const auth_user_role = user.role;
  const auth_user_status = user.status;
  let auth_tenant_id = null;
  let auth_user_firm_name = null;
  let auth_user_owner_name = null;
  let auth_user_phone = null;
  let auth_user_city = null;
  let auth_user_icaiNumber = null;
  if (user.tenant != null) {
    auth_tenant_id = user.tenant.id;
    auth_user_firm_name = user.tenant.firmName;
    auth_user_owner_name = user.tenant.ownerName;
    auth_user_phone = user.tenant.phone;
    auth_user_city = user.tenant.city;
    auth_user_icaiNumber = user.tenant.icaiNumber;
  }
  if (!authorizeRole(user, role)) {
    return false;
  }
  const data = {
    auth_name,
    auth_user_id,
    auth_user_email,
    auth_user_role,
    auth_user_status,
    auth_tenant_id,
    auth_user_firm_name,
    auth_user_owner_name,
    auth_user_phone,
    auth_user_city,
    auth_user_icaiNumber,
  };
  return data;
};

export const access_role = {
  access_role_partner: [
    "PARTNER",
    "SUPER_ADMIN"
  ]
};

export const auth_middleware = async (request: NextRequest,
  access_role: string[]) => {
  const user = await getAuthUser(request);
  const auth_check = await auth_data(user, access_role);
  if (!auth_check) {
    return errorResponse(null, "Unauthorized", 401);
  } else {
    return auth_check;
  }
};