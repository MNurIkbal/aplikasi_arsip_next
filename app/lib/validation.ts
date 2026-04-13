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
    role: isEdit ? z.string().optional().or(z.literal("")) : z.string().min(1, "Role wajib dipilih"),
    
    // VALIDASI FOTO
    image: isEdit
      ? z.any().optional() // Saat edit, jika tidak ganti foto tidak apa-apa
      : z.instanceof(File, { message: "Foto wajib diunggah" })
          .refine((file) => file.size <= 5000000, "Ukuran maksimal 5MB")
          .refine(
            (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
            "Format harus JPG atau PNG"
          ),
  });

  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return {
      isValid: false,
      errors: Object.fromEntries(
        Object.entries(errors).map(([key, value]) => [key, value?.[0]])
      ),
    };
  }

  return { isValid: true, errors: {} };
};