import { sendError, successResponse } from "@/app/utils/response";
import { validateUser } from "@/app/utils/validation";
import { deleteUser, update } from "@/app/services/UserService";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const userId = Number(id);
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const image = formData.get("image") as File | null;

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

    const { id } = await params;
    const userId = Number(id);


    if (isNaN(userId)) {
      return sendError("ID tidak valid", 400);
    }

    const hapus = await deleteUser(userId);

    if (hapus.ok) {      
      return successResponse(null, "User berhasil dihapus", 200);
    } 
    
    return sendError("User tidak ditemukan", 404);

  } catch (error: any) {
    return sendError(error.message || "Gagal menghapus user", 500);
  }
}