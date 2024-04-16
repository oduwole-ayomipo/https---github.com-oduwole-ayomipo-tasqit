import { cookies } from "next/headers"
import { database } from "@/db/knex"
import { UserProfile } from "knex/types/tables"
import { jwtVerify, SignJWT } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET_KEY)

if (!JWT_SECRET)
    throw new Error('Invalid env var: JWT_TOKEN')

// generates auth token
export const generateAuthToken = async (payload: any) => {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(JWT_SECRET)
}

// set auth to cookies
export const setAuthCookies = (value: string): void => {
    cookies().set({
        name: 'auth-token',
        value: value,
        httpOnly: true,
        expires: 7 * 24 * 60 * 60 * 1000,
        maxAge: value ? 7 * 24 * 60 * 60 * 1000 : 0
    })
}

// checks the state of the user

// Payload interface
interface Payload {
    user: UserProfile[];
    iat: number;
    exp: number;
}

export const isUserAuthorized = async () => {
    // gets the auth token stored in the cookies
    const token = cookies().get('auth-token')?.value

    let user: UserProfile | null = null

    // check if token is valid
    if (token) {
        const { payload } = await jwtVerify(token, JWT_SECRET, {
            algorithms: ['HS256']
        })

        if (typeof payload !== 'string') {
            const email = (payload as unknown as Payload).user[0].email;
            try {
                user = await database('UserProfile').where('email', email).first()
                return user
            } catch (error) {

                return null
            }
        }
        return user
    }
    return user
}

