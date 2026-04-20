"use client";

import Select from "react-select";
import {
  FileText, Eye, EyeOff, AlertCircle,
  Upload, Plus, Trash2, Lock, ShieldCheck, Globe,
  Calendar, FolderEdit
} from "lucide-react";
import { ArsipFormProps } from "@/app/types/GlobalType";
import { DOKUMEN_KHUSUS, DOKUMEN_RAHASIA, DOKUMEN_UMUM } from "@/app/types/Constant";
import { useArsipForm } from "@/app/hooks/ArsipForm";
import { confirmDelete, formatDate } from "@/app/utils/helper";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function ArsipForm({ initialData, onCancel }: ArsipFormProps) {

  const {
    formData,
    setFormData,
    additionalData,
    errors,
    showPassword,
    setShowPassword,
    addField,
    removeField,
    handleInputChange,
    handleFileChange,
    handlePreview,
    handleSubmit
  } = useArsipForm(initialData, onCancel);

  const router = useRouter();

  let params = Array.isArray(formData.params) ? formData.params : [];

  const kategoriOptions = [
    { value: DOKUMEN_UMUM, label: DOKUMEN_UMUM, icon: <Globe size={16} /> },
    { value: DOKUMEN_KHUSUS, label: DOKUMEN_KHUSUS, icon: <ShieldCheck size={16} /> },
    { value: DOKUMEN_RAHASIA, label: DOKUMEN_RAHASIA, icon: <Lock size={16} /> }
  ];

  const id = formData.id;
  

  const queryClient = useQueryClient();

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>

      {/* SECTION 1: INFORMASI UTAMA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <FolderEdit size={16} className="text-indigo-500" /> Judul Arsip <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            placeholder="Masukkan judul arsip..."
            className={`w-full px-4 py-2.5 bg-white border rounded-xl outline-none focus:ring-2 transition-all ${errors.judul ? "border-red-500 focus:ring-red-50" : "border-gray-200 focus:ring-indigo-500/20 focus:border-indigo-500"
              }`}
            value={formData.judul}
            onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
          />
          {errors.judul && <p className="text-[11px] text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.judul}</p>}
        </div>

        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <Calendar size={16} className="text-indigo-500" /> Tanggal Dokumen <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            value={formatDate(formData.tanggal)}

            onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
          />
          {errors.tanggal && <p className="text-[11px] text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.tanggal}</p>}
        </div>
      </div>

      {/* SECTION 2: KATEGORI & PASSWORD */}
      {initialData === null && (
        <div className="space-y-4">
        <div className="space-y-1">
          <label className="block text-sm font-bold text-gray-700">Kategori Dokumen <span className="text-red-600">*</span></label>
          <Select
            instanceId="kategori-arsip"
            options={kategoriOptions}
            value={kategoriOptions.find(opt => opt.value === formData.kategori)}
            onChange={(opt: any) => setFormData({ ...formData, kategori: opt?.value })}
            formatOptionLabel={(option) => (
              <div className="flex items-center gap-2">
                <span className="text-indigo-500">{option.icon}</span>
                <span className="font-medium text-sm">{option.label}</span>
              </div>
            )}
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "0.75rem",
                padding: "2px",
                borderColor: "#E5E7EB",
                boxShadow: "none",
                '&:hover': { borderColor: '#6366F1' }
              }),
            }}
          />
          {errors.kategori && <p className="text-[11px] text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.kategori}</p>}
        </div>

        {formData.kategori === "Dokumen Rahasia" && (
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 space-y-2 animate-in fade-in slide-in-from-top-2">
            <label className="block text-sm font-bold text-amber-800">Password Akses</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password pengaman..."
                className="w-full px-4 py-2.5 bg-white border border-amber-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20"
                value={formData.password_arsip}
                onChange={(e) => setFormData({ ...formData, password_arsip: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 hover:text-amber-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-[10px] text-amber-600 italic font-medium flex items-center gap-1">
              <Lock size={10} /> Password ini akan digunakan untuk enkripsi file rahasia.
            </p>
            {errors.password_arsip && <p className="text-[11px] text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.password_arsip}</p>}
          </div>
        )}
      </div>
      )}

      {/* SECTION 3: ADDITIONAL DATA (DYNAMIC) */}
      {initialData === null && (
        <fieldset className="border border-gray-200 p-5 rounded-2xl bg-gray-50/50 space-y-5">
          <div className="flex justify-between items-center border-b border-gray-200 pb-3">
            <div className="flex flex-col">
              <legend className="px-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                Additional Data
              </legend>
              <span className="px-2 text-[10px] text-indigo-500 font-semibold uppercase">
                {additionalData.length} / 10 Dokumen
              </span>
            </div>
            <button
              type="button"
              onClick={addField}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer ${additionalData.length >= 10
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100"
                }`}
              disabled={additionalData.length >= 10}
            >
              <Plus size={14} /> Tambah Data
            </button>
          </div>

          <div className="space-y-4">
            {additionalData.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-white p-4 rounded-xl border border-gray-200 shadow-sm transition-all hover:border-indigo-200"
              >
                <div className="md:col-span-5 space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">Nama Dokumen {index + 1}</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Contoh: Lampiran A, Surat Izin, dll..."
                      className="w-full pl-9 pr-3 py-2  border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                      value={item.nama_dokumen}
                      onChange={(e) => handleInputChange(item.id, e.target.value)}
                    />
                  </div>
                  {errors.attachments?.[index]?.nama_dokumen?._errors[0] && (
                    <p className="text-[10px] text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle size={10} /> {errors.attachments[index].nama_dokumen._errors[0]}
                    </p>
                  )}
                </div>


                <div className="md:col-span-5 spac-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">Upload File (Max 50MB)</label>
                  <label className={`flex items-center gap-2 w-full px-3 py-2 border-2 border-dashed rounded-lg cursor-pointer transition-all ${item.file ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-gray-50 border-gray-200 text-gray-500 hover:border-indigo-400 hover:bg-white"
                    }`}>
                    <Upload size={16} className={item.file ? "text-indigo-500" : "text-gray-400"} />
                    <span className="text-xs truncate font-medium">
                      {item.file ? item.file.name : "Pilih dokumen..."}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                      onChange={(e) => handleFileChange(item.id, e.target.files?.[0])}
                    />
                  </label>
                  {errors.attachments?.[index]?.file?._errors[0] && (
                    <p className="text-[10px] text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle size={10} /> {errors.attachments[index].file._errors[0]}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeField(item.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Hapus baris"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-[10px] text-gray-400 italic">
            <p>* Format: PDF, DOCX, XLSX, JPG, PNG (Max 50MB per file)</p>
            <p className={additionalData.length === 10 ? "text-red-500 font-bold" : ""}>
              {additionalData.length} / 10 Terpakai
            </p>
          </div>
        </fieldset>
      )}


      {params.length > 0 && (
        <fieldset className="border border-gray-200 p-5 rounded-2xl bg-gray-50/50 space-y-5">
          <div className="flex justify-between items-center border-b border-gray-200 pb-3">
            <div className="flex flex-col">
              <legend className="px-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                Dokumen File
              </legend>
            </div>
          </div>
          <div className="space-y-4">
            {params.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-white p-4 rounded-xl border border-gray-200 shadow-sm transition-all hover:border-indigo-200"
              >
                <div className="md:col-span-5 space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">Nama Dokumen {index + 1}</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input readOnly disabled
                      type="text"
                      placeholder="Contoh: Lampiran A, Surat Izin, dll..."
                      className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none
                        bg-gray-100 text-gray-500 cursor-not-allowed"
                      value={item.nama_dokumen}
                    />
                  </div>
                </div>


                <div className="md:col-span-5 spac-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase">Dokumen File</label>
                  <button
                    type="button"
                    onClick={() => handlePreview(item.file)}
                    disabled={!item.file}
                    className="w-10 h-10 cursor-pointer flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    title="Preview file"
                  >
                    <Eye size={18} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        </fieldset>
      )}


      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 active:scale-95 transition-all text-sm cursor-pointer"
        >
          Batal
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-95 transition-all text-sm cursor-pointer"
        >
          {initialData ? "Update" : "Simpan"}
        </button>
      </div>
    </form>
  );
}