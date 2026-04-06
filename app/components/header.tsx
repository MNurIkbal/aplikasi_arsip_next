"use client";

import { useState, useRef, useEffect } from "react";
import { User } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // 🔥 handler logout
  const handleLogout = () => {
    // contoh:
    // localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center relative">
      <div className="text-xl"></div>

      <div className="relative" ref={dropdownRef}>
        {/* ICON USER */}
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-full cursor-pointer hover:bg-gray-100"
        >
          <User className="w-6 h-6 text-gray-700" />
        </button>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute right-0 mt-3 w-48 bg-white border rounded-xl shadow-lg z-50">
            <div className="px-4 py-3 border-b">
              <p className="text-sm font-semibold text-gray-800">
                Admin
              </p>
              <p className="text-xs text-gray-500">
                Super Admin
              </p>
            </div>

            <div className="p-2">
              <button
                onClick={handleLogout}
                className="block w-full cursor-pointer text-left px-4 py-2 text-sm text-red-500 hover:bg-red-100 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}