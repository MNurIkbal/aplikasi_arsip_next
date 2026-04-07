"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Kita bungkus QueryClient dalam useState agar tidak ter-instansiasi ulang 
  // setiap kali ada perubahan state di aplikasi (penting untuk performa)
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // Data dianggap segar selama 1 menit
        retry: 1, // Coba ulang 1 kali jika fetch gagal
      },
    },
  }));

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Provider>
  );
}