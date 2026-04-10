import { NextRequest } from "next/server";
import { sendTableResponse, sendError, successResponse } from "@/app/lib/response";
import { getUsersService } from "@/app/services/UserService";
import { validateUser } from "@/app/lib/validation";
import bcrypt from "bcrypt";
import { prisma } from "@/app/lib/prisma";
import { Role } from "@prisma/client";
import { nowWib } from "@/app/lib/helper";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const result = await getUsersService({
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "10"),
      search: searchParams.get("search") || "",
    });

    return sendTableResponse(
      result.data,
      result.meta,
      "Data user berhasil diambil"
    );

  } catch (error) {
    console.error("GET_USERS_ERROR:", error);
    return sendError("Gagal mengambil data user", 500, error);
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // 1. Ambil data dari FormData
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;
    const image = formData.get("image") as File | null;

    // 2. Konversi untuk Validasi Zod
    const dataToValidate = { name, email, password, role, image };

    // 3. Jalankan validasi Zod di Backend
    const validation = validateUser(dataToValidate, false);
    if (!validation.isValid) {
      return sendError("Validasi gagal", 400, validation.errors);
    }

    // 4. Cek apakah email sudah terdaftar (Penting untuk keamanan database)
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return sendError("Email sudah digunakan", 400);
    }

    // 5. Hash Password (Wajib sebelum simpan ke DB)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Logika Simpan Gambar (Opsional)
    let imageUrl = null;
    if (image && image.size > 0) {
      // Di sini biasanya upload ke Cloudinary/S3 atau simpan lokal
      // Untuk contoh ini, kita anggap simpan path string saja
      imageUrl = `/uploads/${Date.now()}-${image.name}`;
    }
    const finalRole = role.toLowerCase() as Role;
 
    // 7. INSERT KE DATABASE MENGGUNAKAN PRISMA
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword, // Simpan yang sudah di-hash
        role: finalRole,
        image: imageUrl,
        created_at: nowWib(), // Gunakan helper untuk waktu WIB
      },
    });
    
    // 8. Berikan Respon Sukses
    // Jangan kirim balik field password ke frontend
    return successResponse(null, "User berhasil dibuat", 201);

  } catch (error: any) {
    console.error("API Error:", error);
    
    // Tangani error spesifik Prisma jika perlu
    if (error.code === 'P2002') {
      return sendError("Email sudah terdaftar", 400);
    }

    return sendError("Terjadi kesalahan pada server", 500, error.message);
  }
}