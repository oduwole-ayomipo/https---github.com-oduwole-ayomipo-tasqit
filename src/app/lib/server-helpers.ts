import { cookies } from "next/headers"

const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET_KEY
const isProduction = process.env.NODE_ENV

if (!JWT_SECRET)
    throw new Error('Invalid env var: JWT_TOKEN')

// generates auth token
export const generateAuthToken = (_id: string): string => {
    return jwt.sign({ _id }, JWT_SECRET, { expiresIn: '10m' })
}

// set auth to cookies
export const setAuthCookies = (value: string): void => {
    cookies().set({
        name: 'auth-token',
        value: value,
        httpOnly: true,
        /* secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax', */
        maxAge: value ? 10 * 60 : 0
    })
}

