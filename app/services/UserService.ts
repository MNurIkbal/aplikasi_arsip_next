import { prisma } from "@/app/utils/prisma";
import { GetUsersParams } from "../types/GlobalType";
import { sendError, successResponse } from "../utils/response";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";
import { nowWib } from "../utils/helper";
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

  
  const hashedPassword = await bcrypt.hash(password, 10);

  
  let imageUrl = null;

  if (image && image.size > 0) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    
    const fileName = `${Date.now()}-${image.name}`;

  
    const filePath = path.join(process.cwd(), "public/uploads", fileName);
    await writeFile(filePath, buffer);

  
    imageUrl = `/uploads/${fileName}`;
  }

  const finalRole = role as Role;

  
  await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
      role: finalRole,
      image: imageUrl, 
      created_at: nowWib(),
    },
  });

  return successResponse(null, "User berhasil dibuat", 201);
}

export async function update(
  id: number, 
  name: string,
  image?: File | null,
) {

  const existingUser = await prisma.user.findUnique({
    where: { id: id },
  });

  if (!existingUser) {
    throw new Error("User tidak ditemukan");
  }

  
  let imageUrl = existingUser.image; 

  if (image && image.size > 0) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${image.name}`;
    const filePath = path.join(process.cwd(), "public/uploads", fileName);
    await writeFile(filePath, buffer);

    imageUrl = `/uploads/${fileName}`;
  }

  
  await prisma.user.update({
    where: {
      id: id, 
    },
    data: {
      name: name,
      image: imageUrl,
      updated_at: nowWib(),
    },
  });

  return successResponse(null, "User berhasil diperbarui", 200);
}

export async function deleteUser(id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  await prisma.user.update({
    where: { id },
    data: {
      deleted_at: nowWib(),
    },
  });

  return successResponse(null, "User berhasil dihapus", 200);
}

