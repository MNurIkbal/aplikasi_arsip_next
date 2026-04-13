import { prisma } from "@/app/lib/prisma";
import { GetUsersParams } from "../types/GlobalType";
import { sendError, successResponse } from "../lib/response";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";
import { nowWib } from "../lib/helper";
import path from "path";
import { writeFile } from "fs/promises";

export async function getUsersService(params: GetUsersParams) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, params.limit || 10);
  const search = params.search || "";
  const skip = (page - 1) * limit;

  const whereClause = {
    OR: [{ name: { contains: search } }, { email: { contains: search } }],
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { created_at: "desc" },
    }),
    prisma.user.count({
      where: whereClause,
    }),
  ]);

  return {
    data: users,
    meta: {
      total,
      page,
      limit,
      pageCount: Math.ceil(total / limit),
    },
  };
}

export async function store(
  name: string,
  email: string,
  password: string,
  role: string,
  image: File | null,
) {
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
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Buat satu variabel nama file agar konsisten
    const fileName = `${Date.now()}-${image.name}`;

    // 2. Gunakan fileName yang sama untuk path penyimpanan fisik
    const filePath = path.join(process.cwd(), "public/uploads", fileName);
    await writeFile(filePath, buffer);

    // 3. Gunakan fileName yang SAMA untuk URL database
    imageUrl = `/uploads/${fileName}`;
  }

  const finalRole = role as Role;


  // 7. INSERT KE DATABASE MENGGUNAKAN PRISMA
  await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
      role: finalRole,
      image: imageUrl, // Sekarang nilainya pasti sama dengan file di folder public/uploads
      created_at: nowWib(),
    },
  });

  return successResponse(null, "User berhasil dibuat", 201);
}

export async function update(
  id: number, // Tambahkan parameter ID
  name: string,
  image?: File | null,
) {
  // 1. Cari user lama untuk mendapatkan URL gambar lama jika ada
  return successResponse(id, "User berhasil diperbarui", 200);
  const existingUser = await prisma.user.findUnique({
    where: { id: id }
  });
  

  if (!existingUser) {
    throw new Error("User tidak ditemukan");
  }

  // 2. Logika Simpan Gambar
  let imageUrl = existingUser.image; // Default gunakan gambar lama

  if (image && image.size > 0) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${image.name}`;
    const filePath = path.join(process.cwd(), "public/uploads", fileName);
    await writeFile(filePath, buffer);

    imageUrl = `/uploads/${fileName}`;
  }

  // 3. UPDATE KE DATABASE MENGGUNAKAN PRISMA
  await prisma.user.update({
    where: {
      id: id, // Menentukan data mana yang diupdate
    },
    data: {
      name: name,
      image: imageUrl, // Update URL baru jika ada, jika tidak tetap yang lama
      updated_at: nowWib(),
    },
  });

  return successResponse(null, "User berhasil diperbarui", 200);
}