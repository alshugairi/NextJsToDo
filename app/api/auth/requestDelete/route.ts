import {NextRequest, NextResponse} from "next/server";
import { APIRequestDelete} from "@/app/api/service/APILinks";
import {fetchDataPost} from "@/app/api/service/FetchDataPost";


export async function POST(request: NextRequest) {
    try {
        const response = await fetchDataPost(APIRequestDelete, await request.json(),request);
        return NextResponse.json(response);
    } catch (error) {
        console.error("Error:", error);
    }
}