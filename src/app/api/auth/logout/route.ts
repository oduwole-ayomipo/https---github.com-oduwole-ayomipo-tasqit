import { setAuthCookies } from "@/app/lib/server-helpers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        // Destroy the auth-token
        setAuthCookies('')
        return NextResponse.json({ success: true, msg: 'User logged out successfully' }, { status: 200 })
    } catch (e) {
        return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
    }
}