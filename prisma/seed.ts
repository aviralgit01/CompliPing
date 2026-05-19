import { PrismaClient } from '@/lib/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcryptjs';
import { Pool } from 'pg';
const pool:any = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({adapter});

async function main() {
    const email = 'super.admin@gmail.com';
    const password = 'Admin@1234';
    const password_hash = await hash(password, 10);

    await prisma.user.create({
        data: {
            name: 'Admin User',
            email,
            passwordHash: password_hash,
            role: 'SUPER_ADMIN',
            status: 'ACTIVE',
        },
    });

    await prisma.plan.create({
        data: {
            id: 'c2f1a8d4-9b7e-4f2a-8e2f-1b3d6c7a9f5e',
            razor_pay_plan_id: 'c2f1a8d4-9b7e-4f2a-8e2f-1b3d6c7a9f5e',
            name: 'Free Trail',
            currency: 'INR',
            price: 0,
            provider: "FREE_TRAIL",
            active: true,
            createdAt: new Date(),
            description: 'Trail Period',
            trailDays: 14,
            status: 'free',
        },
    });
}

main()
    .catch(e => {
        console.error('❌ Error inserting seed data:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
