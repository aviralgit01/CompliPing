const BASE_URL = process.env.WHATSAPP_URL || "https://graph.facebook.com";
const VERSION = process.env.WHATSAPP_VERSION || "v23.0";
const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

function validateEnv() {
    if (!TOKEN) throw new Error("WHATSAPP_TOKEN is missing");
    if (!PHONE_NUMBER_ID) throw new Error("PHONE_NUMBER_ID is missing");
    if (!BASE_URL) throw new Error("WHATSAPP_URL is missing");
    if (!VERSION) throw new Error("WHATSAPP_VERSION is missing");
}

function buildQuery(params?: Record<string, any>) {
    if (!params) return "";
    const query = new URLSearchParams(params).toString();
    return query ? `?${query}` : "";
}

export async function whatsappHelper(
    method: "GET" | "POST" | "PUT" | "DELETE",
    endpoint: string,
    body?: any,
    params?: Record<string, any>
) {
    validateEnv();

    const url = `${BASE_URL}/${VERSION}/${endpoint}${buildQuery(params)}`;

    const options: RequestInit = {
        method,
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
        },
    };

    // Only attach body if not GET
    if (body && method !== "GET") {
        options.body = JSON.stringify(body);
    }
    console.log(url);
    console.log(options);

    try {
        const response = await fetch(url, options);

        const data = await response.json().catch(() => null);

        // Handle non-2xx responses
        if (!response.ok) {
            throw {
                status: response.status,
                statusText: response.statusText,
                error: data,
            };
        }

        return {
            success: true,
            status: response.status,
            data,
        };
    } catch (error: any) {
        return {
            success: false,
            status: error?.status || 500,
            error: error?.error || error.message,
        };
    }
}


//phone_number_id:"990943200780065", to:"9779860900731" or "917000598607", template_name:"template_testing","template_button"
//components: [
            //     {
            //         type: "body" or "header",
            //         parameters: [
            //             {
            //                 type: "text",
            //                 text: "John"   // {{1}}
            //             },
            //             {
            //                 type: "text",
            //                 text: "Order #12345" // {{2}}
            //             }
            //         ]
            //     }
            // ]
export async function sendMessage(phone_number_id: string, to: string, template_name: string, components:[]) {
    const phone_number = phone_number_id;
    console.log(phone_number);
    const body = {
        messaging_product: "whatsapp",
        to: to,
        type: "template",
        template: {
            name: template_name,
            language: {
                code: "en_US"
            },
            components: components,
        }
    };
    const data = await whatsappHelper("POST", phone_number + "/messages", body);
    return data;
}