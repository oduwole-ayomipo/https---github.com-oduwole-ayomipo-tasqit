import { setAuthCookies } from '@/app/lib/server-helpers'
import { NextResponse } from 'next/server'

// eslint-disable-next-line @typescript-eslint/space-before-function-paren
export async function POST() {
  try {
    // Destroy the auth-token
    setAuthCookies('')
    return NextResponse.json(
      { success: true, msg: 'User logged out successfully' },
      { status: 200 }
    )
  } catch (e) {
    return NextResponse.json(
      { success: false, error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
