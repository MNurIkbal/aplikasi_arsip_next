import { NextRequest } from "next/server";
import { sendTableResponse, sendError, successResponse } from "@/app/utils/response";
import { getUsersService, store } from "@/app/services/UserService";
import { validateUser } from "@/app/utils/validation";

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

    const create = await store(name, email, password, role, image);


    if(create) {
      return successResponse(null, "User berhasil dibuat", 201);
    } else {
      return sendError("Data Gagal dibuat", 500);
    }

  } catch (error: any) {
    console.error("API Error:", error);
    
    // Tangani error spesifik Prisma jika perlu
    if (error.code === 'P2002') {
      return sendError("Email sudah terdaftar", 400);
    }

    return sendError("Terjadi kesalahan pada server", 500, error.message);
  }
}