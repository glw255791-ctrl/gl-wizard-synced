import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { supabase, supabaseAdmin } from "../../../api/api";

export interface Column {
  key: string;
  label: string;
  width?: number;
  flex?: number;
  align?: "center" | "left" | "right" | "justify" | "inherit";
}

export interface UserData {
  name: string;
  licencevaliduntil: string;
  email: string;
  id: string;
  role: string
}

export interface ModalProps {
  modalAction: "EXTEND" | "DEACTIVATE" | "INVITE";
  date: Date;
  id: string;
  email: string;
}

export interface SnackbarProps {
  message: string;
  severity: "error" | "success" | "warning" | "";
  open: boolean;
}
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

  const navigate = useNavigate();

  const loadData = async () => {
    setUserData([]);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        return;
      }
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*");
      if (error || !profiles) {
        setSnackbarProps({
          message: `Failed to load data. ${error.message}`,
          severity: "error",
          open: true,
        });
        throw new Error();
      }
      setUserData(
        profiles.map(({ full_name, email, licence_valid_until, id, role }) => ({
          name: full_name,
          email,
          licencevaliduntil: licence_valid_until,
          id,
          role,
        }))
      );
    } catch (error) {
      console.warn(error);
    }
  };

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

  async function signUpUser(email: string) {
    try {
      const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, { redirectTo: `${import.meta.env.VITE_BASE_URL}/register` });
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
  }

  const columns: Column[] = [
    {
      key: "name",
      label: "Name",
      flex: 3,
    },
    {
      key: "email",
      label: "E-mail",
      flex: 2,
    },
    {
      key: "licencevaliduntil",
      label: "Licence info",
      width: 200,
      align: "center",
      flex: 2
    },
  ];

  const filteredUserData = useMemo(() => {
    if (searchTerm === "") return userData;

    return userData.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [userData, searchTerm]);

  const onConfirm = async () => {
    if (modalProps?.modalAction === "INVITE") {
      await signUpUser(modalProps.email);

    } else {
      if (modalProps?.id && modalProps?.date)
        await updateLicenceDate(modalProps?.id, modalProps?.date);

    }
    setModalProps(undefined);
    await loadData();
  };
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
