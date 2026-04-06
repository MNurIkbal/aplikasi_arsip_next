import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return Response.json(
        { message: "User tidak ditemukan" },
        { status: 401 },
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return Response.json({ message: "Password salah" }, { status: 401 });
    }

    // 🔥 Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d", // token berlaku 1 hari
      },
    );

    const response = NextResponse.json({
      message: "Login berhasil",
      user,
      token,
    });

    // 🔥 simpan ke cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error) {
    return Response.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
