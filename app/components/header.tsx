"use client";

import { useState, useRef, useEffect } from "react";
import { User, LogOut } from "lucide-react"; // Tambahkan icon LogOut agar lebih manis
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { logout } from "@/store/authSlice"; // Import action logout
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Menutup dropdown saat klik di luar area
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔥 Handler Logout dengan SweetAlert2
  const handleLogout = () => {
    setOpen(false); // Tutup dropdown dulu

    MySwal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda akan keluar dari sesi aplikasi ini.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5", // Indigo-600
      cancelButtonColor: "#ef4444", // Red-500
      confirmButtonText: "Ya, Logout!",
      cancelButtonText: "Batal",
      reverseButtons: true, // Tombol batal di kiri, logout di kanan
    }).then(async (result) => {
      if (result.isConfirmed) {
        // 1. Jalankan logout di Redux (menghapus user di state & cookie via API)
        dispatch(logout());

        // 2. Beri feedback sukses singkat
        await MySwal.fire({
          icon: "success",
          title: "Berhasil Keluar",
          text: "Sampai jumpa lagi!",
          timer: 1500,
          showConfirmButton: false,
        });

        // 3. Redirect ke halaman login
        router.push("/login");
      }
    });
  };

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center relative z-40">
      <div className="text-xl">
        
      </div>

      <div className="relative" ref={dropdownRef}>
        {/* Tombol Profil */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 p-1.5 rounded-full cursor-pointer hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
        >
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <User className="w-5 h-5" />
          </div>
          {/* Tampilkan Nama di sebelah icon (Opsional) */}
          <span className="hidden md:block text-sm font-medium text-gray-700 mr-2">
            {user?.name || "User"}
          </span>
        </button>

        {/* DROPDOWN MENU */}
        {open && (
          <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Header Dropdown */}
            <div className="px-5 py-4 bg-gray-50/50 border-b border-gray-100">
              <p className="text-sm font-bold text-gray-800 truncate">
                {user?.name || "Guest"}
              </p>
              <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider mt-0.5">
                {user?.role || "No Role"}
              </p>
            </div>

            {/* List Menu */}
            <div className="p-2">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full cursor-pointer text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors font-semibold"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}