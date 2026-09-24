/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser-client";
import { RegisterData } from "@/types";

// Re-export type for backward compatibility
export type { RegisterData };

async function ensureInviteSession() {
  if (!supabaseBrowser) return false;

  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const accessToken = hash.get("access_token");
  const refreshToken = hash.get("refresh_token");
  if (accessToken && refreshToken) {
    const { error } = await supabaseBrowser.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    if (error) throw error;
    window.history.replaceState(null, "", "/register");
    return true;
  }

  const search = new URLSearchParams(window.location.search);
  const code = search.get("code");
  if (code) {
    const { error } = await supabaseBrowser.auth.exchangeCodeForSession(code);
    if (error) throw error;
    window.history.replaceState(null, "", "/register");
    return true;
  }

  const tokenHash = search.get("token_hash") || search.get("token");
  if (tokenHash) {
    const type = search.get("type") === "signup" ? "signup" : "invite";
    const { error } = await supabaseBrowser.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });
    if (error) throw error;
    window.history.replaceState(null, "", "/register");
    return true;
  }

  const {
    data: { session },
  } = await supabaseBrowser.auth.getSession();
  return Boolean(session);
}

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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    ensureInviteSession()
      .then((ok) => {
        setReady(ok);
        if (!ok) {
          setFieldErrors((prev) => ({
            ...prev,
            rest: "Open the invite link again. This page has no sign-in session.",
          }));
        }
      })
      .catch((err: unknown) => {
        setFieldErrors((prev) => ({
          ...prev,
          rest: err instanceof Error ? err.message : "Could not open the invite link.",
        }));
      });
  }, []);

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

      const signedIn = ready || (await ensureInviteSession());
      if (!signedIn) throw new Error("No authenticated user");

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
    ready,
  };
}
