import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginData } from "../../../../types";

// Re-export type for backward compatibility
export type { LoginData };
export function useLoginModel() {
  const router = useRouter();
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<LoginData & { rest: string }>({
    email: "",
    password: "",
    rest: "",
  });

  const onChangeField = (key: keyof LoginData, value: string) => {
    setFieldErrors((prev) => ({ ...prev, [key]: "", rest: "" }));
    setLoginData((prev) => ({ ...prev, [key]: value }));
  };

  const onLogin = async (filled?: { email?: string; password?: string }) => {
    const email = filled?.email || loginData.email;
    const password = filled?.password || loginData.password;

    if (email !== loginData.email || password !== loginData.password) {
      setLoginData({ email, password });
    }

    if (!email || !password) {
      setFieldErrors((prev) => ({
        ...prev,
        email: !email ? "Email required" : "",
        password: !password ? "Password required" : "",
      }));
      return;
    }

    try {
      setSubmitting(true);
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

      router.push("/dashboard");
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      setFieldErrors((prev) => ({
        ...prev,
        rest: error?.message || "Unknown error",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return {
    onLogin,
    submitting,
    setLoginData,
    router,
    loginData,
    fieldErrors,
    onChangeField,
  };
}
