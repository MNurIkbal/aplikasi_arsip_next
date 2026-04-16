"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { useDebounce } from "use-debounce";

export const useArsip = (initialLimit = 10) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // 1. Ambil nilai dari URL atau gunakan default
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || initialLimit;
    const search = searchParams.get("search") || "";

    // 2. State lokal untuk input search (agar responsif saat mengetik)
    const [searchTerm, setSearchTerm] = useState(search);
    const [debouncedSearch] = useDebounce(searchTerm, 500);

    // 3. Sinkronisasi Search ke URL (Debounced)
    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (debouncedSearch) {
            params.set("search", debouncedSearch);
            params.set("page", "1"); // Reset ke page 1 saat cari data baru
        } else {
            params.delete("search");
        }

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    }, [debouncedSearch, pathname, router]);

    // 4. Handler untuk Pagination & Limit
    const setPage = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    const setLimit = (newLimit: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("limit", newLimit.toString());
        params.set("page", "1"); // Reset ke page 1 saat limit berubah
        router.push(`${pathname}?${params.toString()}`);
    };

    return {
        // State
        page,
        limit,
        searchTerm,
        isPending,
        setSearchTerm,
        setPage,
        setLimit,
    };
};