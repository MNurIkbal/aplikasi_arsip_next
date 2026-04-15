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

  // TIPS: Untuk melihat isi FormData di console gunakan ini:
  // for (let pair of formData.entries()) { console.log(pair[0] + ': ' + pair[1]); }

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

export async function fetchArsip(params: { search?: string; page: number; limit: number }) {
  try {
    // 1. Susun Query String secara otomatis agar aman dari karakter aneh
    const query = new URLSearchParams();
    if (params.search) query.append("search", params.search);
    query.append("page", params.page.toString());
    query.append("limit", params.limit.toString());

    console.log(query.toString);
    

    // 2. Hit ke endpoint API Route yang sudah kita buat sebelumnya
    const response = await fetch(`/api/arsip?${query.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Cache: 'no-store' jika ingin data selalu paling baru (real-time)
      cache: 'no-store' 
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal mengambil data dari server");
    }

    // Mengembalikan { data, meta }
    return result; 
  } catch (error) {
    console.error("Client Service Error:", error);
    return { data: [], meta: { total: 0, totalPages: 0 } };
  }
}