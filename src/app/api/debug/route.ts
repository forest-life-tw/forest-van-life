import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ADMIN_PASSWORD_SET: !!process.env.ADMIN_PASSWORD,
    ADMIN_PASSWORD_LENGTH: process.env.ADMIN_PASSWORD?.length ?? 0,
    ADMIN_JWT_SECRET_SET: !!process.env.ADMIN_JWT_SECRET,
    GITHUB_TOKEN_SET: !!process.env.GITHUB_TOKEN,
  });
}
