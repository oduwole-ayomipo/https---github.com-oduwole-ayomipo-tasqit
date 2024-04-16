import { isUserAuthorized } from "@/app/lib/server-helpers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const user = await isUserAuthorized()
        if (!user)
            return NextResponse.json({ success: false, msg: "Please log in to view profile" }, { status: 401 })


        return NextResponse.json({ success: true, msg: user })
    } catch (e) {
        return NextResponse.json({ success: false, msg: 'internal server error', e }, { status: 500 })
    }
}