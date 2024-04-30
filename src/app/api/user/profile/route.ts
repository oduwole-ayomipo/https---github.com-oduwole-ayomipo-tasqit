import { isUserAuthorized } from '@/app/lib/server-helpers'
import { NextResponse } from 'next/server'

// eslint-disable-next-line @typescript-eslint/space-before-function-paren
export async function GET() {
  try {
    const user = await isUserAuthorized()
    if (user === undefined || user === null) {
      return NextResponse.json(
        { success: false, msg: 'Please log in to view profile' },
        { status: 401 }
      )
    }

    return NextResponse.json({ success: true, msg: user })
  } catch (e) {
    console.log(e)

    return NextResponse.json(
      { success: false, msg: 'internal server error', e },
      { status: 500 }
    )
  }
}
