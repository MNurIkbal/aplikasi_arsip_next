"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "./loading";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie.includes("authToken");
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);

  return <Loading />;
}