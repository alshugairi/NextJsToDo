"use server";
import {NextRequest, NextResponse} from "next/server";
import {fetchData} from "@/app/api/service/FetchData";
import {APITasks} from "@/app/api/service/APILinks";

export async function GET(request: NextRequest) {

    const data = await fetchData(APITasks, request);
    return NextResponse.json(data);
}
