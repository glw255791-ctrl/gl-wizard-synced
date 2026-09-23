/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser-client";
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
  const [submitting, setSubmitting] = useState(false);

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

      setSubmitting(true);

      if (!supabaseBrowser) throw new Error("Supabase is not configured");

      const {
        data: { session },
        error,
      } = await supabaseBrowser.auth.getSession();

      if (!session || error) throw new Error("No authenticated user");

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          password,
          name,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      router.push("/registered");
    } catch (err: any) {
      setFieldErrors((p) => ({ ...p, rest: err.message }));
      setSubmitting(false);
    }
  };

  return {
    router,
    onRegister,
    fieldErrors,
    registerData,
    onChangeField,
    submitting,
  };
}
