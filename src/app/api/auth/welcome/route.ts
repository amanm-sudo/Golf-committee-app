import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email || !name) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Attempt to send the welcome email
    await sendWelcomeEmail(email, name);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Welcome email error:", error);
    return new NextResponse("Internal API Error", { status: 500 });
  }
}
