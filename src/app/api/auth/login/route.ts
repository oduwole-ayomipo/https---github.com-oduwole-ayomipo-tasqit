import {
  generateAuthToken,
  isUserAuthorized,
  setAuthCookies
} from '@/app/lib/server-helpers'
import { LoginSchema } from '@/app/validation/schema'
import { database } from '@/db/knex'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { z } from 'zod'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcryptjs')

// eslint-disable-next-line @typescript-eslint/space-before-function-paren
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // validate the incomming data against zod
    const validatedData = LoginSchema.parse({ email, password })

    // check if incoming data exist in the database
    const user = await database('UserProfile').where(
      'email',
      validatedData.email
    )

    if (user === null || user === undefined) {
      return NextResponse.json(
        { success: false, error: 'User with this email does not exist' },
        { status: 400 }
      )
    }

    // decrypt and check if password match
    const isPasswordCorrect = await bcrypt.compare(
      validatedData.password,
      user[0].password
    )

    if (isPasswordCorrect === null || isPasswordCorrect === undefined) {
      return NextResponse.json(
        { success: false, error: 'Incorrect password' },
        { status: 400 }
      )
    }

    // generate auth token
    const authToken = await generateAuthToken({ user })

    // set auth setAuthCookies
    setAuthCookies(authToken)

    return NextResponse.json(
      { success: true, msg: 'User logged in successfully' },
      { status: 200 }
    )
  } catch (e) {
    console.log('An error occured', e)

    // zod validation error
    if (e instanceof z.ZodError) {
      const formattedErrors = e.errors.map((err) => err.message)
      return NextResponse.json(
        { success: false, error: 'validation error', formattedErrors },
        { status: 400 }
      )
    } else {
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

// update the user last login time

// eslint-disable-next-line @typescript-eslint/space-before-function-paren
export async function PATCH() {
  try {
    const user = await isUserAuthorized()

    if (user === null || user === undefined) {
      return NextResponse.json(
        { success: false, msg: 'Login to use this service' },
        { status: 401 }
      )
    }

    // eslint-disable-next-line  @typescript-eslint/naming-convention
    const last_login_at = new Date()

    const userLoginTime = await database('UserProfile')
      .where('email', user.email)
      .update({ last_login_at })
      .returning('*')

    return NextResponse.json({ users: userLoginTime }, { status: 200 })
  } catch (e) {
    return NextResponse.json(
      { success: false, msg: 'internal server error', error: e },
      { status: 500 }
    )
  }
}
