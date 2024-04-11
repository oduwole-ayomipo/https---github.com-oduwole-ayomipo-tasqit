const jwt = require("jsonwebtoken")
import { NextResponse, NextRequest } from "next/server";
import users from "@/db/users.json"
import { NextApiResponse } from "next";

// Login
interface LoginCredentials {
    username: string;
    password: string;
}

export async function POST(req: NextRequest, res: NextResponse, response: NextApiResponse): Promise<NextResponse> {
    try {
        const { username, password }: LoginCredentials = await req.json();
        const user = users.find((u) => {
            return u.username === username && u.password === password
        })
        if (user) {
            // Generate an access tokem
            const accessToken = jwt.sign({ id: user?.id, role: user?.role }, process.env.ACCESS_TOKEN_SECRET_KEY)
            // set the token in a token cookie
/*             response.setHeader("Set-Cookie", `Bearer ${accessToken}; HttpOnly; Secure`)
 */            return NextResponse.json({
                ...user,
                accessToken
            }, { status: 200 })
        } else {
            return NextResponse.json("invalid credential", { status: 400 })
        }
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}

// Create a user


