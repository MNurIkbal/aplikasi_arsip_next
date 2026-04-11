import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function validateUserLogin(email: string, password: any) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Password salah");
  }

  // Generate JWT
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role, // Tambahkan role agar middleware bisa baca
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" }
  );

  return { user, token };
}