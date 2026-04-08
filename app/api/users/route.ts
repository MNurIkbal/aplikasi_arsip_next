import { NextRequest } from "next/server";
import { sendTableResponse, sendError, successResponse } from "@/app/lib/response";
import { getUsersService } from "@/app/services/UserService";
import { validateUser } from "@/app/lib/validation";``

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
    
    // Konversi FormData ke Object untuk divalidasi Zod
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
      image: formData.get("image"), // File object
    };

    // Jalankan validasi Zod di Backend
    const validation = validateUser(data, false);
    if (!validation.isValid) {
      return sendError("Validasi gagal", 400, validation.errors);
    }

    // LOGIKA SIMPAN KE DATABASE (Contoh)
    // const newUser = await db.user.create({ data: { ... } });
    
    return successResponse(null,"User berhasil dibuat", 201);
  } catch (error) {
    console.error("API Error:", error);
    return sendError("Gagal membuat user", 500, error);
  }
}