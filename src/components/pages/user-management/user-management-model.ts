import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Column, UserData, ModalProps, SnackbarProps } from "../../../types";
import { supabase } from "@/lib/supabase/supabase-client";

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
    const res = await fetch("/api/users");
    const data = await res.json();
    setUserData(data);
  };

  // ----- Licence Date Update -----
  const updateLicenceDate = async (id: string, date: Date) => {
    try {
      const session = await supabase.auth.getSession();

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
    try {
      const session = await supabase.auth.getSession();

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

  // ----- Table Columns -----
  const columns: Column[] = [
    { key: "name", label: "Name", flex: 3 },
    { key: "email", label: "E-mail", flex: 2 },
    {
      key: "licencevaliduntil",
      label: "Licence info",
      width: 200,
      align: "center",
      flex: 2,
    },
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
  };
}
