"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useMutation } from "@tanstack/react-query";
import { mutate } from "swr";
import { createArsip } from "@/app/services/fontend/ArsipService";
import { validateArsip } from "@/app/utils/validation";
import { FieldArsip, parseJSON } from "@/app/utils/helper";

export const useArsipForm = (initialData: any, onCancel: () => void) => {

    const [formData, setFormData] = useState<FieldArsip>({
        judul: "",
        tanggal: "",
        kategori: "",
        password_arsip: "",
        params: []
    });

    const [additionalData, setAdditionalData] = useState([
        { id: Date.now(), nama_dokumen: "", file: null as File | null }
    ]);

    const [errors, setErrors] = useState<any>({});
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                judul: initialData.judul || "",
                tanggal: initialData.tanggal || new Date().toISOString().split("T")[0],
                kategori: initialData.kategori || "",
                password_arsip: initialData.password_arsip || "",
                params: parseJSON(initialData.params) || [],
            });
        }
    }, [initialData]);

    const params = Array.isArray(formData.params) ? formData.params : [];

    const addField = () => {
        if (additionalData.length >= 10) {
            Swal.fire("Batas Maksimal", "Max 10 dokumen", "warning");
            return;
        }

        setAdditionalData([
            ...additionalData,
            { id: Date.now(), nama_dokumen: "", file: null }
        ]);
    };

    const removeField = (id: number) => {
        if (additionalData.length <= 1) return;

        setAdditionalData(additionalData.filter(i => i.id !== id));
    };

    const handleInputChange = (id: number, value: string) => {
        setAdditionalData(additionalData.map(i =>
            i.id === id ? { ...i, nama_dokumen: value } : i
        ));
    };

    const handleFileChange = (id: number, file?: File) => {
        if (!file) return;

        if (file.size > 50 * 1024 * 1024) {
            Swal.fire("File terlalu besar", "Max 50MB", "error");
            return;
        }

        setAdditionalData(additionalData.map(i =>
            i.id === id ? { ...i, file } : i
        ));
    };

    const handlePreview = (file?: File | string | null) => {
        if (!file) return;

        if (file instanceof File) {
            const url = URL.createObjectURL(file);
            window.open(url, "_blank");
            return;
        }

        if (typeof file === "string") {
            const url = "/uploads/" + file;
            window.open(url, "_blank");
        }
    };

    const mutation = useMutation({
        mutationFn: createArsip,
        onSuccess: async () => {
            await mutate((key) => Array.isArray(key) && key[0] === "/api/arsip");
            Swal.fire("Berhasil", "Data arsip disimpan", "success");
            onCancel();
        },
        onError: (err: any) => {
            Swal.fire("Error", err.message, "error");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...formData,
            nama_dokumen: additionalData
        };

        const validation = validateArsip(payload, !!initialData);

        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setErrors({});

        Swal.fire({
            title: "Menyimpan...",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        mutation.mutate({
            ...formData,
            attachments: additionalData
        });
    };

    return {
        formData,
        setFormData,
        additionalData,
        errors,
        showPassword,
        setShowPassword,
        params,
        handleInputChange,
        handleFileChange,
        handlePreview,
        addField,
        removeField,
        handleSubmit
    };
};