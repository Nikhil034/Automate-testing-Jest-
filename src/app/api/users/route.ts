// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
    ]
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email } = body

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
  }

  return NextResponse.json(
    {
      user: { id: Date.now(), name, email },
      message: 'User created successfully'
    },
    { status: 201 }
  )
}
