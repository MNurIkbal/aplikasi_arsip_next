import { HapusArsipDOkumen } from "@/app/services/ArsipService";
import { sendError, successResponse } from "@/app/utils/response";

export async function DELETE(
  req: Request, 
  { params }: { params: Promise<{ id: string[] }> }
) {
  try {
    const { id: slug } = await params;

    if (!slug || slug.length < 2) {
      return sendError("Format URL salah.", 400);
    }

    const idDatabase = slug[0]; 
    const indexString = slug[1]; 

    const idNum = parseInt(idDatabase);
    const indexNum = parseInt(indexString);

    if (isNaN(idNum) || isNaN(indexNum)) {
      return sendError("ID dan Index harus berupa angka valid", 400);
    }

    const updatedArsip = await HapusArsipDOkumen(idNum, indexNum);

    if (updatedArsip) {
      return successResponse(updatedArsip, "Item berhasil dihapus", 200);
    } 
    
    return sendError("Data tidak ditemukan", 404);

  } catch (error: any) {
    return sendError(error.message, error.message.includes("jangkauan") ? 400 : 500);
  }
}