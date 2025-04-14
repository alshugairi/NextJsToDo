"use server";
import https from "https";
import Request from "./Request";
import type { NextRequest } from "next/server";
import { AxiosResponse } from "axios";

type APIEndpoint = string;

export async function fetchDataDelete<T>(
    apiEndpoint: APIEndpoint,
    data: any = {},
    request?: NextRequest
): Promise<T> {
    const token: any = request?.cookies.get("token") || "";
    const requestHeaders = {
        "Authorization": token.value ? `Bearer ${token.value}` : undefined,
    };

    try {
        console.log("Fetching DELETE with data:", data);
        const response: AxiosResponse<T> = await Request.delete(apiEndpoint, {
            data,
            headers: requestHeaders,
            httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        });
        console.log("fetchDataDelete response:", response.data);
        return response.data;
    } catch (error: any) {
        console.error(
            "Error deleting data from",
            apiEndpoint,
            ":",
            error.response?.data || error.message
        );
        throw error;
    }
}