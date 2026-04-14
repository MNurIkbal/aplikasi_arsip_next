// services/arsip.service.ts
export const createArsip = async (payload: any) => {
  const formData = new FormData();
  
  // Masukkan data utama
  formData.append("judul", payload.judul);
  formData.append("tanggal", payload.tanggal);
  formData.append("kategori", payload.kategori);
  if (payload.password_arsip) formData.append("password_arsip", payload.password_arsip);

  // Masukkan attachments (File)
  payload.attachments.forEach((item: any, index: number) => {
    formData.append(`attachments[${index}][nama_dokumen]`, item.nama_dokumen);
    if (item.file) {
      formData.append(`attachments[${index}][file]`, item.file);
    }
  });

  const response = await fetch("/api/arsip", { // Ganti dengan URL API Anda
    method: "POST",
    body: formData,
    // Jika butuh auth: headers: { "Authorization": `Bearer ${token}` }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Gagal menyimpan data");
  }

  return response.json();
};