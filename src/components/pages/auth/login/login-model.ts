import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginData } from "../../../../types";
import { supabase } from "@/lib/supabase/supabase-client";

// Re-export type for backward compatibility
export type { LoginData };
export function useLoginModel() {
  const router = useRouter();
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState<LoginData & { rest: string }>({
    email: "",
    password: "",
    rest: "",
  });

  const onChangeField = (key: keyof LoginData, value: string) => {
    setFieldErrors((prev) => ({ ...prev, [key]: "", rest: "" }));
    setLoginData((prev) => ({ ...prev, [key]: value }));
  };

  const onLogin = async () => {
    const { email, password } = loginData;

    if (!email || !password) {
      setFieldErrors((prev) => ({
        ...prev,
        email: !email ? "Email required" : "",
        password: !password ? "Password required" : "",
      }));
      return;
    }

    try {
      // call serverless endpoint
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setFieldErrors((prev) => ({ ...prev, rest: data.error }));
        return;
      }

      // set the session in Supabase client (writes to localStorage)
      if (data.session) {
        await supabase.auth.setSession(data.session);
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      setFieldErrors((prev) => ({
        ...prev,
        rest: error?.message || "Unknown error",
      }));
    }
  };

  return {
    onLogin,
    setLoginData,
    router,
    loginData,
    fieldErrors,
    onChangeField,
  };
}
