"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authorization");
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/landing");
    }
  }, [router]);

  return null;  
}


