import { successResponse, errorResponse } from "@/app/backend/helper/responseFormat";
import { prisma } from "@/lib/prisma";
import { access_role, auth_middleware, createToken } from "@/app/backend/helper/auth";
import { NextRequest } from "next/server";
import { getPresignedUrl } from "@/app/backend/helper/awsHelper";

//create clients
export async function POST(req: NextRequest) {
    try {
        const auth_check: any = await auth_middleware(req, access_role.access_role_partner);
        const body = await req.json();
        const { name,
            businessName,
            phone,
            businessType,
            isGstRegistered,
            state,
            district,
            pinCode,
            addressOne,
            addressTwo } = body;

        const check_client_exist = await prisma.client.count({
            where: {
                phone: phone,
            }
        });
        if (check_client_exist != 0) {
            return errorResponse(null, "User Already Exist", 400);
        }
        const create_client = await prisma.client.create({
            data: {
                tenantId: auth_check.auth_tenant_id,
                name: name,
                businessName: businessName,
                phone: phone,
                businessType: businessType,
                isGstRegistered: isGstRegistered,
                state: state,
                district: district,
                pinCode: pinCode,
                addressOne: addressOne,
                addressTwo: addressTwo
            }
        })

        const response = successResponse(
            {
                client: create_client,
            },
            "Client Created Successfully",
            200
        )
        return response;

    } catch (error: any) {
        return errorResponse(error, "Internal server error", 500)
    }
}

export async function PUT(req: NextRequest) {
    try {
        const auth_check: any = await auth_middleware(req, access_role.access_role_partner);
        const { searchParams } = new URL(req.url);
        const clientId = searchParams.get('id');

        if (!clientId) {
            return errorResponse(null, "Id should not be empty!!", 400);
        }
        const client = await prisma.client.findFirst({
            where: {
                id: clientId
            }
        });
        if (!client) {
            return errorResponse(null, "Client doesn't Exist", 404);
        }
        const body = await req.json();
        const { name,
            businessName,
            phone,
            businessType,
            isGstRegistered,
            state,
            district,
            pinCode,
            addressOne,
            addressTwo } = body;

        await prisma.client.update({
            where: {
                id: clientId
            },
            data: {
                name: name ?? client.name,
                businessName: businessName ?? client.businessName,
                phone: phone ?? client.phone,
                businessType: businessType ?? client.businessType,
                isGstRegistered: isGstRegistered ?? client.isGstRegistered,
                state: state ?? client.state,
                district: district ?? client.district,
                pinCode: pinCode ?? client.pinCode,
                addressOne: addressOne ?? client.addressOne,
                addressTwo: addressTwo ?? client.addressTwo,
            }
        });
        const upated_client = await prisma.client.findFirst({
            where: {
                id: clientId
            }
        });

        const response = successResponse(
            {
                client: upated_client,
            },
            "Client Updated Successfully",
            200
        )
        return response;
    }
    catch (error: any) {
        return errorResponse(error, "Internal server error", 500)
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const auth_check: any = await auth_middleware(req, access_role.access_role_partner);
        const { searchParams } = new URL(req.url);
        const clientId = searchParams.get('id');
        if (!clientId) {
            return errorResponse(null, "Id should not be empty!!", 400);
        }
        const client = await prisma.client.count({
            where: {
                id: clientId
            }
        });
        if (client == 0) {
            return errorResponse(null, "Client doesn't Exist", 404);
        }
        await prisma.client.update({
            where: {
                id: clientId
            },
            data: { isDeleted: true }
        });
        const response = successResponse(
            {
                client_id: clientId,
            },
            "Client Deleted Successfully",
            200
        )
        return response;
    } catch (error: any) {
        return errorResponse(error, "Internal server error", 500)
    }

}

