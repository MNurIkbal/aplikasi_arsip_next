export const createArsip = async (payload: any) => {
  const formData = new FormData();
  
  // Masukkan data utama
  formData.append("judul", payload.judul);
  formData.append("tanggal", payload.tanggal);
  formData.append("kategori", payload.kategori);
  
  if (payload.password_arsip) {
    formData.append("password_arsip", payload.password_arsip);
  }

  // Masukkan attachments
  payload.attachments.forEach((item: any, index: number) => {
    // Pastikan key ini sesuai dengan yang diharapkan backend (misal: Multer di Express atau Request di Laravel)
    formData.append(`attachments[${index}][nama_dokumen]`, item.nama_dokumen);
    if (item.file) {
      formData.append(`attachments[${index}][file]`, item.file);
    }
  });


  const response = await fetch("/api/arsip", { 
    method: "POST",
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Gagal menyimpan data");
  }

  return response.json();
};