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

    image: isEdit
      ? z.any().optional() 
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

export enum KategoriArsip {
  UMUM = "Dokumen Umum",
  KHUSUS = "Dokumen Khusus",
  RAHASIA = "Dokumen Rahasia",
}

export const validateArsip = (data: any, isEdit: boolean) => {
  const schema = z.object({
    judul: z.string().min(1, "Judul wajib diisi"),
    tanggal: z.string().min(1, "Tanggal wajib diisi"),
    
    // Jika edit, kategori boleh tidak diubah (optional)
    kategori: isEdit 
      ? z.nativeEnum(KategoriArsip).optional()
      : z.nativeEnum(KategoriArsip, {
          errorMap: () => ({ message: "Kategori wajib dipilih" }),
        }),

    password_arsip: z
      .string()
      .nullable()
      .optional()
      .refine(
        (val) => {
          // Jika edit, kita lewati validasi password kecuali user mengisi password baru
          if (isEdit) return true; 

          if (data.kategori === KategoriArsip.RAHASIA) {
            return val !== null && val !== undefined && val.length >= 6;
          }
          return true;
        },
        {
          message: "Password minimal 6 karakter wajib diisi untuk dokumen rahasia",
        }
      ),

    nama_dokumen: z
      .array(
        z.object({
          nama_dokumen: z.string().min(1, "Nama dokumen wajib diisi"),
          file: z.any()
            .optional()
            .refine((file) => {
              // Jika edit dan tidak ada file baru (misal user hanya ganti judul), ini valid
              if (isEdit && !file) return true;
              
              // Jika ini data baru (bukan edit) atau user mengupload file baru saat edit
              if (file instanceof File) {
                return file.size <= 50 * 1024 * 1024;
              }
              // Jika file sudah berupa string (url/path lama), ini valid
              return typeof file === 'string' || !!file; 
            }, "Ukuran file maksimal 50MB")
            .refine((file) => {
              if (isEdit && (!file || typeof file === 'string')) return true;
              if (file instanceof File) {
                return [
                  "application/pdf",
                  "application/msword",
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  "application/vnd.ms-excel",
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  "image/jpeg",
                  "image/png",
                  "image/jpg",
                ].includes(file.type);
              }
              return false;
            }, "Format harus PDF, Word, Excel, atau Gambar (JPG/PNG)"),
        })
      )
      // Jika edit, array boleh kosong atau tidak diubah
      .min(isEdit ? 0 : 1, "Minimal harus ada 1 dokumen tambahan")
      .max(10, "Maksimal 10 dokumen tambahan")
      .optional(),
  });

  // Persiapan data agar tidak terjadi error null pada refine
  const preparedData = {
    ...data,
    password_arsip: data.kategori === KategoriArsip.RAHASIA ? (data.password_arsip || null) : null,
  };

  const result = schema.safeParse(preparedData);

  if (!result.success) {
    const formattedErrors = result.error.format();
    return {
      isValid: false,
      errors: {
        judul: formattedErrors.judul?._errors[0],
        tanggal: formattedErrors.tanggal?._errors[0],
        kategori: formattedErrors.kategori?._errors[0],
        password_arsip: formattedErrors.password_arsip?._errors[0],
        attachments: formattedErrors.nama_dokumen,
      },
    };
  }

  return { isValid: true, errors: {}, data: result.data };
};