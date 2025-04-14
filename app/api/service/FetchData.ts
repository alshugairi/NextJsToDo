"use server";
import https from "https";
import Request from "./Request";

type APIEndpoint = string;

export async function fetchData<T>(apiEndpoint: APIEndpoint, _request: any): Promise<T> {
    const params: Record<string, string> = {};
    const token = _request?.cookies.get("token") || "";
    for (const [key, val] of _request.nextUrl.searchParams.entries()) {
        params[key] = val;
    }

    const requestHeaders = {
        "Authorization": token.value ? `Bearer ${token.value}` : undefined,
    };

    try {
        const { data } = await Request.get(apiEndpoint, {
            params,
            headers: requestHeaders,
            httpsAgent: new https.Agent({rejectUnauthorized: false})
        });
        return data;
    } catch (error: any) {
        return error.response.data;
        console.error(`Error fetching data from ${apiEndpoint}:`, error.response?.data || error.message);
        throw new Error(`Failed to fetch data from ${apiEndpoint}: ${error.message}`);
    }
}
