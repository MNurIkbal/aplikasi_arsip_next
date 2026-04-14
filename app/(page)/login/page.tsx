"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "@/store/authSlice"; // Pastikan clearError sudah ada di authSlice
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/store";
import { loginSchema } from "@/app/utils/validation";

// SweetAlert2 Setup
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Link from "next/link";

const MySwal = withReactContent(Swal);

type FormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Ambil state dari Redux
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  // 1. Bersihkan error Redux saat halaman pertama kali dibuka
  // Agar alert error lama tidak muncul otomatis saat user kembali ke page login
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // 2. Munculkan SweetAlert jika ada error saat proses login
  useEffect(() => {
    if (error) {
      MySwal.fire({
        icon: "error",
        title: "Login Gagal",
        text: error,
        confirmButtonColor: "#4f46e5", // Indigo-600
        confirmButtonText: "Coba Lagi",
        showClass: {
          popup: "animate__animated animate__fadeInUp animate__faster",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutDown animate__faster",
        },
      });
    }
  }, [error]);

  const onSubmit = async (data: FormData) => {
    const result = await dispatch(loginUser(data));

    // 3. Jika login berhasil
    if (loginUser.fulfilled.match(result)) {
      const user = result.payload.user; // Data user dari session/API

      // Berikan notifikasi sukses dengan nama user
      await MySwal.fire({
        icon: "success",
        title: "Login Berhasil!",
        html: `Selamat datang, <b>${user.name}</b>!<br>Mengalihkan ke dashboard...`,
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      
      // Pindah ke dashboard
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md transform transition-all">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Login
          </h1>
          <p className="text-gray-500 mt-2">Silakan masuk ke akun Anda</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 ml-1">Email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="nama@email.com"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition-all ${
                errors.email ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
            <input
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition-all ${
                errors.password ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full cursor-pointer py-3.5 font-bold text-white rounded-xl transition-all shadow-lg active:scale-95 ${
              loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Memproses...</span>
              </div>
            ) : (
              "Masuk Sekarang"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Belum Punya Akun? <span className="text-indigo-600 cursor-pointer hover:underline font-medium"><Link href="/register">Daftar</Link></span>
          </p>
        </div>
      </div>
    </div>
  );
}