import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),

  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .max(50, "Password terlalu panjang"),
});

export const validateUser = (data: any, isEdit: boolean) => {
  const schema = z.object({
    name: z.string().min(1, "Nama wajib diisi"),
    email: isEdit
      ? z.string().optional().or(z.literal(""))
      : z.string().min(1, "Email  wajib diisi").email("Format email salah"),
    password: isEdit
      ? z.string().optional().or(z.literal(""))
      : z.string().min(6, "Password minimal 6 karakter"),
    role: isEdit
      ? z.string().optional().or(z.literal(""))
      : z.string().min(1, "Role wajib dipilih"),

    // VALIDASI FOTO
    image: isEdit
      ? z.any().optional() // Saat edit, jika tidak ganti foto tidak apa-apa
      : z
          .instanceof(File, { message: "Foto wajib diunggah" })
          .refine((file) => file.size <= 5000000, "Ukuran maksimal 5MB")
          .refine(
            (file) =>
              ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
            "Format harus JPG atau PNG",
          ),
  });

  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return {
      isValid: false,
      errors: Object.fromEntries(
        Object.entries(errors).map(([key, value]) => [key, value?.[0]]),
      ),
    };
  }

  return { isValid: true, errors: {} };
};

// 1. Definisi Enum sesuai permintaan skema tabel sebelumnya
export enum KategoriArsip {
  UMUM = "Dokumen Umum",
  KHUSUS = "Dokumen Khusus",
  RAHASIA = "Dokumen Rahasia",
}

export const validateArsip = (data: any, isEdit: boolean) => {
  const schema = z.object({
    // Judul wajib diisi
    judul: z.string().min(1, "Judul wajib diisi"),

    // Tanggal wajib diisi (Format YYYY-MM-DD)
    tanggal: z.string().min(1, "Tanggal wajib diisi"),

    // Kategori wajib diisi
    kategori: z.nativeEnum(KategoriArsip, {
      errorMap: () => ({ message: "Kategori wajib dipilih" }),
    }),

    // Password minimal 6 karakter (Hanya wajib jika Rahasia)
    password_arsip: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (data.kategori === KategoriArsip.RAHASIA) {
            // Jika edit dan input kosong, anggap pakai password lama (valid)
            // Jika input ada isinya, harus minimal 6 karakter
            if (isEdit && (!val || val.length === 0)) return true;
            return val && val.length >= 6;
          }
          return true;
        },
        {
          message:
            "Password minimal 6 karakter wajib diisi untuk dokumen rahasia",
        },
      ),

    // Additional Data (Array)
    nama_dokumen: z
      .array(
        z.object({
          // Nama dokumen di additional data WAJIB diisi
          nama_dokumen: z.string().min(1, "Nama dokumen wajib diisi"),

          // Validasi File
          file: isEdit
            ? z.any().optional() // Saat edit boleh tidak upload ulang
            : z
                .instanceof(File, { message: "File wajib diunggah" })
                .refine(
                  (file) => file.size <= 50 * 1024 * 1024,
                  "Ukuran file maksimal 50MB",
                )
                .refine(
                  (file) =>
                    [
                      "application/pdf",
                      "application/msword",
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Word
                      "application/vnd.ms-excel",
                      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Excel
                      "image/jpeg",
                      "image/png",
                      "image/jpg",
                    ].includes(file.type),
                  "Format harus PDF, Word, Excel, atau Gambar (JPG/PNG)",
                ),
        }),
      )
      .min(1, "Minimal harus ada 1 dokumen tambahan") // Menjamin list tidak kosong
      .max(10, "Maksimal 10 dokumen tambahan"),
  });

  const result = schema.safeParse(data);

  // Di file validation.ts
  if (!result.success) {
    const formattedErrors = result.error.format();

    return {
      isValid: false,
      // Error tingkat atas (judul, tanggal, kategori)
      errors: {
        judul: formattedErrors.judul?._errors[0],
        tanggal: formattedErrors.tanggal?._errors[0],
        kategori: formattedErrors.kategori?._errors[0],
        password_arsip: formattedErrors.password_arsip?._errors[0],
        // Error khusus array nama_dokumen
        attachments: formattedErrors.nama_dokumen, // ini akan berisi array of errors
      },
    };
  }

  return { isValid: true, errors: {} };
};
