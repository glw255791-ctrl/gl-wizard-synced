import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { supabase, supabaseAdmin } from "../../../api/api";
import {
  Column,
  UserData,
  ModalProps,
  SnackbarProps,
} from "../../../types";

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
  const [modalProps, setModalProps] = useState<ModalProps | undefined>(undefined);

  const navigate = useNavigate();

  // ----- Data Loading -----
  const loadData = async () => {
    setUserData([]);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*");

      if (error || !profiles) {
        setSnackbarProps({
          message: `Failed to load data. ${error?.message}`,
          severity: "error",
          open: true,
        });
        throw new Error();
      }

      const filtered = profiles
        .map(({ full_name, email, licence_valid_until, id, role }) => ({
          name: full_name,
          email,
          licencevaliduntil: licence_valid_until,
          id,
          role,
        }))
        .filter((item) => item.role !== "admin");

      setUserData(filtered);
    } catch (error) {
      console.warn(error);
    }
  };

  // ----- Licence Date Update -----
  const updateLicenceDate = async (id: string, newDate: Date) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ licence_valid_until: newDate.toISOString() })
        .eq("id", id);

      if (error) {
        setSnackbarProps({
          message: `Failed to update licence. ${error.message}`,
          severity: "error",
          open: true,
        });
        throw new Error();
      }

      setSnackbarProps({
        message: `Licence updated.`,
        severity: "success",
        open: true,
      });
    } catch (error) {
      console.warn(error);
    }
  };

  // ----- Invite User -----
  const signUpUser = async (email: string) => {
    try {
      const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${import.meta.env.VITE_BASE_URL}/register`,
      });

      if (error) {
        setSnackbarProps({
          message: `Failed to invite user. ${error.message}`,
          severity: "error",
          open: true,
        });
        throw new Error();
      }

      setSnackbarProps({
        message: `User ${email} invited.`,
        severity: "success",
        open: true,
      });
    } catch (error) {
      console.warn(error);
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
    navigate,
    updateLicenceDate,
    setModalProps,
    modalProps,
    onConfirm,
    snackbarProps,
    setSnackbarProps,
  };
}
