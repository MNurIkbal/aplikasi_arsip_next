import { sendError, successResponse } from "@/app/lib/response";
import { validateUser } from "@/app/lib/validation";
import { deleteUser, update } from "@/app/services/UserService";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const userId = Number(id);
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

    const create = await update(userId, name, image);

    if (create.ok) {
      return successResponse(null, "User berhasil diupdate", 201);
    } else {
      return sendError("Data Gagal diupdate", 500);
    }
  } catch (error: any) {
    console.error("API Error:", error);

    // Tangani error spesifik Prisma jika perlu
    if (error.code === "P2002") {
      return sendError("Email sudah terdaftar", 400);
    }

    return sendError("Terjadi kesalahan pada server", 500, error.message);
  }
}

export async function DELETE(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Ambil ID dari params (tunggu promise)
    const { id } = await params;
    const userId = Number(id);

    // 2. Validasi ID
    if (isNaN(userId)) {
      return sendError("ID tidak valid", 400);
    }

    // 3. Eksekusi Service
    // Asumsi: deleteUser adalah fungsi yang langsung berinteraksi dengan Prisma
    const hapus = await deleteUser(userId);

    // 4. Return Response
    // Jika deleteUser berhasil (biasanya mengembalikan data user yang dihapus)
    if (hapus) {
      return successResponse(null, "User berhasil dihapus", 200);
    } 
    
    return sendError("User tidak ditemukan", 404);

  } catch (error: any) {
    return sendError(error.message || "Gagal menghapus user", 500);
  }
}