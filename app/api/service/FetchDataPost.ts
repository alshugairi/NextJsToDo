"use server";
import https from "https";
import Request from "./Request";
import type { NextRequest } from "next/server";
import { AxiosResponse } from "axios";

type APIEndpoint = string;

export async function fetchDataPost<T>(
    apiEndpoint: APIEndpoint,
    data: any = {},
    request?: NextRequest
): Promise<T> {
       const token :any= request?.cookies.get("token") || "";
    const requestHeaders = {
        "Authorization": token.value ? `Bearer ${token.value}` : undefined,

    };

    try {
        const response: AxiosResponse<T> = await Request.post(apiEndpoint, data, {
            headers: requestHeaders,
            httpsAgent: new https.Agent({rejectUnauthorized: false})
        });
        return response.data;
    } catch (error: any) {
        console.error(`Error posting data to ${apiEndpoint}:`, error.response?.data || error.message);
        return error.response.data;
        throw new Error(`Failed to post data to ${apiEndpoint}: ${error.message}`);
    }
}
