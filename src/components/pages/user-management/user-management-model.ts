import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Column, UserData, ModalProps, SnackbarProps } from "../../../types";
import { supabaseBrowser } from "@/lib/supabase/browser-client";

// Re-export types for backward compatibility
export type { Column, UserData, ModalProps, SnackbarProps };

// ----- Hook -----
export function useUserManagementModel() {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [snackbarProps, setSnackbarProps] = useState<SnackbarProps>({
    message: "",
    severity: "",
    open: false,
  });
  const [modalProps, setModalProps] = useState<ModalProps | undefined>(
    undefined
  );

  const router = useRouter();

  const loadData = async () => {
    if (!supabaseBrowser) return;
    const session = await supabaseBrowser.auth.getSession();
    const res = await fetch("/api/users", {
      headers: {
        Authorization: `Bearer ${session.data.session?.access_token ?? ""}`,
      },
    });
    if (!res.ok) return;
    const data = await res.json();
    if (Array.isArray(data)) setUserData(data);
  };

  // ----- Licence Date Update -----
  const updateLicenceDate = async (id: string, date: Date) => {
    if (!supabaseBrowser) return;
    try {
      const session = await supabaseBrowser.auth.getSession();

      await fetch("/api/users/licence", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.data.session?.access_token}`,
        },
        body: JSON.stringify({ id, date: date.toISOString() }),
      });

      setSnackbarProps({
        message: `Licence updated.`,
        severity: "success",
        open: true,
      });
    } catch (error) {
      console.warn(error);
      setSnackbarProps({
        message: `Failed to update licence.`,
        severity: "error",
        open: true,
      });
    }
  };

  // ----- Invite User -----
  const signUpUser = async (email: string) => {
    if (!supabaseBrowser) return;
    try {
      const session = await supabaseBrowser.auth.getSession();

      await fetch("/api/users/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.data.session?.access_token}`,
        },
        body: JSON.stringify({ email }),
      });

      setSnackbarProps({
        message: `User ${email} invited.`,
        severity: "success",
        open: true,
      });
    } catch (error) {
      console.warn(error);
      setSnackbarProps({
        message: `Failed to invite user.`,
        severity: "error",
        open: true,
      });
    }
  };

  const authHeaders = async () => {
    const session = await supabaseBrowser!.auth.getSession();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.data.session?.access_token ?? ""}`,
    };
  };

  const resendAccess = async (email: string) => {
    if (!supabaseBrowser) return;
    try {
      const res = await fetch("/api/users/resend", {
        method: "POST",
        headers: await authHeaders(),
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to resend");
      setSnackbarProps({
        message: `Password reset email sent to ${email}.`,
        severity: "success",
        open: true,
      });
    } catch (error) {
      setSnackbarProps({
        message: error instanceof Error ? error.message : "Failed to resend.",
        severity: "error",
        open: true,
      });
    }
  };

  const setTemporaryPassword = async (id: string) => {
    if (!supabaseBrowser) return "";
    const res = await fetch("/api/users/password", {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify({ id }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Failed to set password");
    return String(data.password ?? "");
  };

  const deleteUser = async (id: string, email: string) => {
    if (!supabaseBrowser) return;
    try {
      const res = await fetch("/api/users", {
        method: "DELETE",
        headers: await authHeaders(),
        body: JSON.stringify({ id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to delete user");
      setSnackbarProps({
        message: `Deleted ${email}.`,
        severity: "success",
        open: true,
      });
    } catch (error) {
      setSnackbarProps({
        message: error instanceof Error ? error.message : "Failed to delete user.",
        severity: "error",
        open: true,
      });
    }
  };

  // ----- Table Columns -----
  const columns: Column[] = [
    { key: "name", label: "Name", flex: 1.2 },
    { key: "email", label: "E-mail", flex: 2 },
    {
      key: "licencevaliduntil",
      label: "Licence",
      width: 220,
      align: "right",
      flex: 1.4,
    },
    { key: "access", label: "Access", width: 150, align: "right", flex: 0.9 },
  ];

  // ----- User Data Filtering -----
  const filteredUserData = useMemo(() => {
    if (searchTerm === "") return userData;

    const lowered = searchTerm.toLowerCase();
    return userData.filter(
      (item) =>
        item.name.toLowerCase().includes(lowered) ||
        item.email.toLowerCase().includes(lowered)
    );
  }, [userData, searchTerm]);

  // ----- Confirm Button Handler -----
  const onConfirm = async () => {
    if (modalProps?.modalAction === "INVITE") {
      await signUpUser(modalProps.email);
    } else if (modalProps?.modalAction === "DELETE" && modalProps.id) {
      await deleteUser(modalProps.id, modalProps.email);
    } else {
      if (modalProps?.id && modalProps?.date) {
        await updateLicenceDate(modalProps.id, modalProps.date);
      }
    }
    setModalProps(undefined);
    await loadData();
  };

  // ----- API -----
  return {
    columns,
    filteredUserData,
    searchTerm,
    setSearchTerm,
    loadData,
    router,
    updateLicenceDate,
    setModalProps,
    modalProps,
    onConfirm,
    snackbarProps,
    setSnackbarProps,
    resendAccess,
    setTemporaryPassword,
    deleteUser,
  };
}
