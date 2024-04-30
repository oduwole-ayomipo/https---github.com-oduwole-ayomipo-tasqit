import { cookies } from 'next/headers'
import { database } from '@/db/knex'
import type { UserProfile } from 'knex/types/tables'
import { jwtVerify, SignJWT } from 'jose'
import type { JWTPayload } from 'jose'
import { PayloadSchema } from '../validation/schema'
import { z } from 'zod'

const JWT_SECRET = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET_KEY)

if (JWT_SECRET === undefined || JWT_SECRET === null) {
  throw new Error('Invalid env var: JWT_TOKEN')
}

// generates auth token
export const generateAuthToken = async (payload: JWTPayload | undefined) => {
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
    value,
    httpOnly: true,
    expires: 7 * 24 * 60 * 60 * 1000,
    maxAge: value !== '' ? 7 * 24 * 60 * 60 * 1000 : 0
  })
}

// checks the state of the user

export const isUserAuthorized = async () => {
  // gets the auth token stored in the cookies
  const token = cookies().get('auth-token')?.value

  let user: UserProfile | null = null

  // check if token is valid
  if (token !== null && token !== undefined && token !== '') {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ['HS256']
    })

    // validate the incomming payload against zod
    try {
      const validatedPayload = PayloadSchema.parse(payload)

      const email = validatedPayload.user[0].email

      // try searching for the user in the db
      try {
        user = await database('UserProfile').where('email', email).first()
        return user
      } catch (error) {
        return null
      }
    } catch (e) {
      // zod validation error

      if (e instanceof z.ZodError) {
        const formattedErrors = e.errors.map((err) => err.message)

        console.log(formattedErrors)

        return null
      }
    }

    return user
  }
  return user
}
