import { deleteArsip } from "@/app/services/ArsipService";
import { sendError, successResponse } from "@/app/utils/response";

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

    const hapus = await deleteArsip(userId);

    if (hapus) {
      return successResponse(null, hapus.message, 200);
    } 
    
    return sendError("User tidak ditemukan", 404);

  } catch (error: any) {
    return sendError(error.message || "Gagal menghapus user", 500);
  }
}