import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const expectedUsername = process.env.ADMIN_USERNAME || "sahir@123";
    const expectedPassword = process.env.ADMIN_PASSWORD || "reelcrafterr2026";

    if (username === expectedUsername && password === expectedPassword) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid login payload." },
      { status: 400 }
    );
  }
}
