import { NextRequest, NextResponse } from "next/server";
import { fetchDataDelete } from "@/app/api/service/FetchDataDelete";
import {fetchDataPost} from "@/app/api/service/FetchDataPost";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const taskId = params.id;
        if (!taskId) {
            return NextResponse.json({ message: "Task ID is required" }, { status: 400 });
        }
        const response = await fetchDataPost(`/tasks/${taskId}/update`, await request.json(),request);
        return NextResponse.json(response);
    } catch (error: any) {
        console.error("Error deleting task:", error);
        return NextResponse.json(
            { message: error.message || "Failed to delete task" },
            { status: 500 }
        );
    }
}