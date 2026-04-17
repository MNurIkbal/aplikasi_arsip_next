"use client";

import { useState, useRef, useEffect } from "react";
import { User, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { logout } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Image from "next/image";

const MySwal = withReactContent(Swal);

export default function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // 🔥 State untuk menangani hydration
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Pastikan komponen sudah mounted di Client
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. Menutup dropdown saat klik di luar area
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

  const handleLogout = () => {
    setOpen(false);

    MySwal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda akan keluar dari sesi aplikasi ini.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Ya, Logout!",
      cancelButtonText: "Batal",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        await MySwal.fire({
          icon: "success",
          title: "Berhasil Keluar",
          text: "Sampai jumpa lagi!",
          timer: 1500,
          showConfirmButton: false,
        });
        router.push("/login");
      }
    });
  };

  // Tampilkan placeholder atau null saat proses SSR agar match dengan server
  // Ini mencegah error "Text content did not match"
  const displayName = mounted ? (user?.name || "User") : "User";
  const displayRole = mounted ? (user?.role || "No Role") : "No Role";
  const displayImage = mounted ? (user?.image || null) : null;

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center relative z-40">
      <div className="text-xl"></div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 p-1.5 rounded-full cursor-pointer hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200" >
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <Image
            src={ '/' + displayImage || '/uploads/1775881364762-user.png'}
            alt="User Image"
            width={60}
            height={60}
            className="rounded-full object-cover"
          />
          </div>
          
          {/* Gunakan variabel displayName yang sudah diproteksi mounted state */}
          <span className="hidden md:block text-sm font-medium text-gray-700 mr-2">
            {displayName}
          </span>
        </button>

        {open && (
          <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="px-5 py-4 bg-gray-50/50 border-b border-gray-100">
              <p className="text-sm font-bold text-gray-800 truncate">
                {displayName}
              </p>
              <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider mt-0.5">
                {displayRole}
              </p>
            </div>

            <div className="p-2">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full cursor-pointer text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-100 rounded-xl transition-colors font-semibold"
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