import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  
  // Hapus cookie bernama 'token'
  cookieStore.delete("token");

  return NextResponse.json({ message: "Logout berhasil" }, { status: 200 });
}