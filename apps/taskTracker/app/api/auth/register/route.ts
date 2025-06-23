import { NextResponse } from "next/server"
import { createUser } from "@/lib/redis"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json()

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const userId = await createUser({
      username,
      email,
      password: hashedPassword,
    })

    return NextResponse.json({ userId, success: true })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
  }
}
