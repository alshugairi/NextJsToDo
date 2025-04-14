import {NextRequest, NextResponse} from "next/server";
import { APIRequestData } from "@/app/api/service/APILinks";
import {fetchDataPost} from "@/app/api/service/FetchDataPost";


export async function POST(request: NextRequest) {
    try {
        const response = await fetchDataPost(APIRequestData, await request.json(),request);
        return NextResponse.json(response);
    } catch (error) {
        console.error("Error:", error);
    }
}