export async function GET(req: NextRequest) {
    try {
        const auth_check: any = await auth_middleware(req, access_role.access_role_partner);

        const { searchParams } = new URL(req.url);
        const clientId = searchParams.get("id");

        if (clientId) {
            const client = await prisma.client.findFirst({
                where: { 
                    id: clientId, 
                    tenantId: auth_check.auth_tenant_id,
                    isDeleted: false 
                },
                include: {
                    complianceItems: {
                        where: { isDeleted: false },
                        orderBy: { dueDate: 'asc' }
                    },
                 
                    clientDocuments: true,
                    messageLogs: {
                        take: 5,
                        orderBy: {createdAt: 'desc'},
                        include: {complianceItem: true}
                    }
                }
            });

            if (!client) {
                return errorResponse(null, "Client not found", 404);
            }

            const documentsWithUrls = await Promise.all(
                (client.clientDocuments || []).map(async (doc: any) => {

                    const fileKeyToUse = doc.file_key || doc.fileKey; 
                    
                    if (!fileKeyToUse) {
                         return { ...doc, downloadUrl: null, urlError: "No file key found" };
                    }

                    const { signedUrl, error } = await getPresignedUrl(fileKeyToUse, 3600); // 1 hour expiry
                    return {
                        ...doc,
                        downloadUrl: signedUrl || null,
                        urlError: error || null
                    };
                })
            );

            const dynamicActionRequired: any[] = [];
            const today = new Date();

            client.complianceItems.forEach((task: any) => {
                const dueDate = new Date(task.dueDate);

                if (task.status === "PENDING" && dueDate < today) {
                    dynamicActionRequired.push({
                        id: `act_${task.id}`,
                        title: `Complete ${task.type}`,
                        description: `Due date passed on ${dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}`,
                        type: "COMPLIANCE",
                        priority: "HIGH",
                        cta: "VIEW_COMPLIANCE",
                        ctaLink: `/compliance/${task.id}`
                    });
                }
            });

            let dynamicWhatsappReminders = {
                lastActivity: null as any,
                logs: [] as any[]
            };

            if (client.messageLogs && client.messageLogs.length > 0) {

                const formattedLogs = client.messageLogs.map((log: any) => ({
                    id: log.id,
                    type: log.messageType,
                    message: log.content,
                    sentAt: log.createdAt,
                    status: log.status
                }));

                dynamicWhatsappReminders = {
                    lastActivity: {
                        sentAt: formattedLogs[0].sentAt,
                        status: formattedLogs[0].status,
                        read: formattedLogs[0].status === "READ"
                    },
                    logs: formattedLogs
                };
            }

            const dynamicAuditorNotes: any[] = [];

            const formattedComplianceItems = client.complianceItems.map((task: any) => {
                const { isReminderPaused, ...restOfTask } = task;
                return {
                    ...restOfTask,
                    isTaskPaused: isReminderPaused
                };
            });

            const {
                messageLogs,
                isRemindersPaused,
                complianceItems,
                clientDocuments,
                ...restOfClient
            } = client;

            return successResponse(
                {   ...restOfClient,                
                    isClientPaused: isRemindersPaused,        formattedComplianceItems, 
                    clientDocuments: documentsWithUrls,
                    actionRequired: dynamicActionRequired,
                    whatsappReminders: dynamicWhatsappReminders,
                    auditorNotes: dynamicAuditorNotes
                },
                "Client details fetched successfully",
                200
            );
        }

        const search = searchParams.get("search") || "";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const whereClause: any = {
            tenantId: auth_check.auth_tenant_id,
            isDeleted: false
        };

        if (search) {
            whereClause.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { businessName: { contains: search, mode: "insensitive" } },
                { phone: { contains: search } },
            ];
        }

        const clients = await prisma.client.findMany({
            where: whereClause,
            skip: skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        });

        const totalCount = await prisma.client.count({ where: whereClause });

        return successResponse(clients, "Clients fetched successfully", 200, {
            total: totalCount,
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit),
        });

    } catch (error: any) {
        console.error("GET Client Detailed Error:", error);
        return errorResponse(error, "Internal server error", 500);
    }
}