import { sendError, successResponse } from "@/app/lib/response";
import { validateUser } from "@/app/lib/validation";
import { update } from "@/app/services/UserService";

export async function PUT(
  req: Request,
  { params }: { params: { id: number } },
) {
  //   try {
  const id = params.id;
  const formData = await req.formData();
  // 1. Ambil data dari FormData
  const name = formData.get("name") as string;
  const image = formData.get("image") as File | null;

  // 3. Jalankan validasi Zod di Backend
  const dataToValidate = {
    name: name,
    image: image,
  };
  const validation = validateUser(dataToValidate, true);

  if (!validation.isValid) {
    return sendError("Validasi gagal", 400, validation.errors);
  }

  const create = await update(id, name, image);

  if (create.ok) {
    return successResponse(null, "User berhasil diupdate", 201);
  } else {
    return sendError("Data Gagal diupdate", 500);
  }

  //   } catch (error: any) {
  //     console.error("API Error:", error);

  //     // Tangani error spesifik Prisma jika perlu
  //     if (error.code === 'P2002') {
  //       return sendError("Email sudah terdaftar", 400);
  //     }

  //     return sendError("Terjadi kesalahan pada server", 500, error.message);
  //   }
}
