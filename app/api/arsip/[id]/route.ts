import { HapusArsipDOkumen } from "@/app/services/ArsipService";
import { sendError, successResponse } from "@/app/utils/response";

export async function DELETE(
  req: Request, 
  { params }: { params: Promise<{ id: string }> } // 'id' di sini adalah index
) {
  try {
    const { id } = await params;
    const indexToDelete = Number(id);

    if (isNaN(indexToDelete)) {
      return sendError("Index tidak valid", 400);
    }

    // Panggil fungsi hapus
    const hapus = await HapusArsipDOkumen(indexToDelete);

    if (hapus) {
      return successResponse(null, "Item berhasil dihapus", 200);
    } 
    
    return sendError("Data tidak ditemukan", 404);

  } catch (error: any) {
    return sendError(error.message, 500);
  }
}