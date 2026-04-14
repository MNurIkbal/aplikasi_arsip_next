"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export default function BaseModal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = "md"
}: BaseModalProps) {
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    "2xl": "max-w-6xl",
    full: "max-w-[95vw]",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Container Modal */}
      <div 
        className={`relative bg-white rounded-3xl shadow-2xl w-full ${sizeClasses[size]} 
          flex flex-col 
          /* --- PENAMBAHAN KRITIKAL DI SINI --- */
          max-h-[90vh] 
          /* ---------------------------------- */
          overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-300`}
      >
        {/* Header - Tetap (Sticky karena flex flex-col) */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0 bg-white z-10">
          <h3 className="text-xl font-extrabold text-gray-800 tracking-tight">{title}</h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-2xl transition-all active:scale-90 cursor-pointer"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Body - Area Scrollable */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}