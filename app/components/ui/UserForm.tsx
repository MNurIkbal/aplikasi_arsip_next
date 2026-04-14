"use client";

import { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { Camera, Eye, EyeOff, AlertCircle, Image as ImageIcon } from "lucide-react";
import { validateUser } from "@/app/utils/validation";
import Swal from "sweetalert2";
import { UserService } from "@/app/services/fontend/Uservices";
import { useQueryClient } from "@tanstack/react-query";


interface UserFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function UserForm({ initialData, onSubmit, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    password: "",
    role: "Pegawai",
    image: null,
  });

  const [errors, setErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const roleOptions = [
    { value: "Pegawai", label: "Pegawai" },
    { value: "Admin", label: "Admin" },
  ];

  const queryClient = useQueryClient();


  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        password: ""
      });
      setImagePreview(initialData.image_url || null);
    } else {
      setFormData({ name: "", email: "", password: "", role: "Pegawai", image: null });
      setImagePreview(null);
    }
    setErrors({});
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });

      // Buat Preview
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);

      // Hapus error image jika ada
      if (errors.image) setErrors({ ...errors, image: null });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Jalankan validasi Zod (Client-side)
    const validation = validateUser(formData, !!initialData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return; // Stop jika tidak valid
    }

    // 2. Jika valid, bersihkan error dan tampilkan Loading
    setErrors({});

    Swal.fire({
      title: "Proses Menyimpan...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      let res;
      if (initialData?.id) {
        // Jika Anda punya service update
        const { name, image } = formData;
        res = await UserService.update(initialData.id, { name, image });
      } else {
        res = await UserService.create(formData);
      }
      const data = await res.json();

      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        // 3. Notifikasi Berhasil
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: data.message || "Data berhasil disimpan.",
          confirmButtonColor: "#6366F1",
          // Gunakan customClass untuk styling tambahan
          customClass: {
            popup: 'rounded-xl', // Jika kamu pakai Tailwind
          }
        });

        // Panggil fungsi refresh data atau tutup modal
        onCancel();
      } else {
        const errorData = await res.json();

        // 4. Notifikasi Gagal (Server Error)
        Swal.fire({
          icon: "error",
          title: "Gagal Menyimpan",
          text: errorData.message || "Terjadi kesalahan pada server.",
          confirmButtonColor: "#6366F1",
        });
      }
    } catch (err) {

      // 5. Notifikasi Error Koneksi
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Koneksi ke server terputus.",
        confirmButtonColor: "#6366F1",
      });
    }
  };

  const currentRoleValue = roleOptions.find((opt) => opt.value === formData.role) || roleOptions[0];

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>

      {/* SECTION: UPLOAD FOTO */}
      <div className="flex flex-col items-center justify-center pb-4">
        <label className="block text-sm font-bold text-gray-700 mb-3 text-center">Foto Profil 
          {!initialData && (
            <span className="text-red-600"> *</span>
          )}
        </label>
        <div
          className={`relative w-28 h-28 rounded-3xl border-2 border-dashed flex items-center justify-center overflow-hidden group cursor-pointer transition-all ${errors.image ? "border-red-500 bg-red-50" : "border-gray-200 bg-white hover:border-indigo-400"
            }`}
          onClick={() => fileInputRef.current?.click()}
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-2">
              <ImageIcon className={`w-8 h-8 mx-auto mb-1 ${errors.image ? "text-red-400" : "text-gray-400"}`} />
              <p className={`text-[10px] font-semibold ${errors.image ? "text-red-500" : "text-gray-400"}`}>
                Klik untuk Upload
              </p>
            </div>
          )}

          {/* Overlay Hover */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-7 h-7 text-white" />
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />

        {errors.image ? (
          <p className="text-xs text-red-500 mt-2 font-medium">{errors.image}</p>
        ) : (
          <p className="text-[11px] text-gray-400 mt-2 text-center leading-tight">
            JPG, PNG, atau JPEG. <br />Maksimal 2MB.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* INPUT: NAMA */}
        <div className="space-y-1">
          <label className="block text-sm font-bold text-gray-700">Nama Lengkap <span className="text-red-600">*</span></label>
          <input
            placeholder="Masukkan nama lengkap..."
            className={`w-full px-4 py-2.5 bg-white border rounded-xl outline-none focus:ring-2 transition-all ${errors.name ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-indigo-500/20 focus:border-indigo-500"
              }`}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {errors.name && (
            <p className="text-[11px] text-red-500 flex items-center gap-1 font-medium">
              <AlertCircle size={12} /> {errors.name}
            </p>
          )}
        </div>

        {/* INPUT: EMAIL */}
        <div className="space-y-1">
          <label className="block text-sm font-bold text-gray-700">Email <span className="text-red-600">*</span></label>
          <input
            type="email"
            placeholder="Email pengguna..."
            className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 transition-all ${
              // Kondisi 1: Jika ada initialData (Mode Edit), kasih BG Abu-abu dan kursor dilarang
              initialData
                ? "bg-gray-100 border-gray-200 cursor-not-allowed text-gray-500"
                : "bg-white"
              } ${
              // Kondisi 2: Logika Error
              errors.email
                ? "border-red-500 focus:ring-red-100"
                : "border-gray-200 focus:ring-indigo-500/20 focus:border-indigo-500"
              }`}
            readOnly={!!initialData} // Email tidak bisa diubah saat edit
            disabled={!!initialData} // Tambahkan disabled untuk mencegah interaksi

            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {errors.email && (
            <p className="text-[11px] text-red-500 flex items-center gap-1 font-medium">
              <AlertCircle size={12} /> {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* INPUT: PASSWORD */}
      {!initialData && (
        <div className="space-y-1">
          <label className="block text-sm font-bold text-gray-700">Password <span className="text-red-600">*</span></label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 bg-white border rounded-xl outline-none focus:ring-2 transition-all ${errors.password ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-indigo-500/20 focus:border-indigo-500"
                }`}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password ? (
            <p className="text-[11px] text-red-500 flex items-center gap-1 font-medium mt-1">
              <AlertCircle size={12} /> {errors.password}
            </p>
          ) : initialData ? (
            <p className="text-[10px] text-gray-400 mt-1 italic">*Kosongkan jika tidak ingin ganti password</p>
          ) : null}
        </div>
      )}

      {/* INPUT: ROLE DENGAN PENCARIAN */}

      <div className="space-y-1 relative">
        <label className="block text-sm font-bold text-gray-700">Role Pengguna <span className="text-red-600">*</span></label>
        <Select
          instanceId="user-role-selection"
          options={roleOptions}
          value={currentRoleValue} // Ini akan otomatis terisi saat initialData masuk ke formData
          isDisabled={!!initialData} // Terkunci jika sedang edit
          onChange={(opt: any) => setFormData({ ...formData, role: opt?.value })}
          placeholder="Cari & Pilih Role..."
          isSearchable={true}
          menuPortalTarget={typeof window !== "undefined" ? document.body : null}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            control: (base, state) => ({
              ...base,
              borderRadius: "0.75rem",
              // DINAMIS: Jika disabled, kasih warna abu-abu (bg-gray-100)
              backgroundColor: state.isDisabled ? "#F3F4F6" : "white",
              borderColor: errors.role ? "#EF4444" : state.isFocused ? "#6366F1" : "#E5E7EB",
              boxShadow: state.isFocused ? "0 0 0 2px rgba(99, 102, 241, 0.1)" : "none",
              padding: "2px",
              "&:hover": { borderColor: state.isDisabled ? "#E5E7EB" : "#6366F1" },
              cursor: state.isDisabled ? "not-allowed" : "pointer",
            }),
            // Mengatur warna teks saat disabled agar tidak terlalu pudar
            singleValue: (base, state) => ({
              ...base,
              color: state.isDisabled ? "#6B7280" : "#111827",
            }),
          }}
        />
        {errors.role && (
          <p className="text-[11px] text-red-500 flex items-center gap-1 font-medium mt-1">
            <AlertCircle size={12} /> {errors.role}
          </p>
        )}
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 cursor-pointer px-4 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all active:scale-95 text-sm"
        >
          Batal
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-3 bg-indigo-600 text-white cursor-pointer rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95 text-sm"
        >
          {initialData ? "Update" : "Simpan"}
        </button>
      </div>
    </form>
  );
}