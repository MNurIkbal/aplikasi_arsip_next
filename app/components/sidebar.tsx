"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, LayoutDashboard, Archive, Users } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Arsip", path: "/arsip", icon: Archive },
    { name: "Users", path: "/users", icon: Users },
  ];

  return (
    <>
      {/* 🔹 Toggle Button (Mobile) */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 cursor-pointer left-5 z-50 bg-indigo-600 text-white p-2 rounded-lg"
      >
        <Menu size={20} />
      </button>

      {/* 🔹 Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 🔹 Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-screen z-50
          w-64 bg-indigo-600 text-white p-5
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Aplikasi Arsip</h2>

          {/* Close button (mobile) */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden cursor-pointer"
          >
            <X />
          </button>
        </div>

        {/* Menu */}
        <nav className="space-y-2">
          {menu.map((item) => {
            const isActive = pathname.startsWith(item.path);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-white text-indigo-600"
                    : "hover:bg-indigo-500"
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}