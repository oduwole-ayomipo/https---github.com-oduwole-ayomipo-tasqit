import { generateAuthToken, setAuthCookies } from "@/app/lib/server-helpers";
import { LoginSchema } from "@/app/validation/schema";
import { database } from "@/db/knex";
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod'

const bcrypt = require('bcryptjs')

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json()

        // ensure all field are filled
        if (!email)
            return NextResponse.json({ success: false, error: 'Email is requried' })

        if (!password)
            return NextResponse.json({ success: password, error: 'Password is required' })

        // validate the incomming data against zod
        const validatedData = LoginSchema.parse({ email, password })

        // check if incoming data exist in the database
        const user = await database('UserProfile').where('email', validatedData.email)

        if (!user)
            return NextResponse.json({ success: false, error: 'User with this email does not exist' }, { status: 400 })

        // decrypt and check if passwprd match
        const isPasswordCorrect = await bcrypt.compare(validatedData.password, user[0].password)

        if (!isPasswordCorrect)
            return NextResponse.json({ success: false, error: 'Incorrect password' }, { status: 400 })


        // generate auth token
        const authToken = generateAuthToken(user[0]._id)

        // set auth setAuthCookies
        setAuthCookies(authToken)

        return NextResponse.json({ success: true, msg: 'User logged in successfully' }, { status: 200 })

    } catch (e) {
        console.log('An error occured', e)

        // zod validation error
        if (e instanceof z.ZodError) {
            const formattedErrors = e.errors.map(err => err.message)
            return NextResponse.json({ success: false, error: 'validation error', formattedErrors }, { status: 400 })
        } else {
            return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
        }
    }
}