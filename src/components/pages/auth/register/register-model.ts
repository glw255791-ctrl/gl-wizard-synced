/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/supabase-client";
import { RegisterData } from "@/types";

// Re-export type for backward compatibility
export type { RegisterData };
export function useRegisterModel() {
  const router = useRouter();
  const [registerData, setRegisterData] = useState<
    RegisterData & { rest: string }
  >({
    name: "",
    password: "",
    rest: "",
  });

  const [fieldErrors, setFieldErrors] = useState<RegisterData>({
    name: "",
    password: "",
  });

  const onChangeField = (key: keyof RegisterData, value: string) => {
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
    setRegisterData((prev) => ({ ...prev, [key]: value }));
  };

  const onRegister = async () => {
    try {
      const { name, password } = registerData;

      if (!name || !password) {
        setFieldErrors({
          name: !name ? "Name is required" : "",
          password: !password ? "Password is required" : "",
        });
        return;
      }

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!user || error) throw new Error("No authenticated user");

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          password,
          name,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      router.push("/registered");
    } catch (err: any) {
      setFieldErrors((p) => ({ ...p, rest: err.message }));
    }
  };

  return {
    router,
    onRegister,
    fieldErrors,
    registerData,
    onChangeField,
  };
}
